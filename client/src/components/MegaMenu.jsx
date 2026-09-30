import React, { useState, useMemo, useRef, useEffect } from 'react';
import { getFullCategoryTree } from '../data/alibabaCategoryTree';
import { useCurrency } from '../context/CurrencyContext';
import { 
  Shirt, Tv, Trophy, Watch, Footprints, Home, Compass, Sparkles, 
  Briefcase, Printer, Baby, HeartHandshake, Activity, Gift, Dog, 
  BookOpen, Cog, Store, HardHat, Building, Armchair, Lightbulb, 
  Microwave, Car, Wrench, Hammer, Sun, Zap, ShieldAlert, 
  Forklift, Gauge, Cpu, CircuitBoard, Truck, Wheat, Layers, 
  Factory, BriefcaseBusiness, ChevronRight, ChevronLeft, LayoutGrid, 
  Camera, X, ArrowUpRight
} from 'lucide-react';

const ICON_MAP = {
  Shirt, Tv, Trophy, Watch, Footprints, Home, Compass, Sparkles, 
  Briefcase, Printer, Baby, HeartHandshake, Activity, Gift, Dog, 
  BookOpen, Cog, Store, HardHat, Building, Armchair, Lightbulb, 
  Microwave, Car, Wrench, Hammer, Sun, Zap, ShieldAlert, 
  Forklift, Gauge, Cpu, CircuitBoard, Truck, Wheat, Layers, 
  Factory, BriefcaseBusiness
};

export const MegaMenu = ({ onSelectCategory, activeCategoryId = 'all', onClose, products = [] }) => {
  const { language } = useCurrency();
  const categoryTree = useMemo(() => getFullCategoryTree(), []);

  // Level 1 Active Category (Selected from left list)
  const [activeCategoryIdState, setActiveCategoryIdState] = useState(() => {
    if (activeCategoryId && activeCategoryId !== 'all') {
      const exists = categoryTree.find(c => c.id === activeCategoryId);
      if (exists) return exists.id;
    }
    return categoryTree[0]?.id || 'consumer-electronics';
  });

  // Level 2 Drilldown Category (null when on Level 1; set to category object when "View all" is clicked)
  const [drilldownCategory, setDrilldownCategory] = useState(null);

  // Level 2 Active Subcategory (when inside drilldown)
  const [activeSubcategoryId, setActiveSubcategoryId] = useState(null);

  const rightPanelRef = useRef(null);

  // Current active main category object
  const activeMainCat = useMemo(() => {
    return categoryTree.find(c => c.id === activeCategoryIdState) || categoryTree[0];
  }, [categoryTree, activeCategoryIdState]);

  // When drilldown changes, set active subcategory to first subcategory
  useEffect(() => {
    if (drilldownCategory && drilldownCategory.subcategories && drilldownCategory.subcategories.length > 0) {
      setActiveSubcategoryId(drilldownCategory.subcategories[0].id);
      if (rightPanelRef.current) {
        rightPanelRef.current.scrollTop = 0;
      }
    }
  }, [drilldownCategory]);

  // Active subcategory object in drilldown view
  const activeSubcatObj = useMemo(() => {
    if (!drilldownCategory || !drilldownCategory.subcategories) return null;
    return drilldownCategory.subcategories.find(s => s.id === activeSubcategoryId) || drilldownCategory.subcategories[0];
  }, [drilldownCategory, activeSubcategoryId]);

  // Find matching image from store products for a subcategory or keyword
  const findItemImage = (itemName, categoryId) => {
    if (!products || products.length === 0) return null;
    const cleanName = itemName.toLowerCase();
    
    // 1. Direct title or description match in current category
    const exactMatch = products.find(p => {
      const matchCat = !categoryId || p.categoryId === categoryId;
      const matchTitle = p.title?.toLowerCase().includes(cleanName) || p.nepaliTitle?.toLowerCase().includes(cleanName);
      return matchCat && matchTitle && p.images?.[0];
    });
    if (exactMatch?.images?.[0]) return exactMatch.images[0];

    // 2. Any product in this category
    if (categoryId) {
      const catMatch = products.find(p => p.categoryId === categoryId && p.images?.[0]);
      if (catMatch?.images?.[0]) return catMatch.images[0];
    }

    return null;
  };

  const handleDrilldownClick = (category) => {
    setDrilldownCategory(category);
    if (category.subcategories && category.subcategories.length > 0) {
      setActiveSubcategoryId(category.subcategories[0].id);
    }
  };

  const handleBackToMain = () => {
    setDrilldownCategory(null);
    setActiveSubcategoryId(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[580px] w-full max-w-6xl mx-auto animate-in fade-in zoom-in-95 duration-150 select-none">
      
      {/* ============================================================ */}
      {/* VIEW STATE 2: LEVEL 2 & 3 DRILLDOWN VIEW (Screenshot 2)       */}
      {/* ============================================================ */}
      {drilldownCategory ? (
        <div className="flex flex-col h-full">
          {/* Header Bar: "< Category Name" */}
          <div className="h-13 px-6 border-b border-slate-200/90 flex items-center justify-between bg-white flex-shrink-0">
            <button
              onClick={handleBackToMain}
              className="flex items-center gap-2 text-sm md:text-base font-bold text-slate-900 hover:text-[#ff6600] transition group cursor-pointer"
              title="Back to all categories"
            >
              <ChevronLeft className="w-5 h-5 text-slate-700 group-hover:text-[#ff6600] group-hover:-translate-x-0.5 transition-transform" />
              <span>{language === 'ne' ? (drilldownCategory.nepaliName || drilldownCategory.name) : drilldownCategory.name}</span>
            </button>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition"
              title="Close menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Left Sidebar: Level 2 Subcategories List */}
            <div className="w-64 md:w-72 border-r border-slate-200/80 overflow-y-auto bg-white py-2 divide-y divide-slate-100/50 flex-shrink-0">
              {drilldownCategory.subcategories?.map(sub => {
                const isActive = activeSubcategoryId === sub.id;
                return (
                  <button
                    key={sub.id}
                    onMouseEnter={() => setActiveSubcategoryId(sub.id)}
                    onClick={() => setActiveSubcategoryId(sub.id)}
                    className={`w-full flex items-center justify-between px-5 py-3.5 text-left text-xs md:text-[13px] transition-colors relative cursor-pointer ${
                      isActive
                        ? 'border-l-[4px] border-slate-900 font-bold text-slate-900 bg-slate-50/70'
                        : 'border-l-[4px] border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50/50 font-normal'
                    }`}
                  >
                    <span className="truncate pr-2">{sub.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Right Main Panel: Level 3 Micro-categories Circular Grid (7 Columns) */}
            <div ref={rightPanelRef} className="flex-1 overflow-y-auto p-6 md:p-8 bg-white">
              {activeSubcatObj && (
                <div>
                  <div className="flex items-center justify-between pb-5 border-b border-slate-100">
                    <h3 className="text-base md:text-lg font-bold text-slate-900">
                      {activeSubcatObj.name}
                    </h3>
                    <button
                      onClick={() => {
                        onSelectCategory(drilldownCategory.id, activeSubcatObj.name);
                        if (onClose) onClose();
                      }}
                      className="text-xs font-semibold text-slate-500 hover:text-[#ff6600] flex items-center gap-1 transition"
                    >
                      <span>{language === 'ne' ? 'सबै वस्तुहरू हेर्नुहोस्' : 'Browse featured selections'}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* 7-column Circular Grid */}
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 gap-y-7 gap-x-2 sm:gap-x-3 pt-6">
                    {activeSubcatObj.items?.map((item, idx) => {
                      const img = item.image || findItemImage(item.name, drilldownCategory.id);

                      return (
                        <div
                          key={idx}
                          onClick={() => {
                            onSelectCategory(drilldownCategory.id, item.name);
                            if (onClose) onClose();
                          }}
                          className="flex flex-col items-center group cursor-pointer"
                        >
                          {/* Photo Space Circle */}
                          <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full bg-[#f4f4f4] border border-slate-200/90 flex items-center justify-center overflow-hidden transition-all duration-200 group-hover:scale-105 group-hover:border-[#ff6600] group-hover:shadow-md relative">
                            {img ? (
                              <img
                                src={img}
                                alt={item.name}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                loading="lazy"
                              />
                            ) : (
                              /* Clean circular photo space ready for imported products */
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-slate-100 to-slate-200/60">
                                <Camera className="w-5 h-5 text-slate-300 group-hover:text-[#ff6600]/60 transition-colors" />
                              </div>
                            )}
                          </div>

                          {/* Item Name Label */}
                          <span className="text-[11px] sm:text-xs font-normal text-slate-700 text-center leading-tight line-clamp-2 max-w-[84px] mt-2 group-hover:text-[#ff6600] transition-colors">
                            {item.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* ============================================================ */
        /* VIEW STATE 1: LEVEL 1 MAIN CATEGORIES VIEW (Screenshots 1 & 3) */
        /* ============================================================ */
        <div className="flex h-full">
          {/* Left Sidebar: All 38 Main Categories */}
          <div className="w-64 md:w-72 border-r border-slate-200/80 overflow-y-auto bg-slate-50/50 py-2 flex-shrink-0">
            <div className="px-5 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>{language === 'ne' ? 'सबै उद्योग श्रेणीहरू' : 'All Categories'}</span>
            </div>

            <div className="space-y-0.5 pt-1">
              {categoryTree.map(cat => {
                const IconComponent = ICON_MAP[cat.icon] || Layers;
                const isActive = activeCategoryIdState === cat.id;

                return (
                  <button
                    key={cat.id}
                    onMouseEnter={() => setActiveCategoryIdState(cat.id)}
                    onClick={() => setActiveCategoryIdState(cat.id)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-left text-xs md:text-[13px] transition-all relative cursor-pointer ${
                      isActive
                        ? 'border-l-[4px] border-slate-900 bg-white font-bold text-slate-900 shadow-xs'
                        : 'border-l-[4px] border-transparent text-slate-700 hover:bg-slate-100/70 hover:text-slate-900 font-normal'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <IconComponent className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-slate-900' : 'text-slate-500'}`} />
                      <span className="truncate">{language === 'ne' ? (cat.nepaliName || cat.name) : cat.name}</span>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 flex-shrink-0 transition-opacity ${isActive ? 'text-slate-900 opacity-100' : 'text-slate-300 opacity-0 group-hover:opacity-100'}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Main Panel: 7-Column Circular Grid with "View all" 14th card */}
          <div ref={rightPanelRef} className="flex-1 overflow-y-auto p-6 md:p-8 bg-white">
            {activeMainCat && (
              <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <h3 className="text-base md:text-xl font-bold text-slate-900">
                    {language === 'ne' ? (activeMainCat.nepaliName || activeMainCat.name) : activeMainCat.name}
                  </h3>
                  <button
                    onClick={() => {
                      onSelectCategory(activeMainCat.id);
                      if (onClose) onClose();
                    }}
                    className="text-xs font-semibold text-slate-500 hover:text-[#ff6600] flex items-center gap-1 transition"
                  >
                    <span>{language === 'ne' ? 'सबै उत्पादनहरू हेर्नुहोस्' : 'Browse featured selections'}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 7-Column Circular Grid (13 Featured + 1 "View all" Card) */}
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 gap-y-7 gap-x-2 sm:gap-x-3 pt-6 pb-6">
                  {/* First 13 Circular Items */}
                  {activeMainCat.featured?.slice(0, 13).map((item, idx) => {
                    const img = item.image || findItemImage(item.name, activeMainCat.id);

                    return (
                      <div
                        key={idx}
                        onClick={() => {
                          onSelectCategory(activeMainCat.id, item.name);
                          if (onClose) onClose();
                        }}
                        className="flex flex-col items-center group cursor-pointer"
                      >
                        {/* Circular Photo Space */}
                        <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full bg-[#f4f4f4] border border-slate-200/90 flex items-center justify-center overflow-hidden transition-all duration-200 group-hover:scale-105 group-hover:border-[#ff6600] group-hover:shadow-md relative">
                          {img ? (
                            <img
                              src={img}
                              alt={item.name}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                              loading="lazy"
                            />
                          ) : (
                            /* Clean circular photo space ready for photos */
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-slate-100 to-slate-200/60">
                              <Camera className="w-5 h-5 text-slate-300 group-hover:text-[#ff6600]/60 transition-colors" />
                            </div>
                          )}
                        </div>

                        {/* Text underneath */}
                        <span className="text-[11px] sm:text-xs font-normal text-slate-700 text-center leading-tight line-clamp-2 max-w-[84px] mt-2 group-hover:text-[#ff6600] transition-colors">
                          {item.name}
                        </span>
                      </div>
                    );
                  })}

                  {/* 14th Item: "View all" Card with 4-square LayoutGrid icon (Screenshot 1 & 3) */}
                  <div
                    onClick={() => handleDrilldownClick(activeMainCat)}
                    className="flex flex-col items-center group cursor-pointer"
                  >
                    <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full bg-[#f4f4f4] border border-slate-200/90 flex items-center justify-center transition-all duration-200 group-hover:scale-105 group-hover:bg-orange-50 group-hover:border-[#ff6600] group-hover:shadow-md">
                      <LayoutGrid className="w-6 h-6 text-slate-500 group-hover:text-[#ff6600] transition-colors" />
                    </div>
                    <span className="text-[11px] sm:text-xs font-normal text-slate-700 text-center leading-tight line-clamp-2 max-w-[84px] mt-2 group-hover:text-[#ff6600] transition-colors">
                      {language === 'ne' ? 'सबै हेर्नुहोस्' : 'View all'}
                    </span>
                  </div>
                </div>

                {/* Next Category preview below (matching Alibaba continuous scroll experience) */}
                {(() => {
                  const nextIndex = (categoryTree.findIndex(c => c.id === activeMainCat.id) + 1) % categoryTree.length;
                  const nextCat = categoryTree[nextIndex];
                  if (!nextCat) return null;

                  return (
                    <div className="mt-8 pt-8 border-t border-slate-200/80">
                      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                        <h3 className="text-base md:text-xl font-bold text-slate-900">
                          {language === 'ne' ? (nextCat.nepaliName || nextCat.name) : nextCat.name}
                        </h3>
                        <button
                          onClick={() => {
                            onSelectCategory(nextCat.id);
                            if (onClose) onClose();
                          }}
                          className="text-xs font-semibold text-slate-500 hover:text-[#ff6600] flex items-center gap-1 transition"
                        >
                          <span>{language === 'ne' ? 'सबै उत्पादनहरू हेर्नुहोस्' : 'Browse featured selections'}</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 gap-y-7 gap-x-2 sm:gap-x-3 pt-6 pb-4">
                        {nextCat.featured?.slice(0, 13).map((item, idx) => {
                          const img = item.image || findItemImage(item.name, nextCat.id);
                          return (
                            <div
                              key={idx}
                              onClick={() => {
                                onSelectCategory(nextCat.id, item.name);
                                if (onClose) onClose();
                              }}
                              className="flex flex-col items-center group cursor-pointer"
                            >
                              <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full bg-[#f4f4f4] border border-slate-200/90 flex items-center justify-center overflow-hidden transition-all duration-200 group-hover:scale-105 group-hover:border-[#ff6600] group-hover:shadow-md relative">
                                {img ? (
                                  <img
                                    src={img}
                                    alt={item.name}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                    loading="lazy"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-slate-100 to-slate-200/60">
                                    <Camera className="w-5 h-5 text-slate-300 group-hover:text-[#ff6600]/60 transition-colors" />
                                  </div>
                                )}
                              </div>
                              <span className="text-[11px] sm:text-xs font-normal text-slate-700 text-center leading-tight line-clamp-2 max-w-[84px] mt-2 group-hover:text-[#ff6600] transition-colors">
                                {item.name}
                              </span>
                            </div>
                          );
                        })}

                        <div
                          onClick={() => handleDrilldownClick(nextCat)}
                          className="flex flex-col items-center group cursor-pointer"
                        >
                          <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full bg-[#f4f4f4] border border-slate-200/90 flex items-center justify-center transition-all duration-200 group-hover:scale-105 group-hover:bg-orange-50 group-hover:border-[#ff6600] group-hover:shadow-md">
                            <LayoutGrid className="w-6 h-6 text-slate-500 group-hover:text-[#ff6600] transition-colors" />
                          </div>
                          <span className="text-[11px] sm:text-xs font-normal text-slate-700 text-center leading-tight line-clamp-2 max-w-[84px] mt-2 group-hover:text-[#ff6600] transition-colors">
                            {language === 'ne' ? 'सबै हेर्नुहोस्' : 'View all'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
