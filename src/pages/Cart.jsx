import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart, calcularEnvio } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ENVIO } from '../data/config';
import { PRODUCTOS_VISIBLES, urlProducto } from '../data/productos';
import { useTitulo } from '../hooks/useLocalStorage';
import { dinero } from '../utils/format';
import ProductImage from '../components/ProductImage';
import ProductCard from '../components/ProductCard';
import { Alert, Breadcrumbs, EmptyState, Quantity } from '../components/ui';
import Icon from '../components/Icon';
import '../styles/cart.css';

export default function Cart() {
  useTitulo('Carrito');
  const { lineas, piezas, subtotal, descuento, cupon, cuponValido, aplicarCupon, quitarCupon, cambiarCantidad, eliminar } = useCart();
  const { usuario, alternarFavorito, favoritos } = useAuth();
  const navigate = useNavigate();
  const [codigo, setCodigo] = useState('');
  const [msgCupon, setMsgCupon] = useState(null);

  const envio = calcularEnvio(subtotal - descuento);
  const total = subtotal - descuento + envio;
  const falta = Math.max(0, ENVIO.gratisDesde - (subtotal - descuento));
  const hayCambios = lineas.some(l => l.agotado || l.ajustada);
  const disponibles = lineas.filter(l => !l.agotado);

  if (lineas.length === 0) {
    return (
      <div className="container page">
        <Breadcrumbs items={[{ label: 'Carrito' }]} />
        <h1>Tu carrito</h1>
        <EmptyState icon="cart" titulo="Tu carrito está vacío" texto="Aún no agregas piezas. Descubre nuestras colecciones y elige tus favoritas.">
          <Link to="/catalogo" className="btn btn--primary">Ir al catálogo</Link>
          <Link to="/catalogo?orden=novedades" className="btn btn--outline">Ver novedades</Link>
          {!usuario && <p className="muted small">¿Agregaste piezas desde otro dispositivo? <Link to="/cuenta/iniciar-sesion">Inicia sesión</Link>.</p>}
        </EmptyState>
        <section className="section">
          <h2 className="section__title">Te puede gustar</h2>
          <div className="grid-products">{PRODUCTOS_VISIBLES.filter(p => p.nuevo).slice(0, 4).map(p => <ProductCard key={p.id} producto={p} />)}</div>
        </section>
      </div>
    );
  }

  const enviarCupon = (e) => { e.preventDefault(); const r = aplicarCupon(codigo); setMsgCupon(r); if (r.ok) setCodigo(''); };

  return (
    <div className="container page">
      <Breadcrumbs items={[{ label: 'Carrito' }]} />
      <h1>Tu carrito</h1>
      <p className="muted">{piezas} pieza{piezas === 1 ? '' : 's'}</p>
      {hayCambios && <Alert tipo="error" titulo="Algunas piezas cambiaron de disponibilidad">Revisa los cambios antes de continuar. Las piezas agotadas no se incluyen en el total.</Alert>}

      <div className="cart">
        <div className="cart__items">
          <div className="cart__row cart__row--head" aria-hidden="true"><span>Producto</span><span>Precio</span><span>Cantidad</span><span>Subtotal</span><span /></div>
          <ul>
            {lineas.map(l => (
              <li key={l.key} className={`cart__row ${l.agotado ? 'is-out' : ''}`}>
                <Link to={urlProducto(l.producto)} className="cart__prod">
                  <span className="cart__thumb"><ProductImage producto={l.producto} /></span>
                  <span>
                    <strong>{l.producto.nombre}</strong>
                    <span className="muted small">{[l.acabado, l.talla && `Talla ${l.talla}`].filter(Boolean).join(' · ')}</span>
                    {l.agotado && <span className="tag tag--dark">Agotado</span>}
                  </span>
                </Link>
                <span className="cart__price" data-label="Precio">{dinero(l.producto.precio)}</span>
                <span data-label="Cantidad">
                  {l.agotado ? <span className="muted small">No disponible</span> : <Quantity value={l.cantidad} max={l.disponibles} onChange={(n) => cambiarCantidad(l.key, n)} label={`Cantidad de ${l.producto.nombre}`} />}
                </span>
                <strong className="cart__sub" data-label="Subtotal">{l.agotado ? '—' : dinero(l.importe)}</strong>
                <button className="icon-btn" onClick={() => eliminar(l.key)} aria-label={`Eliminar ${l.producto.nombre} del carrito`}><Icon name="trash" size={19} /></button>
                {l.ajustada && <p className="cart__note"><Icon name="info" size={15} /> Solo {l.disponibles === 1 ? 'queda 1 pieza' : `quedan ${l.disponibles} piezas`}. Ajustamos la cantidad de {l.cantidadSolicitada} a {l.cantidad}.</p>}
                {l.agotado && (
                  <p className="cart__note">
                    <button className="link-btn" onClick={() => { if (!favoritos.includes(l.producto.id)) alternarFavorito(l.producto.id); eliminar(l.key); }}>Mover a favoritos</button> ·{' '}
                    <Link to={`/catalogo/${l.producto.categoria}`}>Ver similares</Link>
                  </p>
                )}
              </li>
            ))}
          </ul>
          <Link to="/catalogo" className="link-arrow back"><Icon name="chevronLeft" size={16} /> Seguir comprando</Link>
        </div>

        <aside className="summary" aria-labelledby="t-resumen">
          <h2 id="t-resumen">Resumen del pedido</h2>
          {falta > 0 ? (
            <div className="freeship"><p>Te faltan <strong>{dinero(falta)}</strong> para el envío gratis</p><span className="bar"><i style={{ width: `${Math.min(100, ((subtotal - descuento) / ENVIO.gratisDesde) * 100)}%` }} /></span></div>
          ) : <div className="freeship is-done"><Icon name="check" size={16} /> <p>¡Tu envío es gratis!</p></div>}
          <dl className="summary__rows">
            <div><dt>Subtotal ({disponibles.reduce((s, l) => s + l.cantidad, 0)} piezas)</dt><dd>{dinero(subtotal)}</dd></div>
            {cuponValido && <div className="is-discount"><dt>Descuento ({cupon})</dt><dd>−{dinero(descuento)}</dd></div>}
            <div><dt>Envío estimado</dt><dd>{envio === 0 ? 'Gratis' : dinero(envio)}</dd></div>
          </dl>
          <form className="coupon" onSubmit={enviarCupon} noValidate>
            <label htmlFor="cupon">Código de descuento</label>
            {cuponValido ? (
              <p className="coupon__ok"><Icon name="check" size={15} /> Cupón {cupon} aplicado. <button type="button" className="link-btn" onClick={() => { quitarCupon(); setMsgCupon(null); }}>Quitar</button></p>
            ) : (
              <>
                <div className="coupon__row">
                  <input id="cupon" value={codigo} onChange={e => { setCodigo(e.target.value); setMsgCupon(null); }} placeholder="Ej. MAKA10" aria-invalid={msgCupon && !msgCupon.ok} aria-describedby="cupon-msg" />
                  <button className="btn btn--outline btn--sm">Aplicar</button>
                </div>
                {msgCupon && !msgCupon.ok && <p id="cupon-msg" className="field__error" role="alert"><Icon name="warn" size={14} /> {msgCupon.mensaje} El total no cambió.</p>}
              </>
            )}
          </form>
          <div className="summary__total"><span>Total</span><strong>{dinero(total)}</strong></div>
          <button className="btn btn--primary btn--block btn--lg" disabled={!disponibles.length} onClick={() => navigate('/checkout')}>
            Continuar con la compra
          </button>
          <p className="muted small center">La existencia se vuelve a confirmar al confirmar el pedido.</p>
        </aside>
      </div>
    </div>
  );
}
