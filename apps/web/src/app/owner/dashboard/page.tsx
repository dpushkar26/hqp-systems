'use client';

import { ArrowUpRight, MessageSquare, Star, Edit2, MoreVertical, Plus } from 'lucide-react';
import React, { useState, useEffect } from 'react';

export default function DashboardOverviewPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="w-full h-full text-gray-900 pb-10">
      
      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-5">
        
        {/* ROW 1 */}
        {/* Revenues */}
        <div className="col-span-12 md:col-span-4 bg-white rounded-[24px] p-7 shadow-[0_2px_16px_rgba(0,0,0,0.02)]">
          <h3 className="text-[16px] font-bold text-gray-900 mb-5 tracking-tight">Revenues</h3>
          <div className="flex items-end gap-3 mb-2">
            <span className="text-[44px] font-bold leading-none tracking-tight">15%</span>
            <ArrowUpRight size={26} className="text-[#32CD32] mb-1" strokeWidth={2.5} />
          </div>
          <p className="text-[13px] text-gray-500 font-medium mb-12">Increase compared to last week</p>
          <a href="#" className="text-[12px] text-[#A67B5B] font-bold flex items-center gap-1 hover:opacity-80 transition-opacity uppercase tracking-wide">
            Revenues report <ArrowUpRight size={14} className="rotate-45" />
          </a>
        </div>

        {/* Lost deals */}
        <div className="col-span-12 md:col-span-4 bg-white rounded-[24px] p-7 shadow-[0_2px_16px_rgba(0,0,0,0.02)]">
          <h3 className="text-[16px] font-bold text-gray-900 mb-5 tracking-tight">Lost deals</h3>
          <div className="flex items-end gap-3 mb-2">
            <span className="text-[44px] font-bold leading-none tracking-tight">4%</span>
          </div>
          <p className="text-[13px] text-gray-500 font-medium mb-12">You closed 96 out of 100 deals</p>
          <a href="#" className="text-[12px] text-[#A67B5B] font-bold flex items-center gap-1 hover:opacity-80 transition-opacity uppercase tracking-wide">
            All deals <ArrowUpRight size={14} className="rotate-45" />
          </a>
        </div>

        {/* Quarter goal */}
        <div className="col-span-12 md:col-span-4 bg-white rounded-[24px] p-7 shadow-[0_2px_16px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <h3 className="text-[16px] font-bold text-gray-900 mb-2 text-center tracking-tight">Quarter goal</h3>
          
          <div className="flex-1 flex items-center justify-center relative mt-2 mb-2">
             <svg viewBox="0 0 100 50" className="w-full max-w-[180px]">
               <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#FFF4E5" strokeWidth="8" strokeLinecap="round" />
               <path d="M 10 50 A 40 40 0 0 1 70 15" fill="none" stroke="#FFB03A" strokeWidth="8" strokeLinecap="round" />
             </svg>
             <div className="absolute inset-0 flex items-end justify-center pb-2">
                <span className="text-[32px] font-bold tracking-tight">84%</span>
             </div>
          </div>
          
          <div className="text-center mt-6">
            <a href="#" className="text-[12px] text-[#A67B5B] font-bold inline-flex items-center gap-1 hover:opacity-80 transition-opacity uppercase tracking-wide">
              All goals <ArrowUpRight size={14} className="rotate-45" />
            </a>
          </div>
        </div>

        {/* ROW 2 & 3 */}
        {/* Customers */}
        <div className="col-span-12 lg:col-span-6 bg-white rounded-[24px] p-7 shadow-[0_2px_16px_rgba(0,0,0,0.02)] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[16px] font-bold text-gray-900 tracking-tight">Customers</h3>
            <button className="text-[13px] font-medium text-gray-400 flex items-center gap-1">
              Sort by <span className="font-bold text-gray-700 ml-1">Newest</span> <span className="text-gray-300 text-[10px]">▼</span>
            </button>
          </div>

          <div className="space-y-1.5 flex-1">
            <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <img src="https://ui-avatars.com/api/?name=Chris+Friedkly&background=ececec&color=000" className="w-10 h-10 rounded-full" alt="Chris" />
                <div>
                  <p className="text-[14px] font-bold text-gray-900">Chris Friedkly</p>
                  <p className="text-[12px] text-gray-500">Supermarket Villanova</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#FFF9F0] border border-[#FFE4C4]/50 cursor-pointer">
              <div className="flex items-center gap-4">
                <img src="https://ui-avatars.com/api/?name=Maggie+Johnson&background=0284c7&color=fff" className="w-10 h-10 rounded-full" alt="Maggie" />
                <div>
                  <p className="text-[14px] font-bold text-gray-900">Maggie Johnson</p>
                  <p className="text-[12px] text-gray-500">Oasis Organic Inc.</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-[#A67B5B] pr-2">
                <button className="hover:text-[#8b6549] transition-colors"><MessageSquare size={16} strokeWidth={2.5} /></button>
                <button className="hover:text-[#8b6549] transition-colors"><Star size={16} strokeWidth={2.5} /></button>
                <button className="hover:text-[#8b6549] transition-colors"><Edit2 size={16} strokeWidth={2.5} /></button>
                <div className="w-px h-4 bg-[#A67B5B]/20"></div>
                <button className="hover:text-[#8b6549] transition-colors"><MoreVertical size={16} strokeWidth={2.5} /></button>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <img src="https://ui-avatars.com/api/?name=Gael+Harry&background=16a34a&color=fff" className="w-10 h-10 rounded-full" alt="Gael" />
                <div>
                  <p className="text-[14px] font-bold text-gray-900">Gael Harry</p>
                  <p className="text-[12px] text-gray-500">New York Finest Fruits</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <img src="https://ui-avatars.com/api/?name=Jenna+Sullivan&background=64748b&color=fff" className="w-10 h-10 rounded-full" alt="Jenna" />
                <div>
                  <p className="text-[14px] font-bold text-gray-900">Jenna Sullivan</p>
                  <p className="text-[12px] text-gray-500">Walmart</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-2">
            <a href="#" className="text-[12px] text-[#A67B5B] font-bold flex items-center gap-1 hover:opacity-80 transition-opacity uppercase tracking-wide">
              All customers <ArrowUpRight size={14} className="rotate-45" />
            </a>
          </div>
        </div>

        {/* Right side for Row 2 & 3 */}
        <div className="col-span-12 lg:col-span-6 flex flex-col gap-5">
          
          {/* Growth Chart */}
          <div className="bg-white rounded-[24px] p-7 shadow-[0_2px_16px_rgba(0,0,0,0.02)] flex-1">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[16px] font-bold text-gray-900 tracking-tight">Growth</h3>
              <button className="text-[13px] font-medium text-gray-400 flex items-center gap-1">
                Yearly <span className="text-gray-300 text-[10px] ml-1">▼</span>
              </button>
            </div>
            
            <div className="relative h-44 w-full mt-4">
              <svg viewBox="0 0 1000 200" className="w-full h-full preserve-3d" preserveAspectRatio="none">
                <line x1="0" y1="0" x2="1000" y2="0" stroke="#f3f4f6" strokeWidth="1" />
                <line x1="0" y1="50" x2="1000" y2="50" stroke="#f3f4f6" strokeWidth="1" />
                <line x1="0" y1="100" x2="1000" y2="100" stroke="#f3f4f6" strokeWidth="1" />
                <line x1="0" y1="150" x2="1000" y2="150" stroke="#f3f4f6" strokeWidth="1" />
                <line x1="0" y1="200" x2="1000" y2="200" stroke="#f3f4f6" strokeWidth="1" />
                
                <defs>
                  <linearGradient id="growthGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#32CD32" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#32CD32" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                
                <path d="M 100 180 L 200 160 L 400 60 L 600 170 L 800 60 L 1000 20 L 1000 200 L 100 200 Z" fill="url(#growthGradient)" />
                <path d="M 100 180 L 200 160 L 400 60 L 600 170 L 800 60 L 1000 20" fill="none" stroke="#32CD32" strokeWidth="2.5" strokeDasharray="6 4" />
              </svg>
              
              <div className="absolute top-[0px] -left-1 text-[10px] text-gray-400 font-medium">100k</div>
              <div className="absolute top-[50px] -left-1 text-[10px] text-gray-400 font-medium">50k</div>
              <div className="absolute top-[100px] -left-1 text-[10px] text-gray-400 font-medium">20k</div>
              <div className="absolute top-[150px] -left-1 text-[10px] text-gray-400 font-medium">10k</div>
              <div className="absolute top-[190px] -left-1 text-[10px] text-gray-400 font-medium">0</div>
            </div>
            
            <div className="flex justify-between mt-3 text-[10px] text-gray-400 font-medium ml-6">
              <span>2016</span><span>2017</span><span>2018</span><span>2019</span><span>2020</span><span>2021</span><span>2022</span><span>2023</span>
            </div>
          </div>

          {/* 3 Small Blocks */}
          <div className="grid grid-cols-3 gap-5">
            <div className="bg-white rounded-[24px] p-6 shadow-[0_2px_16px_rgba(0,0,0,0.02)]">
              <p className="text-[13px] font-bold text-gray-500 mb-4">Top month</p>
              <h4 className="text-[20px] font-bold text-[#A67B5B] leading-tight">November</h4>
              <p className="text-[16px] font-bold text-[#D4AF37]">2019</p>
            </div>
            
            <div className="bg-white rounded-[24px] p-6 shadow-[0_2px_16px_rgba(0,0,0,0.02)]">
              <p className="text-[13px] font-bold text-gray-500 mb-4">Top year</p>
              <h4 className="text-[20px] font-bold text-gray-900 leading-tight">2023</h4>
              <p className="text-[11px] text-gray-500 font-medium mt-1">96K sold so far</p>
            </div>

            <div className="bg-white rounded-[24px] p-6 shadow-[0_2px_16px_rgba(0,0,0,0.02)]">
              <p className="text-[13px] font-bold text-gray-500 mb-3">Top buyer</p>
              <img src="https://ui-avatars.com/api/?name=Maggie+Johnson&background=0284c7&color=fff" className="w-7 h-7 rounded-full mb-2" alt="Maggie" />
              <h4 className="text-[13px] font-bold text-gray-900 leading-tight">Maggie Johnson</h4>
              <p className="text-[10px] text-gray-500 font-medium mt-0.5">Oasis Organic Inc.</p>
            </div>
          </div>
        </div>

        {/* ROW 4 */}
        <div className="col-span-12 md:col-span-3 bg-white rounded-[24px] p-7 shadow-[0_2px_16px_rgba(0,0,0,0.02)]">
          <h3 className="text-[16px] font-bold text-gray-900 mb-2 tracking-tight">Chats</h3>
          <p className="text-[13px] text-gray-500 font-medium mb-7">2 unread messages</p>
          <div className="flex items-center gap-4">
             <div className="relative">
                <img src="https://ui-avatars.com/api/?name=A&background=random" className="w-11 h-11 rounded-full border-2 border-white ring-2 ring-[#FFF4E5]" alt="User" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
             </div>
             <div className="relative">
                <img src="https://ui-avatars.com/api/?name=B&background=random" className="w-11 h-11 rounded-full border-2 border-white ring-2 ring-[#FFF4E5]" alt="User" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
             </div>
             <img src="https://ui-avatars.com/api/?name=C&background=random" className="w-11 h-11 rounded-full grayscale opacity-40" alt="User" />
             <img src="https://ui-avatars.com/api/?name=D&background=random" className="w-11 h-11 rounded-full grayscale opacity-40" alt="User" />
          </div>
        </div>

        <div className="col-span-12 md:col-span-4 bg-white rounded-[24px] p-7 shadow-[0_2px_16px_rgba(0,0,0,0.02)]">
          <h3 className="text-[16px] font-bold text-gray-900 mb-6 tracking-tight">Top states</h3>
          <div className="space-y-4">
            <div className="relative h-7 bg-gray-50 rounded-md flex items-center px-3">
              <div className="absolute left-0 top-0 h-full bg-[#FFE4C4] rounded-md" style={{ width: '100%' }}></div>
              <span className="relative z-10 text-[12px] font-bold text-gray-900 w-8">NY</span>
              <span className="relative z-10 text-[10px] font-bold text-gray-500 ml-auto">120K</span>
            </div>
            <div className="relative h-7 bg-gray-50 rounded-md flex items-center px-3">
              <div className="absolute left-0 top-0 h-full bg-[#FFE4C4] opacity-80 rounded-md" style={{ width: '70%' }}></div>
              <span className="relative z-10 text-[12px] font-bold text-gray-900 w-8">MA</span>
              <span className="relative z-10 text-[10px] font-bold text-gray-500 ml-auto">80K</span>
            </div>
            <div className="relative h-7 bg-gray-50 rounded-md flex items-center px-3">
              <div className="absolute left-0 top-0 h-full bg-[#FFE4C4] opacity-60 rounded-md" style={{ width: '60%' }}></div>
              <span className="relative z-10 text-[12px] font-bold text-gray-900 w-8">NH</span>
              <span className="relative z-10 text-[10px] font-bold text-gray-500 ml-auto">70K</span>
            </div>
            <div className="relative h-7 bg-gray-50 rounded-md flex items-center px-3">
              <div className="absolute left-0 top-0 h-full bg-[#FFE4C4] opacity-40 rounded-md" style={{ width: '40%' }}></div>
              <span className="relative z-10 text-[12px] font-bold text-gray-900 w-8">OR</span>
              <span className="relative z-10 text-[10px] font-bold text-gray-500 ml-auto">50K</span>
            </div>
          </div>
        </div>

        <div className="col-span-12 md:col-span-5 bg-white rounded-[24px] p-7 shadow-[0_2px_16px_rgba(0,0,0,0.02)]">
          <h3 className="text-[16px] font-bold text-gray-900 mb-6 tracking-tight">New deals</h3>
          <div className="flex flex-wrap gap-2.5">
            {['Fruit2Go', "Marshall's MKT", 'CCNT', 'Joana Mini-market', 'Little Brazil Vegan', 'Target', 'Organic Place', "Morello's"].map((deal, idx) => (
              <div key={idx} className="flex items-center gap-1.5 px-3 py-2 bg-[#FFF9F0] rounded-xl text-[#FFB03A] hover:bg-[#FFF4E5] cursor-pointer transition-colors">
                <Plus size={14} strokeWidth={3} />
                <span className="text-[12px] font-bold text-gray-800">{deal}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
