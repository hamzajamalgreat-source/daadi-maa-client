import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag, Clock, Package, CheckCircle, TrendingUp,
  ArrowRight, LogOut, RefreshCw, Users, DollarSign,
  AlertCircle, Truck, XCircle, BarChart2,
} from 'lucide-react';
import { ordersApi } from '../api/client';
import { formatCurrency } from '../utils/formatCurrency';
import OrderStatusBadge from '../components/OrderStatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import useAuthStore from '../store/authStore';

// ─── Admin Layout Shell ────────────────────────────────────────────────────────
export function AdminShell({ children, title }) {
  const { username, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top bar */}
      <header className="bg-[#2D1810] text-white px-4 sm:px-6 py-0 flex items-center justify-between h-14 flex-shrink-0 shadow-lg z-20">
        <div className="flex items-center gap-3">
          <img
            src="/daadi-maa-logo.png"
            alt="Daadi Maa"
            className="w-8 h-8 object-contain"
            style={{ mixBlendMode: 'screen' }}
          />
          <div className="hidden sm:block">
            <p className="text-sm font-bold leading-tight text-white">Daadi Maa Admin</p>
            <p className="text-[10px] text-white/50 leading-tight">F & J Sons Foods</p>
          </div>
        </div>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Admin navigation">
          {[
            { to: '/admin',          label: 'Dashboard' },
            { to: '/admin/orders',   label: 'Orders' },
            { to: '/admin/products', label: 'Products' },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
                ${window.location.pathname === to
                  ? 'bg-white/15 text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/10'}`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/" className="text-xs text-white/50 hover:text-white transition-colors hidden sm:block">
            ← Storefront
          </Link>
          <span className="text-xs text-white/40 hidden sm:block">|</span>
          <span className="text-xs text-white/70 hidden sm:block">{username}</span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs bg-white/10 hover:bg-white/20 text-white/80
                       hover:text-white px-3 py-1.5 rounded-lg transition-colors"
          >
            <LogOut size={13} />
            Logout
          </button>
        </div>
      </header>

      {/* Mobile nav */}
      <div className="md:hidden bg-[#3D2010] px-4 py-2 flex gap-2">
        {[
          { to: '/admin',          label: 'Dashboard' },
          { to: '/admin/orders',   label: 'Orders' },
          { to: '/admin/products', label: 'Products' },
        ].map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors
              ${window.location.pathname === to
                ? 'bg-white/20 text-white'
                : 'text-white/60 hover:text-white'}`}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Page content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {title && (
          <h1 className="font-serif text-2xl font-bold text-gray-800 mb-6">{title}</h1>
        )}
        {children}
      </main>
    </div>
  );
}

// ─── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, colour, border }) {
  return (
    <div className={`bg-white rounded-xl p-5 shadow-sm border-l-4 ${border} flex items-start gap-4`}>
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${colour}`}>
        <Icon size={20} className="text-white" aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
        <p className="font-bold text-2xl text-gray-800 mt-0.5 leading-tight">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ─── Mini bar chart ────────────────────────────────────────────────────────────
function MiniBarChart({ data }) {
  if (!data?.length) return <p className="text-sm text-gray-400 text-center py-8">No data yet</p>;
  const max = Math.max(...data.map(d => d.revenue), 1);

  return (
    <div className="flex items-end gap-1.5 h-24 w-full">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
          <div className="relative w-full">
            {/* Tooltip */}
            <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2
                           bg-gray-800 text-white text-[10px] rounded px-1.5 py-0.5
                           whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
              {formatCurrency(d.revenue)} ({d.orders} orders)
            </div>
            <div
              className="w-full rounded-t-sm bg-primary/80 hover:bg-primary transition-all duration-200"
              style={{ height: `${Math.max(4, (d.revenue / max) * 80)}px` }}
            />
          </div>
          <span className="text-[9px] text-gray-400 leading-tight">
            {new Date(d.day + 'T00:00:00').toLocaleDateString('en-PK', { weekday: 'short' })}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Dashboard page ────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchStats = useCallback(async () => {
    setError('');
    try {
      const res = await ordersApi.getStats();
      setStats(res.data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message || 'Failed to load dashboard stats.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    // Auto-refresh every 60 seconds
    const timer = setInterval(fetchStats, 60000);
    return () => clearInterval(timer);
  }, [fetchStats]);

  return (
    <AdminShell title="Dashboard">
      <div className="flex items-center justify-between mb-6">
        <div>
          {lastUpdated && (
            <p className="text-xs text-gray-400">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
        <button
          onClick={() => { setLoading(true); fetchStats(); }}
          disabled={loading}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700
                     bg-white border border-gray-200 px-3 py-1.5 rounded-lg transition-colors"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {loading && !stats ? (
        <LoadingSpinner label="Loading dashboard…" />
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <AlertCircle size={32} className="text-red-400 mx-auto mb-2" />
          <p className="text-red-700 font-medium">{error}</p>
          <button onClick={fetchStats} className="btn-primary mt-4 text-sm">Retry</button>
        </div>
      ) : stats ? (
        <div className="space-y-6">

          {/* ── Stat cards ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={ShoppingBag}  label="Total Orders"    value={stats.totalOrders}     colour="bg-primary"     border="border-primary"    sub={`${stats.todayOrders} today`} />
            <StatCard icon={Clock}        label="Pending"         value={stats.pendingOrders}   colour="bg-amber-500"   border="border-amber-400"  sub="Need action" />
            <StatCard icon={Package}      label="Processing"      value={stats.processingOrders} colour="bg-blue-500"   border="border-blue-400" />
            <StatCard icon={CheckCircle}  label="Delivered"       value={stats.deliveredOrders} colour="bg-green-600"   border="border-green-500" />
          </div>

          {/* ── Revenue row ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-700 flex items-center gap-2">
                  <BarChart2 size={16} className="text-primary" /> Revenue (last 7 days)
                </h2>
                <span className="text-xs text-gray-400">Hover bars for details</span>
              </div>
              <MiniBarChart data={stats.dailyRevenue} />
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Total Revenue</p>
                <p className="font-bold text-3xl text-primary leading-tight">
                  {formatCurrency(stats.totalRevenue)}
                </p>
                <p className="text-xs text-gray-400 mt-1">Excludes cancelled orders</p>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Today</p>
                <p className="font-bold text-xl text-green-600">{formatCurrency(stats.todayRevenue)}</p>
              </div>
            </div>
          </div>

          {/* ── Top products + quick links ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Top selling */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <h2 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <TrendingUp size={16} className="text-accent" /> Top Products
              </h2>
              {stats.topProducts?.length ? (
                <ul className="space-y-2">
                  {stats.topProducts.map((p, i) => (
                    <li key={i} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px]
                                         font-bold flex-shrink-0 text-white
                                         ${i === 0 ? 'bg-accent' : i === 1 ? 'bg-gray-400' : 'bg-gray-300'}`}>
                          {i + 1}
                        </span>
                        <span className="text-gray-700 truncate">{p.product_name}</span>
                      </div>
                      <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                        {p.total_qty} sold
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-400">No sales yet</p>
              )}
            </div>

            {/* Order status breakdown */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <h2 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <Package size={16} className="text-blue-500" /> Order Status
              </h2>
              <div className="space-y-2.5">
                {[
                  { label: 'Pending',    value: stats.pendingOrders,    bar: 'bg-amber-400' },
                  { label: 'Processing', value: stats.processingOrders, bar: 'bg-blue-400' },
                  { label: 'Shipped',    value: stats.shippedOrders,    bar: 'bg-purple-400' },
                  { label: 'Delivered',  value: stats.deliveredOrders,  bar: 'bg-green-500' },
                  { label: 'Cancelled',  value: stats.cancelledOrders,  bar: 'bg-red-400' },
                ].map(({ label, value, bar }) => {
                  const pct = stats.totalOrders ? Math.round((value / stats.totalOrders) * 100) : 0;
                  return (
                    <div key={label}>
                      <div className="flex justify-between text-xs text-gray-500 mb-0.5">
                        <span>{label}</span>
                        <span className="font-medium text-gray-700">{value} ({pct}%)</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full ${bar} rounded-full transition-all duration-700`}
                             style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Quick navigation ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link to="/admin/orders"
              className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex items-center
                         justify-between group hover:shadow-md hover:border-primary/20 transition-all">
              <div>
                <p className="font-semibold text-gray-800 group-hover:text-primary transition-colors">
                  Manage Orders
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {stats.pendingOrders > 0
                    ? `⚠️ ${stats.pendingOrders} pending order${stats.pendingOrders > 1 ? 's' : ''} need attention`
                    : 'View all orders, update status'}
                </p>
              </div>
              <ArrowRight size={18} className="text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </Link>
            <Link to="/admin/products"
              className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex items-center
                         justify-between group hover:shadow-md hover:border-primary/20 transition-all">
              <div>
                <p className="font-semibold text-gray-800 group-hover:text-primary transition-colors">
                  Manage Products
                </p>
                <p className="text-xs text-gray-400 mt-0.5">Add, edit, toggle stock</p>
              </div>
              <ArrowRight size={18} className="text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </Link>
          </div>

          {/* ── Recent orders table ── */}
          {stats.recentOrders?.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-semibold text-gray-700">Recent Orders</h2>
                <Link to="/admin/orders"
                  className="text-xs text-primary hover:underline flex items-center gap-1 font-medium">
                  View all <ArrowRight size={12} />
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm" aria-label="Recent orders">
                  <thead>
                    <tr className="bg-gray-50 text-left border-b border-gray-100">
                      {['#', 'Customer', 'Items', 'Total', 'Status', 'Date'].map(h => (
                        <th key={h} className="px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {stats.recentOrders.map(order => (
                      <tr key={order.id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="px-4 py-3 font-mono font-bold text-gray-700 text-xs">
                          #{order.id}
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-800 text-xs">{order.customer_name}</p>
                          <p className="text-gray-400 text-[10px]">{order.customer_phone}</p>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-500">
                          {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}
                        </td>
                        <td className="px-4 py-3 font-semibold text-primary text-xs">
                          {formatCurrency(order.total_amount)}
                        </td>
                        <td className="px-4 py-3">
                          <OrderStatusBadge status={order.status} />
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-[10px] whitespace-nowrap">
                          {new Date(order.created_at).toLocaleDateString('en-PK', {
                            day: 'numeric', month: 'short', year: 'numeric',
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </AdminShell>
  );
}
