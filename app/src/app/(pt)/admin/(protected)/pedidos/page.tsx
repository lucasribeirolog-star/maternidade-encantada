import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/money";

const STATUS_LABEL: Record<string, string> = {
  pending: "Pendente",
  paid: "Pago",
  failed: "Falhou",
  shipped: "Enviado",
  cancelled: "Cancelado",
};

export default async function AdminPedidosPage() {
  const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="text-2xl font-semibold">Pedidos</h1>

      <div className="mt-6 max-w-full overflow-x-auto rounded-xl border border-line">
        <table className="w-full text-sm">
          <thead className="bg-cream-2 text-left text-xs uppercase text-ink-soft">
            <tr>
              <th className="px-4 py-3">Pedido</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Data</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-cream-2">
                <td className="px-4 py-3">
                  <Link href={`/admin/pedidos/${order.id}`} className="text-rose-deep underline">
                    {order.orderNumber}
                  </Link>
                </td>
                <td className="px-4 py-3">{order.customerName}</td>
                <td className="px-4 py-3">{STATUS_LABEL[order.status] ?? order.status}</td>
                <td className="px-4 py-3">{formatCents(order.totalCents)}</td>
                <td className="px-4 py-3 text-ink-soft">
                  {order.createdAt.toLocaleDateString("pt-BR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <p className="p-6 text-sm text-ink-soft">Nenhum pedido ainda.</p>
        )}
      </div>
    </div>
  );
}
