'use client';

import { Plus, Download, Trash2, Edit2, Link as LinkIcon } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useState } from 'react';

export default function TablesClient({ baseUrl }: { baseUrl: string }) {
  const [publicUrl, setPublicUrl] = useState(baseUrl);

  // In a real scenario, this would come from the database
  const tables = [
    { id: 't-101', name: 'Table 101', capacity: 4, status: 'Active', hotelId: 'hqsp-demo' },
    { id: 't-102', name: 'Table 102', capacity: 2, status: 'Active', hotelId: 'hqsp-demo' },
    { id: 't-103', name: 'Table 103', capacity: 6, status: 'Active', hotelId: 'hqsp-demo' },
  ];

  const downloadQR = (tableId: string, tableName: string) => {
    const svg = document.getElementById(`qr-${tableId}`);
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = `QR-${tableName}.png`;
        downloadLink.href = `${pngFile}`;
        downloadLink.click();
      }
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-serif text-gray-900 tracking-tight">QR Codes & Tables</h1>
          <p className="text-sm text-gray-500 font-light mt-1">Manage your tables and print QR codes.</p>
        </div>
        <button className="bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#9ca986] transition-colors flex items-center gap-2 shadow-sm">
          <Plus size={18} /> Add Table
        </button>
      </div>

      <div className="bg-[#FFF4E5] border border-[#FFE4C4] rounded-2xl p-4 sm:p-6 mb-8 flex flex-col sm:flex-row gap-4 items-center">
        <div className="flex-1 w-full">
          <label className="text-[10px] text-[#A67B5B] font-bold uppercase tracking-widest block mb-2">Public Tunnel URL (for testing on mobile)</label>
          <div className="relative">
            <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A67B5B]" />
            <input 
              type="text" 
              value={publicUrl}
              onChange={(e) => setPublicUrl(e.target.value)}
              placeholder="e.g. https://rnkxa-14-139-44-67.a.free.pinggy.link"
              className="w-full bg-white border border-[#FFE4C4] rounded-xl pl-10 pr-4 py-3 text-sm text-gray-900 outline-none focus:border-[#A67B5B] transition-colors shadow-sm"
            />
          </div>
          <p className="text-xs text-[#A67B5B] mt-2 font-medium">If you are viewing this page on localhost, your mobile phone won't be able to scan the QR unless you paste your Pinggy URL above!</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {tables.map((table) => {
          // Remove trailing slash if user typed one
          const cleanPublicUrl = publicUrl.replace(/\/$/, '');
          const qrUrl = `${cleanPublicUrl}/${table.hotelId}/table/${table.id}`;
          
          return (
            <div key={table.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow flex flex-col group">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{table.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">Capacity: {table.capacity} people</p>
                </div>
                <div className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-widest font-medium ${table.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {table.status}
                </div>
              </div>

              <div className="flex-1 flex justify-center items-center py-8">
                <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm group-hover:scale-105 transition-transform">
                  <QRCodeSVG
                    id={`qr-${table.id}`}
                    value={qrUrl}
                    size={150}
                    level="H"
                    includeMargin={true}
                  />
                </div>
              </div>
              
              <div className="text-center text-[10px] text-gray-400 truncate w-full px-4" title={qrUrl}>
                {qrUrl}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-50 mt-4">
                <button 
                  onClick={() => downloadQR(table.id, table.name)}
                  className="flex items-center gap-2 text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <Download size={14} /> Download QR
                </button>
                <div className="flex gap-2">
                  <button className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                    <Edit2 size={16} />
                  </button>
                  <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
