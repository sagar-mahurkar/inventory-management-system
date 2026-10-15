import { useCallback, useEffect, useState } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { LoadingState } from '../components/common/LoadingState';
import type { InventorySummary, Product } from '../types/inventory';
import { formatCurrency, formatDateTime } from '../utils/formatters';
import { getInventorySummary } from '../services/summaryApi';
import { listProducts } from '../services/productApi';
import { getApiErrorMessage } from '../services/apiError';

export function DashboardPage() {
  const [summary, setSummary] = useState<InventorySummary | null>(null); const [products, setProducts] = useState<Product[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  const load = useCallback(async () => { setLoading(true); setError(''); try { const [s, p] = await Promise.all([getInventorySummary(), listProducts({ limit: 5 })]); setSummary(s); setProducts(p.items); } catch (e) { setError(getApiErrorMessage(e, 'Could not load dashboard.')); } finally { setLoading(false); } }, []);
  useEffect(() => { void Promise.resolve().then(load); }, [load]);
  return <><PageHeader title="Dashboard" description="A quick overview of your inventory." />{error && <ErrorState message={error} onRetry={() => void load()} />}
    {loading ? <LoadingState message="Loading dashboard…" /> : summary && <><div className="row g-3 mb-4"><div className="col-6 col-xl-3"><StatCard label="Products" value={summary.total_products.toLocaleString()} icon="bi-box-seam" /></div><div className="col-6 col-xl-3"><StatCard label="Units in stock" value={summary.total_units_in_stock.toLocaleString()} icon="bi-stack" /></div><div className="col-6 col-xl-3"><StatCard label="Low-stock products" value={summary.low_stock_products.toLocaleString()} icon="bi-exclamation-triangle" tone="warning" /></div><div className="col-6 col-xl-3"><StatCard label="Stock value" value={formatCurrency(Number(summary.total_inventory_value))} icon="bi-currency-rupee" /></div></div>
      <section className="panel-card p-3 p-md-4"><div className="d-flex align-items-center justify-content-between mb-3"><h2 className="h5 mb-0">Inventory overview</h2><span className="small text-secondary">Updated {formatDateTime(new Date())}</span></div>{products.length === 0 ? <EmptyState title="No inventory yet" description="Add categories and products to start tracking stock." /> : <div className="table-responsive"><table className="table align-middle mb-0"><thead><tr><th>Product</th><th>SKU</th><th>Quantity</th><th>Unit price</th><th>Status</th></tr></thead><tbody>{products.map((p) => <tr key={p.id}><td className="fw-semibold">{p.name}</td><td>{p.sku}</td><td>{p.quantity}</td><td>{formatCurrency(Number(p.unitPrice))}</td><td><span className={`badge ${p.quantity <= p.lowStockThreshold ? 'text-bg-warning' : 'text-bg-success'}`}>{p.quantity <= p.lowStockThreshold ? 'Low stock' : 'In stock'}</span></td></tr>)}</tbody></table></div>}</section></>}
  </>;
}
function StatCard({ label, value, icon, tone }: { label: string; value: string; icon: string; tone?: 'warning' }) { return <div className="stat-card panel-card h-100 p-3 p-md-4"><div className={`stat-icon ${tone === 'warning' ? 'stat-icon-warning' : ''}`}><i className={`bi ${icon}`} aria-hidden="true" /></div><p className="text-secondary small mb-1 mt-3">{label}</p><p className="h4 fw-bold mb-0 text-break">{value}</p></div>; }
