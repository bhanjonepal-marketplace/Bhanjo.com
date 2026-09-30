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
  const formatPrice = (amountInUSD) => {
    if (amountInUSD === undefined || amountInUSD === null) return '';
    const converted = amountInUSD * 133.5;
    return `Rs. ${converted.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
  };

  // Helper to format in Nepali Rupees (NPR)
  const formatNPR = (amountInUSD) => {
    if (amountInUSD === undefined || amountInUSD === null) return '';
    const converted = amountInUSD * 133.5;
    return `Rs. ${converted.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
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

