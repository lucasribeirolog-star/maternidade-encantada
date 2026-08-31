import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { legalContent } from "@/lib/legalContent";
import { localeAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description: "Termos de uso da loja online Maternidade Encantada.",
  alternates: { canonical: "/termos-de-uso", languages: localeAlternates("/termos-de-uso") },
};

export default function TermosPage() {
  return <LegalPage {...legalContent.pt.terms} />;
}
