import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CookieConsent } from "@/components/CookieConsent";

const description =
  "Handmade reborn dolls, made with realism and care, for 15 years. We ship worldwide from Brazil.";

export const metadata: Metadata = {
  title: {
    default: "Maternidade Encantada — Reborn Dolls",
    template: "%s | Maternidade Encantada",
  },
  description,
  openGraph: {
    type: "website",
    siteName: "Maternidade Encantada",
    locale: "en_US",
    title: "Maternidade Encantada — Reborn Dolls",
    description,
    images: [{ url: "/logo.jpg", width: 1080, height: 1080, alt: "Maternidade Encantada" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Maternidade Encantada — Reborn Dolls",
    description,
    images: ["/logo.jpg"],
  },
};

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header locale="en" />
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer locale="en" />
      <CookieConsent locale="en" />
    </>
  );
}
