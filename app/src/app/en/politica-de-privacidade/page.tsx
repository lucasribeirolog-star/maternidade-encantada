import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { legalContent } from "@/lib/legalContent";
import { localeAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Maternidade Encantada's privacy policy: how we collect, use, and protect your data.",
  alternates: { canonical: "/en/politica-de-privacidade", languages: localeAlternates("/politica-de-privacidade") },
};

export default function PrivacyPageEn() {
  return <LegalPage {...legalContent.en.privacy} />;
}
