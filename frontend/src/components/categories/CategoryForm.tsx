import { useState, type FormEvent } from 'react';
import type { Category } from '../../types/inventory';

type CategoryFormProps = {
  initialValue?: Category;
  onSubmit: (value: { name: string; description: string }) => void;
  onCancel: () => void;
};

export function CategoryForm({ initialValue, onSubmit, onCancel }: CategoryFormProps) {
  const [name, setName] = useState(initialValue?.name ?? '');
  const [description, setDescription] = useState(initialValue?.description ?? '');
  const [error, setError] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Category name is required.');
      return;
    }
    setError('');
    onSubmit({ name: trimmedName, description: description.trim() });
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="mb-3">
        <label className="form-label" htmlFor="category-name">Category name <span className="text-danger">*</span></label>
        <input id="category-name" className={`form-control ${error ? 'is-invalid' : ''}`} value={name} onChange={(event) => setName(event.target.value)} maxLength={100} required />
        {error && <div className="invalid-feedback">{error}</div>}
      </div>
      <div className="mb-4">
        <label className="form-label" htmlFor="category-description">Description</label>
        <textarea id="category-description" className="form-control" rows={3} value={description} onChange={(event) => setDescription(event.target.value)} maxLength={500} />
      </div>
      <div className="d-flex justify-content-end gap-2">
        <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">{initialValue ? 'Save changes' : 'Create category'}</button>
      </div>
    </form>
  );
}
