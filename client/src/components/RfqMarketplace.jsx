import React, { useState } from 'react';
import { 
  FileText, Globe, Plus, MessageSquare, Clock, MapPin, 
  ShieldCheck, Filter, Search, CheckCircle, ArrowUpRight, DollarSign 
} from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

export const RfqMarketplace = ({ rfqs, onOpenCreateRfq, onQuoteRfq }) => {
  const { formatPrice } = useCurrency();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [quotingRfqId, setQuotingRfqId] = useState(null);
  const [quotePrice, setQuotePrice] = useState('');
  const [quoteNotes, setQuoteNotes] = useState('');
  const [quotedSuccess, setQuotedSuccess] = useState(null);

  const filteredRfqs = rfqs.filter(rfq => {
    const matchesSearch = rfq.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          rfq.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          rfq.buyerCountry.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || rfq.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleSendQuote = (rfqId) => {
    if (!quotePrice) return;
    setQuotedSuccess(rfqId);
    if (onQuoteRfq) {
      onQuoteRfq(rfqId, { price: quotePrice, notes: quoteNotes });
    }
    setTimeout(() => {
      setQuotingRfqId(null);
      setQuotedSuccess(null);
      setQuotePrice('');
      setQuoteNotes('');
    }, 2000);
  };

  return (
    <section className="my-10">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white mb-6 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2 border border-amber-500/30">
              <Globe className="w-3.5 h-3.5" />
              <span>Live B2B Sourcing Exchange</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Request for Quotation (RFQ) Marketplace
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
              Buyers post custom bulk requirements. Verified factories and exporters submit competitive price quotations with technical specs within 2 hours.
            </p>
          </div>

          <button
            onClick={onOpenCreateRfq}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-lg hover:shadow-xl transition flex items-center gap-2 flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Post a Sourcing RFQ</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between mb-6">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search active RFQ requirements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 flex-shrink-0">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {['All', 'Apparel & Accessories', 'Renewable Energy', 'Agriculture, Food & Beverage', 'Construction & Real Estate', 'Pet Supplies'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition whitespace-nowrap ${
                selectedCategory === cat 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* RFQ List Grid */}
      <div className="space-y-4">
        {filteredRfqs.map((rfq) => {
          const isQuoting = quotingRfqId === rfq.id;

          return (
            <div
              key={rfq.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-orange-300 p-5 sm:p-6 shadow-sm transition-all duration-200"
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <span className="bg-orange-50 text-orange-700 text-[11px] font-bold px-2.5 py-0.5 rounded border border-orange-200">
                      {rfq.category}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <span>{rfq.buyerFlag}</span>
                      <span className="font-semibold text-slate-700">{rfq.buyerName}</span>
                    </span>
                    <span className="text-[11px] text-slate-400">• Posted on {rfq.inquiryDate}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">
                    {rfq.title}
                  </h3>
                </div>

                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-right">
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Target Quantity</span>
                    <span className="text-sm font-extrabold text-slate-800">
                      {rfq.quantity.toLocaleString()} {rfq.unit}
                    </span>
                  </div>

                  <div className="bg-orange-50 border border-orange-200 px-3.5 py-2 rounded-xl text-right">
                    <span className="text-[10px] text-orange-600 block font-semibold uppercase">Target Unit Budget</span>
                    <span className="text-sm font-extrabold text-orange-700">
                      {rfq.targetPrice}
                    </span>
                  </div>
                </div>
              </div>

              {/* RFQ Description */}
              <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                {rfq.details}
              </p>

              {/* Delivery Terms & Actions */}
              <div className="mt-4 pt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3 text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>Destination: <strong className="text-slate-700">{rfq.destinationPort}</strong></span>
                  </span>
                  <span>•</span>
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{rfq.quotesCount} Quotes Received</span>
                  </span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => setQuotingRfqId(isQuoting ? null : rfq.id)}
                    className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isQuoting ? 'Cancel Bid' : 'Submit Quotation'}</span>
                  </button>
                </div>
              </div>

              {/* Interactive Quotation Submission Drawer if open */}
              {isQuoting && (
                <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-orange-200 animate-in fade-in">
                  {quotedSuccess === rfq.id ? (
                    <div className="text-center py-3 text-emerald-700 font-bold flex items-center justify-center gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                      <span>Quotation submitted to buyer! You will be notified when buyer accepts.</span>
                    </div>
                  ) : (
                    <div>
                      <div className="text-xs font-bold text-slate-800 mb-2">
                        Submit Official Factory Bid for {rfq.title}:
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                            Your Quoted Unit Price (FOB):
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. $13.50 / pc"
                            value={quotePrice}
                            onChange={(e) => setQuotePrice(e.target.value)}
                            className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 font-bold"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                            Production Lead Time & Technical Terms:
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="e.g. Can dispatch in 10 days, samples ready in 48h, ISO9001 certified."
                              value={quoteNotes}
                              onChange={(e) => setQuoteNotes(e.target.value)}
                              className="flex-1 text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                            <button
                              onClick={() => handleSendQuote(rfq.id)}
                              className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2 rounded-lg text-xs transition"
                            >
                              Send Bid
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

    </section>
  );
};
