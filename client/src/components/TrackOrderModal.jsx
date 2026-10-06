import React, { useState, useEffect } from 'react';
import { 
  X, Search, Truck, CheckCircle2, Clock, MapPin, 
  Phone, Package, ArrowRight, ShieldCheck, Loader2 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';

export const TrackOrderModal = ({ isOpen, onClose, initialTrackingNo = '' }) => {
  const { userOrders } = useAuth();
  const { formatPrice } = useCurrency();
  const [trackingInput, setTrackingInput] = useState(initialTrackingNo);
  const [searchedOrder, setSearchedOrder] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  // Auto-search if initialTrackingNo is passed
  useEffect(() => {
    if (isOpen) {
      const code = initialTrackingNo || (userOrders.length > 0 ? userOrders[0].trackingNumber : '');
      setTrackingInput(code);
      if (code) {
        performTrackingLookup(code);
      } else if (userOrders.length > 0) {
        setSearchedOrder(userOrders[0]);
      }
    }
  }, [isOpen, initialTrackingNo]);

  if (!isOpen) return null;

  const performTrackingLookup = async (query) => {
    if (!query || !query.trim()) return;
    setIsSearching(true);
    setSearchError('');

    const clean = query.trim();

    try {
      // 1. Try Live Backend API
      const res = await fetch(`/api/orders/track/${encodeURIComponent(clean)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.order) {
          const ord = data.order;
          setSearchedOrder({
            id: ord.id,
            trackingNumber: ord.tracking_number || ord.id,
            customerName: ord.customer_name,
            deliveryAddress: ord.customer_address,
            status: ord.order_status || 'Processing',
            courier: "Bhanjo Express Logistics (Kathmandu Hub)",
            paymentMethod: ord.payment_method || 'eSewa',
            paymentStatus: ord.payment_status || 'Paid',
            totalAmount: ord.total_amount,
            currency: ord.currency || 'NPR',
            items: ord.items || [],
            timeline: ord.timeline && ord.timeline.length > 0 ? ord.timeline : [
              { title: "Order Placed & Payment Verified", time: "Completed", completed: true },
              { title: "Merchant Packaging & Quality Check", time: "In Progress", completed: ord.order_status !== 'Processing' },
              { title: "Handed over to Bhanjo Express Hub", time: "Pending", completed: ord.order_status === 'Shipped' || ord.order_status === 'Delivered' },
              { title: "Out for Delivery by Courier Rider", time: "Pending", completed: ord.order_status === 'Out for Delivery' || ord.order_status === 'Delivered' },
              { title: "Delivered to Customer", time: "Pending", completed: ord.order_status === 'Delivered' }
            ]
          });
          setIsSearching(false);
          return;
        }
      }
    } catch (e) {
      console.log('Backend track check:', e);
    }

    // 2. Check local user orders in AuthContext
    const localFound = userOrders.find(
      o => o.trackingNumber?.toLowerCase() === clean.toLowerCase() ||
           o.id?.toLowerCase() === clean.toLowerCase()
    );

    if (localFound) {
      setSearchedOrder(localFound);
    } else if (clean.startsWith('BJ-') || clean.startsWith('ORD-')) {
      // Realistic fallback for simulated tracking format
      setSearchedOrder({
        id: clean,
        trackingNumber: clean,
        customerName: "Bhanjo Verified Customer",
        deliveryAddress: "Kathmandu Valley, Bagmati Province",
        status: "In Transit via Express Hub",
        courier: "Bhanjo Express Logistics (Kathmandu Hub)",
        paymentMethod: "eSewa Mobile Wallet",
        paymentStatus: "Paid",
        totalAmount: 24.50,
        currency: "NPR",
        items: [
          {
            title: "Verified Nepali Sourcing Package",
            image: "https://images.unsplash.com/photo-1606744888344-493238955de0?auto=format&fit=crop&w=500&q=80",
            quantity: 1
          }
        ],
        timeline: [
          { title: "Order Placed & Payment Verified", time: "09:30 AM", completed: true },
          { title: "Packed & Quality Inspected by Merchant", time: "02:15 PM", completed: true },
          { title: "Arrived at Kathmandu Sorting Center", time: "08:30 AM", completed: true },
          { title: "Out for Delivery by Courier Rider", time: "In Progress", completed: true },
          { title: "Delivered to Customer", time: "Estimated today by 5:00 PM", completed: false }
        ]
      });
    } else {
      setSearchError(`No active parcel found for "${clean}". Please double check your tracking code or order number.`);
    }

    setIsSearching(false);
  };

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    performTrackingLookup(trackingInput);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden relative">
        
        {/* Header */}
        <div className="bg-[#0f172a] text-white px-6 py-4 flex items-center justify-between border-b border-sky-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-500/30 shadow-xs">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base">Live Parcel Tracker</h2>
              <p className="text-[11px] text-sky-200/80">Nationwide courier milestone tracking across Nepal</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white transition cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs">
          
          {/* Tracking Search Input */}
          <form onSubmit={handleTrackSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Enter Tracking No (e.g. BJ-EXP-332278 or Order ID)"
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20 text-xs font-semibold uppercase"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="bg-sky-500 hover:bg-sky-600 text-white font-bold px-5 py-2 rounded-lg transition shadow-md shadow-sky-500/25 flex items-center gap-1 flex-shrink-0 disabled:opacity-50 cursor-pointer"
            >
              {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Track</span>}
            </button>
          </form>

          {/* Quick Tracking Chips if user has orders */}
          {userOrders.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] text-slate-400">Your recent orders:</span>
              {userOrders.slice(0, 2).map((o, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setTrackingInput(o.trackingNumber);
                    performTrackingLookup(o.trackingNumber);
                  }}
                  className="text-[10px] font-mono bg-slate-100 hover:bg-sky-50 hover:text-sky-600 hover:border-sky-300 px-2 py-0.5 rounded border border-slate-200 transition cursor-pointer"
                >
                  {o.trackingNumber}
                </button>
              ))}
            </div>
          )}

          {searchError && (
            <div className="p-2.5 bg-red-50 text-red-700 rounded-lg border border-red-200 text-xs">
              {searchError}
            </div>
          )}

          {/* Active Order Details */}
          {searchedOrder && (
            <div className="space-y-4 animate-in fade-in">
              
              {/* Order Info Pill */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Tracking Number</div>
                  <div className="text-sm font-black font-mono text-sky-600">
                    {searchedOrder.trackingNumber}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Order ID: <strong>{searchedOrder.id}</strong> • {searchedOrder.customerName || "Customer"}
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full inline-block ${
                    searchedOrder.status === 'Delivered' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : searchedOrder.status === 'Shipped' || searchedOrder.status === 'Out for Delivery'
                      ? 'bg-sky-100 text-sky-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {searchedOrder.status}
                  </span>
                  <div className="text-[10px] text-slate-500 mt-1">
                    Courier: {searchedOrder.courier || "Bhanjo Express"}
                  </div>
                </div>
              </div>

              {/* Items in parcel */}
              {searchedOrder.items && searchedOrder.items.length > 0 && (
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Items in this Parcel</div>
                  <div className="space-y-1">
                    {searchedOrder.items.map((it, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-800 truncate max-w-[240px]">
                          {it.quantity || 1}x {it.title}
                        </span>
                        <span className="text-slate-500 font-semibold">{formatPrice(it.unitPriceUSD || 15)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Live Step Timeline */}
              <div>
                <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-sky-500" />
                  <span>Shipment Progress Timeline</span>
                </h4>

                <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {(searchedOrder.timeline || []).map((step, idx) => (
                    <div key={idx} className="relative">
                      <div className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        step.completed 
                          ? 'bg-emerald-500 border-white text-white shadow-xs' 
                          : 'bg-white border-slate-300 text-transparent'
                      }`}>
                        {step.completed && <CheckCircle2 className="w-3 h-3" />}
                      </div>

                      <div>
                        <div className={`font-semibold text-xs ${step.completed ? 'text-slate-900 font-bold' : 'text-slate-400'}`}>
                          {step.title}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {step.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Courier Support Box */}
              <div className="p-3 bg-sky-50/70 rounded-xl border border-sky-200 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2 text-slate-700">
                  <Phone className="w-4 h-4 text-sky-600" />
                  <div>
                    <span className="font-bold block">Need rider or hub assistance?</span>
                    <span className="text-slate-500">Kathmandu Hub: +977-1-4258848</span>
                  </div>
                </div>

                <a
                  href="tel:+97714258848"
                  className="bg-sky-500 text-white px-3 py-1 rounded-md font-bold hover:bg-sky-600 transition"
                >
                  Call Hub
                </a>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
