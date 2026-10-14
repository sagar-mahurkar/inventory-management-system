type ErrorStateProps = {
  message?: string;
  onRetry?: () => void;
};

export function ErrorState({ message = 'Something went wrong.', onRetry }: ErrorStateProps) {
  return (
    <div className="alert alert-danger d-flex flex-wrap align-items-center justify-content-between gap-3" role="alert">
      <span>{message}</span>
      {onRetry && <button type="button" className="btn btn-sm btn-outline-danger" onClick={onRetry}>Try again</button>}
    </div>
  );
}
