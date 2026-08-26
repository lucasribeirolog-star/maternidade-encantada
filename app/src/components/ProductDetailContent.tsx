import Image from "next/image";
import { formatCents } from "@/lib/money";
import { btnClass } from "@/lib/ui";
import { addToCartFormAction } from "@/app/actions/cart";
import { dictionaries, type Locale } from "@/lib/i18n";

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
  images: { url: string; alt: string }[];
  category: { name: string } | null;
};

const BASE_URL = "https://maternidadeencantada.com.br";

const LOCALE_TAG: Record<Locale, string> = { pt: "pt-BR", en: "en-US", es: "es-ES" };

export function ProductDetailContent({
  locale,
  product,
}: {
  locale: Locale;
  product: ProductDetail;
}) {
  const t = dictionaries[locale].productDetail;
  const mainImage = product.images[0];
  const productUrl = `${BASE_URL}${locale === "pt" ? "" : `/${locale}`}/produtos/${product.slug}`;

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
            image: product.images.map((img) => `${BASE_URL}${img.url}`),
            url: productUrl,
            brand: { "@type": "Brand", name: "Maternidade Encantada" },
            offers: {
              "@type": "Offer",
              url: productUrl,
              priceCurrency: "BRL",
              price: (product.priceCents / 100).toFixed(2),
              availability: product.active
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
              seller: { "@type": "Organization", name: "Maternidade Encantada" },
            },
          }),
        }}
      />
      <div className="grid gap-14 md:grid-cols-2">
        <div className="overflow-hidden rounded-2xl bg-cream-2 shadow-[0_20px_40px_-28px_rgba(62,39,35,0.35)]">
          {mainImage && (
            <Image
              src={mainImage.url}
              alt={mainImage.alt || product.name}
              width={800}
              height={800}
              priority
              className="aspect-square w-full object-cover"
            />
          )}
        </div>
        <div>
          {product.category && (
            <span className="mb-2 block text-xs tracking-[0.16em] uppercase text-rose-deep">
              {product.category.name}
            </span>
          )}
          <h1 className="text-3xl font-semibold">{product.name}</h1>
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

          <form action={addToCartFormAction} className="mt-8 flex items-center gap-4">
            <input type="hidden" name="productId" value={product.id} />
            <select
              name="quantity"
              defaultValue={1}
              className="rounded-full border border-line bg-white px-4 py-3.5 text-sm"
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <button type="submit" className={btnClass("primary")}>
              {t.addToCart}
            </button>
          </form>

          <dl className="mt-10 grid grid-cols-2 gap-4 border-t border-line pt-6 text-sm text-ink-soft">
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
