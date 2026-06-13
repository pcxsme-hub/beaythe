import { useEffect, useState } from 'react';

const API_URL = '/api';

let cached = null;
let pending = null;
const subs = new Set();

const fetchOnce = async () => {
    if (cached) return cached;
    if (pending) return pending;
    pending = fetch(`${API_URL}/theme`, { cache: 'no-store' })
        .then(r => r.json())
        .then(d => { cached = d; pending = null; subs.forEach(fn => fn(cached)); return cached; })
        .catch(() => { pending = null; cached = {}; return cached; });
    return pending;
};

export function useTheme() {
    const [theme, setTheme] = useState(cached || {});
    useEffect(() => {
        let active = true;
        const sub = (next) => { if (active) setTheme(next); };
        subs.add(sub);
        fetchOnce().then(d => { if (active) setTheme(d); });
        return () => { active = false; subs.delete(sub); };
    }, []);
    return theme;
}

export function invalidateTheme() { cached = null; pending = null; fetchOnce(); }

// Apply theme vars to <html> root so anything reading CSS variables gets them.
export function applyThemeVars(theme) {
    if (!theme) return;
    const root = document.documentElement;
    if (theme.color_primary) root.style.setProperty('--color-primary', theme.color_primary);
    if (theme.color_accent) root.style.setProperty('--color-accent-strong', theme.color_accent);
    if (theme.color_bg) root.style.setProperty('--color-bg-base', theme.color_bg);
    if (theme.color_surface) root.style.setProperty('--color-accent-soft', theme.color_surface);
    if (theme.color_border) root.style.setProperty('--color-border', theme.color_border);
    if (theme.color_text) root.style.setProperty('--color-secondary', theme.color_text);
    if (theme.radius_sm) root.style.setProperty('--radius-sm', `${theme.radius_sm}px`);
    if (theme.radius_md) root.style.setProperty('--radius-md', `${theme.radius_md}px`);
    if (theme.radius_lg) root.style.setProperty('--radius-lg', `${theme.radius_lg}px`);
    if (theme.font_heading || theme.font_body) {
        const fonts = [theme.font_body, theme.font_heading].filter(Boolean);
        if (fonts.length) root.style.setProperty('--font-sans', `'${fonts[0]}', ui-sans-serif, system-ui, sans-serif`);
    }
    if (theme.favicon_url) {
        let link = document.querySelector('link[rel="icon"]');
        if (!link) { link = document.createElement('link'); link.rel = 'icon'; document.head.appendChild(link); }
        link.href = theme.favicon_url;
    }
}
