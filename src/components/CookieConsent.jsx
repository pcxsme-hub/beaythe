import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useCRO } from '../context/CROContext';
import { useLocation } from 'react-router-dom';
import { Cookie, X } from 'lucide-react';
import { useSiteCopy } from '../hooks/useSiteCopy';

export default function CookieConsent() {
    const { t, lang } = useLanguage();
    const copy = useSiteCopy('cookies', lang);
    const { pathname } = useLocation();
    const { showConsentBanner, acceptConsent, declineConsent } = useCRO();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Show only on home page if the CRO context thinks we should show it
        if (pathname === '/' && showConsentBanner) {
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 1500);
            return () => clearTimeout(timer);
        } else {
            setIsVisible(false);
        }
    }, [pathname, showConsentBanner]);

    const handleAction = (type) => {
        if (type === 'accepted') {
            acceptConsent();
        } else {
            declineConsent();
        }
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:max-w-md z-[9999]"
                >
                    <div className="bg-white/80 backdrop-blur-2xl border border-white/50 p-6 md:p-8 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative overflow-hidden group">
                        {/* Decorative background element */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#C4A49A]/5 rounded-full blur-3xl group-hover:bg-[#C4A49A]/10 transition-colors duration-500"></div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-2xl bg-[#F8F5F2] flex items-center justify-center text-[#C4A49A]">
                                    <Cookie size={20} strokeWidth={1.5} />
                                </div>
                                <h3 className="text-lg font-normal text-[#2C2826] tracking-tight">{copy.title || t('common.cookies.title')}</h3>
                            </div>

                            <p className="text-[#5C534F] text-[14px] leading-relaxed mb-8 opacity-90 font-light">
                                {copy.message || t('common.cookies.message')}
                            </p>

                            <div className="flex flex-col sm:flex-row items-center gap-3">
                                <button
                                    onClick={() => handleAction('accepted')}
                                    className="w-full sm:flex-1 bg-[#2C2826] text-white py-4 rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-black transition-all shadow-lg hover:shadow-xl active:scale-95"
                                >
                                    {copy.accept || t('common.cookies.accept')}
                                </button>
                                <button
                                    onClick={() => handleAction('declined')}
                                    className="w-full sm:w-auto px-8 py-4 text-[11px] font-bold text-[#8A7369] uppercase tracking-[0.2em] hover:text-[#2C2826] transition-colors border border-[#EBE1DA] rounded-2xl md:border-none"
                                >
                                    {copy.decline || t('common.cookies.decline')}
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsVisible(false)}
                            className="absolute top-4 right-4 text-[#A69B97] hover:text-[#2C2826] transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
