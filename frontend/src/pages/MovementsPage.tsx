import { useMemo, useState } from 'react';
import { StockMovementForm } from '../components/movements/StockMovementForm';
import { EmptyState } from '../components/common/EmptyState';
import { PageHeader } from '../components/common/PageHeader';
import type { InventoryMovement, Product } from '../types/inventory';
import { formatDateTime } from '../utils/formatters';

type MovementsPageProps = {
  products?: Product[];
  movements?: InventoryMovement[];
  onSave?: (value: { productId: string; type: 'IN' | 'OUT'; quantity: number; note: string }) => void;
};

export function MovementsPage({ products = [], movements = [], onSave = () => undefined }: MovementsPageProps) {
  const [showForm, setShowForm] = useState(false);
  const [typeFilter, setTypeFilter] = useState('all');
  const visibleMovements = useMemo(() => movements.filter((movement) => typeFilter === 'all' || movement.type === typeFilter), [movements, typeFilter]);

  return <>
    <PageHeader title="Stock movements" description="Record stock changes and review movement history." action={<button className="btn btn-primary" onClick={() => setShowForm((visible) => !visible)}><i className="bi bi-plus-lg me-2" aria-hidden="true" />Record movement</button>} />
    {showForm && <section className="panel-card p-3 p-md-4 mb-4"><h2 className="h5 mb-3">New stock movement</h2><StockMovementForm products={products} onSubmit={(value) => { onSave(value); setShowForm(false); }} onCancel={() => setShowForm(false)} /></section>}
    <section className="panel-card p-3 p-md-4">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3"><h2 className="h5 mb-0">Movement history</h2><label className="d-flex align-items-center gap-2 small text-secondary">Type <select className="form-select form-select-sm" value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}><option value="all">All</option><option value="IN">Stock in</option><option value="OUT">Stock out</option></select></label></div>
      {visibleMovements.length === 0 ? <EmptyState title="No movements to show" description="Recorded stock-in and stock-out transactions will appear here." /> :
        <div className="table-responsive"><table className="table align-middle mb-0"><thead><tr><th>Date</th><th>Product</th><th>Type</th><th>Quantity</th><th>Note</th></tr></thead><tbody>
          {visibleMovements.map((movement) => <tr key={movement.id}><td>{formatDateTime(new Date(movement.createdAt))}</td><td className="fw-semibold">{products.find((product) => product.id === movement.productId)?.name ?? movement.productName ?? '—'}</td><td><span className={`badge ${movement.type === 'IN' ? 'text-bg-success' : 'text-bg-warning'}`}>{movement.type === 'IN' ? 'Stock in' : 'Stock out'}</span></td><td>{movement.quantity}</td><td className="text-secondary">{movement.note || '—'}</td></tr>)}
        </tbody></table></div>}
    </section>
  </>;
}
