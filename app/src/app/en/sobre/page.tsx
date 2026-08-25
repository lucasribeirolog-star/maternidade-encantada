import type { Metadata } from "next";
import { AboutContent } from "@/components/AboutContent";

export const metadata: Metadata = { title: "Our Story" };

export default function AboutPageEn() {
  return <AboutContent locale="en" />;
}
