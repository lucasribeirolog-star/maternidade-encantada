import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CookieConsent } from "@/components/CookieConsent";

export const metadata: Metadata = {
  title: {
    default: "Maternidade Encantada — Muñecas Reborn",
    template: "%s | Maternidade Encantada",
  },
  description:
    "Muñecas reborn hechas a mano, con realismo y cariño, desde hace 15 años. Enviamos a todo el mundo desde Brasil.",
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
