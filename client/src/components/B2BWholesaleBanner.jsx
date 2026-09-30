import React from 'react';
import { Building2, ShieldCheck, ArrowRight, FileText, CheckCircle } from 'lucide-react';

export const B2BWholesaleBanner = ({ onOpenRfq, onOpenRfqFeed }) => {
  return (
    <div className="my-6 bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      
      <div className="flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
          <Building2 className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
              B2B Wholesale & Request for Quotation (RFQ)
            </h3>
            <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded">
              Factory Direct
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 max-w-xl">
            Sourcing for your business or retail store? Submit a custom RFQ and get bids from verified Nepali and international manufacturers within 2 hours.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 w-full md:w-auto flex-shrink-0">
        <button
          onClick={onOpenRfqFeed}
          className="flex-1 md:flex-none px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition"
        >
          View RFQ Feed
        </button>

        <button
          onClick={onOpenRfq}
          className="flex-1 md:flex-none px-4 py-2 rounded-lg bg-[#F85606] hover:bg-[#E04E05] text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-xs"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Post an RFQ in 60s</span>
        </button>
      </div>

    </div>
  );
};
