import { useState, useEffect, useCallback, useRef } from 'react';
import {
  RefreshCw, Search, X, ChevronDown, ChevronUp,
  Trash2, ChevronLeft, ChevronRight, Bell, Phone,
  MapPin, MessageSquare, Package, Calendar,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { ordersApi } from '../api/client';
import { formatCurrency } from '../utils/formatCurrency';
import OrderStatusBadge from '../components/OrderStatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { AdminShell } from './AdminDashboard';

const STATUSES   = ['', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const STATUS_LABEL = {
  '': 'All', pending: 'Pending', processing: 'Processing',
  shipped: 'Shipped', delivered: 'Delivered', cancelled: 'Cancelled',
};
const STATUS_COUNTS_KEY = {
  pending: 'pendingOrders', processing: 'processingOrders',
  shipped: 'shippedOrders', delivered: 'deliveredOrders', cancelled: 'cancelledOrders',
};
const PAGE_SIZE = 15;

// ─── Order Detail Modal ────────────────────────────────────────────────────────
function OrderModal({ order, onClose, onStatusChange }) {
  const [status, setStatus]   = useState(order.status);
  const [saving, setSaving]   = useState(false);

  useEffect(() => {
    const esc = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', esc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', esc);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleSave = async () => {
    if (status === order.status) { onClose(); return; }
    setSaving(true);
    try {
      const res = await ordersApi.updateStatus(order.id, status);
      toast.success(`Order #${order.id} → ${status}`);
      onStatusChange(res.data);
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const subtotal = (order.items || []).reduce((s, i) => s + i.unit_price * i.quantity, 0);

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div role="dialog" aria-modal="true" aria-label={`Order #${order.id} details`}
           className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh]
                        overflow-y-auto scrollbar-thin animate-fade-in">

          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
            <div>
              <h2 className="font-bold text-gray-800 text-lg">Order #{order.id}</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {new Date(order.created_at).toLocaleString('en-PK', {
                  day: 'numeric', month: 'long', year: 'numeric',
                  hour: '2-digit', minute: '2-digit',
                })}
              </p>
            </div>
            <button onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600">
              <X size={18} />
            </button>
          </div>

          <div className="px-6 py-5 space-y-5">
            {/* Customer info */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-2.5">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Customer Details
              </h3>
              <div className="flex items-center gap-2.5 text-sm">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">
                    {order.customer_name?.[0]?.toUpperCase()}
                  </span>
                </div>
                <span className="font-semibold text-gray-800">{order.customer_name}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone size={13} className="text-primary flex-shrink-0" />
                <a href={`tel:${order.customer_phone}`} className="hover:text-primary transition-colors">
                  {order.customer_phone}
                </a>
              </div>
              {order.customer_email && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-primary text-xs">@</span>
                  {order.customer_email}
                </div>
              )}
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <MapPin size={13} className="text-primary flex-shrink-0 mt-0.5" />
                {order.customer_address}
              </div>
              {order.notes && (
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <MessageSquare size={13} className="text-primary flex-shrink-0 mt-0.5" />
                  <span className="italic">{order.notes}</span>
                </div>
              )}
            </div>

            {/* Items */}
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Items Ordered
              </h3>
              <div className="space-y-2">
                {(order.items || []).map(item => (
                  <div key={item.id}
                       className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 bg-cream rounded-lg flex items-center justify-center flex-shrink-0">
                        <Package size={13} className="text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-700 truncate">{item.product_name}</p>
                        <p className="text-xs text-gray-400">
                          {formatCurrency(item.unit_price)} × {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-semibold text-gray-800 text-sm flex-shrink-0 ml-2">
                      {formatCurrency(item.unit_price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
                <span className="font-bold text-gray-700">Total</span>
                <span className="font-bold text-lg text-primary">{formatCurrency(subtotal)}</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">Payment: Cash on Delivery</p>
            </div>

            {/* Status update */}
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Update Status
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {STATUSES.filter(Boolean).map(s => (
                  <button
                    key={s}
                    onClick={() => setStatus(s)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold capitalize border-2 transition-all
                      ${status === s
                        ? 'border-primary bg-primary text-white'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-primary/50'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button onClick={onClose} className="flex-1 btn-ghost border border-gray-200">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 btn-primary">
                {saving ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving…</>
                ) : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Main AdminOrders page ─────────────────────────────────────────────────────
export default function AdminOrders() {
  const [orders, setOrders]       = useState([]);
  const [total, setTotal]         = useState(0);
  const [statusFilter, setStatus] = useState('');
  const [searchInput, setSearch]  = useState('');
  const [page, setPage]           = useState(1);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [selectedOrder, setSelected] = useState(null);
  const [deleting, setDeleting]   = useState(null);
  const [newOrderCount, setNewOrderCount] = useState(0);
  const prevTotalRef = useRef(null);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const fetchOrders = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError('');
    try {
      const params = { page, limit: PAGE_SIZE };
      if (statusFilter) params.status = statusFilter;
      if (searchInput.trim()) params.search = searchInput.trim();
      const res = await ordersApi.getAll(params);
      const { orders: newOrders, total: newTotal } = res.data;

      // Detect new orders for notification badge
      if (prevTotalRef.current !== null && newTotal > prevTotalRef.current && page === 1 && !statusFilter) {
        const diff = newTotal - prevTotalRef.current;
        setNewOrderCount(c => c + diff);
        toast(`🛒 ${diff} new order${diff > 1 ? 's' : ''} received!`, {
          icon: '🔔',
          style: { fontWeight: '600' },
        });
      }
      prevTotalRef.current = newTotal;

      setOrders(newOrders);
      setTotal(newTotal);
    } catch (err) {
      setError(err.message || 'Failed to load orders.');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, searchInput]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Live poll every 30 seconds
  useEffect(() => {
    const timer = setInterval(() => fetchOrders(true), 30000);
    return () => clearInterval(timer);
  }, [fetchOrders]);

  const handleStatusChange = (updated) => {
    setOrders(prev => prev.map(o => o.id === updated.id ? { ...o, ...updated } : o));
  };

  const handleDelete = async (order) => {
    if (!window.confirm(`Delete Order #${order.id} from ${order.customer_name}?\n\nThis cannot be undone.`)) return;
    setDeleting(order.id);
    try {
      await ordersApi.delete(order.id);
      setOrders(prev => prev.filter(o => o.id !== order.id));
      setTotal(t => t - 1);
      toast.success(`Order #${order.id} deleted.`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(null);
    }
  };

  const handleFilterChange = (s) => {
    setStatus(s);
    setPage(1);
    setNewOrderCount(0);
  };

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => { setPage(1); }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  return (
    <AdminShell title="">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <h1 className="font-serif text-2xl font-bold text-gray-800">Orders</h1>
          {newOrderCount > 0 && (
            <span className="flex items-center gap-1.5 bg-red-500 text-white text-xs font-bold
                             px-2.5 py-1 rounded-full animate-pulse">
              <Bell size={11} /> {newOrderCount} new
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">{total} total</span>
          <button onClick={() => fetchOrders()}
            disabled={loading}
            className="flex items-center gap-1.5 text-sm bg-white border border-gray-200
                       text-gray-600 hover:text-gray-800 px-3 py-1.5 rounded-lg transition-colors">
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        {/* Status tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin flex-1">
          {STATUSES.map(s => (
            <button key={s}
              onClick={() => handleFilterChange(s)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-semibold
                          border transition-all duration-150
                          ${statusFilter === s
                            ? 'bg-primary text-white border-primary'
                            : 'bg-white text-gray-500 border-gray-200 hover:border-primary/40 hover:text-primary'}`}>
              {STATUS_LABEL[s]}
            </button>
          ))}
        </div>
        {/* Search */}
        <div className="relative w-full sm:w-56 flex-shrink-0">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="search"
            value={searchInput}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search name or phone…"
            className="w-full pl-8 pr-8 py-2 text-sm border border-gray-200 rounded-lg bg-white
                       focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
          />
          {searchInput && (
            <button onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <LoadingSpinner label="Loading orders…" />
      ) : error ? (
        <EmptyState icon="⚠️" title="Failed to load orders" message={error}
          actionLabel="Retry" onAction={() => fetchOrders()} />
      ) : orders.length === 0 ? (
        <EmptyState icon="📦" title="No orders found"
          message={statusFilter || searchInput ? 'Try changing your filters.' : 'No orders have been placed yet.'} />
      ) : (
        <>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm" aria-label="Orders table">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-left">
                    {['#', 'Customer', 'Items', 'Total', 'Status', 'Date', ''].map(h => (
                      <th key={h}
                          className="px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.map(order => (
                    <tr key={order.id}
                        className="hover:bg-blue-50/30 transition-colors cursor-pointer"
                        onClick={() => setSelected(order)}>
                      <td className="px-4 py-3 font-mono font-bold text-gray-700 text-xs">
                        #{order.id}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-gray-800 text-xs">{order.customer_name}</p>
                        <p className="text-gray-400 text-[10px]">{order.customer_phone}</p>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        <div className="flex flex-col gap-0.5">
                          {(order.items || []).slice(0, 2).map((item, i) => (
                            <span key={i} className="truncate max-w-[140px]">
                              {item.product_name} ×{item.quantity}
                            </span>
                          ))}
                          {(order.items || []).length > 2 && (
                            <span className="text-primary font-medium">
                              +{order.items.length - 2} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-bold text-primary text-xs whitespace-nowrap">
                        {formatCurrency(order.total_amount)}
                      </td>
                      <td className="px-4 py-3">
                        <OrderStatusBadge status={order.status} />
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-[10px] whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Calendar size={10} />
                          {new Date(order.created_at).toLocaleDateString('en-PK', {
                            day: 'numeric', month: 'short',
                          })}
                        </div>
                      </td>
                      <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => handleDelete(order)}
                          disabled={deleting === order.id}
                          aria-label={`Delete order #${order.id}`}
                          className="p-1.5 rounded-lg text-gray-300 hover:text-red-500
                                     hover:bg-red-50 transition-colors disabled:opacity-40">
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between text-sm">
              <p className="text-gray-400 text-xs">
                Page {page} of {totalPages} · {total} orders
              </p>
              <div className="flex gap-1.5">
                <button onClick={() => setPage(p => p - 1)} disabled={page <= 1}
                  className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50
                             disabled:opacity-40 transition-colors">
                  <ChevronLeft size={14} />
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const p = Math.max(1, Math.min(page - 2 + i, totalPages - 4 + i));
                  return (
                    <button key={p} onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-lg text-xs font-medium border transition-colors
                        ${page === p
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-600'}`}>
                      {p}
                    </button>
                  );
                })}
                <button onClick={() => setPage(p => p + 1)} disabled={page >= totalPages}
                  className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50
                             disabled:opacity-40 transition-colors">
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Order detail modal */}
      {selectedOrder && (
        <OrderModal
          order={selectedOrder}
          onClose={() => setSelected(null)}
          onStatusChange={updated => {
            handleStatusChange(updated);
            setSelected(null);
          }}
        />
      )}
    </AdminShell>
  );
}
