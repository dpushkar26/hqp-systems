import { TrendingUp, Banknote, Smartphone } from 'lucide-react';

export default function PaymentsPage() {
  return (
    <div className="space-y-12 font-sans">
      <div className="flex justify-between items-end border-b border-gray-100 pb-8">
        <div>
          <h1 className="text-4xl tracking-tight text-gray-900 leading-none mb-2">Daily Reconciliation</h1>
          <p className="text-gray-500 font-light text-sm">Today, {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-2xl border border-gray-100 flex items-center gap-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-gray-50 text-gray-900 rounded-full flex items-center justify-center border border-gray-100">
            <TrendingUp className="w-5 h-5" strokeWidth={1.5} />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Total Sales</div>
            <div className="text-2xl text-gray-900">₹42,500</div>
          </div>
        </div>
        
        <div className="bg-white p-8 rounded-2xl border border-gray-100 flex items-center gap-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-gray-50 text-gray-900 rounded-full flex items-center justify-center border border-gray-100">
            <Smartphone className="w-5 h-5" strokeWidth={1.5} />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Digital (Room Folio)</div>
            <div className="text-2xl text-gray-900">₹31,000</div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-gray-100 flex items-center gap-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-gray-50 text-gray-900 rounded-full flex items-center justify-center border border-gray-100">
            <Banknote className="w-5 h-5" strokeWidth={1.5} />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Cash / Direct</div>
            <div className="text-2xl text-gray-900">₹11,500</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-100 bg-gray-50 text-[10px] uppercase tracking-widest text-gray-500">Recent Transactions</div>
        <div className="divide-y divide-gray-100">
          {[
            { id: 'TXN-001', time: '14:30', amount: 850, mode: 'Room Folio', status: 'Settled' },
            { id: 'TXN-002', time: '13:45', amount: 350, mode: 'Card', status: 'Pending' },
            { id: 'TXN-003', time: '12:20', amount: 1200, mode: 'Room Folio', status: 'Settled' },
          ].map(txn => (
            <div key={txn.id} className="p-6 flex justify-between items-center hover:bg-gray-50 transition-colors">
              <div>
                <div className="text-gray-900">{txn.id}</div>
                <div className="text-xs text-gray-400 mt-1">{txn.time}</div>
              </div>
              <div className="text-right">
                <div className="text-gray-900">₹{txn.amount}</div>
                <div className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">
                  {txn.mode} • {txn.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
