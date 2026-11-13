/**
 * ============================================================================
 * CONFIGURACIÓN Y CATÁLOGO DE SUNFADE SUPPLY (@sunfadesupply_)
 * ============================================================================
 * Editá este archivo para actualizar tus datos de contacto, anunciar un nuevo
 * Supply Drop, agregar boardshorts o marcar prendas como vendidas (available: false).
 */

window.SUNFADE_CONFIG = {
  brandName: "Sunfade Supply",
  tagline: "Boardshorts Vintage · Premium Surfwear",
  location: "Paraná, Entre Ríos, Argentina",
  shippingNote: "Envíos a todo el país · Entregas en Paraná",
  instagramUrl: "https://www.instagram.com/sunfadesupply_/",
  instagramHandle: "@sunfadesupply_",

  // Link real de tu comunidad VIP de WhatsApp (tomado de tu bio de IG)
  whatsappGroupUrl: "https://chat.whatsapp.com/GnnWDGGS0SA68nL9LktSLN",

  // Colocá acá tu número de WhatsApp con código de país (ej: "5493435000000")
  // Si queda vacío (""), el botón permite copiar el pedido listo y abrir IG o WhatsApp Web
  whatsappPhone: "",

  // Configuración del Drop actual y descuento por transferencia
  currentDrop: "SUPPLY DROP #001",
  nextDropLabel: "Ingresos anticipados todas las semanas por el grupo VIP",
  transferDiscountPercent: 10
};

window.SUNFADE_PRODUCTS = [
  {
    id: "SF-001",
    code: "DROP #001 · 01",
    name: "Fox Racing Surf 'Lime Core' Y2K",
    brand: "Fox",
    era: "Y2K · Circa 2003",
    sizeLabel: "M (W32)",
    sizeGroup: "M",
    waistCm: 41,
    lengthCm: 53,
    price: 42000,
    available: true,
    featured: true,
    badge: "PIEZA ICÓNICA",
    condition: "9.5/10 · Impecable",
    fabric: "Microfibra gamuzada pesada · Secado rápido",
    image: "assets/prod-fox-green.jpg",
    description: "Boardshort Fox original de principios de los 2000 en verde lima vibrante con cintura negra en contraste, ojalillos metálicos grabados y parche lateral de goma en relieve. Corte clásico surfer a la rodilla."
  },
  {
    id: "SF-002",
    code: "DROP #001 · 02",
    name: "Billabong '94 Classic' Navy Plaid",
    brand: "Billabong",
    era: "Late 90s",
    sizeLabel: "L (W34)",
    sizeGroup: "L",
    waistCm: 44,
    lengthCm: 55,
    price: 45000,
    available: true,
    featured: true,
    badge: "1 DE 1",
    condition: "9/10 · Desgaste natural surfer",
    fabric: "100% Poliéster cepillado suave",
    image: "assets/prod-billabong-plaid.jpg",
    description: "Cuadrillé azul marino profundo y blanco hueso con costuras reforzadas a contratono. Bolsillo lateral con solapa de velcro y cordón elástico interno para llave o peine de parafina."
  },
  {
    id: "SF-003",
    code: "DROP #001 · 03",
    name: "Quiksilver 'Aloha Sunfade' Hibiscus",
    brand: "Quiksilver",
    era: "90s Archive · 1998",
    sizeLabel: "M (W31)",
    sizeGroup: "M",
    waistCm: 40,
    lengthCm: 51,
    price: 46000,
    available: true,
    featured: true,
    badge: "90s ARCHIVE",
    condition: "9.5/10 · Sun-wash original",
    fabric: "Mezcla algodón/nylon vintage",
    image: "assets/prod-quik-hibiscus.jpg",
    description: "Estampa hawaiana hibisco sobre base terracota lavada por el sol. Textura clásica de archivo noventoso que hoy ya no se fabrica, con cierre acordonado tradicional."
  },
  {
    id: "SF-004",
    code: "DROP #001 · 04",
    name: "Rip Curl 'Pro Search' Ocean Block",
    brand: "Rip Curl",
    era: "Y2K · 2002",
    sizeLabel: "S (W30)",
    sizeGroup: "S",
    waistCm: 38,
    lengthCm: 50,
    price: 39500,
    available: true,
    featured: false,
    badge: "DISPONIBLE",
    condition: "9/10 · Excelente estado",
    fabric: "Suede-tech liviano repelente al agua",
    image: "assets/prod-ripcurl-blue.jpg",
    description: "Diseño técnico Y2K en bloques azul océano, crema y carbón con recortes curvos laterales de competencia. Súper liviano y cómodo tanto para el agua como para usar todos los días."
  },
  {
    id: "SF-005",
    code: "DROP #001 · 05",
    name: "O'Neill 'Santa Cruz Wave' Mustard",
    brand: "O'Neill",
    era: "90s Vintage",
    sizeLabel: "L (W33)",
    sizeGroup: "L",
    waistCm: 43,
    lengthCm: 54,
    price: 41000,
    available: false,
    featured: false,
    badge: "SOLD OUT",
    condition: "9/10 · Archivo",
    fabric: "Nylon taslan vintage",
    image: "assets/prod-oneill-mustard.jpg",
    description: "Combinación mostaza lavado y negro carbón con franja lateral retro. Vendido en minutos por el grupo VIP de WhatsApp."
  },
  {
    id: "SF-006",
    code: "DROP #001 · 06",
    name: "Rusty 'Point Break' Olive Cargo",
    brand: "Rusty",
    era: "Early 2000s",
    sizeLabel: "XL (W36)",
    sizeGroup: "XL",
    waistCm: 46,
    lengthCm: 56,
    price: 43500,
    available: true,
    featured: false,
    badge: "FIT HOLGADO",
    condition: "9.5/10 · Como nuevo",
    fabric: "Microfibra canvas pesada",
    image: "assets/prod-rusty-olive.jpg",
    description: "Verde oliva lavado con pespuntes crema a la vista y bolsillo cargo lateral con drenaje de agua. Calce ancho relajado bien característico de la era dorada del surf Y2K."
  }
];
