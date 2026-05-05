// Default site navigation: top nav, megamenu, footer columns. Admin can edit;
// these fall back when no DB row exists.

export const DEFAULT_TOP_NAV = [
    { key: 'rostro', label_es: 'Rostro', label_pt: 'Rosto', label_en: 'Face', link: '/categoria/rostro', hasMegaMenu: true, isOutlet: false },
    { key: 'cuerpo', label_es: 'Cuerpo y Baño', label_pt: 'Corpo & Banho', label_en: 'Body & Bath', link: '/categoria/cuerpo', hasMegaMenu: true, isOutlet: false },
    { key: 'cabello', label_es: 'Cabello', label_pt: 'Cabelo', label_en: 'Hair', link: '/categoria/cabello', hasMegaMenu: true, isOutlet: false },
    { key: 'perfumes', label_es: 'Perfumes', label_pt: 'Perfumes', label_en: 'Perfumes', link: '/categoria/perfumes', hasMegaMenu: true, isOutlet: false },
    { key: 'outlet', label_es: 'Outlet', label_pt: 'Outlet', label_en: 'Outlet', link: '/categoria/outlet', hasMegaMenu: true, isOutlet: true }
];

export const DEFAULT_MEGA_MENU = {
    rostro: [
        {
            name: 'cuidado_facial',
            label_es: 'Cuidado Facial', label_pt: 'Cuidado Facial', label_en: 'Skin Care',
            image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=300',
            link: '/categoria/rostro',
            items: [
                { name: 'limpiadores', label_es: 'Limpiadores', label_pt: 'Limpadores', label_en: 'Cleansers', link: '/categoria/limpiadores' },
                { name: 'tonicos', label_es: 'Tónicos', label_pt: 'Tónicos', label_en: 'Toners', link: '/categoria/tonicos' },
                { name: 'serums', label_es: 'Sérums', label_pt: 'Sérums', label_en: 'Serums', link: '/categoria/serums' },
                { name: 'cremas', label_es: 'Cremas', label_pt: 'Cremes', label_en: 'Creams', link: '/categoria/cremas' },
                { name: 'contorno', label_es: 'Contorno de Ojos', label_pt: 'Contorno de Olhos', label_en: 'Eye Contour', link: '/categoria/contorno' },
                { name: 'mascarillas', label_es: 'Mascarillas', label_pt: 'Máscaras', label_en: 'Masks', link: '/categoria/mascarillas' }
            ]
        },
        {
            name: 'maquillaje_facial',
            label_es: 'Maquillaje', label_pt: 'Maquilhagem', label_en: 'Makeup',
            image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=300',
            link: '/categoria/maquillaje',
            items: [
                { name: 'base', label_es: 'Bases', label_pt: 'Bases', label_en: 'Foundations', link: '/categoria/base' },
                { name: 'correctores', label_es: 'Correctores', label_pt: 'Corretores', label_en: 'Concealers', link: '/categoria/correctores' },
                { name: 'polvo', label_es: 'Polvos', label_pt: 'Pós', label_en: 'Powders', link: '/categoria/polvo' },
                { name: 'rubor', label_es: 'Colorete', label_pt: 'Blush', label_en: 'Blush', link: '/categoria/rubor' },
                { name: 'labios', label_es: 'Labios', label_pt: 'Lábios', label_en: 'Lips', link: '/categoria/labios' }
            ]
        }
    ],
    cuerpo: [
        { name: 'higiene', label_es: 'Higiene', label_pt: 'Higiene', label_en: 'Hygiene', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=300', link: '/categoria/higiene' },
        { name: 'hidratacion', label_es: 'Hidratación', label_pt: 'Hidratação', label_en: 'Hydration', image: 'https://images.unsplash.com/photo-1552046122-03184de85e08?auto=format&fit=crop&q=80&w=300', link: '/categoria/hidratacion' },
        { name: 'cuidados', label_es: 'Cuidados', label_pt: 'Cuidados', label_en: 'Care', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=300', link: '/categoria/cuidados' },
        { name: 'manos_pies', label_es: 'Manos y Pies', label_pt: 'Mãos e Pés', label_en: 'Hands & Feet', image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&q=80&w=300', link: '/categoria/manos-pies' }
    ],
    cabello: [
        {
            name: 'tratamiento',
            label_es: 'Tratamiento', label_pt: 'Tratamento', label_en: 'Treatment',
            image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=300',
            link: '/categoria/cabello',
            items: [
                { name: 'lavado', label_es: 'Lavado', label_pt: 'Lavagem', label_en: 'Wash', link: '/categoria/lavado' },
                { name: 'tratamiento', label_es: 'Tratamiento', label_pt: 'Tratamento', label_en: 'Treatment', link: '/categoria/tratamiento' }
            ]
        },
        {
            name: 'ferramentas',
            label_es: 'Herramientas', label_pt: 'Ferramentas', label_en: 'Tools',
            image: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&q=80&w=300',
            link: '/categoria/cabello',
            items: [
                { name: 'styling', label_es: 'Styling', label_pt: 'Styling', label_en: 'Styling', link: '/categoria/styling' },
                { name: 'cepillos', label_es: 'Escovas', label_pt: 'Escovas', label_en: 'Brushes', link: '/categoria/cepillos' },
                { name: 'planchas', label_es: 'Planchas', label_pt: 'Pranchas', label_en: 'Straighteners', link: '/categoria/planchas' }
            ]
        }
    ],
    perfumes: [
        { name: 'femeninos', label_es: 'Femeninos', label_pt: 'Femininos', label_en: "Women's", image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=300', link: '/categoria/perfumes' },
        { name: 'masculinos', label_es: 'Masculinos', label_pt: 'Masculinos', label_en: "Men's", image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=300', link: '/categoria/perfumes' },
        { name: 'unisex', label_es: 'Unisex', label_pt: 'Unissexo', label_en: 'Unisex', image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=300', link: '/categoria/perfumes' },
        { name: 'hogar', label_es: 'Hogar', label_pt: 'Casa', label_en: 'Home', image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=300', link: '/categoria/perfumes' }
    ],
    outlet: [
        { name: 'promociones', label_es: 'Promociones', label_pt: 'Promoções', label_en: 'Promotions', image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=300', link: '/categoria/outlet' },
        { name: 'ultimas', label_es: 'Últimas Unidades', label_pt: 'Últimas Unidades', label_en: 'Last Units', image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&q=80&w=300', link: '/categoria/outlet' },
        { name: 'best_sellers', label_es: 'Más Vendidos', label_pt: 'Mais Vendidos', label_en: 'Best Sellers', image: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&q=80&w=300', link: '/categoria/outlet' }
    ]
};

export const DEFAULT_FOOTER_COLUMNS = [
    {
        id: 'categories',
        title_es: 'Categorías', title_pt: 'Categorias', title_en: 'Categories',
        links: [
            { label_es: 'Rostro', label_pt: 'Rosto', label_en: 'Face', link: '/categoria/rostro' },
            { label_es: 'Maquillaje', label_pt: 'Maquilhagem', label_en: 'Makeup', link: '/categoria/maquillaje' },
            { label_es: 'Cuerpo', label_pt: 'Corpo', label_en: 'Body', link: '/categoria/cuerpo' },
            { label_es: 'Cabello', label_pt: 'Cabelo', label_en: 'Hair', link: '/categoria/cabello' },
            { label_es: 'Solares', label_pt: 'Solares', label_en: 'Sun Care', link: '/categoria/solares' }
        ]
    },
    {
        id: 'help',
        title_es: '¿Necesitas ayuda?', title_pt: 'Precisa de ajuda?', title_en: 'Need help?',
        links: [
            { label_es: 'Habla con nosotros', label_pt: 'Fala connosco', label_en: 'Contact us', link: '/ajuda' },
            { label_es: 'Preguntas Frecuentes', label_pt: 'Perguntas Frequentes', label_en: 'Frequently Asked Questions', link: '/faq' },
            { label_es: 'Centro de Atención', label_pt: 'Centro de Atendimento', label_en: 'Support Center', link: '/ajuda' }
        ]
    },
    {
        id: 'orders',
        title_es: 'Seguir mi compra', title_pt: 'Acompanhar compra', title_en: 'Track purchase',
        links: [
            { label_es: 'Mi cuenta', label_pt: 'Minha conta', label_en: 'My account', link: '/profile' },
            { label_es: 'Mis pedidos', label_pt: 'Meus pedidos', label_en: 'My orders', link: '/profile?tab=orders' },
            { label_es: 'Cambios y devoluciones', label_pt: 'Trocas e devoluções', label_en: 'Exchanges & returns', link: '/ajuda' },
            { label_es: 'Seguir entrega', label_pt: 'Rastrear entrega', label_en: 'Track delivery', link: '/profile?tab=track' }
        ]
    },
    {
        id: 'institutional',
        title_es: 'Institucional', title_pt: 'Institucional', title_en: 'Institutional',
        links: [
            { label_es: 'Quiénes somos', label_pt: 'Quem somos', label_en: 'About us', link: '/historia' },
            { label_es: 'Términos y Condiciones', label_pt: 'Termos e Condições', label_en: 'Terms & Conditions', link: '/faq' },
            { label_es: 'Política de Privacidad', label_pt: 'Política de Privacidade', label_en: 'Privacy Policy', link: '/faq' },
            { label_es: 'Política de Pagos', label_pt: 'Política de Pagamentos', label_en: 'Payments Policy', link: '/faq' },
            { label_es: 'Aviso Legal', label_pt: 'Aviso Legal', label_en: 'Legal Notice', link: '/faq' }
        ]
    }
];
