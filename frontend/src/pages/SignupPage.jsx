import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import api from '../services/api';

const SignupPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Requirement Check: Proper input validation checking before API lifecycle hooks execution
  const validate = () => {
    const nextErrors = {};
    
    if (!form.name.trim()) {
      nextErrors.name = 'Full name is required';
    }
    
    if (!form.email.trim()) {
      nextErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      nextErrors.email = 'Please enter a valid email structure';
    }
    
    if (!form.password) {
      nextErrors.password = 'Password field cannot be empty';
    } else if (form.password.length < 6) {
      nextErrors.password = 'Password must contain at least 6 characters';
    }
    
    if (!confirmPassword) {
      nextErrors.confirmPassword = 'Please confirm your password entry';
    } else if (form.password !== confirmPassword) {
      nextErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError(null);
    if (!validate()) return;

    setIsLoading(true);
    try {
      // Requirement Check: Process secure account creation endpoint registration
      const response = await api.post('/auth/signup', form);
      
      // Requirement Check: Handle security payload parsing via browser storage APIs
      localStorage.setItem('token', response.data?.data?.token);
      
      // Requirement Check: Forward users immediately to the central Contacts Pipeline View
      navigate('/contacts');
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed. Please check your credentials.';
      setAuthError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans antialiased text-slate-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          CRM Platform
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Create an account to start managing your pipeline details
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-slate-900 border border-slate-800 py-8 px-6 shadow-xl rounded-2xl sm:px-10">
          
          {authError && (
            <div className="mb-4 rounded-lg border border-rose-500/20 bg-rose-500/10 p-3 text-sm text-rose-400">
              {authError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            
            {/* Full Name Block */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-300">
                Full Name
              </label>
              <div className="mt-1.5 relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-slate-500" />
                </div>
                <input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="John Doe"
                  className={`block w-full pl-10 pr-3 py-2.5 bg-slate-950 border text-slate-100 placeholder-slate-500 rounded-lg text-sm outline-none transition focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 ${
                    errors.name ? 'border-rose-500/50 focus:ring-rose-500 focus:border-rose-500' : 'border-slate-800'
                  }`}
                />
              </div>
              {errors.name && (
                <p className="mt-1.5 text-xs text-rose-400 font-medium">{errors.name}</p>
              )}
            </div>

            {/* Email Field Block */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                Email Address
              </label>
              <div className="mt-1.5 relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-slate-500" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="name@company.com"
                  className={`block w-full pl-10 pr-3 py-2.5 bg-slate-950 border text-slate-100 placeholder-slate-500 rounded-lg text-sm outline-none transition focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 ${
                    errors.email ? 'border-rose-500/50 focus:ring-rose-500 focus:border-rose-500' : 'border-slate-800'
                  }`}
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-rose-400 font-medium">{errors.email}</p>
              )}
            </div>

            {/* Password Field Block */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                Password
              </label>
              <div className="mt-1.5 relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-500" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className={`block w-full pl-10 pr-10 py-2.5 bg-slate-950 border text-slate-100 placeholder-slate-500 rounded-lg text-sm outline-none transition focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 ${
                    errors.password ? 'border-rose-500/50 focus:ring-rose-500 focus:border-rose-500' : 'border-slate-800'
                  }`}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-rose-400 font-medium">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field Block */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300">
                Confirm Password
              </label>
              <div className="mt-1.5 relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-500" />
                </div>
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`block w-full pl-10 pr-3 py-2.5 bg-slate-950 border text-slate-100 placeholder-slate-500 rounded-lg text-sm outline-none transition focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 ${
                    errors.confirmPassword ? 'border-rose-500/50 focus:ring-rose-500 focus:border-rose-500' : 'border-slate-800'
                  }`}
                  autoComplete="new-password"
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1.5 text-xs text-rose-400 font-medium">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-500 px-4 py-2.5 text-sm font-medium text-slate-950 transition hover:bg-cyan-400 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Fallback Login Link */}
          <div className="mt-6 border-t border-slate-800 pt-5 text-center">
            <p className="text-sm text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-cyan-400 hover:text-cyan-300 transition">
                Sign In
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SignupPage;