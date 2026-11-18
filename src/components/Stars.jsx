import { useState } from 'react';
import Icon from './Icon';

export function Stars({ valor = 0, size = 15, mostrarValor = false, total }) {
  const llenas = Math.round(valor * 2) / 2;
  return (
    <span className="stars" aria-label={`${valor.toFixed(1)} de 5 estrellas${total != null ? `, ${total} opiniones` : ''}`}>
      {[1, 2, 3, 4, 5].map(n => (
        <span key={n} className={`stars__s ${n <= llenas ? 'is-on' : n - 0.5 === llenas ? 'is-half' : ''}`} aria-hidden="true">
          <Icon name="star" size={size} fill="currentColor" strokeWidth={1} />
        </span>
      ))}
      {mostrarValor && <span className="stars__num" aria-hidden="true">{valor.toFixed(1)}</span>}
      {total != null && <span className="stars__count" aria-hidden="true">({total})</span>}
    </span>
  );
}

export function StarInput({ valor, onChange, error }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="star-input" role="radiogroup" aria-label="Calificación" aria-invalid={!!error}>
      {[1, 2, 3, 4, 5].map(n => (
        <button key={n} type="button" role="radio" aria-checked={valor === n} aria-label={`${n} estrella${n > 1 ? 's' : ''}`}
          className={`star-input__s ${n <= (hover || valor) ? 'is-on' : ''}`}
          onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(0)} onClick={() => onChange(n)}>
          <Icon name="star" size={26} fill="currentColor" strokeWidth={1} />
        </button>
      ))}
    </div>
  );
}
