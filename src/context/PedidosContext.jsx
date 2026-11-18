import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { PRODUCTOS } from '../data/productos';
import { PAGO_TRANSFERENCIA } from '../data/config';

const PedidosContext = createContext(null);
const HORA = 3600 * 1000;

export function estadoPedido(p, ahora = Date.now()) {
  if (p.estado === 'Cancelado') return 'Cancelado';
  if (p.pago === 'transferencia' && !p.pagado && ahora > new Date(p.vence).getTime()) return 'Cancelado';
  return p.estado;
}

export function PedidosProvider({ children }) {
  const [pedidos, setPedidos] = useLocalStorage('maka-pedidos', []);
  const [ahora, setAhora] = useState(Date.now());

  useEffect(() => { const t = setInterval(() => setAhora(Date.now()), 30000); return () => clearInterval(t); }, []);

  const apartadas = useMemo(() => {
    const m = {};
    for (const p of pedidos) {
      if (estadoPedido(p, ahora) === 'Cancelado') continue;
      for (const l of p.lineas) m[l.id] = (m[l.id] || 0) + l.cantidad;
    }
    return m;
  }, [pedidos, ahora]);

  const existencias = useCallback((id) => {
    const base = PRODUCTOS.find(p => p.id === id)?.stock ?? 0;
    return Math.max(0, base - (apartadas[id] || 0));
  }, [apartadas]);

  const crearPedido = (datos) => {
    const numero = `MAKA-${String(101 + pedidos.length).padStart(4, '0')}`;
    const creado = new Date();
    const pedido = {
      ...datos, numero, creado: creado.toISOString(), estado: 'En proceso', pagado: false,
      vence: new Date(creado.getTime() + PAGO_TRANSFERENCIA.horasApartado * HORA).toISOString(),
    };
    setPedidos(prev => [pedido, ...prev]);
    return pedido;
  };

  const pedidoPorNumero = (n) => pedidos.find(p => p.numero === n);
  const value = { pedidos, crearPedido, pedidoPorNumero, existencias, ahora };
  return <PedidosContext.Provider value={value}>{children}</PedidosContext.Provider>;
}

export const usePedidos = () => useContext(PedidosContext);

export function useAhora(intervalo = 1000) {
  const [t, setT] = useState(Date.now());
  useEffect(() => { const id = setInterval(() => setT(Date.now()), intervalo); return () => clearInterval(id); }, [intervalo]);
  return t;
}
