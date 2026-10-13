import React from 'react';
import { Home, LayoutGrid, Zap, ShoppingCart, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const MobileAppBottomNav = ({
  activeView,
  setActiveView,
  onOpenCart,
  onOpenAuthModal,
  onToggleCategories,
  onResetToHome
}) => {
  const { cartCount } = useCart();
  const { user } = useAuth();

  const handleHomeClick = () => {
    if (onResetToHome) {
      onResetToHome();
    } else {
      setActiveView('marketplace');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCategoriesClick = () => {
    if (activeView !== 'marketplace') {
      setActiveView('marketplace');
    }
    if (onToggleCategories) {
      onToggleCategories();
    } else {
      const el = document.getElementById('categories-section') || document.getElementById('catalog-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFlashSaleClick = () => {
    setActiveView('flash-sale');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAccountClick = () => {
    if (user) {
      setActiveView('my-orders');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (onOpenAuthModal) {
      onOpenAuthModal('Please login or sign up to view your profile and orders');
    }
  };

  return (
    <nav
      aria-label="Mobile App Navigation"
      className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_25px_rgba(0,0,0,0.08)] py-1.5 px-3 select-none"
      style={{ paddingBottom: 'max(0.375rem, env(safe-area-inset-bottom))' }}
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">

        {/* 1. Home */}
        <button
          type="button"
          onClick={handleHomeClick}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all active:scale-90 cursor-pointer ${activeView === 'marketplace' ? 'text-[#F85606]' : 'text-slate-500 hover:text-slate-700'
            }`}
        >
          <Home className={`w-5 h-5 ${activeView === 'marketplace' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className={`text-[10px] mt-0.5 tracking-tight ${activeView === 'marketplace' ? 'font-black' : 'font-semibold'}`}>
            Home
          </span>
          {activeView === 'marketplace' && (
            <span className="w-1.5 h-1.5 bg-[#F85606] rounded-full mt-0.5 animate-in zoom-in" />
          )}
        </button>

        {/* 2. Categories */}
        <button
          type="button"
          onClick={handleCategoriesClick}
          className="flex flex-col items-center justify-center flex-1 py-1 text-slate-500 hover:text-slate-700 transition-all active:scale-90 cursor-pointer"
        >
          <LayoutGrid className="w-5 h-5 stroke-2" />
          <span className="text-[10px] font-semibold mt-0.5 tracking-tight">
            Categories
          </span>
        </button>

        {/* 3. Flash Deals */}
        <button
          type="button"
          onClick={handleFlashSaleClick}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all active:scale-90 cursor-pointer relative ${activeView === 'flash-sale' ? 'text-[#E00028]' : 'text-slate-500 hover:text-slate-700'
            }`}
        >
          <div className="relative">
            <Zap className={`w-5 h-5 ${activeView === 'flash-sale' ? 'fill-current text-[#E00028]' : 'text-amber-500 fill-current'}`} />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          </div>
          <span className={`text-[10px] mt-0.5 tracking-tight ${activeView === 'flash-sale' ? 'font-black text-[#E00028]' : 'font-semibold'}`}>
            Flash Sale
          </span>
          {activeView === 'flash-sale' && (
            <span className="w-1.5 h-1.5 bg-[#E00028] rounded-full mt-0.5 animate-in zoom-in" />
          )}
        </button>

        {/* 4. Cart */}
        <button
          type="button"
          onClick={onOpenCart}
          className="flex flex-col items-center justify-center flex-1 py-1 text-slate-500 hover:text-slate-700 transition-all active:scale-90 cursor-pointer relative"
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5 stroke-2" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#F85606] text-white text-[9px] font-black min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center shadow-xs">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-semibold mt-0.5 tracking-tight">
            Cart
          </span>
        </button>

        {/* 5. Account */}
        <button
          type="button"
          onClick={handleAccountClick}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all active:scale-90 cursor-pointer ${activeView === 'my-orders' ? 'text-[#F85606]' : 'text-slate-500 hover:text-slate-700'
            }`}
        >
          <User className={`w-5 h-5 ${activeView === 'my-orders' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className={`text-[10px] mt-0.5 tracking-tight ${activeView === 'my-orders' ? 'font-black' : 'font-semibold'}`}>
            {user ? 'Account' : 'Login'}
          </span>
          {activeView === 'my-orders' && (
            <span className="w-1.5 h-1.5 bg-[#F85606] rounded-full mt-0.5 animate-in zoom-in" />
          )}
        </button>

      </div>
    </nav>
  );
};
