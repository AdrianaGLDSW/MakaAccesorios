import { useEffect, useRef, useState } from 'react';
import { CHAT_TEMAS } from '../data/contenido';
import { TIENDA } from '../data/config';
import { normalizar, whatsappUrl } from '../utils/format';
import Icon from './Icon';
import '../styles/chat.css';

const SALUDO = { de: 'maka', texto: '¡Hola! Soy el asistente de MAKA. Puedo resolver dudas rápidas sobre envíos, pagos, cambios y materiales. Si prefieres hablar con una persona, te paso con nosotras por WhatsApp.' };

export default function ChatWidget() {
  const [abierto, setAbierto] = useState(false);
  const [mensajes, setMensajes] = useState([SALUDO]);
  const [texto, setTexto] = useState('');
  const fin = useRef(null);

  useEffect(() => { fin.current?.scrollIntoView({ block: 'end' }); }, [mensajes, abierto]);
  useEffect(() => {
    const esc = (e) => e.key === 'Escape' && setAbierto(false);
    window.addEventListener('keydown', esc); return () => window.removeEventListener('keydown', esc);
  }, []);

  const responder = (pregunta, tema) => {
    const t = tema || CHAT_TEMAS.find(x => x.claves.some(k => normalizar(pregunta).includes(normalizar(k))));
    const respuesta = t ? { de: 'maka', texto: t.respuesta, sugerirWa: false }
      : { de: 'maka', texto: 'No tengo esa respuesta, pero una persona del equipo puede ayudarte por WhatsApp.', sugerirWa: true, consulta: pregunta };
    setMensajes(m => [...m, { de: 'yo', texto: pregunta }, respuesta]);
  };

  const enviar = (e) => {
    e.preventDefault();
    if (!texto.trim()) return;
    responder(texto.trim()); setTexto('');
  };

  return (
    <>
      <button className={`chat-fab ${abierto ? 'is-open' : ''}`} onClick={() => setAbierto(a => !a)} aria-expanded={abierto} aria-controls="chat-panel"
        aria-label={abierto ? 'Cerrar chat de atención' : 'Abrir chat de atención'}>
        <Icon name={abierto ? 'close' : 'chat'} size={26} />
      </button>
      {abierto && (
        <section id="chat-panel" className="chat" role="dialog" aria-label="Chat de atención de MAKA">
          <header className="chat__head">
            <div><strong>Atención MAKA</strong><span>{TIENDA.horario}</span></div>
            <button onClick={() => setAbierto(false)} aria-label="Cerrar chat"><Icon name="close" size={20} /></button>
          </header>
          <div className="chat__body" aria-live="polite">
            {mensajes.map((m, i) => (
              <div key={i} className={`chat__msg chat__msg--${m.de}`}>
                <p>{m.texto}</p>
                {m.sugerirWa && (
                  <a className="btn btn--wa btn--sm" href={whatsappUrl(TIENDA.whatsapp, `Hola, tengo una duda: ${m.consulta}`)} target="_blank" rel="noopener noreferrer">
                    <Icon name="whatsapp" size={16} /> Continuar por WhatsApp
                  </a>
                )}
              </div>
            ))}
            <div ref={fin} />
          </div>
          <div className="chat__quick" aria-label="Preguntas rápidas">
            {CHAT_TEMAS.map(t => <button key={t.id} onClick={() => responder(t.etiqueta, t)}>{t.etiqueta}</button>)}
          </div>
          <form className="chat__form" onSubmit={enviar}>
            <label htmlFor="chat-input" className="sr-only">Escribe tu pregunta</label>
            <input id="chat-input" value={texto} onChange={e => setTexto(e.target.value)} placeholder="Escribe tu pregunta..." autoComplete="off" />
            <button type="submit" aria-label="Enviar pregunta"><Icon name="send" size={18} /></button>
          </form>
          <a className="chat__human" href={whatsappUrl(TIENDA.whatsapp, 'Hola, quisiera información sobre una pieza.')} target="_blank" rel="noopener noreferrer">
            <Icon name="whatsapp" size={16} /> Hablar con una persona
          </a>
        </section>
      )}
    </>
  );
}
