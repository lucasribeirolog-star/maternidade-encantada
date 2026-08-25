import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Maternidade Encantada — Bonecas Reborn",
    template: "%s | Maternidade Encantada",
  },
  description:
    "Bonecas reborn feitas à mão, com realismo e carinho, há 15 anos. Envio para todo o Brasil e exterior.",
};

const HTML_LANG: Record<string, string> = { pt: "pt-BR", en: "en", es: "es" };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headerList = await headers();
  const locale = headerList.get("x-locale") ?? "pt";

  return (
    <html lang={HTML_LANG[locale] ?? "pt-BR"} className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-cream text-ink">{children}</body>
    </html>
  );
}
