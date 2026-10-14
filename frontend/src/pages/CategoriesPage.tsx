import { useState } from 'react';
import { CategoryForm } from '../components/categories/CategoryForm';
import { EmptyState } from '../components/common/EmptyState';
import { PageHeader } from '../components/common/PageHeader';
import type { Category } from '../types/inventory';

type CategoriesPageProps = {
  categories?: Category[];
  onSave?: (value: { id?: string; name: string; description: string }) => void;
};

export function CategoriesPage({ categories = [], onSave = () => undefined }: CategoriesPageProps) {
  const [editing, setEditing] = useState<Category | undefined>();
  const [showForm, setShowForm] = useState(false);

  function save(value: { name: string; description: string }) {
    onSave({ ...value, ...(editing ? { id: editing.id } : {}) });
    setShowForm(false);
    setEditing(undefined);
  }

  return <>
    <PageHeader title="Categories" description="Organize products into clear, manageable groups." action={<button className="btn btn-primary" onClick={() => { setEditing(undefined); setShowForm(true); }}><i className="bi bi-plus-lg me-2" aria-hidden="true" />Add category</button>} />
    {showForm && <section className="panel-card p-3 p-md-4 mb-4"><h2 className="h5 mb-3">{editing ? 'Edit category' : 'New category'}</h2><CategoryForm initialValue={editing} onSubmit={save} onCancel={() => { setShowForm(false); setEditing(undefined); }} /></section>}
    <section className="panel-card p-3 p-md-4">
      <div className="d-flex justify-content-between align-items-center mb-3"><h2 className="h5 mb-0">All categories</h2><span className="badge text-bg-light border">{categories.length}</span></div>
      {categories.length === 0 ? <EmptyState title="No categories yet" description="Create a category to organize your products." actionLabel="Add category" onAction={() => setShowForm(true)} /> :
        <div className="table-responsive"><table className="table align-middle mb-0"><thead><tr><th>Name</th><th>Description</th><th className="text-end">Action</th></tr></thead><tbody>
          {categories.map((category) => <tr key={category.id}><td className="fw-semibold">{category.name}</td><td className="text-secondary">{category.description || '—'}</td><td className="text-end"><button className="btn btn-sm btn-outline-secondary" onClick={() => { setEditing(category); setShowForm(true); }}><i className="bi bi-pencil me-1" aria-hidden="true" />Edit</button></td></tr>)}
        </tbody></table></div>}
    </section>
  </>;
}
