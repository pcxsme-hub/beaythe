import React from 'react';
import Hero from '../components/Hero';
import FeaturedCarousel from '../components/FeaturedCarousel';
import CircularCategories from '../components/CircularCategories';
import Marquee from '../components/Marquee';
import TrendingProducts from '../components/TrendingProducts';
import FAQ from '../components/FAQ';
import AboutUs from '../components/AboutUs';
import Reviews from '../components/Reviews';
import TrustStrip from '../components/TrustStrip';
import SkinQuiz from '../components/SkinQuiz';
import ProductTabs from '../components/ProductTabs';
import { useLanguage } from '../context/LanguageContext';
import { useHomeConfig } from '../hooks/useHomeConfig';

const COMPONENT_BY_TYPE = {
    FeaturedCarousel,
    Marquee,
    AboutUs,
    HeroCards: Hero,
    SkinQuiz,
    CircularCategories,
    ProductTabs,
    TrustStrip,
    TrendingProducts,
    Reviews,
    FAQ
};

export default function Home() {
    const { t, lang } = useLanguage();
    const { sections, ready } = useHomeConfig();

    if (!ready) {
        return <div className="min-h-screen flex items-center justify-center bg-[#FCFAF8]"><div className="w-12 h-12 border-4 border-[#F1EBE6] border-t-[#C4A49A] rounded-full animate-spin" /></div>;
    }

    return (
        <>
            {sections.filter(s => s.enabled).map(section => {
                const Component = COMPONENT_BY_TYPE[section.type];
                if (!Component) return null;
                const settings = section.settings || {};
                // Per-type prop mapping
                const props = { key: section.id, settings, lang };
                if (section.type === 'TrendingProducts') {
                    if (settings.sourceType === 'new') {
                        props.type = 'new';
                        props.overrideTitle = settings[`overrideTitle_${lang}`] || t('filters.sort_options.novidades');
                    } else if (settings[`overrideTitle_${lang}`]) {
                        props.overrideTitle = settings[`overrideTitle_${lang}`];
                    }
                }
                return <Component {...props} />;
            })}
        </>
    );
}
