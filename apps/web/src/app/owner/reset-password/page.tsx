'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!token) {
    return <div className="text-center text-red-500 font-bold p-8">Invalid or missing token.</div>;
  }

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to reset password');
      
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full flex flex-col items-center text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Password Changed</h1>
        <p className="text-[15px] text-gray-600 font-medium mb-10 max-w-sm">
          Your password has been successfully updated. You can now use your new password to log in.
        </p>
        
        <Link 
          href="/owner/login"
          className="w-full bg-[#F97316] text-white rounded-xl py-3.5 font-semibold hover:bg-orange-600 transition-all shadow-[0_4px_14px_rgba(249,115,22,0.3)] block"
        >
          Back To Login
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Reset Password</h1>
      
      {error && <div className="mb-4 text-red-500 text-sm font-medium">{error}</div>}
      
      <form onSubmit={handleReset} className="space-y-5">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500">
            <Lock size={18} strokeWidth={2.5} />
          </span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-[15px] placeholder:text-gray-400"
            placeholder="New Password"
            required
            minLength={6}
          />
        </div>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500">
            <Lock size={18} strokeWidth={2.5} />
          </span>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-[15px] placeholder:text-gray-400"
            placeholder="Confirm Password"
            required
            minLength={6}
          />
        </div>

        <button
          type="submit"
          disabled={loading || !password || !confirmPassword}
          className="w-full bg-[#F97316] text-white rounded-xl py-3.5 mt-2 font-semibold hover:bg-orange-600 transition-all shadow-[0_4px_14px_rgba(249,115,22,0.3)] disabled:opacity-60"
        >
          {loading ? 'Changing...' : 'Change Password'}
        </button>
      </form>
    </motion.div>
  );
}

export default function ResetPassword() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
