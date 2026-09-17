'use client';

import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { ArrowRight, Building, User } from 'lucide-react';
import Link from 'next/link';

export default function GlobalLoginSelection() {
  return (
    <div className="min-h-screen flex font-sans">
      {/* Left Side - Visual */}
      <div className="hidden lg:flex w-1/2 bg-[#fcfcfc] border-r border-gray-100 relative overflow-hidden items-center justify-center p-16">
        <div className="relative z-20 max-w-lg text-gray-900 w-full">
          <AnimatedSection>
            <div className="font-serif text-3xl tracking-tight mb-32">Area</div>
            <p className="font-mono text-[#9ca986] text-[10px] tracking-widest uppercase mb-6">Area Hospitality</p>
            <h1 className="font-serif text-[clamp(2.5rem,5vw,5rem)] mb-8 leading-[0.95] tracking-tight">
              Manage <br/> your property.
            </h1>
            <p className="font-sans text-xl text-gray-500 font-light">
              The definitive operating system for modern luxury hotels.
            </p>
          </AnimatedSection>
        </div>
      </div>

      {/* Right Side - Selection */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="max-w-md w-full">
          <AnimatedSection delay={0.1}>
            <div className="lg:hidden font-serif text-3xl tracking-tight mb-12">Area</div>
            
            <h2 className="font-serif text-4xl tracking-tight text-gray-900 mb-4">Welcome.</h2>
            <p className="font-sans text-gray-500 mb-12 font-light text-sm">How would you like to continue?</p>

            <div className="space-y-4">
              <Link href="/owner/login" className="group block">
                <div className="p-8 bg-white border border-gray-100 hover:border-gray-300 transition-colors rounded-2xl flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-gray-50 text-gray-900 rounded-full flex items-center justify-center">
                      <Building className="w-5 h-5" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="font-serif text-gray-900 tracking-tight text-xl">Hotel Staff</h3>
                      <p className="font-sans text-xs text-gray-400 mt-1 font-light">Access PMS & Dashboard</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-900 transform group-hover:translate-x-1 transition-all" />
                </div>
              </Link>

              <Link href="#" className="group block">
                <div className="p-8 bg-white border border-gray-100 hover:border-gray-300 transition-colors rounded-2xl flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-gray-50 text-gray-900 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="font-serif text-gray-900 tracking-tight text-xl">Hotel Guest</h3>
                      <p className="font-sans text-xs text-gray-400 mt-1 font-light">View In-Room Orders</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-900 transform group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            </div>

            <p className="mt-12 text-center text-xs font-sans text-gray-400">
              Don't have an account? <Link href="/contact" className="text-gray-900 hover:text-[#9ca986] transition-colors ml-1">Contact Sales</Link>
            </p>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}
