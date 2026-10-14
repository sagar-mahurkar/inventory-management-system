type LoadingStateProps = { message?: string };

export function LoadingState({ message = 'Loading…' }: LoadingStateProps) {
  return (
    <div className="d-flex align-items-center gap-2 text-secondary py-4" role="status">
      <span className="spinner-border spinner-border-sm" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}
