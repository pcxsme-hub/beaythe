import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Star, Shield, Leaf, Check, Info, ArrowRight, Sparkles, Maximize2, Beaker, Gift, Lightbulb, Plus, Minus, Droplets, Wind } from 'lucide-react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { useLanguage } from '../context/LanguageContext';
import TrendingProducts from '../components/TrendingProducts';
import { PRODUCT_LANDING_DATA } from '../data/productLandingPages';
import { getProducts } from '../admin/services/db';

export default function Producto() {
    const { id } = useParams();
    const { addToCart } = useCart();
    const navigate = useNavigate();
    const { toggleFavorite, isFavorite } = useFavorites();
    const { t, translateProduct } = useLanguage();
    const [activeAccordion, setActiveAccordion] = useState('description');
    const [liveProduct, setLiveProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const all = await getProducts();
            const found = all.find(p => p.id.toString() === id);
            if (found) setLiveProduct(translateProduct(found));
            setLoading(false);
        };
        load();
    }, [id, translateProduct]);


    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);

    const parseSecondaryImages = (raw) => {
        if (!raw) return [];
        if (Array.isArray(raw)) return raw;
        try { const v = JSON.parse(raw); return Array.isArray(v) ? v : []; } catch { return []; }
    };

    const product = liveProduct ? {
        ...liveProduct,
        images: [liveProduct.image_url, ...parseSecondaryImages(liveProduct.secondary_images)].filter(Boolean)
    } : null;

    let theme = PRODUCT_LANDING_DATA[99];
    if (product) {
        if (product.landing_page_data) {
            const dbLP = product.landing_page_data;
            theme = {
                ...theme,
                ...dbLP,
                marketing: { ...theme.marketing, ...(dbLP.marketing || {}) },
                landingPage: { ...theme.landingPage, ...(dbLP.landingPage || {}) }
            };
        } else if (PRODUCT_LANDING_DATA[product.dropea_id || product.id]) {
            theme = PRODUCT_LANDING_DATA[product.dropea_id || product.id];
        }
    }

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#FCFAF8]">
            <div className="w-12 h-12 border-4 border-[#F1EBE6] border-t-[#C4A49A] rounded-full animate-spin"></div>
        </div>
    );

    if (!product) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FCFAF8] gap-6 text-center px-4">
            <h1 className="text-3xl font-light text-[#2C2826]">{t('product.not_found')}</h1>
            <p className="text-[#8A7369]">{t('product.not_found_desc')}</p>
            <Link to="/" className="bg-[#2C2826] text-white px-8 py-4 rounded-xl text-[12px] font-bold uppercase tracking-widest">{t('common.home')}</Link>
        </div>
    );

    const safePrice = Number(product.manual_price || product.price || 0);

    return (
        <div className="bg-white min-h-screen overflow-hidden">
            {/* 1. Compact Hero Section */}
            <section className="pt-24 md:pt-32 pb-12 px-4 md:px-8 max-w-[1440px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-20 items-start">

                    {/* Left Column: Image Gallery */}
                    <div className="lg:col-span-7 flex flex-col md:flex-row gap-6 lg:sticky lg:top-32">
                        {/* Thumbnails (Vertical on Desktop) */}
                        <div className="order-2 md:order-1 flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto no-scrollbar">
                            {product.images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImage(idx)}
                                    className={`relative w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 ${selectedImage === idx ? 'border-black' : 'border-gray-100 hover:border-gray-300'}`}
                                >
                                    <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>

                        {/* Main Image */}
                        <div className="order-1 md:order-2 flex-1 relative aspect-square bg-[#F9F7F5] rounded-[40px] overflow-hidden group">
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={selectedImage}
                                    initial={{ opacity: 0, scale: 1.1 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                    src={product.images[selectedImage]}
                                    alt={product.name}
                                    className="w-full h-full object-contain mix-blend-multiply p-4 md:p-6"
                                />
                            </AnimatePresence>

                            <div className="absolute top-6 left-6">
                                <span className="bg-black text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                                    {product.brand}
                                </span>
                            </div>

                            <button className="absolute bottom-6 right-6 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-gray-900 border border-white hover:bg-white transition-all shadow-xl">
                                <Maximize2 size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Info & Action */}
                    <div className="lg:col-span-5 flex flex-col pt-4">
                        <div className="border-b border-gray-100 pb-8 mb-8">
                            <div className="flex items-center gap-1 mb-4">
                                {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-black text-black" />)}
                                <span className="text-[11px] font-bold text-gray-500 ml-2 uppercase tracking-widest">{t('product.reviews_count')}</span>
                            </div>

                            <h1 className={`text-4xl md:text-5xl font-light text-[#2C2826] tracking-tight leading-[1.1] mb-6 ${theme.font || ''}`}>
                                {product.name}
                            </h1>

                            <div className="flex items-baseline gap-4 mb-6">
                                <span className="text-3xl font-bold text-[#2C2826]">{safePrice.toFixed(2)} {t('currency')}</span>
                            </div>

                            <p className="text-gray-500 text-sm leading-relaxed mb-8 flex items-center gap-2">
                                <Shield size={16} className="text-green-600" /> {t('product.in_stock')} • {t('product.free_shipping_50')}
                            </p>

                            {/* Main CTAs */}
                            <div className="flex flex-col gap-4">
                                <div className="flex gap-4">
                                    <div className="flex items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3">
                                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-1 hover:text-rose-500"><Minus size={18} /></button>
                                        <input type="number" value={quantity} readOnly className="w-12 text-center bg-transparent font-bold text-gray-900 outline-none" />
                                        <button onClick={() => setQuantity(quantity + 1)} className="p-1 hover:text-rose-300 transition-colors"><Plus size={18} /></button>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => addToCart({ ...product, quantity })}
                                        className="flex-1 bg-[#2C2826] text-white py-4 rounded-2xl text-[12px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl shadow-black/10"
                                    >
                                        <ShoppingBag size={18} />
                                        {t('product.add_to_cart')}
                                    </motion.button>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02, backgroundColor: theme?.primary || '#2C2826' }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => { addToCart({ ...product, quantity }); navigate('/checkout'); }}
                                    className="w-full border-2 border-[#2C2826] text-[#2C2826] py-5 rounded-2xl text-[12px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-colors hover:bg-[#2C2826] hover:text-white"
                                >
                                    {t('common.buy_now')}
                                    <ArrowRight size={18} />
                                </motion.button>
                            </div>
                        </div>

                        {/* Integration of Specs in Accordions HERE for compactness */}
                        <div className="space-y-1">
                            {['description', 'usage', 'ingredients', 'shipping'].map((key) => (
                                <div key={key} className="border-b border-gray-100 last:border-0">
                                    <button
                                        className="w-full flex items-center justify-between py-5 text-left group"
                                        onClick={() => setActiveAccordion(activeAccordion === key ? '' : key)}
                                    >
                                        <span className="text-[13px] font-bold text-gray-900 uppercase tracking-widest flex items-center gap-4">
                                            {key === 'description' && <Info size={18} className="text-gray-400" />}
                                            {key === 'usage' && <Sparkles size={18} className="text-gray-400" />}
                                            {key === 'ingredients' && <Beaker size={18} className="text-gray-400" />}
                                            {key === 'shipping' && <Shield size={18} className="text-gray-400" />}
                                            {key === 'description' ? t('common.description') :
                                                key === 'usage' ? t('product.usage') :
                                                    key === 'ingredients' ? t('common.composition') :
                                                        t('product.shipping_title')}
                                        </span>
                                        <Plus size={16} className={`text-gray-400 transition-transform ${activeAccordion === key ? 'rotate-45' : ''}`} />
                                    </button>
                                    <motion.div
                                        initial={false}
                                        animate={{ height: activeAccordion === key ? 'auto' : 0, opacity: activeAccordion === key ? 1 : 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div
                                            className="pb-6 text-[14px] text-gray-500 font-light leading-relaxed px-1"
                                            dangerouslySetInnerHTML={{
                                                __html: key === 'description' ? (product.description || t('product.description_fallback')) :
                                                    key === 'usage' ? (theme?.landingPage?.expertTips?.tips?.[0]?.text || t('product.usage_fallback')) :
                                                        key === 'ingredients' ? t('product.ingredients_fallback') :
                                                            t('product.shipping_fallback')
                                            }}
                                        />
                                    </motion.div>
                                </div>
                            ))}
                        </div>

                        {/* Benefit Icons Compact */}
                        <div className="mt-10 grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <Leaf size={20} className="text-green-600" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">{t('product.vegan_badge')}</span>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <Shield size={20} className="text-blue-600" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">{t('product.dermatologically_tested')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Dynamic Landing Page Section (Exclusive Per Product) */}
            <section className="bg-white py-24 px-4 border-t border-gray-100">
                <div className="max-w-[1200px] mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative rounded-[40px] overflow-hidden aspect-[4/3] flex items-center justify-center group shadow-2xl bg-[#FCFAF8]"
                            style={{ backgroundColor: theme.bg || '#FCFAF8' }}
                        >
                            {/* The Single Product Image (Filling margins) */}
                            <img
                                src={product.image_url || "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80"}
                                alt={product.name}
                                className="w-full h-full object-cover mix-blend-multiply opacity-95 transition-transform duration-1000 group-hover:scale-105"
                            />

                            {/* Overlay Pills - Safely on top */}
                            <div className="absolute inset-y-0 right-4 md:right-8 flex flex-col justify-center gap-3 z-30">
                                {(theme?.landingPage?.formulation?.ingredients || [
                                    { name: t('product.feature_light_texture') }, { name: t('product.feature_thin') }, { name: t('product.feature_soft_focus') }, { name: t('product.feature_water_resistant') }
                                ]).slice(0, 4).map((ing, idx) => (
                                    <div key={idx} className="bg-white/95 backdrop-blur-md border border-[#EBE1DA] px-6 py-3 rounded-full text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-[#2C2826] shadow-[0_10px_30px_rgba(0,0,0,0.1)] transform translate-x-8 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-700 hover:bg-[#2C2826] hover:text-white cursor-default" style={{ transitionDelay: `${idx * 150}ms` }}>
                                        {ing.name}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                        <div className="space-y-10">
                            <div>
                                <span className="text-[12px] font-black uppercase tracking-[0.3em] text-[#C4A49A] mb-4 block">{t('product.benefits')}</span>
                                <h2 className={`text-4xl lg:text-5xl font-normal text-[#2C2826] tracking-tight leading-[1.1] mb-6 ${theme?.font || ''}`}>
                                    {theme?.landingPage?.solution?.headline || t('product.benefits_headline')}
                                </h2>
                                <p className="text-[#5C534F] text-lg font-light leading-relaxed">
                                    {theme?.landingPage?.problem?.description || t('product.benefits_desc')}
                                </p>
                            </div>

                            {/* Icon Strip */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-[#F1EBE6]">
                                {(theme?.landingPage?.solution?.benefits || [
                                    { title: t('product.benefit_vegan'), icon: Leaf },
                                    { title: t('product.benefit_cruelty_free'), icon: Shield },
                                    { title: t('product.benefit_no_parabens'), icon: Sparkles },
                                    { title: t('product.benefit_no_fragrance'), icon: Wind }
                                ]).map((benefit, idx) => {
                                    const Icon = benefit.icon || Beaker;
                                    return (
                                        <div key={idx} className="flex flex-col items-center text-center gap-4 group">
                                            <div className="w-16 h-16 rounded-full bg-[#FCFAF8] border border-[#EBE1DA] flex items-center justify-center text-[#2C2826] group-hover:bg-[#2C2826] group-hover:text-white transition-colors duration-300 shadow-sm">
                                                <Icon size={24} strokeWidth={1.5} />
                                            </div>
                                            <span className="text-[11px] font-bold uppercase tracking-widest text-[#5C534F] group-hover:text-[#2C2826]">
                                                {benefit.title}
                                            </span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Recommended Products */}
            <TrendingProducts overrideTitle={t('product.recommended')} removePadding={false} recommendedIds={product.recommended_products} />
        </div>
    );
}
