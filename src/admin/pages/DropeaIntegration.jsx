import React, { useState, useEffect, useRef } from 'react';
import { getSettings, updateSettings, getDropeaCatalog, importFromDropea } from '../services/db';
import { Settings2, Sparkles, DownloadCloud, Box, AlertCircle, CopyCheck, ChevronLeft, ChevronRight, Search, Plus } from 'lucide-react';

export default function DropeaIntegration() {
    // Pricing Settings
    const [margin, setMargin] = useState(30);
    const [shipping, setShipping] = useState(7);
    const [isSavingSettings, setIsSavingSettings] = useState(false);

    // Catalog & Categories
    const [catalogItems, setCatalogItems] = useState([]);
    const [isLoadingCatalog, setIsLoadingCatalog] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [activeCategory, setActiveCategory] = useState('Todas');
    const [manualId, setManualId] = useState('');
    const scrollRef = useRef(null);

    // Mass Import progress
    const [importingState, setImportingState] = useState({ active: false, current: 0, total: 0, productName: '' });

    useEffect(() => {
        loadSettings();
        loadCatalog(true);
    }, []);

    const loadSettings = async () => {
        const settings = await getSettings();
        setMargin(settings.profit_margin_percent || 30);
        setShipping(settings.fixed_shipping_cost || 7);
    };

    const handleSaveSettings = async () => {
        setIsSavingSettings(true);
        await updateSettings({ profit_margin_percent: margin, fixed_shipping_cost: shipping });
        setIsSavingSettings(false);
        alert("Parâmetros Globais de Precificação atualizados com sucesso!");
    };

    const loadCatalog = async (reset = true) => {
        if (reset) {
            setIsLoadingCatalog(true);
            setCurrentPage(1);
            const data = await getDropeaCatalog(1);
            setCatalogItems(data);
            setIsLoadingCatalog(false);
        } else {
            setIsLoadingMore(true);
            const next = currentPage + 1;
            setCurrentPage(next);
            const data = await getDropeaCatalog(next);
            setCatalogItems(prev => [...prev, ...data]);
            setIsLoadingMore(false);
        }
    };

    const scroll = (direction) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: direction === 'left' ? -200 : 200, behavior: 'smooth' });
        }
    };

    const handleImportSingle = async (dropeaId) => {
        setImportingState({ active: true, current: 1, total: 1, productName: 'Sincronizando item...' });
        try {
            const res = await importFromDropea(dropeaId.toString());
            if (res.error) alert(`Erro: ${res.error}`);
            else {
                alert(`Sucesso! O produto "${res.name}" foi sincronizado ao Inventário.`);
                setCatalogItems(prev => prev.filter(c => c.id !== dropeaId));
            }
        } catch (error) {
            console.error(error);
            alert('Falha na comunicação com o servidor.');
        } finally {
            setImportingState({ active: false, current: 0, total: 0, productName: '' });
        }
    };

    const [isMasterSyncing, setIsMasterSyncing] = useState(false);
    const handleMasterSync = async () => {
        if (!window.confirm("Deseja sincronizar TODOS os produtos do catálogo Dropea (49+ itens) com sua loja automaticamente?")) return;
        setIsMasterSyncing(true);
        try {
            const res = await bulkSyncDropea();
            alert(`Sincronização Mestra Concluída! ${res.count} produtos novos ou atualizados.`);
            loadCatalog(true);
        } catch (e) {
            alert("Erro na sincronização mestra.");
        } finally {
            setIsMasterSyncing(false);
        }
    };

    const handleImportCategoryMassive = async () => {
        if (filteredCatalog.length === 0) return;

        const confirmStr = `Você está prestes a importar ${filteredCatalog.length} produtos da categoria "${activeCategory}" para a sua loja de uma só vez. Deseja prosseguir?`;
        if (!window.confirm(confirmStr)) return;

        setImportingState({ active: true, current: 0, total: filteredCatalog.length, productName: 'Iniciando Lote...' });

        let successCount = 0;
        let importedIds = [];
        let c = 0;

        for (const item of filteredCatalog) {
            c++;
            setImportingState(prev => ({ ...prev, current: c, productName: item.name }));
            try {
                const res = await importFromDropea(item.id.toString());
                if (!res.error) {
                    successCount++;
                    importedIds.push(item.id);
                }
            } catch (e) { console.log('Mass import error on id', item.id); }

            // Artificial tiny delay against spamming upstream API
            await new Promise(r => setTimeout(r, 200));
        }

        setCatalogItems(prev => prev.filter(c => !importedIds.includes(c.id)));
        setImportingState({ active: false, current: 0, total: 0, productName: '' });
        alert(`Integração em Massa Concluída! ${successCount} de ${filteredCatalog.length} produtos foram adicionados ao Inventário Oculto com a nova regra de preço.`);
    };

    // Derived State for Categories
    const [searchQuery, setSearchQuery] = useState('');
    const uniqueCategories = ['Todas', 'Beleza', ...new Set(catalogItems.map(item => item.category).filter(Boolean))].sort();

    const filteredCatalog = catalogItems.filter(p => {
        const pCat = (p.category || '').toLowerCase();
        const activeCat = activeCategory.toLowerCase();

        // Beauty meta-category keywords
        const beautyKeywords = ['beleza', 'beauty', 'cosmetic', 'maquillaje', 'maquiagem', 'perfum', 'higiene', 'saúde', 'salud', 'piel', 'pele', 'rostro', 'rosto'];

        const isBeautyMatch = activeCat === 'beleza' && (
            pCat.includes('beleza') ||
            beautyKeywords.some(kw => pCat.includes(kw) || p.name?.toLowerCase().includes(kw))
        );

        const matchesCategory = activeCategory === 'Todas' || pCat === activeCat || isBeautyMatch;

        const matchesSearch = p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            pCat.includes(searchQuery.toLowerCase());

        return matchesCategory && matchesSearch;
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <Sparkles className="text-rose-500" size={32} /> Central Dropea
                </h1>
                <p className="text-gray-500 mt-2 text-lg">Busque o catálogo de tendências e acesse o motor automático de precificação em massa.</p>
            </div>

            {/* Pricing Engine Dashboard */}
            <div className="bg-gradient-to-r from-gray-900 to-black rounded-3xl p-8 text-white flex flex-col md:flex-row gap-8 items-center justify-between shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="flex items-center gap-6 relative z-10 w-full md:w-auto">
                    <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center">
                        <Settings2 size={32} className="text-rose-400" />
                    </div>
                    <div>
                        <h2 className="font-bold text-xl tracking-wide">Motor de Preços</h2>
                        <p className="text-gray-400 text-sm font-mono mt-1">Preço Venda = Custo * (1 + Margem/100) <span className="text-gray-500">· frete cobrado no checkout</span></p>
                    </div>
                </div>
                <div className="flex flex-wrap items-end gap-6 relative z-10 w-full md:w-auto">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">+ Margem (%)</label>
                        <input
                            type="number"
                            value={margin}
                            onChange={e => setMargin(e.target.value)}
                            className="bg-white/10 border border-white/20 text-white rounded-xl px-5 py-3 w-36 outline-none focus:border-rose-500 focus:bg-white/20 transition-all font-mono text-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Frete checkout (€)</label>
                        <input
                            type="number"
                            value={shipping}
                            onChange={e => setShipping(e.target.value)}
                            className="bg-white/10 border border-white/20 text-white rounded-xl px-5 py-3 w-36 outline-none focus:border-rose-500 focus:bg-white/20 transition-all font-mono text-lg"
                        />
                    </div>
                    <button
                        onClick={handleSaveSettings}
                        disabled={isSavingSettings}
                        className="bg-rose-600 hover:bg-rose-500 text-white font-bold h-[54px] px-8 rounded-xl transition-all shadow-lg shadow-rose-900/50 hover:-translate-y-0.5 active:translate-y-0"
                    >
                        {isSavingSettings ? '...' : 'Salvar Regra'}
                    </button>
                </div>
            </div>

            {/* Dropea Marketplace */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden flex flex-col min-h-[600px]">
                {/* Header Superior do Catálogo */}
                <div className="p-6 md:p-8 border-b border-gray-100 flex flex-col xl:flex-row justify-between items-start xl:items-center bg-gray-50/50 gap-6">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            Marketplace Oficial
                        </h3>
                        <p className="text-sm text-gray-500 mt-1 font-medium">Exibindo {catalogItems.length} produtos. Página: {currentPage}</p>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 w-full xl:w-auto items-stretch md:items-center">
                        <div className="flex items-center bg-white border border-gray-200 rounded-xl px-2 shadow-sm flex-1 md:flex-auto">
                            <Search className="text-gray-400 ml-2" size={18} />
                            <input type="text" placeholder="Buscar catálogo (ex: Beleza)..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="bg-transparent border-none outline-none px-3 py-3 text-sm flex-1" />
                        </div>
                        <div className="flex items-center bg-white border border-gray-200 rounded-xl px-2 shadow-sm flex-1 md:flex-auto">
                            <Box className="text-gray-400 ml-2" size={18} />
                            <input type="text" placeholder="ID Dropea..." value={manualId} onChange={e => setManualId(e.target.value)} className="bg-transparent border-none outline-none px-3 py-3 text-sm w-full md:w-36 font-mono" />
                            <button onClick={() => { handleImportSingle(manualId); setManualId(''); }} disabled={!manualId} className="bg-black text-white p-2 rounded-lg hover:bg-gray-800 disabled:opacity-50">
                                <Plus size={16} />
                            </button>
                        </div>
                        <button
                            onClick={handleMasterSync}
                            disabled={isMasterSyncing}
                            className="px-5 py-3 bg-rose-600 border border-rose-600 text-white font-bold rounded-xl text-sm hover:bg-rose-500 transition-all shadow-lg shadow-rose-900/20 whitespace-nowrap flex items-center justify-center gap-2 hover:-translate-y-0.5"
                        >
                            {isMasterSyncing ? 'Sincronizando...' : 'Sincronizar Todo o Catálogo'} <Sparkles size={16} />
                        </button>
                        <button onClick={() => loadCatalog(true)} className="px-5 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl text-sm hover:bg-gray-50 transition-colors shadow-sm whitespace-nowrap">
                            Recarregar API
                        </button>
                        <button onClick={() => loadCatalog(false)} disabled={isLoadingMore} className="px-5 py-3 bg-gray-900 border border-gray-900 text-white font-bold rounded-xl text-sm hover:bg-black transition-colors shadow-sm whitespace-nowrap flex items-center justify-center gap-2">
                            {isLoadingMore ? 'Buscando...' : 'Mais Produtos'} <DownloadCloud size={16} />
                        </button>
                    </div>
                </div>

                {/* Main Content Split: Categories & Grid */}
                {isLoadingCatalog ? (
                    <div className="flex-1 flex flex-col items-center justify-center py-32 opacity-50 bg-gray-50/30">
                        <DownloadCloud size={48} className="animate-bounce text-gray-400 mb-6" />
                        <p className="font-bold text-gray-600 text-lg">Buscando o ecossistema Dropshipping completo...</p>
                    </div>
                ) : (
                    <div className="flex flex-col flex-1">
                        {/* Categories Bar */}
                        <div className="relative group border-b border-gray-100 bg-white bg-opacity-95 backdrop-blur-md sticky top-0 z-10 flex items-center">
                            <button onClick={() => scroll('left')} className="absolute left-0 z-20 h-full px-2 bg-gradient-to-r from-white to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                <ChevronLeft className="text-gray-600" />
                            </button>
                            <div ref={scrollRef} className="px-6 py-4 flex gap-3 overflow-x-auto w-full scroll-smooth" style={{ scrollbarWidth: 'none' }}>
                                {uniqueCategories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setActiveCategory(cat)}
                                        className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border shadow-sm ${activeCategory === cat ? 'bg-black text-white border-black scale-105' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                            <button onClick={() => scroll('right')} className="absolute right-0 z-20 h-full px-2 bg-gradient-to-l from-white to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                <ChevronRight className="text-gray-600" />
                            </button>
                        </div>

                        {/* Painel de Ação da Categoria Selecionada */}
                        {activeCategory !== 'Todas' && filteredCatalog.length > 0 && (
                            <div className="bg-rose-50/50 px-8 py-5 border-b border-rose-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <AlertCircle className="text-rose-600" size={20} />
                                    <span className="text-rose-900 font-medium"><b>{filteredCatalog.length}</b> itens encontrados da categoria <b>{activeCategory}</b>.</span>
                                </div>
                                <button
                                    onClick={handleImportCategoryMassive}
                                    disabled={importingState.active}
                                    className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg flex items-center gap-2 transition-all disabled:opacity-50"
                                >
                                    <CopyCheck size={18} />
                                    Importar {filteredCatalog.length} itens de uma vez
                                </button>
                            </div>
                        )}

                        {/* Barra de Progresso do Mass Import */}
                        {importingState.active && (
                            <div className="px-8 py-5 border-b border-rose-200 bg-white">
                                <div className="flex justify-between text-sm font-bold mb-2">
                                    <span className="text-gray-900 animate-pulse">{importingState.productName}</span>
                                    <span className="text-rose-600">{importingState.current} / {importingState.total} Concluídos</span>
                                </div>
                                <div className="h-3 bg-gray-100 rounded-full overflow-hidden w-full">
                                    <div className="h-full bg-rose-500 transition-all duration-300 shadow-[0_0_10px_rgba(244,63,94,0.5)]" style={{ width: `${(importingState.current / importingState.total) * 100}%` }}></div>
                                </div>
                            </div>
                        )}

                        {/* Grid */}
                        <div className="p-8 bg-gray-50/30 flex-1 relative">
                            {importingState.active && (
                                <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-20"></div> // overlay block interaction
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredCatalog.map(item => (
                                    <div key={item.id} className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col hover:shadow-xl hover:border-gray-300 transition-all group">
                                        {item.image && (
                                            <div className="w-full aspect-square bg-gray-50 rounded-xl overflow-hidden mb-4 relative">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                                {item.category && (
                                                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 text-[10px] font-black uppercase tracking-wider text-black rounded-lg shadow-sm">
                                                        {item.category}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        <div className="flex flex-col flex-1">
                                            <h4 className="font-bold text-gray-900 text-[15px] leading-snug line-clamp-2 h-10" title={item.name}>{item.name}</h4>
                                            <p className="text-xs text-gray-500 font-mono mt-3 break-all">DId: {item.id}</p>

                                            <div className="mt-4 pt-4 flex flex-col gap-2 border-t border-gray-100">
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="text-gray-500 font-medium">Seu Custo Total</span>
                                                    <span className="font-bold text-gray-400 line-through">€ {parseFloat(item.cost_price || item.pvpr || 0).toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-sm bg-rose-50/50 p-2 rounded-lg border border-rose-100/50 -mx-1">
                                                    <span className="font-bold text-rose-800">Preço Calculado</span>
                                                    <span className="font-bold text-rose-600 text-lg tracking-tight">€ {item.suggested_sell_price?.toFixed(2)}</span>
                                                </div>
                                                <button
                                                    onClick={() => handleImportSingle(item.id)}
                                                    className="w-full mt-3 border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white text-sm font-bold py-2.5 rounded-xl transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2"
                                                >
                                                    <DownloadCloud size={16} /> Importar Item Único
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {filteredCatalog.length === 0 && (
                                    <div className="col-span-full py-20 text-center text-gray-500 font-medium bg-white rounded-2xl border border-gray-200 border-dashed">
                                        Nenhum produto listado pela Dropshipping para os filtros selecionados.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
