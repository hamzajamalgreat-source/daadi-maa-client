import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, User } from 'lucide-react';
import useAuthStore from '../store/authStore';

export default function AdminLogin() {
  const { login, isAuthenticated, isLoading, error, clearError } = useAuthStore();
  const navigate  = useNavigate();
  const location  = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [localErr, setLocalErr] = useState('');

  const from = location.state?.from?.pathname || '/admin';

  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true });
  }, [isAuthenticated, navigate, from]);

  useEffect(() => {
    if (error) setLocalErr(error);
  }, [error]);

  const handleChange = setter => e => {
    setter(e.target.value);
    setLocalErr('');
    clearError();
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!username.trim()) { setLocalErr('Username is required.'); return; }
    if (!password)        { setLocalErr('Password is required.'); return; }
    const ok = await login(username.trim(), password);
    if (ok) navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2D1810] via-[#3D2010] to-[#1A0A05]
                    flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10
                            flex items-center justify-center mx-auto shadow-2xl">
              <img src="/daadi-maa-logo.png" alt="Daadi Maa"
                className="w-16 h-16 object-contain"
                style={{ mixBlendMode: 'screen' }} />
            </div>
          </div>
          <h1 className="text-2xl font-serif font-bold text-white">Admin Portal</h1>
          <p className="text-white/50 text-sm mt-1">Daadi Maa Spices · F & J Sons Foods</p>
        </div>

        {/* Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
          <h2 className="font-semibold text-gray-700 text-center mb-6">Sign in to continue</h2>

          <form onSubmit={handleSubmit} noValidate aria-label="Admin login">
            {localErr && (
              <div role="alert"
                   className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl
                              px-4 py-3 mb-5 flex items-center gap-2">
                <span className="font-bold">!</span> {localErr}
              </div>
            )}

            <div className="mb-4">
              <label htmlFor="username" className="form-label">Username</label>
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input id="username" type="text" value={username}
                  onChange={handleChange(setUsername)}
                  placeholder="admin" autoComplete="username" autoFocus
                  className="form-input pl-9" />
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="form-label">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input id="password" type={showPass ? 'text' : 'password'} value={password}
                  onChange={handleChange(setPassword)}
                  placeholder="••••••••" autoComplete="current-password"
                  className="form-input pl-9 pr-10" />
                <button type="button" onClick={() => setShowPass(v => !v)}
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary w-full py-3">
              {isLoading ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in…</>
              ) : 'Sign In'}
            </button>
          </form>
        </div>

        <div className="text-center mt-4">
          <Link to="/" className="text-white/40 hover:text-white/70 text-xs transition-colors">
            ← Back to Store
          </Link>
        </div>
      </div>
    </div>
  );
}
