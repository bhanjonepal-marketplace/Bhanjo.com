import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Package, ShoppingCart, DollarSign, Plus, 
  Search, Filter, CheckCircle2, AlertCircle, Clock, Truck, 
  Printer, BarChart3, Star, Layers, ShieldCheck, ArrowUpRight, 
  Trash2, Edit3, Upload, FileSpreadsheet, RefreshCw, ArrowLeft,
  MessageSquare, Check
} from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { CATEGORIES } from '../data/categories';
import { useCurrency } from '../context/CurrencyContext';
import { AlibabaImporterModal } from './AlibabaImporterModal';
import confetti from 'canvas-confetti';

export const SellerCentralDashboard = ({ onProductAdded, onBackToMarketplace, onDeleteProduct, onEditProduct }) => {
  const { formatPrice, currentCurrency } = useCurrency();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'inventory', 'inquiries'
  const [productList, setProductList] = useState(PRODUCTS);
  const [inquiries, setInquiries] = useState([]);
  const [isAlibabaModalOpen, setIsAlibabaModalOpen] = useState(false);
  const [importerPlatform, setImporterPlatform] = useState('1688'); // '1688' | 'alibaba'
  
  const handleOpenImporter = (platform = '1688') => {
    setImporterPlatform(platform);
    setIsAlibabaModalOpen(true);
  };
  
  // Add Product Form State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newNepaliTitle, setNewNepaliTitle] = useState('');
  const [newCategory, setNewCategory] = useState(CATEGORIES[0].id);
  const [newPrice, setNewPrice] = useState('25.00');
  const [newMoq, setNewMoq] = useState('10');
  const [newUnit, setNewUnit] = useState('pieces');
  const [newStock, setNewStock] = useState('150');
  const [newLeadTime, setNewLeadTime] = useState('5-7 Days');
  const [newImage, setNewImage] = useState('https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80');

  // Orders State
  const [orders, setOrders] = useState([]);

  // Load orders from backend API
  useEffect(() => {
    fetch('/api/orders')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.orders && data.orders.length > 0) {
          const apiOrders = data.orders.map(o => ({
            id: o.id,
            trackingNumber: o.tracking_number,
            customerName: o.customer_name || 'Customer',
            customerPhone: o.customer_phone || '',
            customerAddress: o.customer_address || 'Nepal',
            productTitle: o.items?.[0]?.title || 'Bhanjo Sourcing Order',
            qty: o.items?.reduce((s, it) => s + (it.quantity || 1), 0) || 1,
            totalUSD: o.total_amount || 25,
            orderDate: o.created_at ? o.created_at.slice(0, 16) : 'Just Now',
            status: o.order_status || 'Ready to Ship',
            shippingType: 'Bhanjo Express Logistics',
            paymentStatus: `${o.payment_method} (${o.payment_status})`
          }));

          // Merge without duplicates
          setOrders(prev => {
            const existingIds = new Set(apiOrders.map(a => a.id));
            const filteredMock = prev.filter(p => !existingIds.has(p.id));
            return [...apiOrders, ...filteredMock];
          });
        }
      })
      .catch(e => console.log('Orders load:', e));

    // Load buyer inquiries from SQLite backend
    fetch('/api/inquiries')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.inquiries) {
          setInquiries(data.inquiries);
        }
      })
      .catch(e => console.log('Inquiries load:', e));
  }, []);

  const handleMarkInquiryReplied = async (inqId) => {
    try {
      await fetch(`/api/inquiries/${inqId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'replied' })
      });
      setInquiries(prev => prev.map(inq => inq.id === inqId ? { ...inq, status: 'replied' } : inq));
    } catch (e) {
      console.log('Mark inquiry error:', e);
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const catObj = CATEGORIES.find(c => c.id === newCategory) || CATEGORIES[0];

    const createdProd = {
      id: `prod-custom-${Date.now().toString().slice(-4)}`,
      title: newTitle,
      nepaliTitle: newNepaliTitle,
      categoryId: newCategory,
      categoryName: catObj.name,
      supplierId: "sup-himalayan-artisans",
      supplierName: "Himalayan Heritage Craft & Textiles Ltd.",
      supplierCountry: "Nepal",
      supplierFlag: "🇳🇵",
      verifiedYear: 8,
      isTradeAssurance: true,
      rating: 5.0,
      reviewsCount: 1,
      moq: parseInt(newMoq) || 1,
      unit: newUnit,
      leadTime: newLeadTime,
      samplePrice: parseFloat(newPrice) * 1.3,
      priceTiers: [
        { minQty: parseInt(newMoq), maxQty: parseInt(newMoq) * 5, price: parseFloat(newPrice) },
        { minQty: parseInt(newMoq) * 5 + 1, maxQty: null, price: parseFloat(newPrice) * 0.85 }
      ],
      currency: "USD",
      images: [newImage],
      customization: ["Custom Logo Branding", "Export Packaging"],
      specs: {
        "Origin": "Nepal",
        "Quality Standard": "Nepal Bureau of Standards / ISO 9001",
        "Stock Availability": `${newStock} ${newUnit}`
      },
      featured: true,
      isHimalayanExport: true,
      description: `Premium quality wholesale supply directly from certified Nepali factory. Available for bulk orders and sample evaluation.`
    };

    // Save to SQLite
    try {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createdProd)
      });
    } catch (err) {
      console.log('Product save:', err);
    }

    setProductList([createdProd, ...productList]);
    if (onProductAdded) onProductAdded(createdProd);

    setIsAddModalOpen(false);
    confetti({ particleCount: 70, spread: 60 });
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));

    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (e) {
      console.log('Status update err:', e);
    }
  };

  return (
    <div className="my-8 max-w-7xl mx-auto">
      
      {/* Top Banner: Amazon Seller Central / Daraz Seller Center Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#121316] via-[#17181c] to-[#0e0f12] text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-neutral-800/80 mb-8">
        
        {/* Warm Ambient Glow Effects (Replaces cold blue with warm brand tones) */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-80 h-80 bg-gradient-to-br from-orange-500/15 via-amber-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-16 w-64 h-64 bg-orange-600/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-[#F85606] flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-orange-500/25">
              S
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-black tracking-tight">
                  Bhanjo <span className="text-[#F85606]">Store Manager</span>
                </h1>
                <span className="bg-amber-400/15 text-amber-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-400/30 flex items-center gap-1 shadow-2xs">
                  <ShieldCheck className="w-3 h-3 text-amber-400" />
                  Official Store Admin 🇳🇵
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-1">
                Store Owner Portal • Bhanjo.com Direct (Orders, Listings & Fulfillment)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {onBackToMarketplace && (
              <button
                onClick={onBackToMarketplace}
                className="bg-neutral-800/90 hover:bg-neutral-700/90 text-neutral-200 hover:text-white font-semibold text-xs sm:text-sm px-4 py-3 rounded-xl border border-neutral-700/80 transition flex items-center gap-1.5 shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Storefront</span>
              </button>
            )}

            <button
              onClick={() => setIsAlibabaModalOpen(true)}
              className="bg-gradient-to-r from-amber-500 to-[#F85606] hover:from-amber-600 hover:to-[#e04e05] text-white font-extrabold text-xs sm:text-sm px-4 py-3 rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition flex items-center gap-1.5 border border-amber-400/40"
            >
              <span className="text-base">⚡</span>
              <span>Import from Alibaba (1-Click)</span>
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-[#F85606] hover:bg-[#e04e05] text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product Listing</span>
            </button>
          </div>
        </div>

        {/* 4 Executive KPI Metric Cards (Sleek Frosted Glassmorphism) */}
        <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-neutral-800/90">
          <div className="bg-neutral-900/70 hover:bg-neutral-900/90 p-4 rounded-2xl border border-neutral-800 hover:border-neutral-700/80 transition-all duration-200 backdrop-blur-sm">
            <div className="flex items-center justify-between text-neutral-400 text-xs font-medium">
              <span>Today's Net Sales</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl font-black text-white mt-1">
              {formatPrice(2130.00)}
            </div>
            <span className="text-[11px] text-emerald-400 font-semibold mt-0.5 block">
              ↑ 18.4% vs last week
            </span>
          </div>

          <div className="bg-neutral-900/70 hover:bg-neutral-900/90 p-4 rounded-2xl border border-neutral-800 hover:border-neutral-700/80 transition-all duration-200 backdrop-blur-sm">
            <div className="flex items-center justify-between text-neutral-400 text-xs font-medium">
              <span>Open Orders to Ship</span>
              <ShoppingCart className="w-4 h-4 text-orange-400" />
            </div>
            <div className="text-xl font-black text-white mt-1">
              {orders.filter(o => o.status !== 'Delivered').length} Orders
            </div>
            <span className="text-[11px] text-orange-400 font-semibold mt-0.5 block">
              Requires dispatch in 24h
            </span>
          </div>

          <div className="bg-neutral-900/70 hover:bg-neutral-900/90 p-4 rounded-2xl border border-neutral-800 hover:border-neutral-700/80 transition-all duration-200 backdrop-blur-sm">
            <div className="flex items-center justify-between text-neutral-400 text-xs font-medium">
              <span>Active Catalog SKUs</span>
              <Package className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-xl font-black text-white mt-1">
              {productList.length} Products
            </div>
            <span className="text-[11px] text-neutral-400 font-semibold mt-0.5 block">
              Across all categories
            </span>
          </div>

          <div className="bg-neutral-900/70 hover:bg-neutral-900/90 p-4 rounded-2xl border border-neutral-800 hover:border-neutral-700/80 transition-all duration-200 backdrop-blur-sm">
            <div className="flex items-center justify-between text-neutral-400 text-xs font-medium">
              <span>Store Performance</span>
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            </div>
            <div className="text-xl font-black text-amber-400 mt-1">
              4.92 / 5.0
            </div>
            <span className="text-[11px] text-emerald-400 font-semibold mt-0.5 block">
              99.8% On-time dispatch
            </span>
          </div>
        </div>
      </div>

      {/* Seller Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-bold uppercase tracking-wider mb-6 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 transition border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'overview' ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Fulfillment & Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`pb-3 transition border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'inventory' ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Manage Inventory ({productList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('inquiries')}
          className={`pb-3 transition border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'inquiries' ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Buyer Inquiries & Leads ({inquiries.length})</span>
        </button>
      </div>

      {/* Tab 1: Orders Fulfillment Tab (Amazon / Daraz Merchant Orders) */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
              <h3 className="font-bold text-sm text-slate-900">
                Customer & Wholesale Orders Awaiting Dispatch
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Filter by Status:</span>
                <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-0.5 rounded">All Orders</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-2">Order ID & Date</th>
                    <th className="py-3 px-2">Customer & Destination</th>
                    <th className="py-3 px-2">Product & Quantity</th>
                    <th className="py-3 px-2">Order Value</th>
                    <th className="py-3 px-2">Fulfillment Status</th>
                    <th className="py-3 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-2">
                        <span className="font-bold text-slate-900 block">{ord.id}</span>
                        <span className="text-[11px] text-slate-400">{ord.orderDate}</span>
                      </td>
                      <td className="py-3.5 px-2">
                        <span className="font-semibold text-slate-800 block">{ord.customerName}</span>
                        <span className="text-[11px] text-slate-500">{ord.customerAddress}</span>
                        <span className="text-[10px] text-emerald-600 block">{ord.paymentStatus}</span>
                      </td>
                      <td className="py-3.5 px-2">
                        <span className="font-medium text-slate-800 block line-clamp-1">{ord.productTitle}</span>
                        <span className="text-[11px] text-orange-600 font-bold">Qty: {ord.qty} units</span>
                      </td>
                      <td className="py-3.5 px-2 font-black text-slate-900">
                        {formatPrice(ord.totalUSD)}
                      </td>
                      <td className="py-3.5 px-2">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full ${
                          ord.status === 'Ready to Ship' 
                            ? 'bg-amber-100 text-amber-800' 
                            : ord.status === 'Shipped' 
                            ? 'bg-indigo-100 text-indigo-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          <Clock className="w-3 h-3" />
                          {ord.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-2 text-right">
                        {ord.status === 'Ready to Ship' ? (
                          <button
                            onClick={() => handleUpdateOrderStatus(ord.id, 'Shipped')}
                            className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition inline-flex items-center gap-1 shadow-sm"
                          >
                            <Truck className="w-3 h-3" />
                            <span>Mark Shipped</span>
                          </button>
                        ) : ord.status === 'Shipped' ? (
                          <button
                            onClick={() => handleUpdateOrderStatus(ord.id, 'Delivered')}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition inline-flex items-center gap-1 shadow-sm"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Mark Delivered</span>
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400 font-semibold">Completed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      )}

      {/* Tab 2: Manage Inventory Table */}
      {activeTab === 'inventory' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <h3 className="font-bold text-sm text-slate-900">
              Active Store Listings & Tiered Pricing Matrix
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => handleOpenImporter('1688')}
                className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-xs px-3 py-2 rounded-xl transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                title="Sourcing direct from 1688 Chinese factory"
              >
                <span>🏭</span>
                <span>1688 Sourcing</span>
              </button>
              <button
                type="button"
                onClick={() => handleOpenImporter('alibaba')}
                className="bg-orange-50 hover:bg-orange-100 text-[#FF6A00] border border-orange-200 font-bold text-xs px-3 py-2 rounded-xl transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                title="Sourcing direct from Alibaba Global Direct"
              >
                <span>⚡</span>
                <span>Alibaba Sourcing</span>
              </button>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New SKU</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-2">Product & SKU</th>
                  <th className="py-3 px-2">Category</th>
                  <th className="py-3 px-2">Wholesale Price (FOB)</th>
                  <th className="py-3 px-2">MOQ</th>
                  <th className="py-3 px-2">Rating</th>
                  <th className="py-3 px-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {productList.map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-2 flex items-center gap-3">
                      <img src={prod.images[0]} alt={prod.title} className="w-12 h-12 object-cover rounded-lg bg-slate-100 flex-shrink-0" />
                      <div>
                        <span className="font-bold text-slate-900 block line-clamp-1">{prod.title}</span>
                        <span className="text-[10px] text-slate-400">ID: {prod.id}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-slate-600 font-medium">
                      {prod.categoryName}
                    </td>
                    <td className="py-3 px-2">
                      <button
                        onClick={() => onEditProduct && onEditProduct(prod)}
                        className="font-bold text-orange-600 hover:text-orange-700 hover:underline flex items-center gap-1 group/price cursor-pointer text-left"
                        title="Click to edit price"
                      >
                        <span>{formatPrice(prod.priceTiers[prod.priceTiers.length - 1]?.price || prod.samplePrice)} / {prod.unit}</span>
                        <Edit3 className="w-3 h-3 text-orange-400 group-hover/price:text-orange-600 transition" />
                      </button>
                    </td>
                    <td className="py-3 px-2">
                      <span className="bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded">
                        {prod.moq} {prod.unit}
                      </span>
                    </td>
                    <td className="py-3 px-2 font-bold text-slate-800">
                      ★ {prod.rating} ({prod.reviewsCount})
                    </td>
                    <td className="py-3 px-2 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            if (onEditProduct) {
                              onEditProduct(prod);
                            } else {
                              alert(`Editing listing: ${prod.title}`);
                            }
                          }}
                          className="text-slate-600 hover:text-orange-600 p-1.5 rounded-lg hover:bg-slate-100 transition"
                          title="Edit Price & SKU"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        {onDeleteProduct && (
                          <button
                            onClick={(e) => {
                              onDeleteProduct(prod.id, e);
                              setProductList(prev => prev.filter(p => p.id !== prod.id));
                            }}
                            className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition"
                            title="Delete Product from Store"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Buyer Inquiries & Leads Tab */}
      {activeTab === 'inquiries' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  Buyer Inquiries & Wholesale Quotation Requests
                </h3>
                <p className="text-xs text-slate-500">Live chat inquiries and product questions sent by shoppers across Nepal</p>
              </div>
              <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2.5 py-1 rounded-full">
                {inquiries.length} Active Leads
              </span>
            </div>

            {inquiries.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <MessageSquare className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                <p className="text-xs font-semibold">No inquiries received yet. When buyers message you via supplier chat, they will show up here in real time!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] tracking-wider">
                      <th className="py-3 px-2">Buyer Name & Phone</th>
                      <th className="py-3 px-2">Product Referenced</th>
                      <th className="py-3 px-2">Message Content</th>
                      <th className="py-3 px-2">Status</th>
                      <th className="py-3 px-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {inquiries.map((inq) => {
                      const isReplied = inq.status === 'replied';
                      return (
                        <tr key={inq.id} className="hover:bg-slate-50/80 transition">
                          <td className="py-3.5 px-2">
                            <span className="font-bold text-slate-900 block">{inq.customer_name || 'Buyer'}</span>
                            <span className="text-[11px] text-slate-500">📱 {inq.phone || '98XXXXXXXX'}</span>
                            <span className="text-[10px] text-slate-400 block">{inq.created_at ? inq.created_at.slice(0, 16) : 'Recent'}</span>
                          </td>
                          <td className="py-3.5 px-2">
                            <span className="font-medium text-slate-800 line-clamp-1 block max-w-xs">
                              {inq.product_title || inq.product_id || 'Catalog Item'}
                            </span>
                          </td>
                          <td className="py-3.5 px-2">
                            <p className="text-slate-700 bg-slate-50 p-2 rounded-lg max-w-sm line-clamp-2 italic">
                              "{inq.message}"
                            </p>
                          </td>
                          <td className="py-3.5 px-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isReplied ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-100 text-orange-800'
                            }`}>
                              {isReplied ? 'Replied' : 'Pending Lead'}
                            </span>
                          </td>
                          <td className="py-3.5 px-2 text-right">
                            {!isReplied ? (
                              <button
                                onClick={() => handleMarkInquiryReplied(inq.id)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] px-3 py-1.5 rounded-lg transition inline-flex items-center gap-1 shadow-xs"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Mark Replied</span>
                              </button>
                            ) : (
                              <span className="text-[11px] text-emerald-600 font-semibold">✓ Contacted</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Product Modal (Daraz / Amazon Seller Listing Creation) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 p-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">
                Add New Product to Bhanjo Catalog
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 mt-4 text-xs">
              
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Product Title (English) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 100% Pure Himalayan Cashmere Scarf"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Nepali Product Title (नेपाली नाम)
                </label>
                <input
                  type="text"
                  placeholder="e.g. शुद्ध च्याङ्ग्रा पश्मिना दोसल्ला"
                  value={newNepaliTitle}
                  onChange={(e) => setNewNepaliTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Unit Type</label>
                  <select
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="pieces">Pieces (pcs)</option>
                    <option value="sets">Sets</option>
                    <option value="kg">Kilograms (kg)</option>
                    <option value="tons">Tons</option>
                    <option value="meters">Meters</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Wholesale Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">MOQ</label>
                  <input
                    type="number"
                    required
                    value={newMoq}
                    onChange={(e) => setNewMoq(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Lead Time</label>
                  <input
                    type="text"
                    value={newLeadTime}
                    onChange={(e) => setNewLeadTime(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Product Photo URL</label>
                <input
                  type="text"
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-5 py-2 rounded-lg shadow"
                >
                  Publish Listing
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Alibaba 1-Click Importer Modal */}
      <AlibabaImporterModal
        isOpen={isAlibabaModalOpen}
        defaultPlatform={importerPlatform}
        onClose={() => setIsAlibabaModalOpen(false)}
        onProductImported={(importedProd) => {
          setProductList(prev => [importedProd, ...prev]);
          if (onProductAdded) {
            onProductAdded(importedProd);
          }
        }}
      />

    </div>
  );
};
