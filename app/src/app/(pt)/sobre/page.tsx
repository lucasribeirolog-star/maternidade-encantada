import type { Metadata } from "next";
import { AboutContent } from "@/components/AboutContent";

export const metadata: Metadata = { title: "Nossa história" };

export default function SobrePage() {
  return <AboutContent locale="pt" />;
}
