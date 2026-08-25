import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { HomeContent } from "@/components/HomeContent";
import { localeAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Reborn Doll from Sorocaba, Brazil",
  description:
    "Handmade reborn dolls from Sorocaba, Brazil, made with realism and care for 15 years. We ship worldwide.",
  alternates: { canonical: "/en", languages: localeAlternates("") },
};

export default async function HomePageEn() {
  const featured = await prisma.product.findMany({
    where: { active: true, featured: true },
    include: { images: true },
    orderBy: { createdAt: "desc" },
    take: 8,
  });

  return <HomeContent locale="en" featured={featured} />;
}
