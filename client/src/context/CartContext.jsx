import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, token, getAuthHeaders } = useAuth();

  // Load cart initially scoped to the authenticated customer
  const [items, setItems] = useState(() => {
    try {
      const savedUser = localStorage.getItem('bhanjo_user');
      const u = savedUser ? JSON.parse(savedUser) : null;
      if (u?.id) {
        const saved = localStorage.getItem(`bhanjo_cart_${u.id}`);
        return saved ? JSON.parse(saved) : [];
      }
      return [];
    } catch {
      return [];
    }
  });

  const [inquiries, setInquiries] = useState(() => {
    try {
      const saved = localStorage.getItem('bhanjo_inquiries');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [coupon, setCoupon] = useState(() => {
    try {
      const saved = localStorage.getItem('bhanjo_coupon');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Dedicated per-user SQLite database cart synchronization
  useEffect(() => {
    if (!user) {
      setItems([]);
      return;
    }

    // 1. Instant local cache for zero-lag rendering
    try {
      const cached = localStorage.getItem(`bhanjo_cart_${user.id}`);
      if (cached) {
        setItems(JSON.parse(cached));
      }
    } catch (e) {}

    // 2. Fetch authoritative database cart for this specific customer
    const fetchCustomerCart = async () => {
      try {
        const headers = getAuthHeaders ? getAuthHeaders() : { 'Content-Type': 'application/json' };
        if (user.id) headers['x-user-id'] = user.id;

        const res = await fetch('/api/cart', { headers });
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.items)) {
            setItems(data.items);
            localStorage.setItem(`bhanjo_cart_${user.id}`, JSON.stringify(data.items));
          }
        }
      } catch (err) {
        console.log('Customer cart sync note:', err.message);
      }
    };

    fetchCustomerCart();
  }, [user?.id, token]);

  useEffect(() => {
    localStorage.setItem('bhanjo_inquiries', JSON.stringify(inquiries));
  }, [inquiries]);

  useEffect(() => {
    if (coupon) {
      localStorage.setItem('bhanjo_coupon', JSON.stringify(coupon));
    } else {
      localStorage.removeItem('bhanjo_coupon');
    }
  }, [coupon]);

  // Add Item with Tiered Quantity Calculation & Database Persistence
  const addToCart = async (product, quantity = 1, orderType = 'retail', customNotes = '') => {
    if (!product || !product.id) return;

    // Find effective unit price based on tiers or sample price
    let unitPrice = product.samplePrice || 20;
    if (orderType === 'wholesale' && product.priceTiers && product.priceTiers.length > 0) {
      const matchedTier = [...product.priceTiers]
        .sort((a, b) => b.minQty - a.minQty)
        .find(tier => quantity >= tier.minQty);
      unitPrice = matchedTier ? matchedTier.price : product.priceTiers[0].price;
    }

    // Optimistic local state update
    setItems(prev => {
      const existingIndex = prev.findIndex(item => 
        (item.productId === product.id || item.product?.id === product.id) && item.orderType === orderType
      );

      let next;
      if (existingIndex > -1) {
        next = [...prev];
        const newQty = next[existingIndex].quantity + quantity;
        
        let newUnitPrice = unitPrice;
        if (orderType === 'wholesale' && product.priceTiers && product.priceTiers.length > 0) {
          const matched = [...product.priceTiers]
            .sort((a, b) => b.minQty - a.minQty)
            .find(t => newQty >= t.minQty);
          newUnitPrice = matched ? matched.price : product.priceTiers[0].price;
        }

        next[existingIndex] = {
          ...next[existingIndex],
          quantity: newQty,
          unitPrice: newUnitPrice,
          unitPriceUSD: newUnitPrice,
          totalPrice: newQty * newUnitPrice,
          customNotes: customNotes || next[existingIndex].customNotes
        };
      } else {
        const newItem = {
          id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          productId: product.id,
          product,
          title: product.title,
          nepaliTitle: product.nepaliTitle || '',
          image: product.images?.[0] || product.image || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400',
          quantity,
          orderType, // 'retail', 'wholesale', or 'sample'
          unitPrice,
          unitPriceUSD: unitPrice,
          totalPrice: quantity * unitPrice,
          customNotes,
          addedAt: new Date().toISOString()
        };
        next = [...prev, newItem];
      }

      if (user?.id) {
        localStorage.setItem(`bhanjo_cart_${user.id}`, JSON.stringify(next));
      }
      return next;
    });

    // Synchronize to backend database for this customer
    if (user?.id) {
      try {
        const headers = getAuthHeaders ? getAuthHeaders() : { 'Content-Type': 'application/json' };
        headers['x-user-id'] = user.id;

        const res = await fetch('/api/cart', {
          method: 'POST',
          headers,
          body: JSON.stringify({ product, quantity, orderType, customNotes })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.items)) {
            setItems(data.items);
            localStorage.setItem(`bhanjo_cart_${user.id}`, JSON.stringify(data.items));
          }
        }
      } catch (err) {
        console.error('Cart sync error:', err);
      }
    }
  };

  // Update item quantity in state and DB
  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setItems(prev => {
      const next = prev.map(item => {
        if (item.id === itemId || item.productId === itemId) {
          let newUnitPrice = item.unitPrice;
          if (item.orderType === 'wholesale' && item.product?.priceTiers) {
            const matched = [...item.product.priceTiers]
              .sort((a, b) => b.minQty - a.minQty)
              .find(t => newQuantity >= t.minQty);
            newUnitPrice = matched ? matched.price : item.product.priceTiers[0].price;
          }
          return {
            ...item,
            quantity: newQuantity,
            unitPrice: newUnitPrice,
            unitPriceUSD: newUnitPrice,
            totalPrice: newQuantity * newUnitPrice
          };
        }
        return item;
      });

      if (user?.id) {
        localStorage.setItem(`bhanjo_cart_${user.id}`, JSON.stringify(next));
      }
      return next;
    });

    if (user?.id) {
      try {
        const headers = getAuthHeaders ? getAuthHeaders() : { 'Content-Type': 'application/json' };
        headers['x-user-id'] = user.id;
        fetch(`/api/cart/${itemId}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify({ quantity: newQuantity })
        }).catch(() => {});
      } catch (e) {}
    }
  };

  // Remove item from state and DB
  const removeFromCart = async (itemId) => {
    setItems(prev => {
      const next = prev.filter(item => item.id !== itemId && item.productId !== itemId);
      if (user?.id) {
        localStorage.setItem(`bhanjo_cart_${user.id}`, JSON.stringify(next));
      }
      return next;
    });

    if (user?.id) {
      try {
        const headers = getAuthHeaders ? getAuthHeaders() : { 'Content-Type': 'application/json' };
        headers['x-user-id'] = user.id;
        fetch(`/api/cart/${itemId}`, {
          method: 'DELETE',
          headers
        }).catch(() => {});
      } catch (e) {}
    }
  };

  // Clear customer's cart
  const clearCart = () => {
    setItems([]);
    setCoupon(null);
    if (user?.id) {
      localStorage.removeItem(`bhanjo_cart_${user.id}`);
      try {
        const headers = getAuthHeaders ? getAuthHeaders() : { 'Content-Type': 'application/json' };
        headers['x-user-id'] = user.id;
        fetch('/api/cart', {
          method: 'DELETE',
          headers
        }).catch(() => {});
      } catch (e) {}
    }
  };

  // Coupon / Voucher Logic
  const applyCoupon = (code) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'BHANJO10') {
      const c = { code: 'BHANJO10', type: 'percentage', value: 10, label: '10% Off Cart Voucher' };
      setCoupon(c);
      return { success: true, message: 'Voucher BHANJO10 applied: 10% discount!' };
    }
    if (clean === 'EXP100' || clean === 'FREEEXP') {
      const c = { code: clean, type: 'shipping', value: 100, label: 'Free Express Shipping Voucher' };
      setCoupon(c);
      return { success: true, message: 'Free Shipping Voucher applied!' };
    }
    if (clean === 'NEPAL50' || clean === 'FESTIVAL') {
      const c = { code: clean, type: 'fixed', value: 2.0, label: '$2.00 / Rs. 267 Festive Cash Voucher' };
      setCoupon(c);
      return { success: true, message: 'Festive Cash Voucher applied!' };
    }
    return { success: false, message: 'Invalid or expired voucher code. Try BHANJO10 or FREEEXP' };
  };

  const removeCoupon = () => {
    setCoupon(null);
  };

  // Submit direct supplier inquiry / bulk quotation
  const submitInquiry = (inquiryData) => {
    const newInquiry = {
      id: `INQ-${Date.now().toString().slice(-6)}`,
      ...inquiryData,
      createdAt: new Date().toISOString(),
      status: 'Awaiting Supplier Quote'
    };
    setInquiries(prev => [newInquiry, ...prev]);
    return newInquiry;
  };

  const cartTotalUSD = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Compute discount
  let couponDiscountUSD = 0;
  if (coupon) {
    if (coupon.type === 'percentage') {
      couponDiscountUSD = (cartTotalUSD * coupon.value) / 100;
    } else if (coupon.type === 'fixed') {
      couponDiscountUSD = Math.min(coupon.value, cartTotalUSD);
    }
  }

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      cartTotalUSD,
      cartCount,
      coupon,
      applyCoupon,
      removeCoupon,
      couponDiscountUSD,
      inquiries,
      submitInquiry
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
