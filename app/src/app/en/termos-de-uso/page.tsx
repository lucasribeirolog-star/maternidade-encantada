import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { legalContent } from "@/lib/legalContent";

export const metadata: Metadata = { title: "Terms of Use" };

export default function TermsPageEn() {
  return <LegalPage {...legalContent.en.terms} />;
}
