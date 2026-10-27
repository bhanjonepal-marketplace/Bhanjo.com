import React, { useState, useEffect } from 'react';
import { ChevronRight, Sparkles } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

export const TopPicksTrendDiscovery = ({ 
  onSelectProduct, 
  onSelectCategory,
  products = [],
  onOpenTopPicksShowcase
}) => {
  const { formatPrice, language } = useCurrency();

  // Super Deals Live Countdown Timer (matching PDF)
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 59, seconds: 24 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 1, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n) => String(n).padStart(2, '0');

  // The 4 Top Radar items matching the exact PDF design
  const topRadarItems = [
    {
      id: 'tp-1',
      title: 'Bucket Hat',
      fullTitle: 'Vintage Washed Outdoor Bucket Hat',
      badge: 'Highly rated',
      priceNpr: 3,
      usdEquivalent: 0.0225,
      image: '/categories/top_pick_hat_white.jpg',
      category: 'apparel-accessories'
    },
    {
      id: 'tp-2',
      title: 'Digital Scale',
      fullTitle: 'Precision Ultra-Slim Electronic Digital Scale',
      badge: 'In demand',
      priceNpr: 5,
      usdEquivalent: 0.0375,
      image: '/categories/top_pick_scale_white.jpg',
      category: 'consumer-electronics'
    },
    {
      id: 'tp-3',
      title: 'Wireless Earbuds',
      fullTitle: 'Pro True Wireless Bluetooth Earbuds',
      badge: 'Limited Stock',
      priceNpr: 7,
      usdEquivalent: 0.0525,
      image: '/categories/top_pick_earbuds_white.jpg',
      category: 'consumer-electronics'
    },
    {
      id: 'tp-4',
      title: 'Smart Watch',
      fullTitle: 'AMOLED Smart Fitness Health Tracker Watch',
      badge: 'Limited Stock',
      priceNpr: 5,
      usdEquivalent: 0.0375,
      image: '/categories/top_pick_smartwatch_white.jpg',
      category: 'consumer-electronics'
    }
  ];

  const handleItemClick = (item) => {
    if (onSelectProduct) {
      const matched = (products || []).find(p => p.id === item.id) || {
        id: item.id,
        title: item.fullTitle || item.title,
        retailPrice: item.usdEquivalent,
        price: item.priceNpr,
        image: item.image,
        category: item.category || 'all',
        categoryName: item.title,
        rating: 4.9,
        reviewsCount: 142,
        inStock: true
      };
      onSelectProduct(matched);
    }
  };

  return (
    <section className="my-3.5 sm:my-4" id="top-picks-trend-discovery">
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-3.5 sm:p-5 shadow-xs transition-all">
        
        {/* Header Row: Title & Badges on Left, Open Deals button on Right */}
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#E5E7EB] flex-wrap">
          
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
            {/* BHANJO PRIME Pill */}
            <span className="bg-[#1B1F3B] text-[#FFC83D] text-[9.5px] sm:text-[10.5px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-tight shadow-xs flex items-center gap-1">
              <span>👑</span>
              <span>BHANJO PRIME</span>
            </span>

            {/* Top Radar Title */}
            <h3 className="text-base sm:text-lg font-black text-[#1B1F3B] tracking-tight">
              Top Radar
            </h3>

            {/* Prime Deals Countdown Pill */}
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#E11D48]">
              <span className="text-[11.5px] sm:text-xs font-bold text-[#5B6070]">
                Prime Deals
              </span>
              <span className="font-mono font-black text-[11.5px] sm:text-xs text-[#E11D48] bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
                {pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}
              </span>
            </div>
          </div>

          {/* Right Action: Open Deals › Button */}
          <button
            type="button"
            onClick={() => onOpenTopPicksShowcase && onOpenTopPicksShowcase()}
            className="bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs sm:text-[13px] font-black px-3.5 sm:px-4 py-1.5 rounded-full transition-all flex items-center gap-1 cursor-pointer shadow-xs active:scale-95"
            title="Open Prime Deals"
          >
            <span>Open Deals</span>
            <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>

        </div>

        {/* 4 Equal-Width Cards Grid (Matching the PDF) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 mt-3 sm:mt-4">
          {topRadarItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleItemClick(item)}
              className="bg-[#FAFAFB] hover:bg-white rounded-xl p-3 border border-[#E5E7EB] hover:border-[#E11D48] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
            >
              {/* Top Row: Dark Badge */}
              <div className="flex justify-start">
                <span className="bg-[#1B1F3B] text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-md shadow-2xs">
                  {item.badge}
                </span>
              </div>

              {/* Product Image on Clean Background */}
              <div className="aspect-square w-full rounded-lg bg-white overflow-hidden flex items-center justify-center p-2.5 my-2.5 border border-[#F1F3F5] group-hover:scale-102 transition-transform">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>

              {/* Bottom Info: Title & Price */}
              <div className="pt-1">
                <h4 className="text-xs sm:text-[13px] font-bold text-[#1B1F3B] group-hover:text-[#E11D48] transition line-clamp-1">
                  {item.title}
                </h4>
                <div className="mt-1 text-sm sm:text-base font-black text-[#1B1F3B]">
                  Rs. {item.priceNpr.toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
