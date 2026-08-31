import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/seo";

const LOCALES = ["", "/en", "/es"];
const HREFLANG: Record<string, string> = { "": "pt-BR", "/en": "en", "/es": "es" };

const STATIC_PATHS = [
  "",
  "/produtos",
  "/sobre",
  "/politica-de-privacidade",
  "/termos-de-uso",
  "/trocas-e-devolucoes",
];

function withAlternates(path: string) {
  const languages: Record<string, string> = {};
  for (const prefix of LOCALES) {
    languages[HREFLANG[prefix]] = `${SITE_URL}${prefix}${path}`;
  }
  languages["x-default"] = `${SITE_URL}${path}`;
  return languages;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({ where: { active: true }, select: { slug: true, updatedAt: true } }),
    prisma.category.findMany({ select: { slug: true } }),
  ]);

  const staticEntries: MetadataRoute.Sitemap = LOCALES.flatMap((prefix) =>
    STATIC_PATHS.map((path) => ({
      url: `${SITE_URL}${prefix}${path}`,
      changeFrequency: path === "" ? "weekly" : "monthly",
      priority: path === "" ? 1 : 0.7,
      alternates: { languages: withAlternates(path) },
    }))
  );

  const productEntries: MetadataRoute.Sitemap = LOCALES.flatMap((prefix) =>
    products.map((product) => ({
      url: `${SITE_URL}${prefix}/produtos/${product.slug}`,
      lastModified: product.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: { languages: withAlternates(`/produtos/${product.slug}`) },
    }))
  );

  const categoryEntries: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${SITE_URL}/categoria/${category.slug}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticEntries, ...productEntries, ...categoryEntries];
}
