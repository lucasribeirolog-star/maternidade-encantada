import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProductsListContent } from "@/components/ProductsListContent";

export const metadata: Metadata = { title: "Reborn Dolls" };

export default async function ProductsPageEn() {
  const products = await prisma.product.findMany({
    where: { active: true },
    include: { images: true },
    orderBy: { createdAt: "desc" },
  });

  return <ProductsListContent locale="en" products={products} />;
}
