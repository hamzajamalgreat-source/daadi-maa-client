import { lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";

// Layout components — always loaded (part of the shell)
import Navbar          from "./components/Navbar";
import Footer          from "./components/Footer";
import CartDrawer      from "./components/CartDrawer";
import ProtectedRoute  from "./components/ProtectedRoute";
import PageSkeleton    from "./components/PageSkeleton";
import OfflineBanner   from "./components/OfflineBanner";
import WhatsAppButton  from "./components/WhatsAppButton";
import BottomNav       from "./components/BottomNav";

// FL3: Route-based code splitting via React.lazy().
// Each route is a separate JS chunk — admin code is NOT downloaded on the homepage.
// Chunks: Home, Shop, ProductDetail, Cart, Checkout, OrderConfirmation are customer chunks.
// Admin chunks are only downloaded when the user navigates to /admin/*.
const Home              = lazy(() => import("./pages/Home"));
const Shop              = lazy(() => import("./pages/Shop"));
const ProductDetail     = lazy(() => import("./pages/ProductDetail"));
const Cart              = lazy(() => import("./pages/Cart"));
const Checkout          = lazy(() => import("./pages/Checkout"));
const OrderConfirmation = lazy(() => import("./pages/OrderConfirmation"));
const AdminLogin        = lazy(() => import("./pages/AdminLogin"));
const AdminDashboard    = lazy(() => import("./pages/AdminDashboard"));
const AdminOrders       = lazy(() => import("./pages/AdminOrders"));
const AdminProducts     = lazy(() => import("./pages/AdminProducts"));
const OrderTracking     = lazy(() => import("./pages/OrderTracking"));

// ─── Layout wrappers ──────────────────────────────────────────────────────────

function StorefrontLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <CartDrawer />
      <div className="flex-1 pb-16 md:pb-0">{children}</div>
      <Footer />
    </div>
  );
}

function AdminLayout({ children }) {
  return <>{children}</>;
}

// ─── Scroll to top on route change ────────────────────────────────────────────

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
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
          The page you are looking for does not exist or has been moved.
        </p>
        <a href="/" className="btn-primary">Back to Home</a>
      </div>
    </StorefrontLayout>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <>
      {/* FL6: Offline detection banner — appears when connection is lost */}
      <OfflineBanner />
      <WhatsAppButton />
      <BottomNav />
      <ScrollToTop />

      {/*
        FL3 / FL9: Suspense wraps all lazy routes.
        PageSkeleton shows the nav shell + shimmer cards immediately
        while the route chunk downloads — user never sees a blank screen.
      */}
      <Suspense fallback={<PageSkeleton />}>
        <Routes>

          {/* ── Storefront routes ─────────────────────────────────────────── */}
          <Route path="/" element={
            <StorefrontLayout><Home /></StorefrontLayout>
          } />
          <Route path="/shop" element={
            <StorefrontLayout><Shop /></StorefrontLayout>
          } />
          <Route path="/shop/:slug" element={
            <StorefrontLayout><ProductDetail /></StorefrontLayout>
          } />
          <Route path="/cart" element={
            <StorefrontLayout><Cart /></StorefrontLayout>
          } />
          <Route path="/checkout" element={
            <StorefrontLayout><Checkout /></StorefrontLayout>
          } />
          <Route path="/order/:id" element={
            <StorefrontLayout><OrderConfirmation /></StorefrontLayout>
          } />
          <Route path="/track" element={
            <StorefrontLayout><OrderTracking /></StorefrontLayout>
          } />

          {/* ── Admin routes ──────────────────────────────────────────────── */}
          <Route path="/admin/login" element={
            <AdminLayout><AdminLogin /></AdminLayout>
          } />
          <Route path="/admin" element={
            <AdminLayout>
              <ProtectedRoute><AdminDashboard /></ProtectedRoute>
            </AdminLayout>
          } />
          <Route path="/admin/orders" element={
            <AdminLayout>
              <ProtectedRoute><AdminOrders /></ProtectedRoute>
            </AdminLayout>
          } />
          <Route path="/admin/products" element={
            <AdminLayout>
              <ProtectedRoute><AdminProducts /></ProtectedRoute>
            </AdminLayout>
          } />

          {/* ── 404 ─────────────────────────────────────────────────────── */}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </Suspense>
    </>
  );
}
