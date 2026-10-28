import React from 'react';
import { 
  Truck, Gift, Coins, Trophy 
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

  const channels = [
    {
      id: "flash",
      title: "Flash Sale",
      subtitle: "Up to 70% Off",
      badgeLabel: "HOT",
      badgeIcon: "⚡",
      badgeClass: "bg-[#E11D48] text-white shadow-2xs",
      iconBg: "bg-rose-50 border border-rose-100 text-[#E11D48]",
      hoverStyle: "hover:border-rose-300 hover:bg-rose-50/30",
      titleHover: "group-hover:text-[#E11D48]",
      customIcon: <RedAlarmClock className="w-7 h-7 sm:w-8 sm:h-8" />,
      action: onScrollToFlashSale
    },
    {
      id: "delivery",
      title: "Free Delivery",
      subtitle: "Rs. 0 Shipping Deals",
      badgeLabel: "FREE",
      badgeIcon: "🚚",
      badgeClass: "bg-teal-50 text-[#0D9488] border border-teal-200/90 font-bold",
      iconBg: "bg-teal-50 border border-teal-100 text-[#0D9488]",
      hoverStyle: "hover:border-teal-300 hover:bg-teal-50/30",
      titleHover: "group-hover:text-[#0D9488]",
      customIcon: <Truck className="w-5 h-5 sm:w-5.5 sm:h-5.5 stroke-[2.3] text-[#0D9488]" />,
      action: onFilterFreeDelivery || (() => onSelectCategory('all'))
    },
    {
      id: "vouchers",
      title: t('dailyVouchers') || "Daily Vouchers",
      subtitle: "Collect & Save More",
      badgeLabel: "RS. 500",
      badgeIcon: "🎟️",
      badgeClass: "bg-purple-50 text-[#7E22CE] border border-purple-200/90 font-bold",
      iconBg: "bg-purple-50 border border-purple-100 text-[#7E22CE]",
      hoverStyle: "hover:border-purple-300 hover:bg-purple-50/30",
      titleHover: "group-hover:text-[#7E22CE]",
      customIcon: <Gift className="w-5 h-5 sm:w-5.5 sm:h-5.5 stroke-[2.3] text-[#7E22CE]" />,
      action: onOpenVouchers
    },
    {
      id: "budget",
      title: "Low Price Deals",
      subtitle: "Finds Under Rs. 500",
      badgeLabel: "HOT",
      badgeIcon: "🪙",
      badgeClass: "bg-amber-50 text-[#D97706] border border-amber-200/90 font-bold",
      iconBg: "bg-amber-50 border border-amber-100 text-[#D97706]",
      hoverStyle: "hover:border-amber-300 hover:bg-amber-50/30",
      titleHover: "group-hover:text-[#D97706]",
      customIcon: <Coins className="w-5 h-5 sm:w-5.5 sm:h-5.5 stroke-[2.3] text-[#D97706]" />,
      action: onFilterBudget || (() => onSelectCategory('all'))
    },
    {
      id: "bestsellers",
      title: "Best Sellers",
      subtitle: "Top Trending Deals",
      badgeLabel: "TOP 1",
      badgeIcon: "🔥",
      badgeClass: "bg-sky-50 text-[#0284C7] border border-sky-200/90 font-bold",
      iconBg: "bg-sky-50 border border-sky-100 text-[#0284C7]",
      hoverStyle: "hover:border-sky-300 hover:bg-sky-50/30",
      titleHover: "group-hover:text-[#0284C7]",
      customIcon: <Trophy className="w-5 h-5 sm:w-5.5 sm:h-5.5 stroke-[2.3] text-[#0284C7]" />,
      action: onFilterBestSellers || (() => onSelectCategory('all'))
    }
  ];

  return (
    <div className="my-3 sm:my-3.5 bg-white rounded-2xl border border-[#E5E7EB] p-2 sm:p-2.5 shadow-2xs">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-2.5">
        {channels.map((ch) => (
          <button
            key={ch.id}
            type="button"
            onClick={ch.action}
            className={`relative flex items-center gap-2 sm:gap-2.5 p-2 sm:p-2.5 rounded-xl border border-[#E5E7EB] bg-white transition-all duration-200 text-left group overflow-hidden cursor-pointer shadow-2xs hover:shadow-md hover:-translate-y-0.5 ${ch.hoverStyle}`}
          >
            {/* Themed Squircle Icon Container */}
            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-105 shadow-2xs ${ch.iconBg}`}>
              {ch.customIcon}
            </div>

            {/* Text Information */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1 justify-between">
                <div className={`text-[11.5px] sm:text-xs font-black text-[#1B1F3B] tracking-tight truncate transition-colors ${ch.titleHover}`}>
                  {ch.title}
                </div>
                {ch.badgeLabel && (
                  <span className={`inline-flex items-center gap-1 text-[8px] sm:text-[8.5px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-tight flex-shrink-0 leading-none ${ch.badgeClass}`}>
                    <span>{ch.badgeLabel}</span>
                    <span className="text-[10px] leading-none inline-block">{ch.badgeIcon}</span>
                  </span>
                )}
              </div>
              <div className="text-[9.5px] sm:text-[10px] truncate font-medium text-[#64748B] mt-0.5">
                {ch.subtitle}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// Backwards-compatibility alias
export const DarazChannels = BhanjoPillars;
export default BhanjoPillars;
