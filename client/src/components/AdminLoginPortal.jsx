import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Lock, Smartphone, Mail, ArrowRight, ArrowLeft, 
  AlertCircle, CheckCircle2, RefreshCw, KeyRound, Sparkles, Store
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';

export const AdminLoginPortal = ({ onLoginSuccess, onBackToStore }) => {
  const { initiateAdminLogin, verifyAdminMfa } = useAuth();

  // Stage 1: Credentials (Email, Password, Phone)
  // Stage 2: Dual 2FA (SMS Code + Email Code side-by-side)
  const [step, setStep] = useState(1);
  
  const [email, setEmail] = useState('prashannaghim@gmail.com');
  const [password, setPassword] = useState('Bhanjo#Master2026!SecureKey%9705');
  const [phone, setPhone] = useState('9705435590');
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // 2FA State
  const [mfaSessionId, setMfaSessionId] = useState('');
  const [maskedPhone, setMaskedPhone] = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');
  const [smsCode, setSmsCode] = useState('');
  const [emailCode, setEmailCode] = useState('');
  const [devCodes, setDevCodes] = useState(null);
  
  const [countdown, setCountdown] = useState(300); // 5 minutes
  const [fieldErrors, setFieldErrors] = useState({ sms: false, email: false });

  // Countdown timer for 2FA expiry
  useEffect(() => {
    let timer;
    if (step === 2 && countdown > 0) {
      timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  const formatCountdown = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Step 1: Submit Credentials & Request Dual-Codes
  const handleInitiate = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const data = await initiateAdminLogin({ email, password, phone });
      setMfaSessionId(data.mfaSessionId);
      setMaskedPhone(data.maskedPhone || phone);
      setMaskedEmail(data.maskedEmail || email);
      if (data.devCodes) {
        setDevCodes(data.devCodes);
      }
      setCountdown(300);
      setStep(2);
      setErrorMessage('');
    } catch (err) {
      setErrorMessage(err.message || 'Master Admin authorization failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Submit Dual Codes
  const handleVerify = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setFieldErrors({ sms: false, email: false });

    if (!smsCode.trim() || !emailCode.trim()) {
      setErrorMessage('Please enter BOTH the SMS code and the Email code.');
      setFieldErrors({
        sms: !smsCode.trim(),
        email: !emailCode.trim()
      });
      return;
    }

    setIsLoading(true);

    try {
      const adminUser = await verifyAdminMfa({
        mfaSessionId,
        smsCode: smsCode.trim(),
        emailCode: emailCode.trim()
      });

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });

      if (onLoginSuccess) {
        onLoginSuccess(adminUser);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Security verification failed.');
      setFieldErrors({
        sms: err.smsValid === false,
        email: err.emailValid === false
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to auto-fill dev test codes
  const handleFillDevCodes = () => {
    if (devCodes) {
      setSmsCode(devCodes.smsCode);
      setEmailCode(devCodes.emailCode);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden text-slate-100 font-sans">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner & Back Button */}
      <div className="w-full max-w-xl flex items-center justify-between mb-6 z-10">
        <button
          onClick={onBackToStore}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition py-1.5 px-3 rounded-lg hover:bg-slate-900 border border-slate-800"
        >
          <ArrowLeft className="w-4 h-4 text-orange-500" />
          <span>Back to Bhanjo Storefront</span>
        </button>

        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-full border border-slate-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Security Protocol v2.6 Active</span>
        </div>
      </div>

      {/* Main Glassmorphic Card */}
      <div className="w-full max-w-xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 z-10">
        
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#F85606] to-amber-500 shadow-lg shadow-orange-500/20 mb-4 border border-orange-400/30">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center justify-center gap-2">
            <span>Bhanjo Master Admin</span>
          </h1>
          
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            {step === 1 
              ? 'Restricted Access • Multi-Factor Dual Channel Authentication' 
              : 'Dual-Channel Security Check • Enter Both Codes to Unlock'}
          </p>
        </div>

        {/* Global Error Banner */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-800/80 text-red-200 text-xs flex items-start gap-3 animate-in fade-in duration-200">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1 font-medium">{errorMessage}</div>
          </div>
        )}

        {/* STEP 1: Email + Password + Phone Input */}
        {step === 1 && (
          <form onSubmit={handleInitiate} className="space-y-4">
            
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#F85606]" />
                <span>Master Admin Email</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="prashannaghim@gmail.com"
                className="w-full text-sm px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-[#F85606] focus:ring-1 focus:ring-[#F85606] text-white outline-none transition placeholder:text-slate-600"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#F85606]" />
                  <span>Master Password</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-slate-400 hover:text-white"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Master Password"
                className="w-full text-sm px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-[#F85606] focus:ring-1 focus:ring-[#F85606] text-white outline-none transition font-mono placeholder:text-slate-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-[#F85606]" />
                <span>Registered Admin Phone Number (Nepal)</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                  +977
                </div>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9705435590"
                  className="w-full text-sm pl-14 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-[#F85606] focus:ring-1 focus:ring-[#F85606] text-white outline-none transition placeholder:text-slate-600"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Must match the registered phone for Prashanna Ghimire.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 bg-gradient-to-r from-[#F85606] to-amber-600 hover:from-[#e04e05] hover:to-amber-500 text-white font-bold py-3.5 px-4 rounded-xl text-sm transition shadow-lg shadow-orange-600/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Master Credentials...</span>
                </>
              ) : (
                <>
                  <span>Request Dual Security Codes</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="pt-2 text-center text-[11px] text-slate-500">
              Only authorized Bhanjo.com platform administrators may sign in.
            </div>

          </form>
        )}

        {/* STEP 2: Dual Verification (SMS + Email side-by-side) */}
        {step === 2 && (
          <form onSubmit={handleVerify} className="space-y-6 animate-in fade-in duration-200">
            
            {/* Info Notice */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold block mb-1">
                Codes Expire In:
              </span>
              <span className="font-mono text-xl font-black text-amber-400">
                {formatCountdown(countdown)}
              </span>
              <p className="text-[11px] text-slate-400 mt-1">
                Both codes were dispatched simultaneously. Enter both side-by-side to authenticate.
              </p>
            </div>

            {/* Dev Helper Banner */}
            {devCodes && (
              <div className="bg-orange-950/40 border border-orange-500/40 rounded-xl p-3.5 text-xs text-orange-200">
                <div className="flex items-center justify-between font-bold mb-1">
                  <span className="flex items-center gap-1.5 text-amber-400">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Dev Mode Active: Dispatched Security Codes</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleFillDevCodes}
                    className="text-[10px] bg-orange-600 hover:bg-orange-500 text-white font-bold px-2 py-0.5 rounded cursor-pointer transition"
                  >
                    Auto-Fill Both
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2 font-mono text-[11px]">
                  <div className="bg-slate-950/70 p-2 rounded border border-orange-500/20">
                    📱 SMS Code: <strong className="text-white text-sm">{devCodes.smsCode}</strong>
                  </div>
                  <div className="bg-slate-950/70 p-2 rounded border border-orange-500/20">
                    ✉️ Email Code: <strong className="text-white text-sm">{devCodes.emailCode}</strong>
                  </div>
                </div>
              </div>
            )}

            {/* SIDE-BY-SIDE DUAL INPUT CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* 1. SMS CODE CARD */}
              <div className={`p-4 rounded-2xl bg-slate-950 border transition ${
                fieldErrors.sms ? 'border-red-500/80 bg-red-950/10' : 'border-slate-800 focus-within:border-orange-500'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">1. SMS Code</h4>
                    <p className="text-[10px] text-slate-400">Phone: {maskedPhone}</p>
                  </div>
                </div>

                <input
                  type="text"
                  maxLength={6}
                  autoFocus
                  required
                  value={smsCode}
                  onChange={(e) => setSmsCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="• • • • • •"
                  className="w-full text-center tracking-[0.4em] font-mono font-black text-xl py-3 rounded-xl bg-slate-900 border border-slate-800 text-amber-400 outline-none focus:border-orange-500 transition"
                />

                <span className="text-[10px] text-slate-500 block text-center mt-1.5">
                  6-digit code via SMS
                </span>
              </div>

              {/* 2. EMAIL CODE CARD */}
              <div className={`p-4 rounded-2xl bg-slate-950 border transition ${
                fieldErrors.email ? 'border-red-500/80 bg-red-950/10' : 'border-slate-800 focus-within:border-blue-500'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">2. Email Code</h4>
                    <p className="text-[10px] text-slate-400">{maskedEmail}</p>
                  </div>
                </div>

                <input
                  type="text"
                  maxLength={6}
                  required
                  value={emailCode}
                  onChange={(e) => setEmailCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="• • • • • •"
                  className="w-full text-center tracking-[0.4em] font-mono font-black text-xl py-3 rounded-xl bg-slate-900 border border-slate-800 text-blue-400 outline-none focus:border-blue-500 transition"
                />

                <span className="text-[10px] text-slate-500 block text-center mt-1.5">
                  6-digit code via Email
                </span>
              </div>

            </div>

            {/* Strict Rule Notice */}
            <div className="flex items-center gap-2 text-[11px] text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
              <KeyRound className="w-4 h-4 text-orange-400 flex-shrink-0" />
              <span>
                <strong>Strict Policy:</strong> BOTH codes must be valid. If either the SMS or Email code is incorrect, access will be immediately blocked.
              </span>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3.5 px-4 rounded-xl text-sm transition shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Dual Codes...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verify Both Codes & Unlock Admin</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setErrorMessage('');
                }}
                className="w-full text-slate-400 hover:text-white py-2 text-xs font-semibold transition"
              >
                ← Change Email or Phone Number
              </button>
            </div>

          </form>
        )}

      </div>

      {/* Footer Info */}
      <div className="text-center mt-6 text-[11px] text-slate-500">
        © 2026 Bhanjo.com Platform Security Division • Kathmandu, Nepal
      </div>

    </div>
  );
};
