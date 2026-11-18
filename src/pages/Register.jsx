import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTitulo } from '../hooks/useLocalStorage';
import { reglas, requisitosContrasena, validar } from '../utils/validacion';
import { Alert, Field } from '../components/ui';
import Icon from '../components/Icon';
import '../styles/account.css';

const NOMBRES = { nombre: 'Nombre completo', telefono: 'Teléfono', correo: 'Correo electrónico', contrasena: 'Contraseña', confirmar: 'Confirmar contraseña', aviso: 'Aviso de privacidad', robot: 'Verificación' };

export default function Register() {
  useTitulo('Crear cuenta');
  const { registrar } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [d, setD] = useState({ nombre: '', telefono: '', correo: '', contrasena: '', confirmar: '', aviso: false, robot: false });
  const [errores, setErrores] = useState({});
  const [ver, setVer] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const esquema = {
    nombre: [reglas.nombre], telefono: [reglas.telefono], correo: [reglas.correo], contrasena: [reglas.contrasena],
    confirmar: [reglas.requerido, (v, x) => (v === x.contrasena ? '' : 'Las contraseñas no coinciden.')],
    aviso: [reglas.aceptar], robot: [(v) => (v ? '' : 'Confirma que no eres un robot.')],
  };
  const set = (k) => (e) => {
    const n = { ...d, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }; setD(n);
    if (errores[k]) setErrores(p => ({ ...p, [k]: validar(n, { [k]: esquema[k] })[k] }));
  };
  const blur = (k) => () => setErrores(p => ({ ...p, [k]: validar(d, { [k]: esquema[k] })[k] }));
  const lista = Object.entries(errores).filter(([, v]) => v);

  const enviar = async (e) => {
    e.preventDefault();
    const err = validar(d, esquema); setErrores(err);
    if (Object.keys(err).length) { document.getElementById('resumen-errores')?.focus(); return; }
    setEnviando(true);
    const r = await registrar(d);
    setEnviando(false);
    if (!r.ok) { setErrores({ correo: r.mensaje }); return; }
    navigate(state?.volver || '/cuenta', { replace: true, state: { bienvenida: true } });
  };

  return (
    <div className="container page auth">
      <form className="card-box auth__card auth__card--wide" onSubmit={enviar} noValidate>
        <h1>Crear cuenta</h1>
        <p className="muted">Guarda tus datos, tus favoritos y consulta tus pedidos.</p>

        {lista.length > 0 && (
          <div id="resumen-errores" tabIndex={-1} className="alert alert--error" role="alert">
            <Icon name="warn" size={20} />
            <div><strong>Revisa {lista.length === 1 ? 'el campo marcado' : `los ${lista.length} campos marcados`} para continuar</strong>
              <div className="alert__body">{lista.map(([k], i) => <span key={k}>{i > 0 && ' · '}<a href={`#r-${k}`}>{NOMBRES[k]}</a></span>)}</div></div>
          </div>
        )}
        {errores.correo === 'Este correo ya tiene una cuenta.' && <Alert tipo="info">¿Ya tienes cuenta? <Link to="/cuenta/iniciar-sesion">Inicia sesión</Link> o <Link to="/cuenta/recuperar">recupera tu contraseña</Link>.</Alert>}

        <div className="row-2">
          <Field id="r-nombre" label="Nombre completo" error={errores.nombre}>{(a) => <input {...a} value={d.nombre} onChange={set('nombre')} onBlur={blur('nombre')} autoComplete="name" />}</Field>
          <Field id="r-telefono" label="Teléfono" error={errores.telefono} hint="10 dígitos">{(a) => <input {...a} type="tel" inputMode="numeric" value={d.telefono} onChange={set('telefono')} onBlur={blur('telefono')} autoComplete="tel" />}</Field>
        </div>
        <Field id="r-correo" label="Correo electrónico" error={errores.correo}>{(a) => <input {...a} type="email" value={d.correo} onChange={set('correo')} onBlur={blur('correo')} autoComplete="email" />}</Field>
        <div className="row-2">
          <div>
            <Field id="r-contrasena" label="Contraseña" error={errores.contrasena}>{(a) => (
              <div className="pass"><input {...a} type={ver ? 'text' : 'password'} value={d.contrasena} onChange={set('contrasena')} onBlur={blur('contrasena')} autoComplete="new-password" />
                <button type="button" onClick={() => setVer(v => !v)} aria-label={ver ? 'Ocultar contraseña' : 'Mostrar contraseña'}><Icon name={ver ? 'eyeOff' : 'eye'} size={18} /></button></div>
            )}</Field>
            <ul className="reqs" aria-label="Requisitos de la contraseña">
              {requisitosContrasena(d.contrasena).map(r => <li key={r.texto} className={r.ok ? 'is-ok' : ''}><Icon name={r.ok ? 'check' : 'close'} size={14} /> {r.texto}</li>)}
            </ul>
          </div>
          <Field id="r-confirmar" label="Confirmar contraseña" error={errores.confirmar}>{(a) => <input {...a} type={ver ? 'text' : 'password'} value={d.confirmar} onChange={set('confirmar')} onBlur={blur('confirmar')} autoComplete="new-password" />}</Field>
        </div>

        <label className={`check check--box ${errores.aviso ? 'has-error' : ''}`}>
          <input id="r-aviso" type="checkbox" checked={d.aviso} onChange={set('aviso')} aria-invalid={!!errores.aviso} />
          <span>Acepto el <Link to="/legal/aviso-de-privacidad" target="_blank">aviso de privacidad</Link> y los <Link to="/legal/terminos" target="_blank">términos y condiciones</Link>.</span>
        </label>
        {errores.aviso && <p className="field__error"><Icon name="warn" size={14} /> {errores.aviso}</p>}
        <label className={`check check--box captcha ${errores.robot ? 'has-error' : ''}`}>
          <input id="r-robot" type="checkbox" checked={d.robot} onChange={set('robot')} aria-invalid={!!errores.robot} />
          <span>No soy un robot <span className="muted small">(verificación simulada)</span></span>
        </label>
        {errores.robot && <p className="field__error"><Icon name="warn" size={14} /> {errores.robot}</p>}

        <button className="btn btn--primary btn--block btn--lg" disabled={enviando}>{enviando ? 'Creando cuenta…' : 'Crear cuenta'}</button>
        <p className="center small">¿Ya tienes cuenta? <Link to="/cuenta/iniciar-sesion" state={state}>Inicia sesión</Link></p>
      </form>
    </div>
  );
}
