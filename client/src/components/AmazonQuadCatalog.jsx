import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronRight, ChevronLeft, Sparkles, LayoutGrid, Layers } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

// 10 Curated Extra-Large Amazon-Style Quad Department Cards
const FEATURED_QUAD_CARDS = [
{
    id: 'luggage-travel',
    title: 'Bag, luggage and other essential',
    nepaliTitle: 'झोला, लगेज तथा अन्य सामग्री',
    categoryId: 'luggage-bags-cases',
    searchKeyword: 'Bag',
    quadrants: [
      {
        id: 'tote-crossbody',
        label: 'Totes & Purses',
        nepaliLabel: 'टोट तथा पर्स',
        keyword: 'Tote Bag',
        bg: 'bg-white',
        image: '/categories/tote_crossbody_slouchy.jpg?v=ai_gen',
        alt: 'Designer Slouchy Tote Bag'
      },
      {
        id: 'gym-bags',
        label: 'Duffle Bag',
        nepaliLabel: 'डफल ब्याग',
        keyword: 'Duffle Bag',
        bg: 'bg-white',
        image: '/categories/gym_bag.jpg?v=ai_gen',
        alt: 'Athletic Duffle Bag'
      },
      {
        id: 'rolling-luggage',
        label: 'Suitcases',
        nepaliLabel: 'लगेज सुटकेस',
        keyword: 'Luggage',
        bg: 'bg-white',
        image: '/categories/suitcase_blue.jpg?v=ai_gen',
        alt: 'Hardshell Spinner Suitcase'
      },
      {
        id: 'duffle-bags',
        label: 'Bagpack',
        nepaliLabel: 'ब्याकप्याक',
        keyword: 'Backpack',
        bg: 'bg-white',
        image: '/categories/hemp_backpacks.jpg?v=ai_gen',
        alt: 'Vintage Canvas Leather Backpack'
      }
    ]
  },
{
    id: 'winter-apparel',
    title: 'Himalayan Warmth & Fashion',
    nepaliTitle: 'न्यानो पोशाक तथा फेसन',
    categoryId: 'apparel-accessories',
    searchKeyword: 'Apparel',
    quadrants: [
      {
        id: 'pashmina-shawls',
        label: 'Cashmere & Shawls',
        nepaliLabel: 'पश्मिना तथा शल',
        keyword: 'Pashmina',
        bg: 'bg-white',
        image: '/categories/pashmina_shawls_white.jpg',
        alt: 'Himalayan Cashmere Shawl'
      },
      {
        id: 'hoodies-sweats',
        label: 'Cozy Hoodies',
        nepaliLabel: 'हुडिज तथा स्वेटर',
        keyword: 'Hoodie',
        bg: 'bg-white',
        image: '/categories/hoodies_sweats_white.jpg',
        alt: 'Warm Heavyweight Hoodie'
      },
      {
        id: 'winter-jackets',
        label: 'Jackets & Vests',
        nepaliLabel: 'ज्याकेट तथा भेस्ट',
        keyword: 'Jacket',
        bg: 'bg-white',
        image: '/categories/winter_jackets_white.jpg',
        alt: 'Puffer Winter Jacket'
      },
      {
        id: 'streetwear-fashion',
        label: 'Streetwear',
        nepaliLabel: 'स्ट्रिटवेयर फेसन',
        keyword: 'Clothing',
        bg: 'bg-white',
        image: '/categories/streetwear_fashion_white.jpg',
        alt: 'Casual Modern Apparel'
      }
    ]
  },
{
    id: 'shoes-trends',
    title: 'Fashion trends in Shoes',
    nepaliTitle: 'फेसन ट्रेन्ड्स: जुत्ता तथा स्यान्डल',
    categoryId: 'shoes-accessories',
    searchKeyword: 'Shoes',
    quadrants: [
      {
        id: 'women-shoes',
        label: 'Sandals',
        nepaliLabel: 'स्यान्डल',
        keyword: 'Sandals',
        bg: 'bg-white',
        image: '/categories/women_shoes.jpg',
        alt: "Women's Sandals & Heels"
      },
      {
        id: 'men-shoes',
        label: "Men's",
        nepaliLabel: 'पुरुष स्निकर्स',
        keyword: 'Sneakers',
        bg: 'bg-white',
        image: '/categories/men_shoes.jpg',
        alt: "Men's Shoes & Sneakers"
      },
      {
        id: 'kids-shoes',
        label: "Kids'",
        nepaliLabel: 'बालबालिका स्यान्डल',
        keyword: 'Kids Sandals',
        bg: 'bg-white',
        image: '/categories/kids_shoes.jpg',
        alt: "Kids' Sandals"
      },
      {
        id: 'all-shoes',
        label: "Women's",
        nepaliLabel: 'महिला जुत्ता',
        keyword: 'Women Shoes',
        bg: 'bg-white',
        image: '/categories/all_shoes.jpg',
        alt: "Women's Shoes & Sneakers"
      }
    ]
  },
{
    id: 'vehicle-gear',
    title: 'Riding Gear & Vehicle Care',
    nepaliTitle: 'सवारी साधन तथा राइडिङ सामग्री',
    categoryId: 'vehicles-accessories',
    searchKeyword: 'Vehicle',
    quadrants: [
      {
        id: 'helmet-gear',
        label: 'Helmets & Visors',
        nepaliLabel: 'हेल्मेट तथा भाइजर',
        keyword: 'Helmet',
        bg: 'bg-white',
        image: '/categories/helmet_gear_white.jpg',
        alt: 'Riding Helmet Protection'
      },
      {
        id: 'phone-mounts',
        label: 'Phone Mounts',
        nepaliLabel: 'मोबाइल होल्डर',
        keyword: 'Car Mount',
        bg: 'bg-white',
        image: '/categories/phone_mount_white.jpg',
        alt: 'Universal Vehicle Phone Mount'
      },
      {
        id: 'care-polish',
        label: 'Car Care & Clean',
        nepaliLabel: 'सफाइ तथा पोलिस',
        keyword: 'Car Care',
        bg: 'bg-white',
        image: '/categories/car_care_kit.jpg',
        alt: 'Vehicle Cleaning Detail Kit'
      },
      {
        id: 'riding-gloves',
        label: 'Riding Gloves',
        nepaliLabel: 'राइडिङ पञ्जा',
        keyword: 'Gloves',
        bg: 'bg-white',
        image: '/categories/motorcycle_gloves.jpg',
        alt: 'Motorcycle Protective Riding Gloves'
      }
    ]
  },
{
    id: 'toys-creative',
    title: 'Toys & Creative kids corner',
    nepaliTitle: 'खेलौना तथा क्रियटिभ बालबालिका कर्नर',
    categoryId: 'gift-kids-toys',
    searchKeyword: 'Toy',
    quadrants: [
      {
        id: 'stem-blocks',
        label: 'Building Blocks',
        nepaliLabel: 'ब्लक्स तथा खेलौना',
        keyword: 'Building Blocks',
        bg: 'bg-white',
        image: '/categories/stem_blocks.jpg',
        alt: 'Colorful Building Blocks'
      },
      {
        id: 'soft-plushies',
        label: 'Soft Plushies',
        nepaliLabel: 'सफ्ट खेलौनाहरू',
        keyword: 'Plush Toy',
        bg: 'bg-white',
        image: '/categories/soft_plushies.jpg',
        alt: 'Soft Stuffed Teddy Bear'
      },
      {
        id: 'drawing-crafts',
        label: 'Drawing & Crafts',
        nepaliLabel: 'चित्रकला सामग्री',
        keyword: 'Art Set',
        bg: 'bg-white',
        image: '/categories/drawing_crafts.jpg',
        alt: 'Kids Drawing Art Supplies'
      },
      {
        id: 'board-puzzles',
        label: 'Brain Puzzles',
        nepaliLabel: 'दिमागी पजल खेल',
        keyword: 'Puzzle',
        bg: 'bg-white',
        image: '/categories/board_puzzles.jpg',
        alt: 'Brain Strategy Puzzle Games'
      }
    ]
  },
{
    id: 'trending-tech',
    title: 'Trending Tech & Gadgets',
    nepaliTitle: 'आधुनिक ग्याजेट तथा मोबाइल सामग्री',
    categoryId: 'phone-laptop-cases',
    searchKeyword: 'Case',
    quadrants: [
      {
        id: 'phone-cases',
        label: 'Phone Cases',
        nepaliLabel: 'मोबाइल कभर',
        keyword: 'Phone Case',
        bg: 'bg-white',
        image: '/categories/phone_cases.jpg',
        alt: 'Slim Protective Phone Case'
      },
      {
        id: 'laptop-sleeves',
        label: 'Laptop Sleeves',
        nepaliLabel: 'ल्यापटप स्लिभ',
        keyword: 'Laptop Sleeve',
        bg: 'bg-white',
        image: '/categories/laptop_sleeves.jpg',
        alt: 'Padded Laptop Sleeve'
      },
      {
        id: 'wireless-audio',
        label: 'Audio & Earbuds',
        nepaliLabel: 'इयरबड्स तथा अडियो',
        keyword: 'Earbuds',
        bg: 'bg-white',
        image: '/categories/wireless_audio.jpg',
        alt: 'True Wireless Earbuds'
      },
      {
        id: 'chargers-power',
        label: 'Fast Chargers',
        nepaliLabel: 'फास्ट चार्जर',
        keyword: 'Charger',
        bg: 'bg-white',
        image: '/categories/chargers_power.jpg',
        alt: 'Fast Charger Adapter'
      }
    ]
  },
{
    id: 'watches-eyewear',
    title: 'Jewelry, Eyewear & Watches',
    nepaliTitle: 'घडी, चस्मा तथा गहना',
    categoryId: 'jewelry-eyewear-watches',
    searchKeyword: 'Watch',
    quadrants: [
      {
        id: 'sunglasses-shades',
        label: 'Eyewear',
        nepaliLabel: 'आईवेयर चस्मा',
        keyword: 'Eyewear',
        bg: 'bg-white',
        image: '/categories/eyewear_sunglasses.jpg',
        alt: 'Designer Eyewear Sunglasses'
      },
      {
        id: 'classic-watches',
        label: 'Wristwear',
        nepaliLabel: 'रिस्टवेयर घडी',
        keyword: 'Wristwear',
        bg: 'bg-white',
        image: '/categories/classic_watches.jpg',
        alt: 'Luxury Wristwear Watch'
      },
      {
        id: 'rings-jewelry',
        label: 'Jewelry & Accessories',
        nepaliLabel: 'गहना तथा एक्सेसरिज',
        keyword: 'Jewelry',
        bg: 'bg-white',
        image: '/categories/rings_jewelry.jpg',
        alt: 'Fine Jewelry & Accessories'
      },
      {
        id: 'smart-bands',
        label: 'Smart Bands',
        nepaliLabel: 'स्मार्ट ब्यान्ड',
        keyword: 'Smart Watch',
        bg: 'bg-white',
        image: '/categories/smart_bands.jpg',
        alt: 'Fitness Smart Fitness Band'
      }
    ]
  },
{
    id: 'home-harmony',
    title: 'Home harmony',
    nepaliTitle: 'घर तथा भान्छा सजावट',
    categoryId: 'gift-kids-toys',
    searchKeyword: 'Home Decor',
    quadrants: [
      {
        id: 'kitchen-essentials',
        label: 'Kitchen essentials',
        nepaliLabel: 'भान्छा सामग्री',
        keyword: 'Kitchen',
        bg: 'bg-white',
        image: '/categories/kitchen_essentials.jpg',
        alt: 'Kitchen essentials power blender'
      },
      {
        id: 'home-comfort',
        label: 'Home comfort',
        nepaliLabel: 'बैठक कोठा सजावट',
        keyword: 'Living Room',
        bg: 'bg-white',
        image: '/categories/home_comfort.jpg',
        alt: 'Home comfort living room'
      },
      {
        id: 'decorate-elegance',
        label: 'Decorate with elegance',
        nepaliLabel: 'कलात्मक सजावट',
        keyword: 'Decor',
        bg: 'bg-white',
        image: '/categories/decorate_elegance.jpg',
        alt: 'Decorate with elegance vases and flowers'
      },
      {
        id: 'light-it-right',
        label: 'Light it Right',
        nepaliLabel: 'आधुनिक बत्तीहरू',
        keyword: 'Lamp',
        bg: 'bg-white',
        image: '/categories/light_it_right.jpg',
        alt: 'Table night lamp'
      }
    ]
  },
{
    id: 'budget-shoes',
    title: 'Shoes Under Rs. 3,000',
    nepaliTitle: 'किफायती जुत्ता अफरहरू',
    categoryId: 'shoes-accessories',
    searchKeyword: 'Shoes',
    quadrants: [
      {
        id: 'budget-womens',
        label: "Women's",
        nepaliLabel: 'महिला पम्प्स',
        keyword: 'Heels',
        bg: 'bg-white',
        image: '/categories/budget_womens.jpg',
        alt: "Women's Nude High Heels"
      },
      {
        id: 'budget-mens',
        label: "Men's",
        nepaliLabel: 'पुरुष छालाको जुत्ता',
        keyword: 'Formal Shoes',
        bg: 'bg-white',
        image: '/categories/budget_mens.jpg',
        alt: "Men's Leather Dress Shoes"
      },
      {
        id: 'budget-girls',
        label: "Girl's",
        nepaliLabel: 'बालिका जुत्ता',
        keyword: 'School Shoes',
        bg: 'bg-white',
        image: '/categories/budget_girls.jpg',
        alt: "Girl's School Shoes"
      },
      {
        id: 'budget-boys',
        label: "Boy's",
        nepaliLabel: 'बालक स्निकर',
        keyword: 'Kids Sneakers',
        bg: 'bg-white',
        image: '/categories/budget_boys.jpg',
        alt: "Boy's Toddler Blue Sneakers"
      }
    ]
  },
  {
    id: 'furry-friends',
    title: 'Everything for Your Pets',
    nepaliTitle: 'घरपालुवा जनावरका सामग्री',
    categoryId: 'gift-kids-toys',
    searchKeyword: 'Pet',
    quadrants: [
      {
        id: 'dogs',
        label: 'Dogs',
        nepaliLabel: 'कुकुरका सामग्री',
        keyword: 'Dog',
        bg: 'bg-white',
        image: '/categories/dogs.jpg',
        alt: 'Happy Fluffy Dog'
      },
      {
        id: 'cats',
        label: 'Cats',
        nepaliLabel: 'बिरालोका सामग्री',
        keyword: 'Cat',
        bg: 'bg-white',
        image: '/categories/cats.jpg',
        alt: 'Adorable Ginger Cat'
      },
      {
        id: 'small-pets',
        label: 'Small Pets',
        nepaliLabel: 'साना घरपालुवा जनावर',
        keyword: 'Pet',
        bg: 'bg-white',
        image: '/categories/small_pets.jpg',
        alt: 'Cute Hamster Small Pet'
      },
      {
        id: 'pet-deals',
        label: 'Deals',
        nepaliLabel: 'विशेष छुट अफरहरू',
        keyword: 'Pet Toy',
        bg: 'bg-white',
        image: '/categories/pet_deals.jpg',
        alt: 'Pet toys and accessories deals'
      }
    ]
  }

];

export const AmazonQuadCatalog = ({
  onSelectCategory,
  selectedCategoryId = 'all'
}) => {
  const { language } = useCurrency();
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Check scroll position to dynamically show/hide side buttons
  const updateScrollState = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 15);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 15);
  }, []);

  useEffect(() => {
    updateScrollState();
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);

    return () => {
      container.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [updateScrollState]);

  // Smooth scroll sideways on clicking side arrow buttons
  const handleSideScroll = (direction) => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    // Scroll by visible width or ~1-2 cards
    const scrollAmount = container.clientWidth >= 1024
      ? container.clientWidth * 0.78
      : container.clientWidth * 0.88;

    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  const handleCardHeaderClick = (card) => {
    if (onSelectCategory) {
      onSelectCategory(card.categoryId, card.searchKeyword);
    }
  };

  const handleQuadrantClick = (card, quad, e) => {
    e.stopPropagation();
    if (onSelectCategory) {
      onSelectCategory(card.categoryId, quad.keyword);
    }
  };

  return (
    <section 
      className="my-3.5 sm:my-5 rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden bg-gradient-to-b from-[#FFE7EC]/20 via-white to-white transition-all duration-200" 
      id="amazon-quad-catalog"
    >
      {/* BALANCED & CUTE HEADER BANNER */}
      <div className="bg-[#FAFAFB] border-b border-[#E5E7EB] px-4 sm:px-6 py-2.5 sm:py-3.5 text-[#1B1F3B] flex items-center justify-between gap-3 shadow-2xs relative overflow-hidden">
        {/* Subtle decorative soft glow */}
        <div className="absolute -right-8 -top-8 w-40 h-40 bg-emerald-100/40 rounded-full blur-2xl pointer-events-none" />

        {/* Left Side: Icon + Titles & Badges */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 relative z-10 min-w-0">
          <div className="w-8.5 h-8.5 sm:w-10 sm:h-10 rounded-xl bg-emerald-600 text-white shadow-xs flex items-center justify-center flex-shrink-0">
            <LayoutGrid className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.4]" />
          </div>

          <div className="min-w-0">
            {/* Top Row: Badges & Announcement */}
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <span className="bg-emerald-600 text-white text-[8.5px] sm:text-[9.5px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider leading-none shadow-2xs">
                FEATURED HUBS
              </span>
              <span className="text-[10px] sm:text-[11px] font-black text-emerald-800 tracking-wide uppercase truncate hidden sm:inline">
                🌱 {language === 'ne' ? 'प्रमुख क्याटागोरी विभागहरू' : 'CURATED LIFESTYLE DEPARTMENTS'}
              </span>
            </div>

            {/* Bottom Row: Main Heading + Count */}
            <div className="flex items-baseline gap-2">
              <h2 className="text-[14px] sm:text-[17px] font-black text-[#1B1F3B] tracking-tight leading-tight">
                {language === 'ne' ? 'प्रमुख विभागहरू' : 'Popular Departments'}
              </h2>
              <span className="text-[11px] sm:text-[11.5px] font-bold text-[#5B6070] hidden sm:inline">
                • 🌿 {language === 'ne' ? '१० क्युरेटेड सेट' : '10 Curated Sets'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Chevrons */}
        <div className="flex items-center gap-1.5 relative z-10 flex-shrink-0">
          <button
            onClick={() => handleSideScroll('left')}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
            className={`w-7.5 h-7.5 sm:w-8.5 sm:h-8.5 rounded-lg sm:rounded-xl border flex items-center justify-center transition-all shadow-2xs ${
              canScrollLeft
                ? 'bg-white text-[#1B1F3B] border-[#E5E7EB] hover:bg-[#FFE7EC] hover:text-[#E11D48] hover:border-[#E11D48] cursor-pointer active:scale-95'
                : 'bg-white/60 text-slate-300 border-slate-200 cursor-not-allowed opacity-40'
            }`}
          >
            <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
          </button>
          <button
            onClick={() => handleSideScroll('right')}
            disabled={!canScrollRight}
            aria-label="Scroll right"
            className={`w-7.5 h-7.5 sm:w-8.5 sm:h-8.5 rounded-lg sm:rounded-xl border flex items-center justify-center transition-all shadow-2xs ${
              canScrollRight
                ? 'bg-white text-[#1B1F3B] border-[#E5E7EB] hover:bg-[#FFE7EC] hover:text-[#E11D48] hover:border-[#E11D48] cursor-pointer active:scale-95'
                : 'bg-white/60 text-slate-300 border-slate-200 cursor-not-allowed opacity-40'
            }`}
          >
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Main Carousel Wrapper with Balanced Floating Side Buttons */}
      <div className="p-3 sm:p-4 relative group/carousel">
        {/* Left Floating Side Button (desktop only) */}
        <button
          onClick={() => handleSideScroll('left')}
          disabled={!canScrollLeft}
          aria-label="Previous categories"
          className={`hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-white/95 backdrop-blur-xs text-[#1B1F3B] border border-[#E5E7EB] shadow-md items-center justify-center hover:bg-[#FFE7EC] hover:text-[#E11D48] hover:border-[#E11D48] transition-all hover:scale-105 active:scale-95 cursor-pointer ${
            canScrollLeft ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-75 pointer-events-none'
          }`}
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Right Floating Side Button (desktop only) */}
        <button
          onClick={() => handleSideScroll('right')}
          disabled={!canScrollRight}
          aria-label="Next categories"
          className={`hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-white/95 backdrop-blur-xs text-[#1B1F3B] border border-[#E5E7EB] shadow-md items-center justify-center hover:bg-[#FFE7EC] hover:text-[#E11D48] hover:border-[#E11D48] transition-all hover:scale-105 active:scale-95 cursor-pointer ${
            canScrollRight ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-75 pointer-events-none'
          }`}
        >
          <ChevronRight className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Horizontally Scrollable Comfortable Quad Department Cards */}
        <div
          ref={scrollContainerRef}
          className="flex gap-3.5 sm:gap-4 overflow-x-auto scroll-smooth no-scrollbar py-0.5 px-0.5 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {FEATURED_QUAD_CARDS.map((card) => {
            const cardTitle = language === 'ne' ? card.nepaliTitle : card.title;

            return (
              <div
                key={card.id}
                className="w-[265px] sm:w-[280px] md:w-[290px] lg:w-[300px] flex-shrink-0 snap-start bg-white rounded-2xl border border-[#E5E7EB] shadow-xs hover:border-[#E11D48] hover:shadow-md transition-all duration-200 p-3 sm:p-3.5 flex flex-col"
              >
                {/* Card Header (Clean title with link) */}
                <div
                  onClick={() => handleCardHeaderClick(card)}
                  className="flex items-center justify-between gap-1 group/header cursor-pointer mb-2 select-none"
                  title={`Explore all ${cardTitle}`}
                >
                  <h3 className="text-[13.5px] sm:text-[14.5px] font-black text-[#1B1F3B] tracking-tight leading-tight group-hover/header:text-[#E11D48] transition-colors truncate">
                    {cardTitle}
                  </h3>
                  <ChevronRight className="w-3.5 h-3.5 text-[#5B6070] flex-shrink-0 group-hover/header:translate-x-0.5 group-hover/header:text-[#E11D48] transition-all stroke-[2.5]" />
                </div>

                {/* 2x2 Quadrant Grid */}
                <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                  {card.quadrants.map((quad) => {
                    const quadLabel = language === 'ne' ? quad.nepaliLabel : quad.label;

                    return (
                      <div
                        key={quad.id}
                        onClick={(e) => handleQuadrantClick(card, quad, e)}
                        className="group/item flex flex-col cursor-pointer"
                        title={`Filter by ${quadLabel}`}
                      >
                        {/* Thumbnail Container */}
                        <div
                          className="aspect-square w-full rounded-xl overflow-hidden relative bg-[#FAFAFB] border border-[#E5E7EB]/90 shadow-2xs group-hover/item:border-[#E11D48]/40 group-hover/item:shadow-sm transition-all duration-200 flex items-center justify-center p-2"
                        >
                          <img
                            src={quad.image}
                            alt={quad.alt || quadLabel}
                            loading="lazy"
                            className="w-full h-full object-contain scale-98 group-hover/item:scale-105 transition-transform duration-300 ease-out"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80';
                            }}
                          />
                        </div>

                        {/* Item Caption Underneath */}
                        <span
                          className="mt-1 text-[10.5px] sm:text-[11px] font-semibold text-[#5B6070] text-center leading-tight line-clamp-1 group-hover/item:text-[#E11D48] transition-colors"
                          title={quadLabel}
                        >
                          {quadLabel}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
