import { useState } from 'react';

// Ruta de una foto: «mini» es la miniatura WebP ligera (tarjetas, carrito); «grande» es la foto completa (detalle).
export const rutaFoto = (archivo, tamano = 'mini') =>
  tamano === 'mini' ? `/img/productos/mini/${archivo.replace(/\.jpg$/, '.webp')}` : `/img/productos/${archivo}`;

// Muestra la foto del producto o un espacio de imagen mientras se agregan las fotos reales.
export default function ProductImage({ producto, indice = 0, className = '', loading = 'lazy', tamano = 'mini' }) {
  const archivo = producto.imagenes?.[indice];
  const [intento, setIntento] = useState(0); // 0: tamaño pedido · 1: foto completa · 2: sin foto

  if (!archivo || intento > 1) {
    return (
      <div className={`img-placeholder ${className}`} role="img" aria-label={`Foto pendiente: ${producto.nombre}`}>
        <span className="img-placeholder__monogram" aria-hidden="true">M</span>
        <span className="img-placeholder__name">{producto.nombre}</span>
        <span className="img-placeholder__hint">Foto pendiente</span>
      </div>
    );
  }
  const src = intento === 0 ? rutaFoto(archivo, tamano) : rutaFoto(archivo, 'grande');
  return (
    <img className={className} src={src} alt={`${producto.nombre}, ${producto.material.toLowerCase()}`}
      loading={loading} decoding="async" onError={() => setIntento(i => (tamano === 'grande' ? 2 : i + 1))} />
  );
}
