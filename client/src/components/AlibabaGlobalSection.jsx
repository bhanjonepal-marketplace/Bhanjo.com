import React, { useState, useMemo } from 'react';
import { ChevronRight } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

// Clean curated products matching reference photo exactly
const CURATED_FEATURED = [
  {
    id: '1688-788615188525',
    title: 'Factory Direct Sourcing Product',
    categoryName: 'Global Collection',
    displayPrice: 2500,
    originalPrice: 3375,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: '1688-920212973096',
    title: 'GT4 Pro Smart Watch (2026)',
    categoryName: 'Global Collection',
    displayPrice: 6485,
    originalPrice: 8755,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'live-1688-643709487744',
    title: 'Crystal Transparent Shampoo Brush Silicone Head Massager',
    categoryName: 'Luggage and Bag',
    displayPrice: 4,
    originalPrice: 5,
    rating: 4.9,
    image: 'https://cbu01.alicdn.com/img/ibank/O1CN01LuVL9k1Qd8KK4Gyuc_!!3926581998-0-cib.jpg'
  },
  {
    id: 'ali-1601942989211',
    title: 'Ghost Face Warrior Controller Bracket PS5 Console',
    categoryName: 'Gifts & Crafts',
    displayPrice: 12,
    originalPrice: 16,
    rating: 4.9,
    image: 'https://sc04.alicdn.com/kf/H73aeb3f0f9bf489ba540ba6be48f25a0v.jpg'
  },
  {
    id: 'ali-1601776667509',
    title: "OEM Men's Boxy 425 Gsm Oversized Hoodie",
    categoryName: 'Apparel & Accessories',
    displayPrice: 50,
    originalPrice: 68,
    rating: 4.9,
    image: 'https://sc04.alicdn.com/kf/H0a882f91c1ac4291867422603749f184s.jpg'
  }
];

export const AlibabaGlobalSection = ({ products = [], onSelectProduct, onViewAll }) => {
  const { formatPrice, t, language } = useCurrency();
  const [globalSortBy, setGlobalSortBy] = useState('popular');
  const [visibleCount, setVisibleCount] = useState(5);

  // Filter imported global products
  const alibabaProducts = useMemo(() => {
    return products.filter(p => p.isAlibabaImport || p.is1688Import || p.id?.startsWith('ali-') || p.id?.startsWith('1688-') || p.id?.startsWith('live-1688-'));
  }, [products]);

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

    // Default 'popular': Lead with the 5 curated reference products, followed by the rest
    const curatedIds = new Set(CURATED_FEATURED.map(c => c.id));
    const leadingItems = CURATED_FEATURED.map(curated => {
      const real = list.find(p => p.id === curated.id);
      return real ? { ...real, ...curated } : curated;
    });

    const remaining = list.filter(p => !curatedIds.has(p.id));

    // Balanced categories for remaining items
    const byCategory = {};
    for (const p of remaining) {
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

    return [...leadingItems, ...(interleaved.length > 0 ? interleaved : remaining)];
  }, [alibabaProducts, globalSortBy]);

  if (sortedAlibabaProducts.length === 0) return null;

  return (
    <section 
      id="global-catalog-section"
      className="my-3 sm:my-4 rounded-2xl border border-[#E5E7EB] bg-white p-3.5 sm:p-4 shadow-xs transition-all duration-200"
    >
      {/* Header Row matching reference image */}
      <div>
        {/* Top Row: Badges and Subtitle */}
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className="bg-[#1B1F3B] text-white text-[11px] sm:text-xs font-black px-3 py-1 rounded-md uppercase tracking-wider shadow-2xs">
            OVERSEAS PAVILION
          </span>
          <span className="text-xs sm:text-[12.5px] font-bold text-[#475569] tracking-wider uppercase truncate">
            GLOBAL DIRECT SOURCING • VERIFIED FACTORY PRICING
          </span>
        </div>

        {/* Second Row: Main Title on Left, Sort & View All on Right */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-1.5">
          <h2 className="text-2xl sm:text-3xl md:text-[32px] font-black text-[#1B1F3B] tracking-tight leading-tight">
            International Trending Collection
          </h2>

          <div className="flex items-center gap-2.5 flex-shrink-0">
            {/* Sort Dropdown */}
            <div className="bg-white border border-[#E5E7EB] hover:border-slate-300 rounded-xl px-3 py-1.5 text-xs sm:text-sm text-slate-700 flex items-center shadow-2xs">
              <span className="text-[#64748B] mr-1.5 font-bold text-xs sm:text-[12.5px]">Sort:</span>
              <select
                value={globalSortBy}
                onChange={(e) => setGlobalSortBy(e.target.value)}
                className="bg-transparent text-[#1B1F3B] font-bold text-xs sm:text-sm focus:outline-none cursor-pointer"
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
              className="bg-[#E11D48] hover:bg-[#BE123C] text-white font-extrabold text-xs sm:text-sm px-4 py-2 rounded-xl shadow-xs transition-all flex items-center gap-1 cursor-pointer active:scale-95"
              title="View all Global Direct products"
            >
              <span>View All</span>
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>

      {/* 5-Column Products Grid - Compact and fitly adjusted matching Image 2 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3 mt-3.5">
        {sortedAlibabaProducts.slice(0, visibleCount).map((item) => {
          const displayPrice = item.displayPrice ?? (item.priceTiers?.[item.priceTiers.length - 1]?.price || item.samplePrice || 25);
          const originalPrice = item.originalPrice ?? Math.round(displayPrice * 1.35);

          return (
            <div
              key={item.id}
              onClick={() => onSelectProduct(item.id)}
              className="bg-white rounded-2xl border border-[#E5E7EB] hover:border-slate-300 hover:shadow-xs transition-all duration-200 p-3 sm:p-3.5 flex flex-col justify-between cursor-pointer group relative overflow-hidden"
            >
              {/* Image Box - Compact height matching Image 2 */}
              <div className="aspect-[1.5/1] rounded-xl overflow-hidden bg-[#EEF1F4] relative mb-2 flex items-center justify-center">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-contain p-2 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    loading="lazy"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                )}

                <span className="absolute top-1.5 left-1.5 bg-[#1B1F3B] text-white text-[10px] sm:text-[10.5px] font-bold px-2 py-0.5 rounded shadow-2xs z-10 pointer-events-none">
                  Global Direct
                </span>

                <span className="absolute bottom-1.5 left-1.5 bg-[#1B1F3B] text-white text-[10px] sm:text-[10.5px] font-bold px-2 py-0.5 rounded shadow-2xs z-10 pointer-events-none">
                  Verified Stock
                </span>
              </div>

              {/* Title & Info */}
              <div className="flex-1 flex flex-col">
                <span className="text-[11.5px] sm:text-xs text-[#E11D48] font-bold block mb-1 mt-0.5 leading-none truncate">
                  {item.categoryName || 'Global Collection'}
                </span>

                <h3 className="text-[13px] sm:text-[13.5px] md:text-[14px] font-bold text-[#1B1F3B] line-clamp-2 leading-snug min-h-[34px] group-hover:text-[#E11D48] transition">
                  {item.title}
                </h3>

                <div className="mt-1.5">
                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    <span className="text-[17px] sm:text-[18px] md:text-[19px] font-black text-[#1B1F3B]">
                      {formatPrice(displayPrice)}
                    </span>
                    {originalPrice > displayPrice && (
                      <span className="text-[11px] sm:text-xs text-[#94A3B8] font-normal line-through ml-1">
                        {formatPrice(originalPrice)}
                      </span>
                    )}
                  </div>
                  <span className="text-[10.5px] sm:text-[11px] text-[#64748B] font-medium block truncate mt-0.5 mb-2">
                    Direct Import • Fast Delivery Nepal
                  </span>
                </div>
              </div>

              {/* Footer: Verified Seller and Rating */}
              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100/80">
                <span className="text-[#0D9488] font-bold text-[11px] sm:text-xs flex items-center gap-1 truncate">
                  <span className="truncate">✓ Verified Seller</span>
                </span>
                <span className="font-black text-[#1B1F3B] text-xs sm:text-[12.5px] flex-shrink-0">
                  ★ {item.rating || 4.9}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Centered Minimal Load More Button (Matching Image 2) */}
      {visibleCount < sortedAlibabaProducts.length && (
        <div className="mt-5 mb-1 flex justify-center items-center">
          <button
            type="button"
            onClick={() => setVisibleCount(prev => Math.min(prev + 5, sortedAlibabaProducts.length))}
            className="bg-white hover:bg-slate-50 text-[#1B1F3B] border border-[#1B1F3B] font-extrabold text-xs sm:text-sm px-8 py-2 rounded-xl shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
          >
            <span>Load More</span>
            <span className="text-xs font-black">⌄</span>
          </button>
        </div>
      )}

    </section>
  );
};
