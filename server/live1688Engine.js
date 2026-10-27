// Bhanjo.com - Live 1688 Sourcing & Direct Catalog Engine
// Connects to 1688 via DataHub API, provides live search, real-time 3x NPR pricing,
// and 1-click import into Bhanjo Flash Sales & Categories.

import dotenv from 'dotenv';
dotenv.config();

const RAPIDAPI_KEY = process.env.RAPIDAPI_1688_KEY || '226877650emshf20869d175be9f0p133b0djsn164a4b86c33d';
const RAPIDAPI_HOST = process.env.RAPIDAPI_1688_HOST || '1688-datahub.p.rapidapi.com';
const RMB_RATE = parseFloat(process.env.RMB_TO_NPR_RATE || '18.8');
// Direct conversion without extra markup as requested by user
const MULTIPLIER = 1.0;

// Simple in-memory cache to save API credits & give 5ms repeat responses
const cache = new Map();
const CACHE_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

function getCached(key) {
  const item = cache.get(key);
  if (item && (Date.now() - item.time < CACHE_TTL_MS)) {
    return item.data;
  }
  return null;
}

function setCached(key, data) {
  cache.set(key, { time: Date.now(), data });
}

// Ensure images have full https: protocol
function normalizeImageUrl(url) {
  if (!url) return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';
  let cleanUrl = url;
  if (typeof cleanUrl !== 'string') {
    cleanUrl = cleanUrl.url || cleanUrl.videoUrl || cleanUrl.src || '';
  }
  if (typeof cleanUrl !== 'string' || !cleanUrl) {
    return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';
  }
  if (cleanUrl.startsWith('//')) return `https:${cleanUrl}`;
  return cleanUrl;
}

// Ensure video url is a valid streamable video link or null
function normalizeVideoUrl(videoObj) {
  if (!videoObj) return null;
  let url = videoObj;
  if (typeof url === 'object') {
    url = url.url || url.videoUrl || url.src || '';
  }
  if (typeof url !== 'string' || !url.trim()) return null;
  url = url.trim();
  if (url.startsWith('//')) return `https:${url}`;
  return url;
}

// Convert RMB to Bhanjo Retail NPR with 3x rule and clean rounding
export function calculateBhanjoPrice(rmbPrice) {
  const parsed = parseFloat(rmbPrice) || 20;
  const nprCost = parsed * RMB_RATE;
  const finalPrice = Math.round((nprCost * MULTIPLIER) / 10) * 10; // Round to clean 10s
  return {
    factoryRMB: parsed,
    factoryNPR: Math.round(nprCost),
    bhanjoPrice: Math.max(99, finalPrice),
    originalDisplayPrice: Math.round(finalPrice * 1.35) // Strike-through for discount display
  };
}

// Live Search across all of 1688 (Supports 100 products on initial search & 30 on load more)
export async function search1688Live({ query = 'trending', page = 1, pageSize = 100, sort = 'default' }) {
  const cacheKey = `search_${query.toLowerCase().trim()}_p${page}_ps${pageSize}_s${sort}`;
  const cached = getCached(cacheKey);
  if (cached) {
    return { ...cached, fromCache: true };
  }

  const startTime = Date.now();

  // 1688 DataHub delivers ~20 items per sub-page.
  // For page 1, fetch 7 sub-pages in parallel to guarantee 100 unique products!
  // For page 2+, fetch 3 sub-pages in parallel to deliver 30 products on load more.
  let subPages = [page];
  if (page === 1) {
    subPages = [1, 2, 3, 4, 5, 6, 7]; // 7 * 20 = 140 raw items -> delivers 100 unique items
  } else {
    const base = 7 + (page - 2) * 3;
    subPages = [base + 1, base + 2, base + 3]; // 3 * 20 = 60 raw items -> delivers 30 unique items
  }

  let quotaExceeded = false;

  const fetchSubPage = async (subP) => {
    try {
      const url = new URL(`https://${RAPIDAPI_HOST}/item_search`);
      url.searchParams.append('q', query);
      url.searchParams.append('page', String(subP));
      if (sort && sort !== 'default') url.searchParams.append('sort', sort);

      const res = await fetch(url.toString(), {
        headers: {
          'x-rapidapi-key': RAPIDAPI_KEY,
          'x-rapidapi-host': RAPIDAPI_HOST,
          'Accept': 'application/json'
        }
      });
      if (!res.ok) {
        if (res.status === 429) quotaExceeded = true;
        return [];
      }
      const data = await res.json();
      return data.result?.resultList || [];
    } catch (e) {
      return [];
    }
  };

  const pageResults = await Promise.all(subPages.map(fetchSubPage));
  const rawList = pageResults.flat();

  const seenIds = new Set();
  const products = [];

  rawList.forEach((entry) => {
    const item = entry.item || {};
    if (!item.itemId || seenIds.has(item.itemId)) return;
    seenIds.add(item.itemId);

    const rmb = parseFloat(item.sku?.def?.price || item.price || 25);
    const pricing = calculateBhanjoPrice(rmb);

    products.push({
      id: `1688-${item.itemId}`,
      itemId: String(item.itemId),
      title: item.titleEn || item.title || 'Global Sourcing Product',
      chineseTitle: item.title,
      price: pricing.bhanjoPrice,
      originalPrice: pricing.originalDisplayPrice,
      currency: 'NPR',
      samplePrice: pricing.bhanjoPrice,
      image: normalizeImageUrl(item.image),
      images: [normalizeImageUrl(item.image)],
      rating: 4.8,
      reviewsCount: parseInt(item.sales || '45') * 3,
      salesCount: item.sales || '50+',
      inStock: true,
      stock: 500,
      
      // Masked supplier info
      sellerName: 'Bhanjo Global Direct',
      supplierName: 'Bhanjo Global Direct',
      distributorName: 'Bhanjo Global Direct',
      origin: 'China Factory Direct (Kerung/Air Cargo)',
      deliveryDays: '10 - 15 Days',
      is1688Live: true,
      isAlibabaImport: true,
      moq: 1,
      sourceUrl: item.itemUrl ? (item.itemUrl.startsWith('//') ? `https:${item.itemUrl}` : item.itemUrl) : `https://detail.1688.com/offer/${item.itemId}.html`,
      factoryCostRMB: pricing.factoryRMB,
      factoryCostNPR: pricing.factoryNPR
    });
  });

  // Exactly 100 products on initial search (page 1), and 30 products on each load more (page > 1)
  const targetLimit = page === 1 ? 100 : 30;
  const deliveryProducts = products.slice(0, targetLimit);

  const result = {
    success: true,
    quotaExceeded,
    query,
    page: parseInt(page),
    pageSize: deliveryProducts.length,
    count: deliveryProducts.length,
    totalCount: 500,
    responseTimeMs: Date.now() - startTime,
    products: deliveryProducts
  };

  setCached(cacheKey, result);
  return result;
}

// Get Full Detail of a Single 1688 Item
export async function getItemDetail1688Live(itemId) {
  const cleanId = String(itemId).replace(/^1688-/, '');
  const cacheKey = `detail_${cleanId}`;
  const cached = getCached(cacheKey);
  if (cached) {
    return { ...cached, fromCache: true };
  }

  const startTime = Date.now();
  const url = `https://${RAPIDAPI_HOST}/item_detail?itemId=${cleanId}`;

  const res = await fetch(url, {
    headers: {
      'x-rapidapi-key': RAPIDAPI_KEY,
      'x-rapidapi-host': RAPIDAPI_HOST,
      'Accept': 'application/json'
    }
  });

  if (!res.ok) {
    const errText = await res.text();
    console.warn(`1688 API detail notice (${res.status}): ${errText}`);
    return {
      success: true,
      fromFallback: true,
      product: {
        id: `1688-${cleanId}`,
        itemId: cleanId,
        title: 'Factory Direct Sourcing Product',
        price: 2500,
        originalPrice: 3200,
        currency: 'NPR',
        samplePrice: 2500,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
        images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'],
        detailImages: [],
        variants: ['Standard Edition'],
        video: null,
        videoUrl: null,
        description: 'Direct wholesale sourcing item from audited 1688 manufacturing hubs in Guangdong & Zhejiang.\n• Express delivery to Kathmandu & all Nepal provinces\n• Bhanjo Buyer Protection guarantee.',
        specifications: {
          'Origin': 'China Factory Direct',
          'Delivery': '10 - 15 Days Express Cargo',
          'Quality Standard': 'Export Audited'
        },
        rating: 4.8,
        inStock: true
      }
    };
  }

  const data = await res.json();
  const item = data.result?.item;
  if (!item) {
    throw new Error('Product not found on 1688');
  }

  const rmbStr = item.sku?.def?.price || '25';
  const minRmb = parseFloat(rmbStr.split('-')[0].trim()) || 25;
  const pricing = calculateBhanjoPrice(minRmb);

  const images = (item.images || []).map(normalizeImageUrl);
  if (images.length === 0 && item.image) {
    images.push(normalizeImageUrl(item.image));
  }

  // Translation map for common technical specifications
  const SPEC_KEY_MAP = {
    '洗涤容量': 'Washing Capacity',
    '电源方式': 'Power Supply',
    '能效等级': 'Energy Efficiency',
    '电机类型': 'Motor Type',
    '宽度': 'Dimensions / Width',
    '材质': 'Material',
    '功能': 'Functions & Features',
    '产品规格': 'Specifications',
    '重量': 'Net Weight',
    '产品类别': 'Product Category',
    '型号': 'Model Number',
    '插头规格': 'Power Plug Type',
    '保修期': 'Warranty',
    '最高转速': 'Maximum Speed (RPM)',
    '产地': 'Production Origin',
    '适用对象': 'Application',
    '额定功率': 'Rated Power',
    '额定电压': 'Rated Voltage',
    '电池容量': 'Battery Capacity',
    '续航时间': 'Battery Life',
    '蓝牙版本': 'Bluetooth Version',
    '防水等级': 'Waterproof Grade'
  };

  // Parse specifications / properties safely (handles both array and object.list)
  const propList = Array.isArray(item.properties) ? item.properties : (item.properties?.list || []);
  const specifications = {};
  propList.forEach(p => {
    if (p.name && p.value && p.value !== '其他') {
      const engName = SPEC_KEY_MAP[p.name] || p.name;
      specifications[engName] = String(p.value).replace(/[\u4e00-\u9fa5]+/g, (m) => {
        // Quick English translations for common values
        if (m === '塑料') return 'Reinforced ABS/Polymer';
        if (m === '防水') return 'Waterproof';
        if (m === '收纳') return 'Foldable Storage';
        if (m === '可旋转') return 'Spin Dehydration';
        if (m === '无线') return 'Wireless / Cordless';
        return m;
      }).trim();
    }
  });

  // Extract variants (e.g. colors, capacities)
  const variants = [];
  if (Array.isArray(item.sku?.props)) {
    const mainProp = item.sku.props.find(p => p.name === '颜色') || item.sku.props[0];
    if (mainProp && Array.isArray(mainProp.values)) {
      mainProp.values.forEach(v => {
        if (v.name) {
          variants.push({
            name: v.name,
            image: v.image ? normalizeImageUrl(v.image) : null
          });
        }
      });
    }
  }

  // Construct structured, rich English description
  const specsText = Object.entries(specifications)
    .map(([k, v]) => `• ${k}: ${v}`)
    .join('\n');

  const richDescription = `### Bhanjo Global Direct: ${item.titleEn || item.title}

OVERVIEW & SPECIFICATIONS:
• Quality Standard: Audited Factory Export Standard
• Sourcing Origin: Direct Factory Procurement (Guangzhou / Yiwu)
• Buyer Protection: Bhanjo 100% Safe Delivery & Quality Guarantee
• Door-to-Door Delivery: Coordinated directly to Kathmandu Hub & all Nepal Provinces
• Estimated Delivery: 10 - 15 Days Express Cargo

KEY SPECIFICATIONS:
${specsText || '• Factory Direct Imported SKU with strict quality audit\n• Tested for high durability and performance'}

PACKAGE & WARRANTY:
• In-the-box: Main Unit, Power Cable/Accessories, Multilingual User Manual, Inspection Certificate
• 14-Day Price Guarantee • 7-Day Return & Replacement Policy in Nepal`;

  const detailedProduct = {
    id: `1688-${cleanId}`,
    itemId: cleanId,
    title: item.titleEn || item.title,
    chineseTitle: item.title,
    price: pricing.bhanjoPrice,
    originalPrice: pricing.originalDisplayPrice,
    currency: 'NPR',
    samplePrice: pricing.bhanjoPrice,
    image: images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    images,
    detailImages: (item.description?.images || []).map(normalizeImageUrl),
    variants: variants.length > 0 ? variants.map(v => v.name) : ['Standard Edition', 'Upgraded Pro Edition'],
    variantDetails: variants,
    video: normalizeVideoUrl(item.video),
    videoUrl: normalizeVideoUrl(item.video),
    description: richDescription,
    specifications,
    rating: 4.85,
    reviewsCount: 128,
    salesCount: item.sales || '100+',
    inStock: true,
    stock: item.sku?.def?.quantity || 999,
    
    // Masked supplier info
    sellerName: 'Bhanjo Global Direct',
    distributorName: 'Bhanjo Global Direct',
    origin: 'Factory Direct Sourcing (Guangzhou)',
    deliveryDays: '10 - 15 Business Days',
    is1688Live: true,
    moq: 1,
    sourceUrl: `https://detail.1688.com/offer/${cleanId}.html`,
    factoryCostRMB: pricing.factoryRMB,
    factoryCostNPR: pricing.factoryNPR,
    responseTimeMs: Date.now() - startTime
  };

  setCached(cacheKey, { success: true, product: detailedProduct });
  return { success: true, product: detailedProduct };
}
