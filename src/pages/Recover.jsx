import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTitulo } from '../hooks/useLocalStorage';
import { reglas, requisitosContrasena, validar } from '../utils/validacion';
import { Alert, Field } from '../components/ui';
import Icon from '../components/Icon';
import '../styles/account.css';

export default function Recover() {
  useTitulo('Recuperar contraseña');
  const { solicitarRecuperacion, tokenValido, restablecer } = useAuth();
  const [params] = useSearchParams();
  const token = params.get('token');
  const navigate = useNavigate();
  const [correo, setCorreo] = useState('');
  const [err, setErr] = useState({});
  const [enviado, setEnviado] = useState(null); // { token }
  const [d, setD] = useState({ contrasena: '', confirmar: '' });

  if (token) {
    if (!tokenValido(token)) return (
      <div className="container page auth"><div className="card-box auth__card">
        <h1>Este enlace ya no es válido</h1>
        <p className="muted">El enlace venció o ya se usó.</p>
        <Link className="btn btn--primary btn--block" to="/cuenta/recuperar">Solicitar uno nuevo</Link>
      </div></div>
    );
    const guardar = async (e) => {
      e.preventDefault();
      const er = validar(d, { contrasena: [reglas.contrasena], confirmar: [(v, x) => (v === x.contrasena ? '' : 'Las contraseñas no coinciden.')] }); setErr(er);
      if (Object.keys(er).length) return;
      await restablecer(token, d.contrasena);
      navigate('/cuenta/iniciar-sesion', { replace: true, state: { mensaje: 'Tu contraseña se actualizó. Ya puedes iniciar sesión.' } });
    };
    return (
      <div className="container page auth">
        <form className="card-box auth__card" onSubmit={guardar} noValidate>
          <h1>Crea tu contraseña nueva</h1>
          <Field label="Contraseña nueva" error={err.contrasena}>{(a) => <input {...a} type="password" value={d.contrasena} onChange={e => setD({ ...d, contrasena: e.target.value })} autoComplete="new-password" />}</Field>
          <ul className="reqs">{requisitosContrasena(d.contrasena).map(r => <li key={r.texto} className={r.ok ? 'is-ok' : ''}><Icon name={r.ok ? 'check' : 'close'} size={14} /> {r.texto}</li>)}</ul>
          <Field label="Confirmar contraseña" error={err.confirmar}>{(a) => <input {...a} type="password" value={d.confirmar} onChange={e => setD({ ...d, confirmar: e.target.value })} autoComplete="new-password" />}</Field>
          <button className="btn btn--primary btn--block btn--lg">Guardar contraseña</button>
        </form>
      </div>
    );
  }

  const enviar = (e) => {
    e.preventDefault();
    const er = validar({ correo }, { correo: [reglas.correo] }); setErr(er);
    if (Object.keys(er).length) return;
    setEnviado({ token: solicitarRecuperacion(correo) });
  };

  return (
    <div className="container page auth">
      <form className="card-box auth__card" onSubmit={enviar} noValidate>
        <h1>Recuperar contraseña</h1>
        {enviado ? (
          <>
            {/* Mismo mensaje exista o no la cuenta, para no revelar qué correos están registrados. */}
            <Alert tipo="ok" titulo="Si el correo está registrado, te enviamos un enlace">El enlace funciona una sola vez y vence en 30 minutos.</Alert>
            {enviado.token && <p className="demo-note"><Icon name="info" size={15} /> Prototipo: como no se envían correos reales, <Link to={`/cuenta/recuperar?token=${enviado.token}`}>abre aquí el enlace de prueba</Link>.</p>}
            <Link to="/cuenta/iniciar-sesion" className="btn btn--outline btn--block">Volver a iniciar sesión</Link>
          </>
        ) : (
          <>
            <p className="muted">Escribe el correo de tu cuenta y te enviaremos un enlace para crear una contraseña nueva.</p>
            <Field label="Correo electrónico" error={err.correo}>{(a) => <input {...a} type="email" value={correo} onChange={e => setCorreo(e.target.value)} autoComplete="email" />}</Field>
            <button className="btn btn--primary btn--block btn--lg">Enviar enlace</button>
            <p className="center small"><Link to="/cuenta/iniciar-sesion">Volver a iniciar sesión</Link></p>
          </>
        )}
      </form>
    </div>
  );
}
