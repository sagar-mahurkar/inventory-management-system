import { NavLink, Outlet } from 'react-router-dom';

const navigation = [
  { to: '/', label: 'Dashboard', icon: 'bi-grid-1x2' },
  { to: '/categories', label: 'Categories', icon: 'bi-tags' },
  { to: '/products', label: 'Products', icon: 'bi-box-seam' },
  { to: '/movements', label: 'Stock movements', icon: 'bi-arrow-left-right' },
];

export function AppLayout() {
  return (
    <div className="app-shell">
      <header className="app-header border-bottom bg-white">
        <div className="container-fluid px-3 px-lg-4 d-flex align-items-center justify-content-between gap-3 py-3">
          <NavLink to="/" className="app-brand text-decoration-none">
            <span className="app-brand-icon"><i className="bi bi-boxes" aria-hidden="true" /></span>
            <span>Inventory Manager</span>
          </NavLink>
          <span className="badge text-bg-light border">MVP</span>
        </div>
      </header>

      <div className="container-fluid px-3 px-lg-4">
        <div className="row g-0">
          <aside className="col-12 col-lg-2 app-sidebar py-3 py-lg-4">
            <nav aria-label="Main navigation" className="nav nav-pills flex-row flex-lg-column gap-1">
              {navigation.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) => `nav-link d-flex align-items-center gap-2 ${isActive ? 'active' : 'text-body-secondary'}`}
                >
                  <i className={`bi ${item.icon}`} aria-hidden="true" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>
          </aside>

          <main className="col-12 col-lg-10 app-main py-4 py-lg-5">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
