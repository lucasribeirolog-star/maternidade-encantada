"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getWishlist, subscribeWishlist } from "@/lib/wishlist";
import { LOCALE_PATHS, type Locale } from "@/lib/i18n";

export function WishlistNavIcon({ locale = "pt", label }: { locale?: Locale; label: string }) {
  const [count, setCount] = useState(0);
  const base = LOCALE_PATHS[locale] === "/" ? "" : LOCALE_PATHS[locale];

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading external storage on mount
    setCount(getWishlist().length);
    return subscribeWishlist(() => setCount(getWishlist().length));
  }, []);

  return (
    <Link href={`${base}/lista-de-desejos`} className="relative shrink-0" aria-label={label}>
      <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current" strokeWidth="1.6">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
      {count > 0 && (
        <span className="absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose px-1 text-[11px] font-medium text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
