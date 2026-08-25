import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProductsListContent } from "@/components/ProductsListContent";

export const metadata: Metadata = { title: "Muñecas Reborn" };

export default async function ProductsPageEs() {
  const products = await prisma.product.findMany({
    where: { active: true },
    include: { images: true },
    orderBy: { createdAt: "desc" },
  });

  return <ProductsListContent locale="es" products={products} />;
}
