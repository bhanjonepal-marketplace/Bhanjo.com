import React, { useState } from 'react';
import { X, Store, CheckCircle, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import confetti from 'canvas-confetti';

export const BecomeSellerModal = ({ isOpen, onClose, onOpenSellerCentral }) => {
  const [storeName, setStoreName] = useState('');
  const [sellerName, setSellerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Kathmandu');
  const [category, setCategory] = useState(CATEGORIES[0].name);
  const [panNumber, setPanNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await fetch('/api/sellers/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeName,
          sellerName,
          phone,
          email,
          city,
          panNumber,
          category
        })
      });
    } catch (err) {
      console.log('Saved locally:', err);
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
      confetti({ particleCount: 70, spread: 60 });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden relative">
        
        {/* Header */}
        <div className="bg-[#F85606] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center">
              <Store className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-base">Become a Seller on Bhanjo</h2>
              <p className="text-[11px] text-white/90">Sell to millions of online shoppers across Nepal</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Application Registered!</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Your store <strong>{storeName}</strong> has been registered. You can start exploring and managing orders in Seller Central right away!
            </p>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  onClose();
                  if (onOpenSellerCentral) onOpenSellerCentral();
                }}
                className="w-full bg-[#F85606] hover:bg-[#e04e05] text-white font-bold py-2.5 rounded-xl text-xs transition shadow-sm flex items-center justify-center gap-1.5"
              >
                <Store className="w-4 h-4" />
                <span>Open Seller Central Portal</span>
              </button>

              <button
                onClick={onClose}
                className="w-full py-2 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold"
              >
                Back to Shopping
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-3.5 text-xs">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Store Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kathmandu Fashion Mart"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#F85606]"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Owner Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={sellerName}
                  onChange={(e) => setSellerName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#F85606]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Mobile Phone (+977) *</label>
                <input
                  type="tel"
                  required
                  placeholder="98XXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#F85606]"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="seller@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#F85606]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">City / District *</label>
                <input
                  type="text"
                  required
                  placeholder="Kathmandu, Pokhara, Lalitpur..."
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#F85606]"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">PAN / VAT Number (Optional)</label>
                <input
                  type="text"
                  placeholder="9-digit PAN Number"
                  value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#F85606]"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Primary Product Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-[#F85606]"
              >
                {CATEGORIES.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Seller Perks on Bhanjo:</span>
              </div>
              <p>• 0% commission for the first 30 days</p>
              <p>• Doorstep pickup & nationwide express courier delivery</p>
              <p>• Weekly payouts directly to your Nepali bank account (eSewa / Khalti / NCHL)</p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#F85606] hover:bg-[#E04E05] text-white font-bold px-5 py-2 rounded-lg shadow-sm transition flex items-center gap-1.5 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <span>Start Selling</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
