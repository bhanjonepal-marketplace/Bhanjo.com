import React, { useState } from 'react';
import { 
  X, Lock, Phone, Mail, User, CheckCircle2, ArrowRight, ShieldCheck, 
  Eye, EyeOff, Sparkles, RefreshCw, KeyRound, ArrowLeft 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';

export const AuthModal = ({ isOpen, onClose, onSuccess, initialMode = 'login', message = '' }) => {
  const { login, initiateCustomerRegister, verifyCustomerRegister } = useAuth();
  
  const [mode, setMode] = useState(initialMode); // 'login' or 'signup'
  
  // Login State
  const [loginPhoneOrEmail, setLoginPhoneOrEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup Form State (Step 1)
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Signup Verification State (Step 2)
  const [signupStep, setSignupStep] = useState(1); // 1 = Details, 2 = Email Code
  const [signupSessionId, setSignupSessionId] = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');
  const [emailCode, setEmailCode] = useState('');
  const [devCode, setDevCode] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  // Handle Login Submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!loginPhoneOrEmail.trim()) {
      setError('Please enter your mobile phone number or email address.');
      return;
    }
    if (!loginPassword) {
      setError('Please enter your password.');
      return;
    }

    setIsLoading(true);
    try {
      const user = await login({
        phoneOrEmail: loginPhoneOrEmail.trim(),
        password: loginPassword
      });

      confetti({ particleCount: 50, spread: 60 });
      if (onSuccess) onSuccess(user);
      onClose();
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Signup Step 1: Initiate & Request Email OTP
  const handleSignupInitiate = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      setError('Please enter a valid 10-digit mobile phone number (e.g. 98XXXXXXXX).');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    try {
      const data = await initiateCustomerRegister({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim().toLowerCase(),
        password
      });

      setSignupSessionId(data.signupSessionId);
      setMaskedEmail(data.maskedEmail || email);
      if (data.devCode?.emailCode) {
        setDevCode(data.devCode.emailCode);
      }
      setSignupStep(2);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to initiate signup. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Signup Step 2: Verify Email OTP & Complete Registration
  const handleSignupVerify = async (e) => {
    e.preventDefault();
    setError('');

    if (!emailCode.trim() || emailCode.trim().length !== 6) {
      setError('Please enter the 6-digit verification code sent to your email.');
      return;
    }

    setIsLoading(true);
    try {
      const user = await verifyCustomerRegister({
        signupSessionId,
        emailCode: emailCode.trim()
      });

      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      if (onSuccess) onSuccess(user);
      onClose();
    } catch (err) {
      setError(err.message || 'Invalid verification code. Please check your email.');
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
      }
      confetti({ particleCount: 50, spread: 60 });
      if (onSuccess) onSuccess();
      onClose();
    } catch (e) {
      console.log('Demo login error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden relative font-sans">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#F85606] to-amber-600 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center font-black">
              B
            </div>
            <div>
              <h2 className="font-bold text-base">
                {mode === 'login' 
                  ? 'Welcome to Bhanjo! Please Login' 
                  : (signupStep === 1 ? 'Create Your Bhanjo Account' : 'Verify Your Email Address')}
              </h2>
              <p className="text-[11px] text-white/90">
                {message || (mode === 'login' 
                  ? 'Enter phone/email to continue your order' 
                  : (signupStep === 1 ? 'Enter your details to receive your free verification code' : `Enter the 6-digit code sent to ${maskedEmail}`))}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher (Only in Step 1) */}
        {signupStep === 1 && (
          <div className="flex border-b border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(''); }}
              className={`flex-1 py-3 text-center transition cursor-pointer ${
                mode === 'login' 
                  ? 'text-[#F85606] border-b-2 border-[#F85606] bg-orange-50/40' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Customer Login
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setError(''); }}
              className={`flex-1 py-3 text-center transition cursor-pointer ${
                mode === 'signup' 
                  ? 'text-[#F85606] border-b-2 border-[#F85606] bg-orange-50/40' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Sign Up (New Customer)
            </button>
          </div>
        )}

        {/* Global Error Banner */}
        {error && (
          <div className="m-4 mb-0 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-medium">
            {error}
          </div>
        )}

        {/* 1. LOGIN MODE */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="p-6 space-y-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Phone Number or Email *</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  placeholder="98XXXXXXXX or customer@domain.com"
                  value={loginPhoneOrEmail}
                  onChange={(e) => setLoginPhoneOrEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-[#F85606] transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-slate-700">Password *</label>
                <button
                  type="button"
                  onClick={() => alert("Password reset code sent to your phone/email!")}
                  className="text-[11px] text-[#F85606] hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-[#F85606] transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#F85606] hover:bg-[#E04E05] text-white font-bold py-3 rounded-xl shadow-sm transition flex items-center justify-center gap-1.5 disabled:opacity-50 text-xs cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <span>Login & Continue Shopping</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Quick Demo Login */}
            <div className="pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={handleQuickDemoLogin}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition text-center flex items-center justify-center gap-1.5 cursor-pointer text-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>1-Click Quick Demo Login (Prashant Sharma)</span>
              </button>
            </div>
          </form>
        )}

        {/* 2. SIGNUP STEP 1: Name, Phone, Email & Password */}
        {mode === 'signup' && signupStep === 1 && (
          <form onSubmit={handleSignupInitiate} className="p-6 space-y-3.5 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Full Name *</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Bikash Shrestha"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-[#F85606] transition"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Mobile Phone Number (Nepal) *</label>
              <div className="relative flex">
                <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-300 bg-slate-50 text-slate-600 font-bold text-xs">
                  +977
                </span>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="98XXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  className="w-full pl-3 pr-3 py-2.5 border border-slate-300 rounded-r-xl focus:outline-none focus:border-[#F85606] transition"
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">Used by delivery riders for order updates.</p>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Email Address (For Verification Code) *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  placeholder="name@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-[#F85606] transition"
                />
              </div>
              <p className="text-[10px] text-emerald-600 font-medium mt-0.5">
                ✓ Free instant code will be sent to this email address.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-slate-700">Create Password *</label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-[#F85606] transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 bg-[#F85606] hover:bg-[#E04E05] text-white font-bold py-3 rounded-xl shadow-sm transition flex items-center justify-center gap-1.5 disabled:opacity-50 text-xs cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Sending Verification Code...</span>
                </>
              ) : (
                <>
                  <span>Send Free Verification Code</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* 3. SIGNUP STEP 2: Email Code Verification */}
        {mode === 'signup' && signupStep === 2 && (
          <form onSubmit={handleSignupVerify} className="p-6 space-y-4 text-xs animate-in fade-in duration-150">
            
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-3.5 text-center">
              <div className="w-10 h-10 rounded-full bg-orange-100 text-[#F85606] flex items-center justify-center mx-auto mb-2">
                <Mail className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">Check Your Email</h4>
              <p className="text-[11px] text-slate-600 mt-1">
                We sent a 6-digit verification code to: <br/>
                <strong className="text-slate-900">{maskedEmail}</strong>
              </p>
            </div>

            {/* Dev Mode Code Preview Banner */}
            {devCode && (
              <div className="bg-slate-900 text-slate-200 p-2.5 rounded-xl text-center text-xs flex items-center justify-between">
                <span className="font-mono text-amber-400 font-bold">
                  Dev Code: {devCode}
                </span>
                <button
                  type="button"
                  onClick={() => setEmailCode(devCode)}
                  className="bg-orange-600 hover:bg-orange-500 text-white font-bold px-2 py-0.5 rounded text-[10px] cursor-pointer"
                >
                  Auto-Fill
                </button>
              </div>
            )}

            <div>
              <label className="font-semibold text-slate-700 block mb-1 text-center">
                Enter 6-Digit Email Code
              </label>
              <input
                type="text"
                autoFocus
                maxLength={6}
                required
                value={emailCode}
                onChange={(e) => setEmailCode(e.target.value.replace(/\D/g, ''))}
                placeholder="• • • • • •"
                className="w-full text-center tracking-[0.4em] font-mono font-black text-2xl py-3 border border-slate-300 rounded-xl focus:outline-none focus:border-[#F85606] transition"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl shadow-sm transition flex items-center justify-center gap-1.5 disabled:opacity-50 text-xs cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Account...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verify & Activate Account</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-between text-[11px] pt-1">
              <button
                type="button"
                onClick={() => {
                  setSignupStep(1);
                  setError('');
                }}
                className="text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Change Email / Phone</span>
              </button>

              <button
                type="button"
                onClick={handleSignupInitiate}
                className="text-[#F85606] hover:underline font-semibold cursor-pointer"
              >
                Resend Code
              </button>
            </div>

          </form>
        )}

        {/* Footer Guarantee */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 text-[10px] text-slate-500 text-center flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Nepal's 100% Genuine Marketplace • Protected by 256-bit SSL</span>
        </div>

      </div>
    </div>
  );
};
