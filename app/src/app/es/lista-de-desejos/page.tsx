import type { Metadata } from "next";
import { WishlistContent } from "@/components/WishlistContent";

export const metadata: Metadata = { title: "Mi Lista de Deseos" };

export default function WishlistPageEs() {
  return <WishlistContent locale="es" />;
}
