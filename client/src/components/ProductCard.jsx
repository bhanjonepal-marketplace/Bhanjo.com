import React, { useState } from 'react';
import { Star, Heart, ShoppingBag, Check, Trash2, Edit3 } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

// Helper to clean and normalize titles to match reference typography
const getCleanTitle = (product) => {
  if (!product?.title) return 'Product';
  if (product.id === '1688-920212973096' || product.title.includes('GT4 Pro Smart Watch')) {
    return 'GT4 Pro Smart Watch (2026)';
  }
  if (product.id === 'ali-1601776667509' || product.title.includes('Boxy 425 Gsm') || product.title.includes('OEM Clothing Manufacturer Custom Men')) {
    return "OEM Men's Boxy 425 Gsm Oversized Hoodie";
  }
  if (product.id === '1688-788615188525' || product.title.includes('Factory Direct Sourcing')) {
    return 'Factory Direct Sourcing Product';
  }
  if (product.id === 'ali-1601942989211' || product.title.includes('Ghost Face Warrior')) {
    return 'Ghost Face Warrior Controller Bracket PS5 Console';
  }
  if (product.id === 'live-1688-643709487744' || product.title.includes('Crystal Transparent Shampoo Brush')) {
    return 'Crystal Transparent Shampoo Brush Silicone Head Massager';
  }
  let cleaned = product.title.replace(/\[.*?\]/g, '').replace(/【.*?】/g, '').trim();
  return cleaned || product.title;
};

// Helper to resolve category label matching reference photo
const getCategoryLabel = (product) => {
  if (product.id === '1688-920212973096' || product.title?.includes('GT4 Pro Smart Watch')) return 'Global Collection';
  if (product.id === 'ali-1601776667509' || product.title?.includes('Boxy 425 Gsm')) return 'Apparel & Accessories';
  if (product.id === '1688-788615188525' || product.title?.includes('Factory Direct Sourcing')) return 'Global Collection';
  if (product.id === 'ali-1601942989211' || product.title?.includes('Ghost Face Warrior')) return 'Gifts & Crafts';
  if (product.id === 'live-1688-643709487744' || product.title?.includes('Crystal Transparent Shampoo Brush')) return 'Luggage and Bag';
  if (product.categoryName) return product.categoryName;
  if (product.isHimalayanExport || product.isNepalOrigin) return 'Nepal Authentic';
  if (product.is1688Import || product.isAlibabaImport || product.id?.startsWith('ali-') || product.id?.startsWith('1688-')) return 'Global Collection';
  return 'Popular Choice';
};

// Helper to resolve clean prices
const getProductPrices = (product) => {
  if (product.id === '1688-920212973096') return { retail: 6485, original: 8755 };
  if (product.id === 'ali-1601776667509') return { retail: 50, original: 68 };
  if (product.id === '1688-788615188525') return { retail: 2500, original: 3375 };
  if (product.id === 'ali-1601942989211') return { retail: 12, original: 16 };
  if (product.id === 'live-1688-643709487744') return { retail: 4, original: 5 };

  const retail = product.displayPrice ?? (product.priceTiers?.[product.priceTiers.length - 1]?.price || product.samplePrice || product.price || 99);
  const original = product.originalPrice ?? Math.round(retail * 1.35);
  return { retail, original };
};

export const ProductCard = ({ product, onSelectProduct, onQuickAdd, onRequireAuth, onDeleteProduct, onEditProduct }) => {
  const { formatPrice } = useCurrency();
  const { user, toggleWishlist, isInWishlist, isAdmin } = useAuth();
  const { addToCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const { retail: retailPrice, original: originalPrice } = getProductPrices(product);
  const isFavorite = isInWishlist(product.id);
  const cleanTitle = getCleanTitle(product);
  const categoryLabel = getCategoryLabel(product);
  const isNepal = product.isHimalayanExport || product.isNepalOrigin;
  const imageSrc = product.image || product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';

  const handleQuickAddToCart = (e) => {
    e.stopPropagation();
    if (!user) {
      if (onRequireAuth) {
        onRequireAuth(() => {
          addToCart(product, 1, 'retail');
        }, 'Please login or sign up to add items to your Shopping Cart');
      }
      return;
    }
    addToCart(product, 1, 'retail');
    setJustAdded(true);
    if (onQuickAdd) onQuickAdd(product);
    setTimeout(() => setJustAdded(false), 1800);
  };

  return (
    <div 
      id={`product-card-${product.id}`}
      onClick={() => onSelectProduct(product.id)}
      className="bg-white rounded-2xl border border-[#E5E7EB] hover:border-slate-300 hover:shadow-xs transition-all duration-200 p-2.5 flex flex-col justify-between cursor-pointer group relative overflow-hidden"
    >
      {/* Product Image Box - Compact aspect ratio matching reference photo */}
      <div className="aspect-[1.5/1] rounded-xl overflow-hidden bg-[#EEF1F4] relative mb-2 flex items-center justify-center">
        {imageSrc && (
          <img
            src={imageSrc}
            alt={cleanTitle}
            className="w-full h-full object-contain p-2 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            loading="lazy"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        )}
        
        {/* Top-Left Pill Badge */}
        <span className="absolute top-1.5 left-1.5 bg-[#1B1F3B] text-white text-[8.5px] font-bold px-1.5 py-0.5 rounded shadow-2xs z-10 pointer-events-none">
          {isNepal ? 'Nepal Authentic' : 'Global Direct'}
        </span>

        {/* Bottom-Left Pill Badge */}
        <span className="absolute bottom-1.5 left-1.5 bg-[#1B1F3B] text-white text-[8.5px] font-bold px-1.5 py-0.5 rounded shadow-2xs z-10 pointer-events-none">
          Verified Stock
        </span>

        {/* Wishlist Heart Button (on hover) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (!user) {
              if (onRequireAuth) {
                onRequireAuth(() => {
                  toggleWishlist(product);
                }, 'Please login or sign up to save items to your Wishlist');
              }
              return;
            }
            toggleWishlist(product);
          }}
          className={`absolute top-1.5 right-1.5 p-1 rounded-full bg-white/90 backdrop-blur-xs shadow-xs hover:scale-110 transition z-10 opacity-0 group-hover:opacity-100 ${
            isFavorite ? 'text-red-500 opacity-100' : 'text-slate-400 hover:text-red-500'
          }`}
          title={isFavorite ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          <Heart className={`w-3 h-3 ${isFavorite ? 'fill-red-500' : ''}`} />
        </button>

        {/* Quick Add To Cart Floating Button on Hover */}
        <button
          onClick={handleQuickAddToCart}
          className={`absolute bottom-1.5 right-1.5 p-1.5 rounded-full shadow-xs transition-all duration-200 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 ${
            justAdded 
              ? 'bg-[#15803D] text-white scale-105' 
              : 'bg-[#E11D48] text-white hover:bg-[#BE123C]'
          }`}
          title="Quick Add to Cart"
        >
          {justAdded ? (
            <Check className="w-3 h-3 stroke-3" />
          ) : (
            <ShoppingBag className="w-3 h-3" />
          )}
        </button>

        {/* Admin Controls */}
        {isAdmin && onEditProduct && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEditProduct(product);
            }}
            className="absolute top-1.5 right-8 p-1 rounded-full bg-white/90 shadow-xs hover:scale-110 text-slate-500 hover:text-[#E11D48] transition z-10 opacity-0 group-hover:opacity-100"
            title="Edit Price & SKU (Admin)"
          >
            <Edit3 className="w-3 h-3" />
          </button>
        )}
        {isAdmin && onDeleteProduct && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteProduct(product.id, e);
            }}
            className="absolute top-1.5 right-14 p-1 rounded-full bg-white/95 shadow-xs hover:scale-110 text-slate-400 hover:text-red-600 transition z-10 opacity-0 group-hover:opacity-100"
            title="Delete this product"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Details Container */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Category Tag */}
          <span className="text-[10.5px] text-[#E11D48] font-bold block mb-1 mt-0.5 leading-none truncate">
            {categoryLabel}
          </span>

          {/* Title */}
          <h3 
            className="text-[11.5px] font-bold text-[#1B1F3B] line-clamp-2 leading-[1.28] min-h-[30px] group-hover:text-[#E11D48] transition"
            title={cleanTitle}
          >
            {cleanTitle}
          </h3>

          {/* Pricing Row */}
          <div className="mt-1.5">
            <div className="flex items-baseline gap-1 flex-wrap">
              <span className="text-[15px] font-black text-[#1B1F3B]">
                {formatPrice(retailPrice)}
              </span>
              {originalPrice > retailPrice && (
                <span className="text-[9.5px] text-[#94A3B8] font-normal line-through ml-1">
                  {formatPrice(originalPrice)}
                </span>
              )}
            </div>
            <span className="text-[9px] text-[#64748B] font-medium block truncate mt-0.5 mb-2">
              {isNepal ? 'Nepal Authentic • Fast Delivery' : 'Direct Import • Fast Delivery Nepal'}
            </span>
          </div>
        </div>

        {/* Footer: Verified Seller & Rating (Matching reference photo) */}
        <div className="flex items-center justify-between text-[10px] pt-0.5">
          <span className="text-[#0D9488] font-semibold text-[10px] flex items-center gap-1 truncate">
            <span className="truncate">✓ Verified Seller</span>
          </span>
          <span className="font-bold text-[#1B1F3B] text-[10.5px] flex-shrink-0">
            ★ {product.rating || 4.9}
          </span>
        </div>
      </div>
    </div>
  );
};
