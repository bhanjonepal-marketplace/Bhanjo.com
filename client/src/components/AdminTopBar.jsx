import React from 'react';
import { ShieldCheck, Zap, Package, Eye, Store, ArrowRight, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminTopBar = ({ onOpenImporter, onOpenSellerCenter, onOpenFlashSaleManager }) => {
  const { isAdmin, setAdminMode } = useAuth();

  if (!isAdmin) return null;

  return (
    <div className="bg-slate-900 border-b border-slate-800 text-white text-xs px-3 sm:px-6 py-2 relative z-30 shadow-xs">
      <div className="max-w-[1560px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        
        {/* Left: Status badge */}
        <div className="flex items-center gap-2">
          <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black px-2 py-0.5 rounded text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-xs">
            <ShieldCheck className="w-3 h-3 text-slate-950" />
            <span>Store Admin Active</span>
          </span>
          <span className="text-slate-300 text-[11px] hidden md:inline">
            Management privileges unlocked. Customers will not see these tools.
          </span>
        </div>

        {/* Right: Quick Admin Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-end">
          {onOpenFlashSaleManager && (
            <button
              onClick={onOpenFlashSaleManager}
              className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-[11px] px-3 py-1 rounded-lg transition shadow-2xs flex items-center gap-1.5 cursor-pointer animate-pulse hover:animate-none"
              title="Open Flash Sale Deals, Pricing & Timer Manager"
            >
              <Zap className="w-3.5 h-3.5 fill-current text-yellow-300" />
              <span>⚡ Flash Sale Manager</span>
            </button>
          )}

          <button
            onClick={() => onOpenImporter('1688')}
            className="bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] px-2.5 py-1 rounded-lg transition shadow-2xs flex items-center gap-1 cursor-pointer"
            title="Open 1688.com China Factory Importer"
          >
            <span className="text-[10px]">🏭</span>
            <span>1688 Sourcing</span>
          </button>

          <button
            onClick={() => onOpenImporter('alibaba')}
            className="bg-[#FF6A00] hover:bg-[#E05E00] text-white font-bold text-[11px] px-2.5 py-1 rounded-lg transition shadow-2xs flex items-center gap-1 cursor-pointer"
            title="Open Alibaba.com Global Direct Importer"
          >
            <Zap className="w-3 h-3 fill-white text-white" />
            <span>Alibaba Sourcing</span>
          </button>

          {onOpenSellerCenter && (
            <button
              onClick={onOpenSellerCenter}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-[11px] px-2.5 py-1 rounded-lg transition flex items-center gap-1 cursor-pointer"
              title="Open Catalog & Order Management"
            >
              <Store className="w-3 h-3 text-amber-400" />
              <span>Catalog Manager</span>
            </button>
          )}

          <button
            onClick={() => setAdminMode(false)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] px-3 py-1 rounded-lg transition shadow-2xs flex items-center gap-1 cursor-pointer"
            title="Switch back to Customer Mode preview"
          >
            <Eye className="w-3 h-3" />
            <span>View as Customer</span>
          </button>
        </div>

      </div>
    </div>
  );
};
