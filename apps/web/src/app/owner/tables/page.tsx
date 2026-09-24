'use client';

import { QrCode, Plus, Download, Trash2, Edit2 } from 'lucide-react';

export default function TablesManagementPage() {
  const tables = [
    { id: 'table-1', name: 'Table 1', capacity: 4, status: 'Active' },
    { id: 'table-2', name: 'Table 2', capacity: 2, status: 'Active' },
    { id: 'table-3', name: 'Table 3', capacity: 6, status: 'Active' },
    { id: 'table-4', name: 'Table 4', capacity: 4, status: 'Inactive' },
    { id: 'table-5', name: 'Table 5', capacity: 8, status: 'Active' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-serif text-gray-900 tracking-tight">QR Codes & Tables</h1>
          <p className="text-sm text-gray-500 font-light mt-1">Manage your tables and print QR codes.</p>
        </div>
        <button className="bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#9ca986] transition-colors flex items-center gap-2 shadow-sm">
          <Plus size={18} /> Add Table
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {tables.map((table) => (
          <div key={table.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow flex flex-col group">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{table.name}</h3>
                <p className="text-xs text-gray-500 mt-1">Capacity: {table.capacity} people</p>
              </div>
              <div className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-widest font-medium ${table.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {table.status}
              </div>
            </div>

            <div className="flex-1 flex justify-center items-center py-8">
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 group-hover:scale-105 transition-transform">
                <QrCode size={100} className="text-gray-900" strokeWidth={1} />
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-50 mt-4">
              <button className="flex items-center gap-2 text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors">
                <Download size={14} /> Download QR
              </button>
              <div className="flex gap-2">
                <button className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                  <Edit2 size={16} />
                </button>
                <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
