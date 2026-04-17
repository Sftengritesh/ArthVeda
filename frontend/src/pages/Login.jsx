import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email) => {
    if (!email.trim()) return 'Email is required';
    // Basic format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email (e.g. name@example.com)';
    // Check for common domain typos
    const domain = email.split('@')[1]?.toLowerCase();
    const commonTypos = { 'gmial.com': 'gmail.com', 'gmal.com': 'gmail.com', 'gamil.com': 'gmail.com', 'gnail.com': 'gmail.com', 'gmaill.com': 'gmail.com', 'yahooo.com': 'yahoo.com', 'yaho.com': 'yahoo.com', 'outllook.com': 'outlook.com', 'outlok.com': 'outlook.com' };
    if (commonTypos[domain]) return `Did you mean ...@${commonTypos[domain]}?`;
    return '';
  };

  const handleEmailChange = (e) => {
    const email = e.target.value;
    setFormData({ ...formData, email });
    if (emailError) setEmailError(validateEmail(email));
  };

  const handleEmailBlur = () => {
    setEmailError(validateEmail(formData.email));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailErr = validateEmail(formData.email);
    if (emailErr && !emailErr.startsWith('Did you mean')) {
      setEmailError(emailErr);
      return;
    }

    setLoading(true);
    
    try {
      const normalizedEmail = formData.email.toLowerCase().trim();
      const res = await login(normalizedEmail, formData.password);
      if (res) {
        toast.success("Welcome back!");
        navigate('/');
      }
    } catch (err) {
      console.error('Login error:', err);
      const errorMsg = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Login failed. Please check your credentials.';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[var(--bg-primary)]">
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--accent)] rounded-full blur-[120px] opacity-10" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-[var(--info)] rounded-full blur-[100px] opacity-10" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link to="/welcome" className="text-2xl font-extrabold text-[var(--accent)] tracking-tight">
            ArthVeda
          </Link>

          <div className="space-y-6 max-w-md">
            <h2 className="text-4xl font-extrabold text-white leading-tight">
              Take control of your <span className="text-[var(--accent)]">finances</span>, one insight at a time.
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed">
              Smart tracking, AI-powered insights, and beautiful analytics — all in one place.
            </p>

            <div className="flex items-center gap-4 pt-4">
              <div className="flex -space-x-2">
                {['RV', 'HS', 'AG'].map((initials, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-[#060a10] flex items-center justify-center text-[10px] font-bold"
                    style={{
                      backgroundColor: ['#34d39920', '#60a5fa20', '#a78bfa20'][i],
                      color: ['#34d399', '#60a5fa', '#a78bfa'][i],
                    }}
                  >
                    {initials}
                  </div>
                ))}
              </div>
              <span className="text-gray-600 text-sm">Built by students who care about your money</span>
            </div>
          </div>

          <p className="text-gray-700 text-xs">© {new Date().getFullYear()} ArthVeda</p>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-[var(--bg-secondary)]">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <Link to="/welcome" className="lg:hidden text-2xl font-extrabold text-[var(--accent)] tracking-tight block mb-12">
            ArthVeda
          </Link>

          <div className="space-y-2 mb-10">
            <h1 className="text-3xl font-bold text-white tracking-tight">Welcome back</h1>
            <p className="text-gray-500">Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-400 block">Email</label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleEmailChange}
                onBlur={handleEmailBlur}
                className={`w-full bg-transparent border-b pb-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none transition-colors text-[15px] ${emailError ? 'border-[var(--danger)]' : 'border-[var(--border-secondary)] focus:border-[var(--accent)]'}`}
              />
              {emailError && (
                <p className={`text-xs mt-1 ${emailError.startsWith('Did you mean') ? 'text-[var(--warning)]' : 'text-[var(--danger)]'}`}>
                  {emailError}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-400 block">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-transparent border-b border-[var(--border-secondary)] pb-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors text-[15px]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--bg-primary)] font-bold py-3 rounded-xl transition-all duration-200 text-sm mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In →'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-[var(--text-secondary)] mt-8">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[var(--accent)] hover:text-[var(--accent-hover)] font-medium transition-colors">
              Create one
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}