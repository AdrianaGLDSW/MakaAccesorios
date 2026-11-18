import { Link } from 'react-router-dom';
import { useId } from 'react';
import Icon from './Icon';
import { TIENDA } from '../data/config';

export function Logo({ claro = false, alto = 52 }) {
  if (TIENDA.logo) return <img className="logo-img" src={TIENDA.logo} alt="MAKA Accesorios" height={alto} width={alto} />;
  return <span className={`logo-text ${claro ? 'is-light' : ''}`}>MAKA</span>;
}

export function Breadcrumbs({ items }) {
  return (
    <nav className="breadcrumbs" aria-label="Ruta de navegación">
      <ol>
        <li><Link to="/">Inicio</Link></li>
        {items.map((it, i) => (
          <li key={i}>{it.to && i < items.length - 1 ? <Link to={it.to}>{it.label}</Link> : <span aria-current="page">{it.label}</span>}</li>
        ))}
      </ol>
    </nav>
  );
}

export function Field({ label, error, hint, children, id: idProp, opcional }) {
  const auto = useId();
  const id = idProp || auto;
  const describedBy = [error && `${id}-err`, hint && `${id}-hint`].filter(Boolean).join(' ') || undefined;
  return (
    <div className={`field ${error ? 'has-error' : ''}`}>
      <label htmlFor={id}>{label}{opcional && <span className="field__opt"> (opcional)</span>}</label>
      {children({ id, 'aria-invalid': !!error, 'aria-describedby': describedBy })}
      {hint && !error && <p className="field__hint" id={`${id}-hint`}>{hint}</p>}
      {error && <p className="field__error" id={`${id}-err`}><Icon name="warn" size={14} /> {error}</p>}
    </div>
  );
}

export function Quantity({ value, onChange, max = 99, min = 1, label = 'Cantidad' }) {
  return (
    <div className="qty" role="group" aria-label={label}>
      <button type="button" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label="Quitar una pieza">−</button>
      <span aria-live="polite">{value}</span>
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label="Agregar una pieza">+</button>
    </div>
  );
}

export function EmptyState({ icon, titulo, texto, children }) {
  return (
    <div className="empty">
      <Icon name={icon} size={46} />
      <h2>{titulo}</h2>
      {texto && <p>{texto}</p>}
      {children && <div className="empty__actions">{children}</div>}
    </div>
  );
}

export function Alert({ tipo = 'info', titulo, children }) {
  const icon = { info: 'info', error: 'warn', ok: 'check', tiempo: 'clock' }[tipo];
  return (
    <div className={`alert alert--${tipo}`} role={tipo === 'error' ? 'alert' : 'status'}>
      <Icon name={icon} size={20} />
      <div>{titulo && <strong>{titulo}</strong>}{children && <div className="alert__body">{children}</div>}</div>
    </div>
  );
}
