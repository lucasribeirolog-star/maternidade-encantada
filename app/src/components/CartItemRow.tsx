"use client";

import { useRef, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatCents } from "@/lib/money";
import { updateCartItemQuantity, removeCartItem } from "@/app/actions/cart";

type Props = {
  item: {
    id: string;
    quantity: number;
    product: {
      slug: string;
      name: string;
      priceCents: number;
      images: { url: string; alt: string }[];
    };
  };
};

export function CartItemRow({ item }: Props) {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const image = item.product.images[0];

  return (
    <div className="flex items-center gap-5 border-b border-line py-6 last:border-0">
      <Link
        href={`/produtos/${item.product.slug}`}
        className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-cream-2"
      >
        {image && (
          <Image
            src={image.url}
            alt={image.alt || item.product.name}
            width={200}
            height={200}
            className="h-full w-full object-cover"
          />
        )}
      </Link>

      <div className="flex-1">
        <Link href={`/produtos/${item.product.slug}`} className="font-display font-semibold">
          {item.product.name}
        </Link>
        <p className="mt-1 text-sm text-ink-soft">{formatCents(item.product.priceCents)}</p>

        <form
          ref={formRef}
          className="mt-3 flex items-center gap-3"
          action={(formData) =>
            startTransition(async () => {
              await updateCartItemQuantity(item.id, Number(formData.get("quantity")));
            })
          }
        >
          <select
            name="quantity"
            defaultValue={item.quantity}
            disabled={isPending}
            onChange={() => formRef.current?.requestSubmit()}
            className="rounded-full border border-line bg-white px-3 py-2 text-sm"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <button
            type="button"
            disabled={isPending}
            onClick={() => startTransition(() => removeCartItem(item.id))}
            className="text-xs text-ink-soft underline hover:text-rose-deep"
          >
            Remover
          </button>
        </form>
      </div>

      <div className="font-display text-base font-semibold">
        {formatCents(item.product.priceCents * item.quantity)}
      </div>
    </div>
  );
}
