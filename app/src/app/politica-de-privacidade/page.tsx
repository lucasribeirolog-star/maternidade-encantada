import type { Metadata } from "next";

export const metadata: Metadata = { title: "Política de Privacidade" };

export default function PrivacidadePage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold">Política de Privacidade</h1>
      <p className="mt-2 text-xs text-ink-soft italic">
        Texto-modelo — revise com um advogado antes de publicar a loja.
      </p>

      <div className="prose-sm mt-8 space-y-6 text-ink-soft">
        <section>
          <h2 className="font-display text-lg font-semibold text-ink">1. Dados que coletamos</h2>
          <p className="mt-2">
            Ao fazer uma compra, coletamos nome, e-mail, telefone, CPF e endereço de entrega,
            necessários para processar seu pedido, calcular o frete e emitir a nota fiscal.
          </p>
        </section>
        <section>
          <h2 className="font-display text-lg font-semibold text-ink">2. Como usamos seus dados</h2>
          <p className="mt-2">
            Usamos seus dados exclusivamente para processar pedidos, calcular frete (via Melhor
            Envio), processar pagamentos (via Mercado Pago) e para comunicação sobre o status da
            sua compra. Não vendemos seus dados a terceiros.
          </p>
        </section>
        <section>
          <h2 className="font-display text-lg font-semibold text-ink">3. Compartilhamento com terceiros</h2>
          <p className="mt-2">
            Compartilhamos apenas os dados estritamente necessários com nossos parceiros de
            pagamento (Mercado Pago) e logística (Melhor Envio), para viabilizar sua compra e
            entrega.
          </p>
        </section>
        <section>
          <h2 className="font-display text-lg font-semibold text-ink">4. Seus direitos (LGPD)</h2>
          <p className="mt-2">
            Você pode solicitar acesso, correção ou exclusão dos seus dados pessoais a qualquer
            momento, entrando em contato pelos canais informados no rodapé do site.
          </p>
        </section>
        <section>
          <h2 className="font-display text-lg font-semibold text-ink">5. Cookies</h2>
          <p className="mt-2">
            Usamos um cookie técnico essencial para manter os itens do seu carrinho entre páginas.
            Ele não é usado para rastreamento ou publicidade.
          </p>
        </section>
      </div>
    </div>
  );
}
