import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, ChevronRight, ChevronLeft, Zap, Flame, Clock, 
  Sparkles 
} from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

// 3D Bhanjo Red Panda Mascot Emblem (Festive Himalayan Dhamaka Rush)
const MascotEmblem = ({ className = "w-13 h-13" }) => (
  <div className={`relative flex items-center justify-center ${className} group`}>
    <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-orange-400 to-amber-300 blur-xs opacity-60" />
    <div className="relative w-full h-full rounded-full bg-gradient-to-b from-amber-100 to-orange-200 border-2 border-white shadow-md overflow-hidden flex items-center justify-center">
      <img 
        src="/mascot/bhanjo_mascot_3d_clean.png?v=3" 
        alt="Bhanjo Red Panda" 
        className="w-full h-full object-contain transform scale-110 group-hover:scale-125 transition-transform duration-300" 
      />
    </div>
  </div>
);

export const BhanjoDhamaka = ({ products = [], onSelectProduct, onSelectCategory, onShopAll }) => {
  const { formatPrice, formatNPR } = useCurrency();

  // Live countdown timer with tenths
  const [timeLeft, setTimeLeft] = useState({ 
    hours: 4, 
    minutes: 27, 
    seconds: 45, 
    millis: 6 
  });

  const [flashItems, setFlashItems] = useState([]);
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  };

  const handleSideScroll = (direction) => {
    if (!scrollRef.current) return;
    const scrollAmount = direction === 'left' ? -260 : 260;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    setTimeout(checkScroll, 320);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds, millis } = prev;
        millis -= 1;
        if (millis < 0) {
          millis = 9;
          seconds -= 1;
          if (seconds < 0) {
            seconds = 59;
            minutes -= 1;
            if (minutes < 0) {
              minutes = 59;
              hours -= 1;
              if (hours < 0) {
                hours = 12;
                minutes = 0;
                seconds = 0;
              }
            }
          }
        }
        return { hours, minutes, seconds, millis };
      });
    }, 100);
    return () => clearInterval(timer);
  }, []);

  // Fetch real flash sale items from backend API
  useEffect(() => {
    fetch('/api/flash-sale')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.items) && data.items.length > 0) {
          const valid = data.items.filter(it => {
            const p = it.product;
            return p && p.title && p.title !== 'Flash Sale Premium Item' && p.id;
          });
          setFlashItems(valid);
        }
      })
      .catch(() => {});
  }, []);

  const validCatalogProducts = (products || []).filter(p => 
    p && p.title && p.title !== 'Flash Sale Premium Item' && p.id
  );

  const allItems = flashItems.length > 0 
    ? flashItems 
    : (validCatalogProducts.length > 0 ? validCatalogProducts.map((p, idx) => ({
        id: p.id,
        product: p,
        flash_price: p.samplePrice ? p.samplePrice * 0.65 : 15,
        original_price: p.samplePrice || 25,
        discount_percent: 35 + (idx * 5) % 25
      })) : []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [allItems]);

  const pad = (n) => String(n).padStart(2, '0');

  if (allItems.length === 0) return null;

  return (
    <section 
      id="bhanjo-dhamaka-section" 
      className="my-7 rounded-2xl overflow-hidden transition-all duration-300 border-2 border-orange-300 shadow-[0_10px_35px_rgba(249,115,22,0.14)] bg-gradient-to-b from-orange-50/50 via-white to-white ring-1 ring-orange-200/60 text-slate-900"
    >
      
      {/* 1. TOP PROMOTIONAL ANNOUNCEMENT STRIP (High-Key Frosted Ticker) */}
      <div className="bg-gradient-to-r from-orange-100/90 via-amber-50 to-orange-100/70 text-orange-950 text-[11px] sm:text-xs px-4 py-1.5 flex items-center justify-between border-b border-orange-200/80 font-bold tracking-wide shadow-2xs">
        <div className="flex items-center gap-2">
          <Flame className="w-3.5 h-3.5 text-[#FF5000] fill-current animate-pulse" />
          <span className="uppercase tracking-wider font-extrabold text-[10px] sm:text-[11px] text-orange-950">
            BHANJO UTSAV DHAMAKA • CRAZY CRASH DEALS UP TO 30% OFF
          </span>
        </div>
        <span className="text-[9.5px] font-mono uppercase tracking-widest hidden sm:inline bg-orange-200/80 text-orange-950 px-2.5 py-0.5 rounded-full font-black shadow-2xs">
          🇳🇵 100% NEPALI UTSAV
        </span>
      </div>

      {/* 2. THEMED HEADER BANNER (Frosted Flame Luxe) */}
      <div className="bg-gradient-to-r from-orange-50 via-white to-amber-50/70 border-b border-orange-200/80 text-slate-900 px-3 sm:px-4 py-3 sm:py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-2xs relative overflow-hidden">
        
        {/* Soft Ambient Glowing Gradients */}
        <div className="absolute -right-8 -top-8 w-48 h-48 rounded-full blur-2xl pointer-events-none bg-orange-100/80" />
        <div className="absolute left-1/3 -bottom-8 w-40 h-40 rounded-full blur-xl pointer-events-none bg-amber-200/40" />

        {/* Left side: 3D Mascot + Title + Countdown Pill */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3.5 relative z-10">
          
          {/* 3D Red Panda Mascot popping out */}
          <div 
            className="relative flex-shrink-0 cursor-pointer transition-transform hover:scale-108 active:scale-95" 
            onClick={onShopAll}
            title="Click to open dedicated Bhanjo Utsav Dhamaka page"
          >
            <MascotEmblem className="w-11 h-11 sm:w-13 sm:h-13" />
          </div>

            <div className="flex flex-col">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span className="bg-[#FFC83D] text-[#1B1F3B] text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-full shadow-2xs uppercase tracking-tight">
                UTSAV SPECIAL
              </span>
              <span className="text-[10px] sm:text-[11px] font-bold text-[#5B6070] hidden xs:inline sm:inline">
                🇳🇵 Bhanjo Red Panda Rush Deals
              </span>
            </div>

            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <h2 className="text-base sm:text-2xl font-black tracking-tight text-[#1B1F3B] flex items-center gap-1.5 sm:gap-2 drop-shadow-2xs">
                <span>Bhanjo</span>
                
                {/* Title pill with icon */}
                <div 
                  onClick={onShopAll}
                  className="inline-flex items-center gap-1 sm:gap-1.5 bg-[#FFE7EC] hover:bg-[#ffd6df] border border-[#E5E7EB] text-[#1B1F3B] px-2.5 py-0.5 rounded-full shadow-2xs transition-all cursor-pointer group/title"
                  title="Bhanjo Utsav Dhamaka"
                >
                  <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#E11D48] fill-current" />
                  <span className="text-[11px] sm:text-sm font-black uppercase tracking-tight text-[#1B1F3B]">
                    Utsav Dhamaka
                  </span>
                  <span className="bg-[#FFC83D] text-[#1B1F3B] text-[7px] sm:text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase shadow-2xs">
                    CRAZY LIVE
                  </span>
                </div>
              </h2>
            </div>
          </div>

          {/* Countdown Pill with Live Milliseconds */}
          <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full font-mono bg-white border border-[#E5E7EB] text-[#1B1F3B] shadow-2xs">
            <span className="font-bold uppercase text-[9px] sm:text-[10px] tracking-wide mr-1 flex items-center gap-1 text-[#E11D48]">
              <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>Ends In:</span>
            </span>
            <span className="px-1 sm:px-1.5 py-0.5 rounded text-[10px] sm:text-[11px] font-black bg-[#FFE7EC] text-[#1B1F3B] border border-[#E5E7EB]">{pad(timeLeft.hours)}</span>
            <span className="text-[#E11D48]">:</span>
            <span className="px-1 sm:px-1.5 py-0.5 rounded text-[10px] sm:text-[11px] font-black bg-[#FFE7EC] text-[#1B1F3B] border border-[#E5E7EB]">{pad(timeLeft.minutes)}</span>
            <span className="text-[#E11D48]">:</span>
            <span className="px-1 sm:px-1.5 py-0.5 rounded text-[10px] sm:text-[11px] font-black bg-[#FFE7EC] text-[#1B1F3B] border border-[#E5E7EB]">{pad(timeLeft.seconds)}</span>
            <span className="text-[#E11D48]">.</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] sm:text-[11px] font-black bg-[#FFC83D] text-[#1B1F3B] shadow-2xs">{timeLeft.millis}</span>
          </div>
        </div>

        {/* Right side: Scroll controls and Action Button */}
        <div className="flex items-center gap-2 relative z-10 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-1.5">
            <button 
              type="button"
              onClick={() => handleSideScroll('left')}
              disabled={!canScrollLeft}
              aria-label="Scroll left"
              className={`w-7.5 h-7.5 sm:w-8.5 sm:h-8.5 rounded-full border border-orange-200/90 bg-white flex items-center justify-center transition active:scale-95 shadow-2xs ${
                canScrollLeft ? 'text-orange-950 hover:bg-orange-50 cursor-pointer shadow-xs' : 'text-slate-300 cursor-not-allowed opacity-40'
              }`}
              title="Scroll left"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
            </button>
            <button 
              type="button"
              onClick={() => handleSideScroll('right')}
              disabled={!canScrollRight}
              aria-label="Scroll right"
              className={`w-7.5 h-7.5 sm:w-8.5 sm:h-8.5 rounded-full border border-orange-200/90 bg-white flex items-center justify-center transition active:scale-95 shadow-2xs ${
                canScrollRight ? 'text-orange-950 hover:bg-orange-50 cursor-pointer shadow-xs' : 'text-slate-300 cursor-not-allowed opacity-40'
              }`}
              title="Scroll right"
            >
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          <button 
            onClick={() => {
              if (onShopAll) {
                onShopAll();
              } else {
                const catalogElem = document.getElementById('catalog-section');
                if (catalogElem) catalogElem.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="flex-1 md:flex-initial text-xs sm:text-sm px-4.5 sm:px-6 py-2 sm:py-2.5 rounded-full transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer group transform hover:scale-105 active:scale-95 bg-[#E11D48] hover:bg-[#BE123C] text-white font-black shadow-md shadow-rose-900/15"
            title="Open Dedicated Full Bhanjo Dhamaka Page"
          >
            <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current text-yellow-300" />
            <span className="tracking-tight uppercase">SHOP ALL DEALS</span>
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* 3. Single-Row Side-Scrollable Products Track */}
      <div className="relative group/mall-carousel p-3 sm:p-4 transition-colors bg-gradient-to-b from-orange-50/40 via-white to-amber-50/30">
        {/* Desktop floating side navigation chevrons */}
        <button
          type="button"
          onClick={() => handleSideScroll('left')}
          disabled={!canScrollLeft}
          className={`hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/95 text-slate-800 border border-slate-300 shadow-md items-center justify-center hover:bg-amber-50 transition-all active:scale-95 cursor-pointer ${
            canScrollLeft ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-75 pointer-events-none'
          }`}
          aria-label="Previous items"
        >
          <ChevronLeft className="w-4.5 h-4.5 stroke-[2.5]" />
        </button>
        <button
          type="button"
          onClick={() => handleSideScroll('right')}
          disabled={!canScrollRight}
          className={`hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/95 text-slate-800 border border-slate-300 shadow-md items-center justify-center hover:bg-amber-50 transition-all active:scale-95 cursor-pointer ${
            canScrollRight ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-75 pointer-events-none'
          }`}
          aria-label="Next items"
        >
          <ChevronRight className="w-4.5 h-4.5 stroke-[2.5]" />
        </button>

        {/* Scrollable Products Row */}
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto scroll-smooth no-scrollbar snap-x snap-mandatory py-1 px-0.5"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {allItems.slice(0, 12).map((item, index) => {
            const product = item.product || item;
            const flashPriceUSD = item.flash_price || product.samplePrice || 25;
            const originalPriceUSD = item.original_price || flashPriceUSD * 1.5;
            const discountPercent = item.discount_percent || 35;
            const imageSrc = product.images?.[0] || product.image || 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80';
            const savingsNPR = Math.max(0, Math.round((originalPriceUSD - flashPriceUSD) * 133.5));

            const itemSecs = (timeLeft.seconds + (index * 7)) % 60;
            const itemMins = (timeLeft.minutes + (index * 3)) % 60;
            const itemMillis = (timeLeft.millis + index) % 10;

            return (
              <div
                key={item.id || product.id}
                onClick={() => onSelectProduct && onSelectProduct(product.id)}
                className="w-[168px] sm:w-[200px] flex-shrink-0 snap-start rounded-xl transition-all duration-200 flex flex-col justify-between cursor-pointer group overflow-hidden bg-white border border-[#E5E7EB] hover:border-[#E11D48] hover:shadow-xl text-[#1B1F3B]"
              >
                {/* Product Image Tile with Bottom Live Countdown Banner */}
                <div className="relative aspect-square overflow-hidden bg-slate-100">
                  <img
                    src={imageSrc}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  
                  {/* Deals & Discount Tag (Gold with Midnight Navy Text) */}
                  <span className="absolute top-1.5 left-1.5 text-[10px] px-1.5 py-0.5 rounded shadow-xs z-10 bg-[#FFC83D] text-[#1B1F3B] font-black">
                    -{discountPercent}%
                  </span>

                  {/* Official Bhanjo Mall Badge */}
                  <span className="absolute top-1.5 right-1.5 text-[8px] font-bold px-1.5 py-0.5 rounded shadow-xs z-10 bg-[#1B1F3B] text-white">
                    BHANJO MALL
                  </span>

                  {/* Bottom Flash Deal Live Timer Banner */}
                  <div className="absolute bottom-0 inset-x-0 text-[9px] py-0.5 px-1.5 flex items-center justify-between shadow-xs z-10 font-mono bg-[#FFC83D] text-[#1B1F3B] font-black">
                    <span className="flex items-center gap-0.5 uppercase">
                      <Flame className="w-2.5 h-2.5 fill-current text-[#E11D48]" />
                      <span>Dhamaka</span>
                    </span>
                    <span>{pad(itemMins)}:{pad(itemSecs)}.{itemMillis} Left</span>
                  </div>
                </div>

                {/* Product Info & Pricing */}
                <div className="p-2 sm:p-2.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 
                      className="text-xs font-semibold line-clamp-2 transition leading-tight min-h-[28px] text-[#1B1F3B] group-hover:text-[#E11D48]"
                      title={product.title}
                    >
                      {product.title}
                    </h3>

                    {/* Savings Badge & Rating */}
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-[9px] font-black px-1.5 py-0.5 rounded inline-flex items-center gap-0.5 bg-[#FFE7EC] border border-[#E5E7EB] text-[#1B1F3B]">
                        <span>🪔</span>
                        <span>Save Rs. {savingsNPR.toLocaleString()}</span>
                      </span>
                      <span className="text-[#5B6070] text-[10px] font-medium">★ {product.rating || 4.9}</span>
                    </div>

                    {/* Prices & Authentic Badge */}
                    <div className="mt-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-sm leading-tight text-[#E11D48] font-black">
                          {formatNPR(flashPriceUSD)}
                        </span>
                        <span className="inline-flex items-center gap-0.5 text-[9.5px] font-bold text-[#15803D] bg-emerald-50 px-1 py-0.5 rounded border border-emerald-200/60 leading-none">
                          <ShieldCheck className="w-2.5 h-2.5 text-[#15803D]" />
                          <span>Authentic</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] mt-0.5 leading-none text-[#5B6070]">
                        <span className="line-through">{formatNPR(originalPriceUSD)}</span>
                        <span className="font-mono opacity-70">({formatPrice(flashPriceUSD)})</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Buy Deal Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onSelectProduct) onSelectProduct(product.id);
                    }}
                    className="mt-1.5 w-full text-[10px] py-1 rounded-lg flex items-center justify-center gap-1 shadow-xs transition active:scale-95 cursor-pointer bg-[#E11D48] hover:bg-[#BE123C] text-white font-black shadow-rose-900/10"
                  >
                    <Zap className="w-3 h-3 fill-current text-white" />
                    <span>Loot Deal</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Bottom Quick Action Bar */}
      <div className="pt-2.5 pb-3 sm:pt-3 sm:pb-3.5 flex justify-center items-center bg-[#FFE7EC]/40 border-t border-[#E5E7EB]">
        <button
          type="button"
          onClick={() => {
            if (onShopAll) {
              onShopAll();
            } else {
              const catalogElem = document.getElementById('catalog-section');
              if (catalogElem) catalogElem.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="active:scale-95 text-xs sm:text-sm px-8 sm:px-12 py-2 sm:py-2.5 rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer group bg-[#E11D48] hover:bg-[#BE123C] text-white font-black shadow-md shadow-rose-900/15"
        >
          <span>View All Dhamaka Deals</span>
          <ChevronRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

    </section>
  );
};

// Backwards-compatibility alias
export const DarazMall = BhanjoDhamaka;
export default BhanjoDhamaka;
