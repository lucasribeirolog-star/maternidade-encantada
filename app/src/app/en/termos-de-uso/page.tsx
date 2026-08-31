import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { legalContent } from "@/lib/legalContent";
import { localeAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms of use for the Maternidade Encantada online store.",
  alternates: { canonical: "/en/termos-de-uso", languages: localeAlternates("/termos-de-uso") },
};

export default function TermsPageEn() {
  return <LegalPage {...legalContent.en.terms} />;
}
