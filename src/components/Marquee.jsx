import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function Marquee({ settings = {}, lang = 'es' }) {
    const { t } = useLanguage();
    const override = settings[`phrases_${lang}`];
    const phrases = (Array.isArray(override) && override.filter(Boolean).length > 0)
        ? override.filter(Boolean)
        : t('marquee');

    const list = Array.isArray(phrases) ? phrases : [];
    const repeated = Array(20).fill(list).flat();

    return (
        <div className="w-full bg-[#2C2826] text-[#EBE1DA] py-3.5 overflow-hidden flex whitespace-nowrap">
            <div className="animate-marquee flex gap-8 items-center w-max">
                {repeated.map((item, index) => (
                    <React.Fragment key={index}>
                        <span className="text-[11px] md:text-[12px] font-bold tracking-[0.15em] uppercase">{item}</span>
                        <span className="text-xs opacity-50">•</span>
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}
