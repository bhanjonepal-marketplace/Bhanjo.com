import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

// 4 Signature Extra-Large Curated Amazon Quad Department Cards
const FEATURED_QUAD_CARDS = [
  {
    id: 'shoes-trends',
    title: 'Fashion trends in Shoes',
    nepaliTitle: 'फेसन ट्रेन्ड्स: जुत्ता तथा स्यान्डल',
    categoryId: 'shoes-accessories',
    searchKeyword: 'Shoes',
    quadrants: [
      {
        id: 'women-shoes',
        label: "Women's",
        nepaliLabel: 'महिला जुत्ता',
        keyword: 'Women Heels',
        bg: 'bg-[#ffccd6]',
        image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80',
        alt: "Women's Trendy Shoes"
      },
      {
        id: 'men-shoes',
        label: "Men's",
        nepaliLabel: 'पुरुष स्निकर्स',
        keyword: 'Sneakers',
        bg: 'bg-[#ffea75]',
        image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=600&q=80',
        alt: "Men's Shoes & Sneakers"
      },
      {
        id: 'kids-shoes',
        label: "Kids'",
        nepaliLabel: 'बालबालिका स्यान्डल',
        keyword: 'Kids Sandals',
        bg: 'bg-[#3ca3b5]',
        image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=600&q=80',
        alt: "Kids' Sandals"
      },
      {
        id: 'all-shoes',
        label: 'All shoes',
        nepaliLabel: 'सबै जुत्ताहरू',
        keyword: 'Shoes',
        bg: 'bg-[#e5a84e]',
        image: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=600&q=80',
        alt: 'All Shoes & Footwear'
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
        bg: 'bg-[#f4efe8]',
        image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=600&q=80',
        alt: 'Kitchen essentials power blender'
      },
      {
        id: 'home-comfort',
        label: 'Home comfort',
        nepaliLabel: 'बैठक कोठा सजावट',
        keyword: 'Living Room',
        bg: 'bg-[#f0ebe1]',
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80',
        alt: 'Home comfort living room'
      },
      {
        id: 'decorate-elegance',
        label: 'Decorate with elegance',
        nepaliLabel: 'कलात्मक सजावट',
        keyword: 'Decor',
        bg: 'bg-[#ece7df]',
        image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
        alt: 'Decorate with elegance vases and flowers'
      },
      {
        id: 'light-it-right',
        label: 'Light it Right',
        nepaliLabel: 'आधुनिक बत्तीहरू',
        keyword: 'Lamp',
        bg: 'bg-[#f7eedc]',
        image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80',
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
        bg: 'bg-[#ffd3db]',
        image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80',
        alt: "Women's Nude High Heels"
      },
      {
        id: 'budget-mens',
        label: "Men's",
        nepaliLabel: 'पुरुष छालाको जुत्ता',
        keyword: 'Formal Shoes',
        bg: 'bg-[#f0dfcc]',
        image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=600&q=80',
        alt: "Men's Leather Dress Shoes"
      },
      {
        id: 'budget-girls',
        label: "Girl's",
        nepaliLabel: 'बालिका जुत्ता',
        keyword: 'School Shoes',
        bg: 'bg-[#d2edd7]',
        image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=600&q=80',
        alt: "Girl's School Shoes"
      },
      {
        id: 'budget-boys',
        label: "Boy's",
        nepaliLabel: 'बालक स्निकर',
        keyword: 'Kids Sneakers',
        bg: 'bg-[#3ec7e8]',
        image: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=600&q=80',
        alt: "Boy's Toddler Blue Sneakers"
      }
    ]
  },
  {
    id: 'furry-friends',
    title: 'What you need for furry friends',
    nepaliTitle: 'घरपालुवा जनावरका सामग्री',
    categoryId: 'gift-kids-toys',
    searchKeyword: 'Pet',
    quadrants: [
      {
        id: 'dogs',
        label: 'Dogs',
        nepaliLabel: 'कुकुरका सामग्री',
        keyword: 'Dog',
        bg: 'bg-[#f4efe8]',
        image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80',
        alt: 'Happy Fluffy Dog'
      },
      {
        id: 'cats',
        label: 'Cats',
        nepaliLabel: 'बिरालोका सामग्री',
        keyword: 'Cat',
        bg: 'bg-[#f5f1ea]',
        image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80',
        alt: 'Adorable Ginger Cat'
      },
      {
        id: 'small-pets',
        label: 'Small Pets',
        nepaliLabel: 'साना घरपालुवा जनावर',
        keyword: 'Pet',
        bg: 'bg-[#f0ebe3]',
        image: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?auto=format&fit=crop&w=600&q=80',
        alt: 'Cute Hamster Small Pet'
      },
      {
        id: 'pet-deals',
        label: 'Deals',
        nepaliLabel: 'विशेष छुट अफरहरू',
        keyword: 'Pet Toy',
        bg: 'bg-[#f8f5f0]',
        image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=600&q=80',
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
    <section className="mt-8 mb-12 sm:mb-16" id="amazon-quad-catalog">
      {/* 4 Extra-Large Amazon-Style Quad Department Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
        {FEATURED_QUAD_CARDS.map((card) => {
          const cardTitle = language === 'ne' ? card.nepaliTitle : card.title;

          return (
            <div
              key={card.id}
              className="bg-white rounded-[22px] sm:rounded-[26px] border border-slate-200/90 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_32px_-6px_rgba(0,0,0,0.12)] transition-all duration-300 p-5 sm:p-6 pb-6 sm:pb-7 flex flex-col justify-between"
            >
              {/* Card Header (Bold title with chevron > link) */}
              <div
                onClick={() => handleCardHeaderClick(card)}
                className="flex items-center justify-between gap-2 group/header cursor-pointer mb-4 sm:mb-5 select-none"
                title={`Explore all ${cardTitle}`}
              >
                <h3 className="text-[19px] sm:text-[20px] font-black text-slate-900 tracking-tight leading-snug group-hover/header:text-[#F85606] transition-colors line-clamp-2">
                  {cardTitle}
                </h3>
                <ChevronRight className="w-5 h-5 text-slate-800 flex-shrink-0 group-hover/header:translate-x-1 group-hover/header:text-[#F85606] transition-all stroke-[2.5]" />
              </div>

              {/* 2x2 Quadrant Grid (Bigger boxes, edge-to-edge zoomed in images) */}
              <div className="grid grid-cols-2 gap-3.5 sm:gap-4 flex-1">
                {card.quadrants.map((quad) => {
                  const quadLabel = language === 'ne' ? quad.nepaliLabel : quad.label;

                  return (
                    <div
                      key={quad.id}
                      onClick={(e) => handleQuadrantClick(card, quad, e)}
                      className="group/item flex flex-col cursor-pointer"
                      title={`Filter by ${quadLabel}`}
                    >
                      {/* Thumbnail Container: Extra spacious, zero padding, full bleed zoomed-in image */}
                      <div
                        className={`aspect-square w-full rounded-[16px] sm:rounded-[20px] overflow-hidden relative ${quad.bg} shadow-xs group-hover/item:shadow-md transition-all duration-300`}
                      >
                        <img
                          src={quad.image}
                          alt={quad.alt || quadLabel}
                          loading="lazy"
                          className="w-full h-full object-cover scale-100 group-hover/item:scale-108 transition-transform duration-500 ease-out"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80';
                          }}
                        />
                      </div>

                      {/* Item Caption Underneath: Clean, crisp and properly proportioned without awkward truncation */}
                      <span className="mt-1.5 text-[11.5px] sm:text-[12.5px] font-medium text-slate-800 leading-snug line-clamp-2 min-h-[30px] flex items-start group-hover/item:text-[#F85606] transition-colors">
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
    </section>
  );
};
