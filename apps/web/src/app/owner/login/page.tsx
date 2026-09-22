'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Building, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function OwnerLogin() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1000);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push('/owner/orders');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-[2rem] border border-gray-100 p-8 sm:p-12 w-full max-w-md relative z-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)]"
      >
        <div className="flex justify-center mb-10">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100">
            <Building className="w-6 h-6 text-gray-900" strokeWidth={1.5} />
          </div>
        </div>
        
        <div className="text-center mb-10 border-b border-gray-100 pb-8">
          <h1 className="font-serif text-3xl tracking-tight text-gray-900 mb-4">Area Portal</h1>
          <p className="text-gray-500 font-light text-sm max-w-[250px] mx-auto">
            {step === 1 ? 'Enter your mobile number to access your property dashboard.' : `Enter the 4-digit code sent to +91 ${phone}`}
          </p>
        </div>

        <div className="relative min-h-[220px]">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.form 
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSendOtp} 
                className="space-y-6"
              >
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-2">Mobile Number</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-mono text-sm">+91</span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-gray-50 border border-transparent rounded-xl py-4 pl-14 pr-4 outline-none focus:border-gray-900 focus:bg-white transition-all font-mono tracking-widest text-lg text-gray-900"
                      placeholder="9876543210"
                      maxLength={10}
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading || phone.length < 10}
                  className="w-full bg-gray-900 text-white rounded-full py-4 font-sans text-sm font-medium flex justify-center items-center gap-2 hover:bg-[#9ca986] transition-all disabled:opacity-60 mt-8"
                >
                  {loading ? 'Sending...' : 'Continue'} <ArrowRight className="w-4 h-4" />
                </button>
              </motion.form>
            ) : (
              <motion.form 
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleVerifyOtp} 
                className="space-y-6"
              >
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-2 flex flex-col gap-1">
                    Enter Verification Code
                    <span className="text-gray-400 font-sans tracking-normal normal-case">(Mock: 1234)</span>
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-gray-50 border border-transparent rounded-xl py-4 px-4 outline-none focus:border-gray-900 focus:bg-white text-center tracking-[1em] text-3xl font-serif transition-all text-gray-900"
                    placeholder="----"
                    maxLength={4}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || otp.length < 4}
                  className="w-full bg-gray-900 text-white rounded-full py-4 font-sans text-sm font-medium flex justify-center items-center gap-2 hover:bg-[#9ca986] transition-all disabled:opacity-60 mt-8"
                >
                  {loading ? 'Verifying...' : 'Verify & Login'} <CheckCircle2 className="w-4 h-4" />
                </button>
                <button 
                  type="button" 
                  onClick={() => setStep(1)} 
                  className="w-full text-xs text-gray-400 hover:text-gray-900 transition-colors mt-4"
                >
                  Change Mobile Number
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
