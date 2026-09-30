import React, { useState, useEffect } from 'react';
import { 
  X, ShoppingBag, Trash2, ArrowRight, ShieldCheck, 
  CreditCard, CheckCircle2, ChevronRight, Truck, Loader2, 
  Lock, UserCheck, Tag, Ticket, Printer, FileText, Sparkles 
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';

export const CartDrawer = ({ isOpen, onClose, onRequireAuth, onOpenTrackOrder }) => {
  const { 
    items, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    cartTotalUSD,
    coupon,
    applyCoupon,
    removeCoupon,
    couponDiscountUSD
  } = useCart();
  const { formatPrice, formatNPR, formatJPY, currentCurrency } = useCurrency();
  const { user, addOrder } = useAuth();

  const [checkoutStep, setCheckoutStep] = useState('cart'); // 'cart', 'shipping', 'payment', 'success'
  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    city: 'Kathmandu',
    address: user?.address || '',
    deliveryZone: 'valley'
  });

  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState({ text: '', isError: false });

  useEffect(() => {
    if (user) {
      setShippingInfo(prev => ({
        ...prev,
        fullName: prev.fullName || user.name || '',
        phone: prev.phone || user.phone || '',
        address: prev.address || user.address || ''
      }));
    }
  }, [user]);

  const [paymentMethod, setPaymentMethod] = useState('esewa');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);

  if (!isOpen) return null;

  const baseDeliveryFeeUSD = shippingInfo.deliveryZone === 'valley' ? 0.75 : 1.50;
  const isFreeDelivery = cartTotalUSD > 25 || coupon?.type === 'shipping';
  const finalDeliveryFeeUSD = isFreeDelivery ? 0 : baseDeliveryFeeUSD;
  const grandTotalUSD = Math.max(0, cartTotalUSD - couponDiscountUSD + finalDeliveryFeeUSD);

  const handleApplyCoupon = (e) => {
    if (e) e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (res.success) {
      setCouponFeedback({ text: res.message, isError: false });
      setCouponInput('');
    } else {
      setCouponFeedback({ text: res.message, isError: true });
    }
  };

  const handleProceedToShipping = () => {
    if (!user) {
      if (onRequireAuth) {
        onRequireAuth(() => {
          setCheckoutStep('shipping');
        }, "Please login or create an account to proceed with checkout.");
      }
      return;
    }
    setCheckoutStep('shipping');
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    const trackingNo = `BJ-EXP-${Math.floor(100000 + Math.random() * 900000)}`;

    const normalizedItems = items.map(it => ({
      id: it.productId || it.id,
      title: it.title || it.product?.title || 'Bhanjo Item',
      image: it.image || it.product?.images?.[0] || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400',
      unitPriceUSD: it.unitPriceUSD || it.unitPrice || 15,
      quantity: it.quantity,
      totalPrice: it.totalPrice
    }));

    const orderPayload = {
      userId: user?.id || null,
      customerName: shippingInfo.fullName || user?.name || 'Bhanjo Shopper',
      customerPhone: shippingInfo.phone || user?.phone || '98XXXXXXXX',
      customerAddress: `${shippingInfo.address}, ${shippingInfo.city}, Nepal`,
      items: normalizedItems,
      totalAmount: grandTotalUSD,
      currency: currentCurrency?.code || 'NPR',
      paymentMethod,
      trackingNumber: trackingNo
    };

    let serverOrderId = null;
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      if (res.ok) {
        const json = await res.json();
        serverOrderId = json.orderId;
      }
    } catch (e) {
      console.log("Local order save");
    }

    const savedOrder = addOrder({
      ...orderPayload,
      id: serverOrderId || `ORD-${Date.now().toString().slice(-6)}`,
      trackingNumber: trackingNo,
      couponApplied: coupon?.code || null,
      discountAmountUSD: couponDiscountUSD
    });

    setConfirmedOrder(savedOrder);
    setIsProcessing(false);
    setCheckoutStep('success');
    clearCart();
    confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-150">
      
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between border-l border-slate-200">
        
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#F85606]" />
            <h2 className="font-bold text-sm text-slate-800">
              {checkoutStep === 'cart' && `Shopping Cart (${items.length})`}
              {checkoutStep === 'shipping' && 'Delivery Address'}
              {checkoutStep === 'payment' && 'Payment Method'}
              {checkoutStep === 'success' && 'Order Placed!'}
            </h2>
          </div>
          
          <button
            onClick={() => {
              setCheckoutStep('cart');
              onClose();
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* STEP 1: CART LIST */}
          {checkoutStep === 'cart' && (
            <div>
              {items.length === 0 ? (
                <div className="text-center py-16 text-slate-400 space-y-3">
                  <ShoppingBag className="w-12 h-12 mx-auto stroke-1 text-slate-300" />
                  <p className="text-sm font-semibold text-slate-700">Your cart is empty</p>
                  <p className="text-xs text-slate-400">Discover authentic Nepali goods & trending products!</p>
                  <button
                    onClick={onClose}
                    className="mt-4 bg-[#F85606] text-white font-bold text-xs px-5 py-2 rounded-lg hover:bg-[#e04e05] transition"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <img
                        src={item.image || item.product?.images?.[0] || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400'}
                        alt={item.title || item.product?.title || 'Product'}
                        className="w-16 h-16 rounded-lg object-cover bg-white border border-slate-200 flex-shrink-0"
                      />
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="text-xs font-semibold text-slate-800 line-clamp-1" title={item.title || item.product?.title}>
                            {item.title || item.product?.title}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-slate-400 hover:text-red-600 transition p-0.5"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-[#F85606]">
                              {formatPrice(item.unitPriceUSD || item.unitPrice || 15)}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {formatNPR(item.unitPriceUSD || item.unitPrice || 15)}
                            </span>
                          </div>

                          <div className="flex items-center border border-slate-300 rounded-md overflow-hidden bg-white text-xs">
                            <button
                              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                            >
                              -
                            </button>
                            <span className="px-2 font-bold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Voucher / Coupon Code Box */}
                  <div className="p-3 bg-orange-50/50 rounded-xl border border-orange-200 text-xs space-y-2">
                    <div className="flex items-center gap-1.5 font-bold text-slate-800">
                      <Ticket className="w-4 h-4 text-[#F85606]" />
                      <span>Have a Voucher or Promo Code?</span>
                    </div>

                    {coupon ? (
                      <div className="flex items-center justify-between p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800">
                        <div className="flex items-center gap-1.5 font-bold text-xs">
                          <span>✓ {coupon.label}</span>
                          <span className="font-mono text-[11px] bg-emerald-200/60 px-1.5 py-0.2 rounded">({coupon.code})</span>
                        </div>
                        <button
                          onClick={removeCoupon}
                          className="text-xs text-red-600 font-semibold hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div>
                        <form onSubmit={handleApplyCoupon} className="flex gap-1.5">
                          <input
                            type="text"
                            placeholder="Enter Code (e.g. BHANJO10)"
                            value={couponInput}
                            onChange={(e) => {
                              setCouponInput(e.target.value);
                              setCouponFeedback({ text: '', isError: false });
                            }}
                            className="flex-1 px-2.5 py-1.5 border border-slate-300 rounded-lg uppercase font-mono text-xs focus:outline-none focus:border-[#F85606]"
                          />
                          <button
                            type="submit"
                            className="bg-[#F85606] hover:bg-[#e04e05] text-white font-bold px-3 py-1.5 rounded-lg transition"
                          >
                            Apply
                          </button>
                        </form>

                        {couponFeedback.text && (
                          <div className={`mt-1.5 text-[11px] font-medium ${couponFeedback.isError ? 'text-red-600' : 'text-emerald-700'}`}>
                            {couponFeedback.text}
                          </div>
                        )}

                        {/* Quick Tap Coupons */}
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          <button
                            onClick={() => {
                              applyCoupon('BHANJO10');
                            }}
                            className="text-[10px] bg-white border border-orange-300 text-orange-700 px-2 py-0.5 rounded-md hover:bg-orange-100 transition"
                          >
                            ⚡ 10% Off: <strong>BHANJO10</strong>
                          </button>
                          <button
                            onClick={() => {
                              applyCoupon('FREEEXP');
                            }}
                            className="text-[10px] bg-white border border-emerald-300 text-emerald-700 px-2 py-0.5 rounded-md hover:bg-emerald-100 transition"
                          >
                            🚚 Free Shipping: <strong>FREEEXP</strong>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: SHIPPING ADDRESS */}
          {checkoutStep === 'shipping' && (
            <div className="space-y-3 text-xs">
              <div className="p-2.5 bg-orange-50 text-slate-700 rounded-lg border border-orange-200 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-[#F85606] flex-shrink-0" />
                <span>Logged in as <strong>{user?.name || "Bhanjo Shopper"}</strong> ({user?.phone || "+977-98XXXXXXXX"})</span>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Receiver Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Receiver's name"
                  value={shippingInfo.fullName}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, fullName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#F85606]"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Mobile Phone (+977) *</label>
                <input
                  type="tel"
                  required
                  placeholder="98XXXXXXXX"
                  value={shippingInfo.phone}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#F85606]"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Delivery City / District</label>
                <select
                  value={shippingInfo.city}
                  onChange={(e) => {
                    const c = e.target.value;
                    const zone = ['Kathmandu', 'Lalitpur', 'Bhaktapur'].includes(c) ? 'valley' : 'outside';
                    setShippingInfo({ ...shippingInfo, city: c, deliveryZone: zone });
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-[#F85606]"
                >
                  <option value="Kathmandu">Kathmandu Valley (1-Day Express)</option>
                  <option value="Lalitpur">Lalitpur (1-Day Express)</option>
                  <option value="Bhaktapur">Bhaktapur (1-Day Express)</option>
                  <option value="Pokhara">Pokhara / Gandaki</option>
                  <option value="Biratnagar">Biratnagar / Koshi</option>
                  <option value="Birgunj">Birgunj / Madhesh</option>
                  <option value="Butwal">Butwal / Lumbini</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Street Address / Landmark *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Near New Road Gate, House #14"
                  value={shippingInfo.address}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#F85606]"
                />
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT METHOD */}
          {checkoutStep === 'payment' && (
            <div className="space-y-2.5 text-xs">
              <span className="font-bold text-slate-800 block mb-1">Select Nepali Payment Gateway:</span>
              
              {[
                { id: 'esewa', name: 'eSewa Mobile Wallet', desc: 'Instant QR & Direct Wallet Debit', color: 'border-emerald-500 bg-emerald-50 text-emerald-800' },
                { id: 'khalti', name: 'Khalti Digital Wallet', desc: 'Instant 5% Points & Fast Pay', color: 'border-purple-500 bg-purple-50 text-purple-800' },
                { id: 'connectips', name: 'ConnectIPS (NCHL)', desc: 'Direct Nepal Bank Transfer', color: 'border-blue-500 bg-blue-50 text-blue-800' },
                { id: 'cod', name: 'Cash on Delivery (COD)', desc: 'Pay cash upon parcel receipt', color: 'border-slate-400 bg-slate-50 text-slate-800' }
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setPaymentMethod(m.id)}
                  className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition ${
                    paymentMethod === m.id ? m.color + ' font-bold ring-2 ring-[#F85606]/30' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div>
                    <div className="text-xs">{m.name}</div>
                    <div className="text-[10px] text-slate-500 font-normal">{m.desc}</div>
                  </div>
                  {paymentMethod === m.id && <CheckCircle2 className="w-4 h-4 text-[#F85606]" />}
                </button>
              ))}

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>Bhanjo Trade Protection: Your payment is held securely in escrow until you receive and inspect your parcel.</span>
              </div>
            </div>
          )}

          {/* STEP 4: ORDER SUCCESS */}
          {checkoutStep === 'success' && (
            <div className="text-center py-6 space-y-3">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Thank you for your order!</h3>
              <p className="text-xs text-slate-500">
                Your order is confirmed and sent to <strong>Bhanjo Express Logistics</strong>.
              </p>

              <div className="p-4 bg-orange-50 rounded-2xl border border-orange-200 text-left text-xs space-y-2 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Tracking Code:</span>
                  <span className="font-mono font-black text-sm text-[#F85606]">{confirmedOrder?.trackingNumber}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Order ID:</span>
                  <span className="font-bold text-slate-800">{confirmedOrder?.id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Payment:</span>
                  <span className="font-semibold text-slate-800">{confirmedOrder?.paymentMethod} (Paid)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Delivery Address:</span>
                  <span className="font-medium text-slate-700 truncate max-w-[200px]">{confirmedOrder?.deliveryAddress}</span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-orange-200/60">
                  <span className="text-slate-500">Status:</span>
                  <span className="font-bold text-emerald-700">Confirmed (Dispatched in 24h)</span>
                </div>
              </div>

              {/* View Printable Invoice Box */}
              {showReceipt && confirmedOrder && (
                <div className="mt-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-left text-xs space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span className="font-bold text-slate-800 flex items-center gap-1">
                      <FileText className="w-4 h-4 text-[#F85606]" />
                      <span>Official Tax Invoice</span>
                    </span>
                    <button
                      onClick={() => window.print()}
                      className="text-[#F85606] font-bold text-xs flex items-center gap-1 hover:underline"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print</span>
                    </button>
                  </div>
                  <div className="text-[11px] text-slate-600">
                    <div>Bhanjo Technologies Pvt Ltd (VAT: 601294812)</div>
                    <div>Customer: {confirmedOrder.customerName} ({confirmedOrder.customerPhone})</div>
                  </div>
                  <div className="divide-y divide-slate-100 text-[11px]">
                    {confirmedOrder.items?.map((it, idx) => (
                      <div key={idx} className="py-1 flex justify-between">
                        <span>{it.quantity}x {it.title}</span>
                        <span className="font-bold">{formatPrice(it.unitPriceUSD * it.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-slate-900">
                    <span>Total Amount Paid:</span>
                    <span className="text-[#F85606]">{formatPrice(confirmedOrder.totalAmount)}</span>
                  </div>
                </div>
              )}

              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => {
                    onClose();
                    if (onOpenTrackOrder && confirmedOrder) {
                      onOpenTrackOrder(confirmedOrder.trackingNumber);
                    }
                  }}
                  className="w-full bg-[#F85606] hover:bg-[#e04e05] text-white font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Truck className="w-4 h-4" />
                  <span>Live Track This Parcel</span>
                </button>

                <button
                  onClick={() => setShowReceipt(!showReceipt)}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 font-semibold text-xs transition flex items-center justify-center gap-1"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{showReceipt ? 'Hide Receipt' : 'View Order Invoice Receipt'}</span>
                </button>

                <button
                  onClick={onClose}
                  className="w-full py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs transition"
                >
                  Continue Shopping
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Drawer Footer */}
        {items.length > 0 && checkoutStep !== 'success' && (
          <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-3">
            
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal:</span>
                <span>{formatPrice(cartTotalUSD)}</span>
              </div>

              {couponDiscountUSD > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Voucher Discount ({coupon?.code}):</span>
                  <span>-{formatPrice(couponDiscountUSD)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-500">
                <span>Delivery:</span>
                <span>{finalDeliveryFeeUSD === 0 ? <strong className="text-emerald-600">FREE</strong> : formatPrice(finalDeliveryFeeUSD)}</span>
              </div>

              <div className="flex justify-between items-baseline text-sm font-black text-slate-900 pt-1 border-t border-slate-200">
                <span>Total Amount:</span>
                <div className="text-right">
                  <span className="text-[#F85606] text-base">{formatPrice(grandTotalUSD)}</span>
                  <div className="text-[10px] text-slate-500 font-normal">
                    <span>{formatNPR(grandTotalUSD)}</span>
                  </div>
                </div>
              </div>
            </div>

            {checkoutStep === 'cart' && (
              <button
                onClick={handleProceedToShipping}
                className="w-full bg-[#F85606] hover:bg-[#e04e05] text-white font-bold text-xs py-3 rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                {!user ? (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Login & Proceed to Checkout</span>
                  </>
                ) : (
                  <>
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            )}

            {checkoutStep === 'shipping' && (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setCheckoutStep('cart')}
                  className="py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-100"
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    if (!shippingInfo.fullName || !shippingInfo.phone || !shippingInfo.address) {
                      alert('Please fill out receiver name, phone, and address');
                      return;
                    }
                    setCheckoutStep('payment');
                  }}
                  className="bg-[#F85606] hover:bg-[#e04e05] text-white font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-1"
                >
                  <span>Select Payment</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {checkoutStep === 'payment' && (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setCheckoutStep('shipping')}
                  className="py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-100"
                >
                  Back
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="bg-[#F85606] hover:bg-[#e04e05] text-white font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-1 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <span>Confirm & Pay ({formatPrice(grandTotalUSD)})</span>
                  )}
                </button>
              </div>
            )}

          </div>
        )}

      </div>

    </div>
  );
};
