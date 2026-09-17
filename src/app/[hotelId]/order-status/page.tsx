'use client';

import { CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function OrderStatusPage() {
  const { hotelId } = useParams();
  const [status, setStatus] = useState<'PENDING' | 'PREPARING'>('PENDING');

  useEffect(() => {
    // Simulate order state transition after a few seconds
    const timer = setTimeout(() => {
      setStatus('PREPARING');
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="w-24 h-24 bg-white rounded-full border border-gray-100 flex items-center justify-center text-gray-900 mb-10 shadow-sm">
        <CheckCircle2 className="w-10 h-10" strokeWidth={1.5} />
      </div>
      
      <h1 className="text-3xl tracking-tight text-gray-900 mb-4">Order Received</h1>
      <p className="text-gray-500 mb-12 font-light max-w-xs text-sm">
        Your dining request has been sent to the culinary team.
      </p>

      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] w-full max-w-sm mb-12">
        <h3 className="font-mono text-gray-400 uppercase tracking-widest text-[10px] mb-8 border-b border-gray-100 pb-4">Real-time Status</h3>
        
        <div className="space-y-6">
          <div className="flex items-start gap-6 text-left">
            <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-900 shrink-0">
              <CheckCircle2 className="w-5 h-5 text-[#9ca986]" strokeWidth={2} />
            </div>
            <div>
              <p className="tracking-tight text-gray-900">Order Accepted</p>
              <p className="text-xs font-light text-gray-500 mt-1">Confirmed by Room Service.</p>
            </div>
          </div>
          
          <div className="w-px h-10 bg-gray-200 ml-5 rounded-full"></div>
          
          <div className="flex items-start gap-6 text-left">
            <div className={`w-10 h-10 rounded-full border flex items-center justify-center shrink-0 ${status === 'PREPARING' ? 'border-gray-900 bg-white' : 'border-gray-200 bg-gray-50'}`}>
              {status === 'PREPARING' && <div className="w-2 h-2 bg-gray-900 rounded-full animate-pulse"></div>}
            </div>
            <div>
              <p className={`tracking-tight ${status === 'PREPARING' ? 'text-gray-900' : 'text-gray-400'}`}>Preparing</p>
              <p className="text-xs font-light text-gray-500 mt-1">The chef is preparing your meal.</p>
            </div>
          </div>
        </div>
      </div>

      <Link
        href={`/${hotelId}/menu`}
        className="text-gray-500 font-sans text-sm font-medium flex items-center gap-3 hover:text-gray-900 px-6 py-3 rounded-full hover:bg-gray-100 transition-colors"
      >
        Return to Menu <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
