import React from 'react';
import { ArrowRight, Lock, Key, Server, RefreshCw, Send, CheckCircle2, ShieldAlert, Cpu } from 'lucide-react';

export const ApiDocPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3">
          <Cpu className="w-3.5 h-3.5" />
          Fullstack HTTP Lifecycle Guide
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
          How the React Frontend Sends Requests & Gets Responses
        </h1>
        <p className="text-slate-300 text-base leading-relaxed">
          Comprehensive step-by-step breakdown of how the client interacts with Spring Boot REST Controllers, Security Filters, JWT Token validation, and CORS/Vite proxies.
        </p>
      </div>

      {/* Visual Diagram Step Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        
        {/* Step 1 */}
        <div className="glass-card rounded-2xl p-6 relative border border-slate-800">
          <div className="w-8 h-8 rounded-xl bg-brand-600 text-white font-bold text-sm flex items-center justify-center mb-4">
            1
          </div>
          <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <Send className="w-4 h-4 text-brand-400" />
            Client Action & Interceptor
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            When a user submits a form or loads a page, <code className="text-brand-300">apiService.ts</code> triggers an Axios HTTP request.
          </p>
          <div className="p-3 rounded-xl bg-slate-900/90 font-mono text-[11px] text-slate-300 border border-slate-800 space-y-1">
            <div className="text-slate-400">// Request Interceptor</div>
            <div><span className="text-purple-400">const</span> token = localStorage.<span className="text-blue-300">getItem</span>(<span className="text-emerald-300">'token'</span>);</div>
            <div>config.headers.<span className="text-brand-400">Authorization</span> = <span className="text-emerald-300">"Bearer " + token</span>;</div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="glass-card rounded-2xl p-6 relative border border-slate-800">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold text-sm flex items-center justify-center mb-4">
            2
          </div>
          <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <Server className="w-4 h-4 text-indigo-400" />
            Spring Security Filter Chain
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            The request hits Spring Boot. <code className="text-indigo-300">JwtAuthenticationFilter</code> intercepts the request and verifies the Bearer token.
          </p>
          <div className="p-3 rounded-xl bg-slate-900/90 font-mono text-[11px] text-slate-300 border border-slate-800 space-y-1">
            <div className="text-slate-400">// Security Filter</div>
            <div>UserDetails user = authService.<span className="text-blue-300">validateToken</span>(token);</div>
            <div>SecurityContextHolder.<span className="text-blue-300">setAuthentication</span>(...);</div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="glass-card rounded-2xl p-6 relative border border-slate-800">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-bold text-sm flex items-center justify-center mb-4">
            3
          </div>
          <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Controller & Response
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            The target `@RestController` executes business logic and returns a serialized JSON DTO payload with HTTP status code.
          </p>
          <div className="p-3 rounded-xl bg-slate-900/90 font-mono text-[11px] text-slate-300 border border-slate-800 space-y-1">
            <div className="text-slate-400">// Controller Response</div>
            <div><span className="text-emerald-400">HTTP 200 / 201</span></div>
            <div>JSON Body: &#123; <span className="text-amber-300">"id"</span>: <span className="text-emerald-300">"..."</span>, <span className="text-amber-300">"title"</span>: <span className="text-emerald-300">"..."</span> &#125;</div>
          </div>
        </div>
      </div>

      {/* Endpoints Compatibility Table */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 mb-12">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Key className="w-5 h-5 text-brand-400" />
          Supported Controllers & Endpoints
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="text-xs uppercase bg-slate-900/80 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">HTTP Method</th>
                <th className="px-4 py-3">Endpoint Path</th>
                <th className="px-4 py-3">Access Level</th>
                <th className="px-4 py-3">Description & Payload</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
              <tr>
                <td className="px-4 py-3 font-bold text-emerald-400">POST</td>
                <td className="px-4 py-3 text-white">/api/v1/auth/login</td>
                <td className="px-4 py-3 text-slate-400">Public</td>
                <td className="px-4 py-3 text-slate-300 font-sans">Login with email & password, returns JWT token</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-bold text-blue-400">GET</td>
                <td className="px-4 py-3 text-white">/api/v1/posts</td>
                <td className="px-4 py-3 text-slate-400">Public</td>
                <td className="px-4 py-3 text-slate-300 font-sans">List posts (supports query params: categgorryId, tagId)</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-bold text-amber-400">GET</td>
                <td className="px-4 py-3 text-white">/api/v1/posts/drafts</td>
                <td className="px-4 py-3 text-amber-300 font-semibold">Authenticated</td>
                <td className="px-4 py-3 text-slate-300 font-sans">List user's unpublished draft posts</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-bold text-emerald-400">POST</td>
                <td className="px-4 py-3 text-white">/api/v1/posts</td>
                <td className="px-4 py-3 text-amber-300 font-semibold">Authenticated</td>
                <td className="px-4 py-3 text-slate-300 font-sans">Create a post (CreatePostRequestDto)</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-bold text-purple-400">PUT</td>
                <td className="px-4 py-3 text-white">/api/v1/posts/{'{id}'}</td>
                <td className="px-4 py-3 text-amber-300 font-semibold">Authenticated</td>
                <td className="px-4 py-3 text-slate-300 font-sans">Update post details (UpdatdePostResquestDto)</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-bold text-rose-400">DELETE</td>
                <td className="px-4 py-3 text-white">/api/v1/posts/{'{id}'}</td>
                <td className="px-4 py-3 text-amber-300 font-semibold">Authenticated</td>
                <td className="px-4 py-3 text-slate-300 font-sans">Delete a post by ID</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-bold text-blue-400">GET / POST / DELETE</td>
                <td className="px-4 py-3 text-white">/api/v1/categories</td>
                <td className="px-4 py-3 text-slate-400">Mixed</td>
                <td className="px-4 py-3 text-slate-300 font-sans">List, create, or delete blog categories</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-bold text-blue-400">GET / POST / DELETE</td>
                <td className="px-4 py-3 text-white">/api/v1/tags</td>
                <td className="px-4 py-3 text-slate-400">Mixed</td>
                <td className="px-4 py-3 text-slate-300 font-sans">List, bulk create, or delete tags</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Vite Proxy vs CORS section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel rounded-3xl p-6 border border-slate-800">
          <h4 className="font-bold text-white mb-2 flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-brand-400" />
            Vite Dev Server Proxy Setup
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed mb-3">
            In development mode, React runs on <code className="text-brand-300">http://localhost:5173</code>. To avoid CORS issues without altering backend code, Vite proxies requests targeting <code className="text-brand-300">/api/*</code> to <code className="text-brand-300">http://localhost:8080</code>.
          </p>
          <pre className="p-3 rounded-xl bg-slate-900 font-mono text-[11px] text-slate-300 overflow-x-auto">
{`// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
})`}
          </pre>
        </div>

        <div className="glass-panel rounded-3xl p-6 border border-slate-800">
          <h4 className="font-bold text-white mb-2 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            Error Handling & Interceptors
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed mb-3">
            If the server returns <code className="text-rose-300">401 Unauthorized</code> (e.g. expired JWT), the response interceptor automatically purges <code className="text-rose-300">localStorage</code> and prompts the user to log in.
          </p>
          <pre className="p-3 rounded-xl bg-slate-900 font-mono text-[11px] text-slate-300 overflow-x-auto">
{`api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);`}
          </pre>
        </div>
      </div>
    </div>
  );
};
