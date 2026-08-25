import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X, SlidersHorizontal, Grid2X2, List } from 'lucide-react';
import { productsApi } from '../api/client';
import ProductCard from '../components/ProductCard';
import CategoryFilter from '../components/CategoryFilter';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [localSearch, setLocalSearch] = useState(searchParams.get('search') || '');

  const activeCategory = searchParams.get('category') || '';
  const searchQuery    = searchParams.get('search')   || '';

  // Load categories once
  useEffect(() => {
    productsApi.getCategories()
      .then(r => setCategories(r.data))
      .catch(() => {});
  }, []);

  // Fetch products on filter change
  const fetchProducts = useCallback(() => {
    setLoading(true);
    setError('');
    const params = {};
    if (activeCategory) params.category = activeCategory;
    if (searchQuery)    params.search   = searchQuery;
    productsApi.getAll(params)
      .then(r => setProducts(r.data))
      .catch(err => setError(err.message || 'Failed to load products.'))
      .finally(() => setLoading(false));
  }, [activeCategory, searchQuery]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  // Debounce search → URL
  useEffect(() => {
    const t = setTimeout(() => {
      const next = new URLSearchParams(searchParams);
      if (localSearch.trim()) next.set('search', localSearch.trim());
      else next.delete('search');
      setSearchParams(next, { replace: true });
    }, 350);
    return () => clearTimeout(t);
  }, [localSearch]); // eslint-disable-line

  const handleCategory = slug => {
    const next = new URLSearchParams();
    if (slug) next.set('category', slug);
    if (searchQuery) next.set('search', searchQuery);
    setSearchParams(next);
  };

  const clearAll = () => {
    setLocalSearch('');
    setSearchParams({});
  };

  const hasFilters = activeCategory || searchQuery;
  const activeLabel = categories.find(c => c.slug === activeCategory)?.name || 'All Products';

  return (
    <main className="bg-cream min-h-screen">

      {/* ── Page header — cream, consistent with body ──────────────────── */}
      <div className="border-b border-border">
        <div className="container-page py-8">
          <h1 className="section-title mb-1">Our Spices</h1>
          <p className="text-text-muted text-sm">
            {loading ? 'Loading…' : `${products.length} product${products.length !== 1 ? 's' : ''} · ${activeLabel}`}
          </p>
        </div>
      </div>

      <div className="container-page py-8">
        {/* ── Filters ──────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          {/* Category pills */}
          <div className="flex-1 min-w-0">
            <CategoryFilter
              categories={categories}
              active={activeCategory}
              onChange={handleCategory}
            />
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-60 flex-shrink-0">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            <input
              type="search"
              value={localSearch}
              onChange={e => setLocalSearch(e.target.value)}
              placeholder="Search spices…"
              aria-label="Search products"
              className="form-input pl-9 pr-8 text-sm"
            />
            {localSearch && (
              <button onClick={() => setLocalSearch('')} aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-dark">
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Active filter pills */}
        {hasFilters && (
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <span className="text-xs text-text-muted">Active filters:</span>
            {activeCategory && (
              <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary
                               text-xs font-medium px-3 py-1 rounded-full">
                {activeLabel}
                <button onClick={() => handleCategory('')} aria-label="Remove category filter">
                  <X size={11} />
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary
                               text-xs font-medium px-3 py-1 rounded-full">
                "{searchQuery}"
                <button onClick={() => setLocalSearch('')} aria-label="Clear search">
                  <X size={11} />
                </button>
              </span>
            )}
            <button onClick={clearAll}
              className="text-xs text-text-muted hover:text-primary underline transition-colors">
              Clear all
            </button>
          </div>
        )}

        {/* ── Product grid ──────────────────────────────────────────────── */}
        {loading ? (
          <LoadingSpinner label="Loading products…" />
        ) : error ? (
          <EmptyState icon="⚠️" title="Could not load products" message={error}
            actionLabel="Try Again" onAction={fetchProducts} />
        ) : products.length === 0 ? (
          <EmptyState
            icon="🔍"
            title="No products found"
            message={searchQuery
              ? `No results for "${searchQuery}". Try a different search.`
              : 'No products in this category yet.'}
            actionLabel="View All Products"
            onAction={clearAll}
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
