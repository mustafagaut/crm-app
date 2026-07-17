import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, BarChart3, CheckCircle2, Eye, EyeOff, Lock, Mail, ShieldCheck, Sparkles, Users, Workflow } from 'lucide-react';
import api from '../services/api';

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.email || !form.password) {
      const message = 'Please enter both your email and password.';
      setError(message);
      setToast({ type: 'error', message });
      return;
    }

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      const message = 'Enter a valid email address.';
      setError(message);
      setToast({ type: 'error', message });
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post('/auth/login', form);
      localStorage.setItem('token', response.data.data.token);
      setToast({ type: 'success', message: 'Signed in successfully. Redirecting…' });
      window.setTimeout(() => navigate('/dashboard'), 350);
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please try again.';
      setError(message);
      setToast({ type: 'error', message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_35px_120px_rgba(15,23,42,0.10)] lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative hidden overflow-hidden bg-gradient-to-br from-[#4F46E5] via-[#7C3AED] to-[#06B6D4] p-10 text-white lg:flex lg:flex-col lg:justify-between">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.24),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.14),_transparent_28%)]" />
            <div className="absolute right-[-32px] top-[-28px] h-40 w-40 rounded-full border border-white/30" />
            <div className="absolute bottom-[-56px] left-[-24px] h-44 w-44 rounded-full border border-white/20" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" />
                Enterprise CRM
              </div>

              <div className="mt-14 max-w-xl">
                <h1 className="text-4xl font-semibold leading-tight tracking-tight">
                  Build a sharper view of every customer journey.
                </h1>
                <p className="mt-4 max-w-lg text-base leading-7 text-white/80">
                  Coordinate deals, relationships, and follow-ups in one premium workspace built for modern revenue teams.
                </p>
              </div>

              <div className="mt-10 rounded-[24px] border border-white/20 bg-white/10 p-5 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
                    <Workflow className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Automated workflows</p>
                    <p className="text-sm text-white/70">Keep handoffs and follow-ups effortless.</p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/20 bg-slate-950/10 p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <Users className="h-4 w-4" />
                      12k+ contacts
                    </div>
                    <p className="mt-2 text-sm text-white/70">A single source of truth for every relationship.</p>
                  </div>
                  <div className="rounded-2xl border border-white/20 bg-slate-950/10 p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <BarChart3 className="h-4 w-4" />
                      +32% faster ops
                    </div>
                    <p className="mt-2 text-sm text-white/70">Live reporting designed for leadership clarity.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 flex flex-wrap gap-3 text-sm text-white/80">
              <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2">
                <ShieldCheck className="h-4 w-4" />
                SOC 2 ready
              </div>
              <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2">
                <CheckCircle2 className="h-4 w-4" />
                Enterprise support
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center p-6 sm:p-8 lg:p-10">
            <div className="w-full max-w-[430px] rounded-[28px] border border-slate-200 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_100px_rgba(15,23,42,0.12)]">
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-600">
                  <Sparkles className="h-3.5 w-3.5 text-[#4F46E5]" />
                  Secure access
                </div>
                <h2 className="mt-6 text-3xl font-semibold tracking-tight text-slate-900 sm:text-[32px]">
                  Welcome back
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Sign in to continue orchestrating customer relationships with clarity and speed.
                </p>
              </div>

              {toast ? (
                <div className={`mb-5 rounded-2xl border px-4 py-3 text-sm ${toast.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-rose-200 bg-rose-50 text-rose-700'}`}>
                  {toast.message}
                </div>
              ) : null}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="group relative">
                  <label htmlFor="email" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400 transition-all duration-300 group-focus-within:top-2.5 group-focus-within:-translate-y-0 group-focus-within:text-xs group-focus-within:text-[#4F46E5]">
                    Email address
                  </label>
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 transition-all duration-300 focus-within:border-[#4F46E5] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#4F46E5]/10">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full bg-transparent pt-4 text-sm text-slate-700 outline-none placeholder:text-slate-400"
                      placeholder=""
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div className="group relative">
                  <label htmlFor="password" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400 transition-all duration-300 group-focus-within:top-2.5 group-focus-within:-translate-y-0 group-focus-within:text-xs group-focus-within:text-[#4F46E5]">
                    Password
                  </label>
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 transition-all duration-300 focus-within:border-[#4F46E5] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#4F46E5]/10">
                    <Lock className="h-4 w-4 text-slate-400" />
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="w-full bg-transparent pt-4 text-sm text-slate-700 outline-none placeholder:text-slate-400"
                      placeholder=""
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="rounded-full p-1 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {error ? <p className="text-sm text-rose-600">{error}</p> : null}

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-slate-500">
                    <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-[#4F46E5] focus:ring-[#4F46E5]" />
                    Remember me
                  </label>
                  <a href="#" className="font-medium text-[#4F46E5] transition hover:text-[#4338CA]">
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#4F46E5] via-[#7C3AED] to-[#06B6D4] px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:translate-y-[-1px] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isLoading ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  ) : (
                    <ArrowRight className="h-4 w-4" />
                  )}
                  {isLoading ? 'Signing in…' : 'Sign in'}
                </button>
              </form>

              <div className="my-6 flex items-center gap-3 text-sm text-slate-400">
                <div className="h-px flex-1 bg-slate-200" />
                <span>or</span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <p className="text-center text-sm text-slate-600">
                New to the platform?{' '}
                <Link to="/signup" className="font-semibold text-[#4F46E5] transition hover:text-[#4338CA]">
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
