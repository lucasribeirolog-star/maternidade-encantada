import type { Metadata } from "next";
import { WishlistContent } from "@/components/WishlistContent";

export const metadata: Metadata = { title: "My Wishlist", robots: { index: false, follow: true } };

export default function WishlistPageEn() {
  return <WishlistContent locale="en" />;
}
