import React, { useState, useEffect } from 'react';
import { ShieldCheck, ChevronRight, Zap, CheckCircle } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

export const DarazMall = ({ products = [], onSelectProduct, onSelectCategory }) => {
  const { formatPrice, formatNPR } = useCurrency();

  // Flash Sale countdown timer
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

  // Display top 6 sale products from the active catalog
  const saleProducts = products && products.length > 0 ? products.slice(0, 6) : [];

  return (
    <section id="mall-flash-sale" className="my-6 bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
      
      {/* Mall & Flash Sale Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span className="bg-red-600 text-white text-xs font-black px-2 py-0.5 rounded shadow-xs">MALL</span>
            <span className="text-[#f85606] flex items-center gap-1 font-black">
              <Zap className="w-4 h-4 fill-[#f85606]" />
              <span>Bhanjo Mall Flash Sale</span>
            </span>
          </h2>

          {/* Flash Sale Countdown Pill */}
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-orange-50/80 px-2.5 py-0.5 rounded-full border border-orange-200/60">
            <span className="text-slate-400 font-normal">On Sale Now:</span>
            <span className="bg-[#f85606] text-white px-1.5 py-0.2 rounded text-[10px] font-mono">{pad(timeLeft.hours)}</span>
            <span>:</span>
            <span className="bg-[#f85606] text-white px-1.5 py-0.2 rounded text-[10px] font-mono">{pad(timeLeft.minutes)}</span>
            <span>:</span>
            <span className="bg-[#f85606] text-white px-1.5 py-0.2 rounded text-[10px] font-mono">{pad(timeLeft.seconds)}</span>
          </div>

          <span className="hidden lg:flex items-center gap-1 text-xs text-slate-500">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% Authentic Guaranteed • 14-Day Free Returns</span>
          </span>
        </div>

        <button 
          onClick={() => {
            const catalogElem = document.getElementById('catalog-section');
            if (catalogElem) catalogElem.scrollIntoView({ behavior: 'smooth' });
          }}
          className="text-xs font-bold text-[#F85606] hover:underline flex items-center cursor-pointer"
        >
          <span>SHOP ALL DEALS</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Sale Products Display Grid (Flash Sale style) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mt-3">
        {saleProducts.map((product) => {
          const retailPrice = product.samplePrice || 25;
          const originalPrice = retailPrice * 1.4;
          const discountPercent = 30;
          const imageSrc = product.images?.[0] || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400';

          return (
            <div
              key={product.id}
              onClick={() => onSelectProduct && onSelectProduct(product.id)}
              className="bg-white rounded-lg border border-slate-200 hover:border-[#f85606] hover:shadow-md transition-all duration-150 p-2.5 flex flex-col justify-between cursor-pointer group"
            >
              {/* Product Image Tile */}
              <div className="relative aspect-square rounded-md overflow-hidden bg-slate-100 mb-2">
                <img
                  src={imageSrc}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  loading="lazy"
                />
                
                {/* Discount Tag */}
                <span className="absolute top-1.5 left-1.5 bg-[#f85606] text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs">
                  -{discountPercent}%
                </span>

                {/* Official Mall Badge */}
                <span className="absolute top-1.5 right-1.5 bg-red-600 text-white text-[8px] font-bold px-1 py-0.2 rounded shadow-xs">
                  MALL
                </span>
              </div>

              {/* Product Info & Pricing */}
              <div>
                <h3 
                  className="text-xs font-medium text-slate-800 line-clamp-2 group-hover:text-[#f85606] transition leading-snug"
                  title={product.title}
                >
                  {product.title}
                </h3>

                <div className="mt-2">
                  <div className="text-xs sm:text-sm font-extrabold text-[#f85606]">
                    {formatPrice(retailPrice)}
                  </div>
                  <div className="text-[10px] text-slate-400 line-through">
                    {formatPrice(originalPrice)}
                  </div>
                  <div className="text-[10px] text-slate-600 font-medium">
                    {formatNPR(retailPrice)}
                  </div>
                </div>

                <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-emerald-700 font-semibold">
                  <span className="flex items-center gap-0.5">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>Authentic</span>
                  </span>
                  <span className="text-slate-400 font-normal">★ {product.rating || 4.9}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
};
