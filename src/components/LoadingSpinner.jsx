/**
 * LoadingSpinner — reusable centered loading indicator.
 * Sizes: sm | md (default) | lg | fullscreen
 */
export default function LoadingSpinner({ size = 'md', fullscreen = false, label = 'Loading…' }) {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
  };

  const spinner = (
    <div role="status" aria-label={label} className="flex flex-col items-center gap-3">
      <div
        className={`${sizeClasses[size] || sizeClasses.md} rounded-full border-cream-dark border-t-primary animate-spin`}
      />
      {size !== 'sm' && (
        <span className="text-sm text-text-muted font-medium">{label}</span>
      )}
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-cream/80 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-full py-16">
      {spinner}
    </div>
  );
}
