import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, Loader2, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

const API = '/api';
const COPY = {
    es: {
        confirming: 'Confirmando tu pago…', thanks: '¡Gracias por tu compra!',
        paid_desc: 'Hemos recibido tu pedido y el pago está confirmado. Te enviaremos un email con los detalles.',
        pending_title: 'Pedido recibido', pending_desc: 'Estamos confirmando tu pago. En cuanto se complete, recibirás un email de confirmación.',
        order_label: 'Número de pedido', total_label: 'Total', not_found: 'No encontramos este pedido.',
        continue: 'Seguir comprando', items_label: 'Artículos',
    },
    pt: {
        confirming: 'A confirmar o seu pagamento…', thanks: 'Obrigado pela sua compra!',
        paid_desc: 'Recebemos a sua encomenda e o pagamento está confirmado. Vamos enviar-lhe um email com os detalhes.',
        pending_title: 'Encomenda recebida', pending_desc: 'Estamos a confirmar o seu pagamento. Assim que estiver concluído, receberá um email de confirmação.',
        order_label: 'Número da encomenda', total_label: 'Total', not_found: 'Não encontramos esta encomenda.',
        continue: 'Continuar a comprar', items_label: 'Artigos',
    },
    en: {
        confirming: 'Confirming your payment…', thanks: 'Thank you for your purchase!',
        paid_desc: 'We received your order and your payment is confirmed. We will email you the details.',
        pending_title: 'Order received', pending_desc: 'We are confirming your payment. As soon as it completes, you will get a confirmation email.',
        order_label: 'Order number', total_label: 'Total', not_found: 'We could not find this order.',
        continue: 'Continue shopping', items_label: 'Items',
    },
};

export default function CheckoutSuccess() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { clearCart } = useCart();
    const { t, lang } = useLanguage();
    const c = COPY[lang] || COPY.es;
    const code = searchParams.get('order');
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const cleared = useRef(false);

    // Esvazia o carrinho uma vez (o pagamento já foi iniciado).
    useEffect(() => {
        if (!cleared.current) { clearCart(); cleared.current = true; }
    }, [clearCart]);

    // Busca o pedido e faz polling até o webhook marcar como pago (ou esgotar tentativas).
    useEffect(() => {
        if (!code) { setLoading(false); return; }
        let attempts = 0, timer = null, alive = true;
        const poll = async () => {
            try {
                const res = await fetch(`${API}/orders/${encodeURIComponent(code)}`, { cache: 'no-store' });
                const data = await res.json().catch(() => ({}));
                if (!alive) return;
                if (data.order) {
                    setOrder(data.order);
                    if (data.order.status === 'paid') { setLoading(false); return; }
                }
                setLoading(false);
            } catch { if (alive) setLoading(false); }
            attempts += 1;
            if (alive && attempts < 6 && (!order || order.status !== 'paid')) timer = setTimeout(poll, 2500);
        };
        poll();
        return () => { alive = false; if (timer) clearTimeout(timer); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [code]);

    const paid = order && order.status === 'paid';

    return (
        <div className="max-w-[680px] mx-auto px-4 sm:px-6 py-16 md:py-24">
            <div className="bg-white rounded-[32px] border border-[#F1EBE6] p-8 md:p-12 shadow-sm text-center">
                {loading && !order ? (
                    <div className="flex flex-col items-center gap-4 py-10">
                        <Loader2 size={40} className="animate-spin text-[#C4A49A]" />
                        <p className="text-[#5C534F] text-sm">{c.confirming}</p>
                    </div>
                ) : !code || (!order && !loading) ? (
                    <div className="py-8">
                        <Package size={48} className="mx-auto text-[#C4A49A] mb-6" />
                        <h1 className="text-2xl font-bold text-[#2C2826] mb-6">{c.not_found}</h1>
                        <button onClick={() => navigate('/')} className="px-8 py-3 bg-[#2C2826] text-white rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-[#C4A49A] transition-colors">
                            {c.continue}
                        </button>
                    </div>
                ) : (
                    <>
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${paid ? 'bg-[#E7F4EC]' : 'bg-[#FBF3E9]'}`}>
                            {paid ? <CheckCircle2 size={36} className="text-[#359C5F]" /> : <Loader2 size={32} className="animate-spin text-[#C4A49A]" />}
                        </div>
                        <h1 className="text-3xl font-bold text-[#2C2826] mb-3 tracking-tight">{paid ? c.thanks : c.pending_title}</h1>
                        <p className="text-[#5C534F] text-sm leading-relaxed max-w-md mx-auto mb-8">{paid ? c.paid_desc : c.pending_desc}</p>

                        {order && (
                            <div className="bg-[#FCFAF8] border border-[#F1EBE6] rounded-2xl p-6 text-left mb-8">
                                <div className="flex justify-between items-center mb-4 pb-4 border-b border-[#F1EBE6]">
                                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#8A7369]">{c.order_label}</span>
                                    <span className="text-sm font-bold text-[#2C2826] font-mono">{order.order_code}</span>
                                </div>
                                {Array.isArray(order.items) && order.items.length > 0 && (
                                    <div className="space-y-2 mb-4">
                                        {order.items.map((it, idx) => (
                                            <div key={idx} className="flex justify-between text-[13px] text-[#5C534F]">
                                                <span>{it.quantity}× {it.name}</span>
                                                <span className="font-medium">{Number(it.price * it.quantity).toFixed(2)} {t('currency')}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div className="flex justify-between items-center pt-4 border-t border-[#F1EBE6]">
                                    <span className="text-sm font-bold text-[#2C2826]">{c.total_label}</span>
                                    <span className="text-lg font-bold text-[#2C2826]">{Number(order.total).toFixed(2)} {t('currency')}</span>
                                </div>
                            </div>
                        )}

                        <button onClick={() => navigate('/')} className="px-8 py-3 bg-[#2C2826] text-white rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-[#C4A49A] transition-colors shadow-lg">
                            {c.continue}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
