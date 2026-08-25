import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingCart, Star, Shield, Leaf, Award, Truck, ChevronLeft, ChevronRight } from 'lucide-react';
import { productsApi } from '../api/client';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import useCartStore from '../store/cartStore';

// ─── Spice decorative strip (replaces bland circles) ─────────────────────────
function SpiceStrip() {
  return (
    <div className="w-full overflow-hidden" style={{ height: 80, background: '#1A0A05' }} aria-hidden="true">
      <svg viewBox="0 0 1200 80" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="1200" height="80" fill="#1A0A05"/>
        {/* Spoon 1 — Red chilli */}
        <ellipse cx="80" cy="40" rx="22" ry="14" fill="#AA1A1A" transform="rotate(-20,80,40)"/>
        <rect x="94" y="35" width="38" height="7" rx="3.5" fill="#8B1414" transform="rotate(-20,80,40)"/>
        <ellipse cx="76" cy="37" rx="9" ry="6" fill="#FF3A3A" transform="rotate(-20,80,40)"/>
        {/* Spoon 2 — Turmeric */}
        <ellipse cx="200" cy="42" rx="24" ry="15" fill="#D4A843" transform="rotate(15,200,42)"/>
        <rect x="215" y="37" width="40" height="8" rx="4" fill="#B8892A" transform="rotate(15,200,42)"/>
        <ellipse cx="196" cy="40" rx="10" ry="7" fill="#FFD700" transform="rotate(15,200,42)"/>
        {/* Seeds */}
        <circle cx="155" cy="28" r="3.5" fill="#8B6914" opacity="0.8"/>
        <circle cx="163" cy="55" r="3" fill="#8B6914" opacity="0.7"/>
        <circle cx="148" cy="44" r="2.5" fill="#6B4A10" opacity="0.6"/>
        {/* Spoon 3 — Green coriander */}
        <ellipse cx="330" cy="38" rx="21" ry="13" fill="#5A8B1A" transform="rotate(-12,330,38)"/>
        <rect x="343" y="34" width="36" height="7" rx="3.5" fill="#4A7A14" transform="rotate(-12,330,38)"/>
        <ellipse cx="326" cy="37" rx="8" ry="6" fill="#7AB82A" transform="rotate(-12,330,38)"/>
        {/* Star anise */}
        <text x="385" y="45" fontSize="22" fill="#8B4513" opacity="0.85">✳</text>
        {/* Spoon 4 — Black pepper */}
        <ellipse cx="490" cy="42" rx="22" ry="14" fill="#2A2A2A" transform="rotate(18,490,42)"/>
        <rect x="504" y="37" width="38" height="7" rx="3.5" fill="#111111" transform="rotate(18,490,42)"/>
        <ellipse cx="486" cy="40" rx="9" ry="6" fill="#555555" transform="rotate(18,490,42)"/>
        {/* Peppercorns */}
        <circle cx="450" cy="30" r="4" fill="#1A1A1A" opacity="0.9"/>
        <circle cx="442" cy="52" r="3.5" fill="#333333" opacity="0.8"/>
        <circle cx="460" cy="44" r="3" fill="#1A1A1A" opacity="0.7"/>
        {/* Spoon 5 — Garam masala */}
        <ellipse cx="620" cy="38" rx="23" ry="14" fill="#8B4513" transform="rotate(-15,620,38)"/>
        <rect x="635" y="33" width="39" height="8" rx="4" fill="#6B3410" transform="rotate(-15,620,38)"/>
        <ellipse cx="616" cy="36" rx="9" ry="7" fill="#C06820" transform="rotate(-15,620,38)"/>
        {/* Cardamom */}
        <ellipse cx="695" cy="32" rx="6" ry="11" fill="#4A7A14" opacity="0.85" transform="rotate(20,695,32)"/>
        <ellipse cx="708" cy="54" rx="5" ry="10" fill="#3A6A10" opacity="0.75" transform="rotate(-8,708,54)"/>
        {/* Cinnamon sticks */}
        <rect x="750" y="26" width="5" height="26" rx="2.5" fill="#8B4513" opacity="0.85" transform="rotate(12,752,39)"/>
        <rect x="760" y="22" width="5" height="26" rx="2.5" fill="#6B3410" opacity="0.75" transform="rotate(7,762,35)"/>
        {/* Spoon 6 — Red chilli powder */}
        <ellipse cx="850" cy="40" rx="24" ry="15" fill="#CC2A00" transform="rotate(10,850,40)"/>
        <rect x="865" y="35" width="40" height="8" rx="4" fill="#AA2000" transform="rotate(10,850,40)"/>
        <ellipse cx="846" cy="38" rx="10" ry="7" fill="#FF5500" transform="rotate(10,850,40)"/>
        {/* Dried chillies */}
        <path d="M920,22 Q932,14 944,24 Q950,34 938,38 Q926,40 918,32 Z" fill="#8B0000" opacity="0.9"/>
        <line x1="920" y1="22" x2="917" y2="12" stroke="#228B22" strokeWidth="2.5"/>
        <path d="M950,50 Q962,42 974,52 Q980,62 968,66 Q956,68 948,60 Z" fill="#AA1A00" opacity="0.8"/>
        <line x1="950" y1="50" x2="947" y2="40" stroke="#228B22" strokeWidth="2"/>
        {/* Spoon 7 — Pink salt */}
        <ellipse cx="1060" cy="38" rx="22" ry="13" fill="#E8A0A0" transform="rotate(-16,1060,38)"/>
        <rect x="1074" y="34" width="38" height="7" rx="3.5" fill="#C07070" transform="rotate(-16,1060,38)"/>
        <ellipse cx="1056" cy="36" rx="9" ry="6" fill="#FFB0B0" transform="rotate(-16,1060,38)"/>
        {/* Spoon 8 — Curry orange */}
        <ellipse cx="1150" cy="42" rx="22" ry="13" fill="#E8920A" transform="rotate(14,1150,42)"/>
        <rect x="1164" y="37" width="36" height="7" rx="3.5" fill="#C07008" transform="rotate(14,1150,42)"/>
        <ellipse cx="1146" cy="40" rx="9" ry="6" fill="#FFB800" transform="rotate(14,1150,42)"/>
        {/* Bottom gold line */}
        <rect x="0" y="75" width="1200" height="3" fill="url(#sg)"/>
        <defs>
          <linearGradient id="sg" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8B1A1A"/>
            <stop offset="33%" stopColor="#D4A843"/>
            <stop offset="66%" stopColor="#8B1A1A"/>
            <stop offset="100%" stopColor="#D4A843"/>
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
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      obs.disconnect();
      const step = end / (duration / 16);
      let current = 0;
      const timer = setInterval(() => {
        current = Math.min(current + step, end);
        setCount(Math.round(current));
        if (current >= end) clearInterval(timer);
      }, 16);
    });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// ─── Hero product slideshow ────────────────────────────────────────────────────
function HeroSlideshow({ products }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCurrent(i => (i + 1) % products.length), 2500);
    return () => clearInterval(t);
  }, [products.length]);

  const prev = products[(current - 1 + products.length) % products.length];
  const curr = products[current];
  const next = products[(current + 1) % products.length];

  return (
    <div className="relative w-72 overflow-hidden" aria-label="Product slideshow">
      <div className="flex gap-3 items-center justify-center">
        {[prev, curr, next].map((p, i) => (
          <Link
            key={`${p.id}-${i}`}
            to={`/shop/${p.slug}`}
            className={`bg-white rounded-2xl shadow-lg transition-all duration-500 flex flex-col
                        items-center overflow-hidden flex-shrink-0
                        ${i === 1
                          ? 'w-28 h-36 opacity-100 scale-110 z-10 shadow-xl'
                          : 'w-20 h-28 opacity-50 scale-95'}`}
          >
            <div className="flex-1 w-full flex items-center justify-center p-2 bg-white">
              <img src={p.image_url} alt={p.name}
                className="w-full h-full object-contain"
                onError={e => { e.target.src = '/placeholder-spice.svg'; }} />
            </div>
            {i === 1 && (
              <div className="w-full bg-primary/5 px-2 py-1.5 text-center border-t border-border">
                <p className="text-[10px] font-bold text-text-dark leading-tight line-clamp-1">
                  {p.name}
                </p>
                <p className="text-[10px] font-bold text-primary mt-0.5">
                  Rs. {p.price}
                </p>
              </div>
            )}
          </Link>
        ))}
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-1 mt-3">
        {products.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            aria-label={`Go to product ${i + 1}`}
            className={`rounded-full transition-all duration-300
              ${i === current ? 'w-4 h-1.5 bg-accent' : 'w-1.5 h-1.5 bg-white/30'}`} />
        ))}
      </div>
    </div>
  );
}

// ─── Category cards ────────────────────────────────────────────────────────────
const CATEGORIES = [
  {
    slug: 'recipe-mixes',
    label: 'Recipe Mixes',
    desc: 'Complete masala blends for authentic dishes',
    emoji: '🍛',
    from: '#7B2D2D',
    to: '#4A1A1A',
    count: 4,
  },
  {
    slug: 'spice-powders',
    label: 'Spice Powders',
    desc: 'Freshly ground single-spice powders',
    emoji: '🌶️',
    from: '#B05000',
    to: '#6B2800',
    count: 10,
  },
  {
    slug: 'salts',
    label: 'Himalayan Salts',
    desc: 'Pure Himalayan salts — Pink, Iodized & Refined',
    emoji: '🧂',
    from: '#3A6B8A',
    to: '#1E3D52',
    count: 3,
  },
];

// ─── Testimonials ──────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  { name: 'Amina Bibi',    city: 'Peshawar',   text: 'Daadi Maa ki quorma mix ne ghar ka khaana bilkul restaurant jaisa bana diya. Zabardast khushboo!', rating: 5 },
  { name: 'Khalid Mehmood', city: 'Lahore',    text: 'Bombay Biryani Masala is absolutely authentic. My family asks for it every weekend now.',           rating: 5 },
  { name: 'Sara Khan',      city: 'Mardan',    text: 'The Himalayan Pink Salt is 100% pure. You can taste the difference. Will order again!',            rating: 5 },
  { name: 'Rashid Ali',     city: 'Islamabad', text: 'All spice powders are fresh and aromatic. Cash on delivery makes it very convenient.',              rating: 5 },
];

const TRUST_STATS = [
  { label: 'Products',       value: 17,   suffix: '+' },
  { label: 'Happy Customers', value: 5000, suffix: '+' },
  { label: 'Years of Trust',  value: 10,   suffix: '+' },
  { label: '% Organic',       value: 100,  suffix: '%' },
];

// ─── Home page ─────────────────────────────────────────────────────────────────
export default function Home() {
  const [featured, setFeatured]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const { openDrawer } = useCartStore();

  useEffect(() => {
    productsApi.getAll()
      .then(res => {
        const data = res.data;
        const badged = data.filter(p => p.badge);
        const rest   = data.filter(p => !p.badge);
        setFeatured([...badged, ...rest].slice(0, 8));
      })
      .catch(() => setFeatured([]))
      .finally(() => setLoading(false));
  }, []);

  // Auto-advance testimonials
  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial(i => (i + 1) % TESTIMONIALS.length), 4500);
    return () => clearInterval(t);
  }, []);

  return (
    <main>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#1A0A05]" aria-label="Hero">
        {/* Background gradient blobs */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-accent/15 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="container-page relative py-16 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left — text */}
            <div className="text-white animate-fade-up">
              <div className="inline-flex items-center gap-2 bg-accent/20 border border-accent/30
                              rounded-full px-4 py-1.5 mb-6">
                <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                <span className="text-accent text-sm font-semibold tracking-wide">
                  Natural · Pure · Safe
                </span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Taste the Magic of{' '}
                <span className="relative inline-block">
                  <span className="text-gold-gradient">Daadi Maa's</span>
                </span>
                <br />Kitchen
              </h1>

              <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-lg">
                Premium quality spices crafted by <strong className="text-white/90">F & J Sons Foods</strong>.
                Authentic recipes, pure ingredients, and the warmth of tradition in every pack.
              </p>

              <div className="flex flex-wrap gap-3 mb-10">
                <Link to="/shop"
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark
                             text-white font-semibold px-7 py-3.5 rounded-xl transition-all
                             duration-200 active:scale-95 shadow-lg shadow-primary/30">
                  Shop All Spices
                  <ArrowRight size={18} />
                </Link>
                <Link to="/shop?category=recipe-mixes"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20
                             border border-white/20 text-white font-medium
                             px-6 py-3.5 rounded-xl transition-colors">
                  Recipe Mixes
                </Link>
              </div>

              {/* Mini trust badges */}
              <div className="flex flex-wrap gap-4">
                {[
                  { icon: Shield, text: 'Halal Certified' },
                  { icon: Award, text: 'PS 3733:2019' },
                  { icon: Leaf, text: '100% Organic' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-1.5 text-white/60 text-xs">
                    <Icon size={13} className="text-accent" />
                    {text}
                  </div>
                ))}
              </div>
            </div>

            {/* Right — logo centred + product slideshow below */}
            <div className="flex flex-col items-center gap-6 hidden lg:flex">
              {/* Logo — clean white card, full colour */}
              <div className="bg-white rounded-3xl p-6 shadow-2xl flex flex-col items-center">
                <img
                  src="/daadi-maa-logo.png"
                  alt="Daadi Maa Spices"
                  className="w-44 h-44 object-contain"
                />
                <p className="font-serif font-bold text-primary text-base italic mt-2">Daadi Maa</p>
                <p className="text-xs text-text-muted italic">Natural, Pure, Safe</p>
              </div>

              {/* Product slideshow strip */}
              {featured.length > 0 && (
                <HeroSlideshow products={featured} />
              )}
            </div>

            {/* Mobile — just the logo */}
            <div className="flex justify-center lg:hidden">
              <div className="bg-white rounded-2xl p-5 shadow-xl">
                <img src="/daadi-maa-logo.png" alt="Daadi Maa Spices"
                     className="w-32 h-32 object-contain" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SPICE STRIP ────────────────────────────────────────────────── */}
      <SpiceStrip />

      {/* ── STATS BAR ─────────────────────────────────────────────────────── */}
      <section className="bg-primary" aria-label="Trust statistics">
        <div className="container-page py-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center text-white">
            {TRUST_STATS.map(({ label, value, suffix }) => (
              <div key={label}>
                <p className="text-3xl font-serif font-bold text-accent">
                  <Counter end={value} suffix={suffix} />
                </p>
                <p className="text-white/70 text-sm mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ────────────────────────────────────────────────────── */}
      <section className="bg-cream py-16" aria-labelledby="categories-heading">
        <div className="container-page">
          <div className="text-center mb-10">
            <h2 id="categories-heading" className="section-title mb-2">Browse by Category</h2>
            <p className="text-text-muted">Explore our range of authentic Pakistani spices</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {CATEGORIES.map(cat => (
              <Link key={cat.slug} to={`/shop?category=${cat.slug}`}
                className="group relative overflow-hidden rounded-2xl text-white shadow-lg
                           hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                {/* Background gradient */}
                <div className="absolute inset-0"
                     style={{ background: `linear-gradient(135deg, ${cat.from} 0%, ${cat.to} 100%)` }} />

                {/* Decorative circle */}
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/5 rounded-full" />
                <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/5 rounded-full" />

                <div className="relative p-7">
                  <span className="text-4xl mb-4 block" aria-hidden="true">{cat.emoji}</span>
                  <h3 className="font-serif font-bold text-xl mb-1 group-hover:text-accent transition-colors">
                    {cat.label}
                  </h3>
                  <p className="text-white/65 text-sm leading-relaxed mb-4">{cat.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/50">{cat.count} products</span>
                    <span className="flex items-center gap-1 text-sm font-semibold text-accent
                                     group-hover:gap-2 transition-all">
                      Shop <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ─────────────────────────────────────────────── */}
      <section className="bg-white py-16" aria-labelledby="featured-heading">
        <div className="container-page">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
            <div>
              <h2 id="featured-heading" className="section-title mb-1">Featured Products</h2>
              <p className="text-text-muted">Hand-picked favourites loved by our customers</p>
            </div>
            <Link to="/shop"
              className="text-primary font-semibold text-sm flex items-center gap-1
                         hover:gap-2 transition-all group">
              View all
              <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner label="Loading products…" />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {featured.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link to="/shop"
              className="inline-flex items-center gap-2 btn-outline text-base px-8 py-3">
              <ShoppingCart size={18} />
              Browse All 17 Products
            </Link>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────────── */}
      <section className="bg-cream-dark py-16" aria-labelledby="how-heading">
        <div className="container-page">
          <div className="text-center mb-10">
            <h2 id="how-heading" className="section-title mb-2">How It Works</h2>
            <p className="text-text-muted">Order fresh spices in 3 simple steps</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative">
            {/* Connecting line */}
            <div className="absolute top-10 left-1/4 right-1/4 h-0.5 bg-border hidden sm:block"
                 aria-hidden="true" />

            {[
              { step: '01', icon: ShoppingCart, title: 'Browse & Add',   desc: 'Explore our 17 premium spice products and add your favourites to cart.' },
              { step: '02', icon: Award,        title: 'Place Order',    desc: 'Fill in your delivery details. No account or online payment needed.' },
              { step: '03', icon: Truck,        title: 'Get Delivered',  desc: 'We deliver to your door. Pay in cash when your spices arrive.' },
            ].map(({ step, icon: Icon, title, desc }) => (
              <div key={step} className="text-center relative">
                <div className="relative inline-flex items-center justify-center w-20 h-20
                                bg-white rounded-2xl shadow-card border border-border mb-5 mx-auto">
                  <span className="absolute -top-2.5 -right-2.5 w-6 h-6 bg-primary text-white
                                   text-[10px] font-bold rounded-full flex items-center justify-center">
                    {step}
                  </span>
                  <Icon size={28} className="text-primary" />
                </div>
                <h3 className="font-serif font-semibold text-text-dark text-lg mb-2">{title}</h3>
                <p className="text-text-muted text-sm leading-relaxed max-w-xs mx-auto">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────────────── */}
      <section className="bg-white py-16 overflow-hidden" aria-labelledby="testimonials-heading">
        <div className="container-page">
          <div className="text-center mb-10">
            <h2 id="testimonials-heading" className="section-title mb-2">What Our Customers Say</h2>
            <p className="text-text-muted">Real reviews from real families</p>
          </div>

          <div className="relative max-w-2xl mx-auto">
            {/* Testimonial card */}
            <div className="bg-cream rounded-2xl p-8 border border-border shadow-card relative overflow-hidden min-h-[180px]">
              <div className="absolute top-5 left-6 text-6xl text-primary/10 font-serif
                              leading-none pointer-events-none select-none" aria-hidden="true">
                "
              </div>

              <div className="relative">
                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {Array(5).fill(0).map((_, i) => (
                    <Star key={i} size={14} className="text-accent fill-accent" />
                  ))}
                </div>

                <p className="text-text-dark leading-relaxed mb-5 text-base italic transition-all duration-500">
                  "{TESTIMONIALS[activeTestimonial].text}"
                </p>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center
                                  text-white font-bold text-sm flex-shrink-0">
                    {TESTIMONIALS[activeTestimonial].name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-text-dark text-sm">
                      {TESTIMONIALS[activeTestimonial].name}
                    </p>
                    <p className="text-text-muted text-xs">{TESTIMONIALS[activeTestimonial].city}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-3 mt-5">
              <button onClick={() => setActiveTestimonial(i => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
                aria-label="Previous testimonial"
                className="w-8 h-8 rounded-full border border-border bg-white hover:bg-cream-dark
                           flex items-center justify-center transition-colors text-text-muted hover:text-primary">
                <ChevronLeft size={16} />
              </button>
              {TESTIMONIALS.map((_, i) => (
                <button key={i} onClick={() => setActiveTestimonial(i)}
                  aria-label={`Testimonial ${i + 1}`}
                  className={`w-2 h-2 rounded-full transition-all duration-300
                    ${i === activeTestimonial ? 'bg-primary w-5' : 'bg-border hover:bg-text-muted'}`} />
              ))}
              <button onClick={() => setActiveTestimonial(i => (i + 1) % TESTIMONIALS.length)}
                aria-label="Next testimonial"
                className="w-8 h-8 rounded-full border border-border bg-white hover:bg-cream-dark
                           flex items-center justify-center transition-colors text-text-muted hover:text-primary">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST SECTION ─────────────────────────────────────────────────── */}
      <section className="bg-cream-dark py-16" aria-labelledby="trust-heading">
        <div className="container-page">
          <div className="text-center mb-10">
            <h2 id="trust-heading" className="section-title mb-2">Why Choose Daadi Maa?</h2>
            <p className="text-text-muted">Every packet carries a promise</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Leaf,   title: 'Natural & Organic',    desc: '100% organic ingredients. No artificial additives, colours or preservatives.' },
              { icon: Shield, title: 'Halal Certified',      desc: 'Certified by KPFSHFA/2021. Every product meets strict Halal food standards.' },
              { icon: Award,  title: 'PS 3733:2019',         desc: 'AHCS Pakistan Standards conformity assessed. Quality you can measure.' },
              { icon: Truck,  title: 'Cash on Delivery',     desc: 'Order online, pay when delivered. No online payment required.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title}
                   className="bg-white rounded-2xl p-6 text-center shadow-card border border-border
                              hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-12 h-12 bg-primary/8 group-hover:bg-primary/15 rounded-2xl
                                flex items-center justify-center mx-auto mb-4 transition-colors">
                  <Icon size={22} className="text-primary" />
                </div>
                <h3 className="font-serif font-semibold text-text-dark mb-2">{title}</h3>
                <p className="text-text-muted text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SPICE STRIP ────────────────────────────────────────────────── */}
      <SpiceStrip />

      {/* ── CTA BANNER ────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-primary" aria-label="Call to action">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/5 rounded-full" />
        </div>
        <div className="container-page relative py-14 flex flex-col sm:flex-row
                        items-center justify-between gap-6">
          <div className="text-white text-center sm:text-left">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-2">
              Ready to elevate your cooking?
            </h2>
            <p className="text-white/70 text-sm">
              17 premium spices · Cash on Delivery · Authentic Pakistani flavours
            </p>
          </div>
          <Link to="/shop"
            className="flex-shrink-0 inline-flex items-center gap-2 bg-accent hover:bg-accent-dark
                       text-white font-bold px-8 py-4 rounded-xl transition-all duration-200
                       active:scale-95 shadow-lg shadow-black/20 text-base">
            Shop Now
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}

