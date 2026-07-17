import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const SignupPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await api.post('/auth/signup', form);
      localStorage.setItem('token', response.data.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">CRM Portal</p>
          <h1 className="mt-2 text-3xl font-semibold">Create account</h1>
          <p className="mt-2 text-sm text-slate-400">Start managing your customer pipeline.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error ? <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-300">{error}</p> : null}
          <div>
            <label className="mb-2 block text-sm text-slate-300">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 outline-none ring-0"
              placeholder="Alex Morgan"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 outline-none ring-0"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 outline-none ring-0"
              placeholder="••••••••"
            />
          </div>
          <button className="w-full rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-cyan-400">
            Create account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-cyan-400">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
