import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminEmail } from "@/lib/adminAuth";
import { adminLogout } from "@/app/actions/adminAuth";
import { Logo } from "@/components/Logo";

export const metadata: Metadata = { robots: { index: false, follow: false } };

const NAV = [
  { href: "/admin", label: "Painel" },
  { href: "/admin/produtos", label: "Produtos" },
  { href: "/admin/pedidos", label: "Pedidos" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const email = await getAdminEmail();
  if (!email) redirect("/admin/login");

  return (
    <div className="mx-auto flex min-h-[70vh] w-full min-w-0 max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 md:flex-row md:gap-10 md:py-10">
      <aside className="flex flex-col gap-3 border-b border-line pb-4 md:w-48 md:shrink-0 md:border-b-0 md:pb-0">
        <div className="flex items-center justify-between gap-3">
          <Logo size={48} />
          <form action={adminLogout} className="md:hidden">
            <button type="submit" className="text-xs whitespace-nowrap text-ink-soft underline hover:text-rose-deep">
              Sair
            </button>
          </form>
        </div>
        <nav className="flex flex-wrap gap-1 text-sm md:mt-4 md:flex-col md:space-y-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-lg px-3 py-2 text-ink-soft hover:bg-cream-2 hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <form action={adminLogout} className="hidden md:mt-8 md:block">
          <button type="submit" className="text-xs whitespace-nowrap text-ink-soft underline hover:text-rose-deep">
            Sair ({email})
          </button>
        </form>
      </aside>
      <div className="w-full min-w-0 flex-1">{children}</div>
    </div>
  );
}
