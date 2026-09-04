import { prisma } from "@/lib/prisma";
import { sendTrackingEmail } from "@/lib/email";
import type { Order, OrderItem, Product } from "@prisma/client";

const API_URL = "https://api.tiny.com.br/api2/pedido.incluir.php";
const STOCK_URL = "https://api.tiny.com.br/api2/produto.obter.estoque.php";
const PEDIDO_URL = "https://api.tiny.com.br/api2/pedido.obter.php";
const PESQUISA_URL = "https://api.tiny.com.br/api2/produtos.pesquisa.php";
const INCLUIR_PRODUTO_URL = "https://api.tiny.com.br/api2/produto.incluir.php";

export class TinyNotConfiguredError extends Error {
  constructor() {
    super("Tiny não configurado (defina TINY_API_TOKEN no .env).");
    this.name = "TinyNotConfiguredError";
  }
}

export function isTinyConfigured() {
  return Boolean(process.env.TINY_API_TOKEN);
}

type OrderWithItems = Order & { items: (OrderItem & { product: Product | null })[] };

export async function createTinyOrder(order: OrderWithItems) {
  const token = process.env.TINY_API_TOKEN;
  if (!token) throw new TinyNotConfiguredError();

  const document = order.customerDocument.replace(/\D/g, "");

  const pedido = {
    data_pedido: formatDateBr(order.createdAt),
    valor_frete: (order.shippingCostCents / 100).toFixed(2),
    cliente: {
      nome: order.customerName,
      cpf_cnpj: document,
      endereco: order.shippingStreet,
      numero: order.shippingNumber,
      complemento: order.shippingComplement || undefined,
      bairro: order.shippingNeighborhood,
      cep: order.shippingZip,
      cidade: order.shippingCity,
      uf: order.shippingState,
      fone: order.customerPhone,
      email: order.customerEmail,
    },
    itens: order.items.map((item) => ({
      item: {
        id_produto: item.product?.tinyProductId || undefined,
        descricao: item.nameSnapshot,
        unidade: "UN",
        quantidade: item.quantity,
        valor_unitario: (item.priceCentsSnapshot / 100).toFixed(2),
      },
    })),
  };

  const body = new URLSearchParams({
    token,
    formato: "JSON",
    pedido: JSON.stringify({ pedido }),
  });

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const data = await res.json();
  const registrosRaw = data?.retorno?.registros;
  const registro = Array.isArray(registrosRaw) ? registrosRaw[0]?.registro : registrosRaw?.registro;

  if (data?.retorno?.status !== "OK" || !registro || registro.status !== "OK") {
    const erros = registro?.erros?.map((e: { erro: string }) => e.erro).join("; ");
    throw new Error(erros || data?.retorno?.erros?.[0]?.erro || "Erro ao criar pedido no Tiny.");
  }

  await prisma.order.update({
    where: { id: order.id },
    data: {
      tinyOrderId: registro.id ? Number(registro.id) : null,
      tinyOrderNumber: registro.numero ? String(registro.numero) : null,
      tinySyncError: null,
    },
  });

  return registro;
}

/** Consulta o saldo em estoque de um produto no Tiny. Retorna null se não for possível consultar. */
export async function getTinyStock(tinyProductId: number): Promise<number | null> {
  const token = process.env.TINY_API_TOKEN;
  if (!token) return null;

  const body = new URLSearchParams({ token, formato: "JSON", id: String(tinyProductId) });
  const res = await fetch(STOCK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const data = await res.json();
  if (data?.retorno?.status !== "OK") return null;
  const saldo = data?.retorno?.produto?.saldo;
  return typeof saldo === "number" ? saldo : null;
}

/**
 * Verifica o estoque atual no Tiny para os itens informados. Lança um erro
 * listando os itens sem estoque (por nome) caso algum esteja esgotado.
 * Produtos sem vínculo com o Tiny (tinyProductId nulo) são sempre considerados disponíveis.
 */
export async function assertItemsInStock(
  items: { productId: string; name: string; tinyProductId: number | null }[]
) {
  if (!isTinyConfigured()) return;

  const outOfStockNames: string[] = [];

  for (const item of items) {
    if (!item.tinyProductId) continue;
    const saldo = await getTinyStock(item.tinyProductId);
    if (saldo === null) continue; // não foi possível confirmar — não bloqueia a compra
    await prisma.product.update({
      where: { id: item.productId },
      data: { outOfStock: saldo <= 0, stockSyncedAt: new Date() },
    });
    if (saldo <= 0) outOfStockNames.push(item.name);
  }

  if (outOfStockNames.length > 0) {
    const plural = outOfStockNames.length > 1;
    throw new Error(
      `${outOfStockNames.join(", ")} ${plural ? "foram vendidas" : "foi vendida"} e não ${
        plural ? "estão mais disponíveis" : "está mais disponível"
      }. Remova do carrinho para continuar.`
    );
  }
}

/** Sincroniza o estoque de todos os produtos vinculados ao Tiny (chamado periodicamente). */
export async function syncAllProductStock() {
  if (!isTinyConfigured()) return { checked: 0, outOfStock: 0 };

  const products = await prisma.product.findMany({
    where: { tinyProductId: { not: null } },
    select: { id: true, tinyProductId: true },
  });

  let outOfStock = 0;
  for (const product of products) {
    const saldo = await getTinyStock(product.tinyProductId!);
    if (saldo === null) continue;
    const isOut = saldo <= 0;
    if (isOut) outOfStock++;
    await prisma.product.update({
      where: { id: product.id },
      data: { outOfStock: isOut, stockSyncedAt: new Date() },
    });
    await new Promise((resolve) => setTimeout(resolve, 350)); // evita rate limit da API do Tiny
  }

  return { checked: products.length, outOfStock };
}

/**
 * Verifica se pedidos pagos e sincronizados com o Tiny já ganharam código de
 * rastreamento (etiqueta emitida). Quando encontra, salva no pedido e dispara
 * o e-mail de rastreio pro cliente. Chamado periodicamente (cron).
 */
export async function syncOrderTracking() {
  if (!isTinyConfigured()) return { checked: 0, updated: 0 };

  const token = process.env.TINY_API_TOKEN!;
  const orders = await prisma.order.findMany({
    where: {
      status: "paid",
      tinyOrderId: { not: null },
      trackingCode: null,
    },
    include: { items: true },
  });

  let updated = 0;
  for (const order of orders) {
    const body = new URLSearchParams({ token, formato: "JSON", id: String(order.tinyOrderId) });
    const res = await fetch(PEDIDO_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    const data = await res.json();
    const trackingCode: string | null = data?.retorno?.pedido?.codigo_rastreamento || null;

    if (trackingCode) {
      const updatedOrder = await prisma.order.update({
        where: { id: order.id },
        data: { trackingCode },
        include: { items: true },
      });
      await sendTrackingEmail(updatedOrder);
      updated++;
    }

    await new Promise((resolve) => setTimeout(resolve, 350)); // evita rate limit da API do Tiny
  }

  return { checked: orders.length, updated };
}

export type TinyProductMatch = { id: number; codigo: string; nome: string; situacao: string };

/**
 * Busca produtos no Tiny cujo código (SKU) bate exatamente com o informado.
 * A busca do Tiny é por texto (nome ou código, parcial) — aqui filtramos
 * só os resultados com código idêntico, pra evitar vincular ao produto errado.
 */
export async function searchTinyProductsByCode(codigo: string): Promise<TinyProductMatch[]> {
  const token = process.env.TINY_API_TOKEN;
  if (!token || !codigo.trim()) return [];

  const body = new URLSearchParams({ token, formato: "JSON", pesquisa: codigo.trim() });
  const res = await fetch(PESQUISA_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const data = await res.json();
  const produtos = data?.retorno?.produtos;
  if (!Array.isArray(produtos)) return [];

  return produtos
    .map((item: { produto: { id: string; codigo: string; nome: string; situacao: string } }) => item.produto)
    .filter((p) => p.codigo === codigo.trim())
    .map((p) => ({ id: Number(p.id), codigo: p.codigo, nome: p.nome, situacao: p.situacao }));
}

/** Cria um produto novo diretamente no Tiny (usado quando o produto ainda não existe lá). */
export async function createTinyProduct(input: {
  name: string;
  priceCents: number;
}): Promise<{ id: number; codigo: string }> {
  const token = process.env.TINY_API_TOKEN;
  if (!token) throw new TinyNotConfiguredError();

  const produto = {
    sequencia: "1",
    nome: input.name,
    unidade: "UN",
    preco: (input.priceCents / 100).toFixed(2),
    situacao: "A",
    tipo: "P",
    origem: "0",
  };

  const body = new URLSearchParams({
    token,
    formato: "JSON",
    produto: JSON.stringify({ produtos: [{ produto }] }),
  });

  const res = await fetch(INCLUIR_PRODUTO_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const data = await res.json();
  const registrosRaw = data?.retorno?.registros;
  const registro = Array.isArray(registrosRaw) ? registrosRaw[0]?.registro : registrosRaw?.registro;

  if (data?.retorno?.status !== "OK" || !registro || registro.status !== "OK") {
    const erros = registro?.erros?.map((e: { erro: string }) => e.erro).join("; ");
    throw new Error(erros || "Erro ao criar produto no Tiny.");
  }

  const newId = Number(registro.id);

  // o Tiny não devolve o código (SKU) gerado na resposta de inclusão — busca o produto pra pegar
  const obterBody = new URLSearchParams({ token, formato: "JSON", id: String(newId) });
  const obterRes = await fetch("https://api.tiny.com.br/api2/produto.obter.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: obterBody,
  });
  const obterData = await obterRes.json();
  const codigo = obterData?.retorno?.produto?.codigo ?? "";

  return { id: newId, codigo: String(codigo) };
}

function formatDateBr(date: Date) {
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${d}/${m}/${date.getFullYear()}`;
}

export async function syncOrderToTiny(orderId: string) {
  if (!isTinyConfigured()) return;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { product: true } } },
  });
  if (!order || order.tinyOrderId) return;

  try {
    await createTinyOrder(order);
  } catch (err) {
    console.error("Erro ao sincronizar pedido com o Tiny:", err);
    await prisma.order.update({
      where: { id: order.id },
      data: { tinySyncError: err instanceof Error ? err.message : "Erro desconhecido" },
    });
  }
}
