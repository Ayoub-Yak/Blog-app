import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { CategoryDto, TagDto, PostStatus, CreatePostRequestDto, UpdatdePostResquestDto } from '../types/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  PenSquare,
  Save,
  FileText,
  Send,
  ArrowLeft,
  FolderPlus,
  Tag as TagIcon
} from 'lucide-react';

export const PostEditorPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const isEditing = Boolean(id);

  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [status, setStatus] = useState<PostStatus>(PostStatus.PUBLISHED);

  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [tags, setTags] = useState<TagDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      showToast('Authentication Required', 'Please sign in to create or edit posts', 'error');
      navigate('/login');
      return;
    }

    const init = async () => {
      setLoading(true);
      try {
        const [cats, tgList] = await Promise.all([
          apiService.getCategories(),
          apiService.getTags()
        ]);
        setCategories(cats || []);
        setTags(tgList || []);

        if (cats && cats.length > 0 && !categoryId) {
          setCategoryId(cats[0].id);
        }

        if (isEditing && id) {
          const postData = await apiService.getPostById(id);
          setTitle(postData.title || '');
          setContent(postData.content || '');
          if (postData.category?.id) setCategoryId(postData.category.id);
          if (postData.tags) setSelectedTagIds(postData.tags.map((t) => t.id));
          if (postData.status) setStatus(postData.status);
        }
      } catch (err: any) {
        showToast('Error', err?.message || 'Failed to initialize form data', 'error');
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [id, isAuthenticated]);

  const toggleTag = (tagId: string) => {
    if (selectedTagIds.includes(tagId)) {
      setSelectedTagIds(selectedTagIds.filter((t) => t !== tagId));
    } else {
      if (selectedTagIds.length >= 10) {
        showToast('Tag Limit', 'You can select up to 10 tags', 'info');
        return;
      }
      setSelectedTagIds([...selectedTagIds, tagId]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || title.length < 5) {
      showToast('Validation Error', 'Title must be at least 5 characters long', 'error');
      return;
    }

    if (!content.trim() || content.length < 10) {
      showToast('Validation Error', 'Content must be at least 10 characters long', 'error');
      return;
    }

    if (!categoryId) {
      showToast('Validation Error', 'Please select a category', 'error');
      return;
    }

    setSubmitting(true);
    try {
      if (isEditing && id) {
        const updatePayload: UpdatdePostResquestDto = {
          id,
          title,
          content,
          categoryId,
          tagIds: selectedTagIds,
          status
        };
        const updated = await apiService.updatePost(id, updatePayload);
        showToast('Success', 'Post updated successfully!', 'success');
        navigate(`/posts/${updated.id}`);
      } else {
        const createPayload: CreatePostRequestDto = {
          title,
          content,
          categoryId,
          tagIds: selectedTagIds,
          status
        };
        const created = await apiService.createPost(createPayload);
        showToast('Success', 'Post created successfully!', 'success');
        navigate(status === PostStatus.DRAFT ? '/drafts' : `/posts/${created.id}`);
      }
    } catch (err: any) {
      showToast('Submission Failed', err?.message || 'Failed to save post', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400">Preparing post editor...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-sm font-medium border border-slate-800 transition-all mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-brand-600/20 text-brand-400 flex items-center justify-center border border-brand-500/30">
            <PenSquare className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">
              {isEditing ? 'Edit Post' : 'Create New Post'}
            </h1>
            <p className="text-xs text-slate-400">
              Matches Spring Boot <code className="text-brand-300">CreatePostRequestDto</code> validation specifications
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Post Title */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Post Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter an engaging title (5-255 characters)..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl glass-input text-base text-white placeholder-slate-500"
              required
              minLength={5}
              maxLength={255}
            />
          </div>

          {/* Category & Status Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Category Select */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-1.5">
                <FolderPlus className="w-4 h-4 text-brand-400" />
                Category <span className="text-rose-400">*</span>
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl glass-input text-sm text-white bg-slate-900"
                required
              >
                <option value="" disabled>Select a Category...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id} className="bg-slate-900 text-white">
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Selector */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-amber-400" />
                Publication Status
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setStatus(PostStatus.PUBLISHED)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                    status === PostStatus.PUBLISHED
                      ? 'bg-brand-600 text-white border-brand-500 shadow-md'
                      : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  PUBLISHED
                </button>

                <button
                  type="button"
                  onClick={() => setStatus(PostStatus.DRAFT)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                    status === PostStatus.DRAFT
                      ? 'bg-amber-600 text-white border-amber-500 shadow-md'
                      : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  DRAFT
                </button>
              </div>
            </div>
          </div>

          {/* Tags Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-1.5">
              <TagIcon className="w-4 h-4 text-indigo-400" />
              Tags (Select up to 10)
            </label>
            {tags.length > 0 ? (
              <div className="flex flex-wrap gap-2 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                {tags.map((t) => {
                  const isSelected = selectedTagIds.includes(t.id);
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => toggleTag(t.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                          : 'bg-slate-800/80 text-slate-400 border-slate-700/60 hover:text-slate-200'
                      }`}
                    >
                      #{t.name}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No tags created yet. You can manage tags in the Tags tab.</p>
            )}
          </div>

          {/* Post Content */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Article Content <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={12}
              placeholder="Write your article content here (10-50000 characters)..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-3 rounded-xl glass-input text-sm text-white placeholder-slate-500 font-sans leading-relaxed"
              required
              minLength={10}
              maxLength={50000}
            />
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-sm font-medium border border-slate-800 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white text-sm font-semibold shadow-lg shadow-brand-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {submitting ? 'Saving...' : isEditing ? 'Update Post' : status === PostStatus.DRAFT ? 'Save Draft' : 'Publish Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
