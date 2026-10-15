import { useCallback, useEffect, useMemo, useState } from 'react';
import { ProductForm } from '../components/products/ProductForm';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { LoadingState } from '../components/common/LoadingState';
import { PageHeader } from '../components/common/PageHeader';
import type { Category, Product } from '../types/inventory';
import { formatCurrency } from '../utils/formatters';
import { listCategories } from '../services/categoryApi';
import { createProduct, deleteProduct, listProducts, updateProduct, type ProductInput } from '../services/productApi';
import { getApiErrorMessage } from '../services/apiError';

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]); const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true); const [saving, setSaving] = useState(false); const [error, setError] = useState(''); const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Product | undefined>(); const [showForm, setShowForm] = useState(false); const [search, setSearch] = useState(''); const [stockFilter, setStockFilter] = useState('all');
  const load = useCallback(async () => { setLoading(true); setError(''); try { const [productResult, categoryResult] = await Promise.all([listProducts({ limit: 100 }), listCategories()]); setProducts(productResult.items); setCategories(categoryResult); } catch (e) { setError(getApiErrorMessage(e, 'Could not load products.')); } finally { setLoading(false); } }, []);
  useEffect(() => { void Promise.resolve().then(load); }, [load]);
  const visibleProducts = useMemo(() => products.filter((p) => { const q = search.trim().toLowerCase(); const matches = !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q); const low = p.quantity <= p.lowStockThreshold; return matches && (stockFilter === 'all' || (stockFilter === 'low' ? low : !low)); }), [products, search, stockFilter]);
  async function remove(product: Product) {
    const confirmed = window.confirm(`Delete product "${product.name}"? Products with inventory movement history cannot be deleted.`);
    if (!confirmed) return;
    setDeletingId(product.id);
    setError('');
    try {
      await deleteProduct(product.id);
      setProducts((current) => current.filter((item) => item.id !== product.id));
    } catch (e) {
      setError(getApiErrorMessage(e, 'Could not delete product. Products with movement history cannot be deleted.'));
    } finally {
      setDeletingId(null);
    }
  }
  async function save(value: ProductInput) { setSaving(true); setError(''); try { if (editing) await updateProduct(editing.id, value); else await createProduct(value); setShowForm(false); setEditing(undefined); await load(); } catch (e) { setError(getApiErrorMessage(e, 'Could not save product.')); } finally { setSaving(false); } }
  return <>
    <PageHeader title="Products" description="Maintain product details and monitor stock levels." action={<button className="btn btn-primary" onClick={() => { setEditing(undefined); setShowForm(true); }}><i className="bi bi-plus-lg me-2" aria-hidden="true" />Add product</button>} />
    {error && <ErrorState message={error} onRetry={() => void load()} />}
    {showForm && <section className="panel-card p-3 p-md-4 mb-4"><h2 className="h5 mb-3">{editing ? 'Edit product' : 'New product'}</h2><ProductForm categories={categories} initialValue={editing} onSubmit={save} onCancel={() => { setShowForm(false); setEditing(undefined); }} submitting={saving} /></section>}
    <section className="panel-card p-3 p-md-4"><div className="row g-2 align-items-center mb-3"><div className="col-md"><label htmlFor="product-search" className="visually-hidden">Search products</label><div className="input-group"><span className="input-group-text bg-white"><i className="bi bi-search" aria-hidden="true" /></span><input id="product-search" className="form-control" placeholder="Search by name or SKU" value={search} onChange={(e) => setSearch(e.target.value)} /></div></div><div className="col-md-4"><label htmlFor="stock-filter" className="visually-hidden">Filter stock level</label><select id="stock-filter" className="form-select" value={stockFilter} onChange={(e) => setStockFilter(e.target.value)}><option value="all">All stock levels</option><option value="low">Low stock</option><option value="normal">In stock</option></select></div></div>
      {loading ? <LoadingState message="Loading products…" /> : visibleProducts.length === 0 ? <EmptyState title={products.length ? 'No matching products' : 'No products yet'} description={products.length ? 'Try changing your search or stock filter.' : 'Add a product to start tracking inventory.'} actionLabel={!products.length ? 'Add product' : undefined} onAction={!products.length ? () => setShowForm(true) : undefined} /> : <div className="table-responsive"><table className="table align-middle mb-0"><thead><tr><th>Product</th><th>SKU</th><th>Category</th><th>Quantity</th><th>Unit price</th><th>Status</th><th className="text-end">Actions</th></tr></thead><tbody>{visibleProducts.map((p) => <tr key={p.id}><td className="fw-semibold">{p.name}</td><td>{p.sku}</td><td>{categories.find((c) => c.id === p.categoryId)?.name ?? p.categoryName ?? '—'}</td><td>{p.quantity}</td><td>{formatCurrency(Number(p.unitPrice))}</td><td><span className={`badge ${p.quantity <= p.lowStockThreshold ? 'text-bg-warning' : 'text-bg-success'}`}>{p.quantity <= p.lowStockThreshold ? 'Low stock' : 'In stock'}</span></td><td className="text-end"><div className="d-inline-flex gap-2"><button className="btn btn-sm btn-outline-secondary" onClick={() => { setEditing(p); setShowForm(true); }}><i className="bi bi-pencil me-1" aria-hidden="true" />Edit</button><button className="btn btn-sm btn-outline-danger" onClick={() => void remove(p)} disabled={deletingId !== null} aria-label={`Delete ${p.name}`}>{deletingId === p.id ? <><span className="spinner-border spinner-border-sm me-1" aria-hidden="true" />Deleting…</> : <><i className="bi bi-trash me-1" aria-hidden="true" />Delete</>}</button></div></td></tr>)}</tbody></table></div>}
    </section>
  </>;
}
