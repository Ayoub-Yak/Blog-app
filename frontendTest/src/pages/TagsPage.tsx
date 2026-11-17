import React, { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import { TagDto } from '../types/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Tag as TagIcon, Plus, Trash2 } from 'lucide-react';

export const TagsPage: React.FC = () => {
  const [tags, setTags] = useState<TagDto[]>([]);
  const [newTagInput, setNewTagInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [creating, setCreating] = useState<boolean>(false);

  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const fetchTags = async () => {
    setLoading(true);
    try {
      const data = await apiService.getTags();
      setTags(data || []);
    } catch (err: any) {
      showToast('Error', err?.message || 'Failed to load tags', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleCreateTags = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagInput.trim()) return;

    if (!isAuthenticated) {
      showToast('Login Required', 'You must log in to create tags', 'error');
      return;
    }

    // Split comma separated tag names
    const names = newTagInput
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length >= 2 && s.length <= 30);

    if (names.length === 0) {
      showToast('Validation Error', 'Please enter valid tag names (2-30 chars)', 'error');
      return;
    }

    setCreating(true);
    try {
      await apiService.createTags({ names });
      showToast('Success', `Created ${names.length} tag(s)!`, 'success');
      setNewTagInput('');
      fetchTags();
    } catch (err: any) {
      showToast('Error', err?.message || 'Failed to create tags', 'error');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteTag = async (id: string, name: string) => {
    if (!isAuthenticated) {
      showToast('Login Required', 'You must log in to delete tags', 'error');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete tag #${name}?`)) return;

    try {
      await apiService.deleteTag(id);
      showToast('Deleted', `Tag #${name} deleted`, 'info');
      fetchTags();
    } catch (err: any) {
      showToast('Delete Failed', err?.message || 'Could not delete tag', 'error');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            <TagIcon className="w-5 h-5" />
          </div>
          Tag Management
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Endpoint: <code className="text-indigo-300">/api/v1/tags</code> (GET public, POST/DELETE authenticated)
        </p>
      </div>

      {/* Create Form */}
      {isAuthenticated && (
        <form onSubmit={handleCreateTags} className="glass-panel rounded-2xl p-6 mb-8 border border-slate-800">
          <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
            <Plus className="w-4 h-4 text-indigo-400" />
            Add Tags (Comma Separated)
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            You can enter multiple tag names separated by commas (e.g. <code className="text-slate-300">java, spring-boot, react, typescript</code>)
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Enter tag names..."
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl glass-input text-sm text-white placeholder-slate-500"
              required
            />
            <button
              type="submit"
              disabled={creating}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              {creating ? 'Creating...' : 'Create Tags'}
            </button>
          </div>
        </form>
      )}

      {/* Tags Cloud Grid */}
      {loading ? (
        <div className="flex flex-wrap gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="w-28 h-10 rounded-xl bg-slate-900 animate-pulse" />
          ))}
        </div>
      ) : tags.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {tags.map((tag) => (
            <div
              key={tag.id}
              className="glass-card rounded-xl px-4 py-2.5 flex items-center gap-3 border border-slate-800 hover:border-indigo-500/40 transition-all group"
            >
              <div className="flex items-center gap-2">
                <TagIcon className="w-3.5 h-3.5 text-indigo-400" />
                <span className="font-semibold text-sm text-white">#{tag.name}</span>
                {tag.postCount !== undefined && (
                  <span className="text-xs px-2 py-0.5 rounded-md bg-slate-900 text-slate-400 font-mono">
                    {tag.postCount}
                  </span>
                )}
              </div>

              {isAuthenticated && (
                <button
                  onClick={() => handleDeleteTag(tag.id, tag.name)}
                  className="text-slate-500 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100"
                  title="Delete Tag"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel rounded-3xl p-12 text-center max-w-md mx-auto">
          <TagIcon className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-1">No Tags</h3>
          <p className="text-sm text-slate-400">There are no tags created in the system yet.</p>
        </div>
      )}
    </div>
  );
};
