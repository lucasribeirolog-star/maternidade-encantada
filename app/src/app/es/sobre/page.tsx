import type { Metadata } from "next";
import { AboutContent } from "@/components/AboutContent";

export const metadata: Metadata = { title: "Nuestra historia" };

export default function AboutPageEs() {
  return <AboutContent locale="es" />;
}
