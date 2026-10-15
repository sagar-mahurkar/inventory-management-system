import { useCallback, useEffect, useMemo, useState } from 'react';
import { StockMovementForm } from '../components/movements/StockMovementForm';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { LoadingState } from '../components/common/LoadingState';
import { PageHeader } from '../components/common/PageHeader';
import type { InventoryMovement, Product, MovementType } from '../types/inventory';
import { formatDateTime } from '../utils/formatters';
import { listProducts } from '../services/productApi';
import { createInventoryMovement, listInventoryMovements } from '../services/inventoryMovementApi';
import { getApiErrorMessage } from '../services/apiError';

export function MovementsPage() {
  const [products, setProducts] = useState<Product[]>([]); const [movements, setMovements] = useState<InventoryMovement[]>([]); const [loading, setLoading] = useState(true); const [saving, setSaving] = useState(false); const [error, setError] = useState(''); const [showForm, setShowForm] = useState(false); const [typeFilter, setTypeFilter] = useState('all');
  const load = useCallback(async () => { setLoading(true); setError(''); try { const [p, m] = await Promise.all([listProducts({ limit: 100 }), listInventoryMovements({ limit: 100 })]); setProducts(p.items); setMovements(m.items); } catch (e) { setError(getApiErrorMessage(e, 'Could not load stock movements.')); } finally { setLoading(false); } }, []);
  useEffect(() => { void Promise.resolve().then(load); }, [load]);
  const visibleMovements = useMemo(() => movements.filter((m) => typeFilter === 'all' || m.movementType === typeFilter), [movements, typeFilter]);
  const movementTotals = useMemo(() => {
    const stockInQuantity = visibleMovements.reduce((total, movement) => total + (movement.movementType === 'STOCK_IN' ? movement.quantity : 0), 0);
    const stockOutQuantity = visibleMovements.reduce((total, movement) => total + (movement.movementType === 'STOCK_OUT' ? movement.quantity : 0), 0);
    return {
      records: visibleMovements.length,
      stockInQuantity,
      stockOutQuantity,
      netChange: stockInQuantity - stockOutQuantity,
    };
  }, [visibleMovements]);
  async function save(value: { productId: string; movementType: MovementType; quantity: number; note: string }) { setSaving(true); setError(''); try { await createInventoryMovement(value); setShowForm(false); await load(); } catch (e) { setError(getApiErrorMessage(e, 'Could not record stock movement.')); } finally { setSaving(false); } }
  return <>
    <PageHeader title="Stock movements" description="Record stock changes and review movement history." action={<button className="btn btn-primary" onClick={() => setShowForm((v) => !v)}><i className="bi bi-plus-lg me-2" aria-hidden="true" />Record movement</button>} />
    {error && <ErrorState message={error} onRetry={() => void load()} />}
    {showForm && <section className="panel-card p-3 p-md-4 mb-4"><h2 className="h5 mb-3">New stock movement</h2><StockMovementForm products={products} onSubmit={save} onCancel={() => setShowForm(false)} submitting={saving} /></section>}
    <section className="row g-3 mb-4" aria-label="Movement totals">
      <div className="col-6 col-xl-3"><div className="panel-card p-3 h-100"><div className="small text-secondary mb-2">Total movements</div><div className="h3 mb-0">{movementTotals.records.toLocaleString()}</div></div></div>
      <div className="col-6 col-xl-3"><div className="panel-card p-3 h-100"><div className="small text-secondary mb-2">Stock-in quantity</div><div className="h3 mb-0">{movementTotals.stockInQuantity.toLocaleString()} <span className="fs-6 fw-normal text-secondary">units</span></div></div></div>
      <div className="col-6 col-xl-3"><div className="panel-card p-3 h-100"><div className="small text-secondary mb-2">Stock-out quantity</div><div className="h3 mb-0">{movementTotals.stockOutQuantity.toLocaleString()} <span className="fs-6 fw-normal text-secondary">units</span></div></div></div>
      <div className="col-6 col-xl-3"><div className="panel-card p-3 h-100"><div className="small text-secondary mb-2">Net stock change</div><div className={`h3 mb-0 ${movementTotals.netChange < 0 ? 'text-danger' : 'text-success'}`}>{movementTotals.netChange > 0 ? '+' : ''}{movementTotals.netChange.toLocaleString()} <span className="fs-6 fw-normal">units</span></div></div></div>
    </section>
    <section className="panel-card p-3 p-md-4"><div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3"><h2 className="h5 mb-0">Movement history</h2><label className="d-flex align-items-center gap-2 small text-secondary">Type <select className="form-select form-select-sm" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}><option value="all">All</option><option value="STOCK_IN">Stock in</option><option value="STOCK_OUT">Stock out</option></select></label></div>
      {loading ? <LoadingState message="Loading movements…" /> : visibleMovements.length === 0 ? <EmptyState title="No movements to show" description="Recorded stock-in and stock-out transactions will appear here." /> : <div className="table-responsive"><table className="table align-middle mb-0"><thead><tr><th>Date</th><th>Product</th><th>Type</th><th>Quantity</th><th>Note</th></tr></thead><tbody>{visibleMovements.map((m) => <tr key={m.id}><td>{formatDateTime(new Date(m.createdAt))}</td><td className="fw-semibold">{products.find((p) => p.id === m.productId)?.name ?? m.productName ?? '—'}</td><td><span className={`badge ${m.movementType === 'STOCK_IN' ? 'text-bg-success' : 'text-bg-warning'}`}>{m.movementType === 'STOCK_IN' ? 'Stock in' : 'Stock out'}</span></td><td>{m.quantity}</td><td className="text-secondary">{m.note || '—'}</td></tr>)}</tbody></table></div>}
    </section>
  </>;
}
