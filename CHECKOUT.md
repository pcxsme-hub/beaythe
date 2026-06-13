# Checkout & Pagamentos (Stripe) — Beauthé

Checkout **real** integrado com **Stripe Checkout (hospedado)**. Uma só integração cobre
**cartão, Bizum (ES), Klarna, Multibanco e MB WAY (PT)**. O Stripe hospeda a página de
pagamento (PCI/segurança por conta deles); a loja só cria a sessão e redireciona.

## Como funciona (fluxo)
1. Cliente preenche o endereço no `/checkout` e clica **Confirmar e Pagar**.
2. Front → `POST /api/checkout/create-session` com `{ items:[{id,quantity}], customer, lang }`.
3. Worker **revalida os preços no D1** (nunca confia no preço do cliente), cria a `Order`
   com `status='pending_payment'` e cria uma **Checkout Session** no Stripe. Devolve `url`.
4. Front redireciona para a URL do Stripe → cliente paga.
5. Stripe chama `POST /api/checkout/webhook` → Worker confere a assinatura, marca a `Order`
   como `paid`, **baixa o estoque**, conta uso de cupom e envia e-mail de confirmação (Brevo).
6. Cliente volta para `/checkout/success?order=BH-XXXX`, que faz polling do status.

## Endpoints (Worker `lib/handler.js`)
| Método | Rota | Acesso | Função |
|---|---|---|---|
| POST | `/api/checkout/create-session` | público | cria pedido + sessão Stripe, devolve `url` |
| POST | `/api/checkout/webhook` | Stripe (assinado) | confirma pagamento, baixa estoque |
| GET | `/api/orders/:code` | público | status do pedido (página de sucesso) |
| GET | `/api/admin/orders` | admin | lista de pedidos |
| POST | `/api/admin/orders/:id/status` | admin | muda status logístico |

---

## Passo 1 — Criar a conta Stripe
1. Acesse <https://dashboard.stripe.com/register>, crie a conta (e-mail + país da empresa = **España** ou **Portugal**).
2. Em **test mode** você já pode integrar tudo sem ativar a conta. Para receber dinheiro de
   verdade (**live**), complete **Activate account** (dados da empresa, IBAN, etc.).

## Passo 2 — Ativar os métodos de pagamento
Dashboard → **Settings → Payment methods** e ative:
- **Cards** (Visa/Mastercard) — sempre.
- **Bizum** — só com entidade espanhola, moeda EUR. (ES)
- **Klarna** — pagar depois / em prestações.
- **Multibanco** e **MB WAY** — para Portugal (PT).
> O Checkout hospedado mostra **automaticamente** os métodos elegíveis que você ativar aqui —
> não é preciso mexer no código. (Multibanco/Multibanco é assíncrono: o pedido fica
> `pending_payment` até o cliente pagar a referência; o webhook então marca `paid`.)

## Passo 3 — Pegar a chave secreta e setar no Worker
Dashboard → **Developers → API keys** → copie a **Secret key**:
- Teste: `sk_test_...`  ·  Produção: `sk_live_...`

```bash
npx wrangler secret put STRIPE_SECRET_KEY -c wrangler.worker.jsonc
# cole sk_test_... (para testar) ou sk_live_... (produção)
```

## Passo 4 — Criar o webhook e setar o signing secret
Dashboard → **Developers → Webhooks → Add endpoint**:
- **Endpoint URL:** `https://beauthe.shop/api/checkout/webhook`
- **Events to send:**
  - `checkout.session.completed`
  - `checkout.session.async_payment_succeeded`
  - `checkout.session.async_payment_failed`
  - `checkout.session.expired`
- Salve → copie o **Signing secret** (`whsec_...`):

```bash
npx wrangler secret put STRIPE_WEBHOOK_SECRET -c wrangler.worker.jsonc
# cole whsec_...
```
> Sem `STRIPE_WEBHOOK_SECRET` o webhook ainda funciona, **mas não valida a assinatura**
> (inseguro). Sempre configure em produção.

## Passo 5 — (opcional) URL do site
Por padrão usa `https://beauthe.shop`. Para sobrescrever (ex.: staging), em
`wrangler.worker.jsonc` → `vars`: `"SITE_URL": "https://staging.beauthe.shop"`.

## Passo 6 — Deploy do Worker
```bash
npm run deploy:worker
```

## Passo 7 — Testar
1. Na loja, adicione um produto **real** (importado da Dropea / existente no D1) ao carrinho.
2. Vá ao checkout, preencha os dados, clique **Confirmar e Pagar**.
3. Na página do Stripe (test mode) use o cartão de teste **`4242 4242 4242 4242`**,
   validade futura, CVC qualquer.
4. Volte para `/checkout/success` → deve mostrar **Pago**. Confira em
   `Dashboard → Payments` e em `GET /api/admin/orders`.

## Passo 8 — Ir para produção (go-live)
1. Complete a ativação da conta no Stripe.
2. Troque os secrets pelas chaves **live**: repita os passos 3 e 4 com `sk_live_...` e o
   webhook **live** (`whsec_...` da aba *Live*). Rode `npm run deploy:worker`.

---

## Frontend da loja no ar (importante)
O `src/` deste repo é o **front antigo** e já está com o checkout funcional (botão ligado,
página de sucesso, rota `/checkout/success`). O front que está **no ar** em `beauthe.shop`
teve o fonte perdido (ver `BACKEND.md`), então o botão de pagar **só passa a funcionar no
site público** depois de **republicar o storefront a partir deste repo** (`npm run build` →
deploy no projeto Pages `beauthe`). O **Worker/API já fica 100% funcional** assim que você
fizer o deploy do Passo 6 — qualquer front que chame `POST /api/checkout/create-session`
passa a vender.

## Notas / pontos de configuração
- **Envio:** v1 está **grátis** (`shipping = 0`, coincide com a UI). Para cobrar envio,
  ajuste a linha `const shipping = 0;` em `checkoutCreateSession` (`lib/handler.js`).
- **Moeda:** EUR. **Cupons:** revalidados no servidor e aplicados como cupom único no Stripe.
- **Preço autoritativo:** o servidor sempre recalcula pelo `Product` do D1 — o preço enviado
  pelo cliente é ignorado (anti-fraude).
- **Estoque:** baixado só quando o pagamento confirma (no webhook), de forma idempotente.
