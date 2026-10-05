import React from 'react';
import { Store, Mountain, Truck, Gift, Zap, Sparkles, Globe } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { useAuth } from '../context/AuthContext';
import { RedAlarmClock } from './RedAlarmClock';

export const DarazChannels = ({ 
  onSelectCategory, 
  onOpenVouchers, 
  onScrollToFlashSale, 
  onFilterGlobal 
}) => {
  const { t } = useCurrency();

  const handleGlobalClick = () => {
    if (onFilterGlobal) {
      onFilterGlobal();
    } else {
      const elem = document.getElementById('catalog-section');
      if (elem) elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const channels = [
    {
      id: "flash",
      title: "Flash Sale",
      subtitle: "Up to 70% Off",
      badge: "HOT ⚡",
      icon: Zap,
      isSpecial: true,
      cardStyle: "bg-gradient-to-r from-[#D80027] via-[#FF0036] to-[#E60021] text-white shadow-md shadow-red-500/30 ring-2 ring-red-400/50 hover:shadow-red-500/50 hover:scale-[1.02]",
      iconBg: "bg-white text-red-600 shadow-sm",
      action: onScrollToFlashSale
    },
    {
      id: "global",
      title: "Bhanjo Global",
      subtitle: "Direct Factory Import",
      badge: "Global Direct",
      icon: Globe,
      cardStyle: "bg-gradient-to-br from-blue-50/80 via-white to-sky-50/50 border border-blue-200/80 hover:border-blue-400 hover:shadow-md",
      iconBg: "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-sm",
      action: handleGlobalClick
    },
    {
      id: "mall",
      title: t('mallTitle'),
      subtitle: "100% Authentic Brands",
      badge: "OFFICIAL",
      icon: Store,
      cardStyle: "bg-gradient-to-br from-rose-50/80 via-white to-orange-50/50 border border-rose-200/80 hover:border-rose-400 hover:shadow-md",
      iconBg: "bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-sm",
      action: () => onSelectCategory('all')
    },
    {
      id: "nepal",
      title: t('nepalPavilion'),
      subtitle: "Himalayan GI Goods",
      badge: "EXPORT",
      icon: Mountain,
      cardStyle: "bg-gradient-to-br from-amber-50/80 via-white to-emerald-50/50 border border-amber-200/80 hover:border-amber-400 hover:shadow-md",
      iconBg: "bg-gradient-to-br from-amber-500 to-emerald-600 text-white shadow-sm",
      action: () => onSelectCategory('apparel-accessories')
    },
    {
      id: "bestsellers",
      title: "Best Sellers",
      subtitle: "Top Trending Deals",
      badge: "POPULAR",
      icon: Sparkles,
      cardStyle: "bg-gradient-to-br from-orange-50/80 via-white to-amber-50/50 border border-orange-200/80 hover:border-orange-400 hover:shadow-md",
      iconBg: "bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-sm",
      action: () => onSelectCategory('all')
    },
    {
      id: "vouchers",
      title: t('dailyVouchers'),
      subtitle: "Collect & Save More",
      badge: "RS. 500",
      icon: Gift,
      cardStyle: "bg-gradient-to-br from-purple-50/80 via-white to-fuchsia-50/50 border border-purple-200/80 hover:border-purple-400 hover:shadow-md",
      iconBg: "bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-sm",
      action: onOpenVouchers
    }
  ];

  return (
    <div className="my-4 bg-white rounded-2xl border border-slate-200/90 p-3 shadow-sm">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {channels.map((ch) => {
          const Icon = ch.icon;
          return (
            <button
              key={ch.id}
              onClick={ch.action}
              className={`relative flex items-center gap-2.5 p-2.5 rounded-xl transition-all text-left group overflow-hidden cursor-pointer ${ch.cardStyle}`}
            >
              {/* Icon Container with subtle animation on hover */}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 ${ch.iconBg}`}>
                {ch.id === 'flash' ? (
                  <RedAlarmClock className="w-8 h-8" />
                ) : (
                  <Icon className="w-5 h-5 stroke-[2.2]" />
                )}
              </div>

              {/* Text Information */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 justify-between">
                  <div className={`text-xs font-black truncate ${ch.isSpecial ? 'text-white' : 'text-slate-900 group-hover:text-orange-600'}`}>
                    {ch.title}
                  </div>
                  {ch.badge && (
                    <span className={`text-[8px] font-black px-1.5 py-0.2 rounded-full uppercase tracking-tighter ${
                      ch.isSpecial 
                        ? 'bg-yellow-300 text-red-950 shadow-xs animate-pulse' 
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {ch.badge}
                    </span>
                  )}
                </div>
                <div className={`text-[10px] truncate font-medium ${ch.isSpecial ? 'text-yellow-200' : 'text-slate-500'}`}>
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
