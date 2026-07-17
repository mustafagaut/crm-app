import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, Mail, Sparkles } from 'lucide-react';
import api from '../services/api';

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('/auth/login', form);
      localStorage.setItem('token', response.data.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_32%),linear-gradient(135deg,_#020617_0%,_#0f172a_45%,_#111827_100%)] px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center justify-center">
        <div className="grid w-full max-w-6xl overflow-hidden rounded-[32px] border border-white/10 bg-slate-900/50 shadow-[0_30px_80px_rgba(2,6,23,0.45)] backdrop-blur-xl lg:grid-cols-[1.05fr_0.95fr]">
          <div className="hidden flex-col justify-between bg-gradient-to-br from-slate-900/90 to-slate-800/80 p-10 lg:flex">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-400 ring-1 ring-blue-400/30">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-300">CRM OS</p>
                  <p className="text-sm text-slate-400">Revenue intelligence platform</p>
                </div>
              </div>

              <div className="mt-16 space-y-4">
                <h1 className="text-4xl font-semibold tracking-tight text-white">
                  Turn conversations into a reliable pipeline.
                </h1>
                <p className="max-w-md text-base leading-7 text-slate-300">
                  Manage deals, customers, and follow-ups from one elegant workspace built for modern teams.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
              <p className="font-medium text-white">Trusted by high-growth sales teams</p>
              <p className="mt-1 text-slate-400">Secure, thoughtful workflows for every customer touchpoint.</p>
            </div>
          </div>

          <div className="w-full p-6 sm:p-8 lg:p-10">
            <div className="mb-8 flex items-center justify-between lg:justify-start lg:gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-400 ring-1 ring-blue-400/20">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-300">Sign in</p>
                  <p className="text-sm text-slate-400">Welcome back</p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-3xl font-semibold tracking-tight text-white">Welcome back</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Sign in to continue managing your contacts, deals, and customer relationships.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error ? (
                <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
                  {error}
                </div>
              ) : null}

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-slate-300">
                  Email address
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-700/80 bg-slate-800/70 px-3 py-3 transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                    placeholder="you@company.com"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-slate-300">
                  Password
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-700/80 bg-slate-800/70 px-3 py-3 transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
                  <Lock className="h-4 w-4 text-slate-400" />
                  <input
                    id="password"
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-slate-400">
                  <input type="checkbox" className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-blue-500 focus:ring-blue-500" />
                  Remember me
                </label>
                <a href="#" className="font-medium text-blue-400 transition hover:text-blue-300">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )}
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <div className="my-6 flex items-center gap-3 text-sm text-slate-500">
              <div className="h-px flex-1 bg-slate-700" />
              <span>or</span>
              <div className="h-px flex-1 bg-slate-700" />
            </div>

            <p className="text-center text-sm text-slate-400">
              New to the platform?{' '}
              <Link to="/signup" className="font-semibold text-blue-400 transition hover:text-blue-300">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;