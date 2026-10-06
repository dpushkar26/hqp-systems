'use client';

import { ShieldCheck } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function AuthPage() {
  const { hotelId } = useParams();
  const router = useRouter();
  
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpStep, setOtpStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [isVerifying, setIsVerifying] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) return;
    setIsVerifying(true);
    
    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: phone })
      });
      if (res.ok) {
        const data = await res.json();
        setOtpStep('OTP');
        if (data.devOtpCode) {
          setOtp(data.devOtpCode);
        }
      } else {
        alert('Failed to send OTP');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) return;
    setIsVerifying(true);
    
    try {
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otpCode: otp })
      });
      if (res.ok) {
        const data = await res.json();
        
        if (data.visitCount === 5) {
          setShowConfetti(true);
          // Auto redirect after 4 seconds of confetti
          setTimeout(() => router.push(`/${hotelId}/cart`), 4000);
        } else {
          router.push(`/${hotelId}/cart`);
        }
      } else {
        alert('Invalid OTP');
        setIsVerifying(false);
      }
    } catch (err) {
      console.error(err);
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex flex-col items-center justify-center p-6 font-sans selection:bg-gray-200">
      <div
        className="w-full max-w-md bg-white rounded-3xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500"
      >
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-6 border border-green-100 mx-auto">
          <ShieldCheck className="text-green-600 w-8 h-8" strokeWidth={1.5} />
        </div>
        <h2 className="text-3xl font-serif text-gray-900 tracking-tight mb-2 text-center">Secure your table</h2>
        <p className="text-gray-500 font-light text-sm mb-8 leading-relaxed text-center">
          Please verify your number to access the digital menu.
          <span className="font-medium text-gray-900 block mt-1">This connects you to your specific table.</span>
        </p>

        {otpStep === 'PHONE' ? (
          <form onSubmit={handlePhoneSubmit} className="space-y-6">
            <div>
              <label className="text-[10px] text-gray-400 font-medium uppercase tracking-widest mb-2 block">Phone Number</label>
              <div className="flex bg-gray-50 border border-gray-200 rounded-xl overflow-hidden focus-within:border-gray-900 focus-within:bg-white transition-colors">
                <span className="px-4 py-4 border-r border-gray-200 text-gray-500 font-medium text-sm">+91</span>
                <input
                  type="tel"
                  autoFocus
                  maxLength={10}
                  placeholder="99999 99999"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  className="w-full p-4 outline-none bg-transparent text-gray-900 font-medium tracking-wider"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={phone.length < 10 || isVerifying}
              className="w-full bg-gray-900 text-white rounded-xl p-4 text-sm font-medium flex justify-center items-center hover:bg-[#9ca986] transition-colors disabled:opacity-50"
            >
              {isVerifying ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Continue to Menu'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="space-y-6">
            <div>
              <label className="text-[10px] text-gray-400 font-medium uppercase tracking-widest mb-2 flex justify-between">
                <span>Enter 4-digit code</span>
                <button type="button" onClick={() => setOtpStep('PHONE')} className="text-gray-900 underline">Change Number</button>
              </label>
              <input
                type="text"
                autoFocus
                maxLength={4}
                placeholder="••••"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="w-full p-4 text-center text-3xl tracking-[1em] outline-none border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-gray-900 transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={otp.length < 4 || isVerifying}
              className="w-full bg-gray-900 text-white rounded-xl p-4 text-sm font-medium flex justify-center items-center hover:bg-[#9ca986] transition-colors disabled:opacity-50"
            >
              {isVerifying ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Verify & Open Menu'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
