import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export default function AuthDrawer({ isOpen, onClose }) {
    const [isLogin, setIsLogin] = useState(true);
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const { t } = useLanguage();
    const { login, register, validateEmail } = useAuth();
    const navigate = useNavigate();

    const handleNextStep = (e) => {
        e.preventDefault();
        setError('');

        if (!validateEmail(email)) {
            setError(t('auth.invalid_email') || 'Please enter a valid email address.');
            return;
        }

        if (isLogin) {
            handleComplete();
        } else {
            setStep(2);
        }
    };

    const handleComplete = () => {
        try {
            if (isLogin) {
                login({ email, name: name || email.split('@')[0] });
            } else {
                register({ email, name });
            }
            onClose();
            navigate('/profile');
            // Reset state
            setTimeout(() => {
                setIsLogin(true);
                setStep(1);
                setEmail('');
                setName('');
                setPassword('');
                setError('');
            }, 500);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 z-[80] backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'tween', duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
                        className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-[90] shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-[#F1EBE6] bg-white sticky top-0 z-10">
                            <h2 className="text-xl font-bold text-[#2C2826] tracking-tight flex items-center gap-2">
                                <User size={20} className="text-[#C4A49A]" />
                                {isLogin ? t('auth.login_title') : (step === 1 ? t('auth.register_title') : t('auth.account_created'))}
                            </h2>
                            <button onClick={onClose} className="p-2 text-[#5C534F] hover:text-[#2C2826] transition-colors rounded-full hover:bg-gray-100">
                                <X size={20} strokeWidth={1.5} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="flex-1 flex flex-col p-8 bg-[#FCFAF8] overflow-y-auto">
                            <AnimatePresence mode="wait">
                                {step === 1 ? (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                    >
                                        <p className="text-[#5C534F] text-[15px] font-light mb-8">
                                            {isLogin ? t('auth.login_desc') : t('auth.register_desc')}
                                        </p>

                                        {error && (
                                            <div className="bg-red-50 border border-red-100 text-red-600 text-[12px] p-4 rounded-xl mb-4">
                                                {error}
                                            </div>
                                        )}

                                        <form className="flex flex-col gap-6" onSubmit={handleNextStep}>
                                            {!isLogin && (
                                                <div className="flex flex-col">
                                                    <label className="text-[11px] font-bold text-[#8A7369] uppercase tracking-wider mb-2">{t('auth.name_label')}</label>
                                                    <input
                                                        required
                                                        type="text"
                                                        value={name}
                                                        onChange={(e) => setName(e.target.value)}
                                                        className="bg-white border border-[#EBE1DA] px-4 py-3 outline-none focus:border-[#C4A49A] text-[13px] rounded-xl transition-colors shadow-sm"
                                                        placeholder={t('auth.name_placeholder')}
                                                    />
                                                </div>
                                            )}

                                            <div className="flex flex-col">
                                                <label className="text-[11px] font-bold text-[#8A7369] uppercase tracking-wider mb-2">{t('auth.email_label')}</label>
                                                <input
                                                    required
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className="bg-white border border-[#EBE1DA] px-4 py-3 outline-none focus:border-[#C4A49A] text-[13px] rounded-xl transition-colors shadow-sm"
                                                    placeholder={t('auth.email_placeholder')}
                                                />
                                            </div>

                                            <div className="flex flex-col">
                                                <div className="flex justify-between items-center mb-2">
                                                    <label className="text-[11px] font-bold text-[#8A7369] uppercase tracking-wider">{t('auth.password_label')}</label>
                                                    {isLogin && <button type="button" onClick={(e) => e.preventDefault()} className="text-[11px] text-[#C4A49A] hover:underline hover:text-[#8A7369]">{t('auth.forgot_password')}</button>}
                                                </div>
                                                <input
                                                    required
                                                    type="password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    className="bg-white border border-[#EBE1DA] px-4 py-3 outline-none focus:border-[#C4A49A] text-[13px] rounded-xl transition-colors shadow-sm"
                                                    placeholder="••••••••"
                                                />
                                            </div>

                                            <motion.button
                                                whileHover={{ scale: 1.01 }}
                                                whileTap={{ scale: 0.98 }}
                                                className="w-full mt-4 bg-[#2C2826] text-white py-4 text-[12px] font-bold tracking-[0.15em] uppercase transition-all rounded-xl shadow-lg flex items-center justify-center gap-2"
                                            >
                                                {isLogin ? t('auth.login_btn') : t('auth.next_step')}
                                                {!isLogin && <ArrowRight size={16} />}
                                            </motion.button>
                                        </form>

                                        <div className="my-8 relative flex items-center">
                                            <div className="flex-grow border-t border-[#EBE1DA]"></div>
                                            <span className="px-4 text-[10px] text-[#A69B97] font-bold uppercase tracking-widest">{t('auth.divider')}</span>
                                            <div className="flex-grow border-t border-[#EBE1DA]"></div>
                                        </div>

                                        <motion.button
                                            whileHover={{ scale: 1.01, backgroundColor: "#FAF7F5" }}
                                            whileTap={{ scale: 0.98 }}
                                            className="w-full bg-white border border-[#EBE1DA] text-[#2C2826] py-3.5 text-[12px] font-bold tracking-[0.05em] flex justify-center items-center gap-3 rounded-xl shadow-sm transition-all hover:border-[#C4A49A]"
                                        >
                                            <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                                            {t('auth.google_btn')}
                                        </motion.button>

                                        <div className="mt-8 pt-6 border-t border-[#EBE1DA] text-center text-[#2C2826]">
                                            <p className="text-[13px] font-medium">
                                                {isLogin ? t('auth.no_account') : t('auth.has_account')}
                                                <button onClick={() => setIsLogin(!isLogin)} className="ml-2 text-[#C4A49A] font-bold hover:underline">
                                                    {isLogin ? t('auth.register_now') : t('auth.login_now')}
                                                </button>
                                            </p>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="step2"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="flex flex-col h-full"
                                    >
                                        <div className="bg-[#EBE1DA] rounded-3xl p-6 text-center mb-8 border border-[#D9CECB]">
                                            <CheckCircle2 size={40} className="mx-auto text-[#8A7369] mb-4" />
                                            <h3 className="text-lg font-bold text-[#2C2826] mb-2 uppercase tracking-tight">{t('auth.account_created')}</h3>
                                            <p className="text-[#8A7369] text-[13px] leading-relaxed">{t('auth.complete_profile_desc')}</p>
                                        </div>

                                        <div className="space-y-6 flex-grow">
                                            <div className="flex flex-col">
                                                <label className="text-[11px] font-bold text-[#8A7369] uppercase tracking-wider mb-2">{t('auth.interests_label')}</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {['skincare', 'makeup', 'hair', 'body'].map(key => (
                                                        <button type="button" key={key} className="px-4 py-2 bg-white border border-[#EBE1DA] rounded-full text-[12px] hover:border-[#C4A49A] transition-all">
                                                            {t(`auth.interests.${key}`)}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="flex flex-col">
                                                <label className="text-[11px] font-bold text-[#8A7369] uppercase tracking-wider mb-2">{t('auth.birth_label')}</label>
                                                <input type="date" className="bg-white border border-[#EBE1DA] px-4 py-3 outline-none focus:border-[#C4A49A] text-[13px] rounded-xl shadow-sm" />
                                            </div>
                                        </div>

                                        <div className="mt-8 flex flex-col gap-3">
                                            <motion.button
                                                onClick={handleComplete}
                                                whileHover={{ scale: 1.01 }}
                                                whileTap={{ scale: 0.98 }}
                                                className="w-full bg-[#2C2826] text-white py-4 text-[12px] font-bold tracking-[0.15em] uppercase rounded-xl shadow-lg"
                                            >
                                                {t('auth.complete_profile')}
                                            </motion.button>
                                            <button onClick={handleComplete} className="text-[11px] font-bold text-[#A69B97] uppercase tracking-widest hover:text-[#8A7369] py-2 transition-all">
                                                {t('auth.skip_step')}
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
