import { useState, useEffect } from "react";
import { WifiOff, RefreshCw } from "lucide-react";

/**
 * OfflineBanner — FL6: Detects network loss and shows a non-blocking banner.
 * Never leaves the user staring at a blank/stuck screen without explanation.
 * The banner appears at the top of the page and disappears when connection returns.
 */
export default function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const goOffline = () => setIsOffline(true);
    const goOnline  = () => setIsOffline(false);
    window.addEventListener("offline", goOffline);
    window.addEventListener("online",  goOnline);
    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online",  goOnline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="fixed top-0 inset-x-0 z-[9999] flex items-center justify-center gap-3
                 px-4 py-2.5 text-sm font-medium text-white shadow-lg"
      style={{ background: "#1a1a1a" }}
    >
      <WifiOff size={15} aria-hidden="true" />
      <span>You appear to be offline. Check your connection.</span>
      <button
        onClick={() => window.location.reload()}
        className="flex items-center gap-1 underline underline-offset-2 hover:no-underline ml-1"
        aria-label="Retry connection"
      >
        <RefreshCw size={12} /> Retry
      </button>
    </div>
  );
}
