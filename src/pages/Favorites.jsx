import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { productoPorId } from '../data/productos';
import { useTitulo } from '../hooks/useLocalStorage';
import ProductCard from '../components/ProductCard';
import { Breadcrumbs, EmptyState } from '../components/ui';

export function ListaFavoritos() {
  const { favoritos } = useAuth();
  const lista = favoritos.map(productoPorId).filter(Boolean);
  if (!lista.length) return (
    <EmptyState icon="heart" titulo="Aún no guardas favoritos" texto="Toca el corazón de cualquier pieza para guardarla y verla después.">
      <Link to="/catalogo" className="btn btn--primary">Explorar el catálogo</Link>
    </EmptyState>
  );
  return <div className="grid-products">{lista.map(p => <ProductCard key={p.id} producto={p} />)}</div>;
}

export default function Favorites() {
  useTitulo('Favoritos');
  const { usuario } = useAuth();
  return (
    <div className="container page">
      <Breadcrumbs items={[{ label: 'Favoritos' }]} />
      <h1>Mis favoritos</h1>
      {!usuario && <p className="muted">Tus favoritos se guardan en este dispositivo. <Link to="/cuenta/registro">Crea una cuenta</Link> para conservarlos.</p>}
      <ListaFavoritos />
    </div>
  );
}
