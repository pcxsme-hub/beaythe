import prisma from '../db.js';

// === COUPONS ===

export const listCoupons = async (req, res) => {
    try { res.json(await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } })); }
    catch (err) { res.status(500).json({ error: err.message }); }
};

export const upsertCoupon = async (req, res) => {
    try {
        const b = req.body || {};
        if (!b.code) return res.status(400).json({ error: 'code is required' });
        const data = {
            code: String(b.code).toUpperCase().trim(),
            description: b.description || null,
            discount_pct: parseFloat(b.discount_pct ?? 0),
            min_subtotal: parseFloat(b.min_subtotal ?? 0),
            max_uses: b.max_uses != null && b.max_uses !== '' ? parseInt(b.max_uses, 10) : null,
            starts_at: b.starts_at ? new Date(b.starts_at) : null,
            ends_at: b.ends_at ? new Date(b.ends_at) : null,
            enabled: b.enabled !== false
        };
        const row = await prisma.coupon.upsert({
            where: { code: data.code },
            update: data,
            create: data
        });
        res.json(row);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

export const deleteCoupon = async (req, res) => {
    try {
        await prisma.coupon.delete({ where: { id: parseInt(req.params.id) } });
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

export const validateCoupon = async (req, res) => {
    try {
        const code = String(req.params.code || '').toUpperCase().trim();
        const subtotal = parseFloat(req.query.subtotal || '0');
        const c = await prisma.coupon.findUnique({ where: { code } });
        if (!c) return res.status(404).json({ valid: false, error: 'Cupón no encontrado' });
        const now = new Date();
        if (!c.enabled) return res.json({ valid: false, error: 'Cupón desactivado' });
        if (c.starts_at && now < c.starts_at) return res.json({ valid: false, error: 'Cupón aún no iniciado' });
        if (c.ends_at && now > c.ends_at) return res.json({ valid: false, error: 'Cupón expirado' });
        if (c.max_uses != null && c.used_count >= c.max_uses) return res.json({ valid: false, error: 'Cupón agotado' });
        if (subtotal < c.min_subtotal) return res.json({ valid: false, error: `Mínimo ${c.min_subtotal}€` });
        const discount = subtotal * (c.discount_pct / 100);
        res.json({ valid: true, discount_pct: c.discount_pct, discount, min_subtotal: c.min_subtotal });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

// === PROMO BANNERS ===

export const listPromoBanners = async (req, res) => {
    try { res.json(await prisma.promoBanner.findMany({ orderBy: { createdAt: 'desc' } })); }
    catch (err) { res.status(500).json({ error: err.message }); }
};

// Returns banners that are "live" right now (enabled, within date range) for the
// public-side renderer. Filters by placement and segment optionally.
export const livePromoBanners = async (req, res) => {
    try {
        const placement = req.query.placement;
        const segment = req.query.segment || 'ALL';
        const now = new Date();
        const all = await prisma.promoBanner.findMany();
        const live = all.filter(b => b.enabled
            && (!placement || b.placement === placement)
            && (!b.starts_at || b.starts_at <= now)
            && (!b.ends_at || b.ends_at >= now)
            && (b.segment === 'ALL' || b.segment === segment)
        );
        res.json(live);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

export const upsertPromoBanner = async (req, res) => {
    try {
        const b = req.body || {};
        const data = {
            name: b.name || 'Sem nome',
            placement: b.placement || 'TOP',
            enabled: b.enabled !== false,
            message_es: b.message_es || '',
            message_pt: b.message_pt || '',
            message_en: b.message_en || '',
            cta_label_es: b.cta_label_es || '',
            cta_label_pt: b.cta_label_pt || '',
            cta_label_en: b.cta_label_en || '',
            cta_link: b.cta_link || '',
            bg_color: b.bg_color || '#C4A49A',
            text_color: b.text_color || '#FFFFFF',
            segment: b.segment || 'ALL',
            starts_at: b.starts_at ? new Date(b.starts_at) : null,
            ends_at: b.ends_at ? new Date(b.ends_at) : null
        };
        const row = b.id
            ? await prisma.promoBanner.update({ where: { id: parseInt(b.id) }, data })
            : await prisma.promoBanner.create({ data });
        res.json(row);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

export const deletePromoBanner = async (req, res) => {
    try {
        await prisma.promoBanner.delete({ where: { id: parseInt(req.params.id) } });
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
};
