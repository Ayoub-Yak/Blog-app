import React from 'react';
import { Sparkles, Code2, ShieldCheck, Cpu } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-slate-950/80 glass-panel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg text-white">DevTiro Blog</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              A modern full-stack web application powered by Spring Boot REST API, Spring Security, JWT authentication, and React with TypeScript.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-400" />
              Backend Endpoints & Security
            </h4>
            <ul className="text-xs text-slate-400 space-y-1.5 font-mono">
              <li>• POST /api/v1/auth/login</li>
              <li>• GET | POST | PUT | DELETE /api/v1/posts</li>
              <li>• GET /api/v1/posts/drafts (Authenticated)</li>
              <li>• GET | POST | DELETE /api/v1/categories</li>
              <li>• GET | POST | DELETE /api/v1/tags</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400" />
              Frontend Architecture
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Built with React 18, TypeScript, TailwindCSS glassmorphism styling, Axios interceptors, JWT authorization state, and Vite proxy integration.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} DevTiro Blog. Fullstack REST API Demonstration.</p>
          <div className="flex items-center gap-2 text-slate-400">
            <Code2 className="w-4 h-4 text-brand-400" />
            <span>Built for Spring Boot Compatibility</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
