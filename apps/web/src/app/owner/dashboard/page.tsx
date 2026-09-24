'use client';

import { useState, useEffect } from 'react';
import { Calendar, ArrowRight, ArrowDownRight, DollarSign, Star, Plus, MoreHorizontal } from 'lucide-react';

export default function DashboardOverviewPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-[28px] font-bold text-gray-900 tracking-tight">Dashboard</h1>
      </div>

      {/* Top 4 Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Metric 1 - New Bookings -> Active Orders */}
        <div className="bg-[#E4F8EE] rounded-2xl p-5 shadow-sm border border-[#D1F0E0]">
          <div className="flex justify-between items-start mb-2">
            <span className="text-gray-500 font-medium text-sm">Active Orders</span>
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <Calendar size={16} className="text-gray-500" />
            </div>
          </div>
          <div className="text-[32px] font-bold text-gray-900 mb-2 leading-none">84</div>
          <div className="flex items-center text-xs font-medium text-gray-600">
            <span className="bg-white/60 text-green-700 px-2 py-0.5 rounded flex items-center mr-2">
              <ArrowRight size={12} className="-rotate-45 mr-1" /> 8.70%
            </span>
            from last week
          </div>
        </div>

        {/* Metric 2 - Check-In -> QR Scans */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-2">
            <span className="text-gray-500 font-medium text-sm">QR Scans Today</span>
            <div className="w-8 h-8 bg-[#F4F9E8] rounded-lg flex items-center justify-center">
              <ArrowRight size={16} className="text-gray-500" />
            </div>
          </div>
          <div className="text-[32px] font-bold text-gray-900 mb-2 leading-none">231</div>
          <div className="flex items-center text-xs font-medium text-gray-600">
            <span className="bg-[#E1F764] text-gray-900 px-2 py-0.5 rounded flex items-center mr-2">
              <ArrowRight size={12} className="-rotate-45 mr-1" /> 3.56%
            </span>
            from last week
          </div>
        </div>

        {/* Metric 3 - Check-Out -> Completed */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-2">
            <span className="text-gray-500 font-medium text-sm">Completed Orders</span>
            <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
              <ArrowRight size={16} className="text-gray-500 rotate-180" />
            </div>
          </div>
          <div className="text-[32px] font-bold text-gray-900 mb-2 leading-none">124</div>
          <div className="flex items-center text-xs font-medium text-gray-600">
            <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded flex items-center mr-2">
              <ArrowDownRight size={12} className="mr-1" /> 1.06%
            </span>
            from last week
          </div>
        </div>

        {/* Metric 4 - Total Revenue */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-2">
            <span className="text-gray-500 font-medium text-sm">Total Revenue</span>
            <div className="w-8 h-8 bg-[#E4F8EE] rounded-lg flex items-center justify-center">
              <DollarSign size={16} className="text-green-700" />
            </div>
          </div>
          <div className="text-[32px] font-bold text-gray-900 mb-2 leading-none">₹123,980</div>
          <div className="flex items-center text-xs font-medium text-gray-600">
            <span className="bg-[#E1F764] text-gray-900 px-2 py-0.5 rounded flex items-center mr-2">
              <ArrowRight size={12} className="-rotate-45 mr-1" /> 5.70%
            </span>
            from last week
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-12 gap-6">
        
        {/* Left Column (Table Availability + Charts) */}
        <div className="lg:col-span-3 xl:col-span-9 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Table Availability */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-gray-900">Table Availability</h3>
                <MoreHorizontal size={20} className="text-gray-400" />
              </div>
              
              <div className="flex h-12 rounded-lg overflow-hidden mb-8 gap-1">
                <div className="bg-[#C5EBD6] w-[65%] rounded-l-lg"></div>
                <div className="bg-[#F2F9C3] w-[20%]"></div>
                <div className="bg-[#E1F764] w-[15%] rounded-r-lg"></div>
              </div>

              <div className="grid grid-cols-2 gap-y-6">
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Occupied</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Reserved</p>
                  <p className="text-2xl font-bold text-gray-900">4</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Available</p>
                  <p className="text-2xl font-bold text-gray-900">8</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Not Ready</p>
                  <p className="text-2xl font-bold text-gray-900">2</p>
                </div>
              </div>
            </div>

            {/* Revenue Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 md:col-span-2">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-gray-900">Revenue</h3>
                <select className="bg-[#E1F764] text-gray-900 text-xs font-semibold px-3 py-1.5 rounded-lg border-none outline-none cursor-pointer">
                  <option>Last 6 Months</option>
                </select>
              </div>
              
              <div className="relative h-48 w-full mt-4">
                {/* SVG Area Chart Mock */}
                <svg viewBox="0 0 1000 200" className="w-full h-full preserve-3d" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="0" y1="20" x2="1000" y2="20" stroke="#f3f4f6" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="0" y1="70" x2="1000" y2="70" stroke="#f3f4f6" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="0" y1="120" x2="1000" y2="120" stroke="#f3f4f6" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="0" y1="170" x2="1000" y2="170" stroke="#f3f4f6" strokeWidth="1" strokeDasharray="4 4" />
                  
                  {/* Area Gradient */}
                  <defs>
                    <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#E1F764" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#E1F764" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Chart Path */}
                  <path 
                    d="M 0 140 C 150 140, 200 70, 350 70 C 450 70, 500 130, 600 130 C 750 130, 800 50, 1000 100 L 1000 200 L 0 200 Z" 
                    fill="url(#chartGradient)" 
                  />
                  
                  {/* Line Path */}
                  <path 
                    d="M 0 140 C 150 140, 200 70, 350 70 C 450 70, 500 130, 600 130 C 750 130, 800 50, 1000 100" 
                    fill="none" 
                    stroke="#C2DF17" 
                    strokeWidth="3" 
                  />
                  
                  {/* Active Point */}
                  <circle cx="600" cy="130" r="4" fill="#fff" stroke="#C2DF17" strokeWidth="3" />
                  <line x1="600" y1="130" x2="600" y2="200" stroke="#C2DF17" strokeWidth="1" strokeDasharray="4 4" />
                </svg>

                {/* Y-Axis Labels */}
                <div className="absolute top-[5px] -left-1 text-[10px] text-gray-400 font-medium">$400K</div>
                <div className="absolute top-[55px] -left-1 text-[10px] text-gray-400 font-medium">$300K</div>
                <div className="absolute top-[105px] -left-1 text-[10px] text-gray-400 font-medium">$200K</div>
                <div className="absolute top-[155px] -left-1 text-[10px] text-gray-400 font-medium">$100K</div>
                
                {/* Tooltip */}
                <div className="absolute top-14 left-[53%] -translate-x-1/2 bg-[#E1F764] px-3 py-1.5 rounded-lg shadow-sm">
                  <div className="text-[10px] text-gray-700 font-medium text-center leading-tight">Total Revenue</div>
                  <div className="text-sm font-bold text-gray-900">₹315,060</div>
                </div>
              </div>

              {/* X-Axis Labels */}
              <div className="flex justify-between mt-3 text-[10px] text-gray-500 font-medium px-4">
                <span>Dec 2027</span>
                <span>Jan 2028</span>
                <span>Feb 2028</span>
                <span>Mar 2028</span>
                <span>Apr 2028</span>
                <span>May 2028</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* QR Activations Bar Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-gray-900">QR Activations</h3>
                <select className="bg-[#E1F764] text-gray-900 text-xs font-semibold px-3 py-1.5 rounded-lg border-none outline-none cursor-pointer">
                  <option>Last 7 Days</option>
                </select>
              </div>
              <div className="flex gap-4 mb-4">
                <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                  <div className="w-2 h-2 rounded bg-[#C5EBD6]"></div> Scans
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                  <div className="w-2 h-2 rounded bg-[#E1F764]"></div> Orders
                </div>
              </div>
              
              <div className="h-40 flex items-end justify-between px-2 gap-2 mt-8">
                {[
                  { scans: 60, orders: 40 },
                  { scans: 80, orders: 50 },
                  { scans: 40, orders: 20 },
                  { scans: 90, orders: 70 },
                  { scans: 50, orders: 30 },
                  { scans: 100, orders: 80 },
                  { scans: 70, orders: 60 },
                ].map((day, i) => (
                  <div key={i} className="flex gap-1 h-full items-end flex-1">
                    <div className="w-full bg-[#C5EBD6] rounded-t-sm" style={{ height: `${day.scans}%` }}></div>
                    <div className="w-full bg-[#E1F764] rounded-t-sm" style={{ height: `${day.orders}%` }}></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Orders by Category Pie */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-gray-900">Order by Category</h3>
                <MoreHorizontal size={20} className="text-gray-400" />
              </div>
              
              <div className="flex-1 flex items-center justify-between px-4">
                {/* Mock SVG Donut Chart */}
                <div className="relative w-32 h-32">
                  <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#C5EBD6" strokeWidth="20" strokeDasharray="180 251" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#E1F764" strokeWidth="20" strokeDasharray="71 251" strokeDashoffset="-180" />
                  </svg>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 rounded-full bg-[#C5EBD6]"></div>
                      <span className="text-xs text-gray-500 font-medium">Food</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900 ml-4">61%</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 rounded-full bg-[#E1F764]"></div>
                      <span className="text-xs text-gray-500 font-medium">Beverages</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900 ml-4">12%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Reviews + Tasks) */}
        <div className="lg:col-span-1 xl:col-span-3 space-y-6">
          
          {/* Overall Rating */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-gray-900">Overall Rating</h3>
              <MoreHorizontal size={20} className="text-gray-400" />
            </div>

            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-end gap-1 px-3 py-2 bg-[#E4F8EE] text-green-800 rounded-lg font-bold text-2xl">
                4.6<span className="text-sm font-medium text-green-700/80 mb-0.5">/5</span>
              </div>
              <div>
                <p className="font-bold text-gray-900">Impressive</p>
                <p className="text-[10px] text-gray-500 font-medium mt-0.5">from 2,546 reviews</p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { label: 'Food Quality', score: 4.8 },
                { label: 'Service', score: 4.7 },
                { label: 'Ambience', score: 4.6 },
                { label: 'Value', score: 4.5 },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 text-xs font-medium">
                  <span className="w-20 text-gray-500">{item.label}</span>
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#E1F764]" style={{ width: `${(item.score / 5) * 100}%` }}></div>
                  </div>
                  <span className="w-6 text-right text-gray-900">{item.score}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tasks */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-gray-900">Tasks</h3>
              <button className="w-6 h-6 bg-[#E1F764] rounded flex items-center justify-center text-gray-900 hover:bg-[#cbe34f] transition-colors">
                <Plus size={16} />
              </button>
            </div>

            <div className="space-y-3">
              {[
                { date: 'June 19, 2028', title: 'Prepare VIP table for 10 AM Reservation', bg: 'bg-[#C5EBD6]' },
                { date: 'June 19, 2028', title: 'Restock inventory for bar section', bg: 'bg-[#E1F764]' },
                { date: 'June 20, 2028', title: 'Inspect and clean patio area', bg: 'bg-white border border-gray-200' },
              ].map((task, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  <div className="w-4 h-4 border border-gray-300 rounded mt-1 shrink-0"></div>
                  <div className={`flex-1 rounded-xl p-4 ${task.bg}`}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] text-gray-500 font-medium">{task.date}</span>
                      <MoreHorizontal size={14} className="text-gray-400" />
                    </div>
                    <p className="text-xs font-medium text-gray-900 leading-snug">{task.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
