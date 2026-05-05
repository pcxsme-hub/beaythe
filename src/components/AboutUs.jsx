import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext'; // Assuming useLanguage is in a context folder

export default function AboutUs({ settings = {}, lang = 'es' }) {
    const { t } = useLanguage();
    const navigate = useNavigate();

    const tag = settings[`tag_${lang}`] || t('about_us.tag');
    const title1 = settings[`title_1_${lang}`] || t('about_us.title_1');
    const title2 = settings[`title_2_${lang}`] || t('about_us.title_2');
    const desc = settings[`desc_${lang}`] || t('about_us.desc');
    const ctaLabel = settings[`cta_${lang}`] || t('common.more');
    const ctaLink = settings.cta_link || '/historia';
    const imageUrl = settings.image_url || 'https://images.unsplash.com/photo-1552693673-1bf958298935?auto=format&fit=crop&q=80';

    return (
        <section className="py-24 md:py-32 bg-[#FCFAF8] overflow-hidden">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

                    {/* Image side */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        className="w-full lg:w-1/2 relative aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl"
                    >
                        <img
                            src={imageUrl}
                            alt="Beauthé"
                            className="w-full h-full object-cover transition-transform duration-[3s] hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </motion.div>

                    {/* Content side */}
                    <div className="w-full lg:w-1/2 flex flex-col items-start text-left">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-[11px] font-bold tracking-[0.3em] text-[#C4A49A] uppercase mb-6"
                        >
                            {tag}
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-4xl md:text-5xl lg:text-6xl font-normal text-[#2C2826] mb-8 leading-[1.1] tracking-tight"
                        >
                            {title1} <br />
                            <span className="font-light text-[#C4A49A] uppercase tracking-wider">{title2}</span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            className="text-[#5C534F] text-[15px] md:text-[17px] font-light leading-relaxed mb-10 opacity-90"
                        >
                            {desc}
                        </motion.p>
                        <motion.button
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.6 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-10 py-4 bg-[#2C2826] text-white rounded-full text-[11px] font-bold uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all"
                            onClick={() => navigate(ctaLink)}
                        >
                            {ctaLabel}
                        </motion.button>
                    </div>
                </div>
            </div>
        </section>
    );
}
