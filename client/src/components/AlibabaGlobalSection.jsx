import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight, ShieldCheck, Globe } from 'lucide-react';
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
    <section 
      id="global-catalog-section"
      className="my-5 rounded-2xl border-2 border-sky-300 shadow-[0_10px_35px_rgba(56,189,248,0.15)] overflow-hidden bg-gradient-to-b from-sky-50/50 via-white to-white transition-all duration-200 ring-1 ring-sky-200/60"
    >
      
      {/* UNIFIED MODERN SKY HEADER BANNER (Matching Popular Departments style) */}
      <div className="bg-gradient-to-r from-sky-50 via-white to-sky-50/70 border-b border-sky-200/80 px-3.5 sm:px-5 py-2.5 sm:py-3 text-slate-900 flex items-center justify-between gap-3 shadow-2xs relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -right-8 -top-8 w-44 h-44 bg-sky-100/60 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute left-1/4 -bottom-8 w-36 h-36 bg-sky-200/40 rounded-full blur-xl pointer-events-none" />

        {/* Left Side: Icon + Titles & Badges */}
        <div className="flex items-center gap-3 relative z-10 min-w-0">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/20 flex items-center justify-center flex-shrink-0 border border-sky-400/30">
            <Globe className="w-5 h-5 sm:w-5.5 sm:h-5.5 stroke-[2.4]" />
          </div>

          <div className="min-w-0">
            {/* Top Row: Badges & Announcement */}
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <span className="bg-sky-600 text-white text-[9.5px] sm:text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-2xs leading-none">
                OVERSEAS PAVILION
              </span>
              <span className="text-[10.5px] sm:text-[11px] font-black text-sky-800 tracking-wide uppercase truncate">
                ✈️ {language === 'ne' ? 'प्रमाणित फ्याक्ट्री मूल्य • ग्लोबल डाइरेक्ट' : 'GLOBAL DIRECT SOURCING • VERIFIED FACTORY PRICING'}
              </span>
            </div>

            {/* Bottom Row: Main Heading + Count/Subtitle */}
            <div className="flex items-baseline gap-2">
              <h2 className="text-[17px] sm:text-[19px] font-black text-slate-950 tracking-tight leading-none">
                {language === 'ne' ? 'अन्तर्राष्ट्रिय ट्रेन्डिङ संकलन' : 'International Trending Collection'}
              </h2>
              <span className="text-[11px] sm:text-xs font-black text-sky-800/90 hidden sm:inline">
                • 🌐 {language === 'ne' ? 'प्रत्यक्ष आयात' : 'Direct Global Sourcing'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Sort & View All Controls */}
        <div className="flex items-center gap-2 relative z-10 flex-shrink-0">
          {/* Sort Dropdown */}
          <div className="bg-white border border-sky-200/90 hover:border-sky-300 rounded-xl px-2.5 py-1 text-xs text-slate-800 flex items-center shadow-2xs transition-colors">
            <span className="text-sky-700 mr-1.5 font-bold text-[11px]">{t('sortLabel') || 'Sort:'}</span>
            <select
              value={globalSortBy}
              onChange={(e) => setGlobalSortBy(e.target.value)}
              className="bg-transparent text-slate-900 font-bold text-xs focus:outline-none cursor-pointer"
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
            className="bg-sky-500 hover:bg-sky-600 active:scale-95 text-white font-black text-xs px-3.5 py-1.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer group"
            title="View all Global Direct products in catalog"
          >
            <span>{language === 'ne' ? 'सबै हेर्नुहोस्' : 'View All'}</span>
            <ChevronRight className="w-3.5 h-3.5 stroke-[2.5] group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* 3. Products Grid */}
      <div className="p-3 sm:p-4 pb-1.5 sm:pb-2 bg-gradient-to-b from-sky-50/40 via-white to-white grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {sortedAlibabaProducts.slice(0, visibleCount).map((item) => {
          const displayPrice = item.priceTiers?.[item.priceTiers.length - 1]?.price || item.samplePrice || 25;
          const originalPrice = displayPrice * 1.35;

          return (
            <div
              key={item.id}
              onClick={() => onSelectProduct(item.id)}
              className="bg-white rounded-xl border border-sky-100 hover:border-sky-500 hover:shadow-xl hover:shadow-sky-500/15 transition-all duration-200 p-2.5 flex flex-col justify-between cursor-pointer group relative overflow-hidden"
            >
              {/* Image Box */}
              <div className="aspect-square rounded-lg overflow-hidden bg-slate-50 relative mb-2">
                <img
                  src={item.images?.[0] || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400'}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />

                <span className="absolute top-1.5 left-1.5 bg-gradient-to-r from-sky-500 to-sky-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs z-10 flex items-center gap-0.5">
                  ✈️ Global Direct
                </span>

                <span className="absolute bottom-1.5 left-1.5 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs z-10">
                  Verified Stock
                </span>
              </div>

              {/* Title & Specs */}
              <div>
                <span className="text-[10px] text-sky-600 font-bold block mb-0.5 truncate">
                  {item.categoryName || 'Global Collection'}
                </span>

                <h3 className="text-xs font-semibold text-slate-800 line-clamp-2 leading-tight group-hover:text-sky-600 transition">
                  {item.title}
                </h3>

                <div className="mt-2">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-sm font-black text-sky-600">
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
                  <ShieldCheck className="w-3 h-3 text-sky-500 flex-shrink-0" />
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

      {/* 4. Bottom Centered Load More Option (Matching Flash Deal Style) */}
      {visibleCount < sortedAlibabaProducts.length && (
        <div className="pt-1.5 pb-2 sm:pt-2 sm:pb-2.5 bg-white/90 backdrop-blur-xs flex justify-center items-center border-t border-sky-100/80">
          <button
            type="button"
            onClick={() => setVisibleCount(prev => Math.min(prev + 6, sortedAlibabaProducts.length))}
            className="bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 active:scale-95 text-white font-extrabold text-xs sm:text-sm px-8 sm:px-12 py-1.5 sm:py-2 rounded-full shadow-md shadow-sky-500/25 hover:shadow-lg hover:shadow-sky-500/35 transition-all flex items-center justify-center gap-2 cursor-pointer group"
          >
            <span>{language === 'ne' ? 'थप देखाउनुहोस्' : 'Load More'}</span>
            <ChevronDown className="w-4 h-4 stroke-[2.5] group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>
      )}

    </section>
  );
};
