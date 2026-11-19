import { useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { CATEGORIAS, COLECCIONES, PRODUCTOS_VISIBLES, categoriaPorSlug, coleccionPorSlug } from '../data/productos';
import { usePedidos } from '../context/PedidosContext';
import { useValoraciones } from '../context/ValoracionesContext';
import { useTitulo } from '../hooks/useLocalStorage';
import { normalizar } from '../utils/format';
import ProductCard from '../components/ProductCard';
import { Breadcrumbs, EmptyState } from '../components/ui';
import Icon from '../components/Icon';
import NotFound from './NotFound';
import '../styles/products.css';

const POR_PAGINA = 12;
const RANGOS = [
  { id: '', label: 'Cualquier precio' }, { id: '0-200', label: 'Hasta $200' }, { id: '200-350', label: '$200 a $350' }, { id: '350-9999', label: 'Más de $350' },
];
const SUGERENCIAS = ['arracadas', 'perla', 'collar', 'pulsera', 'anillo ajustable'];

// 2.1 Productos por categoría y 2.2 Resultados de búsqueda (misma plantilla).
export default function Productos({ busqueda = false }) {
  const { categoria } = useParams();
  const [params, setParams] = useSearchParams();
  const { existencias } = usePedidos();
  const { resumen } = useValoraciones();
  const [visibles, setVisibles] = useState(POR_PAGINA);
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false);

  const q = params.get('q') || '';
  const orden = params.get('orden') || 'relevancia';
  const precio = params.get('precio') || '';
  const acabado = params.get('acabado') || '';
  const soloDisponibles = params.get('disponibles') === '1';
  const cat = categoria ? categoriaPorSlug(categoria) : null;
  const col = coleccionPorSlug(params.get('coleccion') || '');

  const setParam = (k, v) => { const n = new URLSearchParams(params); v ? n.set(k, v) : n.delete(k); setParams(n, { replace: true }); setVisibles(POR_PAGINA); };
  const limpiar = () => { const n = new URLSearchParams(); if (q) n.set('q', q); if (col) n.set('coleccion', col.slug); setParams(n, { replace: true }); };

  const base = useMemo(() => {
    let l = PRODUCTOS_VISIBLES;
    if (cat) l = l.filter(p => p.categoria === cat.slug);
    if (col) l = l.filter(p => col.ids.includes(p.id));
    if (busqueda && q) {
      const palabras = normalizar(q).split(/\s+/).filter(Boolean);
      l = l.filter(p => { const t = normalizar(`${p.nombre} ${categoriaPorSlug(p.categoria).nombre} ${p.descripcion} ${p.material} ${p.acabados.join(' ')}`); return palabras.every(w => t.includes(w)); });
    }
    return l;
  }, [cat, col, busqueda, q]);

  const acabadosDisponibles = useMemo(() => [...new Set(base.flatMap(p => p.acabados))], [base]);

  const lista = useMemo(() => {
    let l = base;
    if (precio) { const [a, b] = precio.split('-').map(Number); l = l.filter(p => p.precio >= a && p.precio <= b); }
    if (acabado) l = l.filter(p => p.acabados.includes(acabado));
    if (soloDisponibles) l = l.filter(p => existencias(p.id) > 0);
    const ord = {
      'precio-asc': (a, b) => a.precio - b.precio,
      'precio-desc': (a, b) => b.precio - a.precio,
      novedades: (a, b) => b.fecha.localeCompare(a.fecha),
      vendidos: (a, b) => Number(b.masVendido) - Number(a.masVendido),
      valorados: (a, b) => resumen(b.id).promedio - resumen(a.id).promedio,
    }[orden];
    // Relevancia: primero piezas con foto y más vendidas. Los agotados siempre al final.
    const rel = (a, b) => (b.imagenes.length > 0) - (a.imagenes.length > 0) || Number(b.masVendido) - Number(a.masVendido);
    return [...l].sort((a, b) => (existencias(a.id) === 0) - (existencias(b.id) === 0) || (ord ? ord(a, b) : rel(a, b)));
  }, [base, precio, acabado, soloDisponibles, orden, existencias, resumen]);

  const titulo = busqueda ? `Resultados para «${q}»` : col ? col.nombre : cat ? cat.nombre : orden === 'novedades' ? 'Novedades' : 'Catálogo de productos';
  useTitulo(busqueda ? `Búsqueda: ${q}` : titulo);
  if (categoria && !cat) return <NotFound />;
  const hayFiltros = precio || acabado || soloDisponibles;

  return (
    <div className="container page">
      <Breadcrumbs items={busqueda ? [{ label: 'Búsqueda' }] : col ? [{ label: 'Catálogo', to: '/catalogo' }, { label: col.nombre }] : cat ? [{ label: 'Catálogo', to: '/catalogo' }, { label: cat.nombre }] : [{ label: titulo }]} />
      <div className="catalog-head">
        <div>
          <h1>{titulo}</h1>
          <p className="muted">{col?.descripcion || cat?.descripcion || (busqueda ? `${lista.length} coincidencia${lista.length === 1 ? '' : 's'}` : `${lista.length} piezas`)}</p>
        </div>
        <div className="catalog-head__tools">
          <button className="btn btn--ghost btn--sm catalog-filters-toggle" onClick={() => setFiltrosAbiertos(o => !o)} aria-expanded={filtrosAbiertos} aria-controls="filtros">
            Filtros{hayFiltros ? ' •' : ''}
          </button>
          <label className="select">
            <span>Ordenar por</span>
            <select value={orden} onChange={e => setParam('orden', e.target.value === 'relevancia' ? '' : e.target.value)}>
              <option value="relevancia">Relevancia</option>
              <option value="novedades">Novedades</option>
              <option value="vendidos">Más vendidos</option>
              <option value="precio-asc">Precio: menor a mayor</option>
              <option value="precio-desc">Precio: mayor a menor</option>
              <option value="valorados">Mejor valorados</option>
            </select>
          </label>
        </div>
      </div>

      <div className="catalog">
        <aside id="filtros" className={`filters ${filtrosAbiertos ? 'is-open' : ''}`} aria-label="Filtros">
          <fieldset>
            <legend>Categoría</legend>
            <ul className="filters__cats">
              <li><Link to="/catalogo" className={!cat && !col ? 'is-active' : ''}>Todas</Link></li>
              {CATEGORIAS.map(c => <li key={c.slug}><Link to={`/catalogo/${c.slug}`} className={cat?.slug === c.slug ? 'is-active' : ''}>{c.nombre}</Link></li>)}
            </ul>
          </fieldset>
          <fieldset>
            <legend>Colecciones</legend>
            <ul className="filters__cats">
              {COLECCIONES.map(c => <li key={c.slug}><Link to={`/catalogo?coleccion=${c.slug}`} className={col?.slug === c.slug ? 'is-active' : ''}>{c.nombre.replace('Colección ', '')}</Link></li>)}
            </ul>
          </fieldset>
          <fieldset>
            <legend>Precio</legend>
            {RANGOS.map(r => (
              <label key={r.id} className="check"><input type="radio" name="precio" checked={precio === r.id} onChange={() => setParam('precio', r.id)} /> {r.label}</label>
            ))}
          </fieldset>
          {(cat || busqueda) && acabadosDisponibles.length > 1 && (
            <fieldset>
              <legend>Acabado</legend>
              <label className="check"><input type="radio" name="acabado" checked={!acabado} onChange={() => setParam('acabado', '')} /> Todos</label>
              {acabadosDisponibles.map(a => <label key={a} className="check"><input type="radio" name="acabado" checked={acabado === a} onChange={() => setParam('acabado', a)} /> {a}</label>)}
            </fieldset>
          )}
          <fieldset>
            <legend>Disponibilidad</legend>
            <label className="check"><input type="checkbox" checked={soloDisponibles} onChange={e => setParam('disponibles', e.target.checked ? '1' : '')} /> Solo piezas disponibles</label>
          </fieldset>
          {hayFiltros && <button className="btn btn--ghost btn--sm" onClick={limpiar}>Borrar filtros</button>}
        </aside>

        <section className="catalog__results" aria-live="polite">
          {lista.length === 0 ? (
            busqueda && base.length === 0 ? (
              <EmptyState icon="search" titulo="No encontramos piezas que coincidan con tu búsqueda" texto="Revisa la ortografía, usa palabras más generales o explora por categoría.">
                <p className="suggest">Búsquedas populares: {SUGERENCIAS.map((s, i) => <span key={s}>{i > 0 && ' · '}<Link to={`/buscar?q=${encodeURIComponent(s)}`}>{s}</Link></span>)}</p>
                <Link to="/catalogo" className="btn btn--primary">Ver todo el catálogo</Link>
              </EmptyState>
            ) : (
              <EmptyState icon="info" titulo={cat && base.length === 0 ? 'Por ahora no hay piezas en esta categoría' : 'Ninguna pieza cumple con los filtros'} texto="Prueba con otros filtros o revisa las novedades.">
                {hayFiltros && <button className="btn btn--outline" onClick={limpiar}>Borrar filtros</button>}
                <Link to="/catalogo?orden=novedades" className="btn btn--primary">Ver novedades</Link>
              </EmptyState>
            )
          ) : (
            <>
              <div className="grid-products">{lista.slice(0, visibles).map(p => <ProductCard key={p.id} producto={p} />)}</div>
              {visibles < lista.length && (
                <div className="load-more">
                  <p className="muted">Mostrando {visibles} de {lista.length}</p>
                  <button className="btn btn--outline" onClick={() => setVisibles(v => v + POR_PAGINA)}>Cargar más <Icon name="chevronDown" size={16} /></button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
