import React from 'react';
import { 
  Store, Mountain, Gift, Zap, Sparkles, Globe, 
  Truck, Shirt, Smartphone, Coins, Trophy 
} from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { RedAlarmClock } from './RedAlarmClock';

export const BhanjoPillars = ({ 
  onSelectCategory, 
  onOpenVouchers, 
  onScrollToFlashSale, 
  onFilterGlobal,
  onFilterMall,
  onFilterFreeDelivery,
  onFilterNepal,
  onFilterBudget,
  onFilterBestSellers
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
      badgeLabel: "HOT",
      badgeIcon: "⚡",
      badgeColor: "bg-[#FF3F60] text-white shadow-xs animate-pulse",
      titleColor: "text-slate-900 group-hover:text-[#FF3F60]",
      subtitleColor: "text-rose-700/80",
      cardStyle: "bg-gradient-to-br from-[#FFF0F3] via-[#FFE6EB] to-[#FFD8E0] border border-[#FFB8C6] shadow-2xs hover:shadow-md hover:border-[#FF3F60] hover:scale-[1.02]",
      emoji: null,
      customIcon: <RedAlarmClock className="w-8 h-8" />,
      action: onScrollToFlashSale
    },
    {
      id: "delivery",
      title: "Free Delivery",
      subtitle: "Rs. 0 Shipping Deals",
      badgeLabel: "FREE",
      badgeIcon: "🚚",
      badgeColor: "bg-white/90 text-[#059669] border border-[#A7F3D0] shadow-2xs font-bold",
      titleColor: "text-slate-900 group-hover:text-[#059669]",
      subtitleColor: "text-emerald-700/80",
      cardStyle: "bg-gradient-to-br from-[#F0FDF8] via-[#E6F9F0] to-[#DBF5EA] border border-[#BDEBD5] shadow-2xs hover:shadow-md hover:border-[#10B981] hover:scale-[1.02]",
      customIcon: <Truck className="w-5 h-5 sm:w-5.5 sm:h-5.5 stroke-[2.3] text-[#059669]" />,
      action: onFilterFreeDelivery || (() => onSelectCategory('all'))
    },
    {
      id: "vouchers",
      title: t('dailyVouchers') || "Daily Vouchers",
      subtitle: "Collect & Save More",
      badgeLabel: "RS. 500",
      badgeIcon: "🎟️",
      badgeColor: "bg-white/90 text-[#7E22CE] border border-[#E9D5FF] shadow-2xs font-bold",
      titleColor: "text-slate-900 group-hover:text-[#7E22CE]",
      subtitleColor: "text-purple-700/80",
      cardStyle: "bg-gradient-to-br from-[#FAF7FE] via-[#F3EDFD] to-[#EBE0FC] border border-[#DCCEF7] shadow-2xs hover:shadow-md hover:border-[#9333EA] hover:scale-[1.02]",
      customIcon: <Gift className="w-5 h-5 sm:w-5.5 sm:h-5.5 stroke-[2.3] text-[#7E22CE]" />,
      action: onOpenVouchers
    },
    {
      id: "budget",
      title: "Low Price Deals",
      subtitle: "Finds Under Rs. 500",
      badgeLabel: "HOT",
      badgeIcon: "🪙",
      badgeColor: "bg-white/90 text-[#B45309] border border-[#FDE68A] shadow-2xs font-bold",
      titleColor: "text-slate-900 group-hover:text-[#D97706]",
      subtitleColor: "text-amber-800/80",
      cardStyle: "bg-gradient-to-br from-[#FFFDF5] via-[#FFF8E6] to-[#FEF0D0] border border-[#FDE1A9] shadow-2xs hover:shadow-md hover:border-[#F59E0B] hover:scale-[1.02]",
      customIcon: <Coins className="w-5 h-5 sm:w-5.5 sm:h-5.5 stroke-[2.3] text-[#D97706]" />,
      action: onFilterBudget || (() => onSelectCategory('all'))
    },
    {
      id: "bestsellers",
      title: "Best Sellers",
      subtitle: "Top Trending Deals",
      badgeLabel: "TOP 1",
      badgeIcon: "🔥",
      badgeColor: "bg-white/90 text-[#0284C7] border border-[#BAE6FD] shadow-2xs font-bold",
      titleColor: "text-slate-900 group-hover:text-[#0284C7]",
      subtitleColor: "text-sky-700/80",
      cardStyle: "bg-gradient-to-br from-[#F5FAFF] via-[#EBF4FD] to-[#DEEFFF] border border-[#C2E0F9] shadow-2xs hover:shadow-md hover:border-[#0284C7] hover:scale-[1.02]",
      customIcon: <Trophy className="w-5 h-5 sm:w-5.5 sm:h-5.5 stroke-[2.3] text-[#0284C7]" />,
      action: onFilterBestSellers || (() => onSelectCategory('all'))
    }
  ];

  return (
    <div className="my-3 sm:my-4 bg-white/95 rounded-2xl border border-slate-200/80 p-2.5 sm:p-3.5 shadow-sm">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-2.5">
        {channels.map((ch) => {
          const FallbackIcon = ch.fallbackIcon;
          return (
            <button
              key={ch.id}
              onClick={ch.action}
              className={`relative flex items-center gap-2 sm:gap-2.5 p-2 sm:p-2.5 rounded-xl transition-all text-left group overflow-hidden cursor-pointer ${ch.cardStyle}`}
            >
              {/* White Squircle Icon Container matching Flash Sale style */}
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white shadow-2xs border border-slate-200/60 flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110">
                {ch.customIcon ? (
                  ch.customIcon
                ) : ch.emoji ? (
                  <span className="text-lg sm:text-xl select-none leading-none drop-shadow-xs">{ch.emoji}</span>
                ) : (
                  <FallbackIcon className="w-5 h-5 stroke-[2.2] text-slate-800" />
                )}
              </div>

              {/* Text Information */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1 justify-between">
                  <div className={`text-[11px] sm:text-xs font-black truncate ${ch.titleColor || 'text-slate-900'}`}>
                    {ch.title}
                  </div>
                  {ch.badgeLabel && (
                    <span className={`inline-flex items-center gap-1.5 text-[8px] sm:text-[8.5px] font-black px-2 py-0.5 rounded-full uppercase tracking-tight flex-shrink-0 leading-none ${ch.badgeColor}`}>
                      <span>{ch.badgeLabel}</span>
                      <span className="text-[14px] sm:text-[15px] leading-none inline-block drop-shadow-2xs">{ch.badgeIcon}</span>
                    </span>
                  )}
                </div>
                <div className={`text-[9px] sm:text-[10px] truncate font-medium ${ch.subtitleColor || 'text-slate-600'}`}>
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

// Backwards-compatibility alias
export const DarazChannels = BhanjoPillars;
export default BhanjoPillars;
