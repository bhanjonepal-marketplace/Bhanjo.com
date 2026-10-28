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
      badge: 'TRENDING SET',
      socialProof: 'Trendy Picks',
      tag: '# Summer sport series',
      bgCard: 'bg-white border-[#E5E7EB] hover:border-slate-300',
      tagColor: 'text-[#E11D48] hover:text-[#BE123C]',
      categoryId: 'apparel-accessories',
      keyword: 'Retro Streetwear',
      items: [
        {
          id: 'ts-5',
          title: 'Waffle Knit Sweater & Corduroy Trousers Set',
          price: 9.5,
          image: '/categories/retro_modern_fit_1.png'
        },
        {
          id: 'ts-6',
          title: 'Beige Knit Cardigan, Pleated Wool Trousers & Silk Scarf Set',
          price: 10.5,
          image: '/categories/cardigan_wool_trousers_fit.png'
        }
      ]
    },
    {
      id: 'set-loungewear',
      title: '# Mandarin collar cozy wear',
      badge: 'HOT SELLER',
      socialProof: 'Hot Sellers',
      tag: '# Everyday comfort collection',
      bgCard: 'bg-white border-[#E5E7EB] hover:border-slate-300',
      tagColor: 'text-[#E11D48] hover:text-[#BE123C]',
      categoryId: 'apparel-accessories',
      keyword: 'Mandarin Collar',
      items: [
        {
          id: 'ts-7',
          title: 'Premium Sky Blue Linen Mandarin Collar Shirt',
          price: 8.5,
          image: '/categories/mandarin_collar_shirt.png'
        },
        {
          id: 'ts-8',
          title: 'Tropical Botanical Casual Resort Collar Shirt',
          price: 6.2,
          image: '/categories/tropical_casual_shirt.png'
        }
      ]
    },
    {
      id: 'set-shoes',
      title: '# Shoes Worth the Hype',
      badge: 'TOP RATED',
      socialProof: '10K+ positive reviews',
      tag: '# Healing low saturation series',
      bgCard: 'bg-white border-[#E5E7EB] hover:border-slate-300',
      tagColor: 'text-[#E11D48] hover:text-[#BE123C]',
      categoryId: 'shoes-accessories',
      keyword: 'Boots & Sneakers',
      items: [
        {
          id: 'ts-1',
          title: 'TOMS Brown Oiled Leather Chukka Sneaker Boots',
          price: 12.5,
          image: '/categories/brown_leather_chukka_boots.png'
        },
        {
          id: 'ts-2',
          title: 'Olive Canvas Cutout Tie-Accent Ankle Boots',
          price: 9.8,
          image: '/categories/olive_canvas_ankle_boots.png'
        }
      ]
    },
    {
      id: 'set-summer-outfits',
      title: '# Summer Fits & Finds',
      badge: 'POPULAR',
      socialProof: 'Popular Essentials',
      tag: '# Slippers refresh guide',
      bgCard: 'bg-white border-[#E5E7EB] hover:border-slate-300',
      tagColor: 'text-[#E11D48] hover:text-[#BE123C]',
      categoryId: 'apparel-accessories',
      keyword: 'Summer Outfits',
      items: [
        {
          id: 'ts-3',
          title: 'Retro Washed Tee & Cargo Shorts with Leather Slippers Set',
          price: 4.5,
          image: '/categories/summer_shorts_slippers_fit.png'
        },
        {
          id: 'ts-4',
          title: 'Pink Zip Overshirt, Ribbed Tank & Pleated Shorts Set',
          price: 6.8,
          image: '/categories/pink_resort_shorts_fit.png'
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
          className="lg:col-span-5 bg-white border border-[#E5E7EB] hover:border-slate-300 rounded-2xl p-3 sm:p-3.5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between cursor-pointer group/box relative overflow-hidden"
          title="Click to open Bhanjo Prime Showcase"
        >
          {/* Header Row & Products */}
          <div className="relative z-10">
            {/* Header matching Image 1: Left has BHANJO PRIME badge + Top Radar + Prime Deals Countdown; Right has Open Deals */}
            <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[#E5E7EB]">
              
              {/* Left Column: BHANJO PRIME + Top Radar + Prime Deals Countdown Pill */}
              <div className="flex items-center gap-2 flex-wrap min-w-0">
                <span className="bg-[#1B1F3B] text-white text-[9.5px] sm:text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider shadow-2xs leading-none">
                  BHANJO PRIME
                </span>
                <h3 className="text-[15px] sm:text-[16px] font-black text-[#1B1F3B] tracking-tight">
                  Top Radar
                </h3>
                <div className="flex items-center gap-1 border border-rose-200 bg-rose-50/70 text-[#E11D48] text-[10.5px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full shadow-2xs">
                  <span>Prime Deals</span>
                  <span className="font-mono font-black">{pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}</span>
                </div>
              </div>

              {/* Right Column: Scroll Controls & Open Deals Button matching Image 1 */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <div className="flex items-center gap-0.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      scrollLeft();
                    }}
                    className="w-5 h-5 rounded-md bg-white border border-[#E5E7EB] text-slate-700 hover:text-[#E11D48] hover:bg-rose-50/60 shadow-2xs flex items-center justify-center transition cursor-pointer active:scale-95"
                    title="Scroll left"
                  >
                    <ChevronLeft className="w-3 h-3 stroke-[2.5]" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      scrollRight();
                    }}
                    className="w-5 h-5 rounded-md bg-white border border-[#E5E7EB] text-slate-700 hover:text-[#E11D48] hover:bg-rose-50/60 shadow-2xs flex items-center justify-center transition cursor-pointer active:scale-95"
                    title="Scroll right"
                  >
                    <ChevronRight className="w-3 h-3 stroke-[2.5]" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onOpenTopPicksShowcase) onOpenTopPicksShowcase();
                  }}
                  className="bg-[#E11D48] hover:bg-[#BE123C] text-white text-[10.5px] sm:text-[11.5px] font-bold px-3 py-1 rounded-xl shadow-xs transition cursor-pointer flex items-center gap-0.5 active:scale-95"
                  title="Open Deals"
                >
                  <span>Open Deals</span>
                  <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </div>

            </div>

            {/* Side-Scrollable Products Row matching Image 1 */}
            <div 
              ref={scrollRef}
              className="flex items-start gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth snap-x snap-mandatory pt-3 pb-1 px-0.5"
            >
              {topPicks.map((item) => (
                <div
                  key={item.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleItemClick(item);
                  }}
                  className="w-[calc(25%-6px)] min-w-[95px] sm:min-w-[105px] flex-shrink-0 snap-start group flex flex-col cursor-pointer select-none"
                  title={item.title}
                >
                  {/* Container: Light Neutral Grey Box + Attached Black Strip matching Image 1 */}
                  <div className="w-full rounded-xl overflow-hidden bg-[#F1F3F6] border border-transparent group-hover:border-[#E11D48] shadow-2xs transition-all flex flex-col">
                    <div className="aspect-[1.28/1] w-full flex items-center justify-center p-2 relative">
                      <img
                        src={item.image}
                        alt={item.title}
                        loading="lazy"
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Dark Tag Badge Strip attached at the bottom of the grey box */}
                    <div className="bg-[#1B1F3B] text-white text-[8.5px] sm:text-[9px] font-bold py-1 px-1 text-center leading-none uppercase tracking-wide truncate">
                      <span>{item.badge || 'Limited Stock'}</span>
                    </div>
                  </div>

                  {/* Title underneath (centered, bold black) */}
                  <div className="mt-1.5 text-center px-0.5">
                    <h4 className="text-[11px] sm:text-[11.5px] font-bold text-[#1B1F3B] truncate group-hover:text-[#E11D48] transition-colors leading-tight">
                      {item.title}
                    </h4>
                  </div>

                  {/* Price underneath (centered, bold black matching Image 1) */}
                  <div className="mt-0.5 text-center">
                    <span className="text-[12.5px] sm:text-[13.5px] font-black text-[#1B1F3B] tracking-tight">
                      {formatPrice(item.price)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: CURATED TREND SETS (lg:col-span-7)          */}
        {/* Unified with Top Radar Theme: Clean White, Navy & Crimson */}
        {/* ========================================================= */}
        <div className="lg:col-span-7 bg-white border border-[#E5E7EB] hover:border-slate-300 rounded-2xl p-3 sm:p-3.5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between relative">
          <div className="relative group/trend-carousel">
            {/* Left Floating Side Button (mobile) */}
            <button
              type="button"
              onClick={() => scrollTrend('prev')}
              disabled={!canScrollTrendLeft}
              aria-label="Previous trend set"
              className={`absolute left-1.5 top-1/2 -translate-y-1/2 z-30 w-7.5 h-7.5 rounded-full bg-white/95 backdrop-blur-xs text-slate-800 border border-[#E5E7EB] shadow-xs flex items-center justify-center hover:bg-rose-50 hover:text-[#E11D48] transition-all duration-200 active:scale-90 cursor-pointer sm:hidden ${
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
              className={`absolute right-1.5 top-1/2 -translate-y-1/2 z-30 w-7.5 h-7.5 rounded-full bg-white/95 backdrop-blur-xs text-slate-800 border border-[#E5E7EB] shadow-xs flex items-center justify-center hover:bg-rose-50 hover:text-[#E11D48] transition-all duration-200 active:scale-90 cursor-pointer sm:hidden ${
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
                    className={`bg-white border border-[#E5E7EB] hover:border-slate-300 rounded-xl p-2.5 sm:p-3 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between w-full min-w-full sm:min-w-0 sm:w-auto flex-shrink-0 snap-start ${
                      isDesktopVisible ? 'sm:flex' : 'sm:hidden'
                    }`}
                  >
                    <div>
                      {/* Trend Set Header with Hashtag and Top Radar Badge */}
                      <div className="flex items-center justify-between gap-1 select-none">
                        <div
                          onClick={() => onSelectCategory && onSelectCategory(set.categoryId, set.keyword)}
                          className="flex items-center gap-1.5 group/title cursor-pointer min-w-0"
                          title={`Explore ${set.title}`}
                        >
                          <h4 className="text-[14px] sm:text-[14px] font-black text-[#1B1F3B] tracking-tight leading-tight group-hover/title:text-[#E11D48] transition-colors truncate">
                            {set.title}
                          </h4>
                          <ChevronRight className="w-3.5 h-3.5 text-[#1B1F3B] stroke-[2.5] flex-shrink-0 group-hover/title:translate-x-0.5 group-hover/title:text-[#E11D48] transition-all hidden sm:inline-block" />
                        </div>

                        {/* Mobile Header Pagination Controls */}
                        <div
                          className="flex sm:hidden items-center gap-2 flex-shrink-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span className="text-[13px] font-extrabold text-[#1B1F3B] font-mono select-none tracking-tight">
                            {activeMobileTrend + 1}/{trendSets.length}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={handlePrevTrend}
                              className="w-7 h-7 rounded-lg bg-white border border-[#E5E7EB] shadow-2xs flex items-center justify-center text-slate-700 hover:text-[#E11D48] hover:bg-rose-50 active:scale-90 transition cursor-pointer"
                              title="Previous trend set"
                            >
                              <ChevronLeft className="w-4.5 h-4.5 stroke-[2.5]" />
                            </button>
                            <button
                              type="button"
                              onClick={handleNextTrend}
                              className="w-7 h-7 rounded-lg bg-white border border-[#E5E7EB] shadow-2xs flex items-center justify-center text-slate-700 hover:text-[#E11D48] hover:bg-rose-50 active:scale-90 transition cursor-pointer"
                              title="Next trend set"
                            >
                              <ChevronRight className="w-4.5 h-4.5 stroke-[2.5]" />
                            </button>
                          </div>
                        </div>

                        {/* Top Radar Style Pill Badge (Extra Touch) */}
                        <span className="hidden sm:inline-flex bg-[#1B1F3B] text-white text-[8.5px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider shadow-2xs leading-none">
                          {set.badge || 'CURATED'}
                        </span>
                      </div>

                      {/* Social Proof Row: 3 Avatars + Review / Popularity Count */}
                      <div className="flex items-center gap-1.5 mt-1 mb-2.5 sm:mb-2">
                        <div className="flex items-center">
                          <img
                            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                            alt="Buyer"
                            className="w-4 h-4 rounded-full object-cover border border-white shadow-2xs z-30"
                          />
                          <img
                            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                            alt="Buyer"
                            className="-ml-1 w-4 h-4 rounded-full object-cover border border-white shadow-2xs z-20"
                          />
                          <img
                            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
                            alt="Buyer"
                            className="-ml-1 w-4 h-4 rounded-full object-cover border border-white shadow-2xs z-10"
                          />
                        </div>
                        <span className="text-[10.5px] sm:text-[10px] font-bold text-[#5B6070] truncate">
                          {set.socialProof}
                        </span>
                      </div>

                      {/* 2 Photos Side-by-Side: matching Top Radar neutral grey box */}
                      <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                        {set.items.map((it) => (
                          <div
                            key={it.id}
                            onClick={() => handleItemClick(it)}
                            className="group flex flex-col cursor-pointer select-none"
                            title={it.title}
                          >
                            {/* Neutral Grey Rounded Box with mix-blend-multiply matching Top Radar */}
                            <div className="aspect-[1.28/1] sm:aspect-auto sm:h-28 md:h-32 w-full rounded-xl overflow-hidden bg-[#F1F3F6] border border-transparent group-hover:border-[#E11D48] shadow-2xs p-2 transition-all flex items-center justify-center">
                              <img
                                src={it.image}
                                alt={it.title}
                                loading="lazy"
                                className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>

                            {/* Bold Price underneath matching Top Radar (Deep Navy #1B1F3B) */}
                            <div className="mt-1.5 pb-0.5 sm:pb-0">
                              <span className="text-[13px] sm:text-[13.5px] font-black text-[#1B1F3B] tracking-tight group-hover:text-[#E11D48] transition-colors">
                                {formatPrice(it.price)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Hashtag Tag directly below prices */}
                    <div className="hidden sm:flex mt-2 pt-1.5 border-t border-[#E5E7EB] items-center justify-between">
                      <button
                        type="button"
                        onClick={() => onSelectCategory && onSelectCategory(set.categoryId, set.keyword)}
                        className="text-[10.5px] font-bold text-[#E11D48] hover:text-[#BE123C] transition cursor-pointer truncate hover:underline flex items-center gap-0.5"
                      >
                        <span>{set.tag}</span>
                        <ChevronRight className="w-3 h-3 stroke-[2.5]" />
                      </button>

                      {/* Quick cycle arrow button */}
                      <button
                        type="button"
                        onClick={handleNextTrend}
                        className="p-1 rounded-md text-slate-400 hover:text-[#E11D48] hover:bg-rose-50 transition cursor-pointer"
                        title="See more trend sets"
                      >
                        <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

          {/* Side Indicator / Carousel Chevrons for the sets */}
          <div className="hidden sm:flex items-center justify-between mt-2 pt-1.5 border-t border-[#E5E7EB] px-0.5 text-[11px] text-[#5B6070] font-bold">
            <span className="flex items-center gap-1.5 text-[#1B1F3B]">
              <Sparkles className="w-3.5 h-3.5 text-[#E11D48] fill-current" />
              <span>{language === 'ne' ? 'फेसन तथा ट्रेन्डिङ स्टाइल सेटहरू' : 'Curated Streetwear & Lifestyle Sets'}</span>
            </span>
            <div className="flex items-center gap-1.5 ml-auto">
              <span className="text-[11px] font-bold text-[#5B6070] font-mono select-none mr-0.5">
                {trendSetPage + 1}/{totalTrendPages}
              </span>
              <button
                type="button"
                onClick={handlePrevTrend}
                className="w-6 h-6 rounded-md bg-white border border-[#E5E7EB] shadow-2xs flex items-center justify-center text-slate-700 hover:bg-rose-50 hover:text-[#E11D48] hover:border-rose-200 transition cursor-pointer active:scale-95"
                title="Previous trend sets"
              >
                <ChevronLeft className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
              <button
                type="button"
                onClick={handleNextTrend}
                className="w-6 h-6 rounded-md bg-white border border-[#E5E7EB] shadow-2xs flex items-center justify-center text-slate-700 hover:bg-rose-50 hover:text-[#E11D48] hover:border-rose-200 transition cursor-pointer active:scale-95"
                title="Next trend sets"
              >
                <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
