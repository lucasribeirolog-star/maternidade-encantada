import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import { prisma } from "./prisma";

const CART_COOKIE = "cart_token";

export async function getCartToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(CART_COOKIE)?.value ?? null;
}

export async function getOrCreateCartToken(): Promise<string> {
  const store = await cookies();
  const existing = store.get(CART_COOKIE)?.value;
  if (existing) return existing;

  const token = randomUUID();
  store.set(CART_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 60,
    path: "/",
  });
  return token;
}

export async function getCartWithItems() {
  const token = await getCartToken();
  if (!token) return null;

  return prisma.cart.findUnique({
    where: { token },
    include: {
      items: {
        include: { product: { include: { images: true } } },
        orderBy: { id: "asc" },
      },
    },
  });
}

export async function ensureCart() {
  const token = await getOrCreateCartToken();
  return prisma.cart.upsert({
    where: { token },
    update: {},
    create: { token },
  });
}

export function cartTotals(
  cart: { items: { quantity: number; product: { priceCents: number } }[] } | null
) {
  if (!cart) return { subtotalCents: 0, itemCount: 0 };
  const subtotalCents = cart.items.reduce(
    (sum, item) => sum + item.quantity * item.product.priceCents,
    0
  );
  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  return { subtotalCents, itemCount };
}
