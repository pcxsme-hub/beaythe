import prisma from '../db.js';
import { DEFAULT_TOP_NAV, DEFAULT_MEGA_MENU, DEFAULT_FOOTER_COLUMNS } from '../data/navDefaults.js';

const safeJSON = (s, fb) => {
    if (s == null) return fb;
    if (typeof s !== 'string') return s;
    try { return JSON.parse(s); } catch { return fb; }
};

const buildConfig = async () => {
    const row = await prisma.navConfig.findUnique({ where: { id: 1 } });
    return {
        top_nav: safeJSON(row?.top_nav, null) || DEFAULT_TOP_NAV,
        mega_menu: safeJSON(row?.mega_menu, null) || DEFAULT_MEGA_MENU,
        footer: safeJSON(row?.footer, null) || DEFAULT_FOOTER_COLUMNS
    };
};

export const getNavConfig = async (req, res) => {
    try { res.json(await buildConfig()); }
    catch (err) { res.status(500).json({ error: err.message }); }
};

export const updateNavConfig = async (req, res) => {
    try {
        const data = {
            top_nav: JSON.stringify(req.body?.top_nav || []),
            mega_menu: JSON.stringify(req.body?.mega_menu || {}),
            footer: JSON.stringify(req.body?.footer || [])
        };
        await prisma.navConfig.upsert({
            where: { id: 1 },
            update: data,
            create: { id: 1, ...data }
        });
        res.json(await buildConfig());
    } catch (err) { res.status(500).json({ error: err.message }); }
};

export const resetNavConfig = async (req, res) => {
    try {
        await prisma.navConfig.deleteMany({ where: { id: 1 } });
        res.json(await buildConfig());
    } catch (err) { res.status(500).json({ error: err.message }); }
};
