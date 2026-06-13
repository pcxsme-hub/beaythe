// Beauthé backend — rebuilt as Cloudflare Pages Functions.
// Root-cause fix: PBKDF2 capped at 100000 iterations (Cloudflare Workers limit).
import { DEFAULT_TOP_NAV, DEFAULT_MEGA_MENU, DEFAULT_FOOTER_COLUMNS } from './data-nav.js';
import { DEFAULT_HOME_SECTIONS } from './data-home.js';
import { SITE_COPY_DEFAULTS, SITE_COPY_GROUPS } from './data-copy.js';
import { ADMIN_UI_HTML } from './admin-ui.js';
import { MENU_INJECT } from './menu-inject.js';
import { ANALYTICS_UI_HTML } from './analytics-ui.js';
import { LOGIN_UI_HTML } from './login-ui.js';

const enc = new TextEncoder();
const ERR_INT = 'Error interno. Inténtalo de nuevo en unos momentos.';
const json = (data, status = 200, headers = {}) =>
  new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8', ...headers } });
const err = (msg, status = 400, headers = {}) => json({ error: msg }, status, headers);
class HttpError extends Error { constructor(status, msg) { super(msg); this.status = status; } }

const b64 = (bytes) => btoa(String.fromCharCode(...new Uint8Array(bytes)));
const unb64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
const hex = (bytes) => [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2, '0')).join('');
async function sha256hex(str) { return hex(await crypto.subtle.digest('SHA-256', enc.encode(str))); }
const safeJSON = (s, fb) => { if (s == null) return fb; if (typeof s !== 'string') return s; try { return JSON.parse(s); } catch { return fb; } };
const nowMs = () => Date.now();
async function readBody(req) { try { return await req.json(); } catch { return {}; } }

// ---------- password hashing (PBKDF2-SHA256, <=100k iterations) ----------
const PBKDF2_ITER = 100000;
async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const km = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: PBKDF2_ITER, hash: 'SHA-256' }, km, 256);
  return `pbkdf2_sha256$${PBKDF2_ITER}$${b64(salt)}$${b64(bits)}`;
}
async function verifyPassword(password, stored) {
  try {
    const [scheme, iterStr, saltB64, hashB64] = String(stored).split('$');
    if (scheme !== 'pbkdf2_sha256') return false;
    const iterations = Math.min(parseInt(iterStr, 10) || PBKDF2_ITER, PBKDF2_ITER);
    const km = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
    const bits = new Uint8Array(await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: unb64(saltB64), iterations, hash: 'SHA-256' }, km, 256));
    const want = unb64(hashB64);
    if (bits.length !== want.length) return false;
    let diff = 0; for (let i = 0; i < bits.length; i++) diff |= bits[i] ^ want[i];
    return diff === 0;
  } catch { return false; }
}

// ---------- email encryption (AES-GCM, RGPD email_enc) ----------
async function aesKey(env) {
  const secret = env.ENCRYPTION_KEY || '';
  if (!secret) return null;
  const raw = await crypto.subtle.digest('SHA-256', enc.encode(secret));
  return crypto.subtle.importKey('raw', raw, 'AES-GCM', false, ['encrypt', 'decrypt']);
}
async function encryptEmail(env, email) {
  try {
    const key = await aesKey(env); if (!key) return null;
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(email));
    return `${b64(iv)}:${b64(ct)}`;
  } catch { return null; }
}

// ---------- sessions (DB-backed) ----------
const COOKIE = 'bh_sess';
const SESSION_TTL = 1000 * 60 * 60 * 24 * 30;
function parseCookies(req) {
  const o = {}; (req.headers.get('cookie') || '').split(';').forEach((p) => { const i = p.indexOf('='); if (i > 0) o[p.slice(0, i).trim()] = decodeURIComponent(p.slice(i + 1).trim()); });
  return o;
}
const setCookie = (t) => `${COOKIE}=${t}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${SESSION_TTL / 1000}`;
const clearCookie = () => `${COOKIE}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`;
async function createSession(env, userType, userId, req) {
  const token = hex(crypto.getRandomValues(new Uint8Array(32)));
  const t = nowMs();
  await env.DB.prepare('INSERT INTO Session (token_hash, user_type, user_id, ip, user_agent, createdAt, expires_at) VALUES (?,?,?,?,?,?,?)')
    .bind(await sha256hex(token), userType, userId, req.headers.get('cf-connecting-ip') || null, (req.headers.get('user-agent') || '').slice(0, 255), t, t + SESSION_TTL).run();
  return token;
}
async function getSession(env, req) {
  const token = parseCookies(req)[COOKIE];
  if (!token) return null;
  const row = await env.DB.prepare('SELECT user_type, user_id, expires_at FROM Session WHERE token_hash=?').bind(await sha256hex(token)).first();
  if (!row || row.expires_at < nowMs()) return null;
  return { userType: row.user_type, userId: row.user_id };
}
async function destroySession(env, req) {
  const token = parseCookies(req)[COOKIE];
  if (token) await env.DB.prepare('DELETE FROM Session WHERE token_hash=?').bind(await sha256hex(token)).run();
}
async function requireAdmin(env, req) {
  const s = await getSession(env, req);
  if (!s || s.userType !== 'admin') throw new HttpError(401, 'No autorizado. Inicia sesión en el panel.');
  return s;
}

// ---------- d1 singleton config helpers ----------
async function getRow(env, table, id = 1) { return env.DB.prepare(`SELECT * FROM ${table} WHERE id=?`).bind(id).first(); }
const isoOrNull = (v) => (v ? String(v) : null);

// =================== ADMIN AUTH ===================
async function adminStatus(env) {
  const row = await env.DB.prepare('SELECT COUNT(*) AS n FROM AdminUser').first();
  return json({ initialized: (row?.n || 0) > 0 });
}
async function adminSetup(env, req) {
  const exists = await env.DB.prepare('SELECT COUNT(*) AS n FROM AdminUser').first();
  if ((exists?.n || 0) > 0) return err('El administrador ya existe.', 409);
  const b = await readBody(req);
  const username = String(b.username || '').trim();
  const password = String(b.password || '');
  if (username.length < 3) return err('Usuario inválido (mínimo 3 caracteres).', 400);
  if (password.length < 8) return err('La contraseña debe tener al menos 8 caracteres.', 400);
  const res = await env.DB.prepare("INSERT INTO AdminUser (username, password_hash, role, createdAt) VALUES (?,?,'owner',?)")
    .bind(username, await hashPassword(password), nowMs()).run();
  const id = res.meta.last_row_id;
  const token = await createSession(env, 'admin', id, req);
  return json({ ok: true, admin: { id, username, role: 'owner' } }, 200, { 'set-cookie': setCookie(token) });
}
async function adminLogin(env, req) {
  const b = await readBody(req);
  const username = String(b.username || '').trim();
  const password = String(b.password || '');
  const u = await env.DB.prepare('SELECT * FROM AdminUser WHERE username=?').bind(username).first();
  if (!u) return err('Usuario o contraseña incorrectos.', 401);
  if (u.locked_until && u.locked_until > nowMs()) return err('Cuenta bloqueada temporalmente.', 423);
  if (!(await verifyPassword(password, u.password_hash))) {
    await env.DB.prepare('UPDATE AdminUser SET failed_attempts=failed_attempts+1 WHERE id=?').bind(u.id).run();
    return err('Usuario o contraseña incorrectos.', 401);
  }
  await env.DB.prepare('UPDATE AdminUser SET failed_attempts=0, last_login_at=? WHERE id=?').bind(nowMs(), u.id).run();
  const token = await createSession(env, 'admin', u.id, req);
  return json({ ok: true, admin: { id: u.id, username: u.username, role: u.role } }, 200, { 'set-cookie': setCookie(token) });
}
async function adminMe(env, req) {
  const s = await getSession(env, req);
  if (!s || s.userType !== 'admin') return err('No autorizado. Inicia sesión en el panel.', 401);
  const u = await env.DB.prepare('SELECT id, username, role, last_login_at, createdAt FROM AdminUser WHERE id=?').bind(s.userId).first();
  if (!u) return err('No autorizado. Inicia sesión en el panel.', 401);
  return json({ admin: u, username: u.username, role: u.role });
}
async function adminLogout(env, req) { await destroySession(env, req); return json({ ok: true }, 200, { 'set-cookie': clearCookie() }); }

// =================== CUSTOMER AUTH ===================
function publicUser(u) { return { id: u.id, email: u.email, name: u.name, birthday: u.birthday, email_verified: !!u.email_verified }; }
async function authRegister(env, req) {
  const b = await readBody(req);
  const email = String(b.email || '').trim().toLowerCase();
  const password = String(b.password || '');
  const name = b.name != null ? String(b.name).trim() : null;
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return err('Email inválido.', 400);
  if (password.length < 8 || !/[0-9]/.test(password)) return err('La contraseña debe tener mínimo 8 caracteres e incluir un número.', 400);
  const dup = await env.DB.prepare('SELECT id FROM User WHERE email=?').bind(email).first();
  if (dup) return err('Ya existe una cuenta con este email.', 409);
  const res = await env.DB.prepare('INSERT INTO User (email, password_hash, name, birthday, email_verified, createdAt, email_enc) VALUES (?,?,?,?,0,?,?)')
    .bind(email, await hashPassword(password), name, b.birthday || null, nowMs(), await encryptEmail(env, email)).run();
  const id = res.meta.last_row_id;
  try { await sendVerification(env, id, email); } catch {}
  const token = await createSession(env, 'user', id, req);
  return json({ ok: true, user: { id, email, name, email_verified: false } }, 200, { 'set-cookie': setCookie(token) });
}
async function authLogin(env, req) {
  const b = await readBody(req);
  const email = String(b.email || '').trim().toLowerCase();
  const password = String(b.password || '');
  const u = await env.DB.prepare('SELECT * FROM User WHERE email=?').bind(email).first();
  if (!u) return err('Email o contraseña incorrectos.', 401);
  if (u.locked_until && u.locked_until > nowMs()) return err('Cuenta bloqueada temporalmente.', 423);
  if (!(await verifyPassword(password, u.password_hash))) {
    await env.DB.prepare('UPDATE User SET failed_attempts=failed_attempts+1 WHERE id=?').bind(u.id).run();
    return err('Email o contraseña incorrectos.', 401);
  }
  await env.DB.prepare('UPDATE User SET failed_attempts=0, last_login_at=? WHERE id=?').bind(nowMs(), u.id).run();
  const token = await createSession(env, 'user', u.id, req);
  return json({ ok: true, user: publicUser(u) }, 200, { 'set-cookie': setCookie(token) });
}
async function requireUser(env, req) {
  const s = await getSession(env, req);
  if (!s || s.userType !== 'user') throw new HttpError(401, 'No autenticado.');
  return s;
}
async function authMe(env, req) {
  const s = await getSession(env, req);
  if (!s || s.userType !== 'user') return err('No autenticado.', 401);
  const u = await env.DB.prepare('SELECT * FROM User WHERE id=?').bind(s.userId).first();
  if (!u) return err('No autenticado.', 401);
  return json({ user: publicUser(u) });
}
async function authProfile(env, req) {
  const s = await requireUser(env, req);
  const b = await readBody(req);
  await env.DB.prepare('UPDATE User SET name=COALESCE(?,name), birthday=COALESCE(?,birthday) WHERE id=?')
    .bind(b.name ?? null, b.birthday ?? null, s.userId).run();
  const u = await env.DB.prepare('SELECT * FROM User WHERE id=?').bind(s.userId).first();
  return json({ user: publicUser(u) });
}
async function authOrders(env, req) {
  const s = await requireUser(env, req);
  const u = await env.DB.prepare('SELECT email FROM User WHERE id=?').bind(s.userId).first();
  const rows = await env.DB.prepare('SELECT * FROM "Order" WHERE email=? ORDER BY id DESC').bind(u?.email || '').all().catch(() => ({ results: [] }));
  return json({ orders: (rows.results || []).map((o) => ({ ...o, items: safeJSON(o.items, []) })) });
}
async function sendVerification(env, userId, email) {
  const token = hex(crypto.getRandomValues(new Uint8Array(24)));
  await env.DB.prepare('INSERT INTO EmailToken (user_id, token_hash, purpose, createdAt, expires_at) VALUES (?,?,?,?,?)')
    .bind(userId, await sha256hex(token), 'verify', nowMs(), nowMs() + 1000 * 60 * 60 * 24).run();
  await sendEmail(env, email, 'Verifica tu email · Beauthé', `Tu código de verificación: ${token}`);
}
async function sendEmail(env, to, subject, text) {
  if (!env.BREVO_API_KEY) return false;
  try {
    const r = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'api-key': env.BREVO_API_KEY, 'content-type': 'application/json' },
      body: JSON.stringify({ sender: { email: env.EMAIL_FROM || 'hello@beauthe.shop', name: 'Beauthé' }, to: [{ email: to }], subject, textContent: text }),
    });
    return r.ok;
  } catch { return false; }
}
async function authRequestReset(env, req) {
  const b = await readBody(req);
  const email = String(b.email || '').trim().toLowerCase();
  const u = await env.DB.prepare('SELECT id FROM User WHERE email=?').bind(email).first();
  if (u) {
    const token = hex(crypto.getRandomValues(new Uint8Array(24)));
    await env.DB.prepare('INSERT INTO EmailToken (user_id, token_hash, purpose, createdAt, expires_at) VALUES (?,?,?,?,?)')
      .bind(u.id, await sha256hex(token), 'reset', nowMs(), nowMs() + 1000 * 60 * 60).run();
    try { await sendEmail(env, email, 'Recupera tu contraseña · Beauthé', `Tu código de recuperación: ${token}`); } catch {}
  }
  return json({ ok: true, devUrl: null });
}
async function authResetPassword(env, req) {
  const b = await readBody(req);
  const token = String(b.token || '');
  const password = String(b.password || '');
  if (password.length < 8 || !/[0-9]/.test(password)) return err('Contraseña inválida.', 400);
  const row = await env.DB.prepare("SELECT * FROM EmailToken WHERE token_hash=? AND purpose='reset' AND used_at IS NULL").bind(await sha256hex(token)).first();
  if (!row || row.expires_at < nowMs()) return err('Token inválido o expirado.', 400);
  await env.DB.prepare('UPDATE User SET password_hash=? WHERE id=?').bind(await hashPassword(password), row.user_id).run();
  await env.DB.prepare('UPDATE EmailToken SET used_at=? WHERE id=?').bind(nowMs(), row.id).run();
  return json({ ok: true });
}
async function authVerifyEmail(env, req) {
  const b = await readBody(req);
  const token = String(b.token || '');
  const row = await env.DB.prepare("SELECT * FROM EmailToken WHERE token_hash=? AND purpose='verify' AND used_at IS NULL").bind(await sha256hex(token)).first();
  if (!row || row.expires_at < nowMs()) return err('Token inválido o expirado.', 400);
  await env.DB.prepare('UPDATE User SET email_verified=1 WHERE id=?').bind(row.user_id).run();
  await env.DB.prepare('UPDATE EmailToken SET used_at=? WHERE id=?').bind(nowMs(), row.id).run();
  return json({ ok: true });
}
async function authResend(env, req) {
  const s = await requireUser(env, req);
  const u = await env.DB.prepare('SELECT email, email_verified FROM User WHERE id=?').bind(s.userId).first();
  if (u && !u.email_verified) { try { await sendVerification(env, s.userId, u.email); } catch {} }
  return json({ ok: true });
}
async function authAccount(env, req) { // generic: GET=me-ish via POST? frontend posts; return user
  const s = await getSession(env, req);
  if (!s || s.userType !== 'user') return err('No autenticado.', 401);
  const u = await env.DB.prepare('SELECT * FROM User WHERE id=?').bind(s.userId).first();
  return json({ user: u ? publicUser(u) : null });
}

// =================== CMS ===================
// theme
const THEME_DEFAULTS = { brand_name: 'Beauthé', logo_url: null, favicon_url: null, color_primary: '#2C2826', color_accent: '#C4A49A', color_bg: '#FCFAF8', color_surface: '#F4EFEA', color_border: '#F1EBE6', color_text: '#5C534F', font_heading: 'Outfit', font_body: 'Outfit', radius_sm: 12, radius_md: 20, radius_lg: 32 };
async function themeGet(env) { const r = await getRow(env, 'ThemeConfig'); return json(r ? { ...THEME_DEFAULTS, ...r } : THEME_DEFAULTS); }
async function themePut(env, req) {
  const b = await readBody(req);
  const d = { ...THEME_DEFAULTS };
  for (const k of Object.keys(THEME_DEFAULTS)) if (b[k] !== undefined) d[k] = b[k];
  ['radius_sm', 'radius_md', 'radius_lg'].forEach((k) => { d[k] = parseInt(d[k], 10) || THEME_DEFAULTS[k]; });
  await env.DB.prepare(`INSERT INTO ThemeConfig (id,brand_name,logo_url,favicon_url,color_primary,color_accent,color_bg,color_surface,color_border,color_text,font_heading,font_body,radius_sm,radius_md,radius_lg,updatedAt) VALUES (1,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    ON CONFLICT(id) DO UPDATE SET brand_name=excluded.brand_name,logo_url=excluded.logo_url,favicon_url=excluded.favicon_url,color_primary=excluded.color_primary,color_accent=excluded.color_accent,color_bg=excluded.color_bg,color_surface=excluded.color_surface,color_border=excluded.color_border,color_text=excluded.color_text,font_heading=excluded.font_heading,font_body=excluded.font_body,radius_sm=excluded.radius_sm,radius_md=excluded.radius_md,radius_lg=excluded.radius_lg,updatedAt=excluded.updatedAt`)
    .bind(d.brand_name, d.logo_url, d.favicon_url, d.color_primary, d.color_accent, d.color_bg, d.color_surface, d.color_border, d.color_text, d.font_heading, d.font_body, d.radius_sm, d.radius_md, d.radius_lg, String(nowMs())).run();
  return themeGet(env);
}
// nav
async function navGet(env) {
  const r = await getRow(env, 'NavConfig');
  return json({ top_nav: safeJSON(r?.top_nav, null) || DEFAULT_TOP_NAV, mega_menu: safeJSON(r?.mega_menu, null) || DEFAULT_MEGA_MENU, footer: safeJSON(r?.footer, null) || DEFAULT_FOOTER_COLUMNS });
}
async function navPut(env, req) {
  const b = await readBody(req);
  await env.DB.prepare('INSERT INTO NavConfig (id,top_nav,mega_menu,footer,updatedAt) VALUES (1,?,?,?,?) ON CONFLICT(id) DO UPDATE SET top_nav=excluded.top_nav,mega_menu=excluded.mega_menu,footer=excluded.footer,updatedAt=excluded.updatedAt')
    .bind(JSON.stringify(b.top_nav || []), JSON.stringify(b.mega_menu || {}), JSON.stringify(b.footer || []), String(nowMs())).run();
  return navGet(env);
}
// home
async function homeGet(env) {
  const r = await getRow(env, 'HomeConfig');
  let sections = safeJSON(r?.sections, []);
  if (!Array.isArray(sections) || sections.length === 0) sections = DEFAULT_HOME_SECTIONS;
  else { const known = new Set(sections.map((s) => s.id)); for (const def of DEFAULT_HOME_SECTIONS) if (!known.has(def.id)) sections.push({ ...def, order: sections.length + 1 }); sections.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)); }
  return json({ sections });
}
async function homePut(env, req) {
  const b = await readBody(req);
  const normalized = (Array.isArray(b.sections) ? b.sections : []).map((s, i) => ({ ...s, order: i + 1 }));
  await env.DB.prepare('INSERT INTO HomeConfig (id,sections,updatedAt) VALUES (1,?,?) ON CONFLICT(id) DO UPDATE SET sections=excluded.sections,updatedAt=excluded.updatedAt')
    .bind(JSON.stringify(normalized), String(nowMs())).run();
  return json({ sections: normalized });
}
// settings
async function settingsGet(env) {
  let s = await getRow(env, 'StoreSettings');
  if (!s) { await env.DB.prepare('INSERT INTO StoreSettings (id,profit_margin_percent,fixed_shipping_cost,updatedAt) VALUES (1,30.0,7.0,?)').bind(String(nowMs())).run(); s = await getRow(env, 'StoreSettings'); }
  return json(s);
}
async function settingsPut(env, req) {
  const b = await readBody(req);
  await env.DB.prepare('INSERT INTO StoreSettings (id,profit_margin_percent,fixed_shipping_cost,updatedAt) VALUES (1,?,?,?) ON CONFLICT(id) DO UPDATE SET profit_margin_percent=excluded.profit_margin_percent,fixed_shipping_cost=excluded.fixed_shipping_cost,updatedAt=excluded.updatedAt')
    .bind(parseFloat(b.profit_margin_percent) || 0, parseFloat(b.fixed_shipping_cost) || 0, String(nowMs())).run();
  return settingsGet(env);
}
// site copy
async function copyBuildAll(env) {
  const rows = (await env.DB.prepare('SELECT * FROM SiteCopy').all()).results || [];
  const byKey = new Map(rows.map((r) => [r.key, r]));
  const out = {};
  for (const group of SITE_COPY_GROUPS) {
    const row = byKey.get(group.key); const def = SITE_COPY_DEFAULTS[group.key] || {}; const merged = {};
    for (const lang of ['es', 'pt', 'en']) merged[lang] = { ...(def[lang] || {}), ...(row ? safeJSON(row[`value_${lang}`], {}) : {}) };
    out[group.key] = merged;
  }
  return out;
}
async function copyPut(env, req, key) {
  const b = await readBody(req);
  await env.DB.prepare('INSERT INTO SiteCopy (key,value_es,value_pt,value_en,updatedAt) VALUES (?,?,?,?,?) ON CONFLICT(key) DO UPDATE SET value_es=excluded.value_es,value_pt=excluded.value_pt,value_en=excluded.value_en,updatedAt=excluded.updatedAt')
    .bind(key, JSON.stringify(b.es || {}), JSON.stringify(b.pt || {}), JSON.stringify(b.en || {}), String(nowMs())).run();
  return json((await copyBuildAll(env))[key]);
}
// products
async function productsList(env) { return json((await env.DB.prepare('SELECT * FROM Product').all()).results || []); }
async function productGet(env, id) { const r = await env.DB.prepare('SELECT * FROM Product WHERE id=?').bind(parseInt(id)).first(); return r ? json(r) : err('Produto não encontrado', 404); }
async function productPut(env, req, id) {
  const b = await readBody(req);
  const allowed = ['name', 'price', 'stock', 'description', 'image_url', 'category', 'product_type', 'tags', 'upsell_kits', 'landing_page_data', 'recommended_products', 'manual_price', 'placement', 'is_active'];
  const sets = [], vals = [];
  for (const k of allowed) if (b[k] !== undefined) { sets.push(`${k}=?`); let v = b[k]; if (typeof v === 'object' && v !== null) v = JSON.stringify(v); if (typeof v === 'boolean') v = v ? 1 : 0; vals.push(v); }
  if (sets.length) { sets.push('updatedAt=?'); vals.push(String(nowMs())); vals.push(parseInt(id)); await env.DB.prepare(`UPDATE Product SET ${sets.join(',')} WHERE id=?`).bind(...vals).run(); }
  return productGet(env, id);
}
// marketing — coupons
async function couponsList(env) { return json((await env.DB.prepare('SELECT * FROM Coupon ORDER BY id DESC').all()).results || []); }
async function couponUpsert(env, req) {
  const b = await readBody(req);
  if (!b.code) return err('code is required', 400);
  const code = String(b.code).toUpperCase().trim();
  const data = [code, b.description || null, parseFloat(b.discount_pct ?? 0), parseFloat(b.min_subtotal ?? 0), b.max_uses != null && b.max_uses !== '' ? parseInt(b.max_uses, 10) : null, isoOrNull(b.starts_at), isoOrNull(b.ends_at), b.enabled !== false ? 1 : 0, String(nowMs())];
  await env.DB.prepare(`INSERT INTO Coupon (code,description,discount_pct,min_subtotal,max_uses,starts_at,ends_at,enabled,createdAt,updatedAt) VALUES (?,?,?,?,?,?,?,?,?,?)
    ON CONFLICT(code) DO UPDATE SET description=excluded.description,discount_pct=excluded.discount_pct,min_subtotal=excluded.min_subtotal,max_uses=excluded.max_uses,starts_at=excluded.starts_at,ends_at=excluded.ends_at,enabled=excluded.enabled,updatedAt=excluded.updatedAt`)
    .bind(...data, data[8]).run();
  return json(await env.DB.prepare('SELECT * FROM Coupon WHERE code=?').bind(code).first());
}
async function couponValidate(env, code, subtotal) {
  code = String(code || '').toUpperCase().trim(); subtotal = parseFloat(subtotal || '0');
  const c = await env.DB.prepare('SELECT * FROM Coupon WHERE code=?').bind(code).first();
  if (!c) return json({ valid: false, error: 'Cupón no encontrado' }, 404);
  const now = new Date().toISOString();
  if (!c.enabled) return json({ valid: false, error: 'Cupón desactivado' });
  if (c.starts_at && now < c.starts_at) return json({ valid: false, error: 'Cupón aún no iniciado' });
  if (c.ends_at && now > c.ends_at) return json({ valid: false, error: 'Cupón expirado' });
  if (c.max_uses != null && c.used_count >= c.max_uses) return json({ valid: false, error: 'Cupón agotado' });
  if (subtotal < c.min_subtotal) return json({ valid: false, error: `Mínimo ${c.min_subtotal}€` });
  return json({ valid: true, discount_pct: c.discount_pct, discount: subtotal * (c.discount_pct / 100), min_subtotal: c.min_subtotal });
}
// marketing — banners
const BANNER_COLS = ['name', 'placement', 'enabled', 'message_es', 'message_pt', 'message_en', 'cta_label_es', 'cta_label_pt', 'cta_label_en', 'cta_link', 'bg_color', 'text_color', 'segment', 'starts_at', 'ends_at'];
async function bannersList(env) { return json((await env.DB.prepare('SELECT * FROM PromoBanner ORDER BY id DESC').all()).results || []); }
async function bannersLive(env, url) {
  const placement = url.searchParams.get('placement'); const segment = url.searchParams.get('segment') || 'ALL'; const now = new Date().toISOString();
  const all = (await env.DB.prepare('SELECT * FROM PromoBanner').all()).results || [];
  return json(all.filter((b) => b.enabled && (!placement || b.placement === placement) && (!b.starts_at || b.starts_at <= now) && (!b.ends_at || b.ends_at >= now) && (b.segment === 'ALL' || b.segment === segment)));
}
async function bannerUpsert(env, req) {
  const b = await readBody(req);
  const v = { name: b.name || 'Sem nome', placement: b.placement || 'TOP', enabled: b.enabled !== false ? 1 : 0, message_es: b.message_es || '', message_pt: b.message_pt || '', message_en: b.message_en || '', cta_label_es: b.cta_label_es || '', cta_label_pt: b.cta_label_pt || '', cta_label_en: b.cta_label_en || '', cta_link: b.cta_link || '', bg_color: b.bg_color || '#C4A49A', text_color: b.text_color || '#FFFFFF', segment: b.segment || 'ALL', starts_at: isoOrNull(b.starts_at), ends_at: isoOrNull(b.ends_at) };
  if (b.id) {
    await env.DB.prepare(`UPDATE PromoBanner SET ${BANNER_COLS.map((c) => c + '=?').join(',')},updatedAt=? WHERE id=?`).bind(...BANNER_COLS.map((c) => v[c]), String(nowMs()), parseInt(b.id)).run();
    return json(await env.DB.prepare('SELECT * FROM PromoBanner WHERE id=?').bind(parseInt(b.id)).first());
  }
  const res = await env.DB.prepare(`INSERT INTO PromoBanner (${BANNER_COLS.join(',')},createdAt,updatedAt) VALUES (${BANNER_COLS.map(() => '?').join(',')},?,?)`).bind(...BANNER_COLS.map((c) => v[c]), String(nowMs()), String(nowMs())).run();
  return json(await env.DB.prepare('SELECT * FROM PromoBanner WHERE id=?').bind(res.meta.last_row_id).first());
}
// landing categories
async function landingList(env) {
  const rows = (await env.DB.prepare('SELECT * FROM LandingCategory ORDER BY "order" ASC').all()).results || [];
  return json(rows.map((r) => ({ ...r, enabled: !!r.enabled, is_default: !!r.is_default, keywords_es: safeJSON(r.keywords_es, []), keywords_pt: safeJSON(r.keywords_pt, []), keywords_en: safeJSON(r.keywords_en, []), copy_es: safeJSON(r.copy_es, {}), copy_pt: safeJSON(r.copy_pt, {}), copy_en: safeJSON(r.copy_en, {}) })));
}
async function bundleRuleGet(env) { const r = await getRow(env, 'BundleRule'); return json(r || { id: 1, category_weight: 2, tag_weight: 1, price_weight: 1, price_range_pct: 30, min_score: 2, default_discount_pct: 10, max_kit_size: 3 }); }

async function deleteById(env, table, id) { await env.DB.prepare(`DELETE FROM ${table} WHERE id=?`).bind(parseInt(id)).run(); return json({ success: true }); }

// =================== DROPEA (catálogo dropshipping, GraphQL) ===================
const DROPEA_CATALOG_Q = `query getCatalog($limit:Int,$page:Int){products(limit:$limit,page:$page){data{id name category cost_price pvpr stock_available image}}}`;
const DROPEA_PRODUCT_Q = `query getProduct($id:[Int]){products(id:$id,limit:1){data{id name category description cost_price pvpr stock_available image}}}`;
async function dropeaGQL(env, query, variables) {
  const key = env.DROPEA_API_KEY;
  if (!key) return { ok: false, noKey: true };
  const apiUrl = env.DROPEA_API_URL || 'https://api.dropea.com/graphql/dropshippers';
  try {
    const r = await fetch(apiUrl, { method: 'POST', headers: { 'content-type': 'application/json', 'x-api-key': key }, body: JSON.stringify({ query, variables }) });
    const j = await r.json();
    if (j.errors) return { ok: false, error: j.errors[0]?.message || 'Erro Dropea' };
    return { ok: true, items: j.data?.products?.data || [] };
  } catch { return { ok: false, error: 'Falha de conexão com a Dropea.' }; }
}
async function pricing(env) { const s = await getRow(env, 'StoreSettings'); return { margin: s?.profit_margin_percent ?? 30, shipping: s?.fixed_shipping_cost ?? 7 }; }
// Frete NÃO entra no preço do produto — é cobrado à parte no checkout. Preço = Custo * (1 + Margem/100).
function finalPrice(cost, p) { return parseFloat((cost * (1 + p.margin / 100)).toFixed(2)); }
async function upsertProduct(env, prd, price) {
  await env.DB.prepare(`INSERT INTO Product (dropea_id,name,price,stock,description,image_url,category,is_active,createdAt,updatedAt) VALUES (?,?,?,?,?,?,?,1,?,?)
    ON CONFLICT(dropea_id) DO UPDATE SET price=excluded.price,stock=excluded.stock,is_active=1,updatedAt=excluded.updatedAt`)
    .bind(String(prd.id), prd.name || `Produto ${prd.id}`, price, parseInt(prd.stock_available) || 0, prd.description || prd.name || '', prd.image || '', prd.category || null, String(nowMs()), String(nowMs())).run();
}
async function dropeaCatalog(env, req, pageParam) {
  try { await requireAdmin(env, req); } catch { return json([]); } // sem sessão → vazio (não quebra a página)
  if (!env.DROPEA_API_KEY) return json([]); // gracioso: página carrega vazia até a chave ser configurada
  const res = await dropeaGQL(env, DROPEA_CATALOG_Q, { limit: 1000, page: parseInt(pageParam) || 1 });
  if (!res.ok) return json([]);
  const p = await pricing(env);
  const imported = new Set(((await env.DB.prepare('SELECT dropea_id FROM Product WHERE dropea_id IS NOT NULL').all()).results || []).map((r) => String(r.dropea_id)));
  return json(res.items.filter((it) => !imported.has(String(it.id))).map((it) => ({ ...it, suggested_sell_price: finalPrice(parseFloat(it.cost_price || it.pvpr) || 0, p) })));
}
async function dropeaImport(env, req) {
  const b = await readBody(req);
  const dropeaId = b.dropeaId || b.id;
  if (!dropeaId) return err('Especifique o ID Dropea.', 400);
  if (!env.DROPEA_API_KEY) return err('Configure o secret DROPEA_API_KEY no Worker para importar.', 503);
  const res = await dropeaGQL(env, DROPEA_PRODUCT_Q, { id: [parseInt(dropeaId, 10)] });
  if (!res.ok) return err(res.error || 'Falha Dropea.', 502);
  if (!res.items.length) return err('Produto não encontrado na Dropea com este ID.', 404);
  const prd = res.items[0];
  await upsertProduct(env, prd, finalPrice(parseFloat(prd.cost_price || prd.pvpr) || 0, await pricing(env)));
  return json(await env.DB.prepare('SELECT * FROM Product WHERE dropea_id=?').bind(String(prd.id)).first());
}
async function dropeaBulkImport(env, req) {
  if (!env.DROPEA_API_KEY) return err('Configure o secret DROPEA_API_KEY no Worker para importar.', 503);
  const res = await dropeaGQL(env, DROPEA_CATALOG_Q, { limit: 1000, page: 1 });
  if (!res.ok) return err(res.error || 'Falha Dropea.', 502);
  const p = await pricing(env); let count = 0;
  for (const prd of res.items) { try { await upsertProduct(env, prd, finalPrice(parseFloat(prd.cost_price || prd.pvpr) || 0, p)); count++; } catch {} }
  return json({ success: true, count, total: res.items.length });
}

// =================== ADMIN: gestão de usuários ===================
async function adminUsersList(env) {
  return json((await env.DB.prepare('SELECT id, username, role, last_login_at, createdAt FROM AdminUser ORDER BY id ASC').all()).results || []);
}
async function adminUsersCreate(env, req) {
  const b = await readBody(req);
  const username = String(b.username || '').trim();
  const password = String(b.password || '');
  const role = ['owner', 'admin', 'editor'].includes(b.role) ? b.role : 'admin';
  if (username.length < 3) return err('Usuário inválido (mínimo 3 caracteres).', 400);
  if (password.length < 8) return err('Senha deve ter no mínimo 8 caracteres.', 400);
  if (await env.DB.prepare('SELECT id FROM AdminUser WHERE username=?').bind(username).first()) return err('Já existe um admin com esse usuário.', 409);
  const res = await env.DB.prepare("INSERT INTO AdminUser (username, password_hash, role, createdAt) VALUES (?,?,?,?)").bind(username, await hashPassword(password), role, nowMs()).run();
  return json({ ok: true, id: res.meta.last_row_id, username, role });
}
async function adminUsersResetPw(env, req, id) {
  const b = await readBody(req);
  const password = String(b.password || '');
  if (password.length < 8) return err('Senha deve ter no mínimo 8 caracteres.', 400);
  if (!(await env.DB.prepare('SELECT id FROM AdminUser WHERE id=?').bind(parseInt(id)).first())) return err('Admin não encontrado.', 404);
  await env.DB.prepare('UPDATE AdminUser SET password_hash=?, failed_attempts=0, locked_until=NULL WHERE id=?').bind(await hashPassword(password), parseInt(id)).run();
  return json({ ok: true });
}
async function adminUsersDelete(env, id, me) {
  const t = parseInt(id);
  if (t === me.userId) return err('Você não pode remover a si mesmo.', 400);
  if (((await env.DB.prepare('SELECT COUNT(*) AS n FROM AdminUser').first())?.n || 0) <= 1) return err('Não dá pra remover o último admin.', 400);
  await env.DB.prepare('DELETE FROM AdminUser WHERE id=?').bind(t).run();
  await env.DB.prepare("DELETE FROM Session WHERE user_type='admin' AND user_id=?").bind(t).run();
  return json({ ok: true });
}
async function adminCustomersList(env) {
  const rows = (await env.DB.prepare('SELECT id, email, name, email_verified, createdAt FROM User ORDER BY id DESC LIMIT 1000').all()).results || [];
  return json(rows.map((r) => ({ ...r, email_verified: !!r.email_verified })));
}
async function adminCustomersDelete(env, id) {
  await env.DB.prepare('DELETE FROM User WHERE id=?').bind(parseInt(id)).run();
  await env.DB.prepare("DELETE FROM Session WHERE user_type='user' AND user_id=?").bind(parseInt(id)).run();
  return json({ ok: true });
}
function adminUiPage(req) {
  // Acesso direto pelo navegador -> manda pro painel (a gestão vive só no admin-core).
  // Só serve o HTML quando é o <iframe> do painel (sec-fetch-dest != document).
  if (req && (req.headers.get('sec-fetch-dest') || '') === 'document') return new Response(null, { status: 302, headers: { location: '/admin-core-sys/users' } });
  return new Response(ADMIN_UI_HTML, { headers: { 'content-type': 'text/html; charset=utf-8' } });
}
function analyticsUiPage(req) {
  if (req && (req.headers.get('sec-fetch-dest') || '') === 'document') return new Response(null, { status: 302, headers: { location: '/admin-core-sys/analytics' } });
  return new Response(ANALYTICS_UI_HTML, { headers: { 'content-type': 'text/html; charset=utf-8' } });
}
// Clarity Data Export API (10 req/dia -> cache 6h em D1). force=true ignora o cache.
async function clarityInsights(env, force) {
  if (!env.CLARITY_API_TOKEN) return { configured: false };
  const TTL = 1000 * 60 * 60 * 6;
  let row = null;
  try { row = await env.DB.prepare('SELECT data, fetched_at FROM ClarityCache WHERE id=1').first(); } catch (e) {}
  if (!force && row && row.fetched_at && (nowMs() - row.fetched_at) < TTL) {
    return { configured: true, fetched_at: row.fetched_at, stale: false, metrics: safeJSON(row.data, []) };
  }
  try {
    const r = await fetch('https://www.clarity.ms/export-data/api/v1/project-live-insights?numOfDays=3', { headers: { Authorization: 'Bearer ' + env.CLARITY_API_TOKEN } });
    if (!r.ok) {
      const body = (await r.text().catch(() => '')).slice(0, 180);
      if (row) return { configured: true, fetched_at: row.fetched_at, stale: true, metrics: safeJSON(row.data, []), error: 'Clarity API ' + r.status };
      return { configured: true, error: 'Clarity API ' + r.status + (body ? ': ' + body : '') };
    }
    const data = await r.json();
    const t = nowMs();
    try { await env.DB.prepare('INSERT INTO ClarityCache (id, data, fetched_at) VALUES (1,?,?) ON CONFLICT(id) DO UPDATE SET data=excluded.data, fetched_at=excluded.fetched_at').bind(JSON.stringify(data), t).run(); } catch (e) {}
    return { configured: true, fetched_at: t, stale: false, metrics: data };
  } catch (e) {
    if (row) return { configured: true, fetched_at: row.fetched_at, stale: true, metrics: safeJSON(row.data, []), error: String(e) };
    return { configured: true, error: 'Falha ao buscar Clarity: ' + String(e) };
  }
}

// =================== SEO (robots, sitemap, meta/JSON-LD por rota) ===================
const SITE_ORIGIN = 'https://beauthe.shop';
const OG_DEFAULT_IMG = `${SITE_ORIGIN}/assets/images/trending_category_hero.png`;
const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const stripHtml = (s) => String(s == null ? '' : s).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
const clip = (s, n) => { s = stripHtml(s); return s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s; };
function toW3CDate(v) {
  if (v == null || v === '') return null;
  const d = /^\d+$/.test(String(v)) ? new Date(parseInt(v, 10)) : new Date(v);
  return isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
}
const ldScript = (obj) => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`;
const orgLd = () => ({ '@context': 'https://schema.org', '@type': 'Organization', name: 'Beauthé', url: SITE_ORIGIN, logo: `${SITE_ORIGIN}/favicon.svg` });
const websiteLd = () => ({ '@context': 'https://schema.org', '@type': 'WebSite', name: 'Beauthé', url: SITE_ORIGIN, inLanguage: 'es-ES', potentialAction: { '@type': 'SearchAction', target: `${SITE_ORIGIN}/search?q={search_term_string}`, 'query-input': 'required name=search_term_string' } });
const breadcrumbLd = (items) => ({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: it.url })) });
function productLd(p, price, canonical) {
  const ld = { '@context': 'https://schema.org', '@type': 'Product', name: p.name, sku: String(p.id), brand: { '@type': 'Brand', name: 'Beauthé' } };
  if (p.image_url) ld.image = [p.image_url];
  const desc = clip(p.description, 300); if (desc) ld.description = desc;
  if (p.category) ld.category = p.category;
  // NOTA: aggregateRating/review NÃO incluídos — reviews atuais são mock (violação de política se publicadas).
  ld.offers = { '@type': 'Offer', price: Number(price || 0).toFixed(2), priceCurrency: 'EUR', availability: (p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'), url: canonical, itemCondition: 'https://schema.org/NewCondition' };
  return ld;
}
const slugToLabel = (s) => String(s || '').replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

async function buildSeoMeta(env, url) {
  const path = url.pathname.replace(/\/+$/, '') || '/';
  const meta = {
    title: 'Beauthé · Cosmética vegana y skincare natural en España',
    description: 'Beauthé: alta cosmética vegana, skincare y rituales de belleza con propósito. Envío a toda España.',
    canonical: `${SITE_ORIGIN}/`, image: OG_DEFAULT_IMG, type: 'website', robots: 'index,follow', lang: 'es-ES',
    jsonld: [orgLd(), websiteLd()],
  };
  // Admin e rotas privadas → noindex
  if (path.startsWith('/admin-core-sys')) { meta.robots = 'noindex,nofollow'; meta.title = 'Panel · Beauthé'; meta.canonical = null; meta.jsonld = []; return meta; }
  if (path.startsWith('/checkout') || path.startsWith('/profile') || path.startsWith('/search')) { meta.robots = 'noindex,follow'; meta.jsonld = []; }

  if (path === '/') { meta.canonical = `${SITE_ORIGIN}/`; return meta; }

  const mProd = path.match(/^\/producto\/(\d+)/);
  if (mProd) {
    try {
      const p = await env.DB.prepare('SELECT * FROM Product WHERE id=?').bind(parseInt(mProd[1], 10)).first();
      if (p) {
        const price = (p.manual_price != null ? p.manual_price : p.price);
        const canonical = `${SITE_ORIGIN}/producto/${p.id}`;
        meta.title = `${p.name} · Beauthé`;
        meta.description = clip(p.description, 160) || `${p.name} · cosmética vegana en Beauthé. Envío a toda España.`;
        meta.canonical = canonical;
        meta.image = p.image_url || OG_DEFAULT_IMG;
        meta.type = 'product';
        meta.jsonld = [productLd(p, price, canonical), breadcrumbLd([{ name: 'Inicio', url: `${SITE_ORIGIN}/` }, { name: p.name, url: canonical }])];
      }
    } catch { /* fallback aos defaults */ }
    return meta;
  }

  const mCat = path.match(/^\/categoria\/([^/]+)/);
  if (mCat) {
    const slug = decodeURIComponent(mCat[1]);
    const canonical = `${SITE_ORIGIN}/categoria/${slug}`;
    let label = slugToLabel(slug);
    try { const c = await env.DB.prepare('SELECT label_es FROM LandingCategory WHERE slug=?').bind(slug).first(); if (c?.label_es) label = c.label_es; } catch { /* noop */ }
    meta.title = `${label} · Beauthé`;
    meta.description = `Descubre ${label} en Beauthé: selección de cosmética vegana y skincare con envío a toda España.`;
    meta.canonical = canonical;
    meta.jsonld = [breadcrumbLd([{ name: 'Inicio', url: `${SITE_ORIGIN}/` }, { name: label, url: canonical }])];
    return meta;
  }

  const STATIC = { '/historia': ['Nuestra historia · Beauthé', 'Conoce la historia y los valores de Beauthé: cosmética vegana con propósito.'], '/faq': ['Preguntas frecuentes · Beauthé', 'Resolvemos tus dudas sobre envíos, devoluciones y productos en Beauthé.'], '/ajuda': ['Ayuda y contacto · Beauthé', 'Centro de ayuda de Beauthé: contacto, pedidos y atención al cliente.'] };
  if (STATIC[path]) { meta.title = STATIC[path][0]; meta.description = STATIC[path][1]; meta.canonical = `${SITE_ORIGIN}${path}`; }
  else if (meta.canonical) meta.canonical = `${SITE_ORIGIN}${path}`;
  return meta;
}

function renderSeoHead(meta) {
  let s = `<meta name="description" content="${esc(meta.description)}">`;
  s += `<meta name="robots" content="${esc(meta.robots)}">`;
  if (meta.canonical) s += `<link rel="canonical" href="${esc(meta.canonical)}">`;
  s += `<meta property="og:site_name" content="Beauthé">`;
  s += `<meta property="og:locale" content="es_ES">`;
  s += `<meta property="og:type" content="${esc(meta.type)}">`;
  s += `<meta property="og:title" content="${esc(meta.title)}">`;
  s += `<meta property="og:description" content="${esc(meta.description)}">`;
  if (meta.canonical) s += `<meta property="og:url" content="${esc(meta.canonical)}">`;
  if (meta.image) s += `<meta property="og:image" content="${esc(meta.image)}">`;
  s += `<meta name="twitter:card" content="${meta.image ? 'summary_large_image' : 'summary'}">`;
  s += `<meta name="twitter:title" content="${esc(meta.title)}">`;
  s += `<meta name="twitter:description" content="${esc(meta.description)}">`;
  if (meta.image) s += `<meta name="twitter:image" content="${esc(meta.image)}">`;
  for (const obj of (meta.jsonld || [])) s += ldScript(obj);
  return s;
}

function serveRobots() {
  const body = `User-agent: *\nAllow: /\nDisallow: /admin-core-sys\nDisallow: /api/\nDisallow: /checkout\nDisallow: /profile\nDisallow: /*?*\n\nSitemap: ${SITE_ORIGIN}/sitemap.xml\n`;
  return new Response(body, { headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'public, max-age=86400' } });
}
async function collectCategorySlugs(env) {
  const slugs = new Set();
  const harvest = (arr) => { for (const it of (arr || [])) { if (typeof it?.link === 'string') { const m = it.link.match(/^\/categoria\/([^/?#]+)/); if (m) slugs.add(m[1]); } if (Array.isArray(it?.items)) harvest(it.items); } };
  try {
    const r = await getRow(env, 'NavConfig');
    harvest(safeJSON(r?.top_nav, null) || DEFAULT_TOP_NAV);
    const mega = safeJSON(r?.mega_menu, null) || DEFAULT_MEGA_MENU;
    for (const k of Object.keys(mega)) harvest(mega[k]);
  } catch { harvest(DEFAULT_TOP_NAV); for (const k of Object.keys(DEFAULT_MEGA_MENU)) harvest(DEFAULT_MEGA_MENU[k]); }
  try { const cats = (await env.DB.prepare('SELECT slug FROM LandingCategory WHERE enabled=1').all()).results || []; for (const c of cats) if (c.slug) slugs.add(c.slug); } catch { /* noop */ }
  return [...slugs];
}
async function serveSitemap(env) {
  const urls = [];
  const add = (loc, lastmod) => urls.push({ loc, lastmod: toW3CDate(lastmod) });
  add(`${SITE_ORIGIN}/`, null);
  add(`${SITE_ORIGIN}/historia`, null);
  add(`${SITE_ORIGIN}/faq`, null);
  add(`${SITE_ORIGIN}/ajuda`, null);
  for (const slug of await collectCategorySlugs(env)) add(`${SITE_ORIGIN}/categoria/${slug}`, null);
  try {
    const prods = (await env.DB.prepare('SELECT id, updatedAt FROM Product WHERE is_active=1').all()).results || [];
    for (const p of prods) add(`${SITE_ORIGIN}/producto/${p.id}`, p.updatedAt);
  } catch { /* noop */ }
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map((u) => `  <url><loc>${esc(u.loc)}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}</url>`).join('\n') +
    `\n</urlset>\n`;
  return new Response(body, { headers: { 'content-type': 'application/xml; charset=utf-8', 'cache-control': 'public, max-age=3600' } });
}

// =================== PROXY (Worker na frente do Pages) + injeção ===================
const PAGES_ORIGIN = 'https://beauthe.pages.dev';
function buildInjection(env, pathname) {
  let s = '';
  if (env.CLARITY_ID && pathname.indexOf('/admin-core-sys') !== 0) s += '<script type="text/javascript">(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window,document,"clarity","script",' + JSON.stringify(env.CLARITY_ID) + ');</script>';
  if (pathname.indexOf('/admin-core-sys') === 0) s += MENU_INJECT;
  return s;
}
// Mantém Clarity e libera o Stripe (Embedded Checkout: js.stripe.com + iframes *.stripe.com).
function augmentCsp(csp) {
  const SCRIPT = "'unsafe-inline' https://www.clarity.ms https://*.clarity.ms https://js.stripe.com";
  const CONNECT = 'https://*.clarity.ms https://api.stripe.com https://*.stripe.com';
  const FRAME = 'https://js.stripe.com https://*.stripe.com https://checkout.stripe.com';
  let out = csp
    .replace(/script-src ([^;]*)/, `script-src $1 ${SCRIPT}`)
    .replace(/connect-src ([^;]*)/, `connect-src $1 ${CONNECT}`);
  if (/frame-src /.test(out)) out = out.replace(/frame-src ([^;]*)/, `frame-src $1 ${FRAME}`);
  else out = out.replace(/;?\s*$/, '') + `; frame-src ${FRAME}`;
  return out;
}
class HeadInjector { constructor(html) { this.html = html; } element(el) { if (this.html) el.append(this.html, { html: true }); } }
class TitleRewriter { constructor(t) { this.t = t; this.done = false; } element(el) { if (this.t && !this.done) { el.setInnerContent(this.t); this.done = true; } } }
class HtmlLangRewriter { constructor(l) { this.l = l; } element(el) { if (this.l) el.setAttribute('lang', this.l); } }
async function proxyAndInject(request, env, url) {
  // Portão de auth: sem sessão de admin, /admin-core-sys mostra a tela de login (não o painel).
  if (url.pathname === '/admin-core-sys' || url.pathname.startsWith('/admin-core-sys/')) {
    const sess = await getSession(env, request);
    if (!sess || sess.userType !== 'admin') return new Response(LOGIN_UI_HTML, { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } });
  }
  const h = new Headers(request.headers); h.delete('host'); h.set('accept-encoding', 'identity');
  const init = { method: request.method, headers: h, redirect: 'manual' };
  if (!['GET', 'HEAD'].includes(request.method)) init.body = request.body;
  let resp = await fetch(PAGES_ORIGIN + url.pathname + url.search, init);
  const ct = resp.headers.get('content-type') || '';
  if (!ct.includes('text/html')) return resp;
  let meta = null;
  try { meta = await buildSeoMeta(env, url); } catch { meta = null; }
  const headInj = (meta ? renderSeoHead(meta) : '') + buildInjection(env, url.pathname);
  const headers = new Headers(resp.headers);
  headers.delete('content-encoding'); headers.delete('content-length');
  const csp = headers.get('content-security-policy');
  if (csp) headers.set('content-security-policy', augmentCsp(csp));
  resp = new Response(resp.body, { status: resp.status, statusText: resp.statusText, headers });
  let rw = new HTMLRewriter().on('head', new HeadInjector(headInj));
  if (meta?.title) rw = rw.on('title', new TitleRewriter(meta.title));
  if (meta?.lang) rw = rw.on('html', new HtmlLangRewriter(meta.lang));
  return rw.transform(resp);
}

// =================== CHECKOUT (Stripe) ===================
const STRIPE_API = 'https://api.stripe.com/v1';
const round2 = (n) => Math.round((Number(n) + Number.EPSILON) * 100) / 100;
function genOrderCode() { return `BH-${hex(crypto.getRandomValues(new Uint8Array(5))).toUpperCase()}`; }

// Flatten a nested object into Stripe's bracket form-encoding (line_items[0][price_data][currency]=...).
function stripeEncode(obj, prefix, out) {
  out = out || new URLSearchParams();
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    if (val === undefined || val === null) continue;
    const k = prefix ? `${prefix}[${key}]` : key;
    if (Array.isArray(val)) {
      val.forEach((item, i) => {
        if (item !== null && typeof item === 'object') stripeEncode(item, `${k}[${i}]`, out);
        else out.append(`${k}[${i}]`, String(item));
      });
    } else if (typeof val === 'object') { stripeEncode(val, k, out); }
    else out.append(k, String(val));
  }
  return out;
}
async function stripeCall(env, path, data, method = 'POST') {
  const body = data ? stripeEncode(data).toString() : undefined;
  const r = await fetch(`${STRIPE_API}${path}`, {
    method,
    headers: { Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`, 'content-type': 'application/x-www-form-urlencoded' },
    body,
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new HttpError(502, j?.error?.message || 'Error procesando el pago. Inténtalo de nuevo.');
  return j;
}
async function hmacSha256Hex(keyStr, msg) {
  const key = await crypto.subtle.importKey('raw', enc.encode(keyStr), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return hex(await crypto.subtle.sign('HMAC', key, enc.encode(msg)));
}
// Verify Stripe webhook signature (Stripe-Signature: t=...,v1=...), 5-min tolerance.
async function verifyStripeSignature(rawBody, header, secret) {
  if (!header || !secret) return false;
  const parts = {}; header.split(',').forEach((p) => { const i = p.indexOf('='); if (i > 0) parts[p.slice(0, i).trim()] = p.slice(i + 1).trim(); });
  const t = parts.t, v1 = parts.v1;
  if (!t || !v1) return false;
  const expected = await hmacSha256Hex(secret, `${t}.${rawBody}`);
  if (expected.length !== v1.length) return false;
  let diff = 0; for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ v1.charCodeAt(i);
  if (diff !== 0) return false;
  return Math.abs(Math.floor(nowMs() / 1000) - parseInt(t, 10)) <= 300;
}

async function checkoutCreateSession(env, req) {
  if (!env.STRIPE_SECRET_KEY) return err('El pago aún no está configurado. Configura el secret STRIPE_SECRET_KEY en el Worker.', 503);
  const b = await readBody(req);
  const rawItems = Array.isArray(b.items) ? b.items : [];
  if (!rawItems.length) return err('El carrito está vacío.', 400);
  const c = b.customer || {};
  const email = String(c.email || '').trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return err('Introduce un email válido.', 400);
  const lang = ['es', 'pt', 'en'].includes(b.lang) ? b.lang : 'es';

  // Resolve every product from the DB — never trust client-supplied prices.
  const line = [], orderItems = []; let subtotal = 0;
  for (const it of rawItems) {
    const id = parseInt(it.id, 10);
    const qty = Math.max(1, Math.min(99, parseInt(it.quantity, 10) || 1));
    if (!id) return err('Producto inválido en el carrito.', 400);
    const p = await env.DB.prepare('SELECT id,name,price,manual_price,stock,image_url,is_active FROM Product WHERE id=?').bind(id).first();
    if (!p) return err(`Un producto del carrito ya no está disponible (#${id}).`, 400);
    const price = round2(p.manual_price != null ? p.manual_price : p.price);
    if (!(price > 0)) return err(`Producto sin precio válido (#${id}).`, 400);
    subtotal += price * qty;
    line.push({ price_data: { currency: 'eur', product_data: { name: p.name, ...(p.image_url ? { images: [p.image_url] } : {}) }, unit_amount: Math.round(price * 100) }, quantity: qty });
    orderItems.push({ id: p.id, name: p.name, price, quantity: qty, image: p.image_url || null });
  }
  subtotal = round2(subtotal);

  // Optional coupon — revalidated server-side, applied as a one-time Stripe coupon.
  let discount = 0, couponCode = null, stripeCouponId = null;
  if (b.coupon_code) {
    const code = String(b.coupon_code).toUpperCase().trim();
    const cp = await env.DB.prepare('SELECT * FROM Coupon WHERE code=?').bind(code).first();
    const now = new Date().toISOString();
    const ok = cp && cp.enabled && (!cp.starts_at || now >= cp.starts_at) && (!cp.ends_at || now <= cp.ends_at)
      && (cp.max_uses == null || cp.used_count < cp.max_uses) && subtotal >= cp.min_subtotal;
    if (ok) {
      couponCode = code; discount = round2(subtotal * (cp.discount_pct / 100));
      const sc = await stripeCall(env, '/coupons', { percent_off: cp.discount_pct, duration: 'once', name: `Beauthé ${code}` });
      stripeCouponId = sc.id;
    }
  }

  // Frete cobrado no checkout (não embutido no preço). Vem de StoreSettings.fixed_shipping_cost.
  const st = await getRow(env, 'StoreSettings');
  const shipping = round2(st?.fixed_shipping_cost ?? 7);
  const total = round2(subtotal - discount + shipping);
  const code = genOrderCode();
  const customerName = [c.firstName, c.lastName].filter(Boolean).join(' ').trim() || null;
  const country = c.country || (lang === 'pt' ? 'PT' : 'ES');

  await env.DB.prepare(`INSERT INTO "Order" (order_code,customer_name,email,address,zip,city,country,items,subtotal,discount,coupon_code,shipping,total,payment_method,status,createdAt,updatedAt,email_enc)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`)
    .bind(code, customerName, email, c.address || null, c.zip || null, c.city || null, country, JSON.stringify(orderItems), subtotal, discount, couponCode, shipping, total, 'stripe', 'pending_payment', String(nowMs()), String(nowMs()), await encryptEmail(env, email)).run();

  const site = env.SITE_URL || SITE_ORIGIN;
  const payload = {
    mode: 'payment',
    ui_mode: 'embedded_page', // checkout embutido na própria loja (sem redirect)
    return_url: `${site}/checkout/success?order=${code}`,
    client_reference_id: code,
    customer_email: email,
    locale: lang === 'pt' ? 'pt' : (lang === 'en' ? 'en' : 'es'),
    billing_address_collection: 'auto',
    line_items: line,
    metadata: { order_code: code },
    payment_intent_data: { metadata: { order_code: code } },
  };
  if (shipping > 0) payload.shipping_options = [{
    shipping_rate_data: {
      type: 'fixed_amount',
      fixed_amount: { amount: Math.round(shipping * 100), currency: 'eur' },
      display_name: lang === 'es' ? 'Envío' : (lang === 'en' ? 'Shipping' : 'Envio'),
    },
  }];
  if (stripeCouponId) payload.discounts = [{ coupon: stripeCouponId }];

  let session;
  try { session = await stripeCall(env, '/checkout/sessions', payload); }
  catch (e) { await env.DB.prepare('UPDATE "Order" SET status=?, updatedAt=? WHERE order_code=?').bind('payment_error', String(nowMs()), code).run().catch(() => {}); throw e; }
  return json({ client_secret: session.client_secret, order_code: code });
}
async function checkoutConfig(env) {
  const st = await getRow(env, 'StoreSettings');
  return json({ publishableKey: env.STRIPE_PUBLISHABLE_KEY || null, shipping: round2(st?.fixed_shipping_cost ?? 7), currency: 'EUR' });
}

async function markOrderPaid(env, code) {
  if (!code) return;
  const o = await env.DB.prepare('SELECT * FROM "Order" WHERE order_code=?').bind(code).first();
  if (!o || o.status === 'paid') return; // idempotent
  await env.DB.prepare('UPDATE "Order" SET status=?, updatedAt=? WHERE order_code=?').bind('paid', String(nowMs()), code).run();
  const items = safeJSON(o.items, []);
  for (const it of items) if (it.id && it.quantity) await env.DB.prepare('UPDATE Product SET stock=MAX(0, stock - ?), updatedAt=? WHERE id=?').bind(it.quantity, String(nowMs()), it.id).run().catch(() => {});
  if (o.coupon_code) await env.DB.prepare('UPDATE Coupon SET used_count=used_count + 1 WHERE code=?').bind(o.coupon_code).run().catch(() => {});
  try {
    const money = (n) => `${Number(n).toFixed(2)} €`;
    const lines = items.map((i) => `- ${i.quantity}x ${i.name} (${money(i.price)})`).join('\n');
    await sendEmail(env, o.email, `Pedido confirmado · ${o.order_code} · Beauthé`,
      `¡Gracias por tu compra!\n\nPedido: ${o.order_code}\n${lines}\n\nTotal: ${money(o.total)}\n\nTe avisaremos cuando salga para entrega.\n— Beauthé`);
  } catch {}
}
async function setOrderStatusIfPending(env, code, status) {
  if (!code) return;
  await env.DB.prepare('UPDATE "Order" SET status=?, updatedAt=? WHERE order_code=? AND status=\'pending_payment\'').bind(status, String(nowMs()), code).run().catch(() => {});
}
async function checkoutWebhook(env, req) {
  const raw = await req.text();
  if (env.STRIPE_WEBHOOK_SECRET) {
    const okSig = await verifyStripeSignature(raw, req.headers.get('stripe-signature'), env.STRIPE_WEBHOOK_SECRET);
    if (!okSig) return err('Invalid signature', 400);
  }
  let event; try { event = JSON.parse(raw); } catch { return err('Bad payload', 400); }
  const obj = event.data?.object || {};
  const code = obj.client_reference_id || obj.metadata?.order_code;
  try {
    if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
      if (obj.payment_status === 'paid' || obj.payment_status === 'no_payment_required') await markOrderPaid(env, code);
    } else if (event.type === 'checkout.session.expired') { await setOrderStatusIfPending(env, code, 'expired'); }
    else if (event.type === 'checkout.session.async_payment_failed') { await setOrderStatusIfPending(env, code, 'payment_failed'); }
  } catch { /* ack anyway to avoid retry storms */ }
  return json({ received: true });
}
async function orderPublicGet(env, code) {
  const o = await env.DB.prepare('SELECT order_code,items,subtotal,discount,shipping,total,status,createdAt FROM "Order" WHERE order_code=?').bind(String(code)).first();
  if (!o) return err('Pedido no encontrado.', 404);
  return json({ order: { ...o, items: safeJSON(o.items, []) } });
}
async function adminOrdersList(env) {
  const rows = (await env.DB.prepare('SELECT * FROM "Order" ORDER BY id DESC LIMIT 500').all()).results || [];
  return json(rows.map((o) => ({ ...o, items: safeJSON(o.items, []) })));
}
async function adminOrderSetStatus(env, req, id) {
  const b = await readBody(req);
  const status = String(b.status || '').trim();
  if (!status) return err('status requerido', 400);
  await env.DB.prepare('UPDATE "Order" SET status=?, updatedAt=? WHERE id=?').bind(status, String(nowMs()), parseInt(id)).run();
  return json({ ok: true });
}

// Auditoria de preços: compara cada produto com a regra
// Preço = (Custo Dropea + Frete Fixo) * (1 + Margem/100), usando o custo atual da Dropea.
async function adminPriceAudit(env) {
  const s = await getRow(env, 'StoreSettings');
  const margin = s?.profit_margin_percent ?? 30;
  const shipping = s?.fixed_shipping_cost ?? 7;

  // Mapa dropea_id -> custo, paginando o catálogo Dropea.
  const costMap = new Map();
  let dropeaOk = false, dropeaErr = null;
  if (!env.DROPEA_API_KEY) dropeaErr = 'DROPEA_API_KEY não configurada no Worker.';
  else {
    for (let page = 1; page <= 30; page++) {
      const res = await dropeaGQL(env, DROPEA_CATALOG_Q, { limit: 1000, page });
      if (!res.ok) { dropeaErr = res.error || 'Falha ao consultar a Dropea.'; break; }
      dropeaOk = true;
      const items = res.items || [];
      for (const it of items) costMap.set(String(it.id), parseFloat(it.cost_price ?? it.pvpr) || 0);
      if (items.length < 1000) break;
    }
  }

  const products = (await env.DB.prepare('SELECT id,name,dropea_id,price,manual_price,is_active FROM Product').all()).results || [];
  const rows = [];
  const sum = { total: products.length, ok: 0, off: 0, manual: 0, no_dropea: 0, cost_missing: 0 };
  for (const p of products) {
    const did = p.dropea_id != null ? String(p.dropea_id) : null;
    const engine = round2(p.price);
    const manual = p.manual_price != null ? round2(p.manual_price) : null;
    const effective = manual != null ? manual : engine;
    let cost = null, expected = null, diff = null, status;
    if (!did) { status = 'no_dropea'; sum.no_dropea++; }
    else if (!costMap.has(did)) { status = 'cost_missing'; sum.cost_missing++; }
    else {
      cost = round2(costMap.get(did));
      expected = round2(cost * (1 + margin / 100)); // frete é cobrado no checkout, não no preço
      diff = round2(engine - expected);
      if (manual != null) { status = 'manual_override'; sum.manual++; }
      else if (Math.abs(diff) <= 0.01) { status = 'ok'; sum.ok++; }
      else { status = 'off'; sum.off++; }
    }
    rows.push({ id: p.id, name: p.name, dropea_id: did, is_active: !!p.is_active, cost, expected, engine_price: engine, manual_price: manual, effective_price: effective, diff, status });
  }
  return json({ settings: { margin, shipping }, dropea: { ok: dropeaOk, error: dropeaErr, costs_loaded: costMap.size }, summary: sum, rows });
}

// Reprecifica todos os produtos com dropea_id pela regra atual (Custo * (1+margem)), sem mexer em manual_price.
async function adminReprice(env) {
  if (!env.DROPEA_API_KEY) return err('DROPEA_API_KEY não configurada no Worker.', 503);
  const p = await pricing(env);
  const costMap = new Map();
  for (let page = 1; page <= 30; page++) {
    const res = await dropeaGQL(env, DROPEA_CATALOG_Q, { limit: 1000, page });
    if (!res.ok) return err(res.error || 'Falha ao consultar a Dropea.', 502);
    const items = res.items || [];
    for (const it of items) costMap.set(String(it.id), parseFloat(it.cost_price ?? it.pvpr) || 0);
    if (items.length < 1000) break;
  }
  const products = (await env.DB.prepare('SELECT id,dropea_id,price FROM Product WHERE dropea_id IS NOT NULL').all()).results || [];
  let updated = 0, unchanged = 0, skipped = 0;
  for (const prod of products) {
    const cost = costMap.get(String(prod.dropea_id));
    if (cost == null) { skipped++; continue; }
    const np = finalPrice(cost, p);
    if (Math.abs(round2(prod.price) - np) <= 0.01) { unchanged++; continue; }
    await env.DB.prepare('UPDATE Product SET price=?, updatedAt=? WHERE id=?').bind(np, String(nowMs()), prod.id).run();
    updated++;
  }
  return json({ ok: true, updated, unchanged, skipped, total: products.length, margin: p.margin });
}

// =================== ROUTER ===================
export async function handle(request, env) {
  const url = new URL(request.url);
  if (url.pathname === '/robots.txt') return serveRobots();
  if (url.pathname === '/sitemap.xml') return await serveSitemap(env);
  if (!url.pathname.startsWith('/api/') && url.pathname !== '/api') return await proxyAndInject(request, env, url);
  const path = (url.pathname.replace(/^\/api/, '').replace(/\/+$/, '')) || '/';
  const m = request.method;
  const seg = path.split('/').filter(Boolean);
  try {
    // public + health
    if (path === '/health') return json({ status: 'OK', message: 'Beauthé Worker API' });

    // admin auth
    if (path === '/admin/status' && m === 'GET') return await adminStatus(env);
    if (path === '/admin/setup' && m === 'POST') return await adminSetup(env, request);
    if (path === '/admin/login' && m === 'POST') return await adminLogin(env, request);
    if (path === '/admin/me' && m === 'GET') return await adminMe(env, request);
    if (path === '/admin/logout' && m === 'POST') return await adminLogout(env, request);
    if (path === '/admin/ui' && m === 'GET') return adminUiPage(request);
    if (path === '/admin/analytics' && m === 'GET') return analyticsUiPage(request);

    // customer auth
    if (path === '/auth/register' && m === 'POST') return await authRegister(env, request);
    if (path === '/auth/login' && m === 'POST') return await authLogin(env, request);
    if (path === '/auth/logout' && m === 'POST') { await destroySession(env, request); return json({ ok: true }, 200, { 'set-cookie': clearCookie() }); }
    if (path === '/auth/me' && m === 'GET') return await authMe(env, request);
    if (path === '/auth/account') return await authAccount(env, request);
    if (path === '/auth/profile' && (m === 'PUT' || m === 'POST')) return await authProfile(env, request);
    if (path === '/auth/orders' && m === 'GET') return await authOrders(env, request);
    if (path === '/auth/request-reset' && m === 'POST') return await authRequestReset(env, request);
    if (path === '/auth/reset-password' && m === 'POST') return await authResetPassword(env, request);
    if (path === '/auth/verify-email' && m === 'POST') return await authVerifyEmail(env, request);
    if (path === '/auth/resend-verification' && m === 'POST') return await authResend(env, request);

    // CMS — public reads
    if (path === '/theme' && m === 'GET') return await themeGet(env);
    if (path === '/nav' && m === 'GET') return await navGet(env);
    if (path === '/home' && m === 'GET') return await homeGet(env);
    if (path === '/site-copy' && m === 'GET') return json(await copyBuildAll(env));
    if (path === '/site-copy/groups' && m === 'GET') return json(SITE_COPY_GROUPS);
    if (seg[0] === 'site-copy' && seg.length === 2 && m === 'GET') { const all = await copyBuildAll(env); return all[seg[1]] ? json(all[seg[1]]) : err('Not found', 404); }
    if (path === '/products' && m === 'GET') return await productsList(env);
    if (path === '/products/dropea-catalog' && m === 'GET') return await dropeaCatalog(env, request, url.searchParams.get('page'));
    if (seg[0] === 'products' && seg.length === 2 && seg[1] !== 'import' && seg[1] !== 'bulk-import' && m === 'GET') return await productGet(env, seg[1]);
    if (path === '/marketing/banners/live' && m === 'GET') return await bannersLive(env, url);
    if (seg[0] === 'marketing' && seg[1] === 'coupons' && seg[2] === 'validate' && m === 'GET') return await couponValidate(env, seg[3], url.searchParams.get('subtotal'));
    if (path === '/landing/categories' && m === 'GET') return await landingList(env);
    if (path === '/landing/bundle-rule' && m === 'GET') return await bundleRuleGet(env);

    // checkout / orders (public)
    if (path === '/checkout/config' && m === 'GET') return await checkoutConfig(env);
    if (path === '/checkout/create-session' && m === 'POST') return await checkoutCreateSession(env, request);
    if (path === '/checkout/webhook' && m === 'POST') return await checkoutWebhook(env, request);
    if (seg[0] === 'orders' && seg.length === 2 && m === 'GET') return await orderPublicGet(env, seg[1]);

    // ----- everything below requires admin -----
    const _admin = await requireAdmin(env, request);

    if (path === '/theme' && m === 'PUT') return await themePut(env, request);
    if (path === '/theme/reset' && m === 'POST') { await env.DB.prepare('DELETE FROM ThemeConfig WHERE id=1').run(); return themeGet(env); }
    if (path === '/nav' && m === 'PUT') return await navPut(env, request);
    if (path === '/home' && m === 'PUT') return await homePut(env, request);
    if (path === '/settings' && m === 'GET') return await settingsGet(env);
    if (path === '/settings' && m === 'PUT') return await settingsPut(env, request);
    if (seg[0] === 'site-copy' && seg.length === 2 && m === 'PUT') return await copyPut(env, request, seg[1]);
    if (seg[0] === 'products' && seg.length === 2 && m === 'PUT') return await productPut(env, request, seg[1]);
    if (path === '/products/import' && m === 'POST') return await dropeaImport(env, request);
    if (path === '/products/bulk-import' && m === 'POST') return await dropeaBulkImport(env, request);
    if (path === '/marketing/coupons' && m === 'GET') return await couponsList(env);
    if (path === '/marketing/coupons' && (m === 'POST' || m === 'PUT')) return await couponUpsert(env, request);
    if (seg[0] === 'marketing' && seg[1] === 'coupons' && seg.length === 3 && m === 'DELETE') return await deleteById(env, 'Coupon', seg[2]);
    if (path === '/marketing/banners' && m === 'GET') return await bannersList(env);
    if (path === '/marketing/banners' && (m === 'POST' || m === 'PUT')) return await bannerUpsert(env, request);
    if (seg[0] === 'marketing' && seg[1] === 'banners' && seg.length === 3 && m === 'DELETE') return await deleteById(env, 'PromoBanner', seg[2]);
    if (path === '/landing/bundle-rule' && m === 'PUT') { const b = await readBody(request); await env.DB.prepare('INSERT INTO BundleRule (id,category_weight,tag_weight,price_weight,price_range_pct,min_score,default_discount_pct,max_kit_size,updatedAt) VALUES (1,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET category_weight=excluded.category_weight,tag_weight=excluded.tag_weight,price_weight=excluded.price_weight,price_range_pct=excluded.price_range_pct,min_score=excluded.min_score,default_discount_pct=excluded.default_discount_pct,max_kit_size=excluded.max_kit_size,updatedAt=excluded.updatedAt').bind(parseFloat(b.category_weight)||2,parseFloat(b.tag_weight)||1,parseFloat(b.price_weight)||1,parseFloat(b.price_range_pct)||30,parseFloat(b.min_score)||2,parseFloat(b.default_discount_pct)||10,parseInt(b.max_kit_size)||3,String(nowMs())).run(); return bundleRuleGet(env); }
    if (path === '/settings' && m === 'GET') return await settingsGet(env);
    if (path === '/seo/urls' && m === 'GET') return json([]);
    if (path === '/seo/sync' && m === 'POST') return json({ ok: true, synced: 0 });
    // gestão de usuários
    if (path === '/admin/users' && m === 'GET') return await adminUsersList(env);
    if (path === '/admin/users' && m === 'POST') return await adminUsersCreate(env, request);
    if (seg[0] === 'admin' && seg[1] === 'users' && seg[3] === 'reset-password' && m === 'POST') return await adminUsersResetPw(env, request, seg[2]);
    if (seg[0] === 'admin' && seg[1] === 'users' && seg.length === 3 && m === 'DELETE') return await adminUsersDelete(env, seg[2], _admin);
    if (path === '/admin/customers' && m === 'GET') return await adminCustomersList(env);
    if (seg[0] === 'admin' && seg[1] === 'customers' && seg.length === 3 && m === 'DELETE') return await adminCustomersDelete(env, seg[2]);
    if (path === '/admin/clarity' && m === 'GET') return json(await clarityInsights(env));
    if (path === '/admin/clarity/refresh' && m === 'POST') return json(await clarityInsights(env, true));
    // pedidos (admin)
    if (path === '/admin/orders' && m === 'GET') return await adminOrdersList(env);
    if (seg[0] === 'admin' && seg[1] === 'orders' && seg[3] === 'status' && m === 'POST') return await adminOrderSetStatus(env, request, seg[2]);
    if (path === '/admin/price-audit' && m === 'GET') return await adminPriceAudit(env);
    if (path === '/admin/reprice' && m === 'POST') return await adminReprice(env);

    return err('Not found', 404);
  } catch (e) {
    if (e instanceof HttpError) return err(e.message, e.status);
    return json({ error: ERR_INT }, 500);
  }
}
