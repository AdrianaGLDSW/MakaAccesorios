import { Link, useNavigate } from 'react-router-dom';
import { memo } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { usePedidos } from '../context/PedidosContext';
import { useValoraciones } from '../context/ValoracionesContext';
import { urlProducto } from '../data/productos';
import { dinero } from '../utils/format';
import ProductImage from './ProductImage';
import { Stars } from './Stars';
import Icon from './Icon';
import '../styles/productCard.css';

function ProductCard({ producto }) {
  const { agregar } = useCart();
  const { favoritos, alternarFavorito } = useAuth();
  const { existencias } = usePedidos();
  const { resumen } = useValoraciones();
  const navigate = useNavigate();
  const disponibles = existencias(producto.id);
  const agotado = disponibles === 0;
  const fav = favoritos.includes(producto.id);
  const { promedio, total } = resumen(producto.id);
  const url = urlProducto(producto);
  const requiereOpcion = producto.tallas?.length > 1 || producto.acabados?.length > 1;

  return (
    <article className={`card ${agotado ? 'is-soldout' : ''}`}>
      <div className="card__media">
        <Link to={url} tabIndex={-1} aria-hidden="true"><ProductImage producto={producto} className="card__img" /></Link>
        <div className="card__tags">
          {agotado && <span className="tag tag--dark">Agotado</span>}
          {!agotado && producto.nuevo && <span className="tag">Nuevo</span>}
          {!agotado && disponibles <= 2 && <span className="tag tag--soft">{disponibles === 1 ? 'Última pieza' : 'Últimas piezas'}</span>}
        </div>
        <button className={`card__fav ${fav ? 'is-on' : ''}`} onClick={() => alternarFavorito(producto.id)}
          aria-pressed={fav} aria-label={fav ? `Quitar ${producto.nombre} de favoritos` : `Guardar ${producto.nombre} en favoritos`}>
          <Icon name="heart" size={17} fill={fav ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="card__body">
        <h3 className="card__name"><Link to={url}>{producto.nombre}</Link></h3>
        {total > 0 ? <Stars valor={promedio} total={total} size={13} /> : <span className="card__noreviews">Sin opiniones aún</span>}
        <p className="card__price">{dinero(producto.precio)}</p>
        {agotado ? (
          <button className="btn btn--disabled btn--block btn--sm" disabled>Sin existencias</button>
        ) : requiereOpcion ? (
          <button className="btn btn--outline btn--block btn--sm" onClick={() => navigate(url)}>Elegir opciones</button>
        ) : (
          <button className="btn btn--outline btn--block btn--sm" onClick={() => agregar(producto)}>
            <Icon name="cart" size={16} /> Agregar al carrito
          </button>
        )}
      </div>
    </article>
  );
}

export default memo(ProductCard);
