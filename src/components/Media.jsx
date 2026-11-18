import { useState } from 'react';
import { MAPA_URL, VIDEO_YOUTUBE_ID } from '../data/config';
import Icon from './Icon';

export function VideoMarca({ titulo = 'Conoce MAKA Accesorios' }) {
  const [activo, setActivo] = useState(false);
  if (!VIDEO_YOUTUBE_ID) {
    return (
      <div className="video video--pending" role="img" aria-label="Espacio para el video de presentación de MAKA">
        <Icon name="play" size={54} />
        <strong>Video de presentación de MAKA</strong>
        <span>Agrega el identificador del video de YouTube en <code>src/data/config.js</code> (VIDEO_YOUTUBE_ID).</span>
      </div>
    );
  }
  return (
    <div className="video">
      {activo ? (
        <iframe src={`https://www.youtube-nocookie.com/embed/${VIDEO_YOUTUBE_ID}?autoplay=1&rel=0`} title={titulo}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
      ) : (
        <button className="video__poster" onClick={() => setActivo(true)} aria-label={`Reproducir video: ${titulo}`}
          style={{ backgroundImage: `url(https://i.ytimg.com/vi/${VIDEO_YOUTUBE_ID}/hqdefault.jpg)` }}>
          <Icon name="play" size={64} />
        </button>
      )}
    </div>
  );
}

export function Mapa() {
  return (
    <div className="map">
      <iframe src={MAPA_URL} title="Mapa de la zona de entregas de MAKA en Guadalajara" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
    </div>
  );
}
