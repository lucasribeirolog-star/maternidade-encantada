import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { HomeContent } from "@/components/HomeContent";
import { localeAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  alternates: { canonical: "/", languages: localeAlternates("") },
};

export default async function HomePage() {
  const featured = await prisma.product.findMany({
    where: { active: true, featured: true, outOfStock: false },
    include: { images: true },
    orderBy: { createdAt: "desc" },
    take: 8,
  });

  return <HomeContent locale="pt" featured={featured} />;
}
