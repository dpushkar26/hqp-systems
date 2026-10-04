'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, Download, Settings as SettingsIcon, Users, Clock, DollarSign, X } from 'lucide-react';

const initialTables = [
  { id: 'T01', name: 'Table 01', capacity: 4, status: 'Occupied', guests: 3, currentBill: '$145.00', timeSeated: '45 mins', url: 'https://hqsp.vercel.app/table/T01' },
  { id: 'T02', name: 'Table 02', capacity: 2, status: 'Available', guests: 0, currentBill: '$0.00', timeSeated: '-', url: 'https://hqsp.vercel.app/table/T02' },
  { id: 'T03', name: 'Table 03', capacity: 6, status: 'Occupied', guests: 5, currentBill: '$320.00', timeSeated: '1h 20m', url: 'https://hqsp.vercel.app/table/T03' },
  { id: 'T04', name: 'Table 04', capacity: 4, status: 'Available', guests: 0, currentBill: '$0.00', timeSeated: '-', url: 'https://hqsp.vercel.app/table/T04' },
  { id: 'P01', name: 'Patio 01', capacity: 8, status: 'Occupied', guests: 8, currentBill: '$560.00', timeSeated: '2h 10m', url: 'https://hqsp.vercel.app/table/P01' },
  { id: 'P02', name: 'Patio 02', capacity: 4, status: 'Available', guests: 0, currentBill: '$0.00', timeSeated: '-', url: 'https://hqsp.vercel.app/table/P02' },
];

export default function TablesPage() {
  const [tables, setTables] = useState(initialTables);
  const [settingsModalId, setSettingsModalId] = useState<string | null>(null);

  // Form state for settings
  const [editForm, setEditForm] = useState({ name: '', capacity: 4, url: '' });

  const activeTable = tables.find(t => t.id === settingsModalId);

  const openSettings = (table: any) => {
    setEditForm({ name: table.name, capacity: table.capacity, url: table.url });
    setSettingsModalId(table.id);
  };

  const handleSaveSettings = () => {
    setTables(tables.map(t => t.id === settingsModalId ? {
      ...t,
      name: editForm.name,
      capacity: editForm.capacity,
      url: editForm.url
    } : t));
    setSettingsModalId(null);
  };

  // Stats calculations
  const totalTables = tables.length;
  const activeTables = tables.filter(t => t.status === 'Occupied').length;
  const totalRevenue = tables.reduce((acc, curr) => {
    return acc + parseFloat(curr.currentBill.replace('$', ''));
  }, 0).toFixed(2);

  return (
    <div className="w-full text-gray-900 p-8 font-sans bg-white relative min-h-screen">
      
      {/* Header & Stats */}
      <div className="mb-10">
        <h1 className="text-3xl font-heading font-bold text-gray-900 mb-8">Tables & QR Codes</h1>
        
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-center gap-6">
            <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center text-gray-900">
              <QrCode size={24} strokeWidth={2} />
            </div>
            <div>
              <p className="text-[14px] text-gray-400 font-medium mb-1">Total Tables</p>
              <h3 className="text-3xl font-heading font-bold text-gray-900">{totalTables}</h3>
            </div>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-center gap-6">
            <div className="w-14 h-14 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500">
              <Users size={24} strokeWidth={2} />
            </div>
            <div>
              <p className="text-[14px] text-gray-400 font-medium mb-1">Active Tables</p>
              <h3 className="text-3xl font-heading font-bold text-gray-900">{activeTables}</h3>
            </div>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-center gap-6">
            <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center text-[#22C55E]">
              <DollarSign size={24} strokeWidth={2} />
            </div>
            <div>
              <p className="text-[14px] text-gray-400 font-medium mb-1">Current Live Revenue</p>
              <h3 className="text-3xl font-heading font-bold text-gray-900">${totalRevenue}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-12">
        {tables.map(table => (
          <div key={table.id} className="bg-white border border-gray-100 rounded-[20px] shadow-sm p-6 hover:shadow-md transition-shadow">
            
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-heading font-bold text-gray-900">{table.name}</h2>
              <span className={`px-3 py-1.5 rounded-lg text-[13px] font-medium ${
                table.status === 'Occupied' ? 'bg-orange-50 text-orange-500' : 'bg-gray-50 text-gray-400'
              }`}>
                {table.status}
              </span>
            </div>

            <div className="flex gap-6 mb-8">
              {/* Stats Column */}
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <Users size={16} className="text-gray-400" />
                  <span className="text-[14px] font-medium text-gray-900">Capacity: {table.capacity}</span>
                </div>
                {table.status === 'Occupied' && (
                  <>
                    <div className="flex items-center gap-3">
                      <Clock size={16} className="text-gray-400" />
                      <span className="text-[14px] font-medium text-gray-900">{table.timeSeated}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <DollarSign size={16} className="text-gray-400" />
                      <span className="text-[14px] font-medium text-[#22C55E]">{table.currentBill}</span>
                    </div>
                  </>
                )}
                {table.status === 'Available' && (
                  <div className="text-[14px] font-medium text-gray-400 mt-4">
                    Ready for guests
                  </div>
                )}
              </div>

              {/* QR Code Column */}
              <div className="w-[100px] h-[100px] rounded-2xl bg-white border border-gray-200 p-2 shadow-sm shrink-0">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(table.url)}`} 
                  alt={`QR for ${table.name}`}
                  className="w-full h-full"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                className="flex-1 flex items-center justify-center gap-2 bg-gray-900 text-white py-3 rounded-xl text-[14px] font-medium hover:bg-black transition-colors"
                onClick={() => window.open(`https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=${encodeURIComponent(table.url)}`, '_blank')}
              >
                <Download size={16} />
                Download QR
              </button>
              <button 
                onClick={() => openSettings(table)}
                className="w-[50px] h-[50px] flex items-center justify-center bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors shrink-0"
              >
                <SettingsIcon size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Advanced Settings Modal */}
      <AnimatePresence>
        {settingsModalId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-[24px] shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="text-xl font-heading font-bold text-gray-900 flex items-center gap-3">
                  <SettingsIcon className="text-gray-400" />
                  Table Configuration
                </h3>
                <button onClick={() => setSettingsModalId(null)} className="text-gray-400 hover:text-gray-900 transition-colors">
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-8 space-y-6">
                <div className="space-y-3">
                  <label className="block text-[14px] font-medium text-gray-900">Table Name / Identifier</label>
                  <input 
                    type="text" 
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    className="w-full border border-gray-200 rounded-xl p-3.5 text-[14px] text-gray-900 font-medium outline-none focus:border-orange-500 transition-colors" 
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-[14px] font-medium text-gray-900">Seating Capacity</label>
                  <input 
                    type="number" 
                    value={editForm.capacity}
                    onChange={(e) => setEditForm({...editForm, capacity: parseInt(e.target.value) || 0})}
                    className="w-full border border-gray-200 rounded-xl p-3.5 text-[14px] text-gray-900 font-medium outline-none focus:border-orange-500 transition-colors" 
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-[14px] font-medium text-gray-900">QR Code Target URL (Advanced)</label>
                  <input 
                    type="text" 
                    value={editForm.url}
                    onChange={(e) => setEditForm({...editForm, url: e.target.value})}
                    className="w-full border border-gray-200 rounded-xl p-3.5 text-[14px] text-gray-500 outline-none focus:border-orange-500 transition-colors font-mono" 
                  />
                  <p className="text-[12px] text-gray-400 font-medium">This URL will be encoded directly into the QR code.</p>
                </div>

                <div className="pt-6 flex gap-4">
                  <button 
                    onClick={handleSaveSettings}
                    className="flex-1 bg-orange-500 text-white rounded-xl py-3.5 font-medium text-[15px] hover:bg-orange-600 transition-colors shadow-[0_4px_14px_rgba(249,115,22,0.3)]"
                  >
                    Save Configuration
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
