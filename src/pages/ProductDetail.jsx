import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Plus, Minus, Tag, Shield, Leaf, Star, Truck, Check, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import { productsApi } from '../api/client';
import useCartStore from '../store/cartStore';
import { formatCurrency } from '../utils/formatCurrency';
import LoadingSpinner from '../components/LoadingSpinner';
import ProductCard from '../components/ProductCard';

const BADGE_STYLES = {
  'Bestseller':       'bg-accent text-white',
  'Popular':          'bg-primary text-white',
  'Premium':          'bg-brand-dark text-white',
  'Regional Special': 'bg-olive text-white',
};

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem, openDrawer } = useCartStore();

  const [product, setProduct]   = useState(null);
  const [related, setRelated]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding]     = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    setLoading(true); setError(''); setQuantity(1); setActiveImg(0);
    productsApi.getBySlug(slug)
      .then(async res => {
        setProduct(res.data);
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

  const handleAddToCart = () => {
    if (!product?.in_stock || adding) return;
    setAdding(true);
    addItem(product, quantity);
    toast.success(product.name + ' x' + quantity + ' added to cart', { icon: '🛒' });
    openDrawer();
    setTimeout(() => setAdding(false), 800);
  };

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><LoadingSpinner label="Loading product..." /></div>;

  if (error || !product) {
    return (
      <div className="container-page py-20 text-center">
        <p className="text-5xl mb-4">🌶️</p>
        <h1 className="font-serif text-2xl font-bold mb-2" style={{ color: '#23120B' }}>Product not found</h1>
        <p className="mb-6" style={{ color: '#7C6B5E' }}>{error || 'This product does not exist.'}</p>
        <Link to="/shop" className="btn-primary px-6 py-3">Back to Shop</Link>
      </div>
    );
  }

  const images = [product.image_url || '/placeholder-spice.svg'];

  return (
    <main style={{ background: '#FBF9F5' }} className="min-h-screen">
      <div className="container-page py-6 sm:py-10">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs mb-8" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-primary transition-colors" style={{ color: '#7C6B5E' }}>Home</Link>
          <span style={{ color: '#EFE8DF' }}>›</span>
          <Link to="/shop" className="hover:text-primary transition-colors" style={{ color: '#7C6B5E' }}>Shop</Link>
          {product.category_name && (
            <>
              <span style={{ color: '#EFE8DF' }}>›</span>
              <Link to={'/shop?category=' + product.category_slug} className="hover:text-primary transition-colors" style={{ color: '#7C6B5E' }}>{product.category_name}</Link>
            </>
          )}
          <span style={{ color: '#EFE8DF' }}>›</span>
          <span className="font-medium" style={{ color: '#23120B' }}>{product.name}</span>
        </nav>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 mb-16">

          {/* ── LEFT: Image panel ─────────────────────────────────────────── */}
          <div className="space-y-4">
            {/* Main image */}
            <div className="relative rounded-3xl overflow-hidden bg-white border shadow-card-hover flex items-center justify-center" style={{ borderColor: '#EFE8DF', aspectRatio: '1/1' }}>
              <img
                src={images[activeImg]}
                alt={product.name}
                className="w-full h-full object-contain p-8"
                onError={e => { e.target.src = '/placeholder-spice.svg'; }}
              />
              {product.badge && (
                <span className={'absolute top-5 left-5 px-3 py-1.5 rounded-full text-sm font-bold shadow-lg ' + (BADGE_STYLES[product.badge] || 'bg-primary text-white')}>
                  {product.badge}
                </span>
              )}
              {!product.in_stock && (
                <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.85)' }}>
                  <span className="font-semibold px-6 py-2.5 rounded-full shadow text-white" style={{ background: '#23120B' }}>Out of Stock</span>
                </div>
              )}
            </div>

            {/* Trust badges row */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Shield, label: 'Halal Certified' },
                { icon: Leaf,   label: '100% Natural' },
                { icon: Truck,  label: 'Cash on Delivery' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="bg-white rounded-xl border py-3 flex flex-col items-center gap-1.5 text-center" style={{ borderColor: '#EFE8DF' }}>
                  <Icon size={16} style={{ color: '#8B1E17' }} />
                  <span className="text-xs font-medium" style={{ color: '#23120B' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Details ────────────────────────────────────────────── */}
          <div className="flex flex-col">

            {/* Category */}
            {product.category_name && (
              <Link to={'/shop?category=' + product.category_slug}
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest mb-3 hover:opacity-80 transition-opacity"
                style={{ color: '#D97706' }}>
                <Tag size={11} /> {product.category_name}
              </Link>
            )}

            {/* Name */}
            <h1 className="font-serif text-3xl sm:text-4xl font-bold leading-tight mb-4" style={{ color: '#23120B' }}>
              {product.name}
            </h1>

            {/* Stars */}
            <div className="flex items-center gap-1.5 mb-5">
              {Array(5).fill(0).map((_, i) => (
                <Star key={i} size={16} style={{ color: '#D97706', fill: '#D97706' }} />
              ))}
              <span className="text-sm ml-1" style={{ color: '#7C6B5E' }}>Premium Quality</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl font-bold" style={{ color: '#8B1E17' }}>
                {formatCurrency(product.price)}
              </span>
              <span className="text-sm" style={{ color: '#7C6B5E' }}>per pack</span>
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-base leading-relaxed mb-6" style={{ color: '#7C6B5E' }}>
                {product.description}
              </p>
            )}

            {/* Stock status */}
            <div className="flex items-center gap-2 mb-6">
              <span className={'w-2.5 h-2.5 rounded-full ' + (product.in_stock ? 'bg-green-500' : 'bg-red-500')} />
              <span className={'text-sm font-semibold ' + (product.in_stock ? 'text-green-700' : 'text-red-600')}>
                {product.in_stock ? 'In Stock — Ready to Ship' : 'Currently Out of Stock'}
              </span>
            </div>

            {product.in_stock && (
              <>
                {/* Quantity selector */}
                <div className="flex items-center gap-4 mb-5">
                  <span className="text-sm font-semibold" style={{ color: '#23120B' }}>Quantity:</span>
                  <div className="flex items-center rounded-xl overflow-hidden border" style={{ borderColor: '#EFE8DF' }}>
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity <= 1}
                      aria-label="Decrease" className="w-12 h-12 flex items-center justify-center transition-colors hover:bg-cream disabled:opacity-40" style={{ color: '#7C6B5E' }}>
                      <Minus size={16} />
                    </button>
                    <span className="w-14 text-center font-bold text-lg select-none" style={{ color: '#23120B' }}>{quantity}</span>
                    <button onClick={() => setQuantity(q => Math.min(99, q + 1))} disabled={quantity >= 99}
                      aria-label="Increase" className="w-12 h-12 flex items-center justify-center transition-colors hover:bg-cream disabled:opacity-40" style={{ color: '#7C6B5E' }}>
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                {/* CTA buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mb-8">
                  <button onClick={handleAddToCart} disabled={adding}
                    className="flex-1 flex items-center justify-center gap-2 text-white font-bold py-4 rounded-xl text-base transition-all active:scale-[0.98] shadow-lg"
                    style={{ background: adding ? '#3E5244' : '#8B1E17' }}>
                    {adding ? <Check size={20} /> : <ShoppingCart size={20} />}
                    {adding ? 'Added to Cart!' : 'Add to Cart — ' + formatCurrency(product.price * quantity)}
                  </button>
                  <button onClick={() => { addItem(product, quantity); navigate('/checkout'); }}
                    className="flex-1 flex items-center justify-center gap-2 font-bold py-4 rounded-xl text-base border-2 transition-all active:scale-[0.98]"
                    style={{ borderColor: '#8B1E17', color: '#8B1E17', background: 'transparent' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#8B1E17'; e.currentTarget.style.color = 'white'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#8B1E17'; }}>
                    Buy Now
                  </button>
                </div>
              </>
            )}

            {/* Feature list */}
            <div className="bg-white rounded-2xl border p-5 space-y-3" style={{ borderColor: '#EFE8DF' }}>
              {[
                { icon: Truck,   text: 'Cash on Delivery — Pay when your order arrives' },
                { icon: Shield,  text: 'Halal Certified · KPFSHFA/2021' },
                { icon: Leaf,    text: 'No artificial additives or preservatives' },
                { icon: Package, text: 'Manufactured by F & J Sons Foods (Pvt) Ltd., KPK' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-sm" style={{ color: '#7C6B5E' }}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(139,30,23,0.08)' }}>
                    <Icon size={13} style={{ color: '#8B1E17' }} />
                  </div>
                  {text}
                </div>
              ))}
              <div className="pt-3 border-t text-xs" style={{ borderColor: '#EFE8DF', color: '#7C6B5E' }}>
                📞 Questions? Call{' '}
                <a href="tel:03149007440" className="font-bold hover:underline" style={{ color: '#8B1E17' }}>0314-9007440</a>
                {' '}or{' '}
                <a href="tel:03332001341" className="font-bold hover:underline" style={{ color: '#8B1E17' }}>0333-2001341</a>
              </div>
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section aria-labelledby="related-heading">
            <div className="flex items-center justify-between mb-6">
              <h2 id="related-heading" className="font-serif text-2xl font-bold" style={{ color: '#23120B' }}>
                More in {product.category_name}
              </h2>
              <Link to={'/shop?category=' + product.category_slug}
                className="text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all" style={{ color: '#8B1E17' }}>
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
