'use client';

import { useCart } from '@/context/CartContext';
import { ArrowLeft, Plus, Minus, Trash2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CartPage() {
  const { hotelId } = useParams();
  const router = useRouter();
  const { cart, updateQuantity, removeFromCart, total, clearCart } = useCart();
  const [room, setRoom] = useState('');
  const [paymentMode, setPaymentMode] = useState<'ROOM' | 'CARD'>('ROOM');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handlePlaceOrder = () => {
    if (!room) {
      alert('Please enter your room number');
      return;
    }
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      clearCart();
      router.push(`/${hotelId}/order-status`);
    }, 1500);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center font-sans">
        <ShoppingCartIcon />
        <h2 className="text-2xl tracking-tight text-gray-900 mt-8 mb-2">Order is empty</h2>
        <p className="text-gray-500 font-light text-sm mb-10">You haven't added any items to your dining order.</p>
        <Link
          href={`/${hotelId}/menu`}
          className="bg-gray-900 text-white px-8 py-3 rounded-full font-sans text-sm font-medium hover:bg-[#9ca986] transition-colors"
        >
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32 font-sans">


      <div className="p-6 max-w-2xl mx-auto space-y-6 mt-4">
        {/* Items List */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 divide-y divide-gray-100 shadow-sm">
          {cart.map((item) => (
            <div key={item.id} className="py-6 first:pt-0 last:pb-0 flex gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`w-3 h-3 border flex items-center justify-center rounded-sm ${item.isVeg ? 'border-green-600' : 'border-red-600'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`}></span>
                  </span>
                  <h3 className="text-gray-900 tracking-tight text-lg">{item.name.en}</h3>
                </div>
                <div className="text-lg tracking-tight text-gray-900 mt-2">₹{item.price * item.quantity}</div>
              </div>
              <div className="flex flex-col items-end justify-between w-24">
                <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-gray-900 p-1 transition-colors">
                  <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                </button>
                <div className="flex items-center bg-gray-50 rounded-full border border-gray-200 p-1 w-full justify-between">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 text-gray-500 hover:text-gray-900 transition-colors">
                    <Minus size={14} strokeWidth={1.5} />
                  </button>
                  <span className="text-center text-gray-900 text-xs">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 text-gray-500 hover:text-gray-900 transition-colors">
                    <Plus size={14} strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Room Details */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h3 className="text-[10px] text-gray-400 uppercase tracking-widest mb-4">Delivery Details</h3>
          <div className="flex gap-4">
            <span className="bg-gray-50 border border-gray-200 text-gray-500 flex items-center px-4 rounded-xl text-xs uppercase tracking-widest">Room</span>
            <input
              type="text"
              placeholder="e.g. 402"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className="flex-1 border border-gray-200 rounded-xl p-4 outline-none focus:border-gray-900 bg-gray-50 focus:bg-white text-gray-900 text-sm transition-colors"
            />
          </div>
          <p className="text-[10px] text-gray-400 mt-4 flex items-center gap-2">
            <CheckCircle2 className="w-3 h-3 text-[#9ca986]" strokeWidth={2} /> Delivered securely to your suite
          </p>
        </div>

        {/* Payment Options */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h3 className="text-[10px] text-gray-400 uppercase tracking-widest mb-4">Payment Method</h3>
          <div className="space-y-3">
            <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors ${paymentMode === 'ROOM' ? 'border-gray-900 bg-gray-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
              <input type="radio" name="payment" value="ROOM" checked={paymentMode === 'ROOM'} onChange={() => setPaymentMode('ROOM')} className="hidden" />
              <div className={`w-5 h-5 rounded-full border mr-4 flex items-center justify-center ${paymentMode === 'ROOM' ? 'border-gray-900' : 'border-gray-300'}`}>
                {paymentMode === 'ROOM' && <div className="w-2.5 h-2.5 rounded-full bg-gray-900" />}
              </div>
              <span className="text-gray-900 text-sm">Bill to Room Folio</span>
            </label>
            <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors ${paymentMode === 'CARD' ? 'border-gray-900 bg-gray-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
              <input type="radio" name="payment" value="CARD" checked={paymentMode === 'CARD'} onChange={() => setPaymentMode('CARD')} className="hidden" />
              <div className={`w-5 h-5 rounded-full border mr-4 flex items-center justify-center ${paymentMode === 'CARD' ? 'border-gray-900' : 'border-gray-300'}`}>
                {paymentMode === 'CARD' && <div className="w-2.5 h-2.5 rounded-full bg-gray-900" />}
              </div>
              <span className="text-gray-900 text-sm">Pay Now (Card/UPI)</span>
            </label>
          </div>
        </div>

        {/* Bill Details */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4 shadow-sm mb-12">
          <h3 className="text-[10px] text-gray-400 uppercase tracking-widest mb-4">Bill Details</h3>
          <div className="flex justify-between text-gray-500 text-sm font-light">
            <span>Item Total</span>
            <span className="text-gray-900">₹{total}</span>
          </div>
          <div className="flex justify-between text-gray-500 text-sm font-light">
            <span>Taxes & Service Charge (18%)</span>
            <span className="text-gray-900">₹{(total * 0.18).toFixed(2)}</span>
          </div>
          <div className="border-t border-gray-100 pt-4 flex justify-between text-gray-900 text-xl tracking-tight">
            <span>To Pay</span>
            <span>₹{(total * 1.18).toFixed(2)}</span>
          </div>
        </div>

      </div>

      {/* Checkout Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100 pb-8 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <button
          onClick={handlePlaceOrder}
          disabled={isSubmitting}
          className="w-full max-w-2xl mx-auto bg-gray-900 text-white rounded-2xl p-4 text-sm font-medium flex justify-center items-center hover:bg-[#9ca986] transition-colors disabled:opacity-70"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            `Place Order • ₹${(total * 1.18).toFixed(2)}`
          )}
        </button>
      </div>
    </div>
  );
}

function ShoppingCartIcon() {
  return (
    <div className="w-24 h-24 bg-white rounded-full border border-gray-100 flex items-center justify-center text-gray-300 mb-8 shadow-sm">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1"></circle>
        <circle cx="20" cy="21" r="1"></circle>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
      </svg>
    </div>
  );
}
