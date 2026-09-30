// Precise Search Matching Utility for Bhanjo.com
// Ensures that search terms match only relevant products without false positives

export function getWordVariants(word) {
  const clean = word.toLowerCase().trim();
  const variants = new Set([clean]);

  // Plural to singular
  if (clean.endsWith('ies') && clean.length > 4) {
    variants.add(clean.slice(0, -3) + 'y');
    variants.add(clean.slice(0, -1)); // e.g. hoodies -> hoodie
  } else if (clean.endsWith('ches') || clean.endsWith('shes') || clean.endsWith('xes') || clean.endsWith('zes') || clean.endsWith('sses')) {
    variants.add(clean.slice(0, -2)); // watches -> watch, boxes -> box, dresses -> dress
  } else if (clean.endsWith('ves') && clean.length > 4) {
    variants.add(clean.slice(0, -3) + 'f'); // scarves -> scarf
    variants.add(clean.slice(0, -3) + 'fe'); // knives -> knife
  } else if (clean.endsWith('s') && !clean.endsWith('ss') && clean.length > 3) {
    variants.add(clean.slice(0, -1)); // shoes -> shoe, bags -> bag, boots -> boot, jackets -> jacket
  } else {
    // Singular to plural
    variants.add(clean + 's');
    if (clean.endsWith('ch') || clean.endsWith('sh') || clean.endsWith('x') || clean.endsWith('z') || clean.endsWith('s')) {
      variants.add(clean + 'es');
    }
    if (clean.endsWith('f') && clean.length > 2) {
      variants.add(clean.slice(0, -1) + 'ves'); // scarf -> scarves
    }
  }
  return Array.from(variants);
}

export function matchesProductSearch(prod, query) {
  if (!query || !query.trim()) return true;

  const rawTokens = query
    .toLowerCase()
    .trim()
    .split(/[\s,&/+\-]+/)
    .map(t => t.trim())
    .filter(t => t.length > 0 && !['and', 'or', 'the', 'for', 'with', 'in', 'of', 'to'].includes(t));

  if (rawTokens.length === 0) return true;

  // Extract individual words strictly from product title, category name, categoryId, and tags
  // (Do NOT search raw descriptions or supplier address to avoid false positives)
  const titleWords = (prod.title || '').toLowerCase().split(/[^a-z0-9\u0900-\u097F]+/);
  const catWords = (prod.categoryName || '').toLowerCase().split(/[^a-z0-9\u0900-\u097F]+/);
  const catIdWords = (prod.categoryId || '').toLowerCase().split(/[^a-z0-9]+/);
  const tagWords = Array.isArray(prod.tags) ? prod.tags.join(' ').toLowerCase().split(/[^a-z0-9\u0900-\u097F]+/) : [];
  const nepaliTitleWords = (prod.nepaliTitle || '').toLowerCase().split(/[^a-z0-9\u0900-\u097F]+/);

  const allWords = [...titleWords, ...catWords, ...catIdWords, ...tagWords, ...nepaliTitleWords].filter(Boolean);

  // EVERY search token must match at least one word in the product (AND logic)
  return rawTokens.every(qToken => {
    const variants = getWordVariants(qToken);
    
    return allWords.some(pw => {
      return variants.some(v => {
        // Exact word equality
        if (pw === v) return true;

        // Prefix match if word length >= 4 (e.g. 'pack' matches 'backpack', 'shoe' matches 'shoelace')
        if (v.length >= 4 && (pw.startsWith(v) || (pw.length > v.length && pw.includes(v)))) {
          return true;
        }

        return false;
      });
    });
  });
}
