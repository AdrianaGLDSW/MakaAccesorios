import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Icon from './Icon';

export default function Toast() {
  const { aviso, cerrarAviso } = useCart();
  useEffect(() => { if (!aviso) return; const t = setTimeout(cerrarAviso, 3500); return () => clearTimeout(t); }, [aviso, cerrarAviso]);
  if (!aviso) return <div className="toast-region" aria-live="polite" />;
  return (
    <div className="toast-region" aria-live="polite">
      <div className={`toast toast--${aviso.tipo}`}>
        <Icon name={aviso.tipo === 'ok' ? 'check' : 'warn'} size={20} />
        <span>{aviso.texto}</span>
        {aviso.tipo === 'ok' && <Link to="/carrito" onClick={cerrarAviso}>Ver carrito</Link>}
        <button onClick={cerrarAviso} aria-label="Cerrar aviso"><Icon name="close" size={16} /></button>
      </div>
    </div>
  );
}
