// Standalone Worker entrypoint — routed at beauthe.shop/api/* (overrides Pages for /api/*).
// Frontend (Pages static) stays untouched. Rollback = remove the route.
import { handle } from './lib/handler.js';

export default {
  fetch: (request, env, ctx) => handle(request, env),
};
