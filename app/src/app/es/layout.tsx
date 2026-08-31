import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CookieConsent } from "@/components/CookieConsent";

const description =
  "Muñecas reborn hechas a mano, con realismo y cariño, desde hace 15 años. Enviamos a todo el mundo desde Brasil.";

export const metadata: Metadata = {
  title: {
    default: "Maternidade Encantada — Muñecas Reborn",
    template: "%s | Maternidade Encantada",
  },
  description,
  openGraph: {
    type: "website",
    siteName: "Maternidade Encantada",
    locale: "es_ES",
    title: "Maternidade Encantada — Muñecas Reborn",
    description,
    images: [{ url: "/logo.jpg", width: 1080, height: 1080, alt: "Maternidade Encantada" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Maternidade Encantada — Muñecas Reborn",
    description,
    images: ["/logo.jpg"],
  },
};

export default function EsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header locale="es" />
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer locale="es" />
      <CookieConsent locale="es" />
    </>
  );
}
