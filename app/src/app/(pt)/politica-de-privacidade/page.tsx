import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { legalContent } from "@/lib/legalContent";
import { localeAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description: "Política de privacidade da Maternidade Encantada: como coletamos, usamos e protegemos seus dados.",
  alternates: { canonical: "/politica-de-privacidade", languages: localeAlternates("/politica-de-privacidade") },
};

export default function PrivacidadePage() {
  return <LegalPage {...legalContent.pt.privacy} />;
}
