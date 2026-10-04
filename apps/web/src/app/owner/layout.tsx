'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, ClipboardList, Menu, QrCode, Bell, User, Send, Settings } from 'lucide-react';
import AuthLayout from '@/components/owner/AuthLayout';

const SIDEBAR_ITEMS = [
  { name: 'Home', href: '/owner/home', icon: Home },
  { name: 'Dashboard', href: '/owner/dashboard', icon: LayoutGrid },
  { name: 'Orders', href: '/owner/orders', icon: ClipboardList },
  { name: 'Menu', href: '/owner/menu', icon: Menu },
  { name: 'Tables', href: '/owner/tables', icon: QrCode },
  { name: 'Notifications', href: '/owner/notifications', icon: Bell },
  { name: 'Profile', href: '/owner/profile', icon: User },
  { name: 'Messages', href: '/owner/messages', icon: Send },
  { name: 'Settings', href: '/owner/settings', icon: Settings },
];

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === '/owner/login' || pathname === '/owner/register' || pathname === '/owner/forgot-password') {
    return <AuthLayout>{children}</AuthLayout>;
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Thin Sidebar - Fixed */}
      <div className="fixed top-0 left-0 w-[80px] h-screen bg-white flex flex-col items-center py-6 border-r border-gray-100 z-50">
        
        {/* Logo */}
        <div className="mb-10 cursor-pointer">
          <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white transform -rotate-12">
            <span className="font-bold text-xl leading-none rotate-12">S</span>
          </div>
        </div>

        {/* Nav Items */}
        <div className="flex flex-col items-center gap-8 flex-1">
          {SIDEBAR_ITEMS.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="relative group flex items-center justify-center w-full"
                title={item.name}
              >
                <div className="flex flex-col items-center justify-center">
                  <Icon 
                    size={24} 
                    strokeWidth={isActive ? 2.5 : 2} 
                    className={`transition-colors ${isActive ? 'text-orange-500' : 'text-gray-400 group-hover:text-gray-600'}`} 
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <main className="ml-[80px] bg-white min-h-screen">
        {children}
      </main>
    </div>
  );
}
