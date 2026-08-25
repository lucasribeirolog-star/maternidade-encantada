import Link from "next/link";
import type { Metadata } from "next";
import { getCartWithItems, cartTotals } from "@/lib/cart";
import { formatCents } from "@/lib/money";
import { btnClass } from "@/lib/ui";
import { CartItemRow } from "@/components/CartItemRow";

export const metadata: Metadata = { title: "Carrinho" };

export default async function CarrinhoPage() {
  const cart = await getCartWithItems();
  const { subtotalCents } = cartTotals(cart);
  const items = cart?.items ?? [];

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-semibold">Seu carrinho</h1>

      {items.length === 0 ? (
        <div className="mt-10 text-center">
          <p className="text-ink-soft">Seu carrinho está vazio.</p>
          <Link href="/produtos" className={`${btnClass("primary")} mt-6`}>
            Ver bonecas
          </Link>
        </div>
      ) : (
        <div className="mt-10">
          <div>
            {items.map((item) => (
              <CartItemRow key={item.id} item={item} />
            ))}
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-line pt-6">
            <span className="text-ink-soft">Subtotal</span>
            <span className="font-display text-2xl font-semibold text-wine">
              {formatCents(subtotalCents)}
            </span>
          </div>
          <p className="mt-1 text-right text-xs text-ink-soft">
            Frete calculado no próximo passo
          </p>

          <div className="mt-8 flex flex-col-reverse gap-4 sm:flex-row sm:justify-between">
            <Link href="/produtos" className={btnClass("outline")}>
              Continuar comprando
            </Link>
            <Link href="/checkout" className={btnClass("primary")}>
              Ir para o checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
