'use client';

import { usePathname } from 'next/navigation';
import { CardNav, CardNavItem } from '@/components/ui/card-nav';
import React, { useEffect, useState } from 'react';

export function GlobalCardNav() {
  const pathname = usePathname() || '/';
  
  // Need to delay rendering slightly to ensure pathname is available on client
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;
  
  const isOwner = pathname.startsWith('/owner');
  const isGuest = pathname.includes('/menu') && !isOwner || pathname.includes('/cart') || pathname.includes('/order-status');
  const isLanding = !isOwner && !isGuest;

  const LogoSlot = (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-white font-serif text-lg tracking-tighter">
        A
      </div>
      <span className="font-serif text-gray-900 text-2xl tracking-tight hidden sm:block">Area</span>
    </div>
  );

  let items: CardNavItem[] = [];

  if (isOwner) {
    items = [
      {
        label: "Restaurant",
        bgColor: "#111827", // gray-900
        textColor: "#fff",
        links: [
          { label: "Live Orders", href: "/owner/orders", ariaLabel: "Live Orders" },
          { label: "Menu Editor", href: "/owner/menu", ariaLabel: "Menu Editor" }
        ]
      },
      {
        label: "Guests", 
        bgColor: "#374151", // gray-700
        textColor: "#fff",
        links: [
          { label: "VIP Loyalty", href: "/owner/loyalty", ariaLabel: "VIP Loyalty" }
        ]
      },
      {
        label: "Finance",
        bgColor: "#9ca986", // brand olive
        textColor: "#111827",
        links: [
          { label: "Daily Payments", href: "/owner/payments", ariaLabel: "Payments" },
        ]
      }
    ];
  } else if (isGuest) {
    const pathParts = pathname.split('/').filter(Boolean);
    const hotelId = pathParts[0] !== 'owner' ? pathParts[0] : 'demo-hotel';
    
    items = [
      {
        label: "Dining",
        bgColor: "#111827", 
        textColor: "#fff",
        links: [
          { label: "View Menu", href: `/${hotelId}/menu`, ariaLabel: "View Menu" },
        ]
      },
      {
        label: "Order", 
        bgColor: "#374151", 
        textColor: "#fff",
        links: [
          { label: "Your Cart", href: `/${hotelId}/cart`, ariaLabel: "Your Cart" },
        ]
      },
      {
        label: "Service",
        bgColor: "#9ca986", 
        textColor: "#111827",
        links: [
          { label: "Live Status", href: `/${hotelId}/order-status`, ariaLabel: "Order Status" },
        ]
      }
    ];
  } else {
    // Landing
    items = [
      {
        label: "Platform",
        bgColor: "#111827", 
        textColor: "#fff",
        links: [
          { label: "Features", href: "/features", ariaLabel: "Features" },
          { label: "How it Works", href: "/how-it-works", ariaLabel: "How it Works" }
        ]
      },
      {
        label: "Business", 
        bgColor: "#374151", 
        textColor: "#fff",
        links: [
          { label: "Pricing", href: "/pricing", ariaLabel: "Pricing" },
          { label: "Contact Sales", href: "/contact", ariaLabel: "Contact Sales" }
        ]
      },
      {
        label: "Portal",
        bgColor: "#9ca986", 
        textColor: "#111827",
        links: [
          { label: "Dashboard Login", href: "/owner/login", ariaLabel: "Login" },
        ]
      }
    ];
  }

  return (
    <CardNav
      logoNode={LogoSlot}
      items={items}
      baseColor="#ffffff"
      menuColor="#111827"
      buttonBgColor="#111827"
      buttonTextColor="#ffffff"
      ease="power3.out"
    />
  );
}
