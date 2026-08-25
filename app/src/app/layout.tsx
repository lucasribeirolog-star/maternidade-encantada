import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "Maternidade Encantada — Bonecas Reborn",
    template: "%s | Maternidade Encantada",
  },
  description:
    "Bonecas reborn feitas à mão, com realismo e carinho, há 15 anos. Envio para todo o Brasil e exterior.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-cream text-ink">
        <Header />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
