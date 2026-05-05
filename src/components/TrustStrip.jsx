import React from 'react';
import { Headphones, Truck, Layers, PiggyBank, Calendar } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const iconMap = {
    Headphones,
    Truck,
    Layers,
    PiggyBank,
    Calendar
};

export default function TrustStrip({ settings = {}, lang = 'es' }) {
    const { t } = useLanguage();
    const fallbackItems = t('trust');

    // Prefer admin-overridden items if present
    const adminItems = Array.isArray(settings.items)
        ? settings.items.map(it => ({ id: it.icon, icon: it.icon, title: it[`title_${lang}`] || it.title_es || it.title_pt || it.title_en }))
        : null;

    const trustItems = adminItems && adminItems.length > 0 ? adminItems : fallbackItems;

    if (!trustItems || !Array.isArray(trustItems)) return null;

    return (
        <section className="py-16 bg-white border-y border-[#F1EBE6]">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-y-12 gap-x-8 items-start">
                    {trustItems.map((item, idx) => {
                        const Icon = iconMap[item.icon] || Headphones;
                        return (
                            <div key={item.id || idx} className="flex flex-col items-center text-center group">
                                <div className="w-20 h-20 rounded-full bg-[#F4EFEA] flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-hover:bg-[#EBE1DA] shadow-sm">
                                    <Icon size={28} className="text-[#8A7369]" strokeWidth={1.25} />
                                </div>
                                <p className="text-[12px] lg:text-[13px] text-[#4A423F] font-medium leading-relaxed max-w-[160px] uppercase tracking-wider">
                                    {item.title}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
