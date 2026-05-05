import prisma from '../db.js';
import { SITE_COPY_DEFAULTS, SITE_COPY_GROUPS } from '../data/siteCopyDefaults.js';

const safeJSON = (s, fb) => {
    if (s == null) return fb;
    if (typeof s !== 'string') return s;
    try { return JSON.parse(s); } catch { return fb; }
};

// Returns merged copy for every group: defaults < DB row.
const buildAll = async () => {
    const rows = await prisma.siteCopy.findMany();
    const byKey = new Map(rows.map(r => [r.key, r]));

    const out = {};
    for (const group of SITE_COPY_GROUPS) {
        const row = byKey.get(group.key);
        const def = SITE_COPY_DEFAULTS[group.key] || {};
        const merged = {};
        for (const lang of ['es', 'pt', 'en']) {
            const dbVal = row ? safeJSON(row[`value_${lang}`], {}) : {};
            merged[lang] = { ...(def[lang] || {}), ...dbVal };
        }
        out[group.key] = merged;
    }
    return out;
};

export const listGroups = (req, res) => res.json(SITE_COPY_GROUPS);

export const getAllCopy = async (req, res) => {
    try {
        const all = await buildAll();
        res.json(all);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

export const getCopyKey = async (req, res) => {
    try {
        const all = await buildAll();
        const key = req.params.key;
        if (!all[key]) return res.status(404).json({ error: 'Not found' });
        res.json(all[key]);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

export const upsertCopy = async (req, res) => {
    try {
        const key = req.params.key;
        const body = req.body || {};
        const data = {
            value_es: JSON.stringify(body.es || {}),
            value_pt: JSON.stringify(body.pt || {}),
            value_en: JSON.stringify(body.en || {})
        };
        await prisma.siteCopy.upsert({
            where: { key },
            update: data,
            create: { key, ...data }
        });
        const all = await buildAll();
        res.json(all[key]);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

export const resetCopy = async (req, res) => {
    try {
        const key = req.params.key;
        await prisma.siteCopy.deleteMany({ where: { key } });
        const all = await buildAll();
        res.json(all[key]);
    } catch (err) { res.status(500).json({ error: err.message }); }
};
