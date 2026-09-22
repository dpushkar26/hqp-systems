'use client';

import { MOCK_ORDERS } from '@/lib/mockData';
import { useState, useEffect } from 'react';
import { Clock, Check } from 'lucide-react';

export default function OrdersPage() {
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [activeTab, setActiveTab] = useState<'PENDING' | 'PREPARING' | 'SERVED'>('PENDING');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      // Real-time capability mock
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const updateOrderStatus = (orderId: string, newStatus: any) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const filteredOrders = orders.filter(o => o.status === activeTab);

  return (
    <div className="space-y-12 font-sans">
      <div className="flex justify-between items-end border-b border-gray-100 pb-8">
        <h1 className="text-4xl tracking-tight text-gray-900 leading-none">Live Orders</h1>
        <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 border border-gray-100 rounded-full">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#9ca986] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#9ca986]"></span>
          </span>
          <span className="text-[10px] text-gray-500 uppercase tracking-widest">Connected</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-8 border-b border-gray-100">
        {(['PENDING', 'PREPARING', 'SERVED'] as const).map(status => {
          const count = orders.filter(o => o.status === status).length;
          return (
            <button
              key={status}
              onClick={() => setActiveTab(status)}
              className={`pb-4 text-[10px] uppercase tracking-widest border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === status
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-400 hover:text-gray-900'
              }`}
            >
              {status} {count > 0 && <span className={`py-0.5 px-2 rounded-full text-[10px] ${activeTab === status ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-500 border border-gray-100'}`}>{count}</span>}
            </button>
          );
        })}
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {filteredOrders.length === 0 ? (
          <div className="col-span-full py-24 text-center border border-dashed border-gray-200 rounded-2xl">
            <p className="text-gray-400 uppercase tracking-widest text-[10px]">No {activeTab.toLowerCase()} orders right now.</p>
          </div>
        ) : (
          filteredOrders.map(order => (
            <div key={order.id} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start border-b border-gray-50 pb-4">
                <div>
                  <div className="text-xl tracking-tight text-gray-900 mb-1">Room {order.tableNumber}</div>
                  <div className="text-[10px] uppercase tracking-widest text-gray-400 flex items-center gap-1.5 mt-1">
                    <Clock className="w-3 h-3 text-gray-400" strokeWidth={1.5} /> 
                    {mounted ? new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </div>
                </div>
                <div className="text-right">
                  <div className="tracking-tight text-xl text-gray-900">₹{order.total}</div>
                  <div className="text-[8px] px-2 py-1 rounded bg-gray-50 text-gray-500 border border-gray-100 mt-1 inline-block uppercase tracking-widest">
                    {order.paymentMode}
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-xs text-gray-500 flex-1">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-end border-b border-dashed border-gray-100 pb-2 last:border-0 last:pb-0">
                    <span className="flex gap-2">
                      <span className="text-gray-900">{item.quantity}x</span> 
                      <span>Item {item.menuItemId}</span>
                    </span>
                    <span className="text-gray-900">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-gray-50 flex gap-4 mt-auto">
                {order.status === 'PENDING' && (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'PREPARING')}
                    className="w-full bg-gray-900 text-white uppercase tracking-widest text-[10px] py-3 rounded-xl hover:bg-[#9ca986] transition-colors"
                  >
                    Accept Order
                  </button>
                )}
                {order.status === 'PREPARING' && (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'SERVED')}
                    className="w-full bg-white text-gray-900 border border-gray-200 uppercase tracking-widest text-[10px] py-3 rounded-xl hover:bg-gray-50 transition-colors flex justify-center items-center gap-2"
                  >
                    <Check className="w-4 h-4" strokeWidth={1.5} /> Mark Served
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
