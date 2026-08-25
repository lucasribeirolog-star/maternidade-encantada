import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CookieConsent } from "@/components/CookieConsent";

export const metadata: Metadata = {
  title: {
    default: "Maternidade Encantada — Reborn Dolls",
    template: "%s | Maternidade Encantada",
  },
  description:
    "Handmade reborn dolls, made with realism and care, for 15 years. We ship worldwide from Brazil.",
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
