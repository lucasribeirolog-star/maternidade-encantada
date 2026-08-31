import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { legalContent } from "@/lib/legalContent";
import { localeAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Términos de Uso",
  description: "Términos de uso de la tienda online Maternidade Encantada.",
  alternates: { canonical: "/es/termos-de-uso", languages: localeAlternates("/termos-de-uso") },
};

export default function TermsPageEs() {
  return <LegalPage {...legalContent.es.terms} />;
}
