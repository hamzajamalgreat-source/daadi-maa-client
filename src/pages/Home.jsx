import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingCart, Star, Shield, Leaf, Award, Truck, MapPin } from 'lucide-react';
import { productsApi } from '../api/client';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { motion } from "motion/react";
import useCartStore from '../store/cartStore';

function SpiceStrip() {
  return (
    <div className="w-full overflow-hidden" style={{ height: 72, background: '#23120B' }} aria-hidden="true">
      <svg viewBox="0 0 1200 72" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="1200" height="72" fill="#23120B"/>
        <ellipse cx="80" cy="36" rx="22" ry="14" fill="#8B1E17" transform="rotate(-20,80,36)"/>
        <rect x="94" y="31" width="38" height="7" rx="3.5" fill="#6D1611" transform="rotate(-20,80,36)"/>
        <ellipse cx="210" cy="38" rx="24" ry="15" fill="#D97706" transform="rotate(15,210,38)"/>
        <rect x="225" y="33" width="40" height="8" rx="4" fill="#B45309" transform="rotate(15,210,38)"/>
        <ellipse cx="340" cy="36" rx="21" ry="13" fill="#3E5244" transform="rotate(-10,340,36)"/>
        <rect x="353" y="32" width="36" height="7" rx="3.5" fill="#2D3D32" transform="rotate(-10,340,36)"/>
        <ellipse cx="500" cy="40" rx="22" ry="14" fill="#2A1A0A" transform="rotate(18,500,40)"/>
        <rect x="514" y="35" width="38" height="7" rx="3.5" fill="#1A0A00" transform="rotate(18,500,40)"/>
        <rect x="562" y="22" width="5" height="26" rx="2.5" fill="#8B4513" opacity="0.85" transform="rotate(12,564,35)"/>
        <ellipse cx="660" cy="36" rx="23" ry="14" fill="#8B1E17" transform="rotate(-15,660,36)"/>
        <ellipse cx="750" cy="30" rx="6" ry="11" fill="#3E5244" opacity="0.85" transform="rotate(20,750,30)"/>
        <ellipse cx="860" cy="38" rx="24" ry="15" fill="#D97706" transform="rotate(10,860,38)"/>
        <ellipse cx="1060" cy="36" rx="22" ry="13" fill="#E8C4C0" transform="rotate(-16,1060,36)"/>
        <ellipse cx="1150" cy="40" rx="23" ry="14" fill="#D97706" transform="rotate(12,1150,40)"/>
        <rect x="0" y="68" width="1200" height="4" fill="url(#gs)"/>
        <defs>
          <linearGradient id="gs" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8B1E17"/>
            <stop offset="33%" stopColor="#D97706"/>
            <stop offset="66%" stopColor="#8B1E17"/>
            <stop offset="100%" stopColor="#D97706"/>
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Counter({ end, duration = 1500, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      const step = end / (duration / 16);
      let cur = 0;
      const t = setInterval(() => {
        cur = Math.min(cur + step, end);
        setCount(Math.round(cur));
        if (cur >= end) clearInterval(t);
      }, 16);
    });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end, duration]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

function HeroSlideshow({ products }) {
  const [cur, setCur] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setCur(i => (i + 1) % products.length), 2500);
    return () => clearInterval(t);
  }, [products.length]);
  const prev = products[(cur - 1 + products.length) % products.length];
  const curr = products[cur];
  const next = products[(cur + 1) % products.length];
  return (
    <div className="relative w-72" aria-label="Product slideshow">
      <div className="flex gap-3 items-center justify-center">
        {[prev, curr, next].map((p, i) => (
          <Link key={'slide-' + p.id + '-' + i} to={'/shop/' + p.slug}
            className={'bg-white rounded-2xl shadow-lg transition-all duration-500 flex flex-col items-center overflow-hidden flex-shrink-0 border border-border ' + (i === 1 ? 'w-32 h-40 opacity-100 scale-110 z-10 shadow-xl' : 'w-20 h-28 opacity-40 scale-95')}>
            <div className="flex-1 w-full flex items-center justify-center p-2 bg-cream">
              <img src={p.image_url} alt={p.name} className="w-full h-full object-contain"
                onError={e => { e.target.src = '/placeholder-spice.svg'; }} />
            </div>
            {i === 1 && (
              <div className="w-full bg-white px-2 py-2 text-center border-t border-border">
                <p className="text-[10px] font-bold text-text-dark leading-tight line-clamp-1">{p.name}</p>
                <p className="text-[10px] font-bold mt-0.5" style={{ color: '#8B1E17' }}>Rs. {p.price}</p>
              </div>
            )}
          </Link>
        ))}
      </div>
      <div className="flex justify-center gap-1 mt-3">
        {products.map((_, i) => (
          <button key={'dot-' + i} onClick={() => setCur(i)} aria-label={'Product ' + (i + 1)}
            className={'rounded-full transition-all duration-300 ' + (i === cur ? 'w-4 h-1.5 bg-accent' : 'w-1.5 h-1.5 bg-white/30')} />
        ))}
      </div>
    </div>
  );
}

const CATEGORIES = [
  { slug: 'recipe-mixes',  label: 'Recipe Mixes',   desc: 'Complete masala blends for authentic dishes', emoji: '🍛', from: '#8B1E17', to: '#4A0E0A', count: 4, recipes: 'Quorma, Biryani, Pulao, Achar Gosht' },
  { slug: 'spice-powders', label: 'Spice Powders',  desc: 'Freshly ground single-spice powders',          emoji: '🌶️', from: '#D97706', to: '#7C3A00', count: 10, recipes: 'Karahi, Dal, Sabzi, Chai Masala' },
  { slug: 'salts',         label: 'Himalayan Salts', desc: 'Pure Himalayan salts — Pink, Iodized & Refined',emoji: '🧂', from: '#3E5244', to: '#1E2E24', count: 3, recipes: 'Daily Cooking, Baking, Grilling' },
];

const TESTIMONIALS = [
  { name: 'Amina Bibi',     city: 'Peshawar',   text: 'Daadi Maa ki quorma mix ne ghar ka khaana bilkul restaurant jaisa bana diya. Zabardast khushboo!' },
  { name: 'Khalid Mehmood', city: 'Lahore',     text: 'Bombay Biryani Masala is absolutely authentic. My family asks for it every weekend now.' },
  { name: 'Sara Khan',      city: 'Mardan',     text: 'The Himalayan Pink Salt is 100% pure. You can taste the difference. Will order again!' },
  { name: 'Rashid Ali',     city: 'Islamabad',  text: 'All spice powders are fresh and aromatic. Cash on delivery makes it very convenient.' },
];

const TRUST_STATS = [
  { label: 'Products',        value: 17,   suffix: '+' },
  { label: 'Happy Customers', value: 5000, suffix: '+' },
  { label: 'Years of Trust',  value: 10,   suffix: '+' },
  { label: '% Organic',       value: 100,  suffix: '%' },
];

const fadeUp = { hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0, transition: { duration: 0.48, ease: [0.22,1,0.36,1] } } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.10 } } };

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const { items: cartItems } = useCartStore();

  useEffect(() => {
    productsApi.getAll()
      .then(res => {
        const data = res.data;
        const badged = data.filter(p => p.badge);
        const rest = data.filter(p => !p.badge);
        setFeatured([...badged, ...rest].slice(0, 8));
      })
      .catch(() => setFeatured([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main>
      {/* Continue where you left off */}
      {cartItems.length > 0 && (
        <div
          className="w-full px-4 py-3 flex items-center justify-between gap-4"
          style={{ background: '#8B1E17' }}
          role="banner"
        >
          <div className="flex items-center gap-2 text-white text-sm">
            <ShoppingCart size={16} className="flex-shrink-0" />
            <span>
              You have <strong>{cartItems.reduce((s, i) => s + i.quantity, 0)} item{cartItems.reduce((s, i) => s + i.quantity, 0) !== 1 ? 's' : ''}</strong> in your cart
            </span>
          </div>
          <Link
            to="/checkout"
            className="flex-shrink-0 text-xs font-bold px-4 py-2 rounded-lg transition-colors"
            style={{ background: '#D97706', color: '#fff' }}
          >
            Complete Order →
          </Link>
        </div>
      )}
      <section className="relative overflow-hidden" style={{ background: '#23120B' }} aria-label="Hero">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl" style={{ background: 'rgba(217,119,6,0.10)' }} />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full blur-3xl" style={{ background: 'rgba(139,30,23,0.18)' }} />
        </div>

        <div className="container-page relative py-16 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-white animate-fade-up">
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 border" style={{ background: 'rgba(217,119,6,0.15)', borderColor: 'rgba(217,119,6,0.35)' }}>
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#D97706' }} />
                <span className="text-sm font-semibold tracking-wide" style={{ color: '#D97706' }}>Natural · Pure · Safe</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-shadow-dark">
                Taste the Magic of <span className="text-gold-gradient">Daadi Maa's</span><br />Kitchen
              </h1>

              <p className="text-lg leading-relaxed mb-8 max-w-lg" style={{ color: 'rgba(255,255,255,0.70)' }}>
                Premium quality spices crafted by <strong style={{ color: 'rgba(255,255,255,0.92)' }}>F & J Sons Foods</strong>. 
                Authentic recipes, pure ingredients, and the warmth of tradition in every pack.
              </p>

              <div className="flex flex-wrap gap-3 mb-10">
                <Link to="/shop" className="btn-primary text-base px-7 py-3.5 shadow-lg">
                  Shop All Spices <ArrowRight size={18} />
                </Link>
                <Link to="/shop?category=recipe-mixes" className="inline-flex items-center gap-2 text-white font-medium px-6 py-3.5 rounded-xl transition-colors" style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.20)' }}>
                  Recipe Mixes
                </Link>
              </div>

              <div className="flex flex-wrap gap-5">
                {[
                  { icon: Shield, text: 'Halal Certified' },
                  { icon: Award, text: 'PS 3733:2019' },
                  { icon: Leaf, text: '100% Organic' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-1.5 text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>
                    <Icon size={13} style={{ color: '#D97706' }} />
                    {text}
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden lg:flex flex-col items-center gap-6">
              <div className="bg-white rounded-3xl p-6 shadow-2xl flex flex-col items-center border border-border">
                <img src="/daadi-maa-logo.png" alt="Daadi Maa Spices" className="w-44 h-44 object-contain" />
                <p className="font-serif font-bold text-base italic mt-2" style={{ color: '#8B1E17' }}>Daadi Maa</p>
                <p className="text-xs italic mt-0.5" style={{ color: '#7C6B5E' }}>Natural, Pure, Safe</p>
              </div>
              {featured.length > 0 && <HeroSlideshow products={featured} />}
            </div>

            <div className="flex justify-center lg:hidden">
              <div className="bg-white rounded-2xl p-5 shadow-xl border border-border">
                <img src="/daadi-maa-logo.png" alt="Daadi Maa Spices" className="w-32 h-32 object-contain" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <SpiceStrip />

      <section style={{ background: '#8B1E17' }} aria-label="Trust statistics">
        <div className="container-page py-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center text-white">
            {TRUST_STATS.map(({ label, value, suffix }) => (
              <div key={label}>
                <p className="text-3xl font-serif font-bold" style={{ color: '#D97706' }}>
                  <Counter end={value} suffix={suffix} />
                </p>
                <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.70)' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream py-16" aria-labelledby="story-heading">
        <div className="container-page">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-up">
              <span className="text-xs font-bold uppercase tracking-widest mb-3 block" style={{ color: '#D97706' }}>Our Heritage</span>
              <h2 id="story-heading" className="font-serif text-3xl sm:text-4xl font-bold mb-5" style={{ color: '#23120B' }}>
                Recipes Passed Down<br />Through Generations
              </h2>
              <p className="leading-relaxed mb-5" style={{ color: '#7C6B5E' }}>
                Daadi Maa Spices brings the authentic taste of traditional Pakistani kitchens to your home. 
                Inspired by recipes, ingredients, and memories passed down through generations — every blend 
                carries the warmth and wisdom of a grandmother's kitchen.
              </p>
              <p className="leading-relaxed mb-8" style={{ color: '#7C6B5E' }}>
                Founded by <strong style={{ color: '#23120B' }}>F & J Sons Foods (Pvt) Ltd.</strong> in Mardan, KPK, 
                we source the finest natural spices and craft them with care — no artificial additives, 
                no shortcuts. Just pure, honest flavour.
              </p>
              <div className="flex flex-wrap gap-3">
                {['🌿 100% Natural', '✅ Halal Certified', '🏆 PS 3733:2019', '🇵🇰 Made in KPK'].map(tag => (
                  <span key={tag} className="px-3 py-1.5 rounded-full text-sm font-medium border" style={{ background: '#FBF9F5', borderColor: '#EFE8DF', color: '#23120B' }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center lg:items-start gap-6">
              <div className="rounded-2xl p-8 flex flex-col items-center shadow-card border" style={{ background: '#23120B', borderColor: '#3A2010' }}>
                <img src="/daadi-maa-logo.png" alt="Daadi Maa Spices" className="w-36 h-36 object-contain mb-4" />
                <p className="font-serif font-bold text-lg italic mb-1" style={{ color: '#D97706' }}>Daadi Maa</p>
                <p className="text-xs italic mb-4" style={{ color: 'rgba(255,255,255,0.55)' }}>Natural, Pure, Safe</p>
                <div className="flex items-start gap-2 text-xs text-center" style={{ color: 'rgba(255,255,255,0.60)' }}>
                  <MapPin size={12} className="flex-shrink-0 mt-0.5" style={{ color: '#D97706' }} />
                  <span>Mardan Swabi Road, Village Baghicha Dheri,<br />District Mardan, KPK</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16" style={{ background: '#FBF9F5' }} aria-labelledby="categories-heading">
        <div className="container-page">
          <div className="text-center mb-10">
            <h2 id="categories-heading" className="section-title mb-2">Browse by Category</h2>
            <p style={{ color: '#7C6B5E' }}>Explore our range of authentic Pakistani spices</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {CATEGORIES.map(cat => (
              <Link key={cat.slug} to={'/shop?category=' + cat.slug} className="group relative overflow-hidden rounded-2xl text-white shadow-card hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-300">
                <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, ' + cat.from + ' 0%, ' + cat.to + ' 100%)' }} />
                <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }} />
                <div className="relative p-7">
                  <span className="text-4xl mb-4 block" aria-hidden="true">{cat.emoji}</span>
                  <h3 className="font-serif font-bold text-xl mb-1 group-hover:text-accent transition-colors">{cat.label}</h3>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.65)' }}>{cat.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: 'rgba(255,255,255,0.50)' }}>{cat.count} products</span>
                    <span className="flex items-center gap-1 text-sm font-semibold group-hover:gap-2 transition-all" style={{ color: '#D97706' }}>
                      Shop <ArrowRight size={14} />
                    </span>
                  </div>
                  {cat.recipes && (
                    <p className="text-[10px] mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>
                      Perfect for: {cat.recipes}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16" aria-labelledby="featured-heading">
        <div className="container-page">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
            <div>
              <h2 id="featured-heading" className="section-title mb-1">Featured Products</h2>
              <p style={{ color: '#7C6B5E' }}>Hand-picked favourites loved by our customers</p>
            </div>
            <Link to="/shop" className="text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all" style={{ color: '#8B1E17' }}>
              View all <ArrowRight size={15} />
            </Link>
          </div>
          {loading ? <LoadingSpinner label="Loading products…" /> : (
            <>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-bold px-3 py-1 rounded-full text-white" style={{ background: '#8B1E17' }}>
                  🔥 Most Ordered in KPK
                </span>
                <span className="text-xs" style={{ color: '#7C6B5E' }}>Top picks from Peshawar, Mardan &amp; beyond</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                {featured.map(product => <ProductCard key={product.id} product={product} />)}
              </div>
            </>
          )}
          <div className="text-center mt-10">
            <Link to="/shop" className="btn-outline text-base px-8 py-3 inline-flex items-center gap-2">
              <ShoppingCart size={18} /> Browse All 17 Products
            </Link>
          </div>
        </div>
      </section>

      <section style={{ background: '#F3EFE8' }} className="py-16" aria-labelledby="how-heading">
        <div className="container-page">
          <div className="text-center mb-10">
            <h2 id="how-heading" className="section-title mb-2">How It Works</h2>
            <p style={{ color: '#7C6B5E' }}>Order fresh spices in 3 simple steps</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 relative">
            <div className="absolute top-10 left-1/4 right-1/4 h-px hidden sm:block" style={{ background: '#EFE8DF' }} aria-hidden="true" />
            {[
              { step: '01', icon: ShoppingCart, title: 'Browse & Add', desc: 'Explore our 17 premium spice products and add your favourites to cart.' },
              { step: '02', icon: Award, title: 'Place Order', desc: 'Fill in your delivery details. No account or online payment needed.' },
              { step: '03', icon: Truck, title: 'Get Delivered', desc: 'We deliver to your door. Pay in cash when your spices arrive.' },
            ].map(({ step, icon: Icon, title, desc }) => (
              <div key={step} className="text-center relative">
                <div className="relative inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-card border mb-5 mx-auto" style={{ borderColor: '#EFE8DF' }}>
                  <span className="absolute -top-2.5 -right-2.5 w-6 h-6 text-white text-[10px] font-bold rounded-full flex items-center justify-center" style={{ background: '#8B1E17' }}>{step}</span>
                  <Icon size={28} style={{ color: '#8B1E17' }} />
                </div>
                <h3 className="font-serif font-semibold text-lg mb-2" style={{ color: '#23120B' }}>{title}</h3>
                <p className="text-sm leading-relaxed max-w-xs mx-auto" style={{ color: '#7C6B5E' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16" aria-labelledby="testimonials-heading">
        <div className="container-page">
          <div className="text-center mb-10">
            <h2 id="testimonials-heading" className="section-title mb-2">What Our Customers Say</h2>
            <p style={{ color: '#7C6B5E' }}>Real reviews from real families across Pakistan</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-cream rounded-2xl p-6 border shadow-card flex flex-col gap-4 relative" style={{ borderColor: '#EFE8DF' }}>
                <div className="absolute top-4 right-5 text-5xl font-serif leading-none pointer-events-none select-none" style={{ color: 'rgba(139,30,23,0.08)' }} aria-hidden="true">"</div>
                <div className="flex gap-0.5">
                  {Array(5).fill(0).map((_, j) => (
                    <Star key={j} size={13} style={{ color: '#D97706', fill: '#D97706' }} />
                  ))}
                </div>
                <p className="text-sm leading-relaxed italic flex-1" style={{ color: '#23120B' }}>"{t.text}"</p>
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ background: '#8B1E17' }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: '#23120B' }}>{t.name}</p>
                    <p className="text-xs" style={{ color: '#7C6B5E' }}>{t.city} · Verified Customer</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: '#F3EFE8' }} className="py-16" aria-labelledby="trust-heading">
        <div className="container-page">
          <div className="text-center mb-10">
            <h2 id="trust-heading" className="section-title mb-2">Why Choose Daadi Maa?</h2>
            <p style={{ color: '#7C6B5E' }}>Every packet carries a promise of quality</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Leaf, title: 'Natural & Organic', desc: '100% organic ingredients. No artificial additives, colours or preservatives.', detail: '🌿 Real spices · 🌱 Carefully sourced' },
              { icon: Shield, title: 'Halal Certified', desc: 'Certified by KPFSHFA/2021. Every product meets strict Halal food standards.', detail: '✅ Verified · 🕌 Trusted by families' },
              { icon: Award, title: 'PS 3733:2019', desc: 'AHCS Pakistan Standards conformity assessed and certified.', detail: '🏆 Quality assured · 📋 Documented' },
              { icon: Truck, title: 'Cash on Delivery', desc: 'Order online, pay when your spices arrive at your door.', detail: '🚚 Home delivery · 💵 Pay on arrival' },
            ].map(({ icon: Icon, title, desc, detail }) => (
              <div key={title} className="bg-white rounded-2xl p-6 text-center shadow-card border hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 group" style={{ borderColor: '#EFE8DF' }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors" style={{ background: 'rgba(139,30,23,0.07)' }}>
                  <Icon size={24} style={{ color: '#8B1E17' }} />
                </div>
                <h3 className="font-serif font-semibold mb-2" style={{ color: '#23120B' }}>{title}</h3>
                <p className="text-sm leading-relaxed mb-3" style={{ color: '#7C6B5E' }}>{desc}</p>
                <p className="text-xs font-medium" style={{ color: '#D97706' }}>{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SpiceStrip />

      <section className="relative overflow-hidden py-14" style={{ background: '#8B1E17' }} aria-label="Call to action">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }} />
        </div>
        <div className="container-page relative flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-white text-center sm:text-left">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-2">Ready to elevate your cooking?</h2>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.70)' }}>17 premium spices · Cash on Delivery · Authentic Pakistani flavours</p>
          </div>
          <Link to="/shop" className="btn-accent flex-shrink-0 text-base px-8 py-4">
            Shop Now <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}

