import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

const translationsData = {
    es: {
        currency: "€",
        announcement: "It's all about Beauthé.",
        about_you: "Todo sobre ti.",
        new_arrivals: "Lanzamientos",
        search_placeholder: "Busca aquí tu ritual de belleza...",
        search_results: "Resultados de búsqueda",
        no_results: "No encontramos resultados para",
        search: {
            results_for: "Resultados para",
            result_found: "resultado encontrado",
            results_found: "resultados encontrados",
            no_results: "No encontramos resultados",
            try_again: "Intenta con otras palabras clave o explora nuestras categorías principales para encontrar lo que buscas.",
            view_all: "Explora todo"
        },
        common: {
            buy_now: "Comprar Ahora",
            add_kit: "Añadir Kit",
            home: "Inicio",
            add: "Añadir al carrito",
            remove: "Quitar",
            edit: "Editar",
            save: "Guardar",
            cancel: "Cancelar",
            shades: "tonos",
            essential: "Esencial",
            items: "artículos",
            discover: "Descubrir",
            view_all: "Ver Todo",
            learn_more: "Saber Más",
            tones: "tonos",
            tone: "tono",
            details: "Ver Detalles",
            composition: "Composición",
            description: "Descripción",
            filter: "Filtrar por",
            sort: "Ordenar por",
            recommended: "Recomendados",
            categories: "Categorías",
            language: "Idioma",
            favorites: "Favoritos",
            back_to_top: "Volver arriba",
            show_more: "Ver Más",
            close: "Cerrar",
            seo: {
                home: "Beauthé: Alta cosmética vegana y rituales de belleza con propósito. Descubre lo melhor en cuidado facial y corporal.",
                skin: "Cuidado Facial: Sérums, cremas y tónicos formulados con ingredientes naturales para una piel radiante y saludable.",
                hair: "Cuidado Capilar: Nutrición y brillo para tu cabello con nuestras fórmulas exclusivas libres de sulfatos.",
                makeup: "Maquillaje Consciente: Realza tu belleza natural con productos de larga duración y texturas sensoriales."
            },
            cookies: {
                title: "Respetamos tu privacidad 🍪",
                message: "Utilizamos cookies para mejorar tu experiencia y recordar tus preferencias. Al continuar navegando, aceptas su uso.",
                accept: "Entendido",
                decline: "Declinar",
                more: "Saber más"
            },
            more: "Ver más"
        },
        categories: {
            all_collection: "Toda la Colección",
            collection: "Colección",
            rostro: { title: "Cuidado Facial", tagline: "Rituales de Pureza", desc: "Sérums, tónicos y cremas formulados para una piel radiante." },
            maquillaje: { title: "Maquillaje", tagline: "Belleza Consciente", desc: "Texturas sensoriales que realzan tu belleza natural." },
            cabello: { title: "Cuidado Capilar", tagline: "Nutrición Intensa", desc: "Fórmulas exclusivas para un cabello fuerte y brillante." },
            tendencias: { title: "Tendencias", tagline: "Lo Último de Beauthé", desc: "Descubre los productos más deseados de esta temporada." },
            manos_pies: { title: "Manos y Pies", tagline: "Cuidado Esencial", desc: "Hidratación y nutrición profunda para tus extremidades." },
            cuerpo: { title: "Baño y Cuerpo", tagline: "Bienestar Total", desc: "Hidratación profunda para cada centímetro de tu piel." },
            bienestar: { title: "Bienestar", tagline: "Mente y Cuerpo", desc: "Productos diseñados para tu momento de relax diario." },
            hombre: { title: "Línea Hombre", tagline: "Cuidado Masculino", desc: "Fórmulas prácticas y eficaces para el hombre moderno." },
            solares: { title: "Protección Solar", tagline: "Cuidado bajo el Sol", desc: "Protege tu piel con texturas ligeras y filtros de alta protección." },
            perfumes: { title: "Perfumes", tagline: "Tu Firma Olfativa", desc: "Fragancias que cuentan historias en cada aplicación." },
            outlet: { title: "Outlet", tagline: "Promociones Exclusivas", desc: "Productos seleccionados con descuentos especiales." },
            default: { title: "Beauthé", tagline: "Belleza con Propósito", desc: "Explora nuestra selección de alta cosmética natural." }
        },
        hero: {
            skin_care: { title: "Cuidado Facial", desc: "Sérums y cremas de alta eficacia." },
            hair_care: { title: "Cuidado Capilar", desc: "Brillo y nutrición para tu melena." },
            manos_pies: { title: "Manos y Pies", desc: "Suavidad y nutrición diaria." },
            discover: "Descubrir",
            subtitle: "Lo Mejor para Ti",
            title_part1: "Siente tu",
            title_part2: "belleza natural",
            button: "Comprar Piel Sensible"
        },
        nav: {
            outlet: "Outlet",
            marcas: "Marcas",
            rostro: "Rostro",
            hombre: "Hombre",
            tendencias: "Tendencias",
            cuerpo: "Cuerpo y Baño",
            bienestar: "Bienestar",
            cabello: "Cabello",
            solares: "Solares",
            maquillaje: "Maquillaje",
            perfumes: "Perfumes",
            regalos: "Regalos",
            manos_pies: "Manos y Pies",
            all_products: "Todos los productos",
            kits: "Kits",
            limpiadores: "Limpiadores",
            tonicos: "Tónicos",
            serums: "Sérums",
            cremas: "Cremas",
            contorno: "Contorno de Ojos",
            mascarillas: "Mascarillas",
            base: "Bases",
            correctores: "Correctores",
            polvo: "Polvos",
            rubor: "Colorete",
            labios: "Labios",
            cuidado_facial: "Cuidado Facial",
            maquillaje_facial: "Maquillaje",
            ferramentas: "Ferramentas",
            cepillos: "Escovas",
            planchas: "Planchas",
            higiene: "Higiene",
            hidratacion: "Hidratación",
            cuidados: "Cuidados",
            lavado: "Lavado",
            tratamiento: "Tratamiento",
            styling: "Styling",
            femeninos: "Femeninos",
            masculinos: "Masculinos",
            unisex: "Unisex",
            hogar: "Hogar",
            promociones: "Promociones",
            ultimas: "Últimas Unidades",
            best_sellers: "Más Vendidos",
            sub_limpiadores: ["Geles", "Espumas", "Micelar"],
            sub_tonicos: ["Hidratantes", "Astringentes"],
            sub_serums: ["Vitamina C", "Retinol"],
            sub_cremas: ["Día", "Noche"],
            sub_contorno: ["Bolsas", "Ojeras"],
            sub_mascarillas: ["Arcilla", "Hidrogel"],
            sub_base: ["Líquida", "Polvo"],
            sub_correctores: ["Crème", "Stick"],
            sub_polvo: ["Translúcido", "Compacto"],
            sub_rubor: ["Polvo", "Crema"],
            sub_labios: ["Mate", "Brillo"],
            sub_higiene: ["Jabones", "Geles"],
            sub_hidratacion: ["Lociones", "Aceites"],
            sub_cuidados: ["Exfoliantes", "Desodorantes"],
            sub_manos_pies: ["Reparación", "Protección"],
            sub_lavado: ["Champús", "Acondicionadores"],
            sub_tratamiento: ["Mascarillas", "Sérums"],
            sub_styling: ["Sprays", "Protección Térmica"],
            sub_ferramentas: ["Escovas", "Planchas", "Secadores"],
            sub_cepillos: ["Desenredante", "Térmico"],
            sub_planchas: ["Alisadora", "Rizadora"],
            sub_femeninos: ["Perfumes", "Colonias"],
            sub_masculinos: ["Frescos", "Intensos"],
            sub_unisex: ["Cítricos", "Amaderados"],
            sub_hogar: ["Velas", "Difusores"],
            sub_promociones: ["Hasta -50%", "Kits 2x1"],
            sub_ultimas: ["Stock Final"],
            sub_best_sellers: ["Top Ventas", "Favoritos"]
        },
        cart: {
            title: "Tu Carrito",
            clear_cart: "Vaciar carrito",
            empty: "Tu carrito está vacío",
            empty_desc: "Parece que aún no has añadido rituales de belleza.",
            subtotal: "Subtotal",
            shipping: "Envío",
            shipping_calc: "Calculado en el checkout",
            total: "Total",
            checkout: "Finalizar Compra"
        },
        auth: {
            login_title: "Iniciar sesión",
            login_desc: "Entra para gestionar tus pedidos y favoritos.",
            register_title: "Crear cuenta",
            register_desc: "Únete a Beauthé y disfruta de ventajas exclusivas.",
            name_label: "Nombre completo",
            name_placeholder: "Tu nombre",
            email_label: "E-mail",
            password_label: "Contraseña",
            forgot_password: "¿Olvidaste tu contraseña?",
            login_btn: "Entrar",
            register_btn: "Crear Perfil",
            google_btn: "Continuar con Google",
            no_account: "¿No tienes una cuenta?",
            has_account: "¿Ya tienes cuenta?",
            register_now: "Regístrate ahora",
            login_now: "Inicia sesión",
            next_step: "Próximo paso",
            account_created: "¡Cuenta creada!",
            interests_label: "Intereses",
            birth_label: "Fecha de Nacimiento",
            complete_profile: "Finalizar Perfil",
            complete_profile_desc: "Completa tu perfil para una experiencia personalizada.",
            skip_step: "Saltar por ahora",
            invalid_email: "Por favor, introduce un email válido.",
            email_placeholder: "tu@email.com",
            divider: "o",
            interests: { skincare: "Skincare", makeup: "Maquillaje", hair: "Cabello", body: "Cuerpo" }
        },
        profile: {
            account: "Mi Perfil",
            personal_data: "Datos Personales",
            addresses: "Direcciones",
            addresses_desc: "Gestiona tus direcciones de envío.",
            orders: "Mis Pedidos",
            track_order: "Rastrear pedido",
            track_desc: "Sigue tu envío en tiempo real.",
            track_placeholder: "Introduce el código de seguimiento",
            track_no_orders: "Aún no has realizado ningún pedido.",
            settings: "Configuración",
            logout: "Cerrar sesión",
            add_address: "Añadir dirección",
            edit_address: "Editar dirección",
            address_form: { label: "Etiqueta (Casa, Trabajo)", street: "Calle y número", city: "Ciudad", postal: "Código postal", country: "País" },
            user_default_name: "Invitada",
            user_default_email: "invitada@beauthe.com"
        },
        checkout: {
            title: "Finalizar Pedido",
            shipping_address: "Dirección de Envío",
            payment_method: "Método de Pago",
            order_summary: "Resumen del Pedido",
            place_order: "Confirmar y Pagar",
            secure: "Pago 100% Seguro",
            returns_guarantee: "Devolución garantizada",
            save_info: "Guardar mis datos para la próxima vez",
            empty_cart: "Tu carrito está vacío.",
            continue_shopping: "Seguir comprando",
            back_to_cart: "Volver al carrito",
            free_shipping: "GRATIS",
            fields: {
                email: "Email",
                first_name: "Nombre",
                last_name: "Apellido",
                address: "Dirección",
                zip: "Código postal",
                city: "Ciudad"
            },
            payments: {
                card: "Tarjeta de Crédito",
                paypal: "PayPal",
                transfer: "Transferencia Bancaria",
                bizum: "Bizum",
                klarna: "Klarna",
                mbway: "MB WAY",
                multibanco: "Multibanco"
            }
        },
        faq_section: {
            title: "Preguntas Frecuentes",
            subtitle: "Todo lo que necesitas saber sobre tu ritual de belleza.",
            items: [
                {
                    question: "¿Cuánto tiempo tardan en hacer efecto los productos de Skin Care?",
                    answer: "Depende del producto y de tu tipo de piel. Los resultados de hidratación inicial se notan de inmediato, mientras que los tratamientos profundos suelen mostrar cambios visibles tras 3 a 4 semanas de uso constante."
                },
                {
                    question: "¿Los productos son adecuados para pieles sensibles?",
                    answer: "Sí, toda nuestra colección Beauthé está testada dermatológicamente y formulada con ingredientes suaves, diseñados para respetar y calmar incluso las pieles más delicadas."
                },
                {
                    question: "¿Puedo combinar Vitamina C con Retinol en mi rutina?",
                    answer: "Recomendamos utilizar la Vitamina C en tu rutina de mañana para proteger la piel de los radicales libres, y dejar el Retinol para tu rutina nocturna, promoviendo la renovación celular."
                },
                {
                    question: "¿Ofrecen envío gratuito?",
                    answer: "Sí, todos los pedidos superiores a 50€ disfrutan de envío estándar gratuito a toda la península y Baleares."
                },
                {
                    question: "¿Son los productos 100% veganos?",
                    answer: "Absolutamente. No utilizamos ingredientes de origen animal y estamos orgullosos de ser una marca certificada Cruelty-Free."
                },
                {
                    question: "¿Cómo puedo rastrear mi pedido?",
                    answer: "Una vez que tu pedido salga de nuestro almacén, recibirás un correo electrónico con el número de seguimiento y un enlace directo a la mensajería."
                },
                {
                    question: "¿Cuál es vuestra política de devoluciones?",
                    answer: "Dispones de 14 días para devolver productos sin abrir en su embalaje original si no estás satisfecha con tu compra."
                },
                {
                    question: "¿En qué orden debo aplicar mis productos?",
                    answer: "La regla de oro es aplicar de la textura más ligera a la más densa: Limpiador > Tónico > Sérum > Contorno de Ojos > Crema Hidratante > Protector Solar (mañana)."
                }
            ]
        },
        reviews_section: {
            tag: "Opiniones de Clientes",
            title: "Lo que dicen de nosotros",
            average: "Media de 4.9/5 estrellas baseada en clientes verificados",
            show_more: "Ver Más Reviews"
        },
        product_bottom: {
            tag: "Calidad y Pureza",
            title_1: "Lo mejor para",
            title_2: "tu piel",
            desc: "Nuestros productos son formulados con ingredientes naturales de la más alta calidad, garantizando resultados visibles y un cuidado excepcional."
        },
        filters: {
            price: "Precio",
            skin_tone: "Tono de piel",
            color_name: "Color",
            product_type: "Tipo de producto",
            items: "artículos",
            sort: "Ordenar",
            load_more: "Cargar más",
            sort_options: {
                recomendados: "Recomendados",
                mais_vendidos: "Más Vendidos",
                novidades: "Novedades",
                maior_desconto: "Mayor Descuento",
                menor_preco: "Menor precio",
                maior_preco: "Mayor precio",
                a_z: "A - Z",
                z_a: "Z - A",
                melhor_avaliados: "Mejor Valorados",
                em_tendencia: "Tendencia"
            }
        },
        trending: {
            tag: "Lo Más Pedido",
            title: "Tendencia ahora"
        },
        history: {
            banner_tag: "De una idea a un estilo de vida",
            banner_title: "Nuestra Historia",
            banner_desc: "Nacimos para caminar con belleza, verdad y ligereza.",
            values_title: "Valores y Propósitos",
            transparency_title: "Transparencia Real",
            transparency_desc: "Fórmulas limpias y éticas en cada producto.",
            purity: "Pureza",
            sustainability_title: "Sostenibilidad 100%",
            sustainability_desc: "Envases reciclables y recursos renovables.",
            lightness_title: "Ligereza con Propósito",
            join_us_tag: "Únete a nosotros",
            join_us_title_1: "Te invitamos a ser parte de",
            join_us_title_2: "nuestra historia.",
            join_us_desc: "Descubre lo que significa Vivir Bonito. Explora nuestra colección completa.",
            view_collections: "Ver colecciones"
        },
        about_us: {
            tag: "Valores y Propósitos",
            title_1: "Te invitamos a ser",
            title_2: "parte de nuestra historia",
            desc: "Únete a nosotros en este viaje y descubre lo que significa cuidarse con cariño y propósito."
        },
        footer: {
            customer_service: "Atención al Cliente",
            about: "Sobre Nosotros",
            legal: "Legal",
            subscribe_btn: "Unirse",
            placeholder: "Tu e-mail",
            rights: "Todos los derechos reservados.",
            back_to_top: "Volver arriba",
            need_help: "¿Necesitas ayuda?",
            track_purchase: "Seguir mi compra",
            institutional: "Institucional",
            categories_title: "Categorías",
            links: {
                contact: "Habla con nosotros",
                faq: "Preguntas Frecuentes",
                support: "Centro de Atención",
                my_account: "Mi cuenta",
                my_orders: "Mis pedidos",
                returns: "Cambios y devoluciones",
                track: "Seguir entrega",
                who_we_are: "Quiénes somos",
                terms: "Términos y Condiciones",
                privacy: "Política de Privacidad",
                payments: "Política de Pagos",
                legal_notice: "Aviso Legal",
                admin: "Panel Admin"
            },
            copyright_full: "© 2026 BEAUTHÉ. Todos los derechos reservados."
        },
        trust: [
            { id: 1, icon: 'Truck', title: 'ENVÍO GRATUITO DESDE 50€' },
            { id: 2, icon: 'Headphones', title: 'SOPORTE AL CLIENTE 24/7' },
            { id: 3, icon: 'Layers', title: 'PRODUCTOS 100% VEGANOS' },
            { id: 4, icon: 'PiggyBank', title: '30 DÍAS DE DEVOLUCIÓN' },
            { id: 5, icon: 'Calendar', title: 'ENTREGA EN 48/72 HORAS' }
        ],
        quiz: {
            tag: "Skin Quiz",
            title: "¿Cuál es tu tipo de piel?",
            desc: "Responde 3 preguntas y descubre tu ritual ideal.",
            start: "EMPEZAR QUIZ",
            result_title: "TU RESULTADO",
            result_button: "VER MI RITUAL",
            types: {
                dry: "Piel Seca",
                oily: "Piel Grasa",
                sensitive: "Piel Sensible",
                normal: "Piel Normal"
            },
            questions: [
                {
                    q: "¿Cómo sientes tu piel al despertar?",
                    options: [
                        { text: "Tirante y seca", type: "dry" },
                        { text: "Con brillos en la zona T", type: "oily" },
                        { text: "Irritada o roja", type: "sensitive" },
                        { text: "Equilibrada", type: "normal" }
                    ]
                },
                {
                    q: "¿Qué te preocupa más?",
                    options: [
                        { text: "Líneas de expresión", type: "dry" },
                        { text: "Poros y granitos", type: "oily" },
                        { text: "Rojeces y picores", type: "sensitive" },
                        { text: "Mantener el brillo", type: "normal" }
                    ]
                },
                {
                    q: "¿Cómo reacciona tu piel al sol?",
                    options: [
                        { text: "Se quema fácil", type: "sensitive" },
                        { text: "Broncea lento", type: "normal" },
                        { text: "Se siente más grasa", type: "oily" },
                        { text: "Se descama", type: "dry" }
                    ]
                }
            ]
        },
        popup: {
            title: "15% DE DESCUENTO",
            desc: "Suscríbete a nuestra newsletter y recibe un cupón exclusivo para tu primera compra.",
            subscribe: "SUSCRIBIRME",
            no_thanks: "NO, GRACIAS",
            privacy: "Al suscribirte, aceptas nuestra política de privacidad."
        },
        marquee: [
            "ALTA COSMÉTICA VEGANA",
            "CRUELTY FREE",
            "MADE IN EUROPE",
            "ENVÍO GRATIS +50€",
            "10% DESC. PRIMERA COMPRA",
            "RITUALES CON PROPÓSITO"
        ],
        product: {
            add_to_cart: "Añadir al carrito",
            paraben_free: "sin parabenos",
            vegan: "vegano",
            recommended: "Productos Recomendados",
            reviews_count: "(24 reseñas)",
            in_stock: "En stock",
            free_shipping_50: "Envío gratuito a partir de 50€",
            usage: "Modo de uso",
            shipping_title: "Envío y Devolución",
            description_fallback: "Producto de alta cosmética desarrollado para realzar tu rutina de belleza con resultados visibles.",
            usage_fallback: "Aplica sobre la piel limpia y seca con movimientos circulares hasta su total absorción.",
            ingredients_fallback: "Aqua, Niacinamide, Glycerin, Rosa Centifolia Flower Extract, Hyaluronic Acid, Phenoxyethanol.",
            shipping_fallback: "Envío gratis en pedidos superiores a 50€. Entrega en 2-4 días laborables. Devolución gratuita en hasta 30 días.",
            not_found: "Producto no encontrado",
            not_found_desc: "Este producto puede haber sido retirado o el enlace es incorrecto.",
            dermatologically_tested: "Testado dermatológicamente",
            vegan_badge: "Vegano",
            benefits: "BENEFICIOS",
            benefits_headline: "Beneficios exclusivos para una experiencia única.",
            benefits_desc: "Desarrollado con alta tecnología para garantizar un efecto duradero y respetuoso con tu piel.",
            benefit_vegan: "Vegano",
            benefit_cruelty_free: "Cruelty Free",
            benefit_no_parabens: "Sin Parabenos",
            benefit_no_fragrance: "Sin Fragancia",
            feature_light_texture: "Textura Ligera",
            feature_thin: "Extra Fino",
            feature_soft_focus: "Efecto Soft Focus",
            feature_water_resistant: "Resistente al Agua",
            reviews: "Reseñas",
            trust: {
                shipping: "Envío 48h",
                returns: "30 días devolución",
                vegan: "100% Vegano",
                tested: "Dermo testado"
            },
            kit_tag: "Comprar en kit",
            kit_title: "Frecuentemente comprados juntos",
            kit_desc: "Ahorra al combinar este producto con sus complementos perfectos.",
            kit_save: "Ahorra",
            kit_savings: "Ahorras",
            kit_add: "Añadir kit al carrito",
            craft_tag: "Hecho con propósito",
            formulation_tag: "Formulación"
        },
        badges: {
            best_seller: "Más Vendido",
            new: "Nuevo",
            trend: "Tendencia"
        },
        favorites: {
            title: "Tus favoritos",
            empty_title_1: "Aún no tienes",
            empty_title_2: "favoritos",
            clear_favorites: "Vaciar favoritos",
            empty_desc: "Cuando guardes productos como favoritos aparecerán aquí.",
            explore: "Explorar productos"
        },
        products: {},
        helpbot: {
            title: "Ayuda Beauthé",
            subtitle: "Asistente Inteligente",
            placeholder: "Escribe tu duda...",
            welcome: "¡Hola! Soy tu asistente Beauthé. ¿En qué puedo ayudarte hoy?",
            faq: {
                greeting: "¡Hola! Soy tu asistente de Beauthé. ¿En qué puedo ayudarte hoy?",
                shipping: "Hacemos envíos gratuitos a partir de 50€ con entrega en 48-72h en la península.",
                payments: "Aceptamos tarjeta, PayPal, transferencia y Bizum. Todos los pagos son 100% seguros.",
                returns: "Tienes 14 días para devolver cualquier producto sin abrir. Escríbenos a contato@beauthe.com.",
                products: "Todos nuestros productos son veganos y cruelty-free, formulados en Europa.",
                skin: "Para tu tipo de piel recomendamos empezar con nuestro Skin Quiz, así te sugerimos un ritual personalizado.",
                makeup: "Nuestra línea Essential es perfecta para un look natural. ¿Buscas algo para labios o rostro?",
                unknown: "No estoy segura de eso, pero puedes escribirnos a contato@beauthe.com y te respondemos en breve."
            }
        },
        cro: {
            cart_abandoned_title: "¿Olvidaste algo?",
            cart_abandoned_desc: "Dejaste artículos en tu carrito.",
            continue_purchase: "Continuar compra"
        },
        about_drawer: {
            title: "Nuestra Historia",
            heading_story: "DE UNA IDEA A UN ESTILO DE VIDA",
            story: "Beauthé nació de un sueño sencillo: democratizar el acceso a productos de belleza de alta calidad que respeten tanto la piel como el entorno natural. Comenzamos experimentando con ingredientes puros y fórmulas limpias, impulsados por la necesidad de transparencia en el cuidado personal.",
            heading_principles: "NUESTROS PRINCIPIOS",
            principles: {
                cruelty_free: { title: "100% Cruelty Free", desc: "Nunca probamos en animales y exigimos las mismas prácticas éticas a todos nuestros proveedores." },
                clean_formulas: { title: "Fórmulas Limpias", desc: "Nuestras colecciones están libres de parabenos, sulfatos agresivos y químicos innecesarios." },
                sustainability: { title: "Sostenibilidad", desc: "Usamos envases reciclables y nos esforzamos por mantener procesos neutros en carbono." },
                transparency: { title: "Transparencia Real", desc: "Tienes derecho a saber exactamente qué ingredientes pones sobre tu piel." }
            },
            quote: "“Creemos que cuidarse a uno mismo es el primer y más importante paso para sentirse invencible cada día.”",
            back: "Volver a la tienda"
        },
        help: {
            title: "¿Cómo podemos ayudarte?",
            search_placeholder: "Busca tu duda...",
            most_accessed: "Más consultadas",
            contact_us: "Hablar con un agente",
            cta_title: "¿No encuentras lo que buscas?",
            cta_desc: "Estamos disponibles 24/7 por chat o e-mail.",
            back: "Volver al centro de ayuda",
            categories: {
                products: "Eficacia y Rituales",
                refunds: "Cambios y Devoluciones",
                payments: "Pagos",
                deliveries: "Envíos",
                account: "Mi Cuenta"
            },
            faqs: {
                most_accessed: [
                    { q: "¿CÓMO RASTREO MI PEDIDO?", a: "En cuanto el pedido sea enviado recibirás un código de seguimiento por correo para acompañar la entrega en tiempo real." },
                    { q: "¿QUÉ MÉTODOS DE PAGO ACEPTAN?", a: "Aceptamos tarjeta, PayPal, Bizum y transferencia bancaria. Todas las transacciones son 100% seguras." },
                    { q: "¿PUEDO DEVOLVER UN PRODUCTO YA ABIERTO?", a: "Por motivos de higiene, sólo aceptamos devoluciones de productos cerrados con el precinto original intacto." },
                    { q: "¿CUÁL ES EL PLAZO DE ENTREGA?", a: "El plazo medio es de 2 a 5 días laborables en península. Para islas puede llegar hasta 10 días laborables." },
                    { q: "OLVIDÉ MI CONTRASEÑA, ¿CÓMO LA RECUPERO?", a: "Pulsa en 'Olvidé mi contraseña' en la pantalla de inicio de sesión y sigue las instrucciones recibidas en tu correo." }
                ],
                refunds: [
                    { q: "¿CÓMO SOLICITAR UN CAMBIO O DEVOLUCIÓN?", a: "El producto debe estar precintado y sin uso. Escríbenos a contato@beauthe.com en hasta 14 días después de la recepción indicando el número de pedido." },
                    { q: "¿CUÁL ES EL PLAZO PARA CAMBIOS?", a: "Tienes 14 días para devolución por desistimiento y 30 días para productos con defecto de fábrica." },
                    { q: "¿QUIÉN PAGA EL ENVÍO DE DEVOLUCIÓN?", a: "El primer cambio por defecto o error de envío corre por nuestra cuenta. En caso de desistimiento, el envío de retorno es responsabilidad del cliente." },
                    { q: "¿CÓMO SE HACE EL REEMBOLSO?", a: "El reembolso se realiza por el mismo método utilizado en la compra. Para tarjetas puede aparecer hasta 2 ciclos después del procesamiento." }
                ],
                deliveries: [
                    { q: "¿CUÁL ES EL COSTE DEL ENVÍO?", a: "Envío gratuito en compras superiores a 50€ en España y Portugal Peninsular. Para importes inferiores, la tasa se calcula en el checkout." },
                    { q: "¿BEAUTHÉ ENVÍA A TODA EUROPA?", a: "Por ahora enviamos a España (Península e Islas) y Portugal, garantizando plazos reducidos." },
                    { q: "¿CÓMO RASTREO MI PEDIDO?", a: "Recibirás un código de seguimiento por correo en cuanto el pedido sea enviado." },
                    { q: "¿CUÁL ES EL PLAZO MEDIO DE ENTREGA?", a: "2-5 días laborables en península; hasta 10 días para islas." }
                ],
                payments: [
                    { q: "¿QUÉ MÉTODOS DE PAGO SE ACEPTAN?", a: "Aceptamos tarjeta (Visa, Mastercard), PayPal, Bizum y Apple Pay. Todas las transacciones son seguras y cifradas." },
                    { q: "¿QUIÉN PROCESA LOS PAGOS?", a: "Los pagos se procesan a través de Stripe, una de las plataformas más seguras del mundo." },
                    { q: "¿MI PAGO REQUIERE APROBACIÓN?", a: "Bizum y Apple Pay se aprueban al instante. Las tarjetas pueden pasar por una breve revisión de seguridad." }
                ],
                account: [
                    { q: "OLVIDÉ MI CONTRASEÑA, ¿QUÉ HAGO?", a: "Pulsa 'Olvidé mi contraseña' en la pantalla de inicio de sesión y enviaremos un enlace de recuperación al correo registrado." },
                    { q: "¿CÓMO PUEDO MODIFICAR MIS DATOS?", a: "Accede a la sección 'Mi Perfil' tras iniciar sesión para editar tu nombre, correo y direcciones guardadas." },
                    { q: "¿MIS DATOS ESTÁN SEGUROS?", a: "Sí. Cumplimos con el RGPD y utilizamos cifrado SSL en todo el sitio." }
                ]
            }
        }
    },
    pt: {
        currency: "€",
        announcement: "It's all about Beauthé.",
        about_you: "Tudo sobre si.",
        new_arrivals: "Lançamentos",
        search_placeholder: "Pesquise aqui o seu ritual de beleza...",
        search_results: "Resultados da pesquisa",
        no_results: "Não encontramos resultados para",
        search: {
            results_for: "Resultados para",
            result_found: "resultado encontrado",
            results_found: "resultados encontrados",
            no_results: "Não encontramos resultados",
            try_again: "Tente com outras palavras-chave ou explore as nossas categorias principais para encontrar o que procura.",
            view_all: "Explorar tudo"
        },
        common: {
            buy_now: "Comprar Agora",
            add_kit: "Adicionar Kit",
            home: "Início",
            add: "Adicionar ao carrinho",
            remove: "Remover",
            edit: "Editar",
            save: "Guardar",
            cancel: "Cancelar",
            shades: "tons",
            essential: "Essencial",
            items: "itens",
            discover: "Descobrir",
            view_all: "Ver Tudo",
            learn_more: "Saber Mais",
            tones: "tons",
            tone: "tom",
            details: "Ver Detalhes",
            composition: "Composição",
            description: "Descrição",
            filter: "Filtrar por",
            sort: "Ordenar por",
            recommended: "Recomendados",
            categories: "Categorias",
            language: "Idioma",
            favorites: "Favoritos",
            back_to_top: "Voltar ao topo",
            show_more: "Ver Mais",
            close: "Fechar",
            seo: {
                home: "Beauthé: Alta cosmética vegana e rituais de beleza com propósito. Descubra o melhor em cuidado facial e corporal.",
                skin: "Cuidado Facial: Séruns, cremes e tónicos formulados com ingredientes naturais para uma pele radiante e saudável.",
                hair: "Cuidado Capilar: Nutrição e brilho para o seu cabelo com as nossas fórmulas exclusivas livres de sulfatos.",
                makeup: "Maquilhagem Consciente: Realce a sua beleza natural com produtos de longa duração e texturas sensoriais."
            },
            cookies: {
                title: "Respeitamos a sua privacidade 🍪",
                message: "Utilizamos cookies para melhorar a sua experiência e lembrar as suas preferências. Ao continuar a navegar, aceita o seu uso.",
                accept: "Entendi",
                decline: "Recusar",
                more: "Saber mais"
            },
            more: "Ver mais"
        },
        categories: {
            all_collection: "Toda a Coleção",
            collection: "Coleção",
            rostro: { title: "Cuidado Facial", tagline: "Rituais de Pureza", desc: "Sérums, tónicos e cremes formulados para uma pele radiante." },
            maquillaje: { title: "Maquilhagem", tagline: "Beleza Consciente", desc: "Texturas sensoriais que realçam a sua beleza natural." },
            cabello: { title: "Cuidado Capilar", tagline: "Nutrição Intensa", desc: "Fórmulas exclusivas para um cabelo forte e brilhante." },
            tendencias: { title: "Tendências", tagline: "O Último da Beauthé", desc: "Descubra os produtos mais desejados desta temporada." },
            manos_pies: { title: "Mãos e Pés", tagline: "Cuidado Essencial", desc: "Hidratação e nutrição profunda para as suas extremidades." },
            cuerpo: { title: "Banho e Corpo", tagline: "Bem-estar Total", desc: "Hidratação profunda para cada centímetro da sua pele." },
            bienestar: { title: "Bem-estar", tagline: "Mente e Corpo", desc: "Produtos desenhados para o seu momento de relax diário." },
            hombre: { title: "Linha Homem", tagline: "Cuidado Masculino", desc: "Fórmulas práticas e eficazes para o homem moderno." },
            solares: { title: "Proteção Solar", tagline: "Cuidado sob o Sol", desc: "Proteja a sua pele com texturas leves e filtros de alta proteção." },
            perfumes: { title: "Perfumes", tagline: "A sua Assinatura", desc: "Fragrâncias que contam histórias a cada aplicação." },
            outlet: { title: "Outlet", tagline: "Promoções Exclusivas", desc: "Produtos selecionados com descontos especiais." },
            default: { title: "Beauthé", tagline: "Beleza com Propósito", desc: "Explore a nossa seleção de alta cosmética natural." }
        },
        hero: {
            skin_care: { title: "Cuidado Facial", desc: "Sérums e cremes de alta eficácia." },
            hair_care: { title: "Cuidado Capilar", desc: "Brilho e nutrição para o seu cabelo." },
            manos_pies: { title: "Mãos e Pés", desc: "Suavidade e nutrição diária." },
            discover: "Descobrir",
            subtitle: "O Melhor para Si",
            title_part1: "Sinta a sua",
            title_part2: "beleza natural",
            button: "Comprar Pele Sensível"
        },
        nav: {
            outlet: "Outlet",
            marcas: "Marcas",
            rostro: "Rosto",
            hombre: "Homem",
            tendencias: "Tendências",
            cuerpo: "Corpo & Banho",
            bienestar: "Bem-estar",
            cabello: "Cabelo",
            solares: "Solares",
            maquillaje: "Maquilhagem",
            perfumes: "Perfumes",
            regalos: "Presentes",
            manos_pies: "Mãos e Pés",
            all_products: "Todos os produtos",
            kits: "Kits",
            limpiadores: "Limpadores",
            tonicos: "Tónicos",
            serums: "Sérums",
            cremas: "Cremas",
            contorno: "Contorno de Olhos",
            mascarillas: "Máscaras",
            base: "Bases",
            correctores: "Corretores",
            polvo: "Pós",
            rubor: "Blush",
            labios: "Lábios",
            cuidado_facial: "Tratamento Facial",
            maquillaje_facial: "Cor & Cobertura",
            ferramentas: "Ferramentas",
            cepillos: "Escovas",
            planchas: "Modeladores",
            higiene: "Higiene",
            hidratacion: "Hidratação",
            cuidados: "Cuidados",
            lavado: "Lavagem",
            tratamiento: "Tratamento",
            styling: "Penteados",
            femeninos: "Femininos",
            masculinos: "Masculinos",
            unisex: "Unisex",
            hogar: "Casa",
            promociones: "Promoções",
            ultimas: "Últimas Unidades",
            best_sellers: "Mais Vendidos",
            sub_limpiadores: ["Géis", "Espumas", "Micelar"],
            sub_tonicos: ["Hidratantes", "Astringentes"],
            sub_serums: ["Vitamina C", "Retinol"],
            sub_cremas: ["Dia", "Noite"],
            sub_contorno: ["Bolsas", "Olheiras"],
            sub_mascarillas: ["Argila", "Hidrogel"],
            sub_base: ["Líquida", "Pó"],
            sub_correctores: ["Creme", "Stick"],
            sub_polvo: ["Translúcido", "Compacto"],
            sub_rubor: ["Pó", "Creme"],
            sub_labios: ["Mate", "Brilho"],
            sub_higiene: ["Sabonetes", "Géis de Banho"],
            sub_hidratacion: ["Loções", "Óleos"],
            sub_cuidados: ["Esfoliantes", "Desodorizantes"],
            sub_manos_pies: ["Reparação", "Proteção"],
            sub_lavado: ["Champôs", "Amaciadores"],
            sub_tratamiento: ["Máscaras", "Sérums"],
            sub_styling: ["Sprays", "Proteção Térmica"],
            sub_ferramentas: ["Escovas", "Pranchas", "Secadores"],
            sub_cepillos: ["Desembaraçantes", "Térmicas"],
            sub_planchas: ["Alisadores", "Modeladores"],
            sub_femeninos: ["Perfumes", "Colónias"],
            sub_masculinos: ["Frescos", "Intensos"],
            sub_unisex: ["Cítricos", "Amaderados"],
            sub_hogar: ["Velas", "Difusores"],
            sub_promociones: ["Até -50%", "Kits 2x1"],
            sub_ultimas: ["Stock Final"],
            sub_best_sellers: ["Top Vendas", "Favoritos"]
        },
        cart: {
            title: "O seu Carrinho",
            clear_cart: "Esvaziar carrinho",
            empty: "O seu cesto está vazio",
            empty_desc: "Parece que ainda não adicionou rituais de beleza.",
            subtotal: "Subtotal",
            shipping: "Envio",
            shipping_calc: "Calculado no checkout",
            total: "Total",
            checkout: "Finalizar Compra"
        },
        auth: {
            login_title: "Iniciar sessão",
            login_desc: "Entre para gerir as suas encomendas e favoritos.",
            register_title: "Criar conta",
            register_desc: "Junte-se à Beauthé e desfrute de vantagens exclusivas.",
            name_label: "Nome completo",
            name_placeholder: "O seu nome",
            email_label: "E-mail",
            password_label: "Palavra-passe",
            forgot_password: "Esqueceu a palavra-passe?",
            login_btn: "Entrar",
            register_btn: "Criar Perfil",
            google_btn: "Continuar com Google",
            no_account: "Não tem uma conta?",
            has_account: "Já tem conta?",
            register_now: "Registe-se agora",
            login_now: "Inicie sessão",
            next_step: "Próximo passo",
            account_created: "Conta criada!",
            interests_label: "Interesses",
            birth_label: "Data de Nascimento",
            complete_profile: "Finalizar Perfil",
            complete_profile_desc: "Complete o seu perfil para uma experiência personalizada.",
            skip_step: "Saltar por agora",
            invalid_email: "Por favor, introduza um e-mail válido.",
            email_placeholder: "voce@email.com",
            divider: "ou",
            interests: { skincare: "Skincare", makeup: "Maquilhagem", hair: "Cabelo", body: "Corpo" }
        },
        profile: {
            account: "Meu Perfil",
            personal_data: "Dados Pessoais",
            addresses: "Endereços",
            addresses_desc: "Gira os seus endereços de envio.",
            orders: "Minhas Encomendas",
            track_order: "Rastrear encomenda",
            track_desc: "Acompanhe a sua entrega em tempo real.",
            track_placeholder: "Insira o código de rastreamento",
            track_no_orders: "Ainda não fez nenhuma encomenda.",
            settings: "Configurações",
            logout: "Sair da conta",
            add_address: "Adicionar endereço",
            edit_address: "Editar endereço",
            address_form: { label: "Etiqueta (Casa, Trabalho)", street: "Rua e número", city: "Cidade", postal: "Código postal", country: "País" },
            user_default_name: "Visitante",
            user_default_email: "visitante@beauthe.com"
        },
        checkout: {
            title: "Finalizar Encomenda",
            shipping_address: "Endereço de Envio",
            payment_method: "Método de Pagamento",
            order_summary: "Resumo da Encomenda",
            place_order: "Confirmar e Pagar",
            secure: "Pagamento 100% Seguro",
            returns_guarantee: "Devolução garantida",
            save_info: "Guardar os meus dados para a próxima vez",
            empty_cart: "O seu carrinho está vazio.",
            continue_shopping: "Continuar a comprar",
            back_to_cart: "Voltar ao carrinho",
            free_shipping: "GRÁTIS",
            fields: {
                email: "Email",
                first_name: "Nome",
                last_name: "Apelido",
                address: "Morada",
                zip: "Código postal",
                city: "Cidade"
            },
            payments: {
                card: "Cartão de Crédito",
                paypal: "PayPal",
                transfer: "Transferência Bancária",
                bizum: "Bizum",
                klarna: "Klarna",
                mbway: "MB WAY",
                multibanco: "Multibanco"
            }
        },
        faq_section: {
            title: "Perguntas Frequentes",
            subtitle: "Tudo o que precisa de saber sobre o seu ritual de beleza.",
            items: [
                {
                    question: "¿Quanto tempo demoram a fazer efeito os produtos de Skin Care?",
                    answer: "Depende do produto e do seu tipo de pele. Os resultados de hidratação inicial notam-se de imediato, enquanto os tratamentos profundos costumam mostrar mudanças visíveis após 3 a 4 semanas de uso constante."
                },
                {
                    question: "¿Os produtos são adequados para peles sensíveis?",
                    answer: "Sim, toda a nossa coleção Beauthé está testada dermatologicamente e formulada com ingredientes suaves, desenhados para respeitar e acalmar até as peles mais delicadas."
                },
                {
                    question: "¿Posso combinar Vitamina C com Retinol na minha rotina?",
                    answer: "Recomendamos utilizar a Vitamina C na rotina de manhã para proteger a pele, e deixar o Retinol para a noite, promovendo a renovação celular."
                },
                {
                    question: "¿Oferecem envio gratuito?",
                    answer: "Sim, todas as encomendas superiores a 50€ desfrutam de envio padrão gratuito para Portugal Continental."
                },
                {
                    question: "¿Os produtos são 100% veganos?",
                    answer: "Absolutamente. Não utilizamos ingredientes de origem animal e orgulhamo-nos de ser uma marca certificada Cruelty-Free."
                },
                {
                    question: "¿Como posso seguir a minha encomenda?",
                    answer: "Assim que a encomenda sair do armazém, receberá um e-mail com o número de seguimento e um link direto."
                },
                {
                    question: "¿Qual é a vossa política de devoluções?",
                    answer: "Dispõe de 14 dias para devolver produtos não abertos na embalagem original se não estiver satisfeita."
                },
                {
                    question: "¿Em que ordem devo aplicar os produtos?",
                    answer: "A regra de ouro é: Limpador > Tónico > Sérum > Contorno > Hidratante > Protetor Solar."
                }
            ]
        },
        reviews_section: {
            tag: "Opiniões de Clientes",
            title: "O que dizem de nós",
            average: "Média de 4.9/5 estrelas baseada em clientes verificados",
            show_more: "Ver Mais Reviews"
        },
        product_bottom: {
            tag: "Qualidade & Pureza",
            title_1: "O melhor para",
            title_2: "a sua pele",
            desc: "Os nossos produtos são formulados com ingredientes naturais da mais alta qualidade, garantindo resultados visíveis e um cuidado excepcional."
        },
        filters: {
            price: "Preço",
            skin_tone: "Grupo de tons",
            color_name: "Cor",
            product_type: "Tipo de produto",
            items: "artigos",
            sort: "Ordenar",
            load_more: "Carregar mais",
            sort_options: {
                recomendados: "Recomendados",
                mais_vendidos: "Mais Vendidos",
                novidades: "Novidades",
                maior_desconto: "Maior Desconto",
                menor_preco: "Menor preço",
                maior_preco: "Maior preço",
                a_z: "A - Z",
                z_a: "Z - A",
                melhor_avaliados: "Melhor Avaliados",
                em_tendencia: "Tendência"
            }
        },
        trending: {
            tag: "Em destaque",
            title: "Tendência agora"
        },
        history: {
            banner_tag: "De uma ideia a um estilo de vida",
            banner_title: "A nossa História",
            banner_desc: "Somos criados para caminhar com beleza, verdade e leveza.",
            values_title: "Valores e Propósitos",
            transparency_title: "Transparência Real",
            transparency_desc: "Fórmulas limpas e éticas em cada produto.",
            purity: "Pureza",
            sustainability_title: "Sustentabilidade 100%",
            sustainability_desc: "Embalagens recicláveis e recursos renováveis.",
            lightness_title: "Leveza com propósito",
            join_us_tag: "Junte-se a nós",
            join_us_title_1: "Te convidamos a ser parte da",
            join_us_title_2: "nossa história.",
            join_us_desc: "Descubra o que significa Viver Bonito. Explore a nossa coleção completa.",
            view_collections: "Ver coleções"
        },
        about_us: {
            tag: "Valores e Propósitos",
            title_1: "Te convidamos a ser",
            title_2: "parte da nossa história",
            desc: "Junte-se a nós nesta jornada e descubra o que significa cuidar-se com carinho e propósito."
        },
        footer: {
            customer_service: "Apoio ao Cliente",
            about: "Sobre Nós",
            legal: "Legal",
            subscribe_btn: "Aderir",
            placeholder: "O seu e-mail",
            rights: "Todos os direitos reservados.",
            back_to_top: "Voltar ao topo",
            need_help: "Precisa de ajuda?",
            track_purchase: "Acompanhar compra",
            institutional: "Institucional",
            categories_title: "Categorias",
            links: {
                contact: "Fala connosco",
                faq: "Perguntas Frequentes",
                support: "Centro de Atendimento",
                my_account: "Minha conta",
                my_orders: "Meus pedidos",
                returns: "Trocas e devoluções",
                track: "Rastrear entrega",
                who_we_are: "Quem somos",
                terms: "Termos e Condições",
                privacy: "Política de Privacidade",
                payments: "Política de Pagamentos",
                legal_notice: "Aviso Legal",
                admin: "Painel Admin"
            },
            copyright_full: "© 2026 BEAUTHÉ. Todos os direitos reservados."
        },
        trust: [
            { id: 1, icon: 'Truck', title: 'ENVIO GRATUITO DESDE 50€' },
            { id: 2, icon: 'Headphones', title: 'SUPORTE AO CLIENTE 24/7' },
            { id: 3, icon: 'Layers', title: 'PRODUTOS 100% VEGANOS' },
            { id: 4, icon: 'PiggyBank', title: '30 DIAS DE DEVOLUÇÃO' },
            { id: 5, icon: 'Calendar', title: 'ENTREGA EM 48/72 HORAS' }
        ],
        quiz: {
            tag: "Skin Quiz",
            title: "Qual é o seu tipo de pele?",
            desc: "Responda a 3 perguntas e descubra o seu ritual ideal.",
            start: "COMEÇAR QUIZ",
            result_title: "O SEU RESULTADO",
            result_button: "VER MEU RITUAL",
            types: {
                dry: "Pele Seca",
                oily: "Pele Oleosa",
                sensitive: "Pele Sensível",
                normal: "Pele Normal"
            },
            questions: [
                {
                    q: "Como sente a sua pele ao acordar?",
                    options: [
                        { text: "Esticada e seca", type: "dry" },
                        { text: "Com brilhos na zona T", type: "oily" },
                        { text: "Irritada ou vermelha", type: "sensitive" },
                        { text: "Equilibrada", type: "normal" }
                    ]
                },
                {
                    q: "O que mais o preocupa?",
                    options: [
                        { text: "Linhas de expressão", type: "dry" },
                        { text: "Poros e borbulhas", type: "oily" },
                        { text: "Vermelhidão e comichão", type: "sensitive" },
                        { text: "Manter o brilho", type: "normal" }
                    ]
                },
                {
                    q: "Como reage a sua pele ao sol?",
                    options: [
                        { text: "Queima-se facilmente", type: "sensitive" },
                        { text: "Bronzeia lentamente", type: "normal" },
                        { text: "Sente-se mais oleosa", type: "oily" },
                        { text: "Fica a descamar", type: "dry" }
                    ]
                }
            ]
        },
        popup: {
            title: "15% DE DESCONTO",
            desc: "Subscreva a nossa newsletter e receba um cupão exclusivo para a sua primeira compra.",
            subscribe: "SUBSCREVER",
            no_thanks: "NÃO, OBRIGADO",
            privacy: "Ao subscrever, aceita a nossa política de privacidade."
        },
        marquee: [
            "ALTA COSMÉTICA VEGANA",
            "CRUELTY FREE",
            "MADE IN EUROPE",
            "ENVIO GRÁTIS +50€",
            "10% DESC. PRIMEIRA COMPRA",
            "RITUAIS COM PROPÓSITO"
        ],
        product: {
            add_to_cart: "Adicionar ao carrinho",
            paraben_free: "sem parabenos",
            vegan: "vegano",
            recommended: "Produtos Recomendados",
            reviews_count: "(24 avaliações)",
            in_stock: "Em stock",
            free_shipping_50: "Envio gratuito a partir de 50€",
            usage: "Modo de usar",
            shipping_title: "Envio e Devolução",
            description_fallback: "Produto de alta cosmética desenvolvido para elevar a sua rotina de beleza com resultados visíveis.",
            usage_fallback: "Aplique sobre a pele limpa e seca em movimentos circulares até total absorção.",
            ingredients_fallback: "Aqua, Niacinamide, Glycerin, Rosa Centifolia Flower Extract, Hyaluronic Acid, Phenoxyethanol.",
            shipping_fallback: "Envio gratuito em pedidos acima de 50€. Entrega em 2-4 dias úteis. Devolução gratuita até 30 dias.",
            not_found: "Produto não encontrado",
            not_found_desc: "Este item pode ter sido removido ou o link está incorreto.",
            dermatologically_tested: "Testado dermatologicamente",
            vegan_badge: "Vegano",
            benefits: "BENEFÍCIOS",
            benefits_headline: "Benefícios exclusivos para uma experiência única.",
            benefits_desc: "Desenvolvido com alta tecnologia para garantir um efeito duradouro respeitando a sua pele.",
            benefit_vegan: "Vegano",
            benefit_cruelty_free: "Cruelty Free",
            benefit_no_parabens: "Sem Parabenos",
            benefit_no_fragrance: "Sem Fragrância",
            feature_light_texture: "Textura Leve",
            feature_thin: "Extra Fino",
            feature_soft_focus: "Efeito Soft Focus",
            feature_water_resistant: "Resistente à Água",
            reviews: "Avaliações",
            trust: {
                shipping: "Envio 48h",
                returns: "30 dias devolução",
                vegan: "100% Vegano",
                tested: "Dermo testado"
            },
            kit_tag: "Comprar em kit",
            kit_title: "Frequentemente comprados juntos",
            kit_desc: "Poupa ao combinar este produto com os seus complementos perfeitos.",
            kit_save: "Poupa",
            kit_savings: "Poupa",
            kit_add: "Adicionar kit ao carrinho",
            craft_tag: "Feito com propósito",
            formulation_tag: "Formulação"
        },
        badges: {
            best_seller: "Mais Vendido",
            new: "Novo",
            trend: "Tendência"
        },
        favorites: {
            title: "Os seus favoritos",
            empty_title_1: "Ainda não tem",
            empty_title_2: "favoritos ainda",
            clear_favorites: "Esvaziar favoritos",
            empty_desc: "Quando guardar produtos como favoritos vão aparecer aqui.",
            explore: "Explorar produtos"
        },
        products: {},
        helpbot: {
            title: "Ajuda Beauthé",
            subtitle: "Assistente Inteligente",
            placeholder: "Escreva a sua dúvida...",
            welcome: "Olá! Sou o seu assistente Beauthé. Em que posso ajudá-lo hoje?",
            faq: {
                greeting: "Olá! Sou o assistente da Beauthé. Em que posso ajudá-lo hoje?",
                shipping: "Fazemos envios gratuitos a partir de 50€ com entrega em 48-72h em Portugal continental.",
                payments: "Aceitamos cartão, PayPal, MB WAY e transferência bancária. Todos os pagamentos são 100% seguros.",
                returns: "Tem 14 dias para devolver qualquer produto fechado. Escreva para contato@beauthe.com.",
                products: "Todos os nossos produtos são veganos e cruelty-free, formulados na Europa.",
                skin: "Para o seu tipo de pele recomendamos começar pelo nosso Skin Quiz para sugerir um ritual personalizado.",
                makeup: "A nossa linha Essential é perfeita para um look natural. Procura algo para lábios ou rosto?",
                unknown: "Não tenho a certeza disso, mas pode escrever-nos para contato@beauthe.com e respondemos em breve."
            }
        },
        cro: {
            cart_abandoned_title: "Esqueceu-se de algo?",
            cart_abandoned_desc: "Deixou artigos no seu carrinho.",
            continue_purchase: "Continuar compra"
        },
        about_drawer: {
            title: "A Nossa História",
            heading_story: "DE UMA IDEIA A UM ESTILO DE VIDA",
            story: "A Beauthé nasceu de um sonho simples: democratizar o acesso a produtos de beleza de alta qualidade que respeitem a pele e o ambiente. Começamos a experimentar ingredientes puros e fórmulas limpas, motivados pela necessidade de transparência no cuidado pessoal.",
            heading_principles: "OS NOSSOS PRINCÍPIOS",
            principles: {
                cruelty_free: { title: "100% Cruelty Free", desc: "Nunca testamos em animais e exigimos as mesmas práticas éticas aos nossos parceiros." },
                clean_formulas: { title: "Fórmulas Limpas", desc: "As nossas coleções são livres de parabenos, sulfatos agressivos e químicos desnecessários." },
                sustainability: { title: "Sustentabilidade", desc: "Usamos embalagens recicláveis e procuramos manter processos neutros em carbono." },
                transparency: { title: "Transparência Real", desc: "Tem direito a saber exatamente que ingredientes coloca na sua pele." }
            },
            quote: "“Acreditamos que cuidar de si é o primeiro e mais importante passo para se sentir invencível todos os dias.”",
            back: "Voltar à loja"
        },
        help: {
            title: "Como podemos ajudar?",
            search_placeholder: "Pesquise a sua dúvida...",
            most_accessed: "Mais consultadas",
            contact_us: "Falar com um agente",
            cta_title: "Não encontra o que procura?",
            cta_desc: "Estamos disponíveis 24/7 via chat ou e-mail.",
            back: "Voltar ao centro de ajuda",
            categories: {
                products: "Eficácia e Rituais",
                refunds: "Trocas e Devoluções",
                payments: "Pagamentos",
                deliveries: "Envios",
                account: "A Minha Conta"
            },
            faqs: {
                most_accessed: [
                    { q: "COMO RASTREIO O MEU PEDIDO?", a: "Assim que o pedido for despachado, receberá um código de rastreio por e-mail para acompanhar a entrega em tempo real." },
                    { q: "QUAIS AS FORMAS DE PAGAMENTO ACEITES?", a: "Aceitamos cartão, PayPal, MB WAY e transferência bancária. Todas as transações são 100% seguras." },
                    { q: "POSSO DEVOLVER UM PRODUTO ABERTO?", a: "Por questões de higiene, apenas aceitamos devoluções de produtos com o lacre original intacto." },
                    { q: "QUAL O PRAZO DE ENTREGA?", a: "O prazo médio é de 2 a 5 dias úteis em Portugal continental. Para ilhas pode ir até 10 dias úteis." },
                    { q: "ESQUECI A MINHA PASSWORD, COMO RECUPERAR?", a: "Clique em 'Esqueci a minha password' no ecrã de login e siga as instruções enviadas por e-mail." }
                ],
                refunds: [
                    { q: "COMO SOLICITAR UMA TROCA OU DEVOLUÇÃO?", a: "O produto deve estar lacrado e sem uso. Escreva para contato@beauthe.com em até 14 dias após a receção indicando o número do pedido." },
                    { q: "QUAL O PRAZO PARA TROCAS?", a: "14 dias para devolução por desistência e 30 dias para produtos com defeito de fábrica." },
                    { q: "QUEM PAGA O ENVIO DA DEVOLUÇÃO?", a: "A primeira troca por defeito ou erro de envio é por nossa conta. Em caso de desistência, o envio de retorno é da responsabilidade do cliente." },
                    { q: "COMO É FEITO O REEMBOLSO?", a: "O reembolso é feito pelo mesmo método de pagamento utilizado na compra." }
                ],
                deliveries: [
                    { q: "QUAL O VALOR DO ENVIO?", a: "Envio gratuito em compras acima de 50€ em Portugal e Espanha Peninsular." },
                    { q: "ENTREGAM EM TODA A EUROPA?", a: "Por agora entregamos em Portugal (Continente e Ilhas) e Espanha." },
                    { q: "COMO RASTREIO O MEU PEDIDO?", a: "Receberá um código de rastreio por e-mail assim que o pedido for despachado." },
                    { q: "QUAL O PRAZO MÉDIO DE ENTREGA?", a: "2 a 5 dias úteis no continente; até 10 dias úteis nas ilhas." }
                ],
                payments: [
                    { q: "QUAIS FORMAS DE PAGAMENTO SÃO ACEITES?", a: "Aceitamos cartão (Visa, Mastercard), MB WAY, PayPal e Apple Pay. Todas as transações são encriptadas." },
                    { q: "QUEM PROCESSA OS PAGAMENTOS?", a: "Os pagamentos são processados através do Stripe." },
                    { q: "O PAGAMENTO PRECISA DE APROVAÇÃO?", a: "MB WAY e Apple Pay são aprovados de imediato. Cartões podem passar por uma breve análise." }
                ],
                account: [
                    { q: "ESQUECI A MINHA PASSWORD, O QUE FAZER?", a: "Clique em 'Esqueci a minha password' no ecrã de login para receber um link de recuperação." },
                    { q: "COMO POSSO ALTERAR OS MEUS DADOS?", a: "Aceda à secção 'Meu Perfil' após iniciar sessão para editar dados pessoais e endereços." },
                    { q: "OS MEUS DADOS ESTÃO SEGUROS?", a: "Sim. Cumprimos o RGPD e utilizamos encriptação SSL em todo o site." }
                ]
            }
        }
    },
    en: {
        currency: "€",
        announcement: "It's all about Beauthé.",
        about_you: "All about you.",
        new_arrivals: "New Arrivals",
        search_placeholder: "Search for your beauty ritual...",
        search_results: "Search results",
        no_results: "No results found for",
        search: {
            results_for: "Results for",
            result_found: "result found",
            results_found: "results found",
            no_results: "No results found",
            try_again: "Try different keywords or explore our main categories to find what you're looking for.",
            view_all: "Explore all"
        },
        common: {
            buy_now: "Buy Now",
            add_kit: "Add Kit",
            home: "Home",
            add: "Add to cart",
            remove: "Remove",
            edit: "Edit",
            save: "Save",
            cancel: "Cancel",
            shades: "shades",
            essential: "Essential",
            items: "items",
            discover: "Discover",
            view_all: "View All",
            learn_more: "Learn More",
            tones: "tones",
            tone: "tone",
            details: "View Details",
            composition: "Composition",
            description: "Description",
            filter: "Filter by",
            sort: "Sort by",
            recommended: "Recommended",
            categories: "Categories",
            language: "Language",
            favorites: "Favorites",
            back_to_top: "Back to top",
            show_more: "Show More",
            close: "Close",
            seo: {
                home: "Beauthé: High-end vegan cosmetics and purposeful beauty rituals. Discover the best in facial and body care.",
                skin: "Facial Care: Serums, creams and tonics formulated with natural ingredients for radiant and healthy skin.",
                hair: "Hair Care: Nutrition and shine for your hair with our exclusive sulfate-free formulas.",
                makeup: "Conscious Makeup: Enhance your natural beauty with long-lasting products and sensory textures."
            },
            cookies: {
                title: "We respect your privacy 🍪",
                message: "We use cookies to improve your experience and remember your preferences. By continuing to browse, you accept their use.",
                accept: "Understood",
                decline: "Decline",
                more: "Learn more"
            },
            more: "View more"
        },
        categories: {
            all_collection: "All Collection",
            collection: "Collection",
            rostro: { title: "Facial Care", tagline: "Purity Rituals", desc: "Serums, tonics and creams formulated for radiant skin." },
            maquillaje: { title: "Makeup", tagline: "Conscious Beauty", desc: "Sensory textures that enhance your natural beauty." },
            cabello: { title: "Hair Care", tagline: "Intense Nutrition", desc: "Exclusive formulas for strong, shiny hair." },
            tendencias: { title: "Trending", tagline: "Latest from Beauthé", desc: "Discover this season's most wanted products." },
            manos_pies: { title: "Hands & Feet", tagline: "Essential Care", desc: "Deep hydration and nutrition for your extremities." },
            cuerpo: { title: "Bath & Body", tagline: "Total Well-being", desc: "Deep hydration for every inch of your skin." },
            bienestar: { title: "Wellness", tagline: "Mind & Body", desc: "Products designed for your daily relax moment." },
            hombre: { title: "Men's Line", tagline: "Male Care", desc: "Practical and effective formulas for the modern man." },
            solares: { title: "Sun Protection", tagline: "Care under the Sun", desc: "Protect your skin with light textures and high-protection filters." },
            perfumes: { title: "Perfumes", tagline: "Your Signature Scent", desc: "Fragrances that tell stories with every spray." },
            outlet: { title: "Outlet", tagline: "Exclusive Deals", desc: "Selected products with special discounts." },
            default: { title: "Beauthé", tagline: "Beauty with Purpose", desc: "Explore our selection of natural high cosmetics." }
        },
        hero: {
            skin_care: { title: "Skin Care", desc: "High efficacy serums and creams." },
            hair_care: { title: "Hair Care", desc: "Shine and nutrition for your hair." },
            manos_pies: { title: "Hands & Feet", desc: "Daily softness and nutrition." },
            discover: "Discover",
            subtitle: "The Best for You",
            title_part1: "Feel your",
            title_part2: "natural beauty",
            button: "Shop Sensitive Skin"
        },
        nav: {
            outlet: "Outlet",
            marcas: "Brands",
            rostro: "Face",
            hombre: "Men",
            tendencias: "Trending",
            cuerpo: "Body & Bath",
            bienestar: "Wellness",
            cabello: "Hair",
            solares: "Sun Care",
            maquillaje: "Makeup",
            perfumes: "Perfumes",
            regalos: "Gifts",
            manos_pies: "Hands & Feet",
            all_products: "All products",
            kits: "Kits",
            limpiadores: "Cleansers",
            tonicos: "Toners",
            serums: "Serums",
            cremas: "Creams",
            contorno: "Eye Contour",
            mascarillas: "Masks",
            base: "Foundations",
            correctores: "Concealers",
            polvo: "Powders",
            rubor: "Blush",
            labios: "Lips",
            higiene: "Hygiene",
            hidratacion: "Hydration",
            cuidados: "Care",
            lavado: "Wash",
            tratamiento: "Treatment",
            styling: "Styling",
            femeninos: "Women's",
            masculinos: "Men's",
            unisex: "Unisex",
            hogar: "Home",
            promociones: "Promotions",
            ultimas: "Last Unities",
            best_sellers: "Best Sellers",
            cuidado_facial: "Facial Care",
            maquillaje_facial: "Makeup",
            ferramentas: "Tools",
            cepillos: "Brushes",
            planchas: "Straighteners",
            sub_ferramentas: ["Brushes", "Straighteners", "Hairdryers"],
            sub_cepillos: ["Detangler", "Thermal"],
            sub_planchas: ["Flat", "Curling"],
            sub_limpiadores: ["Gels", "Foams", "Micellar"],
            sub_tonicos: ["Hydrating", "Astringent"],
            sub_serums: ["Vitamin C", "Retinol"],
            sub_cremas: ["Day", "Night"],
            sub_contorno: ["Bolsas", "Ojeras"],
            sub_mascarillas: ["Clay", "Hydrogel"],
            sub_base: ["Liquid", "Powder"],
            sub_correctores: ["Cream", "Stick"],
            sub_polvo: ["Translucent", "Compact"],
            sub_rubor: ["Powder", "Cream"],
            sub_labios: ["Matte", "Gloss"],
            sub_higiene: ["Soaps", "Bath Gels"],
            sub_hidratacion: ["Lotions", "Oils"],
            sub_cuidados: ["Exfoliators", "Deodorants"],
            sub_manos_pies: ["Repairing", "Protective"],
            sub_lavado: ["Shampoos", "Conditioners"],
            sub_tratamiento: ["Masks", "Serums"],
            sub_styling: ["Sprays", "Heat Protection"],
            sub_femeninos: ["Perfumes", "Colognes"],
            sub_masculinos: ["Fresh", "Intense"],
            sub_unisex: ["Citrus", "Woody"],
            sub_hogar: ["Candles", "Diffusers"],
            sub_promociones: ["Up to -50%", "2x1 Kits"],
            sub_ultimas: ["Final Stock"],
            sub_best_sellers: ["Top Sellers", "Favorites"]
        },
        cart: {
            title: "Your Cart",
            clear_cart: "Clear cart",
            empty: "Your cart is empty",
            empty_desc: "Looks like you haven't added any beauty rituals.",
            subtotal: "Subtotal",
            shipping: "Shipping",
            shipping_calc: "Calculated at checkout",
            total: "Total",
            checkout: "Checkout"
        },
        auth: {
            login_title: "Login",
            login_desc: "Log in to manage your orders and favorites.",
            register_title: "Create account",
            register_desc: "Join Beauthé and enjoy exclusive benefits.",
            name_label: "Full name",
            name_placeholder: "Your name",
            email_label: "Email",
            password_label: "Password",
            forgot_password: "Forgot your password?",
            login_btn: "Login",
            register_btn: "Create Profile",
            google_btn: "Continue with Google",
            no_account: "Don't have an account?",
            has_account: "Already have an account?",
            register_now: "Register now",
            login_now: "Login now",
            next_step: "Next step",
            account_created: "Account created!",
            interests_label: "Interests",
            birth_label: "Date of Birth",
            complete_profile: "Complete Profile",
            complete_profile_desc: "Complete your profile for a personalised experience.",
            skip_step: "Skip for now",
            invalid_email: "Please enter a valid email address.",
            email_placeholder: "you@email.com",
            divider: "or",
            interests: { skincare: "Skincare", makeup: "Makeup", hair: "Hair", body: "Body" }
        },
        profile: {
            account: "My Profile",
            personal_data: "Personal Data",
            addresses: "Addresses",
            addresses_desc: "Manage your shipping addresses.",
            orders: "My Orders",
            track_order: "Track order",
            track_desc: "Follow your delivery in real time.",
            track_placeholder: "Enter the tracking code",
            track_no_orders: "You haven't placed any orders yet.",
            settings: "Settings",
            logout: "Logout",
            add_address: "Add address",
            edit_address: "Edit address",
            address_form: { label: "Label (Home, Work)", street: "Street and number", city: "City", postal: "Postal code", country: "Country" },
            user_default_name: "Guest",
            user_default_email: "guest@beauthe.com"
        },
        checkout: {
            title: "Finish Order",
            shipping_address: "Shipping Address",
            payment_method: "Payment Method",
            order_summary: "Order Summary",
            place_order: "Confirm and Pay",
            secure: "100% Secure Payment",
            returns_guarantee: "Returns guaranteed",
            save_info: "Save my info for next time",
            empty_cart: "Your cart is empty.",
            continue_shopping: "Continue shopping",
            back_to_cart: "Back to cart",
            free_shipping: "FREE",
            fields: {
                email: "Email",
                first_name: "First name",
                last_name: "Last name",
                address: "Address",
                zip: "Postal code",
                city: "City"
            },
            payments: {
                card: "Credit Card",
                paypal: "PayPal",
                transfer: "Bank Transfer",
                bizum: "Bizum",
                klarna: "Klarna",
                mbway: "MB WAY",
                multibanco: "Multibanco"
            }
        },
        faq_section: {
            title: "Frequently Asked Questions",
            subtitle: "Everything you need to know about your beauty ritual.",
            items: [
                {
                    question: "How long does it take for Skin Care products to take effect?",
                    answer: "Initial hydration results are noticed immediately, while deep treatments show visible changes after 3 to 4 weeks."
                },
                {
                    question: "Are the products suitable for sensitive skin?",
                    answer: "Yes, our collection is dermatologically tested for the most delicate skin."
                },
                {
                    question: "Can I combine Vitamin C with Retinol?",
                    answer: "We recommend Vitamin C in the morning and Retinol at night."
                },
                {
                    question: "Do you offer free shipping?",
                    answer: "Yes, on orders over 50€."
                },
                {
                    question: "Are the products vegan?",
                    answer: "Yes, 100% vegan and Cruelty-Free."
                },
                {
                    question: "How can I track my order?",
                    answer: "You will receive a tracking number via email once it ships."
                },
                {
                    question: "What is your return policy?",
                    answer: "14 days for unopened products in original packaging."
                },
                {
                    question: "In what order should I apply products?",
                    answer: "Thinnest to thickest: Cleanser > Toner > Serum > Eye Contour > Moisturizer > SPF."
                }
            ]
        },
        reviews_section: {
            tag: "Customer Reviews",
            title: "What they say about us",
            average: "Average of 4.9/5 stars based on verified customers",
            show_more: "See More Reviews"
        },
        product_bottom: {
            tag: "Quality & Purity",
            title_1: "The best for",
            title_2: "your skin",
            desc: "Our products are formulated with the highest quality natural ingredients, ensuring visible results and exceptional care."
        },
        filters: {
            price: "Price",
            skin_tone: "Skin tone",
            color_name: "Color",
            product_type: "Product type",
            items: "items",
            sort: "Sort",
            load_more: "Load more",
            sort_options: {
                recomendados: "Recommended",
                mais_vendidos: "Best Sellers",
                novidades: "Newest",
                maior_desconto: "Highest Discount",
                menor_preco: "Lowest price",
                maior_preco: "Highest price",
                a_z: "A - Z",
                z_a: "Z - A",
                melhor_avaliados: "Best Rated",
                em_tendencia: "Trend"
            }
        },
        trending: {
            tag: "Most Wanted",
            title: "Trending now"
        },
        history: {
            banner_tag: "From an idea to a lifestyle",
            banner_title: "Our Story",
            banner_desc: "We are created to walk with beauty, truth and lightness.",
            values_title: "Values and Purposes",
            transparency_title: "Real Transparency",
            transparency_desc: "Clean and ethical formulas in each product.",
            purity: "Purity",
            sustainability_title: "100% Sustainability",
            sustainability_desc: "Recyclable packaging and renewable resources.",
            lightness_title: "Lightness with purpose",
            join_us_tag: "Join us",
            join_us_title_1: "We invite you to be part of",
            join_us_title_2: "our story.",
            join_us_desc: "Discover what it means to Live Beautifully. Explore our full collection.",
            view_collections: "View collections"
        },
        about_us: {
            tag: "Values and Purposes",
            title_1: "We invite you to be",
            title_2: "part of our story",
            desc: "Join us on this journey and discover what it means to care for yourself with love and purpose."
        },
        footer: {
            customer_service: "Customer Service",
            about: "About Us",
            legal: "Legal",
            subscribe_btn: "Join",
            placeholder: "Your email",
            rights: "All rights reserved.",
            back_to_top: "Back to top",
            need_help: "Need help?",
            track_purchase: "Track purchase",
            institutional: "Institutional",
            categories_title: "Categories",
            links: {
                contact: "Contact us",
                faq: "Frequently Asked Questions",
                support: "Support Center",
                my_account: "My account",
                my_orders: "My orders",
                returns: "Exchanges & returns",
                track: "Track delivery",
                who_we_are: "About us",
                terms: "Terms & Conditions",
                privacy: "Privacy Policy",
                payments: "Payments Policy",
                legal_notice: "Legal Notice",
                admin: "Admin Panel"
            },
            copyright_full: "© 2026 BEAUTHÉ. All rights reserved."
        },
        trust: [
            { id: 1, icon: 'Truck', title: 'FREE SHIPPING FROM 50€' },
            { id: 2, icon: 'Headphones', title: '24/7 CUSTOMER SUPPORT' },
            { id: 3, icon: 'Layers', title: '100% VEGAN PRODUCTS' },
            { id: 4, icon: 'PiggyBank', title: '30 DAYS RETURNS' },
            { id: 5, icon: 'Calendar', title: 'DELIVERY IN 48/72H' }
        ],
        quiz: {
            tag: "Skin Quiz",
            title: "What is your skin type?",
            desc: "Answer 3 questions and discover your ideal ritual.",
            start: "START QUIZ",
            result_title: "YOUR RESULT",
            result_button: "VIEW MY RITUAL",
            types: {
                dry: "Dry Skin",
                oily: "Oily Skin",
                sensitive: "Sensitive Skin",
                normal: "Normal Skin"
            },
            questions: [
                {
                    q: "How does your skin feel when you wake up?",
                    options: [
                        { text: "Tight and dry", type: "dry" },
                        { text: "Shiny in the T-zone", type: "oily" },
                        { text: "Irritated or red", type: "sensitive" },
                        { text: "Balanced", type: "normal" }
                    ]
                },
                {
                    q: "What concerns you most?",
                    options: [
                        { text: "Expression lines", type: "dry" },
                        { text: "Pores and breakouts", type: "oily" },
                        { text: "Redness and itching", type: "sensitive" },
                        { text: "Maintaining glow", type: "normal" }
                    ]
                },
                {
                    q: "How does your skin react to the sun?",
                    options: [
                        { text: "Burns easily", type: "sensitive" },
                        { text: "Tans slowly", type: "normal" },
                        { text: "Feels more oily", type: "oily" },
                        { text: "Flakes or peels", type: "dry" }
                    ]
                }
            ]
        },
        popup: {
            title: "15% DISCOUNT",
            desc: "Subscribe to our newsletter and receive an exclusive coupon for your first purchase.",
            subscribe: "SUBSCRIBE",
            no_thanks: "NO, THANKS",
            privacy: "By subscribing, you accept our privacy policy."
        },
        marquee: [
            "HIGH-END VEGAN COSMETICS",
            "CRUELTY FREE",
            "MADE IN EUROPE",
            "FREE SHIPPING +50€",
            "10% OFF FIRST PURCHASE",
            "RITUALS WITH PURPOSE"
        ],
        product: {
            add_to_cart: "Add to cart",
            paraben_free: "paraben free",
            vegan: "vegan",
            recommended: "Recommended Products",
            reviews_count: "(24 reviews)",
            in_stock: "In stock",
            free_shipping_50: "Free shipping over €50",
            usage: "How to use",
            shipping_title: "Shipping & Returns",
            description_fallback: "High-cosmetic product designed to elevate your beauty routine with visible results.",
            usage_fallback: "Apply on clean, dry skin in circular motions until fully absorbed.",
            ingredients_fallback: "Aqua, Niacinamide, Glycerin, Rosa Centifolia Flower Extract, Hyaluronic Acid, Phenoxyethanol.",
            shipping_fallback: "Free shipping on orders over €50. Delivery in 2-4 business days. Free returns within 30 days.",
            not_found: "Product not found",
            not_found_desc: "This item may have been removed or the link is incorrect.",
            dermatologically_tested: "Dermatologically tested",
            vegan_badge: "Vegan",
            benefits: "BENEFITS",
            benefits_headline: "Exclusive benefits for a unique experience.",
            benefits_desc: "Crafted with advanced technology for a long-lasting effect that respects your skin.",
            benefit_vegan: "Vegan",
            benefit_cruelty_free: "Cruelty Free",
            benefit_no_parabens: "No Parabens",
            benefit_no_fragrance: "Fragrance Free",
            feature_light_texture: "Light Texture",
            feature_thin: "Extra Thin",
            feature_soft_focus: "Soft Focus Effect",
            feature_water_resistant: "Water Resistant",
            reviews: "Reviews",
            trust: {
                shipping: "48h shipping",
                returns: "30-day returns",
                vegan: "100% Vegan",
                tested: "Dermo-tested"
            },
            kit_tag: "Buy as a kit",
            kit_title: "Frequently bought together",
            kit_desc: "Save when bundling this product with its perfect companions.",
            kit_save: "Save",
            kit_savings: "You save",
            kit_add: "Add kit to cart",
            craft_tag: "Crafted with purpose",
            formulation_tag: "Formulation"
        },
        badges: {
            best_seller: "Best Seller",
            new: "New",
            trend: "Trend"
        },
        favorites: {
            title: "Your favorites",
            empty_title_1: "You don't have",
            empty_title_2: "favorites yet",
            clear_favorites: "Clear favorites",
            empty_desc: "When you save products as favorites they'll appear here.",
            explore: "Explore products"
        },
        products: {},
        helpbot: {
            title: "Beauthé Help",
            subtitle: "Smart Assistant",
            placeholder: "Type your question...",
            welcome: "Hi! I'm your Beauthé assistant. How can I help you today?",
            faq: {
                greeting: "Hi! I'm the Beauthé assistant. How can I help you today?",
                shipping: "We ship free over €50 with delivery in 48-72h within mainland Spain.",
                payments: "We accept card, PayPal, bank transfer and Bizum. All payments are 100% secure.",
                returns: "You have 14 days to return any unopened product. Write to contato@beauthe.com.",
                products: "All our products are vegan and cruelty-free, formulated in Europe.",
                skin: "For your skin type we recommend starting with our Skin Quiz so we can suggest a personalised ritual.",
                makeup: "Our Essential line is perfect for a natural look. Are you looking for lips or face?",
                unknown: "I'm not sure about that, but you can write to contato@beauthe.com and we'll reply shortly."
            }
        },
        cro: {
            cart_abandoned_title: "Forgot something?",
            cart_abandoned_desc: "You left items in your cart.",
            continue_purchase: "Continue purchase"
        },
        about_drawer: {
            title: "Our Story",
            heading_story: "FROM AN IDEA TO A LIFESTYLE",
            story: "Beauthé was born from a simple dream: democratise access to high-quality beauty products that respect both skin and the natural environment. We started by experimenting with pure ingredients and clean formulas, driven by the need for transparency in personal care.",
            heading_principles: "OUR PRINCIPLES",
            principles: {
                cruelty_free: { title: "100% Cruelty Free", desc: "We never test on animals and demand the same ethical standards from all our suppliers." },
                clean_formulas: { title: "Clean Formulas", desc: "Our collections are free from parabens, harsh sulphates and unnecessary chemicals." },
                sustainability: { title: "Sustainability", desc: "We use recyclable packaging and aim for carbon-neutral processes." },
                transparency: { title: "Real Transparency", desc: "You have the right to know exactly what ingredients you put on your skin." }
            },
            quote: "“We believe taking care of yourself is the first and most important step to feeling invincible every day.”",
            back: "Back to shop"
        },
        help: {
            title: "How can we help?",
            search_placeholder: "Search your question...",
            most_accessed: "Most viewed",
            contact_us: "Talk to an agent",
            cta_title: "Can't find what you need?",
            cta_desc: "We're available 24/7 via chat or email.",
            back: "Back to help center",
            categories: {
                products: "Effectiveness & Rituals",
                refunds: "Returns & Exchanges",
                payments: "Payments",
                deliveries: "Shipping",
                account: "My Account"
            },
            faqs: {
                most_accessed: [
                    { q: "HOW DO I TRACK MY ORDER?", a: "As soon as your order is shipped you'll get a tracking code by email to follow the delivery in real time." },
                    { q: "WHICH PAYMENT METHODS ARE ACCEPTED?", a: "We accept card, PayPal, Bizum and bank transfer. All transactions are 100% secure." },
                    { q: "CAN I RETURN AN OPENED PRODUCT?", a: "For hygiene reasons we only accept returns with the original seal intact." },
                    { q: "WHAT IS THE DELIVERY TIME?", a: "Average 2-5 business days in mainland; up to 10 days for islands." },
                    { q: "I FORGOT MY PASSWORD, HOW DO I RESET IT?", a: "Click 'Forgot password' on the login screen and follow the instructions sent to your email." }
                ],
                refunds: [
                    { q: "HOW DO I REQUEST A RETURN?", a: "The product must be sealed and unused. Email contato@beauthe.com within 14 days of receipt with the order number." },
                    { q: "WHAT IS THE RETURN WINDOW?", a: "14 days for change-of-mind returns, 30 days for manufacturing defects." },
                    { q: "WHO PAYS THE RETURN SHIPPING?", a: "First exchange for defect or shipping error is on us. For change-of-mind, return shipping is the customer's responsibility." },
                    { q: "HOW IS THE REFUND PROCESSED?", a: "The refund is made to the original payment method." }
                ],
                deliveries: [
                    { q: "HOW MUCH IS SHIPPING?", a: "Free shipping on orders over €50 in mainland Spain and Portugal." },
                    { q: "DO YOU SHIP TO ALL OF EUROPE?", a: "Currently we ship to Spain and Portugal (mainland and islands)." },
                    { q: "HOW DO I TRACK MY ORDER?", a: "You'll receive a tracking code by email as soon as the order is dispatched." },
                    { q: "WHAT IS THE AVERAGE DELIVERY TIME?", a: "2-5 business days mainland; up to 10 days for islands." }
                ],
                payments: [
                    { q: "WHICH PAYMENT METHODS ARE ACCEPTED?", a: "We accept card (Visa, Mastercard), PayPal, Bizum and Apple Pay." },
                    { q: "WHO PROCESSES THE PAYMENTS?", a: "Payments are processed via Stripe." },
                    { q: "DOES MY PAYMENT NEED APPROVAL?", a: "Bizum and Apple Pay are approved instantly. Cards may go through a brief security check." }
                ],
                account: [
                    { q: "I FORGOT MY PASSWORD, WHAT DO I DO?", a: "Click 'Forgot password' on the login screen and we'll email a recovery link." },
                    { q: "HOW DO I UPDATE MY DETAILS?", a: "Go to 'My Profile' after logging in to edit your name, email and saved addresses." },
                    { q: "IS MY DATA SAFE?", a: "Yes. We comply with GDPR and use SSL encryption sitewide." }
                ]
            }
        }
    }
};


export const LanguageProvider = ({ children }) => {
    const [lang, setLang] = useState(localStorage.getItem('beauthe_lang') || 'es');

    const t = (key) => {
        if (!key) return '';
        const keys = key.split('.');
        let value = translationsData[lang];
        for (const k of keys) {
            value = value?.[k];
        }

        // Return empty string or fallback if it resolves to an object (prevents rendering [object Object])
        if (typeof value === 'object' && value !== null) {
            // Check if it's an array (like faq_section.items or sub_*)
            if (Array.isArray(value)) return value;
            return value.title || value.name || value.label || key;
        }

        return value || key;
    };

    const toggleLanguage = (newLang) => {
        setLang(newLang);
        localStorage.setItem('beauthe_lang', newLang);
    };

    const translateProduct = (product) => {
        if (!product) return product;

        // Try to find translation by name (lowercase, no spaces)
        const productKey = product.name?.toLowerCase().replace(/\s+/g, '_');
        const translatedProduct = translationsData[lang]?.products?.[productKey];

        if (translatedProduct) {
            return {
                ...product,
                name: translatedProduct.name || product.name,
                description: translatedProduct.description || product.description
            };
        }

        return product;
    };

    return (
        <LanguageContext.Provider value={{ lang, t, toggleLanguage, translateProduct }}>
            {children}
        </LanguageContext.Provider>
    );
};
