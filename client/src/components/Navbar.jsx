import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Search, ShoppingCart, User, Menu, X, ChevronDown,
  Store, HelpCircle, PhoneCall, Globe, Layers,
  MapPin, Sparkles, Zap, Gift, Flame, Heart, Truck,
  LogOut, Package, Clock, ArrowRight, Tag, Star, ShieldCheck, Eye, Camera, Image as ImageIcon
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
  onVisualSearch
}) => {
  const { currency, setCurrency, currencies, language, setLanguage, formatPrice, t } = useCurrency();
  const { cartCount } = useCart();
  const { user, logout, wishlist, userOrders, isAdmin, setAdminMode } = useAuth();

  const [searchQuery, setSearchQuery] = useState(externalSearchQuery);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolledUserMenuOpen, setIsScrolledUserMenuOpen] = useState(false);
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
      <div className="absolute right-0 top-full mt-1.5 w-56 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in text-xs space-y-1">
        <div className="p-2.5 border-b border-slate-100 flex items-center gap-2.5 bg-orange-50/40 rounded-lg">
          <div className="w-9 h-9 rounded-full overflow-hidden bg-[#F85606] text-white text-xs flex items-center justify-center font-bold flex-shrink-0 shadow-xs">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              user.name ? user.name[0].toUpperCase() : 'U'
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-bold text-slate-900 truncate">{user.name}</div>
            <div className="text-[10px] text-slate-500 truncate">{user.email || user.phone}</div>
          </div>
        </div>

        {/* 1. My Profile & Settings (Highlighted) */}
        <button
          onClick={() => {
            setActiveView('profile');
            setIsOpen(false);
          }}
          className="w-full text-left p-2 rounded-lg hover:bg-orange-50 hover:text-[#F85606] text-slate-800 transition flex items-center justify-between font-semibold cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <User className="w-3.5 h-3.5 text-[#F85606]" />
            <span>My Profile & Settings</span>
          </div>
          <span className="text-[9px] bg-orange-100 text-[#F85606] font-bold px-1.5 py-0.5 rounded">Edit</span>
        </button>

        {/* 2. My Orders */}
        <button
          onClick={() => {
            setActiveView('my-orders');
            setIsOpen(false);
          }}
          className="w-full text-left p-2 rounded-lg hover:bg-orange-50 hover:text-[#F85606] text-slate-700 transition flex items-center gap-2 font-medium cursor-pointer"
        >
          <Package className="w-3.5 h-3.5 text-[#F85606]" />
          <span>My Orders ({userOrders.length})</span>
        </button>

        {/* 3. My Cart */}
        <button
          onClick={() => {
            setActiveView('cart');
            setIsOpen(false);
          }}
          className="w-full text-left p-2 rounded-lg hover:bg-orange-50 hover:text-[#F85606] text-slate-700 transition flex items-center justify-between font-medium cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-3.5 h-3.5 text-[#F85606]" />
            <span>My Cart</span>
          </div>
          {cartCount > 0 && (
            <span className="text-[10px] bg-[#F85606] text-white font-bold px-1.5 py-0.2 rounded-full">
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
          className="w-full text-left p-2 rounded-lg hover:bg-orange-50 hover:text-[#F85606] text-slate-700 transition flex items-center gap-2 font-medium cursor-pointer"
        >
          <Heart className="w-3.5 h-3.5 text-red-500" />
          <span>My Wishlist ({wishlist.length})</span>
        </button>

        {/* 5. Saved Delivery Addresses */}
        <button
          onClick={() => {
            setActiveView('addresses');
            setIsOpen(false);
          }}
          className="w-full text-left p-2 rounded-lg hover:bg-orange-50 hover:text-[#F85606] text-slate-700 transition flex items-center gap-2 font-medium cursor-pointer"
        >
          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
          <span>Delivery Addresses</span>
        </button>

        {/* 6. Track Parcels */}
        <button
          onClick={() => {
            onOpenTrackOrder('');
            setIsOpen(false);
          }}
          className="w-full text-left p-2 rounded-lg hover:bg-orange-50 hover:text-[#F85606] text-slate-700 transition flex items-center gap-2 font-medium cursor-pointer"
        >
          <Truck className="w-3.5 h-3.5 text-blue-500" />
          <span>Track Parcels</span>
        </button>

        {/* Sign Out */}
        <div className="pt-1 border-t border-slate-100">
          <button
            onClick={() => {
              logout();
              setActiveView('marketplace');
              setIsOpen(false);
            }}
            className="w-full text-left p-2 rounded-lg hover:bg-red-50 text-red-600 transition flex items-center gap-2 font-semibold cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <>

      {/* 1. Top Daraz Utility Micro Strip (Scrolls naturally off-screen at 120fps with zero layout thrash) */}
      <div className="bg-[#f8f8f8] text-[#757575] text-[11px] px-4 sm:px-8 py-1 border-b border-slate-200">
        <div className="max-w-[1560px] mx-auto flex items-center justify-between">

          <div className="flex items-center gap-4">


            {/* Track My Order */}
            <button
              onClick={() => onOpenTrackOrder('')}
              className="hover:text-[#F85606] transition flex items-center gap-1 font-semibold text-slate-700"
            >
              <Truck className="w-3.5 h-3.5 text-[#F85606]" />
              <span>{t('trackOrder')}</span>
            </button>



            <span className="hidden md:inline text-slate-300">|</span>

            <span className="hidden md:inline text-slate-500">
              {t('helpline')}
            </span>
          </div>

          <div className="flex items-center gap-3">

            {/* Currency (Fixed NPR only) */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-400">{t('currencyLabel')}</span>
              <span className="font-bold text-[11px] text-slate-800 flex items-center gap-1">
                <span>🇳🇵</span>
                <span>NPR (Rs.)</span>
              </span>
            </div>

            <span className="text-slate-300">|</span>

            {/* Language Switcher (Active Visual Indicator) */}
            <div className="flex items-center bg-slate-200/80 p-0.5 rounded-md text-[11px] font-bold">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 rounded transition ${language === 'en'
                    ? 'bg-[#F85606] text-white shadow-2xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                  }`}
                title="Switch interface to English"
              >
                English
              </button>
              <button
                onClick={() => setLanguage('ne')}
                className={`px-2 py-0.5 rounded transition ${language === 'ne'
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
                  className="flex items-center gap-1.5 font-bold text-slate-800 hover:text-[#F85606] transition"
                >
                  <div className="w-5 h-5 rounded-full overflow-hidden bg-[#F85606] text-white text-[10px] flex items-center justify-center font-black flex-shrink-0 shadow-xs border border-orange-200">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user.name ? user.name[0].toUpperCase() : 'U'
                    )}
                  </div>
                  <span className="max-w-[110px] truncate">{t('hiUser')}, {user.name.split(' ')[0]}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>
              ) : (
                <button
                  onClick={() => onOpenAuthModal()}
                  className="font-bold text-[#F85606] hover:underline flex items-center gap-1"
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

      {/* 2. Main Sticky Header Bar (Sleek Alibaba-style shrink-on-scroll with GPU hardware acceleration) */}
      <header className={`sticky top-0 z-50 bg-white/95 backdrop-blur-md transition-[padding,box-shadow,border-color] duration-200 ease-out border-b ${
        isScrolled ? 'py-1.5 sm:py-2 shadow-md border-slate-200/90' : 'py-3 sm:py-3.5 shadow-xs border-slate-200'
      }`}>
        <div className="px-4 sm:px-8">
          <div className="max-w-[1560px] mx-auto flex items-center justify-between gap-4">

          {/* Brand Logo */}
          <div
            onClick={() => {
              setActiveView('marketplace');
              window.scrollTo({ top: 0, behavior: 'smooth' });
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

          {/* Interactive Search Bar with In-Bar Camera & 1688-Style Floating Visual Popover */}
          <div ref={searchContainerRef} className="flex-1 max-w-2xl mx-2 sm:mx-6 relative">
            <form
              onSubmit={handleSearchSubmit}
              className={`w-full flex items-center bg-white rounded-xl overflow-hidden border-2 border-orange-500 focus-within:border-[#F85606] transition-all duration-300 shadow-xs ${
                isScrolled ? 'p-0.5' : 'p-1'
              }`}
            >
              <div className="pl-3 pr-1 text-slate-400">
                <Search className={`text-orange-500 transition-all duration-300 ${isScrolled ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} />
              </div>

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
                className={`flex-1 px-2 text-xs sm:text-sm bg-transparent text-slate-800 focus:outline-none placeholder-slate-400 font-medium transition-all duration-300 ${
                  isScrolled ? 'py-1' : 'py-1.5'
                }`}
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
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 mr-1 transition"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Camera Icon Button INSIDE search bar (Hover to Reveal Lens / Click to Upload) */}
              <button
                type="button"
                onClick={handleCameraClick}
                onMouseEnter={handleCameraMouseEnter}
                onMouseLeave={handleCameraMouseLeave}
                title="Search by image (Upload or drag photo)"
                className="p-1.5 text-orange-500 hover:text-[#e04e05] hover:bg-orange-50 rounded-lg transition active:scale-95 flex items-center justify-center mr-1 cursor-pointer group"
              >
                <Camera className={`text-orange-500 group-hover:scale-110 transition-transform stroke-[2] ${isScrolled ? 'w-4 h-4' : 'w-5 h-5'}`} />
              </button>

              {/* Solid Orange Primary Search Button */}
              <button
                type="submit"
                className={`bg-gradient-to-r from-[#FF7A00] to-[#F85606] hover:from-[#f06e00] hover:to-[#e04e05] text-white rounded-lg text-xs font-extrabold flex items-center justify-center transition-all duration-300 gap-1.5 cursor-pointer shadow-xs active:scale-95 flex-shrink-0 ${
                  isScrolled ? 'px-4 py-1.5' : 'px-5 sm:px-6 py-2 sm:text-sm'
                }`}
              >
                <Search className={`stroke-[2.5] ${isScrolled ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} />
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

          {/* Right Header Actions: Auth (when scrolled), Wishlist & Cart */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Scrolled / Sticky Header Auth Options: Displays Login and Sign Up when scrolled down */}
            {isScrolled && (
              <div className="flex items-center gap-1.5 sm:gap-2 mr-0.5 sm:mr-1 animate-in fade-in zoom-in-95 duration-200">
                {user ? (
                  /* Logged-in User Chip Dropdown */
                  <div ref={scrolledUserMenuRef} className="relative">
                    <button
                      type="button"
                      onClick={() => setIsScrolledUserMenuOpen(!isScrolledUserMenuOpen)}
                      className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-orange-50 hover:bg-orange-100 text-slate-800 transition border border-orange-200 cursor-pointer shadow-2xs active:scale-95"
                      title={user.name}
                    >
                      <div className="w-6 h-6 rounded-full overflow-hidden bg-[#F85606] text-white text-[11px] flex items-center justify-center font-black flex-shrink-0 shadow-xs border border-orange-200">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          user.name ? user.name[0].toUpperCase() : 'U'
                        )}
                      </div>
                      <span className="hidden md:inline font-bold text-xs max-w-[85px] truncate">
                        {user.name.split(' ')[0]}
                      </span>
                      <ChevronDown className="w-3 h-3 text-slate-400" />
                    </button>
                    {renderUserDropdownMenu(isScrolledUserMenuOpen, setIsScrolledUserMenuOpen)}
                  </div>
                ) : (
                  /* Guest: Crisp Login and Sign Up Options */
                  <>
                    {/* Desktop: Clear separate Login and Sign Up buttons */}
                    <div className="hidden sm:flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onOpenAuthModal('Please login to your account', 'login')}
                        className="px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 hover:text-[#F85606] hover:bg-orange-50 border border-slate-200 transition active:scale-95 cursor-pointer flex items-center gap-1.5 shadow-2xs"
                      >
                        <User className="w-3.5 h-3.5 text-slate-500" />
                        <span>{language === 'ne' ? 'लगइन' : 'Login'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onOpenAuthModal('Create your free Bhanjo account', 'signup')}
                        className="px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-extrabold text-white bg-gradient-to-r from-[#FF7A00] to-[#F85606] hover:from-[#f06e00] hover:to-[#e04e05] shadow-xs hover:shadow transition active:scale-95 cursor-pointer flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                        <span>{language === 'ne' ? 'दर्ता' : 'Sign Up'}</span>
                      </button>
                    </div>

                    {/* Mobile (< sm): Compact user auth icon button */}
                    <button
                      type="button"
                      onClick={() => onOpenAuthModal('Please login or sign up to continue', 'login')}
                      className="sm:hidden p-1.5 text-slate-700 hover:text-[#F85606] hover:bg-orange-50 rounded-lg border border-slate-200 transition cursor-pointer"
                      title={language === 'ne' ? 'लगइन / दर्ता' : 'Login / Sign Up'}
                    >
                      <User className="w-4 h-4 text-[#F85606]" />
                    </button>
                  </>
                )}

                <span className="hidden sm:inline text-slate-300 mx-0.5">|</span>
              </div>
            )}

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
        </div>
      </div>
    </header>

      {/* 3. Sub-Navigation Bar (Scrolls naturally off-screen with zero lag) */}
      <div className="border-b border-slate-200 px-4 sm:px-8 py-1.5 bg-white text-xs font-medium text-slate-700">
        <div className="max-w-[1560px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-5 flex-shrink-0">
            <button
              onClick={onToggleMegaMenu}
              className={`flex items-center gap-1.5 py-1 text-xs font-bold transition ${isMegaMenuOpen ? 'text-[#F85606]' : 'text-slate-800 hover:text-[#F85606]'
                }`}
            >
              <Layers className="w-3.5 h-3.5 text-[#F85606]" />
              <span>{t('all38Categories')}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => {
                setActiveView('marketplace');
                onSelectCategory('all');
              }}
              className="hover:text-[#F85606] transition"
            >
              {t('bhanjoMall')}
            </button>

            <button
              onClick={() => setActiveView('flash-sale')}
              className="flex items-center gap-1.5 text-red-600 font-extrabold hover:text-red-700 transition cursor-pointer px-2 py-0.5 rounded-full hover:bg-red-50"
              title="Open Flash Sale"
            >
              <Clock className="w-3.5 h-3.5 text-red-600 animate-pulse stroke-[2.5]" />
              <span>Flash Sale</span>
              <span className="bg-red-600 text-white text-[8px] font-black px-1.5 py-0.2 rounded-full uppercase animate-pulse">
                70% OFF
              </span>
            </button>

          </div>
        </div>
      </div>

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

