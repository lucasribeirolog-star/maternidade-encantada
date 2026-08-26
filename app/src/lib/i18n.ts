export type Locale = "pt" | "en" | "es";

export const LOCALE_PATHS: Record<Locale, string> = {
  pt: "/",
  en: "/en",
  es: "/es",
};

export const LOCALE_LABELS: Record<Locale, string> = {
  pt: "PT",
  en: "EN",
  es: "ES",
};

const HREFLANG: Record<Locale, string> = { pt: "pt-BR", en: "en", es: "es" };

/** Builds a Next.js `alternates.languages` map for a path shared across all three locales. */
export function localeAlternates(path: string) {
  const languages: Record<string, string> = {};
  for (const locale of Object.keys(LOCALE_PATHS) as Locale[]) {
    const base = LOCALE_PATHS[locale] === "/" ? "" : LOCALE_PATHS[locale];
    languages[HREFLANG[locale]] = `${base}${path}` || "/";
  }
  languages["x-default"] = path || "/";
  return languages;
}

type Dictionary = {
  nav: { products: string; kits: string; courses: string; story: string; cart: string };
  hero: { eyebrow: string; heading1: string; heading2: string; text: string; cta: string };
  whyUs: {
    title1: string;
    text1: string;
    title2: string;
    text2: string;
    title3: string;
    text3: string;
    title4: string;
    text4: string;
  };
  showcase: { kicker: string; title: string; viewAll: string; viewOffer: string };
  story: {
    kicker: string;
    title: string;
    text: string;
    stat1Label: string;
    stat2Value: string;
    stat2Label: string;
    stat3Label: string;
  };
  productsPage: { kicker: string; title: string; subtitle: string; empty: string };
  productDetail: { addToCart: string; weight: string; dimensions: string; reviews: string };
  footer: {
    tagline: string;
    shop: string;
    products: string;
    cart: string;
    story: string;
    support: string;
    returns: string;
    privacy: string;
    terms: string;
    visit: string;
    store: string;
    rights: string;
  };
  cookies: { text: string; policy: string; decline: string; accept: string };
  security: { ssl: string; data: string; handmade: string; support: string };
  wishlist: { title: string; empty: string; emptyCta: string; addedToast: string; navLabel: string };
  aboutPage: { kicker: string; title: string; p1: string; p2: string; p3: string };
  location: {
    kicker: string;
    title: string;
    text: string;
    addressLabel: string;
    phoneLabel: string;
    directions: string;
    call: string;
    reviews: string;
  };
};

export const dictionaries: Record<Locale, Dictionary> = {
  pt: {
    nav: {
      products: "Bonecas",
      kits: "Kits & Enxoval",
      courses: "Cursos",
      story: "Nossa história",
      cart: "Carrinho",
    },
    hero: {
      eyebrow: "15 anos criando bebês quase reais",
      heading1: "Bebês quase reais,",
      heading2: "feitos com amor",
      text: "Bonecas reborn pintadas e finalizadas à mão. Envio para todo o Brasil e exterior.",
      cta: "Ver coleção",
    },
    whyUs: {
      title1: "Feitas à mão, com realismo",
      text1: "Pintura em camadas e cabelo implantado fio a fio.",
      title2: "15 anos de experiência",
      text2: "Encantando famílias colecionadoras por todo o país.",
      title3: "Envio Brasil e exterior",
      text3: "Compra online segura, entrega onde você estiver.",
      title4: "Loja física em Sorocaba",
      text4: "Shopping Iguatemi Esplanada, Ala Norte, Sorocaba.",
    },
    showcase: {
      kicker: "Vitrine",
      title: "Bonecas em destaque",
      viewAll: "Ver coleção completa",
      viewOffer: "Ver oferta!",
    },
    story: {
      kicker: "Nossa história",
      title: "Arte que nasce do amor pela maternidade",
      text: "A Maternidade Encantada nasceu do sonho de transformar o amor pela maternidade em arte. Há 15 anos, cada boneca reborn é criada à mão com técnicas de pintura em camadas, cabelos implantados fio a fio e detalhes que trazem o realismo de um bebê de verdade — peças únicas para colecionadoras e famílias apaixonadas.",
      stat1Label: "anos de história",
      stat2Value: "46,6 mil",
      stat2Label: "seguidores no Instagram",
      stat3Label: "feitas à mão",
    },
    productsPage: {
      kicker: "Coleção",
      title: "Bonecas Reborn",
      subtitle: "Peças exclusivas, feitas à mão com realismo e carinho.",
      empty: "Nenhum produto cadastrado ainda.",
    },
    productDetail: {
      addToCart: "Adicionar ao carrinho",
      weight: "Peso",
      dimensions: "Dimensões",
      reviews: "avaliações",
    },
    footer: {
      tagline: "Bonecas reborn feitas à mão, com realismo e carinho.",
      shop: "Loja",
      products: "Bonecas",
      cart: "Carrinho",
      story: "Nossa história",
      support: "Atendimento",
      returns: "Trocas e devoluções",
      privacy: "Política de privacidade",
      terms: "Termos de uso",
      visit: "Visite",
      store: "Shopping Iguatemi Esplanada, Sorocaba",
      rights: "Todos os direitos reservados.",
    },
    cookies: {
      text: "Usamos um cookie técnico essencial para manter os itens do seu carrinho. Não usamos cookies de rastreamento ou publicidade. Saiba mais na nossa",
      policy: "Política de Privacidade",
      decline: "Recusar",
      accept: "Aceitar",
    },
    security: {
      ssl: "Compra 100% segura (SSL)",
      data: "Seus dados protegidos",
      handmade: "Peça artesanal exclusiva",
      support: "Atendimento via WhatsApp",
    },
    wishlist: {
      title: "Minha Lista de Desejos",
      empty: "Sua lista de desejos está vazia.",
      emptyCta: "Ver bonecas",
      addedToast: "Adicionado à lista de desejos",
      navLabel: "Lista de desejos",
    },
    aboutPage: {
      kicker: "Nossa história",
      title: "Arte que nasce do amor pela maternidade",
      p1: "A Maternidade Encantada nasceu do sonho de transformar o amor pela maternidade em arte. Há 15 anos, criamos bonecas reborn feitas à mão, com técnicas de pintura em camadas, cabelos implantados fio a fio e detalhes que trazem o realismo de um bebê de verdade.",
      p2: "Cada peça é única, pensada para colecionadoras e famílias apaixonadas — um processo artesanal que une técnica, paciência e muito carinho.",
      p3: "Além da loja online, você pode conhecer nossas bonecas reborn pessoalmente na loja física no Shopping Iguatemi Esplanada, em Sorocaba, e acompanhar novidades no Instagram",
    },
    location: {
      kicker: "Visite a loja",
      title: "Venha conhecer de perto",
      text: "Nossa loja física fica dentro do Shopping Iguatemi Esplanada, em Sorocaba — venha conhecer nossas bonecas reborn pessoalmente.",
      addressLabel: "Endereço",
      phoneLabel: "Telefone / WhatsApp",
      directions: "Ver rotas no Google Maps",
      call: "Chamar no WhatsApp",
      reviews: "avaliações no Google",
    },
  },
  en: {
    nav: {
      products: "Dolls",
      kits: "Kits & Layette",
      courses: "Courses",
      story: "Our Story",
      cart: "Cart",
    },
    hero: {
      eyebrow: "15 years creating almost-real babies",
      heading1: "Almost-real babies,",
      heading2: "made with love",
      text: "Hand-painted, hand-finished reborn dolls. We ship worldwide from Brazil.",
      cta: "Shop the collection",
    },
    whyUs: {
      title1: "Handmade, with realism",
      text1: "Layered painting and hand-rooted hair, strand by strand.",
      title2: "15 years of experience",
      text2: "Delighting collector families across Brazil and beyond.",
      title3: "Worldwide shipping",
      text3: "Shop safely online, delivered wherever you are.",
      title4: "Physical store at Iguatemi",
      text4: "Shopping Iguatemi Esplanada, North Wing, Sorocaba, Brazil.",
    },
    showcase: {
      kicker: "Showcase",
      title: "Featured dolls",
      viewAll: "View full collection",
      viewOffer: "See offer!",
    },
    story: {
      kicker: "Our Story",
      title: "Art born from the love of motherhood",
      text: "Maternidade Encantada was born from a dream: turning the love of motherhood into art. For 15 years, every reborn doll has been handcrafted with layered painting techniques, hand-rooted hair, and details that bring the realism of a real baby to life — unique pieces for collectors and passionate families.",
      stat1Label: "years of history",
      stat2Value: "46.6k",
      stat2Label: "Instagram followers",
      stat3Label: "handmade",
    },
    productsPage: {
      kicker: "Collection",
      title: "Reborn Dolls",
      subtitle: "Exclusive pieces, handmade with realism and care.",
      empty: "No products yet.",
    },
    productDetail: {
      addToCart: "Add to cart",
      weight: "Weight",
      dimensions: "Dimensions",
      reviews: "reviews",
    },
    footer: {
      tagline: "Handmade reborn dolls, made with realism and care.",
      shop: "Shop",
      products: "Dolls",
      cart: "Cart",
      story: "Our Story",
      support: "Support",
      returns: "Returns & exchanges",
      privacy: "Privacy Policy",
      terms: "Terms of Use",
      visit: "Visit us",
      store: "Shopping Iguatemi Esplanada, Sorocaba, Brazil",
      rights: "All rights reserved.",
    },
    cookies: {
      text: "We use one essential technical cookie to keep the items in your cart. We don't use tracking or advertising cookies. Learn more in our",
      policy: "Privacy Policy",
      decline: "Decline",
      accept: "Accept",
    },
    security: {
      ssl: "100% secure checkout (SSL)",
      data: "Your data is protected",
      handmade: "Exclusive handmade piece",
      support: "Support via WhatsApp",
    },
    wishlist: {
      title: "My Wishlist",
      empty: "Your wishlist is empty.",
      emptyCta: "Browse dolls",
      addedToast: "Added to wishlist",
      navLabel: "Wishlist",
    },
    aboutPage: {
      kicker: "Our Story",
      title: "Art born from the love of motherhood",
      p1: "Maternidade Encantada was born from a dream: turning the love of motherhood into art. For 15 years, we've been handcrafting reborn dolls using layered painting techniques, hand-rooted hair, and details that bring the realism of a real baby to life.",
      p2: "Every piece is one of a kind, made for collectors and passionate families — a handmade process built on skill, patience, and a lot of care.",
      p3: "Besides our online store, you can meet our dolls in person at our physical store in Shopping Iguatemi Esplanada (Sorocaba, Brazil), and follow along on Instagram",
    },
    location: {
      kicker: "Visit us",
      title: "Come see us in person",
      text: "Our physical store is inside Shopping Iguatemi Esplanada, in Sorocaba, Brazil — come meet our reborn dolls in person.",
      addressLabel: "Address",
      phoneLabel: "Phone / WhatsApp",
      directions: "Get directions on Google Maps",
      call: "Message us on WhatsApp",
      reviews: "reviews on Google",
    },
  },
  es: {
    nav: {
      products: "Muñecas",
      kits: "Kits & Ajuar",
      courses: "Cursos",
      story: "Nuestra historia",
      cart: "Carrito",
    },
    hero: {
      eyebrow: "15 años creando bebés casi reales",
      heading1: "Bebés casi reales,",
      heading2: "hechos con amor",
      text: "Muñecas reborn pintadas y terminadas a mano. Enviamos a todo el mundo desde Brasil.",
      cta: "Ver colección",
    },
    whyUs: {
      title1: "Hechas a mano, con realismo",
      text1: "Pintura en capas y cabello implantado hebra por hebra.",
      title2: "15 años de experiencia",
      text2: "Encantando a familias coleccionistas en todo el país y más allá.",
      title3: "Envíos a Brasil y al exterior",
      text3: "Compra online segura, entrega donde estés.",
      title4: "Tienda física en Iguatemi",
      text4: "Shopping Iguatemi Esplanada, Ala Norte, Sorocaba, Brasil.",
    },
    showcase: {
      kicker: "Vitrina",
      title: "Muñecas destacadas",
      viewAll: "Ver colección completa",
      viewOffer: "¡Ver oferta!",
    },
    story: {
      kicker: "Nuestra historia",
      title: "Arte que nace del amor por la maternidad",
      text: "Maternidade Encantada nació del sueño de transformar el amor por la maternidad en arte. Desde hace 15 años, cada muñeca reborn se crea a mano con técnicas de pintura en capas, cabello implantado hebra por hebra y detalles que aportan el realismo de un bebé de verdad — piezas únicas para coleccionistas y familias apasionadas.",
      stat1Label: "años de historia",
      stat2Value: "46,6 mil",
      stat2Label: "seguidores en Instagram",
      stat3Label: "hechas a mano",
    },
    productsPage: {
      kicker: "Colección",
      title: "Muñecas Reborn",
      subtitle: "Piezas exclusivas, hechas a mano con realismo y cariño.",
      empty: "Aún no hay productos.",
    },
    productDetail: {
      addToCart: "Añadir al carrito",
      weight: "Peso",
      dimensions: "Dimensiones",
      reviews: "reseñas",
    },
    footer: {
      tagline: "Muñecas reborn hechas a mano, con realismo y cariño.",
      shop: "Tienda",
      products: "Muñecas",
      cart: "Carrito",
      story: "Nuestra historia",
      support: "Atención al cliente",
      returns: "Cambios y devoluciones",
      privacy: "Política de privacidad",
      terms: "Términos de uso",
      visit: "Visítanos",
      store: "Shopping Iguatemi Esplanada, Sorocaba, Brasil",
      rights: "Todos los derechos reservados.",
    },
    cookies: {
      text: "Usamos una cookie técnica esencial para mantener los artículos de tu carrito. No usamos cookies de rastreo ni de publicidad. Más información en nuestra",
      policy: "Política de Privacidad",
      decline: "Rechazar",
      accept: "Aceptar",
    },
    security: {
      ssl: "Compra 100% segura (SSL)",
      data: "Tus datos están protegidos",
      handmade: "Pieza artesanal exclusiva",
      support: "Atención por WhatsApp",
    },
    wishlist: {
      title: "Mi Lista de Deseos",
      empty: "Tu lista de deseos está vacía.",
      emptyCta: "Ver muñecas",
      addedToast: "Añadido a la lista de deseos",
      navLabel: "Lista de deseos",
    },
    aboutPage: {
      kicker: "Nuestra historia",
      title: "Arte que nace del amor por la maternidad",
      p1: "Maternidade Encantada nació del sueño de transformar el amor por la maternidad en arte. Desde hace 15 años, creamos muñecas reborn hechas a mano, con técnicas de pintura en capas, cabello implantado hebra por hebra y detalles que aportan el realismo de un bebé de verdad.",
      p2: "Cada pieza es única, pensada para coleccionistas y familias apasionadas — un proceso artesanal que une técnica, paciencia y mucho cariño.",
      p3: "Además de la tienda online, puedes conocer nuestras muñecas en persona en nuestra tienda física en Shopping Iguatemi Esplanada (Sorocaba, Brasil), y seguir las novedades en Instagram",
    },
    location: {
      kicker: "Visítanos",
      title: "Ven a conocernos en persona",
      text: "Nuestra tienda física está dentro del Shopping Iguatemi Esplanada, en Sorocaba, Brasil — ven a conocer nuestras muñecas reborn en persona.",
      addressLabel: "Dirección",
      phoneLabel: "Teléfono / WhatsApp",
      directions: "Ver ruta en Google Maps",
      call: "Escribir por WhatsApp",
      reviews: "reseñas en Google",
    },
  },
};
