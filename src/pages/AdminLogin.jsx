import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, User } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { motion } from "motion/react";

export default function AdminLogin() {
  const { login, isAuthenticated, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [localErr, setLocalErr] = useState('');
  const from = location.state?.from?.pathname || '/admin';

  useEffect(() => { if (isAuthenticated) navigate(from, { replace: true }); }, [isAuthenticated, navigate, from]);
  useEffect(() => { if (error) setLocalErr(error); }, [error]);

  const handleChange = setter => e => { setter(e.target.value); setLocalErr(''); clearError(); };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!username.trim()) { setLocalErr('Username is required.'); return; }
    if (!password)        { setLocalErr('Password is required.'); return; }
    const ok = await login(username.trim(), password);
    if (ok) navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#23120B', backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(217,119,6,0.08) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(139,30,23,0.15) 0%, transparent 60%)' }}>
      <div className="w-full max-w-sm">

        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4 shadow-2xl mx-auto" style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.12)' }}>
            <img src="/daadi-maa-logo.png" alt="Daadi Maa" className="w-14 h-14 object-contain" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-white">Admin Portal</h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>Daadi Maa Spices · F & J Sons Foods</p>
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl shadow-2xl p-8" style={{ background: 'rgba(255,255,255,0.97)' }}>
          <h2 className="font-serif font-semibold text-center mb-6" style={{ color: '#23120B' }}>Sign in to continue</h2>

          <form onSubmit={handleSubmit} noValidate>
            {localErr && (
              <div role="alert" className="rounded-xl px-4 py-3 mb-5 text-sm flex items-center gap-2" style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#DC2626' }}>
                <span className="font-bold">!</span> {localErr}
              </div>
            )}

            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium mb-1.5" style={{ color: '#23120B' }}>Username</label>
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#7C6B5E' }} />
                <input id="username" type="text" value={username} onChange={handleChange(setUsername)}
                  placeholder="admin" autoComplete="username" autoFocus
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all"
                  style={{ borderColor: '#EFE8DF', '--tw-ring-color': '#8B1E17' }} />
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium mb-1.5" style={{ color: '#23120B' }}>Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#7C6B5E' }} />
                <input id="password" type={showPass ? 'text' : 'password'} value={password} onChange={handleChange(setPassword)}
                  placeholder="••••••••" autoComplete="current-password"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all"
                  style={{ borderColor: '#EFE8DF' }} />
                <button type="button" onClick={() => setShowPass(v => !v)} aria-label={showPass ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors" style={{ color: '#7C6B5E' }}>
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit" disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white transition-all active:scale-[0.98] disabled:opacity-60"
              style={{ background: '#8B1E17' }}>
              {isLoading
                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in…</>
                : 'Sign In'}
            </motion.button>
          </form>
        </motion.div>
        <div className="text-center mt-5">
          <Link to="/" className="text-xs transition-colors" style={{ color: 'rgba(255,255,255,0.35)' }}
            onMouseEnter={e => e.target.style.color = 'rgba(255,255,255,0.65)'}
            onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.35)'}>
            ← Back to Store
          </Link>
        </div>
      </div>
    </div>
  );
}
