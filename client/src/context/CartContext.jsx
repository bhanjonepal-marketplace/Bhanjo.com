import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('bhanjo_cart');
      return saved ? JSON.parse(saved) : [];
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

  useEffect(() => {
    localStorage.setItem('bhanjo_cart', JSON.stringify(items));
  }, [items]);

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

  // Add Item with Tiered Quantity Calculation
  const addToCart = (product, quantity = 1, orderType = 'retail', customNotes = '') => {
    if (!product) return;

    // Find effective unit price based on tiers or sample price
    let unitPrice = product.samplePrice || 20;
    if (orderType === 'wholesale' && product.priceTiers && product.priceTiers.length > 0) {
      const matchedTier = [...product.priceTiers]
        .sort((a, b) => b.minQty - a.minQty)
        .find(tier => quantity >= tier.minQty);
      unitPrice = matchedTier ? matchedTier.price : product.priceTiers[0].price;
    }

    setItems(prev => {
      const existingIndex = prev.findIndex(item => 
        (item.productId === product.id || item.product?.id === product.id) && item.orderType === orderType
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        
        let newUnitPrice = unitPrice;
        if (orderType === 'wholesale' && product.priceTiers && product.priceTiers.length > 0) {
          const matched = [...product.priceTiers]
            .sort((a, b) => b.minQty - a.minQty)
            .find(t => newQty >= t.minQty);
          newUnitPrice = matched ? matched.price : product.priceTiers[0].price;
        }

        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          unitPrice: newUnitPrice,
          unitPriceUSD: newUnitPrice,
          totalPrice: newQty * newUnitPrice,
          customNotes: customNotes || updated[existingIndex].customNotes
        };
        return updated;
      } else {
        const newItem = {
          id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
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
        return [...prev, newItem];
      }
    });
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
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
    }));
  };

  const removeFromCart = (itemId) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    setItems([]);
    setCoupon(null);
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
