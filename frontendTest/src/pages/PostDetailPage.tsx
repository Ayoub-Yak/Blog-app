import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { PostDto } from '../types/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { CategoryBadge } from '../components/CategoryBadge';
import { TagBadge } from '../components/TagBadge';
import {
  ArrowLeft,
  Clock,
  User,
  Calendar,
  Edit,
  Trash2,
  Share2,
  FileText
} from 'lucide-react';

export const PostDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<PostDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleting, setDeleting] = useState<boolean>(false);

  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    apiService
      .getPostById(id)
      .then((data) => setPost(data))
      .catch((err: any) => {
        showToast('Error', err?.message || 'Failed to load post details', 'error');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!id || !window.confirm('Are you sure you want to delete this post?')) return;
    setDeleting(true);
    try {
      await apiService.deletePost(id);
      showToast('Deleted', 'Post deleted successfully', 'success');
      navigate('/');
    } catch (err: any) {
      showToast('Delete Failed', err?.message || 'Could not delete post', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400">Fetching article from Spring Boot API...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Post Not Found</h2>
        <p className="text-slate-400 mb-6">The requested post does not exist or was deleted.</p>
        <Link to="/" className="px-4 py-2 rounded-xl bg-brand-600 text-white font-semibold text-sm">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-sm font-medium border border-slate-800 transition-all mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Main Post Container */}
      <article className="glass-panel rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl">
        {/* Category & Status */}
        <div className="flex items-center justify-between gap-4 mb-6">
          {post.category && <CategoryBadge category={post.category} />}
          {post.status === 'DRAFT' && (
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold flex items-center gap-1 border border-amber-500/30">
              <FileText className="w-3.5 h-3.5" />
              Draft Mode
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-6">
          {post.title}
        </h1>

        {/* Author & Date Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-800/80 text-sm text-slate-400">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center font-bold text-white text-xs">
                {post.author?.name ? post.author.name[0].toUpperCase() : 'A'}
              </div>
              <span className="font-semibold text-slate-200">{post.author?.name || 'Author'}</span>
            </div>

            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span>{formatDate(post.createdAt)}</span>
            </div>

            {post.readingTime && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-slate-500" />
                <span>{post.readingTime} min read</span>
              </div>
            )}
          </div>

          {/* Action buttons if authenticated */}
          {isAuthenticated && (
            <div className="flex items-center gap-2">
              <Link
                to={`/edit-post/${post.id}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-brand-300 text-xs font-medium border border-slate-700 transition-colors"
              >
                <Edit className="w-3.5 h-3.5" />
                Edit
              </Link>

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-medium border border-rose-800/60 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Post Content Body */}
        <div className="prose prose-invert max-w-none text-slate-200 text-base sm:text-lg leading-relaxed whitespace-pre-line font-normal mb-8">
          {post.content}
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 mr-2">Tags:</span>
            {post.tags.map((t) => (
              <TagBadge key={t.id} tag={t} />
            ))}
          </div>
        )}
      </article>
    </div>
  );
};
