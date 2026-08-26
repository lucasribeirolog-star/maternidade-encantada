"use client";

import { useEffect, useState } from "react";
import { isInWishlist, toggleWishlist, subscribeWishlist } from "@/lib/wishlist";

export function WishlistButton({
  productId,
  className = "",
  label,
}: {
  productId: string;
  className?: string;
  label?: string;
}) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading external storage on mount
    setActive(isInWishlist(productId));
    return subscribeWishlist(() => setActive(isInWishlist(productId)));
  }, [productId]);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setActive(toggleWishlist(productId));
      }}
      aria-label={active ? "Remover da lista de desejos" : "Adicionar à lista de desejos"}
      aria-pressed={active}
      className={className}
    >
      <svg
        viewBox="0 0 24 24"
        className={`h-5 w-5 transition-colors ${active ? "fill-rose stroke-rose" : "fill-none stroke-current"}`}
        strokeWidth="1.8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
      {label && <span>{label}</span>}
    </button>
  );
}
