'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const mockOrders = [
  {
    id: '#20235',
    tableNo: 20,
    guest: 4,
    paymentStatus: 'Paid',
    total: '$230',
    customer: 'Moanees',
    customerFullName: 'Sarah Moanees',
    paymentMethod: 'Cash',
    items: [
      { name: 'Grill Sandwich', qty: 2, price: '$60.00', img: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' },
      { name: 'Chicken Popeyes', qty: 3, price: '$60.00', img: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' },
      { name: 'Bison Burgers', qty: 4, price: '$250.00', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' },
      { name: 'Grill Sandwich', qty: 2, price: '$60.00', img: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' },
    ]
  },
  {
    id: '#20236',
    tableNo: 20,
    guest: 4,
    paymentStatus: 'Unpaid',
    total: '$230',
    customer: 'John Doe',
    customerFullName: 'John Doe',
    paymentMethod: '-',
    items: []
  },
  {
    id: '#20237',
    tableNo: 20,
    guest: 4,
    paymentStatus: 'Paid',
    total: '$230',
    customer: 'Alice',
    customerFullName: 'Alice Smith',
    paymentMethod: 'Card',
    items: []
  },
  {
    id: '#20238',
    tableNo: 20,
    guest: 4,
    paymentStatus: 'Unpaid',
    total: '$230',
    customer: 'Bob',
    customerFullName: 'Bob Brown',
    paymentMethod: '-',
    items: []
  },
  {
    id: '#20239',
    tableNo: 20,
    guest: 4,
    paymentStatus: 'Paid',
    total: '$230',
    customer: 'Charlie',
    customerFullName: 'Charlie',
    paymentMethod: 'Cash',
    items: []
  }
];

export default function OrdersPage() {
  const [activeOrderId, setActiveOrderId] = useState<string>('#20235');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const activeOrder = mockOrders.find(o => o.id === activeOrderId);

  return (
    <div className="w-full h-full text-gray-900 p-8 flex flex-col font-sans bg-white relative">
      <h1 className="text-3xl font-heading font-bold text-gray-900 mb-8">Pending Order</h1>

      <div className="flex gap-10 flex-1 overflow-hidden">
        
        {/* Left Pane - Order List */}
        <div className="w-[350px] bg-white border border-gray-100 rounded-xl flex flex-col flex-shrink-0 shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-[18px] font-heading font-bold text-gray-900">All Orders</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {mockOrders.map(order => {
              const isActive = activeOrderId === order.id;
              
              return (
                <div 
                  key={order.id}
                  onClick={() => setActiveOrderId(order.id)}
                  className={`p-5 rounded-xl cursor-pointer transition-all ${
                    isActive 
                      ? 'bg-orange-500 shadow-md' 
                      : 'bg-[#F9FAFB] hover:bg-gray-100 border border-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className={`text-[16px] font-bold ${isActive ? 'text-white' : 'text-gray-900'}`}>
                      Order {order.id}
                    </span>
                    <span className={`text-[13px] font-bold ${
                      isActive 
                        ? 'text-white' 
                        : order.paymentStatus === 'Paid' ? 'text-[#22C55E]' : 'text-orange-500'
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-[13px] font-medium ${isActive ? 'text-white/90' : 'text-gray-500'}`}>
                      Table : {order.tableNo} Guest : {order.guest}
                    </span>
                    <span className={`text-[16px] font-bold ${isActive ? 'text-white' : 'text-gray-900'}`}>
                      {order.total}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Pane - Order Details */}
        <div className="flex-1 flex flex-col pr-8">
          {activeOrder ? (
            <>
              {/* Header */}
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-heading font-bold text-gray-900">Order {activeOrder.id}</h2>
                <span className={`text-[16px] font-bold ${
                  activeOrder.paymentStatus === 'Paid' ? 'text-[#22C55E]' : 'text-orange-500'
                }`}>
                  {activeOrder.paymentStatus}
                </span>
              </div>

              {/* Details Grid */}
              <div className="mb-10">
                <h3 className="text-[16px] font-bold text-gray-900 mb-6 font-heading">Details</h3>
                <div className="grid grid-cols-4 gap-4 border-b border-gray-100 pb-8">
                  <div>
                    <p className="text-[13px] font-bold text-gray-400 mb-2">Table No</p>
                    <p className="text-[15px] font-bold text-gray-900">{activeOrder.tableNo}</p>
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-gray-400 mb-2">Guest</p>
                    <p className="text-[15px] font-bold text-gray-900">{activeOrder.guest}</p>
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-gray-400 mb-2">Customer</p>
                    <p className="text-[15px] font-bold text-gray-900">{activeOrder.customer}</p>
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-gray-400 mb-2">Payment</p>
                    <p className="text-[15px] font-bold text-gray-900">{activeOrder.paymentMethod}</p>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto min-h-0">
                <h3 className="text-[16px] font-bold text-gray-900 mb-6 font-heading">Orders</h3>
                
                {activeOrder.items.length > 0 ? (
                  <div className="space-y-4">
                    {activeOrder.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between border border-gray-100 rounded-xl p-3 pr-6 bg-white shadow-sm">
                        <div className="flex items-center gap-6">
                          <img src={item.img} alt={item.name} className="w-[72px] h-[72px] rounded-lg object-cover" />
                          <div className="flex items-center gap-3">
                            <span className="text-[15px] font-bold text-gray-900">{item.name}</span>
                            <span className="text-[15px] font-bold text-gray-900">x {item.qty}</span>
                          </div>
                        </div>
                        <span className="text-[16px] font-bold text-orange-500">{item.price}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-gray-400 font-bold text-[16px]">No Order Details</p>
                  </div>
                )}
              </div>

              {/* Action Button */}
              {activeOrder.items.length > 0 && (
                <div className="mt-8 pt-4">
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="w-full bg-orange-500 text-white rounded-xl py-4 font-bold text-[16px] hover:bg-orange-600 transition-colors shadow-[0_4px_14px_rgba(249,115,22,0.3)]"
                  >
                    Print Invoice
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex justify-center items-center">
              <p className="text-gray-400 font-bold text-[16px]">No Order Details</p>
            </div>
          )}
        </div>
      </div>

      {/* Invoice Modal Overlay */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-[24px] shadow-2xl w-full max-w-md overflow-hidden relative"
            >
              {/* Decorative background element like in the image (faint leaf/shadow) */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-multiply"></div>

              <div className="p-8 relative z-10">
                <h2 className="text-2xl font-heading font-bold text-gray-900 mb-8">Order {activeOrder?.id}</h2>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between">
                    <span className="text-[14px] font-bold text-gray-900">Customer Name</span>
                    <span className="text-[14px] font-bold text-gray-900">{activeOrder?.customerFullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[14px] font-bold text-gray-900">Guest</span>
                    <span className="text-[14px] font-bold text-gray-900">{activeOrder?.guest}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[14px] font-bold text-gray-900">Payment</span>
                    <span className="text-[14px] font-bold text-gray-900">{activeOrder?.paymentMethod}</span>
                  </div>
                </div>

                <div className="border-t border-b border-gray-100 py-6 space-y-4 mb-6">
                  {activeOrder?.items.map((item, idx) => (
                    <div key={idx} className="flex items-center text-[13px] font-bold text-gray-900">
                      <span className="w-8">{idx + 1}).</span>
                      <span className="flex-1">{item.name}</span>
                      <span className="w-12 text-center">{item.qty}</span>
                      <span className="w-20 text-right">{item.price}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 mb-8">
                  <div className="flex justify-between">
                    <span className="text-[14px] font-bold text-gray-900">Subtotal</span>
                    <span className="text-[14px] font-bold text-gray-900">$430.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[14px] font-bold text-gray-400">Tax</span>
                    <span className="text-[14px] font-bold text-gray-400">$2.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[14px] font-bold text-gray-400">Charges</span>
                    <span className="text-[14px] font-bold text-gray-400">$8.00</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-8 border-t border-gray-100 pt-6">
                  <span className="text-[18px] font-bold text-gray-900">Total</span>
                  <span className="text-[18px] font-bold text-gray-900">$440.00</span>
                </div>

                <div className="flex justify-center">
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="w-48 bg-orange-500 text-white rounded-xl py-3.5 font-bold text-[15px] hover:bg-orange-600 transition-colors shadow-[0_4px_14px_rgba(249,115,22,0.3)]"
                  >
                    Print Invoice
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
