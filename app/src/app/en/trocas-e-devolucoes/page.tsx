import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { legalContent } from "@/lib/legalContent";
import { localeAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Returns & Exchanges",
  description: "Maternidade Encantada's returns and exchanges policy.",
  alternates: { canonical: "/en/trocas-e-devolucoes", languages: localeAlternates("/trocas-e-devolucoes") },
};

export default function ReturnsPageEn() {
  return <LegalPage {...legalContent.en.returns} />;
}
