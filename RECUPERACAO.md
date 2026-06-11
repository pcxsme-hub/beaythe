# Recuperação do projeto Beauthé (ecommerce-espanha) — 09/06/2026

Documento de situação após a pasta `~/Downloads/ecommerce-espanha` ter sido apagada
e o projeto ter sido re-clonado do GitHub.

## TL;DR
- O código **que está no ar em `beauthe.shop`** foi recuperado e está no branch **`deployed`**.
- A parte de **segurança + e-mail + contas de cliente** descrita no relatório **NÃO foi encontrada**
  em nenhum código recuperável (provavelmente perdida com a pasta apagada).

## Branches
| Branch | Commit | Data | O que é |
|---|---|---|---|
| **`deployed`** ⭐ | `5404416` | 05/05/2026 | **EXATAMENTE o que está no ar** em beauthe.shop. Plataforma CMS de admin (5 fases) + LP engine. Branch de trabalho atual. |
| `main` | `dda1af5` | 16/04/2026 | Versão **ANTIGA**. ⚠️ **NÃO deployar** — seria retrocesso de ~3 semanas. |

## Remotes (GitHub)
- `origin` → https://github.com/repecontato-cmd/beaythe.git  — só tem `main` (16/04).
- `fork`   → https://github.com/pcxsme-hub/beaythe.git — tem o branch `fix/visual-audit-i18n-cleanup`
  (= o `deployed`/`5404416`). **É aqui que o código do ar está salvo.**

## Cloudflare
- Projeto **Pages `beauthe`** (conta repe.contato@gmail.com / `19f5c7d5...`).
- Domínios: `beauthe.pages.dev` e **`beauthe.shop`** (loja ao vivo).
- Deploy por **upload direto** (sem Git conectado) → o Cloudflare só guarda o **build compilado**, não o fonte.
- Todos os deploys de produção vêm do commit `5404416` (05/05). Login do `wrangler` já feito.

## Arquitetura
- **Frontend** (`src/`): Vite + React 19 SPA (BrowserRouter), Tailwind. Build: `npm run build` → `dist/`.
- **Backend** (`server/`): Node/Express + Prisma + **SQLite** (`dev.db`), node-cron, OpenAI.
  - ⚠️ **Não roda em Cloudflare Workers** sem migração (Express→Worker, SQLite→D1, cron→Cron Triggers).
  - O admin do frontend chama `http://localhost:3000/api` (hardcoded).

## Auditoria: RELATÓRIO vs código recuperado (`deployed`)
✅ **Existe** (PARTE 1 — painel admin, está no ar):
- CMS data-driven: cupons (`Coupon`), banners (`PromoBanner`), Tema & Branding (`ThemeConfig`:
  marca "Beauthé", cores, fontes), navegação + Outlet (`NavConfig`), textos do site (`SiteCopy`),
  Home Builder, Landing Engine, Products/Inventory/SEO, integração Dropea.

❌ **NÃO existe em nenhum código recuperável** (PARTE 2 + extras do relatório):
- 6 camadas de segurança (bcrypt, JWT, rate-limit, helmet, criptografia RGPD, e2e).
- Sistema de e-mail (Brevo / hello@beauthe.shop).
- Contas de cliente / login no servidor (sem modelo `User` no Prisma).
- Cupom de aniversário (15%), regras de senha + "ver senha", fix "visitante@beauthe".
- Pagamento real / gateway (checkout é só UI — MB WAY, Apple Pay, cartão são labels).
- Procurado em: todos os branches do GitHub, deploy no ar, Lixeira (vazia),
  Time Machine (sem snapshots), Spotlight (0 resultados). **Não achado.**

## Avisos importantes
- ⚠️ **Nunca deployar `main`** (versão de abril).
- Ao publicar o SPA, **adicionar `public/_redirects`** com `/*  /index.html  200`
  (BrowserRouter precisa; sem isso, links diretos/refresh dão 404). Não vem no código.
- Não commitar `.env` (DATABASE_URL, chaves OpenAI/Dropea).

## Como rodar local
```bash
# Frontend (porta 5174)
npm install
npm run dev

# Backend (porta 3000) — precisa de server/.env com DATABASE_URL e chaves
cd server
npm install
npx prisma generate
npm run dev
```

## Próximos passos em aberto (decidir depois)
1. **Caçar a versão perdida** (segurança/e-mail): Google AI Studio, histórico do Antigravity,
   Google Drive/iCloud, outro computador, ou a ferramenta de IA que gerou o código.
2. **Reconstruir** segurança + e-mail por cima do `deployed`, se a versão perdida não aparecer.
