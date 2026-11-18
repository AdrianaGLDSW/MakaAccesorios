import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { PRODUCTOS_VISIBLES } from '../data/productos';
import { useTitulo } from '../hooks/useLocalStorage';
import ProductCard from '../components/ProductCard';
import Icon from '../components/Icon';
import '../styles/notFound.css';

export default function NotFound() {
  useTitulo('Página no encontrada');
  const [q, setQ] = useState('');
  const navigate = useNavigate();
  const sugeridos = PRODUCTOS_VISIBLES.filter(p => p.masVendido).slice(0, 4);
  return (
    <div className="container page">
      <section className="nf">
        <p className="nf__code" aria-hidden="true">404</p>
        <h1>No encontramos esta página</h1>
        <p className="muted">Es posible que la pieza ya no esté en el catálogo o que el enlace haya cambiado.</p>
        <div className="nf__actions">
          <Link to="/" className="btn btn--primary">Ir al inicio</Link>
          <Link to="/catalogo" className="btn btn--outline">Ver catálogo</Link>
        </div>
        <form className="nf__search" role="search" onSubmit={(e) => { e.preventDefault(); if (q.trim()) navigate(`/buscar?q=${encodeURIComponent(q.trim())}`); }}>
          <label htmlFor="nf-q" className="sr-only">Buscar piezas</label>
          <Icon name="search" size={18} />
          <input id="nf-q" type="search" value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar piezas..." />
          <button className="btn btn--outline btn--sm">Buscar</button>
        </form>
      </section>
      <section className="section">
        <h2 className="section__title">Quizá te interese</h2>
        <div className="grid-products">{sugeridos.map(p => <ProductCard key={p.id} producto={p} />)}</div>
      </section>
    </div>
  );
}
