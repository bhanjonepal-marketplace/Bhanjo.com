import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, ChevronRight, Sparkles, Clock, ShieldCheck, 
  Tag, ShoppingBag, CheckCircle2, Flame, Gift, Star, 
  Layers, Percent, Truck, RotateCcw, Heart, Search, Zap
} from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { useCart } from '../context/CartContext';
import confetti from 'canvas-confetti';

export const TopPicksShowcasePage = ({ 
  onBack, 
  onSelectProduct, 
  products = [] 
}) => {
  const { formatPrice, language } = useCurrency();
  const { addToCart } = useCart();

  // Active Category Filter Tab
  const [activeTab, setActiveTab] = useState('all');
  const [claimedVouchers, setClaimedVouchers] = useState(new Set());
  const [searchFilter, setSearchFilter] = useState('');
  const [justAddedId, setJustAddedId] = useState(null);
  // Apple Minimal Sky Blue theme by default (with instant toggle)
  const [theme, setTheme] = useState('sky'); // 'sky' | 'warm'

  // Live countdown timer (refreshes live)
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 59, seconds: 14 });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 3, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n) => String(n).padStart(2, '0');

  // Platform Subsidy Vouchers (matching "Platform Subsidy Vouchers" in reference)
  const subsidyVouchers = [
    {
      id: 'sub-apparel',
      title: 'Apparel Subsidy',
      amount: 'Rs. 100',
      minSpend: 'Spend Rs. 400',
      tag: 'Fashion Deal',
      icon: '👗',
      claimedText: 'Claimed ✓'
    },
    {
      id: 'sub-toys',
      title: 'Toys & Gifts',
      amount: 'Rs. 25',
      minSpend: 'Spend Rs. 150',
      tag: 'Kids & Play',
      icon: '🎁',
      claimedText: 'Claimed ✓'
    },
    {
      id: 'sub-electronics',
      title: 'Digital & Tech',
      amount: 'Rs. 97',
      minSpend: 'Spend Rs. 500',
      tag: 'Top Gadgets',
      icon: '📱',
      claimedText: 'Claimed ✓'
    },
    {
      id: 'sub-food',
      title: 'Snacks & Pantry',
      amount: 'Rs. 60',
      minSpend: 'Spend Rs. 250',
      tag: 'Pantry Fresh',
      icon: '🥫',
      claimedText: 'Claimed ✓'
    },
    {
      id: 'sub-sports',
      title: 'Sports & Active',
      amount: 'Rs. 40',
      minSpend: 'Spend Rs. 200',
      tag: 'Fitness',
      icon: '🏃',
      claimedText: 'Claimed ✓'
    }
  ];

  const handleClaimVoucher = (v) => {
    if (claimedVouchers.has(v.id)) return;
    setClaimedVouchers(prev => new Set([...prev, v.id]));
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.3 },
        colors: ['#FF5000', '#FF7A00', '#FFA040', '#FFD700', '#FFFFFF']
      });
    } catch (e) {}
  };

  // Curated Quick Pill Shortcuts
  const quickPills = [
    { id: 'big-vouchers', title: 'Rs. 20 Mega Vouchers', icon: '🎟️', badge: 'High Value' },
    { id: 'ranking', title: 'Live Trending List', icon: '🔥', badge: 'Popular' },
    { id: 'shopping-guide', title: 'Curated Buyer Guide', icon: '📋', badge: 'Verified' },
    { id: 'fashion-refresh', title: 'Seasonal Refresh', icon: '✨', badge: 'New Drops' },
    { id: 'super-drops', title: 'Super New Arrivals', icon: '⚡', badge: '0-Price Samples' },
    { id: 'easy-installments', title: '0% EMI Installments', icon: '💳', badge: 'Interest Free' }
  ];

  // Category filter tabs in clean English format
  const categoryTabs = [
    { id: 'all', label: 'All Curated' },
    { id: 'super-discount', label: '70% Off Subsidies' },
    { id: 'seasonal', label: 'Seasonal Trends' },
    { id: 'viral', label: 'Viral Super Hits' },
    { id: 'electronics', label: 'Tech & Gadgets' },
    { id: 'fashion', label: 'Fashion & Apparel' },
    { id: 'beauty', label: 'Skincare & Beauty' },
    { id: 'home', label: 'Home & Living' },
    { id: 'sports', label: 'Sports & Active' }
  ];

  // Curated items list matching the showcase grid in clean English format
  const showcaseItems = [
    {
      id: 'tp-sc-1',
      title: 'Flagship Edition Pro Smartphone 256GB with Ultra-OLED Display',
      category: 'electronics',
      badge: 'Bhanjo Prime • Mega Deal',
      price: 1890.0,
      originalPrice: 2450.0,
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80',
      sales: '24h Sold 200+',
      guarantees: ['7-Day Price Match', 'Direct Factory', 'Free Return'],
      highlight: 'Top Seller in Mobile Devices'
    },
    {
      id: 'tp-sc-2',
      title: 'Deep Hydration Hyaluronic Acid Glow Repair Emulsion (Water Cream)',
      category: 'beauty',
      badge: 'Bhanjo Prime • Hot Deal',
      price: 522.0,
      originalPrice: 780.0,
      image: 'https://images.unsplash.com/photo-1608248597359-00508544a046?auto=format&fit=crop&w=600&q=80',
      sales: '12K+ Positive Reviews',
      guarantees: ['Authentic Formula', 'Dermatologist Tested', '7-Day Return'],
      highlight: 'Moisturizing & Barrier Repair'
    },
    {
      id: 'tp-sc-3',
      title: 'Retro Instant Print Kid Camera with Selfie Dual Lens & Photo Paper',
      category: 'viral',
      badge: 'Bhanjo Prime • Viral Hit',
      price: 318.0,
      originalPrice: 480.0,
      image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80',
      sales: '5,000+ Gift Sets Sold',
      guarantees: ['Cute Protective Shell', 'Instant Print Tech', 'Free Shipping'],
      highlight: 'Best Gift for Kids & Teens'
    },
    {
      id: 'tp-sc-4',
      title: 'Smart Heated Cervical Neck & Shoulder Massager H5 Relaxation Device',
      category: 'electronics',
      badge: 'Bhanjo Prime • Wellness',
      price: 600.0,
      originalPrice: 920.0,
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80',
      sales: '24h Sold 700+ Units',
      guarantees: ['Constant Heat Temp', 'Ergonomic 4-Node', '1-Year Warranty'],
      highlight: 'Instant Muscle Relief'
    },
    {
      id: 'tp-sc-5',
      title: 'Vintage American Streetwear Loose Varsity Biker Jacket Unisex',
      category: 'fashion',
      badge: 'Bhanjo Prime • Streetwear',
      price: 150.0,
      originalPrice: 280.0,
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80',
      sales: '8,400+ Young Buyers',
      guarantees: ['Heavyweight Cotton', 'Oversized Fit', 'True to Size'],
      highlight: 'Autumn & Winter Essential'
    },
    {
      id: 'tp-sc-6',
      title: 'Handcrafted Imperial Grade Spring Dragon Well Green Tea (Longjing)',
      category: 'seasonal',
      badge: 'Bhanjo Prime • Fresh Harvest',
      price: 168.0,
      originalPrice: 260.0,
      image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
      sales: 'Award-Winning Artisan Pick',
      guarantees: ['First Spring Picking', 'Sealed Tin Canister', 'Pure Aroma'],
      highlight: 'Artisanal Green Tea'
    },
    {
      id: 'tp-sc-7',
      title: 'Ultra-Light Breathable Cloud Running Shoes with Shock Absorbing Cushion',
      category: 'sports',
      badge: 'Bhanjo Prime • Performance',
      price: 490.0,
      originalPrice: 750.0,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
      sales: '18K+ Runners Trust',
      guarantees: ['High Rebound Midsole', 'Anti-Slip Rubber', 'All-Day Comfort'],
      highlight: 'Everyday Jogging & Training'
    },
    {
      id: 'tp-sc-8',
      title: 'Fitness Smartband 11 Pro with AMOLED Color Display & Sleep Tracking',
      category: 'electronics',
      badge: 'Bhanjo Prime • Smart Tech',
      price: 340.0,
      originalPrice: 520.0,
      image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=600&q=80',
      sales: '400+ Reviews in 48h',
      guarantees: ['Heart Rate Monitor', '14-Day Battery', '5ATM Waterproof'],
      highlight: 'All-Day Activity Tracking'
    },
    {
      id: 'tp-sc-9',
      title: '100% Pure Himalayan Wild Hemp Trekking Backpack with Laptop Pocket',
      category: 'fashion',
      badge: 'Bhanjo Prime • Nepal Pride',
      price: 1280.0,
      originalPrice: 1800.0,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
      sales: 'Kathmandu Artisan Direct',
      soldPercent: 55,
      guarantees: ['Eco-Friendly Hemp', 'YKK Zippers', 'Lifetime Craftsmanship'],
      highlight: 'Direct from Pokhara & Kathmandu'
    },
    {
      id: 'tp-sc-10',
      title: 'Ergonomic Mechanical Wireless Gaming Keyboard RGB Backlit',
      category: 'electronics',
      badge: 'Bhanjo Prime • Top Choice',
      price: 240.0,
      originalPrice: 420.0,
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80',
      sales: '15K+ Sold Across Nepal',
      soldPercent: 62,
      guarantees: ['Hot-Swappable', 'Bluetooth 5.3', 'Long Battery'],
      highlight: 'Wireless Dual Mode'
    },
    {
      id: 'tp-sc-11',
      title: 'Minimalist Polarized UV400 Matte Black Sunglasses',
      category: 'fashion',
      badge: 'Bhanjo Prime • Hot Deal',
      price: 180.0,
      originalPrice: 320.0,
      image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80',
      sales: '9,200+ Reviews',
      soldPercent: 48,
      guarantees: ['TAC Polarized', 'Anti-Glare', 'Case Included'],
      highlight: 'Everyday Travel & Driving'
    },
    {
      id: 'tp-sc-12',
      title: 'Precision Touch Induction Cooker 2200W Rapid Heating',
      category: 'home',
      badge: 'Bhanjo Prime • Home Hit',
      price: 890.0,
      originalPrice: 1450.0,
      image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80',
      sales: '4,500+ Kitchens Trust',
      soldPercent: 71,
      guarantees: ['Crystal Plate', 'Safety Auto-Off', '1-Yr Warranty'],
      highlight: 'Energy Efficient Cooking'
    }
  ];

  // Filter products by tab and search
  const filteredItems = showcaseItems.filter(item => {
    if (activeTab === 'all') return true;
    if (activeTab === 'super-discount') return (item.originalPrice - item.price) / item.originalPrice > 0.3;
    if (activeTab === 'seasonal') return item.category === 'seasonal' || item.category === 'fashion';
    if (activeTab === 'viral') return item.category === 'viral' || item.sales.includes('10K');
    return item.category === activeTab;
  }).filter(item => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return item.title.toLowerCase().includes(q);
  });

  const handleCardClick = (item) => {
    if (onSelectProduct) {
      const match = (products || []).find(p => p.id === item.id) || {
        id: item.id,
        title: item.title,
        retailPrice: item.price,
        originalPrice: item.originalPrice,
        image: item.image,
        category: item.category || 'all',
        categoryName: 'TOP Picks Super Deal',
        rating: 4.9,
        reviewsCount: 380,
        inStock: true
      };
      onSelectProduct(match);
    }
  };

  const handleAddToCart = (e, item) => {
    e.stopPropagation();
    addToCart({
      id: item.id,
      title: item.title,
      retailPrice: item.price,
      price: item.price,
      image: item.image,
      quantity: 1
    });
    setJustAddedId(item.id);
    setTimeout(() => setJustAddedId(null), 1800);
  };

  return (
    <div className="min-h-screen pb-16 font-sans bg-[#FAFAFB] text-slate-900 transition-colors duration-300">
      
      {/* ========================================================= */}
      {/* TOP HEADER: Clean Navigation + Live Deals               */}
      {/* ========================================================= */}
      <div className="sticky top-0 z-50 backdrop-blur-md bg-white/95 border-b border-[#E5E7EB] shadow-xs text-slate-900 transition-all">
        <div className="max-w-[1560px] mx-auto px-3 sm:px-5 py-2 flex items-center justify-between gap-2.5 flex-wrap">
          
          {/* Back to Home Button */}
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold bg-white hover:bg-slate-50 text-[#1B1F3B] border border-[#E5E7EB] hover:border-slate-300 shadow-2xs transition-all cursor-pointer active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5] text-[#1B1F3B]" />
            <span>{language === 'ne' ? '← पसलमा फर्कनुहोस्' : '← Back to Marketplace'}</span>
          </button>

          {/* Center Brand Title & Live Countdown with 3D Mascot thumbnail */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <img
              src="/mascot/bhanjo_mascot_3d_clean.png?v=3"
              alt="Bhanjo Prime Mascot"
              className="w-7 h-7 sm:w-8 sm:h-8 object-contain drop-shadow-sm flex-shrink-0 -my-1"
            />
            <span className="bg-[#1B1F3B] text-[#FFC83D] text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-tight shadow-xs flex items-center gap-1">
              <span>👑</span>
              <span>BHANJO PRIME • TOP RADAR</span>
            </span>
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black font-mono">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5] text-[#E11D48]" />
              <span className="hidden xs:inline text-slate-700">{language === 'ne' ? 'अफर बाँकी समय:' : 'Radar Deals:'}</span>
              <span className="bg-[#FFC83D] border border-[#F0B820] text-[#1B1F3B] px-2 py-0.5 rounded-md font-black shadow-2xs">
                {pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}
              </span>
            </div>
          </div>

          {/* Right Action Bar: Verified Badge + Quick Search */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Verified Direct Sourcing Pill */}
            <div className="hidden md:flex items-center gap-1 bg-[#FFE7EC] text-[#E11D48] border border-[#FECDD3] px-3 py-1 rounded-full text-[11px] font-bold shadow-2xs">
              <Sparkles className="w-3 h-3 text-[#E11D48]" />
              <span>Verified Top Deals</span>
            </div>

            {/* Quick Search inside Super Deals */}
            <div className="relative flex-1 sm:w-56">
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder={language === 'ne' ? 'अफर खोज्नुहोस्...' : 'Search Prime Deals...'}
                className="w-full text-slate-800 text-xs font-medium pl-8 pr-3 py-1.5 rounded-full border border-[#E5E7EB] bg-white shadow-2xs transition-colors focus:bg-white focus:outline-none focus:ring-2 focus:border-[#E11D48] focus:ring-rose-100"
              />
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#E11D48]" />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* HERO BANNER: Clean Luxury Header with Subtle Blush Glow   */}
      {/* ========================================================= */}
      <div className="border-b border-[#E5E7EB] pt-3 sm:pt-4 pb-3.5 sm:pb-4 shadow-xs relative overflow-hidden bg-gradient-to-b from-[#FFF5F7] via-[#FAFAFB] to-[#FFFFFF]">
        {/* Soft Ambient Glow Orbs */}
        <div className="absolute -right-12 -top-12 w-80 h-80 rounded-full blur-3xl pointer-events-none bg-rose-200/25" />
        <div className="absolute left-1/4 -bottom-10 w-72 h-72 rounded-full blur-3xl pointer-events-none bg-amber-100/20" />
        <div className="absolute -left-10 top-1/3 w-56 h-56 rounded-full blur-2xl pointer-events-none bg-rose-100/20" />

        <div className="max-w-[1560px] mx-auto px-3 sm:px-5 relative z-10">
          
          {/* Main Headline Layout: Text on Left, 3D Cutout Mascot on Right (Compact & Clean) */}
          <div className="flex items-center justify-between gap-3 sm:gap-6 mb-2.5 sm:mb-3">
            
            {/* Left Content Column */}
            <div className="text-left flex-1 min-w-0 pr-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold mb-1 shadow-2xs border border-[#E5E7EB] bg-white/90 text-[#1B1F3B] backdrop-blur-md">
                <Sparkles className="w-3 h-3 text-[#E11D48]" />
                <span className="truncate">Bhanjo Prime Radar • Direct Factory Subsidies Live</span>
              </div>
              <h1 className="text-lg xs:text-xl sm:text-2xl lg:text-[28px] font-black tracking-tight leading-snug text-slate-950 drop-shadow-2xs">
                <span className="text-[#1B1F3B]">
                  Bhanjo Prime Radar
                </span>{' '}
                • <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E11D48] to-[#BE123C]">Nepal's Verified Top Deals</span>
              </h1>
              <p className="text-[11px] xs:text-[11.5px] sm:text-xs mt-0.5 text-[#5B6070] font-medium line-clamp-1 sm:line-clamp-none">
                {language === 'ne' 
                  ? 'कारखानाबाट सिधै काठमाडौं हब • भन्सार तथा डेलिभरी ग्यारेन्टी सहित' 
                  : 'Direct Factory Sourcing • Stackable Official Subsidies • Zero Middleman Markup'}
              </p>
            </div>

            {/* Right Side: Compact Proportionate Mascot */}
            <div className="relative flex-shrink-0 flex items-center justify-end w-20 xs:w-24 sm:w-28 md:w-32">
              <img
                src="/mascot/bhanjo_mascot_3d_clean.png?v=3"
                alt="Bhanjo Prime Mascot"
                className="h-20 xs:h-24 sm:h-28 md:h-32 w-auto max-w-none object-contain animate-in zoom-in-95 duration-300 hover:scale-105 transition-transform select-none pointer-events-none drop-shadow-[0_12px_20px_rgba(27,31,59,0.12)]"
              />
            </div>

          </div>

          {/* ========================================================= */}
          {/* SECTION 1: PLATFORM SUBSIDY VOUCHERS                      */}
          {/* ========================================================= */}
          <div className="backdrop-blur-xl rounded-2xl p-2.5 sm:p-3 border border-[#E5E7EB] shadow-xs bg-white/95">
            <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-black tracking-tight text-[#1B1F3B] flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5 text-[#E11D48]" />
                  <span>Platform Subsidy Vouchers</span>
                </span>
                <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-full shadow-2xs bg-[#FFE7EC] text-[#E11D48] border border-[#FECDD3]">
                  Stackable Coupons
                </span>
              </div>
              <span className="text-[10.5px] font-semibold hidden sm:inline text-[#5B6070]">
                Claim up to Rs. 322 in combined subsidies today
              </span>
              <span className="text-[9.5px] font-bold sm:hidden flex items-center gap-0.5 text-[#E11D48]">
                <span>Swipe →</span>
              </span>
            </div>

            {/* 5 Vouchers in Sideable Scroll way on Mobile, Grid on Laptop */}
            <div className="flex sm:grid sm:grid-cols-5 gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-0.5 snap-x snap-mandatory">
              {subsidyVouchers.map((v) => {
                const isClaimed = claimedVouchers.has(v.id);
                return (
                  <div 
                    key={v.id}
                    className="w-[130px] xs:w-[140px] sm:w-auto flex-shrink-0 snap-start rounded-xl p-2 sm:p-2.5 flex flex-col justify-between text-slate-800 shadow-2xs relative overflow-hidden group border border-[#E5E7EB] hover:border-[#FECDD3] bg-gradient-to-b from-[#FFF5F7] via-white to-white hover:shadow-md transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10.5px] font-bold text-slate-600">
                        <span className="truncate">{v.title}</span>
                        <span className="text-sm">{v.icon}</span>
                      </div>
                      <div className="mt-0.5 flex items-baseline gap-1">
                        <span className="text-base sm:text-lg font-black tracking-tight text-[#E11D48]">
                          {v.amount}
                        </span>
                        <span className="text-[8.5px] text-slate-400 font-bold">OFF</span>
                      </div>
                      <div className="text-[9px] text-[#5B6070] font-medium">
                        {v.minSpend}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleClaimVoucher(v)}
                      disabled={isClaimed}
                      className={`mt-1.5 w-full py-1 rounded-lg text-[11px] sm:text-xs font-bold transition-all cursor-pointer select-none active:scale-95 shadow-xs ${
                        isClaimed
                          ? 'bg-[#15803D] text-white cursor-default'
                          : 'bg-[#E11D48] hover:bg-[#BE123C] text-white'
                      }`}
                    >
                      {isClaimed ? v.claimedText : (language === 'ne' ? 'लिनुहोस्' : 'Claim Voucher')}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ========================================================= */}
          {/* SECTION 2: QUICK PILL SHORTCUTS                           */}
          {/* ========================================================= */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mt-3">
            {quickPills.map((pill) => (
              <button
                key={pill.id}
                type="button"
                onClick={() => {
                  const elem = document.getElementById('super-showcase-grid');
                  if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                }}
                className="p-2 sm:p-2.5 rounded-xl flex items-center gap-2 transition-all shadow-2xs hover:shadow-sm cursor-pointer border border-[#E5E7EB] hover:border-[#FECDD3] bg-white hover:bg-rose-50/40 text-left group"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg flex-shrink-0 group-hover:scale-110 transition-transform border border-[#E5E7EB] bg-[#FAFAFB] text-[#1B1F3B]">
                  {pill.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-bold truncate text-[#1B1F3B] leading-tight">
                    {pill.title}
                  </div>
                  <div className="text-[9px] font-black truncate text-[#E11D48]">
                    {pill.badge}
                  </div>
                </div>
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* ========================================================= */}
      {/* SECTION 3: STICKY CATEGORY TABS STRIP                     */}
      {/* ========================================================= */}
      <div className="sticky top-[47px] z-40 bg-white/95 backdrop-blur-md border-y border-[#E5E7EB] shadow-xs transition-colors">
        <div className="max-w-[1560px] mx-auto px-3 sm:px-5 flex items-center gap-2 overflow-x-auto scrollbar-none py-2">
          {categoryTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer select-none flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#1B1F3B] text-white shadow-sm scale-105'
                    : 'bg-slate-100/80 hover:bg-rose-50 text-slate-700 hover:text-[#E11D48]'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* SECTION 4: CURATED SUPER SHOWCASE PRODUCTS GRID           */}
      {/* ========================================================= */}
      <div className="max-w-[1560px] mx-auto px-3 sm:px-5 pt-3 sm:pt-4" id="super-showcase-grid">
        
        {/* Results counter & active state */}
        <div className="flex items-center justify-between mb-2 text-[11px] sm:text-xs text-slate-600 font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full animate-pulse bg-[#E11D48]" />
            <span className="text-[#1B1F3B] font-bold">Showing {filteredItems.length} Verified Prime Deals</span>
          </div>
          <span className="text-[#5B6070] font-normal">100% Guaranteed Lowest Nepal Pricing</span>
        </div>

        {/* 6-Column Grid in Compact Aspect Ratio */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-2.5">
          {filteredItems.map((item, index) => {
            const discountPercent = item.originalPrice ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100) : 35;
            const savings = item.originalPrice ? item.originalPrice - item.price : 0;
            const soldPercent = item.soldPercent || (37 + (index * 8) % 43);
            const itemsLeft = 32 - ((index * 3) % 22);

            // Live millisecond countdown
            const itemMins = (timeLeft.minutes + index * 2) % 60;
            const itemSecs = (timeLeft.seconds + index * 5) % 60;
            const itemMillis = (index * 3) % 10;

            return (
              <div
                key={item.id}
                onClick={() => handleCardClick(item)}
                className="bg-white rounded-xl border border-[#E5E7EB] hover:border-[#E11D48] hover:shadow-lg transition-all duration-200 flex flex-col justify-between cursor-pointer group overflow-hidden"
              >
                {/* Compact Product Image Tile */}
                <div className="relative aspect-[4/3.1] overflow-hidden bg-slate-50/50 flex items-center justify-center">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  
                  {/* Discount Tag (Gold deal badge with Navy text) */}
                  <span className="absolute top-1 left-1 bg-[#FFC83D] text-[#1B1F3B] text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs z-10">
                    -{discountPercent}%
                  </span>

                  {/* Official Mall Badge */}
                  <span className="absolute top-1 right-1 bg-[#1B1F3B] text-[#FFC83D] text-[7.5px] font-black px-1.5 py-0.5 rounded shadow-xs z-10">
                    PRIME
                  </span>

                  {/* Bottom Flash Deal Live Timer Banner */}
                  <div className="absolute bottom-0 inset-x-0 bg-[#1B1F3B] text-white font-black text-[8px] py-0.5 px-1 flex items-center justify-between shadow-xs z-10 font-mono">
                    <span className="flex items-center gap-0.5 uppercase text-[#FFC83D]">
                      <Zap className="w-2.5 h-2.5 fill-current text-[#FFC83D]" />
                      <span>Flash Deal</span>
                    </span>
                    <span className="text-white/90">{pad(itemMins)}:{pad(itemSecs)}.{itemMillis} Left</span>
                  </div>
                </div>

                {/* Compact Product Info & Pricing */}
                <div className="p-1.5 sm:p-2 flex-1 flex flex-col justify-between">
                  <div>
                    {/* 1-Line Compact Title */}
                    <h3 
                      className="text-[11px] sm:text-xs font-semibold text-slate-800 line-clamp-1 transition leading-tight group-hover:text-[#E11D48]"
                      title={item.title}
                    >
                      {item.title}
                    </h3>

                    {/* Sold status & micro progress bar */}
                    <div className="mt-0.5">
                      <div className="flex items-center justify-between text-[8px] sm:text-[8.5px] font-bold text-[#E11D48] mb-0.5">
                        <span className="flex items-center gap-0.5">
                          <Flame className="w-2.5 h-2.5 text-[#E11D48] fill-current" />
                          <span>Sold {soldPercent}%</span>
                        </span>
                        <span className="text-[#5B6070] font-normal">{itemsLeft} left</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-[#E11D48] to-[#FFC83D] h-full rounded-full" 
                          style={{ width: `${soldPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Savings Tag */}
                    {savings > 0 && (
                      <div className="mt-0.5">
                        <span className="bg-[#FFE7EC] border border-[#FECDD3] text-[#E11D48] text-[8px] font-bold px-1 py-0.5 rounded inline-flex items-center gap-0.5">
                          <span>⚡</span>
                          <span>Save {formatPrice(savings)}</span>
                        </span>
                      </div>
                    )}

                    {/* Prices */}
                    <div className="mt-0.5 flex items-baseline gap-1 flex-wrap">
                      <span className="text-xs sm:text-sm font-black leading-tight text-[#E11D48]">
                        {formatPrice(item.price)}
                      </span>
                      {item.originalPrice && (
                        <span className="text-[9px] text-slate-400 line-through leading-none">
                          {formatPrice(item.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Compact Buy Now Button */}
                  <button
                    type="button"
                    onClick={(e) => handleAddToCart(e, item)}
                    className={`w-full mt-1.5 py-1 rounded-lg text-[10.5px] sm:text-[11px] font-bold transition-all cursor-pointer select-none active:scale-95 shadow-xs flex items-center justify-center gap-1 ${
                      justAddedId === item.id
                        ? 'bg-[#15803D] text-white'
                        : 'bg-[#E11D48] hover:bg-[#BE123C] text-white'
                    }`}
                    title="Buy Deal"
                  >
                    <ShoppingBag className="w-3 h-3" />
                    <span>{justAddedId === item.id ? 'Added ✓' : 'Buy Now'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
