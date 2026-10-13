import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  X, Star, MessageSquare, ShoppingCart, Truck, 
  RotateCcw, CheckCircle2, MapPin, Zap, ShieldCheck, 
  Heart, ZoomIn, Maximize2, Send, User, ThumbsUp, ThumbsDown, Camera, Image as ImageIcon, Trash2, Edit3, Save, Check, Store, SlidersHorizontal, Home, ArrowLeft, ChevronRight
} from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { SUPPLIERS } from '../data/suppliers';
import confetti from 'canvas-confetti';

export const cleanProductDescription = (desc, productTitle) => {
  if (!desc || typeof desc !== 'string') {
    return `Bhanjo Global Direct Quality Collection: ${productTitle || 'Premium Imported Product'}

OVERVIEW & SPECIFICATIONS:
• Quality Standard: Audited Premium Quality Standard
• Buyer Protection: Bhanjo 100% Safe Delivery & Quality Guarantee

LOGISTICS & DELIVERY TO NEPAL:
• Complete DDP (Delivered Duty Paid) Door-to-Door Delivery directly to Kathmandu Hub & all Nepal Provinces
• Customs Clearance, Import Tariffs, and Cross-Border Transit Fully Coordinated
• Estimated Courier Lead Time: 6-10 Days Express Delivery`;
  }

  let lines = desc.split('\n');
  let inForbiddenSection = false;
  let newLines = [];

  for (let line of lines) {
    const trimmed = line.trim();

    // Check section headers to omit
    if (/(FACTORY\s*&\s*SOURCING\s*DETAILS|MANUFACTURING\s*&\s*SUPPLIER\s*DETAILS)/i.test(trimmed)) {
      inForbiddenSection = true;
      continue;
    }
    if (/^(OVERVIEW\s*&\s*SPECIFICATIONS|LOGISTICS\s*&\s*DELIVERY|CUSTOMIZATION)/i.test(trimmed)) {
      inForbiddenSection = false;
    }

    if (inForbiddenSection) continue;

    // Strict omit: any mention of 1688, distributor, manufacturer, supplier names, factory RMB prices, wholesale margin
    if (/\b1688\b/i.test(line)) continue;
    if (/(distributor|manufactur|supplier|factory direct sku|verified direct|audited supplier|super factory)/i.test(line)) continue;
    if (/([¥￥]|RMB|Factory Base Price|Original Factory Price|Direct Sourcing Margin|Wholesale Tier Discounts)/i.test(line)) continue;
    if (/[\u4e00-\u9fa5]/.test(line)) continue;
    if (/(个体工商户|工作室|阿里巴巴|源头工厂|箱包厂|制造厂)/.test(line)) continue;

    // Clean up wording
    line = line.replace(/### Factory Direct/gi, '### Bhanjo Global Direct');
    line = line.replace(/Official (1688\.com|Global Direct\.com) Factory Direct SKU:/gi, 'Bhanjo Global Direct Quality SKU:');
    line = line.replace(/1688 Trade Escrow Guaranteed/gi, 'Bhanjo 100% Safe Delivery & Quality Guarantee');
    line = line.replace(/1688 Buyer Protection Guaranteed/gi, 'Bhanjo 100% Quality & Buyer Protection Guarantee');
    line = line.replace(/Guaranteed factory direct/gi, 'Guaranteed premium export');
    line = line.replace(/\(Global Direct Factory Direct\)/gi, '');
    line = line.replace(/\(Factory SKU #\d+\)/gi, '');
    line = line.replace(/\s*\([\u4e00-\u9fa5\s/,-]+\)/g, '');
    line = line.replace(/[\u4e00-\u9fa5]+/g, '').trim();

    if (line.trim()) {
      newLines.push(line);
    }
  }

  let cleaned = newLines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
  if (!cleaned || cleaned.length < 25) {
    cleaned = `### Bhanjo Global Direct: ${productTitle || 'Premium Imported Product'}

OVERVIEW & SPECIFICATIONS:
• Quality Standard: Audited Premium Export Standard
• Buyer Protection: Bhanjo 100% Safe Delivery & Quality Guarantee
• Door-to-Door Delivery: Handled directly to Kathmandu Hub & all Nepal Provinces
• Estimated Courier Lead Time: 6-10 Days Express Delivery`;
  }
  return cleaned;
};

export const cleanProductSpecs = (specs) => {
  if (!specs || typeof specs !== 'object') return {};
  const cleaned = {};
  const forbiddenKeyRegex = /(1688|source platform|factory price|base price|manufacturer|manufactur|distributor|supplier|store link|factory verification|production hub|wholesale moq)/i;

  for (let [k, v] of Object.entries(specs)) {
    if (forbiddenKeyRegex.test(k)) continue;

    // Rename Factory SKU to SKU Code
    if (/Factory SKU/i.test(k)) {
      k = 'SKU Code';
    }

    if (typeof v === 'string') {
      if (/\b1688\b/i.test(v)) continue;
      if (/([¥￥]|RMB)/.test(v)) continue;
      if (/(distributor|manufactur|super factory|个体工商户|工作室|阿里巴巴|源头工厂)/i.test(v)) continue;

      let cleanVal = v
        .replace(/\s*\([\u4e00-\u9fa5\s/,-]+\)/g, '')
        .replace(/[\u4e00-\u9fa5]+/g, '')
        .trim();
      
      if (!cleanVal) continue;

      if (/escrow protection/i.test(k)) {
        cleanVal = 'Bhanjo 100% Safe Delivery & Quality Guarantee';
      }
      if (/quality standard/i.test(k) && /1688/i.test(cleanVal)) {
        cleanVal = 'Audited Export Standard (CE / GB/T / ISO)';
      }
      cleaned[k] = cleanVal;
    } else {
      cleaned[k] = v;
    }
  }
  return cleaned;
};

export const ProductDetailModal = ({ 
  product, 
  onClose, 
  onOpenChat, 
  onOpenCart, 
  onRequireAuth, 
  onDeleteProduct, 
  onEditProduct,
  onBackToHome,
  onSelectCategory 
}) => {
  const { formatPrice, formatNPR, formatJPY } = useCurrency();
  const { addToCart } = useCart();
  const { user, toggleWishlist, isInWishlist, isAdmin } = useAuth();

  const handleGoHome = () => {
    if (onBackToHome) {
      onBackToHome();
    } else {
      onClose();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

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

  const specsRef = useRef(null);
  const scrollToSpecs = () => {
    if (specsRef.current) {
      specsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const retailPrice = currentPriceUSD;
  const originalPrice = currentPriceUSD * 1.4;

  const sanitizedDescription = useMemo(() => {
    return cleanProductDescription(product?.description, product?.title);
  }, [product?.description, product?.title]);

  const sanitizedSpecs = useMemo(() => {
    return cleanProductSpecs(product?.specs);
  }, [product?.specs]);

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

  // Reviews State (Strictly isolated by product.id)
  const [reviews, setReviews] = useState([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewAuthor, setNewReviewAuthor] = useState(user?.name || '');
  const [newReviewCity, setNewReviewCity] = useState(user?.city || 'Kathmandu');
  const [newReviewSentiment, setNewReviewSentiment] = useState('positive'); // 'positive' (Good Compliment) or 'critical' (Bad Compliment)
  const [newReviewImages, setNewReviewImages] = useState([]); // Up to 4 customer photos
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [previewReviewImage, setPreviewReviewImage] = useState(null); // Lightbox for customer photo
  const reviewFileInputRef = useRef(null);

  useEffect(() => {
    if (user?.name) setNewReviewAuthor(user.name);
    if (user?.city) setNewReviewCity(user.city);
  }, [user]);

  useEffect(() => {
    if (product) {
      setShowVideo(false);
      setActiveImage(product.images[0]);
      setOrderQuantity(1);
      setAddedSuccess(false);
      setReviewSuccess('');
      // STRICT ISOLATION: Instantly wipe out previous product's reviews
      // so Product 1 reviews NEVER bleed into or display under Product 2
      setReviews([]);
      setNewReviewImages([]);
      setPreviewReviewImage(null);

      // Fetch verified reviews from SQLite backend strictly for this product.id
      setIsLoadingReviews(true);
      fetch(`/api/reviews/${product.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && Array.isArray(data.reviews)) {
            setReviews(data.reviews);
          } else {
            setReviews([]);
          }
        })
        .catch(() => {
          setReviews([]);
        })
        .finally(() => setIsLoadingReviews(false));
    }
  }, [product?.id]);

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
    if (!user) {
      if (onRequireAuth) {
        onRequireAuth(
          () => {
            addToCart(product, orderQuantity, 'retail');
            setAddedSuccess(true);
            confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
            setTimeout(() => setAddedSuccess(false), 2500);
          },
          'Please login or sign up to add items to your Shopping Cart'
        );
      }
      return;
    }
    addToCart(product, orderQuantity, 'retail');
    setAddedSuccess(true);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
    setTimeout(() => setAddedSuccess(false), 2500);
  };

  const handleBuyNow = () => {
    if (!user) {
      if (onRequireAuth) {
        onRequireAuth(
          () => {
            addToCart(product, orderQuantity, 'retail');
            onClose();
            if (onOpenCart) onOpenCart();
          },
          'Please login or sign up to complete your purchase'
        );
      }
      return;
    }
    addToCart(product, orderQuantity, 'retail');
    onClose();
    if (onOpenCart) onOpenCart();
  };

  const handleReviewImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (newReviewImages.length + files.length > 4) {
      alert('You can upload a maximum of 4 photos per review.');
      return;
    }

    files.forEach(file => {
      if (file.size > 2.5 * 1024 * 1024) {
        alert(`Photo "${file.name}" is larger than 2.5MB. Please choose a smaller photo.`);
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setNewReviewImages(prev => {
          if (prev.length >= 4) return prev;
          return [...prev, uploadEvent.target.result];
        });
      };
      reader.readAsDataURL(file);
    });

    if (reviewFileInputRef.current) reviewFileInputRef.current.value = '';
  };

  const handleRemoveReviewImage = (indexToRemove) => {
    setNewReviewImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      if (onRequireAuth) {
        onRequireAuth(null, 'Please sign in or register to submit a verified product review with photos');
      }
      return;
    }
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
          comment: newReviewComment.trim(),
          images: newReviewImages,
          sentiment: newReviewSentiment
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        const newRev = data.review || {
          id: `rev-${Date.now()}`,
          product_id: product.id,
          user_name: authorName,
          user_city: newReviewCity,
          rating: newReviewRating,
          comment: newReviewComment.trim(),
          images: newReviewImages,
          sentiment: newReviewSentiment,
          is_verified: 1,
          created_at: new Date().toISOString()
        };
        // Insert review at top for this product
        setReviews(prev => [newRev, ...prev]);
        setNewReviewComment('');
        setNewReviewImages([]);
        setReviewSuccess('Thank you! Your verified review and photos have been posted for this product.');
        confetti({ particleCount: 40, spread: 50 });
        setTimeout(() => setReviewSuccess(''), 4500);
      }
    } catch (err) {
      console.log('Error adding review:', err);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 pt-4 sm:pt-8 pb-4 sm:pb-8 animate-in fade-in duration-150">
      
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 relative flex flex-col pb-16 sm:pb-0">
        
        {/* Top Header - Spacious & Gracefully Shifted Downward */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-4 sm:px-6 pt-5 sm:pt-6 pb-3.5 sm:pb-4 border-b border-slate-200/80 flex items-center justify-between gap-3 sm:gap-4 flex-wrap">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap min-w-0">
            {/* Styled "Back to Home" Button */}
            <button
              type="button"
              onClick={handleGoHome}
              className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 bg-gradient-to-r from-orange-50 via-amber-50 to-orange-100/80 hover:from-orange-100 hover:to-orange-200 text-[#F85606] font-bold text-xs sm:text-[13px] rounded-xl border border-orange-200/90 hover:border-orange-300 shadow-2xs transition-all cursor-pointer group active:scale-95 select-none"
              title="Return to Bhanjo Home Page"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.5] transition-transform group-hover:-translate-x-0.5 text-[#F85606]" />
              <div className="w-px h-3.5 bg-orange-300/70" />
              <Home className="w-3.5 h-3.5 stroke-[2] fill-orange-500/20 text-[#F85606]" />
              <span>Back to Home</span>
            </button>

            {/* Breadcrumb separator and Category Button */}
            {product.categoryName && (
              <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                <ChevronRight className="w-4 h-4 text-slate-300 hidden sm:block flex-shrink-0" />
                <button
                  type="button"
                  onClick={() => {
                    if (onSelectCategory && (product.categoryId || product.category)) {
                      onSelectCategory(product.categoryId || product.category);
                    }
                  }}
                  className="font-semibold text-xs sm:text-[13px] text-slate-700 hover:text-[#F85606] transition cursor-pointer truncate max-w-[200px] sm:max-w-[340px] bg-slate-50 hover:bg-orange-50 px-3 py-2 rounded-xl border border-slate-200/80 hover:border-orange-200 shadow-2xs flex items-center gap-1.5"
                  title={`View ${product.categoryName}`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />
                  <span className="truncate">{product.categoryName}</span>
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Wishlist Button */}
            <button
              onClick={() => {
                if (!user) {
                  if (onRequireAuth) {
                    onRequireAuth(
                      () => toggleWishlist(product),
                      'Please login or sign up to save items to your Wishlist'
                    );
                  }
                  return;
                }
                toggleWishlist(product);
              }}
              className={`px-3 sm:px-3.5 py-2 rounded-xl border transition flex items-center gap-1.5 text-xs sm:text-[13px] font-semibold cursor-pointer shadow-2xs active:scale-95 ${
                isFavorite 
                  ? 'border-red-300 bg-red-50 text-red-600 shadow-red-100' 
                  : 'border-slate-200/90 text-slate-700 bg-white hover:text-red-600 hover:border-red-200 hover:bg-red-50/50'
              }`}
              title={isFavorite ? "Remove from Wishlist" : "Add to Wishlist"}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-500'}`} />
              <span className="hidden sm:inline">{isFavorite ? 'Saved' : 'Wishlist'}</span>
            </button>

            {/* Delete Product Button (Admin Only) */}
            {isAdmin && onDeleteProduct && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                  onDeleteProduct(product.id, e);
                }}
                className="px-3 py-2 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 transition flex items-center gap-1.5 text-xs sm:text-[13px] font-bold cursor-pointer hover:border-red-300 active:scale-95 shadow-2xs"
                title="Permanently remove this product from Bhanjo.com"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-600" />
                <span className="hidden sm:inline">Delete Product</span>
              </button>
            )}

            {/* Modern Close Button */}
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-800 bg-slate-100/70 hover:bg-slate-200/80 transition cursor-pointer active:scale-95"
              title="Close"
            >
              <X className="w-5 h-5 stroke-[2]" />
            </button>
          </div>
        </div>

        {/* 2-Column Taobao Layout with Spacious Breathing Room */}
        <div className="p-5 sm:p-6 lg:p-7 grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-8">
          
          {/* Col 1: Photo Gallery with Vertical Thumbnails on Left (lg: 5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-2.5">
            <div className="flex gap-2 sm:gap-2.5 items-start">
              
              {/* Vertical Thumbnails Column on the Left (matching 2nd photo) */}
              <div className="flex flex-col gap-2 max-h-[380px] overflow-y-auto no-scrollbar py-0.5 flex-shrink-0 w-12 sm:w-14">
                {product.videoUrl && (
                  <button
                    type="button"
                    onClick={() => setShowVideo(true)}
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden border-2 flex-shrink-0 transition bg-slate-950 flex flex-col items-center justify-center relative cursor-pointer ${
                      showVideo ? 'border-[#FF5000] ring-2 ring-orange-400' : 'border-slate-200 opacity-80 hover:opacity-100'
                    }`}
                    title="Play Product Showcase Video"
                  >
                    <div className="w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center text-[8px] font-bold shadow-xs">
                      ▶
                    </div>
                    <span className="text-[8px] font-bold mt-0.5 text-white">Video</span>
                  </button>
                )}

                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onMouseEnter={() => {
                      setShowVideo(false);
                      setActiveImage(img);
                    }}
                    onClick={() => {
                      setShowVideo(false);
                      setActiveImage(img);
                    }}
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden border-2 flex-shrink-0 transition bg-slate-50 cursor-pointer ${
                      !showVideo && activeImage === img 
                        ? 'border-[#FF5000] ring-1 ring-[#FF5000] shadow-xs scale-102' 
                        : 'border-slate-200 opacity-75 hover:opacity-100'
                    }`}
                    title={`View Photo ${idx + 1}`}
                  >
                    <img 
                      src={img} 
                      alt={`Thumbnail ${idx + 1}`} 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        e.target.src = product.images[0];
                      }}
                    />
                  </button>
                ))}

                {/* Parameters icon button at bottom of vertical thumbnails column (matching 2nd photo) */}
                <button
                  type="button"
                  onClick={scrollToSpecs}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl border border-slate-200 bg-slate-50 hover:bg-orange-50 text-slate-500 hover:text-[#FF5000] flex flex-col items-center justify-center transition cursor-pointer flex-shrink-0"
                  title="View product specifications & parameters"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span className="text-[8px] font-bold mt-0.5">Parameters</span>
                </button>
              </div>

              {/* Main Product Preview Photo (Centered next to vertical thumbnails) */}
              <div className="flex-1 min-w-0">
                {showVideo && product.videoUrl ? (
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-black flex items-center justify-center border border-slate-200 shadow-xs">
                    <video
                      src={product.videoUrl}
                      controls
                      autoPlay
                      muted
                      playsInline
                      loop
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div 
                    ref={imageContainerRef}
                    onMouseEnter={() => setIsZoomed(true)}
                    onMouseLeave={() => setIsZoomed(false)}
                    onMouseMove={handleMouseMove}
                    onClick={() => setIsLightboxOpen(true)}
                    className="relative aspect-square rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 cursor-crosshair group select-none shadow-2xs"
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
                      <span className="absolute top-2.5 left-2.5 bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-xs z-10">
                        🇳🇵 Nepal Authentic
                      </span>
                    )}

                    {product.isAlibabaImport && (
                      <span className="absolute top-2.5 left-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-xs z-10 flex items-center gap-1">
                        <span>✈️ Bhanjo Global Direct</span>
                      </span>
                    )}

                    {/* Click to Expand Lightbox Hint */}
                    <div className="absolute bottom-2.5 right-2.5 bg-black/60 text-white text-[10px] px-2 py-1 rounded-lg backdrop-blur-xs flex items-center gap-1 opacity-80 group-hover:opacity-100 transition z-10">
                      <Maximize2 className="w-3 h-3" />
                      <span>Full Zoom</span>
                    </div>
                  </div>
                )}

                {/* Tabs below main photo (matching 2nd photo: Photo gallery / Parameters) */}
                <div className="flex items-center justify-center gap-2.5 mt-2.5">
                  <button
                    type="button"
                    onClick={() => setShowVideo(false)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                      !showVideo ? 'bg-slate-100 text-slate-800 shadow-2xs' : 'text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    Photo gallery
                  </button>
                  <button
                    type="button"
                    onClick={scrollToSpecs}
                    className="px-3 py-1 rounded-full text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
                  >
                    Parameters
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Col 2: Taobao-Style Details, Price Banner, Variants & Actions (lg: 7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-3">
            <div>
              {/* Store Header Strip (matching 2nd photo) */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 flex-wrap gap-2">
                <div className="flex items-center gap-1.5 text-xs text-slate-800 font-bold">
                  <div className="w-5 h-5 rounded-md bg-black text-white flex items-center justify-center text-[10px] font-black">
                    B
                  </div>
                  <span className="hover:text-[#FF5000] cursor-pointer">Bhanjo.com Official Store</span>
                  <span className="text-slate-300">&gt;</span>
                  <span className="bg-[#E52B20] text-white text-[9px] font-black px-1.5 py-0.2 rounded-xs">Tmall</span>
                  <span className="text-amber-500 font-bold text-xs flex items-center gap-0.5">★ {product.rating}</span>
                  <span className="text-slate-400 text-[10px] hidden sm:inline">Positive: 99.8%</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      onClose();
                      onOpenChat(product);
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-slate-700 bg-slate-100 hover:bg-orange-50 hover:text-[#FF5000] rounded-lg transition border border-slate-200 cursor-pointer"
                  >
                    <MessageSquare className="w-3 h-3 text-[#FF5000]" />
                    <span>Customer service</span>
                  </button>
                  <button
                    onClick={onClose}
                    className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                  >
                    <span>Enter shop</span>
                  </button>
                </div>
              </div>

              {/* Product Title & Sub-Stats (matching 2nd photo) */}
              <div className="mt-2.5">
                <h1 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
                  {(product.title || '').replace(/\[?1688\s*Direct\]?\s*/gi, '').trim()}
                </h1>

                {product.nepaliTitle && (
                  <p className="text-xs text-[#FF5000] font-semibold mt-0.5">
                    {product.nepaliTitle}
                  </p>
                )}

                <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1 flex-wrap font-medium">
                  <span className="text-red-500 font-semibold">Sold for 100,000+ units</span>
                  <span>|</span>
                  <span>Invoices available</span>
                  <span>|</span>
                  <span>{product.reviewsCount + reviews.length} verified buyer ratings</span>
                </div>
              </div>

              {/* Taobao Flash Sale / Super Deal Price Banner (EXACTLY matching 2nd photo) */}
              <div className="mt-3 relative rounded-xl overflow-hidden bg-gradient-to-r from-[#E52B20] via-[#FF4D00] to-[#FF5000] text-white p-3 shadow-sm">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black tracking-tight drop-shadow-2xs">
                      {formatPrice(retailPrice)}
                    </span>
                    <span className="text-xs text-white/70 line-through">
                      {formatPrice(originalPrice)}
                    </span>
                    <span className="bg-white/20 backdrop-blur-xs text-white text-[10px] font-black px-1.5 py-0.5 rounded">
                      -30% Off
                    </span>
                  </div>

                  <div className="text-right">
                    <div className="text-[11px] font-black uppercase tracking-wider text-amber-200">
                      Bhanjo Flash Sale · Super 88
                    </div>
                    <div className="text-[10px] text-white/90 font-medium">
                      Lowest prices across the internet
                    </div>
                  </div>
                </div>

                {/* Inline Quick Price Editor Form (Admin Only) */}
                {isAdmin && (
                  <div className="mt-2 pt-2 border-t border-white/20 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-orange-100 font-semibold">Admin Pricing Mode</span>
                    <button
                      type="button"
                      onClick={() => setIsEditingInlinePrice(!isEditingInlinePrice)}
                      className="px-2 py-0.5 bg-white text-[#E52B20] font-black text-[10px] rounded hover:bg-amber-50 transition cursor-pointer"
                    >
                      {isEditingInlinePrice ? 'Close Editor' : 'Edit Price (Admin)'}
                    </button>
                  </div>
                )}
              </div>

              {/* Admin Live Price Editor drawer if expanded */}
              {isAdmin && isEditingInlinePrice && (
                <div className="mt-2 bg-orange-50/90 border border-orange-200 p-3 rounded-xl space-y-2 text-xs animate-in fade-in">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-600 font-bold block mb-1">NPR Price:</label>
                      <input
                        type="number"
                        value={inlinePriceNPR}
                        onChange={(e) => {
                          const val = e.target.value;
                          setInlinePriceNPR(val);
                          const num = parseFloat(val);
                          if (!isNaN(num) && num > 0) setInlinePriceUSD((num / 133.5).toFixed(2));
                        }}
                        className="w-full px-2 py-1 bg-white border border-slate-300 rounded font-bold text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-600 font-bold block mb-1">USD Price:</label>
                      <input
                        type="number"
                        value={inlinePriceUSD}
                        onChange={(e) => {
                          const val = e.target.value;
                          setInlinePriceUSD(val);
                          const num = parseFloat(val);
                          if (!isNaN(num) && num > 0) setInlinePriceNPR(Math.round(num * 133.5).toString());
                        }}
                        className="w-full px-2 py-1 bg-white border border-slate-300 rounded font-bold text-xs"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsEditingInlinePrice(false)}
                      className="px-2.5 py-1 text-slate-600 font-semibold text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={isSavingInlinePrice}
                      onClick={handleSaveInlinePrice}
                      className="px-3 py-1 bg-[#FF5000] text-white font-bold text-xs rounded shadow-xs"
                    >
                      {isSavingInlinePrice ? 'Saving...' : 'Save Price'}
                    </button>
                  </div>
                </div>
              )}

              {/* Delivery & Logistics info strip (matching 2nd photo) */}
              <div className="mt-3 space-y-1.5 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span>Estimated delivery within 24-48 hours • Door-to-Door Delivery in Nepal</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                  <span>14-day price guarantee • 7-day no-questions-asked returns</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>Cash on Delivery (COD) & Online Escrow Payment available</span>
                </div>
              </div>

              {/* Color classification / Options with visual swatches (matching 2nd photo) */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-700">Color classification</span>
                  <span className="text-[11px] text-slate-400 font-medium">Switch to large image mode</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {(product.variants || ['Standard', 'Premium Quality', 'Gift Packaging']).map((v, idx) => (
                    <button
                      key={v}
                      onClick={() => setSelectedVariant(v)}
                      className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-xl border transition cursor-pointer ${
                        selectedVariant === v
                          ? 'border-[#FF5000] bg-orange-50 text-[#FF5000] font-bold shadow-2xs ring-1 ring-[#FF5000]'
                          : 'border-slate-200 text-slate-700 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <img
                        src={product.images[idx % product.images.length]}
                        alt={v}
                        className="w-5 h-5 rounded object-cover flex-shrink-0"
                      />
                      <span>{v}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Stepper (matching 2nd photo) */}
              <div className="mt-3 flex items-center gap-3 text-xs">
                <span className="text-slate-600 font-semibold">Quantity</span>
                <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white">
                  <button
                    onClick={() => setOrderQuantity(Math.max(1, orderQuantity - 1))}
                    className="px-2.5 py-0.5 bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 cursor-pointer"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={orderQuantity}
                    onChange={(e) => setOrderQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-10 text-center text-xs font-bold py-0.5 focus:outline-none"
                  />
                  <button
                    onClick={() => setOrderQuantity(orderQuantity + 1)}
                    className="px-2.5 py-0.5 bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 cursor-pointer"
                  >
                    +
                  </button>
                </div>
                <span className="text-slate-400 text-[11px]">In stock (limit 100 pieces)</span>
              </div>
            </div>

            {/* Combined Action Buttons Row: [Add to Cart] + [Buy Now] + [Collection] (matching 2nd photo) */}
            <div className="pt-2">
              {addedSuccess && (
                <div className="mb-2 bg-emerald-50 text-emerald-700 text-xs font-bold p-1.5 rounded-lg border border-emerald-200 text-center animate-in fade-in">
                  ✓ Item added to Cart!
                </div>
              )}

              <div className="flex items-center gap-2.5">
                <div className="flex-1 flex rounded-xl overflow-hidden shadow-sm">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="flex-1 py-2.5 px-4 bg-gradient-to-r from-[#FF9500] to-[#FF7A00] hover:opacity-95 text-white font-extrabold text-xs sm:text-sm transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to cart</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className="flex-1 py-2.5 px-4 bg-gradient-to-r from-[#FF5000] to-[#E52B20] hover:opacity-95 text-white font-extrabold text-xs sm:text-sm transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                  >
                    <Zap className="w-4 h-4 fill-white" />
                    <span>Buy now</span>
                  </button>
                </div>

                {/* Collection / Wishlist Icon Button (matching 2nd photo) */}
                <button
                  type="button"
                  onClick={() => {
                    if (!user && onRequireAuth) {
                      onRequireAuth(() => toggleWishlist(product), 'Please login to save items to collection');
                      return;
                    }
                    toggleWishlist(product);
                  }}
                  className={`flex flex-col items-center justify-center px-3.5 py-1.5 rounded-xl border transition cursor-pointer flex-shrink-0 ${
                    isFavorite 
                      ? 'border-red-200 bg-red-50 text-red-600' 
                      : 'border-slate-200 text-slate-600 hover:text-[#FF5000] hover:border-orange-200 bg-white'
                  }`}
                  title={isFavorite ? "Remove from Collection" : "Add to Collection"}
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                  <span className="text-[10px] font-bold mt-0.5">Collection</span>
                </button>
              </div>

              {/* Admin delete button if admin is active */}
              {isAdmin && onDeleteProduct && (
                <div className="mt-2 pt-2 border-t border-slate-100 flex justify-end">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onClose();
                      onDeleteProduct(product.id, e);
                    }}
                    className="text-[11px] text-red-600 hover:text-red-700 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Delete Product (Admin)</span>
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>


        {/* Specifications Tab */}
        <div ref={specsRef} className="px-5 pb-5 border-t border-slate-200 pt-4">
          <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider mb-2">
            Product Details & Specifications
          </h3>
          <div className="text-xs text-slate-600 mb-4 whitespace-pre-line leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
            {sanitizedDescription}
          </div>
          {Object.keys(sanitizedSpecs).length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {Object.entries(sanitizedSpecs).map(([k, v], idx) => (
                <div key={idx} className="flex border-b border-slate-100 py-1.5">
                  <span className="w-44 text-slate-500 font-medium flex-shrink-0">{k}:</span>
                  <span className="text-slate-800 font-semibold">{v}</span>
                </div>
              ))}
            </div>
          )}
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
          {!user ? (
            <div className="bg-white p-4 rounded-xl border border-dashed border-orange-200 mb-4 text-xs flex flex-col sm:flex-row items-center justify-between gap-3 bg-gradient-to-r from-orange-50/50 to-amber-50/30">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-orange-100 text-[#F85606] flex items-center justify-center font-bold flex-shrink-0">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-800">Purchased or tried this product?</div>
                  <div className="text-[11px] text-slate-500">Sign in to your Bhanjo account to post compliments, constructive feedback & photos.</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onRequireAuth ? onRequireAuth(null, 'Please sign in to post a verified review & upload photos') : null}
                className="bg-[#F85606] hover:bg-[#e04e05] text-white font-bold px-4 py-1.5 rounded-lg transition whitespace-nowrap shadow-xs cursor-pointer"
              >
                Sign In to Review
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitReview} className="bg-white p-4 rounded-xl border border-slate-200 mb-4 text-xs space-y-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="font-bold text-slate-800">Write a Review for this Product:</div>
                <div className="text-[10px] text-slate-400">Authenticated Buyer: <span className="font-semibold text-slate-600">{user.name || user.email}</span></div>
              </div>

              {reviewSuccess && (
                <div className="p-2.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{reviewSuccess}</span>
                </div>
              )}

              {/* Good Compliment vs Critical Feedback Toggle */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-0.5">
                <span className="text-slate-600 font-semibold text-[11px]">Experience Tone:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setNewReviewSentiment('positive')}
                    className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold flex items-center gap-1 transition cursor-pointer ${
                      newReviewSentiment === 'positive'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-1 ring-emerald-300'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <ThumbsUp className="w-3 h-3 text-emerald-600" />
                    <span>Good Compliment (Praise)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewReviewSentiment('critical')}
                    className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold flex items-center gap-1 transition cursor-pointer ${
                      newReviewSentiment === 'critical'
                        ? 'bg-rose-50 text-rose-800 border-rose-300 ring-1 ring-rose-300'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <ThumbsDown className="w-3 h-3 text-rose-600" />
                    <span>Critical / Needs Improvement</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-600 font-semibold">Your Rating:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewReviewRating(star)}
                      className="p-1 text-amber-400 hover:scale-125 transition cursor-pointer"
                    >
                      <Star className={`w-4 h-4 ${star <= newReviewRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                    </button>
                  ))}
                </div>
                <span className="text-[11px] font-semibold text-slate-500 ml-1">
                  {newReviewRating === 5 ? 'Exceptional' : newReviewRating === 4 ? 'Very Good' : newReviewRating === 3 ? 'Average' : newReviewRating === 2 ? 'Below Expectations' : 'Poor Quality'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Your Display Name"
                  value={newReviewAuthor}
                  onChange={(e) => setNewReviewAuthor(e.target.value)}
                  className="px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:border-[#F85606]"
                />
                <input
                  type="text"
                  placeholder="City (e.g. Kathmandu, Pokhara, Butwal)"
                  value={newReviewCity}
                  onChange={(e) => setNewReviewCity(e.target.value)}
                  className="px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:border-[#F85606]"
                />
              </div>

              <textarea
                rows="2"
                required
                placeholder="Share your experience with this item (product quality, durability, delivery speed, packaging)..."
                value={newReviewComment}
                onChange={(e) => setNewReviewComment(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#F85606]"
              ></textarea>

              {/* Photo Upload Area */}
              <div>
                <input 
                  type="file" 
                  ref={reviewFileInputRef} 
                  accept="image/*" 
                  multiple 
                  onChange={handleReviewImageUpload} 
                  className="hidden" 
                />
                
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => reviewFileInputRef.current?.click()}
                    disabled={newReviewImages.length >= 4}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-dashed border-slate-300 rounded-lg hover:border-[#F85606] hover:bg-orange-50/50 text-slate-600 hover:text-[#F85606] transition text-[11px] font-semibold cursor-pointer disabled:opacity-50"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Attach Photos ({newReviewImages.length}/4)</span>
                  </button>
                  <span className="text-[10px] text-slate-400">Max 4 photos (JPG, PNG, WebP)</span>
                </div>

                {/* Attached Images Previews */}
                {newReviewImages.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap pt-2">
                    {newReviewImages.map((img, idx) => (
                      <div key={idx} className="relative group w-14 h-14 rounded-lg overflow-hidden border border-slate-200 shadow-2xs">
                        <img src={img} alt="Upload preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveReviewImage(idx)}
                          className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-rose-600 transition cursor-pointer"
                          title="Remove Photo"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="bg-[#F85606] hover:bg-[#e04e05] text-white font-bold px-4 py-1.5 rounded-lg transition flex items-center gap-1 disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmittingReview ? 'Submitting...' : 'Submit Review'}</span>
                </button>
              </div>
            </form>
          )}

          {/* Reviews List */}
          <div className="space-y-2.5">
            {isLoadingReviews ? (
              <div className="text-center py-6 text-slate-400 text-xs flex items-center justify-center gap-2">
                <div className="w-3.5 h-3.5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                <span>Loading verified reviews for this product...</span>
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs bg-white rounded-xl border border-slate-200">
                No customer reviews yet for this product. Be the first verified customer to share photos and feedback!
              </div>
            ) : (
              reviews.map((rev) => (
                <div key={rev.id} className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-between flex-wrap gap-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="w-6 h-6 rounded-full bg-orange-100 text-[#F85606] font-bold flex items-center justify-center text-[10px]">
                        {rev.user_name ? rev.user_name[0].toUpperCase() : 'U'}
                      </div>
                      <span className="font-bold text-slate-900">{rev.user_name}</span>
                      <span className="text-[10px] text-slate-400">({rev.user_city || 'Nepal'})</span>
                      
                      {rev.is_verified && (
                        <span className="bg-emerald-50 text-emerald-700 text-[9px] font-bold px-1.5 py-0.5 rounded border border-emerald-200 flex items-center gap-0.5">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          <span>Verified Purchase</span>
                        </span>
                      )}

                      {/* Compliment / Feedback Badge */}
                      {rev.sentiment === 'critical' ? (
                        <span className="bg-rose-50 text-rose-700 text-[9px] font-bold px-1.5 py-0.5 rounded border border-rose-200 flex items-center gap-0.5">
                          <ThumbsDown className="w-2.5 h-2.5 text-rose-600" />
                          <span>Critical Feedback</span>
                        </span>
                      ) : (
                        <span className="bg-emerald-50 text-emerald-700 text-[9px] font-bold px-1.5 py-0.5 rounded border border-emerald-200 flex items-center gap-0.5">
                          <ThumbsUp className="w-2.5 h-2.5 text-emerald-600" />
                          <span>Good Compliment</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center text-amber-400">
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>

                  <p className="text-slate-700 pl-8 text-[11px] leading-relaxed">
                    {rev.comment}
                  </p>

                  {/* Customer Photos Gallery */}
                  {rev.images && Array.isArray(rev.images) && rev.images.length > 0 && (
                    <div className="pl-8 pt-1 flex items-center gap-2 flex-wrap">
                      {rev.images.map((imgSrc, imgIdx) => (
                        <div 
                          key={imgIdx} 
                          onClick={() => setPreviewReviewImage(imgSrc)}
                          className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden border border-slate-200 hover:border-[#F85606] hover:scale-105 transition cursor-pointer shadow-2xs group relative"
                          title="Click to zoom customer photo"
                        >
                          <img src={imgSrc} alt={`Customer review photo ${imgIdx + 1}`} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition flex items-center justify-center">
                            <ZoomIn className="w-3.5 h-3.5 text-white opacity-0 group-hover:opacity-100 transition drop-shadow-md" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Bhanjo-Style Mobile Sticky Bottom Action Bar (Fixed to bottom of screen on mobile) */}
      <div 
        className="fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 flex items-center justify-between gap-2 shadow-[0_-4px_25px_rgba(0,0,0,0.12)] sm:hidden"
        style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
      >
        {/* Store & Chat Quick Icons */}
        <div className="flex items-center gap-1">
          <button 
            type="button"
            onClick={onClose}
            className="flex flex-col items-center justify-center px-2 py-1 text-slate-600 hover:text-[#F85606] transition active:scale-95 cursor-pointer"
            title="Visit Bhanjo Official Store"
          >
            <Store className="w-4 h-4 text-slate-700" />
            <span className="text-[9px] font-bold mt-0.5 text-slate-600">Store</span>
          </button>
          <button 
            type="button"
            onClick={() => {
              onClose();
              if (onOpenChat) onOpenChat(product);
            }}
            className="flex flex-col items-center justify-center px-2 py-1 text-slate-600 hover:text-[#F85606] transition active:scale-95 cursor-pointer"
            title="Chat with Bhanjo Support"
          >
            <MessageSquare className="w-4 h-4 text-[#F85606]" />
            <span className="text-[9px] font-bold mt-0.5 text-slate-600">Chat</span>
          </button>
        </div>

        {/* Split Action Buttons: Add to Cart + Buy Now */}
        <div className="flex items-center gap-2 flex-1 max-w-[280px]">
          <button
            type="button"
            onClick={handleAddToCart}
            className="flex-1 bg-[#FFB703] hover:bg-[#FFA200] active:scale-95 text-slate-900 font-extrabold text-xs py-2.5 px-2 rounded-xl transition flex items-center justify-center gap-1 shadow-xs cursor-pointer"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Add to Cart</span>
          </button>
          <button
            type="button"
            onClick={handleBuyNow}
            className="flex-1 bg-[#F85606] hover:bg-[#E04E05] active:scale-95 text-white font-extrabold text-xs py-2.5 px-2 rounded-xl transition flex items-center justify-center gap-1 shadow-sm cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-white" />
            <span>Buy Now</span>
          </button>
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

      {/* Customer Review Photo Zoom Modal */}
      {previewReviewImage && (
        <div 
          onClick={() => setPreviewReviewImage(null)}
          className="fixed inset-0 z-70 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
        >
          <div 
            className="relative max-w-2xl max-h-[85vh] bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl p-2.5 flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setPreviewReviewImage(null)}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black/95 transition cursor-pointer"
              title="Close Preview"
            >
              <X className="w-4 h-4" />
            </button>
            <img 
              src={previewReviewImage} 
              alt="Customer Review Photo" 
              className="max-w-full max-h-[75vh] object-contain rounded-xl" 
            />
            <div className="text-center pt-2 pb-1 text-xs text-slate-300 font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Customer Uploaded Photo • Verified Nepali Buyer Review</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
