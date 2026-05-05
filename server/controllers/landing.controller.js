import prisma from '../db.js';
import { DEFAULT_LANDING_TEMPLATES } from '../data/landingTemplates.js';
import {
    loadCategories,
    loadBundleRule,
    detectCategory,
    buildLandingData,
    findSimilar,
    buildKit,
    buildEverythingForProduct,
    regenerateProduct,
    regenerateAllProducts
} from '../services/landing.engine.js';

const safeJSON = (s, fb) => { if (s == null) return fb; if (typeof s !== 'string') return s; try { return JSON.parse(s); } catch { return fb; } };

// --- LandingCategory CRUD ---

export const listCategories = async (req, res) => {
    try {
        const cats = await loadCategories();
        res.json(cats);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

export const upsertCategory = async (req, res) => {
    try {
        const data = req.body || {};
        if (!data.slug) return res.status(400).json({ error: 'slug is required' });
        const payload = {
            slug: data.slug,
            enabled: data.enabled !== false,
            is_default: !!data.is_default,
            order: data.order || 0,
            label_es: data.label_es || '',
            label_pt: data.label_pt || '',
            label_en: data.label_en || '',
            keywords_es: JSON.stringify(data.keywords_es || []),
            keywords_pt: JSON.stringify(data.keywords_pt || []),
            keywords_en: JSON.stringify(data.keywords_en || []),
            copy_es: JSON.stringify(data.copy_es || {}),
            copy_pt: JSON.stringify(data.copy_pt || {}),
            copy_en: JSON.stringify(data.copy_en || {}),
            default_image_url: data.default_image_url || null
        };
        const row = await prisma.landingCategory.upsert({
            where: { slug: data.slug },
            update: payload,
            create: payload
        });
        res.json(row);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

export const deleteCategory = async (req, res) => {
    try {
        await prisma.landingCategory.delete({ where: { id: parseInt(req.params.id) } });
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

// Reset a category back to its shipped default by clearing the DB row.
export const resetCategory = async (req, res) => {
    try {
        const slug = req.params.slug;
        await prisma.landingCategory.deleteMany({ where: { slug } });
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

// Seed all defaults into the DB so admin can start editing from a populated state.
export const seedDefaults = async (req, res) => {
    try {
        let created = 0;
        for (const def of DEFAULT_LANDING_TEMPLATES) {
            await prisma.landingCategory.upsert({
                where: { slug: def.slug },
                update: {},
                create: {
                    slug: def.slug,
                    enabled: true,
                    is_default: !!def.is_default,
                    order: def.order || 0,
                    label_es: def.label_es || '',
                    label_pt: def.label_pt || '',
                    label_en: def.label_en || '',
                    keywords_es: JSON.stringify(def.keywords_es || []),
                    keywords_pt: JSON.stringify(def.keywords_pt || []),
                    keywords_en: JSON.stringify(def.keywords_en || []),
                    copy_es: JSON.stringify(def.copy_es || {}),
                    copy_pt: JSON.stringify(def.copy_pt || {}),
                    copy_en: JSON.stringify(def.copy_en || {}),
                    default_image_url: def.default_image_url || null
                }
            });
            created++;
        }
        res.json({ seeded: created });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

// --- BundleRule singleton ---

export const getBundleRule = async (req, res) => {
    try {
        const rule = await loadBundleRule();
        res.json(rule);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

export const updateBundleRule = async (req, res) => {
    try {
        const d = req.body || {};
        const data = {
            category_weight: parseFloat(d.category_weight ?? 2.0),
            tag_weight: parseFloat(d.tag_weight ?? 1.0),
            price_weight: parseFloat(d.price_weight ?? 1.0),
            price_range_pct: parseFloat(d.price_range_pct ?? 30.0),
            min_score: parseFloat(d.min_score ?? 2.0),
            default_discount_pct: parseFloat(d.default_discount_pct ?? 10.0),
            max_kit_size: parseInt(d.max_kit_size ?? 3, 10)
        };
        const row = await prisma.bundleRule.upsert({
            where: { id: 1 },
            update: data,
            create: { id: 1, ...data }
        });
        res.json(row);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

// --- Preview (without persisting) ---

export const previewProduct = async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        const locale = req.query.locale || 'es';
        const product = await prisma.product.findUnique({ where: { id: productId } });
        if (!product) return res.status(404).json({ error: 'Product not found' });
        const all = await prisma.product.findMany();
        const enrich = (p) => ({ ...p, tags: safeJSON(p.tags, []) });
        const result = await buildEverythingForProduct(enrich(product), all.map(enrich), locale);
        res.json(result);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

// --- Regenerate persistently ---

export const regenerateOne = async (req, res) => {
    try {
        const result = await regenerateProduct(parseInt(req.params.id), req.query.locale || 'es');
        res.json(result);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

export const regenerateAll = async (req, res) => {
    try {
        const result = await regenerateAllProducts(req.query.locale || 'es');
        res.json(result);
    } catch (err) { res.status(500).json({ error: err.message }); }
};
