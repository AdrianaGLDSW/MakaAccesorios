import { MAPA_URL } from '../data/config';

// Mapa embebido de la ubicación (RF-43).
export function Mapa() {
  return (
    <div className="map">
      <iframe src={MAPA_URL} title="Mapa de la zona de entregas de MAKA en Guadalajara" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
    </div>
  );
}
