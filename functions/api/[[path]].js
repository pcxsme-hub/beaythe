// Cloudflare Pages Functions entry (alternative deploy path).
// NOTE: the LIVE deployment uses the standalone Worker (worker.js) routed at
// beauthe.shop/api/* — see BACKEND.md. All logic is shared in lib/handler.js.
import { handle } from '../../lib/handler.js';
export const onRequest = (context) => handle(context.request, context.env);
