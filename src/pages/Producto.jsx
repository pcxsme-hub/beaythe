import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Star, Shield, Leaf, Check, Info, ArrowRight, Sparkles, Maximize2, Beaker, Gift, Lightbulb, Plus, Minus, Droplets, Wind, Truck, Lock, RotateCcw, Heart, Share2, Award } from 'lucide-react';
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

                    {/* Left Column: Image Gallery + secondary visuals to fill the space when right column is taller */}
                    <div className="lg:col-span-7">
                        <div className="flex flex-col md:flex-row gap-6 lg:sticky lg:top-32">
                            {/* Thumbnails (Vertical on Desktop) */}
                            <div className="order-2 md:order-1 flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto no-scrollbar">
                                {product.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`relative w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 ${selectedImage === idx ? 'border-[#2C2826]' : 'border-[#F1EBE6] hover:border-[#C4A49A]'}`}
                                    >
                                        <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>

                            {/* Main Image */}
                            <div className="order-1 md:order-2 flex-1 relative aspect-square bg-gradient-to-br from-[#FCFAF8] to-[#F4EFEA] rounded-[40px] overflow-hidden group">
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
                                    <span className="bg-[#2C2826] text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                                        {product.brand}
                                    </span>
                                </div>

                                <button className="absolute bottom-6 right-6 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-[#2C2826] border border-white hover:bg-white transition-all shadow-xl">
                                    <Maximize2 size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Secondary visual stack — fills the empty space below the gallery
                            when the right column extends beyond the image. Hidden on mobile. */}
                        <div className="hidden lg:flex flex-col gap-6 mt-8">
                            {/* Lifestyle / texture image (uses landing engine marketing data) */}
                            {(theme?.marketing?.lifestyle || theme?.marketing?.texture || product.images?.[1]) && (
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.7 }}
                                    className="relative aspect-[16/10] rounded-[40px] overflow-hidden group"
                                >
                                    <img
                                        src={theme?.marketing?.lifestyle || theme?.marketing?.texture || product.images?.[1] || product.image_url}
                                        alt=""
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#2C2826]/70 via-[#2C2826]/10 to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 right-0 p-8">
                                        <span className="text-[10px] font-bold tracking-[0.3em] text-white/70 uppercase block mb-2">
                                            {t('product.craft_tag')}
                                        </span>
                                        <p className="text-white text-2xl font-light leading-tight max-w-md">
                                            {theme?.landingPage?.solution?.headline || product.name}
                                        </p>
                                    </div>
                                </motion.div>
                            )}

                            {/* Claims grid — premium badges using engine data */}
                            {Array.isArray(theme?.claims) && theme.claims.length > 0 && (
                                <div className="grid grid-cols-2 gap-3">
                                    {theme.claims.slice(0, 4).map((claim, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 10 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: i * 0.05 }}
                                            className="bg-white border border-[#F1EBE6] rounded-2xl p-5 flex items-center gap-4 hover:border-[#C4A49A] hover:shadow-[0_8px_24px_rgba(196,164,154,0.1)] transition-all"
                                        >
                                            <span className="w-10 h-10 rounded-full bg-[#F4EFEA] flex items-center justify-center text-[#C4A49A] flex-shrink-0">
                                                <Check size={18} strokeWidth={2.2} />
                                            </span>
                                            <span className="text-[12px] font-bold text-[#2C2826] uppercase tracking-[0.1em] leading-tight">
                                                {claim}
                                            </span>
                                        </motion.div>
                                    ))}
                                </div>
                            )}

                            {/* Ingredient highlight card */}
                            {Array.isArray(theme?.landingPage?.formulation?.ingredients) && theme.landingPage.formulation.ingredients.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6 }}
                                    className="bg-gradient-to-br from-[#2C2826] to-[#1a1714] rounded-[32px] p-8 text-white"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <Beaker size={20} className="text-[#C4A49A]" strokeWidth={1.5} />
                                        <span className="text-[10px] font-bold tracking-[0.3em] text-[#C4A49A] uppercase">
                                            {t('product.formulation_tag')}
                                        </span>
                                    </div>
                                    <p className="text-xl font-light leading-snug mb-6 text-white/90">
                                        {theme?.landingPage?.formulation?.title || theme?.landingPage?.problem?.headline}
                                    </p>
                                    <ul className="space-y-2">
                                        {theme.landingPage.formulation.ingredients.slice(0, 5).map((ing, i) => (
                                            <li key={i} className="flex items-center gap-3 text-[13px] text-white/75">
                                                <span className="w-1 h-1 rounded-full bg-[#C4A49A]"></span>
                                                <span className="font-medium">{ing.name}</span>
                                                {ing.benefit && <span className="text-white/40">— {ing.benefit}</span>}
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Info & Action */}
                    <div className="lg:col-span-5 flex flex-col pt-2">
                        {/* Brand pill + Wishlist/Share */}
                        <div className="flex items-center justify-between mb-5">
                            <span className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.3em] text-[#C4A49A] uppercase">
                                <span className="w-6 h-px bg-[#C4A49A]" />
                                {product.brand || 'Beauthé'}
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => toggleFavorite(product)}
                                    aria-label={t('common.favorites')}
                                    className={`w-10 h-10 rounded-full border border-[#F1EBE6] flex items-center justify-center transition-colors ${isFavorite(product.id) ? 'bg-[#C4A49A] text-white border-[#C4A49A]' : 'bg-white text-[#5C534F] hover:border-[#C4A49A] hover:text-[#C4A49A]'}`}
                                >
                                    <Heart size={16} strokeWidth={1.5} fill={isFavorite(product.id) ? 'currentColor' : 'none'} />
                                </button>
                                <button
                                    aria-label="Share"
                                    onClick={() => navigator?.share?.({ title: product.name, url: window.location.href }).catch(() => {})}
                                    className="w-10 h-10 rounded-full border border-[#F1EBE6] bg-white flex items-center justify-center text-[#5C534F] hover:border-[#C4A49A] hover:text-[#C4A49A] transition-colors"
                                >
                                    <Share2 size={16} strokeWidth={1.5} />
                                </button>
                            </div>
                        </div>

                        {/* Reviews row */}
                        <div className="flex items-center gap-3 mb-5">
                            <div className="flex items-center gap-0.5 text-[#C4A49A]">
                                {[...Array(5)].map((_, i) => <Star key={i} size={15} strokeWidth={1.5} className="fill-[#C4A49A]" />)}
                            </div>
                            <span className="text-[11px] font-bold text-[#8A7369] uppercase tracking-[0.2em]">
                                {t('product.reviews_count')}
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className={`text-3xl md:text-4xl lg:text-5xl font-light text-[#2C2826] tracking-tight leading-[1.05] mb-6 ${theme?.font || ''}`}>
                            {product.name}
                        </h1>

                        {/* Premium Price block */}
                        <div className="bg-gradient-to-br from-[#FCFAF8] to-[#F4EFEA] border border-[#F1EBE6] rounded-3xl p-6 mb-6 shadow-[0_4px_20px_rgba(196,164,154,0.08)]">
                            <div className="flex items-baseline gap-2">
                                <span className="text-[44px] md:text-[56px] font-light text-[#2C2826] leading-none tracking-tight">
                                    {safePrice.toFixed(2).split('.')[0]}
                                </span>
                                <span className="text-2xl text-[#2C2826] font-light leading-none">,{safePrice.toFixed(2).split('.')[1]}</span>
                                <span className="text-lg text-[#8A7369] font-light ml-1">{t('currency')}</span>
                            </div>
                            <div className="flex items-center gap-3 mt-3 text-[11px] uppercase tracking-[0.2em] font-bold text-[#5C534F]">
                                <span className="inline-flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    {t('product.in_stock')}
                                </span>
                                <span className="text-[#EBE1DA]">|</span>
                                <span className="inline-flex items-center gap-1.5 text-[#C4A49A]">
                                    <Truck size={13} strokeWidth={1.5} />
                                    {t('product.free_shipping_50')}
                                </span>
                            </div>
                        </div>

                        {/* Trust strip — visual badges */}
                        <div className="grid grid-cols-4 gap-2 mb-8">
                            {[
                                { icon: Truck, label: 'product.trust.shipping' },
                                { icon: RotateCcw, label: 'product.trust.returns' },
                                { icon: Leaf, label: 'product.trust.vegan' },
                                { icon: Award, label: 'product.trust.tested' }
                            ].map(({ icon: Icon, label }) => (
                                <div key={label} className="flex flex-col items-center text-center gap-2 p-3 bg-white border border-[#F1EBE6] rounded-2xl hover:border-[#C4A49A] hover:shadow-[0_4px_12px_rgba(196,164,154,0.1)] transition-all">
                                    <div className="w-10 h-10 rounded-full bg-[#F4EFEA] flex items-center justify-center text-[#C4A49A]">
                                        <Icon size={18} strokeWidth={1.5} />
                                    </div>
                                    <span className="text-[9px] font-bold text-[#5C534F] uppercase tracking-[0.1em] leading-tight">{t(label)}</span>
                                </div>
                            ))}
                        </div>

                        {/* CTAs — quantity + add + buy now */}
                        <div className="flex flex-col gap-3 mb-8">
                            <div className="flex gap-3">
                                <div className="flex items-center bg-white border border-[#F1EBE6] rounded-2xl px-2 py-1 shadow-sm">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        aria-label="Decrease quantity"
                                        className="w-10 h-10 rounded-xl flex items-center justify-center text-[#5C534F] hover:text-[#2C2826] hover:bg-[#F4EFEA] transition-colors"
                                    >
                                        <Minus size={16} strokeWidth={1.8} />
                                    </button>
                                    <input
                                        type="number"
                                        value={quantity}
                                        readOnly
                                        className="w-10 text-center bg-transparent font-bold text-[#2C2826] text-[15px] outline-none"
                                    />
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        aria-label="Increase quantity"
                                        className="w-10 h-10 rounded-xl flex items-center justify-center text-[#5C534F] hover:text-[#2C2826] hover:bg-[#F4EFEA] transition-colors"
                                    >
                                        <Plus size={16} strokeWidth={1.8} />
                                    </button>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => addToCart({ ...product, quantity })}
                                    className="flex-1 bg-[#2C2826] text-white py-4 rounded-2xl text-[11px] font-bold uppercase tracking-[0.25em] flex items-center justify-center gap-3 shadow-xl shadow-[#2C2826]/15 hover:bg-black transition-colors"
                                >
                                    <ShoppingBag size={16} strokeWidth={1.8} />
                                    {t('product.add_to_cart')}
                                </motion.button>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => { addToCart({ ...product, quantity }); navigate('/checkout'); }}
                                className="w-full bg-gradient-to-r from-[#C4A49A] to-[#B89289] text-white py-4 rounded-2xl text-[11px] font-bold uppercase tracking-[0.25em] flex items-center justify-center gap-3 shadow-lg shadow-[#C4A49A]/30 hover:shadow-xl hover:shadow-[#C4A49A]/40 transition-shadow"
                            >
                                {t('common.buy_now')}
                                <ArrowRight size={16} strokeWidth={1.8} />
                            </motion.button>

                            {/* Secure payment line */}
                            <div className="flex items-center justify-center gap-2 mt-2 text-[10px] font-bold text-[#A69B97] uppercase tracking-[0.2em]">
                                <Lock size={12} strokeWidth={1.8} />
                                {t('checkout.secure')}
                            </div>
                        </div>

                        {/* Accordions — premium typography */}
                        <div className="space-y-0 border-y border-[#F1EBE6]">
                            {['description', 'usage', 'ingredients', 'shipping'].map((key, idx) => {
                                const isOpen = activeAccordion === key;
                                const Icon = key === 'description' ? Info : key === 'usage' ? Sparkles : key === 'ingredients' ? Beaker : Truck;
                                const label = key === 'description' ? t('common.description') : key === 'usage' ? t('product.usage') : key === 'ingredients' ? t('common.composition') : t('product.shipping_title');
                                const html = key === 'description' ? (product.description || t('product.description_fallback')) :
                                    key === 'usage' ? (theme?.landingPage?.expertTips?.tips?.[0]?.text || t('product.usage_fallback')) :
                                    key === 'ingredients' ? t('product.ingredients_fallback') :
                                    t('product.shipping_fallback');
                                return (
                                    <div key={key} className={`${idx !== 0 ? 'border-t border-[#F1EBE6]' : ''}`}>
                                        <button
                                            className="w-full flex items-center justify-between py-5 text-left group"
                                            onClick={() => setActiveAccordion(isOpen ? '' : key)}
                                        >
                                            <span className="flex items-center gap-4">
                                                <span className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-[#2C2826] text-white' : 'bg-[#F4EFEA] text-[#C4A49A] group-hover:bg-[#EBE1DA]'}`}>
                                                    <Icon size={15} strokeWidth={1.6} />
                                                </span>
                                                <span className={`text-[12px] font-bold uppercase tracking-[0.2em] transition-colors ${isOpen ? 'text-[#2C2826]' : 'text-[#5C534F] group-hover:text-[#2C2826]'}`}>
                                                    {label}
                                                </span>
                                            </span>
                                            <span className={`w-8 h-8 rounded-full border border-[#F1EBE6] flex items-center justify-center transition-all ${isOpen ? 'rotate-45 bg-[#2C2826] border-[#2C2826] text-white' : 'text-[#8A7369]'}`}>
                                                <Plus size={14} strokeWidth={1.8} />
                                            </span>
                                        </button>
                                        <AnimatePresence initial={false}>
                                            {isOpen && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
                                                    className="overflow-hidden"
                                                >
                                                    <div
                                                        className="pb-6 pl-13 pr-2 product-prose text-[14px] text-[#5C534F] font-light leading-[1.75]"
                                                        dangerouslySetInnerHTML={{ __html: html }}
                                                    />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })}
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

            {/* 3. Kit Recomendado (auto-generated by landing engine) */}
            {Array.isArray(product.upsell_kits) && product.upsell_kits[0] && product.upsell_kits[0].items?.length > 1 && (
                <section className="bg-[#FCFAF8] py-20 px-4 border-t border-[#F1EBE6]">
                    <div className="max-w-[1200px] mx-auto">
                        <div className="text-center mb-12">
                            <span className="text-[11px] font-bold tracking-[0.3em] text-[#C4A49A] uppercase mb-3 block">{t('product.kit_tag')}</span>
                            <h2 className="text-3xl md:text-5xl font-light text-[#2C2826] tracking-tight">{t('product.kit_title')}</h2>
                            <p className="text-[#8A7369] mt-3 font-light max-w-xl mx-auto">{t('product.kit_desc')}</p>
                        </div>

                        {(() => {
                            const kit = product.upsell_kits[0];
                            return (
                                <div className="bg-white border border-[#F1EBE6] rounded-[40px] p-8 md:p-12 shadow-[0_20px_60px_rgba(196,164,154,0.08)]">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                                        {kit.items.map((it, idx) => (
                                            <React.Fragment key={it.id}>
                                                <div className="flex flex-col items-center text-center group">
                                                    <div className="w-full aspect-square rounded-3xl bg-[#FCFAF8] border border-[#F1EBE6] flex items-center justify-center p-6 mb-4 group-hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition-shadow">
                                                        <img src={it.image} alt={it.name} className="w-full h-full object-contain mix-blend-multiply" />
                                                    </div>
                                                    <p className="text-[12px] font-bold text-[#2C2826] uppercase tracking-tight leading-tight mb-1 line-clamp-2">{it.name}</p>
                                                    <p className="text-[14px] text-[#8A7369]">{Number(it.price).toFixed(2)} {t('currency')}</p>
                                                </div>
                                                {idx < kit.items.length - 1 && (
                                                    <div className="hidden md:flex items-center justify-center text-[#C4A49A] -mx-3 col-span-0">
                                                        <Plus size={28} strokeWidth={1.5} />
                                                    </div>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </div>

                                    <div className="border-t border-[#F1EBE6] pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
                                        <div className="text-center md:text-left">
                                            <span className="inline-block bg-[#C4A49A] text-white text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full mb-2">
                                                {t('product.kit_save')} {kit.discount_pct}%
                                            </span>
                                            <div className="flex items-baseline gap-3 justify-center md:justify-start">
                                                <span className="text-2xl text-[#A69B97] line-through font-light">{Number(kit.original_price).toFixed(2)} {t('currency')}</span>
                                                <span className="text-4xl font-light text-[#2C2826]">{Number(kit.kit_price).toFixed(2)} {t('currency')}</span>
                                            </div>
                                            <p className="text-[12px] text-[#8A7369] mt-1">
                                                {t('product.kit_savings')} {Number(kit.savings).toFixed(2)} {t('currency')}
                                            </p>
                                        </div>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => kit.items.forEach(it => addToCart({ id: it.id, name: it.name, price: it.price, image: it.image, quantity: 1 }))}
                                            className="bg-[#2C2826] text-white py-4 px-10 rounded-2xl text-[12px] font-bold uppercase tracking-[0.25em] flex items-center gap-3 shadow-xl shadow-[#2C2826]/20 hover:bg-black transition-colors"
                                        >
                                            <ShoppingBag size={16} strokeWidth={1.8} />
                                            {t('product.kit_add')}
                                        </motion.button>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                </section>
            )}

            {/* 4. Recommended Products */}
            <TrendingProducts overrideTitle={t('product.recommended')} removePadding={false} recommendedIds={product.recommended_products} />
        </div>
    );
}
