import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProductsListContent } from "@/components/ProductsListContent";
import { localeAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Boneca Reborn — Coleção Completa",
  description:
    "Compre bonecas reborn feitas à mão em Sorocaba. Peças exclusivas e colecionáveis, com envio para todo o Brasil e exterior.",
  alternates: { canonical: "/produtos", languages: localeAlternates("/produtos") },
};

export default async function ProdutosPage() {
  const products = await prisma.product.findMany({
    where: { active: true },
    include: { images: true },
    orderBy: { createdAt: "desc" },
  });

  return <ProductsListContent locale="pt" products={products} />;
}
