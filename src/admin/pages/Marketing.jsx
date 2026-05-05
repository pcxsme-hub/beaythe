import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Megaphone, Tag, Plus, Trash2, Save, Power, PowerOff, Calendar } from 'lucide-react';
import { getCoupons, upsertCoupon, deleteCoupon, getPromoBanners, upsertPromoBanner, deletePromoBanner } from '../services/db';

const Toast = ({ msg, type }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
        className={`fixed bottom-6 right-6 px-5 py-3 rounded-2xl text-sm font-bold shadow-2xl z-50 ${type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>{msg}</motion.div>
);

const TextField = ({ label, value, onChange, placeholder, type = 'text' }) => (
    <label className="block">
        {label && <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1 block">{label}</span>}
        <input type={type} value={value ?? ''} onChange={e => onChange(e.target.value)} placeholder={placeholder}
            className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-[13px] outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100" />
    </label>
);

// ============= COUPONS =============

function CouponsTab() {
    const [items, setItems] = useState([]);
    const [editing, setEditing] = useState(null);
    const [draft, setDraft] = useState(null);
    const [toast, setToast] = useState(null);

    const showToast = (msg, type) => { setToast({ msg, type }); setTimeout(() => setToast(null), 2500); };
    const reload = async () => setItems(await getCoupons());
    useEffect(() => { reload(); }, []);

    const startNew = () => {
        setDraft({ code: '', description: '', discount_pct: 10, min_subtotal: 0, max_uses: '', starts_at: '', ends_at: '', enabled: true });
        setEditing('new');
    };
    const startEdit = (c) => {
        setDraft({
            ...c,
            starts_at: c.starts_at ? c.starts_at.slice(0, 16) : '',
            ends_at: c.ends_at ? c.ends_at.slice(0, 16) : '',
            max_uses: c.max_uses ?? ''
        });
        setEditing(c.id);
    };
    const cancel = () => { setEditing(null); setDraft(null); };
    const save = async () => {
        try { await upsertCoupon(draft); await reload(); cancel(); showToast('Cupom salvo', 'success'); }
        catch { showToast('Erro', 'error'); }
    };
    const remove = async (id) => {
        if (!confirm('Apagar este cupom?')) return;
        try { await deleteCoupon(id); await reload(); showToast('Apagado', 'success'); }
        catch { showToast('Erro', 'error'); }
    };

    return (
        <div>
            <div className="flex justify-between mb-5">
                <p className="text-[13px] text-gray-500">Cria cupons de desconto que o cliente aplica no checkout. Validação automática de validade, mínimo e usos.</p>
                <button onClick={startNew} className="text-[12px] font-bold bg-gray-900 text-white px-5 py-2.5 rounded-xl hover:bg-black inline-flex items-center gap-1.5"><Plus size={14} /> Novo cupom</button>
            </div>

            {/* List */}
            <div className="space-y-2 mb-6">
                {items.map(c => (
                    <div key={c.id} className={`bg-white border rounded-2xl p-4 flex items-center gap-4 ${c.enabled ? 'border-gray-200' : 'border-gray-100 opacity-60'}`}>
                        <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-md ${c.enabled ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                            {c.enabled ? 'Ativo' : 'Off'}
                        </span>
                        <div className="flex-1">
                            <div className="flex items-baseline gap-3">
                                <code className="text-[15px] font-bold font-mono text-gray-900">{c.code}</code>
                                <span className="text-[14px] font-bold text-rose-600">−{c.discount_pct}%</span>
                                {c.min_subtotal > 0 && <span className="text-[11px] text-gray-400">mín. {c.min_subtotal}€</span>}
                                {c.max_uses != null && <span className="text-[11px] text-gray-400">{c.used_count}/{c.max_uses} usos</span>}
                            </div>
                            {c.description && <p className="text-[12px] text-gray-500 mt-0.5">{c.description}</p>}
                            {(c.starts_at || c.ends_at) && (
                                <p className="text-[11px] text-gray-400 mt-1 inline-flex items-center gap-1">
                                    <Calendar size={11} />
                                    {c.starts_at ? new Date(c.starts_at).toLocaleDateString() : '—'} → {c.ends_at ? new Date(c.ends_at).toLocaleDateString() : '—'}
                                </p>
                            )}
                        </div>
                        <button onClick={() => startEdit(c)} className="text-[12px] font-bold text-gray-700 hover:text-rose-600 px-3 py-1.5 rounded-lg hover:bg-gray-50">Editar</button>
                        <button onClick={() => remove(c.id)} className="text-gray-300 hover:text-red-500"><Trash2 size={15} /></button>
                    </div>
                ))}
                {items.length === 0 && <p className="text-gray-400 italic text-center py-8">Sem cupons. Cria o primeiro.</p>}
            </div>

            {/* Editor */}
            <AnimatePresence>
                {editing && draft && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6"
                        onClick={cancel}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-white rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                        >
                            <h3 className="text-xl font-black mb-6">{editing === 'new' ? 'Novo cupom' : 'Editar cupom'}</h3>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <TextField label="Código (UPPERCASE)" value={draft.code} onChange={v => setDraft({ ...draft, code: v.toUpperCase() })} placeholder="WELCOME10" />
                                <TextField label="Desconto %" type="number" value={draft.discount_pct} onChange={v => setDraft({ ...draft, discount_pct: parseFloat(v) || 0 })} />
                                <div className="col-span-2">
                                    <TextField label="Descrição (opcional)" value={draft.description} onChange={v => setDraft({ ...draft, description: v })} placeholder="Bem-vindo: 10% OFF na primeira compra" />
                                </div>
                                <TextField label="Subtotal mínimo (€)" type="number" value={draft.min_subtotal} onChange={v => setDraft({ ...draft, min_subtotal: parseFloat(v) || 0 })} />
                                <TextField label="Usos máximos (vazio = ilimitado)" type="number" value={draft.max_uses} onChange={v => setDraft({ ...draft, max_uses: v })} placeholder="100" />
                                <TextField label="Início" type="datetime-local" value={draft.starts_at} onChange={v => setDraft({ ...draft, starts_at: v })} />
                                <TextField label="Fim" type="datetime-local" value={draft.ends_at} onChange={v => setDraft({ ...draft, ends_at: v })} />
                            </div>
                            <label className="flex items-center gap-2 text-[12px] font-bold text-gray-600 cursor-pointer mb-6">
                                <input type="checkbox" checked={draft.enabled} onChange={e => setDraft({ ...draft, enabled: e.target.checked })} className="accent-rose-500" />
                                Ativo
                            </label>
                            <div className="flex gap-3 justify-end">
                                <button onClick={cancel} className="px-5 py-2.5 text-[12px] font-bold text-gray-500 hover:text-gray-900">Cancelar</button>
                                <button onClick={save} className="bg-gray-900 text-white px-5 py-2.5 rounded-xl text-[12px] font-bold inline-flex items-center gap-1.5"><Save size={14} /> Guardar</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>{toast && <Toast {...toast} />}</AnimatePresence>
        </div>
    );
}

// ============= BANNERS =============

const PLACEMENTS = [
    { id: 'TOP', label: 'Faixa superior' },
    { id: 'HERO', label: 'Sobre o hero' },
    { id: 'SIDE', label: 'Lateral' }
];
const SEGMENTS = [
    { id: 'ALL', label: 'Todos' },
    { id: 'NEW', label: 'Novos visitantes' },
    { id: 'RETURNING', label: 'Retornantes' },
    { id: 'CART_ABANDONED', label: 'Carrinho abandonado' }
];

function BannersTab() {
    const [items, setItems] = useState([]);
    const [editing, setEditing] = useState(null);
    const [draft, setDraft] = useState(null);
    const [toast, setToast] = useState(null);

    const showToast = (msg, type) => { setToast({ msg, type }); setTimeout(() => setToast(null), 2500); };
    const reload = async () => setItems(await getPromoBanners());
    useEffect(() => { reload(); }, []);

    const startNew = () => {
        setDraft({ name: 'Novo banner', placement: 'TOP', enabled: true, message_es: '', message_pt: '', message_en: '', cta_label_es: '', cta_label_pt: '', cta_label_en: '', cta_link: '', bg_color: '#C4A49A', text_color: '#FFFFFF', segment: 'ALL', starts_at: '', ends_at: '' });
        setEditing('new');
    };
    const startEdit = (b) => {
        setDraft({ ...b, starts_at: b.starts_at?.slice(0, 16) || '', ends_at: b.ends_at?.slice(0, 16) || '' });
        setEditing(b.id);
    };
    const cancel = () => { setEditing(null); setDraft(null); };
    const save = async () => {
        try { await upsertPromoBanner(draft); await reload(); cancel(); showToast('Banner salvo', 'success'); }
        catch { showToast('Erro', 'error'); }
    };
    const remove = async (id) => {
        if (!confirm('Apagar este banner?')) return;
        try { await deletePromoBanner(id); await reload(); showToast('Apagado', 'success'); }
        catch { showToast('Erro', 'error'); }
    };

    return (
        <div>
            <div className="flex justify-between mb-5">
                <p className="text-[13px] text-gray-500">Banners promocionais com agendamento e segmentação por tipo de visitante.</p>
                <button onClick={startNew} className="text-[12px] font-bold bg-gray-900 text-white px-5 py-2.5 rounded-xl hover:bg-black inline-flex items-center gap-1.5"><Plus size={14} /> Novo banner</button>
            </div>

            <div className="space-y-3">
                {items.map(b => (
                    <div key={b.id} className={`bg-white border rounded-2xl overflow-hidden ${b.enabled ? 'border-gray-200' : 'border-gray-100 opacity-60'}`}>
                        <div style={{ background: b.bg_color, color: b.text_color }} className="px-4 py-3 text-[13px] font-bold flex items-center justify-between">
                            <span>{b.message_es || b.name}</span>
                            {b.cta_label_es && <span className="text-[10px] uppercase tracking-widest opacity-90">{b.cta_label_es} →</span>}
                        </div>
                        <div className="p-4 flex items-center gap-3">
                            <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md ${b.enabled ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>{b.enabled ? 'Ativo' : 'Off'}</span>
                            <span className="text-[10px] font-bold uppercase px-2 py-1 rounded-md bg-rose-50 text-rose-700">{PLACEMENTS.find(p => p.id === b.placement)?.label || b.placement}</span>
                            <span className="text-[10px] font-bold uppercase px-2 py-1 rounded-md bg-blue-50 text-blue-700">{SEGMENTS.find(s => s.id === b.segment)?.label || b.segment}</span>
                            <span className="text-[12px] text-gray-700 font-bold flex-1">{b.name}</span>
                            <button onClick={() => startEdit(b)} className="text-[12px] font-bold text-gray-700 hover:text-rose-600 px-3 py-1.5 rounded-lg hover:bg-gray-50">Editar</button>
                            <button onClick={() => remove(b.id)} className="text-gray-300 hover:text-red-500"><Trash2 size={15} /></button>
                        </div>
                    </div>
                ))}
                {items.length === 0 && <p className="text-gray-400 italic text-center py-8">Sem banners. Cria o primeiro.</p>}
            </div>

            <AnimatePresence>
                {editing && draft && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6" onClick={cancel}>
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-white rounded-3xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                            <h3 className="text-xl font-black mb-6">{editing === 'new' ? 'Novo banner' : 'Editar banner'}</h3>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <TextField label="Nome interno" value={draft.name} onChange={v => setDraft({ ...draft, name: v })} />
                                <label className="block">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1 block">Localização</span>
                                    <select value={draft.placement} onChange={e => setDraft({ ...draft, placement: e.target.value })} className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-[13px]">
                                        {PLACEMENTS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                                    </select>
                                </label>
                                <label className="block">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1 block">Segmento</span>
                                    <select value={draft.segment} onChange={e => setDraft({ ...draft, segment: e.target.value })} className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-[13px]">
                                        {SEGMENTS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                                    </select>
                                </label>
                                <TextField label="Link CTA" value={draft.cta_link} onChange={v => setDraft({ ...draft, cta_link: v })} placeholder="/categoria/outlet" />
                            </div>

                            <div className="grid grid-cols-3 gap-3 mb-4">
                                <TextField label="Mensagem ES" value={draft.message_es} onChange={v => setDraft({ ...draft, message_es: v })} />
                                <TextField label="Mensagem PT" value={draft.message_pt} onChange={v => setDraft({ ...draft, message_pt: v })} />
                                <TextField label="Mensagem EN" value={draft.message_en} onChange={v => setDraft({ ...draft, message_en: v })} />
                            </div>
                            <div className="grid grid-cols-3 gap-3 mb-4">
                                <TextField label="CTA ES" value={draft.cta_label_es} onChange={v => setDraft({ ...draft, cta_label_es: v })} />
                                <TextField label="CTA PT" value={draft.cta_label_pt} onChange={v => setDraft({ ...draft, cta_label_pt: v })} />
                                <TextField label="CTA EN" value={draft.cta_label_en} onChange={v => setDraft({ ...draft, cta_label_en: v })} />
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <label className="block">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1 block">Cor de fundo</span>
                                    <div className="flex gap-2"><input type="color" value={draft.bg_color} onChange={e => setDraft({ ...draft, bg_color: e.target.value })} className="w-10 h-10 rounded-lg border" /><input type="text" value={draft.bg_color} onChange={e => setDraft({ ...draft, bg_color: e.target.value })} className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-[13px] font-mono" /></div>
                                </label>
                                <label className="block">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1 block">Cor do texto</span>
                                    <div className="flex gap-2"><input type="color" value={draft.text_color} onChange={e => setDraft({ ...draft, text_color: e.target.value })} className="w-10 h-10 rounded-lg border" /><input type="text" value={draft.text_color} onChange={e => setDraft({ ...draft, text_color: e.target.value })} className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-[13px] font-mono" /></div>
                                </label>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <TextField label="Início" type="datetime-local" value={draft.starts_at} onChange={v => setDraft({ ...draft, starts_at: v })} />
                                <TextField label="Fim" type="datetime-local" value={draft.ends_at} onChange={v => setDraft({ ...draft, ends_at: v })} />
                            </div>

                            <label className="flex items-center gap-2 text-[12px] font-bold text-gray-600 cursor-pointer mb-6">
                                <input type="checkbox" checked={draft.enabled} onChange={e => setDraft({ ...draft, enabled: e.target.checked })} className="accent-rose-500" />
                                Ativo
                            </label>

                            {/* Live preview */}
                            <div className="mb-6">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Pré-visualização</span>
                                <div style={{ background: draft.bg_color, color: draft.text_color }} className="px-4 py-3 text-[13px] font-bold rounded-xl flex items-center justify-between">
                                    <span>{draft.message_es || draft.name}</span>
                                    {draft.cta_label_es && <span className="text-[10px] uppercase tracking-widest opacity-90">{draft.cta_label_es} →</span>}
                                </div>
                            </div>

                            <div className="flex gap-3 justify-end">
                                <button onClick={cancel} className="px-5 py-2.5 text-[12px] font-bold text-gray-500 hover:text-gray-900">Cancelar</button>
                                <button onClick={save} className="bg-gray-900 text-white px-5 py-2.5 rounded-xl text-[12px] font-bold inline-flex items-center gap-1.5"><Save size={14} /> Guardar</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>{toast && <Toast {...toast} />}</AnimatePresence>
        </div>
    );
}

// ============= MAIN =============

export default function Marketing() {
    const [tab, setTab] = useState('coupons');
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900 flex items-center gap-3">
                    <Megaphone className="text-rose-500" size={28} />
                    Marketing
                </h1>
                <p className="text-gray-500 mt-2 max-w-2xl">Gere cupons de desconto e banners promocionais com segmentação e agendamento.</p>
            </div>

            <div className="flex gap-2 mb-6 bg-gray-100 rounded-2xl p-1.5 max-w-lg">
                {[{ id: 'coupons', label: 'Cupons', icon: Tag }, { id: 'banners', label: 'Banners', icon: Megaphone }].map(t => {
                    const Icon = t.icon; const active = tab === t.id;
                    return (
                        <button key={t.id} onClick={() => setTab(t.id)}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold transition-all ${active ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}>
                            <Icon size={14} /> {t.label}
                        </button>
                    );
                })}
            </div>

            {tab === 'coupons' && <CouponsTab />}
            {tab === 'banners' && <BannersTab />}
        </div>
    );
}
