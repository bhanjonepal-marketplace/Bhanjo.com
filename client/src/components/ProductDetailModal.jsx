import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Star, MessageSquare, ShoppingCart, Truck, 
  RotateCcw, CheckCircle2, MapPin, Zap, ShieldCheck, 
  Heart, ZoomIn, Maximize2, Send, User, ThumbsUp, Trash2, Edit3, Save, Check
} from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { SUPPLIERS } from '../data/suppliers';
import confetti from 'canvas-confetti';

export const ProductDetailModal = ({ product, onClose, onOpenChat, onOpenCart, onRequireAuth, onDeleteProduct, onEditProduct }) => {
  const { formatPrice, formatNPR, formatJPY } = useCurrency();
  const { addToCart } = useCart();
  const { user, toggleWishlist, isInWishlist, isAdmin } = useAuth();

  const [activeImage, setActiveImage] = useState(product?.images[0]);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState('Standard');
  const [addedSuccess, setAddedSuccess] = useState(false);

  // Live Price Editing State
  const [currentPriceUSD, setCurrentPriceUSD] = useState(product?.samplePrice || 20);
  const [isEditingInlinePrice, setIsEditingInlinePrice] = useState(false);
  const [inlinePriceUSD, setInlinePriceUSD] = useState((product?.samplePrice || 20).toString());
  const [inlinePriceNPR, setInlinePriceNPR] = useState(Math.round((product?.samplePrice || 20) * 133.5).toString());
  const [isSavingInlinePrice, setIsSavingInlinePrice] = useState(false);

  useEffect(() => {
    if (product) {
      const p = product.samplePrice || 20;
      setCurrentPriceUSD(p);
      setInlinePriceUSD(p.toString());
      setInlinePriceNPR(Math.round(p * 133.5).toString());
      setIsEditingInlinePrice(false);
    }
  }, [product]);

  const retailPrice = currentPriceUSD;
  const originalPrice = currentPriceUSD * 1.4;

  const handleSaveInlinePrice = async () => {
    const finalUSD = parseFloat(inlinePriceUSD);
    if (isNaN(finalUSD) || finalUSD <= 0) return;
    setIsSavingInlinePrice(true);
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          price: finalUSD,
          samplePrice: finalUSD,
          title: product.title,
          productData: { ...product, samplePrice: finalUSD }
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCurrentPriceUSD(finalUSD);
        setIsEditingInlinePrice(false);
        confetti({ particleCount: 35, spread: 50, origin: { y: 0.6 } });
        window.dispatchEvent(new CustomEvent('bhanjo-product-updated', { detail: data.product }));
      }
    } catch (err) {
      console.error('Error saving inline price:', err);
    } finally {
      setIsSavingInlinePrice(false);
    }
  };

  // Zoom State
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const imageContainerRef = useRef(null);

  // Reviews State
  const [reviews, setReviews] = useState([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewAuthor, setNewReviewAuthor] = useState(user?.name || '');
  const [newReviewCity, setNewReviewCity] = useState('Kathmandu');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState('');

  useEffect(() => {
    if (product) {
      setShowVideo(false);
      setActiveImage(product.images[0]);
      setOrderQuantity(1);
      setAddedSuccess(false);
      setReviewSuccess('');

      // Fetch verified reviews from SQLite backend
      setIsLoadingReviews(true);
      fetch(`/api/reviews/${product.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.reviews) {
            setReviews(data.reviews);
          }
        })
        .catch(() => {
          // fallback default review if backend error
          setReviews([]);
        })
        .finally(() => setIsLoadingReviews(false));
    }
  }, [product]);

  if (!product) return null;

  const isFavorite = isInWishlist(product.id);

  const supplier = SUPPLIERS.find(s => s.id === product.supplierId) || {
    name: product.supplierName,
    city: product.supplierCountry,
    rating: product.rating,
    responseRate: "99.2%",
    verifiedYear: product.verifiedYear
  };


  const handleMouseMove = (e) => {
    if (!imageContainerRef.current) return;
    const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  const handleAddToCart = () => {
    addToCart(product, orderQuantity, 'retail');
    setAddedSuccess(true);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
    setTimeout(() => setAddedSuccess(false), 2500);
  };

  const handleBuyNow = () => {
    addToCart(product, orderQuantity, 'retail');
    onClose();
    if (onOpenCart) onOpenCart();
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!newReviewComment.trim()) return;

    setIsSubmittingReview(true);
    const authorName = newReviewAuthor.trim() || user?.name || 'Nepali Shopper';

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          userName: authorName,
          userCity: newReviewCity,
          rating: newReviewRating,
          comment: newReviewComment.trim()
        })
      });

      if (res.ok) {
        const newRev = {
          id: `rev-${Date.now()}`,
          product_id: product.id,
          user_name: authorName,
          user_city: newReviewCity,
          rating: newReviewRating,
          comment: newReviewComment.trim(),
          is_verified: 1,
          created_at: new Date().toISOString()
        };
        setReviews([newRev, ...reviews]);
        setNewReviewComment('');
        setReviewSuccess('Thank you! Your verified review has been published.');
        confetti({ particleCount: 40, spread: 50 });
        setTimeout(() => setReviewSuccess(''), 4000);
      }
    } catch (err) {
      console.log('Error adding review:', err);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-150">
      
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 relative flex flex-col">
        
        {/* Top Header */}
        <div className="sticky top-0 z-20 bg-white px-5 py-3 border-b border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500 truncate flex items-center gap-1.5">
            <span>Home</span>
            <span>&gt;</span>
            <span className="font-semibold text-slate-700">{product.categoryName}</span>
            <span>&gt;</span>
            <span className="text-slate-400 truncate max-w-xs">{product.title}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Wishlist Button */}
            <button
              onClick={() => toggleWishlist(product)}
              className={`p-1.5 rounded-lg border transition flex items-center gap-1 text-xs font-semibold ${
                isFavorite 
                  ? 'border-red-300 bg-red-50 text-red-600' 
                  : 'border-slate-200 text-slate-600 hover:text-red-600 hover:bg-slate-50'
              }`}
              title={isFavorite ? "Remove from Wishlist" : "Add to Wishlist"}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
              <span className="hidden sm:inline">{isFavorite ? 'Saved' : 'Wishlist'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 3-Column Daraz Product Page Layout */}
        <div className="p-5 grid grid-cols-1 md:grid-cols-12 gap-5">
          
          {/* Col 1: Photo Gallery with Interactive Hover Zoom (md: 5 cols, lg: 4 cols) */}
          <div className="md:col-span-5 lg:col-span-4 flex flex-col gap-3">
            
            {/* Main Interactive Zoom Box or Video Player */}
            {showVideo && product.videoUrl ? (
              <div className="relative aspect-square rounded-xl overflow-hidden bg-black flex items-center justify-center border border-slate-300 shadow-sm">
                <video
                  src={product.videoUrl}
                  controls
                  autoPlay
                  muted
                  playsInline
                  loop
                  className="w-full h-full object-contain"
                />
                <span className="absolute top-2 left-2 bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-xs z-10 flex items-center gap-1">
                  <span>{isAdmin ? '▶ 1688 Factory Video Showcase' : '▶ Verified Product Showcase'}</span>
                </span>
              </div>
            ) : (
              <div 
                ref={imageContainerRef}
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
                onMouseMove={handleMouseMove}
                onClick={() => setIsLightboxOpen(true)}
                className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200 cursor-crosshair group select-none"
              >
                <img 
                  src={activeImage} 
                  alt={product.title} 
                  className={`w-full h-full object-cover transition-transform duration-100 ${
                    isZoomed ? 'scale-150 origin-top-left' : 'scale-100'
                  }`}
                  style={isZoomed ? {
                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
                  } : {}}
                />

                {product.isHimalayanExport && (
                  <span className="absolute top-2 left-2 bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-xs z-10">
                    🇳🇵 Nepal Authentic
                  </span>
                )}

                {product.isAlibabaImport && (
                  <span className="absolute top-2 left-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-xs z-10 flex items-center gap-1">
                    <span>{product.is1688Import ? '🇨🇳 1688 Factory Direct' : '🇨🇳 Alibaba Factory Direct'}</span>
                  </span>
                )}

                {/* Click to Expand Lightbox Hint */}
                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded-lg backdrop-blur-xs flex items-center gap-1 opacity-80 group-hover:opacity-100 transition z-10">
                  <Maximize2 className="w-3 h-3" />
                  <span>Click to Full Zoom</span>
                </div>
              </div>
            )}

            {/* Thumbnails row (Video + Photos) */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {product.videoUrl && (
                <button
                  id="btn-modal-video"
                  type="button"
                  onClick={() => setShowVideo(true)}
                  className={`w-14 h-14 rounded-lg overflow-hidden border-2 flex-shrink-0 transition bg-slate-950 flex flex-col items-center justify-center relative ${
                    showVideo ? 'border-[#F85606] ring-2 ring-orange-400' : 'border-slate-300 opacity-80 hover:opacity-100'
                  }`}
                  title="Play 1688 Showcase Video"
                >
                  <div className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[9px] font-bold shadow-xs">
                    ▶
                  </div>
                  <span className="text-[9px] font-bold mt-0.5 text-white">Video</span>
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                </button>
              )}

              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setShowVideo(false);
                    setActiveImage(img);
                  }}
                  className={`w-14 h-14 rounded-lg overflow-hidden border-2 flex-shrink-0 transition bg-slate-50 ${
                    !showVideo && activeImage === img ? 'border-[#F85606]' : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img 
                    src={img} 
                    alt={`Photo ${idx + 1}`} 
                    className="w-full h-full object-cover" 
                    onError={(e) => {
                      e.target.src = product.images[0];
                    }}
                  />
                </button>
              ))}
            </div>

          </div>

          {/* Col 2: Title, Price, Variant, Quantity & Action Buttons (md: 7 cols, lg: 5 cols) */}
          <div className="md:col-span-7 lg:col-span-5 flex flex-col justify-between">
            <div>
              <h1 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                {product.title}
              </h1>

              {product.nepaliTitle && (
                <p className="text-xs text-[#F85606] font-semibold mt-0.5">
                  {product.nepaliTitle}
                </p>
              )}

              {/* Rating & Brand Strip */}
              <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500">
                <div className="flex items-center text-amber-500 font-bold gap-0.5">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{product.rating}</span>
                </div>
                <span>•</span>
                <span className="text-slate-600">{product.reviewsCount + reviews.length} Ratings</span>
                <span>•</span>
                <span className="text-[#F85606] font-semibold">{supplier.name.slice(0, 22)}</span>
              </div>

              {/* Pricing Box with Inline Price Editing & Multi-Currency */}
              <div className="mt-3.5 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div 
                    onClick={() => isAdmin && setIsEditingInlinePrice(!isEditingInlinePrice)}
                    className={`flex items-baseline gap-2 flex-wrap ${isAdmin ? 'cursor-pointer group/price' : ''}`}
                    title={isAdmin ? "Click to edit price (Admin)" : ""}
                  >
                    <span className={`text-2xl sm:text-3xl font-black text-[#F85606] ${isAdmin ? 'group-hover/price:text-[#E04E05]' : ''}`}>
                      {formatPrice(retailPrice)}
                    </span>
                    <span className="text-xs text-slate-400 line-through">
                      {formatPrice(originalPrice)}
                    </span>
                    <span className="text-red-600 font-bold bg-red-50 text-[11px] px-1.5 py-0.5 rounded border border-red-200">
                      -30% Off
                    </span>
                    {isAdmin && (
                      <span className="text-[11px] font-bold text-[#F85606] opacity-0 group-hover/price:opacity-100 transition flex items-center gap-0.5">
                        <Edit3 className="w-3 h-3" />
                        <span>Edit</span>
                      </span>
                    )}
                  </div>

                  {isAdmin && (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setIsEditingInlinePrice(!isEditingInlinePrice)}
                        className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition shadow-2xs cursor-pointer ${
                          isEditingInlinePrice 
                            ? 'bg-[#F85606] text-white border border-[#F85606]' 
                            : 'text-[#F85606] bg-orange-50 hover:bg-orange-100 border border-orange-200'
                        }`}
                        title="Quick edit product price (Admin Only)"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>{isEditingInlinePrice ? 'Close Editor' : 'Edit Price'}</span>
                      </button>

                      {onEditProduct && (
                        <button
                          onClick={() => onEditProduct({ ...product, samplePrice: currentPriceUSD })}
                          className="text-[11px] text-slate-500 hover:text-slate-800 bg-white hover:bg-slate-100 border border-slate-200 px-2 py-1.5 rounded-lg transition"
                          title="Advanced SKU & MOQ Editor (Admin)"
                        >
                          More Options
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Inline Quick Price Editor Form (Admin Only) */}
                {isAdmin && isEditingInlinePrice && (
                  <div className="mt-3 pt-3 border-t border-orange-200/80 bg-orange-50/70 p-3 rounded-xl space-y-2.5 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                        <Edit3 className="w-3.5 h-3.5 text-[#F85606]" />
                        <span>Edit Price (Instant Sync)</span>
                      </span>

                      {/* Quick Multipliers */}
                      <div className="flex items-center gap-1 text-[10px]">
                        <span className="text-slate-500 font-semibold">Preset:</span>
                        {[
                          { label: '2.0x', mult: 2.0 },
                          { label: '2.5x', mult: 2.5 },
                          { label: '3.0x', mult: 3.0 }
                        ].map(p => (
                          <button
                            key={p.label}
                            type="button"
                            onClick={() => {
                              const base = product.originalAlibabaPrice || (currentPriceUSD / 3.0) || 15;
                              const usd = parseFloat((base * p.mult).toFixed(2));
                              setInlinePriceUSD(usd.toString());
                              setInlinePriceNPR(Math.round(usd * 133.5).toString());
                            }}
                            className="px-2 py-0.5 bg-white hover:bg-orange-100 text-slate-700 font-bold rounded border border-slate-200 hover:border-orange-300 transition"
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="text-[10px] text-slate-600 font-bold block mb-1">
                          Price in Nepali Rupees (NPR):
                        </label>
                        <div className="relative">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-xs">Rs.</span>
                          <input
                            type="number"
                            step="1"
                            value={inlinePriceNPR}
                            onChange={(e) => {
                              const val = e.target.value;
                              setInlinePriceNPR(val);
                              const num = parseFloat(val);
                              if (!isNaN(num) && num > 0) {
                                setInlinePriceUSD((num / 133.5).toFixed(2));
                              }
                            }}
                            className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F85606] text-xs"
                            placeholder="e.g. 4500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-600 font-bold block mb-1">
                          Price in US Dollars (USD):
                        </label>
                        <div className="relative">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-xs">$</span>
                          <input
                            type="number"
                            step="0.01"
                            value={inlinePriceUSD}
                            onChange={(e) => {
                              const val = e.target.value;
                              setInlinePriceUSD(val);
                              const num = parseFloat(val);
                              if (!isNaN(num) && num > 0) {
                                setInlinePriceNPR(Math.round(num * 133.5).toString());
                              }
                            }}
                            className="w-full pl-7 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F85606] text-xs"
                            placeholder="e.g. 33.70"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setIsEditingInlinePrice(false)}
                        className="px-3 py-1 text-slate-600 hover:text-slate-800 text-xs font-semibold rounded-lg hover:bg-slate-100 transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        disabled={isSavingInlinePrice}
                        onClick={handleSaveInlinePrice}
                        className="px-4 py-1.5 bg-[#F85606] hover:bg-[#E04E05] text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center gap-1.5 disabled:opacity-50"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>{isSavingInlinePrice ? 'Saving...' : 'Save Price'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Nepal NPR Price Tag */}
                <div className="mt-2 pt-2 border-t border-slate-200/80 flex flex-wrap items-center gap-3 text-xs">
                  <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-2xs">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Price (NPR):</span>
                    <span className="font-extrabold text-slate-800">{formatNPR(retailPrice)}</span>
                  </div>
                </div>

                {/* Alibaba / 1688 Benchmark Note (Admin Only) */}
                {isAdmin && (product.original1688PriceRMB || product.originalAlibabaPrice) && (
                  <div className="mt-2.5 text-[11px] bg-amber-50 text-amber-900 px-2.5 py-1.5 rounded-lg border border-amber-200 flex items-center justify-between">
                    <span>
                      {product.is1688Import ? (
                        <>🇨🇳 1688 Factory Price: <strong>¥{product.original1688PriceRMB ? Number(product.original1688PriceRMB).toFixed(2) : '10.60'} RMB (~Rs. {Math.round((product.original1688PriceRMB || 10.60) * 18.46).toLocaleString()})</strong></>
                      ) : (
                        <>⚡ Alibaba Factory Direct: <strong>Rs. {Math.round(product.originalAlibabaPrice * 133.5).toLocaleString()} (${Number(product.originalAlibabaPrice).toFixed(2)})</strong></>
                      )}
                    </span>
                    <span className="font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded text-[10px]">3x Wholesale Markup</span>
                  </div>
                )}
              </div>

              {/* Variant / Color Selector */}
              <div className="mt-4">
                <span className="text-xs font-semibold text-slate-700 block mb-1.5">
                  {product.variants ? 'Color & Specification Options:' : 'Options / Variants:'}
                </span>
                <div className="flex gap-2 flex-wrap">
                  {(product.variants || ['Standard', 'Premium Quality', 'Gift Packaging']).map((v) => (
                    <button
                      key={v}
                      onClick={() => setSelectedVariant(v)}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition ${
                        selectedVariant === v 
                          ? 'border-[#F85606] bg-orange-50 text-[#F85606] font-bold shadow-2xs' 
                          : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Stepper */}
              <div className="mt-4 flex items-center gap-3 text-xs">
                <span className="text-slate-600 font-semibold">Quantity:</span>
                <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setOrderQuantity(Math.max(1, orderQuantity - 1))}
                    className="px-3 py-1 bg-slate-100 hover:bg-slate-200 font-bold text-slate-700"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={orderQuantity}
                    onChange={(e) => setOrderQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-12 text-center text-xs font-bold py-1 focus:outline-none"
                  />
                  <button
                    onClick={() => setOrderQuantity(orderQuantity + 1)}
                    className="px-3 py-1 bg-slate-100 hover:bg-slate-200 font-bold text-slate-700"
                  >
                    +
                  </button>
                </div>
                <span className="text-slate-400 text-[11px]">In Stock ({product.specs?.["Stock Availability"] || "150 units"})</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 space-y-2">
              {addedSuccess && (
                <div className="bg-emerald-50 text-emerald-700 text-xs font-bold p-2 rounded-lg border border-emerald-200 text-center animate-in fade-in">
                  ✓ Item added to Cart!
                </div>
              )}

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={handleBuyNow}
                  className="bg-[#F85606] hover:bg-[#E04E05] text-white font-bold text-xs py-3 rounded-lg shadow-sm transition flex items-center justify-center gap-1.5"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>Buy Now</span>
                </button>

                <button
                  onClick={handleAddToCart}
                  className="bg-[#FFB703] hover:bg-[#FFA200] text-slate-900 font-bold text-xs py-3 rounded-lg transition flex items-center justify-center gap-1.5"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          </div>

          {/* Col 3: Delivery & Seller Box */}
          <div className="col-span-12 lg:col-span-3 flex flex-col sm:flex-row lg:flex-col gap-3">
            
            {/* Delivery Box */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="font-bold text-slate-800 flex items-center justify-between">
                <span>Delivery Options</span>
                <MapPin className="w-3.5 h-3.5 text-[#F85606]" />
              </div>
              
              <div className="space-y-1.5 text-[11px] text-slate-600">
                <div className="flex items-start gap-2">
                  <Truck className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-slate-800">Standard Delivery (NPR 80)</span>
                    <span className="text-slate-400">Guaranteed within 1-2 Days in Kathmandu</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1 border-t border-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>Cash on Delivery (COD) Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                  <span>14 Days Free Return</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>100% Authentic Product</span>
                </div>
              </div>
            </div>

            {/* Official Store Box */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Fulfilled & Sold by</div>
              <div className="font-bold text-slate-900 mt-0.5 truncate">Bhanjo.com Official Store</div>
              <div className="text-[11px] text-slate-500">Kathmandu, Nepal • 100% Authentic Direct</div>

              <div className="grid grid-cols-2 gap-2 text-center text-[10px] mt-2.5 pt-2 border-t border-slate-200">
                <div className="bg-white p-1.5 rounded border border-slate-200">
                  <span className="text-slate-400 block">Authentic</span>
                  <span className="font-bold text-emerald-600">100% Genuine</span>
                </div>
                <div className="bg-white p-1.5 rounded border border-slate-200">
                  <span className="text-slate-400 block">Ship on Time</span>
                  <span className="font-bold text-slate-800">99.8%</span>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onOpenChat(product);
                }}
                className="w-full mt-3 py-1.5 rounded-lg border border-[#F85606] text-[#F85606] hover:bg-orange-50 font-bold text-xs transition flex items-center justify-center gap-1"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat with Bhanjo Support</span>
              </button>

              {/* Remove Product from Bhanjo Button */}
              {onDeleteProduct && (
                <button
                  onClick={(e) => {
                    onDeleteProduct(product.id, e);
                    onClose();
                  }}
                  className="w-full mt-2.5 py-2 px-3 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                  title="Remove this product from Bhanjo catalog"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Product from Catalog</span>
                </button>
              )}
            </div>

          </div>

        </div>


        {/* Specifications Tab */}
        <div className="px-5 pb-5 border-t border-slate-200 pt-4">
          <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider mb-2">
            Product Details & Specifications
          </h3>
          <p className="text-xs text-slate-600 mb-3">{product.description}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {Object.entries(product.specs || {}).map(([k, v], idx) => (
              <div key={idx} className="flex border-b border-slate-100 py-1.5">
                <span className="w-44 text-slate-500 font-medium flex-shrink-0">{k}:</span>
                <span className="text-slate-800 font-semibold">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Reviews & Feedback Section */}
        <div className="px-5 pb-6 border-t border-slate-200 pt-4 bg-slate-50/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>Customer Ratings & Reviews ({reviews.length})</span>
              </h3>
              <p className="text-[11px] text-slate-500">Real feedback from verified purchasers in Nepal</p>
            </div>

            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-xs">
              <span className="font-bold text-amber-600 text-sm">★ {product.rating}</span>
              <span className="text-slate-400">/ 5.0</span>
              <span className="text-[10px] text-emerald-700 font-semibold ml-1">98% Recommended</span>
            </div>
          </div>

          {/* Add Review Box */}
          <form onSubmit={handleSubmitReview} className="bg-white p-4 rounded-xl border border-slate-200 mb-4 text-xs space-y-3">
            <div className="font-bold text-slate-800">Write a Review for this Product:</div>

            {reviewSuccess && (
              <div className="p-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold">
                {reviewSuccess}
              </div>
            )}

            <div className="flex items-center gap-2">
              <span className="text-slate-600 font-semibold">Your Rating:</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setNewReviewRating(star)}
                    className="p-1 text-amber-400 hover:scale-125 transition"
                  >
                    <Star className={`w-4 h-4 ${star <= newReviewRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Your Name"
                value={newReviewAuthor}
                onChange={(e) => setNewReviewAuthor(e.target.value)}
                className="px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:border-[#F85606]"
              />
              <input
                type="text"
                placeholder="City (e.g. Kathmandu, Pokhara)"
                value={newReviewCity}
                onChange={(e) => setNewReviewCity(e.target.value)}
                className="px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:border-[#F85606]"
              />
            </div>

            <textarea
              rows="2"
              required
              placeholder="Share your experience with this item (quality, packaging, delivery speed)..."
              value={newReviewComment}
              onChange={(e) => setNewReviewComment(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#F85606]"
            ></textarea>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmittingReview}
                className="bg-[#F85606] hover:bg-[#e04e05] text-white font-bold px-4 py-1.5 rounded-lg transition flex items-center gap-1 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Review</span>
              </button>
            </div>
          </form>

          {/* Reviews List */}
          <div className="space-y-2.5">
            {reviews.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs">
                No customer reviews yet. Be the first to review this product!
              </div>
            ) : (
              reviews.map((rev) => (
                <div key={rev.id} className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-orange-100 text-[#F85606] font-bold flex items-center justify-center text-[10px]">
                        {rev.user_name ? rev.user_name[0].toUpperCase() : 'U'}
                      </div>
                      <span className="font-bold text-slate-900">{rev.user_name}</span>
                      <span className="text-[10px] text-slate-400">({rev.user_city || 'Nepal'})</span>
                      {rev.is_verified && (
                        <span className="bg-emerald-50 text-emerald-700 text-[9px] font-bold px-1.5 py-0.2 rounded border border-emerald-200 flex items-center gap-0.5">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          <span>Verified Purchase</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center text-amber-400">
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>

                  <p className="text-slate-700 mt-1 pl-8 text-[11px] leading-relaxed">
                    {rev.comment}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Full Resolution Image Lightbox Modal */}
      {isLightboxOpen && (
        <div 
          onClick={() => setIsLightboxOpen(false)}
          className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
        >
          <button 
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-orange-400 p-2"
          >
            <X className="w-8 h-8" />
          </button>
          <img 
            src={activeImage} 
            alt="Full Zoom" 
            className="max-w-4xl max-h-[85vh] object-contain rounded-xl shadow-2xl" 
          />
        </div>
      )}

    </div>
  );
};
