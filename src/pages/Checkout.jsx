import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, ShoppingBag, User, Phone, MapPin,
  Mail, MessageSquare, CheckCircle, ArrowRight, Package,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { ordersApi } from '../api/client';
import useCartStore from '../store/cartStore';
import { formatCurrency, roundCurrency } from '../utils/formatCurrency';
import OrderStatusBadge from '../components/OrderStatusBadge';
import EmptyState from '../components/EmptyState';

// ─── Validation ────────────────────────────────────────────────────────────────
function validatePhone(phone) {
  return /^(03\d{2}[-\s]?\d{7}|03\d{9})$/.test(phone.trim());
}
function validateEmail(email) {
  if (!email) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

const INITIAL_FORM = {
  customer_name: '', customer_phone: '', customer_email: '',
  customer_address: '', notes: '',
};

// ─── Order Success Overlay ─────────────────────────────────────────────────────
function OrderSuccessOverlay({ order, onGoHome }) {
  const [countdown, setCountdown] = useState(5);

  // Auto-redirect countdown
  useEffect(() => {
    if (countdown <= 0) { onGoHome(); return; }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, onGoHome]);

  const subtotal = (order.items || []).reduce((s, i) => s + i.unit_price * i.quantity, 0);

  return (
    /* Full-screen overlay */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(20, 8, 2, 0.75)', backdropFilter: 'blur(6px)' }}
      role="dialog"
      aria-modal="true"
      aria-label="Order placed successfully"
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md animate-fade-in overflow-hidden">

        {/* Brand-coloured success header */}
        <div
          className="px-6 pt-8 pb-6 text-center"
          style={{ background: 'linear-gradient(135deg, #8B1A1A 0%, #6B1414 100%)' }}
        >
          {/* Checkmark circle */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4 shadow-lg">
            <CheckCircle size={46} className="text-primary" aria-hidden="true" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-white mb-1">
            Order Placed! 🎉
          </h1>
          <p className="text-white/80 text-sm">
            Thank you, <strong className="text-white">{order.customer_name}</strong>. We'll get it to you soon!
          </p>
        </div>

        {/* Order details */}
        <div className="px-6 py-5 space-y-4">

          {/* Order ID + status */}
          <div className="flex items-center justify-between bg-cream rounded-xl px-4 py-3">
            <div>
              <p className="text-xs text-text-muted uppercase tracking-wide">Order ID</p>
              <p className="font-mono font-bold text-text-dark text-lg">#{order.id}</p>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>

          {/* Items summary */}
          {order.items?.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wide flex items-center gap-1.5">
                <Package size={11} /> Items Ordered
              </p>
              <ul className="space-y-1.5 max-h-36 overflow-y-auto scrollbar-thin">
                {order.items.map(item => (
                  <li key={item.id} className="flex justify-between text-sm">
                    <span className="text-text-muted">
                      {item.product_name}
                      <span className="text-text-dark font-medium"> × {item.quantity}</span>
                    </span>
                    <span className="font-semibold text-text-dark flex-shrink-0 ml-2">
                      {formatCurrency(item.unit_price * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between font-bold text-base pt-2 border-t border-border">
                <span>Total</span>
                <span className="text-primary">{formatCurrency(subtotal)}</span>
              </div>
            </div>
          )}

          {/* Delivery + payment */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-cream rounded-xl p-3">
              <p className="text-text-muted mb-0.5 flex items-center gap-1">
                <MapPin size={10} /> Delivery to
              </p>
              <p className="font-medium text-text-dark text-[11px] leading-snug line-clamp-2">
                {order.customer_address}
              </p>
            </div>
            <div className="bg-cream rounded-xl p-3">
              <p className="text-text-muted mb-0.5 flex items-center gap-1">
                <Phone size={10} /> Contact
              </p>
              <p className="font-medium text-text-dark text-[11px]">{order.customer_phone}</p>
              <p className="text-text-muted text-[10px] mt-1">💵 Cash on Delivery</p>
            </div>
          </div>

          {/* What happens next — brand cream */}
          <div className="bg-cream border border-border rounded-xl p-3 text-xs text-text-muted">
            <p className="font-semibold text-text-dark mb-1.5">What happens next?</p>
            <p>1. Our team will call you on <strong className="text-text-dark">{order.customer_phone}</strong> to confirm.</p>
            <p className="mt-0.5">2. Your spices will be packed and dispatched.</p>
            <p className="mt-0.5">3. Pay cash when delivered. That's it!</p>
          </div>

          {/* Auto-redirect countdown + button */}
          <div className="flex flex-col gap-2 pt-1">
            <button
              onClick={onGoHome}
              className="btn-primary w-full py-3 text-base"
            >
              Back to Home
              <ArrowRight size={17} aria-hidden="true" />
            </button>
            <a
              href={`https://wa.me/923149007440?text=${encodeURIComponent(
                `My order #${order.id} placed on Daadi Maa Spices!\nItems: ${(order.items||[]).map(i=>`${i.product_name} x${i.quantity}`).join(', ')}\nTotal: Rs.${order.total_amount}\nContact: ${order.customer_phone}`
              )}`}
              target="_blank" rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
              style={{ background: '#25D366' }}
            >
              📱 Confirm via WhatsApp
            </a>
            <p className="text-center text-xs text-text-muted">
              Redirecting to home in{' '}
              <span className="font-bold text-primary">{countdown}</span>s…
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Checkout page ─────────────────────────────────────────────────────────────
export default function Checkout() {
  const { items, clearCart } = useCartStore();
  const navigate = useNavigate();

  const [form, setForm]           = useState(INITIAL_FORM);
  const [errors, setErrors]       = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null); // set on success → shows overlay
  const submitLock = useRef(false);

  // Derive current step from form state
  const currentStep = (() => {
    if (form.customer_name.trim() && form.customer_phone.trim()) {
      if (form.customer_address.trim().length >= 10) return 3;
      return 2;
    }
    return 1;
  })();

  const subtotal   = roundCurrency(items.reduce((s, i) => s + i.price * i.quantity, 0));
  const totalItems = items.reduce((s, i) => s + i.quantity, 0);

  // Empty cart guard
  if (items.length === 0 && !placedOrder) {
    return (
      <main className="container-page py-20">
        <EmptyState
          icon="🛒"
          title="Your cart is empty"
          message="Add some products before checking out."
          actionLabel="Browse Spices"
          actionTo="/shop"
        />
      </main>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(err => ({ ...err, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.customer_name.trim())
      e.customer_name = 'Full name is required.';
    else if (form.customer_name.trim().length < 2)
      e.customer_name = 'Please enter your full name.';

    if (!form.customer_phone.trim())
      e.customer_phone = 'Phone number is required.';
    else if (!validatePhone(form.customer_phone))
      e.customer_phone = 'Enter a valid Pakistani mobile number (e.g. 0314-9007440).';

    if (form.customer_email && !validateEmail(form.customer_email))
      e.customer_email = 'Enter a valid email address.';

    if (!form.customer_address.trim())
      e.customer_address = 'Delivery address is required.';
    else if (form.customer_address.trim().length < 10)
      e.customer_address = 'Please provide a complete delivery address.';

    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      document.getElementById(Object.keys(validationErrors)[0])?.focus();
      return;
    }

    if (submitLock.current) return;
    submitLock.current = true;
    setSubmitting(true);

    const payload = {
      customer_name:    form.customer_name.trim(),
      customer_phone:   form.customer_phone.trim(),
      customer_address: form.customer_address.trim(),
      customer_email:   form.customer_email.trim() || undefined,
      notes:            form.notes.trim() || undefined,
      items: items.map(i => ({ product_id: i.id, quantity: i.quantity })),
    };

    try {
      const res = await ordersApi.place(payload);
      // Clear cart immediately
      clearCart();
      // Show success overlay — this triggers the 5s countdown
      setPlacedOrder(res.data);
      // Also fire a toast so it's visible even if overlay is scrolled
      toast.success(`Order #${res.data.id} placed successfully!`, {
        duration: 5000,
        icon: '✅',
        style: { fontWeight: '600' },
      });
    } catch (err) {
      toast.error(err.message || 'Failed to place order. Please try again.');
      submitLock.current = false;
      setSubmitting(false);
    }
  };

  // Called by overlay button or countdown end
  const handleGoHome = () => {
    navigate('/', { replace: true });
  };

  return (
    <>
      {/* Success overlay — rendered on top of the checkout page */}
      {placedOrder && (
        <OrderSuccessOverlay order={placedOrder} onGoHome={handleGoHome} />
      )}

      <main className="bg-cream min-h-screen container-page py-8 sm:py-12">
        <Link
          to="/cart"
          className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Back to Cart
        </Link>

        <h1 className="section-title mb-8">Checkout</h1>

        {/* Step indicator */}
        <div className="flex items-center mb-8">
          {[
            { n: 1, label: 'Contact' },
            { n: 2, label: 'Address' },
            { n: 3, label: 'Confirm' },
          ].map(({ n, label }, i) => (
            <div key={n} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1 flex-shrink-0">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all"
                  style={{
                    background: currentStep >= n ? '#8B1E17' : '#EFE8DF',
                    color: currentStep >= n ? '#fff' : '#7C6B5E',
                  }}
                >
                  {currentStep > n ? '✓' : n}
                </div>
                <span className="text-xs font-medium" style={{ color: currentStep >= n ? '#8B1E17' : '#7C6B5E' }}>
                  {label}
                </span>
              </div>
              {i < 2 && (
                <div className="flex-1 h-0.5 mx-3 self-start mt-4"
                  style={{ background: currentStep > n ? '#8B1E17' : '#EFE8DF' }} />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Form ──────────────────────────────────────────────────── */}
          <form
            onSubmit={handleSubmit}
            noValidate
            className="lg:col-span-2 space-y-5"
            aria-label="Checkout form"
          >
            <div className="card p-6">
              <h2 className="font-serif font-semibold text-lg mb-5 flex items-center gap-2">
                <User size={18} className="text-primary" aria-hidden="true" />
                Delivery Details
              </h2>

              {/* Full Name */}
              <div className="mb-4">
                <label htmlFor="customer_name" className="form-label">
                  Full Name <span className="text-red-500" aria-hidden="true">*</span>
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                  <input
                    id="customer_name" name="customer_name" type="text"
                    value={form.customer_name} onChange={handleChange}
                    placeholder="e.g. Ahmed Khan"
                    autoComplete="name" aria-required="true"
                    aria-describedby={errors.customer_name ? 'customer_name-error' : undefined}
                    className={`form-input pl-10 ${errors.customer_name ? 'border-red-400 focus:ring-red-400' : ''}`}
                  />
                </div>
                {errors.customer_name && (
                  <p id="customer_name-error" className="form-error" role="alert">{errors.customer_name}</p>
                )}
              </div>

              {/* Phone */}
              <div className="mb-4">
                <label htmlFor="customer_phone" className="form-label">
                  Phone Number <span className="text-red-500" aria-hidden="true">*</span>
                </label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                  <input
                    id="customer_phone" name="customer_phone" type="tel"
                    value={form.customer_phone} onChange={handleChange}
                    placeholder="e.g. 0314-9007440"
                    autoComplete="tel" aria-required="true"
                    aria-describedby={errors.customer_phone ? 'customer_phone-error' : undefined}
                    className={`form-input pl-10 ${errors.customer_phone ? 'border-red-400 focus:ring-red-400' : ''}`}
                  />
                </div>
                {errors.customer_phone && (
                  <p id="customer_phone-error" className="form-error" role="alert">{errors.customer_phone}</p>
                )}
              </div>

              {/* Email (optional) */}
              <div className="mb-4">
                <label htmlFor="customer_email" className="form-label">
                  Email Address <span className="text-text-muted font-normal">(optional)</span>
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                  <input
                    id="customer_email" name="customer_email" type="email"
                    value={form.customer_email} onChange={handleChange}
                    placeholder="e.g. ahmed@example.com"
                    autoComplete="email"
                    aria-describedby={errors.customer_email ? 'customer_email-error' : undefined}
                    className={`form-input pl-10 ${errors.customer_email ? 'border-red-400 focus:ring-red-400' : ''}`}
                  />
                </div>
                {errors.customer_email && (
                  <p id="customer_email-error" className="form-error" role="alert">{errors.customer_email}</p>
                )}
              </div>

              {/* Address */}
              <div className="mb-4">
                <label htmlFor="customer_address" className="form-label">
                  Delivery Address <span className="text-red-500" aria-hidden="true">*</span>
                </label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3 top-3 text-text-muted pointer-events-none" />
                  <textarea
                    id="customer_address" name="customer_address"
                    value={form.customer_address} onChange={handleChange}
                    rows={3} placeholder="House/flat number, street, area, city"
                    autoComplete="street-address" aria-required="true"
                    aria-describedby={errors.customer_address ? 'customer_address-error' : undefined}
                    className={`form-input pl-10 resize-none ${errors.customer_address ? 'border-red-400 focus:ring-red-400' : ''}`}
                  />
                </div>
                {errors.customer_address && (
                  <p id="customer_address-error" className="form-error" role="alert">{errors.customer_address}</p>
                )}
                {/* Delivery estimate based on city mentioned in address */}
                {form.customer_address.length > 3 && (() => {
                  const addr = form.customer_address.toLowerCase();
                  let estimate = null;
                  if (/mardan|swabi|nowshera|charsadda|peshawar|kohat|abbottabad|mansehra|haripur/.test(addr)) {
                    estimate = { time: 'Same day – 1 day', color: '#22c55e', icon: '⚡' };
                  } else if (/lahore|faisalabad|gujranwala|multan|rawalpindi|islamabad|sialkot|gujrat/.test(addr)) {
                    estimate = { time: '2–3 days', color: '#D97706', icon: '🚚' };
                  } else if (/karachi|hyderabad|sukkur|larkana|quetta|hub/.test(addr)) {
                    estimate = { time: '3–5 days', color: '#8B1E17', icon: '📦' };
                  } else if (addr.length > 5) {
                    estimate = { time: '2–4 days', color: '#7C6B5E', icon: '📮' };
                  }
                  if (!estimate) return null;
                  return (
                    <p className="text-xs mt-1.5 flex items-center gap-1.5 font-medium"
                      style={{ color: estimate.color }}>
                      {estimate.icon} Estimated delivery: <strong>{estimate.time}</strong>
                    </p>
                  );
                })()}
              </div>

              {/* Notes */}
              <div>
                <label htmlFor="notes" className="form-label">
                  Order Notes <span className="text-text-muted font-normal">(optional)</span>
                </label>
                <div className="relative">
                  <MessageSquare size={16} className="absolute left-3 top-3 text-text-muted pointer-events-none" />
                  <textarea
                    id="notes" name="notes"
                    value={form.notes} onChange={handleChange}
                    rows={2}
                    placeholder="Preferred delivery time, landmark, special instructions…"
                    className="form-input pl-10 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* COD notice — brand cream with accent border */}
            <div className="card p-5 bg-cream border-l-4 border-accent">
              <p className="font-semibold text-text-dark mb-1 flex items-center gap-2">
                💵 Payment Method
              </p>
              <p className="text-sm text-text-muted">
                <strong className="text-text-dark">Cash on Delivery (COD)</strong> — Pay the delivery person
                when your order arrives. No online payment required.
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full py-4 text-base"
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
                  Placing Order…
                </>
              ) : (
                <>
                  <ShoppingBag size={18} aria-hidden="true" />
                  Place Order — {formatCurrency(subtotal)}
                </>
              )}
            </button>
          </form>

          {/* ── Order summary sidebar ──────────────────────────────────── */}
          <aside aria-label="Order summary">
            <div className="card p-6 sticky top-24">
              <h2 className="font-serif font-semibold text-lg mb-5">Order Summary</h2>

              <ul className="space-y-3 mb-4 text-sm max-h-64 overflow-y-auto scrollbar-thin">
                {items.map(item => (
                  <li key={item.id} className="flex justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src={item.image_url || '/placeholder-spice.svg'}
                        alt=""
                        className="w-9 h-9 rounded object-contain bg-cream flex-shrink-0"
                        onError={e => { e.target.src = '/placeholder-spice.svg'; }}
                      />
                      <span className="truncate text-text-muted">
                        {item.name} <span className="text-text-dark font-medium">× {item.quantity}</span>
                      </span>
                    </div>
                    <span className="flex-shrink-0 font-semibold text-text-dark">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between text-sm text-text-muted">
                  <span>Items ({totalItems})</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-text-muted">
                  <span>Delivery</span>
                  <span className="text-green-700 font-medium">Cash on Delivery</span>
                </div>
                <div className="flex justify-between font-bold text-base pt-2 border-t border-border">
                  <span>Total</span>
                  <span className="text-primary text-lg">{formatCurrency(subtotal)}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
