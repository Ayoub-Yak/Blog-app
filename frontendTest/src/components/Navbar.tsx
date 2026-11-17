import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  PenSquare,
  FileText,
  FolderTree,
  Tag as TagIcon,
  LogIn,
  LogOut,
  Sparkles,
  BookOpen,
  HelpCircle
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    showToast('Logged out', 'You have been logged out safely', 'info');
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-purple-500 p-0.5 shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform duration-200">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-brand-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg text-white tracking-tight leading-none group-hover:text-brand-300 transition-colors">
              DevTiro<span className="text-brand-500">.blog</span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
              Spring Boot + React
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-full border border-slate-800">
          <Link
            to="/"
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
              isActive('/')
                ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Articles
          </Link>

          <Link
            to="/categories"
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
              isActive('/categories')
                ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <FolderTree className="w-4 h-4" />
            Categories
          </Link>

          <Link
            to="/tags"
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
              isActive('/tags')
                ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <TagIcon className="w-4 h-4" />
            Tags
          </Link>

          {isAuthenticated && (
            <Link
              to="/drafts"
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
                isActive('/drafts')
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                  : 'text-amber-400 hover:text-amber-300 hover:bg-amber-950/40'
              }`}
            >
              <FileText className="w-4 h-4" />
              Drafts
            </Link>
          )}

          <Link
            to="/api-doc"
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
              isActive('/api-doc')
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-indigo-300 hover:text-indigo-200 hover:bg-indigo-950/40'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            How Request/Response Works
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link
                to="/new-post"
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-lg shadow-brand-600/25 hover:shadow-brand-600/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <PenSquare className="w-4 h-4" />
                Write Post
              </Link>

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 border border-slate-700/60 transition-all"
                title="Log out"
              >
                <LogOut className="w-4 h-4 text-rose-400" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-600/25 transition-all hover:scale-[1.02]"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
