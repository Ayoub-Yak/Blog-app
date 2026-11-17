import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { PostDto } from '../types/api';
import { PostCard } from '../components/PostCard';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { FileText, RefreshCw, Lock } from 'lucide-react';

export const DraftsPage: React.FC = () => {
  const [drafts, setDrafts] = useState<PostDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const fetchDrafts = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const data = await apiService.getDrafts();
      setDrafts(data || []);
    } catch (err: any) {
      showToast('Error Loading Drafts', err?.message || 'Failed to fetch drafts', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      showToast('Authentication Required', 'You must log in to view your drafts', 'error');
      navigate('/login');
      return;
    }
    fetchDrafts();
  }, [isAuthenticated]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <FileText className="w-5 h-5" />
            </div>
            Your Unpublished Drafts
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            End-to-end integration with Spring Boot endpoint <code className="text-amber-300">GET /api/v1/posts/drafts</code>
          </p>
        </div>

        <button
          onClick={fetchDrafts}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-sm font-medium border border-slate-800 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Drafts
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="glass-card rounded-2xl p-6 h-64 animate-pulse" />
          ))}
        </div>
      ) : drafts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drafts.map((draft) => (
            <PostCard key={draft.id} post={draft} />
          ))}
        </div>
      ) : (
        <div className="glass-panel rounded-3xl p-12 text-center max-w-md mx-auto">
          <Lock className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-1">No Drafts Found</h3>
          <p className="text-sm text-slate-400 mb-6">
            You don't have any saved draft posts. Click "Write Post" in the navbar to compose a draft.
          </p>
        </div>
      )}
    </div>
  );
};
