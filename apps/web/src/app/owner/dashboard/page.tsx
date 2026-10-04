'use client';

import React from 'react';
import { BarChart3, Wallet } from 'lucide-react';
import Image from 'next/image';

export default function DashboardOverviewPage() {
  return (
    <div className="w-full h-full text-gray-900 p-8">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-heading font-bold text-gray-900">Manager Dashboard</h1>
        
        {/* Date Filter Pills */}
        <div className="flex items-center bg-gray-50 rounded-full p-1 border border-gray-100">
          <button className="px-6 py-2 rounded-full bg-orange-500 text-white font-sans text-[14px] font-medium shadow-sm transition-all">
            Today
          </button>
          <button className="px-6 py-2 rounded-full text-gray-400 font-sans text-[14px] font-medium hover:text-gray-700 transition-all">
            This Week
          </button>
          <button className="px-6 py-2 rounded-full text-gray-400 font-sans text-[14px] font-medium hover:text-gray-700 transition-all">
            This Month
          </button>
          <button className="px-6 py-2 rounded-full text-gray-400 font-sans text-[14px] font-medium hover:text-gray-700 transition-all">
            This Year
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* ROW 1 */}
        {/* Total Income Donut */}
        <div className="col-span-12 md:col-span-5 bg-white rounded-[20px] p-6 shadow-sm border border-gray-100 flex flex-col">
          <h3 className="text-lg font-heading font-bold text-gray-900 mb-6">Total Income</h3>
          
          <div className="flex-1 flex flex-col items-center justify-center relative min-h-[220px]">
             {/* Custom SVG Donut Chart */}
             <div className="relative w-[180px] h-[180px]">
               <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                 {/* Gray Background / Others */}
                 <circle cx="50" cy="50" r="40" fill="transparent" stroke="#E5E7EB" strokeWidth="15" />
                 
                 {/* Orange / Foodies (bottom half approx) */}
                 <circle cx="50" cy="50" r="40" fill="transparent" stroke="#F97316" strokeWidth="15" 
                   strokeDasharray="251.2" strokeDashoffset="125.6" 
                   className="transform origin-center rotate-90" />
                   
                 {/* Black / Cold Drink (top left approx) */}
                 <circle cx="50" cy="50" r="40" fill="transparent" stroke="#111827" strokeWidth="15" 
                   strokeDasharray="251.2" strokeDashoffset="200" 
                   className="transform origin-center rotate-[210deg]" />
               </svg>
               <div className="absolute inset-0 flex items-center justify-center flex-col">
                 <span className="text-[22px] font-heading font-bold text-gray-900">$20,000</span>
               </div>
             </div>
          </div>
          
          {/* Legend */}
          <div className="flex justify-center items-center gap-6 mt-6">
            <div className="flex items-center gap-2">
              <span className="w-4 h-1.5 rounded-full bg-orange-500"></span>
              <span className="text-[13px] font-sans font-bold text-gray-900">Foodies</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-1.5 rounded-full bg-gray-900"></span>
              <span className="text-[13px] font-sans font-bold text-gray-900">Cold Drink</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-1.5 rounded-full bg-gray-200"></span>
              <span className="text-[13px] font-sans font-bold text-gray-900">Others</span>
            </div>
          </div>
        </div>

        {/* Total Balance */}
        <div className="col-span-12 md:col-span-7 bg-white rounded-[20px] p-6 shadow-sm border border-gray-100 flex flex-col">
          <div className="flex justify-between items-start mb-10">
            <h3 className="text-lg font-heading font-bold text-gray-900">Total Balance</h3>
            <span className="text-4xl font-heading font-bold text-green-500 tracking-tight">$30,000</span>
          </div>

          <div className="flex-1 flex flex-col justify-center space-y-8">
            {/* Total Income Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center text-white">
                  <BarChart3 size={20} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-[14px] font-sans font-bold text-gray-900">Total Income</p>
                  <p className="text-[14px] font-sans font-bold text-gray-900 mt-1">$ 4,500</p>
                </div>
              </div>
              <span className="text-[13px] font-sans font-medium text-gray-400">(+ 20% Increase)</span>
            </div>

            {/* Total Expense Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white">
                  <Wallet size={20} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-[14px] font-sans font-bold text-gray-900">Total Expense</p>
                  <p className="text-[14px] font-sans font-bold text-gray-900 mt-1">$ 2,500</p>
                </div>
              </div>
              <span className="text-[13px] font-sans font-medium text-gray-400">(+ 30% Increase)</span>
            </div>
          </div>
        </div>

        {/* ROW 2 */}
        {/* Daily Selling */}
        <div className="col-span-12 lg:col-span-7 bg-white rounded-[20px] p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-heading font-bold text-gray-900 mb-8">Daily Selling</h3>
          
          <div className="relative h-[250px] w-full mt-4 flex">
            {/* Y-Axis Labels */}
            <div className="flex flex-col justify-between h-full pr-4 text-[12px] font-sans font-bold text-gray-900 pb-[10px]">
              <span>20000</span>
              <span>15000</span>
              <span>10000</span>
              <span>5000</span>
            </div>
            
            {/* Chart Area */}
            <div className="relative flex-1 h-full border-b border-gray-200">
              {/* Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between pb-[10px]">
                <div className="w-full h-px bg-gray-200"></div>
                <div className="w-full h-px bg-gray-200"></div>
                <div className="w-full h-px bg-gray-200"></div>
                <div className="w-full h-px bg-transparent"></div> {/* bottom line handled by border-b */}
              </div>

              {/* Area Chart SVG */}
              <svg viewBox="0 0 1000 240" className="absolute inset-0 w-full h-full preserve-3d" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#F97316" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#F97316" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                
                {/* Smooth Curve */}
                <path 
                  d="M 0 100 C 100 160, 150 140, 250 120 C 350 100, 450 170, 500 160 C 550 150, 600 80, 650 90 C 750 110, 850 180, 950 100 L 1000 90 L 1000 240 L 0 240 Z" 
                  fill="url(#orangeGradient)" 
                />
                <path 
                  d="M 0 100 C 100 160, 150 140, 250 120 C 350 100, 450 170, 500 160 C 550 150, 600 80, 650 90 C 750 110, 850 180, 950 100 L 1000 90" 
                  fill="none" 
                  stroke="#F97316" 
                  strokeWidth="3" 
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Best Dishes */}
        <div className="col-span-12 lg:col-span-5 bg-white rounded-[20px] p-6 shadow-sm border border-gray-100 flex flex-col">
          <h3 className="text-lg font-heading font-bold text-gray-900 mb-6">Best Dishes</h3>
          
          <div className="flex justify-between items-center text-[14px] font-sans font-bold text-gray-400 mb-4 px-1">
            <span>Dishes</span>
            <span>Orders</span>
          </div>

          <div className="flex-1 space-y-4">
            {[
              { name: 'Grill Sandwich', price: '$30.00', orders: 200, img: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' },
              { name: 'Chicken Popeyes', price: '$20.00', orders: 400, img: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' },
              { name: 'Bison Burgers', price: '$50.00', orders: 250, img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' },
              { name: 'Grill Sandwich', price: '$30.00', orders: 100, img: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' },
            ].map((dish, i) => (
              <div key={i} className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden relative shadow-sm border border-gray-100">
                    <img src={dish.img} alt={dish.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-[14px] font-sans font-bold text-gray-900">{dish.name}</p>
                    <p className="text-[13px] font-sans font-bold text-orange-500 mt-0.5">{dish.price}</p>
                  </div>
                </div>
                <span className="text-[15px] font-sans font-bold text-gray-900">{dish.orders}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
