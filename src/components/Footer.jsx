import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Mail } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
    const { t } = useLanguage();

    return (
        <footer className="bg-[#F4EFEA] pt-20 pb-12 mt-auto border-t border-[#EAE3DE]">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">

                {/* Coluna 1 - Logo & Redes */}
                <div className="lg:col-span-1 flex flex-col items-start">
                    <h2 className="text-3xl md:text-4xl font-black text-[#2C2826] tracking-tighter mb-6 leading-none">BEAUTHÉ</h2>
                    <div className="flex items-center gap-5">
                        <a href="https://instagram.com/beauthe" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-[#8A7369] hover:text-[#C4A49A] transition-colors"><Instagram size={24} /></a>
                        <a href="mailto:contato@beauthe.com" aria-label="Email" className="text-[#8A7369] hover:text-[#C4A49A] transition-colors"><Mail size={24} /></a>
                    </div>
                </div>

                {/* Coluna 2 - Categorías */}
                <div>
                    <h3 className="text-[14px] font-bold text-[#2C2826] tracking-widest mb-6 uppercase">{t('footer.categories_title')}</h3>
                    <ul className="space-y-4 text-[13px] text-[#5C534F] font-light">
                        <li><Link to="/categoria/rostro" className="hover:text-[#C4A49A] transition-colors">{t('nav.rostro')}</Link></li>
                        <li><Link to="/categoria/maquillaje" className="hover:text-[#C4A49A] transition-colors">{t('nav.maquillaje')}</Link></li>
                        <li><Link to="/categoria/cuerpo" className="hover:text-[#C4A49A] transition-colors">{t('nav.cuerpo')}</Link></li>
                        <li><Link to="/categoria/cabello" className="hover:text-[#C4A49A] transition-colors">{t('nav.cabello')}</Link></li>
                        <li><Link to="/categoria/solares" className="hover:text-[#C4A49A] transition-colors">{t('nav.solares')}</Link></li>
                    </ul>
                </div>

                {/* Coluna 3 - Atendimento */}
                <div>
                    <h3 className="text-[14px] font-bold text-[#2C2826] tracking-widest mb-6 uppercase">{t('footer.need_help')}</h3>
                    <ul className="space-y-4 text-[13px] text-[#5C534F] font-light">
                        <li><Link to="/ajuda" className="hover:text-[#C4A49A] transition-colors">{t('footer.links.contact')}</Link></li>
                        <li><Link to="/faq" className="hover:text-[#C4A49A] transition-colors">{t('footer.links.faq')}</Link></li>
                        <li><Link to="/ajuda" className="hover:text-[#C4A49A] transition-colors">{t('footer.links.support')}</Link></li>
                    </ul>
                </div>

                {/* Coluna 4 - Compra */}
                <div>
                    <h3 className="text-[14px] font-bold text-[#2C2826] tracking-widest mb-6 uppercase">{t('footer.track_purchase')}</h3>
                    <ul className="space-y-4 text-[13px] text-[#5C534F] font-light">
                        <li><Link to="/profile" className="hover:text-[#C4A49A] transition-colors">{t('footer.links.my_account')}</Link></li>
                        <li><Link to="/profile?tab=orders" className="hover:text-[#C4A49A] transition-colors">{t('footer.links.my_orders')}</Link></li>
                        <li><Link to="/ajuda" className="hover:text-[#C4A49A] transition-colors">{t('footer.links.returns')}</Link></li>
                        <li><Link to="/profile?tab=track" className="hover:text-[#C4A49A] transition-colors">{t('footer.links.track')}</Link></li>
                    </ul>
                </div>

                {/* Coluna 5 - Institucional & Legal */}
                <div>
                    <h3 className="text-[14px] font-bold text-[#2C2826] tracking-widest mb-6 uppercase">{t('footer.institutional')}</h3>
                    <ul className="space-y-4 text-[13px] text-[#5C534F] font-light">
                        <li><Link to="/historia" className="hover:text-[#C4A49A] transition-colors">{t('footer.links.who_we_are')}</Link></li>
                        <li><Link to="/faq" className="hover:text-[#C4A49A] transition-colors">{t('footer.links.terms')}</Link></li>
                        <li><Link to="/faq" className="hover:text-[#C4A49A] transition-colors">{t('footer.links.privacy')}</Link></li>
                        <li><Link to="/faq" className="hover:text-[#C4A49A] transition-colors">{t('footer.links.payments')}</Link></li>
                        <li><Link to="/faq" className="hover:text-[#C4A49A] transition-colors">{t('footer.links.legal_notice')}</Link></li>
                        <li><Link to="/admin-core-sys" className="hover:text-[#C4A49A] transition-colors font-semibold">{t('footer.links.admin')}</Link></li>
                    </ul>
                </div>
            </div>

            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#EAE3DE] pt-8 mt-12 flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-4">
                <p className="text-[12px] text-[#8A7369]">{t('footer.copyright_full')}</p>
                <div className="flex gap-3 items-center text-[#8A7369]">
                    <span className="px-2.5 py-1 rounded-md bg-white border border-[#EAE3DE] text-[10px] font-bold tracking-[0.1em] uppercase">MB WAY</span>
                    <span className="px-2.5 py-1 rounded-md bg-white border border-[#EAE3DE] text-[10px] font-bold tracking-[0.1em] uppercase">Bizum</span>
                    <span className="px-2.5 py-1 rounded-md bg-white border border-[#EAE3DE] text-[10px] font-bold tracking-[0.1em] uppercase">Visa</span>
                    <span className="px-2.5 py-1 rounded-md bg-white border border-[#EAE3DE] text-[10px] font-bold tracking-[0.1em] uppercase">Mastercard</span>
                    <span className="px-2.5 py-1 rounded-md bg-white border border-[#EAE3DE] text-[10px] font-bold tracking-[0.1em] uppercase">PayPal</span>
                </div>
            </div>
        </footer>
    );
}
