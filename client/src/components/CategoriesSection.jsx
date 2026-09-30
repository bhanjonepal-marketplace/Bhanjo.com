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
    <section className="my-7" id="categories-showcase">
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
            const subcatChips = cat.popularKeywords?.slice(0, 2) || cat.subcategories?.slice(0, 2) || [];

            return (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`group relative bg-white rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-lg ${
                  isSelected
                    ? 'border-[#F85606] ring-2 ring-[#F85606]/30 shadow-md'
                    : 'border-slate-200/90 hover:border-[#F85606]/60'
                }`}
              >
                {/* Top Image Showcase */}
                <div className="relative h-28 sm:h-32 w-full overflow-hidden bg-slate-100">
                  <img
                    src={cat.banner}
                    alt={cat.name}
                    loading="lazy"
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500 ease-out"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  {/* Bottom Vignette Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent" />

                  {/* Top-Left: Category Icon Badge */}
                  <div className="absolute top-2 left-2 z-10">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-white/95 backdrop-blur-md shadow-xs text-[#F85606] group-hover:bg-[#F85606] group-hover:text-white transition-colors duration-200">
                      <IconComp className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Subcategory Count Tag */}
                  <div className="absolute top-2 right-2 z-10">
                    <span className="bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md tracking-tight">
                      {cat.subcategories?.length || 8} {language === 'ne' ? 'उप-कोटि' : 'subs'}
                    </span>
                  </div>

                  {/* Active selection ribbon */}
                  {isSelected && (
                    <div className="absolute bottom-2 left-2 z-10">
                      <span className="bg-[#F85606] text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full shadow-xs uppercase tracking-wider">
                        {language === 'ne' ? 'सक्रिय' : 'Active'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-2.5 sm:p-3 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Primary Title */}
                    <h3 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-[#F85606] transition-colors line-clamp-1">
                      {displayTitle}
                    </h3>

                    {/* Secondary Dual Language Label */}
                    {subTitleAlt && (
                      <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                        {subTitleAlt}
                      </p>
                    )}

                    {/* Quick Keyword Pill Tags */}
                    {subcatChips.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {subcatChips.map((chip, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectCategory(cat.id, chip);
                            }}
                            className="text-[9px] font-medium px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 hover:bg-orange-100 hover:text-[#F85606] transition-colors truncate max-w-full"
                            title={`Search ${chip}`}
                          >
                            #{chip}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-500 group-hover:text-[#F85606] transition-colors">
                    <span>{language === 'ne' ? 'अन्वेषण' : 'Explore'}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
