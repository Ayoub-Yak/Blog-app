import React, { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import { PostDto, CategoryDto, TagDto } from '../types/api';
import { PostCard } from '../components/PostCard';
import { CategoryBadge } from '../components/CategoryBadge';
import { TagBadge } from '../components/TagBadge';
import { useToast } from '../context/ToastContext';
import { Sparkles, Search, Filter, RefreshCw, BookOpen } from 'lucide-react';

export const HomePage: React.FC = () => {
  const [posts, setPosts] = useState<PostDto[]>([]);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [tags, setTags] = useState<TagDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [selectedTag, setSelectedTag] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const { showToast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [postsData, categoriesData, tagsData] = await Promise.all([
        apiService.getPosts({ categoryId: selectedCategory, tagId: selectedTag }),
        apiService.getCategories(),
        apiService.getTags(),
      ]);

      setPosts(postsData || []);
      setCategories(categoriesData || []);
      setTags(tagsData || []);
    } catch (err: any) {
      showToast('Error Loading Data', err?.message || 'Could not connect to Spring Boot backend', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedCategory, selectedTag]);

  // Client-side search filtering by title/content
  const filteredPosts = posts.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return p.title?.toLowerCase().includes(q) || p.content?.toLowerCase().includes(q);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl glass-panel p-8 sm:p-12 mb-12 border border-slate-800 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Fullstack Tech Articles & API Playground
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
            Discover Insights. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-brand-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Engineered with Spring Boot & React.
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg mb-8 leading-relaxed">
            Explore backend tutorials, system architecture posts, and modern web application development notes delivered seamlessly through REST controllers.
          </p>

          {/* Search bar */}
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search posts by title or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl glass-input text-sm text-white placeholder-slate-400"
            />
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <div className="mb-8 space-y-4">
        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-xs font-semibold uppercase text-slate-400 flex items-center gap-1 shrink-0 mr-2">
            <Filter className="w-3.5 h-3.5 text-brand-400" />
            Categories:
          </span>

          <button
            onClick={() => setSelectedCategory(undefined)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              selectedCategory === undefined
                ? 'bg-brand-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            All Categories
          </button>

          {categories.map((cat) => (
            <CategoryBadge
              key={cat.id}
              category={cat}
              selected={selectedCategory === cat.id}
              onClick={() => setSelectedCategory(selectedCategory === cat.id ? undefined : cat.id)}
            />
          ))}
        </div>

        {/* Tags Bar */}
        {tags.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <span className="text-xs font-semibold uppercase text-slate-400 shrink-0 mr-2">Tags:</span>
            {tags.map((t) => (
              <TagBadge
                key={t.id}
                tag={t}
                selected={selectedTag === t.id}
                onClick={() => setSelectedTag(selectedTag === t.id ? undefined : t.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Main Posts Content */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-brand-400" />
          {selectedCategory || selectedTag ? 'Filtered Articles' : 'Latest Articles'}
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
            {filteredPosts.length}
          </span>
        </h2>

        <button
          onClick={fetchData}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-800 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="glass-card rounded-2xl p-6 h-64 animate-pulse flex flex-col justify-between">
              <div>
                <div className="w-24 h-4 bg-slate-800 rounded mb-4" />
                <div className="w-full h-6 bg-slate-800 rounded mb-2" />
                <div className="w-3/4 h-6 bg-slate-800 rounded mb-4" />
                <div className="w-full h-12 bg-slate-800/60 rounded" />
              </div>
              <div className="w-full h-8 bg-slate-800/80 rounded" />
            </div>
          ))}
        </div>
      ) : filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="glass-panel rounded-3xl p-12 text-center max-w-md mx-auto">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-1">No Posts Found</h3>
          <p className="text-sm text-slate-400 mb-6">
            There are no articles matching your current filter criteria or the database is empty.
          </p>
          {(selectedCategory || selectedTag || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory(undefined);
                setSelectedTag(undefined);
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold transition-all"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};
