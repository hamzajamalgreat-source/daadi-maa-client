/**
 * OrderStatusBadge — colour-coded pill for order status.
 * Statuses: pending | processing | shipped | delivered | cancelled
 */

const STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    classes: 'bg-amber-100 text-amber-800 border border-amber-200',
    dot: 'bg-amber-500',
  },
  processing: {
    label: 'Processing',
    classes: 'bg-blue-100 text-blue-800 border border-blue-200',
    dot: 'bg-blue-500',
  },
  shipped: {
    label: 'Shipped',
    classes: 'bg-purple-100 text-purple-800 border border-purple-200',
    dot: 'bg-purple-500',
  },
  delivered: {
    label: 'Delivered',
    classes: 'bg-green-100 text-green-800 border border-green-200',
    dot: 'bg-green-500',
  },
  cancelled: {
    label: 'Cancelled',
    classes: 'bg-red-100 text-red-800 border border-red-200',
    dot: 'bg-red-500',
  },
};

export default function OrderStatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || {
    label: status ?? 'Unknown',
    classes: 'bg-gray-100 text-gray-700 border border-gray-200',
    dot: 'bg-gray-400',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${config.classes}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} aria-hidden="true" />
      {config.label}
    </span>
  );
}
