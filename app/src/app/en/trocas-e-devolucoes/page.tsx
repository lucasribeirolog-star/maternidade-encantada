import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { legalContent } from "@/lib/legalContent";

export const metadata: Metadata = { title: "Returns & Exchanges" };

export default function ReturnsPageEn() {
  return <LegalPage {...legalContent.en.returns} />;
}
