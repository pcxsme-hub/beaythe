// Default Landing Page templates (deterministic copy banks).
// These ship as the base library; admin can override per category in the DB.
// Engine merges DB rows over these defaults by `slug`.
//
// Schema for each entry:
//   {
//     slug, label_*, keywords_*, copy_*: {
//       hooks: [string]            // headline above the title in the LP
//       headlines: [string]        // problem/solution headlines
//       benefits: [{title, desc}]  // benefit pills (3-4 items)
//       faqs: [{q, a}]             // 3-5 specific FAQs
//       routine: [{name, desc}]    // ritual steps (3-5 steps)
//       claims: [string]           // bullet claims used in the trust strip
//       featurePills: [string]     // overlay pills shown over the hero image
//     }
//   }

export const DEFAULT_LANDING_TEMPLATES = [
    // -------- SÉRUM --------
    {
        slug: 'serum',
        label_es: 'Sérum', label_pt: 'Sérum', label_en: 'Serum',
        keywords_es: ['serum', 'sérum', 'concentrado', 'ampolla', 'ampoule'],
        keywords_pt: ['serum', 'sérum', 'concentrado', 'ampola'],
        keywords_en: ['serum', 'concentrate', 'ampoule'],
        default_image_url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=1000',
        copy_es: {
            hooks: ['Concentrado de eficacia', 'Tu ritual diario', 'Ciencia + Pureza'],
            headlines: ['Activos puros, resultados visibles', 'El secreto de una piel radiante', 'Tu piel merece más'],
            benefits: [
                { title: 'Hidratación profunda', desc: 'Activos de baja masa molecular llegan a las capas más profundas.' },
                { title: 'Resultados en 14 días', desc: 'Mejora visible de luminosidad y firmeza con uso constante.' },
                { title: 'Textura ultra-ligera', desc: 'Se absorbe en segundos, sin residuo pegajoso.' },
                { title: 'Apto piel sensible', desc: 'Formulación dermatológicamente testada.' }
            ],
            faqs: [
                { q: '¿Cuándo aplicar?', a: 'Después del tónico y antes de la crema hidratante, mañana y noche.' },
                { q: '¿Cuánto tiempo dura el frasco?', a: 'Con uso diario (2-3 gotas por aplicación) dura aproximadamente 6-8 semanas.' },
                { q: '¿Se puede combinar con otros sérums?', a: 'Sí. Aplica primero el de menor densidad y espera 30 segundos entre capas.' },
                { q: '¿Se puede usar en pieles grasas?', a: 'Totalmente. La textura ligera no obstruye los poros.' }
            ],
            routine: [
                { name: 'Limpieza', desc: 'Comienza con un limpiador suave para retirar impurezas.' },
                { name: 'Tónico', desc: 'Equilibra el pH y prepara la piel para la absorción.' },
                { name: 'Sérum', desc: 'Aplica 2-3 gotas con toques suaves, evitando frotar.' },
                { name: 'Hidratante', desc: 'Sella el tratamiento con tu crema de día o noche.' }
            ],
            claims: ['Vegano', 'Cruelty-free', 'Sin parabenos', 'Made in Europe'],
            featurePills: ['Ultra concentrado', 'Absorción rápida', 'Apto piel sensible', 'Resultados visibles']
        },
        copy_pt: {
            hooks: ['Concentrado de eficácia', 'O seu ritual diário', 'Ciência + Pureza'],
            headlines: ['Ativos puros, resultados visíveis', 'O segredo de uma pele radiante', 'A sua pele merece mais'],
            benefits: [
                { title: 'Hidratação profunda', desc: 'Ativos de baixa massa molecular chegam às camadas mais profundas.' },
                { title: 'Resultados em 14 dias', desc: 'Melhoria visível de luminosidade e firmeza com uso constante.' },
                { title: 'Textura ultra-leve', desc: 'Absorve em segundos, sem resíduo pegajoso.' },
                { title: 'Apto pele sensível', desc: 'Formulação dermatologicamente testada.' }
            ],
            faqs: [
                { q: 'Quando aplicar?', a: 'Depois do tónico e antes do creme hidratante, manhã e noite.' },
                { q: 'Quanto tempo dura o frasco?', a: 'Com uso diário (2-3 gotas por aplicação) dura cerca de 6-8 semanas.' },
                { q: 'Pode combinar com outros sérums?', a: 'Sim. Aplique primeiro o de menor densidade e aguarde 30 segundos entre camadas.' },
                { q: 'Pode ser usado em pele oleosa?', a: 'Totalmente. A textura leve não obstrui os poros.' }
            ],
            routine: [
                { name: 'Limpeza', desc: 'Comece com um limpador suave para remover impurezas.' },
                { name: 'Tónico', desc: 'Equilibra o pH e prepara a pele para a absorção.' },
                { name: 'Sérum', desc: 'Aplique 2-3 gotas com toques suaves, sem esfregar.' },
                { name: 'Hidratante', desc: 'Sela o tratamento com o seu creme de dia ou noite.' }
            ],
            claims: ['Vegano', 'Cruelty-free', 'Sem parabenos', 'Feito na Europa'],
            featurePills: ['Ultra concentrado', 'Absorção rápida', 'Apto pele sensível', 'Resultados visíveis']
        },
        copy_en: {
            hooks: ['Concentrated efficacy', 'Your daily ritual', 'Science + Purity'],
            headlines: ['Pure actives, visible results', 'The secret of radiant skin', 'Your skin deserves more'],
            benefits: [
                { title: 'Deep hydration', desc: 'Low-molecular actives reach the deepest layers of skin.' },
                { title: 'Results in 14 days', desc: 'Visible boost in luminosity and firmness with consistent use.' },
                { title: 'Ultra-light texture', desc: 'Absorbs in seconds with no sticky residue.' },
                { title: 'Sensitive-skin friendly', desc: 'Dermatologically tested formulation.' }
            ],
            faqs: [
                { q: 'When should I apply?', a: 'After toner and before moisturiser, morning and night.' },
                { q: 'How long does a bottle last?', a: 'With daily use (2-3 drops) it lasts about 6-8 weeks.' },
                { q: 'Can it be combined with other serums?', a: 'Yes. Apply lighter textures first and wait 30 seconds between layers.' },
                { q: 'Suitable for oily skin?', a: 'Absolutely. The light texture does not clog pores.' }
            ],
            routine: [
                { name: 'Cleanse', desc: 'Start with a gentle cleanser to remove impurities.' },
                { name: 'Tone', desc: 'Balance pH and prep the skin for absorption.' },
                { name: 'Serum', desc: 'Apply 2-3 drops with gentle taps, never rubbing.' },
                { name: 'Moisturise', desc: 'Seal the treatment with your day or night cream.' }
            ],
            claims: ['Vegan', 'Cruelty-free', 'Paraben-free', 'Made in Europe'],
            featurePills: ['Ultra concentrated', 'Fast absorption', 'Sensitive-skin friendly', 'Visible results']
        }
    },

    // -------- CREMA / HIDRATANTE --------
    {
        slug: 'crema',
        label_es: 'Crema', label_pt: 'Creme', label_en: 'Cream',
        keywords_es: ['crema', 'hidratante', 'nutritiva', 'reparadora', 'antiedad'],
        keywords_pt: ['creme', 'hidratante', 'nutritivo', 'reparador', 'antienvelhecimento', 'antirrugas'],
        keywords_en: ['cream', 'moisturizer', 'moisturiser', 'lotion', 'anti-aging', 'anti-ageing'],
        default_image_url: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=1000',
        copy_es: {
            hooks: ['Hidratación 24h', 'Confort cutáneo', 'Nutrición avanzada'],
            headlines: ['Una piel suave durante todo el día', 'La barrera natural de tu piel, restaurada'],
            benefits: [
                { title: '24h de hidratación', desc: 'Mantiene los niveles de hidratación durante todo el día.' },
                { title: 'Refuerza la barrera', desc: 'Lipidos esenciales restauran la función natural de la piel.' },
                { title: 'No comedogénica', desc: 'No obstruye los poros, ideal para uso diario.' },
                { title: 'Multi-textura', desc: 'Adaptada a piel seca, mixta o sensible.' }
            ],
            faqs: [
                { q: '¿Día o noche?', a: 'Para uso diario, como último paso del ritual.' },
                { q: '¿Se puede usar bajo el maquillaje?', a: 'Sí. Espera 60 segundos para que se absorba completamente.' },
                { q: '¿Para qué tipo de piel?', a: 'Su textura suave funciona en pieles secas, mixtas y sensibles.' }
            ],
            routine: [
                { name: 'Limpieza', desc: 'Retira impurezas con un limpiador suave.' },
                { name: 'Tónico / Sérum', desc: 'Prepara y trata la piel.' },
                { name: 'Crema', desc: 'Aplica una avellana en movimientos circulares ascendentes.' },
                { name: 'Protector solar', desc: 'Por la mañana, finaliza con SPF 30+.' }
            ],
            claims: ['Hidratación 24h', 'No comedogénica', 'Vegano', 'Cruelty-free'],
            featurePills: ['Hidratación 24h', 'Refuerza barrera', 'No comedogénica', 'Apta piel sensible']
        },
        copy_pt: {
            hooks: ['Hidratação 24h', 'Conforto cutâneo', 'Nutrição avançada'],
            headlines: ['Uma pele macia durante todo o dia', 'A barreira natural da sua pele, restaurada'],
            benefits: [
                { title: '24h de hidratação', desc: 'Mantém os níveis de hidratação durante todo o dia.' },
                { title: 'Reforça a barreira', desc: 'Lípidos essenciais restauram a função natural da pele.' },
                { title: 'Não comedogénico', desc: 'Não obstrui os poros, ideal para uso diário.' },
                { title: 'Multi-textura', desc: 'Adaptado a pele seca, mista ou sensível.' }
            ],
            faqs: [
                { q: 'Dia ou noite?', a: 'Para uso diário, como último passo do ritual.' },
                { q: 'Pode ser usado sob a maquilhagem?', a: 'Sim. Aguarde 60 segundos para absorção completa.' },
                { q: 'Para que tipo de pele?', a: 'A sua textura suave funciona em pele seca, mista e sensível.' }
            ],
            routine: [
                { name: 'Limpeza', desc: 'Remove impurezas com um limpador suave.' },
                { name: 'Tónico / Sérum', desc: 'Prepara e trata a pele.' },
                { name: 'Creme', desc: 'Aplique uma avelã em movimentos circulares ascendentes.' },
                { name: 'Protetor solar', desc: 'Pela manhã, termine com SPF 30+.' }
            ],
            claims: ['Hidratação 24h', 'Não comedogénico', 'Vegano', 'Cruelty-free'],
            featurePills: ['Hidratação 24h', 'Reforça barreira', 'Não comedogénico', 'Apto pele sensível']
        },
        copy_en: {
            hooks: ['24h hydration', 'Skin comfort', 'Advanced nourishment'],
            headlines: ['Soft skin all day long', 'Your skin\'s natural barrier, restored'],
            benefits: [
                { title: '24h hydration', desc: 'Maintains hydration levels all day long.' },
                { title: 'Strengthens barrier', desc: 'Essential lipids restore the skin\'s natural function.' },
                { title: 'Non-comedogenic', desc: 'Does not clog pores, ideal for daily use.' },
                { title: 'Multi-texture', desc: 'Suited for dry, combination or sensitive skin.' }
            ],
            faqs: [
                { q: 'Day or night?', a: 'For daily use, as the final step of your ritual.' },
                { q: 'Can it be used under makeup?', a: 'Yes. Wait 60 seconds for full absorption.' },
                { q: 'For what skin type?', a: 'Its soft texture works for dry, combination and sensitive skin.' }
            ],
            routine: [
                { name: 'Cleanse', desc: 'Remove impurities with a gentle cleanser.' },
                { name: 'Tone / Serum', desc: 'Prep and treat the skin.' },
                { name: 'Cream', desc: 'Apply a hazelnut-sized amount in upward circles.' },
                { name: 'Sunscreen', desc: 'In the morning, finish with SPF 30+.' }
            ],
            claims: ['24h hydration', 'Non-comedogenic', 'Vegan', 'Cruelty-free'],
            featurePills: ['24h hydration', 'Barrier-strengthening', 'Non-comedogenic', 'Sensitive-skin friendly']
        }
    },

    // -------- LIMPIADOR --------
    {
        slug: 'limpiador',
        label_es: 'Limpiador', label_pt: 'Limpador', label_en: 'Cleanser',
        keywords_es: ['limpiador', 'limpieza', 'gel', 'espuma', 'micelar', 'desmaquillante'],
        keywords_pt: ['limpador', 'limpeza', 'gel', 'espuma', 'micelar', 'desmaquilhante'],
        keywords_en: ['cleanser', 'cleansing', 'gel', 'foam', 'micellar', 'makeup remover'],
        default_image_url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=1000',
        copy_es: {
            hooks: ['Pureza diaria', 'Limpieza profunda y suave', 'El primer paso de tu ritual'],
            headlines: ['Limpieza que respeta tu piel', 'Pureza sin comprometer la barrera'],
            benefits: [
                { title: 'Limpieza profunda', desc: 'Elimina maquillaje, polución y exceso de sebo en una sola pasada.' },
                { title: 'No reseca', desc: 'Tensoactivos suaves que mantienen la hidratación natural.' },
                { title: 'pH equilibrado', desc: 'Respeta el manto ácido natural de la piel.' },
                { title: 'Apto uso diario', desc: 'Mañana y noche, todos los días.' }
            ],
            faqs: [
                { q: '¿Cuántas veces al día?', a: 'Idealmente 2 veces: por la mañana y antes de dormir.' },
                { q: '¿Sirve para retirar maquillaje?', a: 'Sí. Para maquillaje muy resistente recomendamos doble limpieza.' },
                { q: '¿Es apto para pieles muy sensibles?', a: 'Su fórmula sin sulfatos agresivos es adecuada para pieles reactivas.' }
            ],
            routine: [
                { name: 'Humedece la piel', desc: 'Con agua tibia, prepara el rostro.' },
                { name: 'Aplica el limpiador', desc: 'Distribuye con movimientos circulares durante 30 segundos.' },
                { name: 'Aclara', desc: 'Retira con agua tibia hasta que no queden residuos.' },
                { name: 'Continúa el ritual', desc: 'Sigue con tu tónico, sérum y crema.' }
            ],
            claims: ['Sin sulfatos agresivos', 'pH equilibrado', 'Vegano', 'Apto piel sensible'],
            featurePills: ['Limpieza profunda', 'No reseca', 'pH equilibrado', 'Uso diario']
        },
        copy_pt: {
            hooks: ['Pureza diária', 'Limpeza profunda e suave', 'O primeiro passo do seu ritual'],
            headlines: ['Limpeza que respeita a sua pele', 'Pureza sem comprometer a barreira'],
            benefits: [
                { title: 'Limpeza profunda', desc: 'Remove maquilhagem, poluição e excesso de sebo numa só passagem.' },
                { title: 'Não resseca', desc: 'Tensoativos suaves que mantêm a hidratação natural.' },
                { title: 'pH equilibrado', desc: 'Respeita o manto ácido natural da pele.' },
                { title: 'Uso diário', desc: 'Manhã e noite, todos os dias.' }
            ],
            faqs: [
                { q: 'Quantas vezes por dia?', a: 'Idealmente 2 vezes: de manhã e antes de dormir.' },
                { q: 'Serve para remover maquilhagem?', a: 'Sim. Para maquilhagem muito resistente recomendamos dupla limpeza.' },
                { q: 'É apto para pele muito sensível?', a: 'A fórmula sem sulfatos agressivos é adequada para pele reativa.' }
            ],
            routine: [
                { name: 'Humedece a pele', desc: 'Com água morna, prepara o rosto.' },
                { name: 'Aplica o limpador', desc: 'Distribui em movimentos circulares durante 30 segundos.' },
                { name: 'Enxagua', desc: 'Remove com água morna até não restarem resíduos.' },
                { name: 'Continua o ritual', desc: 'Segue com o seu tónico, sérum e creme.' }
            ],
            claims: ['Sem sulfatos agressivos', 'pH equilibrado', 'Vegano', 'Apto pele sensível'],
            featurePills: ['Limpeza profunda', 'Não resseca', 'pH equilibrado', 'Uso diário']
        },
        copy_en: {
            hooks: ['Daily purity', 'Deep yet gentle cleanse', 'The first step of your ritual'],
            headlines: ['A cleanse that respects your skin', 'Purity without compromising the barrier'],
            benefits: [
                { title: 'Deep cleanse', desc: 'Removes makeup, pollution and excess sebum in one pass.' },
                { title: 'Non-drying', desc: 'Gentle surfactants preserve natural hydration.' },
                { title: 'pH balanced', desc: 'Respects the skin\'s natural acid mantle.' },
                { title: 'Daily-use friendly', desc: 'Morning and night, every day.' }
            ],
            faqs: [
                { q: 'How many times a day?', a: 'Ideally twice: in the morning and before bed.' },
                { q: 'Does it remove makeup?', a: 'Yes. For heavy makeup we recommend a double cleanse.' },
                { q: 'Suitable for very sensitive skin?', a: 'Its sulphate-free formula is gentle on reactive skin.' }
            ],
            routine: [
                { name: 'Dampen skin', desc: 'Prep your face with lukewarm water.' },
                { name: 'Apply cleanser', desc: 'Massage in circular motions for 30 seconds.' },
                { name: 'Rinse', desc: 'Rinse with lukewarm water until no residue remains.' },
                { name: 'Continue ritual', desc: 'Follow with toner, serum and cream.' }
            ],
            claims: ['Sulphate-free', 'pH balanced', 'Vegan', 'Sensitive-skin friendly'],
            featurePills: ['Deep cleanse', 'Non-drying', 'pH balanced', 'Daily use']
        }
    },

    // -------- LABIOS --------
    {
        slug: 'labios',
        label_es: 'Labios', label_pt: 'Lábios', label_en: 'Lips',
        keywords_es: ['labio', 'lip', 'gloss', 'balsamo', 'pintalabios', 'mate', 'lipstick'],
        keywords_pt: ['lábio', 'labio', 'lip', 'gloss', 'bálsamo', 'batom'],
        keywords_en: ['lip', 'gloss', 'balm', 'lipstick', 'matte'],
        default_image_url: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=1000',
        copy_es: {
            hooks: ['Brillo y nutrición', 'El acabado perfecto', 'Para tus labios'],
            headlines: ['Color y cuidado en una sola pasada', 'Labios hidratados durante horas'],
            benefits: [
                { title: 'Hidratación duradera', desc: 'Aceites botánicos mantienen los labios suaves todo el día.' },
                { title: 'No transfiere', desc: 'Acabado de larga duración que no migra.' },
                { title: 'Color uniforme', desc: 'Pigmentos puros para una aplicación impecable.' },
                { title: 'Sin parabenos', desc: 'Fórmula limpia y respetuosa.' }
            ],
            faqs: [
                { q: '¿Cuánto dura el color?', a: 'Hasta 6 horas con aplicación normal, 4 horas tras comer/beber.' },
                { q: '¿Es resistente al agua?', a: 'Resistente a salpicaduras y a comidas ligeras; no es waterproof total.' },
                { q: '¿Funciona en labios secos?', a: 'Aplica primero un bálsamo de noche; el producto desliza mejor sobre labios hidratados.' }
            ],
            routine: [
                { name: 'Hidrata', desc: 'Aplica un bálsamo nutritivo y deja absorber.' },
                { name: 'Perfila', desc: 'Define el contorno con un lápiz a juego (opcional).' },
                { name: 'Aplica el color', desc: 'Empieza por el centro hacia los bordes.' },
                { name: 'Fija', desc: 'Da un toquecito con pañuelo y reaplica para mayor duración.' }
            ],
            claims: ['Vegano', 'No transfiere', 'Larga duración', 'Sin parabenos'],
            featurePills: ['Larga duración', 'No transfiere', 'Hidratante', 'Color intenso']
        },
        copy_pt: {
            hooks: ['Brilho e nutrição', 'O acabamento perfeito', 'Para os seus lábios'],
            headlines: ['Cor e cuidado numa só passagem', 'Lábios hidratados durante horas'],
            benefits: [
                { title: 'Hidratação duradoura', desc: 'Óleos botânicos mantêm os lábios macios o dia todo.' },
                { title: 'Não transfere', desc: 'Acabamento de longa duração que não migra.' },
                { title: 'Cor uniforme', desc: 'Pigmentos puros para uma aplicação impecável.' },
                { title: 'Sem parabenos', desc: 'Fórmula limpa e respeitosa.' }
            ],
            faqs: [
                { q: 'Quanto tempo dura a cor?', a: 'Até 6 horas com aplicação normal, 4 horas após comer/beber.' },
                { q: 'É resistente à água?', a: 'Resistente a salpicos e refeições leves; não é totalmente waterproof.' },
                { q: 'Funciona em lábios secos?', a: 'Aplica primeiro um bálsamo à noite; o produto desliza melhor em lábios hidratados.' }
            ],
            routine: [
                { name: 'Hidrata', desc: 'Aplica um bálsamo nutritivo e deixa absorver.' },
                { name: 'Contorna', desc: 'Define o contorno com um lápis a condizer (opcional).' },
                { name: 'Aplica a cor', desc: 'Começa pelo centro em direção às extremidades.' },
                { name: 'Fixa', desc: 'Dá um toque com lenço e reaplica para maior duração.' }
            ],
            claims: ['Vegano', 'Não transfere', 'Longa duração', 'Sem parabenos'],
            featurePills: ['Longa duração', 'Não transfere', 'Hidratante', 'Cor intensa']
        },
        copy_en: {
            hooks: ['Shine and nourishment', 'The perfect finish', 'For your lips'],
            headlines: ['Colour and care in one sweep', 'Hydrated lips for hours'],
            benefits: [
                { title: 'Long-lasting hydration', desc: 'Botanical oils keep lips soft all day.' },
                { title: 'Non-transfer', desc: 'Long-wear finish that doesn\'t migrate.' },
                { title: 'Even colour', desc: 'Pure pigments for flawless application.' },
                { title: 'Paraben-free', desc: 'Clean and respectful formula.' }
            ],
            faqs: [
                { q: 'How long does the colour last?', a: 'Up to 6 hours with normal wear, 4 hours after eating/drinking.' },
                { q: 'Is it water-resistant?', a: 'Resistant to splashes and light meals; not fully waterproof.' },
                { q: 'Does it work on dry lips?', a: 'Apply a balm at night first; the product glides better on hydrated lips.' }
            ],
            routine: [
                { name: 'Hydrate', desc: 'Apply a nourishing balm and let it absorb.' },
                { name: 'Outline', desc: 'Define the contour with a matching liner (optional).' },
                { name: 'Apply colour', desc: 'Start from the centre outwards.' },
                { name: 'Set', desc: 'Blot with tissue and reapply for longer wear.' }
            ],
            claims: ['Vegan', 'Non-transfer', 'Long-lasting', 'Paraben-free'],
            featurePills: ['Long-lasting', 'Non-transfer', 'Hydrating', 'Intense colour']
        }
    },

    // -------- MASCARA OJOS --------
    {
        slug: 'mascara-ojos',
        label_es: 'Máscara de Pestañas', label_pt: 'Máscara de Pestanas', label_en: 'Mascara',
        keywords_es: ['mascara', 'máscara', 'pestañas', 'rímel', 'volumen', 'curvatura', 'pestaña'],
        keywords_pt: ['máscara', 'mascara', 'pestanas', 'pestana', 'rímel'],
        keywords_en: ['mascara', 'lash', 'lashes', 'volume', 'lengthening'],
        default_image_url: 'https://images.unsplash.com/photo-1512496015851-a1c8d1720d29?auto=format&fit=crop&q=80&w=1000',
        copy_es: {
            hooks: ['Mirada intensa', 'Volumen + Curvatura', 'Pestañas espectaculares'],
            headlines: ['Pestañas largas, definidas y de impacto', 'La fórmula que tus pestañas merecen'],
            benefits: [
                { title: 'Volumen extremo', desc: 'Cepillo de precisión que envuelve cada pestaña desde la raíz.' },
                { title: 'Resistente al agua', desc: 'Aguanta lágrimas, sudor y humedad sin correrse.' },
                { title: 'Larga duración', desc: 'Hasta 16 horas sin caer ni hacer grumos.' },
                { title: 'Cuida la pestaña', desc: 'Enriquecida con activos que fortalecen.' }
            ],
            faqs: [
                { q: '¿Es waterproof?', a: 'Sí, resiste agua, sudor y humedad sin correrse.' },
                { q: '¿Cómo se retira?', a: 'Con un desmaquillante bifásico para fórmulas waterproof.' },
                { q: '¿Hace grumos?', a: 'No. La fórmula está balanceada y el cepillo de precisión separa las pestañas.' }
            ],
            routine: [
                { name: 'Riza las pestañas', desc: 'Usa un rizador antes de aplicar el producto.' },
                { name: 'Primera capa', desc: 'Desde la raíz hacia las puntas con movimiento en zigzag.' },
                { name: 'Segunda capa', desc: 'Aplica antes de que la primera se seque para evitar grumos.' },
                { name: 'Pestañas inferiores', desc: 'Usa la punta del cepillo o el lateral con suavidad.' }
            ],
            claims: ['Waterproof', 'Larga duración', 'Vegano', 'Sin parabenos'],
            featurePills: ['Volumen extremo', 'Waterproof', 'Larga duración', 'Cepillo de precisión']
        },
        copy_pt: {
            hooks: ['Olhar intenso', 'Volume + Curvatura', 'Pestanas espetaculares'],
            headlines: ['Pestanas longas, definidas e de impacto', 'A fórmula que as suas pestanas merecem'],
            benefits: [
                { title: 'Volume extremo', desc: 'Escovinha de precisão que envolve cada pestana desde a raiz.' },
                { title: 'Resistente à água', desc: 'Aguenta lágrimas, suor e humidade sem escorrer.' },
                { title: 'Longa duração', desc: 'Até 16 horas sem cair nem fazer grumos.' },
                { title: 'Cuida da pestana', desc: 'Enriquecida com ativos fortificantes.' }
            ],
            faqs: [
                { q: 'É waterproof?', a: 'Sim, resiste a água, suor e humidade sem escorrer.' },
                { q: 'Como se remove?', a: 'Com um desmaquilhante bifásico próprio para fórmulas waterproof.' },
                { q: 'Faz grumos?', a: 'Não. A fórmula é equilibrada e a escovinha de precisão separa as pestanas.' }
            ],
            routine: [
                { name: 'Encrespa as pestanas', desc: 'Usa um curvex antes de aplicar o produto.' },
                { name: 'Primeira camada', desc: 'Da raiz às pontas com movimento em ziguezague.' },
                { name: 'Segunda camada', desc: 'Aplica antes da primeira secar para evitar grumos.' },
                { name: 'Pestanas inferiores', desc: 'Usa a ponta da escovinha ou o lado com suavidade.' }
            ],
            claims: ['Waterproof', 'Longa duração', 'Vegano', 'Sem parabenos'],
            featurePills: ['Volume extremo', 'Waterproof', 'Longa duração', 'Escovinha de precisão']
        },
        copy_en: {
            hooks: ['Intense gaze', 'Volume + Lift', 'Striking lashes'],
            headlines: ['Long, defined, high-impact lashes', 'The formula your lashes deserve'],
            benefits: [
                { title: 'Extreme volume', desc: 'Precision brush wraps every lash from the root.' },
                { title: 'Water resistant', desc: 'Holds up against tears, sweat and humidity.' },
                { title: 'Long-lasting', desc: 'Up to 16 hours with no fall-down or clumping.' },
                { title: 'Lash-friendly', desc: 'Enriched with strengthening actives.' }
            ],
            faqs: [
                { q: 'Is it waterproof?', a: 'Yes — resists water, sweat and humidity without smudging.' },
                { q: 'How do I remove it?', a: 'Use a bi-phase remover designed for waterproof formulas.' },
                { q: 'Does it clump?', a: 'No. Balanced formula and precision brush separate every lash.' }
            ],
            routine: [
                { name: 'Curl your lashes', desc: 'Use an eyelash curler before applying.' },
                { name: 'First coat', desc: 'From root to tip in a zig-zag motion.' },
                { name: 'Second coat', desc: 'Apply before the first dries to avoid clumps.' },
                { name: 'Lower lashes', desc: 'Use the tip or side of the brush very gently.' }
            ],
            claims: ['Waterproof', 'Long-lasting', 'Vegan', 'Paraben-free'],
            featurePills: ['Extreme volume', 'Waterproof', 'Long-lasting', 'Precision brush']
        }
    },

    // -------- CABELLO --------
    {
        slug: 'cabello',
        label_es: 'Cabello', label_pt: 'Cabelo', label_en: 'Hair',
        keywords_es: ['cabello', 'capilar', 'champu', 'champú', 'acondicionador', 'mascarilla cabello'],
        keywords_pt: ['cabelo', 'capilar', 'champô', 'amaciador', 'condicionador'],
        keywords_en: ['hair', 'shampoo', 'conditioner', 'mask hair'],
        default_image_url: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=1000',
        copy_es: {
            hooks: ['Brillo y nutrición', 'Reparación profunda', 'Tu ritual capilar'],
            headlines: ['Cabello fuerte, brillante y suave', 'Reparación desde la raíz hasta las puntas'],
            benefits: [
                { title: 'Repara fibra capilar', desc: 'Activos que penetran en la cutícula y reconstruyen.' },
                { title: 'Brillo intenso', desc: 'Devuelve la luminosidad natural sin pesar.' },
                { title: 'Sin sulfatos agresivos', desc: 'Limpia respetando el color y la fibra.' },
                { title: 'Apto uso diario', desc: 'Suficientemente suave para todo el año.' }
            ],
            faqs: [
                { q: '¿Es apto para cabello teñido?', a: 'Sí, su fórmula sin sulfatos agresivos preserva el color.' },
                { q: '¿Cuánto producto usar?', a: 'Una avellana para cabello corto, dos para medio o largo.' },
                { q: '¿Funciona en cabello rizado?', a: 'Sí. Define los rizos sin resecar.' }
            ],
            routine: [
                { name: 'Humedece el cabello', desc: 'Con agua tibia, no caliente.' },
                { name: 'Aplica el producto', desc: 'Distribuye y masajea el cuero cabelludo durante 1 minuto.' },
                { name: 'Aclara', desc: 'Aclara con agua tibia hasta eliminar el producto.' },
                { name: 'Acaba con frío', desc: 'Cierra la cutícula con un último enjuague frío.' }
            ],
            claims: ['Sin sulfatos agresivos', 'Apto cabello teñido', 'Vegano', 'Cruelty-free'],
            featurePills: ['Brillo intenso', 'Reparador', 'Sin sulfatos', 'Uso diario']
        },
        copy_pt: {
            hooks: ['Brilho e nutrição', 'Reparação profunda', 'O seu ritual capilar'],
            headlines: ['Cabelo forte, brilhante e macio', 'Reparação da raiz às pontas'],
            benefits: [
                { title: 'Repara a fibra capilar', desc: 'Ativos que penetram na cutícula e reconstroem.' },
                { title: 'Brilho intenso', desc: 'Devolve a luminosidade natural sem pesar.' },
                { title: 'Sem sulfatos agressivos', desc: 'Limpa respeitando a cor e a fibra.' },
                { title: 'Uso diário', desc: 'Suficientemente suave para todo o ano.' }
            ],
            faqs: [
                { q: 'É adequado para cabelo pintado?', a: 'Sim, a fórmula sem sulfatos agressivos preserva a cor.' },
                { q: 'Quanto produto usar?', a: 'Uma avelã para cabelo curto, duas para médio ou longo.' },
                { q: 'Funciona em cabelo encaracolado?', a: 'Sim. Define os caracóis sem ressecar.' }
            ],
            routine: [
                { name: 'Humedece o cabelo', desc: 'Com água morna, não quente.' },
                { name: 'Aplica o produto', desc: 'Distribui e massaja o couro cabeludo durante 1 minuto.' },
                { name: 'Enxagua', desc: 'Enxagua com água morna até eliminar o produto.' },
                { name: 'Termina com frio', desc: 'Fecha a cutícula com um último enxaguar frio.' }
            ],
            claims: ['Sem sulfatos agressivos', 'Apto cabelo pintado', 'Vegano', 'Cruelty-free'],
            featurePills: ['Brilho intenso', 'Reparador', 'Sem sulfatos', 'Uso diário']
        },
        copy_en: {
            hooks: ['Shine and nourishment', 'Deep repair', 'Your hair ritual'],
            headlines: ['Strong, shiny, soft hair', 'Repair from root to tip'],
            benefits: [
                { title: 'Repairs the hair fibre', desc: 'Actives penetrate the cuticle and rebuild it.' },
                { title: 'Intense shine', desc: 'Restores natural luminosity without weighing down.' },
                { title: 'Sulphate-free', desc: 'Cleanses while preserving colour and fibre.' },
                { title: 'Daily-use friendly', desc: 'Gentle enough to use year-round.' }
            ],
            faqs: [
                { q: 'Suitable for coloured hair?', a: 'Yes — its sulphate-free formula preserves colour.' },
                { q: 'How much product?', a: 'A hazelnut size for short hair, double for medium or long.' },
                { q: 'Does it work on curly hair?', a: 'Yes. Defines curls without drying them.' }
            ],
            routine: [
                { name: 'Wet your hair', desc: 'With lukewarm water, not hot.' },
                { name: 'Apply', desc: 'Distribute and massage the scalp for 1 minute.' },
                { name: 'Rinse', desc: 'Rinse with lukewarm water until clean.' },
                { name: 'Finish cold', desc: 'Seal the cuticle with a final cold rinse.' }
            ],
            claims: ['Sulphate-free', 'Colour-safe', 'Vegan', 'Cruelty-free'],
            featurePills: ['Intense shine', 'Repairing', 'Sulphate-free', 'Daily use']
        }
    },

    // -------- CUERPO --------
    {
        slug: 'cuerpo',
        label_es: 'Cuerpo', label_pt: 'Corpo', label_en: 'Body',
        keywords_es: ['cuerpo', 'corporal', 'aceite', 'manteca', 'gel ducha', 'reparadora', 'pies', 'manos'],
        keywords_pt: ['corpo', 'corporal', 'óleo corporal', 'manteiga', 'gel duche', 'pés', 'mãos'],
        keywords_en: ['body', 'body oil', 'body lotion', 'shower gel', 'hands', 'feet', 'foot'],
        default_image_url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=1000',
        copy_es: {
            hooks: ['Cuidado integral', 'Tu piel, en su mejor versión', 'Hidratación de cuerpo entero'],
            headlines: ['Una piel suave, nutrida y sedosa', 'Cuidar de ti es el mejor ritual'],
            benefits: [
                { title: 'Nutrición profunda', desc: 'Aceites botánicos hidratan capa tras capa.' },
                { title: 'Absorción rápida', desc: 'Sin sensación grasa al tacto.' },
                { title: 'Aroma sutil', desc: 'Una experiencia sensorial duradera.' },
                { title: 'Uso diario', desc: 'Después del baño o cuando sientas la piel seca.' }
            ],
            faqs: [
                { q: '¿Cuándo aplicar?', a: 'Idealmente con la piel humeda, justo después del baño.' },
                { q: '¿Es apto para pieles sensibles?', a: 'Sí. La fórmula sin perfumes agresivos respeta pieles reactivas.' },
                { q: '¿Mancha la ropa?', a: 'No, una vez absorbido. Espera 1-2 minutos antes de vestirte.' }
            ],
            routine: [
                { name: 'Exfoliar (1-2x/semana)', desc: 'Prepara la piel para mejor absorción.' },
                { name: 'Ducha tibia', desc: 'Evita agua muy caliente que reseca.' },
                { name: 'Aplicar el producto', desc: 'Distribuye con masaje en piel humeda.' },
                { name: 'Sécate suavemente', desc: 'Toques con la toalla, sin frotar.' }
            ],
            claims: ['Hidratación profunda', 'Absorción rápida', 'Vegano', 'Cruelty-free'],
            featurePills: ['Hidratación profunda', 'Absorción rápida', 'Aroma sutil', 'Uso diario']
        },
        copy_pt: {
            hooks: ['Cuidado integral', 'A sua pele, na melhor versão', 'Hidratação de corpo inteiro'],
            headlines: ['Uma pele macia, nutrida e sedosa', 'Cuidar de si é o melhor ritual'],
            benefits: [
                { title: 'Nutrição profunda', desc: 'Óleos botânicos hidratam camada após camada.' },
                { title: 'Absorção rápida', desc: 'Sem sensação oleosa ao toque.' },
                { title: 'Aroma subtil', desc: 'Uma experiência sensorial duradoura.' },
                { title: 'Uso diário', desc: 'Após o banho ou quando sentir a pele seca.' }
            ],
            faqs: [
                { q: 'Quando aplicar?', a: 'Idealmente com a pele húmida, logo após o banho.' },
                { q: 'É adequado para pele sensível?', a: 'Sim. A fórmula sem perfumes agressivos respeita pele reativa.' },
                { q: 'Mancha a roupa?', a: 'Não, depois de absorvido. Aguarde 1-2 minutos antes de se vestir.' }
            ],
            routine: [
                { name: 'Esfoliar (1-2x/semana)', desc: 'Prepara a pele para melhor absorção.' },
                { name: 'Banho morno', desc: 'Evita água muito quente que resseca.' },
                { name: 'Aplicar o produto', desc: 'Distribui com massagem em pele húmida.' },
                { name: 'Seca suavemente', desc: 'Toques com a toalha, sem esfregar.' }
            ],
            claims: ['Hidratação profunda', 'Absorção rápida', 'Vegano', 'Cruelty-free'],
            featurePills: ['Hidratação profunda', 'Absorção rápida', 'Aroma subtil', 'Uso diário']
        },
        copy_en: {
            hooks: ['All-round care', 'Your skin, at its best', 'Full-body hydration'],
            headlines: ['Soft, nourished, silky skin', 'Caring for yourself is the best ritual'],
            benefits: [
                { title: 'Deep nourishment', desc: 'Botanical oils hydrate layer after layer.' },
                { title: 'Fast absorption', desc: 'No greasy feel afterwards.' },
                { title: 'Subtle scent', desc: 'A long-lasting sensorial experience.' },
                { title: 'Daily use', desc: 'After bathing or whenever skin feels dry.' }
            ],
            faqs: [
                { q: 'When should I apply?', a: 'Ideally on damp skin, right after bathing.' },
                { q: 'Is it suitable for sensitive skin?', a: 'Yes. The fragrance-light formula respects reactive skin.' },
                { q: 'Does it stain clothes?', a: 'No, once absorbed. Wait 1-2 minutes before dressing.' }
            ],
            routine: [
                { name: 'Exfoliate (1-2x/week)', desc: 'Preps skin for better absorption.' },
                { name: 'Warm shower', desc: 'Avoid very hot water which dries skin.' },
                { name: 'Apply', desc: 'Massage onto damp skin.' },
                { name: 'Pat dry', desc: 'Pat with a towel, never rub.' }
            ],
            claims: ['Deep hydration', 'Fast absorption', 'Vegan', 'Cruelty-free'],
            featurePills: ['Deep hydration', 'Fast absorption', 'Subtle scent', 'Daily use']
        }
    },

    // -------- PERFUMES --------
    {
        slug: 'perfumes',
        label_es: 'Perfume', label_pt: 'Perfume', label_en: 'Perfume',
        keywords_es: ['perfume', 'fragancia', 'eau de toilette', 'eau de parfum', 'colonia', 'edt', 'edp'],
        keywords_pt: ['perfume', 'fragrância', 'eau de toilette', 'colónia'],
        keywords_en: ['perfume', 'fragrance', 'eau de toilette', 'eau de parfum', 'cologne'],
        default_image_url: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=1000',
        copy_es: {
            hooks: ['Tu firma olfativa', 'Una experiencia sensorial', 'Aroma con carácter'],
            headlines: ['La fragancia que te define', 'Notas que dejan huella'],
            benefits: [
                { title: 'Larga duración', desc: 'Hasta 8 horas de fragancia en la piel.' },
                { title: 'Notas premium', desc: 'Composición construida sobre ingredientes seleccionados.' },
                { title: 'Estela memorable', desc: 'Una huella sutil pero presente, que te acompaña.' },
                { title: 'Frasco icónico', desc: 'Diseño que hace honor al contenido.' }
            ],
            faqs: [
                { q: '¿Cuánto dura el aroma?', a: 'Entre 6 y 8 horas, dependiendo del tipo de piel y la zona de aplicación.' },
                { q: '¿Dónde aplicar para mejor proyección?', a: 'En zonas de pulso: muñecas, cuello, detrás de las orejas y pliegue del codo.' },
                { q: '¿Es unisex?', a: 'Lee la nota de salida para identificar el carácter; muchas fragancias modernas son unisex.' }
            ],
            routine: [
                { name: 'Aplica sobre piel hidratada', desc: 'La hidratación intensifica y prolonga el aroma.' },
                { name: 'Vaporiza a 15 cm', desc: 'Para una distribución uniforme sin saturar.' },
                { name: 'No frotes', desc: 'Frotar rompe las moléculas de las notas de salida.' },
                { name: 'Capas opcionales', desc: 'Combina con su versión en aceite o body lotion para mayor fijación.' }
            ],
            claims: ['Larga duración', 'Notas premium', 'Vegano', 'Made in Europe'],
            featurePills: ['Hasta 8h', 'Notas premium', 'Vegano', 'Frasco premium']
        },
        copy_pt: {
            hooks: ['A sua assinatura olfativa', 'Uma experiência sensorial', 'Aroma com carácter'],
            headlines: ['A fragrância que o define', 'Notas que deixam marca'],
            benefits: [
                { title: 'Longa duração', desc: 'Até 8 horas de fragrância na pele.' },
                { title: 'Notas premium', desc: 'Composição construída sobre ingredientes selecionados.' },
                { title: 'Estela memorável', desc: 'Uma marca subtil mas presente, que o acompanha.' },
                { title: 'Frasco icónico', desc: 'Design que faz justiça ao conteúdo.' }
            ],
            faqs: [
                { q: 'Quanto tempo dura o aroma?', a: 'Entre 6 e 8 horas, dependendo do tipo de pele e da zona de aplicação.' },
                { q: 'Onde aplicar para melhor projeção?', a: 'Em zonas de pulso: pulsos, pescoço, atrás das orelhas e dobra do cotovelo.' },
                { q: 'É unissexo?', a: 'Leia a nota de saída para identificar o carácter; muitas fragrâncias modernas são unissexo.' }
            ],
            routine: [
                { name: 'Aplique em pele hidratada', desc: 'A hidratação intensifica e prolonga o aroma.' },
                { name: 'Vaporize a 15 cm', desc: 'Para uma distribuição uniforme sem saturar.' },
                { name: 'Não esfregue', desc: 'Esfregar quebra as moléculas das notas de saída.' },
                { name: 'Camadas opcionais', desc: 'Combine com a versão em óleo ou body lotion para maior fixação.' }
            ],
            claims: ['Longa duração', 'Notas premium', 'Vegano', 'Feito na Europa'],
            featurePills: ['Até 8h', 'Notas premium', 'Vegano', 'Frasco premium']
        },
        copy_en: {
            hooks: ['Your signature scent', 'A sensorial experience', 'Aroma with character'],
            headlines: ['The fragrance that defines you', 'Notes that leave a mark'],
            benefits: [
                { title: 'Long-lasting', desc: 'Up to 8 hours of fragrance on the skin.' },
                { title: 'Premium notes', desc: 'Composition built on hand-picked ingredients.' },
                { title: 'Memorable trail', desc: 'A subtle but present sillage that follows you.' },
                { title: 'Iconic bottle', desc: 'A design that lives up to the content.' }
            ],
            faqs: [
                { q: 'How long does the scent last?', a: 'Between 6 and 8 hours, depending on skin type and application zone.' },
                { q: 'Where to apply for the best projection?', a: 'On pulse points: wrists, neck, behind the ears and inner elbow.' },
                { q: 'Is it unisex?', a: 'Read the top notes to identify the character; many modern fragrances are unisex.' }
            ],
            routine: [
                { name: 'Apply on hydrated skin', desc: 'Hydration intensifies and prolongs the scent.' },
                { name: 'Spray at 15 cm', desc: 'For an even distribution without saturating.' },
                { name: 'Do not rub', desc: 'Rubbing breaks the molecules of the top notes.' },
                { name: 'Optional layering', desc: 'Combine with body oil or lotion for stronger longevity.' }
            ],
            claims: ['Long-lasting', 'Premium notes', 'Vegan', 'Made in Europe'],
            featurePills: ['Up to 8h', 'Premium notes', 'Vegan', 'Premium bottle']
        }
    },

    // -------- UÑAS / TOOLS --------
    {
        slug: 'unas',
        label_es: 'Uñas y Manicura', label_pt: 'Unhas e Manicure', label_en: 'Nails & Manicure',
        keywords_es: ['uña', 'unas', 'esmalte', 'manicura', 'pedicura', 'lámpara uñas', 'torno', 'gel polish'],
        keywords_pt: ['unha', 'esmalte', 'manicure', 'pedicure', 'gel polish'],
        keywords_en: ['nail', 'polish', 'manicure', 'pedicure', 'gel polish'],
        default_image_url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&q=80&w=1000',
        copy_es: {
            hooks: ['Manicura profesional', 'Salón en casa', 'Tus uñas, perfectas'],
            headlines: ['Una manicura impecable, sin salir de casa', 'El kit que las profesionales usan'],
            benefits: [
                { title: 'Acabado salón', desc: 'Resultado profesional con duración de hasta 21 días.' },
                { title: 'Fácil aplicación', desc: 'Curva la fórmula al pincel para una pasada uniforme.' },
                { title: 'Sin daño', desc: 'Fórmula respetuosa con la queratina de la uña.' },
                { title: 'Brillo extremo', desc: 'Acabado espejo desde la primera capa.' }
            ],
            faqs: [
                { q: '¿Cuánto dura?', a: 'Hasta 21 días sin saltarse, con secado UV/LED apropiado.' },
                { q: '¿Cómo se retira?', a: 'Con cápsula de algodón empapado en quitaesmalte específico durante 10 minutos.' },
                { q: '¿Daña la uña?', a: 'No, si se respeta la pausa de 1 semana entre aplicaciones y se hidrata la cutícula.' }
            ],
            routine: [
                { name: 'Prepara la uña', desc: 'Lima, retira la cutícula y desengrasa con alcohol.' },
                { name: 'Capa base', desc: 'Aplica una capa fina de base coat y cura.' },
                { name: 'Color', desc: 'Dos pasadas finas, curando entre cada una.' },
                { name: 'Top coat', desc: 'Sella con top coat para máxima duración y brillo.' }
            ],
            claims: ['Acabado salón', 'Hasta 21 días', 'Vegano', 'Sin tóxicos'],
            featurePills: ['21 días', 'Acabado salón', 'Brillo extremo', 'Fácil aplicación']
        },
        copy_pt: {
            hooks: ['Manicure profissional', 'Salão em casa', 'As suas unhas, perfeitas'],
            headlines: ['Uma manicure impecável sem sair de casa', 'O kit que as profissionais usam'],
            benefits: [
                { title: 'Acabamento salão', desc: 'Resultado profissional com duração até 21 dias.' },
                { title: 'Fácil aplicação', desc: 'A fórmula curva-se ao pincel para uma passagem uniforme.' },
                { title: 'Sem danos', desc: 'Fórmula respeitosa com a queratina da unha.' },
                { title: 'Brilho extremo', desc: 'Acabamento espelho desde a primeira camada.' }
            ],
            faqs: [
                { q: 'Quanto tempo dura?', a: 'Até 21 dias sem saltar, com secagem UV/LED apropriada.' },
                { q: 'Como se remove?', a: 'Com cápsula de algodão embebido em removedor específico durante 10 minutos.' },
                { q: 'Danifica a unha?', a: 'Não, se respeitar a pausa de 1 semana entre aplicações e hidratar a cutícula.' }
            ],
            routine: [
                { name: 'Prepara a unha', desc: 'Lima, remove a cutícula e desengordura com álcool.' },
                { name: 'Camada base', desc: 'Aplica uma camada fina de base coat e cura.' },
                { name: 'Cor', desc: 'Duas passagens finas, curando entre cada uma.' },
                { name: 'Top coat', desc: 'Sela com top coat para máxima duração e brilho.' }
            ],
            claims: ['Acabamento salão', 'Até 21 dias', 'Vegano', 'Sem tóxicos'],
            featurePills: ['21 dias', 'Acabamento salão', 'Brilho extremo', 'Fácil aplicação']
        },
        copy_en: {
            hooks: ['Professional manicure', 'Salon at home', 'Your nails, perfect'],
            headlines: ['Flawless manicure without leaving home', 'The kit professionals use'],
            benefits: [
                { title: 'Salon finish', desc: 'Professional result lasting up to 21 days.' },
                { title: 'Easy application', desc: 'The formula curves to the brush for a smooth pass.' },
                { title: 'Damage-free', desc: 'Respectful of the natural keratin of the nail.' },
                { title: 'Extreme shine', desc: 'Mirror finish from the first coat.' }
            ],
            faqs: [
                { q: 'How long does it last?', a: 'Up to 21 days without chipping, with proper UV/LED curing.' },
                { q: 'How is it removed?', a: 'With a cotton capsule soaked in specific remover for 10 minutes.' },
                { q: 'Does it damage the nail?', a: 'No, if you respect a 1-week break between applications and hydrate the cuticle.' }
            ],
            routine: [
                { name: 'Prep the nail', desc: 'File, push back the cuticle and degrease with alcohol.' },
                { name: 'Base coat', desc: 'Apply a thin base coat layer and cure.' },
                { name: 'Colour', desc: 'Two thin passes, curing between each.' },
                { name: 'Top coat', desc: 'Seal with top coat for maximum wear and shine.' }
            ],
            claims: ['Salon finish', 'Up to 21 days', 'Vegan', 'No toxics'],
            featurePills: ['21 days', 'Salon finish', 'Extreme shine', 'Easy apply']
        }
    },

    // -------- GADGETS / HOGAR / VARIOS --------
    {
        slug: 'gadgets',
        label_es: 'Gadgets y Hogar', label_pt: 'Gadgets e Casa', label_en: 'Gadgets & Home',
        keywords_es: ['innovagoods', 'lámpara', 'proyector', 'altavoz', 'freidora', 'compostador', 'hamaca', 'almohada', 'auriculares', 'recargable', 'eléctrico', 'portátil', 'organizador', 'soporte', 'salvamanteles', 'calefactor', 'espejo led', 'bastón', 'silicona'],
        keywords_pt: ['innovagoods', 'lâmpada', 'projetor', 'altifalante', 'fritadeira', 'almofada', 'auscultadores', 'recarregável', 'elétrico', 'portátil', 'organizador', 'aquecedor'],
        keywords_en: ['innovagoods', 'lamp', 'projector', 'speaker', 'fryer', 'composter', 'pillow', 'headphones', 'rechargeable', 'electric', 'portable', 'organizer', 'heater', 'led mirror'],
        default_image_url: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=1000',
        copy_es: {
            hooks: ['Vida más práctica', 'Innovación en casa', 'Soluciones inteligentes'],
            headlines: ['Pequeñas mejoras que cambian tu día a día', 'Diseñado para hacer la vida más cómoda'],
            benefits: [
                { title: 'Diseño funcional', desc: 'Pensado para resolver lo cotidiano con elegancia.' },
                { title: 'Materiales duraderos', desc: 'Componentes seleccionados para resistir el uso intenso.' },
                { title: 'Fácil de usar', desc: 'Sin instalación complicada ni manuales extensos.' },
                { title: 'Garantía 24 meses', desc: 'Cubierto contra defectos de fabricación.' }
            ],
            faqs: [
                { q: '¿Necesita instalación?', a: 'No. Plug-and-play, listo para usar al sacarlo de la caja.' },
                { q: '¿Cuál es la garantía?', a: '24 meses contra defectos de fabricación.' },
                { q: '¿Con qué dispositivos es compatible?', a: 'Verifica la ficha técnica para detalles de compatibilidad.' }
            ],
            routine: [
                { name: 'Desempaca', desc: 'Retira el embalaje y verifica todos los accesorios.' },
                { name: 'Carga / conecta', desc: 'Si aplica, carga la batería o conecta a la corriente.' },
                { name: 'Configura', desc: 'Sigue las instrucciones rápidas del manual.' },
                { name: 'Disfruta', desc: 'Listo para usar en pocos minutos.' }
            ],
            claims: ['Garantía 24m', 'Materiales premium', 'Plug-and-play', 'Made in EU'],
            featurePills: ['Diseño premium', 'Plug-and-play', 'Garantía 24m', 'Envío rápido']
        },
        copy_pt: {
            hooks: ['Vida mais prática', 'Inovação em casa', 'Soluções inteligentes'],
            headlines: ['Pequenas melhorias que mudam o seu dia a dia', 'Pensado para tornar a vida mais cómoda'],
            benefits: [
                { title: 'Design funcional', desc: 'Pensado para resolver o quotidiano com elegância.' },
                { title: 'Materiais duradouros', desc: 'Componentes selecionados para resistir ao uso intenso.' },
                { title: 'Fácil de usar', desc: 'Sem instalação complicada nem manuais extensos.' },
                { title: 'Garantia 24 meses', desc: 'Coberto contra defeitos de fabrico.' }
            ],
            faqs: [
                { q: 'Precisa de instalação?', a: 'Não. Plug-and-play, pronto a usar ao retirar da caixa.' },
                { q: 'Qual é a garantia?', a: '24 meses contra defeitos de fabrico.' },
                { q: 'Com que dispositivos é compatível?', a: 'Verifique a ficha técnica para detalhes de compatibilidade.' }
            ],
            routine: [
                { name: 'Desembala', desc: 'Remove a embalagem e verifica todos os acessórios.' },
                { name: 'Carrega / liga', desc: 'Se aplicável, carrega a bateria ou liga à corrente.' },
                { name: 'Configura', desc: 'Segue as instruções rápidas do manual.' },
                { name: 'Desfruta', desc: 'Pronto a usar em poucos minutos.' }
            ],
            claims: ['Garantia 24m', 'Materiais premium', 'Plug-and-play', 'Feito na UE'],
            featurePills: ['Design premium', 'Plug-and-play', 'Garantia 24m', 'Envio rápido']
        },
        copy_en: {
            hooks: ['Easier living', 'Innovation at home', 'Smart solutions'],
            headlines: ['Small upgrades that change your everyday', 'Designed to make life more comfortable'],
            benefits: [
                { title: 'Functional design', desc: 'Built to solve the everyday with elegance.' },
                { title: 'Durable materials', desc: 'Components chosen to handle heavy use.' },
                { title: 'Easy to use', desc: 'No complex installation or thick manuals.' },
                { title: '24-month warranty', desc: 'Covered against manufacturing defects.' }
            ],
            faqs: [
                { q: 'Does it need installation?', a: 'No. Plug-and-play, ready to use out of the box.' },
                { q: 'What is the warranty?', a: '24 months against manufacturing defects.' },
                { q: 'Which devices is it compatible with?', a: 'Check the spec sheet for compatibility details.' }
            ],
            routine: [
                { name: 'Unbox', desc: 'Remove packaging and check all accessories.' },
                { name: 'Charge / plug in', desc: 'If applicable, charge the battery or plug in.' },
                { name: 'Set up', desc: 'Follow the quick-start manual.' },
                { name: 'Enjoy', desc: 'Ready to use in minutes.' }
            ],
            claims: ['24m warranty', 'Premium materials', 'Plug-and-play', 'Made in EU'],
            featurePills: ['Premium design', 'Plug-and-play', '24m warranty', 'Fast shipping']
        }
    },

    // -------- GENERAL FALLBACK --------
    {
        slug: 'general',
        is_default: true,
        label_es: 'General', label_pt: 'Geral', label_en: 'General',
        keywords_es: [], keywords_pt: [], keywords_en: [],
        default_image_url: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=1000',
        copy_es: {
            hooks: ['Cuidado consciente', 'Beauthé essencial', 'Belleza con propósito'],
            headlines: ['Una elección consciente para tu rutina', 'Cuidar de ti, cuidar del entorno'],
            benefits: [
                { title: 'Fórmula limpia', desc: 'Sin parabenos, sulfatos agresivos ni siliconas innecesarias.' },
                { title: '100% vegano', desc: 'Ningún ingrediente de origen animal.' },
                { title: 'Cruelty-free', desc: 'Nunca testado en animales en ninguna fase.' },
                { title: 'Made in Europe', desc: 'Producción ética y normas europeas.' }
            ],
            faqs: [
                { q: '¿Cómo se conserva?', a: 'Lugar fresco y seco, lejos de la luz solar directa.' },
                { q: '¿Cuál es la duración tras abrir?', a: 'Verifica el icono PAO del envase (típicamente 6 a 12 meses).' },
                { q: '¿Tiene fragancia?', a: 'Las fórmulas Beauthé usan fragancias suaves o ninguna.' }
            ],
            routine: [
                { name: 'Limpia', desc: 'Comienza con una piel limpia y seca.' },
                { name: 'Aplica', desc: 'Cantidad suficiente para cubrir uniformemente.' },
                { name: 'Espera', desc: 'Deja absorber antes del siguiente paso.' },
                { name: 'Disfruta', desc: 'Repite con la frecuencia recomendada.' }
            ],
            claims: ['Vegano', 'Cruelty-free', 'Sin parabenos', 'Made in Europe'],
            featurePills: ['Fórmula limpia', 'Vegano', 'Cruelty-free', 'Made in Europe']
        },
        copy_pt: {
            hooks: ['Cuidado consciente', 'Beauthé essencial', 'Beleza com propósito'],
            headlines: ['Uma escolha consciente para a sua rotina', 'Cuidar de si, cuidar do ambiente'],
            benefits: [
                { title: 'Fórmula limpa', desc: 'Sem parabenos, sulfatos agressivos ou silicones desnecessários.' },
                { title: '100% vegano', desc: 'Nenhum ingrediente de origem animal.' },
                { title: 'Cruelty-free', desc: 'Nunca testado em animais em qualquer fase.' },
                { title: 'Feito na Europa', desc: 'Produção ética e normas europeias.' }
            ],
            faqs: [
                { q: 'Como se conserva?', a: 'Local fresco e seco, longe da luz solar direta.' },
                { q: 'Qual a duração após abrir?', a: 'Verifica o ícone PAO da embalagem (tipicamente 6 a 12 meses).' },
                { q: 'Tem fragrância?', a: 'As fórmulas Beauthé usam fragrâncias suaves ou nenhuma.' }
            ],
            routine: [
                { name: 'Limpa', desc: 'Começa com a pele limpa e seca.' },
                { name: 'Aplica', desc: 'Quantidade suficiente para cobrir uniformemente.' },
                { name: 'Espera', desc: 'Deixa absorver antes do próximo passo.' },
                { name: 'Aproveita', desc: 'Repete com a frequência recomendada.' }
            ],
            claims: ['Vegano', 'Cruelty-free', 'Sem parabenos', 'Feito na Europa'],
            featurePills: ['Fórmula limpa', 'Vegano', 'Cruelty-free', 'Feito na Europa']
        },
        copy_en: {
            hooks: ['Conscious care', 'Beauthé essential', 'Purposeful beauty'],
            headlines: ['A conscious choice for your routine', 'Care for yourself, care for the planet'],
            benefits: [
                { title: 'Clean formula', desc: 'Free from parabens, harsh sulphates and unnecessary silicones.' },
                { title: '100% vegan', desc: 'No animal-derived ingredients.' },
                { title: 'Cruelty-free', desc: 'Never tested on animals at any stage.' },
                { title: 'Made in Europe', desc: 'Ethical production under European standards.' }
            ],
            faqs: [
                { q: 'How do I store it?', a: 'Cool dry place, away from direct sunlight.' },
                { q: 'How long after opening?', a: 'Check the PAO icon on the packaging (typically 6 to 12 months).' },
                { q: 'Does it have fragrance?', a: 'Beauthé formulas use mild fragrance or none at all.' }
            ],
            routine: [
                { name: 'Cleanse', desc: 'Start with clean dry skin.' },
                { name: 'Apply', desc: 'Enough product for even coverage.' },
                { name: 'Wait', desc: 'Let it absorb before the next step.' },
                { name: 'Enjoy', desc: 'Repeat at the recommended frequency.' }
            ],
            claims: ['Vegan', 'Cruelty-free', 'Paraben-free', 'Made in Europe'],
            featurePills: ['Clean formula', 'Vegan', 'Cruelty-free', 'Made in Europe']
        }
    }
];
