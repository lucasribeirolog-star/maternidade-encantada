import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/money";
import type { Order, OrderItem } from "@prisma/client";

export function isEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

function firstName(fullName: string) {
  return fullName.trim().split(" ")[0] || fullName;
}

const FROM = process.env.RESEND_FROM_EMAIL || "Maternidade Encantada <onboarding@resend.dev>";

const wrapper = (title: string, bodyHtml: string) => `
<!DOCTYPE html>
<html lang="pt-BR">
  <body style="margin:0;padding:0;background:#FDF6F1;font-family:Georgia,'Times New Roman',serif;color:#3E2723;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FDF6F1;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" style="max-width:520px;background:#ffffff;border-radius:16px;overflow:hidden;">
            <tr>
              <td style="background:#5C2A3A;padding:28px 32px;text-align:center;">
                <span style="color:#FDF6F1;font-size:20px;letter-spacing:0.04em;">Maternidade Encantada</span>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                <h1 style="margin:0 0 16px;font-size:22px;color:#5C2A3A;">${title}</h1>
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px;background:#F7E6E0;text-align:center;font-size:12px;color:#6B4A44;">
                Maternidade Encantada — Shopping Iguatemi Esplanada, Sorocaba - SP<br />
                WhatsApp: +55 11 99135-2246
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

type OrderWithItems = Order & { items: OrderItem[] };

export async function sendOrderConfirmationEmail(order: OrderWithItems) {
  const resend = getResend();
  if (!resend) return;
  if (order.confirmationEmailSentAt) return;

  const itemsHtml = order.items
    .map(
      (item) =>
        `<tr><td style="padding:6px 0;color:#6B4A44;">${item.quantity}× ${item.nameSnapshot}</td><td style="padding:6px 0;text-align:right;color:#6B4A44;">${formatCents(item.priceCentsSnapshot * item.quantity)}</td></tr>`
    )
    .join("");

  const html = wrapper(
    "Recebemos seu pagamento! 💖",
    `
      <p style="line-height:1.6;">Olá, ${firstName(order.customerName)}!</p>
      <p style="line-height:1.6;">
        Recebemos a confirmação do seu pagamento e gostaríamos de agradecer pela sua compra na
        <strong>Maternidade Encantada</strong>. 💖
      </p>
      <p style="line-height:1.6;">
        Seu pedido já foi encaminhado para nossa equipe e está em processo de separação para envio.
        Estamos preparando tudo com muito carinho para que sua experiência seja a melhor possível.
      </p>
      <p style="line-height:1.6;">
        Assim que seu pedido for despachado, você receberá uma nova atualização com as informações
        de rastreamento.
      </p>
      <p style="margin:24px 0 8px;font-size:13px;color:#6B4A44;text-transform:uppercase;letter-spacing:0.06em;">
        Pedido ${order.orderNumber}
      </p>
      <table role="presentation" width="100%" style="border-top:1px solid #eee;padding-top:8px;font-size:14px;">
        ${itemsHtml}
        <tr>
          <td style="padding-top:10px;border-top:1px solid #eee;font-weight:bold;color:#5C2A3A;">Total</td>
          <td style="padding-top:10px;border-top:1px solid #eee;text-align:right;font-weight:bold;color:#5C2A3A;">${formatCents(order.totalCents)}</td>
        </tr>
      </table>
      <p style="line-height:1.6;margin-top:24px;">
        Agradecemos pela confiança e por escolher a Maternidade Encantada para fazer parte desse
        momento tão especial.
      </p>
      <p style="line-height:1.6;">
        Atenciosamente,<br />
        <em>Equipe Maternidade Encantada</em>
      </p>
    `
  );

  await resend.emails.send({
    from: FROM,
    to: order.customerEmail,
    subject: `Pedido ${order.orderNumber} confirmado — Maternidade Encantada`,
    html,
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { confirmationEmailSentAt: new Date() },
  });
}

export async function sendTrackingEmail(order: OrderWithItems) {
  const resend = getResend();
  if (!resend) return;
  if (order.trackingEmailSentAt || !order.trackingCode) return;

  const trackingUrl = `https://www.linkcorreios.com.br/?id=${encodeURIComponent(order.trackingCode)}`;

  const html = wrapper(
    "Seu pedido está a caminho! 📦",
    `
      <p style="line-height:1.6;">Olá, ${firstName(order.customerName)}!</p>
      <p style="line-height:1.6;">
        Seu pedido <strong>${order.orderNumber}</strong> foi despachado e já está a caminho do
        seu endereço.
      </p>
      <p style="margin:20px 0;padding:16px;background:#F7E6E0;border-radius:10px;text-align:center;">
        <span style="font-size:13px;color:#6B4A44;">Código de rastreamento</span><br />
        <strong style="font-size:18px;color:#5C2A3A;">${order.trackingCode}</strong>
      </p>
      <p style="text-align:center;">
        <a href="${trackingUrl}" style="display:inline-block;background:#C97B8C;color:#fff;padding:12px 28px;border-radius:999px;text-decoration:none;font-size:14px;">
          Rastrear pedido
        </a>
      </p>
      <p style="line-height:1.6;margin-top:24px;">
        Obrigada por escolher a Maternidade Encantada. 💖
      </p>
      <p style="line-height:1.6;">
        Atenciosamente,<br />
        <em>Equipe Maternidade Encantada</em>
      </p>
    `
  );

  await resend.emails.send({
    from: FROM,
    to: order.customerEmail,
    subject: `Seu pedido ${order.orderNumber} foi enviado — Maternidade Encantada`,
    html,
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { trackingEmailSentAt: new Date() },
  });
}
