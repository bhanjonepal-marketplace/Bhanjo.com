import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight, ShieldCheck } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

// Clean curated products matching reference photo
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
      className="my-4 sm:my-5 rounded-2xl border border-[#E5E7EB] bg-white p-4 sm:p-5 shadow-xs transition-all duration-200"
    >
      {/* Header Row matching reference image */}
      <div>
        {/* Top Row: Badges and Subtitle */}
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className="bg-[#1B1F3B] text-white text-[11px] font-bold px-3 py-1 rounded-md uppercase tracking-wider shadow-2xs">
            OVERSEAS PAVILION
          </span>
          <span className="text-xs font-bold text-[#5B6070] tracking-wider uppercase truncate">
            GLOBAL DIRECT SOURCING • VERIFIED FACTORY PRICING
          </span>
        </div>

        {/* Second Row: Main Title on Left, Sort & View All on Right */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-1.5">
          <h2 className="text-xl sm:text-2xl font-black text-[#1B1F3B] tracking-tight">
            International Trending Collection
          </h2>

          <div className="flex items-center gap-2.5 flex-shrink-0">
            {/* Sort Dropdown */}
            <div className="bg-white border border-[#E5E7EB] hover:border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-700 flex items-center shadow-2xs">
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
              className="bg-[#E11D48] hover:bg-[#BE123C] text-white font-bold text-xs px-4 py-2 rounded-lg shadow-xs transition-all flex items-center gap-1 cursor-pointer active:scale-95"
              title="View all Global Direct products"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>

      {/* 5-Column Products Grid (Matching reference image) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 mt-4">
        {sortedAlibabaProducts.slice(0, visibleCount).map((item) => {
          const displayPrice = item.displayPrice ?? (item.priceTiers?.[item.priceTiers.length - 1]?.price || item.samplePrice || 25);
          const originalPrice = item.originalPrice ?? Math.round(displayPrice * 1.35);

          return (
            <div
              key={item.id}
              onClick={() => onSelectProduct(item.id)}
              className="bg-white rounded-2xl border border-[#E5E7EB] hover:border-slate-300 hover:shadow-xs transition-all duration-200 p-3 flex flex-col justify-between cursor-pointer group relative overflow-hidden"
            >
              {/* Image Box */}
              <div className="aspect-[1.14/1] rounded-xl overflow-hidden bg-[#F0F2F5] relative mb-2.5 flex items-center justify-center p-2">
                <img
                  src={item.image || item.images?.[0] || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400'}
                  alt={item.title}
                  className="w-full h-full object-contain group-hover:scale-103 transition-transform duration-200"
                  loading="lazy"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />

                <span className="absolute top-2 left-2 bg-[#1B1F3B] text-white text-[9.5px] font-bold px-2 py-0.5 rounded shadow-2xs z-10 pointer-events-none">
                  Global Direct
                </span>

                <span className="absolute bottom-2 left-2 bg-[#1B1F3B] text-white text-[9.5px] font-bold px-2 py-0.5 rounded shadow-2xs z-10 pointer-events-none">
                  Verified Stock
                </span>
              </div>

              {/* Title & Info */}
              <div className="flex-1 flex flex-col">
                <span className="text-[11px] text-[#E11D48] font-bold block mb-1 truncate">
                  {item.categoryName || 'Global Collection'}
                </span>

                <h3 className="text-xs sm:text-[13px] font-bold text-[#1B1F3B] line-clamp-2 leading-snug min-h-[2.4rem] group-hover:text-[#E11D48] transition">
                  {item.title}
                </h3>

                <div className="mt-2.5">
                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    <span className="text-sm sm:text-base font-black text-[#1B1F3B]">
                      {formatPrice(displayPrice)}
                    </span>
                    {originalPrice > displayPrice && (
                      <span className="text-[10px] sm:text-[11px] text-slate-400 line-through">
                        {formatPrice(originalPrice)}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium block truncate mt-1">
                    Direct Import • Fast Delivery Nepal
                  </span>
                </div>
              </div>

              {/* Footer Badge */}
              <div className="mt-3 pt-2.5 border-t border-[#F1F3F5] flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1 text-emerald-700 font-semibold truncate">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span className="truncate">✓ Verified Seller</span>
                </span>
                <span className="font-bold text-slate-800 text-[11px] flex-shrink-0">
                  ★ {item.rating || 4.9}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Centered Minimal Load More Button (Matching Reference Image) */}
      {visibleCount < sortedAlibabaProducts.length && (
        <div className="mt-6 mb-1 flex justify-center items-center">
          <button
            type="button"
            onClick={() => setVisibleCount(prev => Math.min(prev + 5, sortedAlibabaProducts.length))}
            className="bg-white hover:bg-slate-50 text-[#1B1F3B] border border-[#1B1F3B] font-bold text-xs px-8 py-2.5 rounded-xl shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
          >
            <span>Load More</span>
            <ChevronDown className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      )}

    </section>
  );
};
