import { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart, Plus, Minus, Tag, Shield, Leaf, Star,
  Truck, Check, Package, ChevronLeft, ChevronRight,
  X, ZoomIn
} from "lucide-react";
import toast from "react-hot-toast";
import { productsApi } from "../api/client";
import useCartStore from "../store/cartStore";
import { formatCurrency } from "../utils/formatCurrency";
import LoadingSpinner from "../components/LoadingSpinner";
import ProductCard from "../components/ProductCard";

/* ─── Product data — exact ingredients from actual packaging photos ────────── */
const PRODUCT_DATA = {
  "quorma-mix": {
    description: "Daadi Maa Quorma Recipe Mix is a premium, aromatic blend of whole spices carefully crafted to recreate the rich, slow-cooked taste of traditional Pakistani Quorma. Simply add meat and follow the easy recipe for a restaurant-quality dish at home.",
    weight: "200g", serves: "4-6 persons",
    features: ["Premium whole spice blend", "No artificial colours", "Traditional Quorma recipe", "100% Organic"],
    ingredientText: "Cinnamon, Cardamom Green, White Cumin, Star Anise, Ginger, Long (Cloves), Nutmeg, Jawtri (Mace), Citric Acid, Amorphous Silicon Dioxide as anticaking agent.",
    extraImages: []
  },
  "achar-gosht-masala": {
    description: "Daadi Maa Achar Gosht Masala Mix brings the bold, tangy flavour of classic Pakistani Achar Gosht to your kitchen. Packed with pickling spices and whole red chillies, this blend gives your meat curry that distinctive tart, spiced punch.",
    weight: "200g", serves: "4-6 persons",
    features: ["Authentic pickling spice blend", "Bold tangy flavour", "No artificial additives", "100% Organic"],
    ingredientText: "Red Chilli, Salt, Cumin Seed, Coriander, Mango Powder, Aniseed, Fenugreek Seed, Nigella Seed, Turmeric, Carom Seed, Mustard Seed, Fenugreek Leaf, Citric Acid, Amorphous Silicon Dioxide as anticaking agent.",
    extraImages: ["/images/achar-gosht-ingredients.jpg"]
  },
  "kabuli-pulao-masala": {
    description: "Daadi Maa Kabuli Pulao Masala is a fragrant, well-balanced spice blend inspired by the beloved Kabuli Pulao. It combines warm whole spices to perfectly flavour the meat and rice, delivering an aromatic, fluffy Pulao every time.",
    weight: "200g", serves: "4-6 persons",
    features: ["Fragrant whole spice blend", "Authentic Kabuli Pulao recipe", "Premium quality spices", "100% Natural"],
    ingredientText: "Red Chilli, Salt, Cumin Seed, Coriander, Mango Powder, Aniseed, Fenugreek Seed, Nigella Seed, Turmeric, Carom Seed, Mustard Seed, Fenugreek Leaf, Citric Acid, Amorphous Silicon Dioxide as anticaking agent.",
    extraImages: ["/images/kabuli-pulao-ingredients.jpg"]
  },
  "bombay-biryani-masala": {
    description: "Daadi Maa Bombay Biryani Masala captures the bold, layered flavours of classic Bombay-style biryani. With perfectly balanced aromatic spices, this mix creates the deeply fragrant biryani your family will love. PS 3733:2019 Certified.",
    weight: "200g", serves: "4-6 persons",
    features: ["Bombay-style spice blend", "Perfect heat balance", "PS 3733:2019 Certified", "Halal Certified"],
    ingredientText: "Red Chilli, Black Pepper, Mango Powder, White Salt, Black Salt, Lemon, White Cumin, Black Cumin, Spices and Citric Acid.",
    extraImages: ["/images/bombay-biryani-ingredients.jpg"]
  },
  "tikka-boti-powder": {
    description: "Daadi Maa Tikka Boti Powder is the perfect dry marinade for tender, smoky grilled tikka and boti. Rub generously onto chicken, beef or mutton before grilling or baking for authentic Pakistani BBQ flavour.",
    weight: "100g", serves: "3-4 persons",
    features: ["Perfect BBQ marinade", "Works on chicken, beef, mutton", "Smoky authentic flavour", "No artificial colours"],
    ingredientText: "Salt, Red Chilli, Ginger, Garlic, Onion, Nutmeg, Mace, Turmeric, Aloe Bukhara, Celery, Khatai Powder, Cardamom, Cumin, Black Pepper, Kalonji, Bay Leaf, Star Anise, Coriander, Citric Acid, Natural & Artificial Flavour.",
    extraImages: []
  },
  "fish-masala-powder": {
    description: "Daadi Maa Fish Masala Powder is a zesty, carefully balanced spice blend for fish and seafood. The mild heat and citrus notes enhance the natural flavour of fish without overpowering it — ideal for frying, grilling or currying.",
    weight: "100g", serves: "3-4 persons",
    features: ["Balanced heat for seafood", "Enhances natural fish flavour", "Ideal for frying or grilling", "100% Natural"],
    ingredientText: "Red Chilli, Coriander, Salt, Turmeric, Cumin, Black Pepper, Dry Mango, Carom Seeds, Garlic and Spices.",
    extraImages: []
  },
  "peshawari-chatpatta-masala": {
    description: "Daadi Maa Peshawari Chatpatta Masala is an iconic tangy chaat masala inspired by the vibrant street food culture of Peshawar. Its bold sour-spicy profile is perfect as a finishing sprinkle on chaat, fruit, snacks and grilled meats.",
    weight: "100g", serves: "Multiple uses",
    features: ["Iconic Peshawari flavour", "Perfect on chaat and snacks", "Bold sour-spicy profile", "Regional Special"],
    ingredientText: "Red Chilli, Black Pepper, Mango Powder, White Salt, Black Salt, Lemon, White Cumin, Black Cumin, Spices and Citric Acid.",
    extraImages: ["/images/chatpatta-masala-ingredients.jpg"]
  },
  "curry-powder": {
    description: "Daadi Maa Curry Powder (Salan Masala) is a versatile, everyday masala blend. Whether cooking chicken, mutton, vegetables or lentils, this balanced powder delivers consistent, authentic Pakistani curry taste. By F & J Sons Foods (Pvt) Ltd.",
    weight: "100g", serves: "4-6 persons",
    features: ["Everyday curry blend", "Balanced spice level", "Works with any protein", "100% Natural"],
    ingredientText: "Red Chilli, Coriander, Turmeric, Garlic, Cinnamon, Celery, Nutmeg, Mace, Black Pepper, Fennel Seed, Big Cardamom, Long (Cloves), Ginger Powder, Salt, Amorphous Silicon Dioxide as anticaking agent.",
    extraImages: ["/images/curry-powder-ingredients.jpg"]
  },
  "garam-masala-powder": {
    description: "Daadi Maa Garam Masala Powder is a warming, aromatic blend of whole spices ground to perfection. Add a pinch at the end of cooking to finish any dish with a rich, deep fragrance — the hallmark of authentic Pakistani cooking.",
    weight: "50g", serves: "Multiple dishes",
    features: ["Classic warming blend", "Finishing spice", "Freshly ground", "Premium whole spices"],
    ingredientText: "Cinnamon, Cardamom Green, White Cumin, Star Anise, Ginger, Long (Cloves), Nutmeg, Jawtri (Mace), Citric Acid, Amorphous Silicon Dioxide as anticaking agent.",
    extraImages: []
  },
  "black-pepper-powder": {
    description: "Daadi Maa Black Pepper Powder is finely ground from premium quality black peppercorns. Its sharp, pungent heat adds depth and character to any dish — from curries and marinades to soups and salads.",
    weight: "50g", serves: "Multiple uses",
    features: ["100% Pure black pepper", "Finely ground", "Premium quality", "No additives"],
    ingredientText: "100% Pure Black Pepper (Piper nigrum).",
    extraImages: []
  },
  "red-chilli-powder": {
    description: "Daadi Maa Red Chilli Powder is ground from vibrant, sun-dried red chillies delivering bold heat and rich red colour to your curries, marinades and chutneys. Pure, natural flavour with consistent heat every time.",
    weight: "100g", serves: "Multiple uses",
    features: ["Vibrant red colour", "Bold consistent heat", "100% Pure", "No artificial colouring"],
    ingredientText: "100% Pure Dried Red Chilli (Capsicum annuum).",
    extraImages: []
  },
  "red-chilli-flakes": {
    description: "Daadi Maa Red Chilli Flakes are coarsely crushed dried red chillies with seeds. Sprinkle on pizza, pasta, kebabs or dips for a rustic spicy kick with visible texture and bold colour.",
    weight: "50g", serves: "Multiple uses",
    features: ["Coarsely crushed with seeds", "Extra heat", "Versatile topping", "No additives"],
    ingredientText: "100% Crushed Dried Red Chilli with Seeds.",
    extraImages: []
  },
  "coriander-powder": {
    description: "Daadi Maa Coriander Powder is freshly milled from quality coriander seeds. Its mild citrusy, earthy flavour forms the base of most Pakistani curries and is an essential ingredient in any spice collection.",
    weight: "100g", serves: "Multiple dishes",
    features: ["Freshly milled", "Mild citrusy flavour", "Essential curry base", "100% Pure"],
    ingredientText: "100% Pure Coriander Seeds (Coriandrum sativum).",
    extraImages: []
  },
  "turmeric-powder": {
    description: "Daadi Maa Turmeric Powder is pure, finely ground turmeric with high curcumin content. It gives curries their golden colour and earthy flavour while providing natural health benefits.",
    weight: "100g", serves: "Multiple dishes",
    features: ["High curcumin content", "Vibrant golden colour", "Natural health benefits", "100% Pure"],
    ingredientText: "100% Pure Turmeric (Curcuma longa).",
    extraImages: []
  },
  "iodized-salt": {
    description: "Daadi Maa Iodized Salt is premium Himalayan rock salt enriched with iodine for essential mineral balance. Mined from the pure Himalayan mountain range, it provides clean natural saltiness with added nutritional benefit.",
    weight: "800g", serves: "Daily use",
    features: ["Himalayan origin", "Iodine enriched", "Essential minerals", "Pure and natural"],
    ingredientText: "Himalayan Rock Salt, Potassium Iodate.",
    extraImages: []
  },
  "pure-refined-salt": {
    description: "Daadi Maa Pure Refined Salt is fine-grain Himalayan salt refined to remove impurities while retaining its natural minerals. Perfect for everyday cooking, baking and table use.",
    weight: "800g", serves: "Daily use",
    features: ["Fine grain", "Himalayan origin", "Refined and pure", "Everyday use"],
    ingredientText: "100% Pure Himalayan Rock Salt (refined).",
    extraImages: []
  },
  "himalayan-pink-salt": {
    description: "Daadi Maa Himalayan Pink Salt is naturally mined from the ancient Khewra Salt Mine in Pakistan. Its distinctive pink colour comes from trace minerals including iron oxide. Richer in minerals than regular table salt.",
    weight: "800g", serves: "Daily use",
    features: ["Naturally pink colour", "Rich in trace minerals", "Mined in Pakistan", "Premium quality"],
    ingredientText: "100% Natural Himalayan Pink Rock Salt.",
    extraImages: []
  }
};
const BADGE_STYLES = {
  "Bestseller":       { bg: "#D97706", text: "#fff" },
  "Popular":          { bg: "#8B1E17", text: "#fff" },
  "Premium":          { bg: "#23120B", text: "#fff" },
  "Regional Special": { bg: "#3E5244", text: "#fff" },
};

/* ─── Lightbox: full-screen, blurred backdrop, image never cropped ─────────── */
function Lightbox({ images, activeIndex, onClose, onChange }) {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onChange((activeIndex + 1) % images.length);
      if (e.key === "ArrowLeft")  onChange((activeIndex - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", handler); document.body.style.overflow = ""; };
  }, [activeIndex, images.length, onClose, onChange]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.88)", backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)" }}
      onClick={onClose}
      role="dialog" aria-modal="true" aria-label="Image lightbox"
    >
      {/* Close */}
      <button onClick={onClose}
        className="absolute top-4 right-4 w-11 h-11 rounded-full flex items-center justify-center z-20 transition-colors"
        style={{ background: "rgba(255,255,255,0.18)", color: "#fff" }}
        aria-label="Close">
        <X size={22} />
      </button>

      {/* Counter */}
      <span className="absolute top-5 left-1/2 -translate-x-1/2 text-white/70 text-sm font-medium z-20">
        {activeIndex + 1} / {images.length}
      </span>

      {/* Image — fit entire image, no crop, white background */}
      <div
        className="relative flex items-center justify-center rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: "#fff", maxWidth: "700px", width: "90vw", maxHeight: "90vh" }}
        onClick={e => e.stopPropagation()}
      >
        <img
          src={images[activeIndex].url}
          alt={images[activeIndex].label}
          style={{
            display: "block",
            maxWidth: "700px",
            maxHeight: "90vh",
            width: "auto",
            height: "auto",
            objectFit: "contain"
          }}
          draggable={false}
        />
        <span className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-sm font-semibold"
          style={{ background: "rgba(35,18,11,0.82)", color: "#fff" }}>
          {images[activeIndex].label}
        </span>
      </div>

      {/* Arrows */}
      {images.length > 1 && (
        <>
          <button onClick={e => { e.stopPropagation(); onChange((activeIndex - 1 + images.length) % images.length); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center transition-colors z-20"
            style={{ background: "rgba(255,255,255,0.18)", color: "#fff" }} aria-label="Previous">
            <ChevronLeft size={26} />
          </button>
          <button onClick={e => { e.stopPropagation(); onChange((activeIndex + 1) % images.length); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center transition-colors z-20"
            style={{ background: "rgba(255,255,255,0.18)", color: "#fff" }} aria-label="Next">
            <ChevronRight size={26} />
          </button>
        </>
      )}
    </div>
  );
}

export default function ProductDetail() {
  const { slug }    = useParams();
  const navigate    = useNavigate();
  const { addItem, openDrawer } = useCartStore();
  const [product, setProduct]     = useState(null);
  const [related, setRelated]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [quantity, setQuantity]   = useState(1);
  const [adding, setAdding]       = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [lightbox, setLightbox]   = useState(false);

  useEffect(() => {
    setLoading(true); setError(""); setQuantity(1); setActiveImg(0); setLightbox(false);
    productsApi.getBySlug(slug)
      .then(async res => {
        setProduct(res.data);
        if (res.data.category_slug) {
          try {
            const rel = await productsApi.getAll({ category: res.data.category_slug });
            setRelated(rel.data.filter(p => p.slug !== slug).slice(0, 4));
          } catch { /* ok */ }
        }
      })
      .catch(err => setError(err.message || "Product not found."))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleAddToCart = useCallback(() => {
    if (!product?.in_stock || adding) return;
    setAdding(true);
    addItem(product, quantity);
    toast.success(`${product.name} x${quantity} added!`, { icon: "🛒" });
    openDrawer();
    setTimeout(() => setAdding(false), 800);
  }, [product, quantity, adding, addItem, openDrawer]);

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center" style={{ background: "#FBF9F5" }}>
      <LoadingSpinner label="Loading product..." />
    </div>
  );
  if (error || !product) return (
    <div className="container-page py-20 text-center" style={{ background: "#FBF9F5" }}>
      <p className="text-5xl mb-4">🌶️</p>
      <h1 className="font-serif text-2xl font-bold mb-2" style={{ color: "#23120B" }}>Product not found</h1>
      <p className="mb-6" style={{ color: "#7C6B5E" }}>{error || "This product does not exist."}</p>
      <Link to="/shop" className="btn-primary px-6 py-3">Back to Shop</Link>
    </div>
  );

  const pd = PRODUCT_DATA[slug] || {};
  const allImages = [
    { url: product.image_url || "/placeholder-spice.svg", label: "Product" },
    ...(pd.extraImages || []).map(url => ({ url, label: "Ingredients" }))
  ];
  const hasMultiple = allImages.length > 1;
  const badge = product.badge ? BADGE_STYLES[product.badge] : null;

  return (
    <>
      {lightbox && (
        <Lightbox images={allImages} activeIndex={activeImg}
          onClose={() => setLightbox(false)} onChange={setActiveImg} />
      )}

      <main style={{ background: "#FBF9F5" }} className="min-h-screen">
        <div className="container-page py-6 sm:py-10">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs mb-8 flex-wrap" aria-label="Breadcrumb">
            <Link to="/" style={{ color: "#7C6B5E" }} className="hover:text-primary transition-colors">Home</Link>
            <span style={{ color: "#D1C4BA" }}>›</span>
            <Link to="/shop" style={{ color: "#7C6B5E" }} className="hover:text-primary transition-colors">Shop</Link>
            {product.category_name && <>
              <span style={{ color: "#D1C4BA" }}>›</span>
              <Link to={"/shop?category=" + product.category_slug} style={{ color: "#7C6B5E" }}
                className="hover:text-primary transition-colors">{product.category_name}</Link>
            </>}
            <span style={{ color: "#D1C4BA" }}>›</span>
            <span className="font-medium truncate max-w-[200px]" style={{ color: "#23120B" }}>{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 mb-16">

            {/* LEFT — image panel */}
            <div className="space-y-4">

              {/* Main image — click = lightbox */}
              <div className="relative rounded-3xl overflow-hidden bg-white border shadow-card-hover cursor-zoom-in group/img"
                style={{ borderColor: "#EFE8DF", aspectRatio: "1/1" }}
                onClick={() => setLightbox(true)} role="button" aria-label="Enlarge image">

                <img key={activeImg}
                  src={allImages[activeImg].url}
                  alt={product.name + (activeImg > 0 ? " — " + allImages[activeImg].label : "")}
                  className="w-full h-full object-contain p-6 transition-transform duration-500 group-hover/img:scale-[1.04]"
                  loading="eager"
                  onError={e => { e.target.src = "/placeholder-spice.svg"; }} />

                {badge && activeImg === 0 && (
                  <span className="absolute top-5 left-5 px-3 py-1.5 rounded-full text-sm font-bold shadow-lg z-10"
                    style={{ background: badge.bg, color: badge.text }}>{product.badge}</span>
                )}

                {/* Zoom hint icon */}
                <span className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 shadow
                                 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity z-10">
                  <ZoomIn size={16} style={{ color: "#23120B" }} />
                </span>

                {hasMultiple && (
                  <span className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold z-10"
                    style={{ background: "rgba(35,18,11,0.72)", color: "#fff" }}>
                    {allImages[activeImg].label} · {activeImg + 1}/{allImages.length}
                  </span>
                )}

                {/* Slide arrows */}
                {hasMultiple && <>
                  <button onClick={e => { e.stopPropagation(); setActiveImg(i => (i - 1 + allImages.length) % allImages.length); }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md
                               flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-20"
                    style={{ border: "2px solid #EFE8DF" }} aria-label="Previous image">
                    <ChevronLeft size={20} style={{ color: "#23120B" }} />
                  </button>
                  <button onClick={e => { e.stopPropagation(); setActiveImg(i => (i + 1) % allImages.length); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md
                               flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-20"
                    style={{ border: "2px solid #EFE8DF" }} aria-label="Next image">
                    <ChevronRight size={20} style={{ color: "#23120B" }} />
                  </button>
                </>}

                {!product.in_stock && (
                  <div className="absolute inset-0 flex items-center justify-center z-30"
                    style={{ background: "rgba(255,255,255,0.85)" }}>
                    <span className="font-semibold px-6 py-2.5 rounded-full shadow text-white"
                      style={{ background: "#23120B" }}>Out of Stock</span>
                  </div>
                )}
              </div>

              {/* Thumbnails — only when 2+ images */}
              {hasMultiple && (
                <div className="flex gap-3">
                  {allImages.map((img, i) => (
                    <button key={i} onClick={() => setActiveImg(i)}
                      className="relative flex-1 rounded-2xl overflow-hidden border-2 transition-all duration-200 bg-white"
                      style={{
                        borderColor: i === activeImg ? "#8B1E17" : "#EFE8DF",
                        aspectRatio: "1/1",
                        boxShadow: i === activeImg ? "0 0 0 3px rgba(139,30,23,0.20)" : "none"
                      }}
                      aria-label={"View " + img.label}>
                      <img src={img.url} alt={img.label}
                        className="w-full h-full object-contain p-2" loading="lazy"
                        onError={e => { e.target.src = "/placeholder-spice.svg"; }} />
                      <span className="absolute bottom-0 inset-x-0 text-center text-[9px] font-bold py-1"
                        style={{ background: i === activeImg ? "#8B1E17" : "rgba(35,18,11,0.55)", color: "#fff" }}>
                        {img.label}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Shield, label: "Halal Certified" },
                  { icon: Leaf,   label: "100% Natural"    },
                  { icon: Truck,  label: "Cash on Delivery" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="bg-white rounded-xl border py-3 flex flex-col items-center gap-1.5 text-center"
                    style={{ borderColor: "#EFE8DF" }}>
                    <Icon size={16} style={{ color: "#8B1E17" }} />
                    <span className="text-xs font-medium" style={{ color: "#23120B" }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — product info */}
            <div className="flex flex-col">

              {product.category_name && (
                <Link to={"/shop?category=" + product.category_slug}
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest mb-3 hover:opacity-80"
                  style={{ color: "#D97706" }}>
                  <Tag size={11} /> {product.category_name}
                </Link>
              )}

              <h1 className="font-serif text-3xl sm:text-4xl font-bold leading-tight mb-4" style={{ color: "#23120B" }}>
                {product.name}
              </h1>

              <div className="flex items-center gap-1.5 mb-4">
                {Array(5).fill(0).map((_, i) => (
                  <Star key={i} size={16} style={{ color: "#D97706", fill: "#D97706" }} />
                ))}
                <span className="text-sm ml-1" style={{ color: "#7C6B5E" }}>Premium Quality</span>
              </div>

              <div className="flex items-baseline gap-3 mb-5">
                <span className="text-4xl font-bold" style={{ color: "#8B1E17" }}>{formatCurrency(product.price)}</span>
                {pd.weight && (
                  <span className="text-sm px-2.5 py-1 rounded-lg" style={{ background: "#F3EFE8", color: "#7C6B5E" }}>
                    Net Wt. {pd.weight}
                  </span>
                )}
                {pd.serves && (
                  <span className="text-sm px-2.5 py-1 rounded-lg" style={{ background: "#F3EFE8", color: "#7C6B5E" }}>
                    Serves {pd.serves}
                  </span>
                )}
              </div>

              <p className="text-base leading-relaxed mb-5" style={{ color: "#7C6B5E" }}>
                {pd.description || product.description}
              </p>

              {pd.features && (
                <div className="grid grid-cols-2 gap-2 mb-5">
                  {pd.features.map(f => (
                    <div key={f} className="flex items-center gap-2 text-sm">
                      <span className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 text-white text-[9px] font-bold"
                        style={{ background: "#8B1E17" }}>✓</span>
                      <span style={{ color: "#23120B" }}>{f}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Ingredients — plain text only, no table */}
              {pd.ingredientText && (
                <div className="rounded-xl px-4 py-3 mb-5 border"
                  style={{ background: "#FBF9F5", borderColor: "#EFE8DF" }}>
                  <p className="text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: "#23120B" }}>
                    Ingredients
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: "#7C6B5E" }}>
                    {pd.ingredientText}
                  </p>
                </div>
              )}

              <div className="flex items-center gap-2 mb-5">
                <span className={"w-2.5 h-2.5 rounded-full " + (product.in_stock ? "bg-green-500" : "bg-red-500")} />
                <span className={"text-sm font-semibold " + (product.in_stock ? "text-green-700" : "text-red-600")}>
                  {product.in_stock ? "In Stock — Ready to Ship" : "Currently Out of Stock"}
                </span>
              </div>

              {product.in_stock && (
                <>
                  <div className="flex items-center gap-4 mb-5">
                    <span className="text-sm font-semibold" style={{ color: "#23120B" }}>Quantity:</span>
                    <div className="flex items-center rounded-xl overflow-hidden border bg-white" style={{ borderColor: "#EFE8DF" }}>
                      <button onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity <= 1}
                        className="w-12 h-12 flex items-center justify-center transition-colors disabled:opacity-40"
                        style={{ color: "#7C6B5E" }} aria-label="Decrease"><Minus size={16} /></button>
                      <span className="w-14 text-center font-bold text-lg select-none" style={{ color: "#23120B" }}>{quantity}</span>
                      <button onClick={() => setQuantity(q => Math.min(99, q + 1))} disabled={quantity >= 99}
                        className="w-12 h-12 flex items-center justify-center transition-colors disabled:opacity-40"
                        style={{ color: "#7C6B5E" }} aria-label="Increase"><Plus size={16} /></button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <button onClick={handleAddToCart} disabled={adding}
                      className="flex-1 flex items-center justify-center gap-2 text-white font-bold py-4 rounded-xl text-base
                                 transition-all active:scale-[0.98] shadow-lg"
                      style={{ background: adding ? "#3E5244" : "#8B1E17" }}>
                      {adding ? <Check size={20} /> : <ShoppingCart size={20} />}
                      {adding ? "Added to Cart!" : "Add to Cart — " + formatCurrency(product.price * quantity)}
                    </button>
                    <button onClick={() => { addItem(product, quantity); navigate("/checkout"); }}
                      className="flex-1 flex items-center justify-center gap-2 font-bold py-4 rounded-xl text-base border-2
                                 transition-all active:scale-[0.98]"
                      style={{ borderColor: "#8B1E17", color: "#8B1E17", background: "transparent" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "#8B1E17"; e.currentTarget.style.color = "#fff"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#8B1E17"; }}>
                      Buy Now
                    </button>
                  </div>
                </>
              )}

              <div className="bg-white rounded-2xl border p-5 space-y-3" style={{ borderColor: "#EFE8DF" }}>
                {[
                  { icon: Truck,   text: "Cash on Delivery — Pay when your order arrives" },
                  { icon: Shield,  text: "Halal Certified · KPFSHFA/2021" },
                  { icon: Leaf,    text: "No artificial additives or preservatives" },
                  { icon: Package, text: "Manufactured by F & J Sons Foods (Pvt) Ltd., Mardan, KPK" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3 text-sm" style={{ color: "#7C6B5E" }}>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(139,30,23,0.08)" }}>
                      <Icon size={13} style={{ color: "#8B1E17" }} />
                    </div>
                    {text}
                  </div>
                ))}
                <div className="pt-3 border-t text-xs" style={{ borderColor: "#EFE8DF", color: "#7C6B5E" }}>
                  📞 <a href="tel:03149007440" className="font-bold hover:underline" style={{ color: "#8B1E17" }}>0314-9007440</a>
                  {" · "}
                  <a href="tel:03332001341" className="font-bold hover:underline" style={{ color: "#8B1E17" }}>0333-2001341</a>
                </div>
              </div>
            </div>
          </div>

          {related.length > 0 && (
            <section aria-labelledby="related-heading">
              <div className="flex items-center justify-between mb-6">
                <h2 id="related-heading" className="font-serif text-2xl font-bold" style={{ color: "#23120B" }}>
                  More in {product.category_name}
                </h2>
                <Link to={"/shop?category=" + product.category_slug}
                  className="text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all"
                  style={{ color: "#8B1E17" }}>View all →</Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                {related.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  );
}

