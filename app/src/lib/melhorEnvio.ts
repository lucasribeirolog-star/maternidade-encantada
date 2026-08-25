type ShippingProduct = {
  weightGrams: number;
  heightCm: number;
  widthCm: number;
  lengthCm: number;
  quantity: number;
  priceCents: number;
};

export type ShippingOption = {
  id: string;
  name: string;
  company: string;
  priceCents: number;
  deliveryDays: number | null;
};

const BASE_URL = () =>
  process.env.MELHOR_ENVIO_SANDBOX === "false"
    ? "https://melhorenvio.com.br/api/v2"
    : "https://sandbox.melhorenvio.com.br/api/v2";

export class MelhorEnvioNotConfiguredError extends Error {
  constructor() {
    super("Melhor Envio não configurado (defina MELHOR_ENVIO_TOKEN no .env).");
    this.name = "MelhorEnvioNotConfiguredError";
  }
}

export async function calculateShipping(
  destinationZip: string,
  products: ShippingProduct[]
): Promise<ShippingOption[]> {
  const token = process.env.MELHOR_ENVIO_TOKEN;
  const fromZip = process.env.MELHOR_ENVIO_FROM_ZIP;
  if (!token || !fromZip) {
    throw new MelhorEnvioNotConfiguredError();
  }

  const cleanDestination = destinationZip.replace(/\D/g, "");
  if (cleanDestination.length !== 8) {
    throw new Error("CEP de destino inválido.");
  }

  const totalWeightKg =
    products.reduce((sum, p) => sum + (p.weightGrams * p.quantity) / 1000, 0) || 0.3;
  const maxHeight = Math.max(2, ...products.map((p) => p.heightCm));
  const maxWidth = Math.max(11, ...products.map((p) => p.widthCm));
  const maxLength = Math.max(16, ...products.map((p) => p.lengthCm));
  const insuranceValue =
    products.reduce((sum, p) => sum + (p.priceCents * p.quantity) / 100, 0) || 0;

  const res = await fetch(`${BASE_URL()}/me/shipment/calculate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      "User-Agent": "Maternidade Encantada (contato@maternidadeencantada.com.br)",
    },
    body: JSON.stringify({
      from: { postal_code: fromZip },
      to: { postal_code: cleanDestination },
      package: {
        height: maxHeight,
        width: maxWidth,
        length: maxLength,
        weight: totalWeightKg,
      },
      options: { insurance_value: insuranceValue, receipt: false, own_hand: false },
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Erro ao consultar frete (Melhor Envio): ${res.status}`);
  }

  const data = await res.json();

  return (Array.isArray(data) ? data : [])
    .filter((option) => !option.error)
    .map((option) => ({
      id: String(option.id),
      name: option.name,
      company: option.company?.name ?? "",
      priceCents: Math.round(parseFloat(option.price) * 100),
      deliveryDays: option.delivery_time ?? null,
    }));
}
