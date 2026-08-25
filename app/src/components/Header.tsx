import Link from "next/link";
import { Logo } from "./Logo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { getCartWithItems, cartTotals } from "@/lib/cart";
import { dictionaries, LOCALE_PATHS, type Locale } from "@/lib/i18n";

export async function Header({ locale = "pt" }: { locale?: Locale }) {
  const cart = await getCartWithItems();
  const { itemCount } = cartTotals(cart);
  const t = dictionaries[locale];
  const base = LOCALE_PATHS[locale] === "/" ? "" : LOCALE_PATHS[locale];

  const navLinks = [
    { href: `${base}/produtos`, label: t.nav.products },
    ...(locale === "pt"
      ? [
          { href: "/categoria/kits-e-enxoval", label: t.nav.kits },
          { href: "/categoria/cursos", label: t.nav.courses },
        ]
      : []),
    { href: `${base}/sobre`, label: t.nav.story },
  ];

  return (
    <header className="max-w-6xl mx-auto w-full px-6 py-5">
      <div className="flex items-center justify-between">
        <Link href={LOCALE_PATHS[locale]} className="flex items-center gap-4">
          <Logo size={72} asLink={false} />
          <span className="font-display text-2xl md:text-3xl font-semibold text-wine leading-tight">
            Maternidade Encantada
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-ink/80">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-ink transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-5">
          <div className="hidden sm:block">
            <LanguageSwitcher locale={locale} />
          </div>
          <Link href="/carrinho" className="relative shrink-0" aria-label={t.nav.cart}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              className="text-ink"
            >
              <path d="M3 3h2l2.4 12.4a2 2 0 0 0 2 1.6h7.2a2 2 0 0 0 2-1.6L20 7H6" />
              <circle cx="9" cy="20" r="1.4" />
              <circle cx="17" cy="20" r="1.4" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose px-1 text-[11px] font-medium text-white">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
