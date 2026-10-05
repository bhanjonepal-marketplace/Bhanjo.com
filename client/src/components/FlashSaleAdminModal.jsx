import React, { useState, useEffect } from 'react';
import { 
  X, Zap, Plus, Trash2, Clock, Percent, DollarSign, 
  Search, CheckCircle2, AlertCircle, Sparkles, RefreshCw, Eye
} from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import confetti from 'canvas-confetti';

const USD_TO_NPR = 133.5;

export const FlashSaleAdminModal = ({ 
  isOpen, 
  onClose, 
  onFlashSaleUpdated 
}) => {
  const { formatPrice, formatNPR } = useCurrency();

  const [activeTab, setActiveTab] = useState('add'); // 'add' | 'list'
  const [catalogProducts, setCatalogProducts] = useState([]);
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(false);
  const [flashItems, setFlashItems] = useState([]);
  const [isLoadingFlash, setIsLoadingFlash] = useState(false);

  // New Flash Item Form State
  const [selectedProductId, setSelectedProductId] = useState('');
  const [searchProductQuery, setSearchProductQuery] = useState('');
  const [originalPriceUSD, setOriginalPriceUSD] = useState(25);
  const [flashPriceUSD, setFlashPriceUSD] = useState('15');
  const [discountPercent, setDiscountPercent] = useState('40');
  const [durationHours, setDurationHours] = useState('4');
  const [durationMinutes, setDurationMinutes] = useState('0');
  const [totalStock, setTotalStock] = useState('50');
  const [soldStock, setSoldStock] = useState('15');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // Fetch catalog products for selection
  useEffect(() => {
    if (isOpen) {
      setIsLoadingCatalog(true);
      fetch('/api/products?limit=100')
        .then(res => res.json())
        .then(data => {
          if (data.success && Array.isArray(data.products)) {
            setCatalogProducts(data.products);
            if (data.products.length > 0 && !selectedProductId) {
              const first = data.products[0];
              setSelectedProductId(first.id);
              const orig = first.samplePrice || 25;
              setOriginalPriceUSD(orig);
              const disc = 40;
              setDiscountPercent(disc.toString());
              setFlashPriceUSD((orig * (1 - disc / 100)).toFixed(2));
            }
          }
        })
        .catch(err => console.error('Catalog fetch error:', err))
        .finally(() => setIsLoadingCatalog(false));

      fetchFlashItems();
    }
  }, [isOpen]);

  const fetchFlashItems = async () => {
    setIsLoadingFlash(true);
    try {
      const res = await fetch('/api/flash-sale');
      const data = await res.json();
      if (data.success && Array.isArray(data.items)) {
        setFlashItems(data.items);
      }
    } catch (e) {
      console.error('Error fetching flash items:', e);
    } finally {
      setIsLoadingFlash(false);
    }
  };

  if (!isOpen) return null;

  // Selected product object
  const currentProduct = catalogProducts.find(p => p.id === selectedProductId);

  // When selected product changes, reset pricing base
  const handleSelectProduct = (productId) => {
    setSelectedProductId(productId);
    const prod = catalogProducts.find(p => p.id === productId);
    if (prod) {
      const orig = prod.samplePrice || 25;
      setOriginalPriceUSD(orig);
      const disc = parseFloat(discountPercent) || 40;
      setFlashPriceUSD((orig * (1 - disc / 100)).toFixed(2));
    }
  };

  // Dual Interactive Calculator: Flash Price changes -> recompute % Discount
  const handleFlashPriceChange = (val) => {
    setFlashPriceUSD(val);
    const fPrice = parseFloat(val);
    if (!isNaN(fPrice) && originalPriceUSD > 0 && fPrice > 0) {
      const computedDiscount = Math.round(((originalPriceUSD - fPrice) / originalPriceUSD) * 100);
      setDiscountPercent(Math.max(1, Math.min(99, computedDiscount)).toString());
    }
  };

  // Dual Interactive Calculator: % Discount changes -> recompute Flash Price
  const handleDiscountPercentChange = (val) => {
    setDiscountPercent(val);
    const disc = parseFloat(val);
    if (!isNaN(disc) && disc >= 0 && disc < 100 && originalPriceUSD > 0) {
      const computedFlashPrice = (originalPriceUSD * (1 - disc / 100)).toFixed(2);
      setFlashPriceUSD(computedFlashPrice);
    }
  };

  // Quick preset shortcuts
  const applyDiscountPreset = (pct) => {
    setDiscountPercent(pct.toString());
    const computedFlashPrice = (originalPriceUSD * (1 - pct / 100)).toFixed(2);
    setFlashPriceUSD(computedFlashPrice);
  };

  const applyTimerPreset = (hrs, mins = 0) => {
    setDurationHours(hrs.toString());
    setDurationMinutes(mins.toString());
  };

  // Add / Publish to Flash Sale
  const handleSubmitFlashSale = async (e) => {
    e.preventDefault();
    if (!selectedProductId) return;

    setIsSubmitting(true);
    setStatusMessage('');

    try {
      const res = await fetch('/api/flash-sale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedProductId,
          flashPrice: parseFloat(flashPriceUSD),
          originalPrice: originalPriceUSD,
          discountPercent: parseFloat(discountPercent),
          durationHours: parseInt(durationHours) || 4,
          durationMinutes: parseInt(durationMinutes) || 0,
          totalStock: parseInt(totalStock) || 50,
          soldStock: parseInt(soldStock) || 0
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        confetti({ particleCount: 50, spread: 60 });
        setStatusMessage('✅ Successfully added product to Flash Sale!');
        fetchFlashItems();
        if (onFlashSaleUpdated) onFlashSaleUpdated();
        setTimeout(() => setStatusMessage(''), 3500);
      } else {
        setStatusMessage('❌ ' + (data.error || 'Failed to save flash sale item.'));
      }
    } catch (err) {
      setStatusMessage('❌ Network error: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Remove from Flash Sale
  const handleRemoveFromFlash = async (flashId) => {
    try {
      const res = await fetch(`/api/flash-sale/${flashId}`, { method: 'DELETE' });
      if (res.ok) {
        setFlashItems(prev => prev.filter(item => item.id !== flashId && item.product_id !== flashId));
        if (onFlashSaleUpdated) onFlashSaleUpdated();
      }
    } catch (err) {
      console.error('Delete flash item error:', err);
    }
  };

  // Filter products in dropdown by title or SKU
  const filteredCatalog = catalogProducts.filter(p => 
    !searchProductQuery.trim() || 
    p.title?.toLowerCase().includes(searchProductQuery.toLowerCase()) ||
    p.id?.toLowerCase().includes(searchProductQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
        
        {/* Header */}
        <div className="sticky top-0 z-20 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 px-5 py-4 text-white flex items-center justify-between border-b border-red-500">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-yellow-400 text-slate-950 flex items-center justify-center font-black">
              ⚡
            </div>
            <div>
              <h2 className="font-extrabold text-sm sm:text-base leading-tight">
                Flash Sale Command &amp; Deals Manager
              </h2>
              <p className="text-[11px] text-white/80">
                Configure discounted products, % discounts, and hour/minute countdown timers
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="bg-slate-50 px-5 pt-3 border-b border-slate-200 flex items-center gap-2">
          <button
            onClick={() => setActiveTab('add')}
            className={`px-4 py-2 font-bold text-xs rounded-t-xl transition-all border-b-2 cursor-pointer ${
              activeTab === 'add'
                ? 'bg-white border-red-600 text-red-600 shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            + Add Product to Flash Sale
          </button>

          <button
            onClick={() => setActiveTab('list')}
            className={`px-4 py-2 font-bold text-xs rounded-t-xl transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'list'
                ? 'bg-white border-red-600 text-red-600 shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Active Flash Deals</span>
            <span className="bg-red-100 text-red-700 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {flashItems.length}
            </span>
          </button>
        </div>

        {/* Tab 1: Add to Flash Sale */}
        {activeTab === 'add' && (
          <form onSubmit={handleSubmitFlashSale} className="p-5 space-y-5">
            
            {statusMessage && (
              <div className={`p-3 rounded-xl text-xs font-bold border ${
                statusMessage.startsWith('✅') 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                  : 'bg-red-50 text-red-800 border-red-200'
              }`}>
                {statusMessage}
              </div>
            )}

            {/* 1. Product Picker with Search */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-800 uppercase tracking-wider block">
                1. Select Product From Store Catalog
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="relative mb-2">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search catalog by title or ID..."
                      value={searchProductQuery}
                      onChange={(e) => setSearchProductQuery(e.target.value)}
                      className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <select
                    value={selectedProductId}
                    onChange={(e) => handleSelectProduct(e.target.value)}
                    className="w-full text-xs font-medium p-2.5 rounded-xl border border-slate-300 focus:border-red-500 focus:outline-none bg-white max-h-48"
                    size="6"
                  >
                    {filteredCatalog.map(prod => (
                      <option key={prod.id} value={prod.id} className="py-1">
                        {prod.title.slice(0, 48)}... (${prod.samplePrice || 20})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Selected Product Preview Card */}
                {currentProduct && (
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-start gap-3">
                    <img 
                      src={currentProduct.images?.[0] || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400'} 
                      alt={currentProduct.title}
                      className="w-20 h-20 rounded-lg object-cover border border-slate-200 flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1 text-xs">
                      <span className="text-[10px] font-bold text-red-600 uppercase block">Selected Item:</span>
                      <h4 className="font-bold text-slate-900 line-clamp-2 leading-tight">
                        {currentProduct.title}
                      </h4>
                      <div className="mt-1.5 font-bold text-slate-700">
                        Regular Price: <span className="text-slate-900">${originalPriceUSD}</span> (~Rs. {Math.round(originalPriceUSD * USD_TO_NPR).toLocaleString()})
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        Category: {currentProduct.categoryName || currentProduct.categoryId}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Interactive Price & % Discount Configuration */}
            <div className="p-4 bg-red-50/60 rounded-2xl border border-red-200 space-y-3">
              <label className="text-xs font-black text-red-950 uppercase tracking-wider flex items-center gap-1.5">
                <Percent className="w-3.5 h-3.5 text-red-600" />
                <span>2. Flash Sale Price &amp; % Discount Calculator</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Flash Price Input */}
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Flash Sale Price (USD / NPR)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-xs">$</span>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={flashPriceUSD}
                      onChange={(e) => handleFlashPriceChange(e.target.value)}
                      className="w-full text-xs font-bold pl-7 pr-3 py-2 rounded-xl border border-slate-300 focus:border-red-500 focus:outline-none bg-white"
                      placeholder="12.00"
                    />
                  </div>
                  <span className="text-[11px] text-red-600 font-extrabold block mt-1">
                    = Rs. {Math.round((parseFloat(flashPriceUSD) || 0) * USD_TO_NPR).toLocaleString()} NPR
                  </span>
                </div>

                {/* % Discount Input */}
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Discount Percentage (%)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="99"
                      required
                      value={discountPercent}
                      onChange={(e) => handleDiscountPercentChange(e.target.value)}
                      className="w-full text-xs font-bold px-3 py-2 rounded-xl border border-slate-300 focus:border-red-500 focus:outline-none bg-white"
                      placeholder="40"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-xs">% OFF</span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium block mt-1">
                    Customer saves Rs. {Math.max(0, Math.round((originalPriceUSD - (parseFloat(flashPriceUSD) || 0)) * USD_TO_NPR)).toLocaleString()}
                  </span>
                </div>

              </div>

              {/* Quick Discount Presets */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <span className="text-[10px] text-slate-500 font-bold mr-1">Quick % Discount:</span>
                {[30, 40, 50, 60, 70].map(pct => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => applyDiscountPreset(pct)}
                    className={`text-[10px] font-black px-2.5 py-1 rounded-lg transition cursor-pointer ${
                      discountPercent === pct.toString()
                        ? 'bg-red-600 text-white shadow-xs'
                        : 'bg-white border border-red-200 text-red-600 hover:bg-red-50'
                    }`}
                  >
                    -{pct}% OFF
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Hour & Minute Section System */}
            <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-3">
              <label className="text-xs font-black text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-700" />
                <span>3. Hour &amp; Minute Flash Sale Duration Timer</span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Duration Hours</label>
                  <input
                    type="number"
                    min="0"
                    max="72"
                    required
                    value={durationHours}
                    onChange={(e) => setDurationHours(e.target.value)}
                    className="w-full text-xs font-bold px-3 py-2 rounded-xl border border-slate-300 focus:border-amber-500 focus:outline-none bg-white"
                    placeholder="4"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Duration Minutes</label>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    required
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(e.target.value)}
                    className="w-full text-xs font-bold px-3 py-2 rounded-xl border border-slate-300 focus:border-amber-500 focus:outline-none bg-white"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Total Flash Stock</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={totalStock}
                    onChange={(e) => setTotalStock(e.target.value)}
                    className="w-full text-xs font-bold px-3 py-2 rounded-xl border border-slate-300 focus:border-amber-500 focus:outline-none bg-white"
                    placeholder="50"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Initial Sold Units</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={soldStock}
                    onChange={(e) => setSoldStock(e.target.value)}
                    className="w-full text-xs font-bold px-3 py-2 rounded-xl border border-slate-300 focus:border-amber-500 focus:outline-none bg-white"
                    placeholder="15"
                  />
                </div>
              </div>

              {/* Quick Timer Presets */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <span className="text-[10px] text-slate-500 font-bold mr-1">Timer Presets:</span>
                {[
                  { label: '2 Hours', h: 2, m: 0 },
                  { label: '4 Hours (Standard)', h: 4, m: 0 },
                  { label: '8 Hours (Work Day)', h: 8, m: 0 },
                  { label: '24 Hours (Full Day)', h: 24, m: 0 },
                ].map(pre => (
                  <button
                    key={pre.label}
                    type="button"
                    onClick={() => applyTimerPreset(pre.h, pre.m)}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition cursor-pointer ${
                      durationHours === pre.h.toString() && durationMinutes === pre.m.toString()
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-white border border-amber-300 text-amber-900 hover:bg-amber-100'
                    }`}
                  >
                    {pre.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting || !selectedProductId}
                className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl shadow-md transition cursor-pointer flex items-center gap-2 disabled:opacity-50"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>{isSubmitting ? 'Publishing...' : '⚡ Publish to Flash Sale'}</span>
              </button>
            </div>

          </form>
        )}

        {/* Tab 2: Manage Existing Flash Sale Items */}
        {activeTab === 'list' && (
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 font-bold">
                Currently running <strong>{flashItems.length} products</strong> in Flash Sale:
              </span>
              <button
                onClick={fetchFlashItems}
                className="text-xs text-red-600 hover:underline flex items-center gap-1 font-bold cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Refresh List</span>
              </button>
            </div>

            {isLoadingFlash ? (
              <div className="p-12 text-center text-xs text-slate-500 font-bold">
                Loading active flash deals...
              </div>
            ) : flashItems.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                No active flash deals. Switch to the "+ Add Product" tab to launch one!
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[55vh] overflow-y-auto pr-1">
                {flashItems.map(item => {
                  const prod = item.product || {};
                  return (
                    <div 
                      key={item.id}
                      className="bg-slate-50 hover:bg-white p-3 rounded-xl border border-slate-200 hover:border-red-300 transition flex items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img 
                          src={prod.images?.[0] || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=200'} 
                          alt={prod.title}
                          className="w-12 h-12 rounded-lg object-cover border border-slate-200 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 truncate max-w-sm" title={prod.title}>
                            {prod.title || 'Flash Product'}
                          </h4>
                          <div className="flex items-center gap-2 mt-0.5 text-[11px]">
                            <span className="font-black text-red-600">
                              Rs. {Math.round(item.flash_price * USD_TO_NPR).toLocaleString()}
                            </span>
                            <span className="line-through text-slate-400">
                              Rs. {Math.round(item.original_price * USD_TO_NPR).toLocaleString()}
                            </span>
                            <span className="bg-red-100 text-red-700 font-black px-1.5 py-0.2 rounded text-[10px]">
                              -{item.discount_percent}% OFF
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
                          ⏳ {item.duration_hours}h {item.duration_minutes}m
                        </span>

                        <button
                          type="button"
                          onClick={() => handleRemoveFromFlash(item.id)}
                          className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition cursor-pointer"
                          title="Remove from Flash Sale"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
