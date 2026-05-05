// Deterministic Landing-Page Engine.
//
// Given a Product (and the rest of the catalog), this builds:
//   - category detection
//   - product.landing_page_data (problem/solution/benefits/faq/routine/...)
//   - product.recommended_products (top 4 similar)
//   - product.upsell_kits (1-2 kits with calculated discount)
//
// All deterministic — same input always yields same output. Admin overrides
// (LandingCategory rows + BundleRule row) take precedence over defaults shipped
// in `server/data/landingTemplates.js`.

import prisma from '../db.js';
import { DEFAULT_LANDING_TEMPLATES } from '../data/landingTemplates.js';

// ---- Helpers ----

const safeJSON = (s, fallback) => {
    if (s == null) return fallback;
    if (typeof s !== 'string') return s;
    try { return JSON.parse(s); } catch { return fallback; }
};

const stripDiacritics = (str) => (str || '').normalize('NFD').replace(/[̀-ͯ]/g, '');
const norm = (str) => stripDiacritics(String(str || '').toLowerCase());

// Hash a string into a non-negative integer (so the same product always picks the
// same variation across imports).
const hashSeed = (str) => {
    let h = 0;
    const s = String(str || '');
    for (let i = 0; i < s.length; i++) {
        h = ((h << 5) - h + s.charCodeAt(i)) | 0;
    }
    return Math.abs(h);
};

const pickVariation = (seed, list) => {
    if (!Array.isArray(list) || list.length === 0) return null;
    return list[seed % list.length];
};

const pickN = (seed, list, n) => {
    if (!Array.isArray(list) || list.length === 0) return [];
    const out = [];
    for (let i = 0; i < Math.min(n, list.length); i++) {
        out.push(list[(seed + i) % list.length]);
    }
    return out;
};

// ---- Loaders (DB > defaults merge) ----

export const loadCategories = async () => {
    let rows = [];
    try {
        rows = await prisma.landingCategory.findMany({ orderBy: { order: 'asc' } });
    } catch (e) {
        // Table may not exist yet (pre-migration). Fall back to defaults.
    }
    const dbBySlug = new Map(rows.map(r => [r.slug, r]));
    const defaultsBySlug = new Map(DEFAULT_LANDING_TEMPLATES.map(t => [t.slug, t]));

    // Merge: every default category, with DB overrides applied if present.
    const merged = [];
    for (const def of DEFAULT_LANDING_TEMPLATES) {
        const row = dbBySlug.get(def.slug);
        if (row) {
            merged.push({
                slug: row.slug,
                enabled: row.enabled,
                is_default: row.is_default ?? def.is_default ?? false,
                order: row.order ?? def.order ?? 0,
                label_es: row.label_es || def.label_es,
                label_pt: row.label_pt || def.label_pt,
                label_en: row.label_en || def.label_en,
                keywords_es: safeJSON(row.keywords_es, def.keywords_es || []),
                keywords_pt: safeJSON(row.keywords_pt, def.keywords_pt || []),
                keywords_en: safeJSON(row.keywords_en, def.keywords_en || []),
                copy_es: safeJSON(row.copy_es, def.copy_es || {}),
                copy_pt: safeJSON(row.copy_pt, def.copy_pt || {}),
                copy_en: safeJSON(row.copy_en, def.copy_en || {}),
                default_image_url: row.default_image_url || def.default_image_url || null,
                source: 'db+default'
            });
        } else {
            merged.push({ ...def, source: 'default' });
        }
    }
    // Plus: any DB-only categories that admin added that aren't in defaults
    for (const row of rows) {
        if (defaultsBySlug.has(row.slug)) continue;
        merged.push({
            slug: row.slug,
            enabled: row.enabled,
            is_default: row.is_default ?? false,
            order: row.order ?? 0,
            label_es: row.label_es || row.slug,
            label_pt: row.label_pt || row.slug,
            label_en: row.label_en || row.slug,
            keywords_es: safeJSON(row.keywords_es, []),
            keywords_pt: safeJSON(row.keywords_pt, []),
            keywords_en: safeJSON(row.keywords_en, []),
            copy_es: safeJSON(row.copy_es, {}),
            copy_pt: safeJSON(row.copy_pt, {}),
            copy_en: safeJSON(row.copy_en, {}),
            default_image_url: row.default_image_url || null,
            source: 'db'
        });
    }
    return merged
        .filter(c => c.enabled !== false)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
};

export const loadBundleRule = async () => {
    let row = null;
    try {
        row = await prisma.bundleRule.findUnique({ where: { id: 1 } });
    } catch (e) { /* table may not exist yet */ }
    return {
        category_weight: row?.category_weight ?? 2.0,
        tag_weight: row?.tag_weight ?? 1.0,
        price_weight: row?.price_weight ?? 1.0,
        price_range_pct: row?.price_range_pct ?? 30.0,
        min_score: row?.min_score ?? 2.0,
        default_discount_pct: row?.default_discount_pct ?? 10.0,
        max_kit_size: row?.max_kit_size ?? 3
    };
};

// ---- Detection ----

const haystack = (product) => norm([
    product.name,
    product.description || '',
    Array.isArray(product.tags) ? product.tags.join(' ') : (product.tags || ''),
    typeof product.product_type === 'string' ? product.product_type : '',
    typeof product.category === 'string' ? product.category : ''
].join(' '));

export const detectCategory = (product, categories) => {
    const text = haystack(product);
    let best = null;
    let bestScore = 0;
    for (const cat of categories) {
        if (cat.is_default) continue;
        const allKeywords = [
            ...(cat.keywords_es || []),
            ...(cat.keywords_pt || []),
            ...(cat.keywords_en || [])
        ].map(norm);
        let score = 0;
        for (const kw of allKeywords) {
            if (kw && text.includes(kw)) score += 1;
        }
        if (score > bestScore) {
            best = cat;
            bestScore = score;
        }
    }
    if (best) return best;
    // fall back to default category
    return categories.find(c => c.is_default) || categories[0] || null;
};

// ---- Ingredients regex parse ----

const INGREDIENT_HEADERS = [
    'ingredientes', 'ingredients', 'composicion', 'composición', 'composição',
    'inci', 'fórmula', 'formula'
];

export const extractIngredients = (description) => {
    if (!description) return [];
    const plain = stripDiacritics(String(description))
        .replace(/<[^>]+>/g, ' ')
        .replace(/&[a-z]+;/gi, ' ')
        .replace(/\s+/g, ' ');
    for (const header of INGREDIENT_HEADERS) {
        const re = new RegExp(`${header}\\s*[:\\-]\\s*([^.]{20,800}?)(?:\\.|$)`, 'i');
        const m = plain.match(re);
        if (m && m[1]) {
            return m[1].split(/[,;]+/).map(s => s.trim()).filter(s => s.length > 1).slice(0, 12);
        }
    }
    return [];
};

// ---- Build landing_page_data for a product ----

export const buildLandingData = (product, category, locale = 'es') => {
    if (!product) return null;
    const copy = (category && category[`copy_${locale}`]) || {};
    const seed = hashSeed(product.dropea_id || String(product.id) || product.name);

    const ingredientsList = extractIngredients(product.description);
    const ingredients = ingredientsList.length
        ? ingredientsList.map((name, i) => ({ name, benefit: '' }))
        : (copy.featurePills || []).slice(0, 4).map(name => ({ name, benefit: '' }));

    const benefitIcons = ['Droplets', 'Leaf', 'Sparkles', 'Shield', 'Wind', 'Lightbulb'];
    const benefits = (copy.benefits || []).map((b, i) => ({
        title: b.title,
        desc: b.desc,
        icon: benefitIcons[i % benefitIcons.length]
    }));

    return {
        category: category?.slug || 'general',
        primary: '#C4A49A',
        secondary: '#8A7369',
        bg: '#FCFAF8',
        accent: '#2C2826',
        marketing: {
            texture: category?.default_image_url || product.image_url || null,
            ingredient: product.image_url || null,
            lifestyle: category?.default_image_url || null
        },
        landingPage: {
            problem: {
                headline: pickVariation(seed, copy.headlines || []) || '',
                description: pickVariation(seed + 1, (copy.headlines || []).slice(1)) || ''
            },
            solution: {
                headline: pickVariation(seed + 2, copy.hooks || []) || '',
                benefits
            },
            faq: copy.faqs || [],
            routine: copy.routine || [],
            socialProof: {
                tag: pickVariation(seed, copy.hooks || []),
                title: pickVariation(seed + 3, copy.headlines || []),
                testimonials: [],
                stats: []
            },
            formulation: {
                title: copy.headlines?.[0] || '',
                description: copy.benefits?.[0]?.desc || '',
                ingredients,
                image: product.image_url
            },
            expertTips: {
                title: 'Tips',
                tips: (copy.routine || []).slice(0, 3).map(r => ({ title: r.name, text: r.desc }))
            }
        },
        claims: copy.claims || [],
        featurePills: copy.featurePills || []
    };
};

// ---- Similarity / Bundle ----

const intersection = (a, b) => {
    const sb = new Set((b || []).map(x => norm(x)));
    return (a || []).filter(x => sb.has(norm(x))).length;
};

const tagsOf = (p) => Array.isArray(p.tags) ? p.tags : safeJSON(p.tags, []);

export const findSimilar = (product, allProducts, categories, rule) => {
    const detected = detectCategory(product, categories);
    const detectedSlug = detected?.slug;
    const productPrice = Number(product.manual_price || product.price || 0);
    const tagsA = tagsOf(product).map(norm);

    const candidates = allProducts
        .filter(p => p.id !== product.id && p.is_active !== false)
        .map(p => {
            const otherCat = detectCategory(p, categories);
            const sameCat = otherCat?.slug === detectedSlug ? 1 : 0;
            const tagsB = tagsOf(p).map(norm);
            const tagOverlap = intersection(tagsA, tagsB);
            const priceOther = Number(p.manual_price || p.price || 0);
            const priceDiff = productPrice > 0 ? Math.abs(priceOther - productPrice) / productPrice : 0;
            const priceClose = priceDiff <= rule.price_range_pct / 100 ? 1 : 0;
            const score = sameCat * rule.category_weight
                + tagOverlap * rule.tag_weight
                + priceClose * rule.price_weight;
            return { product: p, score };
        })
        .filter(c => c.score >= rule.min_score)
        .sort((a, b) => b.score - a.score);

    return candidates;
};

export const buildKit = (product, similarRanked, rule) => {
    if (!similarRanked || similarRanked.length < 2) return null;
    const items = similarRanked.slice(0, Math.max(2, rule.max_kit_size - 1)).map(s => s.product);
    const all = [product, ...items];
    const subtotal = all.reduce((sum, p) => sum + Number(p.manual_price || p.price || 0), 0);
    const discounted = subtotal * (1 - (rule.default_discount_pct / 100));
    return {
        title: 'Kit Recomendado',
        discount_pct: rule.default_discount_pct,
        original_price: parseFloat(subtotal.toFixed(2)),
        kit_price: parseFloat(discounted.toFixed(2)),
        savings: parseFloat((subtotal - discounted).toFixed(2)),
        items: all.map(p => ({
            id: p.id,
            name: p.name,
            price: Number(p.manual_price || p.price || 0),
            image: p.image_url || ''
        }))
    };
};

// ---- Top-level orchestration ----

export const buildEverythingForProduct = async (product, allProducts, locale = 'es') => {
    const [categories, rule] = await Promise.all([loadCategories(), loadBundleRule()]);
    const category = detectCategory(product, categories);
    const landing = buildLandingData(product, category, locale);
    const similarRanked = findSimilar(product, allProducts, categories, rule);
    const recommended_products = similarRanked.slice(0, 4).map(s => s.product.id);
    const kit = buildKit(product, similarRanked, rule);
    const upsell_kits = kit ? [kit] : [];
    return {
        category_slug: category?.slug || 'general',
        landing_page_data: landing,
        recommended_products,
        upsell_kits
    };
};

// Persist the engine result back into a product row.
export const regenerateProduct = async (productId, locale = 'es') => {
    const product = await prisma.product.findUnique({ where: { id: parseInt(productId) } });
    if (!product) throw new Error(`Product ${productId} not found`);
    const all = await prisma.product.findMany();
    // Prepare arrays: parse tags before passing through
    const enrich = (p) => ({ ...p, tags: safeJSON(p.tags, []) });
    const result = await buildEverythingForProduct(enrich(product), all.map(enrich), locale);
    await prisma.product.update({
        where: { id: product.id },
        data: {
            landing_page_data: JSON.stringify(result.landing_page_data),
            recommended_products: JSON.stringify(result.recommended_products),
            upsell_kits: JSON.stringify(result.upsell_kits)
        }
    });
    return result;
};

export const regenerateAllProducts = async (locale = 'es') => {
    const all = await prisma.product.findMany();
    const enrich = (p) => ({ ...p, tags: safeJSON(p.tags, []) });
    const enrichedAll = all.map(enrich);
    let count = 0;
    for (const product of enrichedAll) {
        try {
            const result = await buildEverythingForProduct(product, enrichedAll, locale);
            await prisma.product.update({
                where: { id: product.id },
                data: {
                    landing_page_data: JSON.stringify(result.landing_page_data),
                    recommended_products: JSON.stringify(result.recommended_products),
                    upsell_kits: JSON.stringify(result.upsell_kits)
                }
            });
            count++;
        } catch (e) {
            console.error(`regenerate ${product.id}: ${e.message}`);
        }
    }
    return { regenerated: count, total: all.length };
};

// Used during product import to compute landing data inline (without needing
// a second DB roundtrip for the freshly created product).
export const enrichOnImport = async (createdProduct, locale = 'es') => {
    const all = await prisma.product.findMany();
    const enrich = (p) => ({ ...p, tags: safeJSON(p.tags, []) });
    const result = await buildEverythingForProduct(enrich(createdProduct), all.map(enrich), locale);
    await prisma.product.update({
        where: { id: createdProduct.id },
        data: {
            landing_page_data: JSON.stringify(result.landing_page_data),
            recommended_products: JSON.stringify(result.recommended_products),
            upsell_kits: JSON.stringify(result.upsell_kits)
        }
    });
    return result;
};
