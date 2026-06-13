import React, { useState, useEffect, useMemo } from 'react';
import {
    LineChart, TrendingUp, ShoppingBag, Receipt, Boxes, Clock,
    RefreshCw, Search, X, CreditCard, Trophy, Download
} from 'lucide-react';
import { getSalesOrders, updateSalesOrderStatus } from '../services/db';

// ---- helpers ----
const eur = (n) => (Number(n) || 0).toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' });
const int = (n) => (Number(n) || 0).toLocaleString('pt-PT');

// createdAt pode vir como epoch-ms (string) dos pedidos novos OU "2026-06-11 22:24:26" (default antigo).
const parseDate = (v) => {
    if (v == null) return null;
    const s = String(v).trim();
    const d = /^\d+$/.test(s) ? new Date(parseInt(s, 10)) : new Date(s.includes('T') ? s : s.replace(' ', 'T') + 'Z');
    return isNaN(d.getTime()) ? null : d;
};
const dayKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const PAID_STATUSES = ['paid', 'pago_no_ato'];

const STATUS_META = {
    paid: { label: 'Pago', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    pending_payment: { label: 'Pagamento pendente', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
    payment_failed: { label: 'Pagamento falhou', cls: 'bg-red-50 text-red-700 border-red-200' },
    payment_error: { label: 'Erro no pagamento', cls: 'bg-red-50 text-red-700 border-red-200' },
    expired: { label: 'Expirado', cls: 'bg-gray-100 text-gray-500 border-gray-200' },
    pendente_confirmacao: { label: 'Pendente confirmação', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
    confirmado_cliente: { label: 'Confirmado', cls: 'bg-blue-50 text-blue-700 border-blue-200' },
    saiu_para_entrega: { label: 'Saiu para entrega', cls: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    pago_no_ato: { label: 'Pago na entrega', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    recusado_na_porta: { label: 'Recusado na porta', cls: 'bg-red-50 text-red-700 border-red-200' },
};
const statusMeta = (s) => STATUS_META[s] || { label: s || '—', cls: 'bg-gray-100 text-gray-600 border-gray-200' };
const EDITABLE_STATUSES = ['paid', 'pending_payment', 'confirmado_cliente', 'saiu_para_entrega', 'pago_no_ato', 'recusado_na_porta', 'payment_failed', 'expired'];

const RANGES = [
    { id: 'today', label: 'Hoje' },
    { id: '7d', label: '7 dias' },
    { id: '30d', label: '30 dias' },
    { id: 'month', label: 'Este mês' },
    { id: 'all', label: 'Tudo' },
];

function rangeStart(range) {
    const now = new Date();
    if (range === 'today') return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (range === '7d') return new Date(now.getTime() - 7 * 864e5);
    if (range === '30d') return new Date(now.getTime() - 30 * 864e5);
    if (range === 'month') return new Date(now.getFullYear(), now.getMonth(), 1);
    return null; // all
}

// ---- KPI card ----
function Kpi({ icon, label, value, sub, accent = 'gray' }) {
    const accents = {
        gray: 'text-gray-400', rose: 'text-rose-500', emerald: 'text-emerald-500', amber: 'text-amber-500', indigo: 'text-indigo-500',
    };
    return (
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
                <span className="text-gray-500 font-bold text-sm">{label}</span>
                <span className={accents[accent]}>{icon}</span>
            </div>
            <span className="text-3xl font-black text-gray-900 tracking-tight">{value}</span>
            {sub && <span className="text-xs text-gray-400 font-semibold mt-1">{sub}</span>}
        </div>
    );
}

// ---- mini bar chart (dependency-free) ----
function RevenueChart({ series }) {
    const max = Math.max(1, ...series.map(s => s.value));
    if (!series.length) return <div className="h-48 flex items-center justify-center text-gray-400 text-sm">Sem dados no período.</div>;
    return (
        <div className="flex items-end gap-1.5 h-48 overflow-x-auto pb-1">
            {series.map((s) => (
                <div key={s.key} className="flex-1 min-w-[10px] flex flex-col items-center justify-end group h-full">
                    <div className="w-full flex items-end justify-center h-full">
                        <div
                            className="w-full max-w-[26px] rounded-t-md bg-gradient-to-t from-rose-400 to-rose-500 hover:from-rose-500 hover:to-rose-600 transition-all relative"
                            style={{ height: `${(s.value / max) * 100}%`, minHeight: s.value > 0 ? '4px' : '0px' }}
                        >
                            <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                {eur(s.value)}
                            </span>
                        </div>
                    </div>
                    <span className="text-[9px] text-gray-400 mt-1.5 font-semibold rotate-0 whitespace-nowrap">{s.label}</span>
                </div>
            ))}
        </div>
    );
}

export default function SalesDashboard() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [range, setRange] = useState('30d');
    const [customFrom, setCustomFrom] = useState('');
    const [customTo, setCustomTo] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [methodFilter, setMethodFilter] = useState('all');
    const [search, setSearch] = useState('');

    const fetchOrders = () => getSalesOrders().then(data =>
        data.map(o => ({ ...o, _date: parseDate(o.createdAt), _items: Array.isArray(o.items) ? o.items : [] })));

    useEffect(() => {
        let alive = true;
        fetchOrders().then(list => { if (alive) { setOrders(list); setLoading(false); } });
        return () => { alive = false; };
    }, []);

    const refresh = () => { setLoading(true); fetchOrders().then(list => { setOrders(list); setLoading(false); }); };

    const methods = useMemo(() => Array.from(new Set(orders.map(o => o.payment_method).filter(Boolean))), [orders]);

    // ---- filtragem ----
    const filtered = useMemo(() => {
        let from = null, to = null;
        if (range === 'custom') {
            if (customFrom) from = new Date(customFrom + 'T00:00:00');
            if (customTo) to = new Date(customTo + 'T23:59:59');
        } else {
            from = rangeStart(range);
        }
        const q = search.trim().toLowerCase();
        return orders.filter(o => {
            if (from && o._date && o._date < from) return false;
            if (to && o._date && o._date > to) return false;
            if (statusFilter !== 'all' && o.status !== statusFilter) return false;
            if (methodFilter !== 'all' && o.payment_method !== methodFilter) return false;
            if (q) {
                const hay = `${o.order_code || ''} ${o.email || ''} ${o.customer_name || ''} ${o.city || ''}`.toLowerCase();
                if (!hay.includes(q)) return false;
            }
            return true;
        });
    }, [orders, range, customFrom, customTo, statusFilter, methodFilter, search]);

    // ---- métricas (sobre o filtrado) ----
    const metrics = useMemo(() => {
        const paid = filtered.filter(o => PAID_STATUSES.includes(o.status));
        const revenue = paid.reduce((s, o) => s + (Number(o.total) || 0), 0);
        const units = paid.reduce((s, o) => s + o._items.reduce((a, it) => a + (Number(it.quantity) || 0), 0), 0);
        const pending = filtered.filter(o => o.status === 'pending_payment').length;
        const aov = paid.length ? revenue / paid.length : 0;

        // série diária (receita paga por dia)
        const byDay = {};
        paid.forEach(o => { if (o._date) { const k = dayKey(o._date); byDay[k] = (byDay[k] || 0) + (Number(o.total) || 0); } });
        const series = Object.keys(byDay).sort().slice(-30).map(k => ({
            key: k, value: byDay[k],
            label: k.slice(8) + '/' + k.slice(5, 7),
        }));

        // top produtos (por unidades, dentre pagos)
        const prod = {};
        paid.forEach(o => o._items.forEach(it => {
            const id = it.id || it.name;
            if (!prod[id]) prod[id] = { name: it.name, qty: 0, revenue: 0 };
            prod[id].qty += Number(it.quantity) || 0;
            prod[id].revenue += (Number(it.price) || 0) * (Number(it.quantity) || 0);
        }));
        const topProducts = Object.values(prod).sort((a, b) => b.qty - a.qty).slice(0, 6);

        // breakdown por status e por método
        const statusCount = {};
        filtered.forEach(o => { statusCount[o.status] = (statusCount[o.status] || 0) + 1; });
        const methodRevenue = {};
        paid.forEach(o => { const m = o.payment_method || '—'; methodRevenue[m] = (methodRevenue[m] || 0) + (Number(o.total) || 0); });

        return { paidCount: paid.length, revenue, units, pending, aov, series, topProducts, statusCount, methodRevenue, totalCount: filtered.length };
    }, [filtered]);

    const handleStatus = async (id, status) => {
        setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
        await updateSalesOrderStatus(id, status);
    };

    const exportCsv = () => {
        const head = ['order_code', 'data', 'cliente', 'email', 'cidade', 'itens', 'subtotal', 'desconto', 'total', 'metodo', 'status'];
        const rows = filtered.map(o => [
            o.order_code, o._date ? o._date.toISOString() : '', o.customer_name || '', o.email || '', o.city || '',
            o._items.reduce((a, it) => a + (Number(it.quantity) || 0), 0), o.subtotal, o.discount, o.total, o.payment_method, o.status,
        ]);
        const csv = [head, ...rows].map(r => r.map(c => `"${String(c ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `vendas-beauthe-${dayKey(new Date())}.csv`;
        a.click();
        URL.revokeObjectURL(a.href);
    };

    const clearFilters = () => { setRange('30d'); setCustomFrom(''); setCustomTo(''); setStatusFilter('all'); setMethodFilter('all'); setSearch(''); };
    const maxMethodRev = Math.max(1, ...Object.values(metrics.methodRevenue));

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <LineChart className="text-rose-500" size={32} /> Painel de Vendas
                    </h1>
                    <p className="text-gray-500 mt-2 text-lg">Panorama das vendas da loja, com filtros para análises específicas.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={exportCsv} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-bold text-gray-700 hover:border-gray-900 transition-colors">
                        <Download size={16} /> CSV
                    </button>
                    <button onClick={refresh} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-bold hover:bg-rose-600 transition-colors">
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Atualizar
                    </button>
                </div>
            </div>

            {/* Filtros */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-5 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                    {RANGES.map(r => (
                        <button key={r.id} onClick={() => setRange(r.id)}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${range === r.id ? 'bg-rose-500 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}>
                            {r.label}
                        </button>
                    ))}
                    <button onClick={() => setRange('custom')}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${range === 'custom' ? 'bg-rose-500 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}>
                        Personalizado
                    </button>
                    {range === 'custom' && (
                        <div className="flex items-center gap-2">
                            <input type="date" value={customFrom} onChange={e => setCustomFrom(e.target.value)} className="px-3 py-2 rounded-xl border border-gray-200 text-sm" />
                            <span className="text-gray-400 text-sm">→</span>
                            <input type="date" value={customTo} onChange={e => setCustomTo(e.target.value)} className="px-3 py-2 rounded-xl border border-gray-200 text-sm" />
                        </div>
                    )}
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative flex-1 min-w-[220px]">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por pedido, email, cliente, cidade…"
                            className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-rose-400" />
                    </div>
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 bg-white">
                        <option value="all">Todos os status</option>
                        {Object.keys(STATUS_META).map(s => <option key={s} value={s}>{STATUS_META[s].label}</option>)}
                    </select>
                    <select value={methodFilter} onChange={e => setMethodFilter(e.target.value)} className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 bg-white">
                        <option value="all">Todos os métodos</option>
                        {methods.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <button onClick={clearFilters} className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">
                        <X size={14} /> Limpar
                    </button>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
                <Kpi icon={<TrendingUp size={20} />} accent="emerald" label="Receita (paga)" value={eur(metrics.revenue)} sub={`${int(metrics.paidCount)} pedidos pagos`} />
                <Kpi icon={<ShoppingBag size={20} />} accent="rose" label="Pedidos" value={int(metrics.totalCount)} sub="no período/filtro" />
                <Kpi icon={<Receipt size={20} />} accent="indigo" label="Ticket médio" value={eur(metrics.aov)} sub="por pedido pago" />
                <Kpi icon={<Boxes size={20} />} accent="gray" label="Unidades vendidas" value={int(metrics.units)} sub="itens pagos" />
                <Kpi icon={<Clock size={20} />} accent="amber" label="Pagamento pendente" value={int(metrics.pending)} sub="aguardando pagamento" />
            </div>

            {/* Gráfico + breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-200 shadow-sm p-6">
                    <h3 className="font-bold text-gray-900 mb-1">Receita por dia</h3>
                    <p className="text-xs text-gray-400 mb-5 font-semibold">Pedidos pagos · últimos {metrics.series.length} dias com vendas</p>
                    <RevenueChart series={metrics.series} />
                </div>
                <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">
                    <h3 className="font-bold text-gray-900 mb-5 flex items-center gap-2"><CreditCard size={18} className="text-gray-400" /> Por método de pagamento</h3>
                    {Object.keys(metrics.methodRevenue).length === 0 ? (
                        <p className="text-sm text-gray-400">Sem receita no período.</p>
                    ) : (
                        <div className="space-y-4">
                            {Object.entries(metrics.methodRevenue).sort((a, b) => b[1] - a[1]).map(([m, v]) => (
                                <div key={m}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-semibold text-gray-700 capitalize">{m}</span>
                                        <span className="font-bold text-gray-900">{eur(v)}</span>
                                    </div>
                                    <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                                        <div className="h-full bg-rose-400 rounded-full" style={{ width: `${(v / maxMethodRev) * 100}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Top produtos + status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">
                    <h3 className="font-bold text-gray-900 mb-5 flex items-center gap-2"><Trophy size={18} className="text-amber-500" /> Produtos mais vendidos</h3>
                    {metrics.topProducts.length === 0 ? (
                        <p className="text-sm text-gray-400">Ainda sem vendas para ranquear.</p>
                    ) : (
                        <div className="space-y-3">
                            {metrics.topProducts.map((p, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <span className="w-6 h-6 shrink-0 rounded-lg bg-gray-100 text-gray-600 text-xs font-black flex items-center justify-center">{i + 1}</span>
                                    <span className="flex-1 text-sm font-semibold text-gray-700 truncate">{p.name}</span>
                                    <span className="text-xs font-bold text-gray-400">{int(p.qty)} un.</span>
                                    <span className="text-sm font-bold text-gray-900 w-20 text-right">{eur(p.revenue)}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">
                    <h3 className="font-bold text-gray-900 mb-5">Pedidos por status</h3>
                    {Object.keys(metrics.statusCount).length === 0 ? (
                        <p className="text-sm text-gray-400">Nenhum pedido no período.</p>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {Object.entries(metrics.statusCount).sort((a, b) => b[1] - a[1]).map(([s, n]) => (
                                <span key={s} className={`px-3 py-1.5 rounded-full text-xs font-bold border ${statusMeta(s).cls}`}>
                                    {statusMeta(s).label}: {int(n)}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Tabela de pedidos */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 pb-4 flex items-center justify-between">
                    <h3 className="font-bold text-gray-900">Pedidos {loading ? '' : `(${metrics.totalCount})`}</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-y border-gray-100 text-gray-500">
                            <tr>
                                <th className="px-6 py-3 font-bold">Pedido</th>
                                <th className="px-4 py-3 font-bold">Data</th>
                                <th className="px-4 py-3 font-bold">Cliente</th>
                                <th className="px-4 py-3 font-bold text-center">Itens</th>
                                <th className="px-4 py-3 font-bold text-right">Total</th>
                                <th className="px-4 py-3 font-bold">Método</th>
                                <th className="px-6 py-3 font-bold">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filtered.map(o => (
                                <tr key={o.id} className="hover:bg-gray-50/60 transition-colors">
                                    <td className="px-6 py-3 font-mono font-bold text-gray-900">{o.order_code}</td>
                                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{o._date ? o._date.toLocaleDateString('pt-PT') : '—'}</td>
                                    <td className="px-4 py-3 text-gray-700">
                                        <div className="font-semibold">{o.customer_name || '—'}</div>
                                        <div className="text-xs text-gray-400">{o.email}</div>
                                    </td>
                                    <td className="px-4 py-3 text-center text-gray-600">{o._items.reduce((a, it) => a + (Number(it.quantity) || 0), 0)}</td>
                                    <td className="px-4 py-3 text-right font-bold text-gray-900 whitespace-nowrap">{eur(o.total)}</td>
                                    <td className="px-4 py-3 text-gray-500 capitalize">{o.payment_method || '—'}</td>
                                    <td className="px-6 py-3">
                                        <select value={EDITABLE_STATUSES.includes(o.status) ? o.status : ''} onChange={e => handleStatus(o.id, e.target.value)}
                                            className={`text-xs font-bold rounded-lg border px-2 py-1.5 cursor-pointer focus:outline-none ${statusMeta(o.status).cls}`}>
                                            {!EDITABLE_STATUSES.includes(o.status) && <option value="">{statusMeta(o.status).label}</option>}
                                            {EDITABLE_STATUSES.map(s => <option key={s} value={s}>{statusMeta(s).label}</option>)}
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {!loading && filtered.length === 0 && (
                        <div className="py-16 text-center">
                            <ShoppingBag size={40} className="mx-auto text-gray-300 mb-4" />
                            <p className="text-gray-500 font-semibold">Nenhum pedido encontrado.</p>
                            <p className="text-gray-400 text-sm mt-1">Ajuste os filtros ou aguarde as primeiras vendas.</p>
                        </div>
                    )}
                    {loading && <div className="py-16 text-center text-gray-400 text-sm">Carregando vendas…</div>}
                </div>
            </div>
        </div>
    );
}
