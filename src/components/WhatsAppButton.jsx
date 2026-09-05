import { useLocation } from 'react-router-dom';
import useCartStore from '../store/cartStore';
import { formatCurrency } from '../utils/formatCurrency';

export default function WhatsAppButton() {
  const location = useLocation();
  const { items } = useCartStore();

  // Hide on admin pages
  if (location.pathname.startsWith('/admin')) return null;

  let href;
  if (items.length > 0) {
    const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const lines = items.map(i => `- ${i.name} x${i.quantity} (${formatCurrency(i.price * i.quantity)})`);
    const msg = [
      "Hi, I'd like to order from Daadi Maa Spices:",
      ...lines,
      `Total: ${formatCurrency(total)}`,
    ].join('\n');
    href = `https://wa.me/923149007440?text=${encodeURIComponent(msg)}`;
  } else {
    href = `https://wa.me/923149007440?text=${encodeURIComponent("Hi, I'd like to order from Daadi Maa Spices")}`;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed z-50 bottom-20 right-4 md:bottom-6 md:right-6 flex items-center justify-center
                 w-14 h-14 rounded-full shadow-xl transition-transform hover:scale-110 active:scale-95"
      style={{ background: '#25D366' }}
    >
      {/* WhatsApp SVG icon */}
      <svg viewBox="0 0 32 32" width="28" height="28" fill="white" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.668 4.61 1.822 6.5L4 29l7.703-1.797A11.94 11.94 0 0016 28c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 2c5.522 0 10 4.478 10 10s-4.478 10-10 10c-1.848 0-3.576-.505-5.059-1.385l-.363-.217-4.578 1.068 1.094-4.459-.234-.371A9.944 9.944 0 016 15c0-5.522 4.478-10 10-10zm-3.127 5.875c-.195 0-.512.073-.779.366-.268.293-1.025 1.002-1.025 2.443s1.049 2.832 1.195 3.027c.146.195 2.035 3.23 5.012 4.404.701.303 1.248.484 1.674.619.703.226 1.343.194 1.85.118.565-.085 1.74-.711 1.985-1.398.244-.686.244-1.275.17-1.396-.073-.122-.267-.195-.561-.342-.293-.146-1.736-.857-2.004-.955-.268-.098-.463-.146-.658.146-.195.293-.754.955-.924 1.15-.17.195-.34.22-.633.073-.293-.146-1.24-.457-2.361-1.457-.873-.779-1.46-1.74-1.631-2.033-.17-.293-.018-.451.128-.596.131-.131.293-.342.439-.512.146-.17.195-.293.293-.488.098-.195.049-.367-.024-.512-.073-.146-.658-1.584-.902-2.17-.237-.57-.479-.493-.658-.502l-.56-.01z"/>
      </svg>
    </a>
  );
}
