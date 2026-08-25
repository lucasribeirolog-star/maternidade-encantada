import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { legalContent } from "@/lib/legalContent";

export const metadata: Metadata = { title: "Política de Privacidad" };

export default function PrivacyPageEs() {
  return <LegalPage {...legalContent.es.privacy} />;
}
