import React from 'react';
import Image from 'next/image';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full bg-white font-sans overflow-hidden">
      {/* Left Side: Illustration */}
      <div className="hidden lg:flex w-1/2 h-full items-center justify-center p-12 bg-white border-r border-gray-100">
        <div className="relative w-full max-w-lg aspect-square">
          <Image
            src="/images/auth-illustration.jpg"
            alt="Authentication Illustration"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="w-full lg:w-1/2 h-full flex flex-col justify-center items-center p-8 sm:p-12 lg:p-24 overflow-y-auto">
        <div className="w-full max-w-[420px]">
          {children}
        </div>
      </div>
    </div>
  );
}
