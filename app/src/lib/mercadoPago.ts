export class MercadoPagoNotConfiguredError extends Error {
  constructor() {
    super("Mercado Pago não configurado (defina MERCADOPAGO_ACCESS_TOKEN no .env).");
    this.name = "MercadoPagoNotConfiguredError";
  }
}

export function isMercadoPagoConfigured() {
  return Boolean(process.env.MERCADOPAGO_ACCESS_TOKEN);
}

export function isMelhorEnvioConfigured() {
  return Boolean(process.env.MELHOR_ENVIO_TOKEN && process.env.MELHOR_ENVIO_FROM_ZIP);
}

type CreatePaymentInput = {
  orderId: string;
  orderNumber: string;
  totalCents: number;
  payerEmail: string;
  payerFirstName: string;
  payerLastName: string;
  payerDocument: string;
  paymentToken?: string;
  paymentMethodId?: string;
  installments?: number;
  issuerId?: string;
};

export async function createMercadoPagoPayment(input: CreatePaymentInput) {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!accessToken) throw new MercadoPagoNotConfiguredError();

  const body: Record<string, unknown> = {
    transaction_amount: Number((input.totalCents / 100).toFixed(2)),
    description: `Pedido ${input.orderNumber} — Maternidade Encantada`,
    payment_method_id: input.paymentMethodId,
    token: input.paymentToken,
    installments: input.installments ?? 1,
    payer: {
      email: input.payerEmail,
      first_name: input.payerFirstName,
      last_name: input.payerLastName,
      identification: { type: "CPF", number: input.payerDocument.replace(/\D/g, "") },
    },
    external_reference: input.orderId,
    notification_url: process.env.MERCADOPAGO_WEBHOOK_URL,
    ...(input.issuerId ? { issuer_id: input.issuerId } : {}),
  };

  const res = await fetch("https://api.mercadopago.com/v1/payments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "X-Idempotency-Key": `${input.orderId}-${Date.now()}`,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || `Erro ao criar pagamento (Mercado Pago): ${res.status}`);
  }
  return data as { id: number; status: string; status_detail: string };
}

export async function getMercadoPagoPayment(paymentId: string) {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!accessToken) throw new MercadoPagoNotConfiguredError();

  const res = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Erro ao consultar pagamento: ${res.status}`);
  return res.json() as Promise<{ id: number; status: string; external_reference: string }>;
}
