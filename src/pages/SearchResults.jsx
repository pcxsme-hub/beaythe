import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, ShoppingBag, Heart, ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { getProducts } from '../admin/services/db';

const PLACEHOLDER_IMG = "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=300";

export default function SearchResults() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const { t, translateProduct } = useLanguage();
    const { addToCart } = useCart();
    const { toggleFavorite, isFavorite } = useFavorites();
    const [sortBy, setSortBy] = useState('relevant');
    const [showFilters, setShowFilters] = useState(false);
    const [allProducts, setAllProducts] = useState([]);

    useEffect(() => {
        let active = true;
        getProducts().then(data => { if (active) setAllProducts(data.filter(p => p.is_active)); });
        return () => { active = false; };
    }, []);

    const results = useMemo(() => {
        const q = query.trim().toLowerCase();
        const list = allProducts.map(p => translateProduct(p)).filter(p => {
            if (!q) return true;
            const haystack = (
                (p.name || '') + ' ' +
                (p.description || '') + ' ' +
                ((p.tags || []).join(' '))
            ).toLowerCase();
            return haystack.includes(q);
        });
        const sorted = [...list];
        if (sortBy === 'price-asc') sorted.sort((a, b) => (a.manual_price || a.price || 0) - (b.manual_price || b.price || 0));
        else if (sortBy === 'price-desc') sorted.sort((a, b) => (b.manual_price || b.price || 0) - (a.manual_price || a.price || 0));
        else if (sortBy === 'newest') sorted.sort((a, b) => b.id - a.id);
        return sorted;
    }, [query, allProducts, sortBy, translateProduct]);

    return (
        <div className="pb-24 bg-[#FCFAF8] min-h-screen">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

                {/* Search Header */}
                <div className="mb-12">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#C4A49A] shadow-sm border border-[#F1EBE6]">
                            <Search size={22} strokeWidth={1.5} />
                        </div>
                        <h1 className="text-3xl md:text-5xl font-normal text-[#2C2826] tracking-tight">
                            {t('search.results_for')} <span className="font-light text-[#C4A49A] uppercase tracking-wide">"{query}"</span>
                        </h1>
                    </div>
                    <p className="text-[#8A7369] text-sm uppercase font-bold tracking-[0.2em]">
                        {results.length} {results.length === 1 ? t('search.result_found') : t('search.results_found')}
                    </p>
                </div>

                {/* Filters & Sorting */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-y border-[#F1EBE6] py-6">
                    <button
                        type="button"
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#2C2826] group"
                    >
                        <SlidersHorizontal size={18} className="text-[#C4A49A] group-hover:rotate-90 transition-transform duration-500" />
                        {t('common.filter')}
                    </button>

                    <div className="flex items-center gap-6">
                        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#A69B97] hidden sm:block">{t('common.sort')}:</span>
                        <div className="relative group">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="appearance-none bg-white border border-[#EBE1DA] px-6 py-3 rounded-xl text-[11px] font-bold uppercase tracking-[0.15em] text-[#2C2826] outline-none cursor-pointer pr-12 hover:border-[#C4A49A] transition-colors shadow-sm"
                            >
                                <option value="relevant">{t('filters.sort_options.recomendados')}</option>
                                <option value="newest">{t('filters.sort_options.novidades')}</option>
                                <option value="price-asc">{t('filters.sort_options.menor_preco')}</option>
                                <option value="price-desc">{t('filters.sort_options.maior_preco')}</option>
                            </select>
                            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#C4A49A]" />
                        </div>
                    </div>
                </div>

                {/* Results Grid */}
                {results.length > 0 ? (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
                        {results.map((product) => {
                            const price = Number(product.manual_price || product.price || 0);
                            return (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={product.id} className="group"
                                >
                                    <div className="relative aspect-[4/5] rounded-[32px] overflow-hidden bg-white border border-[#F1EBE6] group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] transition-all duration-500 mb-6">
                                        <button
                                            onClick={() => toggleFavorite({ ...product, image: product.image_url })}
                                            className={`absolute top-5 right-5 w-10 h-10 rounded-full flex items-center justify-center shadow-md z-10 transition-all duration-300
                                                ${isFavorite(product.id) ? 'bg-[#C4A49A] text-white opacity-100' : 'text-[#5C534F] hover:text-[#C4A49A] bg-[#FCFAF8] opacity-0 group-hover:opacity-100'}
                                            `}
                                        >
                                            <Heart size={18} strokeWidth={1.2} fill={isFavorite(product.id) ? "currentColor" : "none"} />
                                        </button>

                                        <Link to={`/producto/${product.id}`} className="block w-full h-full p-4">
                                            <img
                                                src={product.image_url || PLACEHOLDER_IMG}
                                                alt={product.name}
                                                className="w-full h-full object-contain mix-blend-multiply transition-transform duration-1000 group-hover:scale-110"
                                            />
                                        </Link>

                                        <div className="absolute inset-x-0 bottom-0 p-5 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 hidden md:block">
                                            <button
                                                onClick={() => addToCart({ ...product, image: product.image_url })}
                                                className="w-full bg-[#2C2826] text-white py-4 text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-black transition-colors rounded-2xl flex items-center justify-center gap-2 shadow-2xl"
                                            >
                                                <ShoppingBag size={14} strokeWidth={2} />
                                                {t('common.add')}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="px-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-[10px] font-bold tracking-[0.2em] text-[#8A7369] uppercase leading-none">Beauthé</p>
                                        </div>
                                        <Link to={`/producto/${product.id}`} className="block text-[15px] font-normal text-[#2C2826] mb-2 hover:text-[#C4A49A] transition-colors leading-tight uppercase tracking-tight truncate">{product.name}</Link>
                                        <span className="text-[16px] font-normal text-[#2C2826]">{price.toFixed(2)} {t('currency')}</span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-32 bg-white rounded-[40px] border border-[#F1EBE6] shadow-sm">
                        <div className="w-20 h-20 bg-[#FCFAF8] rounded-full flex items-center justify-center mx-auto mb-8 text-[#A69B97]">
                            <Search size={32} strokeWidth={1} />
                        </div>
                        <h3 className="text-3xl font-light text-[#2C2826] mb-4">{t('search.no_results')}</h3>
                        <p className="text-[#5C534F] max-w-md mx-auto mb-10 font-light leading-relaxed">
                            {t('search.try_again')}
                        </p>
                        <Link to="/categoria/todos" className="px-10 py-4 bg-[#2C2826] text-white rounded-xl text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-black transition-colors inline-block">
                            {t('search.view_all')}
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
