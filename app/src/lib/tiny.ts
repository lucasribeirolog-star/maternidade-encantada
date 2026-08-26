import { prisma } from "@/lib/prisma";
import type { Order, OrderItem, Product } from "@prisma/client";

const AUTH_URL = "https://accounts.tiny.com.br/realms/tiny/protocol/openid-connect/auth";
const TOKEN_URL = "https://accounts.tiny.com.br/realms/tiny/protocol/openid-connect/token";
const API_BASE = "https://erp.tiny.com.br/public-api/v3";

export class TinyNotConfiguredError extends Error {
  constructor() {
    super("Tiny não configurado (defina TINY_CLIENT_ID e TINY_CLIENT_SECRET no .env).");
    this.name = "TinyNotConfiguredError";
  }
}

export function isTinyConfigured() {
  return Boolean(process.env.TINY_CLIENT_ID && process.env.TINY_CLIENT_SECRET);
}

function requireEnv() {
  const clientId = process.env.TINY_CLIENT_ID;
  const clientSecret = process.env.TINY_CLIENT_SECRET;
  const redirectUri = process.env.TINY_REDIRECT_URI;
  if (!clientId || !clientSecret || !redirectUri) throw new TinyNotConfiguredError();
  return { clientId, clientSecret, redirectUri };
}

export function getTinyAuthUrl(state: string) {
  const { clientId, redirectUri } = requireEnv();
  const url = new URL(AUTH_URL);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("state", state);
  return url.toString();
}

async function tokenRequest(body: URLSearchParams) {
  const { clientId, clientSecret } = requireEnv();
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${basic}`,
    },
    body,
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error_description || data?.error || "Erro ao autenticar com o Tiny.");
  }
  return data as { access_token: string; refresh_token: string; expires_in: number };
}

export async function exchangeTinyCode(code: string) {
  const { redirectUri } = requireEnv();
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,
  });
  const tokens = await tokenRequest(body);
  await saveTinyTokens(tokens);
  return tokens;
}

async function saveTinyTokens(tokens: { access_token: string; refresh_token: string; expires_in: number }) {
  const expiresAt = new Date(Date.now() + tokens.expires_in * 1000 - 60_000);
  await prisma.tinyIntegration.upsert({
    where: { id: "singleton" },
    create: {
      id: "singleton",
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt,
    },
    update: {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt,
    },
  });
}

export async function isTinyConnected() {
  const row = await prisma.tinyIntegration.findUnique({ where: { id: "singleton" } });
  return Boolean(row);
}

async function getValidAccessToken(): Promise<string> {
  const row = await prisma.tinyIntegration.findUnique({ where: { id: "singleton" } });
  if (!row) throw new Error("Tiny ainda não foi conectado (faça isso no painel admin).");

  if (row.expiresAt.getTime() > Date.now()) return row.accessToken;

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: row.refreshToken,
  });
  const tokens = await tokenRequest(body);
  await saveTinyTokens(tokens);
  return tokens.access_token;
}

async function tinyFetch(path: string, init: RequestInit = {}) {
  const accessToken = await getValidAccessToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      ...init.headers,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Erro na API do Tiny (${res.status}): ${text.slice(0, 300)}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export async function listTinyVendedores() {
  const data = await tinyFetch("/vendedores");
  return (data?.itens ?? data) as { id: number; nome: string }[];
}

export async function listTinyDepositos() {
  const data = await tinyFetch("/depositos");
  return (data?.itens ?? data) as { id: number; nome: string }[];
}

async function findOrCreateTinyContato(order: Order): Promise<number> {
  const document = order.customerDocument.replace(/\D/g, "");
  const search = await tinyFetch(`/contatos?cpfCnpj=${document}`);
  const existing = search?.itens?.[0];
  if (existing?.id) return existing.id;

  const created = await tinyFetch("/contatos", {
    method: "POST",
    body: JSON.stringify({
      nome: order.customerName,
      codigo: document,
      fantasia: order.customerName,
      tipoPessoa: document.length > 11 ? "J" : "F",
      cpfCnpj: document,
      email: order.customerEmail,
      fone: order.customerPhone,
      endereco: {
        endereco: order.shippingStreet,
        numero: order.shippingNumber,
        complemento: order.shippingComplement || undefined,
        bairro: order.shippingNeighborhood,
        municipio: order.shippingCity,
        uf: order.shippingState,
        cep: order.shippingZip,
      },
    }),
  });
  return created.id;
}

type OrderWithItems = Order & { items: (OrderItem & { product: Product | null })[] };

export async function createTinyOrder(order: OrderWithItems) {
  const integration = await prisma.tinyIntegration.findUnique({ where: { id: "singleton" } });
  if (!integration) throw new Error("Tiny ainda não foi conectado.");
  if (!integration.vendedorId || !integration.depositoId) {
    throw new Error("Configure o vendedor e o depósito do Tiny no painel admin antes de sincronizar pedidos.");
  }

  const itemsWithSku = order.items.filter((item) => item.product?.tinyProductId);
  if (itemsWithSku.length === 0) {
    throw new Error("Nenhum item deste pedido tem um produto vinculado ao Tiny (defina o código Tiny em cada produto).");
  }

  const idContato = await findOrCreateTinyContato(order);

  const payload = {
    idContato,
    vendedor: { id: integration.vendedorId },
    deposito: { id: integration.depositoId },
    situacao: 3, // Aprovada
    valorFrete: order.shippingCostCents / 100,
    enderecoEntrega: {
      nomeDestinatario: order.customerName,
      cpfCnpj: order.customerDocument.replace(/\D/g, ""),
      endereco: order.shippingStreet,
      numero: order.shippingNumber,
      complemento: order.shippingComplement || undefined,
      bairro: order.shippingNeighborhood,
      municipio: order.shippingCity,
      uf: order.shippingState,
      cep: order.shippingZip,
      fone: order.customerPhone,
    },
    itens: itemsWithSku.map((item) => ({
      produto: { id: item.product!.tinyProductId },
      quantidade: item.quantity,
      valorUnitario: item.priceCentsSnapshot / 100,
    })),
  };

  const created = await tinyFetch("/pedidos", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  await prisma.order.update({
    where: { id: order.id },
    data: {
      tinyOrderId: created.id,
      tinyOrderNumber: created.numeroPedido ? String(created.numeroPedido) : null,
      tinySyncError: null,
    },
  });

  return created;
}

export async function syncOrderToTiny(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { product: true } } },
  });
  if (!order) return;
  if (!isTinyConfigured()) return;
  if (!(await isTinyConnected())) return;
  if (order.tinyOrderId) return;

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
