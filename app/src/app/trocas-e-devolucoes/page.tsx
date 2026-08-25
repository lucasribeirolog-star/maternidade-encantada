import type { Metadata } from "next";

export const metadata: Metadata = { title: "Trocas e Devoluções" };

export default function TrocasPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold">Trocas e Devoluções</h1>
      <p className="mt-2 text-xs text-ink-soft italic">
        Texto-modelo — revise com um advogado antes de publicar a loja.
      </p>

      <div className="prose-sm mt-8 space-y-6 text-ink-soft">
        <section>
          <h2 className="font-display text-lg font-semibold text-ink">
            Direito de arrependimento (7 dias)
          </h2>
          <p className="mt-2">
            Conforme o Código de Defesa do Consumidor (art. 49), você pode desistir da compra em
            até 7 dias corridos após o recebimento do produto, sem precisar justificar o motivo.
            O valor pago é reembolsado integralmente, incluindo o frete.
          </p>
        </section>
        <section>
          <h2 className="font-display text-lg font-semibold text-ink">Produto com defeito</h2>
          <p className="mt-2">
            Se sua boneca reborn chegar com algum defeito de fabricação, entre em contato pelos
            canais informados no rodapé em até 7 dias após o recebimento, com fotos do problema,
            para avaliarmos troca ou reembolso.
          </p>
        </section>
        <section>
          <h2 className="font-display text-lg font-semibold text-ink">Como solicitar</h2>
          <p className="mt-2">
            Envie um e-mail com o número do pedido explicando o motivo da troca/devolução. Vamos
            te orientar sobre o envio de volta e o reembolso.
          </p>
        </section>
      </div>
    </div>
  );
}
