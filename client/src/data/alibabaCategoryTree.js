// Full Alibaba 3-Level Category & Subcategory Hierarchy for Bhanjo.com
// Level 1: Main Category
// Level 2: Subcategories Group
// Level 3: Micro-categories with Circular Photo Spaces

import { CATEGORIES } from './categories.js';

export const ALIBABA_CATEGORY_TREE = [
  {
    id: "consumer-electronics",
    name: "Consumer Electronics",
    nepaliName: "उपभोक्ता इलेक्ट्रोनिक्स",
    icon: "Tv",
    featured: [
      { name: "Video Game Consoles" },
      { name: "Wireless Charger" },
      { name: "All In One Pc" },
      { name: "Phone Cooler" },
      { name: "Control Switch" },
      { name: "Televisions" },
      { name: "Computer Parts" },
      { name: "Laptops" },
      { name: "Bluetooth Receiver" },
      { name: "Flash Trigger" },
      { name: "RAMs" },
      { name: "Cpu Cooler" },
      { name: "Vr Glasses" }
    ],
    subcategories: [
      {
        id: "computer-hardware",
        name: "Computer Hardware & Software",
        items: [
          { name: "Laptops & Notebooks" },
          { name: "Keyboards & Keypads" },
          { name: "Gaming Mice" },
          { name: "Computer Monitors" },
          { name: "Graphics Cards (GPU)" },
          { name: "RAM Memory Modules" },
          { name: "CPU Coolers & Fans" },
          { name: "Power Supplies (PSU)" },
          { name: "PC Cases & Towers" },
          { name: "USB Hubs & Docks" },
          { name: "Webcams HD 4K" },
          { name: "All-in-One PCs" },
          { name: "Internal SSDs" },
          { name: "Motherboards" }
        ]
      },
      {
        id: "audio-video",
        name: "Audio & Video Accessories",
        items: [
          { name: "Wireless Earbuds (TWS)" },
          { name: "Over-Ear Headphones" },
          { name: "Bluetooth Speakers" },
          { name: "Studio Microphones" },
          { name: "TV Soundbars" },
          { name: "Audio Mixers" },
          { name: "Headphone Amplifiers" },
          { name: "Portable MP3 Players" },
          { name: "Megaphones" },
          { name: "Karaoke Systems" },
          { name: "Audio Cables" },
          { name: "Boomboxes" },
          { name: "DJ Equipment" },
          { name: "Subwoofers" }
        ]
      },
      {
        id: "mobile-phone-accessories",
        name: "Mobile Phone & Accessories",
        items: [
          { name: "Phone Cases & Covers" },
          { name: "Tempered Glass Film" },
          { name: "Wireless Chargers" },
          { name: "GaN Fast Chargers" },
          { name: "Power Banks 20000mAh" },
          { name: "USB-C Fast Cables" },
          { name: "Car Phone Holders" },
          { name: "Phone Cooling Fans" },
          { name: "Selfie Sticks & Tripods" },
          { name: "Phone Lens Kits" },
          { name: "Stylus Pens" },
          { name: "OTG Adapters" },
          { name: "Lanyards & Grips" },
          { name: "Battery Replacement" }
        ]
      },
      {
        id: "smart-wearables",
        name: "Smart Electronics & Wearables",
        items: [
          { name: "AMOLED Smartwatches" },
          { name: "Fitness Tracker Bands" },
          { name: "Smart Glasses Audio" },
          { name: "VR Virtual Headsets" },
          { name: "Smart Health Rings" },
          { name: "Kids GPS Watches" },
          { name: "Smart Watch Straps" },
          { name: "Smart Tags Trackers" },
          { name: "Body Temp Bands" },
          { name: "Sleep Trackers" },
          { name: "Wireless Pagers" },
          { name: "Wearable Cameras" },
          { name: "Smart Ring Chargers" },
          { name: "Heart Rate Monitors" }
        ]
      },
      {
        id: "camera-photo",
        name: "Camera, Photo & Accessories",
        items: [
          { name: "4K Action Cameras" },
          { name: "Digital SLR Cameras" },
          { name: "Camera Gimbals" },
          { name: "Professional Tripods" },
          { name: "Ring Lights & Softboxes" },
          { name: "Camera Lenses" },
          { name: "Camera Bags & Backpacks" },
          { name: "Camera Flashes" },
          { name: "SD Memory Cards" },
          { name: "Lens Filters & Hoods" },
          { name: "Green Screen Backdrops" },
          { name: "Camera Batteries" },
          { name: "Underwater Housings" },
          { name: "Microphone Windshields" }
        ]
      },
      {
        id: "video-games",
        name: "Video Games & Consoles",
        items: [
          { name: "Retro Handheld Consoles" },
          { name: "Wireless Gamepads" },
          { name: "Gaming Headsets 7.1" },
          { name: "Console Cooling Stands" },
          { name: "Arcade Fight Sticks" },
          { name: "Ergonomic Gaming Chairs" },
          { name: "Racing Wheels & Pedals" },
          { name: "Gaming Desks LED" },
          { name: "Controller Grips" },
          { name: "Thumbstick Caps" },
          { name: "Storage Bags for Switch" },
          { name: "VR Controller Grips" },
          { name: "Capture Cards" },
          { name: "Game Card Cases" }
        ]
      }
    ]
  },
  {
    id: "home-garden",
    name: "Home & Garden",
    nepaliName: "घर तथा बगैँचा",
    icon: "Home",
    featured: [
      { name: "Basket" },
      { name: "Vape Device" },
      { name: "Landscaping" },
      { name: "Wall shelves" },
      { name: "Storage Baskets" },
      { name: "Chair Cover" },
      { name: "Kitchen Rack" },
      { name: "Picture Frame" },
      { name: "Cookie Cutter" },
      { name: "Glow Stick" },
      { name: "Cabinet Organizers" },
      { name: "Openers" },
      { name: "Candle Stand" }
    ],
    subcategories: [
      {
        id: "kitchenware",
        name: "Kitchenware",
        items: [
          { name: "Baking Dishes & Pans" },
          { name: "Soup & Stock Pots" },
          { name: "Utensils" },
          { name: "Steamers" },
          { name: "Smart Kitchen Tools" },
          { name: "Saute Pans" },
          { name: "Pans" },
          { name: "Baking & Pastry Tools" },
          { name: "Cake Decorations" },
          { name: "Colanders & Strainers" },
          { name: "Pasta Tools" },
          { name: "Specialty Tools" },
          { name: "Thermal Cooker" },
          { name: "Oven Mitts" }
        ]
      },
      {
        id: "smart-home-improvement",
        name: "Smart Home Improvement",
        items: [
          { name: "Biometric Smart Door Locks" },
          { name: "Smart Wall Switches" },
          { name: "Smart Wi-Fi Sockets" },
          { name: "Smart Curtains Motors" },
          { name: "Video Doorbells HD" },
          { name: "Smart Thermostats" },
          { name: "Water Leak Sensors" },
          { name: "Smart Smoke Alarms" },
          { name: "Automated Lighting Hubs" },
          { name: "Smart Garage Openers" },
          { name: "Smart IR Remote Hubs" },
          { name: "Air Quality Monitors" },
          { name: "Smart Power Strips" },
          { name: "Motorized Window Openers" }
        ]
      },
      {
        id: "household-supplies",
        name: "Household Supplies",
        items: [
          { name: "Foldable Laundry Baskets" },
          { name: "Clothes Drying Racks" },
          { name: "Wooden Suit Hangers" },
          { name: "Underbed Storage Bags" },
          { name: "Vacuum Compression Bags" },
          { name: "Garment Dust Covers" },
          { name: "Plastic Storage Bins" },
          { name: "Automatic Trash Cans" },
          { name: "Lint Rollers" },
          { name: "Shoe Storage Boxes" },
          { name: "Ironing Boards" },
          { name: "Umbrella Stands" },
          { name: "Moisture Absorbers" },
          { name: "Drawer Dividers" }
        ]
      },
      {
        id: "cleaning-tools",
        name: "Household Cleaning Tools & Accessories",
        items: [
          { name: "Spin Mops & Buckets" },
          { name: "Flat Microfiber Mops" },
          { name: "Brooms & Dustpan Sets" },
          { name: "Bathroom Cleaning Brushes" },
          { name: "Window Squeegees" },
          { name: "Microfiber Cleaning Cloths" },
          { name: "Feather Dusters" },
          { name: "Toilet Bowl Brushes" },
          { name: "Rubber Cleaning Gloves" },
          { name: "Sponge Scrubbers" },
          { name: "Spray Mops" },
          { name: "Trash Grabbers" },
          { name: "Electric Cleaning Brushes" },
          { name: "Drain Clog Removers" }
        ]
      },
      {
        id: "lighters-smoking",
        name: "Lighters & Smoking Accessories",
        items: [
          { name: "Gas Jet Lighters" },
          { name: "Electric Plasma Lighters" },
          { name: "Glass Herb Pipes" },
          { name: "Rolling Papers & Cones" },
          { name: "Metal Grinders 4-Piece" },
          { name: "Cigar Humidors Boxes" },
          { name: "Silicone Ashtrays" },
          { name: "Cigarette Cases" },
          { name: "Hookah Shisha Sets" },
          { name: "Torch Lighters Refillable" },
          { name: "Odor Proof Bags" },
          { name: "Cigar Cutters" },
          { name: "Pocket Ashtrays" },
          { name: "Rolling Trays Metal" }
        ]
      },
      {
        id: "home-decor",
        name: "Home Decor",
        items: [
          { name: "Wall Art Paintings" },
          { name: "Minimalist Wall Clocks" },
          { name: "Ceramic Flower Vases" },
          { name: "Full Length Mirrors" },
          { name: "Scented Soy Candles" },
          { name: "Essential Oil Diffusers" },
          { name: "Decorative Figurines" },
          { name: "Wall Macrame Hangings" },
          { name: "Cushion Covers" },
          { name: "Artificial Plants Bonsai" },
          { name: "Candle Holders Lanterns" },
          { name: "Photo Picture Frames" },
          { name: "Decorative Trays" },
          { name: "Wall Stickers Decals" }
        ]
      },
      {
        id: "home-storage-organization",
        name: "Home Storage & Organization",
        items: [
          { name: "Stackable Storage Bins" },
          { name: "Pantry Food Containers" },
          { name: "Closet Drawer Organizers" },
          { name: "Makeup Cosmetic Organizers" },
          { name: "Shoe Rack Organizers" },
          { name: "Cable Management Boxes" },
          { name: "Under Sink Organizers" },
          { name: "Jewelry Storage Boxes" },
          { name: "Desk Document Trays" },
          { name: "Spice Racks Revolving" },
          { name: "Medicine Storage Boxes" },
          { name: "Fridge Organizer Bins" },
          { name: "Toy Storage Chests" },
          { name: "Foldable Storage Cubes" }
        ]
      },
      {
        id: "garden-supplies",
        name: "Garden Supplies",
        items: [
          { name: "Terracotta Flower Pots" },
          { name: "Automatic Drip Irrigation" },
          { name: "Expandable Garden Hoses" },
          { name: "Pruning Shears Cutters" },
          { name: "Plant Grow Bags" },
          { name: "Solar Garden Fountains" },
          { name: "Lawn Mower Accessories" },
          { name: "Greenhouse Film Covers" },
          { name: "Garden Shovels & Rakes" },
          { name: "Soil Moisture Meters" },
          { name: "Plant Support Stakes" },
          { name: "Weed Barrier Fabrics" },
          { name: "Garden Tool Sets" },
          { name: "Bird Feeders Houses" }
        ]
      }
    ]
  },
  {
    id: "apparel-accessories",
    name: "Apparel & Accessories",
    nepaliName: "पोशाक तथा फेसन सामग्री",
    icon: "Shirt",
    featured: [
      { name: "Sport Wear", image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=200&q=80" },
      { name: "Short Jeans", image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=200&q=80" },
      { name: "Sports Clothes", image: "https://images.unsplash.com/photo-1483721074573-586540da5703?auto=format&fit=crop&w=200&q=80" },
      { name: "Plus Size Womens Skirts", image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=200&q=80" },
      { name: "Rhinestone Trim", image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=200&q=80" },
      { name: "Rhinestones", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=200&q=80" },
      { name: "Carnival Costume", image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=200&q=80" },
      { name: "Bear Costume", image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=200&q=80" },
      { name: "Training Clothes", image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=200&q=80" },
      { name: "Felt Hat", image: "https://images.unsplash.com/photo-1534215754734-18e55d13e346?auto=format&fit=crop&w=200&q=80" },
      { name: "Tactical Clothes", image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=200&q=80" },
      { name: "Hand Mannequin", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=200&q=80" },
      { name: "Cloak", image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80" }
    ],
    subcategories: [
      {
        id: "mens-clothing",
        name: "Men's Clothing",
        items: [
          { name: "Hoodies & Sweatshirts" },
          { name: "Men's T-Shirts Cotton" },
          { name: "Winter Jackets & Coats" },
          { name: "Denim Jeans Pants" },
          { name: "Cargo & Tactical Pants" },
          { name: "Formal Suits & Blazers" },
          { name: "Knitted Sweaters Cardigans" },
          { name: "Polo Shirts Casual" },
          { name: "Casual Shorts" },
          { name: "Down Puffer Vests" },
          { name: "Dress Shirts Formal" },
          { name: "Sweatpants Joggers" },
          { name: "Leather Biker Jackets" },
          { name: "Trench Coats Windproof" }
        ]
      },
      {
        id: "womens-clothing",
        name: "Women's Clothing",
        items: [
          { name: "Casual & Evening Dresses" },
          { name: "Women's Hoodies Oversized" },
          { name: "Blouses & Button Shirts" },
          { name: "Pleated & Maxi Skirts" },
          { name: "High Waist Leggings" },
          { name: "Crop Tops & Tank Tops" },
          { name: "Cardigans & Sweaters" },
          { name: "Jumpsuits & Rompers" },
          { name: "Puffer Down Jackets" },
          { name: "Trench Coats Winter" },
          { name: "Two-Piece Suits Blazer" },
          { name: "Jeans & Flared Pants" },
          { name: "Evening Gowns Party" },
          { name: "Knitwear Pullovers" }
        ]
      },
      {
        id: "sportswear-activewear",
        name: "Sportswear & Activewear",
        items: [
          { name: "Seamless Yoga Leggings" },
          { name: "Sports Bras High Impact" },
          { name: "Gym Workout T-Shirts" },
          { name: "Running Shorts Liner" },
          { name: "Tracksuits 2-Piece Set" },
          { name: "Compression Baselayers" },
          { name: "Cycling Jerseys Padded" },
          { name: "Ski & Snowboard Jackets" },
          { name: "Swimwear Bikinis Sets" },
          { name: "Rash Guards UV Protect" },
          { name: "Soccer & Football Kits" },
          { name: "Tennis Skirts Skorts" },
          { name: "Athletic Windbreakers" },
          { name: "Sweat Sweatbands" }
        ]
      },
      {
        id: "underwear-sleepwear",
        name: "Underwear & Sleepwear",
        items: [
          { name: "Men's Boxer Briefs Modal" },
          { name: "Lingerie Sets Lace" },
          { name: "Cotton Pajamas Sets" },
          { name: "Thermal Underwear Long Johns" },
          { name: "Silk Bathrobes Kimonos" },
          { name: "Sports Underwear Dry" },
          { name: "Seamless Panties Briefs" },
          { name: "Shapewear Body Shapers" },
          { name: "Ankle & Crew Socks" },
          { name: "Tights & Stockings Hosiery" },
          { name: "Sleep Sleep Masks" },
          { name: "Nightgowns Cotton" },
          { name: "Compression Socks" },
          { name: "Slipper Socks Warm" }
        ]
      },
      {
        id: "accessories-trims",
        name: "Garment Accessories & Trims",
        items: [
          { name: "Metal & Resin Zippers" },
          { name: "Custom Clothing Buttons" },
          { name: "Woven Clothing Labels" },
          { name: "Embroidered Patches" },
          { name: "Elastic Bands Ribbons" },
          { name: "Lace Trims & Borders" },
          { name: "Rhinestones & Beads" },
          { name: "Buckles & Fasteners" },
          { name: "Hang Tags Kraft Paper" },
          { name: "Sewing Threads Spools" },
          { name: "Drawstrings & Cords" },
          { name: "Shoulder Pads Lining" },
          { name: "Velcro Hook & Loop" },
          { name: "Interlining Fabrics" }
        ]
      }
    ]
  },
  {
    id: "sports-entertainment",
    name: "Sports & Entertainment",
    nepaliName: "खेलकुद तथा मनोरञ्जन",
    icon: "Trophy",
    featured: [
      { name: "Gym Dumbbells", image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=200&q=80" },
      { name: "Treadmill", image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=200&q=80" },
      { name: "Resistance Bands", image: "https://images.unsplash.com/photo-1598971861713-54ad16a7e72e?auto=format&fit=crop&w=200&q=80" },
      { name: "Camping Tent", image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=200&q=80" },
      { name: "Sleeping Bag", image: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=200&q=80" },
      { name: "Electric Bike", image: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=200&q=80" },
      { name: "Electric Scooter", image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=200&q=80" },
      { name: "Fishing Reel", image: "https://images.unsplash.com/photo-1535083783855-76ae62b2914e?auto=format&fit=crop&w=200&q=80" },
      { name: "Yoga Mat TPE", image: "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?auto=format&fit=crop&w=200&q=80" },
      { name: "Boxing Gloves", image: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=200&q=80" },
      { name: "Paddle Board", image: "https://images.unsplash.com/photo-1520255870062-bd79d3865de7?auto=format&fit=crop&w=200&q=80" },
      { name: "Cricket Bat", image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=200&q=80" },
      { name: "Trekking Poles", image: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=200&q=80" }
    ],
    subcategories: [
      {
        id: "fitness-bodybuilding",
        name: "Fitness & Bodybuilding",
        items: [
          { name: "Rubber Hex Dumbbells" },
          { name: "Commercial Treadmills" },
          { name: "Olympic Barbells & Plates" },
          { name: "Power Racks & Squat Stands" },
          { name: "Kettlebells Cast Iron" },
          { name: "Latex Resistance Bands" },
          { name: "Adjustable Weight Benches" },
          { name: "Stationary Exercise Bikes" },
          { name: "Rowing Machines Water" },
          { name: "TPE Non-Slip Yoga Mats" },
          { name: "Pilates Reformer Machines" },
          { name: "Foam Rollers Muscle" },
          { name: "Jump Ropes Speed" },
          { name: "Weight Lifting Belts" }
        ]
      },
      {
        id: "outdoor-recreation",
        name: "Outdoor Trekking & Camping",
        items: [
          { name: "Waterproof Camping Tents" },
          { name: "Sub-Zero Down Sleeping Bags" },
          { name: "Ultralight Trekking Poles" },
          { name: "Inflatable Camping Mattresses" },
          { name: "Portable Gas Camping Stoves" },
          { name: "Camping Hammocks Mosquito" },
          { name: "LED Headlamps Rechargeable" },
          { name: "Survival Pocket Knives" },
          { name: "Outdoor Backpacks 60L-80L" },
          { name: "Water Filtration Straws" },
          { name: "Thermal Emergency Blankets" },
          { name: "Portable Camping Coolers" },
          { name: "Climbing Ropes Carabiners" },
          { name: "Solar Camping Showers" }
        ]
      }
    ]
  },
  {
    id: "furniture",
    name: "Furniture",
    nepaliName: "फर्निचर",
    icon: "Armchair",
    featured: [
      { name: "Sectional Sofa", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=200&q=80" },
      { name: "Ergonomic Chair", image: "https://images.unsplash.com/photo-1580481077195-c3a821a58875?auto=format&fit=crop&w=200&q=80" },
      { name: "Dining Table", image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=200&q=80" },
      { name: "Coffee Table", image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=200&q=80" },
      { name: "Bed Frame", image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=200&q=80" },
      { name: "Wardrobe Closet", image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=200&q=80" },
      { name: "Bookshelf", image: "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?auto=format&fit=crop&w=200&q=80" },
      { name: "TV Stand Unit", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=200&q=80" },
      { name: "Standing Desk", image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=200&q=80" },
      { name: "Bar Stools", image: "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=200&q=80" },
      { name: "Nightstand", image: "https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&w=200&q=80" },
      { name: "Shoe Rack Cabinet", image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=200&q=80" },
      { name: "Outdoor Patio Set", image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=200&q=80" }
    ],
    subcategories: [
      {
        id: "living-room-furniture",
        name: "Living Room Furniture",
        items: [
          { name: "Fabric Sectional Sofas" },
          { name: "Genuine Leather Couches" },
          { name: "Modern Coffee Tables" },
          { name: "TV Media Consoles" },
          { name: "Accent Recliner Chairs" },
          { name: "Wall Bookcases Shelves" },
          { name: "Shoe Storage Cabinets" },
          { name: "Entryway Console Tables" },
          { name: "Ottomans & Footstools" },
          { name: "Electric Fireplace Units" },
          { name: "Living Room Sets" },
          { name: "Side & End Tables" },
          { name: "Corner Storage Units" },
          { name: "Room Divider Screens" }
        ]
      },
      {
        id: "bedroom-furniture",
        name: "Bedroom Furniture",
        items: [
          { name: "Upholstered King Beds" },
          { name: "Memory Foam Mattresses" },
          { name: "Modern Nightstand Tables" },
          { name: "Sliding Door Wardrobes" },
          { name: "Dressing Vanity Tables" },
          { name: "Chest of Drawers" },
          { name: "Bunk Beds with Ladder" },
          { name: "Adjustable Smart Beds" },
          { name: "Bedroom Bench Stools" },
          { name: "Folding Guest Beds" },
          { name: "Jewelry Armoires" },
          { name: "Bed Headboards Wood" },
          { name: "Under Bed Storage" },
          { name: "Walk-in Closet Units" }
        ]
      }
    ]
  },
  {
    id: "lights-lighting",
    name: "Lights & Lighting",
    nepaliName: "बत्ती तथा लाइटिङ",
    icon: "Lightbulb",
    featured: [
      { name: "Solar Street Light", image: "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=200&q=80" },
      { name: "LED Chandelier", image: "https://images.unsplash.com/photo-1543198126-a8ad8e47fb22?auto=format&fit=crop&w=200&q=80" },
      { name: "LED Flood Light", image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=200&q=80" },
      { name: "Ceiling Downlight", image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=200&q=80" },
      { name: "LED Strip Lights", image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=200&q=80" },
      { name: "Desk Lamp LED", image: "https://images.unsplash.com/photo-1534972195531-a756b1126f24?auto=format&fit=crop&w=200&q=80" },
      { name: "Stage Lighting", image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=200&q=80" },
      { name: "Garden Solar Lamp", image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=200&q=80" },
      { name: "Pendant Lights", image: "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?auto=format&fit=crop&w=200&q=80" },
      { name: "High Bay Industrial", image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=200&q=80" },
      { name: "Track Lighting", image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=200&q=80" },
      { name: "Neon Sign Custom", image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=200&q=80" },
      { name: "LED Bulb E27", image: "https://images.unsplash.com/photo-1493612276216-ee3925520721?auto=format&fit=crop&w=200&q=80" }
    ],
    subcategories: [
      {
        id: "outdoor-solar-lighting",
        name: "Outdoor & Solar Lighting",
        items: [
          { name: "All-in-One Solar Street Lights" },
          { name: "High-Power LED Floodlights" },
          { name: "Solar Garden Path Lights" },
          { name: "Stadium Sports High Mast Lights" },
          { name: "Solar Wall Mounted Lamps" },
          { name: "Waterproof Underground Lights" },
          { name: "Outdoor String Festoon Lights" },
          { name: "Underwater Pool LED Lights" },
          { name: "Solar Lawn Pillar Lamps" },
          { name: "Solar Traffic Warning Lights" },
          { name: "Explosion-Proof Lights" },
          { name: "Street Light Poles & Brackets" },
          { name: "Solar Street Light Batteries" },
          { name: "Motion Sensor Security Lights" }
        ]
      },
      {
        id: "indoor-lighting",
        name: "Indoor & Commercial Lighting",
        items: [
          { name: "Modern Crystal Chandeliers" },
          { name: "LED Recessed Downlights" },
          { name: "Smart RGB LED Strip Lights" },
          { name: "Magnetic Track Light Systems" },
          { name: "Commercial LED Panel Lights" },
          { name: "Industrial UFO High Bay Lights" },
          { name: "Nordic Pendant Ceiling Lamps" },
          { name: "Rechargeable LED Desk Lamps" },
          { name: "Floor Standing Reading Lamps" },
          { name: "Custom Acrylic Neon Signs" },
          { name: "Emergency Exit Light Signs" },
          { name: "Mirror Vanity Lights Bathroom" },
          { name: "Dimmable LED Bulbs Filament" },
          { name: "Cabinet Sensor Wardrobe Lights" }
        ]
      }
    ]
  },
  {
    id: "beauty",
    name: "Beauty",
    nepaliName: "सौन्दर्य सामग्री",
    icon: "Sparkles",
    featured: [
      { name: "Lipstick Matte", image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=200&q=80" },
      { name: "Face Serum", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=200&q=80" },
      { name: "Makeup Brush Set", image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=200&q=80" },
      { name: "Eyeshadow Palette", image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=200&q=80" },
      { name: "Eyelash Extensions", image: "https://images.unsplash.com/photo-1583001809873-a128495da465?auto=format&fit=crop&w=200&q=80" },
      { name: "Nail Gel Polish", image: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=200&q=80" },
      { name: "Human Hair Wigs", image: "https://images.unsplash.com/photo-1562004760-aceed7bb0fe3?auto=format&fit=crop&w=200&q=80" },
      { name: "Face Mask Sheets", image: "https://images.unsplash.com/photo-1567928815117-640a43a0db09?auto=format&fit=crop&w=200&q=80" },
      { name: "Perfume Bottles", image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=200&q=80" },
      { name: "Hair Dryers Salon", image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=200&q=80" },
      { name: "Facial Cleanser", image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=200&q=80" },
      { name: "Sunscreen SPF50", image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=200&q=80" },
      { name: "Tattoo Machine Kit", image: "https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=200&q=80" }
    ],
    subcategories: [
      {
        id: "makeup-cosmetics",
        name: "Makeup & Cosmetics",
        items: [
          { name: "Waterproof Matte Lipsticks" },
          { name: "Liquid Foundation Full Coverage" },
          { name: "Eyeshadow Palettes 35 Colors" },
          { name: "Volume & Lengthening Mascara" },
          { name: "Professional Makeup Brushes" },
          { name: "Setting Powders Loose" },
          { name: "Highlighters & Bronzers" },
          { name: "Liquid Eyeliners Waterproof" },
          { name: "Blush Powders Palette" },
          { name: "Beauty Blender Sponges" },
          { name: "Lip Gloss Tinted" },
          { name: "Concealer Creams" },
          { name: "Eyebrow Pencils Micro" },
          { name: "Makeup Remover Water" }
        ]
      },
      {
        id: "skincare-tools",
        name: "Skin Care & Beauty Devices",
        items: [
          { name: "Hyaluronic Acid Serums" },
          { name: "Collagen Facial Sheet Masks" },
          { name: "Anti-Aging Retinol Creams" },
          { name: "Vitamin C Brightening Oils" },
          { name: "Facial Foam Cleansers" },
          { name: "Gentle Face Exfoliators" },
          { name: "LED Light Therapy Masks" },
          { name: "Ultrasonic Skin Scrubbers" },
          { name: "Microcurrent Face Sculptors" },
          { name: "Facial Steamer Devices" },
          { name: "Jade Face Rollers Gua Sha" },
          { name: "Blackhead Vacuum Removers" },
          { name: "SPF 50+ Sunscreens" },
          { name: "Eye Creams Dark Circles" }
        ]
      }
    ]
  },
  {
    id: "shoes-accessories",
    name: "Shoes & Accessories",
    nepaliName: "जुत्ता तथा सामग्री",
    icon: "Footprints",
    featured: [
      { name: "Running Sneakers", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=200&q=80" },
      { name: "Leather Oxford Shoes", image: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=200&q=80" },
      { name: "High-Top Basketball Shoes", image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=200&q=80" },
      { name: "Waterproof Hiking Boots", image: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=200&q=80" },
      { name: "Safety Steel Toe Boots", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=200&q=80" },
      { name: "Women High Heels", image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=200&q=80" },
      { name: "Summer Beach Sandals", image: "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=200&q=80" },
      { name: "Comfort Slides Slippers", image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=200&q=80" },
      { name: "Canvas Casual Loafers", image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=200&q=80" },
      { name: "Children Kids Shoes", image: "https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=200&q=80" },
      { name: "Shoe Insoles Gel", image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=200&q=80" },
      { name: "Reflective Shoelaces", image: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=200&q=80" },
      { name: "Shoe Cleaning Kits", image: "https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?auto=format&fit=crop&w=200&q=80" }
    ],
    subcategories: [
      {
        id: "mens-shoes",
        name: "Men's Shoes",
        items: [
          { name: "Athletic Running Shoes" },
          { name: "Casual Canvas Sneakers" },
          { name: "Genuine Leather Oxfords" },
          { name: "Leather Loafers Slip-on" },
          { name: "Waterproof Trekking Boots" },
          { name: "Industrial Steel Toe Boots" },
          { name: "Basketball Sports Shoes" },
          { name: "Outdoor Hiking Shoes" },
          { name: "Combat Tactical Boots" },
          { name: "Comfort Pillow Slides" },
          { name: "Leather Chelsea Boots" },
          { name: "Dress Monk Strap Shoes" },
          { name: "Snow Winter Boots Warm" },
          { name: "Driving Moccasins" }
        ]
      }
    ]
  },
  {
    id: "jewelry-eyewear-watches",
    name: "Jewelry, Eyewear & Watches",
    nepaliName: "गहना, चश्मा तथा घडीहरू",
    icon: "Watch",
    featured: [
      { name: "Moissanite Diamond Ring", image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=200&q=80" },
      { name: "925 Sterling Silver Chain", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=200&q=80" },
      { name: "Automatic Mechanical Watch", image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=200&q=80" },
      { name: "Polarized Sunglasses", image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=200&q=80" },
      { name: "Gold Plated Bangle", image: "https://images.unsplash.com/photo-1611591475155-42e9fba5ce55?auto=format&fit=crop&w=200&q=80" },
      { name: "Pearl Drop Earrings", image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=200&q=80" },
      { name: "Titanium Optical Frames", image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=200&q=80" },
      { name: "Stainless Steel Quartz Watch", image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=200&q=80" },
      { name: "Choker Necklace Set", image: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=200&q=80" },
      { name: "Anti-Blue Light Glasses", image: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=200&q=80" },
      { name: "Velvet Jewelry Display Box", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=200&q=80" },
      { name: "Natural Gemstone Beads", image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=200&q=80" },
      { name: "Men Leather Bracelet", image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=200&q=80" }
    ],
    subcategories: [
      {
        id: "watches",
        name: "Watches & Timepieces",
        items: [
          { name: "Automatic Mechanical Watches" },
          { name: "Quartz Chronograph Watches" },
          { name: "Stainless Steel Luxury Watches" },
          { name: "Silicone Sports Digital Watches" },
          { name: "Leather Strap Casual Watches" },
          { name: "Pocket Watches Vintage" },
          { name: "Watch Bands & Straps Metal" },
          { name: "Automatic Watch Winder Boxes" },
          { name: "Watch Repair Tool Kits" },
          { name: "Waterproof Diver Watches" },
          { name: "Sapphire Crystal Watches" },
          { name: "Skeleton Dial Watches" },
          { name: "Custom Logo Watches OEM" },
          { name: "Minimalist Slim Watches" }
        ]
      }
    ]
  },
  {
    id: "luggage-bags-cases",
    name: "Luggage, Bags & Cases",
    nepaliName: "झोला, ब्याग तथा लगेज",
    icon: "Briefcase",
    featured: [
      { name: "Travel Backpack USB", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=200&q=80" },
      { name: "Trolley Suitcase Set", image: "https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?auto=format&fit=crop&w=200&q=80" },
      { name: "Women Leather Handbag", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=200&q=80" },
      { name: "Crossbody Shoulder Bag", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=200&q=80" },
      { name: "Gym Duffle Bag", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=200&q=80" },
      { name: "Laptop Briefcase Leather", image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=200&q=80" },
      { name: "Cosmetic Makeup Bag", image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=200&q=80" },
      { name: "School Bag for Kids", image: "https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=200&q=80" },
      { name: "Canvas Tote Shopping Bag", image: "https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?auto=format&fit=crop&w=200&q=80" },
      { name: "Men RFID Leather Wallet", image: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=200&q=80" },
      { name: "Waterproof Dry Bag", image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=200&q=80" },
      { name: "Tactical Molle Waist Pack", image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=200&q=80" },
      { name: "Insulated Lunch Cooler Bag", image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=200&q=80" }
    ],
    subcategories: [
      {
        id: "backpacks",
        name: "Backpacks & Daily Bags",
        items: [
          { name: "Laptop Backpacks with USB" },
          { name: "Anti-Theft Travel Backpacks" },
          { name: "High-Capacity Hiking Packs 70L" },
          { name: "College Student Bookbags" },
          { name: "Business Executive Leather Packs" },
          { name: "Waterproof Cycling Bags" },
          { name: "Tactical Military Backpacks" },
          { name: "Baby Diaper Backpacks" },
          { name: "Camera Gear Backpacks" },
          { name: "Foldable Lightweight Packs" },
          { name: "Drawstring Gym Sacks" },
          { name: "Reflective Commuter Packs" },
          { name: "Skateboard Strapped Packs" },
          { name: "Solar Charging Backpacks" }
        ]
      }
    ]
  }
];

// Helper to find category tree info
export function getCategoryTreeItem(categoryId) {
  return ALIBABA_CATEGORY_TREE.find(c => c.id === categoryId) || ALIBABA_CATEGORY_TREE[0];
}

// Complete 38-category tree merging custom Alibaba trees with standard catalog categories
export function getFullCategoryTree() {
  return CATEGORIES.map(cat => {
    const custom = ALIBABA_CATEGORY_TREE.find(t => t.id === cat.id);
    if (custom) {
      return {
        ...custom,
        nepaliName: cat.nepaliName,
        icon: cat.icon
      };
    }

    // Generate Level-1 featured circular items from subcategories and popularKeywords
    const featured = (cat.subcategories || []).concat(cat.popularKeywords || []).slice(0, 13).map((item, idx) => ({
      name: item.replace(/^(Pure|Authentic|High-Altitude|Handmade|Eco-Friendly|100%|Custom)\s+/i, '').slice(0, 24),
      image: null
    }));

    // Generate Level-2 subcategories from cat.subcategories
    const subcategories = (cat.subcategories || []).map((sub, sIdx) => {
      const baseName = sub.replace(/^(Pure|Authentic|High-Altitude|Handmade|Eco-Friendly|100%|Custom)\s+/i, '');
      return {
        id: `${cat.id}-sub-${sIdx}`,
        name: sub,
        items: [
          { name: `${baseName} Standard` },
          { name: `${baseName} Premium` },
          { name: `${baseName} Pro Series` },
          { name: `${baseName} Custom OEM` },
          { name: `${baseName} Bulk Pack` },
          { name: `${baseName} Heavy Duty` },
          { name: `${baseName} Eco Material` },
          { name: `${baseName} Export Grade` },
          { name: `${baseName} Fast Dispatch` },
          { name: `${baseName} Accessories` },
          { name: `${baseName} Replacement` },
          { name: `${baseName} Universal Set` },
          { name: `${baseName} Kits` },
          { name: `${baseName} Tools` }
        ]
      };
    });

    return {
      id: cat.id,
      name: cat.name,
      nepaliName: cat.nepaliName,
      icon: cat.icon,
      featured,
      subcategories
    };
  });
}

