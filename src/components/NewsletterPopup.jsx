import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSiteCopy } from '../hooks/useSiteCopy';

export default function NewsletterPopup() {
    const [isVisible, setIsVisible] = useState(false);
    const { t, lang } = useLanguage();
    const copy = useSiteCopy('newsletter', lang);
    const [email, setEmail] = useState('');

    useEffect(() => {
        const hasSeenNewsletter = localStorage.getItem('beauthe_newsletter_seen');
        if (!hasSeenNewsletter) {
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 2000); // Show after 2 seconds
            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        localStorage.setItem('beauthe_newsletter_seen', 'true');
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        // Here we would normally send to an API
        console.log('Subscribed:', email);
        handleClose();
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="relative w-full max-w-[600px] bg-white rounded-[20px] shadow-2xl overflow-hidden p-10 md:p-16 text-center"
                    >
                        <button
                            onClick={handleClose}
                            className="absolute top-6 right-6 p-2 text-[#8A7369] hover:text-[#2C2826] transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <div className="space-y-8">
                            <h2 className="text-4xl font-bold text-[#2C2826] tracking-tighter mb-4">{copy.brand || 'beauthé'}</h2>

                            <div className="space-y-4">
                                <h3 className="text-xl md:text-2xl font-bold text-[#2C2826] leading-snug">
                                    {copy.title || t('popup.title')}
                                </h3>
                                <p className="text-[#5C534F] text-sm md:text-base font-light max-w-[400px] mx-auto leading-relaxed">
                                    {copy.desc || t('popup.desc')}
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4 max-w-[400px] mx-auto">
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={copy.email_placeholder || 'Email'}
                                    className="w-full px-6 py-4 bg-white border border-[#EBE1DA] rounded-lg text-sm focus:outline-none focus:border-[#2C2826] transition-colors"
                                />
                                <button
                                    type="submit"
                                    className="w-full bg-[#2C2826] text-white py-5 rounded-lg text-sm font-bold tracking-widest uppercase hover:bg-[#C4A49A] transition-all shadow-lg active:scale-[0.98]"
                                >
                                    {copy.subscribe || t('popup.subscribe')}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="text-[14px] font-bold text-[#2C2826] border-b border-[#2C2826] hover:text-[#C4A49A] hover:border-[#C4A49A] transition-colors pb-0.5"
                                >
                                    {copy.no_thanks || t('popup.no_thanks')}
                                </button>
                            </form>

                            <p className="text-[11px] text-[#A69B97] leading-relaxed max-w-[480px] mx-auto opacity-80">
                                {copy.privacy || t('popup.privacy')}
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
