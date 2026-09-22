'use client';

import { MOCK_MENU_ITEMS, MOCK_CATEGORIES } from '@/lib/mockData';
import { useState } from 'react';
import { Edit2, Plus } from 'lucide-react';

export default function MenuEditorPage() {
  const [items, setItems] = useState(MOCK_MENU_ITEMS);

  const toggleAvailability = (id: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, isAvailable: !item.isAvailable } : item));
  };

  return (
    <div className="space-y-12 font-sans">
      <div className="flex justify-between items-end border-b border-gray-100 pb-8">
        <h1 className="text-4xl tracking-tight text-gray-900 leading-none">Menu Editor</h1>
        <button className="bg-gray-900 text-white px-6 py-3 rounded-full text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-[#9ca986] transition-colors">
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-[10px] uppercase tracking-widest text-gray-500">
                <th className="p-6 font-normal">Item Name</th>
                <th className="p-6 font-normal">Category</th>
                <th className="p-6 font-normal">Price</th>
                <th className="p-6 font-normal">Status</th>
                <th className="p-6 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {items.map(item => {
                const category = MOCK_CATEGORIES.find(c => c.id === item.categoryId);
                return (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-6 text-gray-900 flex items-center gap-3">
                      <span className={`w-3 h-3 rounded-sm border flex items-center justify-center ${item.isVeg ? 'border-green-600' : 'border-red-600'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`}></span>
                      </span>
                      {item.name.en}
                    </td>
                    <td className="p-6 text-gray-500 text-xs uppercase tracking-widest">{category?.name.en}</td>
                    <td className="p-6 text-gray-900">₹{item.price}</td>
                    <td className="p-6">
                      <label className="relative inline-flex items-center cursor-pointer group">
                        <input type="checkbox" className="sr-only peer" checked={item.isAvailable} onChange={() => toggleAvailability(item.id)} />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#9ca986] group-hover:opacity-80 transition-opacity"></div>
                        <span className="ml-3 text-[10px] uppercase tracking-widest text-gray-500">{item.isAvailable ? 'In Stock' : 'Sold Out'}</span>
                      </label>
                    </td>
                    <td className="p-6 text-right">
                      <button className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
                        <Edit2 className="w-4 h-4" strokeWidth={1.5} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
