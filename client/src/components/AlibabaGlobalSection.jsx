import React, { useState, useMemo } from 'react';
import { ChevronDown, ShieldCheck, Globe } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

export const AlibabaGlobalSection = ({ products = [], onSelectProduct, onViewAll }) => {
  const { formatPrice, t, language } = useCurrency();
  const [globalSortBy, setGlobalSortBy] = useState('popular');
  const [visibleCount, setVisibleCount] = useState(6);

  // Filter or prioritize imported global products
  const alibabaProducts = products.filter(p => p.isAlibabaImport || p.is1688Import || p.id.startsWith('ali-') || p.id.startsWith('1688-'));

  const sortedAlibabaProducts = useMemo(() => {
    const list = [...alibabaProducts];
    if (globalSortBy === 'price-low') {
      return list.sort((a, b) => (a.samplePrice || 20) - (b.samplePrice || 20));
    }
    if (globalSortBy === 'price-high') {
      return list.sort((a, b) => (b.samplePrice || 20) - (a.samplePrice || 20));
    }
    if (globalSortBy === 'rating') {
      return list.sort((a, b) => (b.rating || 4.5) - (a.rating || 4.5));
    }
    
    // Balanced multi-category showcase (Hoodies, Tech, Bags, Shoes, etc.)
    const byCategory = {};
    for (const p of list) {
      const cat = p.categoryId || 'other';
      if (!byCategory[cat]) byCategory[cat] = [];
      byCategory[cat].push(p);
    }
    const categories = Object.keys(byCategory);
    const interleaved = [];
    const maxLen = Math.max(...categories.map(c => byCategory[c].length), 0);
    for (let i = 0; i < maxLen; i++) {
      for (const cat of categories) {
        if (byCategory[cat][i]) {
          interleaved.push(byCategory[cat][i]);
        }
      }
    }
    return interleaved.length > 0 ? interleaved : list;
  }, [alibabaProducts, globalSortBy]);

  if (alibabaProducts.length === 0) return null;

  return (
    <section className="my-10 sm:my-14 pb-8 border-b border-slate-200/80" id="global-catalog-section">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 px-1 gap-2">
        <div className="flex items-center gap-2.5">
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
            International Trending Collection
          </h2>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap sm:flex-nowrap">
          {/* Sort Dropdown near View All */}
          <div className="bg-white border border-slate-300 rounded-xl px-2.5 py-1 text-xs shadow-2xs hover:border-orange-400 transition flex items-center">
            <span className="text-slate-400 mr-1.5 font-medium">{t('sortLabel') || 'Sort:'}</span>
            <select
              value={globalSortBy}
              onChange={(e) => setGlobalSortBy(e.target.value)}
              className="bg-transparent text-slate-800 font-bold focus:outline-none cursor-pointer"
            >
              <option value="popular">{t('popular') || 'Popular'}</option>
              <option value="price-low">{t('priceLowToHigh') || 'Price: Low to High'}</option>
              <option value="price-high">{t('priceHighToLow') || 'Price: High to Low'}</option>
              <option value="rating">{language === 'ne' ? 'उच्च मूल्याङ्कन' : 'Top Rated'}</option>
            </select>
          </div>

          {/* View All Button */}
          <button 
            onClick={() => {
              if (onViewAll) {
                onViewAll();
              } else {
                const catalogElem = document.getElementById('catalog-section');
                if (catalogElem) catalogElem.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border bg-white hover:bg-orange-50 text-slate-700 hover:text-[#F85606] border-slate-300 shadow-2xs"
            title="View all Global Direct products in catalog"
          >
            <span>👁️ {language === 'ne' ? 'सबै हेर्नुहोस्' : 'View All'}</span>
          </button>
        </div>
      </div>

      {/* Grid of Cards (Loaded progressively via Load More) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {sortedAlibabaProducts.slice(0, visibleCount).map((item) => {
          const displayPrice = item.priceTiers?.[item.priceTiers.length - 1]?.price || item.samplePrice || 25;
          const originalPrice = displayPrice * 1.35;

          return (
            <div
              key={item.id}
              onClick={() => onSelectProduct(item.id)}
              className="bg-white rounded-xl border border-slate-200 hover:border-orange-400 hover:shadow-md transition duration-150 p-2.5 flex flex-col justify-between cursor-pointer group relative overflow-hidden"
            >
              {/* Image Box */}
              <div className="aspect-square rounded-lg overflow-hidden bg-slate-50 relative mb-2">
                <img
                  src={item.images?.[0] || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400'}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />

                <span className="absolute top-1.5 left-1.5 bg-[#FF6A00] text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs z-10 flex items-center gap-0.5">
                  ✈️ Global Direct
                </span>

                <span className="absolute bottom-1.5 left-1.5 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs z-10">
                  Verified Stock
                </span>
              </div>

              {/* Title & Specs */}
              <div>
                <span className="text-[10px] text-orange-600 font-bold block mb-0.5 truncate">
                  {item.categoryName || 'Global Collection'}
                </span>

                <h3 className="text-xs font-semibold text-slate-800 line-clamp-2 leading-tight group-hover:text-[#FF6A00] transition">
                  {item.title}
                </h3>

                <div className="mt-2">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-sm font-black text-[#FF6A00]">
                      {formatPrice(displayPrice)}
                    </span>
                    <span className="text-[10px] text-slate-400 line-through">
                      {formatPrice(originalPrice)}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium block">
                    Direct Import • Fast Delivery Nepal
                  </span>
                </div>
              </div>

              {/* Footer Badge */}
              <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                <span className="flex items-center gap-0.5 truncate">
                  <ShieldCheck className="w-3 h-3 text-amber-500 flex-shrink-0" />
                  <span className="truncate">
                    Verified Seller
                  </span>
                </span>
                <span className="font-bold text-slate-700">★ {item.rating || 4.9}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Centered Load More Option in the Down Middle (Matching Flash Deal Style) */}
      {visibleCount < sortedAlibabaProducts.length && (
        <div className="mt-5 sm:mt-6 flex justify-center items-center">
          <button
            type="button"
            onClick={() => setVisibleCount(prev => Math.min(prev + 6, sortedAlibabaProducts.length))}
            className="bg-gradient-to-r from-[#FF6A00] to-[#F85606] hover:from-[#EE5007] hover:to-[#e04e05] active:scale-95 text-white font-extrabold text-xs sm:text-sm px-8 sm:px-12 py-2.5 rounded-full shadow-md shadow-orange-500/20 hover:shadow-lg hover:shadow-orange-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer group"
          >
            <span>{language === 'ne' ? 'थप देखाउनुहोस्' : 'Load More'}</span>
            <ChevronDown className="w-4 h-4 stroke-[2.5] group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>
      )}

    </section>
  );
};
