import { useState } from 'react';
import { supabase } from '../lib/supabase';
import {
  GraduationCap, User, Lock, Eye, EyeOff,
  AlertCircle, Loader2, CheckCircle2, ShieldAlert, X,
} from 'lucide-react';

function DisclaimerModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="modal-backdrop">
      <div
        className="w-full max-w-sm fade-up"
        style={{ background: '#12151f', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, overflow: 'hidden' }}
      >
        {/* Header */}
        <div style={{ background: 'rgba(251,191,36,0.08)', borderBottom: '1px solid rgba(251,191,36,0.12)', padding: '18px 22px' }}>
          <div className="flex items-center gap-3">
            <div style={{ background: 'rgba(251,191,36,0.15)', borderRadius: 10, padding: 8 }}>
              <ShieldAlert className="w-5 h-5" style={{ color: '#fbbf24' }} />
            </div>
            <h2 className="font-bold text-white text-lg">Disclaimer</h2>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '22px 22px 10px' }}>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: '#a0a8c0' }}>
            The data presented in this dashboard is for <span className="text-white font-medium">informational purposes only</span>. It may not fully represent the official placement statistics.
          </p>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: '#a0a8c0', marginTop: 12 }}>
            Please verify with the <span className="text-white font-medium">placement cell</span> for accurate and up-to-date details. Figures may vary based on the academic batch and reporting period.
          </p>

          <div style={{ background: 'rgba(56,189,248,0.06)', border: '1px solid rgba(56,189,248,0.12)', borderRadius: 10, padding: '12px 14px', marginTop: 16 }}>
            <p style={{ fontSize: 12, color: '#60a5fa' }}>
              Data covers VIT Vellore 2025-26 placement season. Last updated: July 2026.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 22px 22px', display: 'flex', gap: 10 }}>
          <button
            onClick={onClose}
            className="btn-primary flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            I Understand, Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  const validateForm = () => {
    if (!username || !password) { setError('Please fill in all fields'); return false; }
    if (username.length < 3) { setError('Username must be at least 3 characters'); return false; }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) { setError('Username: letters, numbers, underscores only'); return false; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return false; }
    if (!isLogin && password !== confirmPassword) { setError('Passwords do not match'); return false; }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setMessage(null);
    if (!validateForm()) return;
    setLoading(true);

    try {
      const email = `${username.toLowerCase()}@placementtracker.local`;

      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) setError('Invalid username or password. Please try again.');
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) {
          setError(error.message.includes('already registered')
            ? 'This username is already taken. Please choose another.'
            : error.message);
        } else if (data.user) {
          await supabase.from('app_users').insert({ id: data.user.id, username: username.toLowerCase() });
          setMessage('Account created! You are now logged in.');
        }
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex"
      style={{ background: 'var(--bg-base)' }}
    >
      {showDisclaimer && <DisclaimerModal onClose={() => setShowDisclaimer(false)} />}

      {/* Left Panel — Branding */}
      <div
        className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #0d1117 0%, #0a1628 60%, #051020 100%)' }}
      >
        {/* Background Glows */}
        <div style={{ position: 'absolute', top: -120, left: -120, width: 400, height: 400, background: 'rgba(56,189,248,0.06)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -80, right: -80, width: 300, height: 300, background: 'rgba(99,102,241,0.06)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div style={{ background: 'rgba(56,189,248,0.12)', borderRadius: 12, padding: 10 }}>
              <GraduationCap className="w-7 h-7" style={{ color: '#38bdf8' }} />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">Placement Tracker</span>
          </div>

          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            VIT Vellore<br />
            <span style={{ color: '#38bdf8' }}>2026 Placements</span>
          </h1>
          <p style={{ color: '#6b7191', fontSize: 15, lineHeight: 1.7 }}>
            Explore comprehensive placement statistics, company packages, branch-wise analytics, and internship stipends.
          </p>

          <div className="mt-12 space-y-4">
            {[
              { label: '145', sub: 'Companies Visited', color: '#38bdf8' },
              { label: '3,200+', sub: 'Total Offers', color: '#34d399' },
              { label: '₹1.2L/mo', sub: 'Highest Stipend', color: '#fbbf24' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-4">
                <span className="text-2xl font-bold" style={{ color: item.color, minWidth: 80 }}>{item.label}</span>
                <span style={{ color: '#6b7191', fontSize: 13 }}>{item.sub}</span>
              </div>
            ))}
          </div>
        </div>

        <p style={{ color: '#2a2f45', fontSize: 12, position: 'relative', zIndex: 10 }}>
          For informational purposes only. Verify with placement cell.
        </p>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        {/* Mobile logo */}
        <div className="flex lg:hidden items-center gap-3 mb-10">
          <div style={{ background: 'rgba(56,189,248,0.12)', borderRadius: 10, padding: 8 }}>
            <GraduationCap className="w-6 h-6" style={{ color: '#38bdf8' }} />
          </div>
          <span className="text-white font-bold text-lg">Placement Tracker</span>
        </div>

        <div className="w-full max-w-sm fade-up">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-1">
              {isLogin ? 'Welcome back' : 'Create account'}
            </h2>
            <p style={{ color: '#6b7191', fontSize: 14 }}>
              {isLogin ? 'Sign in to access your dashboard' : 'Get started with Placement Tracker'}
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="tab-bar mb-6">
            <div
              className={`tab-item${isLogin ? ' active' : ''}`}
              onClick={() => { setIsLogin(true); setError(null); setMessage(null); }}
            >Login</div>
            <div
              className={`tab-item${!isLogin ? ' active' : ''}`}
              onClick={() => { setIsLogin(false); setError(null); setMessage(null); }}
            >Sign Up</div>
          </div>

          {/* Alerts */}
          {error && (
            <div className="flex items-start gap-3 mb-4" style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.15)', borderRadius: 10, padding: '12px 14px' }}>
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#f87171' }} />
              <p style={{ fontSize: 13, color: '#fca5a5' }}>{error}</p>
            </div>
          )}
          {message && (
            <div className="flex items-start gap-3 mb-4" style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.15)', borderRadius: 10, padding: '12px 14px' }}>
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#34d399' }} />
              <p style={{ fontSize: 13, color: '#6ee7b7' }}>{message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, color: '#8892aa', display: 'block', marginBottom: 6 }}>Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#4a5168' }} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="your_username"
                  className="field field-icon"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, color: '#8892aa', display: 'block', marginBottom: 6 }}>Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#4a5168' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="field field-icon"
                  style={{ paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword
                    ? <EyeOff className="w-4 h-4" style={{ color: '#4a5168' }} />
                    : <Eye className="w-4 h-4" style={{ color: '#4a5168' }} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            {!isLogin && (
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, color: '#8892aa', display: 'block', marginBottom: 6 }}>Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#4a5168' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="field field-icon"
                  />
                </div>
              </div>
            )}

            <div className="pt-1">
              <button type="submit" disabled={loading} className="btn-primary flex items-center justify-center gap-2">
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" />{isLogin ? 'Signing in...' : 'Creating account...'}</>
                ) : isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </div>
          </form>

          <p className="text-center mt-5" style={{ fontSize: 13, color: '#6b7191' }}>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => { setIsLogin(!isLogin); setError(null); setMessage(null); }}
              style={{ color: '#38bdf8', fontWeight: 600 }}
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </p>

          <button
            onClick={() => setShowDisclaimer(true)}
            className="flex items-center gap-2 mx-auto mt-6"
            style={{ fontSize: 12, color: '#3d4260' }}
          >
            <ShieldAlert className="w-3 h-3" />
            View Disclaimer
          </button>
        </div>
      </div>
    </div>
  );
}
