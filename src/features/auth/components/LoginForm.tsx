import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { login } from '../store/auth.slice';
import type { AppDispatch } from '@/core/store/store';

export function LoginForm() {
  const dispatch = useDispatch<AppDispatch>();
  const error = useSelector((state: any) => state.auth.error);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    passwordPin: '',
    twoFAToken: '',
  });
  const [loading, setLoading] = useState(false);
  const [requires2FA, setRequires2FA] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload: any = { email: formData.email, passwordPin: formData.passwordPin };
      if (requires2FA && formData.twoFAToken) {
        payload.twoFAToken = formData.twoFAToken;
      }
      const result = await dispatch(login(payload)).unwrap();

      if (result.requires2FASetup) {
        navigate(`/admin-2fa-setup?email=${encodeURIComponent(formData.email)}&fromLogin=true`);
      } else if (result.requires2FA) {
        setRequires2FA(true);
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && (
        <div className="text-red-600 text-sm mb-2 text-center">{error}</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="pl-10 h-12 border border-gray-200 shadow-none dark:text-black"
              required
              disabled={requires2FA}
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              type={showPassword ? 'text' : 'password'}
              name="passwordPin"
              placeholder="Password"
              value={formData.passwordPin}
              onChange={handleChange}
              className="pl-10 h-12 border border-gray-200 shadow-none dark:text-black"
              required
              disabled={requires2FA}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 top-1/2 px-2 -translate-y-1/2 bg-transparent focus:outline-none"
            >
              {showPassword ? (
                <EyeOff className="h-3 w-3 text-gray-500" />
              ) : (
                <Eye className="h-3 w-3 text-gray-500" />
              )}
            </button>
          </div>

          {requires2FA && (
            <div className="relative">
              <ShieldCheck className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                type="text"
                name="twoFAToken"
                placeholder="6-digit authenticator code"
                value={formData.twoFAToken}
                onChange={handleChange}
                className="pl-10 h-12 border border-gray-200 shadow-none dark:text-black text-center tracking-widest font-mono"
                maxLength={6}
                inputMode="numeric"
                autoFocus
                required
              />
            </div>
          )}
        </div>

        {requires2FA && (
          <p className="text-sm text-blue-600 text-center">
            Enter the 6-digit code from your authenticator app
          </p>
        )}

        <Button type="submit" className="w-full h-12 bg-[#027338] hover:bg-green-700 focus:ring-2 focus:ring-green-400 text-white" disabled={loading}>
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              {requires2FA ? 'Verifying...' : 'Signing In...'}
            </span>
          ) : (
            requires2FA ? 'Verify & Sign In' : 'Sign In'
          )}
        </Button>

        {requires2FA && (
          <button
            type="button"
            onClick={() => { setRequires2FA(false); setFormData(p => ({ ...p, twoFAToken: '' })); }}
            className="w-full text-sm text-gray-500 hover:text-gray-700 text-center"
          >
            ← Back
          </button>
        )}
      </form>
    </>
  );
}
