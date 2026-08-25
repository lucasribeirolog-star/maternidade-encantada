import Link from "next/link";
import { LOCALE_LABELS, LOCALE_PATHS, type Locale } from "@/lib/i18n";

const ORDER: Locale[] = ["pt", "en", "es"];

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  return (
    <div className="flex items-center gap-1 text-xs text-ink-soft">
      {ORDER.map((l, i) => (
        <span key={l} className="flex items-center gap-1">
          {i > 0 && <span className="text-line">/</span>}
          {l === locale ? (
            <span className="font-semibold text-ink">{LOCALE_LABELS[l]}</span>
          ) : (
            <Link href={LOCALE_PATHS[l]} className="hover:text-ink">
              {LOCALE_LABELS[l]}
            </Link>
          )}
        </span>
      ))}
    </div>
  );
}
