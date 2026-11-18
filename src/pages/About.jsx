import { Link } from 'react-router-dom';
import { NOSOTROS } from '../data/contenido';
import { PUNTOS_ENTREGA, TIENDA } from '../data/config';
import { useTitulo } from '../hooks/useLocalStorage';
import { VideoMarca, Mapa } from '../components/Media';
import { Breadcrumbs } from '../components/ui';
import Icon from '../components/Icon';
import '../styles/info.css';

export default function About() {
  useTitulo('Quiénes somos');
  return (
    <div className="info">
      <div className="container page">
        <Breadcrumbs items={[{ label: 'Quiénes somos' }]} />
        <header className="info-hero">
          <span className="kicker">Sobre MAKA</span>
          <h1>Joyería de moda hecha con cariño en Jalisco</h1>
          <p className="lead">{TIENDA.lema}. Piezas elegidas una por una para que te sientas segura, bonita y tú misma.</p>
        </header>

        <section className="story section" aria-labelledby="t-historia">
          <div className="story__img"><img src="/img/productos/collar-dijes-luna-1.jpg" alt="Collar dorado con dijes de luna, corazón y cruz" loading="lazy" /></div>
          <div>
            <h2 id="t-historia">Nuestra historia</h2>
            {NOSOTROS.historia.map((t, i) => <p key={i}>{t}</p>)}
          </div>
        </section>

        <section className="mv section" aria-label="Misión y visión">
          <article><Icon name="sparkle" size={28} /><h2>Misión</h2><p>{NOSOTROS.mision}</p></article>
          <article><Icon name="eye" size={28} /><h2>Visión</h2><p>{NOSOTROS.vision}</p></article>
        </section>

        <section className="section" aria-labelledby="t-valores">
          <h2 id="t-valores" className="section__title">Nuestros valores</h2>
          <div className="values">{NOSOTROS.valores.map(v => <article key={v.titulo}><h3>{v.titulo}</h3><p>{v.texto}</p></article>)}</div>
        </section>

        <section className="quality section" aria-labelledby="t-calidad">
          <div>
            <h2 id="t-calidad">Política de calidad</h2>
            <p>En MAKA nos comprometemos a que cada pieza llegue tal como la viste:</p>
            <ul className="checklist">{NOSOTROS.politicaCalidad.map(t => <li key={t}><Icon name="check" size={18} /> {t}</li>)}</ul>
          </div>
          <div className="quality__video"><VideoMarca /></div>
        </section>

        <section id="ubicacion" className="section location" aria-labelledby="t-ubicacion">
          <div>
            <h2 id="t-ubicacion">Ubicación y puntos de entrega</h2>
            <p>MAKA opera en la zona metropolitana de {TIENDA.ciudad}. Puedes recoger tu pedido sin costo en cualquiera de estos puntos:</p>
            <ul className="points">
              {PUNTOS_ENTREGA.map(p => <li key={p.id}><Icon name="pin" size={20} /><div><strong>{p.nombre}</strong><span>{p.zona}</span><span className="muted small">{p.horario}</span></div></li>)}
            </ul>
            <p className="muted small">También enviamos a todo México por paquetería.</p>
          </div>
          <Mapa />
        </section>

        <div className="cta-band">
          <h2>¿Lista para encontrar tu próxima pieza?</h2>
          <Link to="/catalogo" className="btn btn--primary">Conoce nuestras piezas</Link>
        </div>
      </div>
    </div>
  );
}
