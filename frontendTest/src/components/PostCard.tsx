import React from 'react';
import { Link } from 'react-router-dom';
import { PostDto, PostStatus } from '../types/api';
import { Clock, User, Calendar, FileText, ArrowRight } from 'lucide-react';
import { CategoryBadge } from './CategoryBadge';
import { TagBadge } from './TagBadge';

interface PostCardProps {
  post: PostDto;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const isDraft = post.status === PostStatus.DRAFT;

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Recently';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <article className="glass-card rounded-2xl p-6 flex flex-col justify-between group relative overflow-hidden">
      {/* Draft status indicator */}
      {isDraft && (
        <div className="absolute top-4 right-4 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
          <FileText className="w-3 h-3" />
          Draft
        </div>
      )}

      <div>
        {/* Category */}
        {post.category && (
          <div className="mb-3">
            <CategoryBadge category={post.category} />
          </div>
        )}

        {/* Title */}
        <h3 className="text-xl font-bold text-white group-hover:text-brand-300 transition-colors line-clamp-2 mb-2 leading-snug">
          <Link to={`/posts/${post.id}`}>
            {post.title}
          </Link>
        </h3>

        {/* Content Snippet */}
        <p className="text-slate-300 text-sm line-clamp-3 mb-4 leading-relaxed font-normal">
          {post.content}
        </p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-6">
            {post.tags.map((tag) => (
              <TagBadge key={tag.id} tag={tag} />
            ))}
          </div>
        )}
      </div>

      {/* Meta Footer */}
      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-brand-400" />
            <span>{post.author?.name || 'Anonymous Author'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>{formatDate(post.createdAt)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {post.readingTime && (
            <div className="flex items-center gap-1 text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              <span>{post.readingTime} min</span>
            </div>
          )}
          <Link
            to={`/posts/${post.id}`}
            className="p-1.5 rounded-lg bg-brand-600/20 text-brand-400 group-hover:bg-brand-600 group-hover:text-white transition-all ml-1"
            title="Read Article"
          >
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </article>
  );
};
