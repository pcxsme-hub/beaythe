import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, RotateCcw, CreditCard, Truck, User, ChevronDown, HelpCircle, ArrowLeft, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Ajuda() {
    const { t } = useLanguage();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeSection, setActiveSection] = useState('home');
    const [openFaq, setOpenFaq] = useState(null);

    const homeFaqs = t('faq_section.items') || [];

    const localized = (key) => {
        const val = t(`help.faqs.${key}`);
        return Array.isArray(val) ? val : [];
    };

    const faqData = {
        most_accessed: localized('most_accessed'),
        products: Array.isArray(homeFaqs) ? homeFaqs.map(f => ({ q: f.question, a: f.answer })) : [],
        refunds: localized('refunds'),
        deliveries: localized('deliveries'),
        pagamentos: localized('payments'),
        account: localized('account')
    };

    const toggleFaq = (index) => setOpenFaq(openFaq === index ? null : index);

    const categories = [
        { id: 'products', titleKey: 'help.categories.products', icon: Sparkles, color: 'bg-purple-50 text-purple-500' },
        { id: 'refunds', titleKey: 'help.categories.refunds', icon: RotateCcw, color: 'bg-rose-50 text-rose-500' },
        { id: 'pagamentos', titleKey: 'help.categories.payments', icon: CreditCard, color: 'bg-blue-50 text-blue-500' },
        { id: 'deliveries', titleKey: 'help.categories.deliveries', icon: Truck, color: 'bg-amber-50 text-amber-500' },
        { id: 'account', titleKey: 'help.categories.account', icon: User, color: 'bg-emerald-50 text-emerald-500' }
    ];

    const getAllFaqs = () => {
        const all = [];
        Object.values(faqData).forEach(items => items.forEach(f => all.push(f)));
        return all.filter((v, i, a) => a.findIndex(t => t.q === v.q) === i);
    };

    const currentFaqs = searchTerm
        ? getAllFaqs().filter(f => f.q.toLowerCase().includes(searchTerm.toLowerCase()) || f.a.toLowerCase().includes(searchTerm.toLowerCase()))
        : (activeSection === 'home' ? faqData.most_accessed : (faqData[activeSection] || []));

    const sectionTitle = activeSection === 'home'
        ? t('help.title')
        : t(categories.find(c => c.id === activeSection)?.titleKey || 'help.title');

    return (
        <div className="min-h-screen bg-[#FCFAF8] pb-24 text-[#2C2826]">
            <div className="bg-white border-b border-[#F1EBE6] pt-12 pb-16">
                <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center uppercase">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl md:text-5xl font-black mb-8 tracking-tighter"
                    >
                        {sectionTitle}
                    </motion.h1>

                    <div className="max-w-2xl mx-auto relative px-4 normal-case">
                        <input
                            type="text"
                            placeholder={t('help.search_placeholder')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#FCFAF8] border border-[#F1EBE6] rounded-full py-4 px-8 pr-14 focus:outline-none focus:ring-2 focus:ring-[#C4A49A]/20 focus:border-[#C4A49A] transition-all shadow-sm text-sm"
                        />
                        <button className="absolute right-8 top-1/2 -translate-y-1/2 text-[#8A7369]" aria-label={t('help.search_placeholder')}>
                            <Search size={20} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-12">
                {activeSection === 'home' && !searchTerm ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-16">
                            {categories.map((cat) => (
                                <motion.button
                                    key={cat.id}
                                    whileHover={{ y: -5, boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)' }}
                                    onClick={() => { setActiveSection(cat.id); setOpenFaq(null); }}
                                    className="bg-white border border-[#F1EBE6] rounded-3xl p-8 flex flex-col items-center text-center transition-all group h-full uppercase"
                                >
                                    <div className={`w-16 h-16 rounded-2xl ${cat.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                        <cat.icon size={32} />
                                    </div>
                                    <h3 className="text-[13px] font-black tracking-tight leading-tight">{t(cat.titleKey)}</h3>
                                </motion.button>
                            ))}
                        </div>

                        <div className="max-w-3xl mx-auto">
                            <h2 className="text-xl font-black mb-8 border-b border-[#F1EBE6] pb-4 tracking-tighter uppercase">{t('help.most_accessed')}</h2>
                            <div className="space-y-4">
                                {currentFaqs.map((faq, idx) => (
                                    <div key={`${faq.q}-${idx}`} className="bg-white border border-[#F1EBE6] rounded-2xl overflow-hidden">
                                        <button
                                            onClick={() => toggleFaq(idx)}
                                            className="w-full flex items-center justify-between p-6 text-left hover:bg-[#FCFAF8] transition-colors"
                                        >
                                            <span className="text-[13px] font-bold pr-8 uppercase">{faq.q}</span>
                                            <ChevronDown size={18} className={`text-[#C4A49A] transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                                        </button>
                                        <AnimatePresence mode="wait">
                                            {openFaq === idx && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                >
                                                    <div className="px-6 pb-6 text-[14px] text-[#5C534F] font-light leading-relaxed">
                                                        {faq.a}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-20 text-center">
                            <div className="inline-flex flex-col items-center">
                                <div className="w-16 h-16 rounded-full bg-[#EBE1DA] flex items-center justify-center text-[#8A7369] mb-6 shadow-glow">
                                    <HelpCircle size={32} />
                                </div>
                                <h3 className="text-xl font-bold mb-2 uppercase tracking-tighter">{t('help.cta_title')}</h3>
                                <p className="text-[#8A7369] mb-8 font-light">{t('help.cta_desc')}</p>
                                <a href="mailto:contato@beauthe.com" className="inline-block cursor-pointer bg-[#2C2826] text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-black transition-all shadow-xl hover:scale-105 active:scale-95">
                                    {t('help.contact_us')}
                                </a>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="max-w-3xl mx-auto">
                        <button
                            onClick={() => { setActiveSection('home'); setOpenFaq(null); setSearchTerm(''); }}
                            className="flex items-center gap-2 text-[#8A7369] hover:text-[#2C2826] mb-8 transition-colors group uppercase font-bold text-sm tracking-wider"
                        >
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> {t('help.back')}
                        </button>

                        <h2 className="text-3xl font-black mb-10 tracking-tighter uppercase">
                            {searchTerm ? `${t('search.results_for')} "${searchTerm}"` : sectionTitle}
                        </h2>

                        <div className="space-y-4">
                            {currentFaqs.map((faq, idx) => (
                                <div key={`${faq.q}-${idx}`} className="bg-white border border-[#F1EBE6] rounded-2xl overflow-hidden">
                                    <button
                                        onClick={() => toggleFaq(idx)}
                                        className="w-full flex items-center justify-between p-6 text-left hover:bg-[#FCFAF8] transition-colors"
                                    >
                                        <span className="text-[13px] font-bold pr-8 uppercase">{faq.q}</span>
                                        <ChevronDown size={18} className={`text-[#C4A49A] transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                                    </button>
                                    <AnimatePresence mode="wait">
                                        {openFaq === idx && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                            >
                                                <div className="px-6 pb-6 text-[14px] text-[#5C534F] font-light leading-relaxed">
                                                    {faq.a}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                            {currentFaqs.length === 0 && (
                                <div className="text-center py-20">
                                    <HelpCircle size={48} className="mx-auto text-[#EBE1DA] mb-4" />
                                    <p className="text-[#A69B97] italic text-lg">{t('search.no_results')} "{searchTerm}"</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
