"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ensureCart } from "@/lib/cart";

// Cada boneca é uma peça artesanal única — no máximo 1 unidade por pedido.
const MAX_QTY_PER_PRODUCT = 1;

export async function addToCart(productId: string) {
  const cart = await ensureCart();

  await prisma.cartItem.upsert({
    where: { cartId_productId: { cartId: cart.id, productId } },
    update: { quantity: MAX_QTY_PER_PRODUCT },
    create: { cartId: cart.id, productId, quantity: MAX_QTY_PER_PRODUCT },
  });

  revalidatePath("/carrinho");
  revalidatePath("/", "layout");
}

export async function addToCartFormAction(formData: FormData) {
  const productId = String(formData.get("productId") ?? "");
  if (!productId) return;
  await addToCart(productId);
  redirect("/carrinho");
}

export async function removeCartItem(itemId: string) {
  await prisma.cartItem.delete({ where: { id: itemId } }).catch(() => {});
  revalidatePath("/carrinho");
  revalidatePath("/", "layout");
}
