'use client';

import { useState } from 'react';
import { MOCK_MENU_ITEMS, MOCK_CATEGORIES } from '@/lib/mockData';
import { Plus, Search, Edit2, Trash2, Filter } from 'lucide-react';

export default function MenuManagementPage() {
  const [items, setItems] = useState(MOCK_MENU_ITEMS);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = items.filter(item => 
    item.name.en.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-serif text-gray-900 tracking-tight">Menu & Items</h1>
          <p className="text-sm text-gray-500 font-light mt-1">Manage your restaurant offerings and prices.</p>
        </div>
        <button className="bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#9ca986] transition-colors flex items-center gap-2 shadow-sm">
          <Plus size={18} /> Add New Item
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search items..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 w-full sm:w-auto justify-center">
              <Filter size={16} /> Filter
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="text-[10px] uppercase tracking-widest text-gray-400 bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 font-medium">Item Name</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filteredItems.map((item) => {
                const category = MOCK_CATEGORIES.find(c => c.id === item.categoryId)?.name.en || 'Uncategorized';
                return (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-green-500' : 'bg-red-500'}`} />
                      {item.name.en}
                    </td>
                    <td className="px-6 py-4 text-gray-500">{category}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">₹{item.price}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-widest font-medium ${item.isVeg ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                        {item.isVeg ? 'Veg' : 'Non-Veg'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked={item.isAvailable} />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gray-900"></div>
                      </label>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                          <Edit2 size={16} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {filteredItems.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              No items found matching your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
