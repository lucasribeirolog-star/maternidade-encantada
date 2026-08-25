import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProductsListContent } from "@/components/ProductsListContent";
import { localeAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Reborn Dolls — Full Collection",
  description:
    "Shop handmade reborn dolls from Sorocaba, Brazil. Exclusive, collectible pieces shipped worldwide.",
  alternates: { canonical: "/en/produtos", languages: localeAlternates("/produtos") },
};

export default async function ProductsPageEn() {
  const products = await prisma.product.findMany({
    where: { active: true },
    include: { images: true },
    orderBy: { createdAt: "desc" },
  });

  return <ProductsListContent locale="en" products={products} />;
}
