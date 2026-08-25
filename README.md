# Maternidade Encantada

E-commerce da Maternidade Encantada (bonecas reborn).

## Estrutura

- **`app/`** — a loja em produção: aplicação própria (Next.js + Prisma),
  com Mercado Pago para pagamento e Melhor Envio para frete. Veja
  [`app/README.md`](app/README.md) para rodar localmente e configurar as
  integrações.
- **`theme/`** — tema Shopify (Dawn customizado) do plano inicial, guardado
  como referência/backup. Não está mais em desenvolvimento — o projeto
  seguiu para uma loja própria em vez de Shopify (decisão do usuário).
- **`brand-assets/`** — fotos e logo originais do Instagram
  @maternidadeencantadaoficial, usadas como fonte para as imagens da loja.

## Por onde começar

```bash
cd app
npm install
npm run seed
npm run dev
```

Veja [`app/README.md`](app/README.md) para o passo a passo completo,
incluindo como conectar as contas do Mercado Pago e da Melhor Envio.
