export const reglas = {
  requerido: (v) => (String(v ?? '').trim() ? '' : 'Completa este campo.'),
  nombre: (v) => (String(v).trim().length >= 3 ? '' : 'Escribe tu nombre completo.'),
  correo: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v).trim()) ? '' : 'Escribe un correo válido, por ejemplo nombre@correo.com.'),
  telefono: (v) => (String(v ?? '').replace(/\D/g, '').length === 10 ? '' : 'Ingresa un teléfono de 10 dígitos.'),
  cp: (v) => (/^\d{5}$/.test(String(v).trim()) ? '' : 'El código postal debe tener 5 dígitos.'),
  contrasena: (v) => {
    const s = String(v);
    if (s.length < 8) return 'La contraseña debe tener al menos 8 caracteres.';
    if (!/[A-Z]/.test(s)) return 'Incluye al menos una letra mayúscula.';
    if (!/\d/.test(s)) return 'Incluye al menos un número.';
    return '';
  },
  aceptar: (v) => (v ? '' : 'Debes aceptar el aviso de privacidad para continuar.'),
  mensaje: (v) => (String(v).trim().length >= 10 ? '' : 'Escribe un mensaje de al menos 10 caracteres.'),
};

export function validar(datos, esquema) {
  const errores = {};
  for (const [campo, fns] of Object.entries(esquema)) {
    for (const fn of fns) {
      const e = fn(datos[campo], datos);
      if (e) { errores[campo] = e; break; }
    }
  }
  return errores;
}

export const requisitosContrasena = (s = '') => [
  { ok: s.length >= 8, texto: 'Mínimo 8 caracteres' },
  { ok: /[A-Z]/.test(s), texto: 'Una letra mayúscula' },
  { ok: /\d/.test(s), texto: 'Al menos un número' },
];

export async function hashContrasena(texto) {
  if (globalThis.crypto?.subtle) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(texto));
    return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
  }
  let h = 0; for (const c of texto) h = (h * 31 + c.charCodeAt(0)) | 0; return `h${h}`;
}
