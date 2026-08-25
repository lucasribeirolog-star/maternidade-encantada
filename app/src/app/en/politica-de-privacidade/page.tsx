import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { legalContent } from "@/lib/legalContent";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPageEn() {
  return <LegalPage {...legalContent.en.privacy} />;
}
