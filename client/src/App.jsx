import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { MegaMenu } from './components/MegaMenu';
import { DarazChannels } from './components/DarazChannels';
import { DarazFlashSale } from './components/DarazFlashSale';
import { DarazMall } from './components/DarazMall';
import { NepaliPavilion } from './components/NepaliPavilion';
import { CatalogFilterSidebar } from './components/CatalogFilterSidebar';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { TrackOrderModal } from './components/TrackOrderModal';
import { AuthModal } from './components/AuthModal';
import { MyOrdersDashboard } from './components/MyOrdersDashboard';
import { SellerCentralDashboard } from './components/SellerCentralDashboard';
import { ChatSupplierModal } from './components/ChatSupplierModal';
import { CartDrawer } from './components/CartDrawer';
import { Toast } from './components/Toast';
import { Footer } from './components/Footer';
import { AlibabaGlobalSection } from './components/AlibabaGlobalSection';
import { ProductEditModal } from './components/ProductEditModal';
import { CategoriesSection } from './components/CategoriesSection';
import { AmazonQuadCatalog } from './components/AmazonQuadCatalog';
import { FlashSalePage } from './components/FlashSalePage';

import { CATEGORIES } from './data/categories';
import { PRODUCTS } from './data/products';
import { SUPPLIERS } from './data/suppliers';

import { Search, Filter, ShieldCheck, X, Camera, Sparkles } from 'lucide-react';
import { useCurrency } from './context/CurrencyContext';
import { useAuth } from './context/AuthContext';
import { matchesProductSearch } from './utils/searchMatcher';

export function App() {
  const { currentCurrency, language, t } = useCurrency();
  const { user, isAdmin, setAdminMode } = useAuth();

  // Navigation: 'marketplace', 'my-orders', 'seller-center', 'flash-sale'
  const [activeView, setActiveView] = useState('marketplace');

  // When no account is logged in, ensure customer portal views are strictly redirected to 'marketplace' homepage
  useEffect(() => {
    if (!user && ['my-orders', 'dashboard', 'profile', 'wishlist', 'addresses', 'cart', 'seller-center'].includes(activeView)) {
      setActiveView('marketplace');
    }
  }, [user, activeView]);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Data & Filtering state
  const [selectedCategoryId, setSelectedCategoryId] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOnlyNepal, setFilterOnlyNepal] = useState(false);
  const [filterAlibabaOnly, setFilterAlibabaOnly] = useState(false);
  const [filterFreeDelivery, setFilterFreeDelivery] = useState(false);
  const [filterMallOnly, setFilterMallOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [priceRange, setPriceRange] = useState({ min: 0, max: Infinity });
  const [sortBy, setSortBy] = useState('popular');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [visualSearch, setVisualSearch] = useState(null);
  const [categoryLayoutMode, setCategoryLayoutMode] = useState('amazon'); // 'amazon' preview or 'classic'

  // Catalog Products (Dynamic from SQLite backend)
  const [allProducts, setAllProducts] = useState(PRODUCTS);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState('all'); // 'all' displays every single saved product on screen
  const [totalPages, setTotalPages] = useState(1);
  const [totalCatalogCount, setTotalCatalogCount] = useState(PRODUCTS.length);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  useEffect(() => {
    setIsLoadingProducts(true);
    const catQuery = selectedCategoryId !== 'all' ? `&category=${selectedCategoryId}` : '';
    const searchParam = searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : '';
    const sortParam = sortBy !== 'popular' ? `&sort=${sortBy}` : '';
    
    // Always request up to 1000 items so every single product saved in DB is loaded and visible
    fetch(`/api/products?page=1&limit=1000${catQuery}${searchParam}${sortParam}`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        const deletedIds = new Set(JSON.parse(localStorage.getItem('bhanjo_deleted_product_ids') || '[]').map(String));
        if (data.success && Array.isArray(data.products) && data.products.length > 0) {
          const validProducts = data.products.filter(p => !deletedIds.has(String(p.id)));
          setAllProducts(validProducts);
          setTotalCatalogCount(validProducts.length);
          setTotalPages(Math.max(1, Math.ceil(validProducts.length / 36)));
        } else {
          // If no products in DB or empty, fallback to catalog
          const validProducts = PRODUCTS.filter(p => !deletedIds.has(String(p.id)));
          setAllProducts(validProducts);
          setTotalCatalogCount(validProducts.length);
          setTotalPages(Math.max(1, Math.ceil(validProducts.length / 36)));
        }
      })
      .catch(err => {
        console.warn('Backend API note, using fallback catalog:', err);
        const deletedIds = new Set(JSON.parse(localStorage.getItem('bhanjo_deleted_product_ids') || '[]').map(String));
        const validProducts = PRODUCTS.filter(p => !deletedIds.has(String(p.id)));
        setAllProducts(validProducts);
        setTotalCatalogCount(validProducts.length);
        setTotalPages(Math.max(1, Math.ceil(validProducts.length / 36)));
      })
      .finally(() => setIsLoadingProducts(false));
  }, [selectedCategoryId, searchQuery, sortBy]);

  const handleViewAllGlobal = () => {
    setSelectedCategoryId('all');
    setSearchQuery('');
    setFilterAlibabaOnly(true);
    setFilterOnlyNepal(false);
    setFilterMallOnly(false);
    setFilterFreeDelivery(false);
    setMinRating(0);
    setPriceRange({ min: 0, max: Infinity });
    setVisualSearch(null);
    setPageSize('all');
    setCurrentPage(1);
    setActiveView('marketplace');
    setTimeout(() => {
      const catalogElem = document.getElementById('catalog-section');
      if (catalogElem) {
        catalogElem.scrollIntoView({ behavior: 'smooth' });
      }
    }, 60);
    const globalCount = allProducts.filter(p => p.isAlibabaImport || p.is1688Import || p.id?.startsWith('ali-') || p.id?.startsWith('1688-')).length;
    showToast(`Showing all ${globalCount} Global Direct products (including Hoodies & Winterwear)!`);
  };

  const handleViewAllEveryProduct = () => {
    setSelectedCategoryId('all');
    setSearchQuery('');
    setFilterAlibabaOnly(false);
    setFilterOnlyNepal(false);
    setFilterMallOnly(false);
    setFilterFreeDelivery(false);
    setMinRating(0);
    setPriceRange({ min: 0, max: Infinity });
    setVisualSearch(null);
    setPageSize('all');
    setCurrentPage(1);
    setActiveView('marketplace');
    setTimeout(() => {
      const catalogElem = document.getElementById('catalog-section');
      if (catalogElem) {
        catalogElem.scrollIntoView({ behavior: 'smooth' });
      }
    }, 60);
    showToast(`Showing all ${allProducts.length} products saved in Bhanjo catalog!`);
  };

  const handleSelectCategory = (catId, subCategoryKeyword = '') => {
    setSelectedCategoryId(catId);
    if (subCategoryKeyword) {
      setSearchQuery(subCategoryKeyword);
    } else if (catId === 'all') {
      setSearchQuery('');
      setFilterAlibabaOnly(false);
      setFilterOnlyNepal(false);
    }
    setPageSize('all');
    setCurrentPage(1);
    setActiveView('marketplace');
    setTimeout(() => {
      const catalogElem = document.getElementById('catalog-section');
      if (catalogElem) {
        catalogElem.scrollIntoView({ behavior: 'smooth' });
      }
    }, 60);
  };

  const handleProductAdded = (newProd) => {
    setAllProducts(prev => [newProd, ...prev]);
    showToast(`Published "${newProd.title.slice(0, 25)}..." to Bhanjo catalog!`);
  };

  const handleDeleteProduct = async (productId, e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    
    const stringId = String(productId);
    
    // 1. Immediately close the detail modal so user gets instant visual confirmation
    setSelectedProductId(null);

    // 2. Identify target product for descriptive notification
    const targetProduct = allProducts.find(p => String(p.id) === stringId) || PRODUCTS.find(p => String(p.id) === stringId);
    const titleSnippet = (targetProduct?.title || 'Product').slice(0, 30);

    // 3. Instant optimistic deletion from frontend catalog state
    setAllProducts(prev => prev.filter(p => String(p.id) !== stringId));
    setTotalCatalogCount(prev => Math.max(0, prev - 1));
    
    // Also remove from visual search matches if active
    setVisualSearch(prev => {
      if (!prev) return null;
      const updatedMatches = (prev.matchedProducts || []).filter(p => String(p.id) !== stringId);
      return {
        ...prev,
        matchedProducts: updatedMatches,
        exactProduct: String(prev.exactProduct?.id) === stringId ? null : prev.exactProduct,
        isExactMatch: String(prev.exactProduct?.id) === stringId ? false : prev.isExactMatch
      };
    });

    // 4. Save to persistent deleted list in localStorage
    try {
      const stored = JSON.parse(localStorage.getItem('bhanjo_deleted_product_ids') || '[]');
      if (!stored.includes(stringId)) {
        stored.push(stringId);
        localStorage.setItem('bhanjo_deleted_product_ids', JSON.stringify(stored));
      }
    } catch (err) {
      console.warn('LocalStorage deletion record error:', err);
    }

    // 5. Show immediate toast notification
    showToast(`🗑️ "${titleSnippet}..." deleted from Bhanjo catalog!`);

    // 6. Delete from SQLite database via API
    try {
      const res = await fetch(`/api/products/${encodeURIComponent(stringId)}`, { method: 'DELETE' });
      if (!res.ok) {
        console.warn('Server delete response note:', res.status);
      }
    } catch (err) {
      console.error('Delete product API error:', err);
    }
  };

  // Modals state
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);
  const [activeTrackingNo, setActiveTrackingNo] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authCallback, setAuthCallback] = useState(null);
  const [authMessage, setAuthMessage] = useState('');
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [chatContext, setChatContext] = useState({ product: null, supplier: null });

  const handleProductUpdated = (updatedProd) => {
    setAllProducts(prev => {
      const idx = prev.findIndex(p => p.id === updatedProd.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = updatedProd;
        return next;
      }
      return [updatedProd, ...prev];
    });
    if (selectedProductId === updatedProd.id) {
      setSelectedProductId(updatedProd.id);
    }
    showToast(`Price for "${updatedProd.title.slice(0, 24)}..." updated to Rs. ${Math.round(updatedProd.samplePrice * 133.5).toLocaleString()}!`);
  };

  useEffect(() => {
    const handleProductUpdatedEvent = (e) => {
      if (e.detail) {
        handleProductUpdated(e.detail);
      }
    };
    window.addEventListener('bhanjo-product-updated', handleProductUpdatedEvent);
    return () => window.removeEventListener('bhanjo-product-updated', handleProductUpdatedEvent);
  }, [selectedProductId]);

  // Toast Notification state
  const [toastMessage, setToastMessage] = useState('');
  const [isToastOpen, setIsToastOpen] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setIsToastOpen(true);
  };

  const handleRequireAuth = (callback, msg = 'Please login to continue', mode = 'login') => {
    setAuthCallback(() => callback);
    setAuthMessage(msg);
    setAuthMode(mode || 'login');
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = () => {
    if (authCallback) {
      authCallback();
      setAuthCallback(null);
    }
  };

  const handleOpenTrackOrder = (trackingNo = '') => {
    setActiveTrackingNo(trackingNo);
    setIsTrackOrderOpen(true);
  };

  // Filtered Products (Supports Visual Search & Standard Filters)
  const filteredProducts = useMemo(() => {
    if (visualSearch && visualSearch.matchedProducts && visualSearch.matchedProducts.length > 0) {
      return visualSearch.matchedProducts;
    }

    const matched = allProducts.filter(prod => {
      const matchesCategory = selectedCategoryId === 'all' || 
        prod.categoryId === selectedCategoryId ||
        (selectedCategoryId === 'gift-kids-toys' && (prod.categoryId === 'gifts-crafts' || prod.categoryId === 'parents-kids-toys')) ||
        (selectedCategoryId === 'phone-laptop-cases' && (prod.categoryId === 'consumer-electronics' || prod.categoryId === 'phone-laptop-cases')) ||
        (selectedCategoryId === 'luggage-bags-cases' && (prod.categoryId === 'luggage-bags' || prod.categoryId === 'luggage-bags-cases')) ||
        (selectedCategoryId === 'vehicle-parts-accessories' && (prod.categoryId === 'vehicles-accessories' || prod.categoryId === 'vehicle-parts-accessories' || prod.categoryId === 'vehicles-transportation'));
      const matchesSearch = matchesProductSearch(prod, searchQuery);
      const matchesNepal = !filterOnlyNepal || prod.isHimalayanExport;
      const matchesAlibaba = !filterAlibabaOnly || prod.isAlibabaImport || prod.id?.startsWith('ali-') || prod.is1688Import;
      const matchesMall = !filterMallOnly || prod.isMall || !prod.isAlibabaImport;
      const matchesFreeDelivery = !filterFreeDelivery || prod.freeDelivery !== false;
      const matchesRating = minRating === 0 || (prod.rating || 4.5) >= minRating;
      
      const retailPrice = prod.samplePrice || 20;
      const matchesPrice = retailPrice >= priceRange.min && retailPrice <= priceRange.max;

      return matchesCategory && matchesSearch && matchesNepal && matchesAlibaba && matchesMall && matchesFreeDelivery && matchesRating && matchesPrice;
    });

    if (sortBy === 'price-low') {
      return matched.sort((a, b) => (a.samplePrice || 20) - (b.samplePrice || 20));
    }
    if (sortBy === 'price-high') {
      return matched.sort((a, b) => (b.samplePrice || 20) - (a.samplePrice || 20));
    }
    if (sortBy === 'rating') {
      return matched.sort((a, b) => (b.rating || 4.5) - (a.rating || 4.5));
    }

    // Default 'popular' sort: When viewing all categories, interleave categories so Hoodies, Bags, Tech, Shoes are all visible from the top
    if (selectedCategoryId === 'all' && !searchQuery) {
      const byCategory = {};
      for (const p of matched) {
        const cat = p.categoryId || 'other';
        if (!byCategory[cat]) byCategory[cat] = [];
        byCategory[cat].push(p);
      }
      const categories = Object.keys(byCategory);
      const interleaved = [];
      const maxLen = Math.max(...categories.map(c => byCategory[c].length), 0);
      for (let i = 0; i < maxLen; i++) {
        for (const cat of categories) {
          if (byCategory[cat][i]) {
            interleaved.push(byCategory[cat][i]);
          }
        }
      }
      return interleaved.length > 0 ? interleaved : matched;
    }

    return matched.sort((a, b) => {
      if (a.isAlibabaImport && !b.isAlibabaImport) return -1;
      if (!a.isAlibabaImport && b.isAlibabaImport) return 1;
      return (b.rating || 4.5) - (a.rating || 4.5);
    });
  }, [allProducts, selectedCategoryId, searchQuery, filterOnlyNepal, filterAlibabaOnly, filterMallOnly, filterFreeDelivery, minRating, priceRange, sortBy, visualSearch]);

  const displayedProducts = useMemo(() => {
    if (pageSize === 'all') {
      return filteredProducts;
    }
    const limit = typeof pageSize === 'number' ? pageSize : 36;
    const start = (currentPage - 1) * limit;
    return filteredProducts.slice(start, start + limit);
  }, [filteredProducts, pageSize, currentPage]);

  const calculatedTotalPages = useMemo(() => {
    if (pageSize === 'all') return 1;
    const limit = typeof pageSize === 'number' ? pageSize : 36;
    return Math.max(1, Math.ceil(filteredProducts.length / limit));
  }, [filteredProducts.length, pageSize]);

  const selectedProduct = allProducts.find(p => p.id === selectedProductId) || PRODUCTS.find(p => p.id === selectedProductId);

  const handleSelectProduct = (productId) => {
    setSelectedProductId(productId);
  };

  const handleOpenQuickChat = (product) => {
    const supplier = SUPPLIERS.find(s => s.id === product.supplierId);
    setChatContext({ product, supplier });
    setIsChatModalOpen(true);
  };

  const handleResetFilters = () => {
    setSelectedCategoryId('all');
    setSearchQuery('');
    setFilterOnlyNepal(false);
    setFilterAlibabaOnly(false);
    setFilterFreeDelivery(false);
    setFilterMallOnly(false);
    setMinRating(0);
    setPriceRange({ min: 0, max: Infinity });
    setVisualSearch(null);
    setPageSize('all');
    setCurrentPage(1);
  };

  const handleVisualSearch = (searchResult) => {
    setVisualSearch(searchResult);
    setActiveView('marketplace');
    setTimeout(() => {
      const catalogElem = document.getElementById('catalog-section');
      if (catalogElem) {
        catalogElem.scrollIntoView({ behavior: 'smooth' });
      }
    }, 80);
    showToast(searchResult.isExactMatch 
      ? '🎯 Exact product found in Bhanjo catalog!' 
      : `✨ Found ${searchResult.matchedProducts?.length || 0} visually similar products!`);
  };

  const handleClearVisualSearch = () => {
    setVisualSearch(null);
  };

  const activeFilterCount = [
    filterOnlyNepal,
    filterAlibabaOnly,
    filterMallOnly,
    filterFreeDelivery,
    minRating > 0,
    priceRange.min > 0 || priceRange.max < Infinity
  ].filter(Boolean).length;

  const activeCategoryObj = CATEGORIES.find(c => c.id === selectedCategoryId);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F5] font-sans antialiased text-[#212121]">

      {/* 1. Global Navigation Bar */}
      <Navbar
        onToggleMegaMenu={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
        isMegaMenuOpen={isMegaMenuOpen}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenTrackOrder={handleOpenTrackOrder}
        onOpenAuthModal={(msg, mode = 'login') => handleRequireAuth(() => {}, msg || 'Please login or sign up to continue', mode)}
        onSelectCategory={handleSelectCategory}
        searchQuery={searchQuery}
        onSearch={(query) => {
          setSearchQuery(query);
          setCurrentPage(1);
          setActiveView('marketplace');
          if (query && query.trim()) {
            setTimeout(() => {
              const catalogElem = document.getElementById('catalog-section');
              if (catalogElem) {
                catalogElem.scrollIntoView({ behavior: 'smooth' });
              }
            }, 60);
          }
        }}
        onSelectProduct={handleSelectProduct}
        activeView={activeView}
        setActiveView={setActiveView}
        products={allProducts}
        onVisualSearch={handleVisualSearch}
      />

      {/* 2. Mega Menu Flyout */}
      {isMegaMenuOpen && (
        <div 
          className="fixed inset-0 top-[118px] z-50 p-2 sm:p-4 bg-black/45 backdrop-blur-[2px] overflow-y-auto flex items-start justify-center animate-in fade-in duration-150"
          onClick={() => setIsMegaMenuOpen(false)}
        >
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-6xl">
            <MegaMenu
              onSelectCategory={(catId, subName) => {
                handleSelectCategory(catId, subName);
                setIsMegaMenuOpen(false);
              }}
              activeCategoryId={selectedCategoryId}
              onClose={() => setIsMegaMenuOpen(false)}
              products={allProducts}
            />
          </div>
        </div>
      )}

      {/* 3. Main Content Container (Expansive Amazon-width layout) */}
      <main className={activeView === 'flash-sale' ? 'flex-1 w-full' : 'flex-1 max-w-[1560px] mx-auto px-3 sm:px-5 w-full pt-3 pb-12 sm:pb-16'}>
        
        {/* Personal Account, Profile, Wishlist, Cart & Orders Dashboard (Only when logged in) */}
        {user && ['my-orders', 'dashboard', 'profile', 'wishlist', 'addresses', 'cart'].includes(activeView) ? (
          <MyOrdersDashboard
            initialTab={activeView === 'my-orders' || activeView === 'dashboard' ? 'orders' : activeView}
            onOpenTrackOrder={handleOpenTrackOrder}
            onSelectProduct={handleSelectProduct}
            onBackToMarketplace={() => setActiveView('marketplace')}
            onOpenCartDrawer={() => setIsCartOpen(true)}
          />
        ) : user && activeView === 'seller-center' ? (
          <SellerCentralDashboard
            onProductAdded={handleProductAdded}
            onBackToMarketplace={() => setActiveView('marketplace')}
            onDeleteProduct={handleDeleteProduct}
            onEditProduct={(prod) => setEditingProduct(prod)}
          />
        ) : activeView === 'flash-sale' ? (
          <FlashSalePage
            onBack={() => setActiveView('marketplace')}
            onSelectProduct={handleSelectProduct}
            onOpenAdminManager={() => setIsFlashSaleAdminOpen(true)}
            onRequireAuth={handleRequireAuth}
            products={allProducts}
          />
        ) : (
          <div>
            
            {/* 1. Daraz Hero Carousel + Categories */}
            {selectedCategoryId === 'all' && !searchQuery && (
              <HeroSection
                onSelectCategory={handleSelectCategory}
                onViewAll={handleViewAllEveryProduct}
              />
            )}

            {/* 2. Daraz 6 Channel Shortcut Tiles */}
            {selectedCategoryId === 'all' && !searchQuery && (
              <DarazChannels
                onSelectCategory={handleSelectCategory}
                onFilterGlobal={() => {
                  setFilterAlibabaOnly(true);
                  const elem = document.getElementById('catalog-section');
                  if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                }}
                onOpenVouchers={() => {
                  showToast("Use voucher code BHANJO10 for 10% off at checkout!");
                  setIsCartOpen(true);
                }}
                onScrollToFlashSale={() => setActiveView('flash-sale')}
              />
            )}

            {/* 4. Bhanjo Mall Flash Sale Display */}
            {selectedCategoryId === 'all' && !searchQuery && allProducts.length > 0 && (
              <DarazMall
                products={allProducts}
                onSelectProduct={handleSelectProduct}
                onSelectCategory={(catId) => setSelectedCategoryId(catId)}
                onShopAll={() => setActiveView('flash-sale')}
              />
            )}

            {/* 4b. Categories Showcase Grid / Amazon Quad Catalog Preview */}
            {selectedCategoryId === 'all' && !searchQuery && (
              categoryLayoutMode === 'amazon' ? (
                <AmazonQuadCatalog
                  onSelectCategory={handleSelectCategory}
                  selectedCategoryId={selectedCategoryId}
                  onSwitchToClassic={() => setCategoryLayoutMode('classic')}
                />
              ) : (
                <div className="relative">
                  <div className="flex justify-end mb-2">
                    <button
                      onClick={() => setCategoryLayoutMode('amazon')}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-orange-50 hover:bg-orange-100 text-[#F85606] border border-orange-200 rounded-xl transition cursor-pointer shadow-2xs"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Preview Amazon Quad Style</span>
                    </button>
                  </div>
                  <CategoriesSection
                    onSelectCategory={handleSelectCategory}
                    selectedCategoryId={selectedCategoryId}
                    onOpenMegaMenu={() => setIsMegaMenuOpen(true)}
                  />
                </div>
              )
            )}

            {/* 5. Nepal Himalayan Export Pavilion */}
            {selectedCategoryId === 'all' && !searchQuery && (
              <NepaliPavilion
                onSelectProduct={handleSelectProduct}
                onSelectCategory={(catId) => setSelectedCategoryId(catId)}
              />
            )}

            {/* 5b. Alibaba Global Factory Sourcing Section */}
            {selectedCategoryId === 'all' && !searchQuery && (
              <AlibabaGlobalSection
                products={allProducts}
                onSelectProduct={handleSelectProduct}
                onViewAll={handleViewAllGlobal}
              />
            )}

            {/* 5c. Visual Image Search Results Banner */}
            {visualSearch && (
              <div className="mb-6 bg-gradient-to-r from-orange-500 via-[#F85606] to-amber-500 rounded-2xl p-4 sm:p-5 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-orange-400/40 animate-in fade-in duration-200">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-black/40 border-2 border-white/80 flex-shrink-0 shadow-md">
                    <img src={visualSearch.imageSrc} alt="Searched Target" className="w-full h-full object-cover" />
                    <span className="absolute bottom-0 inset-x-0 bg-black/75 text-[9px] text-center font-bold text-orange-200 py-0.5">
                      Your Photo
                    </span>
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wide ${visualSearch.isExactMatch ? 'bg-emerald-500 text-white' : 'bg-white/25 text-white'}`}>
                        {visualSearch.isExactMatch ? '🎯 Exact Product Found in Bhanjo' : '✨ Visually Similar Items'}
                      </span>
                      <span className="text-xs text-orange-100 font-medium">
                        {visualSearch.confidence}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-black tracking-tight mt-1">
                      {visualSearch.isExactMatch 
                        ? `Exact Match: "${visualSearch.exactProduct?.title?.slice(0, 55)}..."` 
                        : `Showing similar ${visualSearch.detectedCategory || 'products'} matching your photo`}
                    </h3>
                    <p className="text-xs text-orange-100/90 mt-0.5">
                      Color Detected: <strong>{visualSearch.detectedColor}</strong> • Found <strong>{visualSearch.matchedProducts?.length || 0}</strong> products from Bhanjo Global Direct
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleClearVisualSearch}
                  className="w-full sm:w-auto px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer flex-shrink-0"
                >
                  <span>Clear Visual Search</span>
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* 6. Catalog Section with Left Filter Sidebar & Right Product Grid */}
            <div id="catalog-section" className="mt-12 sm:mt-16 mb-12 sm:mb-16 scroll-mt-28">
              
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 mb-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                      {selectedCategoryId === 'all' 
                        ? (searchQuery ? `"${searchQuery}"` : (filterAlibabaOnly ? '✈️ All Bhanjo Global Direct Products' : t('justForYou'))) 
                        : (language === 'ne' ? (activeCategoryObj?.nepaliName || activeCategoryObj?.name) : activeCategoryObj?.name)}
                    </h2>
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="inline-flex items-center gap-1 bg-orange-100 text-[#F85606] hover:bg-[#F85606] hover:text-white px-2 py-0.5 rounded-full text-xs font-semibold transition"
                        title="Clear search query"
                      >
                        <span>"{searchQuery}"</span>
                        <span>✕</span>
                      </button>
                    )}
                    {filterAlibabaOnly && (
                      <button
                        onClick={() => setFilterAlibabaOnly(false)}
                        className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 hover:bg-amber-200 px-2.5 py-0.5 rounded-full text-xs font-bold transition cursor-pointer"
                        title="Clear Global filter to view all products"
                      >
                        <span>✈️ Global Direct Only</span>
                        <span>✕</span>
                      </button>
                    )}
                  </div>
                  <span className="text-xs text-slate-500">
                    {filteredProducts.length.toLocaleString()} {t('productsAvailable')} {selectedCategoryId === 'all' ? (filterAlibabaOnly ? 'in Global Direct' : t('acrossAll38')) : (language === 'ne' ? activeCategoryObj?.nepaliName : activeCategoryObj?.name)}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs flex-wrap">
                  {/* View All Products Button */}
                  <button
                    onClick={handleViewAllEveryProduct}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border ${
                      pageSize === 'all' && selectedCategoryId === 'all' && !searchQuery && !filterAlibabaOnly
                        ? 'bg-gradient-to-r from-[#F85606] to-amber-500 text-white border-transparent shadow-xs'
                        : 'bg-white hover:bg-orange-50 text-slate-700 hover:text-[#F85606] border-slate-300'
                    }`}
                    title="View every single product saved till now"
                  >
                    <span>👁️ {language === 'ne' ? 'सबै हेर्नुहोस्' : 'View All'} ({allProducts.length})</span>
                  </button>

                  {/* Mode Toggle: View All vs Paginated */}
                  <div className="hidden sm:inline-flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
                    <button
                      onClick={() => { setPageSize('all'); setCurrentPage(1); }}
                      className={`px-2.5 py-1 rounded-md transition cursor-pointer ${pageSize === 'all' ? 'bg-white text-[#F85606] font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                      All ({filteredProducts.length})
                    </button>
                    <button
                      onClick={() => { setPageSize(36); setCurrentPage(1); }}
                      className={`px-2.5 py-1 rounded-md transition cursor-pointer ${pageSize === 36 ? 'bg-white text-[#F85606] font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                      36 / page
                    </button>
                  </div>

                  {/* Mobile Filters Toggle Button */}
                  <button
                    onClick={() => setIsMobileFilterOpen(true)}
                    className="lg:hidden flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:border-[#F85606] transition shadow-xs cursor-pointer"
                  >
                    <Filter className="w-3.5 h-3.5 text-[#F85606]" />
                    <span>{t('filters')}</span>
                    {activeFilterCount > 0 && (
                      <span className="bg-[#F85606] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                        {activeFilterCount}
                      </span>
                    )}
                  </button>

                  {selectedCategoryId !== 'all' && (
                    <button
                      onClick={() => handleSelectCategory('all')}
                      className="bg-[#F85606] text-white font-bold px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-1 hover:bg-[#e04e05] transition cursor-pointer"
                    >
                      <span>{language === 'ne' ? activeCategoryObj?.nepaliName : activeCategoryObj?.name}</span>
                      <span>✕</span>
                    </button>
                  )}

                  <div className="bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs">
                    <span className="text-slate-400 mr-1">{t('sortLabel')}</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-transparent text-slate-700 font-semibold focus:outline-none cursor-pointer"
                    >
                      <option value="popular">{t('popular')}</option>
                      <option value="price-low">{t('priceLowToHigh')}</option>
                      <option value="price-high">{t('priceHighToLow')}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Layout: Sidebar (3 cols) + Product Grid (9 cols) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                
                {/* Left Filter Sidebar */}
                <div className="hidden lg:block lg:col-span-3">
                  <CatalogFilterSidebar
                    priceRange={priceRange}
                    onPriceFilter={(min, max) => setPriceRange({ min, max })}
                    filterOnlyNepal={filterOnlyNepal}
                    setFilterOnlyNepal={setFilterOnlyNepal}
                    filterAlibabaOnly={filterAlibabaOnly}
                    setFilterAlibabaOnly={setFilterAlibabaOnly}
                    filterFreeDelivery={filterFreeDelivery}
                    setFilterFreeDelivery={setFilterFreeDelivery}
                    filterMallOnly={filterMallOnly}
                    setFilterMallOnly={setFilterMallOnly}
                    minRating={minRating}
                    setMinRating={setMinRating}
                    onResetFilters={handleResetFilters}
                  />
                </div>

                {/* Right Product Grid (9 cols) */}
                <div className="lg:col-span-9">
                  {filteredProducts.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs">
                      <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-2xl">
                        📦
                      </div>
                      <h3 className="text-base font-bold text-slate-800">
                        {allProducts.length === 0 ? t('catalogClearedReady') : t('noMatchFilters')}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1.5 max-w-md mx-auto">
                        {allProducts.length === 0 
                          ? t('catalogClearedDesc')
                          : t('noMatchDesc')}
                      </p>
                      {allProducts.length > 0 && (
                        <button
                          onClick={handleResetFilters}
                          className="mt-4 bg-[#F85606] hover:bg-[#E04E05] text-white font-bold text-xs px-4 py-2 rounded-lg transition"
                        >
                          {t('resetFilters')}
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                        {displayedProducts.map((product) => (
                          <ProductCard
                            key={product.id}
                            product={product}
                            onSelectProduct={handleSelectProduct}
                            onQuickChat={handleOpenQuickChat}
                            onQuickAdd={(p) => showToast(`Added "${p.title.slice(0, 24)}..." to cart!`)}
                            onRequireAuth={handleRequireAuth}
                            onDeleteProduct={isAdmin ? handleDeleteProduct : undefined}
                            onEditProduct={isAdmin ? (p) => setEditingProduct(p) : undefined}
                          />
                        ))}
                      </div>

                      {/* View All / Pagination Bar */}
                      {pageSize === 'all' ? (
                        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 bg-gradient-to-r from-orange-50 via-white to-amber-50 p-3.5 sm:p-4 rounded-xl border border-orange-200/80 shadow-2xs">
                          <div className="text-xs text-slate-700 font-medium flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span>
                              Showing <strong>all {filteredProducts.length}</strong> products saved in Bhanjo catalog (Every single product is visible)
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <button
                              onClick={() => {
                                const elem = document.getElementById('catalog-section');
                                if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                              }}
                              className="px-3 py-1.5 rounded-lg border border-slate-300 font-bold bg-white text-slate-700 hover:border-orange-400 hover:text-[#F85606] transition cursor-pointer"
                            >
                              ↑ Back to Top
                            </button>
                            <button
                              onClick={() => { setPageSize(36); setCurrentPage(1); }}
                              className="px-3 py-1.5 rounded-lg border border-slate-300 font-bold bg-white text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                            >
                              Switch to 36/page
                            </button>
                          </div>
                        </div>
                      ) : (
                        calculatedTotalPages > 1 && (
                          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-2xs">
                            <div className="text-xs text-slate-600 font-medium">
                              Showing page <span className="font-bold text-[#F85606]">{currentPage}</span> of <span className="font-bold text-slate-800">{calculatedTotalPages}</span> ({filteredProducts.length} products)
                            </div>

                            <div className="flex items-center gap-1.5 text-xs">
                              <button
                                onClick={() => { setPageSize('all'); setCurrentPage(1); }}
                                className="px-2.5 py-1.5 rounded-lg bg-orange-100 text-[#F85606] font-bold hover:bg-[#F85606] hover:text-white transition mr-2 cursor-pointer"
                              >
                                👁️ View All ({filteredProducts.length})
                              </button>
                              <button
                                disabled={currentPage <= 1}
                                onClick={() => {
                                  setCurrentPage(p => Math.max(1, p - 1));
                                  const elem = document.getElementById('catalog-section');
                                  if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="px-3 py-1.5 rounded-lg border border-slate-300 font-bold hover:bg-slate-50 transition disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
                              >
                                ← Previous
                              </button>

                              <div className="flex items-center gap-1">
                                {Array.from({ length: Math.min(5, calculatedTotalPages) }, (_, i) => {
                                  let pageNum;
                                  if (calculatedTotalPages <= 5) {
                                    pageNum = i + 1;
                                  } else if (currentPage <= 3) {
                                    pageNum = i + 1;
                                  } else if (currentPage >= calculatedTotalPages - 2) {
                                    pageNum = calculatedTotalPages - 4 + i;
                                  } else {
                                    pageNum = currentPage - 2 + i;
                                  }

                                  return (
                                    <button
                                      key={pageNum}
                                      onClick={() => {
                                        setCurrentPage(pageNum);
                                        const elem = document.getElementById('catalog-section');
                                        if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                                      }}
                                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg font-bold text-xs transition cursor-pointer ${
                                        currentPage === pageNum 
                                          ? 'bg-[#F85606] text-white shadow-xs' 
                                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                                      }`}
                                    >
                                      {pageNum}
                                    </button>
                                  );
                                })}
                              </div>

                              <button
                                disabled={currentPage >= calculatedTotalPages}
                                onClick={() => {
                                  setCurrentPage(p => Math.min(calculatedTotalPages, p + 1));
                                  const elem = document.getElementById('catalog-section');
                                  if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="px-3 py-1.5 rounded-lg border border-slate-300 font-bold hover:bg-slate-50 transition disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
                              >
                                Next →
                              </button>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>

              </div>

            </div>

          </div>
        )}

      </main>

      {/* 4. Modals & Drawers */}
      
      {/* Auth Modal (Login & Sign Up) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        message={authMessage}
        initialMode={authMode}
      />

      {/* Live Track Order Modal */}
      <TrackOrderModal
        isOpen={isTrackOrderOpen}
        onClose={() => setIsTrackOrderOpen(false)}
        initialTrackingNo={activeTrackingNo}
      />

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProductId(null)}
          onOpenChat={handleOpenQuickChat}
          onOpenCart={() => setIsCartOpen(true)}
          onRequireAuth={handleRequireAuth}
          onDeleteProduct={isAdmin ? handleDeleteProduct : undefined}
          onEditProduct={isAdmin ? (p) => setEditingProduct(p) : undefined}
        />
      )}

      {/* Product Price & Details Edit Modal */}
      <ProductEditModal
        isOpen={!!editingProduct}
        product={editingProduct}
        onClose={() => setEditingProduct(null)}
        onProductUpdated={handleProductUpdated}
        onDeleteProduct={handleDeleteProduct}
      />

      {/* Supplier Chat Modal */}
      <ChatSupplierModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        product={chatContext.product}
        supplier={chatContext.supplier}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onRequireAuth={handleRequireAuth}
        onOpenTrackOrder={handleOpenTrackOrder}
      />


      {/* Mobile Filter Slide-out Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-80 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl overflow-y-auto p-4 z-10 flex flex-col justify-between">
            <CatalogFilterSidebar
              priceRange={priceRange}
              onPriceFilter={(min, max) => setPriceRange({ min, max })}
              filterOnlyNepal={filterOnlyNepal}
              setFilterOnlyNepal={setFilterOnlyNepal}
              filterAlibabaOnly={filterAlibabaOnly}
              setFilterAlibabaOnly={setFilterAlibabaOnly}
              filterFreeDelivery={filterFreeDelivery}
              setFilterFreeDelivery={setFilterFreeDelivery}
              filterMallOnly={filterMallOnly}
              setFilterMallOnly={setFilterMallOnly}
              minRating={minRating}
              setMinRating={setMinRating}
              onResetFilters={handleResetFilters}
              onClose={() => setIsMobileFilterOpen(false)}
            />
            <button
              onClick={() => setIsMobileFilterOpen(false)}
              className="mt-4 w-full bg-[#F85606] text-white font-bold py-2.5 rounded-xl text-xs hover:bg-[#e04e05] transition cursor-pointer"
            >
              {t('applyPrice') || 'Done'} ({filteredProducts.length} Products)
            </button>
          </div>
        </div>
      )}

      {/* Global Toast */}
      <Toast
        message={toastMessage}
        isOpen={isToastOpen}
        onClose={() => setIsToastOpen(false)}
        actionLabel="View Cart"
        onAction={() => {
          setIsToastOpen(false);
          setIsCartOpen(true);
        }}
      />

      {/* 5. Minimal Daraz Footer */}
      <Footer
        onSelectCategory={(catId) => {
          setSelectedCategoryId(catId);
          setActiveView('marketplace');
        }}
      />

    </div>
  );
}
