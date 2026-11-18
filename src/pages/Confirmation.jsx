import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import { usePedidos, estadoPedido, useAhora } from '../context/PedidosContext';
import { PAGO_TRANSFERENCIA, TIENDA } from '../data/config';
import { useTitulo } from '../hooks/useLocalStorage';
import { dinero, fecha, whatsappUrl } from '../utils/format';
import { Alert } from '../components/ui';
import Icon from '../components/Icon';
import NotFound from './NotFound';
import '../styles/cart.css';
import '../styles/checkout.css';

const dos = (n) => String(n).padStart(2, '0');

export default function Confirmation() {
  const { numero } = useParams();
  const { pedidoPorNumero } = usePedidos();
  const ahora = useAhora(1000);
  const [copiado, setCopiado] = useState(false);
  const p = pedidoPorNumero(numero);
  useTitulo(p ? `Pedido ${p.numero}` : 'Pedido no encontrado');
  if (!p) return <NotFound />;

  const estado = estadoPedido(p, ahora);
  const transferencia = p.pago === 'transferencia';
  const restante = Math.max(0, new Date(p.vence).getTime() - ahora);
  const h = Math.floor(restante / 3.6e6), m = Math.floor((restante % 3.6e6) / 6e4), s = Math.floor((restante % 6e4) / 1000);
  const avance = restante / (PAGO_TRANSFERENCIA.horasApartado * 3.6e6) * 100;
  const msgWa = `Hola, envío el comprobante de pago del pedido ${p.numero} por ${dinero(p.total)}.`;
  const copiar = async () => { try { await navigator.clipboard.writeText(PAGO_TRANSFERENCIA.clabe.replace(/\s/g, '')); setCopiado(true); setTimeout(() => setCopiado(false), 2000); } catch { /* sin portapapeles */ } };

  return (
    <div className="container page checkout">
      <ol className="steps" aria-label="Progreso de la compra">
        {['Datos', 'Entrega y pago', 'Resumen'].map(s => <li key={s} className="is-done"><span className="steps__n"><Icon name="check" size={14} /></span>{s}</li>)}
      </ol>
      <div className="checkout__grid">
        <section className="card-box confirm">
          {estado === 'Cancelado' ? (
            <>
              <Alert tipo="error" titulo="El tiempo de apartado terminó">No recibimos el comprobante antes del {fecha(p.vence, true)}. El pedido se canceló, las piezas se liberaron y no se realizó ningún cargo.</Alert>
              <div className="confirm__actions"><Link to="/catalogo" className="btn btn--primary">Volver al catálogo</Link></div>
            </>
          ) : (
            <>
              <div className="confirm__head">
                <span className="confirm__check"><Icon name="check" size={34} strokeWidth={2.2} /></span>
                <h1>¡Pedido registrado!</h1>
                <p>Pedido <strong>#{p.numero}</strong> · <span className="pill">{transferencia ? 'Pendiente de pago' : estado}</span></p>
                <p className="muted">Te enviaremos el resumen a {p.cliente.correo}.</p>
              </div>

              {transferencia ? (
                <div className="countdown" role="timer" aria-live="off">
                  <p className="countdown__title"><Icon name="clock" size={20} /> Tiempo restante para pagar y conservar tu apartado</p>
                  <div className="countdown__digits" aria-label={`${h} horas, ${m} minutos y ${s} segundos`}>
                    <span><b>{dos(h)}</b>horas</span><i>:</i><span><b>{dos(m)}</b>minutos</span><i>:</i><span><b>{dos(s)}</b>segundos</span>
                  </div>
                  <span className="bar"><i style={{ width: `${avance}%` }} /></span>
                  <p className="countdown__dates"><span>Apartado: {fecha(p.creado, true)}</span><strong>Vence: {fecha(p.vence, true)}</strong></p>
                  <p className="small">Si el plazo vence, el pedido se cancela automáticamente y las piezas vuelven a estar disponibles. Te recordaremos por correo y WhatsApp 4 horas antes.</p>
                </div>
              ) : (
                <Alert tipo="info" titulo="Pagas en efectivo al recoger">Te esperamos en {p.entrega.punto?.nombre} ({p.entrega.punto?.horario}). Te confirmaremos por WhatsApp cuando tu pedido esté listo.</Alert>
              )}

              <h2 className="h3">Resumen</h2>
              <ul className="confirm__lines">{p.lineas.map((l, i) => <li key={i}><span>{l.cantidad} × {l.nombre}{l.talla ? ` (talla ${l.talla})` : ''}</span><span>{dinero(l.precio * l.cantidad)}</span></li>)}</ul>
              <dl className="summary__rows">
                <div><dt>Subtotal</dt><dd>{dinero(p.subtotal)}</dd></div>
                {p.descuento > 0 && <div className="is-discount"><dt>Descuento ({p.cupon})</dt><dd>−{dinero(p.descuento)}</dd></div>}
                <div><dt>Envío</dt><dd>{p.envio ? dinero(p.envio) : 'Gratis'}</dd></div>
              </dl>
              <div className="summary__total"><span>Total</span><strong>{dinero(p.total)}</strong></div>
              <p className="muted small">{p.entrega.tipo === 'domicilio' ? `Entrega en: ${p.entrega.direccion}` : `Recoger en: ${p.entrega.punto?.nombre}, ${p.entrega.punto?.zona}`}</p>
              <div className="confirm__actions">
                <Link to="/cuenta?tab=pedidos" className="btn btn--outline">Ver mis pedidos</Link>
                <Link to="/catalogo" className="btn btn--ghost">Seguir comprando</Link>
              </div>
            </>
          )}
        </section>

        {transferencia && estado !== 'Cancelado' && (
          <aside className="summary" aria-labelledby="t-pago">
            <h2 id="t-pago"><Icon name="bank" size={20} /> Instrucciones de pago</h2>
            <p className="muted small">Transfiere el monto exacto y usa tu número de pedido como concepto.</p>
            <dl className="bank">
              <div><dt>Banco</dt><dd>{PAGO_TRANSFERENCIA.banco}</dd></div>
              <div><dt>Titular</dt><dd>{PAGO_TRANSFERENCIA.titular}</dd></div>
              <div><dt>CLABE</dt><dd>{PAGO_TRANSFERENCIA.clabe} <button className="link-btn" onClick={copiar}><Icon name="copy" size={14} /> {copiado ? 'Copiada' : 'Copiar'}</button></dd></div>
              <div><dt>Monto</dt><dd>{dinero(p.total)}</dd></div>
              <div><dt>Concepto</dt><dd>{p.numero}</dd></div>
            </dl>
            <a className="btn btn--wa btn--block btn--lg" href={whatsappUrl(TIENDA.whatsapp, msgWa)} target="_blank" rel="noopener noreferrer"><Icon name="whatsapp" size={20} /> Enviar comprobante por WhatsApp</a>
            <p className="muted small center">Se abre WhatsApp con tu número de pedido ya escrito.</p>
          </aside>
        )}
      </div>
    </div>
  );
}
