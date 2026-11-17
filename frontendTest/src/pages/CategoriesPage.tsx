import React, { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import { CategoryDto } from '../types/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { FolderTree, Plus, Trash2, Folder, Layers } from 'lucide-react';

export const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [newCategoryName, setNewCategoryName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [creating, setCreating] = useState<boolean>(false);

  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await apiService.getCategories();
      setCategories(data || []);
    } catch (err: any) {
      showToast('Error', err?.message || 'Failed to load categories', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    if (!isAuthenticated) {
      showToast('Login Required', 'You must log in to create categories', 'error');
      return;
    }

    setCreating(true);
    try {
      await apiService.createCategory({ name: newCategoryName.trim() });
      showToast('Success', `Category "${newCategoryName}" created!`, 'success');
      setNewCategoryName('');
      fetchCategories();
    } catch (err: any) {
      showToast('Error', err?.message || 'Failed to create category', 'error');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!isAuthenticated) {
      showToast('Login Required', 'You must log in to delete categories', 'error');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete category "${name}"?`)) return;

    try {
      await apiService.deleteCategory(id);
      showToast('Deleted', `Category "${name}" removed`, 'info');
      fetchCategories();
    } catch (err: any) {
      showToast('Delete Failed', err?.message || 'Could not delete category', 'error');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-600/20 text-brand-400 flex items-center justify-center border border-brand-500/30">
              <FolderTree className="w-5 h-5" />
            </div>
            Category Management
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Endpoint: <code className="text-brand-300">/api/v1/categories</code> (GET public, POST/DELETE authenticated)
          </p>
        </div>
      </div>

      {/* Create Form */}
      {isAuthenticated && (
        <form onSubmit={handleCreateCategory} className="glass-panel rounded-2xl p-6 mb-8 border border-slate-800">
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Plus className="w-4 h-4 text-brand-400" />
            Add New Category
          </h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Enter category name (e.g. Software Architecture, DevOps)..."
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl glass-input text-sm text-white placeholder-slate-500"
              required
              minLength={2}
              maxLength={50}
            />
            <button
              type="submit"
              disabled={creating}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold shadow-lg shadow-brand-600/30 transition-all disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              {creating ? 'Creating...' : 'Add Category'}
            </button>
          </div>
        </form>
      )}

      {/* Categories Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="glass-card rounded-2xl p-5 h-24 animate-pulse" />
          ))}
        </div>
      ) : categories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="glass-card rounded-2xl p-5 flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center border border-slate-800 text-brand-400 group-hover:border-brand-500/50 transition-colors">
                  <Folder className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-white text-sm group-hover:text-brand-300 transition-colors">
                    {cat.name}
                  </h4>
                  <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <Layers className="w-3 h-3 text-slate-500" />
                    {cat.postCount ?? 0} articles
                  </span>
                </div>
              </div>

              {isAuthenticated && (
                <button
                  onClick={() => handleDeleteCategory(cat.id, cat.name)}
                  className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition-all opacity-0 group-hover:opacity-100"
                  title="Delete Category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel rounded-3xl p-12 text-center max-w-md mx-auto">
          <Folder className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-1">No Categories</h3>
          <p className="text-sm text-slate-400">There are no categories created in the database yet.</p>
        </div>
      )}
    </div>
  );
};
