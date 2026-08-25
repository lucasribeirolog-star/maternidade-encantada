"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { btnClass } from "@/lib/ui";
import { dictionaries, LOCALE_PATHS, type Locale } from "@/lib/i18n";

const STORAGE_KEY = "cookie-consent";

export function CookieConsent({ locale = "pt" }: { locale?: Locale }) {
  const [visible, setVisible] = useState(false);
  const t = dictionaries[locale];
  const base = LOCALE_PATHS[locale] === "/" ? "" : LOCALE_PATHS[locale];

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading external storage on mount
    setVisible(!window.localStorage.getItem(STORAGE_KEY));
  }, []);

  function accept() {
    window.localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  }

  function decline() {
    window.localStorage.setItem(STORAGE_KEY, "declined");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-white/95 px-6 py-5 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <p className="text-sm text-ink-soft">
          {t.cookies.text}{" "}
          <Link href={`${base}/politica-de-privacidade`} className="text-rose-deep underline">
            {t.cookies.policy}
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-3">
          <button onClick={decline} className={btnClass("outline")}>
            {t.cookies.decline}
          </button>
          <button onClick={accept} className={btnClass("primary")}>
            {t.cookies.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
