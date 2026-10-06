import React from 'react';
import { Store, Mountain, Gift, Zap, Sparkles, Globe } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
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
      badgeColor: "bg-yellow-300 text-red-950 shadow-xs animate-pulse",
      subtitleColor: "text-yellow-200",
      cardStyle: "bg-gradient-to-r from-[#D80027] via-[#FF0036] to-[#E60021] text-white shadow-md shadow-red-500/30 ring-2 ring-red-400/50 hover:shadow-red-500/50 hover:scale-[1.02]",
      emoji: null,
      customIcon: <RedAlarmClock className="w-8 h-8" />,
      action: onScrollToFlashSale
    },
    {
      id: "global",
      title: "Bhanjo Global",
      subtitle: "Direct Factory Import",
      badge: "GLOBAL ✈️",
      badgeColor: "bg-sky-200 text-blue-950 shadow-xs",
      subtitleColor: "text-sky-100",
      cardStyle: "bg-gradient-to-r from-[#0052D4] via-[#2A65F0] to-[#4364F7] text-white shadow-md shadow-blue-500/25 ring-2 ring-blue-300/50 hover:shadow-blue-500/40 hover:scale-[1.02]",
      emoji: "✈️",
      fallbackIcon: Globe,
      action: handleGlobalClick
    },
    {
      id: "mall",
      title: t('mallTitle'),
      subtitle: "100% Authentic Brands",
      badge: "OFFICIAL 👑",
      badgeColor: "bg-amber-300 text-rose-950 shadow-xs",
      subtitleColor: "text-rose-100",
      cardStyle: "bg-gradient-to-r from-[#880E4F] via-[#AD1457] to-[#C2185B] text-white shadow-md shadow-pink-500/25 ring-2 ring-pink-300/50 hover:shadow-pink-500/40 hover:scale-[1.02]",
      emoji: "🏬",
      fallbackIcon: Store,
      action: () => onSelectCategory('all')
    },
    {
      id: "nepal",
      title: t('nepalPavilion'),
      subtitle: t('nepalSub') || "Himalayan Authentic Goods",
      badge: "EXPORT 🇳🇵",
      badgeColor: "bg-amber-300 text-emerald-950 shadow-xs",
      subtitleColor: "text-emerald-100",
      cardStyle: "bg-gradient-to-r from-[#0A5C36] via-[#0E8A44] to-[#1E9E64] text-white shadow-md shadow-emerald-500/25 ring-2 ring-emerald-300/50 hover:shadow-emerald-500/40 hover:scale-[1.02]",
      emoji: "🏔️",
      fallbackIcon: Mountain,
      action: () => onSelectCategory('apparel-accessories')
    },
    {
      id: "bestsellers",
      title: "Best Sellers",
      subtitle: "Top Trending Deals",
      badge: "TOP 1 🔥",
      badgeColor: "bg-rose-500 text-white shadow-xs",
      subtitleColor: "text-amber-100",
      cardStyle: "bg-gradient-to-r from-[#E65100] via-[#F57C00] to-[#FF8F00] text-white shadow-md shadow-orange-500/25 ring-2 ring-amber-300/50 hover:shadow-orange-500/40 hover:scale-[1.02]",
      emoji: "🏆",
      fallbackIcon: Sparkles,
      action: () => onSelectCategory('all')
    },
    {
      id: "vouchers",
      title: t('dailyVouchers'),
      subtitle: "Collect & Save More",
      badge: "RS. 500 🎟️",
      badgeColor: "bg-emerald-300 text-purple-950 shadow-xs",
      subtitleColor: "text-purple-100",
      cardStyle: "bg-gradient-to-r from-[#5E17EB] via-[#7B2CBF] to-[#9D4EDD] text-white shadow-md shadow-purple-500/25 ring-2 ring-purple-300/50 hover:shadow-purple-500/40 hover:scale-[1.02]",
      emoji: "🎁",
      fallbackIcon: Gift,
      action: onOpenVouchers
    }
  ];

  return (
    <div className="my-4 bg-white rounded-2xl border border-slate-200/90 p-3 shadow-sm">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {channels.map((ch) => {
          const FallbackIcon = ch.fallbackIcon;
          return (
            <button
              key={ch.id}
              onClick={ch.action}
              className={`relative flex items-center gap-2.5 p-2.5 rounded-xl transition-all text-left group overflow-hidden cursor-pointer ${ch.cardStyle}`}
            >
              {/* White Squircle Icon Container matching Flash Sale style */}
              <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110">
                {ch.customIcon ? (
                  ch.customIcon
                ) : ch.emoji ? (
                  <span className="text-xl select-none leading-none drop-shadow-xs">{ch.emoji}</span>
                ) : (
                  <FallbackIcon className="w-5 h-5 stroke-[2.2] text-slate-800" />
                )}
              </div>

              {/* Text Information */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 justify-between">
                  <div className="text-xs font-black truncate text-white">
                    {ch.title}
                  </div>
                  {ch.badge && (
                    <span className={`text-[8px] font-black px-1.5 py-0.2 rounded-full uppercase tracking-tighter ${ch.badgeColor}`}>
                      {ch.badge}
                    </span>
                  )}
                </div>
                <div className={`text-[10px] truncate font-medium ${ch.subtitleColor}`}>
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
