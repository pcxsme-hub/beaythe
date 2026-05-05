import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Save, RotateCcw, Type, Image as ImageIcon, Brush } from 'lucide-react';
import { getTheme, updateTheme, resetTheme } from '../services/db';
import { invalidateTheme, applyThemeVars } from '../../hooks/useTheme';

const FONT_OPTIONS = ['Outfit', 'Inter', 'Cormorant Garamond', 'Playfair Display', 'Manrope', 'Plus Jakarta Sans', 'Italiana', 'DM Serif Display'];

const Toast = ({ msg, type }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
        className={`fixed bottom-6 right-6 px-5 py-3 rounded-2xl text-sm font-bold shadow-2xl z-50 ${type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>{msg}</motion.div>
);

const ColorField = ({ label, value, onChange, hint }) => (
    <label className="block">
        <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1.5 block">{label}</span>
        <div className="flex gap-2 items-center">
            <input type="color" value={value || '#000000'} onChange={e => onChange(e.target.value)} className="w-12 h-12 rounded-xl border border-gray-200 cursor-pointer p-1" />
            <input type="text" value={value || ''} onChange={e => onChange(e.target.value)} className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-[14px] font-mono outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100" />
        </div>
        {hint && <span className="text-[11px] text-gray-400 italic mt-1 block">{hint}</span>}
    </label>
);

export default function ThemeAdmin() {
    const [theme, setThemeState] = useState(null);
    const [draft, setDraft] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dirty, setDirty] = useState(false);
    const [toast, setToast] = useState(null);

    const showToast = (msg, type) => { setToast({ msg, type }); setTimeout(() => setToast(null), 2500); };

    useEffect(() => {
        getTheme().then(t => { setThemeState(t); setDraft({ ...t }); setLoading(false); });
    }, []);

    // Live preview as user edits — applies to whole admin window so they SEE changes.
    useEffect(() => { if (draft) applyThemeVars(draft); }, [draft]);

    const set = (k, v) => { setDraft(prev => ({ ...prev, [k]: v })); setDirty(true); };

    const save = async () => {
        try {
            const r = await updateTheme(draft);
            setThemeState(r); setDraft({ ...r });
            invalidateTheme();
            applyThemeVars(r);
            setDirty(false);
            showToast('Tema guardado', 'success');
        } catch { showToast('Erro ao guardar', 'error'); }
    };

    const reset = async () => {
        if (!confirm('Restaurar tema para o padrão?')) return;
        try {
            const r = await resetTheme();
            setThemeState(r); setDraft({ ...r });
            invalidateTheme();
            applyThemeVars(r);
            setDirty(false);
            showToast('Tema restaurado', 'success');
        } catch { showToast('Erro', 'error'); }
    };

    if (loading || !draft) return <div className="p-12 text-center text-gray-400">A carregar...</div>;

    return (
        <div>
            <div className="flex items-start justify-between mb-8 gap-6">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900 flex items-center gap-3">
                        <Palette className="text-rose-500" size={28} />
                        Tema & Branding
                    </h1>
                    <p className="text-gray-500 mt-2 max-w-2xl">
                        Edita as cores, fontes, logo e raios da sua marca. As mudanças aparecem ao vivo enquanto editas.
                    </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={reset} className="text-[12px] font-bold text-gray-500 hover:text-gray-900 px-4 py-2.5 rounded-xl inline-flex items-center gap-1.5 hover:bg-gray-100"><RotateCcw size={14} /> Restaurar</button>
                    <button onClick={save} disabled={!dirty} className="text-[12px] font-bold bg-gray-900 text-white px-5 py-2.5 rounded-xl hover:bg-black inline-flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"><Save size={14} /> {dirty ? 'Guardar tema' : 'Guardado'}</button>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
                {/* Form */}
                <div className="col-span-7 space-y-6">
                    {/* Brand */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <h3 className="text-sm font-black text-gray-900 mb-4 uppercase tracking-widest flex items-center gap-2"><ImageIcon size={14} /> Identidade</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <label className="block">
                                <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1.5 block">Nome da marca</span>
                                <input value={draft.brand_name || ''} onChange={e => set('brand_name', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100" />
                            </label>
                            <label className="block">
                                <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1.5 block">URL do logo (PNG/SVG)</span>
                                <input value={draft.logo_url || ''} onChange={e => set('logo_url', e.target.value)} placeholder="https://..." className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] font-mono outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100" />
                            </label>
                            <label className="col-span-2 block">
                                <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1.5 block">URL do favicon (32x32 PNG/SVG)</span>
                                <input value={draft.favicon_url || ''} onChange={e => set('favicon_url', e.target.value)} placeholder="https://..." className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] font-mono outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100" />
                            </label>
                        </div>
                    </div>

                    {/* Colors */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <h3 className="text-sm font-black text-gray-900 mb-4 uppercase tracking-widest flex items-center gap-2"><Brush size={14} /> Paleta de cores</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <ColorField label="Primária (espresso)" value={draft.color_primary} onChange={v => set('color_primary', v)} hint="Texto principal, botões pretos, headlines" />
                            <ColorField label="Acento (rose nude)" value={draft.color_accent} onChange={v => set('color_accent', v)} hint="Detalhes, CTAs secundárias, destaques" />
                            <ColorField label="Fundo base" value={draft.color_bg} onChange={v => set('color_bg', v)} hint="Fundo geral do site" />
                            <ColorField label="Surface (creme)" value={draft.color_surface} onChange={v => set('color_surface', v)} hint="Cards, ícones, badges" />
                            <ColorField label="Borda" value={draft.color_border} onChange={v => set('color_border', v)} hint="Linhas e bordas suaves" />
                            <ColorField label="Texto secundário" value={draft.color_text} onChange={v => set('color_text', v)} hint="Parágrafos, descrições" />
                        </div>
                    </div>

                    {/* Typography */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <h3 className="text-sm font-black text-gray-900 mb-4 uppercase tracking-widest flex items-center gap-2"><Type size={14} /> Tipografia</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <label className="block">
                                <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1.5 block">Fonte títulos</span>
                                <select value={draft.font_heading} onChange={e => set('font_heading', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-[14px]">
                                    {FONT_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
                                </select>
                            </label>
                            <label className="block">
                                <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1.5 block">Fonte corpo</span>
                                <select value={draft.font_body} onChange={e => set('font_body', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-[14px]">
                                    {FONT_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
                                </select>
                            </label>
                        </div>
                        <p className="text-[11px] text-gray-400 italic mt-3">Para usar uma fonte personalizada, primeiro adiciona ao CSS via &lt;link&gt; do Google Fonts.</p>
                    </div>

                    {/* Radius */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <h3 className="text-sm font-black text-gray-900 mb-4 uppercase tracking-widest">Border radius</h3>
                        <div className="grid grid-cols-3 gap-4">
                            {[['radius_sm', 'Pequeno (px)'], ['radius_md', 'Médio (px)'], ['radius_lg', 'Grande (px)']].map(([k, label]) => (
                                <label key={k} className="block">
                                    <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1.5 block">{label}</span>
                                    <input type="number" min="0" max="64" value={draft[k]} onChange={e => set(k, parseInt(e.target.value) || 0)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100" />
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Live preview */}
                <div className="col-span-5">
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-4">
                        <div className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-3">Pré-visualização ao vivo</div>
                        <div style={{ background: draft.color_bg, borderRadius: `${draft.radius_lg}px` }} className="p-6 border" >
                            <div className="flex items-center gap-3 mb-6">
                                {draft.logo_url ? <img src={draft.logo_url} alt={draft.brand_name} className="h-8" /> : <span style={{ color: draft.color_primary, fontFamily: draft.font_heading }} className="text-2xl font-bold tracking-tight">{draft.brand_name}</span>}
                            </div>
                            <h2 style={{ color: draft.color_primary, fontFamily: draft.font_heading }} className="text-3xl font-light leading-tight mb-3">Headline de exemplo</h2>
                            <p style={{ color: draft.color_text, fontFamily: draft.font_body }} className="text-[14px] leading-relaxed mb-6">
                                Texto de corpo simulando uma descrição do produto, render de página, etc. Aqui usas as cores secundárias.
                            </p>
                            <div className="flex flex-wrap gap-2 mb-6">
                                <span style={{ background: draft.color_surface, color: draft.color_primary, borderRadius: `${draft.radius_sm}px`, border: `1px solid ${draft.color_border}` }} className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest">Vegano</span>
                                <span style={{ background: draft.color_accent, color: '#fff', borderRadius: `${draft.radius_sm}px` }} className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest">Best seller</span>
                            </div>
                            <button style={{ background: draft.color_primary, color: '#fff', borderRadius: `${draft.radius_md}px` }} className="px-6 py-3 text-[12px] font-bold uppercase tracking-[0.2em]">Botão Primário</button>
                            <button style={{ background: draft.color_accent, color: '#fff', borderRadius: `${draft.radius_md}px`, marginLeft: 8 }} className="px-6 py-3 text-[12px] font-bold uppercase tracking-[0.2em]">Botão Secundário</button>
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>{toast && <Toast {...toast} />}</AnimatePresence>
        </div>
    );
}
