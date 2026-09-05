/**
 * CategoryFilter — horizontal scrollable pill buttons for category filtering.
 *
 * Props:
 *   categories  — array of { id, name, slug }
 *   active      — currently selected slug (or '' for All)
 *   onChange    — (slug: string) => void
 */

const CATEGORY_EMOJI = {
  'recipe-mixes':    '🍛',
  'spice-powders':   '🌶️',
  'salts':           '🧂',
  'whole-spices':    '🌿',
  'chilli-products': '🔥',
  'biryani-pulao':   '🍚',
  'bbq-grill':       '🔥',
  'blended-masalas': '✨',
  'curry-bases':     '🥘',
  'gift-packs':      '🎁',
};

export default function CategoryFilter({ categories = [], active = '', onChange }) {
  const allCategories = [{ id: 0, name: 'All Products', slug: '' }, ...categories];

  return (
    <div
      className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin"
      role="group"
      aria-label="Filter by category"
    >
      {allCategories.map((cat) => {
        const isActive = cat.slug === active;
        const emoji = CATEGORY_EMOJI[cat.slug];
        return (
          <button
            key={cat.id}
            onClick={() => onChange(cat.slug)}
            aria-pressed={isActive}
            className={`
              flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium
              border transition-all duration-200 whitespace-nowrap
              focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1
              ${
                isActive
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-cream-dark text-text-muted border-border hover:border-primary hover:text-primary'
              }
            `}
          >
            {emoji ? `${emoji} ${cat.name}` : cat.name}
          </button>
        );
      })}
    </div>
  );
}
