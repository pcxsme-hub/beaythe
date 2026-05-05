import { useEffect, useState } from 'react';

const API_URL = 'http://localhost:3000/api';

let cached = null;
let pending = null;
const subs = new Set();

const fetchOnce = async () => {
    if (cached) return cached;
    if (pending) return pending;
    pending = fetch(`${API_URL}/nav`, { cache: 'no-store' })
        .then(r => r.json())
        .then(d => {
            cached = d || { top_nav: [], mega_menu: {}, footer: [] };
            pending = null;
            subs.forEach(fn => fn(cached));
            return cached;
        })
        .catch(() => { pending = null; cached = { top_nav: [], mega_menu: {}, footer: [] }; return cached; });
    return pending;
};

export function useNavConfig() {
    const [config, setConfig] = useState(cached || { top_nav: [], mega_menu: {}, footer: [] });
    const [ready, setReady] = useState(!!cached);
    useEffect(() => {
        let active = true;
        const sub = (next) => { if (active) { setConfig(next); setReady(true); } };
        subs.add(sub);
        fetchOnce().then(d => { if (active) { setConfig(d); setReady(true); } });
        return () => { active = false; subs.delete(sub); };
    }, []);
    return { config, ready };
}

export function invalidateNavConfig() { cached = null; pending = null; fetchOnce(); }
