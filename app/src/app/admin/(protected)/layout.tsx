import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminEmail } from "@/lib/adminAuth";
import { adminLogout } from "@/app/actions/adminAuth";
import { Logo } from "@/components/Logo";

const NAV = [
  { href: "/admin", label: "Painel" },
  { href: "/admin/produtos", label: "Produtos" },
  { href: "/admin/pedidos", label: "Pedidos" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const email = await getAdminEmail();
  if (!email) redirect("/admin/login");

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-6xl gap-10 px-6 py-10">
      <aside className="w-48 shrink-0">
        <div className="mb-8">
          <Logo size={64} />
        </div>
        <nav className="space-y-1 text-sm">
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
        <form action={adminLogout} className="mt-8">
          <button type="submit" className="text-xs text-ink-soft underline hover:text-rose-deep">
            Sair ({email})
          </button>
        </form>
      </aside>
      <div className="flex-1">{children}</div>
    </div>
  );
}
