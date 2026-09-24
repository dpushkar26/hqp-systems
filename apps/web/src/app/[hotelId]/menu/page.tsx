'use client';

import { useState, useMemo, useEffect } from 'react';
import { MOCK_CATEGORIES, MOCK_MENU_ITEMS } from '@/lib/mockData';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function MenuPage() {
  const { hotelId } = useParams();
  const { cart, addToCart, removeFromCart, updateQuantity, total } = useCart();
  const [lang, setLang] = useState<'en' | 'hi' | 'mr'>('en');
  const [activeCategory, setActiveCategory] = useState(MOCK_CATEGORIES[0].id);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const filteredItems = useMemo(() => {
    return MOCK_MENU_ITEMS.filter((item) => item.categoryId === activeCategory);
  }, [activeCategory]);

  if (!mounted) return null; // Prevent hydration mismatch on premium transitions

  return (
    <div className="min-h-screen bg-[#FDFCFB] pb-28 font-sans selection:bg-gray-200">
      
      {/* Premium Header/Brand Area */}
      <div className="pt-10 px-6 pb-2">
        <h1 className="font-serif text-3xl text-gray-900 tracking-tight">The {hotelId === 'demo-hotel' ? 'Grand' : hotelId} Menu</h1>
        <p className="text-sm text-gray-500 font-light mt-1">Tap a category to explore.</p>
      </div>

      {/* Category Nav - Glassmorphism */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100/50 px-6 py-4 overflow-x-auto whitespace-nowrap hide-scrollbar shadow-sm transition-all">
        <div className="flex space-x-3">
          {MOCK_CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className="relative px-5 py-2 rounded-full text-[11px] font-medium uppercase tracking-widest transition-colors outline-none"
            >
              {activeCategory === category.id && (
                <motion.div
                  layoutId="activeCategoryIndicator"
                  className="absolute inset-0 bg-gray-900 rounded-full"
                  initial={false}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className={`relative z-10 ${activeCategory === category.id ? 'text-white' : 'text-gray-500 hover:text-gray-900'}`}>
                {category.name[lang]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Menu List with smooth layout animations */}
      <motion.div layout className="p-6 max-w-3xl mx-auto space-y-4 mt-2">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item) => {
            const cartItem = cart.find((i) => i.id === item.id);
            return (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                key={item.id} 
                className="bg-white p-5 border border-gray-100/80 rounded-2xl flex gap-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-shadow"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`w-3.5 h-3.5 border flex items-center justify-center rounded-sm ${item.isVeg ? 'border-green-600' : 'border-red-600'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`}></span>
                    </span>
                    <h3 className="text-gray-900 font-medium text-lg tracking-tight leading-tight">{item.name[lang]}</h3>
                  </div>
                  <p className="text-sm text-gray-500 font-light line-clamp-2 leading-relaxed">{item.description[lang]}</p>
                  <div className="mt-4 font-medium text-gray-900">₹{item.price}</div>
                </div>
                
                <div className="flex flex-col justify-end items-end w-28">
                  {!item.isAvailable ? (
                    <span className="text-[10px] text-red-600 uppercase tracking-widest border border-red-100 bg-red-50/50 px-3 py-1.5 rounded-full">Sold Out</span>
                  ) : cartItem ? (
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex items-center bg-gray-50 rounded-full border border-gray-200/80 p-1"
                    >
                      <button
                        onClick={() => updateQuantity(item.id, cartItem.quantity - 1)}
                        className="p-2 text-gray-500 hover:bg-white hover:shadow-sm hover:text-gray-900 rounded-full transition-all active:scale-95"
                      >
                        <Minus size={14} strokeWidth={2} />
                      </button>
                      <motion.span 
                        key={cartItem.quantity}
                        initial={{ y: -5, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="w-8 text-center text-gray-900 font-medium text-xs"
                      >
                        {cartItem.quantity}
                      </motion.span>
                      <button
                        onClick={() => updateQuantity(item.id, cartItem.quantity + 1)}
                        className="p-2 text-gray-500 hover:bg-white hover:shadow-sm hover:text-gray-900 rounded-full transition-all active:scale-95"
                      >
                        <Plus size={14} strokeWidth={2} />
                      </button>
                    </motion.div>
                  ) : (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => addToCart(item)}
                      className="w-full py-2.5 bg-white text-gray-900 font-medium uppercase tracking-widest border border-gray-200 rounded-full hover:border-gray-900 hover:text-gray-900 transition-colors text-[10px]"
                    >
                      Add
                    </motion.button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Floating Cart Button */}
      <AnimatePresence>
        {cartItemsCount > 0 && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent pb-8 pt-10"
          >
            <Link
              href={`/${hotelId}/cart`}
              className="w-full max-w-3xl mx-auto bg-gray-900 text-white rounded-2xl p-4 flex justify-between items-center shadow-[0_10px_40px_rgba(0,0,0,0.15)] hover:scale-[1.02] transition-transform active:scale-95"
            >
              <div className="flex items-center gap-4">
                <div className="bg-white/10 text-white px-3 py-1.5 rounded-full text-[11px] font-medium uppercase tracking-widest backdrop-blur-sm">
                  {cartItemsCount} item{cartItemsCount > 1 ? 's' : ''}
                </div>
                <div className="text-xl font-medium">₹{total}</div>
              </div>
              <div className="flex items-center uppercase tracking-widest text-[11px] font-medium pr-2">
                Checkout
                <ShoppingCart className="ml-3 w-4 h-4" strokeWidth={2} />
              </div>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
