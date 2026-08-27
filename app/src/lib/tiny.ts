import { prisma } from "@/lib/prisma";
import type { Order, OrderItem, Product } from "@prisma/client";

const API_URL = "https://api.tiny.com.br/api2/pedido.incluir.php";
const STOCK_URL = "https://api.tiny.com.br/api2/produto.obter.estoque.php";

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
