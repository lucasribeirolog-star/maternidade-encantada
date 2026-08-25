import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { legalContent } from "@/lib/legalContent";

export const metadata: Metadata = { title: "Cambios y Devoluciones" };

export default function ReturnsPageEs() {
  return <LegalPage {...legalContent.es.returns} />;
}
