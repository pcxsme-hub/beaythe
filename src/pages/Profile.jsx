import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Plus, Info, User, Settings, LogOut, Check, X, MapPin, Trash2, Truck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Profile() {
    const [searchParams] = useSearchParams();
    const tabParam = searchParams.get('tab');
    const [activeTab, setActiveTab] = useState(tabParam || 'profile');
    const { t } = useLanguage();

    useEffect(() => {
        if (tabParam) {
            setActiveTab(tabParam);
        }
    }, [tabParam]);

    // User State
    const [userData, setUserData] = useState({
        name: t('profile.user_default_name'),
        email: t('profile.user_default_email')
    });
    const [isEditingPersonal, setIsEditingPersonal] = useState(false);
    const [tempUser, setTempUser] = useState({ ...userData });

    // Addresses State
    const [addresses, setAddresses] = useState([]);
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [editingAddressId, setEditingAddressId] = useState(null);
    const [newAddress, setNewAddress] = useState({ title: '', street: '', city: '', postal: '', country: '' });

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleSavePersonal = () => {
        setUserData({ ...tempUser });
        setIsEditingPersonal(false);
    };

    const handleCancelPersonal = () => {
        setTempUser({ ...userData });
        setIsEditingPersonal(false);
    };

    const handleAddAddress = () => {
        if (!newAddress.street || !newAddress.city) return;
        setAddresses([...addresses, { ...newAddress, id: Date.now() }]);
        setNewAddress({ title: '', street: '', city: '', postal: '', country: '' });
        setIsAddingAddress(false);
    };

    const handleDeleteAddress = (id) => {
        setAddresses(addresses.filter(addr => addr.id !== id));
    };

    const handleUpdateAddress = (id) => {
        setAddresses(addresses.map(addr => addr.id === id ? { ...newAddress, id } : addr));
        setEditingAddressId(null);
        setNewAddress({ title: '', street: '', city: '', postal: '', country: '' });
    };

    const startEditingAddress = (addr) => {
        setEditingAddressId(addr.id);
        setNewAddress({ ...addr });
    };

    return (
        <div className="min-h-screen w-full bg-[#FCFAF8] pb-24 text-[#2C2826]">
            {/* Account Sub-Nav */}
            <div className="w-full bg-white border-b border-[#F1EBE6] pt-8">
                <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex gap-12">
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`pb-4 text-[13px] font-bold uppercase tracking-widest transition-all relative ${activeTab === 'orders' ? 'text-[#2C2826]' : 'text-[#A69B97] hover:text-[#C4A49A]'}`}
                        >
                            {t('profile.orders')}
                            {activeTab === 'orders' && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 w-full h-0.5 bg-[#2C2826]" />}
                        </button>
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`pb-4 text-[13px] font-bold uppercase tracking-widest transition-all relative ${activeTab === 'profile' ? 'text-[#2C2826]' : 'text-[#A69B97] hover:text-[#C4A49A]'}`}
                        >
                            {t('profile.account')}
                            {activeTab === 'profile' && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 w-full h-0.5 bg-[#2C2826]" />}
                        </button>
                        <button
                            onClick={() => setActiveTab('track')}
                            className={`pb-4 text-[13px] font-bold uppercase tracking-widest transition-all relative ${activeTab === 'track' ? 'text-[#2C2826]' : 'text-[#A69B97] hover:text-[#C4A49A]'}`}
                        >
                            {t('profile.track_order')}
                            {activeTab === 'track' && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 w-full h-0.5 bg-[#2C2826]" />}
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                    {/* Sidebar */}
                    <div className="lg:col-span-3 space-y-2">
                        <div className="bg-white rounded-3xl p-6 border border-[#F1EBE6] shadow-sm mb-6">
                            <div className="w-16 h-16 rounded-full bg-[#F4EFEA] flex items-center justify-center text-[#C4A49A] text-xl font-bold mb-4">
                                {userData.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <h3 className="text-lg font-bold text-[#2C2826]">{userData.name}</h3>
                            <p className="text-[12px] text-[#A69B97]">{userData.email}</p>
                        </div>

                        <nav className="flex flex-col gap-1">
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`flex items-center gap-3 px-6 py-4 rounded-2xl transition-all text-left text-[13px] font-bold ${activeTab === 'profile' ? 'bg-white border-[#F1EBE6] border shadow-sm text-[#2C2826]' : 'text-[#8A7369] hover:bg-white hover:border-[#F1EBE6] border border-transparent'}`}
                            >
                                <User size={18} className={activeTab === 'profile' ? 'text-[#C4A49A]' : ''} /> {t('profile.account')}
                            </button>
                            <button
                                onClick={() => setActiveTab('track')}
                                className={`flex items-center gap-3 px-6 py-4 rounded-2xl transition-all text-left text-[13px] font-bold ${activeTab === 'track' ? 'bg-white border-[#F1EBE6] border shadow-sm text-[#2C2826]' : 'text-[#8A7369] hover:bg-white hover:border-[#F1EBE6] border border-transparent'}`}
                            >
                                <Truck size={18} className={activeTab === 'track' ? 'text-[#C4A49A]' : ''} /> {t('profile.track_order')}
                            </button>
                            <button className="flex items-center gap-3 px-6 py-4 rounded-2xl text-[#8A7369] text-[13px] font-medium hover:bg-white hover:border-[#F1EBE6] transition-all border border-transparent text-left">
                                <Settings size={18} /> {t('profile.settings')}
                            </button>
                            <button className="flex items-center gap-3 px-6 py-4 rounded-2xl text-[#E85D75] text-[13px] font-medium hover:bg-[#FFF5F6] transition-all border border-transparent mt-4 text-left">
                                <LogOut size={18} /> {t('profile.logout')}
                            </button>
                        </nav>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-9 space-y-8">
                        <h2 className="text-4xl font-black text-[#2C2826] tracking-tighter mb-4">
                            {activeTab === 'profile' ? t('profile.account') : activeTab === 'track' ? t('profile.track_order') : t('profile.orders')}
                        </h2>

                        {activeTab === 'profile' ? (
                            <>
                                {/* Personal Data Card */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white rounded-[32px] p-8 md:p-12 border border-[#F1EBE6] shadow-sm"
                                >
                                    <div className="flex justify-between items-start mb-10">
                                        <h3 className="text-xl font-bold text-[#2C2826]">{t('profile.personal_data')}</h3>
                                        {!isEditingPersonal ? (
                                            <button
                                                onClick={() => setIsEditingPersonal(true)}
                                                className="text-[#8A7369] hover:text-[#2C2826] transition-colors flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider"
                                            >
                                                <Edit2 size={14} /> {t('common.edit')}
                                            </button>
                                        ) : (
                                            <div className="flex gap-4">
                                                <button onClick={handleCancelPersonal} className="text-[#A69B97] hover:text-[#E85D75] transition-colors flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider">
                                                    <X size={14} /> {t('common.cancel')}
                                                </button>
                                                <button onClick={handleSavePersonal} className="text-[#C4A49A] hover:text-[#8A7369] transition-colors flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider">
                                                    <Check size={14} /> {t('common.save')}
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div>
                                            <p className="text-[11px] font-bold text-[#A69B97] uppercase tracking-[0.2em] mb-2">{t('auth.name_label')}</p>
                                            {isEditingPersonal ? (
                                                <input
                                                    type="text"
                                                    value={tempUser.name}
                                                    onChange={(e) => setTempUser({ ...tempUser, name: e.target.value })}
                                                    className="w-full bg-[#FCFAF8] border border-[#F1EBE6] rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#C4A49A] text-[15px]"
                                                />
                                            ) : (
                                                <p className="text-[15px] text-[#2C2826] font-medium">{userData.name}</p>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-bold text-[#A69B97] uppercase tracking-[0.2em] mb-2">{t('auth.email_label')}</p>
                                            {isEditingPersonal ? (
                                                <input
                                                    type="email"
                                                    value={tempUser.email}
                                                    onChange={(e) => setTempUser({ ...tempUser, email: e.target.value })}
                                                    className="w-full bg-[#FCFAF8] border border-[#F1EBE6] rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#C4A49A] text-[15px]"
                                                />
                                            ) : (
                                                <p className="text-[15px] text-[#2C2826] font-medium">{userData.email}</p>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Addresses Card */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="bg-white rounded-[32px] p-8 md:p-12 border border-[#F1EBE6] shadow-sm"
                                >
                                    <div className="flex justify-between items-center mb-10">
                                        <h3 className="text-xl font-bold text-[#2C2826]">{t('profile.addresses')}</h3>
                                        {!isAddingAddress && (
                                            <button
                                                onClick={() => { setIsAddingAddress(true); setEditingAddressId(null); setNewAddress({ title: '', street: '', city: '', postal: '', country: '' }); }}
                                                className="flex items-center gap-2 text-[12px] font-bold text-white bg-[#2C2826] py-3 px-6 rounded-xl hover:bg-black transition-all shadow-md"
                                            >
                                                <Plus size={16} strokeWidth={3} />
                                                {t('profile.add_address')}
                                            </button>
                                        )}
                                    </div>

                                    {/* Address List */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                        {addresses.map((addr) => (
                                            <div key={addr.id} className="group relative bg-[#FCFAF8] border border-[#F1EBE6] rounded-[24px] p-6 hover:shadow-md transition-all">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#C4A49A]">
                                                            <MapPin size={18} />
                                                        </div>
                                                        <span className="text-[14px] font-bold text-[#2C2826]">{addr.title || t('profile.addresses')}</span>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button onClick={() => startEditingAddress(addr)} className="p-2 text-[#A69B97] hover:text-[#C4A49A] transition-colors"><Edit2 size={16} /></button>
                                                        <button onClick={() => handleDeleteAddress(addr.id)} className="p-2 text-[#A69B97] hover:text-[#E85D75] transition-colors"><Trash2 size={16} /></button>
                                                    </div>
                                                </div>
                                                <p className="text-[14px] text-[#5C534F] leading-relaxed">
                                                    {addr.street}<br />
                                                    {addr.postal} {addr.city}<br />
                                                    {addr.country}
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    <AnimatePresence>
                                        {(isAddingAddress || editingAddressId) && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="bg-[#FCFAF8] rounded-[24px] p-8 border border-[#F1EBE6] overflow-hidden"
                                            >
                                                <h4 className="text-[15px] font-bold text-[#2C2826] mb-6">
                                                    {editingAddressId ? t('profile.edit_address') : t('profile.add_address')}
                                                </h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="md:col-span-2">
                                                        <input
                                                            placeholder={t('profile.address_form.label')}
                                                            value={newAddress.title}
                                                            onChange={(e) => setNewAddress({ ...newAddress, title: e.target.value })}
                                                            className="w-full bg-white border border-[#F1EBE6] rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#C4A49A]"
                                                        />
                                                    </div>
                                                    <div className="md:col-span-2">
                                                        <input
                                                            placeholder={t('profile.address_form.street')}
                                                            value={newAddress.street}
                                                            onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                                                            className="w-full bg-white border border-[#F1EBE6] rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#C4A49A]"
                                                        />
                                                    </div>
                                                    <input
                                                        placeholder={t('profile.address_form.city')}
                                                        value={newAddress.city}
                                                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                                                        className="w-full bg-white border border-[#F1EBE6] rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#C4A49A]"
                                                    />
                                                    <input
                                                        placeholder={t('profile.address_form.postal')}
                                                        value={newAddress.postal}
                                                        onChange={(e) => setNewAddress({ ...newAddress, postal: e.target.value })}
                                                        className="w-full bg-white border border-[#F1EBE6] rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#C4A49A]"
                                                    />
                                                    <div className="md:col-span-2">
                                                        <input
                                                            placeholder={t('profile.address_form.country')}
                                                            value={newAddress.country}
                                                            onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                                                            className="w-full bg-white border border-[#F1EBE6] rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#C4A49A]"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex justify-end gap-4 mt-8">
                                                    <button onClick={() => { setIsAddingAddress(false); setEditingAddressId(null); }} className="px-6 py-3 rounded-xl text-[#8A7369] font-bold hover:bg-[#F4EFEA] transition-all text-sm">{t('common.cancel')}</button>
                                                    <button
                                                        onClick={() => editingAddressId ? handleUpdateAddress(editingAddressId) : handleAddAddress()}
                                                        className="px-8 py-3 rounded-xl bg-[#2C2826] text-white font-bold hover:bg-black transition-all shadow-md text-sm"
                                                    >
                                                        {t('common.save')}
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {addresses.length === 0 && !isAddingAddress && (
                                        <div className="bg-[#FAF7F5] border-2 border-dashed border-[#EBE1DA] rounded-[24px] py-12 flex flex-col items-center justify-center text-center px-6">
                                            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-[#A69B97] mb-4 shadow-sm">
                                                <Info size={24} />
                                            </div>
                                            <p className="text-[15px] text-[#5C534F] font-light italic">{t('profile.addresses_desc')}</p>
                                        </div>
                                    )}
                                </motion.div>
                            </>
                        ) : activeTab === 'track' ? (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-[32px] p-12 border border-[#F1EBE6] text-center max-w-2xl mx-auto"
                            >
                                <Truck size={48} className="mx-auto text-[#EBE1DA] mb-6" />
                                <h3 className="text-2xl font-black text-[#2C2826] mb-4 tracking-tighter">{t('profile.track_order')}</h3>
                                <p className="text-[#A69B97] mb-8 font-light max-w-md mx-auto text-[15px]">
                                    {t('profile.track_desc')}
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 mb-4 justify-center">
                                    <input
                                        type="text"
                                        placeholder={t('profile.track_placeholder')}
                                        className="w-full sm:w-64 bg-[#FCFAF8] border border-[#F1EBE6] rounded-xl px-6 py-4 focus:outline-none focus:ring-1 focus:ring-[#C4A49A] text-[15px] text-center sm:text-left placeholder:text-[#C4A49A]/60"
                                    />
                                    <button className="bg-[#2C2826] text-white px-8 py-4 rounded-xl font-bold hover:bg-black transition-all shadow-md active:scale-95 uppercase tracking-widest text-sm">
                                        {t('profile.track_order')}
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-[32px] p-12 border border-[#F1EBE6] text-center"
                            >
                                <MapPin size={48} className="mx-auto text-[#EBE1DA] mb-6" />
                                <h3 className="text-xl font-bold text-[#2C2826] mb-2">{t('profile.orders')}</h3>
                                <p className="text-[#A69B97] max-w-sm mx-auto font-light">
                                    {t('profile.track_no_orders')}
                                </p>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
