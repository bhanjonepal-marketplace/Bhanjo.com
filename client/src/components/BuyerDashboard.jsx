import React, { useState } from 'react';
import { 
  User, ShieldCheck, FileText, ShoppingBag, MessageSquare, 
  Building, CheckCircle2, Clock, Truck, Plus, ArrowRight, DollarSign 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { SUPPLIERS } from '../data/suppliers';

export const BuyerDashboard = ({ rfqs, onOpenRfq, onSelectProduct }) => {
  const { user, toggleRole } = useAuth();
  const { inquiries, items } = useCart();
  const { formatPrice } = useCurrency();

  const [activeTab, setActiveTab] = useState('rfqs'); // 'rfqs', 'orders', 'suppliers', 'inquiries'

  return (
    <div className="my-8 max-w-7xl mx-auto">
      
      {/* Account Profile Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-orange-500 flex items-center justify-center text-2xl font-black text-white shadow-lg">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold">{user.name}</h2>
              <span className="bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                Verified Global Buyer 🇳🇵
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">{user.company} • {user.email}</p>
            <div className="text-[11px] text-amber-400 mt-1 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{user.tradeAssuranceCoverage}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleRole}
            className="bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold px-4 py-2.5 rounded-xl transition"
          >
            Switch to {user.role === 'buyer' ? 'Supplier Center' : 'Buyer Center'}
          </button>

          <button
            onClick={onOpenRfq}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Post New RFQ</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-bold uppercase tracking-wider mb-6 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('rfqs')}
          className={`pb-3 transition border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'rfqs' ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>My RFQ Sourcing Requests ({rfqs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 transition border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'orders' ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Sample & Wholesale Orders ({items.length + 2})</span>
        </button>

        <button
          onClick={() => setActiveTab('suppliers')}
          className={`pb-3 transition border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'suppliers' ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Verified Manufacturers ({SUPPLIERS.length})</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'rfqs' && (
        <div className="space-y-4">
          {rfqs.map((rfq) => (
            <div key={rfq.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold bg-orange-50 text-orange-700 px-2 py-0.5 rounded border border-orange-200">
                    {rfq.category}
                  </span>
                  <span className="text-xs text-slate-400">ID: {rfq.id}</span>
                </div>
                <h4 className="font-bold text-sm text-slate-900">{rfq.title}</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Target: {rfq.quantity.toLocaleString()} {rfq.unit} • Budget: {rfq.targetPrice} • {rfq.destinationPort}
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">Bids Received</span>
                  <span className="text-sm font-bold text-emerald-600 flex items-center gap-1 justify-end">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {rfq.quotesCount} Factory Quotes
                  </span>
                </div>

                <button
                  onClick={() => alert(`Reviewing ${rfq.quotesCount} factory quotations for ${rfq.title}.`)}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-3.5 py-2 rounded-xl transition"
                >
                  Review Bids
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="space-y-4">
          {/* Sample Order Mock 1 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src="https://images.unsplash.com/photo-1606744888344-493238955de0?auto=format&fit=crop&w=150&q=80" className="w-14 h-14 object-cover rounded-xl" />
              <div>
                <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded">
                  Sample Inspection Order
                </span>
                <h4 className="font-bold text-sm text-slate-900 mt-1">
                  100% Chyangra Cashmere Pashmina (Sample Test)
                </h4>
                <p className="text-xs text-slate-500">Supplier: Himalayan Heritage Craft Ltd. • Tracking: DHL-NP-994821</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-[10px] text-emerald-600 font-bold block">In Transit (Air Cargo)</span>
                <span className="text-xs text-slate-400">ETA: 2 Days</span>
              </div>
              <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-emerald-200">
                Quality Passed
              </span>
            </div>
          </div>

          {/* Wholesale Contract Mock 2 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src="https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=150&q=80" className="w-14 h-14 object-cover rounded-xl" />
              <div>
                <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded">
                  Trade Assurance Wholesale Contract
                </span>
                <h4 className="font-bold text-sm text-slate-900 mt-1">
                  50kW Micro-Hydro Pelton Turbine & Generator Set
                </h4>
                <p className="text-xs text-slate-500">Supplier: Everest CleanEnergy Tech • Contract: BHJ-8848-HYDRO</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-[10px] text-amber-600 font-bold block">Escrow Funded (100%)</span>
                <span className="text-xs text-slate-700 font-bold">$8,800.00 USD</span>
              </div>
              <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-blue-200">
                In Production
              </span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'suppliers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SUPPLIERS.map((sup) => (
            <div key={sup.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-slate-600">
                    <span>{sup.flag}</span>
                    <span className="font-bold text-slate-800">{sup.name}</span>
                  </div>
                  <span className="text-[10px] bg-orange-100 text-orange-700 font-bold px-2 py-0.5 rounded">
                    {sup.verifiedYear} Yrs Verified
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-2 line-clamp-2">{sup.description}</p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {sup.certifications.map((c, i) => (
                    <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Response: <strong className="text-emerald-600">{sup.responseRate}</strong></span>
                <button
                  onClick={() => alert(`Opening catalog for ${sup.name}`)}
                  className="text-orange-600 font-bold hover:underline flex items-center gap-1"
                >
                  <span>View Factory Catalog</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
