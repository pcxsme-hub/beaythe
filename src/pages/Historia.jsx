import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Leaf, Heart, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function Historia() {
    const navigate = useNavigate();
    const { t } = useLanguage();

    const values = [
        {
            icon: <Shield className="text-[#C4A49A]" size={32} strokeWidth={1} />,
            title: t('history.transparency_title'),
            desc: t('history.transparency_desc')
        },
        {
            icon: <Leaf className="text-[#C4A49A]" size={32} strokeWidth={1} />,
            title: t('history.purity'),
            desc: t('history.sustainability_desc') // Reusing for purity desc if needed, or keeping it clean
        },
        {
            icon: <Heart className="text-[#C4A49A]" size={32} strokeWidth={1} />,
            title: t('history.sustainability_title'),
            desc: t('history.sustainability_desc')
        }
    ];

    return (
        <div>
            {/* Hero Section */}
            <section className="relative h-[70vh] flex items-center justify-center overflow-hidden bg-[#2C2826]">
                <img
                    src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80"
                    alt="Beauthé Story"
                    className="absolute inset-0 w-full h-full object-cover opacity-50 scale-110"
                />
                <div className="relative z-10 text-center px-4 max-w-4xl">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[11px] font-bold tracking-[0.4em] text-[#C4A49A] uppercase mb-6 block"
                    >
                        {t('history.banner_tag')}
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-5xl md:text-7xl font-light text-white mb-8 tracking-tight"
                    >
                        {t('history.banner_title')}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-lg md:text-xl text-white/80 font-light leading-relaxed"
                    >
                        {t('history.banner_desc')}
                    </motion.p>
                </div>
            </section>

            {/* Values Grid */}
            <section className="py-24 bg-[#FCFAF8]">
                <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <span className="text-[11px] font-bold tracking-[0.3em] text-[#C4A49A] uppercase mb-4 block">
                            {t('history.values_title')}
                        </span>
                        <h2 className="text-4xl md:text-5xl font-normal text-[#2C2826] tracking-tight">
                            {t('history.lightness_title')}
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        {values.map((val, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.2 }}
                                className="bg-white p-12 rounded-[40px] shadow-sm border border-[#F1EBE6] hover:shadow-xl transition-all duration-500 text-center group"
                            >
                                <div className="mb-8 flex justify-center group-hover:scale-110 transition-transform duration-500">
                                    {val.icon}
                                </div>
                                <h3 className="text-xl font-bold text-[#2C2826] mb-4 uppercase tracking-wider">{val.title}</h3>
                                <p className="text-[#5C534F] font-light leading-relaxed">{val.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 bg-white text-center">
                <div className="max-w-3xl mx-auto px-4">
                    <span className="text-[11px] font-bold tracking-[0.3em] text-[#C4A49A] uppercase mb-8 block">{t('history.join_us_tag')}</span>
                    <h2 className="text-4xl md:text-6xl font-light text-[#2C2826] mb-10 leading-[1.1]">
                        {t('history.join_us_title_1')} <br />
                        <span className="font-normal text-[#C4A49A] uppercase tracking-wide">{t('history.join_us_title_2')}</span>
                    </h2>
                    <p className="text-[#5C534F] text-lg font-light leading-relaxed mb-12">
                        {t('history.join_us_desc')}
                    </p>
                    <motion.button
                        onClick={() => navigate('/categoria/todos')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-12 py-5 bg-[#2C2826] text-white rounded-full text-[12px] font-bold uppercase tracking-[0.2em] shadow-2xl flex items-center gap-3 mx-auto"
                    >
                        {t('history.view_collections')}
                        <ArrowRight size={16} />
                    </motion.button>
                </div>
            </section>
        </div>
    );
}
