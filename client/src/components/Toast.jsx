import React, { useEffect } from 'react';
import { CheckCircle2, ShoppingBag, X } from 'lucide-react';

export const Toast = ({ message, isOpen, onClose, actionLabel, onAction }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-200">
      <div className="bg-[#212121] text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-3 text-xs max-w-sm">
        <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
          <CheckCircle2 className="w-4 h-4" />
        </div>
        <div className="flex-1 font-medium text-slate-100">{message}</div>
        {actionLabel && onAction && (
          <button
            onClick={onAction}
            className="text-[#F85606] hover:text-[#ff7430] font-bold text-xs underline flex-shrink-0"
          >
            {actionLabel}
          </button>
        )}
        <button onClick={onClose} className="text-slate-400 hover:text-white p-0.5">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
