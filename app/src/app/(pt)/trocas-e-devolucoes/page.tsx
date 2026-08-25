import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { legalContent } from "@/lib/legalContent";

export const metadata: Metadata = { title: "Trocas e Devoluções" };

export default function TrocasPage() {
  return <LegalPage {...legalContent.pt.returns} />;
}
