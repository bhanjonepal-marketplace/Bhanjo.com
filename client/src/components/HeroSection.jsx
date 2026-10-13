import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronRight, ChevronLeft, Sparkles, Layers, 
  Shirt, Smartphone, Watch, Footprints, Flame, 
  Home, Gift, ShieldCheck, Tag, Zap, Radio, CheckCircle2, RotateCcw
} from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { useCurrency } from '../context/CurrencyContext';
import { VoucherSubsidiesCards } from './VoucherSubsidiesCards';

const HERO_ICON_MAP = {
  'Shirt': Shirt,
  'Smartphone': Smartphone,
  'Watch': Watch,
  'Footprints': Footprints,
  'Layers': Layers,
  'Home': Home,
  'Gift': Gift,
  'Flame': Flame
};

// Compact Promotional Banner Slides (Bhanjo Original Minimalist Campaigns)
const PROMO_SLIDES = [
  {
    id: 'promo-1',
    badge: 'BHANJO FESTIVAL',
    headline: 'Grand Festive Mega Savings',
    nepaliHeadline: 'चाडपर्व महाबचत अफर',
    subline: 'Flat Up To 70% Off + Free Delivery',
    nepaliSubline: '७०% सम्मको भारी छुट र निःशुल्क डेलिभरी',
    subtitle: 'Verified brands & instant cash vouchers',
    nepaliSubtitle: 'भरपर्दो ब्रान्डहरू र तुरुन्त क्यासब्याक भउचर',
    image: '/banners/bhanjo_festive_gift.jpg',
    bgColor: 'from-[#ff5000] via-[#ff651a] to-[#ff7d33]',
    bgGradient: 'linear-gradient(135deg, #ff5000 0%, #ff651a 50%, #ff7d33 100%)',
    linkCategory: 'home-kitchen'
  },
  {
    id: 'promo-2',
    badge: 'NORDIC LIVING',
    headline: 'Modern Home & Living Deals',
    nepaliHeadline: 'आधुनिक घर तथा बसाइ',
    subline: 'Minimalist Furniture & Ambient Lighting',
    nepaliSubline: 'आकर्षक फर्निचर र आधुनिक बत्तीहरू',
    subtitle: 'Factory-direct prices • Doorstep delivery',
    nepaliSubtitle: 'सस्तो मूल्य • घरमै सुरक्षित डेलिभरी',
    image: '/banners/taobao_promo_sofa.jpg',
    bgColor: 'from-[#0284c7] via-[#0ea5e9] to-[#38bdf8]',
    bgGradient: 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 50%, #38bdf8 100%)',
    linkCategory: 'home-kitchen'
  },
  {
    id: 'promo-3',
    badge: 'HIMALAYAN WARMTH',
    headline: 'Authentic Cashmere & Luxury Wool',
    nepaliHeadline: 'च्याङ्ग्रा पश्मिना र न्यानो कम्बल',
    subline: 'Handcrafted Heritage • Export Quality',
    nepaliSubline: '१००% शुद्ध च्याङ्ग्रा पश्मिना',
    subtitle: 'Direct from authentic Nepali artisans',
    nepaliSubtitle: 'स्थानीय उत्पादकबाट सिधै • निःशुल्क डेलिभरी',
    image: '/banners/bhanjo_cashmere_warmth.jpg',
    bgColor: 'from-[#9a3412] via-[#c2410c] to-[#ea580c]',
    bgGradient: 'linear-gradient(135deg, #9a3412 0%, #c2410c 50%, #ea580c 100%)',
    linkCategory: 'apparel-accessories'
  }
];

// Top-Right: Worth Every Rupee Big Home Deals Showcase (Taobao Style Cutouts)
const BILLION_SUBSIDY_DEALS = [
  {
    id: 'sub-fridge',
    title: 'Double-Door Smart Inverter Fridge',
    priceUSD: 1450,
    image: '/deals/double_door_fridge.jpg',
    categoryId: 'home-kitchen'
  },
  {
    id: 'sub-tv',
    title: '65" Ultra-Thin 4K OLED Smart TV',
    priceUSD: 1120,
    image: '/deals/smart_4k_tv.jpg',
    categoryId: 'consumer-electronics'
  },
  {
    id: 'sub-microwave',
    title: 'Digital Inverter Microwave Oven',
    priceUSD: 290,
    image: '/deals/microwave_oven.jpg',
    categoryId: 'home-kitchen'
  },
  {
    id: 'sub-washer',
    title: 'Front-Load Smart Inverter Washing Machine',
    priceUSD: 850,
    image: '/deals/washing_machine.jpg',
    categoryId: 'home-kitchen'
  },
  {
    id: 'sub-ac',
    title: 'Dual Inverter Split Air Conditioner',
    priceUSD: 720,
    image: '/deals/air_conditioner.jpg',
    categoryId: 'home-kitchen'
  },
  {
    id: 'sub-coffee',
    title: 'Italian Barista Espresso Coffee Machine',
    priceUSD: 420,
    image: '/deals/coffee_machine.jpg',
    categoryId: 'home-kitchen'
  },
  {
    id: 'sub-vacuum',
    title: 'Smart Robot Vacuum & Mop Station',
    priceUSD: 540,
    image: '/deals/robot_vacuum.jpg',
    categoryId: 'home-kitchen'
  },
  {
    id: 'sub-sofa',
    title: 'Nordic Italian Leather Sofa',
    priceUSD: 765,
    image: '/deals/leather_sofa.jpg',
    categoryId: 'home-kitchen'
  },
  {
    id: 'sub-phone',
    title: 'Titanium Flagship 5G Phone',
    priceUSD: 1520,
    image: '/deals/flagship_phone.jpg',
    categoryId: 'consumer-electronics'
  }
];

export const HeroSection = ({ onSelectCategory, onViewAll, onSelectProduct, products = [] }) => {
  const { language, formatPrice, formatNPR } = useCurrency();
  const [currentPromoSlide, setCurrentPromoSlide] = useState(0);
  const [isPromoPaused, setIsPromoPaused] = useState(false);
  const [dealPage, setDealPage] = useState(0);
  const [isDealsPaused, setIsDealsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState(null);
  const totalDealPages = Math.ceil(BILLION_SUBSIDY_DEALS.length / 3);
  // Auto-slide top promotional banner in its compact space
  useEffect(() => {
    if (isPromoPaused) return;
    const interval = setInterval(() => {
      setCurrentPromoSlide(prev => (prev + 1) % PROMO_SLIDES.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isPromoPaused]);

  // Auto-slide top-right "Worth Every Rupee" big home items carousel
  useEffect(() => {
    if (isDealsPaused) return;
    const interval = setInterval(() => {
      setDealPage(prev => (prev + 1) % totalDealPages);
    }, 6000);
    return () => clearInterval(interval);
  }, [isDealsPaused, totalDealPages]);

  const currentPromo = PROMO_SLIDES[currentPromoSlide];

  return (
    <div className="mt-1 sm:mt-1.5 mb-3">
      {/* 
        Taobao Authentic Layout:
        Left: Category Sidebar (h-[374px])
        Right: 
          Top Row (h-[174px]):
            - Left: Compact Promotional Banner Slider (in the exact small space!)
            - Right: Billion Subsidy Deal Showcase (3 items side-by-side)
          Bottom Row (h-[188px]):
            - Scrollable Cards (Voucher Collection, Taobao Live, National Subsidies, Flash Sale, Quad Cards)
      */}
      <div className="w-full max-w-full flex flex-col lg:flex-row gap-3 items-stretch overflow-hidden">
        
        {/* ================= LEFT COLUMN: Category Sidebar ================= */}
        <div className="hidden lg:flex flex-col w-[275px] flex-shrink-0 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs h-full justify-between">
          {/* Header */}
          <div className="px-3.5 py-2.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-800">
              <Layers className="w-4.5 h-4.5 text-[#F85606]" />
              <span>{language === 'ne' ? 'मुख्य विधाहरू' : 'Explore Categories'}</span>
            </div>
          </div>

          {/* Categories List */}
          <div className="p-2 space-y-0.5">
            {CATEGORIES.slice(0, 8).map((cat) => {
              const IconComp = HERO_ICON_MAP[cat.icon] || Layers;
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className="w-full text-left font-semibold text-slate-700 hover:text-[#F85606] hover:bg-orange-50/90 px-3 py-2 rounded-xl transition flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <IconComp className="w-4 h-4 text-slate-400 group-hover:text-[#F85606] flex-shrink-0 transition-colors" />
                    <span className="truncate pr-1 text-[13px] font-semibold text-slate-700 group-hover:text-[#F85606]">
                      {language === 'ne' ? (cat.nepaliName || cat.name) : cat.name}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#F85606] group-hover:translate-x-0.5 transition flex-shrink-0" />
                </button>
              );
            })}
          </div>

          {/* Bottom All Categories Link */}
          <div className="p-2 border-t border-slate-100 bg-slate-50/80">
            <button
              onClick={() => {
                if (onViewAll) {
                  onViewAll();
                } else {
                  onSelectCategory('all');
                }
              }}
              className="w-full text-center text-[13px] font-bold text-[#F85606] hover:text-[#e04e05] py-1 transition block cursor-pointer"
            >
              {language === 'ne' ? 'सबै सामानहरू हेर्नुहोस् →' : 'View All Products →'}
            </button>
          </div>
        </div>

        {/* ================= RIGHT MAIN AREA: Promotional Banner + Tihar Dhamaka ================= */}
        <div className="w-full max-w-full flex-1 min-w-0 flex flex-col gap-2.5 h-auto overflow-hidden">
          
          {/* ================= TOP ROW: Compact Banner + Billion Subsidy ================= */}
          <div className="w-full max-w-full grid grid-cols-1 md:grid-cols-2 items-start gap-2.5 h-auto">
            
            {/* 1. COMPACT PROMOTIONAL BANNER SLIDER */}
            <div 
              className="w-full max-w-full rounded-2xl overflow-hidden relative shadow-2xs select-none h-[180px] sm:h-[190px] md:h-[195px] flex flex-col justify-between p-3 sm:p-3.5 group/promo cursor-pointer"
              onMouseEnter={() => setIsPromoPaused(true)}
              onMouseLeave={() => setIsPromoPaused(false)}
              onClick={() => {
                if (onSelectCategory && currentPromo.linkCategory) {
                  onSelectCategory(currentPromo.linkCategory);
                }
              }}
            >
              {/* Background Gradient */}
              <div 
                className="absolute inset-0 transition-all duration-700 pointer-events-none" 
                style={{ 
                  background: currentPromo.bgGradient || 'linear-gradient(135deg, #ff5000 0%, #ff7d33 100%)',
                  zIndex: 0 
                }}
              />

              {/* 3D Modern Furniture / Product Graphic (Right Side) */}
              <div 
                className="absolute right-1 bottom-1 top-1 w-[44%] sm:w-[46%] pointer-events-none flex items-center justify-center overflow-hidden"
                style={{ zIndex: 10, maxWidth: '180px' }}
              >
                <img
                  src={currentPromo.image}
                  alt={currentPromo.headline}
                  className="w-full h-full object-contain transition-transform duration-500 group-hover/promo:scale-105 drop-shadow-md rounded-xl"
                  style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', objectPosition: 'center' }}
                />
              </div>

              {/* Top Left Promo Badge */}
              <div className="relative z-20 flex items-center gap-1.5">
                <span className="inline-block bg-[#E52B20] text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs tracking-wider">
                  {currentPromo.badge}
                </span>
              </div>

              {/* Center Main Text */}
              <div className="relative z-20 max-w-[54%] sm:max-w-[56%] my-auto space-y-0.5">
                <h2 className="text-white font-black text-sm sm:text-base leading-tight drop-shadow-xs tracking-tight line-clamp-1">
                  {language === 'ne' ? currentPromo.nepaliHeadline : currentPromo.headline}
                </h2>
                <h3 className="text-white/95 font-bold text-xs sm:text-[13px] leading-tight line-clamp-1">
                  {language === 'ne' ? currentPromo.nepaliSubline : currentPromo.subline}
                </h3>
                <p className="text-white/85 text-[10px] sm:text-[11px] font-medium line-clamp-1 pt-0.5">
                  {language === 'ne' ? currentPromo.nepaliSubtitle : currentPromo.subtitle}
                </p>
              </div>

              {/* Bottom Controls: Dots on Left, Arrow Buttons on Right */}
              <div className="relative z-20 flex items-center justify-between pt-1">
                {/* Dots */}
                <div className="flex items-center gap-1">
                  {PROMO_SLIDES.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentPromoSlide(idx);
                      }}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        currentPromoSlide === idx ? 'w-4 bg-white' : 'w-1.5 bg-white/45'
                      }`}
                      title={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>

                {/* Arrow Buttons (< and >) */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentPromoSlide((prev) => (prev - 1 + PROMO_SLIDES.length) % PROMO_SLIDES.length);
                    }}
                    className="w-5 h-5 rounded-full bg-white/25 hover:bg-white/40 text-white flex items-center justify-center transition backdrop-blur-xs cursor-pointer active:scale-95"
                    title="Previous Slide"
                  >
                    <ChevronLeft className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentPromoSlide((prev) => (prev + 1) % PROMO_SLIDES.length);
                    }}
                    className="w-5 h-5 rounded-full bg-white/25 hover:bg-white/40 text-white flex items-center justify-center transition backdrop-blur-xs cursor-pointer active:scale-95"
                    title="Next Slide"
                  >
                    <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            </div>

            {/* 2. WORTH EVERY RUPEE 3-ITEM DEAL SHOWCASE (Tihar Dhamaka - Big & Prominent) */}
            <div 
              onMouseEnter={() => setIsDealsPaused(true)}
              onMouseLeave={() => setIsDealsPaused(false)}
              className="w-full max-w-full group/deals relative bg-white rounded-2xl border border-slate-200/90 pt-2 px-2.5 pb-1 sm:pt-2.5 sm:px-3 sm:pb-1.5 flex flex-col justify-start shadow-xs hover:shadow-md transition-shadow overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-0.5 z-10 w-full">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="font-black text-sm sm:text-base md:text-lg text-slate-900 tracking-tight truncate">
                    {language === 'ne' ? 'तिहार धमाका' : 'Tihar Dhamaka'}
                  </span>
                  <span className="text-[11px] sm:text-xs text-slate-400 font-medium hidden sm:inline truncate">
                    · {language === 'ne' ? 'नकिन्दा मात्र पछुतो' : 'The only regret is leaving it behind'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                  {/* Page indicator dots */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalDealPages }).map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setDealPage(idx)}
                        className={`h-2 rounded-full transition-all cursor-pointer ${
                          dealPage === idx ? 'w-4 bg-[#FF5000]' : 'w-2 bg-slate-200 hover:bg-slate-300'
                        }`}
                        title={`Page ${idx + 1}`}
                      />
                    ))}
                  </div>

                  {/* Header mini arrow buttons for Mobile Phones (Prev & Next) */}
                  <div className="flex items-center gap-1 sm:hidden">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDealPage((prev) => (prev - 1 + totalDealPages) % totalDealPages);
                      }}
                      className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition active:scale-95 shadow-2xs"
                      title="Previous Deals"
                    >
                      <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDealPage((prev) => (prev + 1) % totalDealPages);
                      }}
                      className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition active:scale-95 shadow-2xs"
                      title="Next Deals"
                    >
                      <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectCategory('all')}
                    className="text-xs sm:text-sm font-black text-[#F85606] hover:text-[#d4380d] flex items-center gap-0.5 cursor-pointer ml-1"
                  >
                    <span>{language === 'ne' ? 'थप' : 'More'}</span>
                    <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>
              </div>

              {/* Side Navigation Buttons (Only shown on desktop/laptop so they don't cover mobile products) */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setDealPage((prev) => (prev - 1 + totalDealPages) % totalDealPages);
                }}
                className="hidden sm:flex absolute left-1.5 top-[56%] -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/95 shadow-md border border-slate-200 text-slate-700 hover:text-[#FF5000] hover:scale-110 items-center justify-center transition-all cursor-pointer active:scale-95"
                title="Previous Deals"
              >
                <ChevronLeft className="w-4.5 h-4.5 stroke-[2.5]" />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setDealPage((prev) => (prev + 1) % totalDealPages);
                }}
                className="hidden sm:flex absolute right-1.5 top-[56%] -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/95 shadow-md border border-slate-200 text-slate-700 hover:text-[#FF5000] hover:scale-110 items-center justify-center transition-all cursor-pointer active:scale-95"
                title="Next Deals"
              >
                <ChevronRight className="w-4.5 h-4.5 stroke-[2.5]" />
              </button>

              {/* Sliding Carousel of 3-Item Grids with Touch Swipe for Mobile */}
              <div 
                className="relative w-full overflow-hidden pt-0"
                style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}
                onTouchStart={(e) => {
                  setTouchStartX(e.touches[0].clientX);
                }}
                onTouchEnd={(e) => {
                  if (touchStartX === null) return;
                  const touchEndX = e.changedTouches[0].clientX;
                  const diff = touchStartX - touchEndX;
                  if (diff > 40) {
                    setDealPage((prev) => (prev + 1) % totalDealPages);
                  } else if (diff < -40) {
                    setDealPage((prev) => (prev - 1 + totalDealPages) % totalDealPages);
                  }
                  setTouchStartX(null);
                }}
              >
                <div
                  className="flex h-full transition-transform duration-500 ease-out"
                  style={{
                    width: `${totalDealPages * 100}%`,
                    transform: `translateX(-${(dealPage * 100) / totalDealPages}%)`
                  }}
                >
                  {Array.from({ length: totalDealPages }).map((_, pageIdx) => {
                    const pageDeals = BILLION_SUBSIDY_DEALS.slice(pageIdx * 3, pageIdx * 3 + 3);
                    const slideWidthPercent = 100 / totalDealPages;
                    return (
                      <div
                        key={pageIdx}
                        className="h-full items-stretch px-1 sm:px-2.5"
                        style={{
                          width: `${slideWidthPercent}%`,
                          flex: `0 0 ${slideWidthPercent}%`,
                          maxWidth: `${slideWidthPercent}%`,
                          boxSizing: 'border-box',
                          display: 'grid',
                          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                          columnGap: '8px',
                          rowGap: '0px'
                        }}
                      >
                        {pageDeals.map((deal) => (
                          <div
                            key={deal.id}
                            onClick={() => {
                              if (onSelectProduct && products.length > 0) {
                                const match = products.find(p => p.category === deal.categoryId) || products[0];
                                if (match) onSelectProduct(match);
                              } else {
                                onSelectCategory(deal.categoryId);
                              }
                            }}
                            className="group/item flex flex-col justify-start items-center hover:opacity-95 transition-all cursor-pointer pt-0 pb-0"
                            style={{ minWidth: 0, width: '100%', maxWidth: '100%', overflow: 'hidden' }}
                          >
                            {/* Centered Product Cutout (Larger & Clearer) */}
                            <div className="w-full flex items-center justify-center pt-0 pb-0">
                              <img
                                src={deal.image}
                                alt={deal.title}
                                className="h-[82px] xs:h-[90px] sm:h-[105px] md:h-[114px] w-auto max-w-[95%] object-contain group-hover/item:scale-105 transition-transform duration-300 drop-shadow-sm"
                                style={{ maxHeight: '114px', width: 'auto', objectFit: 'contain' }}
                              />
                            </div>

                            {/* Short Product Title for Mobile */}
                            <div className="w-full text-center px-0.5 mt-0.5">
                              <span className="block text-[11px] xs:text-xs sm:text-[13px] text-slate-800 font-bold truncate leading-tight">
                                {deal.title}
                              </span>
                            </div>

                            {/* Orange-Red Price Tag Pill with Nepalese Rupees */}
                            <div className="w-full text-center mt-0.5 pb-0">
                              <span 
                                className="inline-block bg-[#FF5000] text-white text-[10px] xs:text-[11px] sm:text-xs md:text-[13px] font-black px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-md shadow-xs tracking-tight whitespace-nowrap"
                                style={{ backgroundColor: '#FF5000', color: '#FFFFFF' }}
                              >
                                {formatNPR ? formatNPR(deal.priceUSD) : formatPrice(deal.priceUSD)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>

          {/* ================= BOTTOM ROW: Scrollable Cards (Desktop / Laptop Only) ================= */}
          <div className="hidden lg:block w-full max-w-full">
            <VoucherSubsidiesCards
              onSelectCategory={onSelectCategory}
              onSelectProduct={onSelectProduct}
              products={products}
            />
          </div>
        </div>

      </div>
    </div>
  );
};
