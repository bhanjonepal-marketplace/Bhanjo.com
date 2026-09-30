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
      const saved = localStorage.getItem('bhanjo_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

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

  const login = async (credentials) => {
    try {
      if (credentials?.phoneOrEmail) {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials)
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Login failed. Please check your credentials.');
        }
        if (data.user && data.token) {
          setUser(data.user);
          setToken(data.token);
          localStorage.setItem('bhanjo_user', JSON.stringify(data.user));
          localStorage.setItem('bhanjo_token', data.token);
          return data.user;
        }
      }
    } catch (e) {
      throw e;
    }

    // Direct object login (e.g. from demo login)
    if (credentials?.id) {
      setUser(credentials);
      localStorage.setItem('bhanjo_user', JSON.stringify(credentials));
      return credentials;
    }
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
    const merged = { ...user, ...updatedFields };
    setUser(merged);
    localStorage.setItem('bhanjo_user', JSON.stringify(merged));

    try {
      const res = await fetch(`/api/auth/profile/${user.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updatedFields)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          localStorage.setItem('bhanjo_user', JSON.stringify(data.user));
          return data.user;
        }
      }
    } catch (e) {
      console.log('Profile update local sync:', e);
    }
    return merged;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('bhanjo_user');
    localStorage.removeItem('bhanjo_token');
  };

  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.some(item => item.id === product.id);
      if (exists) {
        return prev.filter(item => item.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
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

  // Store Admin Mode (Default: false / Customer Mode)
  const [isAdmin, setIsAdmin] = useState(() => {
    try {
      return localStorage.getItem('bhanjo_admin_mode') === 'true';
    } catch {
      return false;
    }
  });

  const setAdminMode = (enabled) => {
    setIsAdmin(!!enabled);
    try {
      localStorage.setItem('bhanjo_admin_mode', String(!!enabled));
    } catch (e) {}
  };

  const verifyAdminPasskey = (passkey) => {
    const cleanKey = (passkey || '').trim().toLowerCase();
    if (cleanKey === 'bhanjo' || cleanKey === 'admin123' || cleanKey === 'bhanjo123' || cleanKey === 'admin') {
      setAdminMode(true);
      return { success: true };
    }
    return { success: false, message: 'Incorrect passkey. Try "bhanjo" or "admin123".' };
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      getAuthHeaders,
      isAdmin,
      setAdminMode,
      verifyAdminPasskey,
      login,
      register,
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
