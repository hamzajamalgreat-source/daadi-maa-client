import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Plus, Minus, Tag, Shield, Leaf, Star, Truck } from 'lucide-react';
import toast from 'react-hot-toast';
import { productsApi } from '../api/client';
import useCartStore from '../store/cartStore';
import { formatCurrency } from '../utils/formatCurrency';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const BADGE_STYLES = {
  'Bestseller':       'bg-accent text-white',
  'Popular':          'bg-primary text-white',
  'Premium':          'bg-brand-dark text-white',
  'Regional Special': 'bg-primary-light text-white',
};

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem, openDrawer } = useCartStore();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding]     = useState(false);

  useEffect(() => {
    setLoading(true);
    setError('');
    setQuantity(1);
    productsApi.getBySlug(slug)
      .then(async res => {
        setProduct(res.data);
        // Load related products from same category
        if (res.data.category_slug) {
          try {
            const rel = await productsApi.getAll({ category: res.data.category_slug });
            setRelated(rel.data.filter(p => p.slug !== slug).slice(0, 4));
          } catch { /* non-critical */ }
        }
      })
      .catch(err => setError(err.message || 'Product not found.'))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleDecrease = () => setQuantity(q => Math.max(1, q - 1));
  const handleIncrease = () => setQuantity(q => Math.min(99, q + 1));

  const handleAddToCart = () => {
    if (!product?.in_stock || adding) return;
    setAdding(true);
    addItem(product, quantity);
    toast.success(`${product.name} ×${quantity} added to cart`, { icon: '🛒' });
    openDrawer();
    setTimeout(() => setAdding(false), 800);
  };

  if (loading) return <div className="py-24"><LoadingSpinner label="Loading product…" /></div>;

  if (error || !product) {
    return (
      <div className="container-page py-20">
        <EmptyState icon="🌶️" title="Product not found"
          message={error || 'This product does not exist.'}
          actionLabel="Back to Shop" actionTo="/shop" />
      </div>
    );
  }

  return (
    <main className="bg-cream min-h-screen">
      <div className="container-page py-8">

        {/* Back */}
        <Link to="/shop"
          className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-primary
                     transition-colors mb-8 group">
          <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to Shop
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">

          {/* ── Image ──────────────────────────────────────────────────── */}
          <div className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden bg-white shadow-card-hover
                            border border-border flex items-center justify-center p-6">
              <img
                src={product.image_url || '/placeholder-spice.svg'}
                alt={product.name}
                className="w-full h-full object-contain"
                
                onError={e => { e.target.src = '/placeholder-spice.svg'; }}
              />
            </div>

            {/* Badge */}
            {product.badge && (
              <span className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-sm font-bold
                               shadow-lg ${BADGE_STYLES[product.badge] || 'bg-primary text-white'}`}>
                {product.badge}
              </span>
            )}

            {!product.in_stock && (
              <div className="absolute inset-0 bg-white/80 rounded-3xl flex items-center justify-center">
                <span className="bg-gray-700 text-white font-semibold px-6 py-2.5 rounded-full shadow">
                  Out of Stock
                </span>
              </div>
            )}
          </div>

          {/* ── Details ────────────────────────────────────────────────── */}
          <div className="flex flex-col">
            {/* Category */}
            {product.category_name && (
              <Link to={`/shop?category=${product.category_slug}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted
                           uppercase tracking-wider hover:text-primary transition-colors mb-3">
                <Tag size={11} />
                {product.category_name}
              </Link>
            )}

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-text-dark leading-tight mb-3">
              {product.name}
            </h1>

            {/* Stars (decorative for brand) */}
            <div className="flex items-center gap-1 mb-4">
              {Array(5).fill(0).map((_, i) => (
                <Star key={i} size={14} className="text-accent fill-accent" />
              ))}
              <span className="text-xs text-text-muted ml-1.5">Premium Quality</span>
            </div>

            <p className="text-3xl font-bold text-primary mb-6">
              {formatCurrency(product.price)}
            </p>

            {product.description && (
              <p className="text-text-muted leading-relaxed mb-7 text-base">
                {product.description}
              </p>
            )}

            {/* Stock indicator */}
            <div className="flex items-center gap-2 mb-7">
              <span className={`w-2 h-2 rounded-full ${product.in_stock ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className={`text-sm font-medium ${product.in_stock ? 'text-green-700' : 'text-red-600'}`}>
                {product.in_stock ? 'In Stock — Ready to Ship' : 'Out of Stock'}
              </span>
            </div>

            {product.in_stock && (
              <>
                {/* Quantity */}
                <div className="flex items-center gap-4 mb-5">
                  <span className="text-sm font-medium text-text-dark">Quantity:</span>
                  <div className="flex items-center border border-border rounded-xl overflow-hidden bg-white shadow-sm"
                       role="group" aria-label="Quantity">
                    <button onClick={handleDecrease} disabled={quantity <= 1}
                      aria-label="Decrease quantity"
                      className="w-11 h-11 flex items-center justify-center text-text-muted
                                 hover:text-primary hover:bg-cream transition-colors
                                 disabled:opacity-40 disabled:cursor-not-allowed">
                      <Minus size={15} />
                    </button>
                    <span className="w-12 text-center font-bold text-text-dark select-none">
                      {quantity}
                    </span>
                    <button onClick={handleIncrease} disabled={quantity >= 99}
                      aria-label="Increase quantity"
                      className="w-11 h-11 flex items-center justify-center text-text-muted
                                 hover:text-primary hover:bg-cream transition-colors
                                 disabled:opacity-40 disabled:cursor-not-allowed">
                      <Plus size={15} />
                    </button>
                  </div>
                </div>

                {/* CTA buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mb-8">
                  <button onClick={handleAddToCart} disabled={adding}
                    className={`flex-1 btn-primary py-3.5 text-base transition-all
                      ${adding ? 'bg-green-600 hover:bg-green-600' : ''}`}>
                    <ShoppingCart size={18} />
                    {adding ? '✓ Added!' : `Add to Cart — ${formatCurrency(product.price * quantity)}`}
                  </button>
                  <button
                    onClick={() => { addItem(product, quantity); navigate('/checkout'); }}
                    className="flex-1 btn-outline py-3.5 text-base">
                    Buy Now
                  </button>
                </div>
              </>
            )}

            {/* Delivery info card */}
            <div className="bg-white rounded-2xl p-5 border border-border shadow-card space-y-3">
              {[
                { icon: Truck,  text: 'Cash on Delivery — Pay when your order arrives' },
                { icon: Shield, text: 'Halal Certified · 100% Natural & Organic' },
                { icon: Leaf,   text: 'No artificial additives or preservatives' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2.5 text-sm text-text-muted">
                  <Icon size={14} className="text-primary flex-shrink-0" />
                  {text}
                </div>
              ))}
              <div className="pt-2 border-t border-border text-xs text-text-muted">
                📞 Questions? Call{' '}
                <a href="tel:03149007440" className="text-primary font-semibold hover:underline">
                  0314-9007440
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ── Related Products ──────────────────────────────────────────── */}
        {related.length > 0 && (
          <section className="mt-16" aria-labelledby="related-heading">
            <h2 id="related-heading" className="section-title mb-6">
              More in {product.category_name}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {related.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}


