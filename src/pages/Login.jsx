import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTitulo } from '../hooks/useLocalStorage';
import { reglas, validar } from '../utils/validacion';
import { Alert, Field } from '../components/ui';
import Icon from '../components/Icon';
import '../styles/account.css';

export default function Login() {
  useTitulo('Iniciar sesión');
  const { iniciarSesion, usuario } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [d, setD] = useState({ correo: '', contrasena: '' });
  const [errores, setErrores] = useState({});
  const [fallo, setFallo] = useState('');
  const [ver, setVer] = useState(false);
  if (usuario) return <Navigate to={state?.volver || '/cuenta'} replace />;

  const enviar = async (e) => {
    e.preventDefault();
    const err = validar(d, { correo: [reglas.correo], contrasena: [reglas.requerido] }); setErrores(err); setFallo('');
    if (Object.keys(err).length) return;
    const r = await iniciarSesion(d.correo, d.contrasena);
    if (!r.ok) { setFallo(r.mensaje); return; }
    navigate(state?.volver || '/cuenta', { replace: true });
  };

  return (
    <div className="container page auth">
      <form className="card-box auth__card" onSubmit={enviar} noValidate>
        <h1>¡Qué gusto verte de nuevo!</h1>
        <p className="muted">Inicia sesión para comprar más rápido.</p>
        {state?.mensaje && <Alert tipo="ok">{state.mensaje}</Alert>}
        {fallo && <Alert tipo="error" titulo={fallo}>Revisa tus datos e inténtalo de nuevo.</Alert>}
        <Field label="Correo electrónico" error={errores.correo}>{(a) => <input {...a} type="email" value={d.correo} onChange={e => setD({ ...d, correo: e.target.value })} autoComplete="email" />}</Field>
        <Field label="Contraseña" error={errores.contrasena}>{(a) => (
          <div className="pass"><input {...a} type={ver ? 'text' : 'password'} value={d.contrasena} onChange={e => setD({ ...d, contrasena: e.target.value })} autoComplete="current-password" />
            <button type="button" onClick={() => setVer(v => !v)} aria-label={ver ? 'Ocultar contraseña' : 'Mostrar contraseña'}><Icon name={ver ? 'eyeOff' : 'eye'} size={18} /></button></div>
        )}</Field>
        <p className="right small"><Link to="/cuenta/recuperar">¿Olvidaste tu contraseña?</Link></p>
        <button className="btn btn--primary btn--block btn--lg">Iniciar sesión</button>
        <p className="center small">¿No tienes cuenta? <Link to="/cuenta/registro" state={state}>Crear cuenta</Link></p>
        <div className="auth__guest"><Icon name="info" size={16} /> También puedes comprar como invitada desde el carrito.</div>
      </form>
    </div>
  );
}
