import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useCart, calcularEnvio } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { usePedidos } from '../context/PedidosContext';
import { PUNTOS_ENTREGA, ENVIO, PAGO_TRANSFERENCIA } from '../data/config';
import { useTitulo } from '../hooks/useLocalStorage';
import { reglas, validar } from '../utils/validacion';
import { dinero } from '../utils/format';
import ProductImage from '../components/ProductImage';
import { Alert, Field } from '../components/ui';
import Icon from '../components/Icon';
import '../styles/cart.css';
import '../styles/checkout.css';

const PASOS = ['Datos', 'Entrega y pago', 'Resumen'];
const ESTADOS = ['Jalisco', 'Aguascalientes', 'Baja California', 'Ciudad de México', 'Colima', 'Estado de México', 'Guanajuato', 'Michoacán', 'Nayarit', 'Nuevo León', 'Querétaro', 'Sinaloa', 'Zacatecas', 'Otro'];

const ESQUEMAS = {
  0: { nombre: [reglas.nombre], correo: [reglas.correo], telefono: [reglas.telefono] },
  1: {
    calle: [(v, d) => (d.entrega === 'domicilio' ? reglas.requerido(v) : '')],
    colonia: [(v, d) => (d.entrega === 'domicilio' ? reglas.requerido(v) : '')],
    cp: [(v, d) => (d.entrega === 'domicilio' ? reglas.cp(v) : '')],
    ciudad: [(v, d) => (d.entrega === 'domicilio' ? reglas.requerido(v) : '')],
    punto: [(v, d) => (d.entrega === 'recoger' && !v ? 'Elige un punto de entrega.' : '')],
    mensajeRegalo: [(v, d) => (d.regalo && !String(v).trim() ? 'Escribe el mensaje para la tarjeta.' : '')],
  },
  2: { aviso: [reglas.aceptar] },
};

export default function Checkout() {
  useTitulo('Finalizar compra');
  const { lineas, subtotal, descuento, cupon, cuponValido, vaciar } = useCart();
  const { usuario, actualizarPerfil } = useAuth();
  const { crearPedido } = usePedidos();
  const navigate = useNavigate();
  const [paso, setPaso] = useState(usuario ? 0 : -1);
  const [errores, setErrores] = useState({});
  const [d, setD] = useState(() => ({
    nombre: usuario?.nombre || '', correo: usuario?.correo || '', telefono: usuario?.telefono || '',
    entrega: 'domicilio', calle: usuario?.direccion?.calle || '', colonia: usuario?.direccion?.colonia || '', cp: usuario?.direccion?.cp || '',
    ciudad: usuario?.direccion?.ciudad || 'Guadalajara', estado: usuario?.direccion?.estado || 'Jalisco', referencias: usuario?.direccion?.referencias || '',
    punto: '', pago: 'transferencia', regalo: false, mensajeRegalo: '', guardar: true, aviso: false,
  }));
  useEffect(() => { window.scrollTo(0, 0); }, [paso]);

  const disponibles = lineas.filter(l => !l.agotado);
  if (!disponibles.length) return <Navigate to="/carrito" replace />;

  const envio = calcularEnvio(subtotal - descuento, d.entrega);
  const total = subtotal - descuento + envio;
  const cambios = lineas.some(l => l.agotado || l.ajustada);

  const set = (k) => (e) => {
    const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    const n = { ...d, [k]: v };
    if (k === 'entrega' && v === 'domicilio' && n.pago === 'efectivo') n.pago = 'transferencia';
    setD(n);
    if (errores[k]) setErrores(validar(n, ESQUEMAS[paso] || {}));
  };
  const blur = (k) => () => { const s = ESQUEMAS[paso]?.[k]; if (s) { const e = validar(d, { [k]: s }); setErrores(p => ({ ...p, [k]: e[k] })); } };

  const siguiente = (e) => {
    e?.preventDefault();
    const err = validar(d, ESQUEMAS[paso]);
    setErrores(err);
    if (Object.keys(err).length) { document.getElementById(`ck-${Object.keys(err)[0]}`)?.focus(); return; }
    if (paso < 2) { setPaso(paso + 1); return; }
    confirmar();
  };

  const confirmar = () => {
    if (usuario && d.entrega === 'domicilio' && d.guardar) actualizarPerfil({ telefono: d.telefono, direccion: { calle: d.calle, colonia: d.colonia, cp: d.cp, ciudad: d.ciudad, estado: d.estado, referencias: d.referencias } });
    const pedido = crearPedido({
      usuarioId: usuario?.id || null,
      cliente: { nombre: d.nombre, correo: d.correo, telefono: d.telefono },
      entrega: d.entrega === 'domicilio'
        ? { tipo: 'domicilio', direccion: `${d.calle}, ${d.colonia}, C. P. ${d.cp}, ${d.ciudad}, ${d.estado}`, referencias: d.referencias }
        : { tipo: 'recoger', punto: PUNTOS_ENTREGA.find(p => p.id === d.punto) },
      pago: d.pago, regalo: d.regalo ? d.mensajeRegalo : null,
      lineas: disponibles.map(l => ({ id: l.id, nombre: l.producto.nombre, precio: l.producto.precio, cantidad: l.cantidad, acabado: l.acabado, talla: l.talla, slug: l.producto.slug })),
      subtotal, descuento: cuponValido ? descuento : 0, cupon: cuponValido ? cupon : null, envio, total,
    });
    vaciar();
    navigate(`/checkout/confirmacion/${pedido.numero}`, { replace: true });
  };

  return (
    <div className="container page checkout">
      <h1 className="center">Finalizar compra</h1>
      {paso >= 0 && (
        <ol className="steps" aria-label="Progreso de la compra">
          {PASOS.map((s, i) => (
            <li key={s} className={i < paso ? 'is-done' : i === paso ? 'is-current' : ''} aria-current={i === paso ? 'step' : undefined}>
              <span className="steps__n">{i < paso ? <Icon name="check" size={14} /> : i + 1}</span>{s}
            </li>
          ))}
        </ol>
      )}

      <div className="checkout__grid">
        <div>
          {paso === -1 && (
            <div className="card-box guest">
              <h2>¿Cómo quieres continuar?</h2>
              <div className="guest__opts">
                <div><h3>Ya tengo cuenta</h3><p className="muted">Usa tus datos y direcciones guardadas.</p><Link className="btn btn--outline" to="/cuenta/iniciar-sesion" state={{ volver: '/checkout' }}>Iniciar sesión</Link></div>
                <div><h3>Continuar como invitada</h3><p className="muted">Solo te pediremos los datos para tu entrega.</p><button className="btn btn--primary" onClick={() => setPaso(0)}>Continuar como invitada</button></div>
              </div>
            </div>
          )}

          {paso >= 0 && (
            <form className="card-box" onSubmit={siguiente} noValidate>
              {cambios && <Alert tipo="error" titulo="Una pieza cambió de disponibilidad">Retiramos del pedido las piezas agotadas y recalculamos el total.</Alert>}
              {Object.keys(errores).filter(k => errores[k]).length > 1 && (
                <Alert tipo="error" titulo={`Revisa los ${Object.keys(errores).filter(k => errores[k]).length} campos marcados para continuar`} />
              )}

              {paso === 0 && (
                <fieldset>
                  <legend className="h2">Datos de contacto</legend>
                  <Field id="ck-nombre" label="Nombre completo" error={errores.nombre}>{(a) => <input {...a} value={d.nombre} onChange={set('nombre')} onBlur={blur('nombre')} autoComplete="name" />}</Field>
                  <div className="row-2">
                    <Field id="ck-correo" label="Correo electrónico" error={errores.correo}>{(a) => <input {...a} type="email" value={d.correo} onChange={set('correo')} onBlur={blur('correo')} autoComplete="email" />}</Field>
                    <Field id="ck-telefono" label="Teléfono" error={errores.telefono} hint="10 dígitos, para coordinar la entrega">{(a) => <input {...a} type="tel" inputMode="numeric" value={d.telefono} onChange={set('telefono')} onBlur={blur('telefono')} autoComplete="tel" />}</Field>
                  </div>
                </fieldset>
              )}

              {paso === 1 && (
                <>
                  <fieldset>
                    <legend className="h2">Forma de entrega</legend>
                    <label className={`option ${d.entrega === 'domicilio' ? 'is-active' : ''}`}>
                      <input type="radio" name="entrega" value="domicilio" checked={d.entrega === 'domicilio'} onChange={set('entrega')} />
                      <span><strong>Envío a domicilio</strong><span className="muted small">1 a 3 días en Guadalajara · 3 a 7 días al resto de México</span></span>
                      <strong>{calcularEnvio(subtotal - descuento) === 0 ? 'Gratis' : dinero(ENVIO.costoDomicilio)}</strong>
                    </label>
                    <label className={`option ${d.entrega === 'recoger' ? 'is-active' : ''}`}>
                      <input type="radio" name="entrega" value="recoger" checked={d.entrega === 'recoger'} onChange={set('entrega')} />
                      <span><strong>Recoger en punto de entrega</strong><span className="muted small">Zona metropolitana de Guadalajara</span></span>
                      <strong>Gratis</strong>
                    </label>
                  </fieldset>

                  {d.entrega === 'domicilio' ? (
                    <fieldset>
                      <legend className="h3">Dirección de envío</legend>
                      <Field id="ck-calle" label="Calle y número" error={errores.calle}>{(a) => <input {...a} value={d.calle} onChange={set('calle')} onBlur={blur('calle')} autoComplete="address-line1" />}</Field>
                      <div className="row-2">
                        <Field id="ck-colonia" label="Colonia" error={errores.colonia}>{(a) => <input {...a} value={d.colonia} onChange={set('colonia')} onBlur={blur('colonia')} autoComplete="address-level3" />}</Field>
                        <Field id="ck-cp" label="Código postal" error={errores.cp}>{(a) => <input {...a} inputMode="numeric" maxLength={5} value={d.cp} onChange={set('cp')} onBlur={blur('cp')} autoComplete="postal-code" />}</Field>
                      </div>
                      <div className="row-2">
                        <Field id="ck-ciudad" label="Ciudad o municipio" error={errores.ciudad}>{(a) => <input {...a} value={d.ciudad} onChange={set('ciudad')} onBlur={blur('ciudad')} autoComplete="address-level2" />}</Field>
                        <Field id="ck-estado" label="Estado">{(a) => <select {...a} value={d.estado} onChange={set('estado')}>{ESTADOS.map(e => <option key={e}>{e}</option>)}</select>}</Field>
                      </div>
                      <Field id="ck-referencias" label="Referencias" opcional>{(a) => <input {...a} value={d.referencias} onChange={set('referencias')} placeholder="Entre calles, color de la casa…" />}</Field>
                      {usuario && <label className="check"><input type="checkbox" checked={d.guardar} onChange={set('guardar')} /> Guardar esta dirección en mi cuenta</label>}
                    </fieldset>
                  ) : (
                    <fieldset className={errores.punto ? 'has-error' : ''}>
                      <legend className="h3">Punto de entrega</legend>
                      {PUNTOS_ENTREGA.map((p, i) => (
                        <label key={p.id} className={`option ${d.punto === p.id ? 'is-active' : ''}`}>
                          <input id={i === 0 ? 'ck-punto' : undefined} type="radio" name="punto" value={p.id} checked={d.punto === p.id} onChange={set('punto')} />
                          <span><strong>{p.nombre}</strong><span className="muted small">{p.zona} · {p.horario}</span></span>
                        </label>
                      ))}
                      {errores.punto && <p className="field__error"><Icon name="warn" size={14} /> {errores.punto}</p>}
                    </fieldset>
                  )}

                  <fieldset>
                    <legend className="h2">Forma de pago</legend>
                    <label className={`option ${d.pago === 'transferencia' ? 'is-active' : ''}`}>
                      <input type="radio" name="pago" value="transferencia" checked={d.pago === 'transferencia'} onChange={set('pago')} />
                      <span><strong>Transferencia bancaria</strong><span className="muted small">Apartamos tus piezas {PAGO_TRANSFERENCIA.horasApartado} horas mientras pagas</span></span>
                    </label>
                    <label className={`option ${d.pago === 'efectivo' ? 'is-active' : ''} ${d.entrega !== 'recoger' ? 'is-disabled' : ''}`}>
                      <input type="radio" name="pago" value="efectivo" checked={d.pago === 'efectivo'} onChange={set('pago')} disabled={d.entrega !== 'recoger'} />
                      <span><strong>Efectivo al recoger</strong><span className="muted small">{d.entrega === 'recoger' ? 'Pagas al recibir tu pedido' : 'Disponible solo al recoger en un punto de entrega'}</span></span>
                    </label>
                    <p className="muted small"><Icon name="info" size={14} /> El pago con tarjeta estará disponible en una siguiente etapa.</p>
                  </fieldset>

                  <fieldset>
                    <label className="check"><input type="checkbox" checked={d.regalo} onChange={set('regalo')} /> <Icon name="gift" size={16} /> Es un regalo: agregar tarjeta con mensaje</label>
                    {d.regalo && <Field id="ck-mensajeRegalo" label="Mensaje para la tarjeta" error={errores.mensajeRegalo}>{(a) => <textarea {...a} rows={2} maxLength={150} value={d.mensajeRegalo} onChange={set('mensajeRegalo')} onBlur={blur('mensajeRegalo')} />}</Field>}
                  </fieldset>
                </>
              )}

              {paso === 2 && (
                <div className="review-order">
                  <h2>Revisa tu pedido</h2>
                  <div className="review-order__grid">
                    <section><h3>Datos <button type="button" className="link-btn" onClick={() => setPaso(0)}>Editar</button></h3><p>{d.nombre}<br />{d.correo}<br />{d.telefono}</p></section>
                    <section><h3>Entrega <button type="button" className="link-btn" onClick={() => setPaso(1)}>Editar</button></h3>
                      <p>{d.entrega === 'domicilio' ? <>Envío a domicilio<br />{d.calle}, {d.colonia}<br />C. P. {d.cp}, {d.ciudad}, {d.estado}</> : <>Recoger en {PUNTOS_ENTREGA.find(p => p.id === d.punto)?.nombre}<br />{PUNTOS_ENTREGA.find(p => p.id === d.punto)?.horario}</>}</p></section>
                    <section><h3>Pago <button type="button" className="link-btn" onClick={() => setPaso(1)}>Editar</button></h3><p>{d.pago === 'transferencia' ? 'Transferencia bancaria' : 'Efectivo al recoger'}{d.regalo && <><br />Regalo: «{d.mensajeRegalo}»</>}</p></section>
                  </div>
                  <label className={`check check--box ${errores.aviso ? 'has-error' : ''}`}>
                    <input id="ck-aviso" type="checkbox" checked={d.aviso} onChange={set('aviso')} aria-invalid={!!errores.aviso} aria-describedby={errores.aviso ? 'ck-aviso-err' : undefined} />
                    <span>Acepto el <Link to="/legal/aviso-de-privacidad" target="_blank">aviso de privacidad</Link> y los <Link to="/legal/terminos" target="_blank">términos y condiciones</Link>.</span>
                  </label>
                  {errores.aviso && <p id="ck-aviso-err" className="field__error"><Icon name="warn" size={14} /> {errores.aviso}</p>}
                </div>
              )}

              <div className="checkout__actions">
                {paso > 0 ? <button type="button" className="btn btn--ghost" onClick={() => setPaso(paso - 1)}><Icon name="chevronLeft" size={16} /> Regresar</button> : <Link to="/carrito" className="btn btn--ghost"><Icon name="chevronLeft" size={16} /> Volver al carrito</Link>}
                <button className="btn btn--primary btn--lg">{paso < 2 ? 'Siguiente' : 'Confirmar pedido'}</button>
              </div>
            </form>
          )}
        </div>

        <aside className="summary summary--sticky" aria-labelledby="t-res">
          <h2 id="t-res">Resumen del pedido</h2>
          <ul className="mini-lines">
            {disponibles.map(l => (
              <li key={l.key}><span className="mini-lines__img"><ProductImage producto={l.producto} /><em>{l.cantidad}</em></span>
                <span>{l.producto.nombre}<span className="muted small">{[l.acabado, l.talla && `Talla ${l.talla}`].filter(Boolean).join(' · ')}</span></span><strong>{dinero(l.importe)}</strong></li>
            ))}
          </ul>
          <dl className="summary__rows">
            <div><dt>Subtotal</dt><dd>{dinero(subtotal)}</dd></div>
            {cuponValido && <div className="is-discount"><dt>Descuento ({cupon})</dt><dd>−{dinero(descuento)}</dd></div>}
            <div><dt>Envío</dt><dd>{envio === 0 ? 'Gratis' : dinero(envio)}</dd></div>
          </dl>
          <div className="summary__total"><span>Total</span><strong>{dinero(total)}</strong></div>
        </aside>
      </div>
    </div>
  );
}
