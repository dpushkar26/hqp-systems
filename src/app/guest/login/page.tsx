'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { ArrowRight, Utensils } from 'lucide-react';
import Link from 'next/link';

export default function GuestLogin() {
  const [hotelId, setHotelId] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (hotelId.trim()) {
      router.push(`/${hotelId.toLowerCase()}/menu`);
    }
  };

  return (
    <div className="min-h-screen flex font-sans bg-[#fcfcfc]">
      {/* Left Side - Visual */}
      <div className="hidden lg:flex w-1/2 bg-[#131b25] text-white relative overflow-hidden items-center justify-center p-16">
        <div className="relative z-20 max-w-lg w-full">
          <AnimatedSection>
            <div className="font-serif text-3xl tracking-tight mb-32">Area</div>
            <p className="font-mono text-[#9ca986] text-[10px] tracking-widest uppercase mb-6">Guest Experience</p>
            <h1 className="font-serif text-[clamp(2.5rem,5vw,5rem)] mb-8 leading-[0.95] tracking-tight text-white">
              Savor <br/> the moment.
            </h1>
            <p className="font-sans text-xl text-gray-400 font-light">
              Enter your hotel or table code to access your digital menu and order instantly.
            </p>
          </AnimatedSection>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="max-w-md w-full">
          <AnimatedSection delay={0.1}>
            <div className="lg:hidden font-serif text-3xl tracking-tight mb-12">Area</div>
            
            <Link href="/login" className="text-xs font-mono text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors mb-8 inline-block">
              ← Back
            </Link>

            <div className="w-12 h-12 bg-gray-50 text-gray-900 rounded-full flex items-center justify-center mb-8">
              <Utensils className="w-5 h-5" strokeWidth={1.5} />
            </div>

            <h2 className="font-serif text-4xl tracking-tight text-gray-900 mb-4">Guest Portal</h2>
            <p className="font-sans text-gray-500 mb-12 font-light text-sm">Enter your designated hotel ID to view the menu.</p>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="hotelId" className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">
                  Hotel Code
                </label>
                <input
                  type="text"
                  id="hotelId"
                  value={hotelId}
                  onChange={(e) => setHotelId(e.target.value)}
                  placeholder="e.g. demo-hotel"
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-[#9ca986] focus:border-[#9ca986] block p-4 outline-none transition-colors"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full group bg-gray-900 text-white rounded-xl p-4 flex items-center justify-center gap-2 hover:bg-[#9ca986] transition-colors"
              >
                <span className="font-sans text-sm font-medium">Access Menu</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-all" />
              </button>
            </form>
            
            <div className="mt-8 pt-8 border-t border-gray-100">
               <p className="text-xs text-gray-400 font-light">
                 Tip: Use <span className="font-mono font-medium text-gray-600">demo</span> to explore a sample menu.
               </p>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}
