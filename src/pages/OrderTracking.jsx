import { useState } from 'react';
import { Phone, Search, Package, CheckCircle, Clock, Truck, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatCurrency } from '../utils/formatCurrency';

const STATUS_CONFIG = {
  pending:    { label: 'Pending',    color: '#D97706', bg: '#FEF3C7', Icon: Clock },
  processing: { label: 'Processing', color: '#3B82F6', bg: '#DBEAFE', Icon: Package },
  shipped:    { label: 'Dispatched', color: '#8B5CF6', bg: '#EDE9FE', Icon: Truck },
  delivered:  { label: 'Delivered',  color: '#22C55E', bg: '#DCFCE7', Icon: CheckCircle },
  cancelled:  { label: 'Cancelled',  color: '#EF4444', bg: '#FEE2E2', Icon: XCircle },
};

export default function OrderTracking() {
  const [phone, setPhone]     = useState('');
  const [orders, setOrders]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phone.trim()) return;
    setLoading(true); setError(''); setOrders(null);
    try {
      const res = await fetch('/api/orders/track?phone=' + encodeURIComponent(phone.trim()));
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not find orders.');
      setOrders(data);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-cream min-h-screen">
      <div className="container-page py-12 max-w-lg mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-8"
        >
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow"
            style={{ background: '#8B1E17' }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
          >
            <Package size={32} className="text-white" />
          </motion.div>
          <h1 className="font-serif text-3xl font-bold mb-2" style={{ color: '#23120B' }}>
            Track Your Order
          </h1>
          <p className="text-sm" style={{ color: '#7C6B5E' }}>
            Enter the phone number you used when placing your order.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="card p-6 mb-6"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="track-phone" className="form-label">Phone Number</label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                <input
                  id="track-phone"
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="e.g. 0314-9007440"
                  className="form-input pl-10"
                  required
                />
              </div>
            </div>
            <motion.button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              {loading
                ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <Search size={16} />
              }
              {loading ? 'Searching...' : 'Find My Orders'}
            </motion.button>
          </form>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 text-center"
          >
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </motion.div>
        )}

        <AnimatePresence>
          {orders !== null && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {orders.length === 0 ? (
                <div className="card p-6 text-center">
                  <p className="text-2xl mb-3">📦</p>
                  <p className="font-semibold mb-1" style={{ color: '#23120B' }}>No orders found</p>
                  <p className="text-sm mb-4" style={{ color: '#7C6B5E' }}>
                    No orders placed with <strong>{phone}</strong>.
                  </p>
                  <a href="tel:03149007440" className="btn-primary inline-flex py-2.5 text-sm">
                    <Phone size={14} /> Call 0314-9007440 for help
                  </a>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm font-semibold" style={{ color: '#7C6B5E' }}>
                    Found {orders.length} order{orders.length !== 1 ? 's' : ''} for {phone}
                  </p>

                  {orders.map((order, i) => {
                    const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                    const Icon = cfg.Icon;
                    return (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="card p-5"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <p className="text-xs text-text-muted uppercase tracking-wide">Order ID</p>
                            <p className="font-mono font-bold text-2xl" style={{ color: '#8B1E17' }}>
                              #{order.id}
                            </p>
                            <p className="text-xs mt-0.5" style={{ color: '#7C6B5E' }}>
                              {new Date(order.created_at).toLocaleDateString('en-PK', {
                                day: 'numeric', month: 'long', year: 'numeric'
                              })}
                            </p>
                          </div>
                          <span
                            className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full"
                            style={{ background: cfg.bg, color: cfg.color }}
                          >
                            <Icon size={12} /> {cfg.label}
                          </span>
                        </div>

                        {order.items && order.items.length > 0 && (
                          <div className="border-t border-border pt-3 mb-3">
                            <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">Items</p>
                            <ul className="space-y-1">
                              {order.items.map((item, j) => (
                                <li key={j} className="flex justify-between text-sm">
                                  <span style={{ color: '#7C6B5E' }}>
                                    {item.product_name}
                                    <span className="font-medium ml-1" style={{ color: '#23120B' }}>
                                      x{item.quantity}
                                    </span>
                                  </span>
                                  <span className="font-semibold" style={{ color: '#23120B' }}>
                                    {formatCurrency(item.unit_price * item.quantity)}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-3 border-t border-border">
                          <span className="text-sm font-bold" style={{ color: '#23120B' }}>Total</span>
                          <span className="font-bold text-lg" style={{ color: '#8B1E17' }}>
                            {formatCurrency(order.total_amount)}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}

                  <div className="card p-4 text-center">
                    <p className="text-xs mb-3" style={{ color: '#7C6B5E' }}>
                      Save your Order ID — reference it when calling us
                    </p>
                    <a href="tel:03149007440" className="btn-primary inline-flex py-2.5 text-sm">
                      <Phone size={14} /> Call 0314-9007440
                    </a>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}