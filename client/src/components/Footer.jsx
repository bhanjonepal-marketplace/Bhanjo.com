import React from 'react';
import { Phone, Mail, MapPin, ShieldCheck, Truck, RotateCcw, Award } from 'lucide-react';
import { CATEGORIES } from '../data/categories';

export const Footer = ({ onSelectCategory, onOpenAdminUnlock }) => {
  return (
    <footer className="bg-[#f5f5f5] text-slate-600 text-xs border-t border-slate-200 mt-12 pt-10 pb-8">
      <div className="max-w-[1560px] mx-auto px-4 sm:px-6">
        
        {/* 4 Clean Value Propositions (Daraz Style) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-8 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 text-[#F85606] flex items-center justify-center flex-shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-xs">Nationwide Delivery</h4>
              <p className="text-[11px] text-slate-500">Across 77 districts of Nepal</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-xs">100% Safe Payments</h4>
              <p className="text-[11px] text-slate-500">eSewa, Khalti, COD & Cards</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-xs">14 Days Free Return</h4>
              <p className="text-[11px] text-slate-500">Easy refund & exchange</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-xs">Authentic Products</h4>
              <p className="text-[11px] text-slate-500">100% Direct from Bhanjo Official Store</p>
            </div>
          </div>
        </div>

        {/* 4 Clean Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 py-8 border-b border-slate-200 text-xs">
          
          <div>
            <h4 className="font-bold text-slate-900 mb-2.5">Customer Care</h4>
            <ul className="space-y-1.5 text-slate-500">
              <li><a href="#" className="hover:text-[#F85606]">Help Center & FAQs</a></li>
              <li><a href="#" className="hover:text-[#F85606]">How to Buy on Bhanjo</a></li>
              <li><a href="#" className="hover:text-[#F85606]">Track Your Order</a></li>
              <li><a href="#" className="hover:text-[#F85606]">Returns & Refunds</a></li>
              <li><a href="#" className="hover:text-[#F85606]">Contact Us: +977-1-4258848</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-2.5">Bhanjo Guarantee</h4>
            <ul className="space-y-1.5 text-slate-500">
              <li><span className="text-slate-600">✓ 100% Genuine Guaranteed</span></li>
              <li><span className="text-slate-600">✓ Doorstep Delivery in Nepal</span></li>
              <li><span className="text-slate-600">✓ Cash on Delivery (COD)</span></li>
              <li><span className="text-slate-600">✓ 14-Day Hassle-Free Returns</span></li>
            </ul>
          </div>

          <div>
            <div className="flex items-center gap-1.5 mb-3">
              <img src="/bhanjo-logo-horizontal.png" alt="भान्जो Bhanjo" className="h-7 w-auto object-contain" />
              <span className="font-black text-xs text-[#F85606] self-end mb-0.5">.com</span>
            </div>
            <p className="text-slate-500 text-[11px] leading-relaxed mb-3">
              Nepal's premier online shopping platform connecting Nepali consumers with authentic Himalayan products, trending electronics, fashion, and daily essentials.
            </p>
            <div className="text-[11px] text-slate-500">
              Tripureshwor, Kathmandu, Nepal
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-2.5">Verified Payment Methods</h4>
            <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-bold">
              <div className="bg-white border border-slate-200 py-1 rounded text-emerald-600">eSewa</div>
              <div className="bg-white border border-slate-200 py-1 rounded text-purple-600">Khalti</div>
              <div className="bg-white border border-slate-200 py-1 rounded text-blue-600">ConnectIPS</div>
              <div className="bg-white border border-slate-200 py-1 rounded text-slate-700">Cash on Delivery</div>
              <div className="bg-white border border-slate-200 py-1 rounded text-slate-700">Visa / Master</div>
              <div className="bg-white border border-slate-200 py-1 rounded text-slate-700">Bank Wire</div>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
          <div>© 2026 Bhanjo.com Ltd. All rights reserved. Nepal's No. 1 Online Shopping Platform.</div>
          <div className="text-slate-400 text-[10px]">Kathmandu, Nepal • 100% Authentic Marketplace</div>
        </div>

      </div>
    </footer>
  );
};
