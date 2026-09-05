import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, ShoppingCart, Search } from 'lucide-react';
import useCartStore from '../store/cartStore';

export default function BottomNav() {
  const { items, openDrawer } = useCartStore();
  const navigate = useNavigate();
  const location = useLocation();
  const totalItems = items.reduce((s, i) => s + i.quantity, 0);

  // Hide on admin pages
  if (location.pathname.startsWith('/admin')) return null;

  const activeStyle = { color: '#8B1E17' };
  const inactiveStyle = { color: '#7C6B5E' };

  const linkClass = ({ isActive }) =>
    `flex flex-col items-center gap-0.5 text-[10px] font-medium transition-colors py-1 px-2 ${
      isActive ? 'text-primary' : 'text-text-muted'
    }`;

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-white border-t flex items-center justify-around h-16 safe-bottom"
      style={{ borderColor: '#EFE8DF' }}
      aria-label="Bottom navigation"
    >
      <NavLink to="/" end className={linkClass} style={({ isActive }) => isActive ? activeStyle : inactiveStyle}>
        <Home size={22} />
        <span>Home</span>
      </NavLink>

      <NavLink to="/shop" className={linkClass} style={({ isActive }) => isActive ? activeStyle : inactiveStyle}>
        <ShoppingBag size={22} />
        <span>Shop</span>
      </NavLink>

      <button
        onClick={openDrawer}
        aria-label={`Cart — ${totalItems} item${totalItems !== 1 ? 's' : ''}`}
        className="flex flex-col items-center gap-0.5 text-[10px] font-medium relative py-1 px-2"
        style={inactiveStyle}
      >
        <span className="relative">
          <ShoppingCart size={22} />
          {totalItems > 0 && (
            <span className="absolute -top-1.5 -right-2 min-w-[16px] h-[16px] bg-primary text-white
                             text-[9px] font-bold rounded-full flex items-center justify-center px-0.5">
              {totalItems > 99 ? '99+' : totalItems}
            </span>
          )}
        </span>
        <span>Cart</span>
      </button>

      <button
        onClick={() => navigate('/shop?search=open')}
        aria-label="Search products"
        className="flex flex-col items-center gap-0.5 text-[10px] font-medium py-1 px-2"
        style={inactiveStyle}
      >
        <Search size={22} />
        <span>Search</span>
      </button>
    </nav>
  );
}
