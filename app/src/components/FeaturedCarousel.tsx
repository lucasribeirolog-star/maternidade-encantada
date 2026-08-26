import Image from "next/image";
import Link from "next/link";
import { dictionaries, LOCALE_PATHS, type Locale } from "@/lib/i18n";

type Product = {
  id: string;
  slug: string;
  name: string;
  priceCents: number;
  compareAtPriceCents: number | null;
  images: { url: string; alt: string }[];
};

export function FeaturedCarousel({
  products,
  locale = "pt",
}: {
  products: Product[];
  locale?: Locale;
}) {
  if (products.length === 0) return null;

  const t = dictionaries[locale].showcase;
  const base = LOCALE_PATHS[locale] === "/" ? "" : LOCALE_PATHS[locale];
  const track = [...products, ...products];

  return (
    <div className="w-full overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
      <div className="marquee-track flex w-max gap-6">
        {track.map((product, i) => {
          const image = product.images[0];
          return (
            <Link
              key={`${product.id}-${i}`}
              href={`${base}/produtos/${product.slug}`}
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
                <div className="mt-1 flex items-center gap-1 text-sm font-semibold text-rose-deep">
                  {t.viewOffer}
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2 transition-transform group-hover:translate-x-0.5">
                    <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
