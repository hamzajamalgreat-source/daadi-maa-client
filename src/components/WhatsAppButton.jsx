import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import useCartStore from "../store/cartStore";
import { formatCurrency } from "../utils/formatCurrency";

export default function WhatsAppButton() {
  const location = useLocation();
  const { items } = useCartStore();
  const [visible, setVisible] = useState(false);

  // Delay appearance for 1.2s after page load
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1200);
    return () => clearTimeout(t);
  }, []);

  if (location.pathname.startsWith("/admin")) return null;

  let href;
  if (items.length > 0) {
    const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const lines2 = items.map(i => `- ${i.name} x${i.quantity} (${formatCurrency(i.price * i.quantity)})`);
    const msg = ["Hi, I would like to order from Daadi Maa Spices:", ...lines2, `Total: ${formatCurrency(total)}`].join("\n");
    href = `https://wa.me/923149007440?text=${encodeURIComponent(msg)}`;
  } else {
    href = `https://wa.me/923149007440?text=${encodeURIComponent("Hi, I would like to order from Daadi Maa Spices")}`;
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="fixed z-50 bottom-20 right-4 md:bottom-8 md:right-6"
          initial={{ scale: 0, opacity: 0, rotate: -180 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
          whileHover={{ scale: 1.15, rotate: [0, -10, 10, 0], transition: { duration: 0.4 } }}
          whileTap={{ scale: 0.88 }}
        >
          {/* Pulsing ring behind button */}
          <span
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: "#25D366",
              animation: "waPulse 2.2s ease-out infinite",
            }}
          />
          {/* Floating label that appears on hover */}
          <motion.span
            className="absolute right-16 top-1/2 -translate-y-1/2 whitespace-nowrap text-xs font-bold
                       text-white px-3 py-1.5 rounded-full shadow-lg pointer-events-none"
            style={{ background: "#25D366" }}
            initial={{ opacity: 0, x: 10 }}
            whileHover={{ opacity: 1, x: 0 }}
          >
            {items.length > 0 ? `Order (${items.length})` : "Chat with us"}
          </motion.span>
          {/* Green circle button */}
          <span
            className="relative z-10 flex items-center justify-center w-14 h-14 rounded-full shadow-2xl"
            style={{ background: "#25D366" }}
          >
            {/* Official WhatsApp icon */}
            <svg viewBox="0 0 24 24" width="28" height="28" fill="white" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
