"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";

declare global {
  interface Window {
    MercadoPago?: new (publicKey: string, options?: { locale?: string }) => {
      bricks: () => {
        create: (
          type: string,
          containerId: string,
          settings: Record<string, unknown>
        ) => Promise<unknown>;
      };
    };
  }
}

const PUBLIC_KEY = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY;

type Props = {
  orderId: string;
  totalReais: number;
  payerEmail: string;
};

export function PaymentBrick({ orderId, totalReais, payerEmail }: Props) {
  const router = useRouter();
  const [sdkReady, setSdkReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(false);

  useEffect(() => {
    if (!sdkReady || !PUBLIC_KEY || mounted.current) return;
    if (!window.MercadoPago) return;
    mounted.current = true;

    const mp = new window.MercadoPago(PUBLIC_KEY, { locale: "pt-BR" });
    mp.bricks()
      .create("payment", "payment-brick-container", {
        initialization: { amount: totalReais, payer: { email: payerEmail } },
        customization: {
          paymentMethods: {
            creditCard: "all",
            debitCard: "all",
            bankTransfer: "all",
            ticket: "all",
          },
        },
        callbacks: {
          onReady: () => {},
          onError: (brickError: unknown) => {
            setError("Não foi possível carregar o pagamento. Tente novamente.");
            console.error(brickError);
          },
          onSubmit: async ({ formData }: { formData: Record<string, unknown> }) => {
            const res = await fetch("/api/checkout/pagar", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ orderId, ...formData }),
            });
            const data = await res.json();
            if (!res.ok) {
              setError(data.error || "Pagamento recusado. Tente novamente.");
              return;
            }
            router.push(`/pedido/${orderId}/confirmacao`);
          },
        },
      })
      .catch((err: unknown) => {
        console.error(err);
        setError("Não foi possível carregar o pagamento.");
      });
  }, [sdkReady, orderId, totalReais, payerEmail, router]);

  if (!PUBLIC_KEY) {
    return (
      <div className="rounded-xl border border-line bg-cream-2 p-6 text-sm text-ink-soft">
        <p className="font-medium text-ink">Pagamento ainda não configurado</p>
        <p className="mt-2">
          O checkout está pronto, mas falta configurar a chave pública do Mercado Pago
          (<code>NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY</code> no <code>.env</code>). Assim que a
          conta do Mercado Pago for conectada, essa tela passa a mostrar o pagamento normalmente.
        </p>
      </div>
    );
  }

  return (
    <>
      <Script
        src="https://sdk.mercadopago.com/js/v2"
        onLoad={() => setSdkReady(true)}
        strategy="afterInteractive"
      />
      {error && <p className="mb-4 text-sm text-rose-deep">{error}</p>}
      <div id="payment-brick-container" />
    </>
  );
}
