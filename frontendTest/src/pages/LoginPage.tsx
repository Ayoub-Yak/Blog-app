import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { LogIn, Mail, Lock, Sparkles, CheckCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>('user@test.com');
  const [password, setPassword] = useState<string>('password');
  const [loading, setLoading] = useState<boolean>(false);

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login({ email, password });
      showToast('Authentication Successful', 'Welcome back! JWT token saved to localStorage.', 'success');
      navigate('/');
    } catch (err: any) {
      showToast(
        'Login Failed',
        err?.message || 'Invalid credentials. Please verify your email and password.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('user@test.com');
    setPassword('password');
    showToast('Demo Credentials Filled', 'Spring Boot default user credentials filled in.', 'info');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full glass-panel rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-2xl relative overflow-hidden">
        {/* Glowing background circles */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-brand-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 p-0.5 mx-auto mb-4 shadow-lg shadow-brand-600/30">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-brand-400" />
            </div>
          </div>

          <h2 className="text-2xl font-extrabold text-white tracking-tight">Sign In to DevTiro</h2>
          <p className="text-xs text-slate-400 mt-1">
            Authentication endpoint: <code className="text-brand-300">POST /api/v1/auth/login</code>
          </p>
        </div>

        {/* Demo Credentials Box */}
        <div className="mb-6 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
          <div>
            <span className="font-semibold text-brand-300 block mb-0.5">Test Credentials (Spring Boot):</span>
            <span className="text-slate-400 font-mono">user@test.com / password</span>
          </div>
          <button
            type="button"
            onClick={handleFillDemo}
            className="px-2.5 py-1 rounded-lg bg-brand-600/20 hover:bg-brand-600 text-brand-300 hover:text-white transition-colors font-medium text-[11px]"
          >
            Auto Fill
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="email"
                placeholder="user@test.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm text-white placeholder-slate-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm text-white placeholder-slate-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-semibold text-sm shadow-lg shadow-brand-600/30 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Sign In
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-800/80 text-center text-xs text-slate-400">
          <div className="flex items-center justify-center gap-1.5 text-emerald-400">
            <CheckCircle className="w-4 h-4" />
            <span>Stateless JWT Session Management</span>
          </div>
        </div>
      </div>
    </div>
  );
};
