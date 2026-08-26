import { prisma } from "@/lib/prisma";
import type { Order, OrderItem, Product } from "@prisma/client";

const API_URL = "https://api.tiny.com.br/api2/pedido.incluir.php";

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
        codigo: item.product?.tinySku || undefined,
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
    pedido: JSON.stringify(pedido),
  });

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const data = await res.json();
  const registro = data?.retorno?.registros?.[0]?.registro;

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
