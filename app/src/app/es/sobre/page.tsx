import type { Metadata } from "next";
import { AboutContent } from "@/components/AboutContent";
import { localeAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Nuestra historia",
  description:
    "Conoce Maternidade Encantada y a la artista Gabriela Salomé: 15 años creando muñecas reborn a mano en Sorocaba, Brasil, con realismo y cariño.",
  alternates: { canonical: "/es/sobre", languages: localeAlternates("/sobre") },
};

export default function AboutPageEs() {
  return <AboutContent locale="es" />;
}
