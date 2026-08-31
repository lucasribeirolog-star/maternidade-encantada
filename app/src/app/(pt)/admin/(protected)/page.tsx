import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/money";
import { btnClass } from "@/lib/ui";
import { isMercadoPagoConfigured, isMelhorEnvioConfigured } from "@/lib/mercadoPago";
import { isTinyConfigured } from "@/lib/tiny";
import { isEmailConfigured } from "@/lib/email";
import { syncStockAction } from "@/app/actions/adminStock";

type Props = { searchParams: Promise<{ stockSynced?: string; checked?: string; outOfStock?: string }> };

export default async function AdminDashboardPage({ searchParams }: Props) {
  const params = await searchParams;
  const [productCount, pendingOrders, paidOrders, revenue, outOfStockCount] = await Promise.all([
    prisma.product.count({ where: { active: true } }),
    prisma.order.count({ where: { status: "pending" } }),
    prisma.order.count({ where: { status: "paid" } }),
    prisma.order.aggregate({ where: { status: "paid" }, _sum: { totalCents: true } }),
    prisma.product.count({ where: { active: true, outOfStock: true } }),
  ]);

  const mpOk = isMercadoPagoConfigured();
  const meOk = isMelhorEnvioConfigured();
  const tinyOk = isTinyConfigured();
  const emailOk = isEmailConfigured();

  return (
    <div>
      <h1 className="text-2xl font-semibold">Painel</h1>

      {params.stockSynced && (
        <div className="mt-6 rounded-xl border border-line bg-cream-2 p-4 text-sm text-ink">
          Estoque verificado: {params.checked} produtos checados no Tiny, {params.outOfStock} esgotados no momento.
        </div>
      )}

      {(!mpOk || !meOk || !tinyOk || !emailOk) && (
        <div className="mt-6 rounded-xl border border-gold-soft bg-gold-soft/40 p-4 text-sm">
          <p className="font-medium">Integrações pendentes</p>
          <ul className="mt-2 list-inside list-disc text-ink-soft">
            {!mpOk && <li>Mercado Pago — configure MERCADOPAGO_ACCESS_TOKEN e NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY</li>}
            {!meOk && <li>Melhor Envio — configure MELHOR_ENVIO_TOKEN e MELHOR_ENVIO_FROM_ZIP</li>}
            {!tinyOk && <li>Tiny — configure TINY_API_TOKEN</li>}
            {!emailOk && <li>E-mail — configure RESEND_API_KEY</li>}
          </ul>
        </div>
      )}

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-5">
        <div className="rounded-xl bg-cream-2 p-5">
          <p className="text-xs uppercase text-ink-soft">Produtos ativos</p>
          <p className="mt-1 font-display text-2xl font-semibold">{productCount}</p>
        </div>
        <div className="rounded-xl bg-cream-2 p-5">
          <p className="text-xs uppercase text-ink-soft">Esgotados</p>
          <p className="mt-1 font-display text-2xl font-semibold">{outOfStockCount}</p>
        </div>
        <div className="rounded-xl bg-cream-2 p-5">
          <p className="text-xs uppercase text-ink-soft">Pedidos pendentes</p>
          <p className="mt-1 font-display text-2xl font-semibold">{pendingOrders}</p>
        </div>
        <div className="rounded-xl bg-cream-2 p-5">
          <p className="text-xs uppercase text-ink-soft">Pedidos pagos</p>
          <p className="mt-1 font-display text-2xl font-semibold">{paidOrders}</p>
        </div>
        <div className="rounded-xl bg-cream-2 p-5">
          <p className="text-xs uppercase text-ink-soft">Faturamento</p>
          <p className="mt-1 font-display text-2xl font-semibold">
            {formatCents(revenue._sum.totalCents ?? 0)}
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-4 text-sm">
        <Link href="/admin/produtos/novo" className="text-rose-deep underline">
          + Novo produto
        </Link>
        <Link href="/admin/pedidos" className="text-rose-deep underline">
          Ver pedidos
        </Link>
        {tinyOk && (
          <form action={syncStockAction}>
            <button type="submit" className={btnClass("outline")}>
              Verificar / atualizar estoque no Tiny
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
