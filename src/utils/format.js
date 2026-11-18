const mxn = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0, maximumFractionDigits: 2 });

export const dinero = (n) => mxn.format(n);

export const fecha = (iso, conHora = false) =>
  new Date(iso).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric', ...(conHora ? { hour: '2-digit', minute: '2-digit' } : {}) });

export const normalizar = (s = '') => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

export const whatsappUrl = (numero, mensaje = '') => `https://wa.me/${numero}${mensaje ? `?text=${encodeURIComponent(mensaje)}` : ''}`;
