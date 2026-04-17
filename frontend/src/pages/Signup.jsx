import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

// ─── Validators ───────────────────────────────────────────────────────────────

const validateName = (name) => {
  if (!name.trim()) return 'Full name is required';
  if (name.trim().length < 2) return 'Name must be at least 2 characters';
  if (!/^[a-zA-Z\s'-]+$/.test(name.trim())) return 'Name can only contain letters, spaces, hyphens, or apostrophes';
  return '';
};

const validateEmail = (email) => {
  if (!email.trim()) return 'Email is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email.trim())) return 'Please enter a valid email (e.g. name@example.com)';
  const domain = email.split('@')[1]?.toLowerCase();
  const commonTypos = {
    'gmial.com': 'gmail.com', 'gmal.com': 'gmail.com', 'gamil.com': 'gmail.com',
    'gnail.com': 'gmail.com', 'gmaill.com': 'gmail.com', 'yahooo.com': 'yahoo.com',
    'yaho.com': 'yahoo.com', 'outllook.com': 'outlook.com', 'outlok.com': 'outlook.com',
  };
  if (commonTypos[domain]) return `Did you mean ...@${commonTypos[domain]}?`;
  return '';
};

// Returns { score: 0-4, label, color, checks }
const analysePassword = (password) => {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
  };
  const score = Object.values(checks).filter(Boolean).length;
  const labels = ['', 'Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
  const colors = ['', '#ef4444', '#f97316', '#eab308', '#34d399', '#10b981'];
  return { score, label: labels[score], color: colors[score], checks };
};

const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  return '';
};

const validateConfirm = (password, confirm) => {
  if (!confirm) return 'Please confirm your password';
  if (password !== confirm) return 'Passwords do not match';
  return '';
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirm: '' });
  const [touched, setTouched] = useState({ name: false, email: false, password: false, confirm: false });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Derive errors on every render (no separate error state needed)
  const errors = {
    name: touched.name ? validateName(formData.name) : '',
    email: touched.email ? validateEmail(formData.email) : '',
    password: touched.password ? validatePassword(formData.password) : '',
    confirm: touched.confirm ? validateConfirm(formData.password, formData.confirm) : '',
  };

  const passwordStrength = analysePassword(formData.password);

  const handleChange = useCallback((field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  }, []);

  const handleBlur = useCallback((field) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  // Mark everything as touched and check
  const isFormValid = () => {
    const nameErr = validateName(formData.name);
    const emailErr = validateEmail(formData.email);
    const pwErr = validatePassword(formData.password);
    const cfErr = validateConfirm(formData.password, formData.confirm);
    // Allow "did you mean" warnings through but block hard errors
    const emailBlocking = emailErr && !emailErr.startsWith('Did you mean');
    return !nameErr && !emailBlocking && !pwErr && !cfErr;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Touch all fields to surface any hidden errors
    setTouched({ name: true, email: true, password: true, confirm: true });

    if (!isFormValid()) {
      toast.error('Please fix the errors before continuing.');
      return;
    }

    setLoading(true);
    try {
      const normalizedEmail = formData.email.toLowerCase().trim();
      const res = await signup(formData.name.trim(), normalizedEmail, formData.password);
      if (res) {
        toast.success('Account created successfully! Welcome to ArthVeda 🎉');
        navigate('/');
      }
    } catch (err) {
      console.error('Signup error:', err);
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        'Registration failed. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex">

      {/* ── Left Panel – Branding ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[var(--bg-primary)]">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[var(--accent)] rounded-full blur-[120px] opacity-10" />
        <div className="absolute bottom-1/3 left-1/4 w-72 h-72 bg-[var(--info)] rounded-full blur-[100px] opacity-10" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link to="/welcome" className="text-2xl font-extrabold text-[var(--accent)] tracking-tight">
            ArthVeda
          </Link>

          <div className="space-y-6 max-w-md">
            <h2 className="text-4xl font-extrabold text-white leading-tight">
              Start your journey to{' '}
              <span className="text-[var(--accent)]">financial clarity</span>.
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed">
              Join thousands of users who trust ArthVeda for smarter money management. Free to get started.
            </p>

            {/* Feature pills */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              {[
                { label: 'AI Insights', icon: '🤖' },
                { label: 'Smart Charts', icon: '📊' },
                { label: 'Secure', icon: '🔒' },
              ].map((f) => (
                <div key={f.label} className="text-center space-y-1.5">
                  <div className="text-2xl">{f.icon}</div>
                  <div className="text-xs text-gray-600 font-medium">{f.label}</div>
                </div>
              ))}
            </div>

            {/* Password rules reminder */}
            <div className="mt-6 p-4 rounded-xl border border-gray-800 bg-white/[0.02] space-y-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Password Tips</p>
              {[
                '8+ characters recommended',
                'Mix uppercase & lowercase',
                'Add numbers & symbols for strength',
              ].map((tip) => (
                <p key={tip} className="text-xs text-gray-600 flex items-start gap-2">
                  <span className="text-[#34d399] mt-0.5">✓</span> {tip}
                </p>
              ))}
            </div>
          </div>

          <p className="text-gray-700 text-xs">© {new Date().getFullYear()} ArthVeda</p>
        </div>
      </div>

      {/* ── Right Panel – Form ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-[var(--bg-secondary)]">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <Link to="/welcome" className="lg:hidden text-2xl font-extrabold text-[var(--accent)] tracking-tight block mb-10">
            ArthVeda
          </Link>

          <div className="space-y-2 mb-8">
            <h1 className="text-3xl font-bold text-white tracking-tight">Create your account</h1>
            <p className="text-gray-500">Start managing your finances in under a minute</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">

            {/* Full Name */}
            <Field
              label="Full Name"
              error={errors.name}
            >
              <input
                id="signup-name"
                type="text"
                required
                autoComplete="name"
                placeholder="Ritesh Vishwakarma"
                value={formData.name}
                onChange={handleChange('name')}
                onBlur={handleBlur('name')}
                className={inputClass(errors.name)}
              />
            </Field>

            {/* Email */}
            <Field
              label="Email"
              error={errors.email}
              isWarning={errors.email?.startsWith('Did you mean')}
            >
              <input
                id="signup-email"
                type="email"
                required
                autoComplete="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange('email')}
                onBlur={handleBlur('email')}
                className={inputClass(errors.email && !errors.email.startsWith('Did you mean') ? errors.email : '')}
              />
            </Field>

            {/* Password */}
            <Field label="Password" error={errors.password}>
              <div className="relative">
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange('password')}
                  onBlur={handleBlur('password')}
                  className={`${inputClass(errors.password)} pr-10`}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-0 bottom-3 text-gray-500 hover:text-gray-300 transition-colors text-xs"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>

              {/* Strength meter – show whenever user has typed something */}
              {formData.password.length > 0 && (
                <div className="mt-2 space-y-1.5">
                  {/* Bar */}
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="h-1 flex-1 rounded-full transition-all duration-300"
                        style={{
                          backgroundColor: i <= passwordStrength.score ? passwordStrength.color : '#1f2937',
                        }}
                      />
                    ))}
                  </div>
                  {/* Label + checks */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium" style={{ color: passwordStrength.color }}>
                      {passwordStrength.label}
                    </span>
                    <div className="flex gap-2">
                      {Object.entries(passwordStrength.checks).map(([key, ok]) => (
                        <CheckDot key={key} ok={ok} label={key} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </Field>

            {/* Confirm Password */}
            <Field label="Confirm Password" error={errors.confirm}>
              <div className="relative">
                <input
                  id="signup-confirm"
                  type={showConfirm ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={formData.confirm}
                  onChange={handleChange('confirm')}
                  onBlur={handleBlur('confirm')}
                  className={`${inputClass(errors.confirm)} pr-10`}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-0 bottom-3 text-gray-500 hover:text-gray-300 transition-colors text-xs"
                >
                  {showConfirm ? 'Hide' : 'Show'}
                </button>
              </div>
              {/* Match indicator */}
              {formData.confirm.length > 0 && !errors.confirm && (
                <p className="text-xs mt-1 text-[var(--success)] flex items-center gap-1">
                  <span>✓</span> Passwords match
                </p>
              )}
            </Field>

            {/* Submit */}
            <button
              type="submit"
              id="signup-submit"
              disabled={loading}
              className="w-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--bg-primary)] font-bold py-3 rounded-xl transition-all duration-200 text-sm mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Creating account…
                </span>
              ) : (
                'Create Account →'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-[var(--text-secondary)] mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-[var(--accent)] hover:text-[var(--accent-hover)] font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function inputClass(hasError) {
  return `w-full bg-transparent border-b pb-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none transition-colors text-[15px] ${
    hasError ? 'border-[var(--danger)]' : 'border-[var(--border-secondary)] focus:border-[var(--accent)]'
  }`;
}

function Field({ label, error, isWarning = false, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-gray-400 block">{label}</label>
      {children}
      {error && (
        <p className={`text-xs mt-1 ${isWarning ? 'text-yellow-400' : 'text-red-400'}`}>
          {error}
        </p>
      )}
    </div>
  );
}

const CHECK_LABELS = {
  length: '8+',
  uppercase: 'A',
  lowercase: 'a',
  number: '1',
  special: '#',
};

function CheckDot({ ok, label }) {
  return (
    <span
      title={label}
      className={`text-[10px] font-bold px-1 rounded transition-colors ${
        ok ? 'text-[var(--success)]' : 'text-[var(--border-secondary)]'
      }`}
    >
      {CHECK_LABELS[label]}
    </span>
  );
}