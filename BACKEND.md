# Backend Beauthé — reconstruído (2026-06-11)

O fonte original do backend (Cloudflare Pages Functions) foi perdido junto com a pasta
`~/Downloads/ecommerce-espanha`. Este backend foi **reconstruído do zero** a partir do
contrato do frontend que está no ar + o schema real do D1, e está **rodando em produção**.

## Bug que motivou a reconstrução
O backend antigo fazia hash de senha com **PBKDF2 a 210.000 iterações**, acima do limite
de **100.000** do Cloudflare Workers → `register`/`login`/`admin/setup` davam **500
"Error interno"**. Aqui o PBKDF2 está fixado em **100.000** (`lib/handler.js`, `PBKDF2_ITER`).

## Como está deployado
- **Worker standalone** `beauthe-api`, na rota **`beauthe.shop/api/*`** (tem precedência
  sobre o Pages para `/api/*`). O **frontend** continua servido pelo projeto **Pages
  `beauthe`** (intocado).
- Banco: **D1 `beauthe-db`** (`995d7836-8255-4499-aa6a-26870c62eab2`), bound como `DB`.

## Arquivos
| Arquivo | Função |
|---|---|
| `lib/handler.js` | **Toda a lógica** (auth admin, auth cliente, CMS). Fonte da verdade. |
| `worker.js` | Entrypoint do Worker (deploy ativo) → chama `handle()`. |
| `functions/api/[[path]].js` | Entrypoint Pages Functions (alternativo) → chama `handle()`. |
| `lib/data-nav.js` · `lib/data-home.js` · `lib/data-copy.js` | Defaults do CMS (nav, home, textos). |
| `wrangler.worker.jsonc` | Config do Worker (D1 + rota). **É o que vai pra produção.** |
| `wrangler.jsonc` | Config Pages (usada só p/ `wrangler pages dev` local). |
| `schema.sql` | Schema completo do D1 (export). |

## Deploy / rollback
```bash
# Deploy (produção)
npx wrangler deploy -c wrangler.worker.jsonc

# Testar local com D1 local
npx wrangler d1 execute beauthe-db --local --file ./schema.sql   # 1x: cria as tabelas
npx wrangler pages dev                                           # http://127.0.0.1:8788

# Rollback total (volta tudo pro estado anterior)
#   remover a rota beauthe.shop/api/* no painel, ou:
npx wrangler delete beauthe-api
```

## Endpoints
- **Admin:** `/api/admin/status` · `/setup` · `/login` · `/me` · `/logout` (tabela `AdminUser`).
- **Cliente:** `/api/auth/register` · `/login` · `/me` · `/logout` · `/profile` · `/orders` ·
  `/request-reset` · `/reset-password` · `/verify-email` · `/resend-verification` (tabela `User`).
- **CMS:** `/api/theme` · `/nav` · `/home` · `/site-copy` · `/settings` · `/products` ·
  `/marketing/coupons` · `/marketing/banners` · `/landing/*`. Reads públicos; writes exigem admin.
- **Checkout/Pagamento (Stripe):** `/api/checkout/create-session` (POST, público) ·
  `/api/checkout/webhook` (POST, assinado pelo Stripe) · `/api/orders/:code` (GET, público) ·
  `/api/admin/orders` (GET) · `/api/admin/orders/:id/status` (POST). Ver **`CHECKOUT.md`**.

## Ver/gerenciar usuários
Painel Cloudflare → **D1 → beauthe-db → Console**:
```sql
SELECT id, username, role, last_login_at, createdAt FROM AdminUser;  -- admins
SELECT id, email, name, email_verified, createdAt FROM User;          -- clientes
```

## Pendências conhecidas
- **Pagamento (Stripe) — setar secrets p/ vender:** `STRIPE_SECRET_KEY` e `STRIPE_WEBHOOK_SECRET`.
  Sem eles, `create-session` responde 503 ("configura STRIPE_SECRET_KEY") e nenhuma compra é
  cobrada. Passo-a-passo completo em **`CHECKOUT.md`**. (Front da loja no ar só passa a ter o
  botão funcional após republicar o storefront a partir deste repo — fonte do front em produção
  foi perdido; o Worker/API fica 100% funcional só com o deploy + secrets.)
- **Segredos do Worker não setados:** `ENCRYPTION_KEY` (criptografa `User.email_enc` p/ RGPD)
  e `BREVO_API_KEY`/`EMAIL_FROM` (envio de e-mail de verificação/recuperação do cliente).
  Sem eles, o cadastro de cliente funciona mas o e-mail de verificação não é enviado e o
  `email_enc` fica nulo. O **admin não depende disso**. Para ativar:
  `npx wrangler secret put ENCRYPTION_KEY -c wrangler.worker.jsonc` (idem BREVO_API_KEY, EMAIL_FROM).
- **Importação Dropea / landing regenerate / SEO sync** estão como stub (503/no-op) — dependiam
  de serviços externos do backend antigo que não foram reconstruídos.
- O `src/` deste repo é o **frontend antigo** (login localStorage). O frontend que está no ar
  (com `/admin-core-sys`) é mais novo e teve o fonte perdido; vive só compilado no Pages.
