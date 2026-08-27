import Image from "next/image";
import Link from "next/link";
import { formatCents } from "@/lib/money";
import { LOCALE_PATHS, type Locale } from "@/lib/i18n";
import { StarRating } from "./StarRating";
import { WishlistButton } from "./WishlistButton";

type ProductCardData = {
  id: string;
  slug: string;
  name: string;
  priceCents: number;
  compareAtPriceCents: number | null;
  rating: number;
  reviewCount: number;
  outOfStock?: boolean;
  images: { url: string; alt: string }[];
};

export function ProductCard({
  product,
  locale = "pt",
}: {
  product: ProductCardData;
  locale?: Locale;
}) {
  const image = product.images[0];
  const base = LOCALE_PATHS[locale] === "/" ? "" : LOCALE_PATHS[locale];

  return (
    <Link
      href={`${base}/produtos/${product.slug}`}
      className="group relative block overflow-hidden rounded-2xl bg-white shadow-[0_20px_40px_-28px_rgba(62,39,35,0.35)]"
    >
      <WishlistButton
        productId={product.id}
        className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink-soft shadow hover:text-rose"
      />
      <div className="relative aspect-square overflow-hidden bg-cream-2">
        {image ? (
          <Image
            src={image.url}
            alt={image.alt || product.name}
            width={600}
            height={600}
            className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
              product.outOfStock ? "grayscale" : ""
            }`}
          />
        ) : (
          <div className="h-full w-full" />
        )}
        {product.outOfStock && (
          <span className="absolute left-3 top-3 rounded-full bg-ink/80 px-3 py-1 text-xs font-medium text-white">
            Esgotado
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-display text-base font-semibold">{product.name}</h3>
        <div className="mt-1">
          <StarRating
            rating={product.rating}
            count={product.reviewCount > 0 ? `(${product.reviewCount})` : undefined}
          />
        </div>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-sm text-wine">{formatCents(product.priceCents)}</span>
          {product.compareAtPriceCents && (
            <span className="text-xs text-ink-soft line-through">
              {formatCents(product.compareAtPriceCents)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
