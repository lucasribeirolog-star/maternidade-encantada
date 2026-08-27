"use server";

import { prisma } from "@/lib/prisma";
import { getCartWithItems, cartTotals } from "@/lib/cart";
import { calculateShipping, MelhorEnvioNotConfiguredError, type ShippingOption } from "@/lib/melhorEnvio";
import { assertItemsInStock } from "@/lib/tiny";

export type ShippingLookupResult =
  | { ok: true; options: ShippingOption[] }
  | { ok: false; error: string; configured: boolean };

export async function lookupShipping(zip: string): Promise<ShippingLookupResult> {
  const cart = await getCartWithItems();
  const items = cart?.items ?? [];
  if (items.length === 0) {
    return { ok: false, error: "Seu carrinho está vazio.", configured: true };
  }

  try {
    const options = await calculateShipping(
      zip,
      items.map((item) => ({
        weightGrams: item.product.weightGrams,
        heightCm: item.product.heightCm,
        widthCm: item.product.widthCm,
        lengthCm: item.product.lengthCm,
        quantity: item.quantity,
        priceCents: item.product.priceCents,
      }))
    );
    if (options.length === 0) {
      return { ok: false, error: "Nenhuma opção de frete encontrada para esse CEP.", configured: true };
    }
    return { ok: true, options };
  } catch (err) {
    if (err instanceof MelhorEnvioNotConfiguredError) {
      return { ok: false, error: err.message, configured: false };
    }
    return { ok: false, error: err instanceof Error ? err.message : "Erro ao calcular frete.", configured: true };
  }
}

export type CreateOrderInput = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerDocument: string;
  shippingZip: string;
  shippingStreet: string;
  shippingNumber: string;
  shippingComplement: string;
  shippingNeighborhood: string;
  shippingCity: string;
  shippingState: string;
  shippingMethodName: string;
  shippingCostCents: number;
};

export async function createOrder(input: CreateOrderInput) {
  const cart = await getCartWithItems();
  const items = cart?.items ?? [];
  if (items.length === 0) {
    throw new Error("Carrinho vazio.");
  }

  await assertItemsInStock(
    items.map((item) => ({
      productId: item.productId,
      name: item.product.name,
      tinyProductId: item.product.tinyProductId,
    }))
  );

  const { subtotalCents } = cartTotals(cart);
  const totalCents = subtotalCents + input.shippingCostCents;
  const orderNumber = `ME${Date.now().toString().slice(-8)}`;

  const order = await prisma.order.create({
    data: {
      orderNumber,
      customerName: input.customerName,
      customerEmail: input.customerEmail,
      customerPhone: input.customerPhone,
      customerDocument: input.customerDocument,
      shippingZip: input.shippingZip,
      shippingStreet: input.shippingStreet,
      shippingNumber: input.shippingNumber,
      shippingComplement: input.shippingComplement,
      shippingNeighborhood: input.shippingNeighborhood,
      shippingCity: input.shippingCity,
      shippingState: input.shippingState,
      shippingMethod: input.shippingMethodName,
      shippingCostCents: input.shippingCostCents,
      subtotalCents,
      totalCents,
      items: {
        create: items.map((item) => ({
          productId: item.productId,
          nameSnapshot: item.product.name,
          priceCentsSnapshot: item.product.priceCents,
          quantity: item.quantity,
        })),
      },
    },
  });

  return order.id;
}
