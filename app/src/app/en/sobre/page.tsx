import type { Metadata } from "next";
import { AboutContent } from "@/components/AboutContent";
import { localeAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Meet Maternidade Encantada and artist Gabriela Salomé: 15 years handcrafting reborn dolls in Sorocaba, Brazil, with realism and care.",
  alternates: { canonical: "/en/sobre", languages: localeAlternates("/sobre") },
};

export default function AboutPageEn() {
  return <AboutContent locale="en" />;
}
