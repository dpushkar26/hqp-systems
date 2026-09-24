'use client';

import { useState, useEffect } from 'react';
import { Clock, Check } from 'lucide-react';
import { io } from 'socket.io-client';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'PLACED' | 'PREPARING' | 'SERVED'>('PLACED');
  const [mounted, setMounted] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Fetch initial orders
    fetch('/api/orders')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // Format for UI
          const formatted = data.orders.map((o: any) => ({
            id: o.id,
            table: o.table.name,
            items: o.items.map((i: any) => ({ name: i.menuItem.name, quantity: i.quantity })),
            status: o.status,
            paymentStatus: o.paymentStatus,
            time: new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }));
          setOrders(formatted);
        }
      });

    // Connect to Realtime Server
    const socket = io('http://localhost:4000', {
      withCredentials: true,
    });

    socket.on('connect', () => {
      setIsConnected(true);
      // Join the hotel room
      socket.emit('join-room', 'demo-hotel');
    });

    socket.on('disconnect', () => setIsConnected(false));

    socket.on('order:update', (payload) => {
      if (payload.event === 'NEW_ORDER') {
        setOrders(prev => [{
          id: payload.orderId,
          table: payload.table,
          items: payload.items,
          status: payload.status,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          paymentStatus: 'UNPAID'
        }, ...prev]);
      } else if (payload.event === 'PAYMENT_RECEIVED') {
         setOrders(prev => prev.map(o => o.id === payload.orderId ? { ...o, paymentStatus: 'PAID' } : o));
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: any) => {
    // Optimistic UI update
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    
    // Hit the API
    try {
      await fetch('/api/orders/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus })
      });
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const filteredOrders = orders.filter(o => o.status === activeTab);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans">
      <div className="flex justify-between items-end border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-3xl font-serif text-gray-900 tracking-tight">Live Orders</h1>
          <p className="text-sm text-gray-500 font-light mt-1">Manage kitchen tickets and table status.</p>
        </div>
        <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 border border-gray-100 rounded-full">
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isConnected ? 'bg-[#9ca986]' : 'bg-red-500'}`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isConnected ? 'bg-[#9ca986]' : 'bg-red-500'}`}></span>
          </span>
          <span className="text-[10px] text-gray-500 uppercase tracking-widest">{isConnected ? 'Connected' : 'Disconnected'}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-8 border-b border-gray-100">
        {(['PLACED', 'PREPARING', 'SERVED'] as const).map(status => {
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
                  <div className="text-xl tracking-tight text-gray-900 mb-1">{order.table}</div>
                  <div className="text-[10px] uppercase tracking-widest text-gray-400 flex items-center gap-1.5 mt-1">
                    <Clock className="w-3 h-3 text-gray-400" strokeWidth={1.5} /> 
                    {mounted ? order.time : ''}
                  </div>
                </div>
                <div className="text-right flex flex-col items-end">
                  <div className="text-[10px] uppercase tracking-widest font-medium mb-1">
                    {order.paymentStatus === 'PAID' ? <span className="text-green-600 bg-green-50 px-2 py-1 rounded">Paid</span> : <span className="text-red-500 bg-red-50 px-2 py-1 rounded">Unpaid</span>}
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-xs text-gray-500 flex-1">
                {order.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-end border-b border-dashed border-gray-100 pb-2 last:border-0 last:pb-0">
                    <span className="flex gap-2">
                      <span className="text-gray-900">{item.quantity}x</span> 
                      <span>{item.name}</span>
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-gray-50 flex gap-4 mt-auto">
                {order.status === 'PLACED' && (
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
