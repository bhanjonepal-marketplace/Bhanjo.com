import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight, ShieldCheck } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

export const AlibabaGlobalSection = ({ products = [], onSelectProduct, onViewAll }) => {
  const { formatPrice, t, language } = useCurrency();
  const [globalSortBy, setGlobalSortBy] = useState('popular');
  const [visibleCount, setVisibleCount] = useState(5);

  // Filter or prioritize imported global products
  const alibabaProducts = products.filter(p => p.isAlibabaImport || p.is1688Import || p.id?.startsWith('ali-') || p.id?.startsWith('1688-'));

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
      className="my-4 sm:my-5 rounded-2xl border border-[#E5E7EB] bg-white p-4 sm:p-5 shadow-xs transition-all duration-200"
    >
      {/* Header Row matching reference image */}
      <div>
        {/* Top Row: Badges and Subtitle */}
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className="bg-[#1B1F3B] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider shadow-2xs">
            OVERSEAS PAVILION
          </span>
          <span className="text-[10px] sm:text-[10.5px] font-bold text-[#5B6070] tracking-wider uppercase truncate">
            GLOBAL DIRECT SOURCING • VERIFIED FACTORY PRICING
          </span>
        </div>

        {/* Second Row: Main Title on Left, Sort & View All on Right */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-1.5">
          <h2 className="text-lg sm:text-xl font-black text-[#1B1F3B] tracking-tight">
            International Trending Collection
          </h2>

          <div className="flex items-center gap-2.5 flex-shrink-0">
            {/* Sort Dropdown */}
            <div className="bg-white border border-[#E5E7EB] hover:border-slate-300 rounded-lg px-2.5 py-1 text-xs text-slate-700 flex items-center shadow-2xs">
              <span className="text-[#5B6070] mr-1.5 font-bold text-[11px]">Sort:</span>
              <select
                value={globalSortBy}
                onChange={(e) => setGlobalSortBy(e.target.value)}
                className="bg-transparent text-[#1B1F3B] font-bold text-xs focus:outline-none cursor-pointer"
              >
                <option value="popular">Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

            {/* View All Button */}
            <button 
              type="button"
              onClick={() => {
                if (onViewAll) {
                  onViewAll();
                } else {
                  const catalogElem = document.getElementById('catalog-section');
                  if (catalogElem) catalogElem.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="bg-[#E11D48] hover:bg-[#BE123C] text-white font-bold text-xs px-4 py-1.5 rounded-lg shadow-xs transition-all flex items-center gap-1 cursor-pointer active:scale-95"
              title="View all Global Direct products"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>

      {/* 5-Column Products Grid (Matching reference image) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-4">
        {sortedAlibabaProducts.slice(0, visibleCount).map((item) => {
          const displayPrice = item.priceTiers?.[item.priceTiers.length - 1]?.price || item.samplePrice || 25;
          const originalPrice = displayPrice * 1.35;

          return (
            <div
              key={item.id}
              onClick={() => onSelectProduct(item.id)}
              className="bg-white rounded-2xl border border-[#E5E7EB] hover:border-[#1B1F3B]/30 hover:shadow-xs transition-all duration-200 p-2.5 flex flex-col justify-between cursor-pointer group relative overflow-hidden"
            >
              {/* Image Box */}
              <div className="aspect-[1.12/1] rounded-xl overflow-hidden bg-[#F0F2F5] relative mb-2 flex items-center justify-center p-2">
                <img
                  src={item.images?.[0] || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400'}
                  alt={item.title}
                  className="w-full h-full object-contain group-hover:scale-104 transition-transform duration-200"
                  loading="lazy"
                />

                <span className="absolute top-1.5 left-1.5 bg-[#1B1F3B] text-white text-[8.5px] font-bold px-2 py-0.5 rounded shadow-2xs z-10">
                  Global Direct
                </span>

                <span className="absolute bottom-1.5 left-1.5 bg-[#1B1F3B] text-white text-[8.5px] font-bold px-2 py-0.5 rounded shadow-2xs z-10">
                  Verified Stock
                </span>
              </div>

              {/* Title & Info */}
              <div>
                <span className="text-[10px] text-[#E11D48] font-bold block mb-0.5 truncate">
                  {item.categoryName || 'Global Collection'}
                </span>

                <h3 className="text-xs font-bold text-[#1B1F3B] line-clamp-1 leading-tight group-hover:text-[#E11D48] transition">
                  {item.title}
                </h3>

                <div className="mt-2">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-sm font-black text-[#1B1F3B]">
                      {formatPrice(displayPrice)}
                    </span>
                    <span className="text-[10px] text-slate-400 line-through">
                      {formatPrice(originalPrice)}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium block truncate">
                    Direct Import • Fast Delivery Nepal
                  </span>
                </div>
              </div>

              {/* Footer Badge */}
              <div className="mt-2.5 pt-2 border-t border-[#F1F3F5] flex items-center justify-between text-[10px] text-slate-500">
                <span className="flex items-center gap-1 text-emerald-700 font-semibold truncate">
                  <ShieldCheck className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                  <span className="truncate">✓ Verified Seller</span>
                </span>
                <span className="font-bold text-slate-700">★ {item.rating || 4.9}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Centered Minimal Load More Button (Matching PDF) */}
      {visibleCount < sortedAlibabaProducts.length && (
        <div className="pb-3 pt-1 flex justify-center items-center">
          <button
            type="button"
            onClick={() => setVisibleCount(prev => Math.min(prev + 5, sortedAlibabaProducts.length))}
            className="bg-white hover:bg-slate-50 text-[#1B1F3B] border border-[#E5E7EB] hover:border-slate-300 font-extrabold text-xs px-6 py-1.5 rounded-full shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
          >
            <span>Load More</span>
            <ChevronDown className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      )}

    </section>
  );
};
