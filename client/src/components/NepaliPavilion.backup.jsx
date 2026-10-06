import React from 'react';
import { Mountain, ChevronRight, Star, ShieldCheck } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

export const NepaliPavilion = ({ onSelectProduct, onSelectCategory }) => {
  const { formatPrice } = useCurrency();

  const featuredNepaliItems = [
    {
      id: "prod-pashmina-shawl",
      title: "100% Pure Himalayan Chyangra Cashmere Pashmina",
      priceUSD: 18.50,
      originalUSD: 35.00,
      moq: "10 pcs",
      origin: "Mustang & Patan",
      image: "https://images.unsplash.com/photo-1606744888344-493238955de0?auto=format&fit=crop&w=500&q=80",
      tag: "Hallmark"
    },
    {
      id: "prod-singing-bowl-set",
      title: "7-Metal Hand-Hammered Singing Bowl Chakra Set",
      priceUSD: 54.00,
      originalUSD: 95.00,
      moq: "5 sets",
      origin: "Lalitpur Guild",
      image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=500&q=80",
      tag: "Master Craft"
    },
    {
      id: "prod-ilam-orthodox-tea",
      title: "Ilam Single-Estate Imperial Orthodox Black Tea (1kg)",
      priceUSD: 14.80,
      originalUSD: 24.00,
      moq: "50 kg",
      origin: "Ilam Valley",
      image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=500&q=80",
      tag: "Organic"
    },
    {
      id: "prod-himalayan-shilajit-resin",
      title: "Gold Grade Pure Himalayan Shilajit Resin (50g)",
      priceUSD: 12.80,
      originalUSD: 28.00,
      moq: "20 jars",
      origin: "Solukhumbu",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=500&q=80",
      tag: "85% Fulvic"
    },
    {
      id: "prod-yak-cheese-dog-chew",
      title: "100% Himalayan Organic Smoked Yak Dog Chews",
      priceUSD: 14.90,
      originalUSD: 26.00,
      moq: "50 kg",
      origin: "Langtang / Rasuwa",
      image: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=500&q=80",
      tag: "Bestseller"
    },
    {
      id: "prod-micro-hydro-pelton",
      title: "50kW-250kW Micro-Hydro Pelton Turbine Set",
      priceUSD: 7600.00,
      originalUSD: 9500.00,
      moq: "1 set",
      origin: "Butwal Heavy Tech",
      image: "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=500&q=80",
      tag: "Clean Energy"
    }
  ];

  return (
    <section className="my-6">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2.5">
          <h2 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span className="bg-red-600 text-white text-xs font-black px-2 py-0.5 rounded">🇳🇵 NEPAL</span>
            <span>Nepal Himalayan Export Pavilion</span>
          </h2>
          <span className="text-xs text-slate-500 hidden sm:inline">• 100% Authentic Products Direct from Producers</span>
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
