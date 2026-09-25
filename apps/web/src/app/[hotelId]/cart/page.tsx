'use client';

import { useCart } from '@/context/CartContext';
import { ArrowLeft, Plus, Minus, Trash2, CheckCircle2, ShieldCheck, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';

export default function CartPage() {
  const { hotelId } = useParams();
  const router = useRouter();
  const { cart, updateQuantity, removeFromCart, total, clearCart } = useCart();
  
  // States
  const [instructions, setInstructions] = useState('');
  const [paymentMode, setPaymentMode] = useState<'PAY_LATER' | 'PAY_NOW'>('PAY_LATER');
  
  // OTP & Order Flow States
  const [isOrderTriggered, setIsOrderTriggered] = useState(false);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpStep, setOtpStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerifiedSession, setIsVerifiedSession] = useState(false); // In production, this comes from the JWT/Cookie

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalWithTax = total * 1.18;

  const handleInitialPlaceOrder = () => {
    // If the session is already verified (e.g. they ordered earlier in the sitting), just process immediately.
    if (isVerifiedSession) {
      processOrder();
    } else {
      // Trigger the OTP Modal
      setIsOrderTriggered(true);
    }
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) return;
    setIsVerifying(true);
    
    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: phone })
      });
      if (res.ok) {
        setOtpStep('OTP');
      } else {
        alert('Failed to send OTP');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsVerifying(false);
    }
  };

  const [showConfetti, setShowConfetti] = useState(false);

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) return;
    setIsVerifying(true);
    
    try {
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otpCode: otp })
      });
      if (res.ok) {
        const data = await res.json();
        setIsVerifiedSession(true);
        setIsOrderTriggered(false);
        
        if (data.visitCount === 5) {
          setShowConfetti(true);
          // Auto process order after 4 seconds of confetti
          setTimeout(processOrder, 4000);
        } else {
          processOrder();
        }
      } else {
        alert('Invalid OTP');
        setIsVerifying(false);
      }
    } catch (err) {
      console.error(err);
      setIsVerifying(false);
    }
  };

  const processOrder = async () => {
    setIsVerifying(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map(item => ({ menuItemId: item.id, quantity: item.quantity })),
          instructions: instructions,
          paymentMode: paymentMode === 'PAY_NOW' ? 'ONLINE' : 'CASH'
        })
      });
      if (res.ok) {
        clearCart();
        router.push(`/${hotelId}/order-status`);
      } else {
        alert('Failed to place order');
        setIsVerifying(false);
      }
    } catch (err) {
      console.error(err);
      setIsVerifying(false);
    }
  };

  if (cart.length === 0 && !isVerifying) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex flex-col items-center justify-center p-6 text-center font-sans">
        <ShoppingCartIcon />
        <h2 className="text-2xl font-medium tracking-tight text-gray-900 mt-8 mb-2">Order is empty</h2>
        <p className="text-gray-500 font-light text-sm mb-10">You haven't added any items to your dining order.</p>
        <Link
          href={`/${hotelId}/menu`}
          className="bg-gray-900 text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-[#9ca986] transition-colors"
        >
          Browse Menu
        </Link>
      </div>
    );
  }

  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFCFB] pb-32 font-sans selection:bg-gray-200">
      {showConfetti && (
        <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center">
          <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={500} />
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            className="bg-gray-900 text-white px-8 py-6 rounded-3xl shadow-2xl text-center max-w-sm mx-4"
          >
            <div className="text-4xl mb-4">🎉</div>
            <h3 className="text-2xl font-serif mb-2">Welcome Back!</h3>
            <p className="text-gray-300">This is your 5th visit to our restaurant! We've automatically applied a special VIP discount to your order.</p>
          </motion.div>
        </div>
      )}
      
      {/* Header */}
      <div className="pt-10 px-6 pb-2 flex items-center gap-4">
        <Link href={`/${hotelId}/menu`} className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-900 hover:bg-gray-50 transition-colors">
          <ArrowLeft size={20} strokeWidth={1.5} />
        </Link>
        <h1 className="font-serif text-3xl text-gray-900 tracking-tight">Your Cart</h1>
      </div>

      <div className="p-6 max-w-2xl mx-auto space-y-4">
        {/* Items List */}
        <div className="bg-white border border-gray-100/80 rounded-2xl p-2 divide-y divide-gray-50 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <AnimatePresence mode="popLayout">
            {cart.map((item) => (
              <motion.div 
                layout
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                key={item.id} 
                className="p-4 flex gap-4 overflow-hidden"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className={`w-3 h-3 border flex items-center justify-center rounded-sm ${item.isVeg ? 'border-green-600' : 'border-red-600'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`}></span>
                    </span>
                    <h3 className="text-gray-900 tracking-tight font-medium text-lg">{item.name.en}</h3>
                  </div>
                  <div className="text-lg font-medium text-gray-900 mt-2">₹{item.price * item.quantity}</div>
                </div>
                <div className="flex flex-col items-end justify-between w-24">
                  <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 p-1 transition-colors">
                    <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                  </button>
                  <div className="flex items-center bg-gray-50 rounded-full border border-gray-200/80 p-1 w-full justify-between">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 text-gray-500 hover:text-gray-900 transition-colors">
                      <Minus size={14} strokeWidth={2} />
                    </button>
                    <span className="text-center font-medium text-gray-900 text-xs">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 text-gray-500 hover:text-gray-900 transition-colors">
                      <Plus size={14} strokeWidth={2} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Special Instructions (Replaced Room Input since Table is known) */}
        <div className="bg-white border border-gray-100/80 rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <h3 className="text-[10px] text-gray-400 font-medium uppercase tracking-widest mb-3">Kitchen Instructions</h3>
          <input
            type="text"
            placeholder="e.g. Make it spicy, no onions..."
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            className="w-full border border-gray-200 rounded-xl p-4 outline-none focus:border-gray-900 bg-gray-50 focus:bg-white text-gray-900 text-sm transition-colors"
          />
          <p className="text-[10px] text-gray-400 mt-4 flex items-center gap-2 uppercase tracking-widest">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#9ca986]" strokeWidth={2} /> Table locked securely
          </p>
        </div>

        {/* Payment Options */}
        <div className="bg-white border border-gray-100/80 rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <h3 className="text-[10px] text-gray-400 font-medium uppercase tracking-widest mb-4">Settlement</h3>
          <div className="space-y-3">
            <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors ${paymentMode === 'PAY_LATER' ? 'border-gray-900 bg-gray-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
              <input type="radio" name="payment" value="PAY_LATER" checked={paymentMode === 'PAY_LATER'} onChange={() => setPaymentMode('PAY_LATER')} className="hidden" />
              <div className={`w-5 h-5 rounded-full border mr-4 flex items-center justify-center ${paymentMode === 'PAY_LATER' ? 'border-gray-900' : 'border-gray-300'}`}>
                {paymentMode === 'PAY_LATER' && <div className="w-2.5 h-2.5 rounded-full bg-gray-900" />}
              </div>
              <span className="text-gray-900 text-sm font-medium">Add to final bill (Pay at end)</span>
            </label>
            <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors ${paymentMode === 'PAY_NOW' ? 'border-gray-900 bg-gray-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
              <input type="radio" name="payment" value="PAY_NOW" checked={paymentMode === 'PAY_NOW'} onChange={() => setPaymentMode('PAY_NOW')} className="hidden" />
              <div className={`w-5 h-5 rounded-full border mr-4 flex items-center justify-center ${paymentMode === 'PAY_NOW' ? 'border-gray-900' : 'border-gray-300'}`}>
                {paymentMode === 'PAY_NOW' && <div className="w-2.5 h-2.5 rounded-full bg-gray-900" />}
              </div>
              <span className="text-gray-900 text-sm font-medium">Pay Now (UPI / Card)</span>
            </label>
          </div>
        </div>

        {/* Bill Details */}
        <div className="bg-white border border-gray-100/80 rounded-2xl p-6 space-y-3 shadow-[0_2px_10px_rgba(0,0,0,0.02)] mb-12">
          <h3 className="text-[10px] text-gray-400 font-medium uppercase tracking-widest mb-4">Bill Summary</h3>
          <div className="flex justify-between text-gray-500 text-sm font-light">
            <span>Item Total</span>
            <span className="text-gray-900 font-medium">₹{total}</span>
          </div>
          <div className="flex justify-between text-gray-500 text-sm font-light">
            <span>Taxes & Service Charge (18%)</span>
            <span className="text-gray-900 font-medium">₹{(total * 0.18).toFixed(2)}</span>
          </div>
          <div className="border-t border-gray-100/80 pt-4 flex justify-between text-gray-900 text-xl tracking-tight font-medium">
            <span>To Pay</span>
            <span>₹{totalWithTax.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Checkout Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent pt-10 pb-8 z-30">
        <button
          onClick={handleInitialPlaceOrder}
          className="w-full max-w-2xl mx-auto bg-gray-900 text-white rounded-2xl p-4 text-sm font-medium flex justify-center items-center shadow-[0_10px_40px_rgba(0,0,0,0.15)] hover:scale-[1.02] active:scale-95 transition-all"
        >
          {isVerifying && !isOrderTriggered ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            `Place Order • ₹${totalWithTax.toFixed(2)}`
          )}
        </button>
      </div>

      {/* Premium OTP Bottom Sheet Modal */}
      <AnimatePresence>
        {isOrderTriggered && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40"
              onClick={() => setIsOrderTriggered(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 p-6 pb-12 shadow-[0_-20px_60px_rgba(0,0,0,0.1)]"
            >
              <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-8" />
              
              <div className="max-w-md mx-auto">
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-4 border border-green-100">
                  <ShieldCheck className="text-green-600 w-6 h-6" strokeWidth={1.5} />
                </div>
                <h2 className="text-2xl font-serif text-gray-900 tracking-tight mb-2">Secure your table</h2>
                <p className="text-gray-500 font-light text-sm mb-8 leading-relaxed">
                  We require a quick verification for your first order. 
                  <span className="font-medium text-gray-900 block mt-1">All future orders in this sitting won't require this.</span>
                </p>

                {otpStep === 'PHONE' ? (
                  <form onSubmit={handlePhoneSubmit} className="space-y-4">
                    <div>
                      <label className="text-[10px] text-gray-400 font-medium uppercase tracking-widest mb-2 block">Phone Number</label>
                      <div className="flex bg-gray-50 border border-gray-200 rounded-xl overflow-hidden focus-within:border-gray-900 focus-within:bg-white transition-colors">
                        <span className="px-4 py-4 border-r border-gray-200 text-gray-500 font-medium text-sm">+91</span>
                        <input
                          type="tel"
                          autoFocus
                          maxLength={10}
                          placeholder="99999 99999"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                          className="w-full p-4 outline-none bg-transparent text-gray-900 font-medium tracking-wider"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={phone.length < 10 || isVerifying}
                      className="w-full bg-gray-900 text-white rounded-xl p-4 text-sm font-medium flex justify-center items-center hover:bg-[#9ca986] transition-colors disabled:opacity-50"
                    >
                      {isVerifying ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Send Code'}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleOtpSubmit} className="space-y-4">
                    <div>
                      <label className="text-[10px] text-gray-400 font-medium uppercase tracking-widest mb-2 flex justify-between">
                        <span>Enter 4-digit code</span>
                        <button type="button" onClick={() => setOtpStep('PHONE')} className="text-gray-900 underline">Change Number</button>
                      </label>
                      <input
                        type="text"
                        autoFocus
                        maxLength={4}
                        placeholder="••••"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        className="w-full p-4 text-center text-2xl tracking-[1em] outline-none border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-gray-900 transition-colors"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={otp.length < 4 || isVerifying}
                      className="w-full bg-gray-900 text-white rounded-xl p-4 text-sm font-medium flex justify-center items-center hover:bg-[#9ca986] transition-colors disabled:opacity-50"
                    >
                      {isVerifying ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Verify & Place Order'}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function ShoppingCartIcon() {
  return (
    <div className="w-24 h-24 bg-white rounded-full border border-gray-100 flex items-center justify-center text-gray-300 mb-8 shadow-sm">
      <ShoppingCart className="w-8 h-8" strokeWidth={1} />
    </div>
  );
}
