import React, { useState, useEffect } from 'react';
import { X, DollarSign, Tag, Save, Sparkles, Check, ArrowRight, Trash2 } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import confetti from 'canvas-confetti';

const USD_TO_NPR = 133.5;

export const ProductEditModal = ({ isOpen, onClose, product, onProductUpdated, onDeleteProduct }) => {
  const { formatPrice, formatNPR } = useCurrency();

  const [title, setTitle] = useState('');
  const [priceUSD, setPriceUSD] = useState('');
  const [priceNPR, setPriceNPR] = useState('');
  const [moq, setMoq] = useState('10');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (product) {
      setTitle(product.title || '');
      const sample = product.samplePrice || 20;
      setPriceUSD(sample.toString());
      setPriceNPR(Math.round(sample * USD_TO_NPR).toString());
      setMoq(product.moq?.toString() || '10');
      setErrorMsg('');
    }
  }, [product]);

  if (!isOpen || !product) return null;

  // Handle USD input change -> recalculate NPR
  const handleUSDChange = (val) => {
    setPriceUSD(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      setPriceNPR(Math.round(num * USD_TO_NPR).toString());
    }
  };

  // Handle NPR input change -> recalculate USD
  const handleNPRChange = (val) => {
    setPriceNPR(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      setPriceUSD((num / USD_TO_NPR).toFixed(2));
    }
  };

  // Quick Multiplier Shortcuts based on original factory rate if available
  const baseRate = product.originalAlibabaPrice || (product.samplePrice ? product.samplePrice / 3.0 : 15);
  const applyMultiplier = (mult) => {
    const newUSD = parseFloat((baseRate * mult).toFixed(2));
    setPriceUSD(newUSD.toString());
    setPriceNPR(Math.round(newUSD * USD_TO_NPR).toString());
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const finalUSD = parseFloat(priceUSD);
    if (isNaN(finalUSD) || finalUSD <= 0) {
      setErrorMsg('Please enter a valid price greater than 0.');
      return;
    }

    setIsSaving(true);
    setErrorMsg('');

    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          price: finalUSD,
          samplePrice: finalUSD,
          title: title.trim(),
          moq: parseInt(moq) || product.moq || 10,
          productData: product
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        confetti({ particleCount: 40, spread: 55, origin: { y: 0.7 } });
        if (onProductUpdated) {
          onProductUpdated(data.product);
        }
        onClose();
      } else {
        setErrorMsg(data.error || 'Failed to save product price.');
      }
    } catch (err) {
      console.error('Update product error:', err);
      setErrorMsg('Network error: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
              <span>Edit Product & Pricing</span>
              <span className="bg-orange-100 text-[#F85606] text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                Live SKU
              </span>
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Update wholesale or retail price in NPR & USD
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSave} className="p-6 space-y-4">
          
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg font-medium">
              {errorMsg}
            </div>
          )}

          {/* Product Preview Card */}
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <img
              src={product.images?.[0] || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=100'}
              alt={product.title}
              className="w-14 h-14 object-cover rounded-lg border border-slate-200 flex-shrink-0 bg-white"
            />
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#F85606] block">
                {product.categoryName || 'Apparel & Accessories'}
              </span>
              <h4 className="text-xs font-semibold text-slate-800 line-clamp-1 mt-0.5">
                {product.title}
              </h4>
              <span className="text-[11px] text-slate-500 mt-0.5 block">
                Current Catalog Price: <strong className="text-slate-900">{formatPrice(product.samplePrice)}</strong> ({formatNPR(product.samplePrice)})
              </span>
            </div>
          </div>

          {/* Title Editor */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Product Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xs font-medium px-3 py-2 rounded-lg border border-slate-300 focus:border-[#F85606] focus:outline-none focus:ring-1 focus:ring-[#F85606]"
              placeholder="Product Title"
              required
            />
          </div>

          {/* Two-Way Price Inputs: NPR & USD */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* NPR Price Input */}
            <div className="bg-orange-50/60 p-3.5 rounded-xl border border-orange-200/70">
              <label className="text-xs font-bold text-slate-800 block mb-1">
                Selling Price in Nepal (NPR / Rs.)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-bold text-[#F85606]">
                  Rs.
                </span>
                <input
                  type="number"
                  step="any"
                  value={priceNPR}
                  onChange={(e) => handleNPRChange(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm font-extrabold text-slate-900 bg-white rounded-lg border border-orange-300 focus:border-[#F85606] focus:outline-none focus:ring-2 focus:ring-[#F85606]/20"
                  placeholder="5500"
                  required
                />
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">
                Customer checkout price in NPR
              </span>
            </div>

            {/* USD Price Input */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <label className="text-xs font-bold text-slate-800 block mb-1">
                USD Price ($)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-500">
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  value={priceUSD}
                  onChange={(e) => handleUSDChange(e.target.value)}
                  className="w-full pl-7 pr-3 py-2 text-sm font-extrabold text-slate-900 bg-white rounded-lg border border-slate-300 focus:border-[#F85606] focus:outline-none focus:ring-2 focus:ring-[#F85606]/20"
                  placeholder="41.20"
                  required
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Auto-converted at 1 USD = Rs. 133.50
              </span>
            </div>
          </div>

          {/* Quick Markup Presets */}
          <div>
            <span className="text-[11px] font-bold text-slate-500 block mb-1.5 uppercase tracking-wider">
              Quick Price Multiplier Presets:
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => applyMultiplier(3.0)}
                className="text-xs px-2.5 py-1 rounded-md bg-orange-100 text-[#F85606] hover:bg-orange-200 font-bold transition"
              >
                3.0x Alibaba
              </button>
              <button
                type="button"
                onClick={() => applyMultiplier(2.5)}
                className="text-xs px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium transition"
              >
                2.5x Standard
              </button>
              <button
                type="button"
                onClick={() => applyMultiplier(2.0)}
                className="text-xs px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium transition"
              >
                2.0x Wholesale
              </button>
              <button
                type="button"
                onClick={() => applyMultiplier(1.5)}
                className="text-xs px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium transition"
              >
                1.5x Flash Sale
              </button>
            </div>
          </div>

          {/* MOQ / Minimum Order */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Minimum Order Quantity (MOQ)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={moq}
                onChange={(e) => setMoq(e.target.value)}
                className="w-24 text-xs font-bold px-3 py-2 rounded-lg border border-slate-300 focus:border-[#F85606] focus:outline-none"
                placeholder="10"
              />
              <span className="text-xs text-slate-500">
                {product.unit || 'pieces'}
              </span>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2.5">
            {onDeleteProduct && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                  onDeleteProduct(product.id, e);
                }}
                className="px-3.5 py-2 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer hover:border-red-300 active:scale-95 shadow-2xs"
                title="Permanently remove this product from Bhanjo.com"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-600" />
                <span>Delete Product</span>
              </button>
            )}

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="bg-[#F85606] hover:bg-[#e04e05] disabled:opacity-50 text-white text-xs font-bold px-5 py-2.5 rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer"
              >
                {isSaving ? (
                  <span>Saving Price...</span>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save New Price</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
