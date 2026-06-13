import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, PackageSearch, Store, Sparkles, Settings, Wand2, Layers, FileText, Compass, Palette, Megaphone, LineChart } from 'lucide-react';

export default function AdminLayout() {
    const location = useLocation();

    const menu = [
        { path: '/admin-core-sys', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { path: '/admin-core-sys/sales', label: 'Painel de Vendas', icon: <LineChart size={20} /> },
        { path: '/admin-core-sys/inventory', label: 'Inventário & Preços', icon: <PackageSearch size={20} /> },
        { path: '/admin-core-sys/storefront', label: 'Gestão de Vitrines', icon: <Store size={20} /> },
        { path: '/admin-core-sys/dropea', label: 'Marketplace Dropea', icon: <Sparkles size={20} /> },
        { path: '/admin-core-sys/landing-engine', label: 'Motor de Landing Pages', icon: <Wand2 size={20} /> },
        { path: '/admin-core-sys/home-builder', label: 'Construtor da Home', icon: <Layers size={20} /> },
        { path: '/admin-core-sys/site-copy', label: 'Conteúdo do Site', icon: <FileText size={20} /> },
        { path: '/admin-core-sys/navigation', label: 'Navegação & Menus', icon: <Compass size={20} /> },
        { path: '/admin-core-sys/theme', label: 'Tema & Branding', icon: <Palette size={20} /> },
        { path: '/admin-core-sys/marketing', label: 'Marketing & Cupons', icon: <Megaphone size={20} /> },
    ];

    // match exactly or starts with (excluding root edge case)
    const isRouteActive = (path) => {
        if (path === '/admin-core-sys') return location.pathname === '/admin-core-sys' || location.pathname === '/admin-core-sys/';
        return location.pathname.startsWith(path);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full z-20 shadow-sm">
                <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                    <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center font-bold text-lg tracking-wider">
                        B.
                    </div>
                    <div>
                        <h1 className="font-bold text-gray-900 leading-tight">Beauthé</h1>
                        <p className="text-xs text-rose-600 font-semibold tracking-wide">Core System V2</p>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {menu.map(item => {
                        const isActive = isRouteActive(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${isActive ? 'bg-rose-50 text-rose-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                <span className={isActive ? 'text-rose-600' : 'text-gray-400'}>{item.icon}</span>
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-100 pb-8 flex justify-center">
                    <Link to="/" className="text-xs font-bold text-gray-400 hover:text-black transition-colors underline underline-offset-4">
                        Acessar Loja Pública
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 ml-64 p-8 min-h-screen">
                <div className="max-w-[1200px] mx-auto w-full">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
