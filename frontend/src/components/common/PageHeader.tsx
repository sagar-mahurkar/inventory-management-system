import type { ReactNode } from 'react';

type PageHeaderProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="d-flex flex-wrap align-items-start justify-content-between gap-3 mb-4">
      <div>
        <p className="text-uppercase small fw-semibold text-secondary mb-2">Inventory management</p>
        <h1 className="h2 fw-bold mb-2">{title}</h1>
        <p className="text-secondary mb-0">{description}</p>
      </div>
      {action && <div className="pt-sm-3">{action}</div>}
    </div>
  );
}
