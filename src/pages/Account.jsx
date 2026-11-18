import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePedidos, estadoPedido } from '../context/PedidosContext';
import { useCart } from '../context/CartContext';
import { productoPorId } from '../data/productos';
import { useTitulo } from '../hooks/useLocalStorage';
import { reglas, validar } from '../utils/validacion';
import { dinero, fecha } from '../utils/format';
import { ListaFavoritos } from './Favorites';
import { Alert, Breadcrumbs, EmptyState, Field } from '../components/ui';
import Icon from '../components/Icon';
import '../styles/account.css';

const TABS = [{ id: 'datos', label: 'Mis datos' }, { id: 'direccion', label: 'Dirección de envío' }, { id: 'favoritos', label: 'Favoritos' }, { id: 'pedidos', label: 'Historial de pedidos' }];

export default function Account() {
  useTitulo('Mi cuenta');
  const { usuario, cerrarSesion } = useAuth();
  const [params, setParams] = useSearchParams();
  const { state, pathname, search } = useLocation();
  const navigate = useNavigate();
  if (!usuario) return <Navigate to="/cuenta/iniciar-sesion" replace state={{ volver: pathname + search }} />;
  const tab = params.get('tab') || 'datos';

  return (
    <div className="container page">
      <Breadcrumbs items={[{ label: 'Mi cuenta' }]} />
      {state?.bienvenida && <Alert tipo="ok" titulo={`Bienvenida a MAKA, ${usuario.nombre.split(' ')[0]}`}>Tu cuenta se creó correctamente.</Alert>}
      <div className="account">
        <nav className="account__menu" aria-label="Secciones de mi cuenta">
          <p className="account__hello">Hola, <strong>{usuario.nombre.split(' ')[0]}</strong></p>
          {TABS.map(t => <button key={t.id} className={tab === t.id ? 'is-active' : ''} aria-current={tab === t.id ? 'page' : undefined} onClick={() => setParams({ tab: t.id })}>{t.label}</button>)}
          <button onClick={() => { cerrarSesion(); navigate('/'); }}><Icon name="logout" size={16} /> Cerrar sesión</button>
        </nav>
        <section className="account__panel">
          {tab === 'datos' && <MisDatos />}
          {tab === 'direccion' && <Direccion />}
          {tab === 'favoritos' && <><h1>Favoritos</h1><ListaFavoritos /></>}
          {tab === 'pedidos' && <Pedidos />}
        </section>
      </div>
    </div>
  );
}

function MisDatos() {
  const { usuario, actualizarPerfil } = useAuth();
  const [d, setD] = useState({ nombre: usuario.nombre, telefono: usuario.telefono || '' });
  const [e, setE] = useState({}); const [ok, setOk] = useState(false);
  const guardar = (ev) => { ev.preventDefault(); const er = validar(d, { nombre: [reglas.nombre], telefono: [reglas.telefono] }); setE(er); setOk(false); if (!Object.keys(er).length) { actualizarPerfil(d); setOk(true); } };
  return (
    <form onSubmit={guardar} noValidate className="card-box">
      <h1>Mis datos</h1>
      {ok && <Alert tipo="ok">Tus datos se actualizaron.</Alert>}
      <Field label="Nombre completo" error={e.nombre}>{(a) => <input {...a} value={d.nombre} onChange={x => setD({ ...d, nombre: x.target.value })} />}</Field>
      <div className="row-2">
        <Field label="Correo electrónico" hint="Para cambiar tu correo escríbenos.">{(a) => <input {...a} value={usuario.correo} readOnly />}</Field>
        <Field label="Teléfono" error={e.telefono}>{(a) => <input {...a} type="tel" value={d.telefono} onChange={x => setD({ ...d, telefono: x.target.value })} />}</Field>
      </div>
      <div className="form-actions"><button className="btn btn--primary">Guardar cambios</button><button type="button" className="btn btn--ghost" onClick={() => setD({ nombre: usuario.nombre, telefono: usuario.telefono || '' })}>Cancelar</button></div>
    </form>
  );
}

function Direccion() {
  const { usuario, actualizarPerfil } = useAuth();
  const vacia = { calle: '', colonia: '', cp: '', ciudad: 'Guadalajara', estado: 'Jalisco', referencias: '' };
  const [d, setD] = useState(usuario.direccion || vacia);
  const [e, setE] = useState({}); const [ok, setOk] = useState(false);
  const set = (k) => (x) => setD({ ...d, [k]: x.target.value });
  const guardar = (ev) => { ev.preventDefault(); const er = validar(d, { calle: [reglas.requerido], colonia: [reglas.requerido], cp: [reglas.cp], ciudad: [reglas.requerido] }); setE(er); setOk(false); if (!Object.keys(er).length) { actualizarPerfil({ direccion: d }); setOk(true); } };
  return (
    <form onSubmit={guardar} noValidate className="card-box">
      <h1>Dirección de envío</h1>
      <p className="muted">Se precarga en el checkout para que compres más rápido.</p>
      {ok && <Alert tipo="ok">Tu dirección se guardó.</Alert>}
      <Field label="Calle y número" error={e.calle}>{(a) => <input {...a} value={d.calle} onChange={set('calle')} />}</Field>
      <div className="row-2">
        <Field label="Colonia" error={e.colonia}>{(a) => <input {...a} value={d.colonia} onChange={set('colonia')} />}</Field>
        <Field label="Código postal" error={e.cp}>{(a) => <input {...a} inputMode="numeric" maxLength={5} value={d.cp} onChange={set('cp')} />}</Field>
      </div>
      <div className="row-2">
        <Field label="Ciudad o municipio" error={e.ciudad}>{(a) => <input {...a} value={d.ciudad} onChange={set('ciudad')} />}</Field>
        <Field label="Estado">{(a) => <input {...a} value={d.estado} onChange={set('estado')} />}</Field>
      </div>
      <Field label="Referencias" opcional>{(a) => <input {...a} value={d.referencias} onChange={set('referencias')} />}</Field>
      <button className="btn btn--primary">Guardar dirección</button>
    </form>
  );
}

function Pedidos() {
  const { usuario } = useAuth();
  const { pedidos, existencias, ahora } = usePedidos();
  const { agregar } = useCart();
  const [abierto, setAbierto] = useState(null);
  const mios = pedidos.filter(p => p.usuarioId === usuario.id || p.cliente.correo === usuario.correo);

  if (!mios.length) return (
    <><h1>Historial de pedidos</h1><EmptyState icon="cart" titulo="Aún no tienes pedidos" texto="Cuando compres, aquí verás el estado de cada pedido."><Link to="/catalogo" className="btn btn--primary">Ir al catálogo</Link></EmptyState></>
  );
  const volverAPedir = (p) => p.lineas.forEach(l => { const prod = productoPorId(l.id); if (prod && existencias(l.id) > 0) agregar(prod, { cantidad: l.cantidad, acabado: l.acabado, talla: l.talla }); });

  return (
    <>
      <h1>Historial de pedidos</h1>
      <div className="orders">
        <div className="orders__row orders__row--head" aria-hidden="true"><span>Pedido</span><span>Fecha</span><span>Piezas</span><span>Total</span><span>Estado</span><span /></div>
        {mios.map(p => {
          const est = estadoPedido(p, ahora);
          const pendiente = p.pago === 'transferencia' && !p.pagado && est !== 'Cancelado';
          return (
            <div key={p.numero} className="orders__item">
              <div className="orders__row">
                <strong data-label="Pedido">{p.numero}</strong>
                <span data-label="Fecha">{fecha(p.creado)}</span>
                <span data-label="Piezas">{p.lineas.reduce((s, l) => s + l.cantidad, 0)}</span>
                <span data-label="Total">{dinero(p.total)}</span>
                <span data-label="Estado"><span className={`pill pill--${est === 'Cancelado' ? 'dark' : pendiente ? 'warn' : 'ok'}`}>{pendiente ? 'Pendiente de pago' : est}</span></span>
                <button className="link-btn" onClick={() => setAbierto(abierto === p.numero ? null : p.numero)} aria-expanded={abierto === p.numero}>{abierto === p.numero ? 'Ocultar' : 'Ver detalle'}</button>
              </div>
              {abierto === p.numero && (
                <div className="orders__detail">
                  {est === 'Cancelado' && <Alert tipo="error" titulo="El tiempo de apartado terminó">No recibimos el comprobante antes del {fecha(p.vence, true)}. El pedido se canceló y no se realizó ningún cargo.</Alert>}
                  <ul>{p.lineas.map((l, i) => <li key={i}><span>{l.cantidad} × {l.nombre}</span><span className={existencias(l.id) ? 'ok-text' : 'muted'}>{est === 'Cancelado' ? (existencias(l.id) ? '✓ Disponible' : '✗ Agotado') : dinero(l.precio * l.cantidad)}</span></li>)}</ul>
                  <p className="muted small">{p.entrega.tipo === 'domicilio' ? `Envío a: ${p.entrega.direccion}` : `Recoger en: ${p.entrega.punto?.nombre}`} · Pago: {p.pago === 'transferencia' ? 'transferencia' : 'efectivo al recoger'}</p>
                  <div className="form-actions">
                    {pendiente && <Link to={`/checkout/confirmacion/${p.numero}`} className="btn btn--primary btn--sm">Ver instrucciones de pago</Link>}
                    {est === 'Cancelado' && <button className="btn btn--primary btn--sm" onClick={() => volverAPedir(p)}><Icon name="cart" size={15} /> Volver a pedir las piezas disponibles</button>}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
