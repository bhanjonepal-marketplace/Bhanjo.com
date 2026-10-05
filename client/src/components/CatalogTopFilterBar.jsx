import React, { useState, useEffect, useRef } from 'react';
import { Filter, Star, Check, RotateCcw, ChevronDown, Sparkles, Truck, Store, Globe, MapPin, X } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

export const CatalogTopFilterBar = ({
  priceRange,
  onPriceFilter,
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
  activeFilterCount
}) => {
  const { t, currentCurrency } = useCurrency();
  const RATE_NPR = currentCurrency?.rate || 133.5;

  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [isPriceDropdownOpen, setIsPriceDropdownOpen] = useState(false);
  const [isRatingDropdownOpen, setIsRatingDropdownOpen] = useState(false);
  const [isDispatchTooltipOpen, setIsDispatchTooltipOpen] = useState(false);

  const priceRef = useRef(null);
  const ratingRef = useRef(null);
  const dispatchRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (priceRef.current && !priceRef.current.contains(e.target)) {
        setIsPriceDropdownOpen(false);
      }
      if (ratingRef.current && !ratingRef.current.contains(e.target)) {
        setIsRatingDropdownOpen(false);
      }
      if (dispatchRef.current && !dispatchRef.current.contains(e.target)) {
        setIsDispatchTooltipOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync inputs with priceRange
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

      if (!isNaN(minNum) && !isNaN(maxNum) && minNum > maxNum) {
        const temp = minNum;
        minNum = maxNum;
        maxNum = temp;
        setMinPrice(String(minNum));
        setMaxPrice(String(maxNum));
      }

      const minUSD = (!isNaN(minNum) && minNum > 0) ? minNum / RATE_NPR : 0;
      const maxUSD = (!isNaN(maxNum) && maxNum > 0) ? maxNum / RATE_NPR : Infinity;

      onPriceFilter(minUSD, maxUSD);
      setIsPriceDropdownOpen(false);
    }
  };

  const hasPriceActive = (priceRange && (priceRange.min > 0 || priceRange.max < Infinity)) || minPrice !== '' || maxPrice !== '';

  const getPriceLabel = () => {
    if (isQuickActive(null, 1500)) return '< Rs. 1.5K';
    if (isQuickActive(1500, 5000)) return 'Rs. 1.5K - 5K';
    if (isQuickActive(5000, null)) return '> Rs. 5K';
    if (minPrice && maxPrice) return `Rs. ${minPrice} - ${maxPrice}`;
    if (minPrice) return `> Rs. ${minPrice}`;
    if (maxPrice) return `< Rs. ${maxPrice}`;
    return t('priceRange');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-3 sm:p-3.5 mb-5 shadow-xs transition-all">
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        
        {/* Left Side: Filter Chips & Quick Selectors */}
        <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
          
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 pr-2 border-r border-slate-200 flex-shrink-0">
            <Filter className="w-3.5 h-3.5 text-[#F85606]" />
            <span className="hidden sm:inline">{t('filters')}</span>
            {activeFilterCount > 0 && (
              <span className="bg-[#F85606] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </div>

          {/* Quick Pill: Bhanjo Global Direct */}
          <button
            type="button"
            onClick={() => setFilterAlibabaOnly(!filterAlibabaOnly)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border ${
              filterAlibabaOnly
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-transparent shadow-xs'
                : 'bg-slate-50 hover:bg-orange-50 text-slate-700 hover:text-[#F85606] border-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Bhanjo Global Direct</span>
          </button>

          {/* Quick Pill: Nepal Authentic GI */}
          <button
            type="button"
            onClick={() => setFilterOnlyNepal(!filterOnlyNepal)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border ${
              filterOnlyNepal
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-transparent shadow-xs'
                : 'bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border-slate-200'
            }`}
          >
            <span>🇳🇵</span>
            <span>{t('nepalAuthenticGI')}</span>
          </button>

          {/* Quick Pill: Bhanjo Mall */}
          <button
            type="button"
            onClick={() => setFilterMallOnly(!filterMallOnly)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border ${
              filterMallOnly
                ? 'bg-gradient-to-r from-rose-500 to-red-600 text-white border-transparent shadow-xs'
                : 'bg-slate-50 hover:bg-rose-50 text-slate-700 hover:text-rose-600 border-slate-200'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>{t('bhanjoMallOfficial')}</span>
          </button>

          {/* Quick Pill: Free Delivery */}
          <button
            type="button"
            onClick={() => setFilterFreeDelivery(!filterFreeDelivery)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border ${
              filterFreeDelivery
                ? 'bg-[#F85606] text-white border-transparent shadow-xs'
                : 'bg-slate-50 hover:bg-orange-50 text-slate-700 hover:text-[#F85606] border-slate-200'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>{t('freeDeliveryAvailable')}</span>
          </button>

          {/* Price Range Dropdown Pill */}
          <div className="relative" ref={priceRef}>
            <button
              type="button"
              onClick={() => setIsPriceDropdownOpen(!isPriceDropdownOpen)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border ${
                hasPriceActive
                  ? 'bg-orange-50 border-[#F85606] text-[#F85606] font-bold shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <span>{getPriceLabel()}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isPriceDropdownOpen ? 'rotate-180 text-[#F85606]' : 'text-slate-400'}`} />
            </button>

            {/* Price Popover Panel */}
            {isPriceDropdownOpen && (
              <div className="absolute left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-3.5 z-30 animate-in fade-in zoom-in-95 duration-100">
                <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-100">
                  <span className="font-bold text-xs text-slate-800">{t('priceRange')} (NPR)</span>
                  {hasPriceActive && (
                    <button
                      type="button"
                      onClick={() => {
                        setMinPrice('');
                        setMaxPrice('');
                        if (onPriceFilter) onPriceFilter(0, Infinity);
                      }}
                      className="text-[10px] text-slate-500 hover:text-[#F85606] font-semibold"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Quick Presets */}
                <div className="grid grid-cols-3 gap-1.5 mb-3">
                  <button
                    type="button"
                    onClick={() => handleQuickPrice(null, 1500)}
                    className={`py-1 px-1.5 text-[11px] rounded-lg border text-center transition font-medium cursor-pointer ${
                      isQuickActive(null, 1500)
                        ? 'bg-[#F85606] text-white border-transparent font-bold'
                        : 'bg-slate-50 hover:bg-orange-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    &lt; 1.5K
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickPrice(1500, 5000)}
                    className={`py-1 px-1.5 text-[11px] rounded-lg border text-center transition font-medium cursor-pointer ${
                      isQuickActive(1500, 5000)
                        ? 'bg-[#F85606] text-white border-transparent font-bold'
                        : 'bg-slate-50 hover:bg-orange-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    1.5K - 5K
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickPrice(5000, null)}
                    className={`py-1 px-1.5 text-[11px] rounded-lg border text-center transition font-medium cursor-pointer ${
                      isQuickActive(5000, null)
                        ? 'bg-[#F85606] text-white border-transparent font-bold'
                        : 'bg-slate-50 hover:bg-orange-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    &gt; 5K
                  </button>
                </div>

                {/* Custom Min / Max inputs */}
                <form onSubmit={handleApplyPrice} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold">Rs.</span>
                      <input
                        type="number"
                        min="0"
                        placeholder="Min"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="w-full pl-7 pr-2 py-1.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-[#F85606]"
                      />
                    </div>
                    <span className="text-slate-400 text-xs">-</span>
                    <div className="relative flex-1">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold">Rs.</span>
                      <input
                        type="number"
                        min="0"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-full pl-7 pr-2 py-1.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-[#F85606]"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#F85606] hover:bg-[#e04e05] text-white font-bold py-1.5 rounded-lg text-xs transition cursor-pointer shadow-xs"
                  >
                    {t('applyPrice')}
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Rating Dropdown Pill */}
          <div className="relative" ref={ratingRef}>
            <button
              type="button"
              onClick={() => setIsRatingDropdownOpen(!isRatingDropdownOpen)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border ${
                minRating > 0
                  ? 'bg-amber-50 border-amber-400 text-amber-700 font-bold shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${minRating > 0 ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}`} />
              <span>{minRating > 0 ? `★ ${minRating}.0+` : t('rating')}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isRatingDropdownOpen ? 'rotate-180 text-amber-600' : 'text-slate-400'}`} />
            </button>

            {/* Rating Popover */}
            {isRatingDropdownOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-30 animate-in fade-in zoom-in-95 duration-100">
                <div className="space-y-1">
                  {[4, 3, 2].map((stars) => (
                    <button
                      key={stars}
                      type="button"
                      onClick={() => {
                        setMinRating(minRating === stars ? 0 : stars);
                        setIsRatingDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition cursor-pointer ${
                        minRating === stars ? 'bg-amber-50 text-amber-800 font-bold' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        <span className="text-amber-500 font-bold">★ {stars}.0</span>
                        <span className="text-slate-500 text-[11px]">& up</span>
                      </div>
                      {minRating === stars && <Check className="w-3.5 h-3.5 text-amber-600" />}
                    </button>
                  ))}
                  {minRating > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setMinRating(0);
                        setIsRatingDropdownOpen(false);
                      }}
                      className="w-full text-center py-1.5 text-[11px] text-slate-500 hover:text-red-600 font-semibold border-t border-slate-100 mt-1 cursor-pointer"
                    >
                      Clear Rating Filter
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Dispatch Locations Pill / Info */}
          <div className="relative hidden md:block" ref={dispatchRef}>
            <button
              type="button"
              onClick={() => setIsDispatchTooltipOpen(!isDispatchTooltipOpen)}
              className="px-2.5 py-1.5 rounded-xl text-xs font-medium bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1 cursor-pointer"
            >
              <MapPin className="w-3 h-3 text-[#F85606]" />
              <span className="text-[11px]">Nepal 77 Districts Delivery</span>
            </button>

            {isDispatchTooltipOpen && (
              <div className="absolute left-0 mt-2 w-64 bg-slate-900 text-white rounded-xl shadow-xl p-3 z-30 text-[11px] space-y-1.5 animate-in fade-in duration-100">
                <div className="font-bold text-amber-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Nepal Fast Transit Times</span>
                </div>
                <div className="text-slate-300 space-y-1 text-[10px]">
                  <div>• Kathmandu Valley: 1-2 Days</div>
                  <div>• Pokhara / Gandaki: 2-3 Days</div>
                  <div>• Birgunj / Terai: 2-4 Days</div>
                  <div>• All 77 Districts Direct Delivery</div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right Side: Reset Filters Button */}
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={onResetFilters}
            className="flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 font-bold bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-xl transition cursor-pointer flex-shrink-0"
            title="Reset all active filters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t('resetFilters')}</span>
          </button>
        )}

      </div>
    </div>
  );
};
