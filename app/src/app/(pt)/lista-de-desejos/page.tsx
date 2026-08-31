import type { Metadata } from "next";
import { WishlistContent } from "@/components/WishlistContent";

export const metadata: Metadata = { title: "Lista de Desejos", robots: { index: false, follow: true } };

export default function ListaDeDesejosPage() {
  return <WishlistContent locale="pt" />;
}
