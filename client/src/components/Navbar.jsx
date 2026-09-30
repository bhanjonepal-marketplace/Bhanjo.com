import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Search, ShoppingCart, User, Menu, X, ChevronDown, 
  Store, HelpCircle, PhoneCall, Globe, Layers, 
  MapPin, Sparkles, Zap, Gift, Flame, Heart, Truck, 
  LogOut, Package, Clock, ArrowRight, Tag, Star, ShieldCheck, Eye
} from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES } from '../data/categories';
import { PRODUCTS } from '../data/products';
import { matchesProductSearch, getWordVariants } from '../utils/searchMatcher';

export const Navbar = ({ 
  onToggleMegaMenu, 
  isMegaMenuOpen, 
  onOpenCart, 
  onOpenTrackOrder,
  onOpenAuthModal,
  onOpenAlibabaImporter,
  onOpenAdminUnlock,
  onSelectCategory,
  searchQuery: externalSearchQuery = '',
  onSearch,
  onSelectProduct,
  activeView,
  setActiveView,
  products = []
}) => {
  const { currency, setCurrency, currencies, language, setLanguage, formatPrice, t } = useCurrency();
  const { cartCount } = useCart();
  const { user, logout, wishlist, userOrders, isAdmin, setAdminMode } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState(externalSearchQuery);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const saved = localStorage.getItem('bhanjo_recent_searches');
      return saved ? JSON.parse(saved) : ['Cashmere Pashmina', 'Ilam Tea', 'Wireless Earbuds'];
    } catch {
      return ['Cashmere Pashmina', 'Ilam Tea', 'Wireless Earbuds'];
    }
  });

  const searchContainerRef = useRef(null);
  const userMenuRef = useRef(null);
  const inputRef = useRef(null);

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
      } catch (e) {}
      return updated;
    });
  };

  const clearAllRecent = (e) => {
    e.stopPropagation();
    setRecentSearches([]);
    try {
      localStorage.removeItem('bhanjo_recent_searches');
    } catch (e) {}
  };

  // Close dropdowns on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsSearchFocused(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsSearchFocused(false);
        setIsUserMenuOpen(false);
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

  return (
    <header className="sticky top-0 z-40 bg-white shadow-xs border-b border-slate-200">
      
      {/* 1. Top Daraz Utility Micro Strip */}
      <div className="bg-[#f8f8f8] text-[#757575] text-[11px] px-4 sm:px-8 py-1 border-b border-slate-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          <div className="flex items-center gap-4">


            {/* Track My Order */}
            <button
              onClick={() => onOpenTrackOrder('')}
              className="hover:text-[#F85606] transition flex items-center gap-1 font-semibold text-slate-700"
            >
              <Truck className="w-3.5 h-3.5 text-[#F85606]" />
              <span>{t('trackOrder')}</span>
            </button>

            {/* Admin Wholesale Sourcing (Only visible to Admin) */}
            {isAdmin && (
              <>
                <span className="text-slate-300">|</span>
                <button
                  id="btn-1688-sourcing"
                  onClick={() => onOpenAlibabaImporter('1688')}
                  className="hover:text-red-700 transition flex items-center gap-1 font-bold text-red-700 bg-red-100/80 hover:bg-red-200/80 px-2.5 py-0.5 rounded-full shadow-2xs cursor-pointer border border-red-200"
                  title="Import products directly from 1688.com China Factory"
                >
                  <span className="text-[10px]">🏭</span>
                  <span>1688 Sourcing</span>
                </button>

                <button
                  id="btn-alibaba-sourcing"
                  onClick={() => onOpenAlibabaImporter('alibaba')}
                  className="hover:text-[#FF6A00] transition flex items-center gap-1 font-bold text-[#FF6A00] bg-orange-100/80 hover:bg-orange-200/80 px-2.5 py-0.5 rounded-full shadow-2xs cursor-pointer border border-orange-200"
                  title="Import products directly from Alibaba.com Global Direct"
                >
                  <Zap className="w-3.5 h-3.5 fill-[#FF6A00] text-[#FF6A00]" />
                  <span>Alibaba Sourcing</span>
                </button>
              </>
            )}

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
                className={`px-2 py-0.5 rounded transition ${
                  language === 'en'
                    ? 'bg-[#F85606] text-white shadow-2xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Switch interface to English"
              >
                English
              </button>
              <button
                onClick={() => setLanguage('ne')}
                className={`px-2 py-0.5 rounded transition ${
                  language === 'ne'
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
                  <div className="w-4 h-4 rounded-full bg-[#F85606] text-white text-[9px] flex items-center justify-center font-black">
                    {user.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <span>{t('hiUser')}, {user.name.split(' ')[0]}</span>
                  <ChevronDown className="w-3 h-3" />
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
              {isUserMenuOpen && user && (
                <div className="absolute right-0 top-full mt-1.5 w-48 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in text-xs space-y-1">
                  <div className="p-2 border-b border-slate-100">
                    <div className="font-bold text-slate-900 truncate">{user.name}</div>
                    <div className="text-[10px] text-slate-400 truncate">{user.email || user.phone}</div>
                  </div>

                  <button
                    onClick={() => {
                      setActiveView('my-orders');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-orange-50 hover:text-[#F85606] transition flex items-center gap-2 font-medium"
                  >
                    <Package className="w-3.5 h-3.5 text-[#F85606]" />
                    <span>My Orders ({userOrders.length})</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveView('my-orders');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-orange-50 hover:text-[#F85606] transition flex items-center gap-2 font-medium"
                  >
                    <Heart className="w-3.5 h-3.5 text-red-500" />
                    <span>My Wishlist ({wishlist.length})</span>
                  </button>

                  <button
                    onClick={() => {
                      onOpenTrackOrder('');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-orange-50 hover:text-[#F85606] transition flex items-center gap-2 font-medium"
                  >
                    <Truck className="w-3.5 h-3.5 text-blue-500" />
                    <span>Track Parcels</span>
                  </button>

                  {isAdmin ? (
                    <>
                      <button
                        onClick={() => {
                          setActiveView('seller-center');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left p-2 rounded-lg hover:bg-orange-50 hover:text-[#F85606] transition flex items-center gap-2 font-medium"
                      >
                        <Store className="w-3.5 h-3.5 text-amber-500" />
                        <span>Store Manager (Catalog & Orders)</span>
                      </button>

                      <button
                        onClick={() => {
                          setAdminMode(false);
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left p-2 rounded-lg hover:bg-emerald-50 text-emerald-700 transition flex items-center gap-2 font-semibold"
                      >
                        <Eye className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Switch to Customer View</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        if (onOpenAdminUnlock) onOpenAdminUnlock();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left p-2 rounded-lg hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition flex items-center gap-2 font-medium"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                      <span>Store Admin Portal</span>
                    </button>
                  )}

                  <div className="pt-1 border-t border-slate-100">
                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left p-2 rounded-lg hover:bg-red-50 text-red-600 transition flex items-center gap-2 font-semibold"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* 2. Main Minimal Header Bar */}
      <div className="px-4 sm:px-8 py-3 bg-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <div 
            onClick={() => {
              setActiveView('marketplace');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2 cursor-pointer flex-shrink-0"
          >
            <div className="w-8 h-8 rounded-lg bg-[#F85606] flex items-center justify-center text-white font-black text-lg shadow-xs">
              B
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-[#F85606]">
                bhanjo<span className="text-slate-900 text-lg font-bold">.com</span>
              </span>
            </div>
          </div>

          {/* Interactive Search Bar with Live Suggestions, Recent History, and Trending Dropdown */}
          <div ref={searchContainerRef} className="flex-1 max-w-2xl mx-2 sm:mx-8 relative">
            <form 
              onSubmit={handleSearchSubmit}
              className="w-full flex items-center bg-[#f5f5f5] rounded-lg overflow-hidden border border-slate-300 focus-within:border-[#F85606] focus-within:bg-white transition-all shadow-xs"
            >
              <div className="pl-3 pr-1 text-slate-400">
                <Search className="w-4 h-4" />
              </div>

              <input
                ref={inputRef}
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchFocused(true);
                  if (onSearch) {
                    onSearch(e.target.value);
                  }
                }}
                className="flex-1 px-2 py-2 text-xs sm:text-sm bg-transparent text-slate-800 focus:outline-none placeholder-slate-400"
              />

              {/* Clear button (X) when text exists */}
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearInput}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 mr-1 transition"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                type="submit"
                className="bg-[#F85606] hover:bg-[#e04e05] text-white px-5 py-2 text-sm font-bold flex items-center justify-center transition gap-1.5 cursor-pointer"
              >
                <span>{t('searchBtn')}</span>
              </button>
            </form>

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

          {/* Right Header Actions: Wishlist & Cart */}
          <div className="flex items-center gap-3">
            
            {/* Wishlist Shortcut */}
            <button
              onClick={() => setActiveView('my-orders')}
              className="relative p-2 text-slate-700 hover:text-red-500 transition"
              title="My Wishlist"
            >
              <Heart className="w-6 h-6" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Icon */}
            <button
              onClick={onOpenCart}
              className="relative p-2 text-slate-700 hover:text-[#F85606] transition flex items-center gap-1.5"
              title="Shopping Cart"
            >
              <div className="relative">
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#F85606] text-white font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
            </button>

          </div>
        </div>
      </div>

      {/* 3. Sub-Navigation Bar */}
      <div className="border-t border-slate-100 px-4 sm:px-8 py-1.5 bg-white text-xs font-medium text-slate-700">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-5 flex-shrink-0">
            <button
              onClick={onToggleMegaMenu}
              className={`flex items-center gap-1.5 py-1 text-xs font-bold transition ${
                isMegaMenuOpen ? 'text-[#F85606]' : 'text-slate-800 hover:text-[#F85606]'
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

          </div>

          <div className="text-[11px] text-slate-500 hidden lg:block">
            {t('authenticGuarantee')}
          </div>
        </div>
      </div>

    </header>
  );
};
