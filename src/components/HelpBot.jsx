import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function HelpBot() {
    const [isOpen, setIsOpen] = useState(false);
    const { t, lang } = useLanguage();
    const [messages, setMessages] = useState([{ id: 1, isBot: true, key: 'helpbot.welcome' }]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Reset welcome message on language change so existing intro re-translates.
    useEffect(() => {
        setMessages(prev => prev.map(m => (m.id === 1 ? { ...m, key: 'helpbot.welcome' } : m)));
    }, [lang]);

    const renderMsg = (msg) => msg.key ? t(msg.key) : msg.text;

    const getBotResponseKey = (text) => {
        const lowerText = text.toLowerCase();
        if (lowerText.includes('olá') || lowerText.includes('hola') || lowerText.includes('bom dia') || lowerText.includes('buenos días') || lowerText.includes('hi') || lowerText.includes('hello')) return 'helpbot.faq.greeting';
        if (lowerText.includes('envio') || lowerText.includes('entrega') || lowerText.includes('frete') || lowerText.includes('portes') || lowerText.includes('shipping') || lowerText.includes('delivery')) return 'helpbot.faq.shipping';
        if (lowerText.includes('pago') || lowerText.includes('pagamento') || lowerText.includes('cartão') || lowerText.includes('tarjeta') || lowerText.includes('payment') || lowerText.includes('card')) return 'helpbot.faq.payments';
        if (lowerText.includes('devolu') || lowerText.includes('retorno') || lowerText.includes('troca') || lowerText.includes('cambio') || lowerText.includes('return')) return 'helpbot.faq.returns';
        if (lowerText.includes('vegano') || lowerText.includes('vegan') || lowerText.includes('animal') || lowerText.includes('natural') || lowerText.includes('cruelty')) return 'helpbot.faq.products';
        if (lowerText.includes('pele') || lowerText.includes('piel') || lowerText.includes('skin') || lowerText.includes('rostro') || lowerText.includes('rosto') || lowerText.includes('face')) return 'helpbot.faq.skin';
        if (lowerText.includes('maquiagem') || lowerText.includes('maquillaje') || lowerText.includes('makeup') || lowerText.includes('batom') || lowerText.includes('labial') || lowerText.includes('lipstick')) return 'helpbot.faq.makeup';
        return 'helpbot.faq.unknown';
    };

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), text: input, isBot: false };
        setMessages(prev => [...prev, userMsg]);
        const inputCopy = input;
        setInput('');

        setTimeout(() => {
            const botMsg = { id: Date.now() + 1, key: getBotResponseKey(inputCopy), isBot: true };
            setMessages(prev => [...prev, botMsg]);
        }, 800);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[55]">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30, rotate: 2 }}
                        animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 30, rotate: -2 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                        className="absolute bottom-20 right-0 w-[350px] max-w-[calc(100vw-3rem)] h-[min(580px,calc(100vh-8rem))] bg-white rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col border border-[#F1EBE6]"
                    >
                        {/* Header */}
                        <div className="bg-[#2C2826] p-7 text-white flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-[#C4A49A] flex items-center justify-center shadow-inner relative">
                                    <Sparkles size={20} className="text-white" />
                                    <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#2C2826] rounded-full"></div>
                                </div>
                                <div>
                                    <h3 className="text-[14px] font-bold uppercase tracking-tight">{t('helpbot.title')}</h3>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                        <span className="text-[10px] text-white/50 uppercase tracking-widest font-medium">{t('helpbot.subtitle')}</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
                            >
                                <X size={20} className="text-white/60" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-6 bg-[#FCFAF8] space-y-5 custom-scrollbar">
                            {messages.map(msg => (
                                <motion.div
                                    initial={{ opacity: 0, x: msg.isBot ? -10 : 10, y: 10 }}
                                    animate={{ opacity: 1, x: 0, y: 0 }}
                                    key={msg.id}
                                    className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
                                >
                                    <div className={`max-w-[85%] p-4 rounded-2xl text-[13px] leading-relaxed shadow-sm
                                        ${msg.isBot ? 'bg-white text-[#2C2826] border border-[#F1EBE6] rounded-tl-none' : 'bg-[#C4A49A] text-white rounded-tr-none'}
                                    `}>
                                        {renderMsg(msg)}
                                    </div>
                                </motion.div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-5 bg-white border-t border-[#F1EBE6] flex gap-3">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder={t('helpbot.placeholder')}
                                className="flex-1 bg-[#FCFAF8] border border-[#F1EBE6] rounded-2xl px-5 py-3.5 text-[14px] outline-none focus:border-[#C4A49A] transition-all placeholder:text-[#9C9490]"
                            />
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleSend}
                                className="w-14 h-14 bg-[#2C2826] text-white rounded-2xl flex items-center justify-center hover:bg-black transition-colors shadow-lg shadow-[#2C2826]/10"
                            >
                                <Send size={20} />
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95, rotate: -5 }}
                onClick={() => setIsOpen(!isOpen)}
                aria-label={t('helpbot.title')}
                className="w-16 h-16 bg-[#2C2826] text-white rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(44,40,38,0.3)] hover:shadow-[#C4A49A]/30 transition-all border-4 border-white relative group"
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={isOpen ? 'close' : 'open'}
                        initial={{ opacity: 0, rotate: -45, scale: 0.5 }}
                        animate={{ opacity: 1, rotate: 0, scale: 1 }}
                        exit={{ opacity: 0, rotate: 45, scale: 0.5 }}
                        transition={{ duration: 0.2 }}
                    >
                        {isOpen ? <X size={26} strokeWidth={1.5} /> : <MessageCircle size={26} strokeWidth={1.5} />}
                    </motion.div>
                </AnimatePresence>
            </motion.button>
        </div>
    );
}
