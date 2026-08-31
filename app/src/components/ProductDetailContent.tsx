import { formatCents } from "@/lib/money";
import { btnClass } from "@/lib/ui";
import { addToCartFormAction } from "@/app/actions/cart";
import { dictionaries, LOCALE_PATHS, type Locale } from "@/lib/i18n";
import { SITE_URL } from "@/lib/seo";
import { ProductGallery } from "./ProductGallery";
import { StarRating } from "./StarRating";
import { WishlistButton } from "./WishlistButton";
import { SecurityBadges } from "./SecurityBadges";

type ProductDetail = {
  id: string;
  slug: string;
  name: string;
  description: string;
  priceCents: number;
  compareAtPriceCents: number | null;
  weightGrams: number;
  heightCm: number;
  widthCm: number;
  lengthCm: number;
  active: boolean;
  outOfStock: boolean;
  rating: number;
  reviewCount: number;
  images: { url: string; alt: string }[];
  category: { name: string } | null;
};

const BASE_URL = SITE_URL;

const LOCALE_TAG: Record<Locale, string> = { pt: "pt-BR", en: "en-US", es: "es-ES" };

export function ProductDetailContent({
  locale,
  product,
}: {
  locale: Locale;
  product: ProductDetail;
}) {
  const t = dictionaries[locale].productDetail;
  const localeBase = LOCALE_PATHS[locale] === "/" ? "" : LOCALE_PATHS[locale];
  const productUrl = `${BASE_URL}${localeBase}/produtos/${product.slug}`;
  const productsUrl = `${BASE_URL}${localeBase}/produtos`;

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <script
        type="application/ld+json"

        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            description: product.description,
            sku: product.id,
            image: product.images.map((img) =>
              img.url.startsWith("http") ? img.url : `${BASE_URL}${img.url}`
            ),
            url: productUrl,
            brand: { "@type": "Brand", name: "Maternidade Encantada" },
            offers: {
              "@type": "Offer",
              url: productUrl,
              priceCurrency: "BRL",
              price: (product.priceCents / 100).toFixed(2),
              availability:
                product.active && !product.outOfStock
                  ? "https://schema.org/InStock"
                  : "https://schema.org/OutOfStock",
              seller: { "@type": "Organization", name: "Maternidade Encantada" },
            },
            ...(product.reviewCount > 0
              ? {
                  aggregateRating: {
                    "@type": "AggregateRating",
                    ratingValue: product.rating,
                    reviewCount: product.reviewCount,
                  },
                }
              : {}),
          }),
        }}
      />
      <script
        type="application/ld+json"

        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Maternidade Encantada", item: `${BASE_URL}${localeBase}` },
              { "@type": "ListItem", position: 2, name: product.category?.name ?? "Bonecas", item: productsUrl },
              { "@type": "ListItem", position: 3, name: product.name, item: productUrl },
            ],
          }),
        }}
      />
      <div className="grid gap-14 md:grid-cols-2">
        <ProductGallery images={product.images} productName={product.name} />
        <div>
          <div className="flex items-start justify-between gap-4">
            <div>
              {product.category && (
                <span className="mb-2 block text-xs tracking-[0.16em] uppercase text-rose-deep">
                  {product.category.name}
                </span>
              )}
              <h1 className="text-3xl font-semibold">{product.name}</h1>
            </div>
            <WishlistButton
              productId={product.id}
              className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cream-2 text-ink-soft hover:text-rose"
            />
          </div>
          <div className="mt-2">
            <StarRating
              rating={product.rating}
              count={
                product.reviewCount > 0
                  ? `(${product.reviewCount} ${t.reviews})`
                  : undefined
              }
            />
          </div>
          <div className="mt-3 flex items-baseline gap-3">
            <span className="text-2xl text-wine font-display">
              {formatCents(product.priceCents)}
            </span>
            {product.compareAtPriceCents && (
              <span className="text-base text-ink-soft line-through">
                {formatCents(product.compareAtPriceCents)}
              </span>
            )}
          </div>
          <p className="mt-6 max-w-[60ch] whitespace-pre-line text-ink-soft">
            {product.description}
          </p>

          {product.outOfStock ? (
            <div className="mt-8">
              <span className="inline-block rounded-full bg-ink/80 px-4 py-2 text-sm font-medium text-white">
                Esgotado
              </span>
              <p className="mt-2 text-xs text-ink-soft">
                Essa peça já foi vendida. Confira outras bonecas disponíveis na coleção.
              </p>
            </div>
          ) : (
            <>
              <form action={addToCartFormAction} className="mt-8 flex items-center gap-4">
                <input type="hidden" name="productId" value={product.id} />
                <button type="submit" className={btnClass("primary")}>
                  {t.addToCart}
                </button>
              </form>
              <p className="mt-2 text-xs text-ink-soft">
                Peça artesanal única — apenas 1 unidade disponível.
              </p>
            </>
          )}

          <div className="mt-8">
            <SecurityBadges locale={locale} />
          </div>

          <dl className="mt-8 grid grid-cols-2 gap-4 border-t border-line pt-6 text-sm text-ink-soft">
            <div>
              <dt className="text-ink">{t.weight}</dt>
              <dd>{(product.weightGrams / 1000).toLocaleString(LOCALE_TAG[locale])} kg</dd>
            </div>
            <div>
              <dt className="text-ink">{t.dimensions}</dt>
              <dd>
                {product.heightCm}×{product.widthCm}×{product.lengthCm} cm
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
