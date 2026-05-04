import React from 'react';
import { useCRO } from '../context/CROContext';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X } from 'lucide-react';

export default function CROBanners() {
    const { visits, funnelState, clearFunnel } = useCRO();
    const { t } = useLanguage();
    const [isWelcomeVisible, setIsWelcomeVisible] = React.useState(true);

    return (
        <>
            {/* Funnel Recovery (Abandoned Cart) */}
            <AnimatePresence>
                {funnelState === 'cart_abandoned' && (
                    <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        className="fixed bottom-28 right-4 md:bottom-28 md:right-28 bg-white border-2 border-[#2C2826] p-6 rounded-2xl shadow-2xl z-[55] max-w-[calc(100vw-2rem)] sm:max-w-sm flex flex-col gap-4"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="bg-[#EBE1DA] p-3 rounded-full text-[#8A7369]">
                                    <ShoppingBag size={24} />
                                </div>
                                <div>
                                    <h4 className="font-black text-[#2C2826] leading-tight">{t('cro.cart_abandoned_title')}</h4>
                                    <p className="text-sm text-[#8A7369] leading-snug">{t('cro.cart_abandoned_desc')}</p>
                                </div>
                            </div>
                            <button onClick={clearFunnel} className="text-[#A69B97] hover:text-[#E85D75] transition-colors"><X size={20} /></button>
                        </div>
                        <Link to="/checkout" className="w-full py-3 bg-[#2C2826] text-white text-center font-bold rounded-xl hover:bg-black transition-all shadow-md text-sm uppercase tracking-wider">
                            {t('cro.continue_purchase')}
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
