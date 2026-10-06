import React, { useState, useEffect } from 'react';
import { 
  X, Lock, Phone, Mail, User, CheckCircle2, Check, ArrowRight, ShieldCheck, 
  Eye, EyeOff, Sparkles, RefreshCw, KeyRound, ArrowLeft, AlertCircle, Info 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';

// Password Security Requirements Helper
const checkPasswordRules = (pwd = '') => [
  { id: 'length', label: 'At least 8 characters', met: pwd.length >= 8 },
  { id: 'upper', label: 'One uppercase letter (A-Z)', met: /[A-Z]/.test(pwd) },
  { id: 'number', label: 'One number (0-9)', met: /[0-9]/.test(pwd) },
  { id: 'symbol', label: 'One special symbol (!@#$%^&*)', met: /[^A-Za-z0-9]/.test(pwd) }
];

export const AuthModal = ({ isOpen, onClose, onSuccess, initialMode = 'login', message = '' }) => {
  const { 
    login, 
    initiateLogin,
    verifyLogin2FA,
    resendLoginCode,
    initiateCustomerRegister, 
    verifyCustomerRegister, 
    resendCustomerRegister, 
    initiateForgotPassword, 
    resendForgotPasswordCode, 
    verifyAndResetPassword 
  } = useAuth();
  
  const [mode, setMode] = useState(initialMode); // 'login' | 'signup' | 'forgot-password'
  
  // Login State
  const [loginPhoneOrEmail, setLoginPhoneOrEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginStep, setLoginStep] = useState(1); // 1 = Phone/Email & Password, 2 = 2FA Code
  const [loginSessionId, setLoginSessionId] = useState('');
  const [loginMaskedEmail, setLoginMaskedEmail] = useState('');
  const [loginCode, setLoginCode] = useState('');
  const [loginResendCountdown, setLoginResendCountdown] = useState(0);

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
  const [signupResendCountdown, setSignupResendCountdown] = useState(0);

  // Forgot Password State
  const [forgotStep, setForgotStep] = useState(1); // 1 = Enter Email/Phone, 2 = Enter Code & New Password
  const [forgotPhoneOrEmail, setForgotPhoneOrEmail] = useState('');
  const [forgotSessionId, setForgotSessionId] = useState('');
  const [forgotMaskedEmail, setForgotMaskedEmail] = useState('');
  const [forgotCode, setForgotCode] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [forgotShowPassword, setForgotShowPassword] = useState(false);
  const [forgotResendCountdown, setForgotResendCountdown] = useState(0);

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Live Password Rules Evaluation
  const signupPasswordRules = checkPasswordRules(password);
  const signupRulesMetCount = signupPasswordRules.filter(r => r.met).length;

  const forgotPasswordRules = checkPasswordRules(forgotNewPassword);
  const forgotRulesMetCount = forgotPasswordRules.filter(r => r.met).length;

  // Countdown timer for Login 2FA OTP Resend
  useEffect(() => {
    if (loginResendCountdown <= 0) return;
    const timer = setInterval(() => {
      setLoginResendCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [loginResendCountdown]);

  // Countdown timer for Signup OTP Resend
  useEffect(() => {
    if (signupResendCountdown <= 0) return;
    const timer = setInterval(() => {
      setSignupResendCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [signupResendCountdown]);

  // Countdown timer for Forgot Password OTP Resend
  useEffect(() => {
    if (forgotResendCountdown <= 0) return;
    const timer = setInterval(() => {
      setForgotResendCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [forgotResendCountdown]);

  // Reset modal state on opening
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode || 'login');
      setLoginStep(1);
      setSignupStep(1);
      setForgotStep(1);
      setError('');
      setStatusMessage('');
      setLoginCode('');
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  // Handle Login Step 1: Submit Credentials & Request 2FA Code
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setStatusMessage('');

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
      const data = await initiateLogin({
        phoneOrEmail: loginPhoneOrEmail.trim(),
        password: loginPassword
      });

      if (data.requires2FA) {
        setLoginSessionId(data.loginSessionId);
        setLoginMaskedEmail(data.maskedEmail || loginPhoneOrEmail);
        setLoginStep(2);
        setLoginResendCountdown(30);
        setStatusMessage(data.message || `A 6-digit verification code has been dispatched to ${data.maskedEmail}`);
        setError('');
      } else if (data.directLogin || data.user) {
        confetti({ particleCount: 50, spread: 60 });
        if (onSuccess) onSuccess(data.user);
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Login Step 2: Verify 2FA Email Code & Complete Login
  const handleLoginVerify = async (e) => {
    e.preventDefault();
    setError('');
    setStatusMessage('');

    if (!loginCode.trim() || loginCode.trim().length !== 6) {
      setError('Please enter the 6-digit verification code sent to your email.');
      return;
    }

    setIsLoading(true);
    try {
      const user = await verifyLogin2FA({
        loginSessionId,
        code: loginCode.trim()
      });

      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      if (onSuccess) onSuccess(user);
      onClose();
    } catch (err) {
      setError(err.message || 'Invalid or expired verification code. Please check your email.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Login Resend 2FA Code
  const handleLoginResend = async () => {
    if (loginResendCountdown > 0 || isLoading) return;
    setError('');
    setStatusMessage('');
    setIsLoading(true);
    try {
      const res = await resendLoginCode({ loginSessionId });
      setStatusMessage(res.message || 'A fresh login verification code has been dispatched to your email.');
      setLoginResendCountdown(30);
      setLoginCode('');
    } catch (err) {
      setError(err.message || 'Failed to resend verification code.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Signup Step 1: Initiate & Request Email OTP
  const handleSignupInitiate = async (e) => {
    e.preventDefault();
    setError('');
    setStatusMessage('');

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
    
    // Validate strong password requirements
    const unmetRules = checkPasswordRules(password).filter(r => !r.met);
    if (unmetRules.length > 0) {
      setError(`Password must satisfy all requirements: ${unmetRules.map(r => r.label).join(', ')}.`);
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
      setSignupStep(2);
      setSignupResendCountdown(30);
      setStatusMessage(data.message || `A 6-digit verification code has been dispatched to ${data.maskedEmail}`);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to initiate signup. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Signup Resend OTP
  const handleSignupResend = async () => {
    if (signupResendCountdown > 0 || isLoading) return;
    setError('');
    setStatusMessage('');
    setIsLoading(true);
    try {
      const res = await resendCustomerRegister({ signupSessionId });
      setStatusMessage(res.message || 'A new verification code has been dispatched to your email.');
      setSignupResendCountdown(30);
    } catch (err) {
      setError(err.message || 'Failed to resend code.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Signup Step 2: Verify Email OTP & Complete Registration
  const handleSignupVerify = async (e) => {
    e.preventDefault();
    setError('');
    setStatusMessage('');

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

  // Handle Forgot Password Step 1: Initiate & Send Code
  const handleForgotInitiate = async (e) => {
    e.preventDefault();
    setError('');
    setStatusMessage('');

    if (!forgotPhoneOrEmail.trim()) {
      setError('Please enter your registered email address or mobile phone number.');
      return;
    }

    setIsLoading(true);
    try {
      const data = await initiateForgotPassword(forgotPhoneOrEmail.trim());
      setForgotSessionId(data.resetSessionId);
      setForgotMaskedEmail(data.maskedEmail || forgotPhoneOrEmail);
      setForgotStep(2);
      setForgotResendCountdown(30);
      setStatusMessage(data.message || `Password reset code sent to ${data.maskedEmail}`);
      setError('');
    } catch (err) {
      setError(err.message || 'Could not find account. Please check your input.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Forgot Password Resend Code
  const handleForgotResend = async () => {
    if (forgotResendCountdown > 0 || isLoading) return;
    setError('');
    setStatusMessage('');
    setIsLoading(true);
    try {
      const data = await resendForgotPasswordCode({ resetSessionId: forgotSessionId });
      setStatusMessage(data.message || 'A fresh reset code has been sent to your email.');
      setForgotResendCountdown(30);
    } catch (err) {
      setError(err.message || 'Failed to resend reset code.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Forgot Password Step 2: Verify Code & Save New Password
  const handleForgotReset = async (e) => {
    e.preventDefault();
    setError('');
    setStatusMessage('');

    if (!forgotCode.trim() || forgotCode.trim().length !== 6) {
      setError('Please enter the 6-digit verification code sent to your email.');
      return;
    }
    
    // Validate strong password requirements for new password
    const unmetRules = checkPasswordRules(forgotNewPassword).filter(r => !r.met);
    if (unmetRules.length > 0) {
      setError(`New password must satisfy all requirements: ${unmetRules.map(r => r.label).join(', ')}.`);
      return;
    }
    if (forgotNewPassword !== forgotConfirmPassword) {
      setError('Passwords do not match. Please verify your new password.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await verifyAndResetPassword({
        resetSessionId: forgotSessionId,
        code: forgotCode.trim(),
        newPassword: forgotNewPassword
      });

      confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });
      setStatusMessage(res.message || 'Password reset successful! You can now log in.');
      setMode('login');
      setLoginPhoneOrEmail(forgotPhoneOrEmail);
      setLoginPassword('');
      setForgotStep(1);
      setForgotCode('');
      setForgotNewPassword('');
      setForgotConfirmPassword('');
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to reset password. Please check the code.');
    } finally {
      setIsLoading(false);
    }
  };

  // Get dynamic modal title & subtitle
  const getHeaderInfo = () => {
    if (mode === 'login') {
      if (loginStep === 1) {
        return {
          title: 'Welcome to Bhanjo! Please Login',
          subtitle: message || 'Enter phone or email to continue shopping'
        };
      }
      return {
        title: 'Two-Factor Authentication',
        subtitle: `Enter the 6-digit code sent to ${loginMaskedEmail}`
      };
    }
    if (mode === 'signup') {
      if (signupStep === 1) {
        return {
          title: 'Create Your Bhanjo Account',
          subtitle: 'Enter your details to create your customer account'
        };
      }
      return {
        title: 'Verify Your Email Address',
        subtitle: `Enter the 6-digit code sent to ${maskedEmail}`
      };
    }
    if (mode === 'forgot-password') {
      if (forgotStep === 1) {
        return {
          title: 'Forgot Password?',
          subtitle: 'We will send a 6-digit recovery code to your registered email'
        };
      }
      return {
        title: 'Reset Your Password',
        subtitle: `Enter code sent to ${forgotMaskedEmail} and set new password`
      };
    }
    return { title: 'Bhanjo.com', subtitle: '' };
  };

  const headerInfo = getHeaderInfo();

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden relative font-sans my-auto">
        
        {/* Header (Pinned) */}
        <div className="bg-gradient-to-r from-[#F85606] to-amber-600 text-white px-5 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 p-1 flex items-center justify-center shrink-0 backdrop-blur-xs">
              <img src="/bhanjo-logo-icon.png" alt="Bhanjo" className="h-full w-auto object-contain filter brightness-0 invert" />
            </div>
            <div>
              <h2 className="font-bold text-sm sm:text-base leading-tight">
                {headerInfo.title}
              </h2>
              <p className="text-[10.5px] text-white/90 leading-tight">
                {headerInfo.subtitle}
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

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto flex-1 overscroll-contain">
          {/* Tab Switcher (Visible in Login Step 1 & Signup Step 1) */}
          {mode !== 'forgot-password' && signupStep === 1 && loginStep === 1 && (
            <div className="flex border-b border-slate-200 text-xs font-bold sticky top-0 bg-white z-10">
              <button
                type="button"
                onClick={() => { setMode('login'); setLoginStep(1); setError(''); setStatusMessage(''); }}
                className={`flex-1 py-2.5 text-center transition cursor-pointer ${
                  mode === 'login' 
                    ? 'text-[#F85606] border-b-2 border-[#F85606] bg-orange-50/40' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Customer Login
              </button>
              <button
                type="button"
                onClick={() => { setMode('signup'); setSignupStep(1); setError(''); setStatusMessage(''); }}
                className={`flex-1 py-2.5 text-center transition cursor-pointer ${
                  mode === 'signup' 
                    ? 'text-[#F85606] border-b-2 border-[#F85606] bg-orange-50/40' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Sign Up (New Customer)
              </button>
            </div>
          )}

          {/* Success / Status Banner (hidden in Step 2 of forgot-password or 2FA because they have dedicated inline badges) */}
          {statusMessage && !(mode === 'forgot-password' && forgotStep === 2) && !(mode === 'login' && loginStep === 2) && (
            <div className="mx-4 mt-3 p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium flex items-center gap-2 shrink-0">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="truncate">{statusMessage}</span>
            </div>
          )}

          {/* Global Error Banner */}
          {error && (
            <div className="mx-4 mt-3 p-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-medium flex items-center gap-2 shrink-0">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

        {/* ======================================================== */}
        {/* 1a. LOGIN MODE - Step 1: Phone/Email & Password */}
        {/* ======================================================== */}
        {mode === 'login' && loginStep === 1 && (
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
                  onClick={() => {
                    setMode('forgot-password');
                    setForgotStep(1);
                    setForgotPhoneOrEmail(loginPhoneOrEmail);
                    setError('');
                    setStatusMessage('');
                  }}
                  className="text-[11px] text-[#F85606] hover:underline font-semibold cursor-pointer"
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
                  <span>Checking Credentials...</span>
                </>
              ) : (
                <>
                  <span>Login & Verify</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-center pt-2 border-t border-slate-100">
              <span className="text-slate-500">Don't have an account? </span>
              <button
                type="button"
                onClick={() => { setMode('signup'); setSignupStep(1); setError(''); setStatusMessage(''); }}
                className="text-[#F85606] font-bold hover:underline cursor-pointer"
              >
                Sign Up Now
              </button>
            </div>
          </form>
        )}

        {/* ======================================================== */}
        {/* 1b. LOGIN MODE - Step 2: 2FA Email Code Verification */}
        {/* ======================================================== */}
        {mode === 'login' && loginStep === 2 && (
          <form onSubmit={handleLoginVerify} className="p-4 sm:p-5 space-y-2.5 text-xs animate-in fade-in duration-150">
            <div className="bg-orange-50 border border-orange-200/80 rounded-xl p-2.5 text-center">
              <div className="w-8 h-8 rounded-full bg-orange-100 text-[#F85606] flex items-center justify-center mx-auto mb-1">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-slate-800 text-xs">Two-Factor Authentication</h4>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Verification code sent to: <strong className="text-slate-900">{loginMaskedEmail}</strong>
              </p>
              <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/90 text-[9.5px] font-semibold text-amber-800 border border-amber-200">
                <span>⏱️ Code expires in 3 minutes</span>
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1 text-center text-[11px]">
                Enter 6-Digit Email Code *
              </label>
              <input
                type="text"
                autoFocus
                maxLength={6}
                inputMode="numeric"
                autoComplete="one-time-code"
                required
                value={loginCode}
                onChange={(e) => {
                  const clean = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setLoginCode(clean);
                  if (error) setError('');
                }}
                placeholder="• • • • • •"
                className="w-full text-center tracking-[0.35em] font-mono font-black text-xl py-1.5 border border-slate-300 rounded-xl focus:outline-none focus:border-[#F85606] transition"
              />
            </div>

            <p className="text-[10px] text-slate-400 text-center">
              Don't see code? Check Spam / Junk folder or click Resend below.
            </p>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#F85606] hover:bg-[#E04E05] text-white font-bold py-2.5 rounded-xl shadow-sm transition flex items-center justify-center gap-1.5 disabled:opacity-50 text-xs cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Verifying Code...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verify & Login to Portal</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-between text-[11px] pt-0.5">
              <button
                type="button"
                onClick={() => {
                  setLoginStep(1);
                  setLoginCode('');
                  setError('');
                  setStatusMessage('');
                }}
                className="text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Change Login Details</span>
              </button>

              <button
                type="button"
                disabled={loginResendCountdown > 0 || isLoading}
                onClick={handleLoginResend}
                className="text-[#F85606] hover:underline font-semibold disabled:text-slate-400 disabled:no-underline cursor-pointer"
              >
                {loginResendCountdown > 0 
                  ? `Resend in ${loginResendCountdown}s` 
                  : 'Resend Code'}
              </button>
            </div>
          </form>
        )}

        {/* ======================================================== */}
        {/* 2. SIGNUP STEP 1: Details */}
        {/* ======================================================== */}
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
              <label className="font-semibold text-slate-700 block mb-1">Email Address *</label>
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
              <p className="text-[10px] text-slate-500 mt-0.5">We will send a 6-digit verification code to this email.</p>
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
                  placeholder="Min 8 chars, 1 uppercase, 1 number, 1 symbol"
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

              {/* Password Requirements Checklist in Text Form & Live Progress Meter */}
              <div className="mt-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 animate-in fade-in duration-150">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-700">Password Requirements:</span>
                  <span className={`font-bold text-[10px] ${
                    signupRulesMetCount === 4 
                      ? 'text-emerald-600' 
                      : signupRulesMetCount >= 2 
                      ? 'text-amber-600' 
                      : 'text-slate-500'
                  }`}>
                    {signupRulesMetCount === 4 ? 'All requirements met ✓' : `${signupRulesMetCount} of 4 requirements met`}
                  </span>
                </div>

                {/* Multi-segment strength progress bar */}
                <div className="grid grid-cols-4 gap-1 h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-200 ${
                    signupRulesMetCount >= 1 ? (signupRulesMetCount === 4 ? 'bg-emerald-500' : 'bg-amber-500') : 'bg-transparent'
                  }`} />
                  <div className={`h-full rounded-full transition-all duration-200 ${
                    signupRulesMetCount >= 2 ? (signupRulesMetCount === 4 ? 'bg-emerald-500' : 'bg-amber-500') : 'bg-transparent'
                  }`} />
                  <div className={`h-full rounded-full transition-all duration-200 ${
                    signupRulesMetCount >= 3 ? (signupRulesMetCount === 4 ? 'bg-emerald-500' : 'bg-amber-500') : 'bg-transparent'
                  }`} />
                  <div className={`h-full rounded-full transition-all duration-200 ${
                    signupRulesMetCount >= 4 ? 'bg-emerald-500' : 'bg-transparent'
                  }`} />
                </div>

                {/* Text Requirements List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-1 pt-1">
                  {signupPasswordRules.map((rule) => (
                    <div 
                      key={rule.id} 
                      className={`flex items-center gap-1.5 text-[10.5px] transition-colors duration-150 ${
                        rule.met ? 'text-emerald-700 font-semibold' : 'text-slate-400'
                      }`}
                    >
                      {rule.met ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      ) : (
                        <span className="w-3.5 h-3.5 flex items-center justify-center text-[11px] text-slate-300 font-bold shrink-0">•</span>
                      )}
                      <span>{rule.label}</span>
                    </div>
                  ))}
                </div>
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
                  <span>Send Verification Code</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* ======================================================== */}
        {/* 3. SIGNUP STEP 2: Email Code Verification */}
        {/* ======================================================== */}
        {mode === 'signup' && signupStep === 2 && (
          <form onSubmit={handleSignupVerify} className="p-4 sm:p-5 space-y-2.5 text-xs animate-in fade-in duration-150">
            <div className="bg-orange-50 border border-orange-200/80 rounded-xl p-2.5 text-center">
              <div className="w-8 h-8 rounded-full bg-orange-100 text-[#F85606] flex items-center justify-center mx-auto mb-1">
                <Mail className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-slate-800 text-xs">Check Your Email</h4>
              <p className="text-[11px] text-slate-600 mt-0.5">
                We sent a 6-digit verification code to: <br/>
                <strong className="text-slate-900">{maskedEmail}</strong>
              </p>
              <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/90 text-[9.5px] font-semibold text-amber-800 border border-amber-200">
                <span>⏱️ Code expires in 3 minutes</span>
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1 text-center text-[11px]">
                Enter 6-Digit Email Code *
              </label>
              <input
                type="text"
                autoFocus
                maxLength={6}
                inputMode="numeric"
                autoComplete="one-time-code"
                required
                value={emailCode}
                onChange={(e) => {
                  const clean = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setEmailCode(clean);
                  if (error) setError('');
                }}
                placeholder="• • • • • •"
                className="w-full text-center tracking-[0.35em] font-mono font-black text-xl py-1.5 border border-slate-300 rounded-xl focus:outline-none focus:border-[#F85606] transition"
              />
            </div>

            <p className="text-[10px] text-slate-400 text-center">
              Don't see the email? Check Spam / Junk folder or click Resend below.
            </p>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl shadow-sm transition flex items-center justify-center gap-1.5 disabled:opacity-50 text-xs cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Verifying Account...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verify & Activate Account</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-between text-[11px] pt-0.5">
              <button
                type="button"
                onClick={() => {
                  setSignupStep(1);
                  setError('');
                  setStatusMessage('');
                }}
                className="text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Change Email / Details</span>
              </button>

              <button
                type="button"
                disabled={signupResendCountdown > 0 || isLoading}
                onClick={handleSignupResend}
                className="text-[#F85606] hover:underline font-semibold disabled:text-slate-400 disabled:no-underline cursor-pointer"
              >
                {signupResendCountdown > 0 
                  ? `Resend in ${signupResendCountdown}s` 
                  : 'Resend Code'}
              </button>
            </div>
          </form>
        )}

        {/* ======================================================== */}
        {/* 4. FORGOT PASSWORD MODE */}
        {/* ======================================================== */}
        {mode === 'forgot-password' && (
          <div className="p-4 sm:p-5 text-xs">
            {forgotStep === 1 ? (
              /* Step 1: Input email or phone */
              <form onSubmit={handleForgotInitiate} className="space-y-3">
                <div className="text-center mb-1">
                  <div className="w-10 h-10 rounded-full bg-orange-100 text-[#F85606] flex items-center justify-center mx-auto mb-1.5">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm">Account Recovery</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Enter your registered email or phone to receive a 6-digit recovery code.
                  </p>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1 text-[11px]">
                    Registered Email or Phone Number *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      autoFocus
                      placeholder="e.g. name@gmail.com or 98XXXXXXXX"
                      value={forgotPhoneOrEmail}
                      onChange={(e) => setForgotPhoneOrEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-[#F85606] transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#F85606] hover:bg-[#E04E05] text-white font-bold py-2.5 rounded-xl shadow-sm transition flex items-center justify-center gap-1.5 disabled:opacity-50 text-xs cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Sending Recovery Code...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Recovery Code</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>

                <div className="text-center pt-1 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setLoginStep(1);
                      setError('');
                      setStatusMessage('');
                    }}
                    className="text-slate-500 hover:text-slate-800 font-semibold inline-flex items-center gap-1 cursor-pointer text-[11px]"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Login</span>
                  </button>
                </div>
              </form>
            ) : (
              /* Step 2: Compact Input code and new password */
              <form onSubmit={handleForgotReset} className="space-y-2.5 animate-in fade-in duration-150">
                {/* Slim notification strip showing recipient and 3-minute expiry */}
                <div className="bg-orange-50/90 border border-orange-200/80 rounded-xl px-3 py-1.5 flex items-center justify-between text-[11px]">
                  <span className="text-slate-700 truncate mr-2">
                    Code sent to: <strong className="text-slate-900">{forgotMaskedEmail}</strong>
                  </span>
                  <span className="shrink-0 text-[10px] text-amber-800 bg-white/90 border border-amber-200/80 px-2 py-0.5 rounded-full font-semibold">
                    ⏱️ 3 min
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-slate-700 text-[11px]">
                      Enter 6-Digit Email Code *
                    </label>
                    <span className="text-[10px] text-slate-400">Check inbox / spam</span>
                  </div>
                  <input
                    type="text"
                    autoFocus
                    maxLength={6}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    required
                    value={forgotCode}
                    onChange={(e) => {
                      const clean = e.target.value.replace(/\D/g, '').slice(0, 6);
                      setForgotCode(clean);
                      if (error) setError('');
                    }}
                    placeholder="• • • • • •"
                    className="w-full text-center tracking-[0.35em] font-mono font-black text-xl py-1.5 border border-slate-300 rounded-xl focus:outline-none focus:border-[#F85606] transition"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1 text-[11px]">New Password *</label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type={forgotShowPassword ? "text" : "password"}
                      required
                      placeholder="Min 8 chars, 1 uppercase, 1 number, 1 symbol"
                      value={forgotNewPassword}
                      onChange={(e) => setForgotNewPassword(e.target.value)}
                      className="w-full pl-8 pr-9 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-[#F85606] transition"
                    />
                    <button
                      type="button"
                      onClick={() => setForgotShowPassword(!forgotShowPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                    >
                      {forgotShowPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Compact Password Requirements Checklist */}
                  <div className="mt-1 p-2 bg-slate-50 border border-slate-200 rounded-xl space-y-1 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-slate-700">Requirements:</span>
                      <span className={`font-semibold ${
                        forgotRulesMetCount === 4 
                          ? 'text-emerald-600' 
                          : forgotRulesMetCount >= 2 
                          ? 'text-amber-600' 
                          : 'text-slate-500'
                      }`}>
                        {forgotRulesMetCount === 4 ? 'All requirements met ✓' : `${forgotRulesMetCount} of 4 met`}
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-1 h-1 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-200 ${
                        forgotRulesMetCount >= 1 ? (forgotRulesMetCount === 4 ? 'bg-emerald-500' : 'bg-amber-500') : 'bg-transparent'
                      }`} />
                      <div className={`h-full rounded-full transition-all duration-200 ${
                        forgotRulesMetCount >= 2 ? (forgotRulesMetCount === 4 ? 'bg-emerald-500' : 'bg-amber-500') : 'bg-transparent'
                      }`} />
                      <div className={`h-full rounded-full transition-all duration-200 ${
                        forgotRulesMetCount >= 3 ? (forgotRulesMetCount === 4 ? 'bg-emerald-500' : 'bg-amber-500') : 'bg-transparent'
                      }`} />
                      <div className={`h-full rounded-full transition-all duration-200 ${
                        forgotRulesMetCount >= 4 ? 'bg-emerald-500' : 'bg-transparent'
                      }`} />
                    </div>

                    <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 pt-0.5">
                      {forgotPasswordRules.map((rule) => (
                        <div 
                          key={rule.id} 
                          className={`flex items-center gap-1 text-[9.5px] leading-tight transition-colors duration-150 ${
                            rule.met ? 'text-emerald-700 font-semibold' : 'text-slate-400'
                          }`}
                        >
                          {rule.met ? (
                            <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                          ) : (
                            <span className="w-3 h-3 flex items-center justify-center text-[10px] text-slate-300 font-bold shrink-0">•</span>
                          )}
                          <span className="truncate">{rule.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1 text-[11px]">Confirm New Password *</label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type={forgotShowPassword ? "text" : "password"}
                      required
                      placeholder="Re-enter new password"
                      value={forgotConfirmPassword}
                      onChange={(e) => setForgotConfirmPassword(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-[#F85606] transition"
                    />
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 text-center">
                  Don't see code? Check Spam / Junk or click Resend below.
                </p>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#F85606] hover:bg-[#E04E05] text-white font-bold py-2.5 rounded-xl shadow-sm transition flex items-center justify-center gap-1.5 disabled:opacity-50 text-xs cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Updating Password...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Reset Password & Finish</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between text-[11px] pt-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setForgotStep(1);
                      setError('');
                      setStatusMessage('');
                    }}
                    className="text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3 h-3" />
                    <span>Change Email / Phone</span>
                  </button>

                  <button
                    type="button"
                    disabled={forgotResendCountdown > 0 || isLoading}
                    onClick={handleForgotResend}
                    className="text-[#F85606] hover:underline font-semibold disabled:text-slate-400 disabled:no-underline cursor-pointer"
                  >
                    {forgotResendCountdown > 0 
                      ? `Resend in ${forgotResendCountdown}s` 
                      : 'Resend Code'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        </div>

        {/* Footer Guarantee (Pinned) */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 text-[9.5px] text-slate-500 text-center flex items-center justify-center gap-1.5 shrink-0">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Nepal's 100% Genuine Marketplace • Protected by 256-bit SSL</span>
        </div>

      </div>
    </div>
  );
};
