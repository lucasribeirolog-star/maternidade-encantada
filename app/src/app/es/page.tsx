import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { HomeContent } from "@/components/HomeContent";
import { localeAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Muñeca Reborn de Sorocaba, Brasil",
  description:
    "Muñecas reborn de Sorocaba, Brasil, hechas a mano con realismo y cariño desde hace 15 años. Enviamos a todo el mundo.",
  alternates: { canonical: "/es", languages: localeAlternates("") },
};

export default async function HomePageEs() {
  const featured = await prisma.product.findMany({
    where: { active: true, featured: true },
    include: { images: true },
    orderBy: { createdAt: "desc" },
    take: 8,
  });

  return <HomeContent locale="es" featured={featured} />;
}
