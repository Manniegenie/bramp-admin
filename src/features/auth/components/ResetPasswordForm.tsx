import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/core/store/store';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { resetPassword } from '../store/auth.slice';

export function ResetPasswordForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const typedDispatch = dispatch as AppDispatch;
      await typedDispatch(resetPassword({ email } as any)).unwrap();
      // Show success message and redirect
      navigate('/login');
    } catch (error) {
      console.error('Password reset request failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="pl-10 h-12 border border-gray-200 shadow-none dark:text-black"
          required
        />
      </div>
      <Button type="submit" className="w-full">
        Reset Password
      </Button>
    </form>
  );
}