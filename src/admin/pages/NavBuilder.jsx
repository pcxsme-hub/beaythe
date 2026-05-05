import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, ChevronUp, ChevronDown, Save, RotateCcw, Compass, Layers, Footprints } from 'lucide-react';
import { getNavConfig, updateNavConfig, resetNavConfig } from '../services/db';
import { invalidateNavConfig } from '../../hooks/useNavConfig';

const TABS = [
    { id: 'top', label: 'Top Nav (Categorias)', icon: Compass },
    { id: 'mega', label: 'Megamenu', icon: Layers },
    { id: 'footer', label: 'Rodapé', icon: Footprints }
];

const Toast = ({ msg, type }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
        className={`fixed bottom-6 right-6 px-5 py-3 rounded-2xl text-sm font-bold shadow-2xl z-50 ${type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>{msg}</motion.div>
);

const TextField = ({ label, value, onChange, placeholder, mono }) => (
    <label className="block">
        {label && <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1 block">{label}</span>}
        <input type="text" value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder}
            className={`w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-[13px] outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all ${mono ? 'font-mono' : ''}`} />
    </label>
);

// ================ TOP NAV ================

function TopNavEditor({ items, onChange }) {
    const update = (idx, key, val) => onChange(items.map((it, i) => i === idx ? { ...it, [key]: val } : it));
    const remove = (idx) => onChange(items.filter((_, i) => i !== idx));
    const add = () => onChange([...items, { key: '', label_es: '', label_pt: '', label_en: '', link: '/categoria/', hasMegaMenu: true, isOutlet: false }]);
    const move = (idx, dir) => {
        const j = idx + dir;
        if (j < 0 || j >= items.length) return;
        const next = [...items];
        [next[idx], next[j]] = [next[j], next[idx]];
        onChange(next);
    };
    return (
        <div className="space-y-3">
            {items.map((it, idx) => (
                <div key={idx} className="bg-white border border-gray-200 rounded-2xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="flex flex-col">
                            <button onClick={() => move(idx, -1)} disabled={idx === 0} className="text-gray-300 hover:text-gray-700 disabled:opacity-30"><ChevronUp size={14} /></button>
                            <span className="text-[10px] text-gray-400 font-mono text-center">{idx + 1}</span>
                            <button onClick={() => move(idx, 1)} disabled={idx === items.length - 1} className="text-gray-300 hover:text-gray-700 disabled:opacity-30"><ChevronDown size={14} /></button>
                        </div>
                        <div className="flex-1 grid grid-cols-12 gap-2">
                            <div className="col-span-2"><TextField label="Slug" value={it.key} onChange={v => update(idx, 'key', v)} mono /></div>
                            <div className="col-span-2"><TextField label="ES" value={it.label_es} onChange={v => update(idx, 'label_es', v)} /></div>
                            <div className="col-span-2"><TextField label="PT" value={it.label_pt} onChange={v => update(idx, 'label_pt', v)} /></div>
                            <div className="col-span-2"><TextField label="EN" value={it.label_en} onChange={v => update(idx, 'label_en', v)} /></div>
                            <div className="col-span-3"><TextField label="Link" value={it.link} onChange={v => update(idx, 'link', v)} mono /></div>
                            <div className="col-span-1 flex items-end justify-end gap-2 mb-1">
                                <label className="flex items-center gap-1 text-[10px] font-bold text-gray-500 cursor-pointer whitespace-nowrap"><input type="checkbox" checked={it.hasMegaMenu} onChange={e => update(idx, 'hasMegaMenu', e.target.checked)} className="accent-rose-500" />Mega</label>
                            </div>
                        </div>
                        <button onClick={() => remove(idx)} className="text-gray-300 hover:text-red-500"><Trash2 size={14} /></button>
                    </div>
                    <label className="flex items-center gap-2 text-[11px] font-bold text-gray-500 cursor-pointer">
                        <input type="checkbox" checked={it.isOutlet} onChange={e => update(idx, 'isOutlet', e.target.checked)} className="accent-rose-500" />
                        Destacar como "outlet" (cor diferente)
                    </label>
                </div>
            ))}
            <button onClick={add} className="w-full text-[12px] font-bold text-rose-600 hover:bg-rose-50 py-3 rounded-xl border-2 border-dashed border-rose-200 inline-flex items-center justify-center gap-1.5"><Plus size={14} /> Adicionar categoria do top nav</button>
        </div>
    );
}

// ================ MEGA MENU ================

function MegaMenuEditor({ data, onChange, topNav }) {
    const keys = Object.keys(data);
    const [activeKey, setActiveKey] = useState(keys[0] || null);

    const setItems = (key, items) => onChange({ ...data, [key]: items });
    const items = activeKey ? (data[activeKey] || []) : [];

    const updateItem = (idx, field, val) => setItems(activeKey, items.map((it, i) => i === idx ? { ...it, [field]: val } : it));
    const removeItem = (idx) => setItems(activeKey, items.filter((_, i) => i !== idx));
    const addItem = () => setItems(activeKey, [...items, { name: '', label_es: '', label_pt: '', label_en: '', image: '', link: '/categoria/', items: [] }]);
    const updateSubItem = (parentIdx, subIdx, field, val) => {
        const parent = items[parentIdx];
        const subs = (parent.items || []).map((s, i) => i === subIdx ? { ...s, [field]: val } : s);
        updateItem(parentIdx, 'items', subs);
    };
    const removeSubItem = (parentIdx, subIdx) => updateItem(parentIdx, 'items', (items[parentIdx].items || []).filter((_, i) => i !== subIdx));
    const addSubItem = (parentIdx) => updateItem(parentIdx, 'items', [...(items[parentIdx].items || []), { name: '', label_es: '', label_pt: '', label_en: '', link: '/categoria/' }]);

    return (
        <div className="grid grid-cols-12 gap-4">
            <aside className="col-span-3">
                <div className="bg-white border border-gray-200 rounded-2xl p-3 sticky top-4">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3 px-2">Para qual categoria do top nav?</div>
                    {keys.map(k => (
                        <button key={k} onClick={() => setActiveKey(k)}
                            className={`w-full text-left px-3 py-2 rounded-xl text-[13px] font-bold transition-all mb-1 ${activeKey === k ? 'bg-rose-50 text-rose-700' : 'hover:bg-gray-50 text-gray-700'}`}>
                            {k}
                        </button>
                    ))}
                    <button onClick={() => {
                        const k = prompt('Slug da categoria do top nav (ex: "rostro"):')?.trim();
                        if (k && !data[k]) { onChange({ ...data, [k]: [] }); setActiveKey(k); }
                    }} className="w-full mt-2 text-[12px] font-bold text-rose-600 hover:bg-rose-50 py-2 rounded-xl inline-flex items-center justify-center gap-1.5">
                        <Plus size={14} /> Adicionar grupo
                    </button>
                </div>
            </aside>

            <div className="col-span-9 space-y-4">
                {!activeKey ? <p className="text-gray-400 text-sm">Seleciona um grupo</p> : (
                    <>
                        <div className="text-[12px] text-gray-500">
                            Editando o megamenu da categoria <span className="font-bold text-gray-900">{activeKey}</span>. Cada grupo é uma "coluna" do dropdown.
                        </div>
                        {items.map((it, idx) => (
                            <div key={idx} className="bg-white border border-gray-200 rounded-2xl p-4 relative">
                                <button onClick={() => removeItem(idx)} className="absolute top-3 right-3 text-gray-300 hover:text-red-500"><Trash2 size={14} /></button>
                                <div className="grid grid-cols-12 gap-2 mb-3 pr-8">
                                    <div className="col-span-2"><TextField label="Slug" value={it.name} onChange={v => updateItem(idx, 'name', v)} mono /></div>
                                    <div className="col-span-2"><TextField label="ES" value={it.label_es} onChange={v => updateItem(idx, 'label_es', v)} /></div>
                                    <div className="col-span-2"><TextField label="PT" value={it.label_pt} onChange={v => updateItem(idx, 'label_pt', v)} /></div>
                                    <div className="col-span-2"><TextField label="EN" value={it.label_en} onChange={v => updateItem(idx, 'label_en', v)} /></div>
                                    <div className="col-span-2"><TextField label="Link" value={it.link} onChange={v => updateItem(idx, 'link', v)} mono /></div>
                                </div>
                                <TextField label="URL da imagem" value={it.image} onChange={v => updateItem(idx, 'image', v)} mono />
                                {/* Sub-items */}
                                <div className="mt-3 pl-4 border-l-2 border-gray-100">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Sub-itens (links da coluna)</span>
                                        <button onClick={() => addSubItem(idx)} className="text-[10px] font-bold text-rose-600 inline-flex items-center gap-1"><Plus size={11} /> Sub-item</button>
                                    </div>
                                    <div className="space-y-1.5">
                                        {(it.items || []).map((sub, sIdx) => (
                                            <div key={sIdx} className="grid grid-cols-12 gap-1.5">
                                                <div className="col-span-2"><input value={sub.name} onChange={e => updateSubItem(idx, sIdx, 'name', e.target.value)} placeholder="slug" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-[11px] font-mono outline-none focus:border-rose-400" /></div>
                                                <div className="col-span-2"><input value={sub.label_es} onChange={e => updateSubItem(idx, sIdx, 'label_es', e.target.value)} placeholder="ES" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-[11px] outline-none focus:border-rose-400" /></div>
                                                <div className="col-span-2"><input value={sub.label_pt} onChange={e => updateSubItem(idx, sIdx, 'label_pt', e.target.value)} placeholder="PT" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-[11px] outline-none focus:border-rose-400" /></div>
                                                <div className="col-span-2"><input value={sub.label_en} onChange={e => updateSubItem(idx, sIdx, 'label_en', e.target.value)} placeholder="EN" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-[11px] outline-none focus:border-rose-400" /></div>
                                                <div className="col-span-3"><input value={sub.link} onChange={e => updateSubItem(idx, sIdx, 'link', e.target.value)} placeholder="/categoria/..." className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-[11px] font-mono outline-none focus:border-rose-400" /></div>
                                                <div className="col-span-1 flex items-center"><button onClick={() => removeSubItem(idx, sIdx)} className="text-gray-300 hover:text-red-500"><Trash2 size={12} /></button></div>
                                            </div>
                                        ))}
                                        {(it.items || []).length === 0 && <p className="text-[11px] text-gray-400 italic">Sem sub-itens. A coluna só vai exibir o título.</p>}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button onClick={addItem} className="w-full text-[12px] font-bold text-rose-600 hover:bg-rose-50 py-3 rounded-xl border-2 border-dashed border-rose-200 inline-flex items-center justify-center gap-1.5"><Plus size={14} /> Adicionar coluna em "{activeKey}"</button>
                    </>
                )}
            </div>
        </div>
    );
}

// ================ FOOTER COLUMNS ================

function FooterEditor({ columns, onChange }) {
    const updateCol = (idx, field, val) => onChange(columns.map((c, i) => i === idx ? { ...c, [field]: val } : c));
    const removeCol = (idx) => onChange(columns.filter((_, i) => i !== idx));
    const addCol = () => onChange([...columns, { id: `col-${Date.now()}`, title_es: '', title_pt: '', title_en: '', links: [] }]);
    const updateLink = (colIdx, linkIdx, field, val) => {
        const links = (columns[colIdx].links || []).map((l, i) => i === linkIdx ? { ...l, [field]: val } : l);
        updateCol(colIdx, 'links', links);
    };
    const addLink = (colIdx) => updateCol(colIdx, 'links', [...(columns[colIdx].links || []), { label_es: '', label_pt: '', label_en: '', link: '/' }]);
    const removeLink = (colIdx, linkIdx) => updateCol(colIdx, 'links', (columns[colIdx].links || []).filter((_, i) => i !== linkIdx));

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {columns.map((col, idx) => (
                <div key={col.id || idx} className="bg-white border border-gray-200 rounded-2xl p-5 relative">
                    <button onClick={() => removeCol(idx)} className="absolute top-3 right-3 text-gray-300 hover:text-red-500"><Trash2 size={14} /></button>
                    <div className="grid grid-cols-3 gap-2 mb-4 pr-6">
                        <TextField label="Título ES" value={col.title_es} onChange={v => updateCol(idx, 'title_es', v)} />
                        <TextField label="Título PT" value={col.title_pt} onChange={v => updateCol(idx, 'title_pt', v)} />
                        <TextField label="Título EN" value={col.title_en} onChange={v => updateCol(idx, 'title_en', v)} />
                    </div>
                    <div className="space-y-1.5">
                        {(col.links || []).map((link, lIdx) => (
                            <div key={lIdx} className="grid grid-cols-12 gap-1.5">
                                <div className="col-span-3"><input value={link.label_es} onChange={e => updateLink(idx, lIdx, 'label_es', e.target.value)} placeholder="ES" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-[11px] outline-none focus:border-rose-400" /></div>
                                <div className="col-span-3"><input value={link.label_pt} onChange={e => updateLink(idx, lIdx, 'label_pt', e.target.value)} placeholder="PT" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-[11px] outline-none focus:border-rose-400" /></div>
                                <div className="col-span-3"><input value={link.label_en} onChange={e => updateLink(idx, lIdx, 'label_en', e.target.value)} placeholder="EN" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-[11px] outline-none focus:border-rose-400" /></div>
                                <div className="col-span-2"><input value={link.link} onChange={e => updateLink(idx, lIdx, 'link', e.target.value)} placeholder="/link" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-[11px] font-mono outline-none focus:border-rose-400" /></div>
                                <div className="col-span-1 flex items-center"><button onClick={() => removeLink(idx, lIdx)} className="text-gray-300 hover:text-red-500"><Trash2 size={12} /></button></div>
                            </div>
                        ))}
                    </div>
                    <button onClick={() => addLink(idx)} className="mt-2 text-[11px] font-bold text-rose-600 inline-flex items-center gap-1"><Plus size={12} /> Adicionar link</button>
                </div>
            ))}
            <button onClick={addCol} className="text-[12px] font-bold text-rose-600 hover:bg-rose-50 py-8 rounded-xl border-2 border-dashed border-rose-200 inline-flex items-center justify-center gap-1.5"><Plus size={14} /> Nova coluna</button>
        </div>
    );
}

// ================ MAIN ================

export default function NavBuilder() {
    const [tab, setTab] = useState('top');
    const [config, setConfig] = useState({ top_nav: [], mega_menu: {}, footer: [] });
    const [loading, setLoading] = useState(true);
    const [dirty, setDirty] = useState(false);
    const [toast, setToast] = useState(null);

    const showToast = (msg, type) => { setToast({ msg, type }); setTimeout(() => setToast(null), 2500); };

    useEffect(() => {
        getNavConfig().then(d => { setConfig(d || { top_nav: [], mega_menu: {}, footer: [] }); setLoading(false); });
    }, []);

    const update = (key, val) => { setConfig({ ...config, [key]: val }); setDirty(true); };

    const save = async () => {
        try {
            const r = await updateNavConfig(config);
            setConfig(r);
            invalidateNavConfig();
            setDirty(false);
            showToast('Navegação guardada', 'success');
        } catch (e) { showToast('Erro ao guardar', 'error'); }
    };

    const reset = async () => {
        if (!confirm('Restaurar toda a navegação para o padrão?')) return;
        try {
            const r = await resetNavConfig();
            setConfig(r);
            invalidateNavConfig();
            setDirty(false);
            showToast('Restaurado', 'success');
        } catch (e) { showToast('Erro ao restaurar', 'error'); }
    };

    if (loading) return <div className="p-12 text-center text-gray-400">A carregar...</div>;

    return (
        <div>
            <div className="flex items-start justify-between mb-8 gap-6">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900 flex items-center gap-3">
                        <Compass className="text-rose-500" size={28} />
                        Navegação & Menus
                    </h1>
                    <p className="text-gray-500 mt-2 max-w-2xl">
                        Edita o top nav (categorias do header), o megamenu de cada categoria e as colunas do rodapé. Tudo aplicado em ES/PT/EN.
                    </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={reset} className="text-[12px] font-bold text-gray-500 hover:text-gray-900 px-4 py-2.5 rounded-xl inline-flex items-center gap-1.5 hover:bg-gray-100"><RotateCcw size={14} /> Restaurar</button>
                    <button onClick={save} disabled={!dirty} className="text-[12px] font-bold bg-gray-900 text-white px-5 py-2.5 rounded-xl hover:bg-black inline-flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"><Save size={14} /> {dirty ? 'Guardar' : 'Guardado'}</button>
                </div>
            </div>

            <div className="flex gap-2 mb-6 bg-gray-100 rounded-2xl p-1.5 max-w-2xl">
                {TABS.map(t => {
                    const Icon = t.icon; const active = tab === t.id;
                    return (
                        <button key={t.id} onClick={() => setTab(t.id)}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold transition-all ${active ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}>
                            <Icon size={14} /> {t.label}
                        </button>
                    );
                })}
            </div>

            {tab === 'top' && <TopNavEditor items={config.top_nav || []} onChange={v => update('top_nav', v)} />}
            {tab === 'mega' && <MegaMenuEditor data={config.mega_menu || {}} onChange={v => update('mega_menu', v)} topNav={config.top_nav || []} />}
            {tab === 'footer' && <FooterEditor columns={config.footer || []} onChange={v => update('footer', v)} />}

            <AnimatePresence>{toast && <Toast {...toast} />}</AnimatePresence>
        </div>
    );
}
