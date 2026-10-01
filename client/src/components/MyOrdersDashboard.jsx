import React, { useState, useEffect, useRef } from 'react';
import { 
  Package, Heart, MapPin, User, LogOut, ChevronRight, 
  Truck, CheckCircle2, Clock, Trash2, ShoppingCart, 
  FileText, ShieldCheck, ArrowRight, Star, Sparkles, 
  Printer, X, AlertTriangle, RefreshCw, Check, Camera,
  Lock, Eye, EyeOff, Upload, Bell, Calendar
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { useCart } from '../context/CartContext';
import confetti from 'canvas-confetti';

export const MyOrdersDashboard = ({ onOpenTrackOrder, onSelectProduct, initialTab = 'orders', onBackToMarketplace }) => {
  const { user, logout, userOrders, wishlist, toggleWishlist, cancelOrder, updateProfile, clearAllOrders } = useAuth();
  const { formatPrice, currentCurrency } = useCurrency();
  const { addToCart } = useCart();

  const [activeTab, setActiveTab] = useState(initialTab || 'orders'); // 'profile', 'orders', 'wishlist', 'addresses'

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Guest Guard: If no account is logged in, immediately return to marketplace homepage
  useEffect(() => {
    if (!user && onBackToMarketplace) {
      onBackToMarketplace();
    }
  }, [user, onBackToMarketplace]);

  const handleLogout = () => {
    logout();
    if (onBackToMarketplace) {
      onBackToMarketplace();
    }
  };

  if (!user) {
    return null;
  }

  const [filterOrderStatus, setFilterOrderStatus] = useState('all');
  const [backendOrders, setBackendOrders] = useState([]);
  
  // Invoice Viewer Modal State
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);

  // Cancellation Modal State
  const [cancellingOrder, setCancellingOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState('Found cheaper alternative');
  const [isCancelling, setIsCancelling] = useState(false);

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: user?.address || '',
    city: user?.city || 'Kathmandu',
    province: user?.province || 'Bagmati Province',
    postal_code: user?.postal_code || '44600',
    landmark: user?.landmark || '',
    gender: user?.gender || 'Not Specified',
    dob: user?.dob || '',
    avatar: user?.avatar || ''
  });

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  // Notification Preferences
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');
  const avatarInputRef = useRef(null);

  // Address Manager State
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [newAddressInput, setNewAddressInput] = useState(user?.address || '');

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        phone: user.phone || '',
        email: user.email || '',
        address: user.address || '',
        city: user.city || 'Kathmandu',
        province: user.province || 'Bagmati Province',
        postal_code: user.postal_code || '44600',
        landmark: user.landmark || '',
        gender: user.gender || 'Not Specified',
        dob: user.dob || '',
        avatar: user.avatar || ''
      });
      setNewAddressInput(user.address || '');
    }
  }, [user]);

  // Handle Photo / Avatar upload
  const handleAvatarFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setProfileError('Please upload a valid image file (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      setProfileError('Image file is too large. Please select a photo under 2MB.');
      return;
    }

    setProfileError('');
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result;
      if (base64) {
        setProfileForm(prev => ({ ...prev, avatar: base64 }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setProfileForm(prev => ({ ...prev, avatar: '' }));
  };

  const loadBackendOrders = () => {
    if (!user?.id) {
      setBackendOrders([]);
      return;
    }
    fetch(`/api/orders?user_id=${encodeURIComponent(user.id)}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.orders)) {
          if (data.orders.length > 0) {
            const mapped = data.orders.map(o => ({
              id: o.id,
              trackingNumber: o.tracking_number || o.id,
              date: o.created_at ? o.created_at.slice(0, 10) : 'Recent',
              status: o.order_status || 'Processing',
              courier: "Bhanjo Express Logistics",
              deliveryAddress: o.customer_address,
              paymentMethod: o.payment_method,
              paymentStatus: o.payment_status || 'Paid',
              totalAmount: o.total_amount,
              currency: o.currency || 'NPR',
              items: o.items || [],
              timeline: o.timeline || [],
              cancelReason: o.cancel_reason || ''
            }));
            setBackendOrders(mapped);
          } else {
            setBackendOrders([]);
          }
        }
      })
      .catch(e => console.log('MyOrders sync:', e));
  };

  useEffect(() => {
    loadBackendOrders();
  }, [user?.id]);

  // Merge unique orders
  const allUserOrders = React.useMemo(() => {
    const ids = new Set();
    const result = [];
    for (const o of [...userOrders, ...backendOrders]) {
      if (!ids.has(o.id) && !ids.has(o.trackingNumber)) {
        ids.add(o.id);
        if (o.trackingNumber) ids.add(o.trackingNumber);
        result.push(o);
      }
    }
    return result;
  }, [userOrders, backendOrders]);

  const filteredOrders = allUserOrders.filter(order => {
    if (filterOrderStatus === 'all') return true;
    if (filterOrderStatus === 'active') return order.status !== 'Delivered' && order.status !== 'Cancelled';
    if (filterOrderStatus === 'delivered') return order.status === 'Delivered';
    if (filterOrderStatus === 'cancelled') return order.status === 'Cancelled';
    return true;
  });

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileSuccess('');
    setProfileError('');

    // Password validation if new password was entered
    if (newPassword) {
      if (!currentPassword) {
        setProfileError('Please enter your current password to authorize setting a new password.');
        setIsSavingProfile(false);
        return;
      }
      if (newPassword.length < 6) {
        setProfileError('New password must be at least 6 characters long.');
        setIsSavingProfile(false);
        return;
      }
      if (newPassword !== confirmPassword) {
        setProfileError('New password and confirm password do not match.');
        setIsSavingProfile(false);
        return;
      }
    }

    try {
      const payload = {
        ...profileForm,
        ...(newPassword ? { current_password: currentPassword, new_password: newPassword } : {})
      };

      await updateProfile(payload);
      setProfileSuccess(newPassword ? 'Profile details and password updated successfully!' : 'Profile details updated and saved successfully!');
      confetti({ particleCount: 50, spread: 60 });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setProfileSuccess(''), 4000);
    } catch (err) {
      setProfileError(err.message || 'Failed to update profile. Please verify your inputs.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleSaveAddress = async () => {
    if (!newAddressInput.trim()) return;
    await updateProfile({ address: newAddressInput.trim() });
    setIsEditingAddress(false);
    confetti({ particleCount: 30, spread: 50 });
  };

  const handleConfirmCancelOrder = async () => {
    if (!cancellingOrder) return;
    setIsCancelling(true);

    try {
      await cancelOrder(cancellingOrder.id, cancelReason);
      loadBackendOrders();
      setCancellingOrder(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="my-4 max-w-7xl mx-auto">
      
      {/* Dashboard Top Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-orange-500/10 text-[#F85606] flex items-center justify-center font-black text-xl border border-orange-200 overflow-hidden relative shadow-xs flex-shrink-0">
            {profileForm.avatar || user?.avatar ? (
              <img src={profileForm.avatar || user.avatar} alt={user?.name} className="w-full h-full object-cover" />
            ) : (
              user?.name ? user.name[0].toUpperCase() : 'U'
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-900">
                {user?.name || "Bhanjo Shopper"}
              </h1>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>Verified Buyer</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              📱 {user?.phone ? `+977 ${user.phone}` : "No phone saved"} • ✉️ {user?.email || "No email saved"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => onOpenTrackOrder('')}
            className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-orange-50 text-[#F85606] font-bold text-xs hover:bg-orange-100 transition flex items-center justify-center gap-1.5 border border-orange-200 shadow-xs"
          >
            <Truck className="w-4 h-4" />
            <span>Track Any Parcel</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-red-50 hover:text-red-600 transition flex items-center justify-center gap-1"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* 2-Column Dashboard Layout: Sidebar Nav + Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Dashboard Tabs Navigation */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-xs space-y-1">
            {[
              { id: 'profile', label: 'My Profile & Settings', icon: User },
              { id: 'orders', label: 'My Orders & Deliveries', icon: Package, badge: allUserOrders.length },
              { id: 'wishlist', label: 'My Wishlist (Saved)', icon: Heart, badge: wishlist.length },
              { id: 'addresses', label: 'Delivery Addresses', icon: MapPin }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold transition ${
                    activeTab === tab.id 
                      ? 'bg-[#F85606] text-white shadow-xs font-bold' 
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge !== undefined && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Tab Content View */}
        <div className="lg:col-span-9 space-y-4">
          
          {/* 1. My Orders Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              
              {/* Filter Sub-Bar */}
              <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-xs flex items-center justify-between">
                <h2 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-[#F85606]" />
                  <span>All Purchased Orders ({allUserOrders.length})</span>
                </h2>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-xs">
                    {['all', 'active', 'delivered', 'cancelled'].map((st) => (
                      <button
                        key={st}
                        onClick={() => setFilterOrderStatus(st)}
                        className={`px-3 py-1 rounded-lg text-xs capitalize transition ${
                          filterOrderStatus === st 
                            ? 'bg-[#F85606] text-white font-bold shadow-xs' 
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>

                  {allUserOrders.length > 0 && (
                    <button
                      onClick={async () => {
                        if (window.confirm("Empty all orders from your order history?")) {
                          await clearAllOrders();
                          setBackendOrders([]);
                        }
                      }}
                      className="px-2.5 py-1 text-[11px] rounded-lg border border-red-200 text-red-600 hover:bg-red-50 font-semibold transition"
                      title="Empty order history"
                    >
                      Empty List
                    </button>
                  )}
                </div>
              </div>

              {/* Order Cards List */}
              {filteredOrders.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs">
                  <Package className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                  <h3 className="text-sm font-bold text-slate-800">No orders found</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    You have no orders matching the selected status.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredOrders.map((order) => {
                    const isCancelled = order.status === 'Cancelled';
                    const isDelivered = order.status === 'Delivered';
                    const canCancel = !isCancelled && !isDelivered;

                    return (
                      <div 
                        key={order.id}
                        className={`bg-white rounded-2xl border p-4 shadow-xs hover:border-orange-300 transition space-y-3 ${
                          isCancelled ? 'border-red-200 bg-red-50/20' : 'border-slate-200'
                        }`}
                      >
                        {/* Order Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs text-slate-900">Order ID: {order.id}</span>
                              <span className="text-[11px] text-slate-400">• Placed on {order.date}</span>
                            </div>
                            <div className="text-xs text-[#F85606] font-mono font-bold mt-0.5">
                              Tracking: <strong>{order.trackingNumber}</strong>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                              isCancelled 
                                ? 'bg-red-100 text-red-700' 
                                : isDelivered 
                                ? 'bg-emerald-100 text-emerald-800' 
                                : 'bg-orange-100 text-orange-800'
                            }`}>
                              {order.status}
                            </span>
                            
                            <button
                              onClick={() => onOpenTrackOrder(order.trackingNumber)}
                              className="bg-[#F85606] hover:bg-[#e04e05] text-white font-bold text-xs px-3 py-1.5 rounded-lg transition flex items-center gap-1 shadow-xs"
                            >
                              <Truck className="w-3.5 h-3.5" />
                              <span>Track Parcel</span>
                            </button>

                            <button
                              onClick={() => setSelectedInvoiceOrder(order)}
                              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-2.5 py-1.5 rounded-lg transition flex items-center gap-1"
                              title="View Tax Invoice"
                            >
                              <FileText className="w-3.5 h-3.5 text-slate-500" />
                              <span className="hidden sm:inline">Invoice</span>
                            </button>
                          </div>
                        </div>

                        {/* Items Row */}
                        <div className="space-y-2">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <img
                                  src={item.image || item.product?.images?.[0] || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400'}
                                  alt={item.title || item.product?.title || 'Order Item'}
                                  className="w-12 h-12 rounded-lg object-cover bg-slate-100 border border-slate-200 flex-shrink-0"
                                />
                                <div className="min-w-0">
                                  <h4 className="text-xs font-semibold text-slate-800 line-clamp-1">
                                    {item.title || item.product?.title || 'Bhanjo Sourced Item'}
                                  </h4>
                                  <div className="text-[11px] text-slate-500">
                                    Qty: <strong>{item.quantity || 1}</strong> • Unit Price: {formatPrice(item.unitPriceUSD || item.unitPrice || item.samplePrice || 15)}
                                  </div>
                                </div>
                              </div>

                              <button
                                onClick={() => {
                                  addToCart({
                                    id: item.id || item.productId,
                                    title: item.title,
                                    samplePrice: item.unitPriceUSD || 15,
                                    images: [item.image]
                                  }, item.quantity || 1, 'retail');
                                  alert(`Added "${item.title}" to cart!`);
                                }}
                                className="text-[11px] font-bold text-orange-600 hover:text-orange-700 hover:underline flex items-center gap-1 flex-shrink-0"
                              >
                                <ShoppingCart className="w-3 h-3" />
                                <span className="hidden sm:inline">Buy Again</span>
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Order Footer */}
                        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
                          <div className="text-slate-500">
                            Payment: <strong className="text-slate-700 capitalize">{order.paymentMethod} ({order.paymentStatus})</strong>
                            {order.deliveryAddress && (
                              <span className="block text-[11px] text-slate-400 mt-0.5 truncate max-w-md">
                                📍 Ship to: {order.deliveryAddress}
                              </span>
                            )}
                            {isCancelled && order.cancelReason && (
                              <span className="block text-[11px] text-red-600 font-medium mt-0.5">
                                Reason: {order.cancelReason}
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-3 self-end sm:self-auto">
                            {canCancel && (
                              <button
                                onClick={() => setCancellingOrder(order)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded text-xs font-medium transition"
                              >
                                Cancel Order
                              </button>
                            )}

                            <div className="text-slate-900 font-bold">
                              Total Paid: <span className="text-[#F85606] font-extrabold text-sm">{formatPrice(order.totalAmount)}</span>
                            </div>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          )}

          {/* 2. My Wishlist Tab */}
          {activeTab === 'wishlist' && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-xs flex items-center justify-between">
                <h2 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                  <span>My Saved Wishlist ({wishlist.length})</span>
                </h2>
              </div>

              {wishlist.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs">
                  <Heart className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                  <h3 className="text-sm font-bold text-slate-800">Your wishlist is empty</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Click the heart icon on any product to save it for later!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {wishlist.map((item) => (
                    <div 
                      key={item.id}
                      className="bg-white rounded-2xl border border-slate-200 p-3 shadow-xs flex flex-col justify-between"
                    >
                      <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 mb-2">
                        <img src={item.images ? item.images[0] : item.image} alt={item.title} className="w-full h-full object-cover" />
                        <button
                          onClick={() => toggleWishlist(item)}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-white text-red-500 shadow hover:scale-110 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div>
                        <h4 className="text-xs font-semibold text-slate-800 line-clamp-2" title={item.title}>
                          {item.title}
                        </h4>
                        <div className="text-sm font-black text-[#F85606] mt-1">
                          {formatPrice(item.samplePrice || item.priceUSD || 20)}
                        </div>
                      </div>

                      <div className="mt-3 flex gap-1.5">
                        <button
                          onClick={() => {
                            addToCart(item, 1, 'retail');
                            alert(`Added "${item.title}" to cart!`);
                          }}
                          className="flex-1 bg-[#F85606] hover:bg-[#e04e05] text-white font-bold text-xs py-2 rounded-lg transition flex items-center justify-center gap-1 shadow-xs"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. Saved Addresses Tab */}
          {activeTab === 'addresses' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Delivery Address Book</h3>
                  <p className="text-xs text-slate-500">Manage your shipping destinations across Nepal</p>
                </div>
                <button 
                  onClick={() => setIsEditingAddress(!isEditingAddress)}
                  className="bg-[#F85606] hover:bg-[#e04e05] text-white text-xs font-bold px-3 py-1.5 rounded-lg transition"
                >
                  {isEditingAddress ? 'Cancel' : 'Edit Primary Address'}
                </button>
              </div>

              {isEditingAddress ? (
                <div className="p-4 rounded-xl border border-orange-300 bg-orange-50/30 space-y-3 text-xs">
                  <label className="font-bold text-slate-800 block">Primary Street Address & Ward</label>
                  <input
                    type="text"
                    value={newAddressInput}
                    onChange={(e) => setNewAddressInput(e.target.value)}
                    placeholder="e.g. New Road Gate, Ward #22, Kathmandu Valley"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setIsEditingAddress(false)}
                      className="px-3 py-1.5 border border-slate-300 rounded-lg font-semibold text-slate-600"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveAddress}
                      className="px-4 py-1.5 bg-[#F85606] text-white font-bold rounded-lg hover:bg-[#e04e05]"
                    >
                      Save Address
                    </button>
                  </div>
                </div>
              ) : user?.address ? (
                <div className="p-4 rounded-xl border-2 border-orange-400 bg-orange-50/40 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{user?.name || "Bhanjo Customer"} (Primary Delivery Address)</span>
                    <span className="bg-[#F85606] text-white text-[9px] font-bold px-2 py-0.5 rounded">Default</span>
                  </div>
                  <div className="text-slate-700">📍 {user.address}</div>
                  <div className="text-slate-500">Phone: {user?.phone ? `+977 ${user.phone}` : 'N/A'}</div>
                  <div className="text-slate-500">Region: {user?.city || "Kathmandu"}, {user?.province || "Bagmati Province"} {user?.postal_code ? `(Postal: ${user.postal_code})` : ''}</div>
                </div>
              ) : (
                <div className="p-6 rounded-xl border-2 border-dashed border-slate-200 text-center space-y-2">
                  <MapPin className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="font-bold text-slate-700 text-sm">No Delivery Address Saved Yet</p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Add your delivery street address, city, and province to speed up your doorstep deliveries.
                  </p>
                  <button
                    onClick={() => setIsEditingAddress(true)}
                    className="px-4 py-2 bg-[#F85606] text-white font-bold rounded-xl text-xs hover:bg-[#e04e05] cursor-pointer inline-flex items-center gap-1.5 mt-2"
                  >
                    <span>+ Add Delivery Address</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 4. Complete Customer Profile & Account Settings */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-5 animate-in fade-in duration-150">
              
              {/* Profile Card Header */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                    <User className="w-4 h-4 text-[#F85606]" />
                    <span>My Customer Profile & Settings</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Update your photo, delivery destination, postal code, phone number, and security password.
                  </p>
                </div>

                {onBackToMarketplace && (
                  <button
                    type="button"
                    onClick={onBackToMarketplace}
                    className="text-xs font-semibold text-slate-600 hover:text-[#F85606] transition flex items-center gap-1 cursor-pointer"
                  >
                    <span>← Back to Shopping</span>
                  </button>
                )}
              </div>

              {/* Status Alert Messages */}
              {profileSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{profileSuccess}</span>
                </div>
              )}

              {profileError && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <span>{profileError}</span>
                </div>
              )}

              {/* SECTION 1: Profile Photo Upload */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">
                  1. Profile Photo & Avatar
                </h4>

                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  {/* Photo Display with overlay */}
                  <div className="relative group flex-shrink-0">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-orange-100 shadow-md bg-gradient-to-tr from-orange-400 to-[#F85606] flex items-center justify-center text-white text-3xl font-black">
                      {profileForm.avatar ? (
                        <img 
                          src={profileForm.avatar} 
                          alt="Customer Avatar" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>{profileForm.name ? profileForm.name[0].toUpperCase() : 'U'}</span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => avatarInputRef.current?.click()}
                      className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-slate-900 hover:bg-[#F85606] text-white flex items-center justify-center shadow-lg transition cursor-pointer border-2 border-white"
                      title="Upload new photo"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Hidden Input File */}
                  <input
                    type="file"
                    ref={avatarInputRef}
                    onChange={handleAvatarFileChange}
                    accept="image/*"
                    className="hidden"
                  />

                  {/* Actions & Explanations */}
                  <div className="space-y-2 text-center sm:text-left flex-1">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <button
                        type="button"
                        onClick={() => avatarInputRef.current?.click()}
                        className="px-3.5 py-1.5 bg-[#F85606] hover:bg-[#e04e05] text-white font-bold rounded-lg text-xs transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload New Photo</span>
                      </button>

                      {profileForm.avatar && (
                        <button
                          type="button"
                          onClick={handleRemoveAvatar}
                          className="px-3 py-1.5 border border-slate-200 text-slate-600 hover:text-red-600 hover:border-red-200 rounded-lg text-xs transition cursor-pointer"
                        >
                          Remove Photo
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Supports JPG, PNG, or WebP (max 2MB). Your photo will appear in your orders, reviews, and header navigation.
                    </p>
                  </div>
                </div>
              </div>

              {/* SECTION 2: Personal Identification */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                  2. Personal Identification
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Full Legal Name *</label>
                    <input
                      type="text"
                      required
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      placeholder="e.g. Prashanna Ghimire"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Mobile Phone (Nepal +977) *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 font-mono text-slate-400 font-bold">+977</span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value.replace(/\D/g, '') })}
                        placeholder="98XXXXXXXX"
                        className="w-full pl-14 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:outline-none font-mono font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1 flex items-center justify-between">
                      <span>Email Address *</span>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold flex items-center gap-0.5">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        <span>Verified Account</span>
                      </span>
                    </label>
                    <input
                      type="email"
                      required
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      placeholder="e.g. customer@example.com"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Gender</label>
                    <select
                      value={profileForm.gender}
                      onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:outline-none bg-white"
                    >
                      <option value="Not Specified">Prefer not to say</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Date of Birth (Optional)</span>
                    </label>
                    <input
                      type="date"
                      value={profileForm.dob}
                      onChange={(e) => setProfileForm({ ...profileForm, dob: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:outline-none bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: Primary Delivery Destination */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                    3. Primary Doorstep Delivery Destination
                  </h4>
                  <span className="text-[10px] text-slate-400">Used for fast 1-click checkout</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Province (Nepal) *</label>
                    <select
                      value={profileForm.province}
                      onChange={(e) => setProfileForm({ ...profileForm, province: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:outline-none bg-white font-medium"
                    >
                      <option value="Bagmati Province">Bagmati Province (Kathmandu, Lalitpur, Bhaktapur...)</option>
                      <option value="Gandaki Province">Gandaki Province (Pokhara, Kaski...)</option>
                      <option value="Koshi Province">Koshi Province (Biratnagar, Dharan...)</option>
                      <option value="Madhesh Province">Madhesh Province (Janakpur, Birgunj...)</option>
                      <option value="Lumbini Province">Lumbini Province (Butwal, Bhairahawa...)</option>
                      <option value="Karnali Province">Karnali Province (Surkhet, Jumla...)</option>
                      <option value="Sudurpashchim Province">Sudurpashchim Province (Dhangadhi, Mahendranagar...)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">City / Municipality *</label>
                    <input
                      type="text"
                      value={profileForm.city}
                      onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                      placeholder="e.g. Kathmandu, Pokhara, Butwal"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Postal / ZIP Code</label>
                    <input
                      type="text"
                      value={profileForm.postal_code}
                      onChange={(e) => setProfileForm({ ...profileForm, postal_code: e.target.value })}
                      placeholder="e.g. 44600"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Nearby Landmark / Chowk</label>
                    <input
                      type="text"
                      value={profileForm.landmark}
                      onChange={(e) => setProfileForm({ ...profileForm, landmark: e.target.value })}
                      placeholder="e.g. Near Bhatbhateni Supermarket, New Road Gate"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-semibold text-slate-700 block mb-1">Doorstep Street Address / Ward / House #</label>
                    <input
                      type="text"
                      value={profileForm.address}
                      onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                      placeholder="e.g. Ward #10, Baneshwor Height, House #42"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 4: Password & Security */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-500" />
                    <span>4. Change Password & Security</span>
                  </h4>
                  <span className="text-[10px] text-slate-400">Leave blank if keeping existing password</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Current Password</label>
                    <div className="relative">
                      <input
                        type={showCurrentPw ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-3 pr-8 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:outline-none font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPw(!showCurrentPw)}
                        className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showCurrentPw ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">New Password</label>
                    <div className="relative">
                      <input
                        type={showNewPw ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Min 6 characters"
                        className="w-full pl-3 pr-8 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:outline-none font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPw(!showNewPw)}
                        className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showNewPw ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Confirm New Password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPw ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Repeat new password"
                        className="w-full pl-3 pr-8 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:outline-none font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPw(!showConfirmPw)}
                        className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showConfirmPw ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 5: Notification Preferences */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-slate-500" />
                  <span>5. Order & Delivery Alerts</span>
                </h4>

                <div className="space-y-2 text-xs">
                  <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={smsAlerts}
                      onChange={(e) => setSmsAlerts(e.target.checked)}
                      className="w-4 h-4 text-[#F85606] rounded border-slate-300 focus:ring-orange-500"
                    />
                    <span>Receive instant SMS alerts when parcel is dispatched or out for delivery</span>
                  </label>

                  <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={emailAlerts}
                      onChange={(e) => setEmailAlerts(e.target.checked)}
                      className="w-4 h-4 text-[#F85606] rounded border-slate-300 focus:ring-orange-500"
                    />
                    <span>Receive official digital tax invoice and email tracking receipts from <strong>bhanjonepal@gmail.com</strong></span>
                  </label>
                </div>
              </div>

              {/* Form Action Controls */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs text-slate-500">
                  All updates are instantly saved and synchronized across your account.
                </span>

                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#F85606] hover:bg-[#e04e05] text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {isSavingProfile ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Saving Profile to Database...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Save & Update Profile</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

        </div>

      </div>

      {/* Tax Invoice Modal */}
      {selectedInvoiceOrder && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 relative">
            <button
              onClick={() => setSelectedInvoiceOrder(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Official Header */}
            <div className="border-b-2 border-slate-900 pb-4 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 bg-[#F85606] text-white font-black rounded flex items-center justify-center text-sm">B</span>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">BHANJO.COM</h2>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Bhanjo E-Commerce & Sourcing Pvt. Ltd. • PAN: 601294812
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Tripureshwor Trade Center, Kathmandu, Nepal
                  </p>
                </div>
                <div className="text-right">
                  <span className="bg-slate-900 text-white font-mono text-xs px-2.5 py-1 rounded font-bold inline-block mb-1">
                    TAX INVOICE
                  </span>
                  <p className="text-xs text-slate-600 font-mono">Invoice #{selectedInvoiceOrder.id}</p>
                  <p className="text-[11px] text-slate-500">Date: {selectedInvoiceOrder.date}</p>
                </div>
              </div>
            </div>

            {/* Billed To */}
            <div className="grid grid-cols-2 gap-4 text-xs mb-4 p-3 bg-slate-50 rounded-xl">
              <div>
                <span className="text-slate-400 font-bold block mb-0.5 uppercase text-[10px]">Billed To:</span>
                <p className="font-bold text-slate-800">{user?.name || "Bhanjo Customer"}</p>
                <p className="text-slate-600">{selectedInvoiceOrder.deliveryAddress || user?.address || "Kathmandu, Nepal"}</p>
                <p className="text-slate-500">Phone: {user?.phone || "+977-98XXXXXXXX"}</p>
              </div>
              <div className="text-right">
                <span className="text-slate-400 font-bold block mb-0.5 uppercase text-[10px]">Payment & Tracking:</span>
                <p className="font-semibold text-slate-800">{selectedInvoiceOrder.paymentMethod} (Paid)</p>
                <p className="font-mono text-[#F85606] font-bold mt-0.5">{selectedInvoiceOrder.trackingNumber}</p>
                <p className="text-slate-500">Courier: Bhanjo Express</p>
              </div>
            </div>

            {/* Items Table */}
            <table className="w-full text-xs mb-4">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px]">
                  <th className="py-2 text-left">Item Description</th>
                  <th className="py-2 text-center">Qty</th>
                  <th className="py-2 text-right">Unit Price</th>
                  <th className="py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {selectedInvoiceOrder.items?.map((it, idx) => {
                  const unitPrice = it.unitPriceUSD || 15;
                  const qty = it.quantity || 1;
                  return (
                    <tr key={idx} className="py-2">
                      <td className="py-2 text-slate-800 font-medium">{it.title || 'Product'}</td>
                      <td className="py-2 text-center text-slate-600">{qty}</td>
                      <td className="py-2 text-right text-slate-600">{formatPrice(unitPrice)}</td>
                      <td className="py-2 text-right font-bold text-slate-900">{formatPrice(unitPrice * qty)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Total Calculation */}
            <div className="border-t border-slate-200 pt-3 space-y-1.5 text-xs text-right">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span>{formatPrice(selectedInvoiceOrder.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Nepal VAT (13% Included):</span>
                <span>{formatPrice(selectedInvoiceOrder.totalAmount * 0.13 / 1.13)}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>Grand Total:</span>
                <span className="text-[#F85606]">{formatPrice(selectedInvoiceOrder.totalAmount)}</span>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-200">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>IRN & VAT Registered Document</span>
              </div>
              <button
                onClick={() => window.print()}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Tax Invoice</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Order Confirmation Modal */}
      {cancellingOrder && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-5 relative">
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">Cancel Order #{cancellingOrder.id}?</h3>
                <p className="text-xs text-slate-500">Tracking: {cancellingOrder.trackingNumber}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-3">
              Are you sure you want to cancel this order? If you have already paid via eSewa, Khalti, or card, the full refund will be processed back to your original payment method.
            </p>

            <div className="mb-4">
              <label className="text-xs font-bold text-slate-700 block mb-1">Reason for Cancellation</label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              >
                <option value="Found cheaper alternative">Found cheaper alternative</option>
                <option value="Change of delivery address">Change of delivery address</option>
                <option value="Ordered by mistake">Ordered by mistake</option>
                <option value="Delivery time is too long">Delivery time is too long</option>
                <option value="Other reason">Other reason</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 text-xs">
              <button
                onClick={() => setCancellingOrder(null)}
                className="px-4 py-2 border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition"
              >
                Keep Order
              </button>
              <button
                onClick={handleConfirmCancelOrder}
                disabled={isCancelling}
                className="px-4 py-2 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition disabled:opacity-50"
              >
                {isCancelling ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
