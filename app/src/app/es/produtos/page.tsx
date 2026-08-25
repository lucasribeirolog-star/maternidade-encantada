import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProductsListContent } from "@/components/ProductsListContent";
import { localeAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Muñecas Reborn — Colección Completa",
  description:
    "Compra muñecas reborn hechas a mano en Sorocaba, Brasil. Piezas exclusivas y coleccionables, con envío a todo el mundo.",
  alternates: { canonical: "/es/produtos", languages: localeAlternates("/produtos") },
};

export default async function ProductsPageEs() {
  const products = await prisma.product.findMany({
    where: { active: true },
    include: { images: true },
    orderBy: { createdAt: "desc" },
  });

  return <ProductsListContent locale="es" products={products} />;
}
