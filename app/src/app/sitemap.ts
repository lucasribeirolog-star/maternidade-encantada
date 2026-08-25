import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const BASE = "https://maternidadeencantada.com.br";
const LOCALES = ["", "/en", "/es"];

const STATIC_PATHS = [
  "",
  "/produtos",
  "/sobre",
  "/politica-de-privacidade",
  "/termos-de-uso",
  "/trocas-e-devolucoes",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await prisma.product.findMany({
    where: { active: true },
    select: { slug: true, updatedAt: true },
  });

  const staticEntries: MetadataRoute.Sitemap = LOCALES.flatMap((prefix) =>
    STATIC_PATHS.map((path) => ({
      url: `${BASE}${prefix}${path}`,
      changeFrequency: path === "" ? "weekly" : "monthly",
      priority: path === "" ? 1 : 0.7,
    }))
  );

  const productEntries: MetadataRoute.Sitemap = LOCALES.flatMap((prefix) =>
    products.map((product) => ({
      url: `${BASE}${prefix}/produtos/${product.slug}`,
      lastModified: product.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    }))
  );

  return [...staticEntries, ...productEntries];
}
