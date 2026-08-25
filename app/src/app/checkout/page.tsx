import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getCartWithItems, cartTotals } from "@/lib/cart";
import { formatCents } from "@/lib/money";
import { CheckoutForm } from "@/components/CheckoutForm";

export const metadata: Metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  const cart = await getCartWithItems();
  const items = cart?.items ?? [];
  if (items.length === 0) redirect("/carrinho");

  const { subtotalCents } = cartTotals(cart);

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="mb-10 text-3xl font-semibold">Finalizar compra</h1>
      <div className="grid gap-12 md:grid-cols-[1.4fr_1fr]">
        <CheckoutForm />

        <aside className="h-fit rounded-2xl bg-cream-2 p-6">
          <h2 className="font-display text-lg font-semibold">Resumo do pedido</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {items.map((item) => (
              <li key={item.id} className="flex justify-between text-ink-soft">
                <span>
                  {item.quantity}× {item.product.name}
                </span>
                <span>{formatCents(item.product.priceCents * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex justify-between border-t border-line pt-4 font-display text-lg font-semibold">
            <span>Subtotal</span>
            <span>{formatCents(subtotalCents)}</span>
          </div>
          <p className="mt-1 text-xs text-ink-soft">+ frete calculado ao lado</p>
        </aside>
      </div>
    </div>
  );
}
