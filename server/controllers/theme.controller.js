import prisma from '../db.js';

const DEFAULTS = {
    brand_name: 'Beauthé',
    logo_url: null,
    favicon_url: null,
    color_primary: '#2C2826',
    color_accent: '#C4A49A',
    color_bg: '#FCFAF8',
    color_surface: '#F4EFEA',
    color_border: '#F1EBE6',
    color_text: '#5C534F',
    font_heading: 'Outfit',
    font_body: 'Outfit',
    radius_sm: 12,
    radius_md: 20,
    radius_lg: 32
};

const buildConfig = async () => {
    try {
        const row = await prisma.themeConfig.findUnique({ where: { id: 1 } });
        return row ? { ...DEFAULTS, ...row } : DEFAULTS;
    } catch { return DEFAULTS; }
};

export const getTheme = async (req, res) => {
    try { res.json(await buildConfig()); }
    catch (err) { res.status(500).json({ error: err.message }); }
};

export const updateTheme = async (req, res) => {
    try {
        const b = req.body || {};
        const data = {
            brand_name: b.brand_name ?? DEFAULTS.brand_name,
            logo_url: b.logo_url ?? null,
            favicon_url: b.favicon_url ?? null,
            color_primary: b.color_primary ?? DEFAULTS.color_primary,
            color_accent: b.color_accent ?? DEFAULTS.color_accent,
            color_bg: b.color_bg ?? DEFAULTS.color_bg,
            color_surface: b.color_surface ?? DEFAULTS.color_surface,
            color_border: b.color_border ?? DEFAULTS.color_border,
            color_text: b.color_text ?? DEFAULTS.color_text,
            font_heading: b.font_heading ?? DEFAULTS.font_heading,
            font_body: b.font_body ?? DEFAULTS.font_body,
            radius_sm: parseInt(b.radius_sm ?? DEFAULTS.radius_sm, 10),
            radius_md: parseInt(b.radius_md ?? DEFAULTS.radius_md, 10),
            radius_lg: parseInt(b.radius_lg ?? DEFAULTS.radius_lg, 10)
        };
        await prisma.themeConfig.upsert({
            where: { id: 1 },
            update: data,
            create: { id: 1, ...data }
        });
        res.json(await buildConfig());
    } catch (err) { res.status(500).json({ error: err.message }); }
};

export const resetTheme = async (req, res) => {
    try {
        await prisma.themeConfig.deleteMany({ where: { id: 1 } });
        res.json(DEFAULTS);
    } catch (err) { res.status(500).json({ error: err.message }); }
};
