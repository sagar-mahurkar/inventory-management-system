import { useCallback, useEffect, useState } from 'react';
import { CategoryForm } from '../components/categories/CategoryForm';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { LoadingState } from '../components/common/LoadingState';
import { PageHeader } from '../components/common/PageHeader';
import type { Category } from '../types/inventory';
import { createCategory, deleteCategory, listCategories, updateCategory } from '../services/categoryApi';
import { getApiErrorMessage } from '../services/apiError';

export function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Category | undefined>();
  const [showForm, setShowForm] = useState(false);
  const load = useCallback(async () => { setLoading(true); setError(''); try { setCategories(await listCategories()); } catch (e) { setError(getApiErrorMessage(e, 'Could not load categories.')); } finally { setLoading(false); } }, []);
  useEffect(() => { void Promise.resolve().then(load); }, [load]);
  async function remove(category: Category) {
    const confirmed = window.confirm(`Delete category "${category.name}"? This is only possible when no products belong to it.`);
    if (!confirmed) return;
    setDeletingId(category.id);
    setError('');
    try {
      await deleteCategory(category.id);
      setCategories((current) => current.filter((item) => item.id !== category.id));
    } catch (e) {
      setError(getApiErrorMessage(e, 'Could not delete category. Categories with products cannot be deleted.'));
    } finally {
      setDeletingId(null);
    }
  }
  async function save(value: { name: string; description: string }) { setSaving(true); setError(''); try { if (editing) await updateCategory(editing.id, value); else await createCategory(value); setShowForm(false); setEditing(undefined); await load(); } catch (e) { setError(getApiErrorMessage(e, 'Could not save category.')); } finally { setSaving(false); } }
  return <>
    <PageHeader title="Categories" description="Organize products into clear, manageable groups." action={<button className="btn btn-primary" onClick={() => { setEditing(undefined); setShowForm(true); }}><i className="bi bi-plus-lg me-2" aria-hidden="true" />Add category</button>} />
    {error && <ErrorState message={error} onRetry={() => void load()} />}
    {showForm && <section className="panel-card p-3 p-md-4 mb-4"><h2 className="h5 mb-3">{editing ? 'Edit category' : 'New category'}</h2><CategoryForm initialValue={editing} onSubmit={save} onCancel={() => { setShowForm(false); setEditing(undefined); }} submitting={saving} /></section>}
    <section className="panel-card p-3 p-md-4"><div className="d-flex justify-content-between align-items-center mb-3"><h2 className="h5 mb-0">All categories</h2><span className="badge text-bg-light border">{categories.length}</span></div>
      {loading ? <LoadingState message="Loading categories…" /> : categories.length === 0 ? <EmptyState title="No categories yet" description="Create a category to organize your products." actionLabel="Add category" onAction={() => setShowForm(true)} /> : <div className="table-responsive"><table className="table align-middle mb-0"><thead><tr><th>Name</th><th>Description</th><th className="text-end">Actions</th></tr></thead><tbody>{categories.map((category) => <tr key={category.id}><td className="fw-semibold">{category.name}</td><td className="text-secondary">{category.description || '—'}</td><td className="text-end"><div className="d-inline-flex gap-2"><button className="btn btn-sm btn-outline-secondary" onClick={() => { setEditing(category); setShowForm(true); }}><i className="bi bi-pencil me-1" aria-hidden="true" />Edit</button><button className="btn btn-sm btn-outline-danger" onClick={() => void remove(category)} disabled={deletingId !== null} aria-label={`Delete ${category.name}`}>{deletingId === category.id ? <><span className="spinner-border spinner-border-sm me-1" aria-hidden="true" />Deleting…</> : <><i className="bi bi-trash me-1" aria-hidden="true" />Delete</>}</button></div></td></tr>)}</tbody></table></div>}
    </section>
  </>;
}
