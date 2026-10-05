import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('bhanjo_token') || null;
    } catch {
      return null;
    }
  });

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('bhanjo_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const getAuthHeaders = () => {
    const headers = { 'Content-Type': 'application/json' };
    const savedToken = token || localStorage.getItem('bhanjo_token');
    if (savedToken) {
      headers['Authorization'] = `Bearer ${savedToken}`;
    }
    return headers;
  };

  // Validate active JWT session on startup with backend
  useEffect(() => {
    const verifySession = async () => {
      const activeToken = localStorage.getItem('bhanjo_token');
      if (!activeToken) return;

      try {
        const res = await fetch('/api/auth/me', {
          headers: { 'Authorization': `Bearer ${activeToken}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setUser(data.user);
            localStorage.setItem('bhanjo_user', JSON.stringify(data.user));
          }
        } else if (res.status === 401 || res.status === 403) {
          // Stale or expired token
          console.warn('Session expired. Logging out.');
          logout();
        }
      } catch (err) {
        console.warn('Session check offline fallback:', err.message);
      }
    };

    verifySession();
  }, []);

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('bhanjo_user');
      const u = saved ? JSON.parse(saved) : null;
      if (u?.id) {
        const userWish = localStorage.getItem(`bhanjo_wishlist_${u.id}`);
        return userWish ? JSON.parse(userWish) : [];
      }
      return [];
    } catch {
      return [];
    }
  });

  // Dedicated per-user SQLite database wishlist sync
  useEffect(() => {
    if (!user) {
      setWishlist([]);
      return;
    }

    // Immediate cached wishlist for this user
    try {
      const cached = localStorage.getItem(`bhanjo_wishlist_${user.id}`);
      if (cached) setWishlist(JSON.parse(cached));
    } catch (e) {}

    const fetchUserWishlist = async () => {
      try {
        const headers = getAuthHeaders();
        if (user.id) headers['x-user-id'] = user.id;

        const res = await fetch('/api/wishlist', { headers });
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.items)) {
            setWishlist(data.items);
            localStorage.setItem(`bhanjo_wishlist_${user.id}`, JSON.stringify(data.items));
          }
        }
      } catch (err) {
        console.log('User wishlist sync offline note:', err.message);
      }
    };

    fetchUserWishlist();
  }, [user?.id, token]);

  const [userOrders, setUserOrders] = useState([]);

  // Auto-purge stale mock order history on load
  useEffect(() => {
    try {
      localStorage.removeItem('bhanjo_user_orders');
      localStorage.removeItem('bhanjo_user_orders_v2');
      localStorage.removeItem('bhanjo_orders');
      setUserOrders([]);
    } catch (e) {
      console.log('Order purge error:', e);
    }
  }, []);

  // Customer Login (Step 1: Validate credentials & send 2FA email code)
  const initiateLogin = async (credentials) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Login failed. Please check your credentials.');
    }
    // Direct token if legacy fallback without email
    if (data.token && data.user) {
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('bhanjo_user', JSON.stringify(data.user));
      localStorage.setItem('bhanjo_token', data.token);
      return { ...data, directLogin: true };
    }
    return data;
  };

  // Customer Login (Step 2: Verify 2FA email code & establish session)
  const verifyLogin2FA = async ({ loginSessionId, code }) => {
    const res = await fetch('/api/auth/login-verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ loginSessionId, code })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Verification failed. Please check the code.');
    }
    if (data.user && data.token) {
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('bhanjo_user', JSON.stringify(data.user));
      localStorage.setItem('bhanjo_token', data.token);
      return data.user;
    }
  };

  // Customer Login (Resend 2FA code)
  const resendLoginCode = async ({ loginSessionId }) => {
    const res = await fetch('/api/auth/login-resend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ loginSessionId })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to resend verification code.');
    }
    return data;
  };

  const login = async (credentials) => {
    // Direct object login (e.g. from demo login)
    if (credentials?.id) {
      setUser(credentials);
      localStorage.setItem('bhanjo_user', JSON.stringify(credentials));
      return credentials;
    }
    return initiateLogin(credentials);
  };

  // Customer Email OTP Registration (Step 1: Initiate)
  const initiateCustomerRegister = async (userData) => {
    const res = await fetch('/api/auth/register-initiate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to send verification code.');
    }
    return data;
  };

  // Customer Email OTP Registration (Step 2: Verify & Create Account)
  const verifyCustomerRegister = async ({ signupSessionId, emailCode }) => {
    const res = await fetch('/api/auth/register-verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ signupSessionId, emailCode })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Verification failed. Please check the code.');
    }
    if (data.user && data.token) {
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('bhanjo_user', JSON.stringify(data.user));
      localStorage.setItem('bhanjo_token', data.token);
      return data.user;
    }
  };

  // Customer Email OTP Registration (Resend Code)
  const resendCustomerRegister = async ({ signupSessionId }) => {
    const res = await fetch('/api/auth/register-resend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ signupSessionId })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to resend verification code.');
    }
    return data;
  };

  // Customer Forgot Password (Step 1: Initiate)
  const initiateForgotPassword = async (phoneOrEmail) => {
    const res = await fetch('/api/auth/forgot-password/initiate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneOrEmail })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to initiate password reset.');
    }
    return data;
  };

  // Customer Forgot Password (Resend Code)
  const resendForgotPasswordCode = async ({ resetSessionId }) => {
    const res = await fetch('/api/auth/forgot-password/resend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resetSessionId })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to resend reset code.');
    }
    return data;
  };

  // Customer Forgot Password (Step 2: Verify & Reset)
  const verifyAndResetPassword = async ({ resetSessionId, code, newPassword }) => {
    const res = await fetch('/api/auth/forgot-password/reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resetSessionId, code, newPassword })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to reset password.');
    }
    return data;
  };

  const register = async (userData) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }
      if (data.user && data.token) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('bhanjo_user', JSON.stringify(data.user));
        localStorage.setItem('bhanjo_token', data.token);
        return data.user;
      }
    } catch (err) {
      throw err;
    }
  };

  const updateProfile = async (updatedFields) => {
    if (!user) return;

    try {
      const res = await fetch(`/api/auth/profile/${user.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updatedFields)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }
      if (data.user) {
        setUser(data.user);
        localStorage.setItem('bhanjo_user', JSON.stringify(data.user));
        return data.user;
      }
      const merged = { ...user, ...updatedFields };
      setUser(merged);
      localStorage.setItem('bhanjo_user', JSON.stringify(merged));
      return merged;
    } catch (e) {
      console.error('Profile update error:', e);
      throw e;
    }
  };

  const logout = () => {
    if (user?.id) {
      localStorage.removeItem(`bhanjo_wishlist_${user.id}`);
      localStorage.removeItem(`bhanjo_cart_${user.id}`);
    }
    setUser(null);
    setToken(null);
    setWishlist([]);
    localStorage.removeItem('bhanjo_user');
    localStorage.removeItem('bhanjo_token');
    localStorage.removeItem('bhanjo_wishlist');
    localStorage.removeItem('bhanjo_cart');
  };

  const toggleWishlist = async (product) => {
    if (!product || !product.id) return;
    if (!user) return;

    // Optimistic local state update
    const exists = wishlist.some(item => item.id === product.id);
    const updated = exists 
      ? wishlist.filter(item => item.id !== product.id)
      : [...wishlist, product];

    setWishlist(updated);
    if (user?.id) {
      localStorage.setItem(`bhanjo_wishlist_${user.id}`, JSON.stringify(updated));
    }

    // Persist to backend database for this specific customer
    try {
      const headers = getAuthHeaders();
      if (user.id) headers['x-user-id'] = user.id;

      const res = await fetch('/api/wishlist/toggle', {
        method: 'POST',
        headers,
        body: JSON.stringify({ product })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.items)) {
          setWishlist(data.items);
          localStorage.setItem(`bhanjo_wishlist_${user.id}`, JSON.stringify(data.items));
        }
      }
    } catch (err) {
      console.log('Wishlist sync note:', err.message);
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  const cancelOrder = async (orderId, reason = 'Customer requested cancellation') => {
    try {
      await fetch(`/api/orders/${orderId}/cancel`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      });
    } catch (e) {
      console.log('Order cancel local sync:', e);
    }

    setUserOrders(prev => prev.map(ord => {
      if (ord.id === orderId || ord.trackingNumber === orderId) {
        const updatedTimeline = [...(ord.timeline || []), {
          title: `Order Cancelled by Customer (${reason})`,
          time: 'Just Now',
          completed: true
        }];
        return {
          ...ord,
          status: 'Cancelled',
          statusCode: 0,
          cancelReason: reason,
          timeline: updatedTimeline
        };
      }
      return ord;
    }));
  };

  const addOrder = (orderData) => {
    const trackingNo = orderData.trackingNumber || `BJ-EXP-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder = {
      id: orderData.id || `ORD-${Date.now()}`,
      trackingNumber: trackingNo,
      date: new Date().toISOString().split('T')[0],
      status: "Processing",
      statusCode: 1,
      courier: "Bhanjo Express Logistics",
      deliveryAddress: orderData.customerAddress || (user?.address || "Kathmandu, Nepal"),
      paymentMethod: orderData.paymentMethod || "eSewa",
      paymentStatus: "Paid",
      totalAmount: orderData.totalAmount || 0,
      currency: orderData.currency || "NPR",
      items: orderData.items || [],
      timeline: [
        { title: "Order Placed & Verified", time: "Just Now", completed: true },
        { title: "Merchant Packaging & Quality Check", time: "In Progress", completed: false },
        { title: "Handed over to Bhanjo Express Hub", time: "Pending", completed: false },
        { title: "Out for Delivery", time: "Pending", completed: false },
        { title: "Delivered", time: "Pending", completed: false }
      ]
    };

    setUserOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  const clearAllOrders = async () => {
    setUserOrders([]);
    localStorage.removeItem('bhanjo_user_orders');
    localStorage.removeItem('bhanjo_user_orders_v2');
    try {
      await fetch('/api/orders', { method: 'DELETE' });
    } catch (e) {
      console.log('Orders clear err:', e);
    }
  };

  // Master Admin State: Strictly true ONLY when logged in as verified admin
  const isAdmin = Boolean(user && user.role === 'admin');

  // Purge any legacy browser admin_mode flag so regular users and guests never see admin data
  useEffect(() => {
    try {
      if (!user || user.role !== 'admin') {
        localStorage.removeItem('bhanjo_admin_mode');
      }
    } catch (e) {}
  }, [user]);

  const setAdminMode = (enabled) => {
    try {
      if (enabled && user && user.role === 'admin') {
        localStorage.setItem('bhanjo_admin_mode', 'true');
      } else {
        localStorage.removeItem('bhanjo_admin_mode');
      }
    } catch (e) {}
  };

  // Step 1: Initiate Admin Login (validates credentials & sends Dual-2FA codes)
  const initiateAdminLogin = async ({ email, password, phone }) => {
    const res = await fetch('/api/admin/auth/initiate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, phone })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to initiate admin login.');
    }
    return data;
  };

  // Step 2: Verify Dual-Codes (SMS + Email side-by-side)
  const verifyAdminMfa = async ({ mfaSessionId, smsCode, emailCode }) => {
    const res = await fetch('/api/admin/auth/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mfaSessionId, smsCode, emailCode })
    });
    const data = await res.json();
    if (!res.ok) {
      const err = new Error(data.error || 'Security verification failed.');
      err.smsValid = data.smsValid;
      err.emailValid = data.emailValid;
      throw err;
    }
    if (data.user && data.token) {
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('bhanjo_user', JSON.stringify(data.user));
      localStorage.setItem('bhanjo_token', data.token);
      setAdminMode(true);
      return data.user;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      getAuthHeaders,
      isAdmin,
      setAdminMode,
      initiateAdminLogin,
      verifyAdminMfa,
      login,
      initiateLogin,
      verifyLogin2FA,
      resendLoginCode,
      register,
      initiateCustomerRegister,
      verifyCustomerRegister,
      resendCustomerRegister,
      initiateForgotPassword,
      resendForgotPasswordCode,
      verifyAndResetPassword,
      updateProfile,
      logout,
      wishlist,
      toggleWishlist,
      isInWishlist,
      userOrders,
      addOrder,
      cancelOrder,
      clearAllOrders
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
