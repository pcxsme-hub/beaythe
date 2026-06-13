// src/App.jsx
import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useTheme, applyThemeVars } from './hooks/useTheme';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import FavoritesDrawer from './components/FavoritesDrawer';
import AuthDrawer from './components/AuthDrawer';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';

// Pages
import Home from './pages/Home';
import Historia from './pages/Historia';
// Admin V2 Subsystem
import AdminLayout from './admin/layouts/AdminLayout';
import AdminDashboard from './admin/pages/AdminDashboard';
import SalesDashboard from './admin/pages/SalesDashboard';
import PriceAudit from './admin/pages/PriceAudit';
import Inventory from './admin/pages/Inventory';
import StorefrontManager from './admin/pages/StorefrontManager';
import DropeaIntegration from './admin/pages/DropeaIntegration';
import ProductEditor from './admin/pages/ProductEditor';
import LandingEngine from './admin/pages/LandingEngine';
import HomeBuilder from './admin/pages/HomeBuilder';
import SiteCopyAdmin from './admin/pages/SiteCopy';
import NavBuilder from './admin/pages/NavBuilder';
import ThemeAdmin from './admin/pages/ThemeAdmin';
import Marketing from './admin/pages/Marketing';
import Categoria from './pages/Categoria';
import SearchResults from './pages/SearchResults';
import Checkout from './pages/Checkout';
import CheckoutSuccess from './pages/CheckoutSuccess';
import Producto from './pages/Producto';
import Profile from './pages/Profile';
import Ajuda from './pages/Ajuda';
import FAQPage from './pages/FAQPage';
import NewsletterPopup from './components/NewsletterPopup';
import HelpBot from './components/HelpBot';
import CROBanners from './components/CROBanners';
import CookieConsent from './components/CookieConsent';
import { useCart } from './context/CartContext';
import { useFavorites } from './context/FavoritesContext';

// Admin Layer
import AdminRouter from './admin/AdminRouter';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  const { pathname } = useLocation();
  const { isCartOpen, setIsCartOpen } = useCart();
  const { isFavoritesOpen, closeFavorites, openFavorites } = useFavorites();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const theme = useTheme();
  useEffect(() => { applyThemeVars(theme); }, [theme]);

  // Isolate Admin Rendering from Public UI
  const isAdmin = pathname.startsWith('/admin-core-sys');
  if (isAdmin) {
    return (
      <div className="font-sans text-[#2C2826]">
        <Routes>
          {/* Rota do Admin (Isolada, Sem Header/Footer Público) */}
          <Route path="/admin-core-sys" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="sales" element={<SalesDashboard />} />
            <Route path="price-audit" element={<PriceAudit />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="storefront" element={<StorefrontManager />} />
            <Route path="dropea" element={<DropeaIntegration />} />
            <Route path="landing-engine" element={<LandingEngine />} />
            <Route path="home-builder" element={<HomeBuilder />} />
            <Route path="site-copy" element={<SiteCopyAdmin />} />
            <Route path="navigation" element={<NavBuilder />} />
            <Route path="theme" element={<ThemeAdmin />} />
            <Route path="marketing" element={<Marketing />} />
            <Route path="produtos/editar/:id" element={<ProductEditor />} />
          </Route>
        </Routes>
      </div>
    );
  }

  const isHeroPage = pathname === '/' || pathname === '/historia';

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#FCFAF8] overflow-x-hidden text-[#2C2826]">
      <ScrollToTop />

      <Navbar
        onCartClick={() => setIsCartOpen(true)}
        onFavoritesClick={openFavorites}
        onUserClick={() => setIsAuthOpen(true)}
      />
      <CartDrawer />
      <FavoritesDrawer isOpen={isFavoritesOpen} onClose={closeFavorites} />
      <AuthDrawer isOpen={isAuthOpen} onClose={setIsAuthOpen.bind(null, false)} />

      <main className={`flex-grow ${isHeroPage ? '' : 'pt-[140px] md:pt-[170px]'}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/historia" element={<Historia />} />
          <Route path="/producto/:id" element={<Producto />} />
          <Route path="/producto" element={<Producto />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/categoria/:slug" element={<Categoria />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout/success" element={<CheckoutSuccess />} />
          <Route path="/ajuda" element={<Ajuda />} />
          <Route path="/faq" element={<FAQPage />} />
        </Routes>
      </main>

      <Footer />
      <HelpBot />
      <NewsletterPopup />
      <CROBanners />
      <CookieConsent />
      <BackToTop />
    </div>
  );
}

export default App;
