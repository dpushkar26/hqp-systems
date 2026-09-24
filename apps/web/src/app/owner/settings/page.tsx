'use client';

import { Save, User, Hotel, Bell, Shield, Wallet } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
      <div>
        <h1 className="text-3xl font-serif text-gray-900 tracking-tight">Settings</h1>
        <p className="text-sm text-gray-500 font-light mt-1">Configure your hotel and account preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Settings Navigation */}
        <div className="w-full md:w-64 shrink-0 space-y-1">
          {[
            { name: 'Hotel Profile', icon: Hotel, active: true },
            { name: 'Payment Gateway', icon: Wallet, active: false },
            { name: 'Notifications', icon: Bell, active: false },
            { name: 'Security', icon: Shield, active: false },
            { name: 'My Account', icon: User, active: false },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button key={item.name} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm font-medium ${item.active ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                <Icon size={18} strokeWidth={item.active ? 2 : 1.5} />
                {item.name}
              </button>
            )
          })}
        </div>

        {/* Settings Content */}
        <div className="flex-1 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Hotel Profile</h3>
            
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Hotel Name</label>
                <input type="text" defaultValue="Demo Hotel" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all" />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                <textarea rows={3} defaultValue="The finest multi-cuisine restaurant in town." className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Contact Email</label>
                  <input type="email" defaultValue="admin@demohotel.com" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Phone Number</label>
                  <input type="text" defaultValue="+91 98765 43210" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all" />
                </div>
              </div>

              <div className="pt-4 flex justify-end border-t border-gray-50 mt-6">
                <button type="submit" className="bg-gray-900 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-[#9ca986] transition-colors flex items-center gap-2">
                  <Save size={16} /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
