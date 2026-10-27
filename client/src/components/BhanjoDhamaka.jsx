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
      className="my-4 sm:my-5 rounded-2xl overflow-hidden border-2 border-[#E11D48] shadow-xs bg-[#FAF0F3] text-slate-900"
    >
      {/* 1. TOP PROMOTIONAL ANNOUNCEMENT STRIP (Black Bar matching Image 1) */}
      <div className="bg-[#1B1F3B] text-white text-xs px-4 py-2 flex items-center justify-between font-bold tracking-wide">
        <span className="uppercase tracking-wider font-black text-[11px] sm:text-xs text-white">
          BHANJO UTSAV DHAMAKA • CRAZY CRASH DEALS UP TO 30% OFF
        </span>
        <span className="text-[10px] sm:text-[11px] uppercase tracking-wider font-bold text-white">
          100% NEPALI UTSAV
        </span>
      </div>

      {/* 2. THEMED HEADER BANNER (Matching Image 1) */}
      <div className="px-4 sm:px-5 py-3 sm:py-3.5 flex flex-wrap items-center justify-between gap-3">
        
        {/* Left: UTSAV SPECIAL badge + Bhanjo UTSAV DHAMAKA + Countdown */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          <span className="bg-[#1B1F3B] text-white text-[10px] font-black px-3 py-1 rounded-md uppercase tracking-wider shadow-2xs">
            UTSAV SPECIAL
          </span>
          
          <h2 className="text-lg sm:text-2xl font-black tracking-tight text-[#1B1F3B]">
            Bhanjo UTSAV DHAMAKA
          </h2>

          {/* Countdown Timer with 4 black boxes (including milliseconds) */}
          <div className="flex items-center gap-1.5 ml-1 sm:ml-2">
            <span className="text-[11px] sm:text-xs font-bold text-[#5B6070] uppercase tracking-wide mr-1">
              ENDS IN
            </span>
            <span className="bg-[#1B1F3B] text-white font-mono font-bold text-xs sm:text-sm px-2.5 py-1 rounded-md shadow-2xs">
              {pad(timeLeft.hours)}
            </span>
            <span className="text-[#1B1F3B] font-black">:</span>
            <span className="bg-[#1B1F3B] text-white font-mono font-bold text-xs sm:text-sm px-2.5 py-1 rounded-md shadow-2xs">
              {pad(timeLeft.minutes)}
            </span>
            <span className="text-[#1B1F3B] font-black">:</span>
            <span className="bg-[#1B1F3B] text-white font-mono font-bold text-xs sm:text-sm px-2.5 py-1 rounded-md shadow-2xs">
              {pad(timeLeft.seconds)}
            </span>
            <span className="text-[#1B1F3B] font-black">.</span>
            <span className="bg-[#1B1F3B] text-white font-mono font-bold text-xs sm:text-sm px-2 py-1 rounded-md shadow-2xs">
              {timeLeft.millis}
            </span>
          </div>
        </div>

        {/* Right: SHOP ALL DEALS › Button */}
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
          className="bg-[#E11D48] hover:bg-[#BE123C] text-white font-black text-xs sm:text-sm px-5 py-2 rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1 active:scale-95"
          title="Open Dedicated Bhanjo Dhamaka Page"
        >
          <span>SHOP ALL DEALS</span>
          <ChevronRight className="w-4 h-4 stroke-[3]" />
        </button>

      </div>

      {/* 3. 5 Product Cards Grid (Matching Image 1) */}
      <div className="px-4 sm:px-5 pb-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {allItems.slice(0, 5).map((item, index) => {
          const product = item.product || item;
          const flashPriceUSD = item.flash_price || product.samplePrice || 25;
          const originalPriceUSD = item.original_price || flashPriceUSD * 1.5;
          const discountPercent = item.discount_percent || 35;
          const imageSrc = product.images?.[0] || product.image || 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80';

          const itemSecs = (timeLeft.seconds + (index * 7)) % 60;
          const itemMins = (timeLeft.minutes + (index * 3)) % 60;
          const itemMillis = (timeLeft.millis + index) % 10;

          return (
            <div
              key={item.id || product.id}
              onClick={() => onSelectProduct && onSelectProduct(product.id)}
              className="bg-white rounded-2xl border border-rose-100/80 hover:border-[#E11D48] shadow-2xs hover:shadow-md transition-all duration-200 p-2.5 flex flex-col justify-between cursor-pointer group relative overflow-hidden"
            >
              {/* Product Image Tile with Top Badges */}
              <div>
                <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-50 mb-2">
                  <img
                    src={imageSrc}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-200"
                    loading="lazy"
                  />

                  {/* Deals & Discount Tag */}
                  <span className="absolute top-1.5 left-1.5 text-[9.5px] px-2 py-0.5 rounded shadow-2xs z-10 bg-[#1B1F3B] text-white font-bold">
                    -{discountPercent}%
                  </span>

                  {/* Official Bhanjo Mall Badge */}
                  <span className="absolute top-1.5 right-1.5 text-[8.5px] font-bold px-1.5 py-0.5 rounded shadow-2xs z-10 bg-white/95 text-[#1B1F3B] border border-slate-100">
                    BHANJO MALL
                  </span>
                </div>

                {/* Crimson DHAMAKA strip */}
                <div className="bg-[#E11D48] text-white px-2 py-1 text-[9.5px] font-bold flex justify-between items-center rounded-sm mb-2">
                  <span className="uppercase tracking-tight">DHAMAKA</span>
                  <span className="font-mono text-[9px]">{pad(itemMins)}:{pad(itemSecs)}.{itemMillis} Left</span>
                </div>

                {/* Title */}
                <h3 
                  className="text-xs font-semibold text-[#1B1F3B] line-clamp-2 leading-tight group-hover:text-[#E11D48] transition min-h-[30px]"
                  title={product.title}
                >
                  {product.title}
                </h3>

                {/* Price Row */}
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="text-sm sm:text-base font-black text-[#1B1F3B]">
                    {formatNPR(flashPriceUSD)}
                  </span>
                  <span className="text-[10.5px] text-slate-400 line-through">
                    {formatNPR(originalPriceUSD)}
                  </span>
                </div>
              </div>

              {/* Quick Buy Deal Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onSelectProduct) onSelectProduct(product.id);
                }}
                className="mt-3 w-full bg-[#E11D48] hover:bg-[#BE123C] text-white font-black text-xs py-2 rounded-xl text-center transition-all cursor-pointer active:scale-95 shadow-xs"
              >
                Loot Deal
              </button>
            </div>
          );
        })}
      </div>

    </section>
  );
};

// Backwards-compatibility alias
export const DarazMall = BhanjoDhamaka;
export default BhanjoDhamaka;
