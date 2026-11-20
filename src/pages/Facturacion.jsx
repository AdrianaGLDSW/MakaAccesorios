import { useState } from 'react';
import { Link } from 'react-router-dom';
import { TIENDA } from '../data/config';
import { usePedidos } from '../context/PedidosContext';
import { useAuth } from '../context/AuthContext';
import { useLocalStorage, useTitulo } from '../hooks/useLocalStorage';
import { reglas, validar } from '../utils/validacion';
import { dinero, whatsappUrl } from '../utils/format';
import { Alert, Breadcrumbs, Field } from '../components/ui';
import Icon from '../components/Icon';
import '../styles/info.css';

// Catálogos del SAT más comunes para personas que compran accesorios.
const REGIMENES = [
  ['605', 'Sueldos y salarios e ingresos asimilados a salarios'],
  ['612', 'Personas físicas con actividades empresariales y profesionales'],
  ['626', 'Régimen Simplificado de Confianza'],
  ['621', 'Incorporación fiscal'],
  ['601', 'General de ley personas morales'],
  ['616', 'Sin obligaciones fiscales'],
];
const USOS = [
  ['G03', 'Gastos en general'],
  ['G01', 'Adquisición de mercancías'],
  ['S01', 'Sin efectos fiscales'],
];

const RFC = /^([A-ZÑ&]{3,4})(\d{2})(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])([A-Z\d]{3})$/;
const VACIO = { pedido: '', correo: '', rfc: '', razon: '', cp: '', regimen: '', uso: 'G03' };

// 6.3 Facturación: solicitud de factura electrónica (CFDI 4.0) de un pedido.
export default function Facturacion() {
  useTitulo('Facturación');
  const { pedidoPorNumero, pedidos } = usePedidos();
  const { usuario } = useAuth();
  const [, setSolicitudes] = useLocalStorage('maka-facturas', []);
  const [form, setForm] = useState({ ...VACIO, correo: usuario?.correo || '' });
  const [errores, setErrores] = useState({});
  const [enviada, setEnviada] = useState(null);

  const misPedidos = usuario ? pedidos.filter(p => p.usuarioId === usuario.id) : [];

  const esquema = {
    pedido: [reglas.requerido, (v) => (/^MAKA-\d{4}$/i.test(v.trim()) ? '' : 'El número de pedido tiene el formato MAKA-0000.'),
      (v) => (pedidoPorNumero(v.trim().toUpperCase()) ? '' : 'No encontramos ese pedido. Revisa el número en tu correo de confirmación.')],
    correo: [reglas.correo],
    rfc: [reglas.requerido, (v) => (RFC.test(v.trim().toUpperCase()) ? '' : 'El RFC debe tener 12 caracteres (empresa) o 13 (persona física), por ejemplo GOMA850101AB1.')],
    razon: [(v) => (String(v).trim().length >= 3 ? '' : 'Escribe el nombre o razón social tal como aparece en tu constancia fiscal.')],
    cp: [reglas.cp],
    regimen: [(v) => (v ? '' : 'Elige tu régimen fiscal.')],
    uso: [reglas.requerido],
  };
  const set = (k) => (e) => {
    const n = { ...form, [k]: e.target.value }; setForm(n);
    if (errores[k]) setErrores(validar(n, esquema));
  };
  const blur = (k) => () => { const e = validar(form, { [k]: esquema[k] }); setErrores(prev => ({ ...prev, [k]: e[k] })); };

  const enviar = (e) => {
    e.preventDefault();
    const err = validar(form, esquema); setErrores(err);
    if (Object.keys(err).length) { document.getElementById(`f-${Object.keys(err)[0]}`)?.focus(); return; }
    const pedido = pedidoPorNumero(form.pedido.trim().toUpperCase());
    const solicitud = { ...form, pedido: pedido.numero, rfc: form.rfc.trim().toUpperCase(), total: pedido.total, fecha: new Date().toISOString() };
    setSolicitudes(prev => [...prev, solicitud]);
    setEnviada(solicitud); setForm({ ...VACIO, correo: form.correo }); setErrores({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="info">
      <div className="container page">
        <Breadcrumbs items={[{ label: 'Facturación' }]} />
        <h1>Facturación</h1>
        <p className="lead">Solicita la factura electrónica (CFDI 4.0) de tu compra. Te la enviamos en PDF y XML a tu correo.</p>

        <div className="contact">
          <aside className="contact__channels" aria-label="Información de facturación">
            <div className="channel"><Icon name="clock" size={24} /><div><strong>Plazo para solicitarla</strong><span>Dentro del mismo mes en que hiciste tu compra.</span></div></div>
            <div className="channel"><Icon name="send" size={24} /><div><strong>Entrega de la factura</strong><span>En un máximo de 72 horas hábiles, al correo que indiques.</span></div></div>
            <div className="channel"><Icon name="shield" size={24} /><div><strong>Qué necesitas</strong>
              <span>Número de pedido y los datos de tu Constancia de Situación Fiscal: RFC, nombre o razón social, código postal y régimen fiscal.</span></div></div>
            <a className="channel channel--wa" href={whatsappUrl(TIENDA.whatsapp, 'Hola, tengo una duda sobre mi factura.')} target="_blank" rel="noopener noreferrer">
              <Icon name="whatsapp" size={26} /><div><strong>¿Dudas con tu factura?</strong><span>Escríbenos por WhatsApp</span></div>
            </a>
          </aside>

          <form className="contact__form card-box" onSubmit={enviar} noValidate aria-labelledby="t-fact">
            <h2 id="t-fact">Solicitar factura</h2>
            {enviada && (
              <Alert tipo="ok" titulo="Recibimos tu solicitud">
                Factura del pedido {enviada.pedido} por {dinero(enviada.total)} a nombre de {enviada.razon.trim()} (RFC {enviada.rfc}). La enviaremos a {enviada.correo.trim()} en un máximo de 72 horas hábiles.
              </Alert>
            )}

            <h3 className="form-sub">Datos de la compra</h3>
            <div className="row-2">
              <Field id="f-pedido" label="Número de pedido" error={errores.pedido} hint={misPedidos.length ? `Tus pedidos: ${misPedidos.slice(0, 3).map(p => p.numero).join(', ')}` : 'Viene en tu confirmación de compra, por ejemplo MAKA-0101.'}>
                {(a) => <input {...a} value={form.pedido} onChange={set('pedido')} onBlur={blur('pedido')} placeholder="MAKA-0000" autoCapitalize="characters" />}
              </Field>
              <Field id="f-correo" label="Correo para recibir la factura" error={errores.correo}>
                {(a) => <input {...a} type="email" value={form.correo} onChange={set('correo')} onBlur={blur('correo')} autoComplete="email" />}
              </Field>
            </div>

            <h3 className="form-sub">Datos fiscales</h3>
            <div className="row-2">
              <Field id="f-rfc" label="RFC" error={errores.rfc} hint="12 caracteres (empresa) o 13 (persona física)">
                {(a) => <input {...a} value={form.rfc} onChange={set('rfc')} onBlur={blur('rfc')} maxLength={13} style={{ textTransform: 'uppercase' }} />}
              </Field>
              <Field id="f-cp" label="Código postal fiscal" error={errores.cp}>
                {(a) => <input {...a} inputMode="numeric" maxLength={5} value={form.cp} onChange={set('cp')} onBlur={blur('cp')} />}
              </Field>
            </div>
            <Field id="f-razon" label="Nombre o razón social" error={errores.razon} hint="Tal como aparece en tu constancia fiscal, sin «S.A. de C.V.»">
              {(a) => <input {...a} value={form.razon} onChange={set('razon')} onBlur={blur('razon')} />}
            </Field>
            <div className="row-2">
              <Field id="f-regimen" label="Régimen fiscal" error={errores.regimen}>
                {(a) => <select {...a} value={form.regimen} onChange={set('regimen')} onBlur={blur('regimen')}>
                  <option value="">Elige una opción</option>
                  {REGIMENES.map(([c, t]) => <option key={c} value={c}>{c} · {t}</option>)}
                </select>}
              </Field>
              <Field id="f-uso" label="Uso del CFDI" error={errores.uso}>
                {(a) => <select {...a} value={form.uso} onChange={set('uso')}>
                  {USOS.map(([c, t]) => <option key={c} value={c}>{c} · {t}</option>)}
                </select>}
              </Field>
            </div>
            <p className="muted small">Al enviar aceptas el <Link to="/legal/aviso-de-privacidad">aviso de privacidad</Link>. Tus datos fiscales solo se usan para emitir tu factura.</p>
            <button className="btn btn--primary">Solicitar factura</button>
          </form>
        </div>
      </div>
    </div>
  );
}
