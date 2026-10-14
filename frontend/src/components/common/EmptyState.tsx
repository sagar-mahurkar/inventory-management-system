type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="empty-state text-center border rounded-3 bg-white p-4 p-md-5">
      <div className="empty-state-icon mb-3"><i className="bi bi-inbox" aria-hidden="true" /></div>
      <h2 className="h5">{title}</h2>
      <p className="text-secondary mb-3">{description}</p>
      {actionLabel && onAction && <button type="button" className="btn btn-primary" onClick={onAction}>{actionLabel}</button>}
    </div>
  );
}
