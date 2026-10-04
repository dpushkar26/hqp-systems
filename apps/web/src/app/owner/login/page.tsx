'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { signIn } from 'next-auth/react';

export default function OwnerLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    setLoading(false);

    if (result?.error) {
      setError('Invalid email or password');
    } else {
      router.push('/owner/dashboard');
    }
  };

  const handleGoogleLogin = () => {
    signIn('google', { callbackUrl: '/owner/dashboard' });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h1>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      
      <form onSubmit={handleLogin} className="space-y-5 mt-6">
        <div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500">
              <Mail size={18} strokeWidth={2.5} />
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-[15px] text-gray-900 placeholder:text-gray-400"
              placeholder="Email Address"
              required
            />
          </div>
        </div>

        <div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500">
              <Lock size={18} strokeWidth={2.5} />
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-[15px] text-gray-900 placeholder:text-gray-400"
              placeholder="Password"
              required
            />
          </div>
          <div className="flex justify-end mt-2">
            <Link href="/owner/forgot-password" className="text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors">
              Forget Password?
            </Link>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !email || !password}
          className="w-full bg-[#F97316] text-white rounded-xl py-3.5 font-semibold text-[15px] hover:bg-orange-600 transition-all disabled:opacity-60 disabled:hover:bg-[#F97316] mt-4 shadow-[0_4px_14px_rgba(249,115,22,0.3)]"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div className="my-8 flex items-center justify-center space-x-4">
        <div className="h-px bg-gray-200 flex-1"></div>
        <span className="text-gray-400 text-sm font-medium">Or</span>
        <div className="h-px bg-gray-200 flex-1"></div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button onClick={handleGoogleLogin} type="button" className="flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-3 hover:bg-gray-50 transition-colors">
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
          <span className="text-[14px] font-semibold text-gray-700">Google</span>
        </button>
        <button type="button" className="flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-3 hover:bg-gray-50 transition-colors">
          <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" className="w-5 h-5" alt="Facebook" />
          <span className="text-[14px] font-semibold text-gray-700">Facebook</span>
        </button>
      </div>

      <div className="mt-8 text-center">
        <p className="text-[15px] text-gray-600 font-medium">
          Don't have an account? <Link href="/owner/register" className="text-orange-500 font-semibold hover:text-orange-600">Sign Up</Link>
        </p>
      </div>
    </motion.div>
  );
}
