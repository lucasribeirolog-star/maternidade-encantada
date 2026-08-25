import Link from "next/link";
import { Logo } from "./Logo";
import { getCartWithItems, cartTotals } from "@/lib/cart";

const NAV_LINKS = [
  { href: "/produtos", label: "Bonecas" },
  { href: "/categoria/kits-e-enxoval", label: "Kits & Enxoval" },
  { href: "/categoria/cursos", label: "Cursos" },
  { href: "/sobre", label: "Nossa história" },
];

export async function Header() {
  const cart = await getCartWithItems();
  const { itemCount } = cartTotals(cart);

  return (
    <header className="max-w-6xl mx-auto w-full flex items-center justify-between px-6 py-5">
      <Link href="/" className="flex items-center gap-4">
        <Logo size={72} asLink={false} />
        <span className="font-display text-2xl md:text-3xl font-semibold text-wine leading-tight">
          Maternidade Encantada
        </span>
      </Link>
      <nav className="hidden md:flex items-center gap-8 text-sm text-ink/80">
        {NAV_LINKS.map((link) => (
          <Link key={link.href} href={link.href} className="hover:text-ink transition-colors">
            {link.label}
          </Link>
        ))}
      </nav>
      <Link href="/carrinho" className="relative shrink-0" aria-label="Carrinho">
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
    </header>
  );
}
