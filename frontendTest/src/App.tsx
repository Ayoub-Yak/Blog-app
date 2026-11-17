import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { PostDetailPage } from './pages/PostDetailPage';
import { PostEditorPage } from './pages/PostEditorPage';
import { DraftsPage } from './pages/DraftsPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { TagsPage } from './pages/TagsPage';
import { LoginPage } from './pages/LoginPage';
import { ApiDocPage } from './pages/ApiDocPage';

export const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-brand-500 selection:text-white">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/posts/:id" element={<PostDetailPage />} />
                <Route path="/new-post" element={<PostEditorPage />} />
                <Route path="/edit-post/:id" element={<PostEditorPage />} />
                <Route path="/drafts" element={<DraftsPage />} />
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/tags" element={<TagsPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/api-doc" element={<ApiDocPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
