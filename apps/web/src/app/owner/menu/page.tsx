'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Edit2, Trash2, Image as ImageIcon, AlertTriangle, Camera, ChevronDown } from 'lucide-react';

const initialProducts = [
  { id: '66758941', name: 'Grill Sandwich', qty: '50', price: '$20.00', status: 'In Stock', category: 'Fast Food', img: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' },
  { id: '67869052', name: 'Chicken Popeyes', qty: '40', price: '$30.00', status: 'In Stock', category: 'Fast Food', img: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' },
  { id: '68970163', name: 'Bison Burgers', qty: '40', price: '$40.00', status: 'In Stock', category: 'Fast Food', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' },
];

export default function MenuManagementPage() {
  const [products, setProducts] = useState(initialProducts);
  const [view, setView] = useState<'LIST' | 'FORM'>('LIST');
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  
  // Image Upload Modal State
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New/Edit Product Form State
  const [newProduct, setNewProduct] = useState({
    name: '',
    qty: '',
    category: '',
    price: '',
    status: '',
    id: '',
    img: ''
  });

  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  const handleDelete = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
    setDeleteModalId(null);
  };

  const handleEditClick = (product: any) => {
    setNewProduct(product);
    setEditingProductId(product.id);
    setView('FORM');
  };

  const handleBack = () => {
    setNewProduct({ name: '', qty: '', category: '', price: '', status: '', id: '', img: '' });
    setEditingProductId(null);
    setView('LIST');
  };

  const handleSaveProduct = () => {
    if (!newProduct.name || !newProduct.price) return;
    
    if (editingProductId) {
      // Update existing product
      setProducts(products.map(p => p.id === editingProductId ? {
        ...p,
        name: newProduct.name,
        qty: newProduct.qty || '0',
        price: newProduct.price,
        status: newProduct.status || 'In Stock',
        category: newProduct.category || 'Uncategorized',
        img: newProduct.img || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
        id: newProduct.id // Allow them to change the ID if they really want to, though usually ID shouldn't be editable
      } : p));
    } else {
      // Add new product
      setProducts([
        {
          id: newProduct.id || Math.floor(Math.random() * 100000000).toString(),
          name: newProduct.name,
          qty: newProduct.qty || '0',
          price: newProduct.price,
          status: newProduct.status || 'In Stock',
          category: newProduct.category || 'Uncategorized',
          img: newProduct.img || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
        },
        ...products
      ]);
    }
    
    // Reset form and go back
    handleBack();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct({ ...newProduct, img: reader.result as string });
        setIsImageModalOpen(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const statusOptions = ['In Stock', 'Out of Stock', 'Not Available'];

  return (
    <div className="w-full text-gray-900 p-8 font-sans bg-white relative">
      <AnimatePresence mode="wait">
        {view === 'LIST' ? (
          <motion.div 
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-heading font-bold text-gray-900">Product</h1>
              <button 
                onClick={() => {
                  setNewProduct({ name: '', qty: '', category: '', price: '', status: '', id: '', img: '' });
                  setEditingProductId(null);
                  setView('FORM');
                }}
                className="bg-orange-500 text-white px-6 py-2.5 rounded-lg text-[14px] font-medium hover:bg-orange-600 transition-colors shadow-sm"
              >
                + Add Product
              </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-[20px] border border-gray-100 overflow-hidden shadow-sm">
              <table className="w-full text-center">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="py-5 px-6 font-medium text-gray-400 text-[14px] text-left">Product</th>
                    <th className="py-5 px-6 font-medium text-gray-400 text-[14px]">Status</th>
                    <th className="py-5 px-6 font-medium text-gray-400 text-[14px]">Product ID</th>
                    <th className="py-5 px-6 font-medium text-gray-400 text-[14px]">Quality</th>
                    <th className="py-5 px-6 font-medium text-gray-400 text-[14px]">Price</th>
                    <th className="py-5 px-6 font-medium text-gray-400 text-[14px]">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, idx) => (
                    <tr key={idx} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/30 transition-colors">
                      <td className="py-4 px-6 text-left">
                        <div className="flex items-center gap-4">
                          <img src={product.img} alt={product.name} className="w-12 h-12 rounded-xl object-cover shadow-sm border border-gray-100" />
                          <span className="font-medium text-[14px] text-gray-900">{product.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`font-medium text-[14px] ${
                          product.status === 'In Stock' ? 'text-[#22C55E]' : 
                          product.status === 'Out of Stock' ? 'text-red-500' : 'text-gray-400'
                        }`}>
                          {product.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-medium text-[14px] text-gray-900">{product.id}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-medium text-[14px] text-gray-900">{product.qty}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-medium text-[14px] text-gray-900">{product.price}</span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center gap-4">
                          <button 
                            onClick={() => handleEditClick(product)}
                            className="flex items-center gap-1.5 text-[#22C55E] hover:text-green-600 transition-colors"
                          >
                            <Edit2 size={14} strokeWidth={2.5} />
                            <span className="font-medium text-[13px]">Edit</span>
                          </button>
                          <button 
                            onClick={() => setDeleteModalId(product.id)}
                            className="flex items-center gap-1.5 text-orange-500 hover:text-orange-600 transition-colors"
                          >
                            <Trash2 size={14} strokeWidth={2.5} />
                            <span className="font-medium text-[13px]">Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-12 text-gray-400 font-medium">No products found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <button 
                onClick={handleBack}
                className="w-8 h-8 bg-orange-500 text-white rounded-lg flex items-center justify-center hover:bg-orange-600 transition-colors"
              >
                <ChevronLeft size={20} strokeWidth={3} />
              </button>
              <h1 className="text-2xl font-heading font-bold text-gray-900">
                {editingProductId ? 'Edit Product' : 'Add Product'}
              </h1>
            </div>

            {/* Form Container */}
            <div className="bg-white rounded-[20px] border border-gray-100 p-12 max-w-5xl shadow-[0_2px_20px_rgba(0,0,0,0.02)]">
              <div className="flex flex-col items-center mb-12">
                {newProduct.img ? (
                  <div 
                    onClick={() => setIsImageModalOpen(true)}
                    className="w-[140px] h-[140px] rounded-2xl overflow-hidden cursor-pointer shadow-sm border border-gray-200 mb-4 relative group"
                  >
                    <img src={newProduct.img} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Edit2 className="text-white" size={24} />
                    </div>
                  </div>
                ) : (
                  <div 
                    onClick={() => setIsImageModalOpen(true)}
                    className="w-[140px] h-[140px] bg-gray-50 rounded-2xl flex flex-col items-center justify-center text-gray-300 cursor-pointer hover:bg-gray-100 transition-colors mb-4 border-2 border-dashed border-gray-200"
                  >
                    <ImageIcon size={32} strokeWidth={1.5} className="mb-2" />
                    <span className="text-[20px] absolute font-light">+</span>
                  </div>
                )}
                <p className="text-[18px] font-heading font-bold text-gray-900">Upload Image</p>
              </div>

              <div className="grid grid-cols-3 gap-8 mb-12">
                <div className="space-y-3">
                  <label className="block text-[14px] font-medium text-gray-900">Product Name :</label>
                  <input 
                    type="text" 
                    placeholder="Product Name" 
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    className="w-full border border-gray-200 rounded-xl p-3.5 text-[14px] text-gray-900 font-medium placeholder:text-gray-300 placeholder:font-normal outline-none focus:border-orange-500 transition-colors" 
                  />
                </div>
                <div className="space-y-3">
                  <label className="block text-[14px] font-medium text-gray-900">Product Unit :</label>
                  <input 
                    type="text" 
                    placeholder="Enter Unit" 
                    value={newProduct.qty}
                    onChange={(e) => setNewProduct({...newProduct, qty: e.target.value})}
                    className="w-full border border-gray-200 rounded-xl p-3.5 text-[14px] text-gray-900 font-medium placeholder:text-gray-300 placeholder:font-normal outline-none focus:border-orange-500 transition-colors" 
                  />
                </div>
                <div className="space-y-3">
                  <label className="block text-[14px] font-medium text-gray-900">Category :</label>
                  <input 
                    type="text" 
                    placeholder="Enter Category" 
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    className="w-full border border-gray-200 rounded-xl p-3.5 text-[14px] text-gray-900 font-medium placeholder:text-gray-300 placeholder:font-normal outline-none focus:border-orange-500 transition-colors" 
                  />
                </div>
                <div className="space-y-3">
                  <label className="block text-[14px] font-medium text-gray-900">Price :</label>
                  <input 
                    type="text" 
                    placeholder="Enter Price" 
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    className="w-full border border-gray-200 rounded-xl p-3.5 text-[14px] text-gray-900 font-medium placeholder:text-gray-300 placeholder:font-normal outline-none focus:border-orange-500 transition-colors" 
                  />
                </div>
                
                {/* Custom Status Dropdown */}
                <div className="space-y-3 relative">
                  <label className="block text-[14px] font-medium text-gray-900">Status :</label>
                  <div 
                    onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                    className="w-full border border-gray-200 rounded-xl p-3.5 text-[14px] flex items-center justify-between cursor-pointer focus:border-orange-500 transition-colors bg-white"
                  >
                    <span className={`font-medium ${
                      !newProduct.status ? 'text-gray-300 font-normal' :
                      newProduct.status === 'In Stock' ? 'text-[#22C55E]' :
                      newProduct.status === 'Out of Stock' ? 'text-red-500' : 'text-gray-500'
                    }`}>
                      {newProduct.status || 'Select Status'}
                    </span>
                    <ChevronDown size={16} className="text-gray-400" />
                  </div>
                  
                  {isStatusDropdownOpen && (
                    <div className="absolute top-[80px] left-0 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden">
                      {statusOptions.map(option => (
                        <div 
                          key={option}
                          onClick={() => {
                            setNewProduct({...newProduct, status: option});
                            setIsStatusDropdownOpen(false);
                          }}
                          className={`px-4 py-3 text-[14px] font-medium cursor-pointer hover:bg-gray-50 transition-colors ${
                            option === 'In Stock' ? 'text-[#22C55E]' :
                            option === 'Out of Stock' ? 'text-red-500' : 'text-gray-500'
                          }`}
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="block text-[14px] font-medium text-gray-900">Product ID :</label>
                  <input 
                    type="text" 
                    placeholder="123456789" 
                    value={newProduct.id}
                    onChange={(e) => setNewProduct({...newProduct, id: e.target.value})}
                    className="w-full border border-gray-200 rounded-xl p-3.5 text-[14px] text-gray-900 font-medium placeholder:text-gray-300 placeholder:font-normal outline-none focus:border-orange-500 transition-colors" 
                  />
                </div>
              </div>

              <div className="flex justify-center">
                <button 
                  onClick={handleSaveProduct}
                  disabled={!newProduct.name || !newProduct.price}
                  className="bg-orange-500 text-white px-10 py-3.5 rounded-xl text-[15px] font-medium hover:bg-orange-600 transition-colors shadow-[0_4px_14px_rgba(249,115,22,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingProductId ? 'Update Product' : 'Save Product'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModalId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-[24px] shadow-2xl w-full max-w-sm overflow-hidden p-8 flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 mb-6 flex items-center justify-center">
                <AlertTriangle size={64} className="text-[#FF4444]" strokeWidth={2} />
              </div>
              <h3 className="text-xl font-heading font-bold text-gray-900 mb-2">Delete This Product ?</h3>
              <p className="text-[14px] text-gray-400 font-medium mb-8">Are you sure, You want to delete this product?</p>
              
              <div className="flex gap-4 w-full">
                <button 
                  onClick={() => handleDelete(deleteModalId)}
                  className="flex-1 bg-orange-500 text-white rounded-xl py-3 font-medium text-[15px] hover:bg-orange-600 transition-colors"
                >
                  Yes
                </button>
                <button 
                  onClick={() => setDeleteModalId(null)}
                  className="flex-1 bg-gray-900 text-white rounded-xl py-3 font-medium text-[15px] hover:bg-black transition-colors"
                >
                  No
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Image Upload Selection Modal */}
      <input 
        type="file" 
        accept="image/*" 
        ref={fileInputRef} 
        onChange={handleImageUpload} 
        className="hidden" 
      />
      <AnimatePresence>
        {isImageModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[24px] shadow-2xl p-10 flex gap-8"
            >
              <button 
                onClick={openFilePicker} // In a real app, this might open camera directly
                className="w-40 h-40 bg-gray-50 hover:bg-gray-100 rounded-2xl flex flex-col items-center justify-center transition-colors group"
              >
                <div className="w-12 h-12 rounded-full bg-gray-200 group-hover:bg-gray-300 flex items-center justify-center mb-4 transition-colors">
                  <Camera size={24} className="text-gray-500" strokeWidth={2} />
                </div>
                <span className="font-medium text-[14px] text-gray-900">Capture Image</span>
              </button>

              <button 
                onClick={openFilePicker}
                className="w-40 h-40 bg-gray-50 hover:bg-gray-100 rounded-2xl flex flex-col items-center justify-center transition-colors group"
              >
                <div className="w-12 h-12 rounded-full bg-gray-200 group-hover:bg-gray-300 flex items-center justify-center mb-4 transition-colors">
                  <ImageIcon size={24} className="text-gray-500" strokeWidth={2} />
                </div>
                <span className="font-medium text-[14px] text-gray-900">Select Images</span>
              </button>
            </motion.div>
            
            {/* Click outside to close */}
            <div className="absolute inset-0 z-[-1]" onClick={() => setIsImageModalOpen(false)}></div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
