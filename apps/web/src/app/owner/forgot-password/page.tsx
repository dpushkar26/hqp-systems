'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <Link href="/owner/login" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-orange-500 transition-colors mb-8">
        <ArrowLeft size={16} /> Back to Login
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Forget Password</h1>
      
      {!sent ? (
        <>
          <p className="text-[15px] text-gray-600 font-medium mb-8 pr-4">
            Please enter your email address below you will receive a verification link
          </p>
          
          <form onSubmit={handleReset} className="space-y-6">
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

            <button
              type="submit"
              disabled={loading || !email}
              className="w-full bg-[#F97316] text-white rounded-xl py-3.5 font-semibold text-[15px] hover:bg-orange-600 transition-all disabled:opacity-60 disabled:hover:bg-[#F97316] shadow-[0_4px_14px_rgba(249,115,22,0.3)]"
            >
              {loading ? 'Sending...' : 'Continue'}
            </button>
          </form>
        </>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-orange-50 border border-orange-100 rounded-2xl p-6 text-center"
        >
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-500">
            <Mail size={24} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Check your email</h3>
          <p className="text-[14px] text-gray-600 font-medium mb-4">
            We've sent a password reset link to <strong>{email}</strong>
          </p>
          <button 
            onClick={() => setSent(false)}
            className="text-sm font-semibold text-orange-500 hover:text-orange-600"
          >
            Try another email
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
