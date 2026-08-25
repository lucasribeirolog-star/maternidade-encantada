import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/money";
import { PaymentBrick } from "@/components/PaymentBrick";

export const metadata: Metadata = { title: "Pagamento" };

type Props = { params: Promise<{ id: string }> };

export default async function PagamentoPage({ params }: Props) {
  const { id } = await params;
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) notFound();
  if (order.status !== "pending") redirect(`/pedido/${order.id}/confirmacao`);

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-3xl font-semibold">Pagamento</h1>
      <p className="mt-2 text-ink-soft">
        Pedido <strong>{order.orderNumber}</strong> — total{" "}
        <strong>{formatCents(order.totalCents)}</strong>
      </p>

      <div className="mt-8">
        <PaymentBrick
          orderId={order.id}
          totalReais={order.totalCents / 100}
          payerEmail={order.customerEmail}
        />
      </div>
    </div>
  );
}
