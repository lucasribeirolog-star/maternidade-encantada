import type { Metadata } from "next";
import { WishlistContent } from "@/components/WishlistContent";

export const metadata: Metadata = { title: "Mi Lista de Deseos", robots: { index: false, follow: true } };

export default function WishlistPageEs() {
  return <WishlistContent locale="es" />;
}
