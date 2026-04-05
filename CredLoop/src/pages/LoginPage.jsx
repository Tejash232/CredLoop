import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const DEMO_ACCOUNTS = [
  { email: 'tejash.25002338@kiet.edu',  name: 'Tejash',  role: 'CSE · 1st Year' },
  { email: 'yash.25002338@kiet.edu',    name: 'Yash',    role: 'CSE · 1st Year' },
  { email: 'yash.25002377@kiet.edu',    name: 'Yash',    role: 'CSE · 1st Year' },
  { email: 'shreya.25002313@kiet.edu',  name: 'Shreya',  role: 'CSE · 1st Year' },
];

const DEMO_PASSWORDS = {
  'tejash.25002338@kiet.edu':  'tejash@123',
  'yash.25002338@kiet.edu':    'yash@123',
  'yash.25002377@kiet.edu':    'yash@123',
  'shreya.25002313@kiet.edu':  'shreya@123',
};

export default function LoginPage() {
  const { login, showNotif } = useApp();
  const navigate = useNavigate();
  const [email,   setEmail]   = useState('');
  const [pass,    setPass]    = useState('');
  const [loading, setLoading] = useState(false);
  const [tab,     setTab]     = useState('login');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const ok = login(email, pass);
    if (ok) navigate('/');
    else showNotif('Invalid credentials. Use your @kiet.edu email.', 'error');
    setLoading(false);
  };

  const quickLogin = (demoEmail) => {
    setEmail(demoEmail);
    setPass(DEMO_PASSWORDS[demoEmail] || 'demo123');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden" style={{background:"#0d0d14"}}>
      {/* Background glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-60 -right-20 w-[500px] h-[500px] rounded-full blur-3xl" style={{background:"radial-gradient(circle, rgba(108,60,220,0.2) 0%, transparent 70%)"}} />
        <div className="absolute -bottom-60 -left-20 w-[500px] h-[500px] rounded-full blur-3xl" style={{background:"radial-gradient(circle, rgba(30,140,80,0.15) 0%, transparent 70%)"}} />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #f5f5f5 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-secondary rounded-2xl mb-4 red-glow">
            <span className="font-display text-white text-2xl leading-none font-bold">CL</span>
          </div>
          <h1 className="font-display text-5xl tracking-wide"><span className="text-brand-light">CRED</span><span className="text-brand-secondary">looP</span></h1>
          <p className="text-brand-muted text-sm mt-1">Student Micro-Economy · KIET</p>
          <div className="inline-flex items-center gap-2 bg-brand-secondary/10 border border-brand-secondary/20 px-3 py-1 rounded-full mt-2">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-secondary animate-pulse" />
            <span className="text-brand-secondary text-xs font-medium">@kiet.edu only</span>
          </div>
        </div>

        <div className="bg-brand-dark border border-brand-border rounded-2xl p-8 shadow-card-lg">
          {/* Tabs */}
          <div className="flex gap-1 bg-brand-surface p-1 rounded-xl mb-6">
            {['login', 'signup'].map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                  tab === t ? 'bg-brand-secondary text-white shadow-red-sm' : 'text-brand-muted hover:text-brand-light'
                }`}>
                {t === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="label">KIET Email</label>
              <input className="input" type="email" placeholder="rollno@kiet.edu"
                value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="label">Password</label>
              <input className="input" type="password" placeholder="••••••••"
                value={pass} onChange={e => setPass(e.target.value)} required />
              {tab === 'login' && (
                <p className="text-brand-muted text-xs mt-1.5">
                  Demo password: <span className="font-mono text-brand-secondary">demo123</span>
                </p>
              )}
            </div>
            {tab === 'signup' && (
              <p className="text-brand-muted text-xs bg-brand-surface p-3 rounded-xl border border-brand-border">
                Only <span className="text-brand-secondary">@kiet.edu</span> emails allowed. New students start with <span className="text-brand-secondary font-mono">100 credits</span>.
              </p>
            )}
            <button type="submit" disabled={loading}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2 mt-1">
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4" strokeDashoffset="10" />
                  </svg>Authenticating...
                </span>
              ) : tab === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Demo accounts */}
          <div className="mt-6 pt-5 border-t border-brand-border">
            <p className="text-brand-muted text-xs text-center mb-3">Quick demo access</p>
            <div className="flex flex-col gap-2">
              {DEMO_ACCOUNTS.map(acc => (
                <button key={acc.email} onClick={() => quickLogin(acc.email)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl border border-brand-border hover:border-brand-secondary/40 hover:bg-brand-surface transition-all group">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-brand-secondary text-white text-xs font-bold rounded-xl flex items-center justify-center">
                      {acc.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="text-left">
                      <p className="text-brand-light text-xs font-medium">{acc.name}</p>
                      <p className="text-brand-muted text-[10px]">{acc.role}</p>
                    </div>
                  </div>
                  <span className="text-brand-secondary text-xs opacity-0 group-hover:opacity-100 transition-opacity">Use →</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
