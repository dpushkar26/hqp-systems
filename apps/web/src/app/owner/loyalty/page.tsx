'use client';

import { useState } from 'react';
import { Search, Award, Gift } from 'lucide-react';

export default function LoyaltyPage() {
  const [search, setSearch] = useState('');
  
  // Mock loyalty data context updated to Hotel POS
  const loyaltyData = [
    { room: '402', name: 'Eleanor Vance', stays: 12, status: 'Platinum' },
    { room: '105', name: 'Marcus Thorne', stays: 3, status: 'Silver' },
  ];

  return (
    <div className="space-y-12 font-sans">
      <div className="flex flex-col md:flex-row justify-between md:items-end border-b border-gray-100 pb-8 gap-6">
        <div>
          <h1 className="text-4xl tracking-tight text-gray-900 leading-none mb-2">Guest Loyalty</h1>
          <p className="text-gray-500 font-light text-sm">Track VIP guests and manage exclusive F&B rewards.</p>
        </div>
        
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search by Room or Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all text-sm font-sans"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3" strokeWidth={1.5} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loyaltyData.map((guest, idx) => (
          <div key={idx} className="bg-white p-8 rounded-2xl border border-gray-100 flex flex-col gap-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start border-b border-gray-50 pb-6">
              <div>
                <div className="font-serif text-2xl text-gray-900 mb-1">{guest.name}</div>
                <div className="text-[10px] uppercase tracking-widest text-gray-400">Room {guest.room}</div>
              </div>
              <div className="bg-gray-50 text-gray-900 border border-gray-200 px-3 py-1.5 rounded text-[10px] uppercase tracking-widest flex items-center gap-2">
                <Award className="w-3 h-3" strokeWidth={1.5} /> {guest.status}
              </div>
            </div>

            <div className="flex justify-between items-end text-sm text-gray-500 font-light">
              <span>Total Stays: {guest.stays}</span>
              <span className="text-[10px] uppercase tracking-widest text-gray-400">{15 - (guest.stays % 15)} stays to Diamond</span>
            </div>

            <div className="w-full bg-gray-50 rounded-full h-1 border border-gray-100 overflow-hidden">
              <div 
                className="bg-[#9ca986] h-full rounded-full transition-all duration-1000" 
                style={{ width: `${(guest.stays % 15) * 6.66}%` }}
              ></div>
            </div>

            <div className="pt-2">
              <button 
                className={`w-full py-3 rounded-xl uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transition-colors ${
                  guest.status === 'Platinum'
                    ? 'bg-gray-900 text-white hover:bg-[#9ca986]'
                    : 'bg-white border border-gray-200 text-gray-400 cursor-not-allowed'
                }`}
                disabled={guest.status !== 'Platinum'}
              >
                <Gift className="w-4 h-4" strokeWidth={1.5} /> Issue Comp Champagne
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
