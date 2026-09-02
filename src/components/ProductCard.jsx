import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";
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
    <article className="group relative bg-white rounded-card shadow-card border border-border
                        flex flex-col overflow-hidden
                        transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1.5">

      {/* Image */}
      <Link to={`/shop/${product.slug}`}
        className="relative block overflow-hidden bg-cream"
        style={{ aspectRatio: "4/5" }}
        aria-label={`View ${product.name}`}>

        {!imgLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-cream to-cream-dark animate-pulse" />
        )}

        <img
          src={product.image_url || "/placeholder-spice.svg"}
          alt={product.name}
          onLoad={() => setImgLoaded(true)}
          onError={e => { e.target.src = "/placeholder-spice.svg"; setImgLoaded(true); }}
          className={`absolute inset-0 w-full h-full object-contain p-5 transition-transform duration-500
                      group-hover:scale-[1.06] ${imgLoaded ? "opacity-100" : "opacity-0"}`}
          loading="lazy"
        />

        {/* Badge */}
        {product.badge && (
          <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px]
                           font-bold shadow-sm z-10 ${BADGE_STYLES[product.badge] || "bg-primary text-white"}`}>
            {product.badge}
          </span>
        )}

        {/* Out of stock */}
        {!product.in_stock && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
            <span className="bg-text-dark text-white text-xs font-bold px-3 py-1.5 rounded-full">
              Out of Stock
            </span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-brand-dark/0 group-hover:bg-brand-dark/5
                        transition-all duration-300 z-10" />
      </Link>

      {/* Info */}
      <div className="flex flex-col flex-1 px-4 pb-4 pt-3">
        {product.category_name && (
          <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1">
            {product.category_name}
          </span>
        )}

        <Link to={`/shop/${product.slug}`}
          className="font-serif font-semibold text-text-dark text-sm leading-snug mb-2
                     hover:text-primary transition-colors line-clamp-2">
          {product.name}
        </Link>

        {/* Stars */}
        <div className="flex items-center gap-0.5 mb-3">
          {Array(5).fill(0).map((_, i) => (
            <Star key={i} size={11} className="text-accent fill-accent" />
          ))}
        </div>

        {/* Price + CTA */}
        <div className="mt-auto flex items-center justify-between gap-2">
          <span className="text-base font-bold text-primary">
            {formatCurrency(product.price)}
          </span>

          <button onClick={handleAddToCart}
            disabled={!product.in_stock || adding}
            aria-label={`Add ${product.name} to cart`}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold
                       transition-all duration-200 active:scale-95
                       ${product.in_stock
                         ? adding
                           ? "bg-olive text-white"
                           : "bg-primary text-white hover:bg-primary-dark"
                         : "bg-cream-dark text-text-muted cursor-not-allowed"}`}>
            <ShoppingCart size={13} />
            <span className="hidden sm:inline">{adding ? "✓ Added" : "Add"}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
