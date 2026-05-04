import React from 'react';
import { ShoppingBag, X, Minus, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

export default function CartDrawer() {
    const { isCartOpen, setIsCartOpen, cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
    const { t } = useLanguage();
    const navigate = useNavigate();

    const handleCheckout = () => {
        setIsCartOpen(false);
        navigate('/checkout');
    };

    return (
        <>
            <AnimatePresence>
                {isCartOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsCartOpen(false)}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[80]"
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isCartOpen && (
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full sm:w-[450px] bg-[#FCFAF8] shadow-2xl z-[90] flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 sm:p-8 border-b border-[#EBE1DA] bg-white">
                            <div className="flex flex-col">
                                <div className="flex items-center gap-3 mb-1">
                                    <ShoppingBag size={22} className="text-[#2C2826]" />
                                    <h2 className="text-2xl font-bold text-[#2C2826] tracking-tight">{t('cart.title')}</h2>
                                </div>
                                {cartItems.length > 0 && (
                                    <button
                                        onClick={clearCart}
                                        className="text-[11px] uppercase tracking-widest font-bold text-[#C4A49A] hover:text-[#8A7369] transition-colors text-left"
                                    >
                                        {t('cart.clear_cart')}
                                    </button>
                                )}
                            </div>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="w-10 h-10 rounded-full bg-[#F4EFEA] flex items-center justify-center text-[#5C534F] hover:bg-[#2C2826] hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-[#FCFAF8] custom-scrollbar">
                            {cartItems.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-70">
                                    <ShoppingBag size={64} className="text-[#EBE1DA] mb-6" strokeWidth={1} />
                                    <p className="text-[#8A7369] text-sm uppercase tracking-widest font-bold mb-2">{t('cart.empty')}</p>
                                    <p className="text-[#5C534F] font-light">{t('cart.empty_desc')}</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex gap-4 p-4 bg-white rounded-2xl border border-[#F1EBE6] shadow-sm relative group">
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="absolute top-4 right-4 text-[#C4A49A] hover:text-[#8A7369] transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                            <div className="w-24 h-24 rounded-xl overflow-hidden bg-[#FCFAF8] flex items-center justify-center p-2 flex-shrink-0 border border-[#F1EBE6]">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                                            </div>
                                            <div className="flex-1 flex flex-col pt-1">
                                                <p className="text-[10px] uppercase tracking-widest font-bold text-[#8A7369] mb-1">{item.brand}</p>
                                                <h4 className="text-[14px] font-bold text-[#2C2826] leading-tight mb-1 pr-6 truncate max-w-[150px]">{item.name}</h4>
                                                <p className="text-[#C4A49A] font-medium mb-3">{item.price} €</p>

                                                <div className="flex items-center justify-between mt-auto">
                                                    <div className="flex items-center border border-[#EBE1DA] rounded-full px-3 py-1 bg-[#FCFAF8]">
                                                        <button onClick={() => updateQuantity(item.id, -1)} className="text-[#8A7369] hover:text-[#2C2826] p-1"><Minus size={14} /></button>
                                                        <span className="text-[13px] font-bold text-[#2C2826] min-w-[24px] text-center">{item.quantity}</span>
                                                        <button onClick={() => updateQuantity(item.id, 1)} className="text-[#8A7369] hover:text-[#2C2826] p-1"><Plus size={14} /></button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {cartItems.length > 0 && (
                            <div className="border-t border-[#EBE1DA] p-6 sm:p-8 bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-10">
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-[#8A7369] font-light text-[14px]">
                                        <p>{t('cart.subtotal')}</p>
                                        <p>{getCartTotal()} €</p>
                                    </div>
                                    <div className="flex justify-between text-[#8A7369] font-light text-[14px]">
                                        <p>{t('cart.shipping')}</p>
                                        <p>{t('cart.shipping_calc')}</p>
                                    </div>
                                    <div className="flex justify-between text-[#2C2826] font-bold text-xl pt-4 border-t border-[#F1EBE6]">
                                        <p>{t('cart.total')}</p>
                                        <p>{getCartTotal()} €</p>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    className="w-full bg-[#2C2826] text-white rounded-xl py-4 text-[13px] font-bold uppercase tracking-widest hover:bg-[#C4A49A] transition-colors shadow-xl"
                                >
                                    {t('cart.checkout')}
                                </button>
                            </div>
                        )}

                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
