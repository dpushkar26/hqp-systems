'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CalendarDays, ShoppingBag, UtensilsCrossed, QrCode, MessageSquare, Box, DollarSign, Star, Settings, LogOut, Search } from 'lucide-react';

const SIDEBAR_ITEMS = [
  { name: 'Dashboard', href: '/owner/dashboard', icon: LayoutDashboard },
  { name: 'Live Orders', href: '/owner/orders', icon: ShoppingBag },
  { name: 'Menu & Items', href: '/owner/menu', icon: UtensilsCrossed },
  { name: 'QR & Tables', href: '/owner/tables', icon: QrCode },
  { name: 'Reservation', href: '/owner/reservation', icon: CalendarDays },
  { name: 'Inventory', href: '/owner/inventory', icon: Box },
  { name: 'Financials', href: '/owner/financials', icon: DollarSign },
  { name: 'Reviews', href: '/owner/reviews', icon: Star },
];

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === '/owner/login' || pathname === '/owner/register') {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-[#F7F8FA] font-sans overflow-hidden">
      {/* Sidebar - White, Rounded corners like the image */}
      <div className="w-[260px] bg-white flex flex-col my-4 ml-4 rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] shrink-0 overflow-hidden">
        
        {/* Logo */}
        <div className="flex items-center px-8 py-8 gap-3">
          <div className="w-6 h-6 rounded-full bg-[#FF8C00] relative overflow-hidden flex-shrink-0">
             <div className="absolute inset-0 bg-white/30 w-1/2 h-full rounded-r-full transform translate-x-1/2"></div>
          </div>
          <span className="text-[20px] font-bold tracking-tight text-gray-900">Venu</span>
        </div>

        {/* Search bar in sidebar */}
        <div className="px-6 mb-6">
          <div className="bg-[#F7F8FA] rounded-2xl px-4 py-3 flex items-center gap-3 focus-within:ring-2 focus-within:ring-[#FF8C00]/20 transition-all">
            <Search size={16} className="text-gray-400" />
            <input type="text" placeholder="Search" className="bg-transparent border-none outline-none text-[13px] w-full placeholder:text-gray-400 text-gray-900" />
          </div>
        </div>

        {/* Nav Items */}
        <div className="flex-1 overflow-y-auto px-4 space-y-1">
          {SIDEBAR_ITEMS.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all text-[14px] font-medium ${
                  isActive 
                    ? 'text-gray-900 shadow-sm relative' 
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50/50'
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#FF8C00] rounded-r-full"></div>
                )}
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "text-[#FF8C00]" : "text-gray-400"} />
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* User Profile & Settings */}
        <div className="p-6 mt-auto">
          <div className="flex items-center gap-3 mb-6">
            <img src="https://ui-avatars.com/api/?name=Gustavo+Xavier&background=f3f4f6&color=000" alt="Avatar" className="w-10 h-10 rounded-full" />
            <div>
              <p className="text-[14px] font-semibold text-gray-900 leading-tight">Gustavo Xavier</p>
              <div className="bg-[#FFF4E5] text-[#FF8C00] text-[10px] font-bold px-2 py-0.5 rounded-md inline-block mt-1">Admin</div>
            </div>
          </div>
          <div className="space-y-1">
            <button className="flex items-center gap-3 px-2 py-2.5 w-full text-[14px] font-medium text-gray-600 hover:text-gray-900 transition-colors">
              <Settings size={18} className="text-gray-400" />
              Settings
            </button>
            <button className="flex items-center gap-3 px-2 py-2.5 w-full text-[14px] font-medium text-red-500 hover:text-red-600 transition-colors">
              <LogOut size={18} className="text-red-400" />
              Log out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar">
        <div className="max-w-[1400px] mx-auto h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
