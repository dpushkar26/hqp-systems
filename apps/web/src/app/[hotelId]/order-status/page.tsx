'use client';

import { CheckCircle2, ArrowRight, Clock, Utensils, ReceiptText, Smartphone, CreditCard, Banknote } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';

export default function OrderStatusPage() {
  const { hotelId } = useParams();
  
  // Real-time Order States: ACCEPTED -> PREPARING -> SERVED
  const [status, setStatus] = useState<'ACCEPTED' | 'PREPARING' | 'SERVED'>('ACCEPTED');
  
  // Payment Flow States
  const [isReadyToPay, setIsReadyToPay] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'CASH' | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const [orders, setOrders] = useState<any[]>([]);
  const [activeOrder, setActiveOrder] = useState<any>(null);

  // Fetch Orders for the Session
  useEffect(() => {
    fetch('/api/session/orders')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.orders.length > 0) {
          setOrders(data.orders);
          setActiveOrder(data.orders[0]); // Just pick the latest one for the UI
          setStatus(data.orders[0].status);
        }
      });
  }, []);

  // Connect to Real-time Socket
  useEffect(() => {
    const socket = io('http://localhost:4000', { withCredentials: true });
    socket.on('connect', () => {
      socket.emit('join-room', hotelId);
    });

    socket.on('order:update', (payload) => {
      // If the update is for our active order, update the UI
      if (activeOrder && payload.orderId === activeOrder.id) {
        if (payload.status) setStatus(payload.status);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [hotelId, activeOrder]);

  const handlePaymentSubmit = async () => {
    if (!paymentMethod || !activeOrder) return;
    setIsProcessingPayment(true);
    
    try {
      const res = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: activeOrder.id })
      });
      if (res.ok) {
        setPaymentSuccess(true);
      } else {
        alert('Failed to initiate payment');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-6 text-center font-sans">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white mb-8 shadow-[0_10px_30px_rgba(34,197,94,0.3)]"
        >
          <CheckCircle2 className="w-12 h-12" strokeWidth={2} />
        </motion.div>
        <h1 className="text-3xl font-serif text-gray-900 tracking-tight mb-2">Payment Successful</h1>
        <p className="text-green-800 font-medium mb-12">Thank you for dining with us.</p>
        <div className="bg-white p-6 rounded-2xl w-full max-w-sm shadow-sm border border-green-100">
          <p className="text-sm text-gray-500 font-light mb-4">Your GST Invoice has been generated.</p>
          <button className="w-full bg-gray-900 text-white py-3 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors">
            Download Invoice (PDF)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] pb-32 font-sans selection:bg-gray-200">
      <div className="pt-12 px-6 pb-6 text-center">
        <h1 className="font-serif text-3xl text-gray-900 tracking-tight">Active Orders</h1>
        <p className="text-sm text-gray-500 font-light mt-2">Table session is secure. Order more at any time.</p>
      </div>

      <div className="p-6 max-w-md mx-auto space-y-6">
        {/* Real-time Tracker */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-200 via-gray-900 to-[#9ca986]" />
          
          <h3 className="text-[10px] text-gray-400 font-medium uppercase tracking-widest mb-8">Live Status Tracker</h3>
          
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gray-100">
            
            {/* Step 1: Accepted */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-white bg-gray-900 text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm relative z-10">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] ml-4 md:ml-0 md:group-odd:text-right md:group-even:text-left">
                <h4 className="text-gray-900 font-medium tracking-tight">Order Accepted</h4>
                <span className="text-xs text-gray-500">Sent to kitchen</span>
              </div>
            </div>

            {/* Step 2: Preparing */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 border-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm relative z-10 transition-colors duration-500 ${status === 'PREPARING' || status === 'SERVED' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-400'}`}>
                {status === 'PREPARING' ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }}><Utensils className="w-4 h-4" /></motion.div> : <Utensils className="w-4 h-4" />}
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] ml-4 md:ml-0 md:group-odd:text-right md:group-even:text-left">
                <h4 className={`font-medium tracking-tight ${status === 'PREPARING' || status === 'SERVED' ? 'text-gray-900' : 'text-gray-400'}`}>Preparing</h4>
                <span className="text-xs text-gray-500">Chefs are on it</span>
              </div>
            </div>

            {/* Step 3: Served */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 border-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm relative z-10 transition-colors duration-500 ${status === 'SERVED' ? 'bg-[#9ca986] text-white' : 'bg-gray-100 text-gray-400'}`}>
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] ml-4 md:ml-0 md:group-odd:text-right md:group-even:text-left">
                <h4 className={`font-medium tracking-tight ${status === 'SERVED' ? 'text-gray-900' : 'text-gray-400'}`}>Served</h4>
                <span className="text-xs text-gray-500">Enjoy your meal</span>
              </div>
            </div>

          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8">
          <Link
            href={`/${hotelId}/menu`}
            className="flex-1 bg-white border border-gray-200 text-gray-900 py-4 rounded-2xl text-sm font-medium text-center hover:border-gray-900 transition-colors"
          >
            Order More
          </Link>
          <button
            onClick={() => setIsReadyToPay(true)}
            className="flex-1 bg-gray-900 text-white py-4 rounded-2xl text-sm font-medium hover:bg-[#9ca986] transition-colors flex items-center justify-center gap-2 shadow-[0_5px_20px_rgba(0,0,0,0.1)]"
          >
            <ReceiptText className="w-4 h-4" /> Settle Bill
          </button>
        </div>
      </div>

      {/* Premium Payment Bottom Sheet */}
      <AnimatePresence>
        {isReadyToPay && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gray-900/60 backdrop-blur-md z-40"
              onClick={() => !isProcessingPayment && setIsReadyToPay(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-[#FDFCFB] rounded-t-3xl z-50 p-6 pb-12 shadow-[0_-20px_60px_rgba(0,0,0,0.2)]"
            >
              <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-8" />
              
              <div className="max-w-md mx-auto">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <h2 className="text-2xl font-serif text-gray-900 tracking-tight mb-1">Final Settlement</h2>
                    <p className="text-gray-500 font-light text-sm">Select a payment method to close session.</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Total Due</p>
                    <p className="text-2xl text-gray-900 font-medium">₹{activeOrder?.totalAmount || '0.00'}</p>
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  <button onClick={() => setPaymentMethod('UPI')} className={`w-full flex items-center p-4 border rounded-2xl transition-all ${paymentMethod === 'UPI' ? 'border-gray-900 bg-gray-900 text-white shadow-md' : 'border-gray-200 bg-white text-gray-900 hover:border-gray-300'}`}>
                    <Smartphone className={`w-5 h-5 mr-4 ${paymentMethod === 'UPI' ? 'text-white' : 'text-gray-400'}`} />
                    <span className="font-medium flex-1 text-left">Pay via UPI (GPay, PhonePe)</span>
                    {paymentMethod === 'UPI' && <CheckCircle2 className="w-5 h-5 text-white" />}
                  </button>
                  
                  <button onClick={() => setPaymentMethod('CARD')} className={`w-full flex items-center p-4 border rounded-2xl transition-all ${paymentMethod === 'CARD' ? 'border-gray-900 bg-gray-900 text-white shadow-md' : 'border-gray-200 bg-white text-gray-900 hover:border-gray-300'}`}>
                    <CreditCard className={`w-5 h-5 mr-4 ${paymentMethod === 'CARD' ? 'text-white' : 'text-gray-400'}`} />
                    <span className="font-medium flex-1 text-left">Credit / Debit Card</span>
                    {paymentMethod === 'CARD' && <CheckCircle2 className="w-5 h-5 text-white" />}
                  </button>
                  
                  <button onClick={() => setPaymentMethod('CASH')} className={`w-full flex items-center p-4 border rounded-2xl transition-all ${paymentMethod === 'CASH' ? 'border-[#9ca986] bg-[#9ca986] text-white shadow-md' : 'border-gray-200 bg-white text-gray-900 hover:border-gray-300'}`}>
                    <Banknote className={`w-5 h-5 mr-4 ${paymentMethod === 'CASH' ? 'text-white' : 'text-gray-400'}`} />
                    <span className="font-medium flex-1 text-left">Call Waiter for Cash</span>
                    {paymentMethod === 'CASH' && <CheckCircle2 className="w-5 h-5 text-white" />}
                  </button>
                </div>

                <button
                  onClick={handlePaymentSubmit}
                  disabled={!paymentMethod || isProcessingPayment || !activeOrder}
                  className="w-full bg-gray-900 text-white rounded-xl p-4 text-sm font-medium flex justify-center items-center shadow-[0_10px_30px_rgba(0,0,0,0.1)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
                >
                  {isProcessingPayment ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    paymentMethod === 'CASH' ? 'Request Cash Pickup' : `Pay ₹${activeOrder?.totalAmount || '0.00'} Securely`
                  )}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
