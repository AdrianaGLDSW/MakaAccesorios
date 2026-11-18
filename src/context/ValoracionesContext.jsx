import { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { VALORACIONES_EJEMPLO } from '../data/productos';

const ValoracionesContext = createContext(null);

export function ValoracionesProvider({ children }) {
  const [propias, setPropias] = useLocalStorage('maka-valoraciones', []);
  const todas = [...propias, ...VALORACIONES_EJEMPLO];

  const deProducto = (id) => todas.filter(v => v.productoId === id).sort((a, b) => b.fecha.localeCompare(a.fecha));
  const resumen = (id) => {
    const l = todas.filter(v => v.productoId === id);
    return { total: l.length, promedio: l.length ? l.reduce((s, v) => s + v.estrellas, 0) / l.length : 0 };
  };
  const agregar = (v) => setPropias(prev => [{ ...v, id: `v${Date.now()}`, fecha: new Date().toISOString().slice(0, 10), ejemplo: false }, ...prev]);

  return <ValoracionesContext.Provider value={{ deProducto, resumen, agregar }}>{children}</ValoracionesContext.Provider>;
}

export const useValoraciones = () => useContext(ValoracionesContext);
