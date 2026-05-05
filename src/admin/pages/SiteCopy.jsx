import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, Mail, Info, Anchor, BookOpen, Megaphone, Save, RotateCcw, Languages, FileText } from 'lucide-react';
import { getSiteCopyGroups, getAllSiteCopy, updateSiteCopy, resetSiteCopy } from '../services/db';
import { invalidateSiteCopy } from '../../hooks/useSiteCopy';

const ICON_MAP = { Cookie, Mail, Info, Anchor, BookOpen, Megaphone };
const LOCALES = [{ id: 'es', label: 'Español' }, { id: 'pt', label: 'Português' }, { id: 'en', label: 'English' }];

const Toast = ({ msg, type }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
        className={`fixed bottom-6 right-6 px-5 py-3 rounded-2xl text-sm font-bold shadow-2xl z-50 ${type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}
    >{msg}</motion.div>
);

export default function SiteCopy() {
    const [groups, setGroups] = useState([]);
    const [allCopy, setAllCopy] = useState({});
    const [loading, setLoading] = useState(true);
    const [activeKey, setActiveKey] = useState(null);
    const [activeLocale, setActiveLocale] = useState('es');
    const [draft, setDraft] = useState({});
    const [dirty, setDirty] = useState(false);
    const [toast, setToast] = useState(null);

    const showToast = (msg, type) => { setToast({ msg, type }); setTimeout(() => setToast(null), 2500); };

    useEffect(() => {
        Promise.all([getSiteCopyGroups(), getAllSiteCopy()]).then(([g, c]) => {
            setGroups(g);
            setAllCopy(c);
            if (g.length && !activeKey) setActiveKey(g[0].key);
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        if (activeKey && allCopy[activeKey]) {
            setDraft(JSON.parse(JSON.stringify(allCopy[activeKey])));
            setDirty(false);
        }
    }, [activeKey, allCopy]);

    const activeGroup = useMemo(() => groups.find(g => g.key === activeKey), [groups, activeKey]);

    const setField = (locale, name, value) => {
        setDraft(prev => ({
            ...prev,
            [locale]: { ...(prev[locale] || {}), [name]: value }
        }));
        setDirty(true);
    };

    const save = async () => {
        try {
            await updateSiteCopy(activeKey, draft);
            const fresh = await getAllSiteCopy();
            setAllCopy(fresh);
            invalidateSiteCopy();
            setDirty(false);
            showToast('Copy guardada', 'success');
        } catch (e) { showToast('Erro ao guardar', 'error'); }
    };

    const reset = async () => {
        if (!confirm(`Restaurar "${activeGroup?.label}" para os defaults?`)) return;
        try {
            await resetSiteCopy(activeKey);
            const fresh = await getAllSiteCopy();
            setAllCopy(fresh);
            invalidateSiteCopy();
            setDirty(false);
            showToast('Restaurado', 'success');
        } catch (e) { showToast('Erro ao restaurar', 'error'); }
    };

    if (loading) return <div className="p-12 text-center text-gray-400">A carregar...</div>;

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900 flex items-center gap-3">
                    <FileText className="text-rose-500" size={28} />
                    Conteúdo do Site
                </h1>
                <p className="text-gray-500 mt-2 max-w-2xl">
                    Edita os textos globais do site (rodapé, popups, drawers, banners). Cada bloco tem versão em ES, PT e EN. Os valores em branco caem para o default.
                </p>
            </div>

            <div className="grid grid-cols-12 gap-6">
                {/* Sidebar */}
                <aside className="col-span-3">
                    <div className="bg-white rounded-2xl border border-gray-200 p-3 sticky top-4">
                        {groups.map(g => {
                            const Icon = ICON_MAP[g.icon] || FileText;
                            const active = g.key === activeKey;
                            return (
                                <button
                                    key={g.key}
                                    onClick={() => setActiveKey(g.key)}
                                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all mb-1 ${active ? 'bg-rose-50 text-rose-700' : 'hover:bg-gray-50 text-gray-700'}`}
                                >
                                    <Icon size={16} className={active ? 'text-rose-500' : 'text-gray-400'} />
                                    <span className="text-[13px] font-bold flex-1 truncate">{g.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </aside>

                {/* Editor */}
                <main className="col-span-9">
                    {!activeGroup ? <div className="text-gray-400">Seleciona um bloco</div> : (
                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-xl font-black text-gray-900">{activeGroup.label}</h2>
                                    <p className="text-[11px] font-mono text-gray-400 mt-1">{activeGroup.key}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={reset} className="text-[11px] font-bold text-gray-500 hover:text-gray-900 px-3 py-2 rounded-lg inline-flex items-center gap-1.5 hover:bg-gray-50"><RotateCcw size={12} /> Reset</button>
                                    <button onClick={save} disabled={!dirty} className="text-[12px] font-bold bg-gray-900 text-white px-5 py-2 rounded-lg hover:bg-black inline-flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"><Save size={14} /> Guardar</button>
                                </div>
                            </div>

                            <div className="flex gap-2 bg-gray-100 p-1 rounded-xl mb-6 inline-flex">
                                {LOCALES.map(loc => (
                                    <button
                                        key={loc.id}
                                        onClick={() => setActiveLocale(loc.id)}
                                        className={`px-4 py-1.5 rounded-lg text-[12px] font-bold transition-all ${activeLocale === loc.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                                    >
                                        <Languages size={11} className="inline mr-1.5" />
                                        {loc.label}
                                    </button>
                                ))}
                            </div>

                            <div className="space-y-5">
                                {activeGroup.fields.map(field => {
                                    const value = draft[activeLocale]?.[field.name] ?? '';
                                    return (
                                        <label key={field.name} className="block">
                                            <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1.5 block">{field.label}</span>
                                            {field.type === 'textarea' ? (
                                                <textarea
                                                    value={value}
                                                    onChange={e => setField(activeLocale, field.name, e.target.value)}
                                                    rows={3}
                                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 resize-none"
                                                />
                                            ) : (
                                                <input
                                                    type="text"
                                                    value={value}
                                                    onChange={e => setField(activeLocale, field.name, e.target.value)}
                                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                                                />
                                            )}
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </main>
            </div>

            <AnimatePresence>{toast && <Toast {...toast} />}</AnimatePresence>
        </div>
    );
}
