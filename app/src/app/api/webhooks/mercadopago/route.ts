import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getMercadoPagoPayment } from "@/lib/mercadoPago";
import { removeSoldProductsFromCarts } from "@/lib/cart";
import { syncOrderToTiny } from "@/lib/tiny";
import { sendOrderConfirmationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const paymentId = body?.data?.id ?? new URL(req.url).searchParams.get("data.id");

  if (!paymentId) {
    return NextResponse.json({ ok: true });
  }

  try {
    const payment = await getMercadoPagoPayment(String(paymentId));
    const orderId = payment.external_reference;
    if (!orderId) return NextResponse.json({ ok: true });

    const newStatus =
      payment.status === "approved"
        ? "paid"
        : payment.status === "rejected"
          ? "failed"
          : "pending";

    await prisma.order.update({
      where: { id: orderId },
      data: { mpPaymentId: String(payment.id), mpStatus: payment.status, status: newStatus },
    });

    if (newStatus === "paid") {
      const orderWithItems = await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      });
      if (orderWithItems) {
        await removeSoldProductsFromCarts(orderWithItems.items.map((item) => item.productId));
        await sendOrderConfirmationEmail(orderWithItems);
      }
      await syncOrderToTiny(orderId);
    }
  } catch (err) {
    console.error("Erro ao processar webhook Mercado Pago:", err);
  }

  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json({ ok: true });
}
