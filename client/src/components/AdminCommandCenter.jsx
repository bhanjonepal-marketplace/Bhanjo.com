import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Package, ShoppingCart, DollarSign, Plus, 
  Search, Filter, CheckCircle2, AlertCircle, Clock, Truck, 
  Printer, BarChart3, Star, Layers, ArrowUpRight, 
  Trash2, Edit3, Upload, FileSpreadsheet, RefreshCw, ArrowLeft,
  MessageSquare, Check, LogOut, Eye, Zap, Store, Users, ExternalLink,
  Calculator, TrendingUp, Sparkles, Globe
} from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { CATEGORIES } from '../data/categories';
import { useCurrency } from '../context/CurrencyContext';
import { useAuth } from '../context/AuthContext';
import { AlibabaImporterModal } from './AlibabaImporterModal';
import { ProductEditModal } from './ProductEditModal';
import confetti from 'canvas-confetti';

export const AdminCommandCenter = ({ onBackToStore, onSelectProduct }) => {
  const { currentCurrency, formatPrice } = useCurrency();
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'inventory', 'sourcing', 'sellers', 'inquiries'
  const [productList, setProductList] = useState(PRODUCTS);
  const [orders, setOrders] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [sellers, setSellers] = useState([]);
  
  // Importer Modal State
  const [isAlibabaModalOpen, setIsAlibabaModalOpen] = useState(false);
  const [importerPlatform, setImporterPlatform] = useState('1688');
  
  // Edit Product Modal State
  const [editingProduct, setEditingProduct] = useState(null);

  // Filters & Search
  const [orderFilter, setOrderFilter] = useState('all');
  const [inventorySearch, setInventorySearch] = useState('');
  const [inventoryCategory, setInventoryCategory] = useState('all');

  // Add Product Form State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newNepaliTitle, setNewNepaliTitle] = useState('');
  const [newCategory, setNewCategory] = useState(CATEGORIES[0]?.id || 'consumer-electronics');
  const [newPriceNPR, setNewPriceNPR] = useState('2500');
  const [newStock, setNewStock] = useState('100');
  const [newImage, setNewImage] = useState('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80');

  // Wholesale Sourcing Profit & Landed Cost Calculator State
  const [calcPlatform, setCalcPlatform] = useState('1688'); // '1688' | 'alibaba'
  const [calcCost, setCalcCost] = useState('15'); // 15 RMB or USD
  const [calcShipping, setCalcShipping] = useState('250'); // NPR
  const [calcDuty, setCalcDuty] = useState('15'); // %
  const [calcSelling, setCalcSelling] = useState('1250'); // NPR

  // Toast feedback
  const [bannerMessage, setBannerMessage] = useState('');

  const showBanner = (msg) => {
    setBannerMessage(msg);
    setTimeout(() => setBannerMessage(''), 4000);
  };

  // 1. Fetch Orders from Backend
  const fetchOrders = () => {
    fetch('/api/orders')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.orders) {
          setOrders(data.orders);
        }
      })
      .catch(e => console.log('Orders load error:', e));
  };

  // 2. Fetch Catalog Products from Backend
  const fetchProducts = () => {
    fetch('/api/products?page=1&limit=200')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.products) {
          setProductList(data.products);
        }
      })
      .catch(e => console.log('Products load error:', e));
  };

  // 3. Fetch Inquiries & Sellers
  const fetchInquiriesAndSellers = () => {
    fetch('/api/inquiries')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.inquiries) {
          setInquiries(data.inquiries);
        }
      })
      .catch(e => console.log('Inquiries load error:', e));

    fetch('/api/sellers')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.sellers) {
          setSellers(data.sellers);
        }
      })
      .catch(e => console.log('Sellers load error:', e));
  };

  useEffect(() => {
    fetchOrders();
    fetchProducts();
    fetchInquiriesAndSellers();
  }, []);

  // Update Order Status
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, order_status: newStatus } : o));
        showBanner(`Order ${orderId} updated to "${newStatus}"!`);
      }
    } catch (e) {
      console.log('Order status update error:', e);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (productId, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this product from Bhanjo catalog?")) return;

    try {
      const res = await fetch(`/api/products/${productId}`, { method: 'DELETE' });
      if (res.ok) {
        setProductList(prev => prev.filter(p => p.id !== productId));
        showBanner("Product removed successfully from catalog!");
      }
    } catch (e) {
      console.log('Delete product error:', e);
    }
  };

  // Create Product
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const catObj = CATEGORIES.find(c => c.id === newCategory) || CATEGORIES[0];
    const priceUSD = parseFloat(newPriceNPR) / 133.5;

    const newProd = {
      id: `prod-admin-${Date.now().toString().slice(-5)}`,
      title: newTitle,
      nepaliTitle: newNepaliTitle || newTitle,
      categoryId: newCategory,
      categoryName: catObj.name,
      supplierId: "sup-bhanjo-official",
      supplierName: "Bhanjo Official Store Nepal",
      supplierCountry: "Nepal",
      supplierFlag: "🇳🇵",
      samplePrice: priceUSD,
      rating: 5.0,
      reviewsCount: 1,
      moq: 1,
      images: [newImage],
      description: "Authentic item verified by Bhanjo Master Admin. Shipped nationwide across Nepal.",
      featured: true
    };

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProd)
      });
      if (res.ok) {
        setProductList(prev => [newProd, ...prev]);
        setIsAddModalOpen(false);
        setNewTitle('');
        setNewNepaliTitle('');
        confetti({ particleCount: 70, spread: 60 });
        showBanner(`Product "${newProd.title}" published to Bhanjo.com!`);
      }
    } catch (e) {
      console.log('Add product error:', e);
    }
  };

  // Open Importer
  const handleOpenImporter = (platform = '1688') => {
    setImporterPlatform(platform);
    setIsAlibabaModalOpen(true);
  };

  // Filtered Orders
  const filteredOrders = orders.filter(o => {
    if (orderFilter === 'all') return true;
    return (o.order_status || '').toLowerCase() === orderFilter.toLowerCase();
  });

  // Filtered Inventory
  const filteredProducts = productList.filter(p => {
    const matchesCat = inventoryCategory === 'all' || p.categoryId === inventoryCategory;
    const matchesSearch = !inventorySearch || 
      (p.title || '').toLowerCase().includes(inventorySearch.toLowerCase()) ||
      (p.nepaliTitle || '').includes(inventorySearch);
    return matchesCat && matchesSearch;
  });

  // Calculate High-Level Metrics
  const totalRevenueNPR = orders.reduce((sum, o) => sum + (parseFloat(o.total_amount) || 0), 0);
  const pendingOrdersCount = orders.filter(o => (o.order_status || 'Processing') === 'Processing').length;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      
      {/* 1. Master Command Center Top Bar */}
      <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-50 px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Left: Branding & Clearance Badge */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#F85606] to-amber-500 flex items-center justify-center shadow-md">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-base tracking-tight text-white">BHANJO.COM</span>
                <span className="bg-orange-950 text-orange-400 border border-orange-700/50 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                  Master Admin • Level 5
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Logged in: <strong className="text-slate-200">Prashanna Ghimire</strong> ({user?.email || 'prashannaghim@gmail.com'})
              </p>
            </div>
          </div>

          {/* Right: Quick Action Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => handleOpenImporter('1688')}
              className="bg-red-600/90 hover:bg-red-600 text-white font-bold text-xs px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>🏭 1688 China Factory</span>
            </button>

            <button
              onClick={() => handleOpenImporter('alibaba')}
              className="bg-[#FF6A00] hover:bg-[#E05E00] text-white font-bold text-xs px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Zap className="w-3.5 h-3.5 fill-white" />
              <span>Alibaba Global</span>
            </button>

            <button
              onClick={onBackToStore}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
              title="Preview Bhanjo.com as a regular shopper"
            >
              <Eye className="w-3.5 h-3.5 text-emerald-400" />
              <span>View Live Store</span>
            </button>

            <button
              onClick={() => {
                logout();
                if (onBackToStore) onBackToStore();
              }}
              className="bg-red-950/60 hover:bg-red-900/60 text-red-300 border border-red-800/60 font-semibold text-xs px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
              title="Lock Admin and Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit Admin</span>
            </button>
          </div>

        </div>
      </header>

      {/* Feedback Alert Banner */}
      {bannerMessage && (
        <div className="bg-emerald-950 border-b border-emerald-800 text-emerald-200 text-xs px-4 py-2.5 text-center font-bold animate-in fade-in">
          {bannerMessage}
        </div>
      )}

      {/* 2. Main Command Body */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-6 flex-1">
        
        {/* Metric Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Orders Placed</span>
              <ShoppingCart className="w-4 h-4 text-orange-400" />
            </div>
            <div className="text-2xl font-black text-white">{orders.length}</div>
            <div className="text-[11px] text-amber-400 font-semibold mt-1">
              {pendingOrdersCount} awaiting dispatch
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Gross Order Value</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-white">
              Rs. {Math.round(totalRevenueNPR * 133.5).toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Verified checkout volume</div>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Catalog Products</span>
              <Package className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-black text-white">{productList.length}</div>
            <div className="text-[11px] text-slate-400 mt-1">Across 38 Daraz sectors</div>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Cloud Security</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-sm font-black text-emerald-400 flex items-center gap-1.5 mt-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>PostgreSQL & Dual-2FA</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">AWS Singapore (Active)</div>
          </div>
        </div>

        {/* 3. Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 mb-6 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 text-xs font-bold rounded-xl transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'orders' 
                ? 'bg-orange-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Orders & Dispatch ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2.5 text-xs font-bold rounded-xl transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'inventory' 
                ? 'bg-orange-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Catalog & Pricing ({productList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('sellers')}
            className={`px-4 py-2.5 text-xs font-bold rounded-xl transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'sellers' 
                ? 'bg-orange-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Seller Applications ({sellers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`px-4 py-2.5 text-xs font-bold rounded-xl transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'inquiries' 
                ? 'bg-orange-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>B2B Wholesale Inquiries ({inquiries.length})</span>
          </button>

          <button
            id="admin-tab-sourcing"
            onClick={() => setActiveTab('sourcing')}
            className={`px-4 py-2.5 text-xs font-bold rounded-xl transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'sourcing' 
                ? 'bg-red-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>🇨🇳 1688 & Alibaba Sourcing ({productList.filter(p => p.is1688Import || p.isAlibabaImport || p.id?.startsWith('1688-') || p.id?.startsWith('ali-')).length})</span>
          </button>
        </div>

        {/* TAB 1: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            
            {/* Filter bar */}
            <div className="flex items-center justify-between gap-3 flex-wrap bg-slate-950 p-3 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                {['all', 'Processing', 'Packaging', 'Handed to Bhanjo Express Hub', 'Out for Delivery', 'Delivered', 'Cancelled'].map(status => (
                  <button
                    key={status}
                    onClick={() => setOrderFilter(status)}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer capitalize text-[11px] ${
                      orderFilter === status
                        ? 'bg-orange-600 text-white'
                        : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    {status === 'all' ? 'All Orders' : status}
                  </button>
                ))}
              </div>

              <button
                onClick={fetchOrders}
                className="text-slate-400 hover:text-white text-xs flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh</span>
              </button>
            </div>

            {/* Orders Table / Cards */}
            {filteredOrders.length === 0 ? (
              <div className="text-center py-16 bg-slate-950 rounded-2xl border border-slate-800 text-slate-500">
                <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-30 text-orange-500" />
                <h3 className="font-bold text-slate-300">No orders found</h3>
                <p className="text-xs text-slate-500 mt-1">Orders placed by customers will appear here in real time.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredOrders.map(order => {
                  let items = [];
                  try {
                    items = typeof order.items_json === 'string' ? JSON.parse(order.items_json) : (order.items || []);
                  } catch (e) {
                    items = [];
                  }

                  return (
                    <div 
                      key={order.id}
                      className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5 hover:border-slate-700 transition"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-amber-400 text-sm">
                              {order.tracking_number || order.trackingNumber || order.id}
                            </span>
                            <span className="text-[10px] bg-slate-900 text-slate-400 px-2 py-0.5 rounded border border-slate-800">
                              {order.created_at ? order.created_at.slice(0, 16) : 'Recently Placed'}
                            </span>
                          </div>
                          <div className="text-xs text-slate-300 mt-1">
                            Customer: <strong>{order.customer_name || 'Customer'}</strong> • Tel: {order.customer_phone || 'N/A'}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Delivery: {order.customer_address || 'Kathmandu, Nepal'}
                          </div>
                        </div>

                        {/* Status Changer */}
                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <label className="text-xs text-slate-400 font-semibold">Status:</label>
                          <select
                            value={order.order_status || 'Processing'}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                            className="bg-slate-900 border border-slate-700 text-xs font-bold text-white rounded-lg px-3 py-1.5 outline-none focus:border-orange-500 cursor-pointer"
                          >
                            <option value="Processing">Processing</option>
                            <option value="Merchant Packaging & Quality Check">Packaging & QA</option>
                            <option value="Handed to Bhanjo Express Hub">Handed to Express Hub</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>

                      {/* Items Row */}
                      <div className="pt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="text-xs text-slate-400">
                          <span className="font-bold text-slate-200">
                            {items.length > 0 ? items.map(i => `${i.title || 'Product'} (x${i.quantity || 1})`).join(', ') : 'Catalog Product'}
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="text-xs text-slate-400 block">Total Amount</span>
                          <span className="font-mono font-black text-sm text-emerald-400">
                            Rs. {Math.round((order.total_amount || 0) * 133.5).toLocaleString()}
                          </span>
                          <span className="text-[10px] text-slate-500 block uppercase">
                            {order.payment_method || 'eSewa'} ({order.payment_status || 'Paid'})
                          </span>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* TAB 2: CATALOG & PRICING INVENTORY */}
        {activeTab === 'inventory' && (
          <div className="space-y-4">
            
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-72">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={inventorySearch}
                    onChange={(e) => setInventorySearch(e.target.value)}
                    placeholder="Search catalog products..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white outline-none focus:border-orange-500"
                  />
                </div>

                <select
                  value={inventoryCategory}
                  onChange={(e) => setInventoryCategory(e.target.value)}
                  className="bg-slate-900 border border-slate-800 text-xs text-white rounded-xl px-3 py-2 outline-none focus:border-orange-500"
                >
                  <option value="all">All Categories</option>
                  {CATEGORIES.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Product</span>
                </button>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredProducts.slice(0, 60).map(product => {
                const priceNPR = Math.round((product.samplePrice || 20) * 133.5);

                return (
                  <div 
                    key={product.id}
                    className="bg-slate-950 border border-slate-800 rounded-2xl p-3 flex gap-3 items-center hover:border-slate-700 transition"
                  >
                    <img 
                      src={product.images?.[0] || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=150&q=80'} 
                      alt={product.title}
                      className="w-16 h-16 rounded-xl object-cover bg-slate-900 flex-shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white truncate" title={product.title}>
                        {product.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate">
                        {product.categoryName || 'Bhanjo Sector'}
                      </p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-mono font-black text-sm text-[#F85606]">
                          Rs. {priceNPR.toLocaleString()}
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setEditingProduct(product)}
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition"
                            title="Edit Price & Details"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={(e) => handleDeleteProduct(product.id, e)}
                            className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-400 hover:text-red-200 transition"
                            title="Remove Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* TAB 3: SELLER CENTRAL APPLICATIONS */}
        {activeTab === 'sellers' && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
            <h3 className="font-bold text-base text-white mb-2 flex items-center gap-2">
              <Store className="w-5 h-5 text-orange-400" />
              <span>Registered Nepali Merchant Stores</span>
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Review and manage verified Nepali merchants on Bhanjo.com.
            </p>

            {sellers.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No new seller applications pending.
              </div>
            ) : (
              <div className="space-y-3">
                {sellers.map(s => (
                  <div key={s.id} className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-white">{s.store_name}</h4>
                      <p className="text-xs text-slate-400">{s.seller_name} • {s.city} • Tel: {s.phone}</p>
                    </div>
                    <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 px-2.5 py-1 rounded-full text-xs font-bold">
                      {s.status || 'Active'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: WHOLESALE INQUIRIES */}
        {activeTab === 'inquiries' && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
            <h3 className="font-bold text-base text-white mb-2 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-400" />
              <span>Customer & B2B Wholesale Inquiries</span>
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Direct inquiries and price requests sent by shoppers across Nepal.
            </p>

            {inquiries.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No pending customer inquiries.
              </div>
            ) : (
              <div className="space-y-3">
                {inquiries.map(inq => (
                  <div key={inq.id} className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                      <strong className="text-white">{inq.customer_name || 'Buyer'}</strong>
                      <span>{inq.created_at ? inq.created_at.slice(0, 16) : 'Recently'}</span>
                    </div>
                    <p className="text-xs text-slate-300">{inq.message}</p>
                    <div className="text-[11px] text-slate-500 mt-2">
                      Tel: {inq.phone} • Product: {inq.product_title || 'General Inquiry'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: DEDICATED 1688 & ALIBABA FACTORY SOURCING SUITE (STRICTLY PRIVATE TO MASTER ADMIN) */}
        {activeTab === 'sourcing' && (
          <div className="space-y-6">
            
            {/* Private Protocol Clearance Notice */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-red-900/60 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-950/80 border border-red-700/60 flex items-center justify-center text-red-400 flex-shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm text-white">Private Factory Wholesale Sourcing Hub</h3>
                    <span className="bg-red-900/80 text-red-200 text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-red-700/60">
                      Confidential Level 5
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    1688 and Alibaba factory direct sourcing, wholesale RMB cost models, and manufacturer margins are strictly restricted to this Admin Command Center. Public visitors and standard customer/seller logins will never see these tools.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => handleOpenImporter('1688')}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer"
                >
                  <span>🏭 Open 1688 Importer</span>
                </button>
                <button
                  onClick={() => handleOpenImporter('alibaba')}
                  className="bg-[#FF6A00] hover:bg-[#E05E00] text-white text-xs font-bold px-3.5 py-2 rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 fill-white" />
                  <span>Open Alibaba Importer</span>
                </button>
              </div>
            </div>

            {/* Launchers & Live Exchange Rates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* 1688 Factory Sourcing Card */}
              <div className="bg-slate-950 rounded-2xl border border-red-900/40 p-5 shadow-sm flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-2xl pointer-events-none" />
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-red-950 text-red-400 border border-red-800 text-[10px] font-black uppercase px-2 py-0.5 rounded-md flex items-center gap-1">
                      <span>🇨🇳 CHINA DOMESTIC WHOLESALE</span>
                    </span>
                    <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>1 RMB ≈ Rs. 18.46 NPR</span>
                    </span>
                  </div>
                  <h4 className="text-base font-extrabold text-white">1688.com Factory Direct Sourcing</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Source directly from tier-1 Chinese manufacturers in Guangdong, Zhejiang, and Hebei at raw factory pricing in RMB (¥). Bypass domestic Chinese login wall and import SKUs with high-res photography.
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-900 flex items-center justify-between">
                  <div className="text-[11px] text-slate-400">
                    Imported 1688 SKUs: <strong className="text-white font-mono">{productList.filter(p => p.is1688Import || p.id?.startsWith('1688-')).length}</strong>
                  </div>
                  <button
                    onClick={() => handleOpenImporter('1688')}
                    className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Launch 1688 Suite</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Alibaba Global Direct Sourcing Card */}
              <div className="bg-slate-950 rounded-2xl border border-orange-900/40 p-5 shadow-sm flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/10 rounded-full blur-2xl pointer-events-none" />
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-orange-950 text-orange-400 border border-orange-800 text-[10px] font-black uppercase px-2 py-0.5 rounded-md flex items-center gap-1">
                      <span>🌐 GLOBAL EXPORT MANUFACTURERS</span>
                    </span>
                    <span className="text-xs font-mono text-amber-400 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                      <span>1 USD ≈ Rs. 133.50 NPR</span>
                    </span>
                  </div>
                  <h4 className="text-base font-extrabold text-white">Alibaba.com Global Direct Sourcing</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Source export-grade certified products with CE/RoHS/ISO verification. Direct FOB/DDP sea and air freight pricing in USD ($) ready for import into Nepal.
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-900 flex items-center justify-between">
                  <div className="text-[11px] text-slate-400">
                    Imported Alibaba SKUs: <strong className="text-white font-mono">{productList.filter(p => p.isAlibabaImport || p.id?.startsWith('ali-')).length}</strong>
                  </div>
                  <button
                    onClick={() => handleOpenImporter('alibaba')}
                    className="bg-[#FF6A00] hover:bg-[#E05E00] text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Launch Alibaba Suite</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>

            {/* Interactive Landed Cost & Profit Margin Calculator */}
            {(() => {
              const rate = calcPlatform === '1688' ? 18.46 : 133.50;
              const baseCostNPR = (parseFloat(calcCost) || 0) * rate;
              const dutyNPR = baseCostNPR * ((parseFloat(calcDuty) || 0) / 100);
              const shippingNPR = parseFloat(calcShipping) || 0;
              const totalLandedNPR = baseCostNPR + dutyNPR + shippingNPR;
              const sellingNPR = parseFloat(calcSelling) || 0;
              const netProfitNPR = sellingNPR - totalLandedNPR;
              const marginPercent = sellingNPR > 0 ? Math.round((netProfitNPR / sellingNPR) * 100) : 0;

              return (
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-sm">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-800 mb-4">
                    <div className="flex items-center gap-2">
                      <Calculator className="w-5 h-5 text-amber-400" />
                      <h4 className="font-extrabold text-sm text-white">
                        Landed Cost & Profit Margin Simulator
                      </h4>
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
                      <button
                        onClick={() => setCalcPlatform('1688')}
                        className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${calcPlatform === '1688' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'}`}
                      >
                        1688 (RMB ¥)
                      </button>
                      <button
                        onClick={() => setCalcPlatform('alibaba')}
                        className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${calcPlatform === 'alibaba' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'}`}
                      >
                        Alibaba (USD $)
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4">
                    <div>
                      <label className="block text-slate-400 mb-1 font-semibold">
                        Factory Unit Price ({calcPlatform === '1688' ? '¥ RMB' : '$ USD'})
                      </label>
                      <input
                        type="number"
                        value={calcCost}
                        onChange={(e) => setCalcCost(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono outline-none focus:border-orange-500"
                        placeholder="15"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1 font-semibold">
                        Air/Sea Cargo (NPR/unit)
                      </label>
                      <input
                        type="number"
                        value={calcShipping}
                        onChange={(e) => setCalcShipping(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono outline-none focus:border-orange-500"
                        placeholder="250"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1 font-semibold">
                        Customs Duty / VAT (%)
                      </label>
                      <input
                        type="number"
                        value={calcDuty}
                        onChange={(e) => setCalcDuty(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono outline-none focus:border-orange-500"
                        placeholder="15"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1 font-semibold">
                        Target Selling Price (NPR)
                      </label>
                      <input
                        type="number"
                        value={calcSelling}
                        onChange={(e) => setCalcSelling(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono outline-none focus:border-orange-500 font-bold text-amber-400"
                        placeholder="1250"
                      />
                    </div>
                  </div>

                  {/* Simulator Output Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-900">
                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Base Factory Cost (NPR)</span>
                      <span className="text-base font-extrabold text-white font-mono mt-0.5 block">
                        Rs. {Math.round(baseCostNPR).toLocaleString()}
                      </span>
                    </div>

                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Total Landed Cost in Nepal</span>
                      <span className="text-base font-extrabold text-orange-400 font-mono mt-0.5 block">
                        Rs. {Math.round(totalLandedNPR).toLocaleString()}
                      </span>
                    </div>

                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Net Profit / Unit</span>
                      <span className={`text-base font-extrabold font-mono mt-0.5 block ${netProfitNPR >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        Rs. {Math.round(netProfitNPR).toLocaleString()}
                      </span>
                    </div>

                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Target Profit Margin</span>
                      <span className={`text-base font-extrabold font-mono mt-0.5 block ${marginPercent >= 40 ? 'text-emerald-400' : marginPercent > 0 ? 'text-amber-400' : 'text-red-400'}`}>
                        {marginPercent}% {marginPercent >= 50 ? '🔥 High Return' : ''}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Imported Sourced Products Matrix */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-extrabold text-sm text-white">
                    Directly Sourced SKUs in Bhanjo Catalog ({productList.filter(p => p.is1688Import || p.isAlibabaImport || p.id?.startsWith('1688-') || p.id?.startsWith('ali-')).length})
                  </h4>
                  <p className="text-xs text-slate-400">
                    Live products currently stocked from Chinese and global manufacturing lines.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                      <th className="py-2.5 px-3">Product</th>
                      <th className="py-2.5 px-2">Wholesale Source</th>
                      <th className="py-2.5 px-2">Selling Price (NPR)</th>
                      <th className="py-2.5 px-2">Supplier Factory</th>
                      <th className="py-2.5 px-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {productList
                      .filter(p => p.is1688Import || p.isAlibabaImport || p.id?.startsWith('1688-') || p.id?.startsWith('ali-'))
                      .slice(0, 15)
                      .map((prod) => (
                        <tr key={prod.id} className="hover:bg-slate-900/60 transition">
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={prod.images?.[0] || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=100'}
                                alt={prod.title}
                                className="w-9 h-9 rounded-lg object-cover bg-slate-800 flex-shrink-0"
                              />
                              <div className="max-w-xs">
                                <span className="font-semibold text-slate-200 line-clamp-1 block">{prod.title}</span>
                                <span className="text-[10px] text-slate-500 font-mono">{prod.id}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-2.5 px-2">
                            {prod.is1688Import || prod.id?.startsWith('1688-') ? (
                              <span className="bg-red-950 text-red-300 border border-red-800/80 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                🇨🇳 1688 Factory
                              </span>
                            ) : (
                              <span className="bg-orange-950 text-orange-300 border border-orange-800/80 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                ⚡ Alibaba Direct
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-2 font-mono font-bold text-slate-200">
                            {formatPrice(prod.samplePrice || 25)}
                          </td>
                          <td className="py-2.5 px-2 text-slate-400 max-w-[180px] truncate">
                            {prod.supplierName || 'Verified Factory'}
                          </td>
                          <td className="py-2.5 px-2 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setEditingProduct(prod)}
                                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                                title="Edit Pricing"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={(e) => handleDeleteProduct(prod.id, e)}
                                className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-950/50 rounded-lg transition"
                                title="Delete SKU"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <h3 className="font-black text-base text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-orange-400" />
                <span>Add Product to Bhanjo Catalog</span>
              </h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Product Title (English)</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Authentic Himalayan Woolen Shawl"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Nepali Title (Optional)</label>
                <input
                  type="text"
                  value={newNepaliTitle}
                  onChange={(e) => setNewNepaliTitle(e.target.value)}
                  placeholder="e.g. मौलिक नेपाली पश्मिना शल"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Category Sector</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-orange-500"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Price (NPR / Rs.)</label>
                  <input
                    type="number"
                    required
                    value={newPriceNPR}
                    onChange={(e) => setNewPriceNPR(e.target.value)}
                    placeholder="2500"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-orange-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Product Image URL</label>
                <input
                  type="url"
                  required
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-orange-500 font-mono"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#F85606] hover:bg-[#e04e05] text-white font-bold"
                >
                  Publish Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      <ProductEditModal
        isOpen={!!editingProduct}
        product={editingProduct}
        onClose={() => setEditingProduct(null)}
        onProductUpdated={(updated) => {
          setProductList(prev => prev.map(p => p.id === updated.id ? updated : p));
          showBanner(`Updated price for "${updated.title}"!`);
        }}
      />

      {/* Alibaba & 1688 Factory Importer Modal */}
      <AlibabaImporterModal
        isOpen={isAlibabaModalOpen}
        defaultPlatform={importerPlatform}
        onClose={() => setIsAlibabaModalOpen(false)}
        onSelectCategory={() => {}}
        onProductImported={(importedProd) => {
          setProductList(prev => [importedProd, ...prev]);
          showBanner(`Imported "${importedProd.title.slice(0, 25)}..." to Bhanjo catalog!`);
        }}
      />

    </div>
  );
};
