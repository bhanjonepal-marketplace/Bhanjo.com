import React from 'react';
import { Store, Mountain, Truck, Gift, Zap, Sparkles, Globe } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { useAuth } from '../context/AuthContext';

export const DarazChannels = ({ 
  onSelectCategory, 
  onOpenVouchers, 
  onScrollToFlashSale, 
  onOpenAlibabaSourcing,
  onFilterGlobal 
}) => {
  const { t } = useCurrency();
  const { isAdmin } = useAuth();

  const handleGlobalClick = () => {
    if (isAdmin && onOpenAlibabaSourcing) {
      onOpenAlibabaSourcing();
    } else if (onFilterGlobal) {
      onFilterGlobal();
    } else {
      const elem = document.getElementById('catalog-section');
      if (elem) elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const channels = [
    {
      id: isAdmin ? "alibaba" : "global",
      title: isAdmin ? t('alibabaDirect') : "Bhanjo Global",
      subtitle: isAdmin ? t('factorySourcing') : "Direct Import Deals",
      icon: isAdmin ? Zap : Globe,
      iconColor: "text-[#FF6A00] bg-orange-100",
      action: handleGlobalClick
    },
    {
      id: "mall",
      title: t('mallTitle'),
      subtitle: t('mallSub'),
      icon: Store,
      iconColor: "text-red-600 bg-red-50",
      action: () => onSelectCategory('all')
    },
    {
      id: "nepal",
      title: t('nepalPavilion'),
      subtitle: t('nepalSub'),
      icon: Mountain,
      iconColor: "text-amber-600 bg-amber-50",
      action: () => onSelectCategory('apparel-accessories')
    },
    {
      id: "flash",
      title: t('flashSale'),
      subtitle: t('flashSub'),
      icon: Zap,
      iconColor: "text-[#F85606] bg-orange-50",
      action: onScrollToFlashSale
    },
    {
      id: "bestsellers",
      title: "Best Sellers",
      subtitle: "Top Trending Deals",
      icon: Sparkles,
      iconColor: "text-amber-600 bg-amber-50",
      action: () => onSelectCategory('all')
    },
    {
      id: "vouchers",
      title: t('dailyVouchers'),
      subtitle: t('vouchersSub'),
      icon: Gift,
      iconColor: "text-purple-600 bg-purple-50",
      action: onOpenVouchers
    }
  ];

  return (
    <div className="my-4 bg-white rounded-xl border border-slate-200 p-3 shadow-xs">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {channels.map((ch) => {
          const Icon = ch.icon;
          return (
            <button
              key={ch.id}
              onClick={ch.action}
              className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 transition text-left group"
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${ch.iconColor} group-hover:scale-105 transition-transform`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-800 truncate group-hover:text-[#F85606] transition">
                  {ch.title}
                </div>
                <div className="text-[10px] text-slate-500 truncate">
                  {ch.subtitle}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
