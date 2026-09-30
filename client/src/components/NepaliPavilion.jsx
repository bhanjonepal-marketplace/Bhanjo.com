import React from 'react';
import { Mountain, ChevronRight, Star, ShieldCheck } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

export const NepaliPavilion = ({ onSelectProduct, onSelectCategory }) => {
  const { formatPrice } = useCurrency();

  const featuredNepaliItems = [];

  if (featuredNepaliItems.length === 0) return null;

  return (
    <section className="my-6">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2.5">
          <h2 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span className="bg-red-600 text-white text-xs font-black px-2 py-0.5 rounded">🇳🇵 NEPAL</span>
            <span>Nepal Himalayan Export Pavilion</span>
          </h2>
          <span className="text-xs text-slate-500 hidden sm:inline">• 100% Authentic GI Products Direct from Producers</span>
        </div>

        <button 
          onClick={() => onSelectCategory('apparel-accessories')}
          className="text-xs font-bold text-[#F85606] hover:underline flex items-center"
        >
          <span>VIEW ALL NEPAL GOODS</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {featuredNepaliItems.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectProduct(item.id)}
            className="bg-white rounded-xl border border-slate-200 hover:border-red-400 p-2.5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div className="relative aspect-square rounded-lg overflow-hidden bg-slate-100 mb-2">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <span className="absolute top-1.5 left-1.5 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                {item.tag}
              </span>
              <span className="absolute bottom-1.5 right-1.5 bg-black/60 text-white text-[8px] font-medium px-1.5 py-0.5 rounded backdrop-blur-xs">
                {item.origin}
              </span>
            </div>

            <div>
              <h3 className="text-xs font-medium text-slate-800 line-clamp-2 leading-snug group-hover:text-[#F85606] transition" title={item.title}>
                {item.title}
              </h3>
              <div className="mt-1.5">
                <div className="text-sm font-black text-[#F85606]">
                  {formatPrice(item.priceUSD)}
                </div>
                <div className="text-[10px] text-slate-400 line-through">
                  {formatPrice(item.originalUSD)}
                </div>
              </div>
            </div>

            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
              <span>MOQ: <strong>{item.moq}</strong></span>
              <span className="text-emerald-700 font-bold">Verified</span>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};
