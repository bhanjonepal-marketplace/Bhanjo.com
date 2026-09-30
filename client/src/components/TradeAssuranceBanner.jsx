import React from 'react';
import { ShieldCheck, Lock, Truck, RefreshCw, Award, CheckCircle2 } from 'lucide-react';

export const TradeAssuranceBanner = () => {
  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 my-8 shadow-xl border border-indigo-500/20 relative overflow-hidden">
      {/* Background subtle Nepali mountain silhouette / glowing orb */}
      <div className="absolute -right-16 -top-16 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-700/60">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30 flex-shrink-0">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                  Bhanjo <span className="text-amber-400">Trade Assurance™</span>
                </h3>
                <span className="bg-amber-400/20 text-amber-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-amber-400/30">
                  Global & Nepal Escrow Protection
                </span>
              </div>
              <p className="text-slate-300 text-sm mt-1 max-w-2xl">
                Protect your wholesale orders from payment to delivery. Your funds are held securely in escrow until goods pass pre-shipment inspection.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-800/80 border border-slate-700 px-4 py-2 rounded-lg text-right">
              <span className="text-xs text-slate-400 block">Orders Protected</span>
              <span className="text-lg font-bold text-amber-400">$85,400,000+</span>
            </div>
            <div className="bg-slate-800/80 border border-slate-700 px-4 py-2 rounded-lg text-right">
              <span className="text-xs text-slate-400 block">Inspection Pass Rate</span>
              <span className="text-lg font-bold text-emerald-400">99.8%</span>
            </div>
          </div>
        </div>

        {/* 4 Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="bg-slate-800/50 hover:bg-slate-800/80 transition p-4 rounded-xl border border-slate-700/50 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 mt-0.5">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-slate-100">100% Payment Escrow</h4>
              <p className="text-xs text-slate-400 mt-0.5">Funds released to supplier only after buyer verification and bill of lading approval.</p>
            </div>
          </div>

          <div className="bg-slate-800/50 hover:bg-slate-800/80 transition p-4 rounded-xl border border-slate-700/50 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 mt-0.5">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-slate-100">Quality Inspection</h4>
              <p className="text-xs text-slate-400 mt-0.5">Free pre-shipment quality audit by certified inspectors in Kathmandu, Guangzhou & Delhi.</p>
            </div>
          </div>

          <div className="bg-slate-800/50 hover:bg-slate-800/80 transition p-4 rounded-xl border border-slate-700/50 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400 mt-0.5">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-slate-100">On-Time Dispatch</h4>
              <p className="text-xs text-slate-400 mt-0.5">Automatic compensation for shipping delays on all Trade Assurance wholesale contracts.</p>
            </div>
          </div>

          <div className="bg-slate-800/50 hover:bg-slate-800/80 transition p-4 rounded-xl border border-slate-700/50 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400 mt-0.5">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-slate-100">Easy Refund Policy</h4>
              <p className="text-xs text-slate-400 mt-0.5">30-day hassle-free claim resolution backed by local Nepali banks & international escrow.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
