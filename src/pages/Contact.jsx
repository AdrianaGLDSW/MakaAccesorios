import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FAQ } from '../data/contenido';
import { ENVIO, REDES, TIENDA } from '../data/config';
import { useLocalStorage, useTitulo } from '../hooks/useLocalStorage';
import { reglas, validar } from '../utils/validacion';
import { dinero, whatsappUrl } from '../utils/format';
import { Alert, Breadcrumbs, Field } from '../components/ui';
import Icon from '../components/Icon';
import '../styles/info.css';

const VACIO = { nombre: '', correo: '', telefono: '', mensaje: '' };

export default function Contact() {
  useTitulo('Contacto y preguntas frecuentes');
  const [, setMensajes] = useLocalStorage('maka-mensajes', []);
  const [form, setForm] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const [enviado, setEnviado] = useState(false);
  const [tema, setTema] = useState(FAQ[0].tema);

  const esquema = { nombre: [reglas.nombre], correo: [reglas.correo], telefono: [(v) => (v ? reglas.telefono(v) : '')], mensaje: [reglas.mensaje] };
  const set = (k) => (e) => {
    const n = { ...form, [k]: e.target.value }; setForm(n);
    if (errores[k]) setErrores(validar(n, esquema));
  };
  const blur = (k) => () => { const e = validar(form, { [k]: esquema[k] }); setErrores(prev => ({ ...prev, [k]: e[k] })); };
  const enviar = (e) => {
    e.preventDefault();
    const err = validar(form, esquema); setErrores(err);
    if (Object.keys(err).length) { document.getElementById(`c-${Object.keys(err)[0]}`)?.focus(); return; }
    setMensajes(prev => [...prev, { ...form, fecha: new Date().toISOString() }]);
    setEnviado(true); setForm(VACIO);
  };
  const grupo = FAQ.find(g => g.tema === tema);

  return (
    <div className="info">
      <div className="container page">
        <Breadcrumbs items={[{ label: 'Contacto y preguntas frecuentes' }]} />
        <h1>Contacto y preguntas frecuentes</h1>
        <p className="lead">Estamos para ayudarte antes, durante y después de tu compra.</p>

        <div className="contact">
          <aside className="contact__channels" aria-label="Canales de atención">
            <a className="channel channel--wa" href={whatsappUrl(TIENDA.whatsapp, 'Hola, tengo una duda sobre MAKA.')} target="_blank" rel="noopener noreferrer">
              <Icon name="whatsapp" size={26} /><div><strong>Escríbenos por WhatsApp</strong><span>Respuesta más rápida</span></div>
            </a>
            <div className="channel"><Icon name="clock" size={24} /><div><strong>Horario de atención</strong><span>{TIENDA.horario}</span></div></div>
            <div className="channel"><Icon name="truck" size={24} /><div><strong>Zonas de entrega</strong><span>Guadalajara y su zona metropolitana; envíos a todo México. Gratis desde {dinero(ENVIO.gratisDesde)}.</span></div></div>
            <div className="channel"><Icon name="instagram" size={24} /><div><strong>Síguenos</strong>
              <span className="channel__social">{REDES.map(r => <a key={r.id} href={r.url} target="_blank" rel="noopener noreferrer">{r.nombre}</a>)}</span></div></div>
          </aside>

          <form className="contact__form card-box" onSubmit={enviar} noValidate aria-labelledby="t-form">
            <h2 id="t-form">Contáctanos</h2>
            {enviado && <Alert tipo="ok" titulo="Recibimos tu mensaje">Te responderemos en nuestro horario de atención.</Alert>}
            <div className="row-2">
              <Field id="c-nombre" label="Nombre" error={errores.nombre}>{(a) => <input {...a} value={form.nombre} onChange={set('nombre')} onBlur={blur('nombre')} autoComplete="name" />}</Field>
              <Field id="c-correo" label="Correo electrónico" error={errores.correo}>{(a) => <input {...a} type="email" value={form.correo} onChange={set('correo')} onBlur={blur('correo')} autoComplete="email" />}</Field>
            </div>
            <Field id="c-telefono" label="Teléfono" opcional error={errores.telefono} hint="10 dígitos">{(a) => <input {...a} type="tel" inputMode="numeric" value={form.telefono} onChange={set('telefono')} onBlur={blur('telefono')} autoComplete="tel" />}</Field>
            <Field id="c-mensaje" label="Mensaje" error={errores.mensaje}>{(a) => <textarea {...a} rows={5} value={form.mensaje} onChange={set('mensaje')} onBlur={blur('mensaje')} placeholder="Cuéntanos en qué te podemos ayudar" />}</Field>
            <p className="muted small">Al enviar aceptas el <Link to="/legal/aviso-de-privacidad">aviso de privacidad</Link>.</p>
            <button className="btn btn--primary">Enviar mensaje</button>
          </form>
        </div>

        <section id="preguntas" className="section faq" aria-labelledby="t-faq">
          <h2 id="t-faq" className="section__title">Preguntas frecuentes</h2>
          <div className="tabs" role="tablist" aria-label="Temas">
            {FAQ.map(g => <button key={g.tema} role="tab" aria-selected={g.tema === tema} className={g.tema === tema ? 'is-active' : ''} onClick={() => setTema(g.tema)}>{g.tema}</button>)}
          </div>
          <div className="accordion" role="tabpanel">
            {grupo.preguntas.map(q => <details key={q.p}><summary>{q.p}</summary><p>{q.r}</p></details>)}
          </div>
          <p className="faq__more">¿Tienes otra duda? <Link to="#" onClick={(e) => { e.preventDefault(); document.querySelector('.chat-fab')?.click(); }}>Pregúntale a nuestro chat</Link> o escríbenos arriba.</p>
        </section>
      </div>
    </div>
  );
}
