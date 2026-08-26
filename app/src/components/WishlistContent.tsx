"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ProductCard } from "./ProductCard";
import { getWishlist, subscribeWishlist } from "@/lib/wishlist";
import { dictionaries, LOCALE_PATHS, type Locale } from "@/lib/i18n";
import { btnClass } from "@/lib/ui";

type Product = {
  id: string;
  slug: string;
  name: string;
  priceCents: number;
  compareAtPriceCents: number | null;
  rating: number;
  reviewCount: number;
  images: { url: string; alt: string }[];
};

export function WishlistContent({ locale = "pt" }: { locale?: Locale }) {
  const t = dictionaries[locale].wishlist;
  const base = LOCALE_PATHS[locale] === "/" ? "" : LOCALE_PATHS[locale];
  const [products, setProducts] = useState<Product[] | null>(null);

  useEffect(() => {
    async function load() {
      const ids = getWishlist();
      if (ids.length === 0) {
        setProducts([]);
        return;
      }
      const res = await fetch(`/api/wishlist?ids=${ids.join(",")}`);
      const data = await res.json();
      setProducts(data.products ?? []);
    }
    load();
    return subscribeWishlist(load);
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-3xl font-semibold">{t.title}</h1>

      {products === null && <p className="mt-8 text-ink-soft">…</p>}

      {products !== null && products.length === 0 && (
        <div className="mt-10 text-center">
          <p className="text-ink-soft">{t.empty}</p>
          <Link href={`${base}/produtos`} className={`${btnClass("primary")} mt-6`}>
            {t.emptyCta}
          </Link>
        </div>
      )}

      {products && products.length > 0 && (
        <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
