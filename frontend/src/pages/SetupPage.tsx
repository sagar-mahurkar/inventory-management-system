type SetupPageProps = {
  title: string;
  description: string;
};

export function SetupPage({ title, description }: SetupPageProps) {
  return (
    <section aria-labelledby="page-title">
      <p className="text-uppercase small fw-semibold text-secondary mb-2">Inventory management</p>
      <h1 id="page-title" className="h2 fw-bold mb-2">{title}</h1>
      <p className="text-secondary mb-0">{description}</p>
      <div className="setup-notice border rounded-3 bg-white p-4 mt-4">
        <div className="d-flex align-items-start gap-3">
          <span className="setup-notice-icon"><i className="bi bi-tools" aria-hidden="true" /></span>
          <div>
            <h2 className="h6 fw-semibold mb-1">Frontend foundation is ready</h2>
            <p className="text-secondary mb-0">Routing, shared layout, Bootstrap styling, and the API client foundation are being set up. Functional screens and API integration are scheduled for the next phases.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
