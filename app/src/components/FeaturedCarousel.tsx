import Image from "next/image";
import Link from "next/link";
import { formatCents } from "@/lib/money";

type Product = {
  id: string;
  slug: string;
  name: string;
  priceCents: number;
  compareAtPriceCents: number | null;
  images: { url: string; alt: string }[];
};

export function FeaturedCarousel({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  const track = [...products, ...products];

  return (
    <div className="w-full overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
      <div className="marquee-track flex w-max gap-6">
        {track.map((product, i) => {
          const image = product.images[0];
          return (
            <Link
              key={`${product.id}-${i}`}
              href={`/produtos/${product.slug}`}
              className="group block w-56 shrink-0 overflow-hidden rounded-2xl bg-white shadow-[0_20px_40px_-28px_rgba(62,39,35,0.35)] sm:w-64"
            >
              <div className="aspect-square overflow-hidden bg-cream-2">
                {image && (
                  <Image
                    src={image.url}
                    alt={image.alt || product.name}
                    width={400}
                    height={400}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
              </div>
              <div className="p-4">
                <h3 className="font-display text-base font-semibold">{product.name}</h3>
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
        })}
      </div>
    </div>
  );
}
