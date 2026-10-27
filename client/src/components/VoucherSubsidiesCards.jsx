import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft, RotateCcw } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

// Bottom Row Cards: Taobao Single Feature Cards + Quad 2x2 Sweater Cards + Voucher Collection
const BOTTOM_CARDS = [
  {
    type: 'dual',
    id: 'voucher-collection',
    title: 'Voucher Collection',
    nepaliTitle: 'भउचर संकलन',
    subtitle: 'Official coupons',
    categoryId: 'consumer-electronics',
    items: [
      {
        id: 'vc-1',
        title: 'Flagship 5G Phone',
        nepaliTitle: '५G स्मार्टफोन',
        priceUSD: 690,
        image: '/deals/vivo_phone.jpg',
        categoryId: 'consumer-electronics'
      },
      {
        id: 'vc-2',
        title: 'Street Sneaker Shoes',
        nepaliTitle: 'ट्रेन्डी स्निकर जुत्ता',
        priceUSD: 42,
        image: '/deals/trendy_sneaker.jpg',
        categoryId: 'shoes-accessories'
      }
    ]
  },
  {
    type: 'bhanjo-sale',
    id: 'bhanjo-sale',
    title: 'Bhanjo Sale',
    nepaliTitle: 'भान्जो सेल',
    subtitle: 'Tihar Dhamaka',
    nepaliSubtitle: 'तिहार धमाका',
    categoryId: 'home-kitchen',
    items: [
      {
        id: 'bs-cpap',
        title: 'Medical Sleep CPAP Care',
        nepaliTitle: 'मेडिकल CPAP केयर',
        priceUSD: 3000,
        image: '/deals/cpap_device.jpg',
        categoryId: 'consumer-electronics'
      },
      {
        id: 'bs-sofa',
        title: 'Nordic Foldable Sofa Bed',
        nepaliTitle: 'फोल्डेबल सोफा बेड',
        priceUSD: 47,
        image: '/deals/sofa_bed.jpg',
        categoryId: 'home-kitchen'
      }
    ]
  },
  {
    type: 'quad',
    id: 'explore-new-arrivals',
    title: 'Explore New Arrivals',
    nepaliTitle: 'नयाँ आगमन अन्वेषण',
    tag: "women's sweater 🇨🇳",
    categoryId: 'apparel-accessories',
    items: [
      {
        id: 'new-1',
        title: 'Beige Knit Buttoned Cardigan',
        priceUSD: 8.43,
        badge: 'New on CN',
        image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=300&q=80'
      },
      {
        id: 'new-2',
        title: 'Brown Corduroy Overshirt',
        priceUSD: 10.57,
        badge: 'New on CN',
        image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=300&q=80'
      },
      {
        id: 'new-3',
        title: 'Wave Knit Layered Pullover',
        priceUSD: 5.36,
        badge: 'New on CN',
        image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=300&q=80'
      },
      {
        id: 'new-4',
        title: 'Heather Grey Knit Sweater',
        priceUSD: 9.14,
        badge: 'New on CN',
        image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=300&q=80'
      }
    ]
  },
  {
    type: 'quad',
    id: 'hot-rising-trends',
    title: 'Hot-Rising Trends',
    nepaliTitle: 'अत्यधिक चर्चित ट्रेन्ड्स',
    tag: "women's sweater 🇨🇳",
    categoryId: 'apparel-accessories',
    items: [
      {
        id: 'trend-1',
        title: 'Crimson Turtle-Neck Ribbed',
        priceUSD: 5.36,
        badge: 'Sales +100%',
        image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=300&q=80'
      },
      {
        id: 'trend-2',
        title: 'Scarlet Red Classic Cardigan',
        priceUSD: 3.37,
        badge: 'Sales +100%',
        image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=300&q=80'
      },
      {
        id: 'trend-3',
        title: 'Pastel Floral Embroidered',
        priceUSD: 3.68,
        badge: 'Trending',
        image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=300&q=80'
      },
      {
        id: 'trend-4',
        title: 'Off-Shoulder Asymmetric Knit',
        priceUSD: 2.91,
        badge: 'Trending',
        image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=300&q=80'
      }
    ]
  }
];

export const VoucherSubsidiesCards = ({ onSelectCategory, onSelectProduct, products = [] }) => {
  const { language, formatPrice, formatNPR } = useCurrency();
  const bottomScrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollPosition = () => {
    if (!bottomScrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = bottomScrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  };

  useEffect(() => {
    const el = bottomScrollRef.current;
    if (!el) return;
    el.scrollLeft = 0;
    checkScrollPosition();
    el.addEventListener('scroll', checkScrollPosition, { passive: true });
    window.addEventListener('resize', checkScrollPosition);
    return () => {
      el.removeEventListener('scroll', checkScrollPosition);
      window.removeEventListener('resize', checkScrollPosition);
    };
  }, []);

  const handleScrollBottom = (direction) => {
    if (!bottomScrollRef.current) return;
    if (direction === 'left' && !canScrollLeft) return;
    if (direction === 'right' && !canScrollRight) return;
    const scrollAmount = 260;
    bottomScrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
    setTimeout(checkScrollPosition, 320);
  };

  return (
    <div className="w-full max-w-full relative group/bottom h-[220px] sm:h-[230px] flex flex-col justify-center overflow-hidden">
      {/* Floating Left Arrow */}
      <button
        type="button"
        disabled={!canScrollLeft}
        onClick={() => handleScrollBottom('left')}
        className={`absolute left-1 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-white/95 shadow-md border border-slate-200 text-slate-700 transition-all flex items-center justify-center ${
          canScrollLeft 
            ? 'opacity-100 hover:text-[#F85606] hover:scale-110 cursor-pointer active:scale-95' 
            : 'opacity-0 pointer-events-none cursor-default'
        }`}
        title={canScrollLeft ? "Scroll Left" : undefined}
      >
        <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
      </button>

      {/* Floating Right Arrow */}
      <button
        type="button"
        disabled={!canScrollRight}
        onClick={() => handleScrollBottom('right')}
        className={`absolute right-1 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-white/95 shadow-md border border-slate-200 text-slate-700 transition-all flex items-center justify-center ${
          canScrollRight 
            ? 'opacity-100 hover:text-[#F85606] hover:scale-110 cursor-pointer active:scale-95' 
            : 'opacity-0 pointer-events-none cursor-default'
        }`}
        title={canScrollRight ? "Scroll Right" : undefined}
      >
        <ChevronRight className="w-4 h-4 stroke-[2.5]" />
      </button>

      {/* Scroll Track */}
      <div 
        ref={bottomScrollRef}
        onScroll={checkScrollPosition}
        className="w-full max-w-full flex items-stretch gap-2.5 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory h-full py-0.5 px-0.5"
      >
        {BOTTOM_CARDS.map((card) => {
          // RENDER QUAD 2x2 CARD (Explore New Arrivals / Hot-Rising Trends)
          if (card.type === 'quad') {
            return (
              <div
                key={card.id}
                className="w-[340px] sm:w-[370px] xl:w-[385px] flex-shrink-0 snap-start bg-white rounded-2xl border border-slate-200 p-2.5 sm:p-3 flex flex-col justify-between shadow-2xs hover:shadow-md transition-shadow"
              >
                {/* Title & Tag */}
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="font-black text-sm sm:text-[15px] text-slate-900 tracking-tight truncate">
                    {language === 'ne' ? card.nepaliTitle : card.title}
                  </h4>
                  <span className="text-[11px] font-bold text-slate-600 bg-slate-100/90 px-2 py-0.5 rounded-md">
                    {card.tag}
                  </span>
                </div>

                {/* 2x2 Grid */}
                <div className="grid grid-cols-2 gap-2 flex-1">
                  {card.items.map((prod) => (
                    <div
                      key={prod.id}
                      onClick={() => {
                        if (onSelectProduct && products.length > 0) {
                          const match = products.find(p => p.title?.toLowerCase().includes('sweater')) || products[0];
                          if (match) onSelectProduct(match);
                        } else if (onSelectCategory) {
                          onSelectCategory(card.categoryId);
                        }
                      }}
                      className="flex items-center gap-2.5 bg-slate-50/90 hover:bg-orange-50/70 rounded-xl p-1.5 sm:p-2 border border-slate-100/90 hover:border-orange-200/90 transition-all cursor-pointer overflow-hidden group/item hover:shadow-xs"
                    >
                      {/* Noticeably Larger Product Image */}
                      <div className="w-[60px] h-[60px] sm:w-[68px] sm:h-[68px] rounded-lg overflow-hidden bg-white flex-shrink-0 shadow-2xs">
                        <img
                          src={prod.image}
                          alt={prod.title}
                          className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        {/* Larger Bold Price */}
                        <div className="font-black text-[13px] sm:text-[14px] text-slate-900 leading-tight tracking-tight">
                          {formatNPR ? formatNPR(prod.priceUSD) : formatPrice(prod.priceUSD)}
                        </div>
                        {/* Larger Badge Text */}
                        <div className="text-[11px] font-bold text-slate-500 truncate group-hover/item:text-[#F85606] mt-0.5">
                          {prod.badge}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          // RENDER BHANJO SALE CARD (Wide Tihar Dhamaka 2-item Showcase, replaces the 2 separate cards without shrinking)
          if (card.type === 'bhanjo-sale') {
            return (
              <div
                key={card.id}
                className="w-[420px] sm:w-[460px] xl:w-[495px] flex-shrink-0 snap-start bg-white rounded-2xl border border-slate-200 p-2.5 sm:p-3 flex flex-col justify-between shadow-2xs hover:shadow-md transition-shadow"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 font-black text-sm sm:text-[15px] text-slate-900 truncate">
                    <span>{language === 'ne' ? card.nepaliTitle : card.title}</span>
                  </div>
                  {(card.subtitle || card.nepaliSubtitle) && (
                    <span className="text-[10.5px] sm:text-[11.5px] font-black text-[#E11D48] bg-[#FFE7EC] border border-[#FECDD3] px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                      <span>🪔</span>
                      <span>{language === 'ne' ? (card.nepaliSubtitle || card.subtitle) : card.subtitle}</span>
                    </span>
                  )}
                </div>

                {/* 2 Wide Items Side-by-Side (Medical Sleep CPAP Care + Foldable Sofa Bed) */}
                <div className="grid grid-cols-2 gap-3 flex-1 items-stretch py-0.5">
                  {card.items.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        if (onSelectProduct && products.length > 0) {
                          const match = products.find(p => p.category === item.categoryId) || products[0];
                          if (match) onSelectProduct(match);
                        } else if (onSelectCategory) {
                          onSelectCategory(item.categoryId);
                        }
                      }}
                      className="group/item flex flex-col justify-between items-center bg-slate-50/70 hover:bg-rose-50/50 rounded-xl p-2 border border-slate-100 hover:border-rose-200/80 transition-all cursor-pointer"
                    >
                      {/* Product Cutout (Large & Prominent) */}
                      <div className="flex-1 w-full flex items-center justify-center min-h-[105px] py-0.5">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-[100px] sm:h-[110px] md:h-[118px] w-auto max-w-[95%] object-contain group-hover/item:scale-105 transition-transform duration-300 drop-shadow-sm"
                          style={{ maxHeight: '118px', width: 'auto', objectFit: 'contain' }}
                        />
                      </div>

                      {/* Product Title */}
                      <div className="w-full text-center px-1 mt-1">
                        <span className="block text-[11.5px] sm:text-[12.5px] text-slate-800 font-bold truncate leading-tight">
                          {language === 'ne' ? (item.nepaliTitle || item.title) : item.title}
                        </span>
                      </div>

                      {/* Price Tag Pill */}
                      <div className="w-full text-center mt-1 pb-0">
                        <span 
                          className="inline-block bg-[#E11D48] text-white text-[10.5px] sm:text-[11.5px] md:text-xs font-black px-2.5 sm:px-3 py-0.5 sm:py-0.8 rounded-md shadow-xs tracking-tight whitespace-nowrap"
                        >
                          {formatNPR ? formatNPR(item.priceUSD) : formatPrice(item.priceUSD)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          // RENDER DUAL ITEM CARD (Voucher Collection with Phone + Shoes side-by-side)
          if (card.type === 'dual') {
            return (
              <div
                key={card.id}
                className="w-[320px] sm:w-[420px] xl:w-[495px] flex-shrink-0 snap-start bg-white rounded-2xl border border-slate-200 p-2.5 sm:p-3 flex flex-col justify-between shadow-2xs hover:shadow-md transition-shadow"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 font-black text-sm sm:text-[15px] text-slate-900 truncate">
                    <span>{language === 'ne' ? card.nepaliTitle : card.title}</span>
                  </div>
                  {(card.subtitle || card.nepaliSubtitle) && (
                    <span className="text-[10.5px] sm:text-[11.5px] font-black text-[#E11D48] bg-[#FFE7EC] border border-[#FECDD3] px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                      <span>🎟️</span>
                      <span>{language === 'ne' ? (card.nepaliSubtitle || card.subtitle) : card.subtitle}</span>
                    </span>
                  )}
                </div>

                {/* 2 Items Side-by-Side (Phone + Shoes) */}
                <div className="grid grid-cols-2 gap-3 flex-1 items-stretch py-0.5">
                  {card.items.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        if (onSelectProduct && products.length > 0) {
                          const match = products.find(p => p.category === item.categoryId) || products[0];
                          if (match) onSelectProduct(match);
                        } else if (onSelectCategory) {
                          onSelectCategory(item.categoryId);
                        }
                      }}
                      className="group/item flex flex-col justify-between items-center bg-slate-50/70 hover:bg-rose-50/50 rounded-xl p-2 border border-slate-100 hover:border-rose-200/80 transition-all cursor-pointer"
                    >
                      {/* Product Cutout */}
                      <div className="flex-1 w-full flex items-center justify-center min-h-[105px] py-0.5">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-[100px] sm:h-[110px] md:h-[118px] w-auto max-w-[95%] object-contain group-hover/item:scale-105 transition-transform duration-300 drop-shadow-sm"
                          style={{ maxHeight: '118px', width: 'auto', objectFit: 'contain' }}
                        />
                      </div>

                      {/* Product Title */}
                      <div className="w-full text-center px-1 mt-1">
                        <span className="block text-[11.5px] sm:text-[12.5px] text-slate-800 font-bold truncate leading-tight">
                          {language === 'ne' ? (item.nepaliTitle || item.title) : item.title}
                        </span>
                      </div>

                      {/* Price Tag Pill */}
                      <div className="w-full text-center mt-1 pb-0">
                        <span 
                          className="inline-block bg-[#E11D48] text-white text-[10.5px] sm:text-[11.5px] md:text-xs font-black px-2.5 sm:px-3 py-0.5 sm:py-0.8 rounded-md shadow-xs tracking-tight whitespace-nowrap"
                        >
                          {formatNPR ? formatNPR(item.priceUSD) : formatPrice(item.priceUSD)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          // RENDER SINGLE ITEM CARD (National Subsidies, Flash Sale)
          return (
            <div
              key={card.id}
              onClick={() => onSelectCategory && onSelectCategory(card.categoryId)}
              className="w-[205px] sm:w-[225px] xl:w-[242px] flex-shrink-0 snap-start bg-white rounded-2xl border border-slate-200 p-2.5 flex flex-col justify-between shadow-2xs hover:shadow-md transition-shadow cursor-pointer group/single"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-1">
                {card.isGreenTitle ? (
                  <div className="flex items-center gap-1.5 font-extrabold text-[13px] sm:text-sm text-[#00B51D] truncate">
                    <RotateCcw className="w-4 h-4 stroke-[2.5]" />
                    <span>{language === 'ne' ? card.nepaliTitle : card.title}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 font-extrabold text-[13px] sm:text-sm text-slate-900 truncate">
                    <span>{language === 'ne' ? card.nepaliTitle : card.title}</span>
                  </div>
                )}
              </div>

              {/* Centered Product Cutout (Noticeably Larger & Clearer) */}
              <div className="flex-1 w-full flex items-center justify-center min-h-[115px] py-0.5">
                <img
                  src={card.image}
                  alt={card.title}
                  className="h-[105px] sm:h-[118px] md:h-[128px] w-auto max-w-[96%] object-contain group-hover/single:scale-105 transition-transform duration-300 drop-shadow-sm"
                  style={{ maxHeight: '128px', width: 'auto', objectFit: 'contain' }}
                />
              </div>

              {/* Product Title (Text Name) */}
              <div className="w-full text-center px-0.5 mt-1">
                <span className="block text-[12px] sm:text-[13px] text-slate-800 font-bold truncate leading-tight">
                  {language === 'ne' ? (card.nepaliProductTitle || card.productTitle) : (card.productTitle || card.title)}
                </span>
              </div>

              {/* Orange-Red Price Tag Pill with Nepalese Rupees */}
              <div className="w-full text-center mt-1 pb-0">
                <span 
                  className="inline-block bg-[#FF5000] text-white text-[11px] sm:text-xs md:text-[13px] font-black px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-md shadow-xs tracking-tight whitespace-nowrap"
                  style={{ backgroundColor: '#FF5000', color: '#FFFFFF' }}
                >
                  {formatNPR ? formatNPR(card.priceUSD) : formatPrice(card.priceUSD)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
