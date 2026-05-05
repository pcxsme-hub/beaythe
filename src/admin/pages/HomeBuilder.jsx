import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Eye, EyeOff, Save, RotateCcw, Plus, Trash2, GripVertical, Layers, Languages } from 'lucide-react';
import { getHomeConfig, updateHomeConfig, resetHomeConfig } from '../services/db';

const SECTION_TYPE_META = {
    FeaturedCarousel: { label: 'Carrossel Hero', editable: false, color: 'rose' },
    Marquee: { label: 'Listra de mensagens', editable: false, color: 'gray' },
    AboutUs: { label: 'Bloco "Sobre nós"', editable: true, color: 'amber' },
    HeroCards: { label: '3 Cards de categoria', editable: true, color: 'rose' },
    SkinQuiz: { label: 'Quiz de pele', editable: false, color: 'purple' },
    CircularCategories: { label: 'Categorias circulares', editable: false, color: 'blue' },
    ProductTabs: { label: 'Tabs de produtos', editable: false, color: 'emerald' },
    TrustStrip: { label: 'Selos de confiança', editable: true, color: 'amber' },
    TrendingProducts: { label: 'Lista de produtos', editable: true, color: 'rose' },
    Reviews: { label: 'Avaliações', editable: false, color: 'gray' },
    FAQ: { label: 'Perguntas frequentes', editable: false, color: 'gray' }
};

const COLOR_CLASSES = {
    rose: 'bg-rose-50 text-rose-700 border-rose-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    gray: 'bg-gray-50 text-gray-600 border-gray-200'
};

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

const TextInput = ({ label, value, onChange, placeholder }) => (
    <label className="block">
        {label && <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1 block">{label}</span>}
        <input
            type="text"
            value={value || ''}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-[13px] outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all"
        />
    </label>
);

const TextArea = ({ label, value, onChange, rows = 2 }) => (
    <label className="block">
        {label && <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1 block">{label}</span>}
        <textarea
            value={value || ''}
            onChange={e => onChange(e.target.value)}
            rows={rows}
            className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-[13px] outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 resize-none"
        />
    </label>
);

// ============ Section-specific editors ============

function AboutEditor({ settings, onChange }) {
    const set = (k, v) => onChange({ ...settings, [k]: v });
    return (
        <div className="space-y-4">
            <TextInput label="URL da imagem" value={settings.image_url} onChange={v => set('image_url', v)} placeholder="https://..." />
            <div className="grid grid-cols-3 gap-3">
                <TextInput label="Tag ES" value={settings.tag_es} onChange={v => set('tag_es', v)} />
                <TextInput label="Tag PT" value={settings.tag_pt} onChange={v => set('tag_pt', v)} />
                <TextInput label="Tag EN" value={settings.tag_en} onChange={v => set('tag_en', v)} />
            </div>
            <div className="grid grid-cols-3 gap-3">
                <TextInput label="Título 1 ES" value={settings.title_1_es} onChange={v => set('title_1_es', v)} />
                <TextInput label="Título 1 PT" value={settings.title_1_pt} onChange={v => set('title_1_pt', v)} />
                <TextInput label="Título 1 EN" value={settings.title_1_en} onChange={v => set('title_1_en', v)} />
            </div>
            <div className="grid grid-cols-3 gap-3">
                <TextInput label="Título 2 ES" value={settings.title_2_es} onChange={v => set('title_2_es', v)} />
                <TextInput label="Título 2 PT" value={settings.title_2_pt} onChange={v => set('title_2_pt', v)} />
                <TextInput label="Título 2 EN" value={settings.title_2_en} onChange={v => set('title_2_en', v)} />
            </div>
            <div className="grid grid-cols-3 gap-3">
                <TextArea label="Descrição ES" value={settings.desc_es} onChange={v => set('desc_es', v)} rows={3} />
                <TextArea label="Descrição PT" value={settings.desc_pt} onChange={v => set('desc_pt', v)} rows={3} />
                <TextArea label="Descrição EN" value={settings.desc_en} onChange={v => set('desc_en', v)} rows={3} />
            </div>
            <div className="grid grid-cols-4 gap-3">
                <TextInput label="CTA ES" value={settings.cta_es} onChange={v => set('cta_es', v)} />
                <TextInput label="CTA PT" value={settings.cta_pt} onChange={v => set('cta_pt', v)} />
                <TextInput label="CTA EN" value={settings.cta_en} onChange={v => set('cta_en', v)} />
                <TextInput label="Link" value={settings.cta_link} onChange={v => set('cta_link', v)} placeholder="/historia" />
            </div>
        </div>
    );
}

function HeroCardsEditor({ settings, onChange }) {
    const cards = settings.cards || [];
    const setCard = (idx, key, val) => {
        const next = [...cards]; next[idx] = { ...next[idx], [key]: val };
        onChange({ ...settings, cards: next });
    };
    const addCard = () => onChange({ ...settings, cards: [...cards, { image: '', title_es: '', title_pt: '', title_en: '', desc_es: '', desc_pt: '', desc_en: '', cta_link: '' }] });
    const remove = idx => onChange({ ...settings, cards: cards.filter((_, i) => i !== idx) });
    return (
        <div className="space-y-4">
            {cards.map((c, idx) => (
                <div key={idx} className="bg-gray-50 rounded-2xl p-4 relative border border-gray-100">
                    <button onClick={() => remove(idx)} className="absolute top-3 right-3 text-gray-300 hover:text-red-500"><Trash2 size={14} /></button>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3">Card {idx + 1}</div>
                    <div className="space-y-3">
                        <TextInput label="Imagem" value={c.image} onChange={v => setCard(idx, 'image', v)} placeholder="https://..." />
                        <div className="grid grid-cols-3 gap-2">
                            <TextInput label="Título ES" value={c.title_es} onChange={v => setCard(idx, 'title_es', v)} />
                            <TextInput label="Título PT" value={c.title_pt} onChange={v => setCard(idx, 'title_pt', v)} />
                            <TextInput label="Título EN" value={c.title_en} onChange={v => setCard(idx, 'title_en', v)} />
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <TextInput label="Desc ES" value={c.desc_es} onChange={v => setCard(idx, 'desc_es', v)} />
                            <TextInput label="Desc PT" value={c.desc_pt} onChange={v => setCard(idx, 'desc_pt', v)} />
                            <TextInput label="Desc EN" value={c.desc_en} onChange={v => setCard(idx, 'desc_en', v)} />
                        </div>
                        <TextInput label="Link CTA" value={c.cta_link} onChange={v => setCard(idx, 'cta_link', v)} placeholder="/categoria/rostro" />
                    </div>
                </div>
            ))}
            <button onClick={addCard} className="w-full text-[12px] font-bold text-rose-600 hover:bg-rose-50 py-3 rounded-xl border-2 border-dashed border-rose-200 inline-flex items-center justify-center gap-1.5"><Plus size={14} /> Adicionar card</button>
        </div>
    );
}

function TrustEditor({ settings, onChange }) {
    const items = settings.items || [];
    const setItem = (idx, key, val) => {
        const next = [...items]; next[idx] = { ...next[idx], [key]: val };
        onChange({ ...settings, items: next });
    };
    const add = () => onChange({ ...settings, items: [...items, { icon: 'Truck', title_es: '', title_pt: '', title_en: '' }] });
    const remove = idx => onChange({ ...settings, items: items.filter((_, i) => i !== idx) });
    const ICONS = ['Truck', 'Headphones', 'Layers', 'PiggyBank', 'Calendar', 'Shield', 'Award', 'Heart', 'Leaf', 'Lock', 'Star'];
    return (
        <div className="space-y-3">
            {items.map((it, idx) => (
                <div key={idx} className="bg-gray-50 rounded-2xl p-4 relative border border-gray-100">
                    <button onClick={() => remove(idx)} className="absolute top-3 right-3 text-gray-300 hover:text-red-500"><Trash2 size={14} /></button>
                    <div className="grid grid-cols-12 gap-2 pr-8">
                        <label className="col-span-3 block">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1 block">Ícone</span>
                            <select value={it.icon} onChange={e => setItem(idx, 'icon', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-[13px]">
                                {ICONS.map(i => <option key={i} value={i}>{i}</option>)}
                            </select>
                        </label>
                        <div className="col-span-3"><TextInput label="ES" value={it.title_es} onChange={v => setItem(idx, 'title_es', v)} /></div>
                        <div className="col-span-3"><TextInput label="PT" value={it.title_pt} onChange={v => setItem(idx, 'title_pt', v)} /></div>
                        <div className="col-span-3"><TextInput label="EN" value={it.title_en} onChange={v => setItem(idx, 'title_en', v)} /></div>
                    </div>
                </div>
            ))}
            <button onClick={add} className="w-full text-[12px] font-bold text-rose-600 hover:bg-rose-50 py-3 rounded-xl border-2 border-dashed border-rose-200 inline-flex items-center justify-center gap-1.5"><Plus size={14} /> Adicionar selo</button>
        </div>
    );
}

function TrendingEditor({ settings, onChange }) {
    const set = (k, v) => onChange({ ...settings, [k]: v });
    return (
        <div className="space-y-3">
            <label className="block">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1 block">Fonte</span>
                <select value={settings.sourceType || 'trending'} onChange={e => set('sourceType', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-[13px]">
                    <option value="trending">Em tendência (placement = TRENDING)</option>
                    <option value="new">Mais recentes</option>
                </select>
            </label>
            <div className="grid grid-cols-3 gap-3">
                <TextInput label="Título ES (override)" value={settings.overrideTitle_es} onChange={v => set('overrideTitle_es', v)} />
                <TextInput label="Título PT" value={settings.overrideTitle_pt} onChange={v => set('overrideTitle_pt', v)} />
                <TextInput label="Título EN" value={settings.overrideTitle_en} onChange={v => set('overrideTitle_en', v)} />
            </div>
        </div>
    );
}

function MarqueeEditor({ settings, onChange }) {
    const set = (k, v) => onChange({ ...settings, [k]: v });
    const phrasesEditor = (locale) => {
        const list = settings[`phrases_${locale}`] || [];
        const update = (idx, val) => { const next = [...list]; next[idx] = val; set(`phrases_${locale}`, next); };
        const add = () => set(`phrases_${locale}`, [...list, '']);
        const remove = idx => set(`phrases_${locale}`, list.filter((_, i) => i !== idx));
        return (
            <div>
                <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{locale.toUpperCase()}</span>
                    <button onClick={add} className="text-[10px] font-bold text-rose-600 hover:text-rose-700 inline-flex items-center gap-1"><Plus size={11} /> Add</button>
                </div>
                <div className="space-y-1">
                    {list.map((s, idx) => (
                        <div key={idx} className="flex gap-1.5">
                            <input value={s} onChange={e => update(idx, e.target.value)} className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-[12px] outline-none focus:border-rose-400" />
                            <button onClick={() => remove(idx)} className="text-gray-300 hover:text-red-500"><Trash2 size={13} /></button>
                        </div>
                    ))}
                    {list.length === 0 && <p className="text-[11px] text-gray-400 italic">Vazio — usa as frases padrão do idioma.</p>}
                </div>
            </div>
        );
    };
    return (
        <div className="space-y-4">
            <p className="text-[12px] text-gray-500">Se vazio em algum idioma, o sistema usa as frases padrão. Cada frase é separada por • no scroll.</p>
            <div className="grid grid-cols-3 gap-4">{['es', 'pt', 'en'].map(phrasesEditor)}</div>
        </div>
    );
}

function SectionEditor({ section, onChange }) {
    const meta = SECTION_TYPE_META[section.type];
    if (!meta?.editable) return <p className="text-[12px] text-gray-400 italic">Esta seção não tem opções configuráveis. Use os toggles de visibilidade e ordem.</p>;
    if (section.type === 'AboutUs') return <AboutEditor settings={section.settings || {}} onChange={s => onChange({ ...section, settings: s })} />;
    if (section.type === 'HeroCards') return <HeroCardsEditor settings={section.settings || {}} onChange={s => onChange({ ...section, settings: s })} />;
    if (section.type === 'TrustStrip') return <TrustEditor settings={section.settings || {}} onChange={s => onChange({ ...section, settings: s })} />;
    if (section.type === 'TrendingProducts') return <TrendingEditor settings={section.settings || {}} onChange={s => onChange({ ...section, settings: s })} />;
    if (section.type === 'Marquee') return <MarqueeEditor settings={section.settings || {}} onChange={s => onChange({ ...section, settings: s })} />;
    return null;
}

// ============ Main page ============

export default function HomeBuilder() {
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);
    const [toast, setToast] = useState(null);
    const [dirty, setDirty] = useState(false);

    const showToast = (msg, type) => { setToast({ msg, type }); setTimeout(() => setToast(null), 2500); };

    useEffect(() => {
        getHomeConfig().then(r => { setSections(r.sections || []); setLoading(false); });
    }, []);

    const updateSection = (id, next) => {
        setSections(sections.map(s => s.id === id ? next : s));
        setDirty(true);
    };

    const moveUp = (idx) => {
        if (idx === 0) return;
        const next = [...sections];
        [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
        setSections(next.map((s, i) => ({ ...s, order: i + 1 })));
        setDirty(true);
    };

    const moveDown = (idx) => {
        if (idx >= sections.length - 1) return;
        const next = [...sections];
        [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
        setSections(next.map((s, i) => ({ ...s, order: i + 1 })));
        setDirty(true);
    };

    const toggleEnabled = (id) => updateSection(id, { ...sections.find(s => s.id === id), enabled: !sections.find(s => s.id === id).enabled });

    const save = async () => {
        try {
            const r = await updateHomeConfig(sections);
            setSections(r.sections);
            setDirty(false);
            showToast('Layout da home guardado', 'success');
        } catch (e) { showToast('Erro ao guardar', 'error'); }
    };

    const reset = async () => {
        if (!confirm('Restaurar a home para o layout padrão? As edições serão perdidas.')) return;
        try {
            const r = await resetHomeConfig();
            setSections(r.sections || []);
            setDirty(false);
            showToast('Layout restaurado', 'success');
        } catch (e) { showToast('Erro ao restaurar', 'error'); }
    };

    if (loading) return <div className="p-12 text-center text-gray-400">A carregar layout...</div>;

    return (
        <div>
            <div className="flex items-start justify-between mb-8 gap-6">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900 flex items-center gap-3">
                        <Layers className="text-rose-500" size={28} />
                        Construtor da Home
                    </h1>
                    <p className="text-gray-500 mt-2 max-w-2xl">
                        Reordena, ativa/desativa e edita as seções da página inicial. As mudanças refletem em segundos no site público.
                    </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={reset} className="text-[12px] font-bold text-gray-500 hover:text-gray-900 px-4 py-2.5 rounded-xl inline-flex items-center gap-1.5 hover:bg-gray-100 transition-colors">
                        <RotateCcw size={14} /> Restaurar padrão
                    </button>
                    <button
                        onClick={save}
                        disabled={!dirty}
                        className="text-[12px] font-bold bg-gray-900 text-white px-5 py-2.5 rounded-xl hover:bg-black inline-flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <Save size={14} /> {dirty ? 'Guardar mudanças' : 'Guardado'}
                    </button>
                </div>
            </div>

            <div className="space-y-3">
                {sections.map((section, idx) => {
                    const meta = SECTION_TYPE_META[section.type] || { label: section.type, editable: false, color: 'gray' };
                    const isExpanded = expandedId === section.id;
                    return (
                        <motion.div
                            key={section.id}
                            layout
                            className={`bg-white border rounded-2xl overflow-hidden transition-all ${section.enabled ? 'border-gray-200' : 'border-gray-100 opacity-60'}`}
                        >
                            <div className="flex items-center px-4 py-4 gap-3">
                                {/* Reorder controls */}
                                <div className="flex flex-col -my-2">
                                    <button onClick={() => moveUp(idx)} disabled={idx === 0} className="text-gray-300 hover:text-gray-700 disabled:opacity-30 p-0.5"><ChevronUp size={14} /></button>
                                    <span className="text-[9px] font-mono text-gray-400 text-center">{section.order}</span>
                                    <button onClick={() => moveDown(idx)} disabled={idx === sections.length - 1} className="text-gray-300 hover:text-gray-700 disabled:opacity-30 p-0.5"><ChevronDown size={14} /></button>
                                </div>

                                <GripVertical size={16} className="text-gray-300" />

                                {/* Type badge */}
                                <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md border ${COLOR_CLASSES[meta.color]}`}>
                                    {section.type}
                                </span>

                                {/* Label */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-[14px] font-bold text-gray-900 truncate">{meta.label}</p>
                                    <p className="text-[11px] text-gray-400 font-mono truncate">{section.id}</p>
                                </div>

                                {/* Toggle */}
                                <button
                                    onClick={() => toggleEnabled(section.id)}
                                    className={`flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest px-3 py-2 rounded-lg transition-colors ${section.enabled ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                                >
                                    {section.enabled ? <Eye size={13} /> : <EyeOff size={13} />}
                                    {section.enabled ? 'Visível' : 'Oculta'}
                                </button>

                                {/* Edit toggle */}
                                {meta.editable && (
                                    <button
                                        onClick={() => setExpandedId(isExpanded ? null : section.id)}
                                        className="text-[11px] font-bold text-gray-700 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center gap-1.5"
                                    >
                                        {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                                        Editar
                                    </button>
                                )}
                            </div>

                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-6 pb-6 pt-2 border-t border-gray-100 bg-gray-50/50">
                                            <SectionEditor section={section} onChange={s => updateSection(section.id, s)} />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>

            <AnimatePresence>{toast && <Toast {...toast} />}</AnimatePresence>
        </div>
    );
}
