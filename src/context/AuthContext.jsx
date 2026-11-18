import { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { hashContrasena } from '../utils/validacion';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuarios, setUsuarios] = useLocalStorage('maka-usuarios', []);
  const [sesionId, setSesionId] = useLocalStorage('maka-sesion', null);
  const [favInvitada, setFavInvitada] = useLocalStorage('maka-favoritos', []);
  const [tokens, setTokens] = useLocalStorage('maka-tokens', {});

  const usuario = usuarios.find(u => u.id === sesionId) || null;
  const actualizar = (cambios) => setUsuarios(prev => prev.map(u => u.id === sesionId ? { ...u, ...cambios } : u));

  const registrar = async ({ nombre, correo, telefono, contrasena }) => {
    const c = correo.trim().toLowerCase();
    if (usuarios.some(u => u.correo === c)) return { ok: false, campo: 'correo', mensaje: 'Este correo ya tiene una cuenta.' };
    const nuevo = { id: Date.now(), nombre: nombre.trim(), correo: c, telefono, hash: await hashContrasena(contrasena), direccion: null, favoritos: favInvitada };
    setUsuarios(prev => [...prev, nuevo]);
    setSesionId(nuevo.id);
    return { ok: true, usuario: nuevo };
  };

  const iniciarSesion = async (correo, contrasena) => {
    const u = usuarios.find(x => x.correo === correo.trim().toLowerCase());
    if (!u || u.hash !== await hashContrasena(contrasena)) return { ok: false, mensaje: 'Correo o contraseña incorrectos.' };
    setSesionId(u.id);
    return { ok: true, usuario: u };
  };

  const cerrarSesion = () => setSesionId(null);

  const solicitarRecuperacion = (correo) => {
    const u = usuarios.find(x => x.correo === correo.trim().toLowerCase());
    if (!u) return null;
    const token = Math.random().toString(36).slice(2, 10);
    setTokens(prev => ({ ...prev, [token]: { id: u.id, vence: Date.now() + 30 * 60 * 1000 } }));
    return token;
  };
  const tokenValido = (t) => tokens[t] && tokens[t].vence > Date.now();
  const restablecer = async (token, contrasena) => {
    if (!tokenValido(token)) return false;
    const hash = await hashContrasena(contrasena);
    setUsuarios(prev => prev.map(u => u.id === tokens[token].id ? { ...u, hash } : u));
    setTokens(prev => { const n = { ...prev }; delete n[token]; return n; });
    return true;
  };

  const favoritos = usuario ? usuario.favoritos || [] : favInvitada;
  const alternarFavorito = (id) => {
    const lista = favoritos.includes(id) ? favoritos.filter(f => f !== id) : [...favoritos, id];
    usuario ? actualizar({ favoritos: lista }) : setFavInvitada(lista);
    return lista.includes(id);
  };

  const value = { usuario, registrar, iniciarSesion, cerrarSesion, actualizarPerfil: actualizar, solicitarRecuperacion, tokenValido, restablecer, favoritos, alternarFavorito };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
