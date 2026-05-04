import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

export default function FavoritesDrawer({ isOpen, onClose }) {
    const { favorites, toggleFavorite, clearFavorites } = useFavorites();
    const { addToCart } = useCart();
    const { t } = useLanguage();
    const navigate = useNavigate();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 z-[80] backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'tween', duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
                        className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-[90] shadow-2xl flex flex-col"
                    >
                        <div className="flex items-center justify-between p-6 border-b border-[#F1EBE6]">
                            <div className="flex flex-col">
                                <h2 className="text-2xl font-bold text-[#2C2826] tracking-tight flex items-center gap-2 mb-1">
                                    <Heart size={20} className="text-[#C4A49A] fill-[#C4A49A]" />
                                    {t('favorites.title')} <span className="text-sm align-top font-normal ml-1 text-[#8A7369]">{favorites.length}</span>
                                </h2>
                                {favorites.length > 0 && (
                                    <button
                                        onClick={clearFavorites}
                                        className="text-[11px] uppercase tracking-widest font-bold text-[#C4A49A] hover:text-[#8A7369] transition-colors text-left"
                                    >
                                        {t('favorites.clear_favorites')}
                                    </button>
                                )}
                            </div>
                            <button onClick={onClose} className="p-2 text-[#5C534F] hover:text-[#2C2826] transition-colors rounded-full hover:bg-gray-100">
                                <X size={20} strokeWidth={1.5} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 bg-[#FCFAF8]">
                            {favorites.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center">
                                    <h3 className="text-3xl font-bold tracking-tight text-[#2C2826] mb-4">
                                        {t('favorites.empty_title_1')} <br /><span className="font-light text-[#C4A49A]">{t('favorites.empty_title_2')}</span>
                                    </h3>
                                    <p className="text-[#5C534F] text-[15px] font-light mb-10">
                                        {t('favorites.empty_desc')}
                                    </p>
                                    <button
                                        onClick={() => {
                                            navigate('/');
                                            onClose();
                                        }}
                                        className="px-8 py-3.5 border border-[#2C2826] rounded-xl text-[#2C2826] text-[11px] font-bold tracking-[0.15em] uppercase"
                                    >
                                        {t('favorites.explore')}
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {favorites.map((product) => (
                                        <motion.div
                                            layout
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            key={product.id}
                                            className="flex gap-4 group"
                                        >
                                            <div className="w-24 h-32 rounded-2xl overflow-hidden border border-[#F1EBE6] bg-white shrink-0">
                                                <img src={product.image_url || product.image} alt={product.name} className="w-full h-full object-contain mix-blend-multiply p-2" />
                                            </div>
                                            <div className="flex-1 flex flex-col justify-between py-1">
                                                <div>
                                                    <h4 className="text-[14px] font-bold text-[#2C2826] leading-tight uppercase mb-1 truncate">{product.name}</h4>
                                                    <p className="text-[12px] text-[#8A7369]">{
                                                        Number(typeof product.price === 'string'
                                                            ? parseFloat(product.price.replace(',', '.'))
                                                            : product.price || 0
                                                        ).toFixed(2)
                                                    } {t('currency')}</p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => {
                                                            addToCart(product);
                                                            onClose();
                                                        }}
                                                        className="text-[11px] font-bold text-[#2C2826] hover:text-[#C4A49A] uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                                                    >
                                                        <ShoppingBag size={14} /> {t('common.add')}
                                                    </button>
                                                    <button
                                                        onClick={() => toggleFavorite(product)}
                                                        className="text-[11px] font-bold text-[#A69B97] hover:text-red-400 uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                                                    >
                                                        <Trash2 size={14} /> {t('common.remove')}
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
