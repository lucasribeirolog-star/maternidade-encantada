import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/carrinho",
          "/checkout",
          "/pedido",
          "/api",
          "/lista-de-desejos",
          "/en/lista-de-desejos",
          "/es/lista-de-desejos",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
