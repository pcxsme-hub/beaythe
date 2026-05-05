import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, Plus } from 'lucide-react';
import { getProducts } from '../admin/services/db';

export default function Hero({ settings = {}, lang = 'es' }) {
    const { t, translateProduct } = useLanguage();
    const [featuredProduct, setFeaturedProduct] = useState(null);

    // Build the 3 banner cards: prefer admin overrides, fall back to translation defaults.
    const defaultCards = [
        { image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80', title: t('hero.skin_care.title'), desc: t('hero.skin_care.desc'), cta_link: '/categoria/rostro' },
        { image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80', title: t('hero.hair_care.title'), desc: t('hero.hair_care.desc'), cta_link: '/categoria/cabello' },
        { image: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&q=80', title: t('hero.manos_pies.title'), desc: t('hero.manos_pies.desc'), cta_link: '/categoria/manos-pies' }
    ];
    const cards = (Array.isArray(settings.cards) && settings.cards.length > 0)
        ? settings.cards.map((c, i) => ({
            image: c.image || defaultCards[i % 3]?.image,
            title: c[`title_${lang}`] || defaultCards[i % 3]?.title,
            desc: c[`desc_${lang}`] || defaultCards[i % 3]?.desc,
            cta_link: c.cta_link || defaultCards[i % 3]?.cta_link
        }))
        : defaultCards;

    useEffect(() => {
        const loadHero = async () => {
            const all = await getProducts();
            // Pick first trending product as hero feature
            const prod = all.find(p => p.is_active && p.placement === 'TRENDING');
            if (prod) setFeaturedProduct(translateProduct(prod));
        };
        loadHero();
    }, []);


    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
    };

    return (
        <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-16 pb-8 md:pb-16">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8"
            >
                {cards.slice(0, 3).map((card, idx) => (
                    <motion.div key={idx} variants={itemVariants} className={`relative aspect-[4/5] md:aspect-[3/4] overflow-hidden bg-[#F4EFEA] flex flex-col justify-end group rounded-2xl shadow-sm ${idx === 0 ? 'sm:col-span-2 md:col-span-1' : ''}`}>
                        <img
                            src={card.image}
                            alt={card.title}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-90"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#2C2826]/80 via-[#2C2826]/10 to-transparent"></div>
                        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-black/40 to-transparent pointer-events-none"></div>

                        <div className="relative z-10 p-6 md:p-8 flex flex-col items-center text-center">
                            <h2 className="text-white text-2xl md:text-3xl font-bold mb-2 uppercase tracking-tight">{card.title}</h2>
                            <p className="text-[#F4EFEA] text-[12px] md:text-[13px] font-light mb-5 opacity-80 max-w-[200px]">{card.desc}</p>
                            <Link
                                to={card.cta_link}
                                className="bg-white text-[#2C2826] px-6 py-2.5 text-[10px] md:text-[11px] font-bold tracking-widest uppercase rounded-xl shadow-lg hover:bg-[#C4A49A] hover:text-white transition-all transform active:scale-95"
                            >
                                {t('hero.discover')}
                            </Link>
                        </div>
                    </motion.div>
                ))}

            </motion.div>

            {/* Main Big Banner below */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mt-8 lg:mt-12 relative w-full h-[400px] md:h-[500px] bg-[#EBE1DA] overflow-hidden group flex flex-col md:flex-row items-center justify-center md:justify-between px-6 md:px-24 rounded-3xl border border-[#F4EFEA] shadow-sm"
            >
                <div className="z-10 max-w-lg text-center md:text-left mb-8 md:mb-0">
                    <p className="text-[11px] md:text-[12px] font-bold mb-4 uppercase tracking-[0.3em] text-[#8A7369]">{t('hero.subtitle')}</p>
                    <h1 className="text-3xl md:text-5xl lg:text-7xl font-light text-[#2C2826] leading-[1.1] tracking-tight mb-8">
                        {featuredProduct ? featuredProduct.name.split(' ').slice(0, 2).join(' ') : t('hero.title_part1')} <br />
                        <span className="font-bold text-[#C4A49A] uppercase">{featuredProduct ? featuredProduct.name.split(' ').slice(2).join(' ') : t('hero.title_part2')}</span>
                    </h1>
                    <Link
                        to={featuredProduct ? `/producto/${featuredProduct.id}` : "/categoria/todos"}
                        className="inline-flex items-center gap-3 bg-[#2C2826] text-white px-10 py-5 rounded-2xl text-[12px] font-bold uppercase tracking-[0.2em] hover:bg-black transition-all shadow-2xl hover:translate-y-[-2px]"
                    >
                        {t('hero.button')}
                        <ArrowRight size={18} />
                    </Link>
                </div>

                {featuredProduct && (
                    <div className="absolute md:relative md:w-1/2 h-full top-0 right-0 opacity-20 md:opacity-100 flex items-center justify-center">
                        <img
                            src={featuredProduct.image_url}
                            alt="Hero Featured"
                            className="absolute inset-0 w-full h-full object-cover opacity-10 md:hidden"
                        />

                        <div className="hidden md:flex bg-white/95 backdrop-blur-md p-6 rounded-[32px] shadow-2xl flex-col items-center max-w-[280px] w-full transform rotate-3 hover:rotate-0 transition-transform duration-700 hover:shadow-[0_20px_40px_rgba(44,40,38,0.1)] border border-[#F4EFEA] z-20">
                            <div className="w-full aspect-square rounded-[24px] overflow-hidden mb-6 bg-[#FCFAF8] flex items-center justify-center shadow-inner">
                                <img src={featuredProduct.image_url} className="w-[85%] h-[85%] object-cover mix-blend-multiply transition-transform duration-1000 hover:scale-110" />
                            </div>
                            <h3 className="text-[#2C2826] font-normal text-center leading-tight uppercase tracking-tight text-lg mb-1 truncate w-full">
                                {featuredProduct.name}
                            </h3>
                            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#C4A49A] mb-4">Beauthé</p>

                            <div className="flex items-center gap-4 w-full justify-between pt-4 border-t border-[#F1EBE6]">
                                <span className="font-light text-[#2C2826] text-xl">{(featuredProduct.manual_price || featuredProduct.price).toFixed(2)} €</span>
                                <Link to={`/producto/${featuredProduct.id}`} className="bg-[#2C2826] text-white p-3 rounded-2xl hover:bg-black transition-colors shadow-lg active:scale-95">
                                    <Plus size={18} strokeWidth={2.5} />
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </motion.div>
        </section>
    );
}
