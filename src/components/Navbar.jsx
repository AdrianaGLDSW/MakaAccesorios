import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { CATEGORIAS } from '../data/productos';
import { ENVIO } from '../data/config';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { dinero } from '../utils/format';
import { Logo } from './ui';
import Icon from './Icon';
import '../styles/navbar.css';

export default function Navbar() {
  const { piezas } = useCart();
  const { usuario, favoritos } = useAuth();
  const [abierto, setAbierto] = useState(false);
  const [catAbierto, setCatAbierto] = useState(false);
  const dropRef = useRef(null);
  const [params] = useSearchParams();
  const [q, setQ] = useState(params.get('q') || '');
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => { setAbierto(false); setCatAbierto(false); }, [pathname, params]);

  // El submenú de Catálogo se cierra al hacer clic fuera o al pulsar Esc.
  useEffect(() => {
    if (!catAbierto) return;
    const fuera = (e) => { if (!dropRef.current?.contains(e.target)) setCatAbierto(false); };
    const esc = (e) => { if (e.key === 'Escape') setCatAbierto(false); };
    document.addEventListener('mousedown', fuera); document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('mousedown', fuera); document.removeEventListener('keydown', esc); };
  }, [catAbierto]);
  const enCatalogo = pathname.startsWith('/catalogo') || pathname === '/buscar';
  useEffect(() => { document.body.style.overflow = abierto ? 'hidden' : ''; }, [abierto]);

  const buscar = (e) => {
    e.preventDefault();
    if (!q.trim()) return; // CU-03 2a: búsqueda vacía no se ejecuta
    navigate(`/buscar?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <header className="site-header">
      <a href="#contenido" className="skip-link">Saltar al contenido</a>
      <div className="promo">Envío gratis en compras desde {dinero(ENVIO.gratisDesde)} · Recolección sin costo en Guadalajara</div>
      <div className="navbar">
        <button className="navbar__menu" onClick={() => setAbierto(true)} aria-label="Abrir menú" aria-expanded={abierto} aria-controls="menu-principal">
          <Icon name="menu" size={24} />
        </button>
        <Link to="/" className="navbar__logo" aria-label="MAKA Accesorios, ir al inicio"><Logo /></Link>

        <nav id="menu-principal" className={`navbar__nav ${abierto ? 'is-open' : ''}`} aria-label="Menú principal">
          <div className="navbar__nav-head">
            <span>Menú</span>
            <button onClick={() => setAbierto(false)} aria-label="Cerrar menú"><Icon name="close" size={24} /></button>
          </div>
          <NavLink to="/" end>Inicio</NavLink>
          <div className={`navbar__drop ${catAbierto ? 'is-open' : ''}`} ref={dropRef}
            onMouseEnter={() => window.matchMedia('(hover: hover) and (min-width: 1181px)').matches && setCatAbierto(true)}
            onMouseLeave={() => window.matchMedia('(hover: hover) and (min-width: 1181px)').matches && setCatAbierto(false)}>
            <button type="button" className={`navbar__drop-btn ${enCatalogo ? 'active' : ''}`} aria-expanded={catAbierto} aria-controls="submenu-catalogo" onClick={() => setCatAbierto(v => !v)}>
              Catálogo <Icon name="chevronDown" size={15} />
            </button>
            <div id="submenu-catalogo" className="navbar__sub">
              <Link to="/catalogo" className="navbar__sub-all">Ver todo el catálogo</Link>
              <Link to="/catalogo?orden=novedades">Novedades</Link>
              {CATEGORIAS.map(c => <Link key={c.slug} to={`/catalogo/${c.slug}`}>{c.nombre}</Link>)}
            </div>
          </div>
          <NavLink to="/quienes-somos">Nosotros</NavLink>
          <NavLink to="/facturacion">Facturación</NavLink>
          <div className="navbar__nav-extra">
            <NavLink to="/contacto">Contacto y preguntas frecuentes</NavLink>
            <NavLink to={usuario ? '/cuenta' : '/cuenta/iniciar-sesion'}>{usuario ? 'Mi cuenta' : 'Iniciar sesión'}</NavLink>
          </div>
        </nav>
        {abierto && <div className="navbar__overlay" onClick={() => setAbierto(false)} aria-hidden="true" />}

        <form className="navbar__search" role="search" onSubmit={buscar}>
          <label htmlFor="buscador" className="sr-only">Buscar piezas</label>
          <Icon name="search" size={17} />
          <input id="buscador" type="search" placeholder="Buscar piezas..." value={q} onChange={e => setQ(e.target.value)} />
        </form>

        <div className="navbar__actions">
          {usuario
            ? <Link to="/cuenta" className="navbar__account"><span className="navbar__hello">Hola, {usuario.nombre.split(' ')[0]}</span><Icon name="user" size={22} /></Link>
            : <span className="navbar__auth"><Link to="/cuenta/iniciar-sesion">Iniciar sesión</Link> | <Link to="/cuenta/registro">Registrarse</Link></span>}
          {!usuario && <Link to="/cuenta/iniciar-sesion" className="navbar__icon-only" aria-label="Mi cuenta"><Icon name="user" size={22} /></Link>}
          <Link to="/favoritos" className="navbar__icon" aria-label={`Favoritos (${favoritos.length})`}>
            <Icon name="heart" size={22} />
            {favoritos.length > 0 && <span className="badge">{favoritos.length}</span>}
          </Link>
          <Link to="/carrito" className="navbar__icon" aria-label={`Carrito, ${piezas} pieza${piezas === 1 ? '' : 's'}`}>
            <Icon name="cart" size={23} />
            <span className="badge" aria-hidden="true">{piezas}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
