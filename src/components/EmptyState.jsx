import { Link } from 'react-router-dom';

/**
 * EmptyState — reusable empty / error / no-results state.
 *
 * Props:
 *   icon        — emoji or SVG element
 *   title       — main heading
 *   message     — supporting text
 *   actionLabel — optional CTA button label
 *   actionTo    — react-router link (if internal)
 *   onAction    — callback (if button action)
 */
export default function EmptyState({
  icon = '📦',
  title = 'Nothing here yet',
  message = '',
  actionLabel = '',
  actionTo = '',
  onAction = null,
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-6 animate-fade-in">
      <div className="text-5xl mb-4 select-none" aria-hidden="true">
        {icon}
      </div>
      <h3 className="text-xl font-serif font-semibold text-text-dark mb-2">{title}</h3>
      {message && (
        <p className="text-text-muted text-sm max-w-xs leading-relaxed">{message}</p>
      )}
      {actionLabel && (
        <div className="mt-6">
          {actionTo ? (
            <Link to={actionTo} className="btn-primary">
              {actionLabel}
            </Link>
          ) : onAction ? (
            <button onClick={onAction} className="btn-primary">
              {actionLabel}
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
}
