import { Link } from 'react-router-dom';
import { CATEGORIAS, COLECCIONES, PRODUCTOS_VISIBLES } from '../data/productos';
import { ENVIO } from '../data/config';
import { NOSOTROS } from '../data/contenido';
import { useTitulo } from '../hooks/useLocalStorage';
import { dinero } from '../utils/format';
import Carousel from '../components/Carousel';
import ProductCard from '../components/ProductCard';
import ProductImage, { rutaFoto } from '../components/ProductImage';
import Icon from '../components/Icon';
import '../styles/home.css';

const SLIDES = [
  { imagen: '/img/carrusel/slide-sagrado-corazon.webp', alt: 'Aretes de sagrado corazón rojo con corona dorada y circonias', kicker: 'Colección Sagrado Corazón', titulo: 'Arte mexicano para lucir', texto: 'Corazones esmaltados con coronas doradas: collar, aretes y anillo para completar tu look.', cta: 'Ver la colección', to: '/catalogo?coleccion=sagrado-corazon' },
  { imagen: '/img/carrusel/slide-cascada.webp', alt: 'Aretes de hojas martilladas en dorado y plateado', kicker: 'Nueva temporada', titulo: 'Joyería que se siente tuya', texto: 'Piezas en tendencia en dorado o plateado para combinar con tu estilo de todos los días.', cta: 'Ver novedades', to: '/catalogo?orden=novedades' },
  { imagen: '/img/carrusel/slide-2.webp', alt: 'Collares de perlas en varias capas', kicker: 'Colección Perlas', titulo: 'Perlas para cada ocasión', texto: 'Collares, aretes y anillos de perla que nunca pasan de moda.', cta: 'Ver perlas', to: '/catalogo?coleccion=perlas' },
  { imagen: '/img/carrusel/slide-1.webp', alt: 'Aretes dorados en forma de hoja sobre un estuche de madera', kicker: 'Envío gratis', titulo: `Envío sin costo desde ${dinero(ENVIO.gratisDesde)}`, texto: 'O recoge tu pedido sin costo en un punto de entrega en Guadalajara.', cta: 'Comprar ahora', to: '/catalogo' },
];

export default function Home() {
  useTitulo('');
  const novedades = [...PRODUCTOS_VISIBLES].filter(p => p.nuevo).sort((a, b) => (b.imagenes.length > 0) - (a.imagenes.length > 0) || b.fecha.localeCompare(a.fecha)).slice(0, 4);
  const masVendidos = PRODUCTOS_VISIBLES.filter(p => p.masVendido).slice(0, 4);
  const destacada = COLECCIONES[0];
  // Piezas de la colección en el orden definido, sin repetir la que aparece en la foto de portada.
  const piezasDestacada = destacada.ids.map(id => PRODUCTOS_VISIBLES.find(p => p.id === id)).filter(p => p && !destacada.portada.startsWith(p.slug)).slice(0, 3);
  const portada = (slug) => PRODUCTOS_VISIBLES.find(p => p.categoria === slug && p.imagenes.length) || PRODUCTOS_VISIBLES.find(p => p.categoria === slug);

  return (
    <div className="home">
      <Carousel slides={SLIDES} />

      <section className="container section" aria-labelledby="t-categorias">
        <h2 id="t-categorias" className="section__title">Compra por categoría</h2>
        <div className="cats">
          {CATEGORIAS.map(c => (
            <Link key={c.slug} to={`/catalogo/${c.slug}`} className="cats__item">
              <span className="cats__img"><ProductImage producto={portada(c.slug)} /></span>
              <span>{c.nombre}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="container section" aria-labelledby="t-novedades">
        <div className="section__head">
          <h2 id="t-novedades" className="section__title">Novedades</h2>
          <Link to="/catalogo?orden=novedades" className="link-arrow">Ver todas <Icon name="chevronRight" size={16} /></Link>
        </div>
        <div className="grid-products">{novedades.map(p => <ProductCard key={p.id} producto={p} />)}</div>
      </section>

      <section className="container section" aria-labelledby="t-coleccion">
        <div className="feature">
          <Link to={`/catalogo?coleccion=${destacada.slug}`} className="feature__img" tabIndex={-1} aria-hidden="true">
            <img src={rutaFoto(destacada.portada, 'grande')} alt="" loading="lazy" />
          </Link>
          <div className="feature__body">
            <span className="kicker">Colección destacada</span>
            <h2 id="t-coleccion">{destacada.nombre}</h2>
            <p className="muted">{destacada.descripcion} Combina collar, aretes y anillo para un look completo.</p>
            <div className="feature__grid">{piezasDestacada.map(p => <ProductCard key={p.id} producto={p} />)}</div>
            <Link to={`/catalogo?coleccion=${destacada.slug}`} className="btn btn--primary">Ver toda la colección</Link>
          </div>
        </div>
        <div className="collections" aria-label="Más colecciones">
          {COLECCIONES.slice(1).map(c => (
            <Link key={c.slug} to={`/catalogo?coleccion=${c.slug}`} className="collections__item">
              <img src={rutaFoto(c.portada)} alt="" loading="lazy" />
              <span>{c.nombre}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="benefits" aria-label="Beneficios">
        <div className="container benefits__grid">
          <div><Icon name="truck" size={28} /><strong>Envío gratis</strong><span>En compras desde {dinero(ENVIO.gratisDesde)}</span></div>
          <div><Icon name="pin" size={28} /><strong>Recolección sin costo</strong><span>En puntos de entrega de Guadalajara</span></div>
          <div><Icon name="shield" size={28} /><strong>Calidad revisada</strong><span>Cambio por defecto de fabricación</span></div>
          <div><Icon name="whatsapp" size={28} /><strong>Atención directa</strong><span>Por chat y WhatsApp de 9:00 a 22:00</span></div>
        </div>
      </section>

      <section className="container section" aria-labelledby="t-vendidos">
        <div className="section__head">
          <h2 id="t-vendidos" className="section__title">Lo más vendido</h2>
          <Link to="/catalogo?orden=vendidos" className="link-arrow">Ver catálogo <Icon name="chevronRight" size={16} /></Link>
        </div>
        <div className="grid-products">{masVendidos.map(p => <ProductCard key={p.id} producto={p} />)}</div>
      </section>

      <section className="container section about-teaser" aria-labelledby="t-nosotros">
        <div className="about-teaser__img">
          <img src="/img/productos/collar-perlas-flotantes-1.jpg" alt="Collar de perlas flotantes de MAKA" loading="lazy" />
          <img src="/img/productos/anillo-espiral-perla-2.jpg" alt="Anillo espiral con perla de MAKA" loading="lazy" />
        </div>
        <div className="about-teaser__text">
          <span className="kicker">Quiénes somos</span>
          <h2 id="t-nosotros">Hecho con cariño en Jalisco</h2>
          <p>{NOSOTROS.historia[0]}</p>
          <Link to="/quienes-somos" className="btn btn--outline">Conoce nuestra historia</Link>
        </div>
      </section>
    </div>
  );
}
