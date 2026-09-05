import { motion, AnimatePresence } from "motion/react";
import { useEffect, useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import useCartStore from '../store/cartStore';
import { formatCurrency } from '../utils/formatCurrency';
import { productsApi } from '../api/client';
import EmptyState from './EmptyState';

/**
 * CartDrawer ΓÇö slide-in panel from right.
 * Traps focus when open and closes on Escape or backdrop click.
 */
export default function CartDrawer() {
  const { items, isDrawerOpen, closeDrawer, updateQuantity, removeItem, totalItems, totalPrice } =
    useCartStore();
  const navigate = useNavigate();
  const [bestsellers, setBestsellers] = useState([]);
  const [staleItems, setStaleItems] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('daadi-cart');
      if (raw) {
        const parsed = JSON.parse(raw);
        const state = parsed.state || parsed;
        const cartItems = state.items || [];
        const now = Date.now();
        const stale = cartItems
          .filter(i => i.addedAt && (now - i.addedAt) > 24 * 60 * 60 * 1000)
          .map(i => i.id);
        setStaleItems(stale);
      }
    } catch { /* ignore */ }
  }, [isDrawerOpen]);

  // Close on Escape key
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape' && isDrawerOpen) closeDrawer();
    },
    [isDrawerOpen, closeDrawer]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isDrawerOpen]);

  // Fetch bestsellers when drawer opens with empty cart
  useEffect(() => {
    if (isDrawerOpen && items.length === 0) {
      productsApi.getAll()
        .then(r => {
          const badged = r.data.filter(p => p.badge && p.in_stock).slice(0, 3);
          setBestsellers(badged);
        })
        .catch(() => {});
    }
  }, [isDrawerOpen, items.length]);

  const handleCheckout = () => {
    closeDrawer();
    navigate('/checkout');
  };

  const totalItemCount = items.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = Math.round(items.reduce((s, i) => s + i.price * i.quantity, 0) * 100) / 100;
  return (
    <AnimatePresence>
      {isDrawerOpen && (
      <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <motion.aside
        initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 280, damping: 28 }}
        className="fixed right-0 top-0 z-50 h-full w-full max-w-sm bg-white shadow-drawer flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-primary" aria-hidden="true" />
            <h2 className="font-serif font-semibold text-text-dark text-lg">
              Your Cart
            </h2>
            {totalItemCount > 0 && (
              <span className="bg-primary text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {totalItemCount}
              </span>
            )}
          </div>
          <button
            onClick={closeDrawer}
            aria-label="Close cart"
            className="p-1.5 rounded-lg text-text-muted hover:text-text-dark hover:bg-cream-dark transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items list */}
        <div className="flex-1 overflow-y-auto scrollbar-thin px-5 py-4">
          {items.length === 0 ? (
            <div>
              <EmptyState
                icon="≡ƒ¢Æ"
                title="Your cart is empty"
                message="Browse our spices and add items to your cart."
                actionLabel="Shop Now"
                actionTo="/shop"
              />
              {bestsellers.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-3">
                    Popular picks
                  </p>
                  <ul className="space-y-2">
                    {bestsellers.map(p => (
                      <li key={p.id} className="flex items-center gap-3 p-2 rounded-xl border border-border hover:bg-cream transition-colors">
                        <Link to={`/shop/${p.slug}`} onClick={closeDrawer} className="flex-shrink-0">
                          <img src={p.image_url || '/placeholder-spice.svg'} alt={p.name}
                            className="w-12 h-12 rounded-lg object-contain bg-cream"
                            onError={e => { e.target.src = '/placeholder-spice.svg'; }} />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link to={`/shop/${p.slug}`} onClick={closeDrawer}
                            className="text-xs font-semibold text-text-dark hover:text-primary transition-colors line-clamp-1">
                            {p.name}
                          </Link>
                          <p className="text-xs text-primary font-bold">{formatCurrency(p.price)}</p>
                        </div>
                        <button
                          onClick={() => {
                            useCartStore.getState().addItem(p, 1);
                            useCartStore.getState().openDrawer();
                          }}
                          className="flex-shrink-0 text-xs bg-primary text-white font-bold px-3 py-1.5 rounded-lg hover:bg-primary-dark transition-colors"
                        >
                          Add
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex gap-3 py-3 border-b border-border last:border-0 animate-fade-in"
                >
                  {/* Thumbnail */}
                  <Link
                    to={`/shop/${item.slug}`}
                    onClick={closeDrawer}
                    className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-cream-dark"
                    tabIndex={-1}
                  >
                    <img
                      src={item.image_url || '/placeholder-spice.svg'}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = '/placeholder-spice.svg'; }}
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/shop/${item.slug}`}
                      onClick={closeDrawer}
                      className="text-sm font-semibold text-text-dark hover:text-primary transition-colors line-clamp-2 leading-snug"
                    >
                      {item.name}
                    </Link>
                    {staleItems.includes(item.id) && (
                      <p className="text-[10px] text-amber-600 font-medium mt-0.5">ΓÅ░ Still want this?</p>
                    )}
                    <p className="text-xs text-text-muted mt-0.5">
                      {formatCurrency(item.price)} each
                    </p>

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1 border border-border rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          aria-label={`Decrease quantity of ${item.name}`}
                          className="w-7 h-7 flex items-center justify-center text-text-muted hover:text-primary hover:bg-cream-dark transition-colors"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-7 text-center text-sm font-semibold text-text-dark select-none">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          aria-label={`Increase quantity of ${item.name}`}
                          className="w-7 h-7 flex items-center justify-center text-text-muted hover:text-primary hover:bg-cream-dark transition-colors"
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      {/* Line total */}
                      <span className="text-sm font-bold text-primary">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.id)}
                    aria-label={`Remove ${item.name} from cart`}
                    className="self-start p-1 text-text-muted hover:text-red-600 transition-colors rounded"
                  >
                    <Trash2 size={15} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer ΓÇö totals + actions */}
        {items.length > 0 && (
          <div className="border-t border-border px-5 py-4 space-y-3 bg-white">
            {/* Minimum order progress */}
            {(() => {
              const MIN = 500;
              const pct = Math.min(100, Math.round((cartTotal / MIN) * 100));
              const remaining = Math.max(0, MIN - cartTotal);
              return (
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1" style={{ color: '#7C6B5E' }}>
                    <span>{remaining > 0 ? `Add Rs.${remaining} more for free delivery` : '≡ƒÄë You qualify for free delivery!'}</span>
                    <span className="font-bold" style={{ color: '#8B1E17' }}>{pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#EFE8DF' }}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, background: pct >= 100 ? '#22c55e' : '#8B1E17' }}
                    />
                  </div>
                </div>
              );
            })()}
            <div className="flex justify-between text-sm text-text-muted">
              <span>Subtotal ({totalItemCount} {totalItemCount === 1 ? 'item' : 'items'})</span>
              <span className="font-semibold text-text-dark">{formatCurrency(cartTotal)}</span>
            </div>
            <div className="flex justify-between font-serif font-semibold text-base">
              <span>Total</span>
              <span className="text-primary text-lg">{formatCurrency(cartTotal)}</span>
            </div>
            <p className="text-xs text-text-muted text-center">
              Cash on Delivery ┬╖ Free delivery info at checkout
            </p>
            <button
              onClick={handleCheckout}
              className="btn-primary w-full text-base py-3"
            >
              Proceed to Checkout
            </button>
            <button
              onClick={closeDrawer}
              className="btn-ghost w-full text-sm"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </motion.aside>
    </>
      )}
    </AnimatePresence>
  );
}

