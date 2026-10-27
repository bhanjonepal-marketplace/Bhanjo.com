import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft, Sparkles, Clock, Truck, Gift, Coins, Trophy, Zap } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { RedAlarmClock } from './RedAlarmClock';

export const TopPicksTrendDiscovery = ({ 
  onSelectProduct, 
  onSelectCategory,
  products = [],
  onScrollToFlashSale,
  onFilterFreeDelivery,
  onOpenVouchers,
  onFilterBudget,
  onFilterBestSellers,
  onOpenTopPicksShowcase
}) => {
  const { formatPrice, formatNPR, language } = useCurrency();
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -240, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 240, behavior: 'smooth' });
    }
  };

  // Super Deals Live Countdown Timer (matching image 4)
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 53, seconds: 28 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 2, minutes: 45, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n) => String(n).padStart(2, '0');

  // 1. TOP PICKS items with clean white-background product photography
  const topPicks = [
    {
      id: 'tp-1',
      title: 'Vintage Washed Outdoor Bucket Hat',
      badge: 'Highly rated',
      badgeColor: 'bg-[#C26227] text-white',
      price: 2.8,
      image: '/categories/top_pick_hat_white.jpg',
      category: 'apparel-accessories',
      keyword: 'Hat'
    },
    {
      id: 'tp-2',
      title: 'Precision Ultra-Slim Electronic Digital Scale',
      badge: 'In demand',
      badgeColor: 'bg-[#B45309] text-white',
      price: 4.8,
      image: '/categories/top_pick_scale_white.jpg',
      category: 'consumer-electronics',
      keyword: 'Scale'
    },
    {
      id: 'tp-3',
      title: 'Pro True Wireless Bluetooth Earbuds',
      badge: 'Limited Stock',
      badgeColor: 'bg-[#EA580C] text-white',
      price: 6.5,
      image: '/categories/top_pick_earbuds_white.jpg',
      category: 'consumer-electronics',
      keyword: 'Earbuds'
    },
    {
      id: 'tp-4',
      title: 'AMOLED Smart Fitness Health Tracker Watch',
      badge: 'Limited Stock',
      badgeColor: 'bg-[#EA580C] text-white',
      price: 5.2,
      image: '/categories/top_pick_smartwatch_white.jpg',
      category: 'consumer-electronics',
      keyword: 'Smartwatch'
    },
    {
      id: 'tp-5',
      title: 'Aura Minimalist Stainless Chronograph Watch',
      badge: 'Top Choice',
      badgeColor: 'bg-[#D97706] text-white',
      price: 10.5,
      image: '/categories/top_pick_watch_white.jpg',
      category: 'jewelry-eyewear-watches',
      keyword: 'Watch'
    },
    {
      id: 'tp-6',
      title: 'Polarized Retro Square Tint Sunglasses',
      badge: 'Super Deal',
      badgeColor: 'bg-[#B45309] text-white',
      price: 3.2,
      image: '/categories/top_pick_sunglasses_white.jpg',
      category: 'jewelry-eyewear-watches',
      keyword: 'Sunglasses'
    },
    {
      id: 'tp-7',
      title: 'Wild Himalayan Pure Canvas Minimal Crossbody',
      badge: 'Bestseller',
      badgeColor: 'bg-[#EA580C] text-white',
      price: 9.2,
      image: '/categories/top_pick_bag_white.jpg',
      category: 'luggage-bags-cases',
      keyword: 'Bags'
    },
    {
      id: 'tp-8',
      title: 'Breathable Knit Performance Everyday Sneaker',
      badge: 'Hot Pick',
      badgeColor: 'bg-[#C26227] text-white',
      price: 14.0,
      image: '/categories/top_pick_sneaker_white.jpg',
      category: 'shoes-accessories',
      keyword: 'Sneakers'
    }
  ];

  // 2. CURATED TREND SETS (matching images 4 & 5)
  const trendSets = [
    {
      id: 'set-retro-denim',
      title: '# Retro modern street',
      socialProof: 'Trendy Picks',
      tag: '# Summer sport series',
      bgCard: 'bg-[#FFFDF2] border-[#FCEECB]',
      tagColor: 'text-amber-800 hover:text-amber-900',
      categoryId: 'apparel-accessories',
      keyword: 'Retro Streetwear',
      items: [
        {
          id: 'ts-5',
          title: 'Waffle Knit Sweater & Corduroy Trousers Set',
          price: 9.5,
          image: '/categories/retro_modern_fit_1.jpg?v=pure_original_ai'
        },
        {
          id: 'ts-6',
          title: 'Beige Knit Cardigan, Pleated Wool Trousers & Silk Scarf Set',
          price: 10.5,
          image: '/categories/cardigan_wool_trousers_fit.jpg?v=women_chic_v1'
        }
      ]
    },
    {
      id: 'set-loungewear',
      title: '# Mandarin collar cozy wear',
      socialProof: 'Hot Sellers',
      tag: '# Everyday comfort collection',
      bgCard: 'bg-[#FFFDF4] border-[#FDEBCB]',
      tagColor: 'text-amber-800 hover:text-amber-900',
      categoryId: 'apparel-accessories',
      keyword: 'Mandarin Collar',
      items: [
        {
          id: 'ts-7',
          title: 'Premium Sky Blue Linen Mandarin Collar Shirt',
          price: 8.5,
          image: '/categories/mandarin_collar_shirt.jpg?v=ai_gen'
        },
        {
          id: 'ts-8',
          title: 'Tropical Botanical Casual Resort Collar Shirt',
          price: 6.2,
          image: '/categories/tropical_casual_shirt.jpg?v=ai_gen'
        }
      ]
    },
    {
      id: 'set-shoes',
      title: '# Shoes Worth the Hype',
      socialProof: '10K+ positive reviews',
      tag: '# Healing low saturation series',
      bgCard: 'bg-[#F0FAF5] border-[#D5EFE3]',
      tagColor: 'text-emerald-700 hover:text-emerald-800',
      categoryId: 'shoes-accessories',
      keyword: 'Boots & Sneakers',
      items: [
        {
          id: 'ts-1',
          title: 'TOMS Brown Oiled Leather Chukka Sneaker Boots',
          price: 12.5,
          image: '/categories/brown_leather_chukka_boots.jpg?v=restored_original'
        },
        {
          id: 'ts-2',
          title: 'Olive Canvas Cutout Tie-Accent Ankle Boots',
          price: 9.8,
          image: '/categories/olive_canvas_ankle_boots.jpg?v=ai_gen'
        }
      ]
    },
    {
      id: 'set-summer-outfits',
      title: '# Summer Fits & Finds',
      socialProof: 'Popular Essentials',
      tag: '# Slippers refresh guide',
      bgCard: 'bg-[#F2FAF6] border-[#D7EFE4]',
      tagColor: 'text-emerald-700 hover:text-emerald-800',
      categoryId: 'apparel-accessories',
      keyword: 'Summer Outfits',
      items: [
        {
          id: 'ts-3',
          title: 'Retro Washed Tee & Cargo Shorts with Leather Slippers Set',
          price: 4.5,
          image: '/categories/summer_shorts_slippers_fit.jpg?v=ai_gen'
        },
        {
          id: 'ts-4',
          title: 'Pink Zip Overshirt, Ribbed Tank & Pleated Shorts Set',
          price: 6.8,
          image: '/categories/pink_resort_shorts_fit.jpg?v=ai_gen'
        }
      ]
    }
  ];



  // Trend sets pagination: 2 cards at a time on desktop
  const [trendSetPage, setTrendSetPage] = useState(0);
  const totalTrendPages = Math.ceil(trendSets.length / 2);
  const currentTrendSets = trendSets.slice(trendSetPage * 2, trendSetPage * 2 + 2);

  const trendScrollRef = useRef(null);
  const [activeMobileTrend, setActiveMobileTrend] = useState(0);
  const [canScrollTrendLeft, setCanScrollTrendLeft] = useState(false);
  const [canScrollTrendRight, setCanScrollTrendRight] = useState(true);

  const handleTrendScroll = () => {
    if (trendScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = trendScrollRef.current;
      const cards = trendScrollRef.current.children;
      if (cards && cards.length > 0) {
        let closestIndex = 0;
        let minDiff = Infinity;
        for (let i = 0; i < cards.length; i++) {
          const diff = Math.abs(cards[i].offsetLeft - scrollLeft);
          if (diff < minDiff) {
            minDiff = diff;
            closestIndex = i;
          }
        }
        setActiveMobileTrend(closestIndex);
      } else {
        const index = Math.round(scrollLeft / (clientWidth || 1));
        setActiveMobileTrend(Math.min(trendSets.length - 1, Math.max(0, index)));
      }
      setCanScrollTrendLeft(scrollLeft > 10);
      setCanScrollTrendRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scrollTrend = (direction) => {
    if (trendScrollRef.current) {
      const container = trendScrollRef.current;
      const cards = container.children;
      let nextIndex = activeMobileTrend;
      if (direction === 'next') {
        nextIndex = activeMobileTrend + 1;
        if (nextIndex >= trendSets.length) nextIndex = 0;
      } else {
        nextIndex = activeMobileTrend - 1;
        if (nextIndex < 0) nextIndex = trendSets.length - 1;
      }
      if (cards && cards[nextIndex]) {
        container.scrollTo({ left: cards[nextIndex].offsetLeft, behavior: 'smooth' });
      } else {
        const step = container.clientWidth;
        container.scrollBy({ left: direction === 'next' ? step : -step, behavior: 'smooth' });
      }
    }
  };

  const handleNextTrend = () => {
    if (trendScrollRef.current && typeof window !== 'undefined' && window.innerWidth < 640) {
      scrollTrend('next');
    } else {
      setTrendSetPage((prev) => (prev + 1) % totalTrendPages);
    }
  };

  const handlePrevTrend = () => {
    if (trendScrollRef.current && typeof window !== 'undefined' && window.innerWidth < 640) {
      scrollTrend('prev');
    } else {
      setTrendSetPage((prev) => (prev - 1 + totalTrendPages) % totalTrendPages);
    }
  };

  const handleItemClick = (item) => {
    if (onSelectProduct) {
      // Find matching product in catalog or construct one
      const matched = products.find(p => p.id === item.id) || {
        id: item.id,
        title: item.title,
        retailPrice: item.price,
        image: item.image,
        category: item.category || 'all',
        categoryName: item.keyword || 'Trending Deal',
        rating: 4.9,
        reviewsCount: 120,
        inStock: true
      };
      onSelectProduct(matched);
    }
  };

  return (
    <section className="my-2.5 sm:my-3" id="top-picks-trend-discovery">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 sm:gap-3 items-stretch">
        
        {/* ========================================================= */}
        {/* LEFT COLUMN: TOP PICKS & SUPER DEALS (lg:col-span-5)     */}
        {/* ========================================================= */}
        {/* LEFT COLUMN: BHANJO PRIME TOP RADAR (lg:col-span-5)       */}
        {/* Unified with Phone version; larger product photos to match*/}
        {/* Retro modern fit sizing; constrained neat 3D mascot badge */}
        {/* ========================================================= */}
        <div 
          onClick={() => onOpenTopPicksShowcase && onOpenTopPicksShowcase()}
          className="lg:col-span-5 bg-gradient-to-br from-[#FFF5F7] via-[#FAFAFB] to-[#FFFFFF] border border-[#E5E7EB] ring-1 ring-rose-100/60 rounded-2xl p-2.5 sm:p-3 shadow-xs hover:shadow-md transition-all flex flex-col justify-between cursor-pointer group/box relative overflow-hidden"
          title="Click to open Bhanjo Prime Showcase"
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute -right-8 -top-8 w-40 h-40 bg-rose-200/25 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -left-6 bottom-0 w-32 h-32 bg-amber-100/20 rounded-full blur-2xl pointer-events-none" />

          {/* Header Row & Products */}
          <div className="relative z-10">
            <div className="flex items-center justify-between gap-1 pb-1.5 border-b border-[#E5E7EB]">
              
              {/* Left Column: Title (Row 1) + Countdown & Controls (Row 2 on mobile, flex on laptop) */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 min-w-0 flex-1">
                {/* Title & Badge */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="bg-[#1B1F3B] text-[#FFC83D] text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tight shadow-xs flex-shrink-0 flex items-center gap-1">
                    <span>👑</span>
                    <span>BHANJO PRIME</span>
                  </span>
                  <h3 className="text-[15px] sm:text-[16px] font-black text-[#1B1F3B] tracking-tight transition-colors">
                    Top Radar
                  </h3>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onOpenTopPicksShowcase) onOpenTopPicksShowcase();
                    }}
                    className="text-[11px] text-[#E11D48] hover:text-[#BE123C] font-bold flex items-center transition cursor-pointer"
                    title="Explore Bhanjo Prime Showcase"
                  >
                    <span>Curated</span>
                    <ChevronRight className="w-3 h-3 stroke-[2.5]" />
                  </button>
                </div>

                {/* Prime Deals & Live Countdown (Gold badge with Midnight Navy text as per theme chart) */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onOpenTopPicksShowcase) onOpenTopPicksShowcase();
                    }}
                    className="flex items-center gap-1 bg-[#FFC83D] hover:bg-[#F6BE2F] border border-[#F0B820] text-[#1B1F3B] px-2.5 py-0.5 rounded-full transition cursor-pointer shadow-xs"
                    title="Open Prime Deals"
                  >
                    <span className="text-[11px] sm:text-xs font-black text-[#1B1F3B]">
                      Prime Deals
                    </span>
                    <span className="text-[11px] sm:text-xs font-black text-[#1B1F3B] font-mono flex items-center">
                      <span>{pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}</span>
                    </span>
                  </button>

                  {/* Side-Scroll Left/Right Controls */}
                  <div className="flex items-center gap-0.5 ml-0.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        scrollLeft();
                      }}
                      className="w-4.5 h-4.5 rounded bg-white border border-[#E5E7EB] text-slate-700 hover:text-[#E11D48] hover:bg-rose-50/60 shadow-2xs flex items-center justify-center transition cursor-pointer active:scale-95"
                      title="Scroll left"
                    >
                      <ChevronLeft className="w-2.5 h-2.5 stroke-[2.5]" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        scrollRight();
                      }}
                      className="w-4.5 h-4.5 rounded bg-white border border-[#E5E7EB] text-slate-700 hover:text-[#E11D48] hover:bg-rose-50/60 shadow-2xs flex items-center justify-center transition cursor-pointer active:scale-95"
                      title="Scroll right"
                    >
                      <ChevronRight className="w-2.5 h-2.5 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: 3D Mascot Header Icon */}
              <div className="flex-shrink-0 self-center lg:self-end flex items-center justify-end pl-1 sm:pl-2 lg:-mb-2.5">
                <img
                  src="/mascot/bhanjo_mascot_3d_clean.png?v=3"
                  alt="Bhanjo Prime Mascot"
                  className="w-[46px] h-[52px] sm:w-[50px] sm:h-[56px] lg:w-[72px] lg:h-[80px] max-w-[46px] sm:max-w-[50px] lg:max-w-[72px] max-h-[52px] sm:max-h-[56px] lg:max-h-[80px] object-contain drop-shadow-[0_8px_16px_rgba(27,31,59,0.14)] -my-2 lg:-my-1 flex-shrink-0 hover:scale-105 active:rotate-3 transition-transform cursor-pointer"
                  title="Bhanjo Prime Mascot"
                />
              </div>

            </div>

            {/* Side-Scrollable Products Row */}
            <div 
              ref={scrollRef}
              className="flex items-start gap-2.5 sm:gap-3 overflow-x-auto no-scrollbar [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth snap-x snap-mandatory py-2 px-0.5 lg:mt-3.5 lg:pt-1"
            >
              {topPicks.map((item) => (
                <div
                  key={item.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleItemClick(item);
                  }}
                  className="w-[108px] sm:w-[116px] md:w-[124px] flex-shrink-0 snap-start group flex flex-col cursor-pointer select-none"
                  title={item.title}
                >
                  {/* Square Image Box */}
                  <div className="aspect-square w-full rounded-xl overflow-hidden bg-white border border-[#E5E7EB] group-hover:border-[#E11D48] shadow-2xs relative flex items-center justify-center p-2 transition-all">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-contain rounded-lg group-hover:scale-105 transition-transform duration-300 bg-white"
                    />

                    {/* Tag Badge on Bottom of Image (Midnight Navy with clean white text) */}
                    <div className="absolute bottom-1 left-1 right-1">
                      <div className="bg-[#1B1F3B] text-white text-[8.5px] sm:text-[9px] font-black py-0.5 px-1 rounded-xs text-center shadow-xs leading-none truncate">
                        <span>{item.badge}</span>
                      </div>
                    </div>
                  </div>

                  {/* Price Tag underneath (Crimson) */}
                  <div className="mt-1.5 text-center">
                    <span className="text-[12.5px] sm:text-[13px] font-black text-[#E11D48] tracking-tight">
                      {formatPrice(item.price)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Bar: Interactive Link */}
          <div 
            onClick={(e) => {
              e.stopPropagation();
              if (onOpenTopPicksShowcase) onOpenTopPicksShowcase();
            }}
            className="mt-1.5 pt-1.5 border-t border-[#E5E7EB] flex items-center justify-between text-[10.5px] font-bold text-slate-700 transition-colors relative z-10"
          >
            <span className="flex items-center gap-1 font-black text-[#1B1F3B]">
              <Sparkles className="w-3 h-3 text-[#E11D48]" />
              <span>Bhanjo Prime Showcase</span>
            </span>
            <span className="flex items-center gap-0.5 bg-[#E11D48] hover:bg-[#BE123C] text-white px-2.5 py-0.5 rounded-full text-[9.5px] font-black shadow-xs transition-colors">
              <span>Open Deals</span>
              <ChevronRight className="w-2.5 h-2.5 stroke-[2.5]" />
            </span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: CURATED TREND SETS (lg:col-span-7)          */}
        {/* Standalone White Box (Independent from Top Picks pink box)*/}
        {/* ========================================================= */}
        <div className="lg:col-span-7 bg-white border border-slate-200/90 hover:border-slate-300 rounded-2xl p-2.5 sm:p-3 shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative">
          <div className="relative group/trend-carousel">
            {/* Left Floating Side Button (mobile) */}
            <button
              type="button"
              onClick={() => scrollTrend('prev')}
              disabled={!canScrollTrendLeft}
              aria-label="Previous trend set"
              className={`absolute left-1.5 top-1/2 -translate-y-1/2 z-30 w-7.5 h-7.5 rounded-full bg-white/95 backdrop-blur-xs text-slate-800 border border-slate-200/90 shadow-[0_3px_12px_rgba(0,0,0,0.18)] flex items-center justify-center hover:bg-orange-50 hover:text-[#F85606] transition-all duration-200 active:scale-90 cursor-pointer sm:hidden ${
                canScrollTrendLeft ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-75 pointer-events-none'
              }`}
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
            </button>

            {/* Right Floating Side Button (mobile) */}
            <button
              type="button"
              onClick={() => scrollTrend('next')}
              disabled={!canScrollTrendRight}
              aria-label="Next trend set"
              className={`absolute right-1.5 top-1/2 -translate-y-1/2 z-30 w-7.5 h-7.5 rounded-full bg-white/95 backdrop-blur-xs text-slate-800 border border-slate-200/90 shadow-[0_3px_12px_rgba(0,0,0,0.18)] flex items-center justify-center hover:bg-orange-50 hover:text-[#F85606] transition-all duration-200 active:scale-90 cursor-pointer sm:hidden ${
                canScrollTrendRight ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-75 pointer-events-none'
              }`}
            >
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>

            {/* Scrollable Trend Sets Container (Mobile: Horizontal Scroll, Desktop: 2-column Grid) */}
            <div 
              ref={trendScrollRef}
              onScroll={handleTrendScroll}
              className="flex sm:grid sm:grid-cols-2 gap-2 sm:gap-2.5 overflow-x-auto sm:overflow-visible no-scrollbar snap-x snap-mandatory scroll-smooth pb-0.5"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {trendSets.map((set, index) => {
                const isDesktopVisible = index >= trendSetPage * 2 && index < trendSetPage * 2 + 2;
                return (
                  <div
                    key={set.id}
                    className={`${set.bgCard} border rounded-xl p-2.5 sm:p-2.5 pb-2.5 sm:pb-2 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between w-full min-w-full sm:min-w-0 sm:w-auto flex-shrink-0 snap-start ${
                      isDesktopVisible ? 'sm:flex' : 'sm:hidden'
                    }`}
                  >
                    <div>
                      {/* Trend Set Header with Hashtag and Controls */}
                      <div className="flex items-center justify-between gap-1 select-none">
                        <div
                          onClick={() => onSelectCategory && onSelectCategory(set.categoryId, set.keyword)}
                          className="flex items-center gap-1 group/title cursor-pointer min-w-0"
                          title={`Explore ${set.title}`}
                        >
                          <h4 className="text-[15px] sm:text-[13.5px] font-black text-slate-900 tracking-tight leading-tight group-hover/title:text-[#F85606] transition-colors truncate">
                            {set.title}
                          </h4>
                        </div>

                        {/* Mobile Header Pagination Controls (Moved from bottom per user request) */}
                        <div
                          className="flex sm:hidden items-center gap-2 flex-shrink-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span className="text-[13px] font-extrabold text-slate-600 font-mono select-none tracking-tight">
                            {activeMobileTrend + 1}/{trendSets.length}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={handlePrevTrend}
                              className="w-7 h-7 rounded-lg bg-white border border-slate-200 shadow-2xs flex items-center justify-center text-slate-700 hover:text-[#F85606] hover:bg-orange-50 active:scale-90 transition cursor-pointer"
                              title="Previous trend set"
                            >
                              <ChevronLeft className="w-4.5 h-4.5 stroke-[2.5]" />
                            </button>
                            <button
                              type="button"
                              onClick={handleNextTrend}
                              className="w-7 h-7 rounded-lg bg-white border border-slate-200 shadow-2xs flex items-center justify-center text-slate-700 hover:text-[#F85606] hover:bg-orange-50 active:scale-90 transition cursor-pointer"
                              title="Next trend set"
                            >
                              <ChevronRight className="w-4.5 h-4.5 stroke-[2.5]" />
                            </button>
                          </div>
                        </div>

                        {/* Desktop Right Chevron */}
                        <button
                          type="button"
                          onClick={() => onSelectCategory && onSelectCategory(set.categoryId, set.keyword)}
                          className="hidden sm:inline-flex p-0.5 text-slate-800 hover:text-[#F85606] transition"
                          title={`Explore ${set.title}`}
                        >
                          <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                        </button>
                      </div>

                      {/* Social Proof Row: 3 Avatars + Review / Popularity Count */}
                      <div className="flex items-center gap-1.5 mt-0.5 mb-2 sm:mb-1.5">
                        <div className="flex items-center">
                          <img
                            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                            alt="Buyer"
                            className="w-4 h-4 sm:w-4 sm:h-4 rounded-full object-cover border border-white shadow-2xs z-30"
                          />
                          <img
                            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                            alt="Buyer"
                            className="-ml-1 w-4 h-4 sm:w-4 sm:h-4 rounded-full object-cover border border-white shadow-2xs z-20"
                          />
                          <img
                            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
                            alt="Buyer"
                            className="-ml-1 w-4 h-4 sm:w-4 sm:h-4 rounded-full object-cover border border-white shadow-2xs z-10"
                          />
                        </div>
                        <span className="text-[11px] sm:text-[10px] font-bold text-slate-700 truncate">
                          {set.socialProof}
                        </span>
                      </div>

                      {/* 2 Photos Side-by-Side with Bold Price tags below */}
                      <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                        {set.items.map((it) => (
                          <div
                            key={it.id}
                            onClick={() => handleItemClick(it)}
                            className="group flex flex-col cursor-pointer select-none"
                            title={it.title}
                          >
                            {/* Larger, prominent photo container */}
                            <div className="aspect-square sm:aspect-auto sm:h-28 md:h-32 w-full rounded-xl overflow-hidden bg-white border border-slate-200/80 shadow-2xs p-1.5 group-hover:border-[#F85606] transition-all flex items-center justify-center">
                              <img
                                src={it.image}
                                alt={it.title}
                                loading="lazy"
                                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>

                            {/* Bold Price underneath */}
                            <div className="mt-1.5 pb-0.5 sm:pb-0">
                              <span className="text-[13.5px] sm:text-xs font-black text-[#F85606] tracking-tight group-hover:underline">
                                {formatPrice(it.price)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Hashtag Tag directly below prices (Hidden on mobile per user request, visible on laptop) */}
                    <div className="hidden sm:flex mt-1.5 pt-1 border-t border-slate-200/50 items-center justify-between">
                      <button
                        type="button"
                        onClick={() => onSelectCategory && onSelectCategory(set.categoryId, set.keyword)}
                        className={`text-[10px] sm:text-[10.5px] font-extrabold ${set.tagColor} transition cursor-pointer truncate hover:underline`}
                      >
                        {set.tag}
                      </button>

                      {/* Quick cycle arrow button */}
                      <button
                        type="button"
                        onClick={handleNextTrend}
                        className="p-0.5 rounded text-slate-400 hover:text-slate-700 hover:bg-black/5 transition cursor-pointer"
                        title="See more trend sets"
                      >
                        <ChevronRight className="w-3 h-3 stroke-[2.5]" />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

          {/* Side Indicator / Carousel Chevrons for the sets (Laptop only, moved to header on mobile) */}
          <div className="hidden sm:flex items-center justify-between mt-1.5 px-0.5 text-[10px] text-slate-500 font-medium">
            <span>
              ✨ {language === 'ne' ? 'फेसन तथा ट्रेन्डिङ स्टाइल सेटहरू' : 'Curated Streetwear & Lifestyle Sets'}
            </span>
            <div className="flex items-center gap-1.5 ml-auto">
              <span className="text-[11px] sm:text-xs font-semibold text-slate-500 font-mono select-none mr-0.5">
                {trendSetPage + 1}/{totalTrendPages}
              </span>
              <button
                type="button"
                onClick={handlePrevTrend}
                className="w-6 h-6 sm:w-6.5 sm:h-6.5 rounded-md bg-white border border-slate-200/90 shadow-xs flex items-center justify-center text-slate-700 hover:bg-orange-50 hover:text-[#F85606] hover:border-orange-200 transition cursor-pointer active:scale-95"
                title="Previous trend sets"
              >
                <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
              </button>
              <button
                type="button"
                onClick={handleNextTrend}
                className="w-6 h-6 sm:w-6.5 sm:h-6.5 rounded-md bg-white border border-slate-200/90 shadow-xs flex items-center justify-center text-slate-700 hover:bg-orange-50 hover:text-[#F85606] hover:border-orange-200 transition cursor-pointer active:scale-95"
                title="Next trend sets"
              >
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
