import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://maternidadeencantada.com.br"),
  title: {
    default: "Maternidade Encantada — Boneca Reborn em Sorocaba",
    template: "%s | Maternidade Encantada",
  },
  description:
    "Bonecas reborn feitas à mão em Sorocaba, com realismo e carinho, há 15 anos. Loja física no Shopping Iguatemi Esplanada e envio para todo o Brasil e exterior.",
  keywords: [
    "boneca reborn",
    "boneca reborn Sorocaba",
    "bonecas reborn Sorocaba",
    "bonecas",
    "maternidade encantada",
    "boneca bebe reborn",
  ],
  openGraph: {
    type: "website",
    siteName: "Maternidade Encantada",
    locale: "pt_BR",
    title: "Maternidade Encantada — Boneca Reborn em Sorocaba",
    description:
      "Bonecas reborn feitas à mão em Sorocaba, com realismo e carinho, há 15 anos. Loja física no Shopping Iguatemi Esplanada e envio para todo o Brasil e exterior.",
    images: [{ url: "/logo.jpg", width: 1080, height: 1080, alt: "Maternidade Encantada" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Maternidade Encantada — Boneca Reborn em Sorocaba",
    description: "Bonecas reborn feitas à mão em Sorocaba, com realismo e carinho, há 15 anos.",
    images: ["/logo.jpg"],
  },
};

const HTML_LANG: Record<string, string> = { pt: "pt-BR", en: "en", es: "es" };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headerList = await headers();
  const locale = headerList.get("x-locale") ?? "pt";

  return (
    <html lang={HTML_LANG[locale] ?? "pt-BR"} className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-cream text-ink">
        {children}
        <script
          type="application/ld+json"
           
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Store",
              "@id": "https://maternidadeencantada.com.br/#store",
              name: "Maternidade Encantada",
              alternateName: "Boneca Reborn Sorocaba",
              description:
                "Loja de bonecas reborn feitas à mão, com realismo e carinho, há 15 anos.",
              url: "https://maternidadeencantada.com.br",
              image: "https://maternidadeencantada.com.br/logo.jpg",
              logo: "https://maternidadeencantada.com.br/logo.jpg",
              telephone: "+5511991352246",
              priceRange: "$$",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Av. Professora Izoraida Marques Peres — Shopping Iguatemi Esplanada, Ala Norte",
                addressLocality: "Sorocaba",
                addressRegion: "SP",
                postalCode: "18110-650",
                addressCountry: "BR",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: -23.5336612,
                longitude: -47.4634434,
              },
              hasMap: "https://maps.app.goo.gl/GGfbzTLz1E1xHJAo9",
              areaServed: ["Sorocaba", "Brasil", "Internacional"],
              sameAs: ["https://www.instagram.com/maternidadeencantadaoficial/"],
            }),
          }}
        />
      </body>
    </html>
  );
}
