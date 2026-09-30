export const PRODUCTS = [
  // 1. Apparel & Accessories
  {
    id: "prod-pashmina-shawl",
    title: "100% Pure Himalayan Chyangra Cashmere Pashmina Shawl (Hand-Woven Grade A)",
    nepaliTitle: "शुद्ध च्याङ्ग्रा पश्मिना दोसल्ला",
    categoryId: "apparel-accessories",
    categoryName: "Apparel & Accessories",
    supplierId: "sup-himalayan-artisans",
    supplierName: "Himalayan Heritage Craft & Textiles Ltd.",
    supplierCountry: "Nepal",
    supplierFlag: "🇳🇵",
    verifiedYear: 8,
    isTradeAssurance: true,
    rating: 4.9,
    reviewsCount: 148,
    moq: 10,
    unit: "pieces",
    leadTime: "7-12 Days",
    samplePrice: 35.00,
    priceTiers: [
      { minQty: 10, maxQty: 49, price: 24.50 },
      { minQty: 50, maxQty: 199, price: 19.80 },
      { minQty: 200, maxQty: 999, price: 16.50 },
      { minQty: 1000, maxQty: null, price: 13.90 }
    ],
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1606744888344-493238955de0?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=800&q=80"
    ],
    customization: ["Custom Woven Label (MOQ 50 pcs)", "Custom Color Dyeing (Pantone)", "Gift Box Packaging"],
    specs: {
      "Material": "100% Himalayan Mountain Chyangra Cashmere (14.5-15.5 micron)",
      "Weave Type": "Diamond Weave Handloom",
      "Size": "70 x 200 cm + 3 inch hand-twisted fringes",
      "Weight": "120 - 130 Grams (Featherweight)",
      "Certifications": "Chyangra Hallmark, Oeko-Tex Standard 100",
      "Origin": "Kathmandu / Mustang, Nepal"
    },
    featured: true,
    isHimalayanExport: true,
    description: "Ethically harvested from mountain capra hircus goats in the Himalayan plateaus of Mustang and Dolpo. Ultra-soft, lightweight, and supreme warmth. Directly supplied with authentic Chyangra Pashmina Trademark accreditation."
  },
  {
    id: "prod-palpali-dhaka-fabric",
    title: "Authentic Palpali Dhaka Cotton Fabric Rolls (Traditional Geometric Weave)",
    nepaliTitle: "तानमा बुनेको पाल्पाली ढाका कपडा",
    categoryId: "apparel-accessories",
    categoryName: "Apparel & Accessories",
    supplierId: "sup-himalayan-artisans",
    supplierName: "Himalayan Heritage Craft & Textiles Ltd.",
    supplierCountry: "Nepal",
    supplierFlag: "🇳🇵",
    verifiedYear: 8,
    isTradeAssurance: true,
    rating: 4.8,
    reviewsCount: 64,
    moq: 20,
    unit: "meters",
    leadTime: "10-15 Days",
    samplePrice: 12.00,
    priceTiers: [
      { minQty: 20, maxQty: 99, price: 8.50 },
      { minQty: 100, maxQty: 499, price: 6.80 },
      { minQty: 500, maxQty: null, price: 5.20 }
    ],
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80"
    ],
    customization: ["Custom Pattern Weave", "Custom Color Combinations", "Finished Topi/Waistcoat Tailoring"],
    specs: {
      "Composition": "100% Mercerized Cotton Thread",
      "Width": "36 inches (92 cm)",
      "Craft": "Hand-Operated Wooden Shuttle Looms",
      "Place of Origin": "Palpa & Terhathum, Nepal"
    },
    featured: false,
    isHimalayanExport: true,
    description: "Intricately hand-woven on wooden looms by skilled female artisans in Tansen, Palpa. Iconic geometric patterns suitable for ethnic suits, vests, ties, bags, and luxury interior upholstery."
  },

  // 2. Gifts & Crafts (Singing Bowls, Thangka, Khukuri)
  {
    id: "prod-singing-bowl-set",
    title: "Master Antique 7-Metal Hand-Hammered Tibetan Meditation Singing Bowl (Full Chakra Set)",
    nepaliTitle: "हातले कुँदेको ७-धातु सिङगिङ बोल सेट",
    categoryId: "gifts-crafts",
    categoryName: "Gifts & Crafts",
    supplierId: "sup-himalayan-artisans",
    supplierName: "Himalayan Heritage Craft & Textiles Ltd.",
    supplierCountry: "Nepal",
    supplierFlag: "🇳🇵",
    verifiedYear: 8,
    isTradeAssurance: true,
    rating: 5.0,
    reviewsCount: 312,
    moq: 5,
    unit: "sets",
    leadTime: "5-10 Days",
    samplePrice: 95.00,
    priceTiers: [
      { minQty: 5, maxQty: 19, price: 68.00 },
      { minQty: 20, maxQty: 99, price: 54.00 },
      { minQty: 100, maxQty: null, price: 42.50 }
    ],
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80"
    ],
    customization: ["Custom Laser Mantra Engraving", "Embroidered Silk Cushion with Logo", "Custom Wooden Mallets"],
    specs: {
      "Composition": "7 Planetary Metals (Copper, Tin, Zinc, Iron, Lead, Silver, Gold traces)",
      "Frequencies": "432Hz Healing Frequency & 528Hz Solfeggio Scale",
      "Set Contents": "7 Bowls (5\" to 10\" diameter) + 7 Cushions + 7 Wooden/Leather Mallets",
      "Sound Duration": "45-75 Seconds Sustained Resonance"
    },
    featured: true,
    isHimalayanExport: true,
    description: "Each singing bowl is meticulously heated in charcoal kilns and hand-hammered by Newari metal smith masters in Patan. Produces pristine overtone vibrations ideal for sound therapy, yoga studios, and holistic wellness centers."
  },

  // 3. Agriculture, Food & Beverage (Ilam Tea, Honey, Cardamom)
  {
    id: "prod-ilam-orthodox-tea",
    title: "Himalayan Single-Estate Orthodox Imperial Black Tea (First Flush FTGFOP1)",
    nepaliTitle: "इलाम अर्गानिक अर्थोडक्स चिया (पहिलो टिपाइ)",
    categoryId: "agriculture-food-beverage",
    categoryName: "Agriculture, Food & Beverage",
    supplierId: "sup-ilam-tea-estate",
    supplierName: "Ilam Valley Orthodox Organics & Spices Corp.",
    supplierCountry: "Nepal",
    supplierFlag: "🇳🇵",
    verifiedYear: 10,
    isTradeAssurance: true,
    rating: 5.0,
    reviewsCount: 220,
    moq: 50,
    unit: "kg",
    leadTime: "7-14 Days",
    samplePrice: 30.00,
    priceTiers: [
      { minQty: 50, maxQty: 199, price: 18.50 },
      { minQty: 200, maxQty: 999, price: 14.80 },
      { minQty: 1000, maxQty: null, price: 11.50 }
    ],
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=800&q=80"
    ],
    customization: ["Private Label Aluminum Pouches", "Custom Tin Cans with Embossing", "Biodegradable Pyramid Tea Bags"],
    specs: {
      "Grade": "FTGFOP1 (Finest Tippy Golden Flowery Orange Pekoe One)",
      "Elevation": "1,800m - 2,200m Above Sea Level (Kanchanjunga Foothills)",
      "Harvest Period": "Spring First Flush (March-April)",
      "Certifications": "USDA Organic, EU Organic, HACCP Certified",
      "Packaging": "25kg Vacuum Triple-Layer Foil Sacks"
    },
    featured: true,
    isHimalayanExport: true,
    description: "Harvested at dawn on misty Himalayan mountain slopes in Ilam. Golden tips with rich muscatel aroma, floral notes, and zero chemical pesticides. Supreme export grade for premium international tea blenders."
  },
  {
    id: "prod-wild-mad-honey",
    title: "100% Pure Himalayan Cliff Mad Honey (High Grayanotoxin / Raw Lab Tested)",
    nepaliTitle: "सर्टिफाइड भिर मह (Mad Honey)",
    categoryId: "agriculture-food-beverage",
    categoryName: "Agriculture, Food & Beverage",
    supplierId: "sup-ilam-tea-estate",
    supplierName: "Ilam Valley Orthodox Organics & Spices Corp.",
    supplierCountry: "Nepal",
    supplierFlag: "🇳🇵",
    verifiedYear: 10,
    isTradeAssurance: true,
    rating: 4.9,
    reviewsCount: 175,
    moq: 10,
    unit: "kg",
    leadTime: "7-10 Days",
    samplePrice: 85.00,
    priceTiers: [
      { minQty: 10, maxQty: 49, price: 65.00 },
      { minQty: 50, maxQty: 199, price: 52.00 },
      { minQty: 200, maxQty: null, price: 42.00 }
    ],
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1587049352851-8d4e89133924?auto=format&fit=crop&w=800&q=80"
    ],
    customization: ["Custom Glass Jars (250g/500g)", "Custom Tamper-Evident Box", "Certificate of Analysis Insertion"],
    specs: {
      "Harvest Origin": "Lamjung / Annapurna Steep Cliffs (2,500m - 3,500m)",
      "Bee Species": "Apis Laboriosa (World's Largest Honeybee)",
      "Active Compound": "Natural Grayanotoxin III (Certified Potency)",
      "Processing": "Raw, Unfiltered, Cold-Extracted",
      "Testing": "HPLC Lab Tested Certificate included with each batch"
    },
    featured: true,
    isHimalayanExport: true,
    description: "Harvested by indigenous Gurung cliff honey hunters from wild nests of Apis laboriosa high on cliff faces. Renowned globally for potent adaptogenic qualities and distinctive amber nectar."
  },

  // 4. Renewable Energy (Solar Panels, Hydro Turbines, LiFePO4 Batteries)
  {
    id: "prod-topcon-solar-panel",
    title: "580W-620W N-Type Bifacial TOPCon Tier-1 High Efficiency Solar Photovoltaic Module",
    nepaliTitle: "५८० वाट एन-टाइप बाइफ्यासियल सोलार प्यानल",
    categoryId: "renewable-energy",
    categoryName: "Renewable Energy",
    supplierId: "sup-everest-solar-hydro",
    supplierName: "Everest CleanEnergy & Micro-Hydro Tech Co.",
    supplierCountry: "Nepal",
    supplierFlag: "🇳🇵",
    verifiedYear: 6,
    isTradeAssurance: true,
    rating: 4.9,
    reviewsCount: 94,
    moq: 36,
    unit: "pieces (1 Pallet)",
    leadTime: "10-20 Days",
    samplePrice: 120.00,
    priceTiers: [
      { minQty: 36, maxQty: 180, price: 78.50 },
      { minQty: 181, maxQty: 720, price: 69.20 },
      { minQty: 721, maxQty: null, price: 61.80 }
    ],
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=800&q=80"
    ],
    customization: ["Custom Junction Box & Cable Length", "OEM Brand Logo on Glass/Frame", "Pallet Custom Crating"],
    specs: {
      "Cell Type": "N-Type TOPCon 182mm x 182mm (144 Half-cut cells)",
      "Module Efficiency": "22.8% - 23.4%",
      "Bifaciality": "80% ± 5% (Dual Glass 2.0mm + 2.0mm)",
      "Frame": "Anodized Heavy-Duty Aluminum Alloy (5400Pa Snow / 2400Pa Wind)",
      "Warranty": "15-Year Product + 30-Year Linear Power Warranty (87.4% Output)",
      "Certifications": "TUV Rheinland, CE, IEC 61215/61730, ISO 9001"
    },
    featured: true,
    isHimalayanExport: false,
    description: "Ultra-high output N-type TOPCon dual glass solar panels with extreme temperature coefficient performance ideal for both rooftop commercial installations and megawatt utility solar farms."
  },
  {
    id: "prod-micro-hydro-pelton",
    title: "50kW - 250kW High Head Micro-Hydro Pelton Turbine & Brushless Generator Set",
    nepaliTitle: "५० किलोवाट माइक्रो हाइड्रो पेल्टन टर्बाइन",
    categoryId: "renewable-energy",
    categoryName: "Renewable Energy",
    supplierId: "sup-everest-solar-hydro",
    supplierName: "Everest CleanEnergy & Micro-Hydro Tech Co.",
    supplierCountry: "Nepal",
    supplierFlag: "🇳🇵",
    verifiedYear: 6,
    isTradeAssurance: true,
    rating: 4.8,
    reviewsCount: 42,
    moq: 1,
    unit: "set",
    leadTime: "25-35 Days",
    samplePrice: 9500.00,
    priceTiers: [
      { minQty: 1, maxQty: 2, price: 8800.00 },
      { minQty: 3, maxQty: 9, price: 7600.00 },
      { minQty: 10, maxQty: null, price: 6500.00 }
    ],
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
    ],
    customization: ["Custom Head & Flow Nozzle Sizing", "Electronic Load Governor (ELG) Integration", "SCADA Remote Monitoring"],
    specs: {
      "Rated Output": "50 kW - 250 kW (Configurable)",
      "Design Head": "60m - 350m High Water Head",
      "Efficiency": "Turbine 89% / Generator 94%",
      "Runner Material": "Stainless Steel 316 CNC Machined Monoblock",
      "Generator": "Brushless Synchronous 400V 3-Phase 50Hz/60Hz",
      "Origin": "Manufactured in Butwal / Kathmandu, Nepal"
    },
    featured: true,
    isHimalayanExport: true,
    description: "Engineered specifically for mountainous Himalayan and Andean terrains. Features monoblock CNC stainless steel Pelton runner, automatic spear needle control, and digital PLC electronic load governor."
  },

  // 5. Industrial Machinery (Fiber Laser, CNC, Crushers)
  {
    id: "prod-fiber-laser-cutter",
    title: "12,000W Heavy-Duty CNC Fiber Laser Metal Sheet & Tube Cutting Machine (Raycus / IPG)",
    nepaliTitle: "१२००० वाट सीएनसी फाइबर लेजर काट्ने मेसिन",
    categoryId: "industrial-machinery",
    categoryName: "Industrial Machinery",
    supplierId: "sup-apex-machinery-global",
    supplierName: "Apex Precision Heavy Machinery & CNC Works",
    supplierCountry: "China",
    supplierFlag: "🇨🇳",
    verifiedYear: 12,
    isTradeAssurance: true,
    rating: 4.9,
    reviewsCount: 180,
    moq: 1,
    unit: "set",
    leadTime: "20-30 Days",
    samplePrice: 38000.00,
    priceTiers: [
      { minQty: 1, maxQty: 2, price: 34500.00 },
      { minQty: 3, maxQty: 5, price: 31000.00 },
      { minQty: 6, maxQty: null, price: 27500.00 }
    ],
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80"
    ],
    customization: ["Exchange Table Dual Platform", "Rotary Chuck for Pipe & Tube Cutting", "Laser Power 3kW - 30kW Options"],
    specs: {
      "Working Area": "3000mm x 1500mm (Up to 6000x2500mm)",
      "Laser Source": "Raycus / Max / IPG 12kW Fiber Laser",
      "Cutting Thickness": "Carbon Steel up to 40mm, Stainless Steel up to 30mm, Aluminum 25mm",
      "Max Acceleration": "1.5G with Yaskawa High-Torque Servo Motors",
      "Control System": "CypCut CNC with Automatic Nesting Software"
    },
    featured: true,
    isHimalayanExport: false,
    description: "Industrial grade heavy cast iron bed with thermal annealing. Delivers exceptional cutting precision (±0.02mm) for manufacturing steel structures, machinery panels, automotive chassis, and decorative architectural screens."
  },
  {
    id: "prod-jaw-rock-crusher",
    title: "150-250 TPH Heavy Duty Primary Jaw Crusher for River Gravel & Mountain Stone",
    nepaliTitle: "१५०-२५० टन क्षमताको हेभी जब क्रसर",
    categoryId: "construction-building-machinery",
    categoryName: "Construction & Building Machinery",
    supplierId: "sup-apex-machinery-global",
    supplierName: "Apex Precision Heavy Machinery & CNC Works",
    supplierCountry: "China",
    supplierFlag: "🇨🇳",
    verifiedYear: 12,
    isTradeAssurance: true,
    rating: 4.8,
    reviewsCount: 110,
    moq: 1,
    unit: "set",
    leadTime: "15-25 Days",
    samplePrice: 22000.00,
    priceTiers: [
      { minQty: 1, maxQty: 2, price: 19800.00 },
      { minQty: 3, maxQty: 9, price: 17500.00 },
      { minQty: 10, maxQty: null, price: 15500.00 }
    ],
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80"
    ],
    customization: ["Electric Motor or Cummins Diesel Driven", "Skid Mounted / Mobile Trailer Chassis", "Custom Discharge Sieve"],
    specs: {
      "Feed Opening Size": "750mm x 1060mm (PE-750x1060)",
      "Max Feeding Size": "630mm",
      "Capacity": "120 - 280 Tons per Hour",
      "Power": "110 kW Heavy Electric Motor",
      "Jaw Plate Material": "High Manganese Steel Mn13Cr2 / Mn18Cr2"
    },
    featured: true,
    isHimalayanExport: false,
    description: "Heavy duty primary rock crushing plant designed for crushing hard river boulders, basalt, granite, and limestone aggregates. Extensively deployed in hydropower tunneling and highway construction."
  },

  // 6. Construction & Real Estate (TMT Steel Bars)
  {
    id: "prod-tmt-steel-rebar",
    title: "Fe-500D Grade High-Ductility Earthquake-Resistant TMT Steel Rebar (8mm - 32mm)",
    nepaliTitle: "शक्ति Fe-500D भूकम्प प्रतिरोधी टीएमटी डण्डी",
    categoryId: "construction-real-estate",
    categoryName: "Construction & Real Estate",
    supplierId: "sup-shakti-steel-infra",
    supplierName: "Shakti Himalayan Steel & TMT Heavy Industries",
    supplierCountry: "Nepal",
    supplierFlag: "🇳🇵",
    verifiedYear: 9,
    isTradeAssurance: true,
    rating: 4.9,
    reviewsCount: 150,
    moq: 10,
    unit: "tons",
    leadTime: "3-7 Days",
    samplePrice: 1100.00,
    priceTiers: [
      { minQty: 10, maxQty: 49, price: 820.00 },
      { minQty: 50, maxQty: 199, price: 760.00 },
      { minQty: 200, maxQty: null, price: 710.00 }
    ],
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80"
    ],
    customization: ["Custom Cut-to-Length Bundles", "Anti-Corrosion Epoxy Coating", "Direct Site Crane Delivery"],
    specs: {
      "Steel Grade": "Fe-500D High Elongation (Min 16% Elongation)",
      "Yield Strength": "500 - 540 N/mm²",
      "Standard Compliance": "NS-191 / IS 1786:2008 / BS 4449",
      "Sizes Available": "8mm, 10mm, 12mm, 16mm, 20mm, 25mm, 32mm",
      "Origin": "Simara Industrial Corridor, Nepal"
    },
    featured: true,
    isHimalayanExport: true,
    description: "Quenched and self-tempered (Thermex German technology) high ductility TMT rebars engineered for high seismic zone civil construction, high-rise towers, and hydroelectric spillways."
  },

  // 7. Health & Medical (Pure Himalayan Shilajit)
  {
    id: "prod-himalayan-shilajit-resin",
    title: "100% Pure Himalayan Gold Grade Shilajit Resin (85%+ Fulvic Acid Lab Certified)",
    nepaliTitle: "शुद्ध हिमालयन सिलाजित (गोल्ड ग्रेड)",
    categoryId: "health-medical",
    categoryName: "Health & Medical",
    supplierId: "sup-solu-ayurveda",
    supplierName: "Solu Himalayan Herbals & Shilajit Extraction",
    supplierCountry: "Nepal",
    supplierFlag: "🇳🇵",
    verifiedYear: 7,
    isTradeAssurance: true,
    rating: 5.0,
    reviewsCount: 290,
    moq: 20,
    unit: "jars (50g)",
    leadTime: "5-8 Days",
    samplePrice: 28.00,
    priceTiers: [
      { minQty: 20, maxQty: 99, price: 16.50 },
      { minQty: 100, maxQty: 499, price: 12.80 },
      { minQty: 500, maxQty: 1999, price: 9.50 },
      { minQty: 2000, maxQty: null, price: 7.20 }
    ],
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80"
    ],
    customization: ["Custom Labeling & Luxury Box Packaging", "Custom Wooden Measuring Spoons", "Bulk Drum Supply (1kg - 25kg)"],
    specs: {
      "Harvest Altitude": "Above 16,000 ft (High Himalayas of Solukhumbu & Manang)",
      "Fulvic Acid Content": "85.4% (HPLC Certified by Eurofins)",
      "Heavy Metal Test": "Lead, Cadmium, Arsenic < 0.1 ppm (US FDA Pass)",
      "Form": "Semi-solid resin (Purified 40x Sun-Dried Process)",
      "Shelf Life": "36 Months"
    },
    featured: true,
    isHimalayanExport: true,
    description: "Sun-purified through traditional Ayurvedic Triphala decoctions and cold-filtered. Rich in 84+ essential ionic trace minerals and high fulvic acid. Available in private label jars or wholesale industrial drums."
  },

  // 8. Pet Supplies (Yak Cheese Dog Chews)
  {
    id: "prod-yak-cheese-dog-chew",
    title: "100% Natural Himalayan Yak Cheese Hard Dog Chews (Chhurpi / Grain-Free Grade A)",
    nepaliTitle: "अर्गानिक छुर्पी कुकुरको च्यु (Yak Chew)",
    categoryId: "pet-supplies",
    categoryName: "Pet Supplies",
    supplierId: "sup-himalayan-artisans",
    supplierName: "Himalayan Heritage Craft & Textiles Ltd.",
    supplierCountry: "Nepal",
    supplierFlag: "🇳🇵",
    verifiedYear: 8,
    isTradeAssurance: true,
    rating: 5.0,
    reviewsCount: 340,
    moq: 50,
    unit: "kg",
    leadTime: "7-14 Days",
    samplePrice: 32.00,
    priceTiers: [
      { minQty: 50, maxQty: 199, price: 18.20 },
      { minQty: 200, maxQty: 999, price: 14.90 },
      { minQty: 1000, maxQty: null, price: 11.80 }
    ],
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80"
    ],
    customization: ["Sizes S (30g), M (70g), L (120g), XL (180g), Jumbo", "Private Label Stand-Up Pouches with Barcode", "Flavor Infusion (Turmeric, Mint)"],
    specs: {
      "Ingredients": "99.9% Yak & Cow Milk, Lime Juice, Himalayan Salt trace",
      "Protein Content": "Min 65% Crude Protein",
      "Fat Content": "Max 1.5% Low Fat, Lactose Free (<0.1%)",
      "Preservatives": "100% Free of Chemicals, Additives or Grains",
      "Certifications": "Nepal Department of Food Tech & Quality Control, USDA APHIS Approved"
    },
    featured: true,
    isHimalayanExport: true,
    description: "World-famous long-lasting dental dog chew smoked and sun-dried for over 35 days in Himalayan valleys. Completely digestible, odor-free, non-staining, and rich in essential calcium and protein."
  },

  // 9. Luggage, Bags & Cases (Himalayan Hemp Backpacks)
  {
    id: "prod-hemp-backpack",
    title: "100% Pure Wild Himalayan Hemp & Cotton Boho Travel Laptop Backpack",
    nepaliTitle: "शुद्ध जंगली गाँजाको रेशाबाट बनेको ब्याकप्याक",
    categoryId: "luggage-bags-cases",
    categoryName: "Luggage, Bags & Cases",
    supplierId: "sup-himalayan-artisans",
    supplierName: "Himalayan Heritage Craft & Textiles Ltd.",
    supplierCountry: "Nepal",
    supplierFlag: "🇳🇵",
    verifiedYear: 8,
    isTradeAssurance: true,
    rating: 4.8,
    reviewsCount: 190,
    moq: 20,
    unit: "pieces",
    leadTime: "7-12 Days",
    samplePrice: 22.00,
    priceTiers: [
      { minQty: 20, maxQty: 99, price: 14.50 },
      { minQty: 100, maxQty: 499, price: 11.20 },
      { minQty: 500, maxQty: null, price: 8.80 }
    ],
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=800&q=80"
    ],
    customization: ["Custom Embroidered / Woven Logo Badge", "Custom Color Combinations (Natural Dye)", "Padded 15.6\" Laptop Sleeve"],
    specs: {
      "Material": "100% Organic Wild Himalayan Hemp + Heavy Cotton Canvas Lining",
      "Zippers": "Heavy Duty YKK Metal Zippers",
      "Capacity": "25 Liters (Multi-pocket compartment)",
      "Sustainability": "Eco-friendly, Biodegradable, Antimicrobial"
    },
    featured: true,
    isHimalayanExport: true,
    description: "Crafted from wild organic cannabis sativa bast fibers harvested sustainably in western Nepal (Rukum/Rolpa). Durable, breathable, antimicrobial, and naturally water-resistant."
  },

  // 10. Electronic Components & Consumer Electronics (Alibaba Tally - 2X Rate)
  {
    id: "prod-anc-wireless-earbuds",
    title: "Hybrid Active Noise Cancelling (ANC 45dB) TWS Wireless Earbuds with Spatial Audio",
    nepaliTitle: "हाइब्रिड एएनसी वायरलेस इयरबड्स (४५dB नोइज क्यान्सलिङ)",
    categoryId: "consumer-electronics",
    categoryName: "Consumer Electronics",
    supplierId: "sup-transglobal-electronics",
    supplierName: "TransGlobal Microelectronics & IoT Hardware Ltd.",
    supplierCountry: "Taiwan",
    supplierFlag: "🇹🇼",
    verifiedYear: 11,
    isTradeAssurance: true,
    rating: 4.9,
    reviewsCount: 285,
    moq: 10,
    unit: "pieces",
    leadTime: "3-7 Days",
    alibabaBaseRate: 14.00,
    samplePrice: 28.00, // 2x of Alibaba $14.00
    priceTiers: [
      { minQty: 10, maxQty: 49, price: 24.00 },
      { minQty: 50, maxQty: 199, price: 16.80 }, // 2x of $8.40
      { minQty: 200, maxQty: 999, price: 13.20 }, // 2x of $6.60
      { minQty: 1000, maxQty: null, price: 9.90 }  // 2x of $4.95
    ],
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=800&q=80"
    ],
    customization: ["Custom Logo Silk-Screen & Laser Etching", "Custom Bluetooth Pairing Name & Voice Prompts", "Retail Packaging with Foil Stamping"],
    specs: {
      "Alibaba Baseline Rate": "$14.00 (Bhanjo 2X Marketplace: $28.00)",
      "Noise Reduction": "Hybrid ANC up to -45dB + Transparency Mode",
      "Bluetooth Version": "Bluetooth 5.4 + LDAC / AAC Hi-Res Codec",
      "Battery Life": "8h (Earbuds) + 32h (Charging Case)",
      "Waterproof": "IPX7 Water & Sweat Resistant"
    },
    featured: true,
    isHimalayanExport: false,
    description: "Premium sound clarity featuring 13mm beryllium dynamic drivers, 6-mic ENC crystal clear calling, low latency gaming mode (38ms), and wireless Qi charging."
  },
  {
    id: "prod-smartwatch-amoled",
    title: "1.96\" HD AMOLED Military Smart Watch with Bluetooth Calling & Health Tracker",
    nepaliTitle: "१.९६ इन्च एमोलेड ब्लुटुथ कलिङ स्मार्टवाच",
    categoryId: "consumer-electronics",
    categoryName: "Consumer Electronics",
    supplierId: "sup-transglobal-electronics",
    supplierName: "TransGlobal Microelectronics & IoT Hardware Ltd.",
    supplierCountry: "Taiwan",
    supplierFlag: "🇹🇼",
    verifiedYear: 11,
    isTradeAssurance: true,
    rating: 4.8,
    reviewsCount: 340,
    moq: 5,
    unit: "pieces",
    leadTime: "3-5 Days",
    alibabaBaseRate: 14.50,
    samplePrice: 29.00, // 2x of Alibaba $14.50
    priceTiers: [
      { minQty: 5, maxQty: 19, price: 26.00 },
      { minQty: 20, maxQty: 99, price: 24.00 }, // 2x of $12.00
      { minQty: 100, maxQty: 499, price: 19.50 }, // 2x of $9.75
      { minQty: 500, maxQty: null, price: 15.80 }  // 2x of $7.90
    ],
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1510017803434-a899398421b3?auto=format&fit=crop&w=800&q=80"
    ],
    customization: ["Custom Watch Faces with Brand Logo", "Custom Silicone/Metal Straps", "App UI Customization"],
    specs: {
      "Alibaba Baseline Rate": "$14.50 (Bhanjo 2X Marketplace: $29.00)",
      "Display": "1.96-inch Always-On AMOLED (410x502 resolution)",
      "Health Sensors": "SpO2 Oxygen, Dynamic Heart Rate, ECG, Sleep Monitor",
      "Battery": "400mAh High Density (14 Days Standby / 5 Days Active)",
      "Durability": "IP68 5ATM Waterproof & Shockproof Zinc Alloy Case"
    },
    featured: true,
    isHimalayanExport: false,
    description: "Rugged tactical AMOLED smartwatch with Hi-Fi Bluetooth voice calling, 100+ multi-sports modes, AI voice assistant, and 24/7 biometric health monitoring."
  },
  {
    id: "prod-solar-cctv-4g",
    title: "4K Dual-Lens Solar Powered 4G LTE Wireless PTZ Security Camera (Color Night Vision)",
    nepaliTitle: "४K सोलार ४G वायरलेस सेक्युरिटी सीसीटीभी क्यामेरा",
    categoryId: "consumer-electronics",
    categoryName: "Consumer Electronics",
    supplierId: "sup-apex-machinery-global",
    supplierName: "Apex Precision Heavy Machinery & CNC Works",
    supplierCountry: "China",
    supplierFlag: "🇨🇳",
    verifiedYear: 12,
    isTradeAssurance: true,
    rating: 4.9,
    reviewsCount: 160,
    moq: 2,
    unit: "sets",
    leadTime: "5-10 Days",
    alibabaBaseRate: 39.50,
    samplePrice: 79.00, // 2x of Alibaba $39.50
    priceTiers: [
      { minQty: 2, maxQty: 4, price: 72.00 },
      { minQty: 5, maxQty: 19, price: 68.00 }, // 2x of $34.00
      { minQty: 20, maxQty: 99, price: 56.00 }, // 2x of $28.00
      { minQty: 100, maxQty: null, price: 46.00 }  // 2x of $23.00
    ],
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
    ],
    customization: ["Custom App Branding (Tuya/UBox)", "Solar Panel Wattage Upgrade (8W/12W)", "Custom Packaging"],
    specs: {
      "Alibaba Baseline Rate": "$39.50 (Bhanjo 2X Marketplace: $79.00)",
      "Resolution": "Dual-Lens Ultra HD 4K (8MP Dual Sensor)",
      "Power Source": "8W Monocrystalline Solar Panel + 18,000mAh Battery",
      "Connectivity": "4G LTE SIM Card + 2.4GHz Wi-Fi Support",
      "Rotation": "355° Pan & 90° Tilt with Humanoid Tracking"
    },
    featured: true,
    isHimalayanExport: false,
    description: "100% wire-free outdoor surveillance camera powered by continuous solar charging. Features PIR humanoid detection, full-color spotlight night vision, and cloud/SD recording."
  },
  {
    id: "prod-gan-fast-charger-100w",
    title: "100W GaN III Fast Charger 4-Port Desktop Power Delivery Station (Laptop & Phone)",
    nepaliTitle: "१०० वाट GaN फास्ट चार्जर मल्टि-पोर्ट स्टेशन",
    categoryId: "consumer-electronics",
    categoryName: "Consumer Electronics",
    supplierId: "sup-transglobal-electronics",
    supplierName: "TransGlobal Microelectronics & IoT Hardware Ltd.",
    supplierCountry: "Taiwan",
    supplierFlag: "🇹🇼",
    verifiedYear: 11,
    isTradeAssurance: true,
    rating: 4.9,
    reviewsCount: 220,
    moq: 10,
    unit: "pieces",
    leadTime: "3-5 Days",
    alibabaBaseRate: 16.00,
    samplePrice: 32.00, // 2x of Alibaba $16.00
    priceTiers: [
      { minQty: 10, maxQty: 19, price: 29.00 },
      { minQty: 20, maxQty: 99, price: 26.50 }, // 2x of $13.25
      { minQty: 100, maxQty: 499, price: 21.00 }, // 2x of $10.50
      { minQty: 500, maxQty: null, price: 17.50 }  // 2x of $8.75
    ],
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1609592424369-0268c1303867?auto=format&fit=crop&w=800&q=80"
    ],
    customization: ["Laser Printed Logo", "Regional Plugs (EU/US/UK/India)", "Custom Colorway (White/Black/Space Gray)"],
    specs: {
      "Alibaba Baseline Rate": "$16.00 (Bhanjo 2X Marketplace: $32.00)",
      "Total Power": "100W Max with Gallium Nitride (GaN III) IC",
      "Ports": "2x USB-C (PD 3.0 / PPS 100W) + 2x USB-A (QC 4.0+ 30W)",
      "Safety Certs": "CE, FCC, RoHS, UL 94V-0 Flame Retardant",
      "Compatibility": "MacBook Pro, iPhone 16/15, Samsung S24, Dell XPS, iPad"
    },
    featured: false,
    isHimalayanExport: false,
    description: "Compact next-gen GaN semiconductor fast charger capable of simultaneously powering 2 laptops and 2 smartphones at maximum rated wattage with intelligent thermal dispersion."
  },
  {
    id: "prod-rugged-android-tablet",
    title: "10.1\" Octa-Core Android 14 4G LTE Rugged Commercial & Educational Tablet PC",
    nepaliTitle: "१०.१ इन्च एन्ड्रोइड १४ रग्ड ट्याब्लेट पीसी",
    categoryId: "consumer-electronics",
    categoryName: "Consumer Electronics",
    supplierId: "sup-transglobal-electronics",
    supplierName: "TransGlobal Microelectronics & IoT Hardware Ltd.",
    supplierCountry: "Taiwan",
    supplierFlag: "🇹🇼",
    verifiedYear: 11,
    isTradeAssurance: true,
    rating: 4.8,
    reviewsCount: 175,
    moq: 5,
    unit: "units",
    leadTime: "5-10 Days",
    alibabaBaseRate: 54.00,
    samplePrice: 108.00, // 2x of Alibaba $54.00
    priceTiers: [
      { minQty: 5, maxQty: 9, price: 99.00 },
      { minQty: 10, maxQty: 49, price: 92.00 }, // 2x of $46.00
      { minQty: 50, maxQty: 199, price: 79.00 }, // 2x of $39.50
      { minQty: 200, maxQty: null, price: 68.00 }  // 2x of $34.00
    ],
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=800&q=80"
    ],
    customization: ["Pre-loaded Custom OS & Kiosk App", "Silicone Drop-Proof Bumper Case", "Stylus Pen Bundle"],
    specs: {
      "Alibaba Baseline Rate": "$54.00 (Bhanjo 2X Marketplace: $108.00)",
      "Screen": "10.1-inch IPS Full HD (1920x1200) Touchscreen",
      "Processor & Memory": "UNISOC T606 Octa-Core 2.0GHz / 8GB RAM + 128GB ROM",
      "Network": "Dual SIM 4G LTE + Dual Band 5G Wi-Fi + GPS",
      "Battery": "8,000mAh Lithium Polymer (10 Hours Video Playback)"
    },
    featured: true,
    isHimalayanExport: false,
    description: "Versatile, rugged tablet built for classroom learning, field inspections, mobile POS registers, and multimedia entertainment with Google Mobile Services (GMS) certification."
  },
  {
    id: "prod-4k-gps-drone",
    title: "Foldable 4K GPS Drone with 3-Axis Anti-Shake Gimbal & 360° Laser Obstacle Avoidance",
    nepaliTitle: "४K क्यामेरा ३-एक्सिस गिम्बल जीपीएस ड्रोन",
    categoryId: "consumer-electronics",
    categoryName: "Consumer Electronics",
    supplierId: "sup-transglobal-electronics",
    supplierName: "TransGlobal Microelectronics & IoT Hardware Ltd.",
    supplierCountry: "Taiwan",
    supplierFlag: "🇹🇼",
    verifiedYear: 11,
    isTradeAssurance: true,
    rating: 4.9,
    reviewsCount: 190,
    moq: 2,
    unit: "sets",
    leadTime: "5-8 Days",
    alibabaBaseRate: 74.50,
    samplePrice: 149.00, // 2x of Alibaba $74.50
    priceTiers: [
      { minQty: 2, maxQty: 4, price: 139.00 },
      { minQty: 5, maxQty: 19, price: 128.00 }, // 2x of $64.00
      { minQty: 20, maxQty: 99, price: 108.00 }, // 2x of $54.00
      { minQty: 100, maxQty: null, price: 89.00 }  // 2x of $44.50
    ],
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1507582020432-2a3bc4ff7a8b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80"
    ],
    customization: ["Custom Hard Shell Carrying Bag", "Dual/Triple Battery Packs", "Custom Controller Silk Print"],
    specs: {
      "Alibaba Baseline Rate": "$74.50 (Bhanjo 2X Marketplace: $149.00)",
      "Camera": "4K Ultra HD 50x Zoom with 3-Axis Mechanical Gimbal + EIS",
      "Transmission Range": "5km Digital 5G Wi-Fi Video Feed",
      "Flight Time": "32 - 35 Minutes per intelligent 3800mAh battery",
      "Motors": "High-Efficiency Brushless Motors (Level 7 Wind Resistance)"
    },
    featured: true,
    isHimalayanExport: false,
    description: "Professional aerial photography drone equipped with omnidirectional laser radar obstacle avoidance, smart GPS return-to-home, waypoint mapping, and optical flow hover."
  },
  {
    id: "prod-magsafe-powerbank",
    title: "10,000mAh Magnetic Wireless Fast Charging Power Bank with Digital LED Display",
    nepaliTitle: "१०,००० mAh म्याग्नेटिक वायरलेस पावर बैंक",
    categoryId: "consumer-electronics",
    categoryName: "Consumer Electronics",
    supplierId: "sup-transglobal-electronics",
    supplierName: "TransGlobal Microelectronics & IoT Hardware Ltd.",
    supplierCountry: "Taiwan",
    supplierFlag: "🇹🇼",
    verifiedYear: 11,
    isTradeAssurance: true,
    rating: 4.8,
    reviewsCount: 310,
    moq: 10,
    unit: "pieces",
    leadTime: "3-5 Days",
    alibabaBaseRate: 9.50,
    samplePrice: 19.00, // 2x of Alibaba $9.50
    priceTiers: [
      { minQty: 10, maxQty: 49, price: 17.50 },
      { minQty: 50, maxQty: 199, price: 15.50 }, // 2x of $7.75
      { minQty: 200, maxQty: 999, price: 12.40 }, // 2x of $6.20
      { minQty: 1000, maxQty: null, price: 9.80 }  // 2x of $4.90
    ],
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1609592424369-0268c1303867?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80"
    ],
    customization: ["Full Color UV Print / Laser Engraving", "Custom Packaging Box", "Custom Metal Kickstand"],
    specs: {
      "Alibaba Baseline Rate": "$9.50 (Bhanjo 2X Marketplace: $19.00)",
      "Capacity": "10,000mAh / 38.5Wh High Density Li-Polymer (Flight Approved)",
      "Wireless Output": "15W / 10W / 7.5W Qi Fast Magnetic Charging",
      "Wired Output": "22.5W Super Charge USB-A + 20W PD USB-C",
      "Magnet Force": "Strong N52 Rare-Earth Neodymium Ring (1.2kg hold)"
    },
    featured: false,
    isHimalayanExport: false,
    description: "Ultra-slim aircraft grade aluminum magnetic battery pack snaps firmly to iPhone 12-16 and MagSafe cases, charging devices rapidly while on the go."
  },
  {
    id: "prod-mechanical-keyboard",
    title: "Tri-Mode Wireless / Bluetooth / Type-C RGB Mechanical Gaming Keyboard (Hot-Swap)",
    nepaliTitle: "आरजीबी मेकानिकल गेमिङ किबोर्ड (हट-स्वाप)",
    categoryId: "consumer-electronics",
    categoryName: "Consumer Electronics",
    supplierId: "sup-transglobal-electronics",
    supplierName: "TransGlobal Microelectronics & IoT Hardware Ltd.",
    supplierCountry: "Taiwan",
    supplierFlag: "🇹🇼",
    verifiedYear: 11,
    isTradeAssurance: true,
    rating: 4.9,
    reviewsCount: 145,
    moq: 5,
    unit: "pieces",
    leadTime: "3-7 Days",
    alibabaBaseRate: 19.00,
    samplePrice: 38.00, // 2x of Alibaba $19.00
    priceTiers: [
      { minQty: 5, maxQty: 19, price: 34.00 },
      { minQty: 20, maxQty: 99, price: 31.00 }, // 2x of $15.50
      { minQty: 100, maxQty: 499, price: 25.50 }, // 2x of $12.75
      { minQty: 500, maxQty: null, price: 21.00 }  // 2x of $10.50
    ],
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80"
    ],
    customization: ["Custom Keycap Dye-Sublimation", "Choice of Red/Blue/Brown Switches", "Custom Software Driver"],
    specs: {
      "Alibaba Baseline Rate": "$19.00 (Bhanjo 2X Marketplace: $38.00)",
      "Layout": "75% / 84-Key Compact Layout with CNC Rotary Knob",
      "Connectivity": "Bluetooth 5.0 + 2.4GHz Wireless + USB Type-C Wired",
      "Switches": "Hot-Swappable 3-pin/5-pin Mechanical Switches (Factory Lubed)",
      "Backlight": "16.8M Color Per-Key RGB with 22 dynamic lighting modes"
    },
    featured: false,
    isHimalayanExport: false,
    description: "Premium gasket-mounted mechanical keyboard with multi-layer acoustic dampening foam, durable PBT keycaps, and multi-device connection switching for Mac and Windows."
  },
  {
    id: "prod-55-smart-tv",
    title: "55\" 4K UHD Frameless Smart Android 13 TV with HDR10+ & Dolby Surround Sound",
    nepaliTitle: "५५ इन्च ४K स्मार्ट एन्ड्रोइड टेलिभिजन",
    categoryId: "consumer-electronics",
    categoryName: "Consumer Electronics",
    supplierId: "sup-apex-machinery-global",
    supplierName: "Apex Precision Heavy Machinery & CNC Works",
    supplierCountry: "China",
    supplierFlag: "🇨🇳",
    verifiedYear: 12,
    isTradeAssurance: true,
    rating: 4.8,
    reviewsCount: 110,
    moq: 2,
    unit: "units",
    leadTime: "10-15 Days",
    alibabaBaseRate: 145.00,
    samplePrice: 290.00, // 2x of Alibaba $145.00
    priceTiers: [
      { minQty: 2, maxQty: 4, price: 270.00 },
      { minQty: 5, maxQty: 19, price: 248.00 }, // 2x of $124.00
      { minQty: 20, maxQty: 99, price: 210.00 }, // 2x of $105.00
      { minQty: 100, maxQty: null, price: 185.00 }  // 2x of $92.50
    ],
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=800&q=80"
    ],
    customization: ["OEM Logo Silk-Screen on Bezel & Remote", "Custom Boot-Up Animation", "Regional TV Tuner (DVB-T2/S2/ISDB-T)"],
    specs: {
      "Alibaba Baseline Rate": "$145.00 (Bhanjo 2X Marketplace: $290.00)",
      "Panel": "55-inch 4K IPS Panel (3840 x 2160, Grade A+ Zero Dead Pixel)",
      "OS & Audio": "Licensed Android TV 13 / Google Play / 24W Dolby Audio",
      "Ports": "3x HDMI 2.1 (eARC) + 2x USB + Optical Audio + RJ45 Ethernet",
      "Design": "Ultra-Slim Bezel-Less Metallic Frame"
    },
    featured: true,
    isHimalayanExport: false,
    description: "Cinematic 4K home theater experience featuring MEMC motion smoothing, voice-enabled Bluetooth remote, Chromecast built-in, and pre-installed YouTube, Netflix, and Prime Video."
  },
  {
    id: "prod-esp32-iot-controller",
    title: "Dual-Core ESP32-WROOM-32E WiFi + Bluetooth IoT Microcontroller Development Boards",
    nepaliTitle: "ईएसपी३२ वाईफाई ब्लुटुथ कन्ट्रोलर बोर्ड",
    categoryId: "consumer-electronics",
    categoryName: "Consumer Electronics",
    supplierId: "sup-transglobal-electronics",
    supplierName: "TransGlobal Microelectronics & IoT Hardware Ltd.",
    supplierCountry: "Taiwan",
    supplierFlag: "🇹🇼",
    verifiedYear: 11,
    isTradeAssurance: true,
    rating: 4.9,
    reviewsCount: 380,
    moq: 10,
    unit: "pieces",
    leadTime: "3-5 Days",
    alibabaBaseRate: 3.25,
    samplePrice: 6.50, // 2x of Alibaba $3.25
    priceTiers: [
      { minQty: 10, maxQty: 99, price: 5.50 },
      { minQty: 100, maxQty: 499, price: 3.20 }, // 2x of $1.60
      { minQty: 500, maxQty: 2499, price: 2.45 }, // 2x of $1.225
      { minQty: 2500, maxQty: null, price: 1.85 }  // 2x of $0.925
    ],
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=800&q=80"
    ],
    customization: ["Pre-flashed Custom Firmware", "Tape & Reel Industrial Packaging", "Custom Pin Header Soldering"],
    specs: {
      "Alibaba Baseline Rate": "$3.25 (Bhanjo 2X Marketplace: $6.50)",
      "Processor": "Tensilica Xtensa Dual-Core 32-bit LX6 Microprocessor (Up to 240MHz)",
      "Wireless": "Wi-Fi 802.11 b/g/n (up to 150Mbps) + Bluetooth v4.2 BR/EDR and BLE",
      "Flash Memory": "4MB / 8MB / 16MB SPI Flash Options",
      "Operating Temp": "-40°C to +85°C Industrial Range"
    },
    featured: false,
    isHimalayanExport: false,
    description: "High-performance IoT system-on-chip module engineered for smart agriculture sensors, solar power telemetry, industrial automation, and commercial edge devices."
  },

  // 11. Packaging & Printing (Lokta Paper)
  {
    id: "prod-lokta-handmade-paper",
    title: "Traditional Nepali Handmade Lokta Bark Paper Sheets & Export Envelopes (Acid-Free)",
    nepaliTitle: "हातले बनाएको परम्परागत नेपाली लोक्ता कागज",
    categoryId: "packaging-printing",
    categoryName: "Packaging & Printing",
    supplierId: "sup-himalayan-artisans",
    supplierName: "Himalayan Heritage Craft & Textiles Ltd.",
    supplierCountry: "Nepal",
    supplierFlag: "🇳🇵",
    verifiedYear: 8,
    isTradeAssurance: true,
    rating: 4.9,
    reviewsCount: 130,
    moq: 100,
    unit: "sheets",
    leadTime: "5-10 Days",
    samplePrice: 15.00,
    priceTiers: [
      { minQty: 100, maxQty: 499, price: 1.20 },
      { minQty: 500, maxQty: 1999, price: 0.85 },
      { minQty: 2000, maxQty: null, price: 0.58 }
    ],
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80"
    ],
    customization: ["Embedded Dried Himalayan Flowers/Petals", "Custom Screen-Printed Stationery", "Hardcover Journal Bookbinding"],
    specs: {
      "Raw Material": "100% Daphne Bholua / Papyracea (Himalayan Lokta Bush Bark)",
      "Thickness": "30 GSM to 200 GSM Heavy Cardstock",
      "Durability": "Resistant to moisture, tearing, silverfish, and aging (Lasts 1000+ years)",
      "Standard Size": "20 x 30 inches (50 x 75 cm)"
    },
    featured: true,
    isHimalayanExport: true,
    description: "Crafted since medieval times in high-altitude Himalayan villages. Naturally acid-free, eco-friendly, and indestructible by insects. Used worldwide for royal decrees, luxury diplomas, and premium product packaging."
  },

  // 12. Vehicles & Transportation (Electric Safa Tempo / Loader)
  {
    id: "prod-electric-three-wheeler",
    title: "Himalayan Safa 1.5-Ton Heavy-Duty Electric Cargo Loader 3-Wheeler (LiFePO4 72V 100Ah)",
    nepaliTitle: "सफा ई-रिक्सा हेभी ड्युटी कार्गो लोडर",
    categoryId: "vehicles-transportation",
    categoryName: "Vehicles & Transportation",
    supplierId: "sup-everest-solar-hydro",
    supplierName: "Everest CleanEnergy & Micro-Hydro Tech Co.",
    supplierCountry: "Nepal",
    supplierFlag: "🇳🇵",
    verifiedYear: 6,
    isTradeAssurance: true,
    rating: 4.8,
    reviewsCount: 78,
    moq: 2,
    unit: "units",
    leadTime: "15-20 Days",
    samplePrice: 2800.00,
    priceTiers: [
      { minQty: 2, maxQty: 4, price: 2350.00 },
      { minQty: 5, maxQty: 19, price: 2100.00 },
      { minQty: 20, maxQty: null, price: 1850.00 }
    ],
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80"
    ],
    customization: ["Closed Van Cargo Box vs Open Dump Bed", "Solar Roof Extender (200W)", "GPS Fleet Telematics Unit"],
    specs: {
      "Motor Power": "3000W High Torque Brushless BLDC Mountain Gearbox Motor",
      "Battery Pack": "72V 100Ah Grade-A LiFePO4 (2500+ Cycles)",
      "Range per Charge": "110 - 130 km per full charge",
      "Payload Capacity": "1,500 kg (1.5 Ton) Hill Climbing 25% Grade",
      "Brakes": "Dual Front/Rear Hydraulic Drum Brakes"
    },
    featured: true,
    isHimalayanExport: true,
    description: "Inspired by Kathmandu's pioneering zero-emission Safa Tempo electric fleet. Built with reinforced steel chassis and high-torque hill-assist transmission for rugged urban and suburban transport."
  }
];
