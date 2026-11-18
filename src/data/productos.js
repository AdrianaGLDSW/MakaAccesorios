
export const CATEGORIAS = [
  { slug: 'collares', nombre: 'Collares', descripcion: 'Cadenas, perlas, dijes y collares tipo corbata.' },
  { slug: 'anillos', nombre: 'Anillos', descripcion: 'Anillos ajustables y por talla, del 5 al 9.' },
  { slug: 'aretes', nombre: 'Aretes', descripcion: 'Arracadas, broqueles y aretes statement.' },
  { slug: 'pulsos', nombre: 'Pulsos', descripcion: 'Pulseras, brazaletes y esclavas para combinar.' },
  { slug: 'caballero', nombre: 'Caballero', descripcion: 'Cadenas, esclavas y anillos para él.' },
  { slug: 'accesorios', nombre: 'Accesorios', descripcion: 'Pinzas, joyeros y cadenas para lentes.' },
  { slug: 'piezas-unicas', nombre: 'Piezas únicas', descripcion: 'Edición limitada: cuando se van, no regresan.' },
];

const CUIDADOS = 'Evita el contacto con perfume, cremas, cloro y agua. Guárdala en su bolsa individual y límpiala con un paño suave y seco.';
const img = (slug) => [`${slug}-1.jpg`];

export const PRODUCTOS = [

  { id: 1, slug: 'collar-perla', nombre: 'Collar Perla', categoria: 'collares', precio: 450, material: 'Perlas sintéticas y broche de acero inoxidable', acabados: ['Blanco perla'], medidas: 'Largo de 45 cm · perlas de 8 mm', hipoalergenico: true, stock: 6, nuevo: false, masVendido: true, fecha: '2026-08-12', descripcion: 'Collar clásico de perlas que se puede usar solo o en capas. Elegante para eventos y fácil de combinar a diario.', imagenes: img('collar-perla') },
  { id: 2, slug: 'collar-sagrado-corazon', nombre: 'Collar Sagrado Corazón', categoria: 'collares', precio: 500, material: 'Acero inoxidable con baño de oro y dijes esmaltados', acabados: ['Dorado'], medidas: 'Cadena de 45 cm · corazón de 4 cm', hipoalergenico: true, stock: 3, nuevo: true, masVendido: true, fecha: '2026-11-02', descripcion: 'Cadena de eslabones con dijes de corazón y un sagrado corazón esmaltado como pieza central. Inspirado en la artesanía mexicana.', imagenes: img('collar-sagrado-corazon') },
  { id: 3, slug: 'collar-dijes-luna', nombre: 'Collar Dijes Luna', categoria: 'collares', precio: 520, material: 'Acero inoxidable con baño de oro de 18 k', acabados: ['Dorado'], medidas: 'Cadena de 42 cm con extensión de 5 cm', hipoalergenico: true, stock: 5, nuevo: false, masVendido: true, fecha: '2026-07-20', descripcion: 'Cadena con dijes de luna, corazón, cruz y medalla. Cada dije tiene su significado; juntos cuentan tu historia.', imagenes: img('collar-dijes-luna') },
  { id: 4, slug: 'collar-corbata', nombre: 'Collar Corbata', categoria: 'collares', precio: 380, material: 'Acero inoxidable con baño de oro de 18 k', acabados: ['Dorado'], medidas: 'Cadena de 45 cm · caída de 12 cm', hipoalergenico: true, stock: 7, nuevo: true, masVendido: false, fecha: '2026-10-25', descripcion: 'Collar tipo corbata con pequeños cristales a lo largo de la caída. Perfecto para escotes en V.', imagenes: img('collar-corbata') },


  { id: 5, slug: 'anillo-corazon-radiante', nombre: 'Anillo Corazón Radiante', categoria: 'anillos', precio: 270, material: 'Acero inoxidable con baño de oro de 18 k', acabados: ['Dorado'], tallas: ['Ajustable'], medidas: 'Ajustable · corazón de 1.5 cm', hipoalergenico: true, stock: 8, nuevo: true, masVendido: true, fecha: '2026-10-30', descripcion: 'Anillo statement con un corazón rodeado de rayos de sol. Se ajusta fácilmente a tu dedo.', imagenes: img('anillo-corazon-radiante') },
  { id: 6, slug: 'anillo-luz-oro', nombre: 'Anillo Luz oro', categoria: 'anillos', precio: 180, material: 'Acero inoxidable con baño de oro de 18 k', acabados: ['Dorado'], tallas: ['5', '6', '7', '8', '9'], medidas: 'Banda de 2 mm', hipoalergenico: true, stock: 6, nuevo: false, masVendido: false, fecha: '2026-07-10', descripcion: 'Anillo delgado con un pequeño cristal al centro. Perfecto para usar solo o combinado.', imagenes: [] },
  { id: 7, slug: 'anillo-sol-plata', nombre: 'Anillo Sol plata', categoria: 'anillos', precio: 165, material: 'Plata .925', acabados: ['Plateado'], tallas: ['5', '6', '7', '8', '9'], medidas: 'Banda de 3 mm · dije de 6 mm', hipoalergenico: true, stock: 0, nuevo: false, masVendido: false, fecha: '2026-05-04', descripcion: 'Anillo de plata con un pequeño sol grabado. Producto base: lo resurtimos con frecuencia.', imagenes: [] },
  { id: 8, slug: 'anillo-trenza', nombre: 'Anillo Trenza', categoria: 'anillos', precio: 150, material: 'Acero inoxidable', acabados: ['Dorado', 'Plateado'], tallas: ['6', '7', '8'], medidas: 'Banda trenzada de 3 mm', hipoalergenico: true, stock: 9, nuevo: false, masVendido: false, fecha: '2026-04-18', descripcion: 'Banda trenzada con acabado pulido. Un clásico que combina con todo.', imagenes: [] },


  { id: 9, slug: 'aretes-flor-dorada', nombre: 'Aretes Flor Dorada', categoria: 'aretes', precio: 380, material: 'Acero inoxidable con baño de oro de 18 k', acabados: ['Dorado'], medidas: 'Diámetro de 2.5 cm', hipoalergenico: true, stock: 6, nuevo: true, masVendido: true, fecha: '2026-11-05', descripcion: 'Aretes en forma de flor con pétalos texturizados que atrapan la luz. Un toque romántico para cualquier ocasión.', imagenes: img('aretes-flor-dorada') },
  { id: 10, slug: 'aretes-perla-barroca', nombre: 'Aretes Perla Barroca', categoria: 'aretes', precio: 410, material: 'Perla sintética barroca y marco de acero dorado', acabados: ['Dorado'], medidas: 'Diámetro de 2 cm', hipoalergenico: true, stock: 5, nuevo: false, masVendido: true, fecha: '2026-06-14', descripcion: 'Broqueles con perla de forma irregular enmarcada en dorado. Ninguna perla es igual a otra.', imagenes: img('aretes-perla-barroca') },
  { id: 11, slug: 'arracadas-silver-shine', nombre: 'Arracadas Silver Shine', categoria: 'aretes', precio: 390, material: 'Acero inoxidable pulido', acabados: ['Plateado'], medidas: 'Diámetro de 2 cm · grosor de 6 mm', hipoalergenico: true, stock: 7, nuevo: false, masVendido: false, fecha: '2026-05-22', descripcion: 'Arracadas gruesas y ligeras con acabado espejo. Un básico moderno.', imagenes: img('arracadas-silver-shine') },
  { id: 12, slug: 'aretes-onda', nombre: 'Aretes Onda', categoria: 'aretes', precio: 340, material: 'Acero inoxidable con baño de oro de 18 k', acabados: ['Dorado'], medidas: 'Diámetro de 3 cm', hipoalergenico: true, stock: 4, nuevo: false, masVendido: false, fecha: '2026-03-30', descripcion: 'Aretes de aro con forma ondulada y acabado brillante. Ligeros a pesar de su tamaño.', imagenes: img('aretes-onda') },
  { id: 13, slug: 'aretes-hoja', nombre: 'Aretes Hoja', categoria: 'aretes', precio: 360, material: 'Latón con baño de oro', acabados: ['Dorado'], medidas: 'Largo de 4.5 cm', hipoalergenico: false, stock: 4, nuevo: true, masVendido: false, fecha: '2026-10-12', descripcion: 'Aretes calados en forma de hoja tropical. Vistosos y frescos para la temporada.', imagenes: img('aretes-hoja') },


  { id: 14, slug: 'brazalete-elegance', nombre: 'Brazalete Elegance', categoria: 'pulsos', precio: 290, material: 'Metal con baño de oro', acabados: ['Dorado'], medidas: 'Diámetro interior de 6 cm · ancho de 2.5 cm', hipoalergenico: false, stock: 5, nuevo: false, masVendido: true, fecha: '2026-06-03', descripcion: 'Brazalete de eslabones amplios con broche de presión. Una pieza protagonista para outfits sencillos.', imagenes: img('brazalete-elegance') },
  { id: 15, slug: 'brazaletes-resina', nombre: 'Brazaletes de resina (set)', categoria: 'pulsos', precio: 320, material: 'Resina', acabados: ['Multicolor'], medidas: 'Diámetro interior de 6.5 cm', hipoalergenico: true, stock: 6, nuevo: false, masVendido: false, fecha: '2026-04-28', descripcion: 'Set de cuatro brazaletes de resina en tonos tierra y verde. Úsalos juntos o por separado.', imagenes: img('brazaletes-resina') },
  { id: 16, slug: 'pulsera-dorada', nombre: 'Pulsera Dorada', categoria: 'pulsos', precio: 360, material: 'Acero inoxidable con baño de oro de 18 k', acabados: ['Dorado'], medidas: 'Largo de 17 cm con extensión de 3 cm', hipoalergenico: true, stock: 8, nuevo: true, masVendido: true, fecha: '2026-10-18', descripcion: 'Pulsera de eslabones en forma de U con acabado brillante. Resistente para el uso diario.', imagenes: img('pulsera-dorada') },
  { id: 17, slug: 'pulso-hilo-rojo', nombre: 'Pulso Hilo Rojo', categoria: 'pulsos', precio: 120, material: 'Hilo encerado y dije de acero', acabados: ['Dorado'], medidas: 'Ajustable', hipoalergenico: true, stock: 20, nuevo: false, masVendido: false, fecha: '2026-03-01', descripcion: 'Pulso ajustable de hilo rojo con un dije pequeño. Para regalar y compartir.', imagenes: [] },


  { id: 18, slug: 'cadena-cubana', nombre: 'Cadena Cubana', categoria: 'caballero', precio: 450, material: 'Acero inoxidable', acabados: ['Plateado', 'Dorado'], medidas: 'Largo de 55 cm · eslabón de 6 mm', hipoalergenico: true, stock: 3, nuevo: false, masVendido: false, fecha: '2026-04-10', descripcion: 'Cadena de eslabón cubano resistente al uso diario.', imagenes: [] },
  { id: 19, slug: 'esclava-caballero', nombre: 'Esclava Caballero', categoria: 'caballero', precio: 390, material: 'Acero inoxidable', acabados: ['Plateado'], medidas: 'Largo de 21 cm', hipoalergenico: true, stock: 4, nuevo: true, masVendido: false, fecha: '2026-10-15', descripcion: 'Esclava de placa lisa, sobria y elegante. Se puede grabar.', imagenes: [] },
  { id: 20, slug: 'anillo-sello', nombre: 'Anillo Sello', categoria: 'caballero', precio: 280, material: 'Acero inoxidable', acabados: ['Plateado', 'Dorado'], tallas: ['8', '9', '10', '11'], medidas: 'Sello de 1 cm', hipoalergenico: true, stock: 5, nuevo: false, masVendido: false, fecha: '2026-02-28', descripcion: 'Anillo tipo sello con superficie pulida.', imagenes: [] },


  { id: 21, slug: 'pinzas-perla', nombre: 'Pinzas Perla (par)', categoria: 'accesorios', precio: 130, material: 'Metal dorado y perlas sintéticas', acabados: ['Dorado'], medidas: 'Largo de 6 cm', hipoalergenico: false, stock: 10, nuevo: true, masVendido: false, fecha: '2026-10-30', descripcion: 'Par de pinzas para cabello con perlas. Un detalle romántico.', imagenes: [] },
  { id: 22, slug: 'joyero-viaje', nombre: 'Joyero de viaje', categoria: 'accesorios', precio: 260, material: 'Piel sintética', acabados: ['Beige', 'Rosa'], medidas: '10 × 10 × 5 cm', hipoalergenico: false, stock: 6, nuevo: false, masVendido: false, fecha: '2026-05-12', descripcion: 'Joyero compacto con compartimentos para anillos, aretes y cadenas.', imagenes: [] },


  { id: 23, slug: 'collar-flor-de-jalisco', nombre: 'Collar Flor de Jalisco', categoria: 'piezas-unicas', precio: 420, material: 'Latón con baño de oro y esmalte', acabados: ['Dorado'], medidas: 'Cadena de 45 cm · flor de 2.5 cm', hipoalergenico: false, stock: 1, nuevo: true, masVendido: false, fecha: '2026-11-08', descripcion: 'Pieza única inspirada en las flores de Jalisco. Solo hay una disponible.', imagenes: [] },
  { id: 24, slug: 'aretes-ola', nombre: 'Aretes Ola', categoria: 'piezas-unicas', precio: 380, material: 'Plata .925 martillada', acabados: ['Plateado'], medidas: 'Largo de 4 cm', hipoalergenico: true, stock: 2, nuevo: false, masVendido: false, fecha: '2026-09-10', descripcion: 'Aretes de edición limitada con forma de ola.', imagenes: [] },


  { id: 25, slug: 'collar-estrella-navidad', nombre: 'Collar Estrella Navidad', categoria: 'collares', precio: 300, material: 'Acero inoxidable', acabados: ['Dorado'], medidas: 'Cadena de 45 cm', hipoalergenico: true, stock: 0, temporada: true, nuevo: false, masVendido: false, fecha: '2025-12-01', descripcion: 'Edición de temporada.', imagenes: [] },
].map(p => ({ cuidados: CUIDADOS, tallas: null, temporada: false, ...p }));

export const PRODUCTOS_VISIBLES = PRODUCTOS.filter(p => !(p.temporada && p.stock === 0));

export const categoriaPorSlug = (slug) => CATEGORIAS.find(c => c.slug === slug);
export const productoPorSlug = (slug) => PRODUCTOS_VISIBLES.find(p => p.slug === slug);
export const productoPorId = (id) => PRODUCTOS.find(p => p.id === Number(id));
export const urlProducto = (p) => `/catalogo/${p.categoria}/${p.slug}`;

export const VALORACIONES_EJEMPLO = [
  { id: 'e1', productoId: 1, nombre: 'Opinión de ejemplo', estrellas: 5, comentario: 'Texto de ejemplo del prototipo: las perlas tienen buen brillo y el broche es firme.', fecha: '2026-11-02', ejemplo: true },
  { id: 'e2', productoId: 1, nombre: 'Opinión de ejemplo', estrellas: 4, comentario: 'Texto de ejemplo: se ve igual que en la foto.', fecha: '2026-10-28', ejemplo: true },
  { id: 'e3', productoId: 2, nombre: 'Opinión de ejemplo', estrellas: 5, comentario: 'Texto de ejemplo: el sagrado corazón tiene colores muy bonitos.', fecha: '2026-11-06', ejemplo: true },
  { id: 'e4', productoId: 9, nombre: 'Opinión de ejemplo', estrellas: 5, comentario: 'Texto de ejemplo: son ligeros a pesar de su tamaño.', fecha: '2026-11-07', ejemplo: true },
  { id: 'e5', productoId: 11, nombre: 'Opinión de ejemplo', estrellas: 4, comentario: 'Texto de ejemplo: no me irritan y combinan con todo.', fecha: '2026-10-30', ejemplo: true },
  { id: 'e6', productoId: 16, nombre: 'Opinión de ejemplo', estrellas: 5, comentario: 'Texto de ejemplo: la uso diario y no pierde el color.', fecha: '2026-10-21', ejemplo: true },
  { id: 'e7', productoId: 5, nombre: 'Opinión de ejemplo', estrellas: 5, comentario: 'Texto de ejemplo: el anillo se ajusta muy bien.', fecha: '2026-11-04', ejemplo: true },
];
