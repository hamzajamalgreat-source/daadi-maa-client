import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Plus, Pencil, Trash2, X, RefreshCw, Search,
  ToggleLeft, ToggleRight, Upload, Link2, ImageOff,
  FolderPlus, Check, Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { productsApi, uploadApi } from '../api/client';
import { formatCurrency } from '../utils/formatCurrency';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { AdminShell } from './AdminDashboard';

// ─── Inline category creator ───────────────────────────────────────────────────
function AddCategoryInline({ onCreated }) {
  const [open, setOpen]     = useState(false);
  const [name, setName]     = useState('');
  const [saving, setSaving] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  const handleCreate = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setSaving(true);
    try {
      const res = await productsApi.createCategory(trimmed);
      toast.success(`Category "${res.data.name}" created.`);
      onCreated(res.data);
      setName('');
      setOpen(false);
    } catch (err) {
      toast.error(err.message || 'Failed to create category.');
    } finally {
      setSaving(false);
    }
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1 text-xs text-primary hover:underline font-medium mt-1.5"
      >
        <FolderPlus size={12} /> Add new category
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2 mt-1.5">
      <input
        ref={inputRef}
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter')  { e.preventDefault(); handleCreate(); }
          if (e.key === 'Escape') { setOpen(false); setName(''); }
        }}
        placeholder="Category name…"
        className="form-input text-xs py-1.5 flex-1"
      />
      <button
        type="button"
        onClick={handleCreate}
        disabled={saving || !name.trim()}
        className="p-1.5 rounded-lg bg-primary text-white hover:bg-primary-dark
                   disabled:opacity-40 transition-colors"
        aria-label="Save category"
      >
        {saving ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
      </button>
      <button
        type="button"
        onClick={() => { setOpen(false); setName(''); }}
        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Cancel"
      >
        <X size={13} />
      </button>
    </div>
  );
}

// ─── Image upload + preview panel ─────────────────────────────────────────────
// Images are stored server-side and served at /images/<filename>.
// The preview uses object-contain in a 1:1 box — exactly how the store
// product grid displays them, so what you see here is what customers see.
function ImagePanel({ imageUrl, onUrlChange }) {
  const [tab, setTab]         = useState('upload'); // 'upload' | 'url'
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver]   = useState(false);
  const fileRef = useRef(null);

  const processFile = async (file) => {
    if (!file) return;
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowed.includes(file.type)) {
      toast.error('Only JPG, PNG, WebP or GIF images are allowed.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image must be smaller than 10 MB.');
      return;
    }
    setUploading(true);
    try {
      const res = await uploadApi.uploadImage(file);
      onUrlChange(res.data.url);
      toast.success('Image uploaded.');
    } catch (err) {
      toast.error(err.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {/* Label row */}
      <div className="flex items-center mb-2">
        <span className="form-label mb-0">Product Image</span>
        <span className="text-[10px] text-gray-400 ml-1">(optional)</span>
        {/* Tab switcher */}
        <div className="ml-auto flex rounded-lg border border-gray-200 overflow-hidden text-xs">
          {[
            { key: 'upload', icon: Upload, label: 'Upload' },
            { key: 'url',    icon: Link2,  label: 'URL'    },
          ].map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`px-3 py-1.5 flex items-center gap-1 transition-colors
                ${tab === key
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-500 hover:bg-gray-50'}`}
            >
              <Icon size={11} /> {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3 items-start">
        {/* Preview — 1:1 box, object-contain — identical to store product card */}
        <div
          className="w-24 h-24 rounded-xl border-2 border-gray-200 bg-white flex-shrink-0
                     flex items-center justify-center overflow-hidden"
          title="Preview — this is exactly how the image appears in the store"
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Preview"
              className="w-full h-full object-contain p-1"
              onError={e => { e.target.style.display = 'none'; }}
            />
          ) : (
            <div className="flex flex-col items-center text-gray-300 gap-1">
              <ImageOff size={20} />
              <span className="text-[9px] text-center leading-tight px-1">No image</span>
            </div>
          )}
        </div>

        {/* Right side */}
        <div className="flex-1 min-w-0">
          {tab === 'upload' ? (
            <div
              onClick={() => !uploading && fileRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => {
                e.preventDefault();
                setDragOver(false);
                processFile(e.dataTransfer.files?.[0]);
              }}
              className={`
                border-2 border-dashed rounded-xl p-4 text-center cursor-pointer
                transition-all duration-200 select-none
                ${dragOver   ? 'border-primary bg-primary/5' : ''}
                ${uploading  ? 'opacity-60 cursor-not-allowed border-gray-200 bg-gray-50' : ''}
                ${!dragOver && !uploading
                  ? 'border-gray-300 hover:border-primary hover:bg-primary/[0.03] bg-gray-50'
                  : ''}
              `}
            >
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                onChange={e => processFile(e.target.files?.[0])}
                className="hidden"
              />
              {uploading ? (
                <div className="flex flex-col items-center gap-2 py-1">
                  <Loader2 size={22} className="text-primary animate-spin" />
                  <p className="text-xs text-gray-500">Uploading…</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1.5 py-1">
                  <Upload size={22} className={dragOver ? 'text-primary' : 'text-gray-400'} />
                  <p className="text-xs font-medium text-gray-600">
                    {dragOver ? 'Drop image here' : 'Click or drag image here'}
                  </p>
                  <p className="text-[10px] text-gray-400">JPG, PNG, WebP · Max 10 MB</p>
                </div>
              )}
            </div>
          ) : (
            <div>
              <input
                type="text"
                value={imageUrl}
                onChange={e => onUrlChange(e.target.value)}
                placeholder="/images/my-product.jpg  or  https://…"
                className="form-input text-sm"
              />
              <p className="text-[10px] text-gray-400 mt-1">
                Paste a URL or a relative path like /images/product.jpg
              </p>
            </div>
          )}

          {/* Sizing note */}
          <p className="text-[10px] text-gray-400 mt-1.5">
            ✓ Preview above matches store grid — 1:1, centred, padded.
          </p>

          {imageUrl && (
            <button
              type="button"
              onClick={() => onUrlChange('')}
              className="text-[11px] text-red-400 hover:text-red-600 mt-1 transition-colors"
            >
              × Remove image
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Product Form Modal ────────────────────────────────────────────────────────
const EMPTY_FORM = {
  name: '', description: '', price: '',
  image_url: '', category_id: '', badge: '', in_stock: true,
};

function ProductModal({ product, categories: initCats, onClose, onSave }) {
  const isEdit = Boolean(product?.id);
  const [form, setForm] = useState(
    isEdit ? {
      name:        product.name        || '',
      description: product.description || '',
      price:       String(product.price || ''),
      image_url:   product.image_url   || '',
      category_id: String(product.category_id || ''),
      badge:       product.badge       || '',
      in_stock:    Boolean(product.in_stock),
    } : { ...EMPTY_FORM }
  );
  const [errors, setErrors]     = useState({});
  const [saving, setSaving]     = useState(false);
  const [categories, setCategories] = useState(initCats);

  // Lock scroll, Escape to close
  useEffect(() => {
    const esc = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', esc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', esc);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleChange = field => e => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(f => ({ ...f, [field]: val }));
    if (errors[field]) setErrors(err => ({ ...err, [field]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Product name is required.';
    const p = parseFloat(form.price);
    if (!form.price || isNaN(p) || p <= 0) e.price = 'Enter a valid price greater than 0.';
    return e;
  };

  const handleSubmit = async ev => {
    ev.preventDefault();
    const v = validate();
    if (Object.keys(v).length) { setErrors(v); return; }
    setSaving(true);
    const payload = {
      name:        form.name.trim(),
      description: form.description.trim(),
      price:       parseFloat(form.price),
      image_url:   form.image_url.trim(),
      category_id: form.category_id ? parseInt(form.category_id) : null,
      badge:       form.badge.trim() || null,
      in_stock:    form.in_stock ? 1 : 0,
    };
    try {
      const res = isEdit
        ? await productsApi.update(product.id, payload)
        : await productsApi.create(payload);
      toast.success(isEdit ? `"${res.data.name}" updated.` : `"${res.data.name}" added.`);
      onSave(res.data, isEdit);
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to save product.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div
        role="dialog" aria-modal="true"
        aria-label={isEdit ? `Edit ${product.name}` : 'Add new product'}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[94vh]
                        overflow-y-auto scrollbar-thin animate-fade-in">

          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4
                          flex items-center justify-between z-10 rounded-t-2xl">
            <h2 className="font-bold text-gray-800 text-lg">
              {isEdit ? `Edit: ${product.name}` : 'Add New Product'}
            </h2>
            <button
              onClick={onClose} aria-label="Close"
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} noValidate className="px-6 py-5 space-y-5">

            {/* Image upload */}
            <ImagePanel
              imageUrl={form.image_url}
              onUrlChange={url => setForm(f => ({ ...f, image_url: url }))}
            />

            {/* Name */}
            <div>
              <label htmlFor="pm-name" className="form-label">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                id="pm-name" type="text" value={form.name}
                onChange={handleChange('name')}
                placeholder="e.g. Quorma Mix"
                aria-required="true"
                className={`form-input ${errors.name ? 'border-red-400' : ''}`}
              />
              {errors.name && <p className="form-error">{errors.name}</p>}
            </div>

            {/* Price + Category */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="pm-price" className="form-label">
                  Price (Rs.) <span className="text-red-500">*</span>
                </label>
                <input
                  id="pm-price" type="number" value={form.price}
                  onChange={handleChange('price')}
                  placeholder="120" min="0.01" step="0.01"
                  aria-required="true"
                  className={`form-input ${errors.price ? 'border-red-400' : ''}`}
                />
                {errors.price && <p className="form-error text-xs">{errors.price}</p>}
              </div>

              <div>
                <label htmlFor="pm-category" className="form-label">Category</label>
                <select
                  id="pm-category" value={form.category_id}
                  onChange={handleChange('category_id')}
                  className="form-input"
                >
                  <option value="">— None —</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                {/* Create new category inline */}
                <AddCategoryInline
                  onCreated={newCat => {
                    setCategories(prev => [...prev, newCat]);
                    setForm(f => ({ ...f, category_id: String(newCat.id) }));
                  }}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="pm-desc" className="form-label">Description</label>
              <textarea
                id="pm-desc" value={form.description}
                onChange={handleChange('description')}
                rows={3} placeholder="Describe the product…"
                className="form-input resize-none text-sm"
              />
            </div>

            {/* Badge + In Stock */}
            <div className="grid grid-cols-2 gap-3 items-end">
              <div>
                <label htmlFor="pm-badge" className="form-label">
                  Badge <span className="text-gray-400 font-normal text-xs">(optional)</span>
                </label>
                <input
                  id="pm-badge" type="text" value={form.badge}
                  onChange={handleChange('badge')}
                  placeholder="Bestseller, Popular…"
                  className="form-input text-sm"
                />
              </div>

              <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-xl h-[42px]">
                <span className="text-sm font-medium text-gray-700">In Stock</span>
                <button
                  type="button"
                  onClick={() => setForm(f => ({ ...f, in_stock: !f.in_stock }))}
                  aria-pressed={form.in_stock}
                  aria-label={form.in_stock ? 'Mark out of stock' : 'Mark in stock'}
                >
                  {form.in_stock
                    ? <ToggleRight size={30} className="text-green-500" />
                    : <ToggleLeft  size={30} className="text-gray-300" />}
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose}
                className="flex-1 btn-ghost border border-gray-200">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="flex-1 btn-primary">
                {saving ? (
                  <><Loader2 size={15} className="animate-spin" /> Saving…</>
                ) : isEdit ? 'Save Changes' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

// ─── Main Products page ────────────────────────────────────────────────────────
export default function AdminProducts() {
  const [products, setProducts]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [search, setSearch]         = useState('');
  const [catFilter, setCatFilter]   = useState('');
  const [modal, setModal]           = useState(undefined); // undefined=closed, null=new, obj=edit
  const [deleting, setDeleting]     = useState(null);
  const [toggling, setToggling]     = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [pRes, cRes] = await Promise.all([
        productsApi.getAll(),
        productsApi.getCategories(),
      ]);
      setProducts(pRes.data);
      setCategories(cRes.data);
    } catch (err) {
      setError(err.message || 'Failed to load products.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const onSave = (saved, isEdit) => {
    setProducts(prev =>
      isEdit
        ? prev.map(p => p.id === saved.id ? { ...p, ...saved } : p)
        : [saved, ...prev]
    );
    // Re-fetch categories in case a new one was created
    productsApi.getCategories()
      .then(r => setCategories(r.data))
      .catch(() => {});
  };

  const handleToggle = async product => {
    setToggling(product.id);
    try {
      const res = await productsApi.update(product.id, { in_stock: product.in_stock ? 0 : 1 });
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, ...res.data } : p));
      toast.success(`"${product.name}" → ${product.in_stock ? 'Out of Stock' : 'In Stock'}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setToggling(null);
    }
  };

  const handleDelete = async product => {
    if (!window.confirm(`Delete "${product.name}"?\n\nThis cannot be undone.`)) return;
    setDeleting(product.id);
    try {
      await productsApi.delete(product.id);
      setProducts(prev => prev.filter(p => p.id !== product.id));
      toast.success(`"${product.name}" deleted.`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(null);
    }
  };

  const filtered = products.filter(p => {
    const matchSearch = !search.trim() ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description || '').toLowerCase().includes(search.toLowerCase());
    const matchCat = !catFilter || String(p.category_id) === catFilter;
    return matchSearch && matchCat;
  });

  return (
    <AdminShell title="">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h1 className="font-serif text-2xl font-bold text-gray-800">
          Products
          <span className="ml-2 text-sm font-normal text-gray-400">({products.length})</span>
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchAll} disabled={loading} aria-label="Refresh"
            className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50
                       text-gray-500 transition-colors"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
          <button onClick={() => setModal(null)} className="btn-primary text-sm gap-1.5">
            <Plus size={15} /> Add Product
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="search" value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products…"
            className="w-full pl-8 py-2 text-sm border border-gray-200 rounded-lg bg-white
                       focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
          />
        </div>
        <select
          value={catFilter} onChange={e => setCatFilter(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white
                     focus:outline-none focus:ring-2 focus:ring-primary/30 min-w-[160px]"
        >
          <option value="">All Categories</option>
          {categories.map(c => (
            <option key={c.id} value={String(c.id)}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <LoadingSpinner label="Loading products…" />
      ) : error ? (
        <EmptyState icon="⚠️" title="Failed to load" message={error}
          actionLabel="Retry" onAction={fetchAll} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="🌶️" title="No products found"
          message={search || catFilter ? 'Try adjusting your filters.' : 'Add your first product.'}
          actionLabel="Add Product" onAction={() => setModal(null)}
        />
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" aria-label="Products table">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-left">
                  {['Product', 'Category', 'Price', 'Badge', 'Stock', ''].map(h => (
                    <th key={h}
                      className="px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(product => (
                  <tr key={product.id} className="hover:bg-gray-50/60 transition-colors">

                    {/* Product image + name */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {/* 1:1 thumbnail — matches store grid exactly */}
                        <div className="w-12 h-12 rounded-xl bg-white border border-gray-100
                                        flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {product.image_url ? (
                            <img src={product.image_url} alt=""
                              className="w-full h-full object-contain p-1"
                              onError={e => { e.target.style.display = 'none'; }} />
                          ) : (
                            <ImageOff size={16} className="text-gray-300" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-800 text-sm truncate max-w-[180px]">
                            {product.name}
                          </p>
                          <p className="text-[10px] text-gray-400 mt-0.5 truncate max-w-[180px]">
                            {product.description
                              ? product.description.slice(0, 55) + (product.description.length > 55 ? '…' : '')
                              : 'No description'}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-xs text-gray-500">
                      {product.category_name || '—'}
                    </td>

                    <td className="px-4 py-3 font-bold text-primary text-sm whitespace-nowrap">
                      {formatCurrency(product.price)}
                    </td>

                    <td className="px-4 py-3">
                      {product.badge ? (
                        <span className="bg-accent/10 text-amber-700 text-[10px] font-bold
                                         px-2 py-0.5 rounded-full border border-accent/20">
                          {product.badge}
                        </span>
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggle(product)}
                        disabled={toggling === product.id}
                        aria-pressed={Boolean(product.in_stock)}
                        aria-label={product.in_stock ? 'Mark out of stock' : 'Mark in stock'}
                        className="flex items-center gap-1.5 disabled:opacity-50 transition-opacity"
                      >
                        {product.in_stock ? (
                          <>
                            <ToggleRight size={22} className="text-green-500" />
                            <span className="text-xs font-medium text-green-700">In Stock</span>
                          </>
                        ) : (
                          <>
                            <ToggleLeft size={22} className="text-gray-300" />
                            <span className="text-xs font-medium text-gray-400">Out of Stock</span>
                          </>
                        )}
                      </button>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setModal(product)}
                          aria-label={`Edit ${product.name}`}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-primary
                                     hover:bg-blue-50 transition-colors"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(product)}
                          disabled={deleting === product.id}
                          aria-label={`Delete ${product.name}`}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500
                                     hover:bg-red-50 transition-colors disabled:opacity-40"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {modal !== undefined && (
        <ProductModal
          product={modal}
          categories={categories}
          onClose={() => setModal(undefined)}
          onSave={onSave}
        />
      )}
    </AdminShell>
  );
}
