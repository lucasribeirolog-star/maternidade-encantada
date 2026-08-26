"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ensureCart } from "@/lib/cart";

export async function addToCart(productId: string, quantity: number = 1) {
  const cart = await ensureCart();

  await prisma.cartItem.upsert({
    where: { cartId_productId: { cartId: cart.id, productId } },
    update: { quantity: { increment: quantity } },
    create: { cartId: cart.id, productId, quantity },
  });

  revalidatePath("/carrinho");
  revalidatePath("/", "layout");
}

export async function addToCartFormAction(formData: FormData) {
  const productId = String(formData.get("productId") ?? "");
  const quantity = Math.max(1, Number(formData.get("quantity") ?? 1));
  if (!productId) return;
  await addToCart(productId, quantity);
  redirect("/carrinho");
}

export async function updateCartItemQuantity(itemId: string, quantity: number) {
  if (quantity <= 0) {
    await prisma.cartItem.delete({ where: { id: itemId } }).catch(() => {});
  } else {
    await prisma.cartItem.update({ where: { id: itemId }, data: { quantity } });
  }
  revalidatePath("/carrinho");
  revalidatePath("/", "layout");
}

export async function removeCartItem(itemId: string) {
  await prisma.cartItem.delete({ where: { id: itemId } }).catch(() => {});
  revalidatePath("/carrinho");
  revalidatePath("/", "layout");
}
