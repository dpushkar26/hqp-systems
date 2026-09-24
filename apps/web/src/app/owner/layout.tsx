'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CalendarDays, ShoppingBag, UtensilsCrossed, QrCode, Settings, Bell, Search, Menu as MenuIcon, X, MessageSquare, Box, DollarSign, Star, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SIDEBAR_ITEMS = [
  { name: 'Dashboard', href: '/owner/dashboard', icon: LayoutDashboard },
  { name: 'Reservation', href: '/owner/reservation', icon: CalendarDays },
  { name: 'Live Orders', href: '/owner/orders', icon: ShoppingBag },
  { name: 'Menu & Items', href: '/owner/menu', icon: UtensilsCrossed },
  { name: 'QR & Tables', href: '/owner/tables', icon: QrCode },
  { name: 'Messages', href: '/owner/messages', icon: MessageSquare, badge: 7 },
  { name: 'Inventory', href: '/owner/inventory', icon: Box },
  { name: 'Financials', href: '/owner/financials', icon: DollarSign },
  { name: 'Reviews', href: '/owner/reviews', icon: Star },
  { name: 'Settings', href: '/owner/settings', icon: Settings },
];

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // If we are on the login page, don't show the dashboard layout
  if (pathname === '/owner/login') {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-[#F4F7F6] overflow-hidden font-sans">
      
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-900/40 z-40 lg:hidden backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white flex flex-col transform transition-transform duration-300 ease-in-out lg:transform-none shadow-[4px_0_24px_rgba(0,0,0,0.02)] ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center h-20 px-8">
          <Link href="/owner/dashboard" className="flex items-center gap-3">
            <div className="grid grid-cols-2 gap-0.5">
              <div className="w-2.5 h-2.5 bg-[#E1F764] rounded-sm"></div>
              <div className="w-2.5 h-2.5 bg-[#E1F764] opacity-50 rounded-sm"></div>
              <div className="w-2.5 h-2.5 bg-[#E1F764] opacity-70 rounded-sm"></div>
              <div className="w-2.5 h-2.5 bg-[#E1F764] rounded-sm"></div>
            </div>
            <span className="text-xl font-semibold text-gray-900 tracking-tight">Antigravity</span>
          </Link>
          <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden ml-auto text-gray-400 hover:text-gray-900">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5 custom-scrollbar">
          {SIDEBAR_ITEMS.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                  isActive 
                    ? 'bg-[#E1F764] text-gray-900 shadow-sm' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon size={18} strokeWidth={isActive ? 2 : 1.5} className={isActive ? "text-gray-900" : "text-gray-400"} />
                <span>{item.name}</span>
                {item.badge && (
                  <span className="ml-auto bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-20 flex items-center justify-between px-6 lg:px-10 shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-white shadow-sm transition-colors">
              <MenuIcon size={20} />
            </button>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center px-4 py-2.5 bg-white rounded-full w-80 shadow-sm focus-within:ring-2 focus-within:ring-[#E1F764] transition-all">
              <Search className="w-4 h-4 text-gray-400 mr-3" />
              <input type="text" placeholder="Search room, guest, book, etc" className="bg-transparent border-none outline-none text-sm w-full text-gray-900 placeholder:text-gray-400" />
            </div>

            <div className="flex items-center gap-4 border-l border-gray-200 pl-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                  {/* Mock Avatar */}
                  <img src="https://ui-avatars.com/api/?name=Admin+User&background=E1F764&color=000" alt="Admin" className="w-full h-full object-cover" />
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-semibold text-gray-900 leading-tight">Jaylon Dorwart</p>
                  <p className="text-[11px] text-gray-500 font-medium">Admin</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="p-2.5 text-gray-400 hover:text-gray-900 transition-colors rounded-full bg-white shadow-sm">
                  <Settings size={18} />
                </button>
                <button className="relative p-2.5 text-gray-400 hover:text-gray-900 transition-colors rounded-full bg-white shadow-sm">
                  <Bell size={18} />
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar">
          <div className="max-w-[1400px] mx-auto h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
