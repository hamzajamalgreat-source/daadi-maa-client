import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

// Layout components
import Navbar       from './components/Navbar';
import Footer       from './components/Footer';
import CartDrawer   from './components/CartDrawer';
import ProtectedRoute from './components/ProtectedRoute';

// Customer pages
import Home              from './pages/Home';
import Shop              from './pages/Shop';
import ProductDetail     from './pages/ProductDetail';
import Cart              from './pages/Cart';
import Checkout          from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';

// Admin pages
import AdminLogin     from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminOrders    from './pages/AdminOrders';
import AdminProducts  from './pages/AdminProducts';

// ─── Layout wrappers ──────────────────────────────────────────────────────────

/**
 * StorefrontLayout — wraps all customer-facing pages with Navbar + Footer + CartDrawer.
 */
function StorefrontLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <CartDrawer />
      <div className="flex-1">
        {children}
      </div>
      <Footer />
    </div>
  );
}

/**
 * AdminLayout — admin pages manage their own header, so no shared Navbar/Footer.
 */
function AdminLayout({ children }) {
  return <>{children}</>;
}

// ─── Scroll to top on route change ────────────────────────────────────────────

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

// ─── 404 page ─────────────────────────────────────────────────────────────────

function NotFound() {
  return (
    <StorefrontLayout>
      <div className="container-page py-24 text-center">
        <p className="text-7xl mb-4" aria-hidden="true">🌶️</p>
        <h1 className="font-serif text-3xl font-bold text-text-dark mb-3">Page Not Found</h1>
        <p className="text-text-muted mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <a href="/" className="btn-primary">
          Back to Home
        </a>
      </div>
    </StorefrontLayout>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>

        {/* ── Storefront routes ───────────────────────────────────────────── */}
        <Route
          path="/"
          element={
            <StorefrontLayout>
              <Home />
            </StorefrontLayout>
          }
        />
        <Route
          path="/shop"
          element={
            <StorefrontLayout>
              <Shop />
            </StorefrontLayout>
          }
        />
        <Route
          path="/shop/:slug"
          element={
            <StorefrontLayout>
              <ProductDetail />
            </StorefrontLayout>
          }
        />
        <Route
          path="/cart"
          element={
            <StorefrontLayout>
              <Cart />
            </StorefrontLayout>
          }
        />
        <Route
          path="/checkout"
          element={
            <StorefrontLayout>
              <Checkout />
            </StorefrontLayout>
          }
        />
        <Route
          path="/order/:id"
          element={
            <StorefrontLayout>
              <OrderConfirmation />
            </StorefrontLayout>
          }
        />

        {/* ── Admin routes ────────────────────────────────────────────────── */}
        <Route
          path="/admin/login"
          element={
            <AdminLayout>
              <AdminLogin />
            </AdminLayout>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminLayout>
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            </AdminLayout>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <AdminLayout>
              <ProtectedRoute>
                <AdminOrders />
              </ProtectedRoute>
            </AdminLayout>
          }
        />
        <Route
          path="/admin/products"
          element={
            <AdminLayout>
              <ProtectedRoute>
                <AdminProducts />
              </ProtectedRoute>
            </AdminLayout>
          }
        />

        {/* ── 404 ─────────────────────────────────────────────────────────── */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </>
  );
}
