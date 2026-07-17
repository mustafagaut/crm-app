import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, BarChart3, CheckCircle2, Eye, EyeOff, Lock, Mail, ShieldCheck, Sparkles, UserRound, Users, Workflow } from 'lucide-react';
import api from '../services/api';

const SignupPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState(null);

  const passwordChecks = useMemo(() => {
    const value = form.password;
    return [
      { label: '8+ characters', met: value.length >= 8 },
      { label: 'Uppercase letter', met: /[A-Z]/.test(value) },
      { label: 'Number or symbol', met: /[0-9!@#$%^&*]/.test(value) },
    ];
  }, [form.password]);

  const strength = useMemo(() => {
    const met = passwordChecks.filter((item) => item.met).length;
    if (met === 0) return { label: 'Very weak', value: 20 };
    if (met === 1) return { label: 'Weak', value: 40 };
    if (met === 2) return { label: 'Good', value: 70 };
    return { label: 'Strong', value: 100 };
  }, [passwordChecks]);

  const validate = () => {
    const nextErrors = {};
    if (!form.name) nextErrors.name = 'Your name is required';
    if (!form.email) nextErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) nextErrors.email = 'Enter a valid email';
    if (!form.password) nextErrors.password = 'Choose a password';
    else if (form.password.length < 8) nextErrors.password = 'Use at least 8 characters';
    if (!confirmPassword) nextErrors.confirmPassword = 'Please confirm your password';
    else if (form.password !== confirmPassword) nextErrors.confirmPassword = 'Passwords do not match';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const response = await api.post('/auth/signup', form);
      localStorage.setItem('token', response.data.data.token);
      setToast({ type: 'success', message: 'Account created. Taking you to your workspace…' });
      window.setTimeout(() => navigate('/dashboard'), 350);
    } catch (err) {
      const message = err.response?.data?.message || 'Signup failed. Please try again.';
      setErrors({ form: message });
      setToast({ type: 'error', message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] px-4 py-6 text-[var(--text-primary)] sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[32px] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-card)] lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative hidden overflow-hidden bg-gradient-to-br from-[#2563eb] via-[#4f46e5] to-[#06b6d4] p-10 text-white lg:flex lg:flex-col lg:justify-between">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.24),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.16),_transparent_28%)]" />
            <div className="absolute right-[-30px] top-[-24px] h-40 w-40 rounded-full border border-white/30" />
            <div className="absolute bottom-[-56px] left-[-24px] h-44 w-44 rounded-full border border-white/20" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" />
                Start strong
              </div>
              <div className="mt-14 max-w-xl">
                <h1 className="text-4xl font-semibold leading-tight tracking-tight">Give your team a modern command center.</h1>
                <p className="mt-4 max-w-lg text-base leading-7 text-white/80">Create your workspace and unlock clear customer context, reliable follow-ups, and confident revenue planning.</p>
              </div>
              <div className="mt-10 rounded-[24px] border border-white/20 bg-white/10 p-5 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
                    <Workflow className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Built for growth</p>
                    <p className="mt-1 text-sm text-white/70">Keep every department aligned around the same customer truth.</p>
                  </div>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/20 bg-slate-950/10 p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <Users className="h-4 w-4" />
                      Shared views
                    </div>
                    <p className="mt-2 text-sm text-white/70">Create a shared operating rhythm from day one.</p>
                  </div>
                  <div className="rounded-2xl border border-white/20 bg-slate-950/10 p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <BarChart3 className="h-4 w-4" />
                      Instant insights
                    </div>
                    <p className="mt-2 text-sm text-white/70">Surface momentum and opportunities with less effort.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative z-10 flex flex-wrap gap-3 text-sm text-white/80">
              <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2">
                <ShieldCheck className="h-4 w-4" />
                Zero-friction onboarding
              </div>
              <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2">
                <CheckCircle2 className="h-4 w-4" />
                Trusted by modern teams
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center p-6 sm:p-8 lg:p-10">
            <div className="w-full max-w-[430px] rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-7 shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card)] sm:p-8">
              <div className="mb-7">
                <div className="inline-flex items-center gap-2 rounded-full bg-[var(--surface-alt)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--text-muted)]">
                  <Sparkles className="h-3.5 w-3.5 text-[var(--primary)]" />
                  Start free
                </div>
                <h2 className="mt-6 text-3xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-[32px]">Create your account</h2>
                <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">Open your workspace and start shaping customer experiences with a refined operating system.</p>
              </div>

              {toast ? (
                <div className={`mb-5 rounded-2xl border px-4 py-3 text-sm ${toast.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-rose-200 bg-rose-50 text-rose-700'}`}>
                  {toast.message}
                </div>
              ) : null}

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium text-[var(--text-primary)]">Full name</label>
                  <div className={`flex items-center gap-3 rounded-2xl border bg-[var(--surface-alt)] px-4 py-3.5 transition-all duration-200 focus-within:border-[var(--primary)] focus-within:bg-[var(--surface)] focus-within:ring-4 focus-within:ring-[var(--primary)]/10 ${errors.name ? 'border-rose-300' : 'border-[var(--border)]'}`}>
                    <UserRound className={`h-4 w-4 ${errors.name ? 'text-rose-500' : 'text-[var(--text-muted)]'}`} />
                    <input id="name" type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]" placeholder="Alex Morgan" aria-invalid={Boolean(errors.name)} />
                  </div>
                  {errors.name ? <p className="mt-2 text-sm text-rose-600">{errors.name}</p> : null}
                </div>

                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-[var(--text-primary)]">Email address</label>
                  <div className={`flex items-center gap-3 rounded-2xl border bg-[var(--surface-alt)] px-4 py-3.5 transition-all duration-200 focus-within:border-[var(--primary)] focus-within:bg-[var(--surface)] focus-within:ring-4 focus-within:ring-[var(--primary)]/10 ${errors.email ? 'border-rose-300' : 'border-[var(--border)]'}`}>
                    <Mail className={`h-4 w-4 ${errors.email ? 'text-rose-500' : 'text-[var(--text-muted)]'}`} />
                    <input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]" placeholder="you@company.com" autoComplete="email" aria-invalid={Boolean(errors.email)} />
                  </div>
                  {errors.email ? <p className="mt-2 text-sm text-rose-600">{errors.email}</p> : null}
                </div>

                <div>
                  <label htmlFor="password" className="mb-2 block text-sm font-medium text-[var(--text-primary)]">Password</label>
                  <div className={`flex items-center gap-3 rounded-2xl border bg-[var(--surface-alt)] px-4 py-3.5 transition-all duration-200 focus-within:border-[var(--primary)] focus-within:bg-[var(--surface)] focus-within:ring-4 focus-within:ring-[var(--primary)]/10 ${errors.password ? 'border-rose-300' : 'border-[var(--border)]'}`}>
                    <Lock className={`h-4 w-4 ${errors.password ? 'text-rose-500' : 'text-[var(--text-muted)]'}`} />
                    <input id="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]" placeholder="Create a password" autoComplete="new-password" aria-invalid={Boolean(errors.password)} />
                    <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="rounded-full p-1 text-[var(--text-muted)] transition hover:bg-slate-200 hover:text-[var(--text-primary)]">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <div className="mt-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-alt)] p-3">
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="font-medium text-[var(--text-primary)]">Password strength</span>
                      <span className="text-[var(--text-muted)]">{strength.label}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200">
                      <div className="h-2 rounded-full bg-gradient-to-r from-[var(--primary)] to-[#06b6d4] transition-all" style={{ width: `${strength.value}%` }} />
                    </div>
                    <ul className="mt-3 space-y-2 text-sm text-[var(--text-muted)]">
                      {passwordChecks.map((item) => (
                        <li key={item.label} className="flex items-center gap-2">
                          <span className={`h-2.5 w-2.5 rounded-full ${item.met ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                          {item.label}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {errors.password ? <p className="mt-2 text-sm text-rose-600">{errors.password}</p> : null}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-[var(--text-primary)]">Confirm password</label>
                  <div className={`flex items-center gap-3 rounded-2xl border bg-[var(--surface-alt)] px-4 py-3.5 transition-all duration-200 focus-within:border-[var(--primary)] focus-within:bg-[var(--surface)] focus-within:ring-4 focus-within:ring-[var(--primary)]/10 ${errors.confirmPassword ? 'border-rose-300' : 'border-[var(--border)]'}`}>
                    <Lock className={`h-4 w-4 ${errors.confirmPassword ? 'text-rose-500' : 'text-[var(--text-muted)]'}`} />
                    <input id="confirmPassword" type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]" placeholder="Re-enter password" autoComplete="new-password" aria-invalid={Boolean(errors.confirmPassword)} />
                  </div>
                  {errors.confirmPassword ? <p className="mt-2 text-sm text-rose-600">{errors.confirmPassword}</p> : null}
                </div>

                {errors.form ? <p className="text-sm text-rose-600">{errors.form}</p> : null}

                <button type="submit" disabled={isLoading} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[#06b6d4] px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60">
                  {isLoading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> : <ArrowRight className="h-4 w-4" />}
                  {isLoading ? 'Creating account…' : 'Create account'}
                </button>
              </form>

              <div className="my-6 flex items-center gap-3 text-sm text-[var(--text-muted)]">
                <div className="h-px flex-1 bg-[var(--border)]" />
                <span>or</span>
                <div className="h-px flex-1 bg-[var(--border)]" />
              </div>

              <p className="text-center text-sm text-[var(--text-muted)]">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-[var(--primary)] transition hover:text-[var(--primary-strong)]">Sign in</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
