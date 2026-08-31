import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { legalContent } from "@/lib/legalContent";
import { localeAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Trocas e Devoluções",
  description: "Política de trocas e devoluções da Maternidade Encantada.",
  alternates: { canonical: "/trocas-e-devolucoes", languages: localeAlternates("/trocas-e-devolucoes") },
};

export default function TrocasPage() {
  return <LegalPage {...legalContent.pt.returns} />;
}
