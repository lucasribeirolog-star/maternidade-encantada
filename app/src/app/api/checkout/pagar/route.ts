import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createMercadoPagoPayment, MercadoPagoNotConfiguredError } from "@/lib/mercadoPago";
import { getCartToken } from "@/lib/cart";
import { syncOrderToTiny } from "@/lib/tiny";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { orderId, token, payment_method_id, issuer_id, installments, payer } = body;

  if (!orderId) {
    return NextResponse.json({ error: "Pedido inválido." }, { status: 400 });
  }

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) {
    return NextResponse.json({ error: "Pedido não encontrado." }, { status: 404 });
  }
  if (order.status !== "pending") {
    return NextResponse.json({ error: "Este pedido já foi processado." }, { status: 409 });
  }

  try {
    const [firstName, ...rest] = order.customerName.split(" ");
    const payment = await createMercadoPagoPayment({
      orderId: order.id,
      orderNumber: order.orderNumber,
      totalCents: order.totalCents,
      payerEmail: payer?.email || order.customerEmail,
      payerFirstName: firstName || order.customerName,
      payerLastName: rest.join(" ") || order.customerName,
      payerDocument: payer?.identification?.number || order.customerDocument,
      paymentToken: token,
      paymentMethodId: payment_method_id,
      installments,
      issuerId: issuer_id,
    });

    const newStatus =
      payment.status === "approved"
        ? "paid"
        : payment.status === "rejected"
          ? "failed"
          : "pending";

    await prisma.order.update({
      where: { id: order.id },
      data: { mpPaymentId: String(payment.id), mpStatus: payment.status, status: newStatus },
    });

    if (newStatus === "paid") {
      const cartToken = await getCartToken();
      if (cartToken) {
        const cart = await prisma.cart.findUnique({ where: { token: cartToken } });
        if (cart) await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
      }
      await syncOrderToTiny(order.id);
    }

    return NextResponse.json({ status: payment.status });
  } catch (err) {
    if (err instanceof MercadoPagoNotConfiguredError) {
      return NextResponse.json({ error: err.message }, { status: 503 });
    }
    console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro ao processar pagamento." },
      { status: 500 }
    );
  }
}
