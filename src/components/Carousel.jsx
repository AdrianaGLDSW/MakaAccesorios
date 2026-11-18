import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon';

export default function Carousel({ slides, intervalo = 6000 }) {
  const [i, setI] = useState(0);
  const [pausa, setPausa] = useState(false);
  const n = slides.length;
  const ir = useCallback((k) => setI((k + n) % n), [n]);

  useEffect(() => {
    const reducir = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (pausa || reducir) return;
    const t = setInterval(() => setI(x => (x + 1) % n), intervalo);
    return () => clearInterval(t);
  }, [pausa, n, intervalo]);

  return (
    <section className="carousel" aria-roledescription="carrusel" aria-label="Piezas destacadas"
      onMouseEnter={() => setPausa(true)} onMouseLeave={() => setPausa(false)} onFocus={() => setPausa(true)} onBlur={() => setPausa(false)}>
      {slides.map((s, k) => (
        <div key={k} className={`carousel__slide ${k === i ? 'is-active' : ''}`} role="group" aria-roledescription="diapositiva"
          aria-label={`${k + 1} de ${n}`} aria-hidden={k !== i}>
          <img src={s.imagen} alt={s.alt} loading={k === 0 ? 'eager' : 'lazy'} fetchpriority={k === 0 ? 'high' : 'auto'} />
          <div className="carousel__text">
            <span className="carousel__kicker">{s.kicker}</span>
            <h2>{s.titulo}</h2>
            <p>{s.texto}</p>
            <Link to={s.to} className="btn btn--primary" tabIndex={k === i ? 0 : -1}>{s.cta}</Link>
          </div>
        </div>
      ))}
      <button className="carousel__nav carousel__nav--prev" onClick={() => ir(i - 1)} aria-label="Diapositiva anterior"><Icon name="chevronLeft" size={22} /></button>
      <button className="carousel__nav carousel__nav--next" onClick={() => ir(i + 1)} aria-label="Diapositiva siguiente"><Icon name="chevronRight" size={22} /></button>
      <div className="carousel__dots">
        {slides.map((_, k) => <button key={k} className={k === i ? 'is-active' : ''} onClick={() => ir(k)} aria-label={`Ir a la diapositiva ${k + 1}`} aria-current={k === i} />)}
      </div>
    </section>
  );
}
