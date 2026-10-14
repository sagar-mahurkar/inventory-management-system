import { useState, type FormEvent } from 'react';
import type { Category, Product } from '../../types/inventory';

type ProductFormProps = {
  categories: Category[];
  initialValue?: Product;
  onSubmit: (value: { name: string; sku: string; categoryId: string; description: string; unitPrice: number; quantity: number; lowStockThreshold: number }) => void;
  onCancel: () => void;
};

export function ProductForm({ categories, initialValue, onSubmit, onCancel }: ProductFormProps) {
  const [name, setName] = useState(initialValue?.name ?? '');
  const [sku, setSku] = useState(initialValue?.sku ?? '');
  const [categoryId, setCategoryId] = useState(initialValue?.categoryId ?? '');
  const [description, setDescription] = useState(initialValue?.description ?? '');
  const [unitPrice, setUnitPrice] = useState(String(initialValue?.unitPrice ?? 0));
  const [quantity, setQuantity] = useState(String(initialValue?.quantity ?? 0));
  const [threshold, setThreshold] = useState(String(initialValue?.lowStockThreshold ?? 5));
  const [error, setError] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim() || !sku.trim() || !categoryId) {
      setError('Name, SKU, and category are required.');
      return;
    }
    const price = Number(unitPrice);
    const qty = Number(quantity);
    const lowStockThreshold = Number(threshold);
    if (!Number.isFinite(price) || price < 0 || !Number.isInteger(qty) || qty < 0 || !Number.isInteger(lowStockThreshold) || lowStockThreshold < 0) {
      setError('Price must be non-negative; quantity and threshold must be non-negative whole numbers.');
      return;
    }
    setError('');
    onSubmit({ name: name.trim(), sku: sku.trim(), categoryId, description: description.trim(), unitPrice: price, quantity: qty, lowStockThreshold });
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label" htmlFor="product-name">Product name *</label>
          <input id="product-name" className="form-control" value={name} onChange={(event) => setName(event.target.value)} maxLength={150} />
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="product-sku">SKU *</label>
          <input id="product-sku" className="form-control" value={sku} onChange={(event) => setSku(event.target.value)} maxLength={80} />
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="product-category">Category *</label>
          <select id="product-category" className="form-select" value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>
            <option value="">Select category</option>
            {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="product-price">Unit price</label>
          <input id="product-price" type="number" min="0" step="0.01" className="form-control" value={unitPrice} onChange={(event) => setUnitPrice(event.target.value)} />
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="product-quantity">Initial quantity</label>
          <input id="product-quantity" type="number" min="0" step="1" className="form-control" value={quantity} onChange={(event) => setQuantity(event.target.value)} />
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="product-threshold">Low-stock threshold</label>
          <input id="product-threshold" type="number" min="0" step="1" className="form-control" value={threshold} onChange={(event) => setThreshold(event.target.value)} />
        </div>
        <div className="col-12">
          <label className="form-label" htmlFor="product-description">Description</label>
          <textarea id="product-description" rows={3} className="form-control" value={description} onChange={(event) => setDescription(event.target.value)} maxLength={1000} />
        </div>
      </div>
      <div className="d-flex justify-content-end gap-2 mt-4">
        <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">{initialValue ? 'Save changes' : 'Create product'}</button>
      </div>
    </form>
  );
}
