import React, { useState, useEffect, useRef } from 'react';
import { Search, Heart, ShoppingBag, User, X, Plus, Minus, ChevronRight, Menu, Globe, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useCRO } from '../context/CROContext';

const topNavKeys = ["rostro", "cuerpo", "cabello", "perfumes", "outlet"];

// Mega Menu Data using translation keys with static, high-quality images
const megaMenuData = {
    "rostro": [
        { name: "cuidado_facial", imgs: ["https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=300"], items: ["limpiadores", "tonicos", "serums", "cremas", "contorno", "mascarillas"] },
        { name: "maquillaje_facial", imgs: ["https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=300"], items: ["base", "correctores", "polvo", "rubor", "labios"] },
    ],
    "cuerpo": [
        { name: "higiene", imgs: ["https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=300"] },
        { name: "hidratacion", imgs: ["https://images.unsplash.com/photo-1552046122-03184de85e08?auto=format&fit=crop&q=80&w=300"] },
        { name: "cuidados", imgs: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=300"] },
        { name: "manos_pies", imgs: ["https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&q=80&w=300"] },
    ],
    "cabello": [
        { name: "tratamiento", imgs: ["https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=300"], items: ["lavado", "tratamiento"] },
        { name: "ferramentas", imgs: ["https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&q=80&w=300"], items: ["styling", "cepillos", "planchas"] },
    ],
    "perfumes": [
        { name: "femeninos", imgs: ["https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=300"] },
        { name: "masculinos", imgs: ["https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=300"] },
        { name: "unisex", imgs: ["https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=300"] },
        { name: "hogar", imgs: ["https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=300"] },
    ],
    "outlet": [
        { name: "promociones", imgs: ["https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=300"] },
        { name: "ultimas", imgs: ["https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&q=80&w=300"] },
        { name: "best_sellers", imgs: ["https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&q=80&w=300"] },
    ],
};


const searchSuggestions = [
    { id: 1, name: "GLOSS FRANBOESA", price: "69,90", image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=150" },
    { id: 2, name: "SÉRUM GLOW", price: "49,90", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=150&q=80" },
    { id: 3, name: "LIP JUICE", price: "45,00", image: "https://images.unsplash.com/photo-1512496015851-a1c8d1720d29?auto=format&fit=crop&w=150&q=80" },
    { id: 4, name: "MASCARILLA REVITALIZANTE", price: "32,00", image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=150&q=80" },
];

export default function Navbar({ onCartClick, onFavoritesClick, onUserClick }) {
    const { getCartCount } = useCart();
    const { lang, t, toggleLanguage } = useLanguage();
    const { trackInterest } = useCRO();
    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [activeMenu, setActiveMenu] = useState(null);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [msgIndex, setMsgIndex] = useState(0);
    const [megaImgIdx, setMegaImgIdx] = useState(0);
    const { pathname } = useLocation();
    const navRef = useRef(null);
    const searchRef = useRef(null);
    const lastScrollY = useRef(0);
    const closeMenuTimer = useRef(null);

    const isHeroPage = pathname === '/' || pathname === '/historia';
    const forceSolid = isScrolled || activeMenu || !isHeroPage;

    // Check if we are on the search page to hide the navbar search
    const isSearchPage = pathname === '/search';

    const handleSearch = (e) => {
        if (e) e.preventDefault();
        if (!searchTerm.trim()) return;
        setIsSearchOpen(false);
        navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    };

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setIsScrolled(currentScrollY > 20);

            if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
                setIsVisible(false);
                setActiveMenu(null);
            } else {
                setIsVisible(true);
            }
            lastScrollY.current = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setMsgIndex(prev => (prev + 1) % 2);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    // Effect for transitioning mega menu images - REMOVED for static images
    useEffect(() => {
        setMegaImgIdx(0);
    }, [activeMenu]);


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (navRef.current && !navRef.current.contains(event.target)) {
                setActiveMenu(null);
            }
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsSearchOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [navRef, searchRef]);

    const toggleMenu = (key) => {
        if (megaMenuData[key]) {
            if (activeMenu === key) {
                setActiveMenu(null);
            } else {
                setActiveMenu(key);
                trackInterest(key);
            }
        } else {
            setActiveMenu(null);
            trackInterest(key);
        }
    };

    const openMenuOnHover = (key) => {
        if (closeMenuTimer.current) {
            clearTimeout(closeMenuTimer.current);
            closeMenuTimer.current = null;
        }
        if (megaMenuData[key]) {
            if (activeMenu !== key) {
                setActiveMenu(key);
                trackInterest(key);
            }
        } else if (activeMenu) {
            setActiveMenu(null);
        }
    };

    const scheduleCloseMenu = () => {
        if (closeMenuTimer.current) clearTimeout(closeMenuTimer.current);
        closeMenuTimer.current = setTimeout(() => setActiveMenu(null), 150);
    };

    const cancelCloseMenu = () => {
        if (closeMenuTimer.current) {
            clearTimeout(closeMenuTimer.current);
            closeMenuTimer.current = null;
        }
    };

    useEffect(() => () => { if (closeMenuTimer.current) clearTimeout(closeMenuTimer.current); }, []);

    return (
        <header ref={navRef} className={`fixed w-full top-0 z-50 transition-all duration-500 ease-in-out ${isVisible ? 'translate-y-0' : '-translate-y-full'} ${forceSolid ? 'bg-white shadow-sm' : 'bg-gradient-to-b from-black/50 via-black/20 to-transparent'}`}>


            {/* Announcement Bar */}
            <div className={`transition-colors duration-500 ${forceSolid ? 'bg-[#EBE1DA] text-[#4A423F]' : 'bg-black/30 text-white backdrop-blur-md'} py-2.5 px-4 flex justify-between items-center relative overflow-hidden h-10`}>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => toggleLanguage('pt')}
                        className={`text-[11px] font-bold transition-all duration-300 ${lang === 'pt' ? (forceSolid ? 'text-[#2C2826]' : 'text-white') : (forceSolid ? 'text-[#9C9490]' : 'text-white/50')} hover:text-[#C4A49A]`}
                    >
                        PT
                    </button>
                    <span className={`text-[10px] ${forceSolid ? 'text-[#EBE1DA]' : 'text-white/40'}`}>|</span>

                    <button
                        onClick={() => toggleLanguage('es')}
                        className={`text-[11px] font-bold transition-all duration-300 ${lang === 'es' ? (forceSolid ? 'text-[#2C2826]' : 'text-white') : (forceSolid ? 'text-[#9C9490]' : 'text-white/50')} hover:text-[#C4A49A]`}
                    >
                        ES
                    </button>
                    <span className={`text-[10px] ${forceSolid ? 'text-[#EBE1DA]' : 'text-white/40'}`}>|</span>

                    <button
                        onClick={() => toggleLanguage('en')}
                        className={`text-[11px] font-bold transition-all duration-300 ${lang === 'en' ? (forceSolid ? 'text-[#2C2826]' : 'text-white') : (forceSolid ? 'text-[#9C9490]' : 'text-white/50')} hover:text-[#C4A49A]`}
                    >
                        EN
                    </button>
                    <span className={`ml-1 text-[10px] uppercase font-medium ${forceSolid ? 'text-[#7A706C]' : 'text-white/90'}`}>| EUR</span>


                </div>

                <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <AnimatePresence mode="wait">
                        <motion.span
                            key={msgIndex}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ duration: 0.8, ease: "easeInOut" }}
                            className="opacity-100 uppercase tracking-[0.1em] text-[10px] md:text-[11px] font-bold whitespace-nowrap drop-shadow-sm"

                        >
                            {msgIndex === 0 ? t('announcement') : t('about_you')}
                        </motion.span>
                    </AnimatePresence>
                </div>

                {/* Empty div for balancing flex layout */}
                <div className="w-[80px] hidden sm:block"></div>
            </div>

            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

                {/* Main Header Row */}
                <div className="flex items-center justify-between py-4 lg:py-6 gap-4 md:gap-8">

                    {/* Mobile Menu Toggle */}
                    <div className="flex md:hidden items-center gap-4">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className={`p-2 transition-colors duration-500 ${forceSolid ? 'text-[#2C2826]' : 'text-white'}`}
                        >
                            <Menu size={24} strokeWidth={1.5} />
                        </button>
                        {!isSearchPage && (
                            <button className={`transition-colors duration-500 ${forceSolid ? 'text-[#2C2826]' : 'text-white'}`}>
                                <Search size={22} strokeWidth={1.5} />
                            </button>
                        )}
                    </div>

                    {/* Logo - Centered on mobile */}
                    <div className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 flex-shrink-0">
                        <Link to="/" onClick={() => { setActiveMenu(null); setIsMobileMenuOpen(false); }} className={`text-2xl md:text-4xl font-semibold tracking-tight transition-colors duration-500 ${forceSolid ? 'text-[#2C2826] hover:text-[#C4A49A]' : 'text-white hover:text-white/80 drop-shadow-md'}`}>

                            Beauthé
                        </Link>
                    </div>

                    {/* Search Bar - Hidden on mobile/results page */}
                    {!isSearchPage && (
                        <div className="flex-1 max-w-2xl hidden md:block" ref={searchRef}>
                            <form onSubmit={handleSearch} className="relative group">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className={`w-full border placeholder-[#9C9490] text-sm py-2.5 px-6 pr-12 focus:outline-none transition-all duration-300 ${forceSolid ? 'bg-[#FCF9F7] border-[#EBE1DA] text-[#2C2826]' : 'bg-white/20 border-white/30 text-white placeholder-white/80 backdrop-blur-md'} ${isSearchOpen ? 'border-[#C4A49A] rounded-[24px] shadow-sm bg-white text-[#2C2826]' : 'rounded-full focus:border-[#C4A49A] focus:ring-1 focus:ring-[#C4A49A]'}`}

                                    placeholder={t('search_placeholder')}
                                    onFocus={() => { setIsSearchOpen(true); setActiveMenu(null); }}
                                />
                                <motion.button
                                    type="submit"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9, rotate: -10 }}
                                    className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 transition-colors duration-500 ${forceSolid ? 'text-[#5C534F] hover:text-[#C4A49A]' : 'text-white/80 hover:text-white'}`}
                                >
                                    <Search size={18} strokeWidth={1.5} />
                                </motion.button>

                                {/* Search Suggestions Dropdown */}
                                <AnimatePresence>
                                    {isSearchOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 5, scale: 0.98 }}
                                            transition={{ duration: 0.2, ease: "easeOut" }}
                                            className="absolute top-[calc(100%+8px)] left-0 w-full min-w-[500px] max-w-2xl bg-white shadow-[0_10px_40px_rgba(0,0,0,0.1)] rounded-3xl overflow-hidden z-50 p-6 border border-[#F1EBE6]"
                                        >
                                            <p className="text-[11px] font-bold text-[#8A7369] uppercase tracking-widest mb-6">
                                                {searchTerm.length > 0 ? t('search_results') : t('new_arrivals')}
                                            </p>
                                            <div className="grid grid-cols-4 gap-4">
                                                {searchSuggestions
                                                    .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
                                                    .slice(0, 4)
                                                    .map((item) => (
                                                        <Link to="/producto" key={item.id} onClick={() => { setIsSearchOpen(false); setSearchTerm(''); }} className="group flex flex-col items-center text-center cursor-pointer">
                                                            <div className="w-full aspect-square bg-[#FCFAF8] rounded-2xl mb-3 flex items-center justify-center p-3 group-hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all border border-transparent group-hover:border-[#F1EBE6]">
                                                                <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" />
                                                            </div>
                                                            <p className="text-[10px] font-bold text-[#2C2826] uppercase mb-1.5 group-hover:text-[#C4A49A] transition-colors line-clamp-2 px-1">{item.name}</p>
                                                            <p className="text-[13px] font-medium text-[#c47761]">{item.price} €</p>
                                                        </Link>
                                                    ))}

                                                {searchSuggestions.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
                                                    <div className="col-span-4 text-center py-6 text-[#8A7369] text-sm font-medium">
                                                        {t('no_results')} "{searchTerm}"
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </form>
                        </div>
                    )}

                    {/* Icons Context */}
                    <div className={`flex items-center gap-4 lg:gap-6 transition-colors duration-500 ${forceSolid ? 'text-[#4A423F]' : 'text-white'}`}>
                        <motion.button
                            onClick={() => { setActiveMenu(null); onFavoritesClick(); }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`${forceSolid ? 'hover:text-[#C4A49A]' : 'hover:text-white/70'} transition-colors hidden md:block`}
                        >
                            <Heart size={20} strokeWidth={1.5} />
                        </motion.button>
                        <motion.button
                            onClick={() => { setActiveMenu(null); onCartClick(); }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`${forceSolid ? 'hover:text-[#C4A49A]' : 'hover:text-white/70'} transition-colors relative`}
                        >
                            <ShoppingBag size={22} strokeWidth={1.5} />
                            <AnimatePresence mode="wait">
                                <motion.span
                                    key={getCartCount()}
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                                    className="absolute -top-1 -right-2 bg-[#C4A49A] text-white text-[8px] md:text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-sm"
                                >
                                    {getCartCount()}
                                </motion.span>
                            </AnimatePresence>
                        </motion.button>
                        <motion.button
                            onClick={() => { setActiveMenu(null); onUserClick(); }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`${forceSolid ? 'hover:text-[#C4A49A]' : 'hover:text-white/70'} transition-colors hidden md:block`}
                        >
                            <User size={20} strokeWidth={1.5} />
                        </motion.button>
                    </div>
                </div>

                {/* Categories Navbar - Hidden on Profile Page */}
                {!pathname.startsWith('/profile') && (
                    <nav
                        onMouseLeave={scheduleCloseMenu}
                        onMouseEnter={cancelCloseMenu}
                        className={`hidden lg:flex items-center justify-center space-x-6 xl:space-x-8 py-4 overflow-x-auto whitespace-nowrap border-t ${forceSolid ? 'border-[#F1EBE6]' : 'border-white/20'} relative transition-colors duration-500`}
                    >

                        {topNavKeys.map((key, idx) => {
                            const hasMegaMenu = !!megaMenuData[key];
                            const isActive = activeMenu === key;

                            return (
                                <button
                                    key={idx}
                                    onClick={() => toggleMenu(key)}
                                    onMouseEnter={() => openMenuOnHover(key)}
                                    className={`relative text-[13px] tracking-wide transition-all duration-300 flex items-center gap-1.5 focus:outline-none
                  after:content-[''] after:absolute after:-bottom-1 after:left-0 after:h-[1px] after:w-full after:origin-left after:transition-transform after:duration-300 after:ease-out
                  ${isActive ? 'text-[#C4A49A] after:scale-x-100 after:bg-[#C4A49A]' : 'after:scale-x-0 outline-none'}
                  ${!isActive ? (key === 'outlet' ? 'text-[#C4A49A] font-medium after:bg-[#C4A49A] hover:after:scale-x-100' : `${forceSolid ? 'text-[#5C534F] hover:text-[#2C2826]' : 'text-white/90 hover:text-white drop-shadow-sm'} font-normal after:bg-current hover:after:scale-x-100`) : ''}

                `}
                                >
                                    {t(`nav.${key}`)}
                                    {hasMegaMenu && (
                                        <ChevronDown size={14} className={`transition-transform duration-300 ${isActive ? 'rotate-180 text-[#C4A49A]' : (forceSolid ? 'text-[#9C9490]' : 'text-white/60')}`} />
                                    )}
                                </button>
                            );
                        })}
                    </nav>
                )}
            </div>

            {/* Mega Menu Dropdown */}
            <AnimatePresence>
                {activeMenu && megaMenuData[activeMenu] && (
                    <motion.div
                        key="mega-menu"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
                        onMouseEnter={cancelCloseMenu}
                        onMouseLeave={scheduleCloseMenu}
                        className="absolute top-full left-0 w-full bg-[#FCFAF8] shadow-lg border-t border-[#F1EBE6] overflow-hidden rounded-b-[2rem] z-40"
                    >
                        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
                            <div className="flex justify-center gap-6 xl:gap-10 overflow-x-auto custom-scrollbar pb-6">
                                {megaMenuData[activeMenu].map((item, idx) => (
                                    <div key={idx} className="flex flex-col items-center gap-4 group cursor-pointer w-[120px] flex-shrink-0">
                                        <div className="w-[100px] h-[100px] rounded-[24px] overflow-hidden bg-[#F4EFEA] shadow-sm group-hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] transition-all duration-300 border border-[#F1EBE6] relative">
                                            <AnimatePresence mode="wait">
                                                <motion.img
                                                    key={megaImgIdx}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ duration: 1.5, ease: "easeInOut" }}
                                                    src={item.imgs[megaImgIdx]}
                                                    alt={t(`nav.${item.name}`)}
                                                    className="w-full h-full object-cover"
                                                />
                                            </AnimatePresence>
                                        </div>
                                        <div className="text-center w-full">
                                            {(() => {
                                                const catPath = item.name === 'ultimas' ? 'outlet' : (item.name === 'promociones' ? 'outlet' : (item.name === 'manos_pies' ? 'manos-pies' : item.name));
                                                return (
                                                    <>
                                                        <h4 className="text-[14px] font-bold text-[#C4A49A] mb-2 group-hover:text-[#8A7369] transition-colors truncate">
                                                            <Link to={`/categoria/${catPath}`} onClick={() => setActiveMenu(null)}>{t(`nav.${item.name}`)}</Link>
                                                        </h4>
                                                        <div className="flex flex-col gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                                                            {(item.items || [item.name]).map((itName, sIdx) => (
                                                                <Link key={sIdx} to={`/categoria/${itName === 'ultimas' ? 'outlet' : (itName === 'promociones' ? 'outlet' : (itName === 'manos_pies' ? 'manos-pies' : itName))}`} onClick={() => setActiveMenu(null)} className="text-[12px] text-[#5C534F] font-light hover:text-[#C4A49A] transition-colors truncate">
                                                                    {t(`nav.${itName}`)}
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    </>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Breadcrumbs / Tags - Optional for navigation feel */}
            <div className="flex md:hidden overflow-x-auto py-2 no-scrollbar gap-4 mt-1 border-t border-[#F1EBE6]/20">
                {Object.keys(megaMenuData).map(key => (
                    <Link key={key} to={`/categoria/${key}`} className={`text-[11px] font-bold uppercase tracking-widest whitespace-nowrap transition-colors ${forceSolid ? 'text-[#8A7369]' : 'text-white/70'}`}>
                        {t(`nav.${key}`)}
                    </Link>
                ))}
            </div>

            {/* Mobile Menu Sidebar */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 w-[85%] max-w-sm h-full bg-white z-[110] shadow-2xl flex flex-col"
                        >
                            <div className="p-6 border-b border-[#F1EBE6] flex items-center justify-between">
                                <h2 className="text-xl font-bold tracking-tight text-[#2C2826]">{t('common.categories')}</h2>
                                <button onClick={() => setIsMobileMenuOpen(false)} className="w-10 h-10 rounded-full bg-[#FCFAF8] flex items-center justify-center">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-2">
                                {/* Language Toggle in Menu */}
                                <div className="bg-[#F4EFEA] p-4 rounded-2xl flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <Globe size={18} className="text-[#8A7369]" />
                                        <span className="text-xs font-bold uppercase tracking-widest text-[#2C2826]">{t('common.language')}</span>
                                    </div>
                                    <div className="flex gap-4">
                                        <button onClick={() => toggleLanguage('pt')} className={`text-sm font-bold ${lang === 'pt' ? 'text-[#C4A49A]' : 'text-[#8A7369]'}`}>PT</button>
                                        <button onClick={() => toggleLanguage('es')} className={`text-sm font-bold ${lang === 'es' ? 'text-[#C4A49A]' : 'text-[#8A7369]'}`}>ES</button>
                                    </div>
                                </div>

                                {Object.keys(megaMenuData).map(key => (
                                    <Link
                                        key={key}
                                        to={`/categoria/${key}`}
                                        onClick={() => { setIsMobileMenuOpen(false); trackInterest(key); }}
                                        className="flex items-center justify-between p-4 bg-[#FCFAF8] rounded-2xl group active:bg-[#F4EFEA]"
                                    >
                                        <span className="text-[14px] font-bold text-[#2C2826] uppercase tracking-wide">{t(`nav.${key}`)}</span>
                                        <ChevronRight size={18} className="text-[#C4A49A]" />
                                    </Link>
                                ))}
                            </div>

                            <div className="p-6 bg-[#FCFAF8] border-t border-[#F1EBE6]">
                                <div className="flex items-center gap-4 text-[#8A7369] text-xs font-bold uppercase tracking-widest">
                                    <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>{t('profile.account')}</Link>
                                    <span className="opacity-20">|</span>
                                    <button type="button" onClick={() => { setIsMobileMenuOpen(false); onFavoritesClick(); }}>{t('common.favorites')}</button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header >
    );
}
