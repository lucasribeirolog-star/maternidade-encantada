import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { legalContent } from "@/lib/legalContent";
import { localeAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description: "Política de privacidad de Maternidade Encantada: cómo recopilamos, usamos y protegemos tus datos.",
  alternates: { canonical: "/es/politica-de-privacidade", languages: localeAlternates("/politica-de-privacidade") },
};

export default function PrivacyPageEs() {
  return <LegalPage {...legalContent.es.privacy} />;
}
