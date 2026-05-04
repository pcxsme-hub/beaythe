import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useCRO } from '../context/CROContext';

import { getProducts } from '../admin/services/db';

const categories = [
    { name: "ROSTRO", slug: "rostro", img: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=300&q=80", color: "bg-[#F3E8E3]" },
    { name: "MAQUILLAJE", slug: "maquillaje", img: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=300&q=80", color: "bg-[#EFE8E1]" },
    { name: "CUERPO", slug: "cuerpo", img: "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&w=300&q=80", color: "bg-[#E6E8E3]" },
    { name: "BIENESTAR", slug: "bienestar", img: "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=300&q=80", color: "bg-[#EAE4DF]" },
    { name: "CABELLO", slug: "cabello", img: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=300&q=80", color: "bg-[#EAEAE8]" },
    { name: "SOLARES", slug: "solares", img: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=300&q=80", color: "bg-[#F5EFE8]" },
    { name: "HOMBRE", slug: "hombre", img: "https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&w=300&q=80", color: "bg-[#E8ECEF]" },
];

export default function CircularCategories() {
    const { t } = useLanguage();
    const { interest } = useCRO();
    const [displayCategories, setDisplayCategories] = React.useState([]);

    React.useEffect(() => {
        const loadCategories = async () => {
            const allProducts = await getProducts();
            const activeCategoriesSlugs = new Set();
            allProducts.filter(p => p.is_active).forEach(p => {
                const content = (
                    p.name + " " +
                    (p.description || "") + " " +
                    (typeof p.product_type === 'string' ? p.product_type : "") + " " +
                    (typeof p.category === 'string' ? p.category : "")
                ).toLowerCase();

                categories.forEach(cat => {
                    const terms = {
                        rostro: ['rostro', 'rosto', 'facial', 'face', 'piel', 'pele', 'skincare'],
                        maquillaje: ['maquillaje', 'maquilhagem', 'makeup', 'labios', 'ojos', 'olhos'],
                        cuerpo: ['cuerpo', 'corpo', 'baño', 'banho', 'hidratacion', 'body'],
                        cabello: ['cabello', 'cabelo', 'hair', 'capilar'],
                        'manos-pies': ['mano', 'pie', 'mão', 'pe', 'unha', 'uña', 'hand', 'foot', 'nails'],
                        bienestar: ['bienestar', 'bem-estar', 'relax', 'zen'],
                        solares: ['solares', 'solar', 'sol', 'protector', 'spf'],
                        hombre: ['hombre', 'homem', 'men', 'masculino']
                    };
                    const searchTerms = terms[cat.slug] || [cat.slug];
                    if (searchTerms.some(term => content.includes(term))) {
                        activeCategoriesSlugs.add(cat.slug);
                    }
                });
            });

            let filtered = categories.filter(cat => activeCategoriesSlugs.has(cat.slug));

            // If interest exists, move it to front
            if (interest) {
                const index = filtered.findIndex(c => c.slug === interest);
                if (index > -1) {
                    const [item] = filtered.splice(index, 1);
                    filtered.unshift(item);
                }
            }

            setDisplayCategories(filtered);
        };
        loadCategories();
    }, [interest]);


    return (
        <section className="py-16 px-4">
            <div className="max-w-[1440px] mx-auto overflow-x-auto pb-6 custom-scrollbar">
                <div className="flex justify-start md:justify-center items-start gap-8 md:gap-14 min-w-max">
                    {displayCategories.map((cat, idx) => (
                        <Link to={`/categoria/${cat.slug}`} key={idx} className="relative">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1, duration: 0.6, ease: "easeOut" }}
                                className="flex flex-col items-center cursor-pointer group"
                            >
                                {interest === cat.slug && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#2C2826] text-white text-[9px] uppercase tracking-widest font-bold px-3 py-1 rounded-full whitespace-nowrap z-10 shadow-md">
                                        Recomendado para ti
                                    </div>
                                )}
                                <div className={`w-36 h-36 md:w-40 md:h-40 rounded-full overflow-hidden mb-6 ${cat.color} p-1 transition-all duration-500 group-hover:scale-105 group-hover:shadow-[0_10px_30px_rgba(44,40,38,0.08)]`}>
                                    <div className="w-full h-full rounded-full overflow-hidden">
                                        <img
                                            src={cat.img}
                                            alt={cat.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 mix-blend-multiply"
                                        />
                                    </div>
                                </div>
                                <span className="text-[13px] font-medium text-[#4A423F] tracking-[0.15em] uppercase transition-colors group-hover:text-[#C4A49A]">{t(`nav.${cat.slug}`)}</span>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
