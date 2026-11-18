import { useState } from 'react';

export default function ProductImage({ producto, indice = 0, className = '', loading = 'lazy', sizes }) {
  const archivo = producto.imagenes?.[indice];
  const [error, setError] = useState(false);

  if (!archivo || error) {
    return (
      <div className={`img-placeholder ${className}`} role="img" aria-label={`Foto pendiente: ${producto.nombre}`}>
        <span className="img-placeholder__monogram" aria-hidden="true">M</span>
        <span className="img-placeholder__name">{producto.nombre}</span>
        <span className="img-placeholder__hint">Foto pendiente</span>
      </div>
    );
  }
  return (
    <img className={className} src={`/img/productos/${archivo}`} alt={`${producto.nombre}, ${producto.material.toLowerCase()}`}
      loading={loading} decoding="async" sizes={sizes} onError={() => setError(true)} />
  );
}
