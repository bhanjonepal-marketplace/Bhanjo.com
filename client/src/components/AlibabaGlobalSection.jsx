import React from 'react';
import { Zap, ChevronRight, Star, ShieldCheck, Truck, Plus, ExternalLink, Globe } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { useAuth } from '../context/AuthContext';

export const AlibabaGlobalSection = ({ products = [], onSelectProduct, onOpenImporter }) => {
  const { formatPrice } = useCurrency();
  const { isAdmin } = useAuth();

  // Filter or prioritize Alibaba / imported products
  const alibabaProducts = products.filter(p => p.isAlibabaImport || p.is1688Import || p.id.startsWith('ali-') || p.id.startsWith('1688-'));

  if (alibabaProducts.length === 0) return null;

  return (
    <section className="my-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 px-1 gap-2">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2">
            <span className="bg-gradient-to-r from-[#FF6A00] via-[#EE5007] to-[#E60012] text-white text-xs font-black px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
              {isAdmin ? (
                <span>🇨🇳 ALIBABA & 1688 DIRECT</span>
              ) : (
                <span>✈️ BHANJO GLOBAL DIRECT</span>
              )}
            </span>
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
              {isAdmin 
                ? "Global Factory Sourcing (ग्लोबल सोर्साङ)" 
                : "International Trending Collection (ग्लोबल कलेक्सन)"
              }
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Admin Sourcing Button (Hidden in Customer Mode) */}
          {isAdmin && onOpenImporter && (
            <button
              onClick={onOpenImporter}
              className="bg-orange-50 hover:bg-orange-100 text-[#FF6A00] border border-orange-200 text-xs font-bold px-3 py-1.5 rounded-lg transition flex items-center gap-1 shadow-2xs cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-[#FF6A00]" />
              <span>Import Alibaba / 1688</span>
            </button>
          )}

          <button 
            onClick={() => {
              const catalogElem = document.getElementById('catalog-section');
              if (catalogElem) catalogElem.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-xs font-bold text-[#FF6A00] hover:text-[#EE5007] flex items-center transition cursor-pointer"
          >
            <span>View All ({alibabaProducts.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Grid of Cards (Up to 12 Factory SKUs) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {alibabaProducts.slice(0, 12).map((item) => {
          const displayPrice = item.priceTiers?.[item.priceTiers.length - 1]?.price || item.samplePrice || 25;
          const originalPrice = displayPrice * 1.35;

          return (
            <div
              key={item.id}
              onClick={() => onSelectProduct(item.id)}
              className="bg-white rounded-xl border border-slate-200 hover:border-orange-400 hover:shadow-md transition duration-150 p-2.5 flex flex-col justify-between cursor-pointer group relative overflow-hidden"
            >
              {/* Image Box */}
              <div className="aspect-square rounded-lg overflow-hidden bg-slate-50 relative mb-2">
                <img
                  src={item.images?.[0] || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400'}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />

                <span className="absolute top-1.5 left-1.5 bg-[#FF6A00] text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs z-10 flex items-center gap-0.5">
                  {isAdmin ? '🇨🇳 Factory' : '✈️ Global Direct'}
                </span>

                <span className="absolute bottom-1.5 left-1.5 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs z-10">
                  {isAdmin ? `MOQ: ${item.moq || 1} ${item.unit || 'pcs'}` : 'Verified Stock'}
                </span>
              </div>

              {/* Title & Specs */}
              <div>
                <span className="text-[10px] text-orange-600 font-bold block mb-0.5 truncate">
                  {item.categoryName || 'Global Collection'}
                </span>

                <h3 className="text-xs font-semibold text-slate-800 line-clamp-2 leading-tight group-hover:text-[#FF6A00] transition">
                  {item.title}
                </h3>

                <div className="mt-2">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-sm font-black text-[#FF6A00]">
                      {formatPrice(displayPrice)}
                    </span>
                    <span className="text-[10px] text-slate-400 line-through">
                      {formatPrice(originalPrice)}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium block">
                    {isAdmin ? 'FOB China / Landed DDP' : 'Direct Import • Fast Delivery Nepal'}
                  </span>
                </div>
              </div>

              {/* Footer Badge */}
              <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                <span className="flex items-center gap-0.5 truncate">
                  <ShieldCheck className="w-3 h-3 text-amber-500 flex-shrink-0" />
                  <span className="truncate">
                    {isAdmin ? `${item.verifiedYear || 8}Y Gold Mfr` : 'Verified Seller'}
                  </span>
                </span>
                <span className="font-bold text-slate-700">★ {item.rating || 4.9}</span>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
};
