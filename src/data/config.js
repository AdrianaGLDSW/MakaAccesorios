
export const TIENDA = {
  nombre: 'MAKA Accesorios',
  lema: 'Joyería de moda hecha en Jalisco',

  logo: '/img/logo-maka.jpg',
  ciudad: 'Guadalajara, Jalisco',
  correo: 'hola@makaaccesorios.mx',

  whatsapp: '523300000000',
  horario: 'Todos los días de 9:00 a 22:00',
};

export const REDES = [
  { id: 'instagram', nombre: 'Instagram', url: 'https://www.instagram.com/' },
  { id: 'facebook', nombre: 'Facebook', url: 'https://www.facebook.com/' },
  { id: 'whatsapp', nombre: 'WhatsApp', url: `https://wa.me/${TIENDA.whatsapp}` },
];

export const VIDEO_YOUTUBE_ID = '';

export const MAPA_URL = 'https://www.google.com/maps?q=Guadalajara%2C%20Jalisco&z=12&output=embed';

export const PUNTOS_ENTREGA = [
  { id: 'chapultepec', nombre: 'Punto Chapultepec', zona: 'Col. Americana, Guadalajara', horario: 'Lunes a viernes, 17:00 a 20:00' },
  { id: 'zapopan', nombre: 'Punto Zapopan Centro', zona: 'Zapopan, Jalisco', horario: 'Sábados, 10:00 a 14:00' },
  { id: 'providencia', nombre: 'Punto Providencia', zona: 'Col. Providencia, Guadalajara', horario: 'Miércoles y viernes, 12:00 a 15:00' },
];

export const ENVIO = {
  costoDomicilio: 120,
  gratisDesde: 1299,
  diasLocal: '1 a 3 días hábiles en la zona metropolitana de Guadalajara',
  diasNacional: '3 a 7 días hábiles al resto de México',
};

export const PAGO_TRANSFERENCIA = {
  banco: '[Nombre del banco]',
  titular: '[Nombre del titular]',
  clabe: '0000 0000 0000 0000 00',
  horasApartado: 24,
};

export const CUPONES = {
  MAKA10: { tipo: 'porcentaje', valor: 10, minimo: 0, vence: '2026-12-31', descripcion: '10 % de descuento' },
  BIENVENIDA: { tipo: 'monto', valor: 100, minimo: 1000, vence: '2027-03-31', descripcion: '$100 de descuento en compras desde $1,000' },
  VERANO25: { tipo: 'porcentaje', valor: 25, minimo: 0, vence: '2026-10-31', descripcion: '25 % de descuento' },
};
