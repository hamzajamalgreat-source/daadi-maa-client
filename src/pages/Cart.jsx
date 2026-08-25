import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react';
import useCartStore from '../store/cartStore';
import { formatCurrency, roundCurrency } from '../utils/formatCurrency';
import EmptyState from '../components/EmptyState';

export default function Cart() {
  const { items, updateQuantity, removeItem, clearCart } = useCartStore();
  const navigate = useNavigate();

  const subtotal = roundCurrency(items.reduce((s, i) => s + i.price * i.quantity, 0));
  const totalItems = items.reduce((s, i) => s + i.quantity, 0);

  if (items.length === 0) {
    return (
      <main className="bg-cream min-h-screen container-page py-20">
        <EmptyState
          icon="🛒"
          title="Your cart is empty"
          message="You haven't added any spices yet. Head to the shop to explore our products."
          actionLabel="Browse Spices"
          actionTo="/shop"
        />
      </main>
    );
  }

  return (
    <main className="bg-cream min-h-screen container-page py-8 sm:py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="section-title mb-1">Your Cart</h1>
          <p className="text-text-muted text-sm">
            {totalItems} {totalItems === 1 ? 'item' : 'items'}
          </p>
        </div>
        <button
          onClick={() => {
            if (window.confirm('Remove all items from your cart?')) clearCart();
          }}
          className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2">
          <ul className="space-y-4" aria-label="Cart items">
            {items.map((item) => (
              <li key={item.id} className="card p-4 flex gap-4 animate-fade-in">
                {/* Image */}
                <Link
                  to={`/shop/${item.slug}`}
                  className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-cream-dark"
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
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      to={`/shop/${item.slug}`}
                      className="font-semibold text-text-dark hover:text-primary transition-colors text-sm sm:text-base leading-snug"
                    >
                      {item.name}
                    </Link>
                    <button
                      onClick={() => removeItem(item.id)}
                      aria-label={`Remove ${item.name}`}
                      className="flex-shrink-0 p-1 text-text-muted hover:text-red-600 transition-colors rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {item.category_name && (
                    <p className="text-xs text-text-muted mt-0.5">{item.category_name}</p>
                  )}

                  <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                    {/* Quantity controls */}
                    <div
                      className="flex items-center border border-border rounded-lg overflow-hidden"
                      role="group"
                      aria-label={`Quantity for ${item.name}`}
                    >
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        aria-label="Decrease quantity"
                        className="w-8 h-8 flex items-center justify-center text-text-muted hover:text-primary hover:bg-cream-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="w-9 text-center text-sm font-semibold text-text-dark select-none py-1">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= 99}
                        aria-label="Increase quantity"
                        className="w-8 h-8 flex items-center justify-center text-text-muted hover:text-primary hover:bg-cream-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    {/* Line total */}
                    <div className="text-right">
                      <p className="text-xs text-text-muted">{formatCurrency(item.price)} each</p>
                      <p className="font-bold text-primary">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* Continue shopping */}
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-primary transition-colors mt-6"
          >
            <ArrowLeft size={15} aria-hidden="true" />
            Continue Shopping
          </Link>
        </div>

        {/* Order summary */}
        <aside className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="font-serif font-semibold text-lg text-text-dark mb-5 flex items-center gap-2">
              <ShoppingBag size={18} className="text-primary" aria-hidden="true" />
              Order Summary
            </h2>

            {/* Line items summary */}
            <ul className="space-y-2 mb-4 text-sm">
              {items.map((item) => (
                <li key={item.id} className="flex justify-between text-text-muted">
                  <span className="truncate mr-2">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="flex-shrink-0 font-medium text-text-dark">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="border-t border-border pt-4 space-y-2">
              <div className="flex justify-between text-sm text-text-muted">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-text-muted">
                <span>Delivery</span>
                <span className="text-green-700 font-medium">COD</span>
              </div>
              <div className="flex justify-between font-serif font-bold text-lg pt-2 border-t border-border">
                <span>Total</span>
                <span className="text-primary">{formatCurrency(subtotal)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="btn-primary w-full mt-5 py-3 text-base"
            >
              Proceed to Checkout
            </button>

            <p className="text-xs text-text-muted text-center mt-3">
              Cash on Delivery · No online payment required
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}

