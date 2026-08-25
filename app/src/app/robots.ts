import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/carrinho", "/checkout", "/pedido", "/api"],
      },
    ],
    sitemap: "https://maternidadeencantada.com.br/sitemap.xml",
  };
}
