import prisma from '../db.js';
import { fetchProductFromDropea, fetchDropeaCatalog as fetchCatalogService } from '../services/dropea.service.js';
import { enrichOnImport } from '../services/landing.engine.js';

export const importFromDropea = async (req, res) => {
    const { dropeaId } = req.body;
    if (!dropeaId) return res.status(400).json({ error: 'Especifique o ID Dropea.' });

    try {
        const dropeaProduct = await fetchProductFromDropea(dropeaId);
        if (!dropeaProduct.success) {
            return res.status(400).json({ error: dropeaProduct.error });
        }

        const { name, stock, description, image_url } = dropeaProduct.data;

        // Recupera Configurações de Precificação Globais
        let settings = await prisma.storeSettings.findUnique({ where: { id: 1 } });
        if (!settings) {
            settings = { profit_margin_percent: 30.0, fixed_shipping_cost: 7.00 };
        }

        // Aplica Matemática do Motor: 
        // Preço Venda = (Custo + Envio) * (1 + % Lucro)
        const costPrice = parseFloat(dropeaProduct.data.price) || 0;
        const finalPrice = parseFloat(((costPrice + settings.fixed_shipping_cost) * (1 + (settings.profit_margin_percent / 100))).toFixed(2));

        // Persiste no DB Local (Fallback Manual Preservado)
        const product = await prisma.product.upsert({
            where: { dropea_id: dropeaId },
            update: { price: finalPrice, stock, is_active: true }, // Atualiza estoque e re-precifica
            create: {
                dropea_id: dropeaId,
                name,
                price: finalPrice,
                stock,
                description,
                image_url,
                is_active: true
            }
        });

        // Auto-generate landing data + similar products + kit (deterministic engine).
        try { await enrichOnImport(product); } catch (e) { console.error('enrichOnImport:', e.message); }

        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getProducts = async (req, res) => {
    try {
        const products = await prisma.product.findMany();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getProductById = async (req, res) => {
    try {
        const product = await prisma.product.findUnique({
            where: { id: parseInt(req.params.id) }
        });
        if (!product) return res.status(404).json({ error: 'Produto não encontrado' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateProduct = async (req, res) => {
    const { id } = req.params;
    const data = req.body;

    try {
        const updated = await prisma.product.update({
            where: { id: parseInt(id) },
            data
        });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const bulkImportFromDropea = async (req, res) => {
    try {
        // Fetch a large enough sample of the catalog
        const catalog = await fetchCatalogService(1000, 1);
        if (!catalog.success) return res.status(400).json({ error: catalog.error });

        // Retrieve pricing settings
        let settings = await prisma.storeSettings.findUnique({ where: { id: 1 } });
        if (!settings) settings = { profit_margin_percent: 30.0, fixed_shipping_cost: 7.00 };

        const items = catalog.data || [];
        let successCount = 0;

        for (const prd of items) {
            const costPrice = parseFloat(prd.cost_price || prd.pvpr || 0);
            const finalPrice = parseFloat(((costPrice + settings.fixed_shipping_cost) * (1 + (settings.profit_margin_percent / 100))).toFixed(2));

            try {
                const prod = await prisma.product.upsert({
                    where: { dropea_id: prd.id.toString() },
                    update: { price: finalPrice, stock: parseInt(prd.stock_available) || 0, is_active: true },
                    create: {
                        dropea_id: prd.id.toString(),
                        name: prd.name,
                        price: finalPrice,
                        stock: parseInt(prd.stock_available) || 0,
                        description: prd.description || prd.name,
                        image_url: prd.image || '',
                        is_active: true
                    }
                });
                try { await enrichOnImport(prod); } catch (e) { /* keep going on individual failures */ }
                successCount++;
            } catch (e) {
                console.error(`Error importing item ${prd.id}:`, e.message);
            }
        }

        res.json({ success: true, count: successCount, total: items.length });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getDropeaCatalog = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const catalog = await fetchCatalogService(1000, page); // Fetch up to 1000 items per page safely
        if (!catalog.success) return res.status(400).json({ error: catalog.error });

        // Retrieve pricing settings to simulate suggested prices
        let settings = await prisma.storeSettings.findUnique({ where: { id: 1 } });
        if (!settings) {
            settings = { profit_margin_percent: 30.0, fixed_shipping_cost: 7.00 };
        }

        // Hide items already imported into our database
        const importedItems = await prisma.product.findMany({
            where: { dropea_id: { not: null } },
            select: { dropea_id: true }
        });
        const importedIds = new Set(importedItems.map(item => item.dropea_id));

        const previewData = catalog.data
            .filter(item => !importedIds.has(item.id.toString()))
            .map(item => {
                const cost = parseFloat(item.cost_price || item.pvpr) || 0;
                const finalPrice = ((cost + settings.fixed_shipping_cost) * (1 + (settings.profit_margin_percent / 100))).toFixed(2);
                return {
                    ...item,
                    suggested_sell_price: parseFloat(finalPrice)
                };
            });

        res.json(previewData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
