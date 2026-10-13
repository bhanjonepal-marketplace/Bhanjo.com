import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Search, ShoppingCart, User, Menu, X, ChevronDown, Check,
  Store, HelpCircle, PhoneCall, Globe, Layers,
  MapPin, Sparkles, Zap, Gift, Flame, Heart, Truck,
  LogOut, Package, Clock, ArrowRight, ArrowLeft, Tag, Star, ShieldCheck, Eye, Camera, Image as ImageIcon, Smartphone
} from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES } from '../data/categories';
import { PRODUCTS } from '../data/products';
import { matchesProductSearch, getWordVariants } from '../utils/searchMatcher';
import { ImageSearchModal } from './ImageSearchModal';
import { performVisualSearch } from '../utils/visualSearchEngine';

export const Navbar = ({
  onToggleMegaMenu,
  isMegaMenuOpen,
  onOpenCart,
  onOpenTrackOrder,
  onOpenAuthModal,
  onOpenAdminUnlock,
  onSelectCategory,
  searchQuery: externalSearchQuery = '',
  onSearch,
  onSelectProduct,
  activeView,
  setActiveView,
  products = [],
  onVisualSearch,
  onResetToHome,
  isHomeActive = true
}) => {
  const { currency, setCurrency, currencies, language, setLanguage, formatPrice, t } = useCurrency();
  const { cartCount } = useCart();
  const { user, logout, wishlist, userOrders, isAdmin, setAdminMode } = useAuth();

  const [searchQuery, setSearchQuery] = useState(externalSearchQuery);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolledUserMenuOpen, setIsScrolledUserMenuOpen] = useState(false);
  const [searchScope, setSearchScope] = useState('All');
  const [isScopeDropdownOpen, setIsScopeDropdownOpen] = useState(false);
  const [isImageSearchOpen, setIsImageSearchOpen] = useState(false);
  const [isImagePopoverOpen, setIsImagePopoverOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const saved = localStorage.getItem('bhanjo_recent_searches');
      return saved ? JSON.parse(saved) : ['Cashmere Pashmina', 'Ilam Tea', 'Wireless Earbuds'];
    } catch {
      return ['Cashmere Pashmina', 'Ilam Tea', 'Wireless Earbuds'];
    }
  });

  // High-performance RAF scroll listener with hysteresis to eliminate all lag and jitter
  const [isScrolled, setIsScrolled] = useState(false);

  // Restore desktop upper part (logo, cart, wishlist, profile/login, currency/language, track order)
  const SHOW_UPPER_PART = true;

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollPos = window.scrollY || document.documentElement.scrollTop;
          // Smooth hysteresis threshold: shrink after 35px, expand when < 15px
          setIsScrolled((prev) => {
            if (!prev && scrollPos > 35) return true;
            if (prev && scrollPos < 15) return false;
            return prev;
          });
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const searchContainerRef = useRef(null);
  const scopeRef = useRef(null);
  const userMenuRef = useRef(null);
  const scrolledUserMenuRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const imagePopoverRef = useRef(null);
  const popoverCloseTimeoutRef = useRef(null);

  const handleCameraMouseEnter = () => {
    if (popoverCloseTimeoutRef.current) {
      clearTimeout(popoverCloseTimeoutRef.current);
      popoverCloseTimeoutRef.current = null;
    }
    setIsSearchFocused(false);
    setIsImagePopoverOpen(true);
  };

  const handleCameraMouseLeave = () => {
    popoverCloseTimeoutRef.current = setTimeout(() => {
      setIsImagePopoverOpen(false);
    }, 280);
  };

  const handlePopoverMouseEnter = () => {
    if (popoverCloseTimeoutRef.current) {
      clearTimeout(popoverCloseTimeoutRef.current);
      popoverCloseTimeoutRef.current = null;
    }
  };

  const handlePopoverMouseLeave = () => {
    popoverCloseTimeoutRef.current = setTimeout(() => {
      setIsImagePopoverOpen(false);
    }, 250);
  };

  // Directly open file picker on camera click
  const handleCameraClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSearchFocused(false);
    setIsImagePopoverOpen(true);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processSelectedImage(e.target.files[0]);
    }
  };

  const processSelectedImage = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target.result;
      setUploadedImage(dataUrl);
      setUploadedFileName(file.name);
      setIsImagePopoverOpen(true);
      executeVisualSearch(dataUrl, file.name);
    };
    reader.readAsDataURL(file);
  };

  const executeVisualSearch = async (imgData = uploadedImage, name = uploadedFileName) => {
    if (!imgData) return;
    setIsAnalyzingImage(true);
    try {
      const result = await performVisualSearch({
        imageSrc: imgData,
        fileName: name,
        products: (products && products.length > 0) ? products : PRODUCTS
      });
      setIsImagePopoverOpen(false);
      if (onVisualSearch) {
        onVisualSearch({
          ...result,
          imageSrc: imgData,
          fileName: name
        });
      }
    } catch (err) {
      console.error('Visual search error:', err);
    } finally {
      setIsAnalyzingImage(false);
    }
  };

  // Support pasting image with Ctrl+V / Cmd+V
  useEffect(() => {
    const handlePaste = (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.type && item.type.indexOf('image') !== -1) {
          const file = item.getAsFile();
          if (file) {
            processSelectedImage(file);
            break;
          }
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [products]);

  // Sync external search query changes with local state
  useEffect(() => {
    setSearchQuery(externalSearchQuery || '');
  }, [externalSearchQuery]);

  const trendingSearches = [
    "Cashmere Pashmina", "Ilam Orthodox Tea", "Wireless Earbuds",
    "Winter Jacket", "Yak Dog Chew", "Shilajit 50g", "Handmade Singing Bowl"
  ];

  // Save query to recent searches
  const saveRecentSearch = (kw) => {
    if (!kw || !kw.trim()) return;
    const cleanKw = kw.trim();
    setRecentSearches(prev => {
      const updated = [cleanKw, ...prev.filter(item => item.toLowerCase() !== cleanKw.toLowerCase())].slice(0, 6);
      try {
        localStorage.setItem('bhanjo_recent_searches', JSON.stringify(updated));
      } catch (e) {
        // ignore storage error
      }
      return updated;
    });
  };

  const removeRecentSearch = (e, kw) => {
    e.stopPropagation();
    setRecentSearches(prev => {
      const updated = prev.filter(item => item !== kw);
      try {
        localStorage.setItem('bhanjo_recent_searches', JSON.stringify(updated));
      } catch (e) { }
      return updated;
    });
  };

  const clearAllRecent = (e) => {
    e.stopPropagation();
    setRecentSearches([]);
    try {
      localStorage.removeItem('bhanjo_recent_searches');
    } catch (e) { }
  };

  // Close dropdowns on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsSearchFocused(false);
      }
      if (scopeRef.current && !scopeRef.current.contains(e.target)) {
        setIsScopeDropdownOpen(false);
      }
      if (imagePopoverRef.current && !imagePopoverRef.current.contains(e.target)) {
        setIsImagePopoverOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
      if (scrolledUserMenuRef.current && !scrolledUserMenuRef.current.contains(e.target)) {
        setIsScrolledUserMenuOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsSearchFocused(false);
        setIsUserMenuOpen(false);
        setIsScrolledUserMenuOpen(false);
        setIsImagePopoverOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Compute live search suggestions
  const liveProductMatches = useMemo(() => {
    const q = searchQuery.trim();
    if (!q) return [];
    const pool = (products && products.length > 0) ? products : PRODUCTS;
    return pool.filter(prod => matchesProductSearch(prod, q)).slice(0, 6);
  }, [searchQuery, products]);

  const liveCategoryMatches = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    const variants = getWordVariants(q);
    return CATEGORIES.filter(cat => {
      const catWords = cat.name.toLowerCase().split(/[^a-z0-9]+/);
      const subWords = (cat.subcategories || []).join(' ').toLowerCase().split(/[^a-z0-9]+/);
      const allCatWords = [...catWords, ...subWords];
      const nepaliWords = (cat.nepaliName || '').toLowerCase().split(/[^a-z0-9\u0900-\u097F]+/);
      const allWords = [...allCatWords, ...nepaliWords];
      return variants.some(v => allWords.some(cw => cw === v || (v.length >= 4 && cw.startsWith(v))));
    }).slice(0, 3);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    setIsSearchFocused(false);
    if (searchQuery.trim()) {
      saveRecentSearch(searchQuery);
    }
    if (onSearch) {
      onSearch(searchQuery.trim());
    }
  };

  const handleSelectKeyword = (kw) => {
    setSearchQuery(kw);
    saveRecentSearch(kw);
    setIsSearchFocused(false);
    if (onSearch) {
      onSearch(kw);
    }
  };

  const handleSelectProductSuggestion = (prod) => {
    setIsSearchFocused(false);
    if (onSelectProduct) {
      onSelectProduct(prod.id);
    }
  };

  const handleSelectCategorySuggestion = (catId) => {
    setIsSearchFocused(false);
    setSearchQuery('');
    if (onSelectCategory) {
      onSelectCategory(catId);
    }
  };

  const handleClearInput = () => {
    setSearchQuery('');
    if (onSearch) {
      onSearch('');
    }
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const renderUserDropdownMenu = (isOpen, setIsOpen) => {
    if (!isOpen || !user) return null;
    return (
      <div className="absolute right-0 top-full mt-2.5 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-3 z-50 animate-in fade-in zoom-in-95 duration-150 text-xs">
        
        {/* User Identity Header Card */}
        <div className="p-3 mb-2.5 bg-gradient-to-br from-orange-50/90 via-white to-amber-50/40 rounded-xl border border-orange-100/80 flex items-center gap-3 shadow-2xs">
          <div className="w-11 h-11 rounded-full overflow-hidden bg-[#F85606] text-white text-sm flex items-center justify-center font-black flex-shrink-0 shadow-xs border-2 border-white ring-2 ring-orange-200">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              user.name ? user.name[0].toUpperCase() : 'U'
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-bold text-sm text-slate-900 truncate leading-snug">{user.name}</div>
            <div className="text-[11px] text-slate-500 truncate mt-0.5">{user.email || user.phone}</div>
          </div>
        </div>

        {/* Menu Items List with Roomy Spacing */}
        <div className="space-y-1">

          {/* 1. My Profile & Settings */}
          <button
            onClick={() => {
              setActiveView('profile');
              setIsOpen(false);
            }}
            className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-orange-50/70 text-slate-800 transition flex items-center justify-between font-semibold cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange-100/70 text-[#F85606] flex items-center justify-center flex-shrink-0 transition group-hover:bg-[#F85606] group-hover:text-white">
                <User className="w-4 h-4" />
              </div>
              <span className="group-hover:text-[#F85606] transition">My Profile & Settings</span>
            </div>
            <span className="text-[10px] bg-orange-100 text-[#F85606] font-bold px-2 py-0.5 rounded-md">Edit</span>
          </button>

          {/* 2. My Orders */}
          <button
            onClick={() => {
              setActiveView('my-orders');
              setIsOpen(false);
            }}
            className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700 transition flex items-center justify-between font-medium cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center flex-shrink-0 transition group-hover:bg-[#F85606] group-hover:text-white">
                <Package className="w-4 h-4" />
              </div>
              <span className="group-hover:text-slate-900 font-semibold transition">My Orders</span>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {userOrders.length}
            </span>
          </button>

          {/* 3. My Cart */}
          <button
            onClick={() => {
              setActiveView('cart');
              setIsOpen(false);
            }}
            className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700 transition flex items-center justify-between font-medium cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center flex-shrink-0 transition group-hover:bg-[#F85606] group-hover:text-white">
                <ShoppingCart className="w-4 h-4" />
              </div>
              <span className="group-hover:text-slate-900 font-semibold transition">My Cart</span>
            </div>
            {cartCount > 0 && (
              <span className="text-[10px] bg-[#F85606] text-white font-bold px-2 py-0.5 rounded-full shadow-2xs">
                {cartCount}
              </span>
            )}
          </button>

          {/* 4. My Wishlist */}
          <button
            onClick={() => {
              setActiveView('wishlist');
              setIsOpen(false);
            }}
            className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700 transition flex items-center justify-between font-medium cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center flex-shrink-0 transition group-hover:bg-red-500 group-hover:text-white">
                <Heart className="w-4 h-4" />
              </div>
              <span className="group-hover:text-slate-900 font-semibold transition">My Wishlist</span>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-600">
              {wishlist.length}
            </span>
          </button>

          {/* 5. Saved Delivery Addresses */}
          <button
            onClick={() => {
              setActiveView('addresses');
              setIsOpen(false);
            }}
            className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700 transition flex items-center gap-3 font-semibold cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 transition group-hover:bg-emerald-600 group-hover:text-white">
              <MapPin className="w-4 h-4" />
            </div>
            <span className="group-hover:text-slate-900 transition">Delivery Addresses</span>
          </button>

          {/* 6. Track Parcels */}
          <button
            onClick={() => {
              onOpenTrackOrder('');
              setIsOpen(false);
            }}
            className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-sky-50 text-slate-700 transition flex items-center gap-3 font-semibold cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center flex-shrink-0 transition group-hover:bg-sky-600 group-hover:text-white">
              <Truck className="w-4 h-4" />
            </div>
            <span className="group-hover:text-sky-600 transition">Track Parcels</span>
          </button>

        </div>

        {/* Sign Out Section with Breathing Room */}
        <div className="mt-2 pt-2 border-t border-slate-100">
          <button
            onClick={() => {
              logout();
              setActiveView('marketplace');
              setIsOpen(false);
            }}
            className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-red-50 text-red-600 transition flex items-center gap-3 font-bold cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0 transition group-hover:bg-red-600 group-hover:text-white">
              <LogOut className="w-4 h-4" />
            </div>
            <span>Sign Out</span>
          </button>
        </div>

      </div>
    );
  };

  return (
    <>

      {/* 1. Top Bhanjo Utility Micro Strip (Desktop / Laptop only - shown on Home page, hidden on Category views) */}
      {(SHOW_UPPER_PART && isHomeActive) && (
        <div className="hidden sm:block bg-[#f8f8f8] text-[#757575] text-[10px] sm:text-[11px] px-3 sm:px-8 py-1 border-b border-slate-200">
        <div className="max-w-[1560px] mx-auto flex items-center justify-between">

          <div className="flex items-center gap-2 sm:gap-4">

            {/* Track My Order */}
            <button
              onClick={() => onOpenTrackOrder('')}
              className="hover:text-sky-600 transition flex items-center gap-1 font-semibold text-slate-700 cursor-pointer"
            >
              <Truck className="w-3.5 h-3.5 text-sky-500" />
              <span>{t('trackOrder')}</span>
            </button>

            <span className="hidden md:inline text-slate-300">|</span>

            <span className="hidden md:inline text-slate-500">
              {t('helpline')}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">

            {/* Currency (Fixed NPR only, visible sm+) */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs">
              <span className="text-slate-400">{t('currencyLabel')}</span>
              <span className="font-bold text-[11px] text-slate-800 flex items-center gap-1">
                <span>🇳🇵</span>
                <span>NPR (Rs.)</span>
              </span>
            </div>

            <span className="hidden sm:inline text-slate-300">|</span>

            {/* Language Switcher (Active Visual Indicator) */}
            <div className="flex items-center bg-slate-200/80 p-0.5 rounded-md text-[10px] sm:text-[11px] font-bold">
              <button
                onClick={() => setLanguage('en')}
                className={`px-1.5 sm:px-2 py-0.5 rounded transition ${language === 'en'
                    ? 'bg-[#F85606] text-white shadow-2xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                  }`}
                title="Switch interface to English"
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('ne')}
                className={`px-1.5 sm:px-2 py-0.5 rounded transition ${language === 'ne'
                    ? 'bg-[#F85606] text-white shadow-2xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                  }`}
                title="नेपाली भाषामा बदल्नुहोस्"
              >
                नेपाली
              </button>
            </div>

            <span className="text-slate-300">|</span>

            {/* User Account / Login Dropdown */}
            <div ref={userMenuRef} className="relative">
              {user ? (
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-1 sm:gap-1.5 font-bold text-slate-800 hover:text-[#F85606] transition"
                >
                  <div className="w-5 h-5 rounded-full overflow-hidden bg-[#F85606] text-white text-[10px] flex items-center justify-center font-black flex-shrink-0 shadow-xs border border-orange-200">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user.name ? user.name[0].toUpperCase() : 'U'
                    )}
                  </div>
                  <span className="max-w-[70px] sm:max-w-[110px] truncate">{user.name.split(' ')[0]}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>
              ) : (
                <button
                  onClick={() => onOpenAuthModal()}
                  className="font-bold text-[#F85606] hover:underline flex items-center gap-1 text-[11px]"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>{t('loginSignup')}</span>
                </button>
              )}

              {/* User Dropdown Menu */}
              {renderUserDropdownMenu(isUserMenuOpen, setIsUserMenuOpen)}
            </div>

          </div>

        </div>
      </div>
      )}

      {/* 2. Main Sticky Header Bar (Sleek Alibaba/Taobao shrink-on-scroll with GPU hardware acceleration) */}
      <header 
        style={{ position: 'sticky', top: 0, zIndex: 50 }}
        className={`sticky top-0 z-50 bg-white/95 backdrop-blur-md transition-[padding,box-shadow,border-color] duration-200 ease-out border-b ${
          isScrolled ? 'py-1.5 sm:py-2 shadow-md border-slate-200/90' : 'py-2 sm:py-3.5 shadow-xs border-slate-200'
        }`}
      >
        <div className="px-3 sm:px-8">
          <div className="max-w-[1560px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4">

            {/* Mobile Header Row 1: Brand Logo + Mobile Wishlist & Cart (Disabled for mobile per user request) */}
            {false && (
              <div className="flex sm:hidden items-center justify-between w-full">
              <div className="flex items-center gap-1.5">
                <div
                  onClick={() => {
                    if (onResetToHome) {
                      onResetToHome();
                    } else {
                      setActiveView('marketplace');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className="flex items-center cursor-pointer flex-shrink-0 group select-none py-0.5"
                  title="Bhanjo | Nepal's Premier Online Shopping Platform"
                >
                  <img
                    src="/bhanjo-logo-horizontal.png"
                    alt="भान्जो Bhanjo"
                    className="h-7 w-auto object-contain"
                  />
                </div>
              </div>

              {/* Mobile Right Icons: Scrolled Auth / Wishlist / Cart */}
              <div className="flex items-center gap-1">
                {isScrolled && user && (
                  <div className="relative mr-1">
                    <button
                      type="button"
                      onClick={() => setIsScrolledUserMenuOpen(!isScrolledUserMenuOpen)}
                      className="p-1 rounded-lg bg-orange-50 text-slate-800 border border-orange-200"
                    >
                      <div className="w-5 h-5 rounded-full overflow-hidden bg-[#F85606] text-white text-[9px] flex items-center justify-center font-black">
                        {user.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" /> : (user.name ? user.name[0].toUpperCase() : 'U')}
                      </div>
                    </button>
                    {renderUserDropdownMenu(isScrolledUserMenuOpen, setIsScrolledUserMenuOpen)}
                  </div>
                )}

                <button
                  onClick={() => {
                    if (!user) {
                      onOpenAuthModal('Please login or sign up to access your Wishlist');
                    } else {
                      setActiveView('wishlist');
                    }
                  }}
                  className="relative p-1.5 text-slate-700 hover:text-red-500 transition"
                  title="My Wishlist"
                >
                  <Heart className="w-5 h-5" />
                  {user && wishlist.length > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white font-black text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center">
                      {wishlist.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => {
                    if (!user) {
                      onOpenAuthModal('Please login or sign up to access your Shopping Cart');
                    } else {
                      onOpenCart();
                    }
                  }}
                  className="relative p-1.5 text-slate-700 hover:text-[#F85606] transition flex items-center gap-1"
                  title="Shopping Cart"
                >
                  <div className="relative">
                    <ShoppingCart className="w-5 h-5" />
                    {user && cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-[#F85606] text-white font-black text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </div>
                </button>
              </div>
            </div>
            )}

            {/* Desktop Brand Logo (sm+ only, hidden temporarily per user request) */}
            {SHOW_UPPER_PART && (
              <div className="hidden sm:flex items-center gap-2.5 flex-shrink-0">
                <div
                  onClick={() => {
                    if (onResetToHome) {
                      onResetToHome();
                    } else {
                      setActiveView('marketplace');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className="flex items-center cursor-pointer flex-shrink-0 group select-none py-0.5"
                  title="Bhanjo | Nepal's Premier Online Shopping Platform"
                >
                  <img
                    src="/bhanjo-logo-horizontal.png"
                    alt="भान्जो Bhanjo"
                    className={`w-auto object-contain transition-all duration-300 group-hover:scale-[1.04] ${
                      isScrolled ? 'h-8 sm:h-9' : 'h-10 sm:h-11 md:h-[48px]'
                    }`}
                  />
                </div>
              </div>
            )}

            {/* Taobao-Style Search Area: Search Pill + "Search for similar items" Button */}
            <div className={`w-full ${SHOW_UPPER_PART ? 'sm:flex-1 sm:max-w-3xl sm:mx-2 md:mx-4' : 'max-w-4xl mx-auto'} flex items-center gap-2`}>
              <div ref={searchContainerRef} className="flex-1 relative">
                <form
                  onSubmit={handleSearchSubmit}
                  className="w-full flex items-center bg-white rounded-2xl overflow-hidden border-2 border-[#FF5000] focus-within:border-[#F85606] transition-all duration-200 shadow-xs p-0.5"
                >
                  {/* Category Scope Dropdown (Taobao-style e.g. Baby ⌄, All ⌄) */}
                  <div className="relative flex-shrink-0" ref={scopeRef}>
                    <button
                      type="button"
                      onClick={() => setIsScopeDropdownOpen(!isScopeDropdownOpen)}
                      className="flex items-center gap-1 pl-3 pr-2 py-1.5 text-xs font-bold text-slate-700 hover:text-[#FF5000] transition cursor-pointer select-none"
                    >
                      <span>{searchScope}</span>
                      <ChevronDown className="w-3 h-3 text-slate-400" />
                    </button>

                    {isScopeDropdownOpen && (
                      <div className="absolute left-0 top-full mt-2 w-40 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-60 text-xs font-semibold animate-in fade-in zoom-in-95 duration-100">
                        {[
                          { id: 'all', label: 'All Products', short: 'All' },
                          { id: 'mall', label: 'Bhanjo Mall', short: 'Mall' },
                          { id: 'nepal', label: 'Nepal Pavilion', short: 'Nepal' },
                          { id: 'direct', label: 'Global Direct', short: 'Direct' }
                        ].map(item => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              setSearchScope(item.short);
                              setIsScopeDropdownOpen(false);
                              if (item.id === 'mall') {
                                setActiveView('marketplace');
                              } else if (item.id === 'nepal') {
                                setActiveView('nepal-pavilion');
                              }
                            }}
                            className={`w-full text-left px-3 py-1.5 transition flex items-center justify-between hover:bg-orange-50 hover:text-[#FF5000] cursor-pointer ${
                              searchScope === item.short ? 'text-[#FF5000] bg-orange-50/60 font-bold' : 'text-slate-700'
                            }`}
                          >
                            <span>{item.label}</span>
                            {searchScope === item.short && <Check className="w-3.5 h-3.5 text-[#FF5000]" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Subtle Vertical Divider */}
                  <div className="w-[1px] h-4 bg-slate-200 flex-shrink-0 mx-0.5"></div>

                  {/* Search Input */}
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder={t('searchPlaceholder') || 'Search in Bhanjo'}
                    value={searchQuery}
                    onFocus={() => {
                      setIsSearchFocused(true);
                      setIsImagePopoverOpen(false);
                    }}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setIsSearchFocused(true);
                      if (onSearch) onSearch(e.target.value);
                    }}
                    className="flex-1 px-2.5 text-sm bg-transparent text-slate-800 focus:outline-none placeholder-slate-400 placeholder:text-sm font-medium py-1.5 min-w-0"
                  />

                  {/* Hidden file input for direct device upload */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />

                  {/* Clear button (X) when text exists */}
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={handleClearInput}
                      className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 mr-0.5 transition cursor-pointer"
                      title="Clear search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* Camera Icon inside search bar (for desktop & mobile) */}
                  <button
                    type="button"
                    onClick={handleCameraClick}
                    onMouseEnter={handleCameraMouseEnter}
                    onMouseLeave={handleCameraMouseLeave}
                    title="Search by image or find similar items"
                    className="p-1 sm:p-1.5 text-[#FF5000] hover:bg-orange-50 rounded-xl transition-all active:scale-95 flex items-center justify-center mr-1.5 cursor-pointer group"
                    aria-label="Search by image"
                  >
                    <Camera className="w-5.5 h-5.5 sm:w-6 sm:h-6 text-[#FF5000] group-hover:scale-110 transition-transform stroke-[2.2]" />
                  </button>

                  {/* Solid Orange Primary Search Button (Taobao Style) */}
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-[#FF7A00] to-[#FF5000] hover:from-[#f06e00] hover:to-[#e04500] text-white rounded-xl text-xs sm:text-sm font-black flex items-center justify-center transition-all duration-200 px-4 sm:px-6 py-2 cursor-pointer shadow-xs active:scale-95 flex-shrink-0"
                  >
                    <span>{t('searchBtn') || 'Search'}</span>
                  </button>
                </form>

            {/* Floating Image Search Popover Dropdown (Reveals on Cursor Touch) */}
            {isImagePopoverOpen && (
              <div
                ref={imagePopoverRef}
                onMouseEnter={handlePopoverMouseEnter}
                onMouseLeave={handlePopoverMouseLeave}
                className="absolute left-0 right-0 top-full mt-2 before:absolute before:-top-3 before:left-0 before:right-0 before:h-3 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 p-4 sm:p-5 animate-in fade-in zoom-in-95 duration-150"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Popover Header */}
                <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-orange-100 text-[#F85606] flex items-center justify-center">
                      <Camera className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-800">
                      Visual Search Lens
                    </span>
                  </div>
                  <button
                    onClick={() => setIsImagePopoverOpen(false)}
                    className="text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Dashed Upload Box */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDraggingImage(true); }}
                  onDragLeave={() => setIsDraggingImage(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDraggingImage(false);
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      processSelectedImage(e.dataTransfer.files[0]);
                    }
                  }}
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                    isDraggingImage ? 'border-orange-500 bg-orange-50' : 'border-slate-200 bg-slate-50/50'
                  }`}
                >
                  {/* STATE 1: Image Uploaded (Matches User Screenshot 1) */}
                  {uploadedImage ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-center gap-3">
                        {/* Thumbnail with X to delete */}
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white border border-slate-300 shadow-sm group">
                          <img src={uploadedImage} alt="Uploaded" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setUploadedImage(null);
                              setUploadedFileName('');
                            }}
                            className="absolute top-1 right-1 w-5 h-5 bg-black/75 hover:bg-black text-white rounded-full flex items-center justify-center text-xs transition shadow-xs cursor-pointer"
                            title="Remove photo"
                          >
                            ✕
                          </button>
                        </div>

                        {/* + Upload (1/6) button */}
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-300 hover:border-orange-500 hover:bg-orange-50 flex flex-col items-center justify-center text-slate-500 hover:text-orange-600 cursor-pointer transition text-xs font-bold gap-0.5"
                        >
                          <span className="text-lg font-light text-slate-400">+</span>
                          <span className="text-[11px] font-bold">Upload</span>
                          <span className="text-[10px] text-slate-400 font-normal">(1/6)</span>
                        </div>
                      </div>

                      {/* Search images Button (Screenshot 1) */}
                      <button
                        type="button"
                        disabled={isAnalyzingImage}
                        onClick={() => executeVisualSearch(uploadedImage, uploadedFileName)}
                        className="w-full max-w-xs mx-auto bg-gradient-to-r from-[#FF7A00] to-[#F85606] hover:from-[#f06e00] hover:to-[#e04e05] text-white font-extrabold text-sm py-2.5 rounded-xl shadow-md shadow-orange-500/20 transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {isAnalyzingImage ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Searching catalog...</span>
                          </>
                        ) : (
                          <>
                            <Search className="w-4 h-4 stroke-[2.5]" />
                            <span>Search images</span>
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    /* STATE 2: Empty State (Matches User Screenshot 2) */
                    <div className="space-y-4">
                      <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-200 text-orange-600 flex items-center justify-center mx-auto shadow-2xs">
                        <ImageIcon className="w-6 h-6 stroke-[1.8]" />
                      </div>

                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-slate-700">
                          Drag and drop an image here to upload
                        </p>
                      </div>

                      {/* Upload Button (Screenshot 2) */}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full max-w-xs mx-auto bg-gradient-to-r from-[#FF7A00] to-[#F85606] hover:from-[#f06e00] hover:to-[#e04e05] text-white font-extrabold text-sm py-2.5 rounded-xl shadow-md shadow-orange-500/20 transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>Upload</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Smart Search Suggestions & History Dropdown */}
            {isSearchFocused && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100 max-h-[80vh] overflow-y-auto">

                {/* STATE A: User is typing (Live Products & Categories Autocomplete) */}
                {searchQuery.trim().length > 0 ? (
                  <div className="py-2">

                    {/* Matching Categories */}
                    {liveCategoryMatches.length > 0 && (
                      <div className="px-3 py-2 border-b border-slate-100">
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                          <Tag className="w-3 h-3 text-[#F85606]" />
                          <span>Categories</span>
                        </div>
                        <div className="space-y-1">
                          {liveCategoryMatches.map(cat => (
                            <button
                              key={cat.id}
                              onClick={() => handleSelectCategorySuggestion(cat.id)}
                              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-orange-50 text-xs text-slate-700 hover:text-[#F85606] flex items-center justify-between transition"
                            >
                              <span className="font-medium">Search for "{searchQuery}" in <strong className="text-slate-900">{cat.name}</strong></span>
                              <span className="text-[10px] text-slate-400">Category</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Matching Products */}
                    <div className="px-3 py-2">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-[#F85606]" />
                          <span>Matching Products ({liveProductMatches.length})</span>
                        </span>
                        {liveProductMatches.length > 0 && (
                          <span className="text-[10px] text-slate-400 lowercase font-normal">click to view item</span>
                        )}
                      </div>

                      {liveProductMatches.length === 0 ? (
                        <div className="py-4 text-center text-slate-400 text-xs">
                          No direct product matches for "{searchQuery}". Press Enter to view all results.
                        </div>
                      ) : (
                        <div className="divide-y divide-slate-100">
                          {liveProductMatches.map(prod => (
                            <div
                              key={prod.id}
                              onClick={() => handleSelectProductSuggestion(prod)}
                              className="p-2 rounded-lg hover:bg-orange-50 cursor-pointer transition flex items-center gap-3 group"
                            >
                              <img
                                src={prod.images?.[0] || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=100'}
                                alt={prod.title}
                                className="w-11 h-11 object-cover rounded-md border border-slate-200 flex-shrink-0 group-hover:scale-105 transition"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-semibold text-slate-800 group-hover:text-[#F85606] truncate">
                                  {prod.title}
                                </div>
                                <div className="flex items-center gap-2 mt-0.5 text-[11px]">
                                  <span className="text-[#F85606] font-extrabold">{formatPrice(prod.samplePrice)}</span>
                                  <span className="text-slate-300">•</span>
                                  <span className="text-slate-500 truncate">{prod.categoryName}</span>
                                  {prod.rating && (
                                    <>
                                      <span className="text-slate-300">•</span>
                                      <span className="flex items-center gap-0.5 text-amber-500 font-medium">
                                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                        {prod.rating}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#F85606] group-hover:translate-x-0.5 transition" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* View All Search Results Footer */}
                    <div className="mt-1 pt-2 border-t border-slate-100 px-3 pb-1">
                      <button
                        onClick={handleSearchSubmit}
                        className="w-full py-2 bg-orange-50 hover:bg-[#F85606] text-[#F85606] hover:text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5"
                      >
                        <Search className="w-3.5 h-3.5" />
                        <span>Search for all results for "{searchQuery}"</span>
                      </button>
                    </div>

                  </div>
                ) : (
                  /* STATE B: Empty query (Recent Searches + Trending + Popular Categories) */
                  <div className="p-3.5 space-y-3.5">

                    {/* 1. Recent Searches */}
                    {recentSearches.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>Recent Searches</span>
                          </div>
                          <button
                            onClick={clearAllRecent}
                            className="text-[10px] text-slate-400 hover:text-red-500 font-medium lowercase hover:underline"
                          >
                            clear all
                          </button>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          {recentSearches.map((kw, idx) => (
                            <div
                              key={idx}
                              onClick={() => handleSelectKeyword(kw)}
                              className="group flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md bg-slate-100 hover:bg-orange-50 hover:text-[#F85606] text-slate-700 cursor-pointer transition"
                            >
                              <span>{kw}</span>
                              <button
                                onClick={(e) => removeRecentSearch(e, kw)}
                                className="text-slate-400 hover:text-red-500 rounded-full p-0.5"
                                title="Remove item"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 2. Trending Searches in Nepal */}
                    <div>
                      <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                        <Flame className="w-3.5 h-3.5 text-[#F85606]" />
                        <span>Trending Searches in Nepal</span>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {trendingSearches.map((kw, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSelectKeyword(kw)}
                            className="text-xs px-2.5 py-1 rounded-md bg-slate-100 hover:bg-orange-50 hover:text-[#F85606] text-slate-700 transition flex items-center gap-1"
                          >
                            <span className="text-amber-500">🔥</span>
                            <span>{kw}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 3. Popular Categories */}
                    <div className="pt-2 border-t border-slate-100">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Popular Categories
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        {CATEGORIES.slice(0, 6).map(cat => (
                          <button
                            key={cat.id}
                            onClick={() => handleSelectCategorySuggestion(cat.id)}
                            className="text-left text-xs p-2 rounded-lg bg-slate-50 hover:bg-orange-50 hover:text-[#F85606] text-slate-700 transition truncate"
                          >
                            {cat.name}
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>
                )}
              </div>
            )}
          </div>

        </div>

            {/* Right Header Actions: Auth, Wishlist & Cart (Hidden temporarily per user request) */}
            {SHOW_UPPER_PART && (
              <div className="hidden sm:flex items-center gap-2 sm:gap-3 flex-shrink-0">



            {/* Wishlist Shortcut */}
            <button
              onClick={() => {
                if (!user) {
                  onOpenAuthModal('Please login or sign up to access your Wishlist');
                } else {
                  setActiveView('wishlist');
                }
              }}
              className="relative p-2 text-slate-700 hover:text-red-500 transition"
              title="My Wishlist"
            >
              <Heart className="w-6 h-6" />
              {user && wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Icon */}
            <button
              onClick={() => {
                if (!user) {
                  onOpenAuthModal('Please login or sign up to access your Shopping Cart');
                } else {
                  onOpenCart();
                }
              }}
              className="relative p-2 text-slate-700 hover:text-[#F85606] transition flex items-center gap-1.5"
              title="Shopping Cart"
            >
              <div className="relative">
                <ShoppingCart className="w-6 h-6" />
                {user && cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#F85606] text-white font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
            </button>

              </div>
            )}
          </div>
        </div>
      </header>

      {/* 3. Sub-Navigation Bar (Only shown on Homepage; hidden when category/search is open) */}
      {isHomeActive && (
        <div className="border-b border-slate-200 px-3.5 sm:px-8 py-2 sm:py-1.5 bg-white text-xs font-medium text-slate-700">
          <div className="max-w-[1560px] mx-auto w-full flex items-center justify-between sm:justify-start sm:gap-5">
            {/* Left: Categories (Phone: left, Laptop: first in row) */}
            <button
              onClick={onToggleMegaMenu}
              className={`flex items-center gap-1.5 py-0.5 text-[13.5px] sm:text-xs font-bold transition flex-shrink-0 cursor-pointer ${
                isMegaMenuOpen ? 'text-[#F85606]' : 'text-slate-800 hover:text-[#F85606]'
              }`}
            >
              <Layers className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-[#F85606]" />
              <span>{t('all38Categories')}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {/* Middle: Bhanjo Mall (Phone: center, Laptop: second in row) */}
            <button
              onClick={() => {
                setActiveView('marketplace');
                onSelectCategory('all');
              }}
              className="text-[13.5px] sm:text-xs font-bold text-slate-800 hover:text-[#F85606] transition text-center px-1 cursor-pointer"
            >
              {t('bhanjoMall')}
            </button>

            {/* Right: Flash Sale (Phone: right, Laptop: third in row) */}
            <button
              onClick={() => setActiveView('flash-sale')}
              className="flex items-center gap-1 sm:gap-1.5 text-red-600 font-extrabold hover:text-red-700 transition cursor-pointer px-1.5 sm:px-2 py-0.5 rounded-full hover:bg-red-50 text-[13.5px] sm:text-xs flex-shrink-0"
              title="Open Flash Sale"
            >
              <Clock className="w-3.5 h-3.5 text-red-600 animate-pulse stroke-[2.5]" />
              <span>Flash Sale</span>
              <span className="bg-red-600 text-white text-[8.5px] sm:text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase animate-pulse">
                70% OFF
              </span>
            </button>
          </div>
        </div>
      )}

      {/* 4. Visual Lens / Image Search Modal (1688 / Taobao / Bhanjo Visual AI) */}
      <ImageSearchModal
        isOpen={isImageSearchOpen}
        onClose={() => setIsImageSearchOpen(false)}
        products={products}
        onSelectProduct={onSelectProduct}
        onSearch={onSearch}
        onRequireAuth={onOpenAuthModal}
      />

    </>
  );
};

