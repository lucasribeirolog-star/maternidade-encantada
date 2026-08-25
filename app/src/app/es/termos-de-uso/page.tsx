import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { legalContent } from "@/lib/legalContent";

export const metadata: Metadata = { title: "Términos de Uso" };

export default function TermsPageEs() {
  return <LegalPage {...legalContent.es.terms} />;
}
