import React, { createContext, useContext, useState, useEffect } from 'react';
import { TRANSLATIONS } from '../data/translations';

const CurrencyContext = createContext();

export const CURRENCIES = {
  NPR: { code: 'NPR', symbol: 'Rs. ', rate: 133.5, label: 'NPR (Rs.)', flag: '🇳🇵' },
};

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState('NPR'); // Strictly NPR only
  const [language, setLanguageState] = useState(() => {
    try {
      return localStorage.getItem('bhanjo_language') || 'en';
    } catch (e) {
      return 'en';
    }
  });

  const setLanguage = (lang) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('bhanjo_language', lang);
    } catch (e) {}
  };

  // Translation helper function
  const t = (key) => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS['en']?.[key] || key;
  };

  // Format price strictly in Nepali Rupees (NPR)
  // Direct conversion: 1688 wholesale items are already in direct NPR without 133.5x markup!
  const formatPrice = (amount, prodOrCurrency = null) => {
    if (amount === undefined || amount === null || isNaN(Number(amount))) return '';
    const num = Number(amount);

    if (typeof prodOrCurrency === 'string') {
      if (prodOrCurrency.toUpperCase() === 'NPR') return `Rs. ${Math.round(num).toLocaleString('en-IN')}`;
      if (prodOrCurrency.toUpperCase() === 'USD') return `Rs. ${Math.round(num * 133.5).toLocaleString('en-IN')}`;
    } else if (prodOrCurrency && typeof prodOrCurrency === 'object') {
      if (prodOrCurrency.currency === 'NPR' || prodOrCurrency.is1688Live || prodOrCurrency.id?.startsWith('1688-') || prodOrCurrency.is1688Import) {
        return `Rs. ${Math.round(num).toLocaleString('en-IN')}`;
      }
      if (prodOrCurrency.currency === 'USD' || prodOrCurrency.id?.startsWith('ali-')) {
        return `Rs. ${Math.round(num * 133.5).toLocaleString('en-IN')}`;
      }
    }

    // Default: All 1688 and store items are in NPR directly. Never multiply them by 133.5!
    return `Rs. ${Math.round(num).toLocaleString('en-IN')}`;
  };

  // Helper to format in Nepali Rupees (NPR)
  const formatNPR = (amount) => {
    return formatPrice(amount);
  };

  // JPY / Other currencies disabled as requested
  const formatJPY = () => '';

  const formatDualPrice = (amountInUSD) => {
    return formatPrice(amountInUSD);
  };

  const convertValue = (amountInUSD) => {
    return (amountInUSD * 133.5).toFixed(2);
  };

  return (
    <CurrencyContext.Provider value={{
      currency,
      setCurrency,
      currencies: CURRENCIES,
      currentCurrency: CURRENCIES[currency] || CURRENCIES.NPR,
      formatPrice,
      formatNPR,
      formatJPY,
      formatDualPrice,
      convertValue,
      language,
      setLanguage,
      t
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);

