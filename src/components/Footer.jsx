import { Link } from 'react-router-dom';
import { REDES, TIENDA } from '../data/config';
import { Logo } from './ui';
import Icon from './Icon';
import '../styles/footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__grid container">
        <div className="footer__brand">
          <Logo />
          <p>{TIENDA.lema}.</p>
          <div className="footer__social" aria-label="Redes sociales">
            {REDES.map(r => (
              <a key={r.id} href={r.url} target="_blank" rel="noopener noreferrer" aria-label={`${r.nombre} de MAKA (se abre en otra pestaña)`}>
                <Icon name={r.id} size={20} />
              </a>
            ))}
          </div>
        </div>
        <nav aria-label="MAKA">
          <h2>MAKA</h2>
          <ul>
            <li><Link to="/quienes-somos">Quiénes somos</Link></li>
            <li><Link to="/quienes-somos#ubicacion">Ubicación y puntos de entrega</Link></li>
            <li><Link to="/contacto">Contacto</Link></li>
            <li><Link to="/contacto#preguntas">Preguntas frecuentes</Link></li>
          </ul>
        </nav>
        <nav aria-label="Tienda">
          <h2>Tienda</h2>
          <ul>
            <li><Link to="/catalogo?orden=novedades">Novedades</Link></li>
            <li><Link to="/catalogo">Catálogo de productos</Link></li>
            <li><Link to="/carrito">Carrito de compras</Link></li>
            <li><Link to="/favoritos">Favoritos</Link></li>
          </ul>
        </nav>
        <nav aria-label="Mi cuenta">
          <h2>Mi cuenta</h2>
          <ul>
            <li><Link to="/cuenta/iniciar-sesion">Iniciar sesión</Link></li>
            <li><Link to="/cuenta/registro">Registro</Link></li>
            <li><Link to="/cuenta?tab=pedidos">Historial de pedidos</Link></li>
          </ul>
        </nav>
        <nav aria-label="Legal">
          <h2>Legal</h2>
          <ul>
            <li><Link to="/legal/aviso-de-privacidad">Aviso de privacidad</Link></li>
            <li><Link to="/legal/terminos">Términos y condiciones</Link></li>
            <li><Link to="/legal/envios-y-devoluciones">Envíos y devoluciones</Link></li>
          </ul>
        </nav>
        <div>
          <h2>Pagos</h2>
          <ul className="footer__pay">
            <li>Transferencia bancaria</li>
            <li>Efectivo al recoger</li>
          </ul>
        </div>
      </div>
      <div className="footer__bottom container">
        <span>© {new Date().getFullYear()} MAKA Accesorios · {TIENDA.ciudad}</span>
        <span>Atención por WhatsApp: {TIENDA.horario.toLowerCase()}</span>
      </div>
    </footer>
  );
}
