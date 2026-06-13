import React, { useState, useEffect, useCallback, useRef } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { ChevronLeft, ShieldCheck, Loader2, AlertCircle, Lock } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const API = '/api';
// Mensagens do fluxo de pagamento (não existem no dicionário global).
const FLOW_MSG = {
    es: { loading: 'Cargando pago seguro…', missing: 'Completa email, nombre, dirección, código postal y ciudad.', generic: 'No se pudo iniciar el pago. Inténtalo de nuevo.', empty: 'Tu carrito está vacío.', canceled: 'Pago cancelado. Tu carrito sigue intacto, puedes intentarlo de nuevo.', pay_title: 'Pago', pay_note: 'El pago se procesa de forma segura aquí mismo (tarjeta, Bizum, Klarna, Multibanco). No sales de la tienda.', continue: 'Continuar al pago', edit: '← Editar mis datos', not_configured: 'El pago no está disponible en este momento. Inténtalo más tarde.' },
    pt: { loading: 'A carregar o pagamento seguro…', missing: 'Preencha email, nome, morada, código postal e cidade.', generic: 'Não foi possível iniciar o pagamento. Tente de novo.', empty: 'O seu carrinho está vazio.', canceled: 'Pagamento cancelado. O seu carrinho continua intacto, pode tentar de novo.', pay_title: 'Pagamento', pay_note: 'O pagamento é processado em segurança aqui mesmo (cartão, Bizum, Klarna, Multibanco, MB WAY). Você não sai da loja.', continue: 'Continuar para pagamento', edit: '← Editar os meus dados', not_configured: 'O pagamento não está disponível neste momento. Tente mais tarde.' },
    en: { loading: 'Loading secure payment…', missing: 'Please fill in email, name, address, ZIP code and city.', generic: 'Could not start the payment. Please try again.', empty: 'Your cart is empty.', canceled: 'Payment canceled. Your cart is intact, you can try again.', pay_title: 'Payment', pay_note: 'Payment is processed securely right here (card, Bizum, Klarna, Multibanco). You never leave the store.', continue: 'Continue to payment', edit: '← Edit my details', not_configured: 'Payment is not available right now. Please try again later.' },
};

const itemPrice = (p) => (typeof p === 'string' ? parseFloat(p.replace(',', '.')) : Number(p)) || 0;

export default function Checkout() {
    const { cartItems } = useCart();
    const { t, lang } = useLanguage();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const msg = FLOW_MSG[lang] || FLOW_MSG.es;
    const [saveInfo, setSaveInfo] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [showCheckout, setShowCheckout] = useState(false);
    const [stripePromise, setStripePromise] = useState(null);
    const [sessionKey, setSessionKey] = useState(0); // força remontar o checkout ao reabrir
    const [shipping, setShipping] = useState(0);
    const stripeRef = useRef(null);
    const pubKeyRef = useRef(null);
    const canceled = searchParams.get('canceled') === '1';
    const [formData, setFormData] = useState({
        email: '', firstName: '', lastName: '', address: '', zip: '', city: ''
    });

    // Carrega dados salvos
    useEffect(() => {
        const saved = localStorage.getItem('beauthe_checkout_info');
        if (saved) {
            try { const parsed = JSON.parse(saved); setFormData(parsed.formData || {}); setSaveInfo(true); } catch { /* ignore */ }
        }
    }, []);

    // Persiste dados quando "guardar" está ligado
    useEffect(() => {
        if (saveInfo) localStorage.setItem('beauthe_checkout_info', JSON.stringify({ formData }));
        else localStorage.removeItem('beauthe_checkout_info');
    }, [formData, saveInfo]);

    const handleInputChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

    // Config pública do checkout (publishable key + frete) — uma vez ao montar.
    useEffect(() => {
        let alive = true;
        fetch(`${API}/checkout/config`).then(r => r.json()).then(cfg => {
            if (!alive) return;
            setShipping(Number(cfg.shipping) || 0);
            pubKeyRef.current = cfg.publishableKey || null;
        }).catch(() => {});
        return () => { alive = false; };
    }, []);

    // Carrega o Stripe.js com a publishable key vinda do backend.
    const ensureStripe = async () => {
        if (stripeRef.current) return stripeRef.current;
        let pk = pubKeyRef.current;
        if (!pk) { const cfg = await fetch(`${API}/checkout/config`).then(r => r.json()).catch(() => ({})); pk = cfg.publishableKey; }
        if (!pk) return null;
        stripeRef.current = loadStripe(pk);
        return stripeRef.current;
    };

    // O EmbeddedCheckoutProvider chama isto para criar a sessão e obter o client_secret.
    const fetchClientSecret = useCallback(async () => {
        const res = await fetch(`${API}/checkout/create-session`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                lang,
                items: cartItems.map((i) => ({ id: i.id, quantity: i.quantity })),
                customer: {
                    email: formData.email, firstName: formData.firstName, lastName: formData.lastName,
                    address: formData.address, zip: formData.zip, city: formData.city,
                    country: lang === 'pt' ? 'PT' : 'ES',
                },
            }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.client_secret) throw new Error(data.error || msg.generic);
        return data.client_secret;
    }, [cartItems, formData, lang, msg.generic]);

    const handleContinue = async () => {
        setErrorMsg('');
        if (!cartItems.length) { setErrorMsg(msg.empty); return; }
        const required = ['email', 'firstName', 'address', 'zip', 'city'];
        if (required.some((f) => !String(formData[f] || '').trim())) { setErrorMsg(msg.missing); return; }
        setProcessing(true);
        try {
            const sp = await ensureStripe();
            if (!sp) { setErrorMsg(msg.not_configured); setProcessing(false); return; }
            setStripePromise(sp);
            setSessionKey((k) => k + 1);
            setShowCheckout(true);
        } catch {
            setErrorMsg(msg.generic);
        } finally {
            setProcessing(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
                <h2 className="text-3xl font-light text-[#2C2826] mb-6">{t('checkout.empty_cart')}</h2>
                <button onClick={() => navigate('/')} className="px-8 py-3 bg-[#2C2826] text-white rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-[#C4A49A] transition-colors shadow-lg">
                    {t('checkout.continue_shopping')}
                </button>
            </div>
        );
    }

    const subtotal = cartItems.reduce((sum, it) => sum + itemPrice(it.price) * (Number(it.quantity) || 0), 0);
    const total = subtotal + (Number(shipping) || 0);

    return (
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#8A7369] hover:text-[#2C2826] transition-colors mb-10 group"
            >
                <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                {t('checkout.back_to_cart')}
            </button>

            {canceled && (
                <div className="mb-8 flex items-start gap-2 rounded-2xl bg-[#FBF3E9] border border-[#E9D7C1] px-5 py-4 text-[13px] text-[#8A6A3B] font-medium">
                    <AlertCircle size={18} className="shrink-0 mt-0.5" />
                    <span>{msg.canceled}</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                {/* Left Column: Forms */}
                <div className="lg:col-span-7 space-y-12">
                    <section>
                        <h2 className="text-3xl font-bold text-[#2C2826] tracking-tight mb-8">
                            {t('checkout.shipping_address')}
                        </h2>
                        <fieldset disabled={showCheckout} className={showCheckout ? 'opacity-60' : ''}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-[11px] font-bold uppercase tracking-widest text-[#8A7369] mb-2">{t('checkout.fields.email')}</label>
                                    <input type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} className="w-full bg-white border border-[#F1EBE6] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C4A49A] transition-colors" placeholder="email@example.com" />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold uppercase tracking-widest text-[#8A7369] mb-2">{t('checkout.fields.first_name')}</label>
                                    <input type="text" value={formData.firstName} onChange={(e) => handleInputChange('firstName', e.target.value)} className="w-full bg-white border border-[#F1EBE6] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C4A49A] transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold uppercase tracking-widest text-[#8A7369] mb-2">{t('checkout.fields.last_name')}</label>
                                    <input type="text" value={formData.lastName} onChange={(e) => handleInputChange('lastName', e.target.value)} className="w-full bg-white border border-[#F1EBE6] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C4A49A] transition-colors" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-[11px] font-bold uppercase tracking-widest text-[#8A7369] mb-2">{t('checkout.fields.address')}</label>
                                    <input type="text" value={formData.address} onChange={(e) => handleInputChange('address', e.target.value)} className="w-full bg-white border border-[#F1EBE6] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C4A49A] transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold uppercase tracking-widest text-[#8A7369] mb-2">{t('checkout.fields.zip')}</label>
                                    <input type="text" value={formData.zip} onChange={(e) => handleInputChange('zip', e.target.value)} className="w-full bg-white border border-[#F1EBE6] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C4A49A] transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold uppercase tracking-widest text-[#8A7369] mb-2">{t('checkout.fields.city')}</label>
                                    <input type="text" value={formData.city} onChange={(e) => handleInputChange('city', e.target.value)} className="w-full bg-white border border-[#F1EBE6] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C4A49A] transition-colors" />
                                </div>
                            </div>

                            <div className="mt-8 flex items-center gap-3">
                                <button type="button" onClick={() => setSaveInfo(!saveInfo)} className={`w-12 h-6 rounded-full transition-colors relative ${saveInfo ? 'bg-[#C4A49A]' : 'bg-[#EBE1DA]'}`}>
                                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${saveInfo ? 'translate-x-6' : ''}`} />
                                </button>
                                <span className="text-[13px] text-[#5C534F] font-medium">{t('checkout.save_info')}</span>
                            </div>
                        </fieldset>
                    </section>

                    <section>
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-bold text-[#2C2826] tracking-tight">{msg.pay_title}</h2>
                            {showCheckout && (
                                <button type="button" onClick={() => setShowCheckout(false)} className="text-[11px] font-bold uppercase tracking-widest text-[#8A7369] hover:text-[#2C2826] transition-colors">
                                    {msg.edit}
                                </button>
                            )}
                        </div>

                        {!showCheckout ? (
                            <div className="flex items-start gap-3 rounded-2xl border border-dashed border-[#E4D8D0] bg-[#FCFAF8] px-5 py-5 text-[13px] text-[#5C534F] leading-relaxed">
                                <Lock size={18} className="shrink-0 mt-0.5 text-[#C4A49A]" />
                                <span>{msg.pay_note}</span>
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-[#F1EBE6] bg-white p-2 md:p-4 min-h-[300px]">
                                {stripePromise && (
                                    <EmbeddedCheckoutProvider key={sessionKey} stripe={stripePromise} options={{ fetchClientSecret }}>
                                        <EmbeddedCheckout />
                                    </EmbeddedCheckoutProvider>
                                )}
                            </div>
                        )}
                    </section>
                </div>

                {/* Right Column: Order Summary */}
                <div className="lg:col-span-5">
                    <div className="bg-white rounded-[32px] border border-[#F1EBE6] p-8 md:p-10 sticky top-[160px] shadow-sm">
                        <h3 className="text-xl font-bold text-[#2C2826] mb-8 pb-4 border-b border-[#F1EBE6]">
                            {t('checkout.order_summary')}
                        </h3>

                        <div className="space-y-6 mb-10 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex gap-4">
                                    <div className="w-20 h-20 rounded-xl bg-[#FCFAF8] border border-[#F1EBE6] p-2 shrink-0">
                                        <img src={item.image_url || item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <h4 className="text-[13px] font-bold text-[#2C2826] leading-tight mb-1 uppercase tracking-tight">{item.name}</h4>
                                        <p className="text-[11px] text-[#8A7369] uppercase font-bold tracking-widest">{item.quantity} x {itemPrice(item.price).toFixed(2)} {t('currency')}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4 mb-10 pt-6 border-t border-[#F1EBE6]">
                            <div className="flex justify-between text-sm text-[#8A7369]">
                                <span>{t('cart.subtotal')}</span>
                                <span>{subtotal.toFixed(2)} {t('currency')}</span>
                            </div>
                            <div className="flex justify-between text-sm text-[#8A7369]">
                                <span>{t('cart.shipping')}</span>
                                {shipping > 0
                                    ? <span>{shipping.toFixed(2)} {t('currency')}</span>
                                    : <span className="text-[#359C5F] font-bold uppercase tracking-widest text-[10px]">{t('checkout.free_shipping')}</span>}
                            </div>
                            <div className="flex justify-between text-xl font-bold text-[#2C2826] pt-4 border-t border-[#F1EBE6]">
                                <span>{t('cart.total')}</span>
                                <span>{total.toFixed(2)} {t('currency')}</span>
                            </div>
                        </div>

                        {errorMsg && (
                            <div className="mb-4 flex items-start gap-2 rounded-xl bg-[#FBEDEA] border border-[#E9C9C1] px-4 py-3 text-[12px] text-[#9B3B2A] font-medium">
                                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                                <span>{errorMsg}</span>
                            </div>
                        )}

                        {!showCheckout && (
                            <button
                                onClick={handleContinue}
                                disabled={processing}
                                className="w-full bg-[#2C2826] text-white rounded-2xl py-5 text-[13px] font-bold uppercase tracking-widest hover:bg-[#C4A49A] transition-all shadow-2xl flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {processing ? <><Loader2 size={18} className="animate-spin" /> {msg.loading}</> : <><ShieldCheck size={18} /> {msg.continue}</>}
                            </button>
                        )}

                        <p className="text-center text-[10px] text-[#A69B97] mt-4 leading-relaxed opacity-80 uppercase tracking-widest font-bold">
                            {t('checkout.secure')} <br /> {t('checkout.returns_guarantee')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
