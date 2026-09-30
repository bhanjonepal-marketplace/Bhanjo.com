import React, { useState, useEffect } from 'react';
import { Filter, Star, Check, RotateCcw, X } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { useAuth } from '../context/AuthContext';

export const CatalogFilterSidebar = ({ 
  onPriceFilter, 
  priceRange,
  filterOnlyNepal, 
  setFilterOnlyNepal,
  filterAlibabaOnly, 
  setFilterAlibabaOnly,
  filterFreeDelivery,
  setFilterFreeDelivery,
  filterMallOnly, 
  setFilterMallOnly,
  minRating, 
  setMinRating,
  onResetFilters,
  onClose
}) => {
  const { t, currentCurrency } = useCurrency();
  const { isAdmin } = useAuth();
  const RATE_NPR = currentCurrency?.rate || 133.5;

  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Synchronize internal inputs if external reset occurs (e.g. from empty state button)
  useEffect(() => {
    if (!priceRange) return;
    if (priceRange.min === 0 && (priceRange.max === Infinity || priceRange.max === undefined)) {
      setMinPrice('');
      setMaxPrice('');
    } else {
      if (priceRange.min > 0) {
        setMinPrice(String(Math.round(priceRange.min * RATE_NPR)));
      } else {
        setMinPrice('');
      }
      if (priceRange.max < Infinity) {
        setMaxPrice(String(Math.round(priceRange.max * RATE_NPR)));
      } else {
        setMaxPrice('');
      }
    }
  }, [priceRange, RATE_NPR]);

  const isQuickActive = (minNPR, maxNPR) => {
    const minVal = parseFloat(minPrice) || 0;
    const maxVal = parseFloat(maxPrice) || Infinity;
    const expectedMin = minNPR !== null ? minNPR : 0;
    const expectedMax = maxNPR !== null ? maxNPR : Infinity;

    if (minNPR === null && maxNPR !== null) {
      return (minPrice === '' || minVal === 0) && maxVal === expectedMax;
    }
    if (minNPR !== null && maxNPR !== null) {
      return minVal === expectedMin && maxVal === expectedMax;
    }
    if (minNPR !== null && maxNPR === null) {
      return minVal === expectedMin && (maxPrice === '' || maxVal === Infinity);
    }
    return false;
  };

  const handleQuickPrice = (minNPR, maxNPR) => {
    if (isQuickActive(minNPR, maxNPR)) {
      // Toggle off if already active
      setMinPrice('');
      setMaxPrice('');
      if (onPriceFilter) onPriceFilter(0, Infinity);
      return;
    }

    setMinPrice(minNPR !== null ? String(minNPR) : '');
    setMaxPrice(maxNPR !== null ? String(maxNPR) : '');
    if (onPriceFilter) {
      const minUSD = minNPR !== null ? minNPR / RATE_NPR : 0;
      const maxUSD = maxNPR !== null ? maxNPR / RATE_NPR : Infinity;
      onPriceFilter(minUSD, maxUSD);
    }
  };

  const handleApplyPrice = (e) => {
    if (e) e.preventDefault();
    if (onPriceFilter) {
      let minNum = parseFloat(minPrice);
      let maxNum = parseFloat(maxPrice);
      
      if (!isNaN(minNum) && minNum < 0) minNum = 0;
      if (!isNaN(maxNum) && maxNum < 0) maxNum = 0;

      // Auto-correct if user mistakenly entered min > max
      if (!isNaN(minNum) && !isNaN(maxNum) && minNum > maxNum) {
        const temp = minNum;
        minNum = maxNum;
        maxNum = temp;
        setMinPrice(String(minNum));
        setMaxPrice(String(maxNum));
      }
      
      // Convert NPR user input to USD base price to match product.samplePrice
      const minUSD = (!isNaN(minNum) && minNum > 0) ? minNum / RATE_NPR : 0;
      const maxUSD = (!isNaN(maxNum) && maxNum > 0) ? maxNum / RATE_NPR : Infinity;
      
      onPriceFilter(minUSD, maxUSD);
    }
  };

  const handleReset = () => {
    setMinPrice('');
    setMaxPrice('');
    if (onPriceFilter) onPriceFilter(0, Infinity);
    if (onResetFilters) onResetFilters();
  };

  // Count active filters
  const hasPriceActive = (priceRange && (priceRange.min > 0 || priceRange.max < Infinity)) || minPrice !== '' || maxPrice !== '';
  const activeCount = [
    filterOnlyNepal,
    filterAlibabaOnly,
    filterMallOnly,
    filterFreeDelivery,
    minRating > 0,
    hasPriceActive
  ].filter(Boolean).length;

  return (
    <aside className="bg-white rounded-xl border border-slate-200 p-4 text-xs space-y-4 shadow-sm">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
        <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-[#F85606]" />
          <span>{t('filters')}</span>
          {activeCount > 0 && (
            <span className="bg-[#F85606] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </h3>

        <div className="flex items-center gap-2">
          {activeCount > 0 && (
            <button
              onClick={handleReset}
              className="text-[11px] text-slate-500 hover:text-[#F85606] transition flex items-center gap-1 font-semibold cursor-pointer"
              title="Reset all filters"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{t('reset')}</span>
            </button>
          )}

          {onClose && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-1 rounded-md hover:bg-slate-100 transition cursor-pointer lg:hidden"
              aria-label="Close filters"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Service & Promotion Checkboxes (Daraz Style) */}
      <div>
        <h4 className="font-bold text-slate-800 mb-2">{t('servicePromotion')}</h4>
        <div className="space-y-1.5 text-slate-600">
          <label className="flex items-center gap-2 cursor-pointer hover:text-slate-900 select-none p-1 rounded hover:bg-slate-50 transition">
            <input
              type="checkbox"
              checked={filterOnlyNepal}
              onChange={(e) => setFilterOnlyNepal(e.target.checked)}
              className="accent-[#F85606] rounded w-3.5 h-3.5 cursor-pointer"
            />
            <span>{t('nepalAuthenticGI')}</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer hover:text-slate-900 select-none p-1 rounded hover:bg-slate-50 transition">
            <input
              type="checkbox"
              checked={filterAlibabaOnly}
              onChange={(e) => setFilterAlibabaOnly(e.target.checked)}
              className="accent-[#FF6A00] rounded w-3.5 h-3.5 cursor-pointer"
            />
            <span>{isAdmin ? t('alibabaGlobalDirect') : 'Bhanjo Global Express'}</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer hover:text-slate-900 select-none p-1 rounded hover:bg-slate-50 transition">
            <input
              type="checkbox"
              checked={filterMallOnly}
              onChange={(e) => setFilterMallOnly(e.target.checked)}
              className="accent-[#F85606] rounded w-3.5 h-3.5 cursor-pointer"
            />
            <span>{t('bhanjoMallOfficial')}</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer hover:text-slate-900 select-none p-1 rounded hover:bg-slate-50 transition">
            <input
              type="checkbox"
              checked={filterFreeDelivery}
              onChange={(e) => setFilterFreeDelivery(e.target.checked)}
              className="accent-[#F85606] rounded w-3.5 h-3.5 cursor-pointer"
            />
            <span>{t('freeDeliveryAvailable')}</span>
          </label>
        </div>
      </div>

      {/* Price Range Filter (in Nepali Rupees) */}
      <div className="pt-2 border-t border-slate-100">
        <h4 className="font-bold text-slate-800 mb-2 flex items-center justify-between">
          <span>{t('priceRange')}</span>
          <span className="text-[10px] text-slate-400 font-normal">NPR (Rs.)</span>
        </h4>

        {/* Quick Range Presets */}
        <div className="grid grid-cols-3 gap-1 mb-2">
          <button
            type="button"
            onClick={() => handleQuickPrice(null, 1500)}
            className={`px-1.5 py-1 text-[10px] rounded border transition truncate cursor-pointer font-medium ${
              isQuickActive(null, 1500)
                ? 'bg-orange-50 border-[#F85606] text-[#F85606] font-bold shadow-sm'
                : 'bg-slate-100 hover:bg-orange-50 hover:text-[#F85606] border-slate-200 text-slate-600'
            }`}
          >
            &lt; Rs. 1.5K
          </button>
          <button
            type="button"
            onClick={() => handleQuickPrice(1500, 5000)}
            className={`px-1.5 py-1 text-[10px] rounded border transition truncate cursor-pointer font-medium ${
              isQuickActive(1500, 5000)
                ? 'bg-orange-50 border-[#F85606] text-[#F85606] font-bold shadow-sm'
                : 'bg-slate-100 hover:bg-orange-50 hover:text-[#F85606] border-slate-200 text-slate-600'
            }`}
          >
            1.5K - 5K
          </button>
          <button
            type="button"
            onClick={() => handleQuickPrice(5000, null)}
            className={`px-1.5 py-1 text-[10px] rounded border transition truncate cursor-pointer font-medium ${
              isQuickActive(5000, null)
                ? 'bg-orange-50 border-[#F85606] text-[#F85606] font-bold shadow-sm'
                : 'bg-slate-100 hover:bg-orange-50 hover:text-[#F85606] border-slate-200 text-slate-600'
            }`}
          >
            &gt; Rs. 5K
          </button>
        </div>

        <form onSubmit={handleApplyPrice} className="space-y-2">
          <div className="flex items-center gap-1.5">
            <div className="relative flex-1">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold">Rs.</span>
              <input
                type="number"
                min="0"
                placeholder={t('minPricePlaceholder')}
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full pl-6 pr-2 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:border-[#F85606] focus:ring-1 focus:ring-[#F85606] font-medium"
              />
            </div>
            <span className="text-slate-400">-</span>
            <div className="relative flex-1">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold">Rs.</span>
              <input
                type="number"
                min="0"
                placeholder={t('maxPricePlaceholder')}
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full pl-6 pr-2 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:border-[#F85606] focus:ring-1 focus:ring-[#F85606] font-medium"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-[#F85606] hover:bg-[#e04e05] text-white font-bold py-1.5 rounded transition text-[11px] shadow-sm cursor-pointer"
          >
            {t('applyPrice')}
          </button>
        </form>
      </div>

      {/* Customer Rating Filter */}
      <div className="pt-2 border-t border-slate-100">
        <h4 className="font-bold text-slate-800 mb-2">{t('rating')}</h4>
        <div className="space-y-1">
          {[4, 3, 2].map((stars) => (
            <button
              key={stars}
              onClick={() => setMinRating(minRating === stars ? 0 : stars)}
              className={`w-full flex items-center justify-between p-1.5 rounded text-left transition cursor-pointer ${
                minRating === stars ? 'bg-orange-50 font-bold text-[#F85606]' : 'hover:bg-slate-50 text-slate-600'
              }`}
            >
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${i < stars ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
                  />
                ))}
                <span className="text-slate-600 text-[11px] ml-1">{t('starsAndUp')}</span>
              </div>
              {minRating === stars && <Check className="w-3 h-3 text-[#F85606]" />}
            </button>
          ))}
        </div>
      </div>

      {/* Nepal Delivery & Coverage Tag */}
      <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
        <h4 className="font-bold text-slate-800 mb-1.5 text-xs">{t('dispatchLocation')}</h4>
        <div className="space-y-1 text-[10px]">
          <div>• {t('kathmanduValley')} (1-2 Days)</div>
          <div>• {t('pokharaGandaki')} (2-3 Days)</div>
          <div>• {t('birgunjTerai')} (2-4 Days)</div>
          <div>• All 77 Nepal Districts Delivery</div>
        </div>
      </div>

    </aside>
  );
};
