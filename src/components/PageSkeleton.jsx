import Navbar from "./Navbar";

/**
 * PageSkeleton — lightweight Suspense fallback shown while a lazy route chunk loads.
 * FL4 / FL9: Shows page structure immediately (nav + shimmer blocks) instead of
 * a blank screen or full-screen spinner. The user sees the site shell instantly.
 */
export default function PageSkeleton() {
  return (
    <div className="flex flex-col min-h-screen bg-cream animate-pulse">
      {/* Navbar placeholder — same height as real Navbar */}
      <div className="h-16 bg-white border-b border-border shadow-sm" />

      {/* Content shimmer */}
      <div className="flex-1 container-page py-10">
        {/* Hero shimmer */}
        <div className="h-8 bg-gray-200 rounded-xl w-1/3 mb-4" />
        <div className="h-4 bg-gray-100 rounded w-2/3 mb-10" />

        {/* Card grid shimmer — 4 cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm">
              <div className="aspect-square bg-gray-200" />
              <div className="p-3 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
