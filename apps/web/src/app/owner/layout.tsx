import React from 'react';

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="w-full h-full min-h-screen bg-gray-50 pt-8">
      <div className="p-4 md:p-12 max-w-7xl mx-auto h-full">
        {children}
      </div>
    </main>
  );
}
