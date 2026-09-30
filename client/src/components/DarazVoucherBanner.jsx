import React, { useState } from 'react';
import { Ticket, Gift, Check, Sparkles, Tag, ArrowRight } from 'lucide-react';
import { VOUCHERS } from '../data/deals';
import { useCurrency } from '../context/CurrencyContext';
import confetti from 'canvas-confetti';

export const DarazVoucherBanner = () => {
  const { currentCurrency } = useCurrency();
  const [collectedVouchers, setCollectedVouchers] = useState([]);

  const handleCollect = (voucherId) => {
    if (collectedVouchers.includes(voucherId)) return;
    setCollectedVouchers(prev => [...prev, voucherId]);
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.8 }
    });
  };

  return (
    <div className="my-6 bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 rounded-2xl p-4 sm:p-5 text-white shadow-md relative overflow-hidden">
      
      {/* Decorative subtle patterns */}
      <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white text-orange-600 flex items-center justify-center flex-shrink-0 shadow">
            <Gift className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm sm:text-base text-white tracking-tight">
                Daily Vouchers & Nepali Festive Discounts
              </h3>
              <span className="bg-yellow-300 text-slate-900 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                Collect Now
              </span>
            </div>
            <p className="text-white/85 text-xs mt-0.5">
              Collect vouchers now and discounts will automatically apply at checkout across all categories.
            </p>
          </div>
        </div>

        {/* Vouchers Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full lg:w-auto">
          {VOUCHERS.map((vouch) => {
            const isCollected = collectedVouchers.includes(vouch.id);

            return (
              <div
                key={vouch.id}
                className="bg-white/15 backdrop-blur-md rounded-xl p-2.5 border border-white/25 flex flex-col justify-between"
              >
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-yellow-300 block">
                    {vouch.badge}
                  </span>
                  <div className="font-black text-xs sm:text-sm text-white mt-0.5">
                    {currentCurrency.code === 'NPR' ? vouch.title : vouch.titleUSD}
                  </div>
                  <div className="text-[10px] text-white/80 mt-0.5">
                    {currentCurrency.code === 'NPR' ? vouch.minSpendNPR : vouch.minSpendUSD}
                  </div>
                </div>

                <button
                  onClick={() => handleCollect(vouch.id)}
                  disabled={isCollected}
                  className={`mt-2.5 text-[10px] font-extrabold py-1 px-2.5 rounded-lg transition text-center flex items-center justify-center gap-1 ${
                    isCollected
                      ? 'bg-white text-emerald-700'
                      : 'bg-white text-orange-600 hover:bg-yellow-300 hover:text-slate-900 shadow-sm'
                  }`}
                >
                  {isCollected ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>COLLECTED</span>
                    </>
                  ) : (
                    <span>COLLECT</span>
                  )}
                </button>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
