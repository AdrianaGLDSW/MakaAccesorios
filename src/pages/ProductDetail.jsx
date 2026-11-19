import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PRODUCTOS_VISIBLES, categoriaPorSlug, coleccionDe, productoPorSlug } from '../data/productos';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { usePedidos } from '../context/PedidosContext';
import { useValoraciones } from '../context/ValoracionesContext';
import { useLocalStorage, useTitulo } from '../hooks/useLocalStorage';
import { dinero, fecha, whatsappUrl } from '../utils/format';
import { reglas, validar } from '../utils/validacion';
import { TIENDA } from '../data/config';
import ProductImage from '../components/ProductImage';
import ProductCard from '../components/ProductCard';
import { Stars, StarInput } from '../components/Stars';
import { Alert, Breadcrumbs, Field, Quantity } from '../components/ui';
import Icon from '../components/Icon';
import NotFound from './NotFound';
import '../styles/productDetail.css';

export default function ProductDetail() {
  const { slug } = useParams();
  const p = productoPorSlug(slug);
  useTitulo(p?.nombre || 'Producto no encontrado');
  if (!p) return <NotFound />;
  return <Detalle key={p.id} p={p} />;
}

function Detalle({ p }) {
  const { agregar } = useCart();
  const { favoritos, alternarFavorito, usuario } = useAuth();
  const { existencias } = usePedidos();
  const { resumen } = useValoraciones();
  const cat = categoriaPorSlug(p.categoria);
  const disponibles = existencias(p.id);
  const agotado = disponibles === 0;
  const [foto, setFoto] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [acabado, setAcabado] = useState(p.acabados[0]);
  const [talla, setTalla] = useState(p.tallas?.length === 1 ? p.tallas[0] : '');
  const [cantidad, setCantidad] = useState(1);
  const [errTalla, setErrTalla] = useState('');
  const fav = favoritos.includes(p.id);
  const { promedio, total } = resumen(p.id);
  const col = coleccionDe(p.id);
  const set = col ? PRODUCTOS_VISIBLES.filter(x => x.id !== p.id && col.ids.includes(x.id)).slice(0, 4) : [];
  const relacionados = PRODUCTOS_VISIBLES.filter(x => x.id !== p.id && !set.includes(x) && (x.categoria === p.categoria || x.acabados.some(a => p.acabados.includes(a)))).slice(0, 4);
  const fotos = p.imagenes.length ? p.imagenes : [null];
  const mover = (d) => setFoto(f => (f + d + fotos.length) % fotos.length);
  const [toqueX, setToqueX] = useState(null);
  const onTouchStart = (e) => setToqueX(e.touches[0].clientX);
  const onTouchEnd = (e) => { if (toqueX == null) return; const dx = e.changedTouches[0].clientX - toqueX; if (Math.abs(dx) > 40) mover(dx < 0 ? 1 : -1); setToqueX(null); };

  const onAgregar = () => {
    if (p.tallas && !talla) { setErrTalla('Elige una talla.'); return; }
    if (agregar(p, { cantidad, acabado, talla })) setCantidad(1);
  };

  return (
    <div className="container page">
      <Breadcrumbs items={[{ label: cat.nombre, to: `/catalogo/${cat.slug}` }, { label: p.nombre }]} />
      <div className="pd">
        <div className="pd__gallery">
          <div className={`pd__main ${agotado ? 'is-soldout' : ''}`} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
            <button className="pd__zoom" onClick={() => p.imagenes.length && setZoom(true)} aria-label={p.imagenes.length ? `Ampliar foto ${foto + 1} de ${fotos.length}` : undefined} disabled={!p.imagenes.length}>
              <ProductImage producto={p} indice={foto} loading="eager" tamano="grande" />
            </button>
            {agotado && <span className="tag tag--dark pd__soldout">Agotado</span>}
            {fotos.length > 1 && (
              <>
                <button className="pd__arrow pd__arrow--prev" onClick={() => mover(-1)} aria-label="Foto anterior"><Icon name="chevronLeft" size={20} /></button>
                <button className="pd__arrow pd__arrow--next" onClick={() => mover(1)} aria-label="Foto siguiente"><Icon name="chevronRight" size={20} /></button>
                <span className="pd__count" aria-hidden="true">{foto + 1} / {fotos.length}</span>
              </>
            )}
          </div>
          {fotos.length > 1 && (
            <div className="pd__thumbs">
              {fotos.map((_, i) => <button key={i} className={i === foto ? 'is-active' : ''} onClick={() => setFoto(i)} aria-label={`Ver foto ${i + 1}`} aria-current={i === foto}><ProductImage producto={p} indice={i} /></button>)}
            </div>
          )}
        </div>

        <div className="pd__info">
          <span className="tag tag--outline">{cat.nombre}</span>
          <h1>{p.nombre}</h1>
          <a href="#opiniones" className="pd__rating">{total ? <><Stars valor={promedio} mostrarValor /> <span>{total} {total === 1 ? 'opinión' : 'opiniones'}</span></> : <span>Sé la primera en opinar</span>}</a>
          <p className="pd__price">{dinero(p.precio)} <small>MXN</small></p>
          <p className={`pd__stock ${agotado ? 'is-out' : disponibles <= 2 ? 'is-low' : ''}`}>
            <Icon name={agotado ? 'warn' : 'check'} size={17} />
            {agotado ? 'Agotado · sin existencias en este momento' : disponibles <= 2 ? `¡Solo ${disponibles === 1 ? 'queda 1 pieza' : `quedan ${disponibles} piezas`}!` : 'Disponible'}
          </p>

          {p.acabados.length > 1 && (
            <fieldset className="pd__opt"><legend>Acabado: <strong>{acabado}</strong></legend>
              <div className="chips">{p.acabados.map(a => <button key={a} type="button" className={`chip ${a === acabado ? 'is-active' : ''}`} aria-pressed={a === acabado} onClick={() => setAcabado(a)}>{a}</button>)}</div>
            </fieldset>
          )}
          {p.tallas && p.tallas.length > 1 && (
            <fieldset className={`pd__opt ${errTalla ? 'has-error' : ''}`}><legend>Talla{talla && <>: <strong>{talla}</strong></>}</legend>
              <div className="chips">{p.tallas.map(t => <button key={t} type="button" className={`chip chip--square ${t === talla ? 'is-active' : ''}`} aria-pressed={t === talla} onClick={() => { setTalla(t); setErrTalla(''); }}>{t}</button>)}</div>
              {errTalla && <p className="field__error"><Icon name="warn" size={14} /> {errTalla}</p>}
            </fieldset>
          )}

          <div className="pd__buy">
            {!agotado && <Quantity value={cantidad} onChange={setCantidad} max={disponibles} />}
            <button className={`btn ${agotado ? 'btn--disabled' : 'btn--primary'} pd__add`} disabled={agotado} onClick={onAgregar}>
              <Icon name="cart" size={18} /> {agotado ? 'Sin existencias' : 'Agregar al carrito'}
            </button>
            <button className={`btn btn--outline btn--icon ${fav ? 'is-on' : ''}`} onClick={() => alternarFavorito(p.id)} aria-pressed={fav} aria-label={fav ? 'Quitar de favoritos' : 'Guardar en favoritos'}>
              <Icon name="heart" size={20} fill={fav ? 'currentColor' : 'none'} />
            </button>
          </div>
          {!agotado && cantidad >= disponibles && disponibles > 0 && <p className="muted small">Seleccionaste todas las piezas disponibles.</p>}

          {agotado && <AvisoDisponibilidad producto={p} correoInicial={usuario?.correo} />}

          <div className="pd__perks">
            <span><Icon name="truck" size={18} /> Envío gratis desde $1,299</span>
            <span><Icon name="pin" size={18} /> Recolección sin costo en Guadalajara</span>
          </div>

          <div className="accordion">
            <details open><summary>Descripción</summary><p>{p.descripcion}</p></details>
            <details><summary>Material y medidas</summary>
              <ul><li><strong>Material:</strong> {p.material}</li><li><strong>Medidas:</strong> {p.medidas}</li><li><strong>Hipoalergénica:</strong> {p.hipoalergenico ? 'Sí' : 'No'}</li></ul>
            </details>
            <details><summary>Cuidados</summary><p>{p.cuidados}</p></details>
            <details><summary>Envíos y cambios</summary><p>Envío a domicilio o recolección sin costo en Guadalajara. Cambio por defecto de fabricación dentro de 7 días. <Link to="/legal/envios-y-devoluciones">Ver política completa</Link>.</p></details>
          </div>
          <a className="pd__ask" href={whatsappUrl(TIENDA.whatsapp, `Hola, tengo una pregunta sobre ${p.nombre}.`)} target="_blank" rel="noopener noreferrer"><Icon name="whatsapp" size={18} /> ¿Dudas sobre esta pieza? Pregúntanos por WhatsApp</a>
        </div>
      </div>

      {set.length > 0 && (
        <section className="section set" aria-labelledby="t-set">
          <div className="section__head">
            <div><span className="kicker">{col.nombre}</span><h2 id="t-set" className="section__title">Completa el set</h2></div>
            <Link to={`/catalogo?coleccion=${col.slug}`} className="link-arrow">Ver la colección <Icon name="chevronRight" size={16} /></Link>
          </div>
          <div className="grid-products">{set.map(r => <ProductCard key={r.id} producto={r} />)}</div>
        </section>
      )}

      <Opiniones producto={p} />

      {relacionados.length > 0 && (
        <section className="section" aria-labelledby="t-rel">
          <h2 id="t-rel" className="section__title">También te puede gustar</h2>
          <div className="grid-products">{relacionados.map(r => <ProductCard key={r.id} producto={r} />)}</div>
        </section>
      )}

      {zoom && (
        <div className="lightbox" role="dialog" aria-label={`Foto ampliada de ${p.nombre}`} onClick={() => setZoom(false)}>
          <button className="lightbox__close" aria-label="Cerrar"><Icon name="close" size={28} /></button>
          <ProductImage producto={p} indice={foto} loading="eager" tamano="grande" />
        </div>
      )}
    </div>
  );
}

// CU-22: aviso de disponibilidad para productos base agotados.
function AvisoDisponibilidad({ producto, correoInicial = '' }) {
  const [avisos, setAvisos] = useLocalStorage('maka-avisos', []);
  const [correo, setCorreo] = useState(correoInicial);
  const [error, setError] = useState('');
  const ya = avisos.some(a => a.productoId === producto.id);
  const enviar = (e) => {
    e.preventDefault();
    const err = reglas.correo(correo); setError(err);
    if (!err) setAvisos(prev => [...prev, { productoId: producto.id, correo, fecha: new Date().toISOString() }]);
  };
  return (
    <div className="notify">
      <strong><Icon name="bell" size={18} /> Avísame cuando vuelva</strong>
      {ya ? <p className="ok-text">Te avisaremos cuando vuelva a estar disponible.</p> : (
        <>
          <p className="muted small">Te enviaremos un correo en cuanto haya piezas disponibles.</p>
          <form onSubmit={enviar} noValidate className="notify__form">
            <Field label="Correo electrónico" error={error}>{(a) => <input {...a} type="email" value={correo} onChange={e => setCorreo(e.target.value)} placeholder="nombre@correo.com" autoComplete="email" />}</Field>
            <button className="btn btn--primary">Avisarme</button>
          </form>
        </>
      )}
    </div>
  );
}

// RF-37: valoración de productos.
function Opiniones({ producto }) {
  const { deProducto, resumen, agregar } = useValoraciones();
  const { usuario } = useAuth();
  const lista = deProducto(producto.id);
  const { promedio, total } = resumen(producto.id);
  const [form, setForm] = useState({ nombre: usuario?.nombre || '', estrellas: 0, comentario: '' });
  const [errores, setErrores] = useState({});
  const [enviada, setEnviada] = useState(false);
  const dist = [5, 4, 3, 2, 1].map(n => ({ n, c: lista.filter(v => v.estrellas === n).length }));

  const enviar = (e) => {
    e.preventDefault();
    const err = validar(form, { nombre: [reglas.requerido], estrellas: [(v) => (v ? '' : 'Elige de 1 a 5 estrellas.')], comentario: [reglas.mensaje] });
    setErrores(err);
    if (Object.keys(err).length) return;
    agregar({ productoId: producto.id, ...form });
    setEnviada(true); setForm({ ...form, estrellas: 0, comentario: '' });
  };

  return (
    <section id="opiniones" className="section reviews" aria-labelledby="t-op">
      <h2 id="t-op" className="section__title">Opiniones de clientas</h2>
      <div className="reviews__grid">
        <div className="reviews__summary">
          {total ? <>
            <p className="reviews__avg">{promedio.toFixed(1)}</p>
            <Stars valor={promedio} size={20} />
            <p className="muted">{total} {total === 1 ? 'opinión' : 'opiniones'}</p>
            <ul className="reviews__dist">{dist.map(d => <li key={d.n}><span>{d.n} ★</span><span className="bar"><i style={{ width: `${total ? (d.c / total) * 100 : 0}%` }} /></span><span>{d.c}</span></li>)}</ul>
          </> : <p className="muted">Esta pieza aún no tiene opiniones.</p>}

          <form className="reviews__form" onSubmit={enviar} noValidate>
            <h3>Califica esta pieza</h3>
            {enviada && <Alert tipo="ok" titulo="¡Gracias por tu opinión!">Ya aparece en la lista.</Alert>}
            <div className={`field ${errores.estrellas ? 'has-error' : ''}`}>
              <span className="field__label">Calificación</span>
              <StarInput valor={form.estrellas} onChange={(n) => setForm({ ...form, estrellas: n })} error={errores.estrellas} />
              {errores.estrellas && <p className="field__error"><Icon name="warn" size={14} /> {errores.estrellas}</p>}
            </div>
            <Field label="Nombre" error={errores.nombre}>{(a) => <input {...a} value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} autoComplete="name" />}</Field>
            <Field label="Comentario" error={errores.comentario}>{(a) => <textarea {...a} rows={3} value={form.comentario} onChange={e => setForm({ ...form, comentario: e.target.value })} placeholder="¿Qué te pareció la pieza?" />}</Field>
            <button className="btn btn--primary">Publicar opinión</button>
          </form>
        </div>
        <ul className="reviews__list">
          {lista.map(v => (
            <li key={v.id} className="review">
              <div className="review__head"><Stars valor={v.estrellas} size={14} /> <strong>{v.nombre}</strong> {v.ejemplo && <span className="tag tag--soft">Ejemplo</span>}</div>
              <p>{v.comentario}</p>
              <span className="muted small">{fecha(v.fecha + 'T12:00:00')}</span>
            </li>
          ))}
          {!lista.length && <li className="muted">Sé la primera en compartir tu opinión.</li>}
        </ul>
      </div>
    </section>
  );
}
