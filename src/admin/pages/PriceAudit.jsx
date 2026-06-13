import React, { useState, useEffect, useMemo } from 'react';
import { ScanLine, RefreshCw, CheckCircle2, AlertTriangle, Lock, Slash, HelpCircle, Wand2, Search } from 'lucide-react';
import { getPriceAudit, setProductPrice } from '../services/db';

const eur = (n) => (n == null ? '—' : (Number(n) || 0).toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' }));

const STATUS = {
    ok: { label: 'Em conformidade', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: <CheckCircle2 size={13} /> },
    off: { label: 'Fora do padrão', cls: 'bg-red-50 text-red-700 border-red-200', icon: <AlertTriangle size={13} /> },
    manual_override: { label: 'Preço manual', cls: 'bg-amber-50 text-amber-700 border-amber-200', icon: <Lock size={13} /> },
    no_dropea: { label: 'Sem Dropea', cls: 'bg-gray-100 text-gray-500 border-gray-200', icon: <Slash size={13} /> },
    cost_missing: { label: 'Custo ausente na Dropea', cls: 'bg-gray-100 text-gray-500 border-gray-200', icon: <HelpCircle size={13} /> },
};
const sm = (s) => STATUS[s] || { label: s, cls: 'bg-gray-100 text-gray-600 border-gray-200', icon: null };

const FILTERS = [
    { id: 'all', label: 'Todos' },
    { id: 'off', label: 'Fora do padrão' },
    { id: 'manual_override', label: 'Preço manual' },
    { id: 'cost_missing', label: 'Custo ausente' },
    { id: 'no_dropea', label: 'Sem Dropea' },
    { id: 'ok', label: 'Em conformidade' },
];

function Card({ label, value, cls = 'text-gray-900' }) {
    return (
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <div className="text-xs font-bold text-gray-500 mb-1">{label}</div>
            <div className={`text-3xl font-black ${cls}`}>{value}</div>
        </div>
    );
}

export default function PriceAudit() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('off');
    const [search, setSearch] = useState('');
    const [busy, setBusy] = useState(null); // id sendo corrigido, ou 'bulk'

    const fetchAudit = () => getPriceAudit();
    useEffect(() => {
        let alive = true;
        fetchAudit().then(d => { if (alive) { setData(d); setLoading(false); } });
        return () => { alive = false; };
    }, []);
    const reload = () => { setLoading(true); fetchAudit().then(d => { setData(d); setLoading(false); }); };

    const rows = useMemo(() => data?.rows || [], [data]);
    const summary = data?.summary || {};
    const settings = data?.settings || { margin: 30, shipping: 7 };

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return rows.filter(r => {
            if (filter !== 'all' && r.status !== filter) return false;
            if (q && !(`${r.name} ${r.dropea_id || ''} ${r.id}`.toLowerCase().includes(q))) return false;
            return true;
        });
    }, [rows, filter, search]);

    const fixOne = async (r) => {
        if (r.expected == null) return;
        setBusy(r.id);
        const res = await setProductPrice(r.id, r.expected);
        setBusy(null);
        if (!res || res.error) { alert('Falha ao corrigir: ' + (res?.error || 'erro')); return; }
        setData(prev => ({
            ...prev,
            summary: { ...prev.summary, off: Math.max(0, (prev.summary.off || 0) - 1), ok: (prev.summary.ok || 0) + 1 },
            rows: prev.rows.map(x => x.id === r.id ? { ...x, engine_price: r.expected, effective_price: x.manual_price ?? r.expected, diff: 0, status: 'ok' } : x),
        }));
    };

    const fixAllOff = async () => {
        const offRows = rows.filter(r => r.status === 'off' && r.expected != null);
        if (!offRows.length) return;
        if (!window.confirm(`Corrigir ${offRows.length} produto(s) fora do padrão para o preço esperado da regra?`)) return;
        setBusy('bulk');
        for (const r of offRows) { await setProductPrice(r.id, r.expected); }
        setBusy(null);
        reload();
    };

    const offCount = summary.off || 0;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <ScanLine className="text-rose-500" size={32} /> Auditoria de Preços
                    </h1>
                    <p className="text-gray-500 mt-2 text-lg">Verifica se cada produto segue a regra do Motor de Preços, usando o custo atual da Dropea.</p>
                    <code className="inline-block mt-3 text-xs bg-gray-900 text-rose-300 px-3 py-1.5 rounded-lg font-mono">
                        Preço = (Custo + {settings.shipping}€) × (1 + {settings.margin}/100)
                    </code>
                </div>
                <div className="flex items-center gap-2">
                    {offCount > 0 && (
                        <button onClick={fixAllOff} disabled={busy} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500 text-white text-sm font-bold hover:bg-rose-600 transition-colors disabled:opacity-50">
                            <Wand2 size={16} /> Corrigir {offCount} fora do padrão
                        </button>
                    )}
                    <button onClick={reload} disabled={busy} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-bold hover:bg-gray-700 transition-colors disabled:opacity-50">
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Reauditar
                    </button>
                </div>
            </div>

            {/* Aviso Dropea */}
            {data && data.dropea && !data.dropea.ok && (
                <div className="flex items-start gap-3 rounded-2xl bg-amber-50 border border-amber-200 px-5 py-4 text-sm text-amber-800">
                    <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                    <span>Não foi possível ler os custos da Dropea ({data.dropea.error}). Produtos com Dropea ficam como "custo ausente" até a conexão voltar.</span>
                </div>
            )}

            {/* Resumo */}
            {loading ? (
                <div className="py-16 text-center text-gray-400">Auditando catálogo na Dropea…</div>
            ) : (
                <>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        <Card label="Total" value={summary.total ?? 0} />
                        <Card label="Em conformidade" value={summary.ok ?? 0} cls="text-emerald-600" />
                        <Card label="Fora do padrão" value={summary.off ?? 0} cls="text-red-600" />
                        <Card label="Preço manual" value={summary.manual ?? 0} cls="text-amber-600" />
                        <Card label="Sem Dropea" value={summary.no_dropea ?? 0} cls="text-gray-500" />
                        <Card label="Custo ausente" value={summary.cost_missing ?? 0} cls="text-gray-500" />
                    </div>

                    {/* Filtros */}
                    <div className="flex flex-wrap items-center gap-2">
                        {FILTERS.map(f => (
                            <button key={f.id} onClick={() => setFilter(f.id)}
                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${filter === f.id ? 'bg-rose-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                                {f.label}
                            </button>
                        ))}
                        <div className="relative flex-1 min-w-[200px]">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nome, ID, Dropea ID…"
                                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-rose-400" />
                        </div>
                    </div>

                    {/* Tabela */}
                    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 border-y border-gray-100 text-gray-500">
                                    <tr>
                                        <th className="px-6 py-3 font-bold">Produto</th>
                                        <th className="px-3 py-3 font-bold">Dropea</th>
                                        <th className="px-3 py-3 font-bold text-right">Custo</th>
                                        <th className="px-3 py-3 font-bold text-right">Esperado</th>
                                        <th className="px-3 py-3 font-bold text-right">Atual (motor)</th>
                                        <th className="px-3 py-3 font-bold text-right">Diferença</th>
                                        <th className="px-3 py-3 font-bold">Status</th>
                                        <th className="px-4 py-3 font-bold text-right">Ação</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filtered.map(r => (
                                        <tr key={r.id} className="hover:bg-gray-50/60 transition-colors">
                                            <td className="px-6 py-3">
                                                <div className="font-semibold text-gray-800 max-w-[280px] truncate">{r.name}</div>
                                                <div className="text-xs text-gray-400">#{r.id}{!r.is_active && ' · inativo'}{r.manual_price != null && ` · manual: ${eur(r.manual_price)}`}</div>
                                            </td>
                                            <td className="px-3 py-3 text-gray-500 font-mono text-xs">{r.dropea_id || '—'}</td>
                                            <td className="px-3 py-3 text-right text-gray-600 whitespace-nowrap">{eur(r.cost)}</td>
                                            <td className="px-3 py-3 text-right font-bold text-gray-900 whitespace-nowrap">{eur(r.expected)}</td>
                                            <td className="px-3 py-3 text-right text-gray-600 whitespace-nowrap">{eur(r.engine_price)}</td>
                                            <td className={`px-3 py-3 text-right font-bold whitespace-nowrap ${r.diff == null ? 'text-gray-300' : Math.abs(r.diff) <= 0.01 ? 'text-emerald-600' : (r.diff > 0 ? 'text-amber-600' : 'text-red-600')}`}>
                                                {r.diff == null ? '—' : (r.diff > 0 ? '+' : '') + eur(r.diff)}
                                            </td>
                                            <td className="px-3 py-3">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${sm(r.status).cls}`}>
                                                    {sm(r.status).icon} {sm(r.status).label}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                {(r.status === 'off' || (r.status === 'manual_override' && r.expected != null)) && (
                                                    <button onClick={() => fixOne(r)} disabled={busy} className="px-3 py-1.5 rounded-lg bg-gray-900 text-white text-xs font-bold hover:bg-rose-600 transition-colors disabled:opacity-50 whitespace-nowrap">
                                                        {busy === r.id ? '…' : `→ ${eur(r.expected)}`}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filtered.length === 0 && (
                                <div className="py-16 text-center">
                                    <CheckCircle2 size={40} className="mx-auto text-emerald-300 mb-4" />
                                    <p className="text-gray-500 font-semibold">Nada neste filtro.</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <p className="text-xs text-gray-400">
                        "Atual (motor)" é o preço calculado automaticamente. Produtos com <b>preço manual</b> foram forçados de propósito — o cliente paga o manual, por isso não entram como "fora do padrão" (mas você pode realinhá-los à regra clicando na ação).
                    </p>
                </>
            )}
        </div>
    );
}
