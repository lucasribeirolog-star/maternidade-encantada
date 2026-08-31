import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";
import { localeAlternates } from "@/lib/i18n";

type Props = { params: Promise<{ slug: string }> };

async function getCategory(slug: string) {
  return prisma.category.findUnique({
    where: { slug },
    include: { products: { where: { active: true }, include: { images: true } } },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) return { title: "Categoria" };
  return {
    title: category.name,
    description: `${category.name} — peças exclusivas da Maternidade Encantada, feitas à mão com realismo e carinho em Sorocaba.`,
    alternates: {
      canonical: `/categoria/${slug}`,
      languages: localeAlternates(`/categoria/${slug}`),
    },
  };
}

export default async function CategoriaPage({ params }: Props) {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) notFound();

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10 max-w-xl">
        <span className="mb-2 block text-xs tracking-[0.16em] uppercase text-rose-deep">
          Categoria
        </span>
        <h1 className="text-3xl font-semibold">{category.name}</h1>
      </div>
      {category.products.length > 0 ? (
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {category.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-ink-soft">Ainda não há produtos nessa categoria.</p>
      )}
    </div>
  );
}
