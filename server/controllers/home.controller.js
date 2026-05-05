import prisma from '../db.js';
import { DEFAULT_HOME_SECTIONS } from '../data/homeDefaults.js';

const safeJSON = (s, fb) => {
    if (s == null) return fb;
    if (typeof s !== 'string') return s;
    try { return JSON.parse(s); } catch { return fb; }
};

const mergeWithDefaults = (sections) => {
    const arr = Array.isArray(sections) ? sections : [];
    if (arr.length === 0) return DEFAULT_HOME_SECTIONS;
    // Make sure every shipped default exists at least once. New defaults added later
    // appear at the end disabled-by-default-no, enabled (admin can hide).
    const known = new Set(arr.map(s => s.id));
    const merged = [...arr];
    for (const def of DEFAULT_HOME_SECTIONS) {
        if (!known.has(def.id)) merged.push({ ...def, order: merged.length + 1 });
    }
    return merged.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
};

export const getHomeConfig = async (req, res) => {
    try {
        const row = await prisma.homeConfig.findUnique({ where: { id: 1 } });
        const sections = mergeWithDefaults(safeJSON(row?.sections, []));
        res.json({ sections });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

export const updateHomeConfig = async (req, res) => {
    try {
        const sections = Array.isArray(req.body?.sections) ? req.body.sections : [];
        // Normalize order
        const normalized = sections.map((s, i) => ({ ...s, order: i + 1 }));
        const data = { sections: JSON.stringify(normalized) };
        const row = await prisma.homeConfig.upsert({
            where: { id: 1 },
            update: data,
            create: { id: 1, ...data }
        });
        res.json({ sections: normalized });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

export const resetHomeConfig = async (req, res) => {
    try {
        await prisma.homeConfig.deleteMany({ where: { id: 1 } });
        res.json({ sections: DEFAULT_HOME_SECTIONS });
    } catch (err) { res.status(500).json({ error: err.message }); }
};
