import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/money";
import { updateOrderStatus } from "@/app/actions/adminOrders";
import { btnClass } from "@/lib/ui";

const inputClass =
  "w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none focus:border-rose";

type Props = { params: Promise<{ id: string }> };

export default async function AdminPedidoPage({ params }: Props) {
  const { id } = await params;
  const order = await prisma.order.findUnique({ where: { id }, include: { items: true } });
  if (!order) notFound();

  const updateWithId = updateOrderStatus.bind(null, order.id);

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold">Pedido {order.orderNumber}</h1>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div>
          <h2 className="text-xs uppercase tracking-wide text-ink-soft">Cliente</h2>
          <p className="mt-1 text-sm">{order.customerName}</p>
          <p className="text-sm text-ink-soft">{order.customerEmail}</p>
          <p className="text-sm text-ink-soft">{order.customerPhone}</p>
          <p className="text-sm text-ink-soft">CPF: {order.customerDocument}</p>
        </div>
        <div>
          <h2 className="text-xs uppercase tracking-wide text-ink-soft">Entrega</h2>
          <p className="mt-1 text-sm">
            {order.shippingStreet}, {order.shippingNumber} {order.shippingComplement}
          </p>
          <p className="text-sm text-ink-soft">
            {order.shippingNeighborhood} — {order.shippingCity}/{order.shippingState}
          </p>
          <p className="text-sm text-ink-soft">CEP {order.shippingZip}</p>
          <p className="mt-1 text-sm text-ink-soft">Método: {order.shippingMethod || "—"}</p>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-line">
        <ul className="divide-y divide-line">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between px-4 py-3 text-sm">
              <span>
                {item.quantity}× {item.nameSnapshot}
              </span>
              <span>{formatCents(item.priceCentsSnapshot * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between border-t border-line px-4 py-3 text-sm text-ink-soft">
          <span>Frete</span>
          <span>{formatCents(order.shippingCostCents)}</span>
        </div>
        <div className="flex justify-between border-t border-line px-4 py-3 font-semibold">
          <span>Total</span>
          <span>{formatCents(order.totalCents)}</span>
        </div>
      </div>

      <div className="mt-6 text-sm text-ink-soft">
        <p>Pagamento (Mercado Pago): {order.mpStatus ?? "—"} {order.mpPaymentId && `(id ${order.mpPaymentId})`}</p>
      </div>

      <form action={updateWithId} className="mt-6 flex flex-wrap items-end gap-4">
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wide text-ink-soft">Status</label>
          <select name="status" defaultValue={order.status} className={inputClass}>
            <option value="pending">Pendente</option>
            <option value="paid">Pago</option>
            <option value="failed">Falhou</option>
            <option value="shipped">Enviado</option>
            <option value="cancelled">Cancelado</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wide text-ink-soft">
            Código de rastreio
          </label>
          <input
            name="trackingCode"
            defaultValue={order.trackingCode ?? ""}
            className={inputClass}
          />
        </div>
        <button type="submit" className={btnClass("primary")}>
          Salvar
        </button>
      </form>
    </div>
  );
}
