import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart, Menu, X, Search } from "lucide-react";
import useCartStore from "../store/cartStore";
import { motion, AnimatePresence } from "motion/react";

export default function Navbar() {
  const { items, openDrawer } = useCartStore();
  const [scrolled, setScrolled]       = useState(false);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [searchOpen, setSearchOpen]   = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location  = useLocation();
  const navigate  = useNavigate();
  const searchRef = useRef(null);
  const totalItems = items.reduce((s, i) => s + i.quantity, 0);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  // Auto-focus search input when opened
  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  // Close search on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setSearchOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  const navLinks = [
    { to: "/",     label: "Home",  exact: true  },
    { to: "/shop", label: "Shop",  exact: false },
    { to: "/track", label: "Track", exact: false },
  ];

  return (
    <motion.header
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`sticky top-0 z-30 bg-white transition-all duration-300 ${
        scrolled ? "shadow-md border-b border-border/40" : "border-b border-border"
      }`}
    >
      <div className="container-page">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 rounded-lg p-1"
            aria-label="Daadi Maa Spices â€” Home">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center
                            flex-shrink-0 shadow-sm border border-border overflow-hidden">
              <img src="/daadi-maa-logo.png" alt="Daadi Maa logo"
                width={36} height={36} className="w-9 h-9 object-contain" />
            </div>
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="font-serif font-bold text-text-dark text-base leading-none italic"
                style={{ color: "#8B1E17" }}>
                Daadi Maa
              </span>
              <span className="text-[10px] text-text-muted tracking-wide leading-tight mt-0.5">
                Natural, Pure, Safe
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {navLinks.map(({ to, label, exact }) => (
              <NavLink key={to} to={to} end={exact}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                    isActive
                      ? "text-primary bg-cream-dark font-semibold"
                      : "text-text-muted hover:text-text-dark hover:bg-cream"
                  }`
                }>{label}</NavLink>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            {/* Inline search â€” expands when open */}
            {searchOpen ? (
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-1 animate-fade-in">
                <input
                  ref={searchRef}
                  type="search"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search spices..."
                  className="w-40 sm:w-52 px-3 py-1.5 rounded-lg border text-sm bg-cream focus:outline-none focus:ring-2 focus:ring-primary"
                  style={{ borderColor: '#EFE8DF', color: '#23120B' }}
                  aria-label="Search products"
                />
                <button type="submit" aria-label="Submit search"
                  className="p-2 rounded-lg text-text-muted hover:text-primary hover:bg-cream-dark transition-colors">
                  <Search size={18} />
                </button>
                <button type="button" onClick={() => setSearchOpen(false)} aria-label="Close search"
                  className="p-2 rounded-lg text-text-muted hover:text-primary hover:bg-cream-dark transition-colors">
                  <X size={18} />
                </button>
              </form>
            ) : (
              <motion.button onClick={() => setSearchOpen(true)} aria-label="Open search" whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.90 }}
                className="p-2.5 rounded-lg text-text-muted hover:text-primary hover:bg-cream-dark transition-colors hidden sm:flex">
                <Search size={20} />
              </motion.button>
            )}
            <motion.button onClick={openDrawer}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.90 }}
              aria-label={`Shopping cart — ${totalItems} item${totalItems !== 1 ? "s" : ""}`}
              className="relative p-2.5 rounded-lg text-text-muted hover:text-primary hover:bg-cream-dark transition-colors">
              <ShoppingCart size={22} />
              {totalItems > 0 && (
                <motion.span
                  key={totalItems}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                  className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center px-0.5">
                  {totalItems > 99 ? "99+" : totalItems}
                </motion.span>
              )}
            </motion.button>
            <button onClick={() => setMobileOpen(v => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen} aria-controls="mobile-nav"
              className="md:hidden p-2.5 rounded-lg text-text-muted hover:text-primary hover:bg-cream-dark transition-colors">
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
        <motion.nav id="mobile-nav"
          initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.22, ease: "easeInOut" }}
          className="md:hidden border-t border-border bg-white px-4 py-3 space-y-1 animate-fade-in"
          aria-label="Mobile navigation">
          {navLinks.map(({ to, label, exact }) => (
            <NavLink key={to} to={to} end={exact}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? "text-primary bg-cream-dark font-semibold" : "text-text-muted hover:text-text-dark hover:bg-cream"
                }`
              }>{label}</NavLink>
          ))}
        </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

