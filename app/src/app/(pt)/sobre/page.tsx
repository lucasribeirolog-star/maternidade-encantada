import type { Metadata } from "next";
import { AboutContent } from "@/components/AboutContent";
import { localeAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Nossa história",
  description:
    "Conheça a Maternidade Encantada e a artista Gabriela Salomé: 15 anos criando bonecas reborn feitas à mão em Sorocaba, com realismo e muito carinho.",
  alternates: { canonical: "/sobre", languages: localeAlternates("/sobre") },
};

export default function SobrePage() {
  return <AboutContent locale="pt" />;
}
