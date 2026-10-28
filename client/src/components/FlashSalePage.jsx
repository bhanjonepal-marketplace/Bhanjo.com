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

  // Dynamic Backend Campaign Settings & Vouchers (Mascot Dhamaka Theme)
  const [campaignSettings, setCampaignSettings] = useState({
    title: 'BHANJO UTSAV DHAMAKA',
    subtitle: 'Himalayan Mega Price Crash • 100% Authentic Nepali Utsav Deals • Refreshes Hourly',
    badge_text: '🇳🇵 Bhanjo Utsav Special',
    sales_count_text: '🔥 570K+ Sold Across Nepal',
    countdown_label: 'Utsav Dhamaka Session Ends In:',
    duration_hours: 4,
    duration_minutes: 28,
    duration_seconds: 15,
    ends_at: null,
    session_name: '🪔 LIVE UTSAV RUSH',
    upcoming_sessions: [
      { id: '16:00', time: '16:00', title: '16:00 Afternoon Drop', tag: 'Soon' },
      { id: '20:00', time: '20:00', title: '20:00 Evening Dhamaka', tag: 'Popular' },
      { id: 'tomorrow', time: 'Tomorrow 10:00', title: 'Tomorrow Morning Utsav', tag: 'Huge Deals' }
    ]
  });

  const [vouchers, setVouchers] = useState([
    {
      id: 'vouch-250',
      title: 'Rs. 250 Off',
      tag: 'Dhamaka Voucher',
      expiry_text: 'Min Spend Rs. 1,000',
      code: 'DHAMAKA250',
      discount_amount: 250,
      icon: '🪔',
      color: 'amber'
    },
    {
      id: 'vouch-500',
      title: 'Rs. 500 Utsav Gift',
      tag: 'Hourly Dhamaka',
      expiry_text: 'Expiring in 2 hours',
      code: 'UTSAV500',
      discount_amount: 500,
      icon: '🎁',
      color: 'red'
    }
  ]);

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
        const valid = data.items.filter(it => {
          const p = it.product;
          return p && p.title && p.title !== 'Flash Sale Premium Item' && p.id;
        });
        setFlashItems(valid);
      }
    } catch (err) {
      console.error('Error fetching flash sale items:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch campaign settings & vouchers from backend API
  const fetchCampaignSettings = async () => {
    try {
      const res = await fetch('/api/flash-sale/settings');
      const data = await res.json();
      if (data.success) {
        if (data.settings) {
          setCampaignSettings(data.settings);
          // Sync live countdown to ends_at or duration
          if (data.settings.ends_at) {
            const diff = Math.max(0, new Date(data.settings.ends_at).getTime() - Date.now());
            const totalSecs = Math.floor(diff / 1000);
            const hours = Math.floor(totalSecs / 3600);
            const minutes = Math.floor((totalSecs % 3600) / 60);
            const seconds = totalSecs % 60;
            setMasterTime({ hours, minutes, seconds, millis: 9 });
          } else if (data.settings.duration_hours !== undefined) {
            setMasterTime({
              hours: data.settings.duration_hours || 4,
              minutes: data.settings.duration_minutes || 0,
              seconds: data.settings.duration_seconds || 0,
              millis: 9
            });
          }
        }
        if (Array.isArray(data.vouchers) && data.vouchers.length > 0) {
          setVouchers(data.vouchers);
        }
      }
    } catch (err) {
      console.warn('Error fetching campaign settings:', err);
    }
  };

  // Fetch claimed vouchers for authenticated user
  const fetchClaimedVouchers = async () => {
    if (!user) {
      setClaimedVouchers(new Set());
      return;
    }
    try {
      const token = localStorage.getItem('bhanjo_token');
      if (!token) return;
      const res = await fetch('/api/vouchers/my-claimed', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.claimedVoucherIds)) {
        setClaimedVouchers(new Set(data.claimedVoucherIds));
      }
    } catch (e) {
      console.warn('Error fetching claimed vouchers:', e);
    }
  };

  useEffect(() => {
    fetchCampaignSettings();
    fetchFlashSale();
  }, []);

  useEffect(() => {
    fetchClaimedVouchers();
  }, [user]);

  const pad = (n) => String(n).padStart(2, '0');

  // Handle claiming flash sale vouchers - STRICT ACCOUNT VERIFICATION
  const handleClaimVoucher = async (voucherId, title) => {
    if (claimedVouchers.has(voucherId)) return;

    // Check if user is logged in
    if (!user) {
      if (onRequireAuth) {
        onRequireAuth(
          () => handleClaimVoucher(voucherId, title),
          'Please sign in or create an account to claim your gift voucher!'
        );
      }
      return;
    }

    try {
      const token = localStorage.getItem('bhanjo_token');
      const res = await fetch('/api/vouchers/claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ voucherId })
      });
      const data = await res.json();
      if (data.success) {
        setClaimedVouchers(prev => new Set([...prev, voucherId]));
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      } else if (res.status === 401) {
        if (onRequireAuth) {
          onRequireAuth(() => {}, data.error || 'Please sign in to claim vouchers!');
        }
      } else {
        alert(data.error || 'Unable to claim voucher');
      }
    } catch (err) {
      setClaimedVouchers(prev => new Set([...prev, voucherId]));
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    }
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
    <div className="min-h-screen bg-[#FFF9F9] pb-16 font-sans">
      
      {/* Top Banner & Header (Unified with Outside Bhanjo Utsav Dhamaka Theme) */}
      <div className="bg-gradient-to-b from-[#FFF5F7] via-white to-[#FAF0F3] border-b border-[#E5E7EB] text-slate-900 pt-3 pb-7 px-3 sm:px-6 shadow-2xs relative overflow-hidden">
        
        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Top Navigation Row */}
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#1B1F3B] bg-white hover:bg-slate-50 border border-[#E5E7EB] px-3.5 py-1.5 rounded-full transition cursor-pointer shadow-2xs active:scale-95"
            >
              <ArrowLeft className="w-4 h-4 text-[#E11D48] stroke-[2.5]" />
              <span>Back to Marketplace</span>
            </button>

            {/* Admin Management Trigger Button */}
            {isAdmin && (
              <button
                onClick={() => {
                  if (onOpenAdminManager) onOpenAdminManager();
                  else window.open('/admin#tab-flash-sale', '_blank');
                }}
                className="bg-[#1B1F3B] hover:bg-slate-800 text-white font-bold text-xs px-3.5 py-1.5 rounded-full transition shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95 border border-slate-700"
                title="Open Flash Sale Admin Manager to edit timer, texts, upcoming events & vouchers"
              >
                <Zap className="w-3.5 h-3.5 fill-current text-yellow-300" />
                <span>⚡ Edit Flash Sale, Timers & Vouchers (Admin)</span>
              </button>
            )}
          </div>

          {/* Flash Sale Main Title & Mascot Section */}
          <div className="mt-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            
            <div className="flex items-center gap-3 sm:gap-4">
              {/* 3D Bhanjo Red Panda Mascot */}
              <div 
                className="relative flex-shrink-0 group transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                title="Bhanjo Utsav Dhamaka Mascot"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border border-rose-100 shadow-sm flex items-center justify-center overflow-hidden">
                  <img 
                    src="/mascot/bhanjo_mascot_3d_clean.png?v=3" 
                    alt="Bhanjo Red Panda Mascot" 
                    className="w-full h-full object-contain transform scale-110 group-hover:scale-125 transition-transform duration-300" 
                  />
                </div>
                <span className="absolute -bottom-1 -right-1 bg-[#1B1F3B] text-white font-black text-[9px] px-1.5 py-0.5 rounded-full shadow border border-white">
                  DHAMAKA
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-[#1B1F3B] text-white text-[10px] font-black px-2.5 py-0.5 rounded-md uppercase tracking-wider shadow-2xs flex items-center gap-1">
                    <Flame className="w-3 h-3 fill-current text-[#E11D48]" />
                    <span>{campaignSettings.badge_text || '🇳🇵 Bhanjo Utsav Special'}</span>
                  </span>
                  <span className="text-[11px] text-[#64748B] font-bold hidden sm:inline">
                    {campaignSettings.sales_count_text || '🔥 570K+ Sold Across Nepal'}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1B1F3B] tracking-tight flex items-center gap-2 mt-1">
                  <span>
                    {campaignSettings.title || 'BHANJO UTSAV DHAMAKA'}
                  </span>
                  <span className="text-[#E11D48] font-extrabold flex items-center">
                    🪔
                  </span>
                </h1>
                <p className="text-xs text-[#64748B] font-medium mt-0.5">
                  {campaignSettings.subtitle || 'Himalayan Mega Price Crash • 100% Authentic Nepali Utsav Deals • Refreshes Hourly'}
                </p>
              </div>
            </div>

            {/* Master Live Countdown matching outside box */}
            <div className="bg-white p-3 sm:p-3.5 rounded-2xl border border-[#E5E7EB] shadow-2xs flex flex-col items-center sm:items-end">
              <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider flex items-center gap-1 mb-1.5">
                <Clock className="w-3.5 h-3.5 text-[#E11D48]" />
                <span>{campaignSettings.countdown_label || 'Current Rush Session Ends In:'}</span>
              </span>

              <div className="flex items-center gap-1 font-mono font-black">
                <div className="bg-[#1B1F3B] text-white px-2.5 py-1 rounded-md text-sm sm:text-base shadow-2xs">
                  {pad(masterTime.hours)}h
                </div>
                <span className="text-[#1B1F3B]">:</span>
                <div className="bg-[#1B1F3B] text-white px-2.5 py-1 rounded-md text-sm sm:text-base shadow-2xs">
                  {pad(masterTime.minutes)}m
                </div>
                <span className="text-[#1B1F3B]">:</span>
                <div className="bg-[#1B1F3B] text-white px-2.5 py-1 rounded-md text-sm sm:text-base shadow-2xs">
                  {pad(masterTime.seconds)}s
                </div>
                <span className="text-[#1B1F3B]">.</span>
                <div className="bg-[#E11D48] text-white px-2 py-1 rounded-md text-sm sm:text-base font-black shadow-xs">
                  {masterTime.millis}
                </div>
              </div>
            </div>

          </div>

          {/* Flash Sale Daily Voucher Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
            
            <div className="bg-white rounded-xl p-3 shadow-2xs border border-[#E5E7EB] flex items-center justify-between hover:shadow-md transition-all">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-lg bg-rose-50 text-[#E11D48] flex items-center justify-center font-black text-sm border border-rose-100">
                  ⚡
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#E11D48] block uppercase">Flash Drop</span>
                  <span className="text-xs font-black text-[#1B1F3B]">Up to 70% Off Today</span>
                  <span className="text-[10px] text-slate-500 block">All categories verified</span>
                </div>
              </div>
              <span className="bg-[#E11D48] text-white text-[10px] font-black px-2.5 py-1 rounded-lg shadow-xs">
                HOT
              </span>
            </div>

            {vouchers.map((vouch) => {
              const isClaimed = claimedVouchers.has(vouch.id);

              return (
                <div key={vouch.id} className="bg-white rounded-xl p-3 shadow-2xs border border-[#E5E7EB] flex items-center justify-between hover:shadow-md transition-all">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-lg bg-rose-50 text-[#E11D48] border border-rose-100 flex items-center justify-center font-black text-sm">
                      {vouch.icon || '🎁'}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-[#E11D48] block uppercase">{vouch.tag || 'HOURLY DROP'}</span>
                      <span className="text-xs font-black text-[#1B1F3B]">{vouch.title}</span>
                      <span className="text-[10px] text-slate-500 block">{vouch.expiry_text || 'Expiring in 2 hours'}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleClaimVoucher(vouch.id, vouch.title)}
                    className={`text-[10px] font-black px-3.5 py-1.5 rounded-lg transition cursor-pointer select-none active:scale-95 ${
                      isClaimed
                        ? 'bg-emerald-600 text-white cursor-default shadow-xs'
                        : 'bg-[#E11D48] hover:bg-[#BE123C] text-white shadow-xs'
                    }`}
                  >
                    {isClaimed ? 'Claimed ✓' : 'Claim'}
                  </button>
                </div>
              );
            })}

          </div>

          {/* Time Slot Session Tabs */}
          <div className="flex items-center gap-2 mt-5 overflow-x-auto pb-1 scrollbar-none">
            
            <button
              onClick={() => setActiveSession('active')}
              className={`flex-shrink-0 px-4 py-2 rounded-xl font-black text-xs transition-all flex items-center gap-2 cursor-pointer ${
                activeSession === 'active'
                  ? 'bg-[#E11D48] text-white shadow-xs'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border border-[#E5E7EB] hover:text-[#E11D48]'
              }`}
            >
              <Flame className="w-3.5 h-3.5 fill-current text-white" />
              <span>{campaignSettings.session_name || '⚡ ONGOING RUSH'}</span>
              <span className="bg-black/20 text-white text-[9px] px-1.5 py-0.5 rounded font-mono">
                {pad(masterTime.minutes)}:{pad(masterTime.seconds)}.{masterTime.millis}
              </span>
            </button>

            {(campaignSettings.upcoming_sessions || []).map((slot, sIdx) => (
              <button
                key={slot.id || sIdx}
                onClick={() => setActiveSession(slot.id || String(sIdx))}
                className={`flex-shrink-0 px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeSession === (slot.id || String(sIdx))
                    ? 'bg-[#E11D48] text-white shadow-xs font-black'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border border-[#E5E7EB] hover:text-[#E11D48]'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{slot.title || slot.time}</span>
                {slot.tag && <span className="text-[10px] text-slate-400 font-semibold">{slot.tag}</span>}
              </button>
            ))}

          </div>

        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 -mt-3 relative z-20">
        
        {/* Category & Filter Pill Bar */}
        <div className="bg-white p-2.5 sm:p-3 rounded-2xl shadow-2xs border border-[#E5E7EB] flex items-center justify-between gap-3 flex-wrap mb-4">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
            {[
              { id: 'all', label: `All Flash Deals (${flashItems.length})` },
              { id: 'bags', label: '👜 Bags & Backpacks' },
              { id: 'electronics', label: '🎧 Audio & Tech' },
              { id: 'apparel', label: '👕 Apparel & Fashion' },
              { id: 'under1000', label: '💰 Under Rs. 1,000' },
              { id: 'over50', label: '🔥 50%+ Off Deals' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { setSelectedFilter(tab.id); setVisibleCount(12); }}
                className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer text-xs ${
                  selectedFilter === tab.id
                    ? 'bg-[#E11D48] text-white shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80 hover:border-slate-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-500 font-semibold hidden md:block">
            Showing <strong className="text-[#E11D48]">{displayedItems.length}</strong> of {filteredItems.length} Flash Items
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="bg-white rounded-2xl p-16 text-center border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 border-4 border-[#E11D48] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-bold text-slate-700">Loading verified Flash Sale drops...</p>
          </div>
        ) : displayedItems.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
            <div className="text-4xl">⚡</div>
            <h3 className="text-base font-bold text-slate-800">No Flash Sale deals match this filter</h3>
            <p className="text-xs text-slate-500">Try choosing 'All Flash Deals' to see all discounted items.</p>
            <button
              onClick={() => setSelectedFilter('all')}
              className="mt-2 bg-[#E11D48] hover:bg-[#BE123C] text-white font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer"
            >
              View All Flash Deals
            </button>
          </div>
        ) : (
          /* Products Grid - Compact and fitly adjusted matching Outside Bhanjo Utsav Dhamaka box */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-2.5">
            {displayedItems.map((item, index) => {
              const prod = item.product;
              const flashPriceUSD = item.flash_price;
              const origPriceUSD = item.original_price || flashPriceUSD * 1.5;
              const discountPercent = item.discount_percent || Math.round(((origPriceUSD - flashPriceUSD) / origPriceUSD) * 100);
              const percentSold = Math.min(95, Math.max(25, Math.round((item.sold_stock / item.total_stock) * 100) || 45));
              
              // Dynamic live item countdown with milliseconds
              const itemSecs = (masterTime.seconds + (index * 7)) % 60;
              const itemMins = (masterTime.minutes + (index * 3)) % 60;
              const itemMillis = (masterTime.millis + index) % 10;
              const isAdded = justAddedId === item.id;

              return (
                <div
                  key={item.id}
                  onClick={() => onSelectProduct && onSelectProduct(prod.id)}
                  className="group bg-white rounded-2xl border border-rose-100/90 hover:border-[#E11D48] shadow-2xs hover:shadow-md transition-all duration-200 p-2 sm:p-2.5 flex flex-col justify-between overflow-hidden cursor-pointer relative"
                >
                  {/* Thumbnail Image Container - Compact matching outside box */}
                  <div>
                    <div className="relative aspect-[1.5/1] rounded-xl overflow-hidden bg-[#EEF1F4] mb-1.5 flex items-center justify-center">
                      <img
                        src={prod.images?.[0] || prod.image || 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80'}
                        alt={prod.title}
                        className="w-full h-full object-contain p-1.5 group-hover:scale-105 transition-transform duration-200"
                        loading="lazy"
                      />

                      {/* Top Discount Tag */}
                      <span className="absolute top-1 left-1 text-[8px] font-black px-1.5 py-0.5 rounded shadow-2xs z-10 bg-[#1B1F3B] text-white leading-none">
                        -{discountPercent}%
                      </span>

                      {/* Mall Tag */}
                      <span className="absolute top-1 right-1 text-[7.5px] font-black px-1.5 py-0.5 rounded shadow-2xs z-10 bg-white/95 text-[#1B1F3B] border border-slate-100 leading-none">
                        BHANJO MALL
                      </span>
                    </div>

                    {/* Crimson DHAMAKA strip */}
                    <div className="bg-[#E11D48] text-white px-1.5 py-0.5 text-[8.5px] font-bold flex justify-between items-center rounded-sm mb-1 leading-tight">
                      <span className="uppercase tracking-tight font-black">DHAMAKA</span>
                      <span className="font-mono text-[8.5px]">{pad(itemMins)}:{pad(itemSecs)}.{itemMillis} Left</span>
                    </div>

                    {/* Title */}
                    <h3 
                      className="text-[11px] sm:text-[11.5px] font-bold text-[#1B1F3B] line-clamp-2 leading-[1.25] group-hover:text-[#E11D48] transition min-h-[29px]"
                      title={prod.title}
                    >
                      {prod.title}
                    </h3>

                    {/* Stock / Sold Progress Bar */}
                    <div className="mt-1 space-y-0.5">
                      <div className="flex items-center justify-between text-[9px]">
                        <span className="font-bold text-[#E11D48] flex items-center gap-0.5">
                          <Flame className="w-2.5 h-2.5 fill-current" />
                          <span>Sold {percentSold}%</span>
                        </span>
                        <span className="text-slate-400 text-[8.5px]">
                          {item.total_stock - item.sold_stock} left
                        </span>
                      </div>
                      <div className="w-full h-1 bg-rose-100/60 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#E11D48] rounded-full transition-all duration-300"
                          style={{ width: `${percentSold}%` }}
                        />
                      </div>
                    </div>

                    {/* Price Row */}
                    <div className="mt-1 flex items-baseline gap-1 flex-wrap">
                      <span className="text-[14px] sm:text-[15px] font-black text-[#1B1F3B]">
                        {formatNPR(flashPriceUSD)}
                      </span>
                      <span className="text-[9.5px] text-[#94A3B8] line-through">
                        {formatNPR(origPriceUSD)}
                      </span>
                    </div>
                  </div>

                  {/* Buy Now / Grab Deal Button */}
                  <button
                    type="button"
                    onClick={(e) => handleQuickBuy(item, e)}
                    className={`mt-2 w-full py-1.5 rounded-lg font-bold text-[11px] transition shadow-xs flex items-center justify-center gap-1 cursor-pointer active:scale-95 ${
                      isAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#E11D48] hover:bg-[#BE123C] text-white'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Claimed in Cart!</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-3 h-3 fill-current text-white" />
                        <span>Loot Deal</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Centered Show More Option */}
        {filteredItems.length > visibleCount ? (
          <div className="mt-8 mb-4 text-center flex flex-col items-center justify-center">
            <button
              type="button"
              onClick={() => setVisibleCount(prev => prev + 6)}
              className="bg-[#E11D48] hover:bg-[#BE123C] active:scale-95 text-white font-extrabold text-xs sm:text-sm px-10 sm:px-14 py-2.5 sm:py-3 rounded-full shadow-md shadow-rose-500/20 hover:shadow-lg hover:shadow-rose-500/30 transition-all cursor-pointer flex items-center justify-center gap-2 group"
            >
              <span>Show More Dhamaka Deals</span>
              <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5] group-hover:translate-y-0.5 transition-transform" />
            </button>
            <p className="text-slate-400 text-xs mt-2.5 font-medium">
              Showing {displayedItems.length} of {filteredItems.length} Dhamaka Deals
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
