import { useState } from 'react';
import { GraduationCap, User, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

interface AuthPageProps {
  onLogin: () => void;
}

export function AuthPage({ onLogin }: AuthPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }

    // Direct Credential Check
    if (username === 'Nithesh' && password === 'Agile@123') {
      onLogin(); // Triggers navigation/state change to Dashboard
    } else {
      setError('Invalid username or password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-base)' }}>
      {/* Left Panel — Branding */}
      <div
        className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #0d1117 0%, #0a1628 60%, #051020 100%)' }}
      >
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
        <div className="flex lg:hidden items-center gap-3 mb-10">
          <div style={{ background: 'rgba(56,189,248,0.12)', borderRadius: 10, padding: 8 }}>
            <GraduationCap className="w-6 h-6" style={{ color: '#38bdf8' }} />
          </div>
          <span className="text-white font-bold text-lg">Placement Tracker</span>
        </div>

        <div className="w-full max-w-sm fade-up">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-1">Welcome back</h2>
            <p style={{ color: '#6b7191', fontSize: 14 }}>Sign in to access your dashboard</p>
          </div>

          {error && (
            <div className="flex items-start gap-3 mb-4" style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.15)', borderRadius: 10, padding: '12px 14px' }}>
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#f87171' }} />
              <p style={{ fontSize: 13, color: '#fca5a5' }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, color: '#8892aa', display: 'block', marginBottom: 6 }}>Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#4a5168' }} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="field field-icon"
                />
              </div>
            </div>

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

            <div className="pt-2">
              <button type="submit" className="btn-primary flex items-center justify-center gap-2">
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
