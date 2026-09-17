'use client';

import { useState, useMemo } from 'react';
import { MOCK_CATEGORIES, MOCK_MENU_ITEMS, MenuItem } from '@/lib/mockData';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Plus, Minus, Utensils } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function MenuPage() {
  const { hotelId } = useParams();
  const { cart, addToCart, removeFromCart, updateQuantity, total } = useCart();
  const [lang, setLang] = useState<'en' | 'hi' | 'mr'>('en');
  const [activeCategory, setActiveCategory] = useState(MOCK_CATEGORIES[0].id);

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const filteredItems = useMemo(() => {
    return MOCK_MENU_ITEMS.filter((item) => item.categoryId === activeCategory);
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-gray-50 pb-28 font-sans">


      {/* Category Nav */}
      <div className="sticky top-[73px] z-10 bg-white border-b border-gray-100 px-6 py-4 overflow-x-auto whitespace-nowrap hide-scrollbar shadow-sm">
        <div className="flex space-x-4">
          {MOCK_CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-5 py-2 rounded-full text-[10px] uppercase tracking-widest transition-colors border ${
                activeCategory === category.id
                  ? 'bg-gray-900 border-gray-900 text-white'
                  : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-900'
              }`}
            >
              {category.name[lang]}
            </button>
          ))}
        </div>
      </div>

      {/* Menu List */}
      <div className="p-6 max-w-3xl mx-auto space-y-4 mt-4">
        {filteredItems.map((item) => {
          const cartItem = cart.find((i) => i.id === item.id);
          return (
            <div key={item.id} className="bg-white p-6 border border-gray-100 rounded-2xl flex gap-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`w-3 h-3 border flex items-center justify-center rounded-sm ${item.isVeg ? 'border-green-600' : 'border-red-600'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`}></span>
                  </span>
                  <h3 className="text-gray-900 text-lg tracking-tight">{item.name[lang]}</h3>
                </div>
                <p className="text-xs text-gray-500 font-light line-clamp-2 leading-relaxed">{item.description[lang]}</p>
                <div className="mt-4 text-lg text-gray-900">₹{item.price}</div>
              </div>
              
              <div className="flex flex-col justify-end items-end w-28">
                {!item.isAvailable ? (
                  <span className="text-[10px] text-red-600 uppercase tracking-widest border border-red-200 bg-red-50 px-3 py-1.5 rounded-full">Sold Out</span>
                ) : cartItem ? (
                  <div className="flex items-center bg-gray-50 rounded-full border border-gray-200 p-1">
                    <button
                      onClick={() => updateQuantity(item.id, cartItem.quantity - 1)}
                      className="p-2 text-gray-500 hover:bg-white hover:shadow-sm hover:text-gray-900 rounded-full transition-all"
                    >
                      <Minus size={14} strokeWidth={1.5} />
                    </button>
                    <span className="w-8 text-center text-gray-900 text-xs">{cartItem.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, cartItem.quantity + 1)}
                      className="p-2 text-gray-500 hover:bg-white hover:shadow-sm hover:text-gray-900 rounded-full transition-all"
                    >
                      <Plus size={14} strokeWidth={1.5} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => addToCart(item)}
                    className="w-full py-2 bg-white text-gray-900 uppercase tracking-widest border border-gray-200 rounded-full hover:border-gray-900 transition-colors text-[10px]"
                  >
                    Add
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Cart Button */}
      {cartItemsCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100 pb-8 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
          <Link
            href={`/${hotelId}/cart`}
            className="w-full max-w-3xl mx-auto bg-gray-900 text-white rounded-2xl p-5 flex justify-between items-center hover:bg-[#9ca986] transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="bg-white/20 text-white px-3 py-1 rounded-full text-[10px] uppercase tracking-widest">
                {cartItemsCount} item{cartItemsCount > 1 ? 's' : ''}
              </div>
              <div className="text-xl">₹{total}</div>
            </div>
            <div className="flex items-center uppercase tracking-widest text-[10px]">
              View Order
              <ShoppingCart className="ml-3 w-4 h-4" strokeWidth={1.5} />
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
