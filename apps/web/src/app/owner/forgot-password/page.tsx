'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to send reset link');
      
      setSent(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      {!sent ? (
        <>
          <Link href="/owner/login" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-orange-500 transition-colors mb-8">
            <ArrowLeft size={16} /> Back to Login
          </Link>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">Forget Password</h1>
          
          <p className="text-[15px] text-gray-600 font-medium mb-8 pr-4">
            Please enter your email address below you will receive a verification link
          </p>
          
          {error && <div className="mb-4 text-red-500 text-sm font-medium">{error}</div>}

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
          className="flex flex-col text-left pt-8"
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Password Reset Email Sent</h1>
          
          <p className="text-[15px] text-gray-600 font-medium mb-8">
            We have sent a verification link to your email <br/>
            <span className="text-green-500 font-semibold mt-1 inline-block">{email}</span>
          </p>
          
          <p className="text-[14px] text-gray-800 font-medium mb-8">
            Click on the link in your mail box & all done.
          </p>

          <div className="space-y-3">
            <Link 
              href="/owner/login"
              className="w-full flex items-center justify-center bg-[#F97316] text-white rounded-xl py-3.5 font-semibold text-[15px] hover:bg-orange-600 transition-all shadow-[0_4px_14px_rgba(249,115,22,0.3)]"
            >
              Back To Login
            </Link>
            
            <button 
              onClick={() => {
                setSent(false);
                setEmail('');
              }}
              className="w-full bg-gray-100 text-gray-500 rounded-xl py-3.5 font-semibold text-[15px] hover:bg-gray-200 transition-all"
            >
              Resend Link
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
