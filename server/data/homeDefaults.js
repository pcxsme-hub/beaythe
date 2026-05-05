// Default homepage layout. The shipped order matches what Home.jsx renders today.
// Admin can reorder, toggle, or override settings per section. Storage = JSON in
// HomeConfig.sections.
//
// Section types align with the React components in src/components/.

export const DEFAULT_HOME_SECTIONS = [
    { id: 'carousel', type: 'FeaturedCarousel', enabled: true, order: 1, settings: {} },
    { id: 'marquee', type: 'Marquee', enabled: true, order: 2, settings: {} },
    {
        id: 'about', type: 'AboutUs', enabled: true, order: 3,
        settings: {
            image_url: 'https://images.unsplash.com/photo-1552693673-1bf958298935?auto=format&fit=crop&q=80',
            tag_es: 'Valores y Propósitos',
            tag_pt: 'Valores e Propósitos',
            tag_en: 'Values & Purpose',
            title_1_es: 'Te invitamos a ser', title_1_pt: 'Convidamos-te a fazer', title_1_en: 'We invite you to be',
            title_2_es: 'parte de nuestra historia', title_2_pt: 'parte da nossa história', title_2_en: 'part of our story',
            desc_es: 'Únete a nosotros en este viaje y descubre lo que significa cuidarse con cariño y propósito.',
            desc_pt: 'Junta-te a nós nesta viagem e descobre o que significa cuidar de ti com carinho e propósito.',
            desc_en: 'Join us in this journey and discover what it means to care for yourself with love and purpose.',
            cta_es: 'Ver más', cta_pt: 'Saber mais', cta_en: 'Learn more',
            cta_link: '/historia'
        }
    },
    {
        id: 'hero', type: 'HeroCards', enabled: true, order: 4,
        settings: {
            cards: [
                {
                    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80',
                    title_es: 'Cuidado Facial', title_pt: 'Cuidado Facial', title_en: 'Skin Care',
                    desc_es: 'Sérums y cremas de alta eficacia.', desc_pt: 'Sérums e cremes de alta eficácia.', desc_en: 'High-efficacy serums and creams.',
                    cta_link: '/categoria/rostro'
                },
                {
                    image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80',
                    title_es: 'Cuidado Capilar', title_pt: 'Cuidado Capilar', title_en: 'Hair Care',
                    desc_es: 'Brillo y nutrición para tu melena.', desc_pt: 'Brilho e nutrição para o seu cabelo.', desc_en: 'Shine and nourishment for your hair.',
                    cta_link: '/categoria/cabello'
                },
                {
                    image: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&q=80',
                    title_es: 'Manos y Pies', title_pt: 'Mãos e Pés', title_en: 'Hands & Feet',
                    desc_es: 'Suavidad y nutrición diaria.', desc_pt: 'Suavidade e nutrição diária.', desc_en: 'Daily softness and nourishment.',
                    cta_link: '/categoria/manos-pies'
                }
            ]
        }
    },
    { id: 'quiz', type: 'SkinQuiz', enabled: true, order: 5, settings: {} },
    { id: 'circular', type: 'CircularCategories', enabled: true, order: 6, settings: {} },
    { id: 'tabs', type: 'ProductTabs', enabled: true, order: 7, settings: {} },
    {
        id: 'trust', type: 'TrustStrip', enabled: true, order: 8,
        settings: {
            items: [
                { icon: 'Truck', title_es: 'ENVÍO GRATUITO DESDE 50€', title_pt: 'ENVIO GRATUITO A PARTIR DE 50€', title_en: 'FREE SHIPPING FROM €50' },
                { icon: 'Headphones', title_es: 'SOPORTE AL CLIENTE 24/7', title_pt: 'APOIO AO CLIENTE 24/7', title_en: '24/7 CUSTOMER SUPPORT' },
                { icon: 'Layers', title_es: 'PRODUCTOS 100% VEGANOS', title_pt: 'PRODUTOS 100% VEGANOS', title_en: '100% VEGAN PRODUCTS' },
                { icon: 'PiggyBank', title_es: '30 DÍAS DE DEVOLUCIÓN', title_pt: '30 DIAS PARA DEVOLVER', title_en: '30-DAY RETURNS' },
                { icon: 'Calendar', title_es: 'ENTREGA EN 48/72 HORAS', title_pt: 'ENTREGA EM 48/72 HORAS', title_en: 'DELIVERY IN 48/72 HOURS' }
            ]
        }
    },
    { id: 'trending-new', type: 'TrendingProducts', enabled: true, order: 9, settings: { sourceType: 'new', overrideTitle_es: 'Novedades', overrideTitle_pt: 'Novidades', overrideTitle_en: 'New' } },
    { id: 'trending', type: 'TrendingProducts', enabled: true, order: 10, settings: { sourceType: 'trending' } },
    { id: 'reviews', type: 'Reviews', enabled: true, order: 11, settings: {} },
    { id: 'faq', type: 'FAQ', enabled: true, order: 12, settings: {} }
];

export const SECTION_TYPE_META = {
    FeaturedCarousel: { label: 'Carrossel Hero', editable: false, color: 'rose' },
    Marquee: { label: 'Listra de mensagens', editable: false, color: 'gray' },
    AboutUs: { label: 'Bloco "Sobre nós"', editable: true, color: 'amber' },
    HeroCards: { label: '3 Cards de categoria', editable: true, color: 'rose' },
    SkinQuiz: { label: 'Quiz de pele', editable: false, color: 'purple' },
    CircularCategories: { label: 'Categorias circulares', editable: false, color: 'blue' },
    ProductTabs: { label: 'Tabs de produtos', editable: false, color: 'emerald' },
    TrustStrip: { label: 'Selos de confiança', editable: true, color: 'amber' },
    TrendingProducts: { label: 'Lista de produtos', editable: true, color: 'rose' },
    Reviews: { label: 'Avaliações', editable: false, color: 'gray' },
    FAQ: { label: 'Perguntas frequentes', editable: false, color: 'gray' }
};
