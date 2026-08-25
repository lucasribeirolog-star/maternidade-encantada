import type { Metadata } from "next";

export const metadata: Metadata = { title: "Termos de Uso" };

export default function TermosPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold">Termos de Uso</h1>
      <p className="mt-2 text-xs text-ink-soft italic">
        Texto-modelo — revise com um advogado antes de publicar a loja.
      </p>

      <div className="prose-sm mt-8 space-y-6 text-ink-soft">
        <section>
          <h2 className="font-display text-lg font-semibold text-ink">1. Sobre a loja</h2>
          <p className="mt-2">
            Este site é operado pela Maternidade Encantada, especializada na venda de bonecas
            reborn artesanais.
          </p>
        </section>
        <section>
          <h2 className="font-display text-lg font-semibold text-ink">2. Pedidos e pagamento</h2>
          <p className="mt-2">
            Os pedidos são confirmados após a aprovação do pagamento, processado com segurança
            pelo Mercado Pago. Aceitamos cartão de crédito, Pix e boleto.
          </p>
        </section>
        <section>
          <h2 className="font-display text-lg font-semibold text-ink">3. Frete e prazos</h2>
          <p className="mt-2">
            O valor e o prazo de entrega são calculados no checkout de acordo com o seu CEP,
            através da Melhor Envio. Prazos são estimativas da transportadora.
          </p>
        </section>
        <section>
          <h2 className="font-display text-lg font-semibold text-ink">4. Peças artesanais</h2>
          <p className="mt-2">
            Cada boneca reborn é feita à mão — pequenas variações entre a foto e a peça final
            fazem parte da natureza artesanal do produto.
          </p>
        </section>
      </div>
    </div>
  );
}
