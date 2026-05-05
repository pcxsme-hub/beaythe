import { useEffect, useState } from 'react';

const API_URL = 'http://localhost:3000/api';

let cached = null;
let pending = null;
const subscribers = new Set();

const fetchAll = async () => {
    if (cached) return cached;
    if (pending) return pending;
    pending = fetch(`${API_URL}/site-copy`, { cache: 'no-store' })
        .then(r => r.json())
        .then(d => {
            cached = d || {};
            pending = null;
            subscribers.forEach(fn => fn(cached));
            return cached;
        })
        .catch(() => { pending = null; cached = {}; return {}; });
    return pending;
};

// Returns the merged copy for `key` in the active locale, falling back through
// es when the locale is missing fields.
export function useSiteCopy(key, lang = 'es') {
    const [copy, setCopy] = useState(cached?.[key]?.[lang] || {});

    useEffect(() => {
        let active = true;
        const sub = (next) => {
            if (!active) return;
            const langCopy = next?.[key]?.[lang] || next?.[key]?.es || {};
            setCopy(langCopy);
        };
        subscribers.add(sub);
        fetchAll().then(d => sub(d));
        return () => { active = false; subscribers.delete(sub); };
    }, [key, lang]);

    return copy;
}

// Force refresh after admin save
export function invalidateSiteCopy() {
    cached = null;
    pending = null;
    fetchAll();
}
