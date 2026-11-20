import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { PedidosProvider } from './context/PedidosContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ValoracionesProvider } from './context/ValoracionesContext';
import { productoPorId, urlProducto } from './data/productos';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';
import Toast from './components/Toast';
import Home from './pages/Home';

// Las páginas secundarias se cargan bajo demanda para que el inicio cargue más rápido (RNF-02).
const Productos = lazy(() => import('./pages/Productos'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Confirmation = lazy(() => import('./pages/Confirmation'));
const Register = lazy(() => import('./pages/Register'));
const Login = lazy(() => import('./pages/Login'));
const Recover = lazy(() => import('./pages/Recover'));
const Account = lazy(() => import('./pages/Account'));
const Favorites = lazy(() => import('./pages/Favorites'));
const Facturacion = lazy(() => import('./pages/Facturacion'));
const Legal = lazy(() => import('./pages/Legal'));
const NotFound = lazy(() => import('./pages/NotFound'));

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) { const el = document.getElementById(hash.slice(1)); if (el) { el.scrollIntoView(); return; } }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

// Rutas del repositorio original que se conservan por compatibilidad.
function ProductoLegacy() {
  const p = productoPorId(useParams().id);
  return <Navigate to={p ? urlProducto(p) : '/catalogo'} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <PedidosProvider>
        <CartProvider>
          <AuthProvider>
            <ValoracionesProvider>
              <ScrollToTop />
              <Navbar />
              <main id="contenido" tabIndex={-1}>
                <Suspense fallback={<div className="page-loading" aria-busy="true">Cargando…</div>}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/catalogo" element={<Productos />} />
                    <Route path="/catalogo/:categoria" element={<Productos />} />
                    <Route path="/buscar" element={<Productos busqueda />} />
                    <Route path="/catalogo/:categoria/:slug" element={<ProductDetail />} />
                    <Route path="/quienes-somos" element={<About />} />
                    <Route path="/contacto" element={<Contact />} />
                    <Route path="/carrito" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/checkout/confirmacion/:numero" element={<Confirmation />} />
                    <Route path="/cuenta" element={<Account />} />
                    <Route path="/cuenta/registro" element={<Register />} />
                    <Route path="/cuenta/iniciar-sesion" element={<Login />} />
                    <Route path="/cuenta/recuperar" element={<Recover />} />
                    <Route path="/favoritos" element={<Favorites />} />
                    <Route path="/facturacion" element={<Facturacion />} />
                    <Route path="/legal/:seccion" element={<Legal />} />
                    {/* Compatibilidad con las rutas anteriores */}
                    <Route path="/productos" element={<Navigate to="/catalogo" replace />} />
                    <Route path="/product/:id" element={<ProductoLegacy />} />
                    <Route path="/cart" element={<Navigate to="/carrito" replace />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </main>
              <Footer />
              <ChatWidget />
              <Toast />
            </ValoracionesProvider>
          </AuthProvider>
        </CartProvider>
      </PedidosProvider>
    </BrowserRouter>
  );
}
