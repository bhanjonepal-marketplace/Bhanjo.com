import React, { useState, useEffect, useRef } from 'react';
import { 
  Zap, Clock, Flame, Bell, ArrowLeft, ChevronRight, ChevronDown, Star, 
  ShoppingBag, Filter, Sparkles, Plus, Edit3, Trash2, CheckCircle2, 
  Tag, ShieldCheck, Heart, AlertTriangle, Layers, Gift, Percent
} from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';
import { RedAlarmClock } from './RedAlarmClock';

export const FlashSalePage = ({ 
  onBack, 
  onSelectProduct, 
  onOpenAdminManager,
  onRequireAuth,
  products = []
}) => {
  const { formatPrice, formatNPR } = useCurrency();
  const { addToCart } = useCart();
  const { isAdmin, user } = useAuth();

  const [flashItems, setFlashItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [visibleCount, setVisibleCount] = useState(6);
  const [activeSession, setActiveSession] = useState('active'); // 'active' | '16:00' | '20:00' | 'tomorrow'
  const [claimedVouchers, setClaimedVouchers] = useState(new Set());
  const [justAddedId, setJustAddedId] = useState(null);

  // Live Master Countdown with Milliseconds (Tenths of second)
  const [masterTime, setMasterTime] = useState({
    hours: 4,
    minutes: 28,
    seconds: 15,
    millis: 7
  });

  // Fast tick for live millisecond countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setMasterTime(prev => {
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

  // Fetch flash sale items from backend API
  const fetchFlashSale = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/flash-sale');
      const data = await res.json();
      if (data.success && Array.isArray(data.items)) {
        setFlashItems(data.items);
      }
    } catch (err) {
      console.error('Error fetching flash sale items:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFlashSale();
  }, []);

  const pad = (n) => String(n).padStart(2, '0');

  // Handle claiming flash sale vouchers
  const handleClaimVoucher = (voucherId, title) => {
    if (claimedVouchers.has(voucherId)) return;
    setClaimedVouchers(prev => new Set([...prev, voucherId]));
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
  };

  // Quick Add To Cart from Flash Deal card
  const handleQuickBuy = (item, e) => {
    e.stopPropagation();
    if (!item.product) return;
    
    addToCart(item.product, 1, 'retail');
    setJustAddedId(item.id);
    confetti({ particleCount: 45, spread: 50 });
    setTimeout(() => setJustAddedId(null), 1800);
  };

  // Merge official flash items with catalog products to provide plenty of items to load
  const allAvailableFlashItems = React.useMemo(() => {
    const existingIds = new Set(flashItems.map(item => String(item.product?.id || item.product_id)));
    const extraItems = (products || [])
      .filter(p => p && !existingIds.has(String(p.id)))
      .map((p, idx) => ({
        id: `catalog_flash_${p.id || idx}`,
        product: p,
        product_id: p.id,
        flash_price: p.samplePrice ? Number((p.samplePrice * 0.55).toFixed(2)) : 14.99,
        original_price: p.samplePrice || 29.99,
        discount_percent: 40 + ((idx * 7) % 35),
        total_stock: 50 + ((idx * 11) % 50),
        sold_stock: 20 + ((idx * 7) % 25),
        is_active: 1
      }));
    return [...flashItems, ...extraItems];
  }, [flashItems, products]);

  // Filter items based on category / criteria
  const filteredItems = allAvailableFlashItems.filter(item => {
    if (!item.product) return false;
    if (selectedFilter === 'bags') return item.product.categoryId?.includes('bag');
    if (selectedFilter === 'electronics') return item.product.categoryId?.includes('electronic') || item.product.categoryId?.includes('phone');
    if (selectedFilter === 'apparel') return item.product.categoryId?.includes('apparel');
    if (selectedFilter === 'under1000') {
      const nprPrice = Math.round(item.flash_price * 133.5);
      return nprPrice <= 1000;
    }
    if (selectedFilter === 'over50') return (item.discount_percent || 0) >= 50;
    return true;
  });

  const displayedItems = filteredItems.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-[#FFF5F5] pb-16 font-sans">
      
      {/* Top Banner & Header (1688 / Taobao / Daraz Vibrant Red & Crimson Theme) */}
      <div className="bg-gradient-to-b from-[#E00028] via-[#FF0036] to-[#FF2E55] text-white pt-3 pb-8 px-3 sm:px-6 shadow-xl relative overflow-hidden">
        
        {/* Subtle decorative glowing background circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-80 h-80 bg-red-800/30 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Top Navigation Row */}
          <div className="flex items-center justify-between pb-3 border-b border-white/15">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-white/90 hover:text-white bg-black/20 hover:bg-black/30 px-3 py-1.5 rounded-full transition cursor-pointer backdrop-blur-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Marketplace</span>
            </button>

            {/* Admin Management Trigger Button */}
            {isAdmin && onOpenAdminManager && (
              <button
                onClick={onOpenAdminManager}
                className="bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-full transition shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95"
                title="Open Flash Sale Admin Manager to add products, set prices & timers"
              >
                <Zap className="w-3.5 h-3.5 fill-current text-slate-950" />
                <span>⚡ Manage Flash Sale Deals (Admin)</span>
              </button>
            )}
          </div>

          {/* Flash Sale Main Title & Alarm Section (Matches Reference Screenshot 3 & 4) */}
          <div className="mt-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Animated Cute Red Alarm Clock (Matching reference clock with lightning bolt, zero Chinese text) */}
              <div className="relative flex-shrink-0 group transition-transform hover:scale-108 active:scale-95">
                <RedAlarmClock className="w-14 h-14 sm:w-16 sm:h-16" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-yellow-400 text-red-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                    <Flame className="w-3 h-3 fill-current text-red-600" />
                    <span>International Direct Deals</span>
                  </span>
                  <span className="text-[11px] text-white/80 hidden sm:inline">
                    🔥 570K+ Sold Across Nepal
                  </span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-2 mt-1 drop-shadow-sm">
                  <span>FLASH SA</span>
                  <span className="text-yellow-300 font-extrabold flex items-center">
                    ⚡E
                  </span>
                </h1>
                <p className="text-xs text-white/80 mt-0.5">
                  Massive limited-time price drops • Direct China Factory Pricing • Refreshes Hourly
                </p>
              </div>
            </div>

            {/* High-Impact Master Live Countdown with Milliseconds */}
            <div className="bg-black/35 backdrop-blur-md p-3 sm:p-3.5 rounded-2xl border border-white/20 shadow-2xl flex flex-col items-center sm:items-end">
              <span className="text-[11px] font-bold text-yellow-300 uppercase tracking-wider flex items-center gap-1 mb-1.5">
                <Clock className="w-3.5 h-3.5 animate-pulse" />
                <span>Current Rush Session Ends In:</span>
              </span>

              <div className="flex items-center gap-1 text-white font-mono font-black">
                <div className="bg-white/20 px-2 py-1 rounded-lg text-sm sm:text-base border border-white/20">
                  {pad(masterTime.hours)}h
                </div>
                <span>:</span>
                <div className="bg-white/20 px-2 py-1 rounded-lg text-sm sm:text-base border border-white/20">
                  {pad(masterTime.minutes)}m
                </div>
                <span>:</span>
                <div className="bg-white/20 px-2 py-1 rounded-lg text-sm sm:text-base border border-white/20">
                  {pad(masterTime.seconds)}s
                </div>
                <span>.</span>
                <div className="bg-yellow-400 text-slate-950 px-2 py-1 rounded-lg text-sm sm:text-base font-black shadow-inner animate-pulse">
                  {masterTime.millis}
                </div>
              </div>
            </div>

          </div>

          {/* Flash Sale Daily Voucher Cards (Reference Screenshot 4) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
            
            <div className="bg-white/95 text-slate-900 rounded-xl p-3 shadow-md border border-white/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-black text-sm">
                  ⚡
                </div>
                <div>
                  <span className="text-[10px] font-bold text-red-600 block uppercase">Flash Drop</span>
                  <span className="text-xs font-black text-slate-900">Up to 70% Off Today</span>
                  <span className="text-[10px] text-slate-500 block">All categories verified</span>
                </div>
              </div>
              <span className="bg-red-600 text-white text-[10px] font-black px-2.5 py-1 rounded-lg shadow-xs">
                HOT
              </span>
            </div>

            <div className="bg-white/95 text-slate-900 rounded-xl p-3 shadow-md border border-white/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-black text-xs">
                  Rs. 250
                </div>
                <div>
                  <span className="text-[10px] font-bold text-amber-600 block uppercase">Flash Voucher</span>
                  <span className="text-xs font-black text-slate-900">Extra Rs. 250 Off</span>
                  <span className="text-[10px] text-slate-500 block">Min. Order Rs. 2,000</span>
                </div>
              </div>
              <button
                onClick={() => handleClaimVoucher('vouch-250', 'Rs. 250 Off')}
                className={`text-[10px] font-black px-3 py-1 rounded-lg transition cursor-pointer ${
                  claimedVouchers.has('vouch-250')
                    ? 'bg-emerald-600 text-white cursor-default'
                    : 'bg-red-600 hover:bg-red-700 text-white shadow-xs'
                }`}
              >
                {claimedVouchers.has('vouch-250') ? 'Claimed ✓' : 'Claim'}
              </button>
            </div>

            <div className="bg-white/95 text-slate-900 rounded-xl p-3 shadow-md border border-white/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-black text-sm">
                  🎁
                </div>
                <div>
                  <span className="text-[10px] font-bold text-purple-600 block uppercase">Hourly Drop</span>
                  <span className="text-xs font-black text-slate-900">Rs. 500 Gift Voucher</span>
                  <span className="text-[10px] text-slate-500 block">Expiring in 2 hours</span>
                </div>
              </div>
              <button
                onClick={() => handleClaimVoucher('vouch-500', 'Rs. 500 Off')}
                className={`text-[10px] font-black px-3 py-1 rounded-lg transition cursor-pointer ${
                  claimedVouchers.has('vouch-500')
                    ? 'bg-emerald-600 text-white cursor-default'
                    : 'bg-red-600 hover:bg-red-700 text-white shadow-xs'
                }`}
              >
                {claimedVouchers.has('vouch-500') ? 'Claimed ✓' : 'Claim'}
              </button>
            </div>

          </div>

          {/* Time Slot Session Tabs (Matches Reference Screenshot 4: 疯抢中 00:15:01 / 15:00 开抢) */}
          <div className="flex items-center gap-2 mt-5 overflow-x-auto pb-1 scrollbar-none">
            
            <button
              onClick={() => setActiveSession('active')}
              className={`flex-shrink-0 px-4 py-2 rounded-xl font-black text-xs transition-all flex items-center gap-2 cursor-pointer ${
                activeSession === 'active'
                  ? 'bg-white text-red-600 shadow-lg scale-105'
                  : 'bg-white/15 text-white hover:bg-white/25'
              }`}
            >
              <Flame className="w-3.5 h-3.5 fill-current text-red-500" />
              <span>⚡ ONGOING RUSH</span>
              <span className="bg-red-600 text-white text-[9px] px-1.5 py-0.2 rounded font-mono">
                {pad(masterTime.minutes)}:{pad(masterTime.seconds)}.{masterTime.millis}
              </span>
            </button>

            <button
              onClick={() => setActiveSession('16:00')}
              className={`flex-shrink-0 px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                activeSession === '16:00'
                  ? 'bg-white text-red-600 shadow-lg scale-105 font-black'
                  : 'bg-white/15 text-white hover:bg-white/25'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>16:00 Coming Up</span>
              <span className="text-[10px] text-white/70">Soon</span>
            </button>

            <button
              onClick={() => setActiveSession('20:00')}
              className={`flex-shrink-0 px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                activeSession === '20:00'
                  ? 'bg-white text-red-600 shadow-lg scale-105 font-black'
                  : 'bg-white/15 text-white hover:bg-white/25'
              }`}
            >
              <span>🌙 20:00 Night Rush</span>
            </button>

            <button
              onClick={() => setActiveSession('tomorrow')}
              className={`flex-shrink-0 px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                activeSession === 'tomorrow'
                  ? 'bg-white text-red-600 shadow-lg scale-105 font-black'
                  : 'bg-white/15 text-white hover:bg-white/25'
              }`}
            >
              <span>⭐ Tomorrow 10:00</span>
            </button>

          </div>

        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 -mt-3 relative z-20">
        
        {/* Category & Filter Pill Bar */}
        <div className="bg-white p-3 rounded-2xl shadow-md border border-slate-200 flex items-center justify-between gap-3 flex-wrap mb-4">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
            <button
              onClick={() => { setSelectedFilter('all'); setVisibleCount(12); }}
              className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                selectedFilter === 'all'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Flash Deals ({flashItems.length})
            </button>

            <button
              onClick={() => { setSelectedFilter('bags'); setVisibleCount(12); }}
              className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                selectedFilter === 'bags'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              👜 Bags & Backpacks
            </button>

            <button
              onClick={() => { setSelectedFilter('electronics'); setVisibleCount(12); }}
              className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                selectedFilter === 'electronics'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              🎧 Audio & Tech
            </button>

            <button
              onClick={() => { setSelectedFilter('apparel'); setVisibleCount(12); }}
              className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                selectedFilter === 'apparel'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              👕 Apparel & Fashion
            </button>

            <button
              onClick={() => { setSelectedFilter('under1000'); setVisibleCount(12); }}
              className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                selectedFilter === 'under1000'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              💰 Under Rs. 1,000
            </button>

            <button
              onClick={() => { setSelectedFilter('over50'); setVisibleCount(12); }}
              className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                selectedFilter === 'over50'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              🔥 50%+ Off Deals
            </button>
          </div>

          <div className="text-xs text-slate-500 font-semibold hidden md:block">
            Showing <strong className="text-red-600">{displayedItems.length}</strong> of {filteredItems.length} Flash Items
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="bg-white rounded-2xl p-16 text-center border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-bold text-slate-700">Loading verified Flash Sale drops...</p>
          </div>
        ) : displayedItems.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
            <div className="text-4xl">⚡</div>
            <h3 className="text-base font-bold text-slate-800">No Flash Sale deals match this filter</h3>
            <p className="text-xs text-slate-500">Try choosing 'All Flash Deals' to see all discounted items.</p>
            <button
              onClick={() => setSelectedFilter('all')}
              className="mt-2 bg-red-600 text-white font-bold text-xs px-4 py-2 rounded-xl hover:bg-red-700 transition"
            >
              View All Flash Deals
            </button>
          </div>
        ) : (
          /* Products Grid (Faithfully matching Reference Screenshot 5: Yellow Banner + Live Timer + Sold % Progress Bar) */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {displayedItems.map((item, index) => {
              const prod = item.product;
              const flashPriceUSD = item.flash_price;
              const origPriceUSD = item.original_price || flashPriceUSD * 1.5;
              const discountPercent = item.discount_percent || Math.round(((origPriceUSD - flashPriceUSD) / origPriceUSD) * 100);
              const savingsNPR = Math.max(0, Math.round((origPriceUSD - flashPriceUSD) * 133.5));
              const percentSold = Math.min(95, Math.max(25, Math.round((item.sold_stock / item.total_stock) * 100) || 45));
              
              // Dynamic live item countdown with milliseconds
              const itemSecs = (masterTime.seconds + (index * 7)) % 60;
              const itemMins = (masterTime.minutes + (index * 3)) % 60;
              const itemHours = masterTime.hours;
              const itemMillis = (masterTime.millis + index) % 10;
              const isAdded = justAddedId === item.id;

              return (
                <div
                  key={item.id}
                  onClick={() => onSelectProduct && onSelectProduct(prod.id)}
                  className="group bg-white rounded-2xl border border-slate-200 hover:border-red-500 hover:shadow-xl transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer relative"
                >
                  {/* Thumbnail Image Container */}
                  <div className="relative aspect-square overflow-hidden bg-slate-100">
                    <img
                      src={prod.images?.[0] || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600'}
                      alt={prod.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />

                    {/* Top Discount Tag */}
                    <div className="absolute top-2 left-2 flex items-center gap-1 z-10">
                      <span className="bg-[#E00028] text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-md">
                        -{discountPercent}%
                      </span>
                    </div>

                    {/* Mall Tag */}
                    <div className="absolute top-2 right-2 z-10">
                      <span className="bg-slate-900/80 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs">
                        MALL
                      </span>
                    </div>

                    {/* Bottom Yellow Flash Deal Live Timer Banner (Matches Screenshot 5!) */}
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 text-slate-950 font-black text-[10px] py-1 px-2 flex items-center justify-between shadow-md z-10 font-mono">
                      <span className="uppercase text-[9px] tracking-tight font-black flex items-center gap-0.5">
                        <Zap className="w-2.5 h-2.5 fill-current text-red-600" />
                        <span>Flash Deal</span>
                      </span>
                      <span className="font-extrabold text-[10px] tracking-tight">
                        {pad(itemHours)}:{pad(itemMins)}:{pad(itemSecs)}.{itemMillis} Left
                      </span>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Title */}
                      <h3 
                        className="text-xs font-semibold text-slate-800 line-clamp-2 leading-snug group-hover:text-red-600 transition-colors"
                        title={prod.title}
                      >
                        {prod.title}
                      </h3>

                      {/* Stock / Sold Progress Bar (Matches Screenshot 5) */}
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-bold text-red-600 flex items-center gap-0.5">
                            <Flame className="w-2.5 h-2.5 fill-current" />
                            <span>Sold {percentSold}%</span>
                          </span>
                          <span className="text-slate-400 text-[9px]">
                            {item.total_stock - item.sold_stock} left
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-amber-500 to-red-600 rounded-full transition-all duration-300"
                            style={{ width: `${percentSold}%` }}
                          />
                        </div>
                      </div>

                      {/* Yellow Savings Badge (Screenshot 5) */}
                      <div className="mt-2 flex items-center">
                        <span className="bg-amber-100 border border-amber-300 text-amber-900 text-[10px] font-black px-1.5 py-0.2 rounded-md flex items-center gap-0.5">
                          <span>⚡</span>
                          <span>Save Rs. {savingsNPR.toLocaleString()}</span>
                        </span>
                      </div>

                      {/* Pricing */}
                      <div className="mt-2">
                        <div className="text-sm sm:text-base font-black text-red-600">
                          {formatNPR(flashPriceUSD)}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                          <span className="line-through">{formatNPR(origPriceUSD)}</span>
                          <span className="font-mono text-slate-500">({formatPrice(flashPriceUSD)})</span>
                        </div>
                      </div>
                    </div>

                    {/* Buy Now / Grab Deal Button */}
                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => handleQuickBuy(item, e)}
                        className={`w-full py-2 rounded-xl font-black text-xs transition shadow-sm flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
                          isAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-gradient-to-r from-red-600 to-[#FF0036] hover:from-red-700 hover:to-[#E00028] text-white'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Claimed in Cart!</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Buy Now</span>
                          </>
                        )}
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Centered Red Pill Show More Option (Matching Reference Photo 2) */}
        {filteredItems.length > visibleCount ? (
          <div className="mt-8 mb-4 text-center flex flex-col items-center justify-center">
            <button
              type="button"
              onClick={() => setVisibleCount(prev => prev + 6)}
              className="bg-[#E00028] hover:bg-[#C40024] active:scale-95 text-white font-extrabold text-sm sm:text-base px-10 sm:px-14 py-2.5 sm:py-3 rounded-full shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transition-all cursor-pointer flex items-center justify-center gap-2 group"
            >
              <span>Show More</span>
              <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5] group-hover:translate-y-0.5 transition-transform" />
            </button>
            <p className="text-slate-400 text-xs mt-2.5 font-medium">
              Showing {displayedItems.length} of {filteredItems.length} Flash Deals
            </p>
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="mt-8 mb-4 text-center text-slate-400 text-xs font-semibold py-3">
            <span>✨ You've reached the end of Flash Deals for now</span>
          </div>
        ) : null}

      </div>
    </div>
  );
};
