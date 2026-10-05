import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, ShieldCheck, Truck, Check, 
  Briefcase, Shirt, Footprints, Watch, Gift, Car, Smartphone, Layers 
} from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { useCurrency } from '../context/CurrencyContext';

const HERO_ICON_MAP = {
  Briefcase, Shirt, Footprints, Watch, Gift, Car, Smartphone, Layers
};

export const HeroSection = ({ onSelectCategory }) => {
  const { language } = useCurrency();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slides = [
    {
      id: 1,
      brandDayLabel: "BRAND DAY",
      brandName: "VEDANTA HERBALS",
      headline: language === 'ne' ? "प्राकृतिक जडीबुटी सौन्दर्य" : "Ingredient-First Beauty",
      subtitle: language === 'ne' ? "१००% शुद्ध बदामको तेल, खुर्पानीको तेल र आयुर्वेदिक सिरम" : "Cold-Pressed Sweet Almond, Apricot Oil & Shilajit Scalp Serums",
      discountPrefix: "FLAT",
      discountAmount: "50%",
      discountSuffix: "OFF",
      freeDeliveryText: "Free Delivery*",
      authenticText: "100% Authentic*",
      ctaText: language === 'ne' ? "अहिले किन्नुहोस्" : "Shop Now",
      ctaCategory: "beauty-health-personal-care",
      bgImage: "/banners/herbals_brand_banner.jpg",
      textMode: "dark", // dark text on bright botanical background
      overlayGradient: "from-white via-white via-45% to-transparent",
      badgeColor: "bg-[#FF4D00]",
    },
    {
      id: 2,
      brandDayLabel: "SUPER BRAND DAY",
      brandName: "AETHER AUDIO TECH",
      headline: language === 'ne' ? "आधुनिक गेमिङ तथा अडियो" : "Next-Gen Gaming Sound",
      subtitle: language === 'ne' ? "४५dB एएनसी वायरलेस एयरबड्स, स्टुडियो हेडसेट र फास्ट चार्जर" : "Hybrid ANC 45dB Spatial Audio Earbuds & Hi-Res Studio Headsets",
      discountPrefix: "UP TO",
      discountAmount: "40%",
      discountSuffix: "OFF",
      freeDeliveryText: "Free Delivery*",
      authenticText: "100% Authentic*",
      ctaText: language === 'ne' ? "अफर हेर्नुहोस्" : "Shop Now",
      ctaCategory: "consumer-electronics",
      bgImage: "/banners/tech_brand_banner.jpg",
      textMode: "light", // light text on dark studio background
      overlayGradient: "from-[#04070b] via-[#04070b] via-48% to-transparent",
      badgeColor: "bg-[#FF5500]",
    },
    {
      id: 3,
      brandDayLabel: "HERITAGE DAY",
      brandName: "HIMALAYAN CASHMERE",
      headline: language === 'ne' ? "हिमालयन च्याङ्ग्रा पश्मिना" : "Authentic Luxury Warmth",
      subtitle: language === 'ne' ? "१००% शुद्ध च्याङ्ग्रा पश्मिना, कम्बल र जाडोका कपडाहरू" : "100% Pure Grade-A Chyangra Pashmina Blankets, Shawls & Scarves",
      discountPrefix: "FLAT",
      discountAmount: "40%",
      discountSuffix: "OFF",
      freeDeliveryText: "Free Delivery*",
      authenticText: "100% Authentic*",
      ctaText: language === 'ne' ? "अहिले हेर्नुहोस्" : "Shop Now",
      ctaCategory: "apparel-accessories",
      bgImage: "/banners/fashion_brand_banner.jpg",
      textMode: "light", // warm dark studio with illuminated cashmere
      overlayGradient: "from-[#1b120c] via-[#1b120c] via-48% to-transparent",
      badgeColor: "bg-[#D94E1F]",
    }
  ];

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [slides.length, isPaused]);

  const slide = slides[currentSlide];

  const handleNext = () => {
    setCurrentSlide(prev => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="my-3">
      {/* 2-Column Daraz Hero: Category Sidebar + Brand Day Carousel (Comfortable sidebar, compact ad) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 h-[320px] sm:h-[350px]">
        
        {/* Left Category List (7 Core Sourcing Sectors - Exact original comfortable size) */}
        <div className="hidden lg:flex flex-col lg:col-span-3 bg-white rounded-xl border border-slate-200 h-full overflow-hidden shadow-xs">
          {/* Categories List */}
          <div className="flex-1 p-2.5 space-y-1 overflow-y-auto">
            {CATEGORIES.map((cat, idx) => {
              const IconComp = HERO_ICON_MAP[cat.icon] || Layers;
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className="w-full text-left text-xs font-semibold text-slate-700 hover:text-[#F85606] hover:bg-orange-50/80 px-2.5 py-2 rounded-xl transition flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <IconComp className="w-4 h-4 text-slate-400 group-hover:text-[#F85606] flex-shrink-0 transition-colors" />
                    <span className="truncate pr-1">{language === 'ne' ? (cat.nepaliName || cat.name) : cat.name}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#F85606] group-hover:translate-x-0.5 transition flex-shrink-0" />
                </button>
              );
            })}
          </div>

          {/* Bottom Sticky Link */}
          <div className="p-2.5 border-t border-slate-100 bg-slate-50/80">
            <button
              onClick={() => onSelectCategory('all')}
              className="w-full text-center text-xs font-bold text-[#F85606] hover:text-[#e04e05] py-1 transition block cursor-pointer"
            >
              {language === 'ne' ? 'सबै सामानहरू हेर्नुहोस् →' : 'View All Products →'}
            </button>
          </div>
        </div>

        {/* Center/Right DarazMall Brand Day Wide Hero Banner */}
        <div 
          className="lg:col-span-9 relative rounded-xl overflow-hidden bg-slate-900 h-full flex flex-col justify-between select-none shadow-xs group"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Background Image of the Slide */}
          <img
            key={slide.bgImage}
            src={slide.bgImage}
            alt={slide.headline}
            className="absolute inset-0 w-full h-full object-cover object-right sm:object-center transition-all duration-700 ease-out animate-in fade-in"
          />

          {/* Left Semi-Transparent Content Gradient Overlay for Maximum Readability */}
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.overlayGradient} w-full sm:w-[60%] pointer-events-none transition-all duration-500`} />

          {/* Small Top Right "Ad" Indicator as seen on Daraz */}
          <div className="absolute top-2 right-2.5 z-20">
            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded border border-black/20 bg-white/70 backdrop-blur-xs text-slate-700">
              Ad
            </span>
          </div>

          {/* Top Brand Header Strip (e.g. dm DarazMall BRAND DAY | VEDANTA HERBALS) */}
          <div className="relative z-10 pt-3 sm:pt-4 px-5 sm:px-8">
            <div className="inline-flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="bg-[#592E83] text-white text-[10px] font-black px-1.5 py-0.2 rounded font-mono">
                  bm
                </span>
                <span className={`font-extrabold text-xs sm:text-sm tracking-tight ${
                  slide.textMode === 'light' ? 'text-amber-400' : 'text-[#592E83]'
                }`}>
                  BhanjoMall
                </span>
                <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded ${
                  slide.textMode === 'light' ? 'text-amber-300 bg-amber-400/20' : 'text-[#592E83] bg-[#592E83]/10'
                }`}>
                  {slide.brandDayLabel}
                </span>
              </div>
              <span className="text-slate-400 font-light text-xs">|</span>
              <span className={`text-[11px] sm:text-xs font-serif font-black tracking-wider uppercase ${
                slide.textMode === 'light' ? 'text-white' : 'text-slate-900'
              }`}>
                {slide.brandName}
              </span>
            </div>
          </div>

          {/* Center Content: Headline, Trust Badges, Discount Badge */}
          <div className="relative z-10 px-5 sm:px-8 my-auto py-1">
            <div className="flex items-center gap-4 sm:gap-6">
              
              {/* Left Text Block */}
              <div className="max-w-md sm:max-w-lg">
                <h1 className={`text-xl sm:text-2xl md:text-3xl font-black tracking-tight leading-tight uppercase drop-shadow-xs ${
                  slide.textMode === 'light' ? 'text-white' : 'text-slate-950 font-sans'
                }`}>
                  {slide.headline}
                </h1>
                
                <p className={`text-[11px] sm:text-xs mt-1 line-clamp-1 font-medium ${
                  slide.textMode === 'light' ? 'text-slate-200' : 'text-slate-700'
                }`}>
                  {slide.subtitle}
                </p>

                {/* Trust Badges: Free Delivery & 100% Authentic */}
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <div className="inline-flex items-center gap-1 bg-[#00897B] text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-sm shadow-xs">
                    <Truck className="w-3 h-3" />
                    <span>{slide.freeDeliveryText}</span>
                  </div>

                  <div className="inline-flex items-center gap-1 bg-[#4A148C] text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-sm shadow-xs">
                    <ShieldCheck className="w-3 h-3 text-amber-300" />
                    <span>{slide.authenticText}</span>
                  </div>
                </div>

                {/* Call to Action Button: Shop Now */}
                <div className="mt-3">
                  <button
                    onClick={() => onSelectCategory(slide.ctaCategory)}
                    className="bg-[#F85606] hover:bg-[#E04E05] hover:scale-105 active:scale-95 text-white font-extrabold text-xs px-5 sm:px-6 py-1.5 sm:py-2 rounded-full shadow-md shadow-orange-500/25 transition-all duration-150 inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{slide.ctaText}</span>
                  </button>
                </div>
              </div>

              {/* Circular Discount Sticker Badge */}
              <div className="hidden sm:flex flex-col items-center justify-center flex-shrink-0 animate-in zoom-in-75 duration-300">
                <div className={`w-18 h-18 md:w-20 md:h-20 rounded-full ${slide.badgeColor} text-white shadow-xl border-2 md:border-3 border-white/90 flex flex-col items-center justify-center p-1.5 text-center transform -rotate-6 hover:rotate-0 hover:scale-105 transition-transform duration-200 cursor-default select-none`}>
                  <span className="text-[8px] md:text-[9px] font-black tracking-wider leading-none uppercase text-white/90">
                    {slide.discountPrefix}
                  </span>
                  <span className="text-base md:text-xl font-black leading-none my-0.5 drop-shadow-xs">
                    {slide.discountAmount}
                  </span>
                  <span className="text-[8px] md:text-[9px] font-black tracking-wider leading-none uppercase text-white/90">
                    {slide.discountSuffix}
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* Bottom Bar: Carousel Controls (Dots & T&C disclaimer) */}
          <div className="relative z-10 pb-2.5 px-5 sm:px-8 flex items-center justify-between">
            {/* Slider Dots */}
            <div className="flex items-center gap-1.5">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    currentSlide === idx 
                      ? 'w-5 bg-white shadow-md' 
                      : 'w-1.5 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Subtle T&Cs footnote */}
            <span className="text-[8px] text-slate-500 font-medium tracking-tight">
              *T&Cs Applicable.
            </span>
          </div>

          {/* Left Arrow Button */}
          <button
            onClick={handlePrev}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/35 hover:bg-black/70 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:scale-110 shadow-md cursor-pointer"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={handleNext}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/35 hover:bg-black/70 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:scale-110 shadow-md cursor-pointer"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

        </div>

      </div>

    </div>
  );
};
