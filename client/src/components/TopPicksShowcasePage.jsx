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
    <div className="min-h-screen bg-[#FFF9F2] pb-16 font-sans">
      
      {/* ========================================================= */}
      {/* TOP HEADER: Frosted Warm Glass Navigation + Super Deals   */}
      {/* ========================================================= */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-orange-200/80 shadow-xs text-slate-900 transition-all">
        <div className="max-w-[1560px] mx-auto px-3 sm:px-5 py-2 flex items-center justify-between gap-2.5 flex-wrap">
          
          {/* Back to Home Button */}
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 bg-orange-50 hover:bg-orange-100 active:scale-95 text-orange-950 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold border border-orange-200/90 shadow-2xs transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#FF5000] stroke-[2.5]" />
            <span>{language === 'ne' ? '← पसलमा फर्कनुहोस्' : '← Back to Marketplace'}</span>
          </button>

          {/* Center Brand Title & Live Countdown with 3D Mascot thumbnail */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <img
              src="/mascot/bhanjo_mascot_3d_clean.png?v=3"
              alt="Bhanjo Prime Mascot"
              className="w-7 h-7 sm:w-8 sm:h-8 object-contain drop-shadow-sm flex-shrink-0 -my-1"
            />
            <span className="bg-gradient-to-r from-[#FF5000] to-[#FF7A00] text-white text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-tight shadow-xs">
              BHANJO PRIME • TOP RADAR
            </span>
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black font-mono">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FF5000] stroke-[2.5]" />
              <span className="hidden xs:inline text-slate-700">{language === 'ne' ? 'अफर बाँकी समय:' : 'Radar Deals:'}</span>
              <span className="bg-orange-100/90 border border-orange-200 text-[#FF5000] px-2 py-0.5 rounded-md font-black">
                {pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}
              </span>
            </div>
          </div>

          {/* Quick Search inside Super Deals */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder={language === 'ne' ? 'अफर खोज्नुहोस्...' : 'Search Prime Deals...'}
              className="w-full bg-orange-50/60 hover:bg-white text-slate-800 text-xs font-medium pl-8 pr-3 py-1.5 rounded-full border border-orange-200/90 focus:border-[#FF5000] focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-200 shadow-2xs transition-colors"
            />
            <Search className="w-3.5 h-3.5 text-[#FF5000] absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* HERO BANNER: High-Key Frosted Warm Luxe Theme             */}
      {/* ========================================================= */}
      <div className="bg-gradient-to-b from-[#FFF7ED] via-[#FFFDF9] to-[#FFF8F0] border-b border-orange-200/70 pt-5 pb-7 sm:pb-9 shadow-xs relative overflow-hidden">
        {/* Soft Ambient Glow Orbs */}
        <div className="absolute -right-12 -top-12 w-96 h-96 bg-orange-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/4 -bottom-10 w-80 h-80 bg-amber-100/60 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-10 top-1/3 w-64 h-64 bg-orange-100/40 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-[1560px] mx-auto px-3 sm:px-5 relative z-10">
          
          {/* Main Headline Layout: Text on Left, 3D Cutout Mascot on Right */}
          <div className="flex items-center justify-between gap-2 sm:gap-6 mb-4 min-h-[140px] xs:min-h-[160px] sm:min-h-[190px]">
            
            {/* Left Content Column */}
            <div className="text-left flex-1 min-w-0 pr-1 xs:pr-2">
              <div className="inline-flex items-center gap-1.5 bg-orange-100/90 text-orange-900 border border-orange-200/90 px-3 py-1 rounded-full text-[11px] sm:text-xs font-black mb-2 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-[#FF5000]" />
                <span className="truncate">Bhanjo Prime Radar • Direct Factory Subsidies Live</span>
              </div>
              <h1 className="text-xl xs:text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-slate-950 drop-shadow-2xs">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5000] via-[#FF6A1A] to-[#E04500]">
                  Bhanjo Prime Radar
                </span>{' '}
                • Nepal's Verified Top Deals
              </h1>
              <p className="text-slate-600 text-[11.5px] xs:text-xs sm:text-sm font-semibold mt-1.5 line-clamp-2 sm:line-clamp-none">
                {language === 'ne' 
                  ? 'कारखानाबाट सिधै काठमाडौं हब • भन्सार तथा डेलिभरी ग्यारेन्टी सहित' 
                  : 'Direct Factory Sourcing • Stackable Official Subsidies • Zero Middleman Markup'}
              </p>
            </div>

            {/* Right Side: Transparent 3D Cutout Panda with vibrant depth */}
            <div className="relative flex-shrink-0 self-end flex items-end justify-center w-28 xs:w-36 sm:w-48 md:w-56 lg:w-64">
              <img
                src="/mascot/bhanjo_mascot_3d_clean.png?v=3"
                alt="Bhanjo Prime Mascot"
                className="h-36 xs:h-44 sm:h-56 md:h-64 lg:h-72 w-auto max-w-none object-contain drop-shadow-[0_16px_28px_rgba(255,80,0,0.18)] animate-in zoom-in-95 duration-300 hover:scale-105 transition-transform select-none pointer-events-none -mb-6 sm:-mb-8"
              />
            </div>

          </div>

          {/* ========================================================= */}
          {/* SECTION 1: PLATFORM SUBSIDY VOUCHERS (Frosted Pavilion)   */}
          {/* ========================================================= */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-orange-200/90 shadow-[0_8px_30px_rgba(255,106,26,0.08)] ring-1 ring-orange-200/50">
            <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-orange-100">
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-black tracking-tight text-slate-950 flex items-center gap-1.5">
                  <Gift className="w-4 h-4 text-[#FF5000]" />
                  <span>Platform Subsidy Vouchers</span>
                </span>
                <span className="text-[10px] bg-gradient-to-r from-[#FF5000] to-[#FF7A00] text-white font-black px-2 py-0.5 rounded-full shadow-2xs">
                  Stackable Coupons
                </span>
              </div>
              <span className="text-[11px] text-orange-950/70 font-bold hidden sm:inline">
                Claim up to Rs. 322 in combined subsidies today
              </span>
              <span className="text-[10px] text-[#FF5000] font-bold sm:hidden flex items-center gap-0.5">
                <span>Swipe →</span>
              </span>
            </div>

            {/* 5 Vouchers in Sideable Scroll way on Mobile, Grid on Laptop */}
            <div className="flex sm:grid sm:grid-cols-5 gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-1 snap-x snap-mandatory">
              {subsidyVouchers.map((v) => {
                const isClaimed = claimedVouchers.has(v.id);
                return (
                  <div 
                    key={v.id}
                    className="w-[138px] xs:w-[150px] sm:w-auto flex-shrink-0 snap-start bg-gradient-to-b from-orange-50/40 via-white to-white rounded-xl p-2.5 flex flex-col justify-between text-slate-800 shadow-2xs relative overflow-hidden group border border-orange-200/90 hover:border-[#FF5000] hover:shadow-md transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                        <span className="truncate">{v.title}</span>
                        <span className="text-sm">{v.icon}</span>
                      </div>
                      <div className="mt-1 flex items-baseline gap-1">
                        <span className="text-lg sm:text-xl font-black text-[#FF5000] tracking-tight">
                          {v.amount}
                        </span>
                        <span className="text-[9px] text-slate-400 font-bold">OFF</span>
                      </div>
                      <div className="text-[9.5px] text-slate-500 font-medium">
                        {v.minSpend}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleClaimVoucher(v)}
                      disabled={isClaimed}
                      className={`mt-2 w-full py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer select-none active:scale-95 ${
                        isClaimed
                          ? 'bg-emerald-500 text-white cursor-default shadow-xs'
                          : 'bg-gradient-to-r from-[#FF5000] to-[#FF7A00] hover:from-[#E04500] hover:to-[#F85606] text-white shadow-xs'
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
          {/* SECTION 2: QUICK PILL SHORTCUTS                          */}
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
                className="bg-white hover:bg-orange-50/60 text-slate-800 p-2 sm:p-2.5 rounded-xl flex items-center gap-2 transition-all shadow-2xs hover:shadow-md cursor-pointer border border-orange-200/80 hover:border-orange-300 text-left group"
              >
                <div className="w-8 h-8 rounded-lg bg-orange-100/70 border border-orange-200/60 flex items-center justify-center text-lg flex-shrink-0 group-hover:scale-110 transition-transform">
                  {pill.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-black truncate text-slate-900 leading-tight">
                    {pill.title}
                  </div>
                  <div className="text-[9px] text-[#FF5000] font-extrabold truncate">
                    {pill.badge}
                  </div>
                </div>
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* ========================================================= */}
      {/* SECTION 3: STICKY CATEGORY TABS STRIP (White Strip)       */}
      {/* ========================================================= */}
      <div className="sticky top-[47px] z-40 bg-white border-y border-orange-200/80 shadow-xs">
        <div className="max-w-[1560px] mx-auto px-3 sm:px-5 flex items-center gap-2 overflow-x-auto scrollbar-none py-2">
          {categoryTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer select-none flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#FF5000] to-[#FF7A00] text-white shadow-sm scale-105'
                    : 'bg-orange-50/70 hover:bg-orange-100/80 text-slate-700 hover:text-[#FF5000]'
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
      <div className="max-w-[1560px] mx-auto px-3 sm:px-5 pt-5" id="super-showcase-grid">
        
        {/* Results counter & active state */}
        <div className="flex items-center justify-between mb-3 text-xs text-slate-600 font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#FF5000] animate-pulse" />
            <span>Showing {filteredItems.length} Verified Prime Deals</span>
          </div>
          <span className="text-slate-400 font-normal">100% Guaranteed Lowest Nepal Pricing</span>
        </div>

        {/* 6-Column Grid matching Photo 1 format exactly */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-3">
          {filteredItems.map((item, index) => {
            const discountPercent = item.originalPrice ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100) : 35;
            const savings = item.originalPrice ? item.originalPrice - item.price : 0;
            const soldPercent = item.soldPercent || (37 + (index * 8) % 43);
            const itemsLeft = 32 - ((index * 3) % 22);

            // Live millisecond countdown like Photo 1
            const itemMins = (timeLeft.minutes + index * 2) % 60;
            const itemSecs = (timeLeft.seconds + index * 5) % 60;
            const itemMillis = (index * 3) % 10;

            return (
              <div
                key={item.id}
                onClick={() => handleCardClick(item)}
                className="bg-white rounded-xl border border-orange-100 hover:border-[#FF5000] hover:shadow-xl hover:shadow-orange-500/15 transition-all duration-200 flex flex-col justify-between cursor-pointer group overflow-hidden"
              >
                {/* Product Image Tile with Badges & Live Countdown Banner (Pure White Background) */}
                <div className="relative aspect-square overflow-hidden bg-white">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-contain p-1.5 group-hover:scale-105 transition-transform duration-300 bg-white"
                    loading="lazy"
                  />
                  
                  {/* Red Discount Tag */}
                  <span className="absolute top-1.5 left-1.5 bg-[#FF5000] text-white text-[10px] font-black px-1.5 py-0.5 rounded shadow-sm z-10">
                    -{discountPercent}%
                  </span>

                  {/* Official Mall Badge */}
                  <span className="absolute top-1.5 right-1.5 bg-slate-900/85 text-amber-300 text-[8px] font-bold px-1.5 py-0.5 rounded shadow-xs z-10">
                    PRIME
                  </span>

                  {/* Bottom Yellow Flash Deal Live Timer Banner matching Photo 1 */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 text-slate-950 font-black text-[9px] py-0.5 px-1.5 flex items-center justify-between shadow-md z-10 font-mono">
                    <span className="flex items-center gap-0.5 uppercase">
                      <Zap className="w-2.5 h-2.5 fill-current text-red-600" />
                      <span>Flash Deal</span>
                    </span>
                    <span>{pad(itemMins)}:{pad(itemSecs)}.{itemMillis} Left</span>
                  </div>
                </div>

                {/* Product Info & Pricing (matching Photo 1 size format) */}
                <div className="p-2 sm:p-2.5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Compact Title */}
                    <h3 
                      className="text-xs font-semibold text-slate-800 line-clamp-2 group-hover:text-[#FF5000] transition leading-tight min-h-[28px]"
                      title={item.title}
                    >
                      {item.title}
                    </h3>

                    {/* Sold status & progress bar matching Photo 1 */}
                    <div className="mt-1.5">
                      <div className="flex items-center justify-between text-[9px] font-bold text-orange-600 mb-0.5">
                        <span className="flex items-center gap-0.5">
                          <Flame className="w-2.5 h-2.5 text-orange-500 fill-current" />
                          <span>Sold {soldPercent}%</span>
                        </span>
                        <span className="text-slate-400 font-normal">{itemsLeft} left</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-orange-500 to-amber-400 h-full rounded-full" 
                          style={{ width: `${soldPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Savings Tag matching Photo 1 */}
                    {savings > 0 && (
                      <div className="mt-1">
                        <span className="bg-amber-50 border border-amber-200 text-amber-800 text-[8.5px] font-black px-1.5 py-0.5 rounded inline-flex items-center gap-0.5">
                          <span>⚡</span>
                          <span>Save {formatPrice(savings)}</span>
                        </span>
                      </div>
                    )}

                    {/* Prices matching Photo 1 */}
                    <div className="mt-1">
                      <div className="flex items-center gap-1 flex-wrap">
                        <span className="text-sm sm:text-base font-black text-[#FF5000] leading-tight">
                          {formatPrice(item.price)}
                        </span>
                      </div>
                      {item.originalPrice && (
                        <div className="text-[10px] text-slate-400 line-through leading-none mt-0.5">
                          {formatPrice(item.originalPrice)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Red Buy Now Button matching Photo 1 */}
                  <button
                    type="button"
                    onClick={(e) => handleAddToCart(e, item)}
                    className={`w-full mt-2 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer select-none active:scale-95 shadow-xs flex items-center justify-center gap-1.5 ${
                      justAddedId === item.id
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gradient-to-r from-[#FF5000] to-[#FF7A00] hover:from-[#E04500] hover:to-[#F85606] text-white shadow-orange-500/20'
                    }`}
                    title="Buy Deal"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
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
