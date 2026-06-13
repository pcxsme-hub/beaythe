import { useEffect, useState } from 'react';

const API_URL = '/api';

// Singleton-style cache so multiple components don't double-fetch on the same page.
let cached = null;
let pending = null;
const subscribers = new Set();

const fetchConfig = async () => {
    if (cached) return cached;
    if (pending) return pending;
    pending = fetch(`${API_URL}/home`, { cache: 'no-store' })
        .then(r => r.json())
        .then(d => {
            cached = d?.sections || [];
            pending = null;
            subscribers.forEach(fn => fn(cached));
            return cached;
        })
        .catch(() => { pending = null; cached = []; return []; });
    return pending;
};

export function useHomeConfig() {
    const [sections, setSections] = useState(cached || []);
    const [ready, setReady] = useState(!!cached);

    useEffect(() => {
        let active = true;
        const sub = (next) => { if (active) { setSections(next); setReady(true); } };
        subscribers.add(sub);
        fetchConfig().then(s => { if (active) { setSections(s); setReady(true); } });
        return () => { active = false; subscribers.delete(sub); };
    }, []);

    return { sections, ready };
}
