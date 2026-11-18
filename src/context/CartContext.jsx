import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { productoPorId } from '../data/productos';
import { CUPONES, ENVIO } from '../data/config';
import { dinero, fecha } from '../utils/format';
import { usePedidos } from './PedidosContext';

const CartContext = createContext(null);

export const calcularEnvio = (subtotal, metodo = 'domicilio') =>
  metodo === 'recoger' || subtotal >= ENVIO.gratisDesde || subtotal === 0 ? 0 : ENVIO.costoDomicilio;

function descuentoDe(cupon, subtotal) {
  if (!cupon) return 0;
  const c = CUPONES[cupon];
  if (!c || subtotal < c.minimo) return 0;
  return c.tipo === 'porcentaje' ? Math.round(subtotal * c.valor) / 100 : Math.min(c.valor, subtotal);
}

export function CartProvider({ children }) {
  const { existencias } = usePedidos();
  const [items, setItems] = useLocalStorage('maka-carrito', []); 
  const [cupon, setCupon] = useLocalStorage('maka-cupon', null);
  const [aviso, setAviso] = useState(null); 

  const clave = (id, acabado, talla) => [id, acabado || '', talla || ''].join('|');

  const agregar = (producto, { cantidad = 1, acabado, talla } = {}) => {
    const disponibles = existencias(producto.id);
    const enCarrito = items.filter(i => i.id === producto.id).reduce((s, i) => s + i.cantidad, 0);
    const puede = Math.max(0, Math.min(cantidad, disponibles - enCarrito));
    if (puede === 0) { setAviso({ tipo: 'error', texto: disponibles === 0 ? `${producto.nombre} está agotado.` : `Ya tienes en tu carrito todas las piezas disponibles de ${producto.nombre}.` }); return false; }
    const k = clave(producto.id, acabado, talla);
    setItems(prev => prev.some(i => i.key === k)
      ? prev.map(i => i.key === k ? { ...i, cantidad: i.cantidad + puede } : i)
      : [...prev, { key: k, id: producto.id, cantidad: puede, acabado: acabado || producto.acabados?.[0] || null, talla: talla || null }]);
    setAviso({ tipo: 'ok', texto: puede < cantidad ? `Solo quedaban ${puede} pieza(s): se agregaron a tu carrito.` : 'Se agregó a tu carrito.', producto });
    return true;
  };

  const cambiarCantidad = (key, cantidad) => setItems(prev => prev.map(i => {
    if (i.key !== key) return i;
    const max = existencias(i.id);
    return { ...i, cantidad: Math.max(1, Math.min(cantidad, max || 1)) };
  }));
  const eliminar = (key) => setItems(prev => prev.filter(i => i.key !== key));
  const vaciar = () => { setItems([]); setCupon(null); };
  const cerrarAviso = useCallback(() => setAviso(null), []);

  const lineas = useMemo(() => items.map(i => {
    const producto = productoPorId(i.id);
    const disponibles = producto ? existencias(i.id) : 0;
    const agotado = disponibles === 0;
    const ajustada = !agotado && i.cantidad > disponibles;
    const cantidad = agotado ? 0 : Math.min(i.cantidad, disponibles);
    return { ...i, producto, disponibles, agotado, ajustada, cantidadSolicitada: i.cantidad, cantidad, importe: producto ? producto.precio * cantidad : 0 };
  }).filter(l => l.producto), [items, existencias]);

  const subtotal = lineas.reduce((s, l) => s + l.importe, 0);
  const piezas = lineas.reduce((s, l) => s + l.cantidad, 0);
  const descuento = descuentoDe(cupon, subtotal);

  const aplicarCupon = (texto) => {
    const codigo = texto.trim().toUpperCase();
    const c = CUPONES[codigo];
    if (!codigo) return { ok: false, mensaje: 'Escribe un código de descuento.' };
    if (!c) return { ok: false, mensaje: 'No reconocemos este código. Revisa que esté bien escrito.' };
    if (new Date(c.vence + 'T23:59:59') < new Date()) return { ok: false, mensaje: `El código ${codigo} venció el ${fecha(c.vence + 'T12:00:00')}.` };
    if (subtotal < c.minimo) return { ok: false, mensaje: `Este código aplica en compras desde ${dinero(c.minimo)}. Te faltan ${dinero(c.minimo - subtotal)}.` };
    setCupon(codigo);
    return { ok: true, mensaje: `Cupón aplicado: ${c.descripcion}.` };
  };

  const value = {
    items, lineas, piezas, subtotal, descuento, cupon, aplicarCupon, quitarCupon: () => setCupon(null),
    agregar, cambiarCantidad, eliminar, vaciar, aviso, cerrarAviso,
    cuponValido: cupon && descuentoDe(cupon, subtotal) > 0,
  };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
