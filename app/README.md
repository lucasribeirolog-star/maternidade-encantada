# Maternidade Encantada — Loja (custom)

Loja própria construída do zero (sem Shopify), com Next.js + Prisma. Meio de
pagamento: Mercado Pago. Frete: Melhor Envio.

## Rodando localmente

```bash
npm install
npm run seed   # cria categorias, produtos de exemplo e o usuário admin
npm run dev
```

Acesse `http://localhost:3000`. Admin em `http://localhost:3000/admin`
(login criado pelo seed — veja o e-mail/senha impressos no terminal após
rodar `npm run seed`, ou configure `SEED_ADMIN_EMAIL`/`SEED_ADMIN_PASSWORD`
no `.env` antes de rodar).

## O que já funciona

- Loja: home, listagem de produtos, página de produto, carrinho persistido
  por cookie de sessão.
- Checkout: formulário de endereço, cálculo de frete real via Melhor Envio,
  criação de pedido.
- Pagamento: Payment Brick da Mercado Pago (cartão, Pix, boleto), com
  confirmação via webhook.
- Admin: login protegido, CRUD de produtos (com upload de foto), lista e
  detalhe de pedidos (status, código de rastreio).

Sem as chaves de API configuradas, o checkout mostra mensagens claras
("Melhor Envio não configurado", "Mercado Pago não configurado") em vez de
quebrar — dá pra navegar a loja inteira mesmo antes de conectar as contas.

## Configurando as integrações

Copie `.env.example` para `.env` e preencha:

### Mercado Pago
1. Crie/acesse sua conta em https://www.mercadopago.com.br
2. Vá em **Seu negócio → Configurações → Credenciais** (ou
   https://www.mercadopago.com.br/developers/panel/app)
3. Copie o **Access Token** → `MERCADOPAGO_ACCESS_TOKEN`
4. Copie a **Public Key** → `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY`
5. Configure a URL de notificação (webhook) apontando para
   `https://seu-dominio.com.br/api/webhooks/mercadopago`

Use as credenciais de **teste** primeiro (o painel da Mercado Pago gera um
par de chaves de teste automaticamente) para validar o fluxo com cartões de
teste antes de trocar para produção.

### Melhor Envio
1. Crie uma conta em https://sandbox.melhorenvio.com.br (ambiente de teste,
   não precisa de dados reais) ou https://melhorenvio.com.br (produção)
2. Gere um token de API em **Configurações → Tokens**
3. Preencha `MELHOR_ENVIO_TOKEN` e o CEP de onde os pedidos serão enviados
   em `MELHOR_ENVIO_FROM_ZIP`
4. Mantenha `MELHOR_ENVIO_SANDBOX=true` até migrar para produção

## Banco de dados

Em desenvolvimento usamos SQLite (arquivo `dev.db`, zero configuração). Para
produção, troque `DATABASE_URL` para um Postgres gerenciado (ex:
[Neon](https://neon.tech) ou [Supabase](https://supabase.com), ambos com
plano gratuito) e rode:

```bash
npx prisma migrate deploy
```

## Deploy (Vercel)

1. Em https://vercel.com, **Add New → Project**, importe o repositório
   `maternidade-encantada` do GitHub.
2. Em **Root Directory**, selecione `app` (o projeto Next.js fica dentro
   dessa subpasta, não na raiz do repositório).
3. Em **Environment Variables**, adicione as mesmas variáveis do `.env`
   (`DATABASE_URL` já apontando para o Postgres de produção, chaves da
   Mercado Pago e Melhor Envio, `ADMIN_SESSION_SECRET`).
4. Depois do primeiro deploy, rode as migrations contra o banco de produção
   (localmente, com `DATABASE_URL` de produção no `.env`):
   ```bash
   npx prisma migrate deploy
   ```
5. Em **Settings → Domains**, adicione `maternidadeencantada.com.br` —
   a Vercel mostra os registros DNS exatos para colar no painel do
   Registro.br.

## Fotos de produto

Em desenvolvimento, o upload de imagem no admin salva os arquivos em
`public/uploads/`. **Isso não funciona em produção na Vercel** (o
filesystem é somente leitura em funções serverless) — antes de ir para
produção, trocar `saveUploadedImage` em
`src/app/actions/adminProducts.ts` por armazenamento externo, como o
[Vercel Blob](https://vercel.com/docs/storage/vercel-blob) ou o
[Cloudinary](https://cloudinary.com) (ambos com plano gratuito).
