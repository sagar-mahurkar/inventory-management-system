import { useMemo, useState } from 'react';
import { ProductForm } from '../components/products/ProductForm';
import { EmptyState } from '../components/common/EmptyState';
import { PageHeader } from '../components/common/PageHeader';
import type { Category, Product } from '../types/inventory';
import { formatCurrency } from '../utils/formatters';

type ProductsPageProps = {
  products?: Product[];
  categories?: Category[];
  onSave?: (value: { id?: string; name: string; sku: string; categoryId: string; description: string; unitPrice: number; quantity: number; lowStockThreshold: number }) => void;
};

export function ProductsPage({ products = [], categories = [], onSave = () => undefined }: ProductsPageProps) {
  const [editing, setEditing] = useState<Product | undefined>();
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  const visibleProducts = useMemo(() => products.filter((product) => {
    const query = search.toLowerCase().trim();
    const matchesQuery = !query || product.name.toLowerCase().includes(query) || product.sku.toLowerCase().includes(query);
    const matchesStock = stockFilter === 'all' || (stockFilter === 'low' ? product.quantity <= product.lowStockThreshold : product.quantity > product.lowStockThreshold);
    return matchesQuery && matchesStock;
  }), [products, search, stockFilter]);

  function save(value: { name: string; sku: string; categoryId: string; description: string; unitPrice: number; quantity: number; lowStockThreshold: number }) {
    onSave({ ...value, ...(editing ? { id: editing.id } : {}) });
    setShowForm(false);
    setEditing(undefined);
  }

  return <>
    <PageHeader title="Products" description="Maintain product details and monitor stock levels." action={<button className="btn btn-primary" onClick={() => { setEditing(undefined); setShowForm(true); }}><i className="bi bi-plus-lg me-2" aria-hidden="true" />Add product</button>} />
    {showForm && <section className="panel-card p-3 p-md-4 mb-4"><h2 className="h5 mb-3">{editing ? 'Edit product' : 'New product'}</h2><ProductForm categories={categories} initialValue={editing} onSubmit={save} onCancel={() => { setShowForm(false); setEditing(undefined); }} /></section>}
    <section className="panel-card p-3 p-md-4">
      <div className="row g-2 align-items-center mb-3">
        <div className="col-md"><label htmlFor="product-search" className="visually-hidden">Search products</label><div className="input-group"><span className="input-group-text bg-white"><i className="bi bi-search" aria-hidden="true" /></span><input id="product-search" className="form-control" placeholder="Search by name or SKU" value={search} onChange={(event) => setSearch(event.target.value)} /></div></div>
        <div className="col-md-4"><label htmlFor="stock-filter" className="visually-hidden">Filter stock level</label><select id="stock-filter" className="form-select" value={stockFilter} onChange={(event) => setStockFilter(event.target.value)}><option value="all">All stock levels</option><option value="low">Low stock</option><option value="normal">In stock</option></select></div>
      </div>
      {visibleProducts.length === 0 ? <EmptyState title={products.length ? 'No matching products' : 'No products yet'} description={products.length ? 'Try changing your search or stock filter.' : 'Add a product to start tracking inventory.'} actionLabel={!products.length ? 'Add product' : undefined} onAction={!products.length ? () => setShowForm(true) : undefined} /> :
        <div className="table-responsive"><table className="table align-middle mb-0"><thead><tr><th>Product</th><th>SKU</th><th>Category</th><th>Quantity</th><th>Unit price</th><th>Status</th><th className="text-end">Action</th></tr></thead><tbody>
          {visibleProducts.map((product) => <tr key={product.id}><td className="fw-semibold">{product.name}</td><td>{product.sku}</td><td>{categories.find((category) => category.id === product.categoryId)?.name ?? '—'}</td><td>{product.quantity}</td><td>{formatCurrency(product.unitPrice)}</td><td><span className={`badge ${product.quantity <= product.lowStockThreshold ? 'text-bg-warning' : 'text-bg-success'}`}>{product.quantity <= product.lowStockThreshold ? 'Low stock' : 'In stock'}</span></td><td className="text-end"><button className="btn btn-sm btn-outline-secondary" onClick={() => { setEditing(product); setShowForm(true); }}>Edit</button></td></tr>)}
        </tbody></table></div>}
    </section>
  </>;
}
