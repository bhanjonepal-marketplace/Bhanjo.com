import React, { useState } from 'react';
import { X, Send, Paperclip, CheckCircle2, ShieldCheck, Globe, Sparkles } from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { useCurrency } from '../context/CurrencyContext';
import confetti from 'canvas-confetti';

export const RfqModal = ({ isOpen, onClose, onRfqCreated, prefillProduct }) => {
  const { currentCurrency } = useCurrency();

  const [title, setTitle] = useState(prefillProduct ? `Looking for quotation: ${prefillProduct.title}` : '');
  const [category, setCategory] = useState(prefillProduct?.categoryName || CATEGORIES[0].name);
  const [quantity, setQuantity] = useState(prefillProduct ? prefillProduct.moq * 5 : 500);
  const [unit, setUnit] = useState(prefillProduct?.unit || 'pieces');
  const [targetPrice, setTargetPrice] = useState(prefillProduct ? (prefillProduct.priceTiers[prefillProduct.priceTiers.length - 1]?.price || 15) : '');
  const [destinationPort, setDestinationPort] = useState('Tribhuvan Intl Airport / FOB Kathmandu');
  const [incoterm, setIncoterm] = useState('FOB');
  const [details, setDetails] = useState(prefillProduct ? `Please provide formal quotation for ${quantity} ${unit} with custom packaging and quality inspection report.` : '');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newRfq = {
      id: `rfq-${Date.now().toString().slice(-6)}`,
      title,
      category,
      buyerName: "Aarav Sharma (Himalaya Global Ventures)",
      buyerCountry: "Nepal",
      buyerFlag: "🇳🇵",
      quantity: Number(quantity),
      unit,
      targetPrice: targetPrice ? `${currentCurrency.symbol}${targetPrice} / ${unit}` : "Open to Quotes",
      destinationPort: `${incoterm} - ${destinationPort}`,
      inquiryDate: new Date().toISOString().split('T')[0],
      quotesCount: 0,
      status: "Active",
      details,
      attachments: ["Specification_Document.pdf"]
    };

    if (onRfqCreated) {
      onRfqCreated(newRfq);
    }

    setSubmitted(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 relative overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-orange-500 rounded-lg text-white">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold flex items-center gap-2">
                Submit Request for Quotation (RFQ)
                <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded font-semibold">
                  Free • 2h Fast Quote
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                Receive competitive bids from certified manufacturers in Nepal and worldwide.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-12 text-center flex flex-col items-center justify-center animate-in zoom-in-95">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">RFQ Published Successfully!</h3>
            <p className="text-xs text-slate-500 max-w-sm mt-1">
              Your sourcing requirement is now live on the Bhanjo Trade Exchange. Verified factories will submit quotations directly to your dashboard.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            {/* Title */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Product Name / Sourcing Requirement <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 5,000 Pcs Custom Himalayan Cashmere Pashmina Shawls"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
              />
            </div>

            {/* Category & Unit */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Industry Sector (Categories)
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Unit Type
                </label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                >
                  <option value="pieces">Pieces / Pcs</option>
                  <option value="sets">Sets / Kits</option>
                  <option value="kg">Kilograms (kg)</option>
                  <option value="tons">Metric Tons</option>
                  <option value="meters">Meters</option>
                  <option value="sheets">Sheets</option>
                  <option value="liters">Liters</option>
                </select>
              </div>
            </div>

            {/* Quantity & Target Price */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Order Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Target Unit Price ({currentCurrency.symbol})
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Optional target budget"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Incoterms & Destination */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Trade Terms
                </label>
                <select
                  value={incoterm}
                  onChange={(e) => setIncoterm(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                >
                  <option value="FOB">FOB (Free on Board)</option>
                  <option value="CIF">CIF (Cost, Insurance & Freight)</option>
                  <option value="EXW">EXW (Ex-Works Factory)</option>
                  <option value="DDP">DDP (Delivered Duty Paid)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Destination Port / Delivery Location
                </label>
                <input
                  type="text"
                  value={destinationPort}
                  onChange={(e) => setDestinationPort(e.target.value)}
                  placeholder="e.g. Tribhuvan Airport (KTM) / Kolkata Port"
                  className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Detailed Description */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Detailed Specifications & Custom Requirements
              </label>
              <textarea
                rows={3}
                required
                placeholder="Include material grades, dimensions, colors, packaging requirements, certifications needed, etc."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full text-xs p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Mock Attachment Upload & Trade Assurance Guarantee */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
              <label className="cursor-pointer inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-orange-600">
                <Paperclip className="w-4 h-4" />
                <span>Attach CAD Drawing / Tech Pack (PDF, JPG, DWG)</span>
                <input type="file" className="hidden" />
              </label>

              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Buyer Contact Info Protected
              </span>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="text-xs font-semibold text-slate-600 hover:bg-slate-100 px-4 py-2.5 rounded-xl transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-md hover:shadow-lg transition flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit RFQ to Global Suppliers</span>
              </button>
            </div>

          </form>
        )}

      </div>

    </div>
  );
};
