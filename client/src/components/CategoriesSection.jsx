import React, { useState, useMemo } from 'react';
import { 
  Shirt, Tv, Trophy, Watch, Footprints, Home, Compass, Sparkles, 
  Briefcase, Printer, Baby, HeartHandshake, Activity, Gift, Dog, 
  BookOpen, Cog, Store, HardHat, Building, Armchair, Lightbulb, 
  Microwave, Car, Wrench, Hammer, Sun, Zap, ShieldAlert, 
  Forklift, Gauge, Cpu, CircuitBoard, Truck, Wheat, Layers, 
  Factory, BriefcaseBusiness, ChevronRight, Search, X, ArrowRight,
  Flame, Mountain, Sparkle, LayoutGrid, Smartphone, Laptop
} from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { useCurrency } from '../context/CurrencyContext';

const ICON_MAP = {
  Shirt, Tv, Trophy, Watch, Footprints, Home, Compass, Sparkles, 
  Briefcase, Printer, Baby, HeartHandshake, Activity, Gift, Dog, 
  BookOpen, Cog, Store, HardHat, Building, Armchair, Lightbulb, 
  Microwave, Car, Wrench, Hammer, Sun, Zap, ShieldAlert, 
  Forklift, Gauge, Cpu, CircuitBoard, Truck, Wheat, Layers, 
  Factory, BriefcaseBusiness, Smartphone, Laptop
};

// Curated color grading:
// 1: Dusty Sage (#7E907B)
// 2: Muted Terracotta (#B2533E)
// 3: Valley Moss (#709071)
// 4: Shallow Sea (#84C6CE)
// 5: Blush Petal (#F7C8D3)
// 6: Mist (#B3C9D6)
// 7: Dusty Mauve (#A37C76)
const OUTLET_PALETTES = [
  {
    name: 'Dusty Sage',
    bg: 'bg-[#7E907B]',
    border: 'border-[#6D806A]',
    shadow: 'shadow-[#7E907B]/30 hover:shadow-[#7E907B]/50',
    ring: 'ring-[#7E907B]',
    text: 'text-white',
    subText: 'text-white/85',
    badgeBg: 'bg-[#5B6D57] text-white',
    accentColor: '#7E907B'
  },
  {
    name: 'Muted Terracotta',
    bg: 'bg-[#B2533E]',
    border: 'border-[#9F4330]',
    shadow: 'shadow-[#B2533E]/30 hover:shadow-[#B2533E]/50',
    ring: 'ring-[#B2533E]',
    text: 'text-white',
    subText: 'text-white/85',
    badgeBg: 'bg-[#8F3725] text-white',
    accentColor: '#B2533E'
  },
  {
    name: 'Valley Moss',
    bg: 'bg-[#709071]',
    border: 'border-[#5C7C5D]',
    shadow: 'shadow-[#709071]/30 hover:shadow-[#709071]/50',
    ring: 'ring-[#709071]',
    text: 'text-white',
    subText: 'text-white/85',
    badgeBg: 'bg-[#4B6B4C] text-white',
    accentColor: '#709071'
  },
  {
    name: 'Shallow Sea',
    bg: 'bg-[#84C6CE]',
    border: 'border-[#6FB6BF]',
    shadow: 'shadow-[#84C6CE]/35 hover:shadow-[#84C6CE]/55',
    ring: 'ring-[#6FB6BF]',
    text: 'text-[#163B42]',
    subText: 'text-[#285760]',
    badgeBg: 'bg-[#1C4E57] text-white',
    accentColor: '#3A7C86'
  },
  {
    name: 'Blush Petal',
    bg: 'bg-[#F7C8D3]',
    border: 'border-[#E8B0BD]',
    shadow: 'shadow-[#F7C8D3]/40 hover:shadow-[#F7C8D3]/60',
    ring: 'ring-[#E8B0BD]',
    text: 'text-[#481A23]',
    subText: 'text-[#6B313D]',
    badgeBg: 'bg-[#782838] text-white',
    accentColor: '#B5576B'
  },
  {
    name: 'Mist',
    bg: 'bg-[#B3C9D6]',
    border: 'border-[#9BB6C6]',
    shadow: 'shadow-[#B3C9D6]/35 hover:shadow-[#B3C9D6]/55',
    ring: 'ring-[#9BB6C6]',
    text: 'text-[#1C3645]',
    subText: 'text-[#2D4E62]',
    badgeBg: 'bg-[#224458] text-white',
    accentColor: '#4A7188'
  },
  {
    name: 'Dusty Mauve',
    bg: 'bg-[#A37C76]',
    border: 'border-[#8F6862]',
    shadow: 'shadow-[#A37C76]/30 hover:shadow-[#A37C76]/50',
    ring: 'ring-[#A37C76]',
    text: 'text-white',
    subText: 'text-white/85',
    badgeBg: 'bg-[#6D4943] text-white',
    accentColor: '#A37C76'
  }
];

export const CategoriesSection = ({ 
  onSelectCategory, 
  selectedCategoryId = 'all',
  onOpenMegaMenu
}) => {
  const { language } = useCurrency();
  const [searchTerm, setSearchTerm] = useState('');

  // Filter categories based on search term
  const filteredCategories = useMemo(() => {
    if (!searchTerm.trim()) {
      return CATEGORIES;
    }
    const term = searchTerm.toLowerCase().trim();
    return CATEGORIES.filter(cat => {
      const nameMatch = cat.name.toLowerCase().includes(term);
      const nepaliMatch = cat.nepaliName?.toLowerCase().includes(term);
      const descMatch = cat.description?.toLowerCase().includes(term);
      const subcatMatch = cat.subcategories?.some(s => s.toLowerCase().includes(term));
      const keywordMatch = cat.popularKeywords?.some(k => k.toLowerCase().includes(term));
      return nameMatch || nepaliMatch || descMatch || subcatMatch || keywordMatch;
    });
  }, [searchTerm]);

  return (
    <section className="mt-7 mb-12 sm:mb-16" id="categories-showcase">
      {/* Section Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs mb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-orange-100 text-[#F85606] tracking-wide uppercase">
                <Sparkle className="w-3 h-3 fill-current" />
                {language === 'ne' ? 'प्रमुख क्षेत्रहरू' : 'Official Sourcing Hubs'}
              </span>
              <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">•</span>
              <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
                {language === 'ne' ? 'कारखाना र खुद्रा प्रत्यक्ष आपूर्ति' : 'B2B Wholesale & Retail Direct'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>{language === 'ne' ? 'कोटिहरू तथा क्षेत्रहरू' : 'Categories & Sourcing Hubs'}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {language === 'ne' 
                ? 'नेपाल तथा अन्तर्राष्ट्रिय प्रमाणित कारखानाबाट सिधै सामानहरू खरिद गर्नुहोस्' 
                : 'Explore verified manufacturers, authentic artisans & top-tier commercial suppliers'}
            </p>
          </div>

          {/* Quick Search & Controls */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* Live Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={language === 'ne' ? 'कोटि खोज्नुहोस्...' : 'Filter categories or items...'}
                className="w-full text-xs pl-8 pr-7 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* View All Button */}
            <button
              onClick={() => onSelectCategory('all')}
              className={`px-3 py-2 text-xs font-bold rounded-xl transition duration-150 flex-shrink-0 cursor-pointer ${
                selectedCategoryId === 'all'
                  ? 'bg-gradient-to-r from-[#F85606] to-amber-500 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-orange-50 hover:text-[#F85606] border border-slate-200'
              }`}
            >
              {language === 'ne' ? 'सबै सामानहरू' : 'All Products'}
            </button>
          </div>
        </div>

        {/* Quick Category Quick-Select Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pt-3 scrollbar-none">
          {CATEGORIES.map((cat, index) => {
            const isSelected = selectedCategoryId === cat.id;
            const IconComp = ICON_MAP[cat.icon] || Layers;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-[#F85606] text-white shadow-xs font-bold'
                    : 'bg-slate-50 text-slate-700 hover:bg-orange-50 hover:text-[#F85606] border border-slate-200/80'
                }`}
              >
                <IconComp className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                <span>{language === 'ne' ? (cat.nepaliName || cat.name) : cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 7 Visual Category Cards Grid */}
      {filteredCategories.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-orange-100 text-[#F85606] flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">
            {language === 'ne' ? 'कुनै कोटि फेला परेन' : 'No matching categories found'}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {language === 'ne'
              ? `"${searchTerm}" को लागि कुनै कोटि मेल खाएन। अर्को खोज शब्द प्रयास गर्नुहोस्।`
              : `We couldn't find any category matching "${searchTerm}". Try resetting your filter.`}
          </p>
          <button
            onClick={() => setSearchTerm('')}
            className="mt-4 px-4 py-1.5 text-xs font-bold bg-[#F85606] text-white rounded-lg hover:bg-[#e04e05] transition"
          >
            {language === 'ne' ? 'सबै कोटिहरू देखाउनुहोस्' : 'Reset Category Search'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-7 gap-3 sm:gap-3.5">
          {filteredCategories.map((cat, index) => {
            const IconComp = ICON_MAP[cat.icon] || Layers;
            const isSelected = selectedCategoryId === cat.id;
            const displayTitle = language === 'ne' ? (cat.nepaliName || cat.name) : cat.name;
            const subTitleAlt = language === 'ne' ? cat.name : cat.nepaliName;
            const palette = OUTLET_PALETTES[index % OUTLET_PALETTES.length];

            return (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`group relative ${palette.bg} rounded-[24px] sm:rounded-[28px] p-2 sm:p-2.5 pb-2.5 sm:pb-3 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl ${palette.shadow} ${
                  isSelected ? `ring-4 ${palette.ring} ring-offset-2 scale-[1.02]` : ''
                }`}
              >
                {/* Inner White Box Window (Matching Reference Photo 2) */}
                <div className="bg-white rounded-[18px] sm:rounded-[22px] aspect-square w-full p-1.5 sm:p-2 flex items-center justify-center overflow-hidden relative shadow-inner">
                  <img
                    src={cat.banner}
                    alt={cat.name}
                    loading="lazy"
                    className="w-full h-full object-cover rounded-[14px] sm:rounded-[18px] group-hover:scale-108 transition-transform duration-500 ease-out"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=600&q=80';
                    }}
                  />

                  {/* Top-Left: Category Floating Icon Badge */}
                  <div className="absolute top-2 left-2 z-10">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center bg-white/95 text-slate-800 shadow-sm group-hover:scale-110 transition-transform">
                      <IconComp className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: palette.accentColor }} />
                    </div>
                  </div>

                  {/* Top-Right: Cute Subs count Badge */}
                  <div className="absolute top-2 right-2 z-10">
                    <span className={`${palette.badgeBg || 'bg-stone-800 text-white'} text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm tracking-tight`}>
                      {cat.subcategories?.length || 8} Subs
                    </span>
                  </div>

                  {/* Active selection ribbon */}
                  {isSelected && (
                    <div className="absolute inset-0 bg-black/25 backdrop-blur-[1px] rounded-[14px] sm:rounded-[18px] flex items-center justify-center z-20">
                      <span className="bg-white text-slate-900 text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg">
                        ✓ Active
                      </span>
                    </div>
                  )}
                </div>

                {/* Bottom Chin: Solid Color Category Title with Swatch Matching Contrast */}
                <div className="pt-2 sm:pt-2.5 px-1 text-center flex flex-col items-center justify-center">
                  <h3 className={`${palette.text || 'text-white'} font-black text-xs sm:text-[13px] tracking-tight leading-tight line-clamp-1 group-hover:scale-105 transition-transform drop-shadow-xs`}>
                    {displayTitle}
                  </h3>
                  {subTitleAlt && (
                    <p className={`${palette.subText || 'text-white/85'} text-[10px] font-semibold truncate max-w-full mt-0.5`}>
                      {subTitleAlt}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
