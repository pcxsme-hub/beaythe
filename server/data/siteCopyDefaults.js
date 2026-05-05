// Default copy banks for editable site-wide content. Each entry has the same
// shape per locale. Admin can edit; defaults are used as fallback.

export const SITE_COPY_DEFAULTS = {
    // ----- Cookie consent banner -----
    cookies: {
        es: {
            title: 'Respetamos tu privacidad 🍪',
            message: 'Utilizamos cookies para mejorar tu experiencia y recordar tus preferencias. Al continuar navegando, aceptas su uso.',
            accept: 'Entendido',
            decline: 'Declinar',
            more: 'Saber más'
        },
        pt: {
            title: 'Respeitamos a sua privacidade 🍪',
            message: 'Utilizamos cookies para melhorar a sua experiência e lembrar as suas preferências. Ao continuar a navegar, aceita o seu uso.',
            accept: 'Entendido',
            decline: 'Recusar',
            more: 'Saber mais'
        },
        en: {
            title: 'We respect your privacy 🍪',
            message: 'We use cookies to improve your experience and remember your preferences. By continuing to browse you accept their use.',
            accept: 'Got it',
            decline: 'Decline',
            more: 'Learn more'
        }
    },

    // ----- Newsletter popup -----
    newsletter: {
        es: {
            brand: 'beauthé',
            title: '15% DE DESCUENTO',
            desc: 'Suscríbete a nuestra newsletter y recibe un cupón exclusivo para tu primera compra.',
            email_placeholder: 'Email',
            subscribe: 'SUSCRIBIRME',
            no_thanks: 'NO, GRACIAS',
            privacy: 'Al suscribirte, aceptas nuestra política de privacidad.'
        },
        pt: {
            brand: 'beauthé',
            title: '15% DE DESCONTO',
            desc: 'Subscreve a nossa newsletter e recebe um cupão exclusivo para a sua primeira compra.',
            email_placeholder: 'Email',
            subscribe: 'SUBSCREVER',
            no_thanks: 'NÃO, OBRIGADO',
            privacy: 'Ao subscrever, aceita a nossa política de privacidade.'
        },
        en: {
            brand: 'beauthé',
            title: '15% OFF',
            desc: 'Subscribe to our newsletter and get an exclusive coupon for your first purchase.',
            email_placeholder: 'Email',
            subscribe: 'SUBSCRIBE',
            no_thanks: 'NO, THANKS',
            privacy: 'By subscribing, you accept our privacy policy.'
        }
    },

    // ----- About drawer -----
    about_drawer: {
        es: {
            title: 'Nuestra Historia',
            heading_story: 'DE UNA IDEA A UN ESTILO DE VIDA',
            story: 'Beauthé nació de un sueño sencillo: democratizar el acceso a productos de belleza de alta calidad que respeten tanto la piel como el entorno natural.',
            heading_principles: 'NUESTROS PRINCIPIOS',
            quote: 'Creemos que cuidarse a uno mismo es el primer y más importante paso para sentirse invencible cada día.',
            back: 'Volver a la tienda'
        },
        pt: {
            title: 'A Nossa História',
            heading_story: 'DE UMA IDEIA A UM ESTILO DE VIDA',
            story: 'A Beauthé nasceu de um sonho simples: democratizar o acesso a produtos de beleza de alta qualidade que respeitem a pele e o ambiente.',
            heading_principles: 'OS NOSSOS PRINCÍPIOS',
            quote: 'Acreditamos que cuidar de si é o primeiro e mais importante passo para se sentir invencível todos os dias.',
            back: 'Voltar à loja'
        },
        en: {
            title: 'Our Story',
            heading_story: 'FROM AN IDEA TO A LIFESTYLE',
            story: 'Beauthé was born from a simple dream: democratise access to high-quality beauty products that respect both skin and the natural environment.',
            heading_principles: 'OUR PRINCIPLES',
            quote: 'We believe taking care of yourself is the first and most important step to feeling invincible every day.',
            back: 'Back to shop'
        }
    },

    // ----- Footer -----
    footer: {
        es: {
            need_help: '¿Necesitas ayuda?',
            track_purchase: 'Seguir mi compra',
            categories_title: 'Categorías',
            institutional: 'Institucional',
            copyright_full: '© 2026 BEAUTHÉ. Todos los derechos reservados.'
        },
        pt: {
            need_help: 'Precisa de ajuda?',
            track_purchase: 'Acompanhar compra',
            categories_title: 'Categorias',
            institutional: 'Institucional',
            copyright_full: '© 2026 BEAUTHÉ. Todos os direitos reservados.'
        },
        en: {
            need_help: 'Need help?',
            track_purchase: 'Track purchase',
            categories_title: 'Categories',
            institutional: 'Institutional',
            copyright_full: '© 2026 BEAUTHÉ. All rights reserved.'
        }
    },

    // ----- /historia page banner -----
    historia: {
        es: {
            banner_tag: 'De una idea a un estilo de vida',
            banner_title: 'Nuestra Historia',
            banner_desc: 'Nacimos para caminar con belleza, verdad y ligereza.',
            values_title: 'Valores y Propósitos',
            join_us_tag: 'Únete a nosotros',
            join_us_title_1: 'Te invitamos a ser parte de',
            join_us_title_2: 'nuestra historia.',
            join_us_desc: 'Descubre lo que significa Vivir Bonito. Explora nuestra colección completa.',
            view_collections: 'Ver colecciones'
        },
        pt: {
            banner_tag: 'De uma ideia a um estilo de vida',
            banner_title: 'A Nossa História',
            banner_desc: 'Nascemos para caminhar com beleza, verdade e leveza.',
            values_title: 'Valores e Propósitos',
            join_us_tag: 'Junta-te a nós',
            join_us_title_1: 'Convidamos-te a fazer',
            join_us_title_2: 'parte da nossa história.',
            join_us_desc: 'Descobre o que significa Viver Bonito. Explora a nossa coleção completa.',
            view_collections: 'Ver coleções'
        },
        en: {
            banner_tag: 'From an idea to a lifestyle',
            banner_title: 'Our Story',
            banner_desc: 'We were born to walk with beauty, truth and lightness.',
            values_title: 'Values & Purpose',
            join_us_tag: 'Join us',
            join_us_title_1: 'We invite you to be',
            join_us_title_2: 'part of our story.',
            join_us_desc: 'Discover what it means to Live Beautiful. Explore our full collection.',
            view_collections: 'View collections'
        }
    },

    // ----- Announcement bar (header) -----
    announcement: {
        es: { msg_1: "It's all about Beauthé.", msg_2: 'Todo sobre ti.' },
        pt: { msg_1: "It's all about Beauthé.", msg_2: 'Tudo sobre si.' },
        en: { msg_1: "It's all about Beauthé.", msg_2: 'All about you.' }
    }
};

export const SITE_COPY_GROUPS = [
    { key: 'cookies', label: 'Aviso de cookies', icon: 'Cookie', fields: [
        { name: 'title', label: 'Título', type: 'text' },
        { name: 'message', label: 'Mensagem', type: 'textarea' },
        { name: 'accept', label: 'Botão aceitar', type: 'text' },
        { name: 'decline', label: 'Botão recusar', type: 'text' },
        { name: 'more', label: 'Link "saber mais"', type: 'text' }
    ]},
    { key: 'newsletter', label: 'Popup Newsletter', icon: 'Mail', fields: [
        { name: 'brand', label: 'Marca', type: 'text' },
        { name: 'title', label: 'Headline (oferta)', type: 'text' },
        { name: 'desc', label: 'Descrição', type: 'textarea' },
        { name: 'email_placeholder', label: 'Placeholder do email', type: 'text' },
        { name: 'subscribe', label: 'CTA subscrever', type: 'text' },
        { name: 'no_thanks', label: 'Botão "não obrigado"', type: 'text' },
        { name: 'privacy', label: 'Texto de privacidade', type: 'textarea' }
    ]},
    { key: 'about_drawer', label: 'Drawer "Sobre nós"', icon: 'Info', fields: [
        { name: 'title', label: 'Título', type: 'text' },
        { name: 'heading_story', label: 'Cabeçalho história', type: 'text' },
        { name: 'story', label: 'História', type: 'textarea' },
        { name: 'heading_principles', label: 'Cabeçalho princípios', type: 'text' },
        { name: 'quote', label: 'Frase de impacto', type: 'textarea' },
        { name: 'back', label: 'Botão "voltar"', type: 'text' }
    ]},
    { key: 'footer', label: 'Rodapé', icon: 'Anchor', fields: [
        { name: 'need_help', label: 'Coluna "precisa de ajuda"', type: 'text' },
        { name: 'track_purchase', label: 'Coluna "acompanhar compra"', type: 'text' },
        { name: 'categories_title', label: 'Coluna "categorias"', type: 'text' },
        { name: 'institutional', label: 'Coluna "institucional"', type: 'text' },
        { name: 'copyright_full', label: 'Texto de copyright', type: 'text' }
    ]},
    { key: 'historia', label: 'Página /historia', icon: 'BookOpen', fields: [
        { name: 'banner_tag', label: 'Tag do banner', type: 'text' },
        { name: 'banner_title', label: 'Título do banner', type: 'text' },
        { name: 'banner_desc', label: 'Descrição do banner', type: 'textarea' },
        { name: 'values_title', label: 'Título da seção de valores', type: 'text' },
        { name: 'join_us_tag', label: 'Tag "junte-se"', type: 'text' },
        { name: 'join_us_title_1', label: 'Título "junte-se" linha 1', type: 'text' },
        { name: 'join_us_title_2', label: 'Título "junte-se" linha 2', type: 'text' },
        { name: 'join_us_desc', label: 'Descrição "junte-se"', type: 'textarea' },
        { name: 'view_collections', label: 'CTA "ver coleções"', type: 'text' }
    ]},
    { key: 'announcement', label: 'Barra de anúncios (topo)', icon: 'Megaphone', fields: [
        { name: 'msg_1', label: 'Mensagem 1', type: 'text' },
        { name: 'msg_2', label: 'Mensagem 2 (alterna)', type: 'text' }
    ]}
];
