import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import useCartStore from '../store/cartStore';
import { formatCurrency } from '../utils/formatCurrency';

const BADGE_STYLES = {
  'Bestseller':       'bg-accent text-white',
  'Popular':          'bg-primary text-white',
  'Premium':          'bg-brand-dark text-white',
  'Regional Special': 'bg-primary-light text-white',
};

export default function ProductCard({ product }) {
  const { addItem, openDrawer } = useCartStore();
  const [imgLoaded, setImgLoaded] = useState(false);
  const [adding, setAdding] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.in_stock || adding) return;

    setAdding(true);
    addItem(product, 1);
    toast.success(`${product.name} added to cart`, { icon: '🛒' });
    openDrawer();
    setTimeout(() => setAdding(false), 600);
  };

  return (
    <article className="group relative bg-white rounded-card shadow-card border border-border
                        flex flex-col overflow-hidden
                        transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1.5">

      {/* ── Image area — fixed square, object-contain, all same size ───── */}
      <Link
        to={`/shop/${product.slug}`}
        className="relative block overflow-hidden bg-white"
        style={{ aspectRatio: '1/1' }}
        aria-label={`View ${product.name}`}
      >
        {/* Loading skeleton */}
        {!imgLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-cream to-cream-dark animate-pulse" />
        )}

        {/* Product image — object-contain keeps full image visible at same size */}
        <img
          src={product.image_url || '/placeholder-spice.svg'}
          alt={product.name}
          onLoad={() => setImgLoaded(true)}
          onError={e => { e.target.src = '/placeholder-spice.svg'; setImgLoaded(true); }}
          className={`absolute inset-0 w-full h-full object-contain p-4 transition-transform duration-500
                      group-hover:scale-105 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
        />

        {/* Badge */}
        {product.badge && (
          <span className={`absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full text-[11px]
                           font-bold shadow-sm z-10 ${BADGE_STYLES[product.badge] || 'bg-primary text-white'}`}>
            {product.badge}
          </span>
        )}

        {/* Out of stock overlay */}
        {!product.in_stock && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
            <span className="bg-gray-700 text-white text-xs font-bold px-3 py-1.5 rounded-full">
              Out of Stock
            </span>
          </div>
        )}

        {/* Quick view overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300
                        flex items-end justify-center pb-3 opacity-0 group-hover:opacity-100 z-10">
          <span className="flex items-center gap-1.5 bg-white/95 text-text-dark text-xs font-semibold
                           px-3 py-1.5 rounded-full shadow-md translate-y-2 group-hover:translate-y-0
                           transition-transform duration-300">
            <Eye size={12} aria-hidden="true" /> Quick View
          </span>
        </div>
      </Link>

      {/* ── Info ───────────────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 px-3.5 pb-3.5 pt-2.5">
        {product.category_name && (
          <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-0.5">
            {product.category_name}
          </span>
        )}

        <Link
          to={`/shop/${product.slug}`}
          className="font-semibold text-text-dark text-sm leading-snug mb-3
                     hover:text-primary transition-colors line-clamp-2"
        >
          {product.name}
        </Link>

        <div className="mt-auto flex items-center justify-between gap-2">
          <span className="text-base font-bold text-primary">
            {formatCurrency(product.price)}
          </span>

          <button
            onClick={handleAddToCart}
            disabled={!product.in_stock || adding}
            aria-label={`Add ${product.name} to cart`}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold
                       transition-all duration-200 active:scale-95
                       ${product.in_stock
                         ? adding
                           ? 'bg-green-600 text-white scale-95'
                           : 'bg-primary text-white hover:bg-primary-dark'
                         : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                       }`}
          >
            <ShoppingCart size={13} aria-hidden="true" />
            <span className="hidden sm:inline">{adding ? '✓' : 'Add'}</span>
          </button>
        </div>
      </div>
    </article>
  );
}

