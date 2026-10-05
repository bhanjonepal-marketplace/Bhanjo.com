import React, { useState, useEffect } from 'react';
import { ShieldCheck, ChevronRight, ChevronDown, Zap, CheckCircle, Flame, Clock } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { RedAlarmClock } from './RedAlarmClock';

export const DarazMall = ({ products = [], onSelectProduct, onSelectCategory, onShopAll }) => {
  const { formatPrice, formatNPR } = useCurrency();

  // Live countdown timer with milliseconds (tenths)
  const [timeLeft, setTimeLeft] = useState({ 
    hours: 4, 
    minutes: 27, 
    seconds: 45, 
    millis: 6 
  });

  const [flashItems, setFlashItems] = useState([]);

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

  const [visibleCount, setVisibleCount] = useState(6);

  // Fetch real flash sale items from backend API
  useEffect(() => {
    fetch('/api/flash-sale')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.items) && data.items.length > 0) {
          setFlashItems(data.items);
        }
      })
      .catch(() => {});
  }, []);

  const pad = (n) => String(n).padStart(2, '0');

  // Display flash sale items if available, or fallback to catalog items
  const allItems = flashItems.length > 0 
    ? flashItems 
    : (products && products.length > 0 ? products.map((p, idx) => ({
        id: p.id,
        product: p,
        flash_price: p.samplePrice ? p.samplePrice * 0.65 : 15,
        original_price: p.samplePrice || 25,
        discount_percent: 35 + (idx * 5) % 25
      })) : []);

  const displayItems = allItems.slice(0, visibleCount);

  return (
    <section 
      id="mall-flash-sale" 
      className="my-7 rounded-2xl border-2 border-[#E00028] shadow-[0_12px_45px_rgba(224,0,40,0.22)] overflow-hidden bg-gradient-to-b from-rose-50/70 via-white to-white transition-all duration-200 ring-1 ring-red-400/30"
    >
      
      {/* 1. TOP PROMOTIONAL ANNOUNCEMENT STRIP (Rich Festival Retail Look) */}
      <div className="bg-gradient-to-r from-[#99001A] via-[#C40024] to-[#99001A] text-amber-200 text-[11px] sm:text-xs px-4 py-1.5 flex items-center justify-between border-b border-red-400/30 font-semibold tracking-wide shadow-inner">
        <div className="flex items-center gap-2">
          <Flame className="w-3.5 h-3.5 text-yellow-300 fill-current animate-pulse" />
          <span className="uppercase tracking-wider text-white font-extrabold text-[10px] sm:text-[11px]">
            LIMITED-TIME CRAZY PRICE CRASH • UP TO 70% OFF
          </span>
        </div>
      </div>

      {/* 2. VIBRANT RED HEADER BANNER WITH ALARM CLOCK & FLASH SALE TITLE */}
      <div className="bg-gradient-to-r from-[#B8001F] via-[#E00028] to-[#FF0036] px-4 py-3 sm:py-4 text-white flex flex-wrap items-center justify-between gap-3 shadow-md relative overflow-hidden">
        
        {/* Subtle background glow effect */}
        <div className="absolute -right-10 -top-10 w-56 h-56 bg-yellow-400/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute left-1/3 -bottom-10 w-40 h-40 bg-red-950/30 rounded-full blur-xl pointer-events-none" />

        {/* Left side: Cute Red Alarm Clock with bells + Flash Sale Title */}
        <div className="flex flex-wrap items-center gap-3.5 relative z-10">
          
          {/* Animated Cute Red Alarm Clock (Matching reference clock with lightning bolt, zero Chinese text) */}
          <div 
            className="relative flex-shrink-0 group cursor-pointer transition-transform hover:scale-108 active:scale-95" 
            onClick={onShopAll}
            title="Click to open dedicated Flash Sale rush page"
          >
            <RedAlarmClock className="w-12 h-12 sm:w-13 sm:h-13" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-yellow-400 text-red-950 text-[10px] font-black px-2 py-0.5 rounded shadow-xs uppercase tracking-tight">
                MALL EXCLUSIVE
              </span>
              <span className="text-[11px] text-yellow-200 font-bold hidden sm:inline">
                ⚡ 570K+ Sold Across Nepal
              </span>
            </div>

            <div className="flex items-center gap-2.5 mt-0.5 flex-wrap">
              <h2 className="text-lg sm:text-2xl font-black tracking-tight text-white flex items-center gap-2 drop-shadow-sm">
                <span>Bhanjo Mall</span>
                
                {/* Prominent Clock Icon right by Flash Sale (User's specific requirement) */}
                <div 
                  onClick={onShopAll}
                  className="inline-flex items-center gap-1.5 bg-yellow-400 hover:bg-yellow-300 text-red-950 px-2.5 py-0.5 rounded-full shadow-md transition-all cursor-pointer group/title"
                  title="Flash Sale Deals"
                >
                  <Clock className="w-4 h-4 text-red-700 stroke-[3] animate-pulse group-hover/title:rotate-12 transition-transform" />
                  <span className="text-xs sm:text-sm font-black uppercase tracking-tight text-red-950">
                    Flash Sale
                  </span>
                  <span className="bg-red-600 text-white text-[8px] font-black px-1.5 py-0.2 rounded-full uppercase animate-pulse">
                    LIVE
                  </span>
                </div>
              </h2>
            </div>
          </div>

          {/* High-Impact Flash Sale Countdown Pill with Live Milliseconds */}
          <div className="flex items-center gap-1 text-[11px] font-bold text-white bg-black/45 backdrop-blur-xs px-3.5 py-1.5 rounded-full border border-white/30 shadow-inner font-mono">
            <span className="text-yellow-300 font-bold uppercase text-[10px] tracking-wide mr-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 animate-pulse text-yellow-300" />
              <span>Ends In:</span>
            </span>
            <span className="bg-white/20 text-white px-1.5 py-0.5 rounded text-[11px] font-black">{pad(timeLeft.hours)}</span>
            <span>:</span>
            <span className="bg-white/20 text-white px-1.5 py-0.5 rounded text-[11px] font-black">{pad(timeLeft.minutes)}</span>
            <span>:</span>
            <span className="bg-white/20 text-white px-1.5 py-0.5 rounded text-[11px] font-black">{pad(timeLeft.seconds)}</span>
            <span>.</span>
            <span className="bg-yellow-400 text-slate-950 px-1.5 py-0.5 rounded text-[11px] font-black animate-pulse">{timeLeft.millis}</span>
          </div>
        </div>

        {/* Right side: High-Converting SHOP ALL DEALS Button in Glowing Yellow */}
        <button 
          onClick={() => {
            if (onShopAll) {
              onShopAll();
            } else {
              const catalogElem = document.getElementById('catalog-section');
              if (catalogElem) catalogElem.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="relative z-10 bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-400 hover:from-yellow-300 hover:to-amber-200 active:scale-95 text-slate-950 font-black text-xs sm:text-sm px-5 py-2.5 rounded-full shadow-lg shadow-yellow-500/30 transition-all flex items-center gap-2 cursor-pointer group transform hover:scale-105"
          title="Open Dedicated Full Flash Sale Page"
        >
          <Zap className="w-4 h-4 fill-current text-red-600 animate-pulse" />
          <span className="tracking-tight uppercase">SHOP ALL DEALS</span>
          <ChevronRight className="w-4 h-4 stroke-[3] group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* 3. Sale Products Display Grid (Rich Rose & Red Aesthetic) */}
      <div className="p-3 sm:p-4 bg-gradient-to-b from-[#FFF5F6] via-[#FFFAFA] to-white grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {displayItems.map((item, index) => {
          const product = item.product || item;
          const flashPriceUSD = item.flash_price || product.samplePrice || 25;
          const originalPriceUSD = item.original_price || flashPriceUSD * 1.5;
          const discountPercent = item.discount_percent || 35;
          const imageSrc = product.images?.[0] || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400';
          const savingsNPR = Math.max(0, Math.round((originalPriceUSD - flashPriceUSD) * 133.5));

          // Live card countdown timer with milliseconds
          const itemSecs = (timeLeft.seconds + (index * 7)) % 60;
          const itemMins = (timeLeft.minutes + (index * 3)) % 60;
          const itemMillis = (timeLeft.millis + index) % 10;

          return (
            <div
              key={item.id || product.id}
              onClick={() => onSelectProduct && onSelectProduct(product.id)}
              className="bg-white rounded-xl border border-red-100 hover:border-[#E00028] hover:shadow-xl hover:shadow-red-500/15 transition-all duration-200 flex flex-col justify-between cursor-pointer group overflow-hidden"
            >
              {/* Product Image Tile with Bottom Yellow Live Countdown Banner */}
              <div className="relative aspect-square overflow-hidden bg-slate-100">
                <img
                  src={imageSrc}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                
                {/* Red Discount Tag */}
                <span className="absolute top-1.5 left-1.5 bg-[#E00028] text-white text-[10px] font-black px-1.5 py-0.5 rounded shadow-sm z-10">
                  -{discountPercent}%
                </span>

                {/* Official Mall Badge */}
                <span className="absolute top-1.5 right-1.5 bg-slate-900/85 text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow-xs z-10">
                  MALL
                </span>

                {/* Bottom Yellow Flash Deal Live Timer Banner */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 text-slate-950 font-black text-[9px] py-0.5 px-1.5 flex items-center justify-between shadow-md z-10 font-mono">
                  <span className="flex items-center gap-0.5 uppercase">
                    <Zap className="w-2.5 h-2.5 fill-current text-red-600" />
                    <span>Flash</span>
                  </span>
                  <span>{pad(itemMins)}:{pad(itemSecs)}.{itemMillis} Left</span>
                </div>
              </div>

              {/* Product Info & Pricing */}
              <div className="p-2.5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 
                    className="text-xs font-semibold text-slate-800 line-clamp-2 group-hover:text-[#E00028] transition leading-snug"
                    title={product.title}
                  >
                    {product.title}
                  </h3>

                  {/* Red/Amber Savings Badge */}
                  <div className="mt-1.5">
                    <span className="bg-rose-50 border border-red-200 text-red-700 text-[9px] font-black px-1.5 py-0.2 rounded inline-flex items-center gap-0.5">
                      <span>⚡</span>
                      <span>Save Rs. {savingsNPR.toLocaleString()}</span>
                    </span>
                  </div>

                  {/* Prices */}
                  <div className="mt-1.5">
                    <div className="text-sm font-black text-[#E00028]">
                      {formatNPR(flashPriceUSD)}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400">
                      <span className="line-through">{formatNPR(originalPriceUSD)}</span>
                      <span className="font-mono text-slate-500">({formatPrice(flashPriceUSD)})</span>
                    </div>
                  </div>
                </div>

                {/* Card Action & Authenticity */}
                <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-emerald-700 font-semibold">
                  <span className="flex items-center gap-0.5">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>Authentic</span>
                  </span>
                  <span className="text-slate-400 font-normal">★ {product.rating || 4.9}</span>
                </div>

                {/* Quick Buy Deal Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onSelectProduct) onSelectProduct(product.id);
                  }}
                  className="mt-2 w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-[10px] font-black py-1 rounded-lg flex items-center justify-center gap-1 shadow-xs transition active:scale-95 cursor-pointer"
                >
                  <Zap className="w-3 h-3 fill-current text-yellow-300" />
                  <span>Buy Deal</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Centered Red Pill Show More Option (Matching Reference Photo 2) */}
      <div className="py-4 bg-white/90 backdrop-blur-xs flex justify-center items-center border-t border-red-100/60">
        <button
          type="button"
          onClick={() => {
            if (visibleCount < allItems.length) {
              setVisibleCount(prev => prev + 6);
            } else if (onShopAll) {
              onShopAll();
            }
          }}
          className="bg-[#E00028] hover:bg-[#C40024] active:scale-95 text-white font-extrabold text-xs sm:text-sm px-8 sm:px-12 py-2.5 rounded-full shadow-md shadow-red-500/20 hover:shadow-lg hover:shadow-red-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer group"
        >
          <span>Show More</span>
          <ChevronDown className="w-4 h-4 stroke-[2.5] group-hover:translate-y-0.5 transition-transform" />
        </button>
      </div>

    </section>
  );
};

