import { useMemo } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { EmptyState } from '../components/common/EmptyState';
import type { Product } from '../types/inventory';
import { formatCurrency, formatDateTime } from '../utils/formatters';

type DashboardPageProps = { products?: Product[] };

export function DashboardPage({ products = [] }: DashboardPageProps) {
  const stats = useMemo(() => ({
    productCount: products.length,
    units: products.reduce((sum, product) => sum + product.quantity, 0),
    lowStock: products.filter((product) => product.quantity <= product.lowStockThreshold).length,
    value: products.reduce((sum, product) => sum + product.quantity * product.unitPrice, 0),
  }), [products]);

  return (
    <>
      <PageHeader title="Dashboard" description="A quick overview of your inventory." />
      <div className="row g-3 mb-4">
        <div className="col-6 col-xl-3"><StatCard label="Products" value={stats.productCount.toLocaleString()} icon="bi-box-seam" /></div>
        <div className="col-6 col-xl-3"><StatCard label="Units in stock" value={stats.units.toLocaleString()} icon="bi-stack" /></div>
        <div className="col-6 col-xl-3"><StatCard label="Low-stock items" value={stats.lowStock.toLocaleString()} icon="bi-exclamation-triangle" tone="warning" /></div>
        <div className="col-6 col-xl-3"><StatCard label="Stock value" value={formatCurrency(stats.value)} icon="bi-currency-rupee" /></div>
      </div>
      <section className="panel-card p-3 p-md-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h2 className="h5 mb-0">Inventory overview</h2>
          <span className="small text-secondary">Updated {formatDateTime(new Date())}</span>
        </div>
        {products.length === 0
          ? <EmptyState title="No inventory yet" description="Add categories and products to start tracking stock." />
          : <div className="table-responsive"><table className="table align-middle mb-0">
              <thead><tr><th>Product</th><th>SKU</th><th>Quantity</th><th>Unit price</th><th>Status</th></tr></thead>
              <tbody>{products.slice(0, 5).map((product) => <tr key={product.id}>
                <td className="fw-semibold">{product.name}</td><td>{product.sku}</td><td>{product.quantity}</td><td>{formatCurrency(product.unitPrice)}</td>
                <td><span className={`badge ${product.quantity <= product.lowStockThreshold ? 'text-bg-warning' : 'text-bg-success'}`}>{product.quantity <= product.lowStockThreshold ? 'Low stock' : 'In stock'}</span></td>
              </tr>)}</tbody>
            </table></div>}
      </section>
    </>
  );
}

function StatCard({ label, value, icon, tone }: { label: string; value: string; icon: string; tone?: 'warning' }) {
  return <div className="stat-card panel-card h-100 p-3 p-md-4">
    <div className={`stat-icon ${tone === 'warning' ? 'stat-icon-warning' : ''}`}><i className={`bi ${icon}`} aria-hidden="true" /></div>
    <p className="text-secondary small mb-1 mt-3">{label}</p>
    <p className="h4 fw-bold mb-0 text-break">{value}</p>
  </div>;
}
