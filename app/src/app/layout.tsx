import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import "./globals.css";
import { ContactFloatingButtons } from "@/components/ContactFloatingButtons";
import { SITE_URL } from "@/lib/seo";

const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
const bingVerification = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
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
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  ...((googleVerification || bingVerification) && {
    verification: {
      ...(googleVerification && { google: googleVerification }),
      ...(bingVerification && { other: { "msvalidate.01": bingVerification } }),
    },
  }),
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

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#FDF6F1",
};

const HTML_LANG: Record<string, string> = { pt: "pt-BR", en: "en", es: "es" };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headerList = await headers();
  const locale = headerList.get("x-locale") ?? "pt";

  return (
    <html lang={HTML_LANG[locale] ?? "pt-BR"} className="h-full antialiased">
      <body className="min-h-full flex flex-col overflow-x-hidden bg-cream text-ink">
        {children}
        <ContactFloatingButtons />
        <script
          type="application/ld+json"

          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Store",
              "@id": `${SITE_URL}/#store`,
              name: "Maternidade Encantada",
              alternateName: "Boneca Reborn Sorocaba",
              description:
                "Loja de bonecas reborn feitas à mão, com realismo e carinho, há 15 anos.",
              url: SITE_URL,
              image: `${SITE_URL}/logo.jpg`,
              logo: `${SITE_URL}/logo.jpg`,
              telephone: "+5511991352246",
              priceRange: "$$",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Av. Professora Izoraida Marques Peres, 401 — Shopping Iguatemi Esplanada",
                addressLocality: "Sorocaba",
                addressRegion: "SP",
                postalCode: "18048-110",
                addressCountry: "BR",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: -23.5336612,
                longitude: -47.4634434,
              },
              hasMap: "https://maps.app.goo.gl/GGfbzTLz1E1xHJAo9",
              founder: { "@type": "Person", name: "Gabriela Salomé" },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: 4.8,
                reviewCount: 18,
              },
              areaServed: ["Sorocaba", "Brasil", "Internacional"],
              sameAs: ["https://www.instagram.com/maternidadeencantadaoficial/"],
            }),
          }}
        />
        <script
          type="application/ld+json"

          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "@id": `${SITE_URL}/#website`,
              name: "Maternidade Encantada",
              url: SITE_URL,
              inLanguage: "pt-BR",
              publisher: { "@id": `${SITE_URL}/#store` },
            }),
          }}
        />
      </body>
    </html>
  );
}
