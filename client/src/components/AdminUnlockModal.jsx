import React, { useState } from 'react';
import { ShieldCheck, Lock, Key, X, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';

export const AdminUnlockModal = ({ isOpen, onClose, onUnlocked }) => {
  const { verifyAdminPasskey } = useAuth();
  const [passkey, setPasskey] = useState('');
  const [error, setError] = useState('');
  const [showKey, setShowKey] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const res = verifyAdminPasskey(passkey);
    if (res.success) {
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      setPasskey('');
      if (onUnlocked) onUnlocked();
      onClose();
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden relative">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">Store Admin Portal</h3>
              <p className="text-xs text-slate-300">Staff & Store Management Access</p>
            </div>
          </div>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            By default, all wholesale factory sourcing links (1688 / Alibaba), wholesale costs, and catalog price editors are strictly hidden in <strong>Customer Mode</strong>.
          </p>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-[#F85606]" />
              <span>Enter Admin Passkey</span>
            </label>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                autoFocus
                value={passkey}
                onChange={(e) => {
                  setPasskey(e.target.value);
                  setError('');
                }}
                placeholder="Enter passkey (e.g. bhanjo)"
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#F85606] focus:ring-2 focus:ring-orange-200 outline-none transition"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700"
              >
                {showKey ? "Hide" : "Show"}
              </button>
            </div>
            {error ? (
              <p className="text-xs text-red-600 font-semibold mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{error}</span>
              </p>
            ) : (
              <p className="text-[11px] text-slate-400 mt-1">
                Default store passkey: <code className="bg-slate-100 text-slate-700 px-1 py-0.5 rounded font-mono">bhanjo</code>
              </p>
            )}
          </div>

          <div className="pt-2 flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-[#F85606] hover:bg-[#E04E05] text-white text-xs font-bold shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Unlock Admin Mode</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
