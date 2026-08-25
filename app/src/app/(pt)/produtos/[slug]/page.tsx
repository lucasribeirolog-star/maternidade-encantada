import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProductDetailContent } from "@/components/ProductDetailContent";
import { localeAlternates } from "@/lib/i18n";

type Props = { params: Promise<{ slug: string }> };

async function getProduct(slug: string) {
  return prisma.product.findUnique({
    where: { slug, active: true },
    include: { images: { orderBy: { position: "asc" } }, category: true },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
    alternates: {
      canonical: `/produtos/${slug}`,
      languages: localeAlternates(`/produtos/${slug}`),
    },
  };
}

export default async function ProdutoPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  return <ProductDetailContent locale="pt" product={product} />;
}
