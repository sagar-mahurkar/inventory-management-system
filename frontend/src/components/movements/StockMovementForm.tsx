import { useState, type FormEvent } from 'react';
import type { Product, MovementType } from '../../types/inventory';

type StockMovementFormProps = {
  products: Product[];
  onSubmit: (value: { productId: string; type: MovementType; quantity: number; note: string }) => void;
  onCancel: () => void;
};

export function StockMovementForm({ products, onSubmit, onCancel }: StockMovementFormProps) {
  const [productId, setProductId] = useState('');
  const [type, setType] = useState<MovementType>('IN');
  const [quantity, setQuantity] = useState('1');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsedQuantity = Number(quantity);
    if (!productId) {
      setError('Select a product.');
      return;
    }
    if (!Number.isInteger(parsedQuantity) || parsedQuantity <= 0) {
      setError('Quantity must be a positive whole number.');
      return;
    }
    setError('');
    onSubmit({ productId, type, quantity: parsedQuantity, note: note.trim() });
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <div className="mb-3">
        <label className="form-label" htmlFor="movement-product">Product *</label>
        <select id="movement-product" className="form-select" value={productId} onChange={(event) => setProductId(event.target.value)}>
          <option value="">Select product</option>
          {products.map((product) => <option key={product.id} value={product.id}>{product.name} ({product.sku})</option>)}
        </select>
      </div>
      <div className="row g-3">
        <div className="col-sm-6">
          <label className="form-label" htmlFor="movement-type">Movement type</label>
          <select id="movement-type" className="form-select" value={type} onChange={(event) => setType(event.target.value as MovementType)}>
            <option value="IN">Stock in</option>
            <option value="OUT">Stock out</option>
          </select>
        </div>
        <div className="col-sm-6">
          <label className="form-label" htmlFor="movement-quantity">Quantity *</label>
          <input id="movement-quantity" type="number" min="1" step="1" className="form-control" value={quantity} onChange={(event) => setQuantity(event.target.value)} />
        </div>
      </div>
      <div className="mt-3 mb-4">
        <label className="form-label" htmlFor="movement-note">Note</label>
        <textarea id="movement-note" className="form-control" rows={3} maxLength={500} value={note} onChange={(event) => setNote(event.target.value)} />
      </div>
      <div className="d-flex justify-content-end gap-2">
        <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">Record movement</button>
      </div>
    </form>
  );
}
