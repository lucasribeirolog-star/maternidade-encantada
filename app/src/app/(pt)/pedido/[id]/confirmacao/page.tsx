import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/money";
import { btnClass } from "@/lib/ui";
import { PixCopyButton } from "@/components/PixCopyButton";

export const metadata: Metadata = { title: "Confirmação do pedido" };

type Props = { params: Promise<{ id: string }> };

const STATUS_LABEL: Record<string, { label: string; tone: string }> = {
  pending: { label: "Aguardando confirmação do pagamento", tone: "text-gold" },
  paid: { label: "Pagamento confirmado", tone: "text-green-700" },
  failed: { label: "Pagamento recusado", tone: "text-rose-deep" },
  shipped: { label: "Pedido enviado", tone: "text-green-700" },
  cancelled: { label: "Pedido cancelado", tone: "text-rose-deep" },
};

export default async function ConfirmacaoPage({ params }: Props) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });
  if (!order) notFound();

  const status = STATUS_LABEL[order.status] ?? STATUS_LABEL.pending;
  const showPix = order.status === "pending" && order.mpPixQrCode && order.mpPixQrCodeBase64;

  return (
    <div className="mx-auto max-w-2xl px-6 py-16 text-center">
      <span className={`text-sm font-medium ${status.tone}`}>{status.label}</span>
      <h1 className="mt-3 text-3xl font-semibold">Pedido {order.orderNumber}</h1>

      {showPix && (
        <div className="mt-8 rounded-2xl border border-line bg-white p-6 text-left">
          <h2 className="text-center font-display text-lg font-semibold">
            Pague com Pix para confirmar seu pedido
          </h2>
          <p className="mt-2 text-center text-sm text-ink-soft">
            Escaneie o QR Code com o app do seu banco ou copie o código abaixo.
          </p>
          <div className="mt-5 flex justify-center">
            <Image
              src={`data:image/png;base64,${order.mpPixQrCodeBase64}`}
              alt="QR Code Pix"
              width={220}
              height={220}
              unoptimized
              className="h-56 w-56 rounded-xl border border-line"
            />
          </div>
          <div className="mt-5">
            <PixCopyButton code={order.mpPixQrCode!} />
          </div>
          {order.mpPixExpiresAt && (
            <p className="mt-3 text-center text-xs text-ink-soft">
              Código válido até{" "}
              {order.mpPixExpiresAt.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}
            </p>
          )}
        </div>
      )}

      <div className="mt-8 rounded-2xl bg-cream-2 p-6 text-left">
        <ul className="space-y-2 text-sm">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between text-ink-soft">
              <span>
                {item.quantity}× {item.nameSnapshot}
              </span>
              <span>{formatCents(item.priceCentsSnapshot * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t border-line pt-4 text-sm text-ink-soft">
          <span>Frete ({order.shippingMethod || "a definir"})</span>
          <span>{formatCents(order.shippingCostCents)}</span>
        </div>
        <div className="mt-2 flex justify-between font-display text-lg font-semibold">
          <span>Total</span>
          <span>{formatCents(order.totalCents)}</span>
        </div>
      </div>

      <Link href="/produtos" className={`${btnClass("primary")} mt-8`}>
        Continuar comprando
      </Link>
    </div>
  );
}
