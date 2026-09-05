import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Eye, Star } from "lucide-react";
import { motion } from "motion/react";
import toast from "react-hot-toast";
import useCartStore from "../store/cartStore";
import { formatCurrency } from "../utils/formatCurrency";

const BADGE_STYLES = {
  "Bestseller":       "bg-accent text-white",
  "Popular":          "bg-primary text-white",
  "Premium":          "bg-brand-dark text-white",
  "Regional Special": "bg-olive text-white",
};

export default function ProductCard({ product }) {
  const { addItem, openDrawer } = useCartStore();
  const [imgLoaded, setImgLoaded] = useState(false);
  const [adding, setAdding]       = useState(false);

  const isNew = (() => {
    if (!product.created_at) return false;
    const created = new Date(product.created_at);
    const now = new Date();
    const diffDays = (now - created) / (1000 * 60 * 60 * 24);
    return diffDays <= 30;
  })();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.in_stock || adding) return;
    setAdding(true);
    addItem(product, 1);
    toast.success(`${product.name} added to cart`, { icon: "🛒" });
    openDrawer();
    setTimeout(() => setAdding(false), 700);
  };

  return (
    <motion.article
      className="group relative bg-white rounded-card shadow-card border border-border
                 flex flex-col overflow-hidden transition-shadow duration-300
                 hover:shadow-card-hover"
      style={{ borderColor: "#EFE8DF" }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
    >

      {/* ── Image area ─────────────────────────────────────────────────── */}
      <Link
        to={`/shop/${product.slug}`}
        className="relative block overflow-hidden bg-cream"
        style={{ aspectRatio: "4/5" }}
        aria-label={`View ${product.name}`}
      >
        {/* Skeleton loader */}
        {!imgLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-cream to-cream-dark animate-pulse" />
        )}

        {/* Product image */}
        <img
          src={product.image_url || "/placeholder-spice.svg"}
          alt={product.name}
          onLoad={() => setImgLoaded(true)}
          onError={e => { e.target.src = "/placeholder-spice.svg"; setImgLoaded(true); }}
          className={`absolute inset-0 w-full h-full object-contain p-4 transition-transform duration-500
                      group-hover:scale-[1.05] ${imgLoaded ? "opacity-100" : "opacity-0"}`}
          loading="lazy"
        />

        {/* Badge */}
        {product.badge && (
          <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px]
                           font-bold shadow-sm z-10 ${BADGE_STYLES[product.badge] || "bg-primary text-white"}`}>
            {product.badge}
          </span>
        )}
        {isNew && !product.badge && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold shadow-sm z-10 text-white"
            style={{ background: '#3E5244' }}>
            New
          </span>
        )}

        {/* Out of stock */}
        {!product.in_stock && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-20">
            <span className="bg-text-dark text-white text-xs font-bold px-3 py-1.5 rounded-full">
              Out of Stock
            </span>
          </div>
        )}

        {/* Hover overlay — dark blur + "View Product" + "Add to Cart" */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2.5
                        opacity-0 group-hover:opacity-100 transition-all duration-300
                        backdrop-blur-[2px]"
             style={{ background: "rgba(35,18,11,0.48)" }}>
          <span className="flex items-center gap-2 bg-white text-sm font-bold px-5 py-2.5 rounded-full shadow-xl
                           translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                style={{ color: "#8B1E17" }}>
            <Eye size={15} />
            View Product
          </span>
          {product.in_stock && (
            <motion.button
              onClick={handleAddToCart}
              disabled={adding}
              className="flex items-center gap-1.5 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg
                         transition-colors duration-200
                         translate-y-4 group-hover:translate-y-0"
              style={{ background: adding ? "#3E5244" : "#8B1E17", transitionDelay: "50ms" }}
              aria-label={`Add ${product.name} to cart`}
              whileTap={{ scale: 0.92 }}
            >
              <ShoppingCart size={13} />
              {adding ? "✓ Added!" : "Add to Cart"}
            </motion.button>
          )}
        </div>
      </Link>

      {/* ── Info section ──────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 px-4 pb-4 pt-3 transition-colors duration-300"
           style={{ background: "inherit" }}>

        {product.category_name && (
          <span className="text-[10px] font-semibold uppercase tracking-wider mb-1
                           transition-colors duration-300 group-hover:text-accent"
                style={{ color: "#7C6B5E" }}>
            {product.category_name}
          </span>
        )}

        {/* Name */}
        <Link
          to={`/shop/${product.slug}`}
          className="font-serif font-semibold text-sm leading-snug mb-2 transition-all duration-300
                     group-hover:font-bold group-hover:text-primary line-clamp-2"
          style={{ color: "#23120B" }}
        >
          {product.name}
        </Link>

        {/* Stars */}
        <div className="flex items-center gap-0.5 mb-3">
          {Array(5).fill(0).map((_, i) => (
            <Star key={i} size={11}
              className="transition-colors duration-300 group-hover:text-accent group-hover:fill-accent text-accent fill-accent" />
          ))}
          <span className="text-[10px] ml-1 transition-colors duration-300 group-hover:text-primary"
                style={{ color: "#7C6B5E" }}>5.0</span>
        </div>

        {/* Price row */}
        <div className="mt-auto flex items-center justify-between">
          <span className="font-bold transition-all duration-300 group-hover:text-lg text-base"
                style={{ color: "#8B1E17" }}>
            {formatCurrency(product.price)}
          </span>
          <span className="text-[10px] font-medium transition-colors duration-300 group-hover:text-primary"
                style={{ color: "#7C6B5E" }}>
            {product.in_stock ? '🟢 In Stock' : 'Out of Stock'}
          </span>
        </div>
      </div>

      {/* Bottom border highlight on hover */}
      <div className="h-0.5 w-0 group-hover:w-full transition-all duration-500"
           style={{ background: "#8B1E17" }} />
    </motion.article>
  );
}
