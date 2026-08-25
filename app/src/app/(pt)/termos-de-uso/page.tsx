import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { legalContent } from "@/lib/legalContent";

export const metadata: Metadata = { title: "Termos de Uso" };

export default function TermosPage() {
  return <LegalPage {...legalContent.pt.terms} />;
}
