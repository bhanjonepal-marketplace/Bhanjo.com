import React, { useState, useEffect } from 'react';
import { Zap, Clock, ChevronRight } from 'lucide-react';
import { FLASH_DEALS } from '../data/deals';
import { useCurrency } from '../context/CurrencyContext';

export const DarazFlashSale = ({ onSelectProduct, onShopAll }) => {
  const { formatPrice, formatNPR, formatJPY } = useCurrency();

  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 28, seconds: 15 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n) => String(n).padStart(2, '0');

  if (!FLASH_DEALS || FLASH_DEALS.length === 0) return null;

  return (
    <section className="my-6 bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <h2 className="text-sm sm:text-base font-extrabold text-[#f85606] tracking-tight flex items-center gap-1.5">
            <Zap className="w-4 h-4 fill-[#f85606]" />
            <span>Flash Sale</span>
          </h2>

          {/* Simple Countdown Pill */}
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-600">
            <span className="text-slate-400 font-normal">On Sale Now</span>
            <span className="bg-[#f85606] text-white px-1.5 py-0.5 rounded text-[10px] font-mono">{pad(timeLeft.hours)}</span>
            <span>:</span>
            <span className="bg-[#f85606] text-white px-1.5 py-0.5 rounded text-[10px] font-mono">{pad(timeLeft.minutes)}</span>
            <span>:</span>
            <span className="bg-[#f85606] text-white px-1.5 py-0.5 rounded text-[10px] font-mono">{pad(timeLeft.seconds)}</span>
          </div>
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
          className="text-xs font-bold text-[#f85606] hover:underline flex items-center cursor-pointer"
        >
          <span>SHOP ALL DEALS</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Clean Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mt-3">
        {FLASH_DEALS.map((deal) => (
          <div
            key={deal.id}
            onClick={() => onSelectProduct(deal.productId)}
            className="group cursor-pointer flex flex-col justify-between"
          >
            <div className="relative aspect-square rounded-lg overflow-hidden bg-slate-100 mb-1.5 border border-slate-100 group-hover:border-orange-300">
              <img
                src={deal.image}
                alt={deal.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <span className="absolute top-1.5 left-1.5 bg-[#f85606] text-white text-[9px] font-black px-1.5 py-0.5 rounded">
                -{deal.discountPercent}%
              </span>
            </div>

            <div>
              <h3 className="text-[11px] font-medium text-slate-800 line-clamp-1 group-hover:text-[#f85606]">
                {deal.title}
              </h3>
              <div className="text-xs font-bold text-[#f85606] mt-0.5">
                {formatPrice(deal.dealPriceUSD)}
              </div>
              <div className="text-[10px] text-slate-500 font-medium">
                {formatNPR(deal.dealPriceUSD)}
              </div>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};
