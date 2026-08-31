import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { legalContent } from "@/lib/legalContent";
import { localeAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Cambios y Devoluciones",
  description: "Política de cambios y devoluciones de Maternidade Encantada.",
  alternates: { canonical: "/es/trocas-e-devolucoes", languages: localeAlternates("/trocas-e-devolucoes") },
};

export default function ReturnsPageEs() {
  return <LegalPage {...legalContent.es.returns} />;
}
