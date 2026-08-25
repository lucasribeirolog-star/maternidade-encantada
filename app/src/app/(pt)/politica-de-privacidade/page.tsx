import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { legalContent } from "@/lib/legalContent";

export const metadata: Metadata = { title: "Política de Privacidade" };

export default function PrivacidadePage() {
  return <LegalPage {...legalContent.pt.privacy} />;
}
