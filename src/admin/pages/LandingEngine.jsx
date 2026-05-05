import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, RotateCcw, Save, Eye, Languages, Sparkles, Tag, ListChecks, MessageSquare, Workflow, Image as ImageIcon, Settings2, Zap, Search } from 'lucide-react';
import {
    getLandingCategories,
    upsertLandingCategory,
    deleteLandingCategory,
    resetLandingCategory,
    seedLandingDefaults,
    getBundleRule,
    updateBundleRule,
    previewLandingForProduct,
    regenerateLanding,
    regenerateAllLanding,
    getProducts
} from '../services/db';

const LOCALES = [
    { id: 'es', label: 'Español' },
    { id: 'pt', label: 'Português' },
    { id: 'en', label: 'English' }
];

const TABS = [
    { id: 'categories', label: 'Categorias & Detecção', icon: Tag },
    { id: 'copy', label: 'Banco de Copy', icon: MessageSquare },
    { id: 'bundle', label: 'Regras de Kit', icon: Workflow },
    { id: 'preview', label: 'Preview & Aplicar', icon: Eye }
];

const Toast = ({ msg, type }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className={`fixed bottom-6 right-6 px-5 py-3 rounded-2xl text-sm font-bold shadow-2xl z-50 ${type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}
    >
        {msg}
    </motion.div>
);

const TextInput = ({ label, value, onChange, placeholder, mono }) => (
    <label className="block">
        {label && <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1.5 block">{label}</span>}
        <input
            type="text"
            value={value || ''}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            className={`w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all ${mono ? 'font-mono text-[13px]' : ''}`}
        />
    </label>
);

const TextArea = ({ label, value, onChange, rows = 3, placeholder }) => (
    <label className="block">
        {label && <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1.5 block">{label}</span>}
        <textarea
            value={value || ''}
            onChange={e => onChange(e.target.value)}
            rows={rows}
            placeholder={placeholder}
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all resize-none"
        />
    </label>
);

const StringList = ({ label, items, onChange, placeholder }) => {
    const list = Array.isArray(items) ? items : [];
    const update = (idx, val) => { const next = [...list]; next[idx] = val; onChange(next); };
    const add = () => onChange([...list, '']);
    const remove = (idx) => onChange(list.filter((_, i) => i !== idx));
    return (
        <div>
            {label && <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500">{label}</span>
                <button onClick={add} className="text-[11px] font-bold text-rose-600 hover:text-rose-700 inline-flex items-center gap-1"><Plus size={14} /> Adicionar</button>
            </div>}
            <div className="space-y-2">
                {list.map((item, idx) => (
                    <div key={idx} className="flex gap-2">
                        <input
                            type="text"
                            value={item}
                            onChange={e => update(idx, e.target.value)}
                            placeholder={placeholder}
                            className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2 text-[14px] outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                        />
                        <button onClick={() => remove(idx)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                    </div>
                ))}
                {list.length === 0 && <p className="text-[12px] text-gray-400 italic">Lista vazia</p>}
            </div>
        </div>
    );
};

const ObjectList = ({ label, items, onChange, fields }) => {
    const list = Array.isArray(items) ? items : [];
    const update = (idx, key, val) => { const next = [...list]; next[idx] = { ...next[idx], [key]: val }; onChange(next); };
    const add = () => onChange([...list, fields.reduce((o, f) => ({ ...o, [f.key]: '' }), {})]);
    const remove = (idx) => onChange(list.filter((_, i) => i !== idx));
    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500">{label}</span>
                <button onClick={add} className="text-[11px] font-bold text-rose-600 hover:text-rose-700 inline-flex items-center gap-1"><Plus size={14} /> Adicionar</button>
            </div>
            <div className="space-y-3">
                {list.map((item, idx) => (
                    <div key={idx} className="bg-white border border-gray-200 rounded-2xl p-4 relative">
                        <button onClick={() => remove(idx)} className="absolute top-3 right-3 text-gray-300 hover:text-red-500 transition-colors">
                            <Trash2 size={14} />
                        </button>
                        <div className="grid grid-cols-1 gap-3 pr-6">
                            {fields.map(f => (
                                f.long
                                    ? <TextArea key={f.key} label={f.label} value={item[f.key]} onChange={v => update(idx, f.key, v)} rows={2} />
                                    : <TextInput key={f.key} label={f.label} value={item[f.key]} onChange={v => update(idx, f.key, v)} />
                            ))}
                        </div>
                    </div>
                ))}
                {list.length === 0 && <p className="text-[12px] text-gray-400 italic">Sem itens. Adicione o primeiro.</p>}
            </div>
        </div>
    );
};

// =========================================================================

export default function LandingEngine() {
    const [tab, setTab] = useState('categories');
    const [categories, setCategories] = useState([]);
    const [bundle, setBundle] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);
    const [activeSlug, setActiveSlug] = useState(null);
    const [activeLocale, setActiveLocale] = useState('es');
    const [previewProductId, setPreviewProductId] = useState(null);
    const [previewData, setPreviewData] = useState(null);
    const [previewLoading, setPreviewLoading] = useState(false);
    const [search, setSearch] = useState('');

    const showToast = (msg, type) => { setToast({ msg, type }); setTimeout(() => setToast(null), 2500); };

    const reload = async () => {
        setLoading(true);
        const [cats, rule, prods] = await Promise.all([
            getLandingCategories(),
            getBundleRule(),
            getProducts()
        ]);
        setCategories(cats);
        setBundle(rule);
        setProducts(prods);
        if (!activeSlug && cats.length) setActiveSlug(cats[0].slug);
        if (!previewProductId && prods.length) setPreviewProductId(prods[0].id);
        setLoading(false);
    };

    useEffect(() => { reload(); }, []);

    const activeCategory = useMemo(() => categories.find(c => c.slug === activeSlug), [categories, activeSlug]);

    const updateActive = (changes) => {
        if (!activeCategory) return;
        const updated = { ...activeCategory, ...changes };
        setCategories(categories.map(c => c.slug === activeSlug ? updated : c));
    };

    const updateActiveCopy = (locale, key, value) => {
        const copyKey = `copy_${locale}`;
        const next = { ...(activeCategory[copyKey] || {}), [key]: value };
        updateActive({ [copyKey]: next });
    };

    const saveActive = async () => {
        if (!activeCategory) return;
        try {
            await upsertLandingCategory(activeCategory);
            showToast('Categoria guardada com sucesso', 'success');
        } catch (e) { showToast('Erro ao guardar', 'error'); }
    };

    const deleteActive = async () => {
        if (!activeCategory) return;
        if (!confirm(`Apagar categoria "${activeCategory.slug}"?`)) return;
        try {
            await deleteLandingCategory(activeCategory.id);
            await reload();
            showToast('Categoria apagada', 'success');
        } catch (e) { showToast('Erro ao apagar', 'error'); }
    };

    const resetActiveToDefault = async () => {
        if (!activeCategory) return;
        if (!confirm(`Restaurar "${activeCategory.slug}" para os defaults?`)) return;
        try {
            await resetLandingCategory(activeCategory.slug);
            await reload();
            showToast('Restaurada para defaults', 'success');
        } catch (e) { showToast('Erro ao restaurar', 'error'); }
    };

    const seedDefaults = async () => {
        try {
            await seedLandingDefaults();
            await reload();
            showToast('Defaults aplicados', 'success');
        } catch (e) { showToast('Erro ao seed', 'error'); }
    };

    const addNewCategory = () => {
        const slug = prompt('Slug da nova categoria (ex: "perfumes-femeninos"):')?.trim();
        if (!slug) return;
        const empty = {
            slug,
            enabled: true,
            is_default: false,
            order: (categories.at(-1)?.order || 0) + 1,
            label_es: slug, label_pt: slug, label_en: slug,
            keywords_es: [], keywords_pt: [], keywords_en: [],
            copy_es: { hooks: [], headlines: [], benefits: [], faqs: [], routine: [], claims: [], featurePills: [] },
            copy_pt: { hooks: [], headlines: [], benefits: [], faqs: [], routine: [], claims: [], featurePills: [] },
            copy_en: { hooks: [], headlines: [], benefits: [], faqs: [], routine: [], claims: [], featurePills: [] },
            default_image_url: ''
        };
        setCategories([...categories, empty]);
        setActiveSlug(slug);
        showToast('Adicionada localmente — clique em Guardar para persistir', 'success');
    };

    const saveBundle = async () => {
        try {
            await updateBundleRule(bundle);
            showToast('Regras guardadas', 'success');
        } catch (e) { showToast('Erro ao guardar regras', 'error'); }
    };

    const runPreview = async () => {
        if (!previewProductId) return;
        setPreviewLoading(true);
        try {
            const res = await previewLandingForProduct(previewProductId, activeLocale);
            setPreviewData(res);
        } catch (e) {
            setPreviewData({ error: e.message });
        }
        setPreviewLoading(false);
    };

    const applyOne = async () => {
        if (!previewProductId) return;
        try {
            await regenerateLanding(previewProductId, activeLocale);
            showToast('Aplicado a este produto', 'success');
        } catch (e) { showToast('Erro ao aplicar', 'error'); }
    };

    const applyAll = async () => {
        if (!confirm(`Regenerar landing pages de TODOS os ${products.length} produtos? Isto sobrescreve os campos landing_page_data, recommended_products e upsell_kits.`)) return;
        try {
            const r = await regenerateAllLanding(activeLocale);
            showToast(`${r.regenerated}/${r.total} produtos regenerados`, 'success');
        } catch (e) { showToast('Erro ao aplicar a todos', 'error'); }
    };

    const filteredCategories = categories.filter(c =>
        !search || c.slug.toLowerCase().includes(search.toLowerCase()) ||
        c.label_es?.toLowerCase().includes(search.toLowerCase()) ||
        c.label_pt?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return <div className="p-12 text-center text-gray-400">A carregar engine...</div>;
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900 flex items-center gap-3">
                    <Sparkles className="text-rose-500" size={28} />
                    Motor de Landing Pages
                </h1>
                <p className="text-gray-500 mt-2 max-w-2xl">
                    Edita as categorias, copy banks e regras de kit usadas para gerar automaticamente cada página de produto importado da Dropea.
                </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-8 bg-gray-100 rounded-2xl p-1.5 max-w-2xl">
                {TABS.map(t => {
                    const Icon = t.icon;
                    const active = tab === t.id;
                    return (
                        <button
                            key={t.id}
                            onClick={() => setTab(t.id)}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold transition-all ${active ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            <Icon size={16} />
                            {t.label}
                        </button>
                    );
                })}
            </div>

            {/* === CATEGORIES TAB === */}
            {tab === 'categories' && (
                <div className="grid grid-cols-12 gap-6">
                    {/* Left: list */}
                    <div className="col-span-4">
                        <div className="bg-white rounded-2xl border border-gray-200 p-4 sticky top-4">
                            <div className="relative mb-3">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Pesquisar..."
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-9 pr-3 py-2 text-[13px] outline-none focus:bg-white focus:border-rose-300"
                                />
                            </div>

                            <div className="space-y-1 max-h-[60vh] overflow-y-auto pr-1">
                                {filteredCategories.map(cat => {
                                    const active = cat.slug === activeSlug;
                                    return (
                                        <button
                                            key={cat.slug}
                                            onClick={() => setActiveSlug(cat.slug)}
                                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all ${active ? 'bg-rose-50 border border-rose-200' : 'hover:bg-gray-50 border border-transparent'}`}
                                        >
                                            <div className="flex flex-col">
                                                <span className={`text-[13px] font-bold ${active ? 'text-rose-700' : 'text-gray-900'}`}>{cat.label_es || cat.slug}</span>
                                                <span className="text-[10px] font-mono text-gray-400">{cat.slug}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                {cat.is_default && <span className="text-[8px] font-bold uppercase bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">Default</span>}
                                                {!cat.enabled && <span className="text-[8px] font-bold uppercase bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">Off</span>}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="border-t border-gray-100 pt-3 mt-3 space-y-2">
                                <button onClick={addNewCategory} className="w-full text-[12px] font-bold text-rose-600 hover:bg-rose-50 py-2 rounded-xl inline-flex items-center justify-center gap-1.5">
                                    <Plus size={14} /> Nova categoria
                                </button>
                                <button onClick={seedDefaults} className="w-full text-[11px] font-bold text-gray-500 hover:text-gray-900 hover:bg-gray-50 py-1.5 rounded-xl inline-flex items-center justify-center gap-1.5">
                                    <RotateCcw size={12} /> Reaplicar defaults
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right: editor */}
                    <div className="col-span-8">
                        {!activeCategory ? <div className="text-gray-400">Selecione uma categoria</div> : (
                            <div className="space-y-6">
                                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                    <div className="flex items-center justify-between mb-5">
                                        <div>
                                            <h2 className="text-xl font-black text-gray-900">{activeCategory.label_es || activeCategory.slug}</h2>
                                            <p className="text-[11px] font-mono text-gray-400 mt-1">{activeCategory.slug}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button onClick={resetActiveToDefault} className="text-[11px] font-bold text-gray-500 hover:text-gray-900 px-3 py-2 rounded-lg inline-flex items-center gap-1.5"><RotateCcw size={12} /> Reset</button>
                                            <button onClick={deleteActive} className="text-[11px] font-bold text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg inline-flex items-center gap-1.5"><Trash2 size={12} /> Apagar</button>
                                            <button onClick={saveActive} className="text-[12px] font-bold bg-gray-900 text-white px-5 py-2 rounded-lg hover:bg-black inline-flex items-center gap-1.5"><Save size={14} /> Guardar</button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <TextInput label="Slug (interno)" value={activeCategory.slug} onChange={v => updateActive({ slug: v })} mono />
                                        <TextInput label="Imagem padrão (URL)" value={activeCategory.default_image_url} onChange={v => updateActive({ default_image_url: v })} mono />
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 mt-4">
                                        <TextInput label="Label ES" value={activeCategory.label_es} onChange={v => updateActive({ label_es: v })} />
                                        <TextInput label="Label PT" value={activeCategory.label_pt} onChange={v => updateActive({ label_pt: v })} />
                                        <TextInput label="Label EN" value={activeCategory.label_en} onChange={v => updateActive({ label_en: v })} />
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 mt-4">
                                        <label className="flex items-center gap-2 text-[12px] font-bold text-gray-600 cursor-pointer">
                                            <input type="checkbox" checked={activeCategory.enabled} onChange={e => updateActive({ enabled: e.target.checked })} className="w-4 h-4 accent-rose-500" />
                                            Ativada
                                        </label>
                                        <label className="flex items-center gap-2 text-[12px] font-bold text-gray-600 cursor-pointer">
                                            <input type="checkbox" checked={activeCategory.is_default} onChange={e => updateActive({ is_default: e.target.checked })} className="w-4 h-4 accent-rose-500" />
                                            Fallback genérico
                                        </label>
                                        <label className="block">
                                            <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1.5 block">Ordem</span>
                                            <input type="number" value={activeCategory.order || 0} onChange={e => updateActive({ order: parseInt(e.target.value) || 0 })} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-[14px] outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100" />
                                        </label>
                                    </div>
                                </div>

                                {/* Detection keywords */}
                                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                    <h3 className="text-sm font-black text-gray-900 mb-4 uppercase tracking-widest flex items-center gap-2"><Languages size={14} /> Keywords de detecção</h3>
                                    <p className="text-[12px] text-gray-500 mb-5">O motor procura estas palavras no nome, descrição, tags e categoria do produto. Quanto mais hits, maior a confiança.</p>

                                    <div className="space-y-5">
                                        {LOCALES.map(loc => (
                                            <div key={loc.id}>
                                                <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500 inline-flex items-center gap-2 mb-2">
                                                    <span className="bg-gray-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">{loc.id.toUpperCase()}</span>
                                                    {loc.label}
                                                </span>
                                                <StringList
                                                    items={activeCategory[`keywords_${loc.id}`] || []}
                                                    onChange={v => updateActive({ [`keywords_${loc.id}`]: v })}
                                                    placeholder={`palavra-chave em ${loc.label}`}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* === COPY TAB === */}
            {tab === 'copy' && activeCategory && (
                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-3">
                        <div className="bg-white rounded-2xl border border-gray-200 p-4 sticky top-4">
                            <div className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-3">Categoria</div>
                            <select value={activeSlug} onChange={e => setActiveSlug(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-[13px] mb-4">
                                {categories.map(c => <option key={c.slug} value={c.slug}>{c.label_es || c.slug}</option>)}
                            </select>

                            <div className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-3">Idioma</div>
                            <div className="flex flex-col gap-1">
                                {LOCALES.map(loc => (
                                    <button
                                        key={loc.id}
                                        onClick={() => setActiveLocale(loc.id)}
                                        className={`w-full text-left px-3 py-2 rounded-xl text-[13px] font-bold transition-all ${activeLocale === loc.id ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'text-gray-600 hover:bg-gray-50 border border-transparent'}`}
                                    >
                                        {loc.label}
                                    </button>
                                ))}
                            </div>

                            <button onClick={saveActive} className="w-full mt-5 text-[12px] font-bold bg-gray-900 text-white px-4 py-2.5 rounded-xl hover:bg-black inline-flex items-center justify-center gap-1.5">
                                <Save size={14} /> Guardar tudo
                            </button>
                        </div>
                    </div>

                    <div className="col-span-9 space-y-6">
                        {(() => {
                            const copyKey = `copy_${activeLocale}`;
                            const copy = activeCategory[copyKey] || {};
                            const set = (key, value) => updateActiveCopy(activeLocale, key, value);
                            return (
                                <>
                                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                        <h3 className="text-sm font-black text-gray-900 mb-1 uppercase tracking-widest flex items-center gap-2"><MessageSquare size={14} /> Hooks (frase curta acima do título)</h3>
                                        <p className="text-[12px] text-gray-500 mb-4">3-5 variações. O motor escolhe deterministicamente conforme o ID do produto.</p>
                                        <StringList items={copy.hooks} onChange={v => set('hooks', v)} placeholder="Ex: Concentrado de eficacia" />
                                    </div>

                                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                        <h3 className="text-sm font-black text-gray-900 mb-1 uppercase tracking-widest flex items-center gap-2"><Sparkles size={14} /> Headlines (h2 da seção problema/solução)</h3>
                                        <p className="text-[12px] text-gray-500 mb-4">Frases mais longas, com gancho de venda.</p>
                                        <StringList items={copy.headlines} onChange={v => set('headlines', v)} placeholder="Ex: Activos puros, resultados visibles" />
                                    </div>

                                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                        <h3 className="text-sm font-black text-gray-900 mb-1 uppercase tracking-widest flex items-center gap-2"><ListChecks size={14} /> Benefícios (4 pílulas)</h3>
                                        <ObjectList
                                            items={copy.benefits}
                                            onChange={v => set('benefits', v)}
                                            fields={[
                                                { key: 'title', label: 'Título' },
                                                { key: 'desc', label: 'Descrição', long: true }
                                            ]}
                                        />
                                    </div>

                                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                        <h3 className="text-sm font-black text-gray-900 mb-1 uppercase tracking-widest flex items-center gap-2"><MessageSquare size={14} /> Perguntas Frequentes</h3>
                                        <ObjectList
                                            items={copy.faqs}
                                            onChange={v => set('faqs', v)}
                                            fields={[
                                                { key: 'q', label: 'Pergunta' },
                                                { key: 'a', label: 'Resposta', long: true }
                                            ]}
                                        />
                                    </div>

                                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                        <h3 className="text-sm font-black text-gray-900 mb-1 uppercase tracking-widest flex items-center gap-2"><Workflow size={14} /> Rotina sugerida</h3>
                                        <ObjectList
                                            items={copy.routine}
                                            onChange={v => set('routine', v)}
                                            fields={[
                                                { key: 'name', label: 'Passo' },
                                                { key: 'desc', label: 'Descrição', long: true }
                                            ]}
                                        />
                                    </div>

                                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                        <h3 className="text-sm font-black text-gray-900 mb-1 uppercase tracking-widest flex items-center gap-2"><Tag size={14} /> Claims (badges curtas)</h3>
                                        <p className="text-[12px] text-gray-500 mb-4">Aparecem na strip de confiança e no rodapé do hero.</p>
                                        <StringList items={copy.claims} onChange={v => set('claims', v)} placeholder="Ex: Vegano" />
                                    </div>

                                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                        <h3 className="text-sm font-black text-gray-900 mb-1 uppercase tracking-widest flex items-center gap-2"><ImageIcon size={14} /> Pílulas sobre a imagem</h3>
                                        <p className="text-[12px] text-gray-500 mb-4">Aparecem flutuando no hover da imagem grande.</p>
                                        <StringList items={copy.featurePills} onChange={v => set('featurePills', v)} placeholder="Ex: Ultra concentrado" />
                                    </div>
                                </>
                            );
                        })()}
                    </div>
                </div>
            )}

            {/* === BUNDLE TAB === */}
            {tab === 'bundle' && bundle && (
                <div className="max-w-3xl space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <h3 className="text-sm font-black text-gray-900 mb-1 uppercase tracking-widest flex items-center gap-2"><Settings2 size={14} /> Pesos da similaridade</h3>
                        <p className="text-[12px] text-gray-500 mb-6">Score = (mesma_categoria × {bundle.category_weight.toFixed(1)}) + (tags_em_comum × {bundle.tag_weight.toFixed(1)}) + (preço_próximo × {bundle.price_weight.toFixed(1)}). Produtos com score ≥ {bundle.min_score.toFixed(1)} entram nas recomendações/kit.</p>

                        <div className="grid grid-cols-2 gap-5">
                            {[
                                ['category_weight', 'Peso de categoria igual'],
                                ['tag_weight', 'Peso por tag em comum'],
                                ['price_weight', 'Peso de preço próximo'],
                                ['price_range_pct', 'Tolerância de preço (%)'],
                                ['min_score', 'Score mínimo para entrar'],
                                ['default_discount_pct', 'Desconto padrão do kit (%)'],
                                ['max_kit_size', 'Tamanho máximo do kit']
                            ].map(([key, label]) => (
                                <label key={key} className="block">
                                    <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1.5 block">{label}</span>
                                    <input
                                        type="number"
                                        step="0.5"
                                        value={bundle[key]}
                                        onChange={e => setBundle({ ...bundle, [key]: parseFloat(e.target.value) || 0 })}
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                                    />
                                </label>
                            ))}
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button onClick={saveBundle} className="text-[12px] font-bold bg-gray-900 text-white px-5 py-2.5 rounded-lg hover:bg-black inline-flex items-center gap-1.5">
                                <Save size={14} /> Guardar regras
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* === PREVIEW TAB === */}
            {tab === 'preview' && (
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <h3 className="text-sm font-black text-gray-900 mb-4 uppercase tracking-widest flex items-center gap-2"><Eye size={14} /> Pré-visualizar resultado para um produto</h3>

                        <div className="grid grid-cols-12 gap-4 items-end">
                            <div className="col-span-6">
                                <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1.5 block">Produto</span>
                                <select value={previewProductId || ''} onChange={e => setPreviewProductId(parseInt(e.target.value))} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-[14px]">
                                    {products.map(p => <option key={p.id} value={p.id}>{p.name} (#{p.id})</option>)}
                                </select>
                            </div>
                            <div className="col-span-3">
                                <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1.5 block">Idioma</span>
                                <select value={activeLocale} onChange={e => setActiveLocale(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-[14px]">
                                    {LOCALES.map(l => <option key={l.id} value={l.id}>{l.label}</option>)}
                                </select>
                            </div>
                            <div className="col-span-3">
                                <button onClick={runPreview} disabled={previewLoading} className="w-full text-[12px] font-bold bg-gray-900 text-white px-4 py-2.5 rounded-lg hover:bg-black inline-flex items-center justify-center gap-1.5 disabled:opacity-50">
                                    <Eye size={14} /> {previewLoading ? '...' : 'Pré-visualizar'}
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-5">
                            <button onClick={applyOne} className="text-[12px] font-bold bg-rose-50 text-rose-700 border border-rose-200 px-4 py-2.5 rounded-lg hover:bg-rose-100 inline-flex items-center justify-center gap-1.5">
                                <Zap size={14} /> Aplicar a este produto
                            </button>
                            <button onClick={applyAll} className="text-[12px] font-bold bg-gray-900 text-white px-4 py-2.5 rounded-lg hover:bg-black inline-flex items-center justify-center gap-1.5">
                                <Zap size={14} /> Aplicar a TODOS os produtos
                            </button>
                        </div>
                    </div>

                    {previewData && (
                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            {previewData.error ? (
                                <p className="text-red-600 text-sm">{previewData.error}</p>
                            ) : (
                                <div className="space-y-5">
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Categoria detectada</span>
                                        <span className="bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest">{previewData.category_slug}</span>
                                    </div>

                                    <div>
                                        <h4 className="text-[12px] font-bold uppercase tracking-widest text-gray-500 mb-2">Hook + Headline</h4>
                                        <p className="text-[15px] text-rose-600 font-bold">{previewData.landing_page_data?.landingPage?.solution?.headline}</p>
                                        <p className="text-2xl font-light text-gray-900 mt-1">{previewData.landing_page_data?.landingPage?.problem?.headline}</p>
                                    </div>

                                    <div>
                                        <h4 className="text-[12px] font-bold uppercase tracking-widest text-gray-500 mb-2">Benefícios</h4>
                                        <ul className="grid grid-cols-2 gap-3">
                                            {(previewData.landing_page_data?.landingPage?.solution?.benefits || []).map((b, i) => (
                                                <li key={i} className="bg-gray-50 rounded-xl p-3">
                                                    <p className="text-[13px] font-bold text-gray-900">{b.title}</p>
                                                    <p className="text-[12px] text-gray-500 mt-1">{b.desc}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div>
                                        <h4 className="text-[12px] font-bold uppercase tracking-widest text-gray-500 mb-2">FAQs ({(previewData.landing_page_data?.landingPage?.faq || []).length})</h4>
                                        <ul className="space-y-2">
                                            {(previewData.landing_page_data?.landingPage?.faq || []).map((f, i) => (
                                                <li key={i} className="text-[13px]">
                                                    <p className="font-bold text-gray-900">{f.q}</p>
                                                    <p className="text-gray-500 mt-0.5">{f.a}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div>
                                        <h4 className="text-[12px] font-bold uppercase tracking-widest text-gray-500 mb-2">Recomendados (top 4)</h4>
                                        <p className="text-[13px] text-gray-700 font-mono">IDs: {(previewData.recommended_products || []).join(', ') || '—'}</p>
                                    </div>

                                    {previewData.upsell_kits?.[0] && (
                                        <div className="bg-gradient-to-br from-rose-50 to-amber-50 rounded-2xl p-5 border border-rose-100">
                                            <h4 className="text-[12px] font-bold uppercase tracking-widest text-rose-700 mb-3">Kit recomendado</h4>
                                            <p className="text-[14px]">
                                                <span className="font-bold">{previewData.upsell_kits[0].items.length} produtos</span>
                                                <span className="text-gray-500 line-through ml-3">{previewData.upsell_kits[0].original_price.toFixed(2)} €</span>
                                                <span className="font-bold text-rose-700 ml-2">{previewData.upsell_kits[0].kit_price.toFixed(2)} €</span>
                                                <span className="ml-3 bg-rose-700 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">-{previewData.upsell_kits[0].discount_pct}%</span>
                                            </p>
                                            <ul className="mt-2 text-[12px] text-gray-700 space-y-0.5">
                                                {previewData.upsell_kits[0].items.map(it => (
                                                    <li key={it.id}>• {it.name} — {Number(it.price).toFixed(2)} €</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            <AnimatePresence>{toast && <Toast {...toast} />}</AnimatePresence>
        </div>
    );
}
