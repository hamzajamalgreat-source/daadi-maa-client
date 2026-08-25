import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Phone, MapPin, Package, ArrowRight } from 'lucide-react';
import { ordersApi } from '../api/client';
import { formatCurrency } from '../utils/formatCurrency';
import OrderStatusBadge from '../components/OrderStatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

export default function OrderConfirmation() {
  const { id } = useParams();
  const [order, setOrder]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');

  useEffect(() => {
    if (!id || isNaN(parseInt(id))) {
      setError('Invalid order ID.');
      setLoading(false);
      return;
    }

    ordersApi
      .getById(id)
      .then((res) => setOrder(res.data))
      .catch((err) => setError(err.message || 'Order not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner label="Loading your order…" />;

  if (error || !order) {
    return (
      <main className="bg-cream min-h-screen container-page py-20">
        <EmptyState
          icon="📦"
          title="Order not found"
          message={error || 'We could not find this order.'}
          actionLabel="Back to Shop"
          actionTo="/shop"
        />
      </main>
    );
  }

  const subtotal = (order.items || []).reduce(
    (s, i) => s + i.unit_price * i.quantity, 0
  );

  return (
    <main className="bg-cream min-h-screen container-page py-10 sm:py-16 max-w-2xl mx-auto animate-fade-in">
      {/* Success header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-5">
          <CheckCircle size={44} className="text-primary" aria-hidden="true" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-text-dark mb-2">
          Order Placed!
        </h1>
        <p className="text-text-muted text-base">
          Thank you for your order. We'll get it to you soon.
        </p>
      </div>

      {/* Order info card */}
      <div className="card p-6 mb-6">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <div>
            <p className="text-xs text-text-muted uppercase tracking-wide">Order ID</p>
            <p className="font-mono font-bold text-text-dark text-lg">#{order.id}</p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-6">
          <div className="flex items-start gap-2">
            <Phone size={15} className="text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
            <div>
              <p className="text-text-muted text-xs">Phone</p>
              <p className="font-medium text-text-dark">{order.customer_phone}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <MapPin size={15} className="text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
            <div>
              <p className="text-text-muted text-xs">Delivery Address</p>
              <p className="font-medium text-text-dark">{order.customer_address}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Package size={15} className="text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
            <div>
              <p className="text-text-muted text-xs">Placed on</p>
              <p className="font-medium text-text-dark">
                {new Date(order.created_at).toLocaleDateString('en-PK', {
                  day: 'numeric', month: 'long', year: 'numeric',
                })}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-base mt-0.5 flex-shrink-0" aria-hidden="true">💵</span>
            <div>
              <p className="text-text-muted text-xs">Payment</p>
              <p className="font-medium text-text-dark">Cash on Delivery</p>
            </div>
          </div>
        </div>

        {/* Order items */}
        {order.items && order.items.length > 0 && (
          <div className="border-t border-border pt-5">
            <h2 className="font-semibold text-text-dark mb-3 flex items-center gap-2 text-sm">
              <Package size={15} className="text-primary" aria-hidden="true" />
              Items Ordered
            </h2>
            <ul className="space-y-2">
              {order.items.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between items-center text-sm"
                >
                  <span className="text-text-muted">
                    {item.product_name}{' '}
                    <span className="font-medium text-text-dark">× {item.quantity}</span>
                  </span>
                  <span className="font-semibold text-text-dark">
                    {formatCurrency(item.unit_price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="flex justify-between font-bold text-base mt-4 pt-4 border-t border-border">
              <span className="font-serif">Total</span>
              <span className="text-primary text-lg">{formatCurrency(subtotal)}</span>
            </div>
          </div>
        )}
      </div>

      {/* What's next */}
      <div className="card p-5 bg-cream border-l-4 border-accent mb-8 text-sm">
        <h2 className="font-semibold text-text-dark mb-2">What happens next?</h2>
        <ol className="space-y-1.5 text-text-muted list-none">
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold flex-shrink-0">1.</span>
            Our team will review your order and call you to confirm.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold flex-shrink-0">2.</span>
            Your spices will be packed and dispatched.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold flex-shrink-0">3.</span>
            Pay the delivery person when your order arrives. That's it!
          </li>
        </ol>
        <p className="mt-3 text-text-muted">
          Questions? Call us at{' '}
          <a href="tel:03149007440" className="text-primary font-medium hover:underline">
            0314-9007440
          </a>
        </p>
      </div>

      {/* CTA */}
      <div className="text-center">
        <Link to="/shop" className="btn-primary text-base px-8 py-3">
          Continue Shopping
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </div>
    </main>
  );
}

