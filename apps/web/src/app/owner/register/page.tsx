'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, KeyRound } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { registerOwner, verifyOwnerOTP } from '@/app/actions/auth';
import { signIn } from 'next-auth/react';

export default function OwnerRegister() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    const res = await registerOwner({ email, password });
    
    setLoading(false);

    if (res.error) {
      setError(res.error);
    } else {
      setStep(2); // Move to OTP verification
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await verifyOwnerOTP({ email, otp });
    
    if (res.error) {
      setError(res.error);
      setLoading(false);
    } else {
      // Sign them in automatically after verify
      await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      setLoading(false);
      router.push('/owner/dashboard');
    }
  };

  return (
    <div className="w-full relative min-h-[400px]">
      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div 
            key="register-step"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Registration</h1>
            {error && <p className="text-red-500 text-sm mb-4 mt-2">{error}</p>}
            
            <form onSubmit={handleRegister} className="space-y-5 mt-6">
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
                    minLength={8}
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
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-[15px] text-gray-900 placeholder:text-gray-400"
                    placeholder="Confirm Password"
                    minLength={8}
                    required
                  />
                </div>
              </div>

              <div className="pt-2 pb-2">
                <p className="text-[13px] text-gray-600 font-medium leading-relaxed">
                  By signing below, you agree to the <Link href="#" className="text-orange-500 hover:text-orange-600">Terms of use</Link> and <Link href="#" className="text-orange-500 hover:text-orange-600">privacy notice</Link>
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || !email || !password || password !== confirmPassword}
                className="w-full bg-[#F97316] text-white rounded-xl py-3.5 font-semibold text-[15px] hover:bg-orange-600 transition-all disabled:opacity-60 disabled:hover:bg-[#F97316] shadow-[0_4px_14px_rgba(249,115,22,0.3)]"
              >
                {loading ? 'Sending OTP...' : 'Sign Up'}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-[15px] text-gray-600 font-medium">
                Already have an account? <Link href="/owner/login" className="text-orange-500 font-semibold hover:text-orange-600">Login</Link>
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="verify-step"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Email</h1>
            <p className="text-[15px] text-gray-600 font-medium mb-6">
              We've sent a 6-digit code to <strong>{email}</strong>
            </p>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <form onSubmit={handleVerify} className="space-y-5">
              <div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500">
                    <KeyRound size={18} strokeWidth={2.5} />
                  </span>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    maxLength={6}
                    className="w-full bg-white border border-gray-200 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-center tracking-[0.5em] text-[18px] font-bold text-gray-900 placeholder:text-gray-300 placeholder:font-normal placeholder:tracking-normal"
                    placeholder="Enter 6-digit code"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length < 6}
                className="w-full bg-[#F97316] text-white rounded-xl py-3.5 font-semibold text-[15px] hover:bg-orange-600 transition-all disabled:opacity-60 disabled:hover:bg-[#F97316] shadow-[0_4px_14px_rgba(249,115,22,0.3)] mt-4"
              >
                {loading ? 'Verifying...' : 'Verify & Login'}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
