# MAKA Accesorios · Prototipo web

Prototipo **no funcional** del sitio de comercio electrónico de MAKA Accesorios, desarrollado con **React + Vite** para el Proyecto III (UDG Virtual).

El sitio se navega como una tienda real, pero no tiene servidor: el catálogo vive en archivos de datos y las cuentas, el carrito, los pedidos y las opiniones se guardan en el navegador (`localStorage`). No se cobra ni se envían correos.

## Cómo ejecutarlo

Requisitos: Node.js 18 o superior.

```bash
npm install
npm run dev        # abre http://localhost:5173
npm run build      # genera la versión optimizada en /dist
npm run preview    # prueba la versión de /dist
```

## Elementos solicitados en la actividad

| Elemento | Dónde está |
|---|---|
| Logo | Header y footer (`public/img/logo-maka.jpg`) |
| Quiénes somos, misión, visión, valores y política de calidad | `/quienes-somos` |
| Ubicación física | `/quienes-somos#ubicacion` (mapa embebido y puntos de entrega) |
| Chat | Botón flotante en todas las páginas: respuestas rápidas y paso a WhatsApp |
| Preguntas frecuentes | `/contacto#preguntas` |
| Acceso a redes sociales | Footer y página de contacto |
| Carrusel de imágenes propias | Página de inicio |
| Valoración de productos | Detalle de cada producto: estrellas, promedio y formulario de opinión |
| Tienda virtual con al menos 20 productos | `/catalogo`: 24 productos en 7 categorías |
| Formulario «Contáctanos» | `/contacto`, con validación |
| Video embebido | Inicio y Quiénes somos (configurable, ver abajo) |
| Diseño responsivo | De 360 a 1920 px, con menú lateral en celular |

## Páginas (carta de navegación)

| Página | Ruta |
|---|---|
| 1.0 Inicio | `/` |
| 2.1 Productos por categoría | `/catalogo/:categoria` |
| 2.2 Resultados de búsqueda | `/buscar?q=` |
| 2.3 Detalle del producto | `/catalogo/:categoria/:producto` |
| 3.0 Quiénes somos | `/quienes-somos` |
| 4.0 Contacto y preguntas frecuentes | `/contacto` |
| 5.1 Registro · 5.2 Iniciar sesión · 5.3 Recuperar contraseña | `/cuenta/registro` · `/cuenta/iniciar-sesion` · `/cuenta/recuperar` |
| 5.4 Mi cuenta (datos, dirección, favoritos, pedidos) | `/cuenta` |
| 6.0 Carrito | `/carrito` |
| 6.1 Checkout en tres pasos | `/checkout` |
| 6.2 Confirmación con tiempo límite de apartado | `/checkout/confirmacion/:pedido` |
| 7.0 Información legal | `/legal/aviso-de-privacidad`, `/legal/terminos`, `/legal/envios-y-devoluciones` |
| Página no encontrada | cualquier otra ruta |

Las rutas del repositorio anterior (`/productos`, `/product/:id`, `/cart`) redirigen a las nuevas.

## Personalizar el contenido

| Qué | Archivo |
|---|---|
| WhatsApp, correo, horario, redes, puntos de entrega, costos de envío, datos bancarios, cupones, video, logo | `src/data/config.js` |
| Productos, precios, existencias y fotos | `src/data/productos.js` |
| Historia, misión, visión, valores, política de calidad, preguntas frecuentes, chat y textos legales | `src/data/contenido.js` |

- **Fotos de productos:** copia la foto a `public/img/productos/` y escribe su nombre en el arreglo `imagenes` del producto. La primera foto es la principal. Mientras un producto no tenga foto se muestra un espacio con la leyenda «Foto pendiente».
- **Carrusel:** reemplaza `public/img/carrusel/slide-1.jpg`, `slide-2.jpg` y `slide-3.jpg`. Los textos están en `src/pages/Home.jsx`.
- **Video:** sube el video a YouTube y pega su identificador en `VIDEO_YOUTUBE_ID`. Por ejemplo, en `https://www.youtube.com/watch?v=AbC123xyz` el identificador es `AbC123xyz`.
- **Existencias:** el campo `stock` de cada producto. Un producto base con `stock: 0` se muestra como «Agotado»; uno de temporada (`temporada: true`) con `stock: 0` se oculta del catálogo.

## Datos de prueba

- **Cupones:** `MAKA10` (10 %), `BIENVENIDA` ($100 en compras desde $1,000) y `VERANO25` (vencido, para mostrar el mensaje de error).
- **Producto agotado:** *Anillo Disco Martillado* muestra el estado «Agotado» y el formulario «Avísame cuando vuelva».
- **Búsqueda sin resultados:** busca, por ejemplo, «brazalete titanio».
- **Apartado de 24 horas:** al pagar por transferencia, la confirmación muestra un contador. Cuando vence, el pedido aparece como «Cancelado» en *Mi cuenta* y las piezas se liberan.
- **Recuperar contraseña:** como no se envían correos, la pantalla muestra un «enlace de prueba».
- **Reiniciar los datos:** en las herramientas del navegador, borra el almacenamiento local del sitio (claves que empiezan con `maka-`).

Las opiniones marcadas como «Ejemplo» son textos de demostración y se pueden borrar en `VALORACIONES_EJEMPLO` (`src/data/productos.js`).

## Tecnologías

- React 18 y React Router 6 (rutas y carga diferida de páginas)
- Vite 5
- Context API: carrito, sesión, pedidos y valoraciones
- CSS por componente con variables de la paleta de MAKA
- Montserrat autoalojada con `@fontsource/montserrat`

## Estructura

```
src/
├── components/   Navbar, Footer, ProductCard, Carousel, ChatWidget, Stars, Toast, ui (campos, alertas, breadcrumbs)…
├── context/      CartContext, AuthContext, PedidosContext, ValoracionesContext
├── data/         config.js, productos.js, contenido.js
├── hooks/        useLocalStorage (estado persistente y título de página)
├── pages/        una página por cada apartado de la carta de navegación
├── styles/       global.css y estilos por sección
└── utils/        formato de moneda y fechas, reglas de validación
```

## Accesibilidad y rendimiento

- Contraste AA: los textos y botones usan el café oscuro `#8b5a34` sobre fondos claros; el café de marca `#c18e61` se usa como acento.
- Todos los campos tienen etiqueta visible. Los errores se muestran con ícono, texto y borde (no solo con color) y están asociados al campo.
- Navegación con teclado, enlace «Saltar al contenido» y respeto a la preferencia de movimiento reducido.
- Fotos optimizadas a 900 px con carga diferida. Las páginas secundarias se cargan bajo demanda y el video de YouTube solo se carga al pulsar «Reproducir».

## Publicar

- **Netlify:** ejecuta `npm run build` y arrastra la carpeta `dist` a app.netlify.com/drop. El archivo `public/_redirects` ya está incluido.
- **Vercel:** importa el repositorio; `vercel.json` ya incluye la regla para las rutas.
