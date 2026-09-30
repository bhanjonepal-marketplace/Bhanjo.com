import React, { useState } from 'react';
import { Star, Heart, ShoppingBag, Check, Trash2, Edit3 } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export const ProductCard = ({ product, onSelectProduct, onQuickAdd, onDeleteProduct, onEditProduct }) => {
  const { formatPrice, formatNPR, formatJPY } = useCurrency();
  const { toggleWishlist, isInWishlist, isAdmin } = useAuth();
  const { addToCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const retailPrice = product.samplePrice;
  const originalPrice = product.samplePrice * 1.4;
  const discountPercent = 30;
  const isFavorite = isInWishlist(product.id);

  const handleQuickAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1, 'retail');
    setJustAdded(true);
    if (onQuickAdd) onQuickAdd(product);
    setTimeout(() => setJustAdded(false), 1800);
  };

  return (
    <div 
      id={`product-card-${product.id}`}
      onClick={() => onSelectProduct(product.id)}
      className="bg-white rounded-xl border border-slate-200 hover:border-orange-400 hover:shadow-md transition-all duration-150 flex flex-col justify-between overflow-hidden cursor-pointer group relative"
    >
      {/* Product Image */}
      <div className="relative aspect-square bg-slate-100 overflow-hidden">
        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400'}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
        
        {product.isHimalayanExport && (
          <span className="absolute top-2 left-2 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs z-10">
            🇳🇵 Nepal
          </span>
        )}

        {(product.is1688Import || product.id?.startsWith('1688-') || product.isAlibabaImport || product.id?.startsWith('ali-')) && (
          <span className={`absolute top-2 left-2 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs z-10 flex items-center gap-0.5 ${
            isAdmin 
              ? (product.is1688Import || product.id?.startsWith('1688-') ? 'bg-[#E60012]' : 'bg-[#FF6A00]')
              : 'bg-gradient-to-r from-orange-600 to-amber-600'
          }`}>
            {isAdmin 
              ? (product.is1688Import || product.id?.startsWith('1688-') ? '🇨🇳 1688 Factory' : '🇨🇳 Alibaba Direct')
              : '✈️ Global Direct'
            }
          </span>
        )}

        <span className="absolute bottom-2 left-2 bg-[#F85606] text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs z-10">
          -{discountPercent}%
        </span>

        {/* Wishlist Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-2 right-2 p-1.5 rounded-full bg-white/90 backdrop-blur-xs shadow-sm hover:scale-110 transition z-10 ${
            isFavorite ? 'text-red-500' : 'text-slate-400 hover:text-red-500'
          }`}
          title={isFavorite ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-red-500' : ''}`} />
        </button>

        {/* Edit Price & SKU Button (Only visible in Admin Mode) */}
        {isAdmin && onEditProduct && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEditProduct(product);
            }}
            className="absolute top-2 right-9 p-1.5 rounded-full bg-white/90 backdrop-blur-xs shadow-sm hover:scale-110 text-slate-500 hover:text-[#F85606] hover:bg-orange-50 transition z-10 opacity-70 group-hover:opacity-100"
            title="Edit Price & SKU (Admin)"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Delete / Remove Product Button (Only visible in Admin Mode) */}
        {isAdmin && onDeleteProduct && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteProduct(product.id, e);
            }}
            className="absolute top-2 right-16 p-1.5 rounded-full bg-white/90 backdrop-blur-xs shadow-sm hover:scale-110 text-slate-400 hover:text-red-600 hover:bg-red-50 transition z-10 opacity-70 group-hover:opacity-100"
            title="Remove Product from Catalog (Admin)"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Quick Add To Cart Floating Button on Hover */}
        <button
          onClick={handleQuickAddToCart}
          className={`absolute bottom-2 right-2 p-2 rounded-full shadow-md transition-all duration-200 z-10 flex items-center justify-center ${
            justAdded 
              ? 'bg-emerald-600 text-white scale-105' 
              : 'bg-[#F85606] text-white opacity-90 group-hover:opacity-100 group-hover:scale-110 hover:bg-[#e04e05]'
          }`}
          title="Quick Add to Cart"
        >
          {justAdded ? (
            <Check className="w-3.5 h-3.5 stroke-3" />
          ) : (
            <ShoppingBag className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Details Container */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        
        <div>
          {/* Title */}
          <h3 
            className="text-xs font-medium text-slate-800 group-hover:text-[#F85606] transition line-clamp-2 leading-snug"
            title={product.title}
          >
            {product.title}
          </h3>

          {/* Pricing (Daraz & Multi-Currency Style: Nepali + Yen) */}
          <div className="mt-2">
            <div className="flex items-center justify-between gap-1 flex-wrap">
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span className="text-sm sm:text-base font-extrabold text-[#F85606]">
                  {formatPrice(retailPrice)}
                </span>
                <span className="text-[11px] text-slate-400 line-through">
                  {formatPrice(originalPrice)}
                </span>
              </div>
              {onEditProduct && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditProduct(product);
                  }}
                  className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 hover:text-[#F85606] bg-slate-100/80 hover:bg-orange-100/80 border border-slate-200/80 hover:border-orange-200 px-1.5 py-0.5 rounded transition cursor-pointer"
                  title="Edit Price & SKU"
                >
                  <Edit3 className="w-2.5 h-2.5" />
                  <span>Edit</span>
                </button>
              )}
            </div>
          </div>

          <div className="text-[10px] text-emerald-700 font-semibold mt-1 flex items-center justify-between">
            <span>Free Delivery</span>
            {product.alibabaBaseRate && (
              <span className="text-[9px] text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/60">
                2X Alibaba Rate
              </span>
            )}
          </div>
        </div>

        {/* Rating & Supplier Location */}
        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center text-amber-500 font-bold gap-0.5">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{product.rating}</span>
            <span className="text-slate-400 font-normal">({product.reviewsCount})</span>
          </div>

          <span className="text-[10px] text-slate-400 truncate max-w-[90px]">
            {product.supplierCountry}
          </span>
        </div>

      </div>
    </div>
  );
};
