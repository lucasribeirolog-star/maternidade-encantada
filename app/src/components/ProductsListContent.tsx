import { ProductCard } from "@/components/ProductCard";
import { dictionaries, type Locale } from "@/lib/i18n";

type Product = {
  id: string;
  slug: string;
  name: string;
  priceCents: number;
  compareAtPriceCents: number | null;
  rating: number;
  reviewCount: number;
  outOfStock: boolean;
  images: { url: string; alt: string }[];
};

export function ProductsListContent({ locale, products }: { locale: Locale; products: Product[] }) {
  const t = dictionaries[locale].productsPage;

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10 max-w-xl">
        <span className="mb-2 block text-xs tracking-[0.16em] uppercase text-rose-deep">
          {t.kicker}
        </span>
        <h1 className="text-3xl font-semibold">{t.title}</h1>
        <p className="mt-3 text-ink-soft">{t.subtitle}</p>
      </div>
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} locale={locale} />
        ))}
      </div>
      {products.length === 0 && <p className="text-ink-soft">{t.empty}</p>}
    </div>
  );
}
