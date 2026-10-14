type ConfirmDialogProps = {
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({ title, message, confirmLabel = 'Confirm', onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <div className="confirm-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onCancel();
    }}>
      <section className="confirm-dialog bg-white rounded-3 shadow p-4" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
        <h2 id="confirm-title" className="h5">{title}</h2>
        <p className="text-secondary">{message}</p>
        <div className="d-flex justify-content-end gap-2">
          <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>Cancel</button>
          <button type="button" className="btn btn-danger" onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </section>
    </div>
  );
}
