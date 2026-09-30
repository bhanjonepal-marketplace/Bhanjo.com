import React, { useState } from 'react';
import { X, Lock, Phone, Mail, User, CheckCircle2, ArrowRight, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';

export const AuthModal = ({ isOpen, onClose, onSuccess, initialMode = 'login', message = '' }) => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState(initialMode); // 'login' or 'signup'
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!phoneOrEmail.trim()) {
      setError('Please enter your mobile phone or email address.');
      return;
    }

    if (mode === 'signup' && !name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    if (mode === 'signup' && password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    try {
      const isEmail = phoneOrEmail.includes('@');
      let authenticatedUser = null;

      if (mode === 'signup') {
        authenticatedUser = await register({
          name: name.trim(),
          phone: isEmail ? '' : phoneOrEmail.trim(),
          email: isEmail ? phoneOrEmail.trim() : `${phoneOrEmail.trim()}@bhanjo.com`,
          password: password,
          address: 'Kathmandu Valley, Bagmati Province'
        });
      } else {
        authenticatedUser = await login({
          phoneOrEmail: phoneOrEmail.trim(),
          password: password
        });
      }

      confetti({ particleCount: 50, spread: 60 });
      if (onSuccess) {
        onSuccess(authenticatedUser);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/demo', { method: 'POST' });
      const data = await res.json();
      if (data.success && data.user) {
        await login(data.user);
      } else {
        await login({
          name: "Prashant Sharma",
          phone: "9841987654",
          email: "prashant@bhanjo.com",
          address: "New Road, Kathmandu 44600"
        });
      }
      confetti({ particleCount: 50, spread: 60 });
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (e) {
      await login({
        name: "Prashant Sharma",
        phone: "9841987654",
        email: "prashant@bhanjo.com",
        address: "New Road, Kathmandu 44600"
      });
      if (onSuccess) onSuccess();
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden relative">
        
        {/* Header */}
        <div className="bg-[#F85606] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center font-black">
              B
            </div>
            <div>
              <h2 className="font-bold text-base">
                {mode === 'login' ? 'Welcome to Bhanjo! Please Login' : 'Create Your Bhanjo Account'}
              </h2>
              <p className="text-[11px] text-white/90">
                {message || (mode === 'login' ? 'Enter phone/email to continue your order' : 'Join millions of happy shoppers in Nepal')}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); }}
            className={`flex-1 py-3 text-center transition ${
              mode === 'login' 
                ? 'text-[#F85606] border-b-2 border-[#F85606] bg-orange-50/40' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setError(''); }}
            className={`flex-1 py-3 text-center transition ${
              mode === 'signup' 
                ? 'text-[#F85606] border-b-2 border-[#F85606] bg-orange-50/40' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign Up (New User)
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          {error && (
            <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-medium">
              {error}
            </div>
          )}

          {mode === 'signup' && (
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Full Name *</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#F85606]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Phone Number or Email *</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="98XXXXXXXX or email@domain.com"
                value={phoneOrEmail}
                onChange={(e) => setPhoneOrEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#F85606]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-slate-700">Password *</label>
              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => alert("Password reset code sent to your phone/email!")}
                  className="text-[11px] text-[#F85606] hover:underline"
                >
                  Forgot Password?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder={mode === 'signup' ? "Minimum 6 characters" : "Enter password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-10 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#F85606]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#F85606] hover:bg-[#E04E05] text-white font-bold py-2.5 rounded-lg shadow-sm transition flex items-center justify-center gap-1.5 disabled:opacity-50 text-xs"
          >
            {isLoading ? (
              <span>Verifying & Logging in...</span>
            ) : (
              <>
                <span>{mode === 'login' ? 'Login & Continue' : 'Create Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Quick Demo 1-Click Login */}
          <div className="pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition text-center flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>1-Click Instant Demo Login (Prashant Sharma)</span>
            </button>
          </div>

          <div className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Your information is protected by 256-bit SSL encryption.</span>
          </div>

        </form>

      </div>
    </div>
  );
};
