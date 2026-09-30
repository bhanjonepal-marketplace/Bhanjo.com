import React, { useState, useEffect } from 'react';
import { 
  X, Link2, Sparkles, Download, CheckCircle2, AlertCircle, 
  ExternalLink, Layers, DollarSign, Package, ShieldCheck, 
  ArrowRight, RefreshCw, Zap, TrendingUp, Filter, FolderCheck,
  ChevronDown, ChevronUp, Image as ImageIcon, Eye, Plus, Trash2, Tag, Edit3, Film, Play
} from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { CATEGORIES } from '../data/categories';
import confetti from 'canvas-confetti';

export const AlibabaImporterModal = ({ 
  isOpen, 
  onClose, 
  onProductImported, 
  onSelectCategory,
  defaultPlatform = '1688'
}) => {
  const { formatPrice, currentCurrency } = useCurrency();

  const [selectedPlatform, setSelectedPlatform] = useState(defaultPlatform || '1688'); // '1688' | 'alibaba'
  const [activeTab, setActiveTab] = useState('url'); // 'url' or 'catalog'
  const [alibabaUrl, setAlibabaUrl] = useState('');
  const [customTitleInput, setCustomTitleInput] = useState('');
  const [markupPercent, setMarkupPercent] = useState(200);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [previewProduct, setPreviewProduct] = useState(null);
  const [previewMediaType, setPreviewMediaType] = useState('photo'); // 'photo' | 'video'
  const [selectedPreviewImg, setSelectedPreviewImg] = useState(0);
  const [showAllSpecs, setShowAllSpecs] = useState(false);
  const [showAddImageInput, setShowAddImageInput] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [importedSuccessProduct, setImportedSuccessProduct] = useState(null);

  // Trending Catalog State
  const [trendingList, setTrendingList] = useState([]);
  const [isLoadingTrending, setIsLoadingTrending] = useState(false);
  const [importedIds, setImportedIds] = useState(new Set());
  const [isBulkImporting, setIsBulkImporting] = useState(false);

  // 1688 Cookie Session State
  const [show1688CookieDrawer, setShow1688CookieDrawer] = useState(false);
  const [cookie1688Input, setCookie1688Input] = useState('');
  const [has1688Cookie, setHas1688Cookie] = useState(false);
  const [cookie1688Preview, setCookie1688Preview] = useState(null);
  const [isSavingCookie, setIsSavingCookie] = useState(false);
  const [isTestingCookie, setIsTestingCookie] = useState(false);
  const [cookieStatusMsg, setCookieStatusMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (defaultPlatform) {
        setSelectedPlatform(defaultPlatform);
      }
      setErrorMsg('');
      setImportedSuccessProduct(null);
      loadTrendingCatalog();
      fetchCookieStatus();
    }
  }, [isOpen, defaultPlatform]);

  const fetchCookieStatus = () => {
    fetch('/api/1688/cookie-status')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setHas1688Cookie(data.hasCookie);
          setCookie1688Preview(data.preview);
        }
      })
      .catch(() => {});
  };

  const handleSave1688Cookie = async () => {
    if (!cookie1688Input.trim()) {
      setCookieStatusMsg('Please paste a cookie string first.');
      return;
    }
    setIsSavingCookie(true);
    setCookieStatusMsg('');
    try {
      const res = await fetch('/api/1688/save-cookie', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cookie: cookie1688Input.trim() })
      });
      const data = await res.json();
      if (data.success) {
        setHas1688Cookie(true);
        setCookie1688Preview(`${cookie1688Input.trim().slice(0, 15)}...`);
        setCookieStatusMsg('✅ 1688 session cookie saved successfully! Testing session...');
        handleTest1688Cookie();
      }
    } catch (e) {
      setCookieStatusMsg('Failed to save cookie: ' + e.message);
    } finally {
      setIsSavingCookie(false);
    }
  };

  const handleClear1688Cookie = async () => {
    try {
      await fetch('/api/1688/clear-cookie', { method: 'POST' });
      setHas1688Cookie(false);
      setCookie1688Preview(null);
      setCookie1688Input('');
      setCookieStatusMsg('1688 session cleared. System is now in smart fallback mode.');
    } catch (e) {
      setCookieStatusMsg('Clear failed: ' + e.message);
    }
  };

  const handleTest1688Cookie = async () => {
    setIsTestingCookie(true);
    setCookieStatusMsg('Testing connection to 1688.com with active session...');
    try {
      const res = await fetch('/api/1688/test-session', { method: 'POST' });
      const data = await res.json();
      if (data.authenticated) {
        setCookieStatusMsg('🎉 ' + data.message);
        confetti({ particleCount: 50, spread: 60 });
      } else {
        setCookieStatusMsg('⚠️ ' + data.message);
      }
    } catch (e) {
      setCookieStatusMsg('Test request error: ' + e.message);
    } finally {
      setIsTestingCookie(false);
    }
  };

  const loadTrendingCatalog = () => {
    setIsLoadingTrending(true);
    fetch('/api/alibaba/trending')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.products) {
          setTrendingList(data.products);
        }
      })
      .catch(err => console.log('Trending catalog load note:', err))
      .finally(() => setIsLoadingTrending(false));
  };

  if (!isOpen) return null;

  const handleQuickPreset = (url) => {
    setAlibabaUrl(url);
    handleAnalyzeUrl(url);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAnalyzeUrl();
    }
  };

  const handleAnalyzeUrl = async (urlToUse) => {
    const targetUrl = urlToUse || alibabaUrl;
    if (!targetUrl.trim()) {
      setErrorMsg('Please enter or paste an Alibaba or 1688 product link.');
      return;
    }

    setErrorMsg('');
    setIsAnalyzing(true);
    setPreviewProduct(null);
    setImportedSuccessProduct(null);
    setSelectedPreviewImg(0);
    setPreviewMediaType('photo');
    setShowAllSpecs(false);
    setShowAddImageInput(false);
    setNewImageUrl('');

    try {
      const res = await fetch('/api/alibaba/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: targetUrl.trim(),
          markupPercent: Number(markupPercent),
          customTitle: customTitleInput.trim() || undefined
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success || !data.product) {
        throw new Error(data.error || 'Failed to extract product details from Alibaba / 1688');
      }

      setPreviewProduct(data.product);
    } catch (err) {
      setErrorMsg(err.message || 'Error parsing product link. Please verify the URL.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePublishToBhanjo = async (prodToPublish = null) => {
    const finalProd = prodToPublish || previewProduct;
    if (!finalProd) return;

    setIsPublishing(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/alibaba/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: finalProd.alibabaSourceUrl || alibabaUrl || 'https://detail.1688.com',
          markupPercent: Number(markupPercent),
          customTitle: finalProd.title,
          categoryId: finalProd.categoryId,
          product: finalProd // Send parsed product directly
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success || !data.product) {
        throw new Error(data.error || 'Failed to save product to Bhanjo catalog');
      }

      confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
      setImportedIds(prev => new Set([...prev, finalProd.id]));
      setImportedSuccessProduct(data.product);
      if (onProductImported) {
        onProductImported(data.product);
      }
    } catch (err) {
      setErrorMsg('Failed to save to Bhanjo catalog: ' + err.message);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleNavigateToCategory = (categoryId) => {
    if (onSelectCategory) {
      onSelectCategory(categoryId);
    }
    onClose();
  };

  const handleBulkImportAll = async () => {
    setIsBulkImporting(true);
    try {
      const res = await fetch('/api/alibaba/bulk-import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      const data = await res.json();
      if (data.success) {
        confetti({ particleCount: 100, spread: 90 });
        const allIds = new Set(trendingList.map(p => p.id));
        setImportedIds(allIds);
        if (onProductImported) {
          trendingList.forEach(p => onProductImported(p));
        }
      }
    } catch (err) {
      console.log('Bulk import error:', err);
    } finally {
      setIsBulkImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden relative">
        
        {/* Header Strip - Dynamic color based on selectedPlatform */}
        <div className={`text-white px-6 py-4 flex items-center justify-between transition-colors duration-200 ${
          selectedPlatform === '1688'
            ? 'bg-gradient-to-r from-red-600 via-rose-600 to-red-700'
            : 'bg-gradient-to-r from-[#FF6A00] via-[#EE5007] to-[#E60012]'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-xl shadow-xs">
              {selectedPlatform === '1688' ? '🏭' : '⚡'}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-extrabold text-base sm:text-lg tracking-tight">
                  {selectedPlatform === '1688' 
                    ? '1688.com China Domestic Factory Sourcing' 
                    : 'Alibaba.com Global Export Direct Sourcing'}
                </h2>
                <span className="bg-white/25 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {selectedPlatform === '1688' ? '🇨🇳 1688 Factory Mode' : '🇨🇳 Alibaba Export Mode'}
                </span>
              </div>
              <p className="text-xs text-white/90">
                {selectedPlatform === '1688'
                  ? 'Paste 1688 link — automatically extracts factory photos, RMB pricing, video showcase, and translates Chinese specs into English with 3x markup.'
                  : 'Paste Alibaba link — automatically extracts export photos, converts USD ladder pricing, and routes to catalog with 3x margin.'}
              </p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2 DISTINCT PLATFORM SELECTION OPTIONS */}
        <div className="p-3 sm:p-4 bg-slate-100 border-b border-slate-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-4xl mx-auto">
            
            {/* Option 1: 1688.com China Factory */}
            <button
              id="tab-select-1688"
              type="button"
              onClick={() => {
                setSelectedPlatform('1688');
                setAlibabaUrl('');
                setPreviewProduct(null);
                setErrorMsg('');
              }}
              className={`p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between text-left cursor-pointer ${
                selectedPlatform === '1688'
                  ? 'bg-gradient-to-r from-red-600 to-rose-700 text-white border-red-500 shadow-md ring-2 ring-red-400/40'
                  : 'bg-white text-slate-700 hover:bg-red-50/50 border-slate-200 hover:border-red-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shadow-xs ${
                  selectedPlatform === '1688' ? 'bg-white text-red-600' : 'bg-red-100 text-red-600'
                }`}>
                  1688
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-sm">1. 1688.com China Factory</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      selectedPlatform === '1688' ? 'bg-white/20 text-white' : 'bg-red-100 text-red-700'
                    }`}>
                      ¥ RMB Direct
                    </span>
                  </div>
                  <p className={`text-[11px] mt-0.5 ${selectedPlatform === '1688' ? 'text-white/90' : 'text-slate-500'}`}>
                    Domestic Chinese wholesale • Video showcase • 3x NPR markup
                  </p>
                </div>
              </div>
              {selectedPlatform === '1688' && (
                <div className="w-6 h-6 rounded-full bg-white text-red-600 flex items-center justify-center font-bold text-xs shadow-xs">
                  ✓
                </div>
              )}
            </button>

            {/* Option 2: Alibaba.com Global Direct */}
            <button
              id="tab-select-alibaba"
              type="button"
              onClick={() => {
                setSelectedPlatform('alibaba');
                setAlibabaUrl('');
                setPreviewProduct(null);
                setErrorMsg('');
              }}
              className={`p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between text-left cursor-pointer ${
                selectedPlatform === 'alibaba'
                  ? 'bg-gradient-to-r from-[#FF6A00] to-[#EE5007] text-white border-orange-500 shadow-md ring-2 ring-orange-400/40'
                  : 'bg-white text-slate-700 hover:bg-orange-50/50 border-slate-200 hover:border-orange-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shadow-xs ${
                  selectedPlatform === 'alibaba' ? 'bg-white text-[#FF6A00]' : 'bg-orange-100 text-[#FF6A00]'
                }`}>
                  Ali
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-sm">2. Alibaba.com Global Direct</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      selectedPlatform === 'alibaba' ? 'bg-white/20 text-white' : 'bg-orange-100 text-orange-700'
                    }`}>
                      $ USD Export
                    </span>
                  </div>
                  <p className={`text-[11px] mt-0.5 ${selectedPlatform === 'alibaba' ? 'text-white/90' : 'text-slate-500'}`}>
                    International export suppliers • Trade Assurance • DDP terms
                  </p>
                </div>
              </div>
              {selectedPlatform === 'alibaba' && (
                <div className="w-6 h-6 rounded-full bg-white text-[#FF6A00] flex items-center justify-center font-bold text-xs shadow-xs">
                  ✓
                </div>
              )}
            </button>

          </div>
        </div>

        {/* Tab Controls: Link Input vs Catalog Browse */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold px-6">
          <button
            onClick={() => setActiveTab('url')}
            className={`py-3 px-4 transition border-b-2 flex items-center gap-2 ${
              activeTab === 'url'
                ? selectedPlatform === '1688' ? 'border-red-600 text-red-600 bg-white font-extrabold' : 'border-[#FF6A00] text-[#EE5007] bg-white font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Link2 className="w-4 h-4" />
            <span>Paste {selectedPlatform === '1688' ? '1688.com' : 'Alibaba.com'} Product Link</span>
          </button>

          <button
            onClick={() => setActiveTab('catalog')}
            className={`py-3 px-4 transition border-b-2 flex items-center gap-2 ${
              activeTab === 'catalog'
                ? selectedPlatform === '1688' ? 'border-red-600 text-red-600 bg-white font-extrabold' : 'border-[#FF6A00] text-[#EE5007] bg-white font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Browse Trending Factory SKUs ({trendingList.length})</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          
          {activeTab === 'url' && (
            <div className="space-y-5">

              {/* 1688 Account Session Cookie Card */}
              {selectedPlatform === '1688' && (
                <div className="bg-white border-2 border-red-200/80 rounded-2xl p-3.5 sm:p-4 shadow-sm space-y-2.5">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-base shadow-xs ${
                        has1688Cookie ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}>
                        🔑
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-xs text-slate-800">1688 Logged-in Session Cookie</span>
                          {has1688Cookie ? (
                            <span className="bg-emerald-100 text-emerald-800 font-black text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-300">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                              <span>Active &amp; Bypassing Login Wall</span>
                            </span>
                          ) : (
                            <span className="bg-slate-100 text-slate-600 font-bold text-[10px] px-2 py-0.5 rounded-full border border-slate-200">
                              Smart Guest Mode (Fallback Active)
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {has1688Cookie
                            ? `Session active (${cookie1688Preview || 'custom cookie'}). Any 1688 URL scrapes live with your account.`
                            : 'Add your 1688 login session cookie so Bhanjo directly scrapes any 1688 link without hitting the login wall.'}
                        </p>
                      </div>
                    </div>

                    <button
                      id="btn-toggle-1688-cookie"
                      type="button"
                      onClick={() => setShow1688CookieDrawer(!show1688CookieDrawer)}
                      className="text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>{show1688CookieDrawer ? 'Hide Session Settings ▲' : has1688Cookie ? 'Manage 1688 Session ⚙️' : '+ Connect 1688 Account Cookie 🔑'}</span>
                    </button>
                  </div>

                  {/* Expandable Drawer */}
                  {show1688CookieDrawer && (
                    <div className="pt-3 border-t border-slate-100 space-y-3 animate-in fade-in">
                      <div className="bg-amber-50/90 border border-amber-200 p-3 rounded-xl text-[11px] text-amber-900 space-y-1.5">
                        <p className="font-extrabold flex items-center gap-1 text-amber-950">
                          <span>💡 How to copy your 1688 cookie in 15 seconds:</span>
                        </p>
                        <ol className="list-decimal list-inside space-y-1 text-slate-700 font-medium">
                          <li>Open <a href="https://www.1688.com" target="_blank" rel="noreferrer" className="text-red-600 underline font-bold">1688.com</a> in your Chrome/Edge browser and make sure you are logged in.</li>
                          <li>Press <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-[10px] font-mono shadow-2xs">F12</kbd> (or right click anywhere &gt; Inspect) and switch to the <strong>Console</strong> tab.</li>
                          <li>Type <code className="px-2 py-0.5 bg-red-100 text-red-800 rounded font-mono font-bold text-[11px]">copy(document.cookie)</code> and press Enter (this copies your full 1688 cookie to your clipboard).</li>
                          <li>Paste it in the box below and click <strong>Save &amp; Activate 1688 Session</strong>.</li>
                        </ol>
                      </div>

                      <div className="space-y-1">
                        <textarea
                          id="input-1688-cookie"
                          rows="2"
                          value={cookie1688Input}
                          onChange={(e) => setCookie1688Input(e.target.value)}
                          placeholder="Paste your 1688.com cookie string here (e.g. cna=...; _m_h5_tk=...; cookie2=...)"
                          className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>

                      {cookieStatusMsg && (
                        <div className="text-xs font-semibold text-slate-800 bg-slate-100 border border-slate-200 p-2.5 rounded-xl">
                          {cookieStatusMsg}
                        </div>
                      )}

                      <div className="flex items-center gap-2 flex-wrap justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            id="btn-save-1688-cookie"
                            type="button"
                            onClick={handleSave1688Cookie}
                            disabled={isSavingCookie || !cookie1688Input.trim()}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm disabled:opacity-50 cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{isSavingCookie ? 'Saving Session...' : 'Save & Activate 1688 Session'}</span>
                          </button>

                          {has1688Cookie && (
                            <button
                              id="btn-test-1688-cookie"
                              type="button"
                              onClick={handleTest1688Cookie}
                              disabled={isTestingCookie}
                              className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm disabled:opacity-50 cursor-pointer"
                            >
                              <RefreshCw className={`w-3.5 h-3.5 ${isTestingCookie ? 'animate-spin' : ''}`} />
                              <span>{isTestingCookie ? 'Testing...' : 'Test Connection'}</span>
                            </button>
                          )}
                        </div>

                        {has1688Cookie && (
                          <button
                            type="button"
                            onClick={handleClear1688Cookie}
                            className="text-slate-400 hover:text-red-600 text-xs font-semibold px-2 py-1 transition flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Clear Session</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* URL Input Box Strictly Configured for Selected Platform */}
              <div className={`border rounded-2xl p-4 sm:p-5 space-y-3 transition-colors ${
                selectedPlatform === '1688' 
                  ? 'bg-red-50/40 border-red-200' 
                  : 'bg-orange-50/40 border-orange-200'
              }`}>
                <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    {selectedPlatform === '1688' ? (
                      <>
                        <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded">1688 ONLY</span>
                        <span>Paste 1688.com Product Offer Link (detail.1688.com or m.1688.com):</span>
                      </>
                    ) : (
                      <>
                        <span className="bg-[#FF6A00] text-white text-[10px] font-black px-2 py-0.5 rounded">ALIBABA ONLY</span>
                        <span>Paste Alibaba.com Product Link (alibaba.com/product-detail/...):</span>
                      </>
                    )}
                  </span>
                  <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                    <FolderCheck className="w-3.5 h-3.5" />
                    <span>Auto-detects category & 3x price</span>
                  </span>
                </label>

                {/* Cross-Platform Friendly Switcher Alerts */}
                {selectedPlatform === '1688' && alibabaUrl.includes('alibaba.com') && (
                  <div className="bg-amber-50 border border-amber-300 p-2.5 rounded-xl text-xs flex items-center justify-between text-amber-900 animate-in fade-in">
                    <div className="flex items-center gap-1.5 font-semibold">
                      <span>⚠️ You entered an Alibaba.com link while in 1688 mode.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedPlatform('alibaba')}
                      className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-3 py-1 rounded-lg text-xs cursor-pointer shadow-xs"
                    >
                      Switch to Alibaba Option →
                    </button>
                  </div>
                )}

                {selectedPlatform === 'alibaba' && (alibabaUrl.includes('1688.com') || /offer\/[0-9]+/.test(alibabaUrl)) && (
                  <div className="bg-amber-50 border border-amber-300 p-2.5 rounded-xl text-xs flex items-center justify-between text-amber-900 animate-in fade-in">
                    <div className="flex items-center gap-1.5 font-semibold">
                      <span>⚠️ You entered a 1688.com link while in Alibaba mode.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedPlatform('1688')}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1 rounded-lg text-xs cursor-pointer shadow-xs"
                    >
                      Switch to 1688 Option →
                    </button>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Link2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="alibaba-url-input"
                      type="url"
                      value={alibabaUrl}
                      onChange={(e) => setAlibabaUrl(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={
                        selectedPlatform === '1688'
                          ? 'Paste 1688 link: https://detail.1688.com/offer/1060516634917.html'
                          : 'Paste Alibaba link: https://www.alibaba.com/product-detail/Custom-Spider-Hoodie_1600972451127.html'
                      }
                      className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="bg-white border border-slate-300 rounded-xl px-3 py-1 flex items-center gap-1.5 text-xs">
                      <span className="text-slate-500 font-semibold">Pricing:</span>
                      <span className={`font-bold ${selectedPlatform === '1688' ? 'text-red-600' : 'text-[#FF6A00]'}`}>
                        3x Price (+200% Margin)
                      </span>
                    </div>

                    <button
                      id="btn-analyze-import"
                      onClick={() => handleAnalyzeUrl()}
                      disabled={isAnalyzing}
                      className={`text-white font-bold text-xs px-5 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-md disabled:opacity-50 flex-shrink-0 cursor-pointer ${
                        selectedPlatform === '1688'
                          ? 'bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800'
                          : 'bg-gradient-to-r from-[#FF6A00] to-[#E60012] hover:from-[#EE5007] hover:to-[#C4000F]'
                      }`}
                    >
                      {isAnalyzing ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Extracting from {selectedPlatform === '1688' ? '1688' : 'Alibaba'}...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-3.5 h-3.5 fill-white" />
                          <span>Analyze & Import ({selectedPlatform === '1688' ? '1688' : 'Alibaba'})</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Optional Product Name / Keyword Input */}
                <div className="flex items-center gap-2 pt-1">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={customTitleInput}
                      onChange={(e) => setCustomTitleInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={
                        selectedPlatform === '1688'
                          ? 'Optional Chinese or English Product Name hint (e.g. Feile Commuter Bag, Running Shoes, Solar Light)'
                          : 'Optional English Product Name / Sourcing Keyword hint (e.g. Spider Hoodie, Smart Watch, Earbuds)'
                      }
                      className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                  </div>
                  {customTitleInput && (
                    <button
                      onClick={() => setCustomTitleInput('')}
                      className="text-slate-400 hover:text-slate-600 text-xs px-2 py-1"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Platform-Specific Quick Presets */}
                <div className="pt-2 flex flex-wrap items-center gap-1.5 text-[11px]">
                  <span className="text-slate-400 font-semibold">
                    {selectedPlatform === '1688' ? '1688 Factory Presets:' : 'Alibaba Export Presets:'}
                  </span>

                  {selectedPlatform === '1688' ? (
                    <>
                      <button
                        onClick={() => handleQuickPreset('https://detail.1688.com/offer/1060516634917.html?spm=a261y.7663282.sameProduct.3.356e788683gSge')}
                        className="bg-red-50 hover:bg-red-100 text-red-700 px-2.5 py-1 rounded-lg border border-red-200 transition font-medium flex items-center gap-1 cursor-pointer"
                      >
                        <span>🎒</span>
                        <span>1688 Feile Underarm Bag (¥10.60 RMB)</span>
                      </button>
                      <button
                        onClick={() => handleQuickPreset('https://detail.1688.com/offer/829104821039.html?item=sneakers')}
                        className="bg-red-50 hover:bg-red-100 text-red-700 px-2.5 py-1 rounded-lg border border-red-200 transition font-medium flex items-center gap-1 cursor-pointer"
                      >
                        <span>👟</span>
                        <span>1688 Air Running Shoes</span>
                      </button>
                      <button
                        onClick={() => handleQuickPreset('https://detail.1688.com/offer/712883921920.html')}
                        className="bg-red-50 hover:bg-red-100 text-red-700 px-2.5 py-1 rounded-lg border border-red-200 transition font-medium flex items-center gap-1 cursor-pointer"
                      >
                        <span>☀️</span>
                        <span>1688 Solar Flood Light</span>
                      </button>
                      <button
                        onClick={() => handleQuickPreset('https://detail.1688.com/offer/654817293812.html')}
                        className="bg-red-50 hover:bg-red-100 text-red-700 px-2.5 py-1 rounded-lg border border-red-200 transition font-medium flex items-center gap-1 cursor-pointer"
                      >
                        <span>🛠️</span>
                        <span>1688 21V Drill Set</span>
                      </button>
                      <button
                        onClick={() => handleQuickPreset('https://detail.1688.com/offer/782194821049.html?item=fleece+hoodie')}
                        className="bg-red-50 hover:bg-red-100 text-red-700 px-2.5 py-1 rounded-lg border border-red-200 transition font-medium flex items-center gap-1 cursor-pointer"
                      >
                        <span>🧥</span>
                        <span>1688 Fleece Hoodie</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleQuickPreset('https://www.alibaba.com/product-detail/Custom-Zip-up-Spider-Hoodie-Oversize_1600972451127.html')}
                        className="bg-orange-50 hover:bg-orange-100 text-orange-700 px-2.5 py-1 rounded-lg border border-orange-200 transition font-medium flex items-center gap-1 cursor-pointer"
                      >
                        <span>👕</span>
                        <span>Spider Zip-Up Hoodie</span>
                      </button>
                      <button
                        onClick={() => handleQuickPreset('https://www.alibaba.com/product-detail/IP68-Waterproof-Smart-Watch-Men-Women_1601172769.html')}
                        className="bg-orange-50 hover:bg-orange-100 text-orange-700 px-2.5 py-1 rounded-lg border border-orange-200 transition font-medium flex items-center gap-1 cursor-pointer"
                      >
                        <span>⌚</span>
                        <span>Smart Fitness Watch</span>
                      </button>
                      <button
                        onClick={() => handleQuickPreset('https://www.alibaba.com/product-detail/Active-Noise-Cancelling-Wireless-Earbuds_1600812948.html')}
                        className="bg-orange-50 hover:bg-orange-100 text-orange-700 px-2.5 py-1 rounded-lg border border-orange-200 transition font-medium flex items-center gap-1 cursor-pointer"
                      >
                        <span>🎧</span>
                        <span>ANC Wireless Earbuds</span>
                      </button>
                      <button
                        onClick={() => handleQuickPreset('https://www.alibaba.com/product-detail/Portable-Solar-Generator-Power-Station_1600589123.html')}
                        className="bg-orange-50 hover:bg-orange-100 text-orange-700 px-2.5 py-1 rounded-lg border border-orange-200 transition font-medium flex items-center gap-1 cursor-pointer"
                      >
                        <span>⚡</span>
                        <span>Solar Power Station</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {errorMsg && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Success Notification Banner after Import */}
              {importedSuccessProduct && (
                <div className="bg-emerald-50 border-2 border-emerald-400 rounded-2xl p-5 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                      ✓
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-emerald-950">
                        Successfully Published to Bhanjo Catalog!
                      </h4>
                      <p className="text-xs text-emerald-800 mt-0.5">
                        Product routed directly to <strong>{importedSuccessProduct.categoryName}</strong> with 3x NPR pricing.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      id="btn-view-imported-category"
                      onClick={() => handleNavigateToCategory(importedSuccessProduct.categoryId)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow transition flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View in {importedSuccessProduct.categoryName}</span>
                    </button>
                    <button
                      onClick={() => {
                        setImportedSuccessProduct(null);
                        setPreviewProduct(null);
                        setAlibabaUrl('');
                      }}
                      className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold text-xs px-3.5 py-2.5 rounded-xl transition"
                    >
                      Import Another
                    </button>
                  </div>
                </div>
              )}

              {/* Live Preview Card */}
              {previewProduct && !importedSuccessProduct && (
                <div className="bg-white rounded-2xl border-2 border-orange-400 p-5 shadow-xl space-y-4 animate-in fade-in">
                  
                  {/* Top Bar with Category Dropdown & Status */}
                  <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-100 gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      {previewProduct.is1688Import ? (
                        <span className="bg-red-600 text-white font-black text-xs px-2.5 py-1 rounded-full flex items-center gap-1 shadow-2xs">
                          <span>🇨🇳 1688.com Factory Direct</span>
                        </span>
                      ) : (
                        <span className="bg-[#FF6A00] text-white font-black text-xs px-2.5 py-1 rounded-full flex items-center gap-1 shadow-2xs">
                          <span>🇨🇳 Alibaba.com Direct</span>
                        </span>
                      )}

                      {/* Interactive Category Selector Dropdown */}
                      <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-200 rounded-full px-2.5 py-1">
                        <FolderCheck className="w-3.5 h-3.5 text-[#FF6A00] flex-shrink-0" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Category:</span>
                        <select
                          value={previewProduct.categoryId}
                          onChange={(e) => {
                            const selectedCat = CATEGORIES.find(c => c.id === e.target.value);
                            if (selectedCat) {
                              setPreviewProduct(prev => ({
                                ...prev,
                                categoryId: selectedCat.id,
                                categoryName: selectedCat.name
                              }));
                            }
                          }}
                          className="bg-transparent text-xs font-black text-[#FF6A00] focus:outline-none cursor-pointer pr-1"
                        >
                          {CATEGORIES.map(cat => (
                            <option key={cat.id} value={cat.id} className="text-slate-800 font-semibold bg-white">
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <span className="bg-slate-100 text-slate-700 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                        <ImageIcon className="w-3 h-3 text-slate-500" />
                        <span>{previewProduct.images.length} High-Res Photos</span>
                      </span>

                      {previewProduct.videoUrl && (
                        <span className="bg-red-50 text-red-600 border border-red-200 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-2xs">
                          <Film className="w-3 h-3 text-red-500" />
                          <span>1 HD Video Showcase</span>
                        </span>
                      )}

                      <span className="text-xs font-mono font-bold text-slate-400">
                        ID: {previewProduct.id}
                      </span>
                    </div>

                    <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{previewProduct.is1688Import ? '1688 Buyer Protection Escrow' : 'Alibaba Trade Assurance Guaranteed'}</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                    {/* Left: Photos Gallery & Video Player */}
                    <div className="md:col-span-5 space-y-2">
                      <div className="aspect-square rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-inner relative flex items-center justify-center">
                        {previewMediaType === 'video' && previewProduct.videoUrl ? (
                          <div className="relative w-full h-full bg-black flex items-center justify-center">
                            <video
                              src={previewProduct.videoUrl}
                              controls
                              autoPlay
                              muted
                              playsInline
                              loop
                              className="w-full h-full object-contain"
                            />
                            <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                              <span>▶ 1688 Showcase Video</span>
                            </span>
                          </div>
                        ) : (
                          <>
                            <img
                              src={previewProduct.images[selectedPreviewImg] || previewProduct.images[0]}
                              alt={previewProduct.title}
                              className="w-full h-full object-cover transition-all duration-200"
                            />
                            <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-xs">
                              {selectedPreviewImg + 1} / {previewProduct.images.length}
                            </span>
                          </>
                        )}
                      </div>

                      {/* Thumbnails strip (Video + Photos) */}
                      <div className="flex gap-1.5 overflow-x-auto pb-1 max-h-20">
                        {previewProduct.videoUrl && (
                          <div className="relative flex-shrink-0">
                            <button
                              id="btn-preview-video"
                              type="button"
                              onClick={() => setPreviewMediaType('video')}
                              className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition flex flex-col items-center justify-center bg-slate-950 text-white ${
                                previewMediaType === 'video' ? 'border-[#FF6A00] ring-2 ring-orange-400 scale-95 shadow-xs' : 'border-slate-300 opacity-80 hover:opacity-100'
                              }`}
                              title="Play 1688 Product Video"
                            >
                              <div className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[9px] font-bold shadow-xs">
                                ▶
                              </div>
                              <span className="text-[9px] font-bold mt-0.5 text-slate-100">Video</span>
                              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                            </button>
                          </div>
                        )}

                        {previewProduct.images.map((img, i) => (
                          <div key={i} className="relative group/thumb flex-shrink-0">
                            <button
                              onClick={() => {
                                setPreviewMediaType('photo');
                                setSelectedPreviewImg(i);
                              }}
                              className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition ${
                                previewMediaType === 'photo' && selectedPreviewImg === i ? 'border-[#FF6A00] scale-95 shadow-xs' : 'border-slate-200 opacity-70 hover:opacity-100'
                              }`}
                            >
                              <img
                                src={img}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            </button>
                            {previewProduct.images.length > 1 && (
                              <button
                                title="Remove photo"
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setPreviewProduct(prev => {
                                    const updated = prev.images.filter((_, idx) => idx !== i);
                                    return { ...prev, images: updated };
                                  });
                                  if (selectedPreviewImg >= previewProduct.images.length - 1) {
                                    setSelectedPreviewImg(Math.max(0, previewProduct.images.length - 2));
                                  }
                                }}
                                className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition shadow-xs text-[9px] font-bold cursor-pointer"
                              >
                                ×
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Add Photo Link */}
                      <div className="pt-0.5">
                        {!showAddImageInput ? (
                          <div className="flex items-center justify-between text-[11px]">
                            <button
                              type="button"
                              onClick={() => setShowAddImageInput(true)}
                              className="text-[#FF6A00] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                              <span>+ Add Custom Photo URL</span>
                            </button>
                            <span className="text-slate-400 text-[10px]">
                              Hover thumbnail to remove
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                            <input
                              type="url"
                              value={newImageUrl}
                              onChange={(e) => setNewImageUrl(e.target.value)}
                              placeholder="Paste image URL (https://...)"
                              className="flex-1 bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                if (newImageUrl.trim()) {
                                  setPreviewProduct(prev => ({
                                    ...prev,
                                    images: [newImageUrl.trim(), ...prev.images]
                                  }));
                                  setSelectedPreviewImg(0);
                                  setNewImageUrl('');
                                  setShowAddImageInput(false);
                                }
                              }}
                              className="bg-[#FF6A00] hover:bg-[#EE5007] text-white px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer"
                            >
                              Add
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowAddImageInput(false)}
                              className="text-slate-400 hover:text-slate-600 px-1 text-xs"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Extracted Details */}
                    <div className="md:col-span-7 space-y-3.5 text-xs">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            Product Title (Editable):
                          </label>
                          {previewProduct.chineseTitle && (
                            <span className="text-[10px] text-slate-400 truncate max-w-[240px]" title={previewProduct.chineseTitle}>
                              🇨🇳 1688 Original: {previewProduct.chineseTitle}
                            </span>
                          )}
                        </div>
                        <input
                          type="text"
                          value={previewProduct.title}
                          onChange={(e) => setPreviewProduct(prev => ({ ...prev, title: e.target.value }))}
                          className="w-full font-extrabold text-xs sm:text-sm text-slate-900 bg-slate-50 border border-slate-300 hover:border-orange-400 focus:bg-white focus:border-orange-500 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition mt-1"
                        />
                        <p className="text-[11px] text-slate-500 mt-1 truncate">
                          Source: <a href={previewProduct.alibabaSourceUrl} target="_blank" rel="noreferrer" className="text-orange-600 hover:underline">{previewProduct.alibabaSourceUrl}</a>
                        </p>
                      </div>

                      {/* Manufacturer Info Strip */}
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-[11px]">
                        <div>
                          <span className="font-bold text-slate-800 block">
                            {previewProduct.supplierFlag} {previewProduct.supplierName}
                          </span>
                          <span className="text-slate-500">
                            {previewProduct.supplierCountry} • {previewProduct.verifiedYear} Yrs Gold Audited • ★ {previewProduct.rating} ({previewProduct.reviewsCount} reviews)
                          </span>
                        </div>
                        <span className="bg-orange-100 text-[#FF6A00] font-bold px-2.5 py-1 rounded-lg">
                          Lead Time: {previewProduct.leadTime}
                        </span>
                      </div>

                      {/* Editable Price Calculation Highlight Card */}
                      <div className="p-3 bg-gradient-to-br from-amber-50 to-orange-50/60 border border-orange-200 rounded-xl space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800 text-xs">
                            Wholesale Pricing (Editable):
                          </span>
                          <div className="flex items-center gap-1 text-[10px]">
                            <span className="text-slate-500 font-semibold">Multiplier:</span>
                            {[
                              { label: '2.0x', mult: 2.0 },
                              { label: '2.5x', mult: 2.5 },
                              { label: '3.0x', mult: 3.0 },
                              { label: '4.0x', mult: 4.0 }
                            ].map(p => (
                              <button
                                key={p.label}
                                type="button"
                                onClick={() => {
                                  const base = previewProduct.originalAlibabaPrice || (previewProduct.samplePrice / 3.0) || 15;
                                  const newUSD = parseFloat((base * p.mult).toFixed(2));
                                  const ratio = previewProduct.samplePrice > 0 ? newUSD / previewProduct.samplePrice : 1;
                                  setPreviewProduct(prev => ({
                                    ...prev,
                                    samplePrice: newUSD,
                                    priceNPR: Math.round(newUSD * 133.5),
                                    priceTiers: prev.priceTiers ? prev.priceTiers.map(t => ({ ...t, price: parseFloat((t.price * ratio).toFixed(2)) })) : prev.priceTiers
                                  }));
                                }}
                                className="px-1.5 py-0.5 bg-white hover:bg-orange-100 text-slate-700 font-bold rounded border border-slate-200 transition"
                              >
                                {p.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-center">
                          {/* Left: Factory Cost with Editable RMB for 1688 */}
                          <div className="bg-white/80 p-2 rounded-lg border border-orange-100 flex flex-col justify-center text-left">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] text-slate-500 font-bold block">
                                {previewProduct.is1688Import ? '1688 Factory Cost (RMB ¥):' : 'Alibaba Factory Cost:'}
                              </span>
                              {previewProduct.is1688Import && (
                                <span className="text-[9px] text-slate-400 font-semibold">(Editable)</span>
                              )}
                            </div>
                            {previewProduct.is1688Import ? (
                              <div className="flex items-center gap-1.5 mt-1">
                                <div className="relative flex-1">
                                  <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] font-bold">¥</span>
                                  <input
                                    type="number"
                                    step="0.1"
                                    value={previewProduct.original1688PriceRMB || ''}
                                    onChange={(e) => {
                                      const rmb = parseFloat(e.target.value) || 0;
                                      const usd = parseFloat((rmb * 0.1383).toFixed(2));
                                      const newUSD = parseFloat((usd * 3.0).toFixed(2));
                                      const ratio = previewProduct.samplePrice > 0 ? newUSD / previewProduct.samplePrice : 1;
                                      setPreviewProduct(prev => ({
                                        ...prev,
                                        original1688PriceRMB: rmb,
                                        originalAlibabaPrice: usd,
                                        originalPriceNPR: Math.round(usd * 133.5),
                                        samplePrice: newUSD,
                                        priceNPR: Math.round(newUSD * 133.5),
                                        priceTiers: prev.priceTiers ? prev.priceTiers.map(t => ({ ...t, price: parseFloat((t.price * ratio).toFixed(2)) })) : prev.priceTiers
                                      }));
                                    }}
                                    className="w-full pl-5 pr-1 py-1 text-xs font-bold text-slate-800 bg-orange-50/30 border border-orange-200 rounded focus:outline-none focus:ring-1 focus:ring-orange-500"
                                  />
                                </div>
                                <span className="text-[10px] font-bold text-slate-500 whitespace-nowrap">
                                  ~${previewProduct.originalAlibabaPrice}
                                </span>
                              </div>
                            ) : (
                              <span className="font-bold text-slate-700 text-xs mt-0.5 block">
                                Rs. {previewProduct.originalPriceNPR?.toLocaleString()} (~${previewProduct.originalAlibabaPrice} USD)
                              </span>
                            )}
                          </div>

                          <div className="bg-white/95 p-2 rounded-lg border border-orange-300 shadow-2xs text-left">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] text-[#EE5007] font-bold block">Bhanjo Catalog Price:</span>
                              <span className="text-[9px] text-slate-400 font-semibold">(Editable)</span>
                            </div>
                            <div className="flex items-center gap-1.5 mt-1">
                              <div className="relative flex-1">
                                <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] font-bold">Rs.</span>
                                <input
                                  type="number"
                                  step="1"
                                  value={previewProduct.priceNPR || Math.round(previewProduct.samplePrice * 133.5)}
                                  onChange={(e) => {
                                    const val = parseFloat(e.target.value) || 0;
                                    const usd = parseFloat((val / 133.5).toFixed(2));
                                    const ratio = previewProduct.samplePrice > 0 ? usd / previewProduct.samplePrice : 1;
                                    setPreviewProduct(prev => ({
                                      ...prev,
                                      priceNPR: Math.round(val),
                                      samplePrice: usd,
                                      priceTiers: prev.priceTiers ? prev.priceTiers.map(t => ({ ...t, price: parseFloat((t.price * ratio).toFixed(2)) })) : prev.priceTiers
                                    }));
                                  }}
                                  className="w-full pl-6 pr-1 py-1 text-xs font-black text-[#FF6A00] bg-orange-50/50 border border-orange-200 rounded focus:outline-none focus:ring-1 focus:ring-orange-500"
                                />
                              </div>
                              <div className="relative w-20">
                                <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] font-bold">$</span>
                                <input
                                  type="number"
                                  step="0.01"
                                  value={previewProduct.samplePrice || 0}
                                  onChange={(e) => {
                                    const usd = parseFloat(e.target.value) || 0;
                                    const ratio = previewProduct.samplePrice > 0 ? usd / previewProduct.samplePrice : 1;
                                    setPreviewProduct(prev => ({
                                      ...prev,
                                      samplePrice: usd,
                                      priceNPR: Math.round(usd * 133.5),
                                      priceTiers: prev.priceTiers ? prev.priceTiers.map(t => ({ ...t, price: parseFloat((t.price * ratio).toFixed(2)) })) : prev.priceTiers
                                    }));
                                  }}
                                  className="w-full pl-5 pr-1 py-1 text-xs font-black text-slate-800 bg-orange-50/50 border border-orange-200 rounded focus:outline-none focus:ring-1 focus:ring-orange-500"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Wholesale Tier Ladder */}
                        {previewProduct.priceTiers && previewProduct.priceTiers.length > 0 && (
                          <div className="pt-1">
                            <span className="text-[10px] text-slate-500 block mb-1 font-semibold">
                              Volume Tier Rates (with 3x baseline):
                            </span>
                            <div className="grid grid-cols-3 gap-1.5 text-center">
                              {previewProduct.priceTiers.slice(0, 3).map((tier, idx) => (
                                <div key={idx} className="bg-white p-1.5 rounded-md border border-slate-200 text-[10px]">
                                  <span className="text-slate-400 block">
                                    {tier.maxQty ? `${tier.minQty}-${tier.maxQty}` : `${tier.minQty}+`} {previewProduct.unit}
                                  </span>
                                  <span className="font-extrabold text-[#FF6A00] block">
                                    {formatPrice(tier.price)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Technical Specs List */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-bold text-slate-700 text-[11px]">
                            Factory Specifications ({Object.keys(previewProduct.specs).length} extracted):
                          </span>
                          <button
                            onClick={() => setShowAllSpecs(!showAllSpecs)}
                            className="text-[#FF6A00] text-[10px] font-bold hover:underline flex items-center gap-0.5"
                          >
                            <span>{showAllSpecs ? 'Show Less' : 'Show All Specs'}</span>
                            {showAllSpecs ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-1.5 text-[11px] bg-slate-50 p-2.5 rounded-xl border border-slate-200 max-h-36 overflow-y-auto">
                          {Object.entries(previewProduct.specs)
                            .slice(0, showAllSpecs ? 40 : 6)
                            .map(([k, v]) => (
                              <div key={k} className="flex flex-col py-0.5 border-b border-slate-100 last:border-0">
                                <span className="text-slate-400 font-medium text-[10px]">{k}:</span>
                                <span className="font-bold text-slate-800 line-clamp-1">{v}</span>
                              </div>
                            ))}
                        </div>
                      </div>

                      {/* Publish to Bhanjo Action Buttons */}
                      <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                        <button
                          onClick={() => setPreviewProduct(null)}
                          className="px-4 py-2.5 border border-slate-300 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 text-xs transition"
                        >
                          Discard
                        </button>

                        <button
                          id="btn-publish-product"
                          onClick={() => handlePublishToBhanjo()}
                          disabled={isPublishing}
                          className="bg-gradient-to-r from-[#FF6A00] to-[#EE5007] hover:from-[#EE5007] hover:to-[#DD4006] text-white font-extrabold px-6 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition flex items-center gap-2 text-xs disabled:opacity-50 cursor-pointer"
                        >
                          {isPublishing ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              <span>Importing to {previewProduct.categoryName}...</span>
                            </>
                          ) : (
                            <>
                              <Download className="w-4 h-4" />
                              <span>Publish to {previewProduct.categoryName}</span>
                            </>
                          )}
                        </button>
                      </div>

                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {activeTab === 'catalog' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    High-Volume Chinese Factory SKUs Ready for Nepal Sourcing
                  </h3>
                  <p className="text-xs text-slate-500">
                    Direct factory lines with complete photography, technical specs, and DDP shipping terms to Kathmandu
                  </p>
                </div>

                <button
                  onClick={handleBulkImportAll}
                  disabled={isBulkImporting}
                  className="bg-[#FF6A00] hover:bg-[#EE5007] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow transition flex items-center gap-1.5 flex-shrink-0 disabled:opacity-50"
                >
                  {isBulkImporting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Importing All...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      <span>1-Click Import All ({trendingList.length} SKUs)</span>
                    </>
                  )}
                </button>
              </div>

              {isLoadingTrending ? (
                <div className="text-center py-12">
                  <RefreshCw className="w-8 h-8 text-[#FF6A00] animate-spin mx-auto mb-2" />
                  <p className="text-xs text-slate-500 font-semibold">Loading verified Alibaba factory listings...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {trendingList.map((item) => {
                    const isImported = importedIds.has(item.id);
                    return (
                      <div 
                        key={item.id}
                        className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-xs hover:border-orange-300 transition flex flex-col justify-between"
                      >
                        <div>
                          <div className="aspect-square rounded-xl overflow-hidden bg-slate-100 mb-2 relative">
                            <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                            <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                              {item.supplierFlag} {item.supplierName?.split(' ')[0]}
                            </span>
                          </div>

                          <span className="text-[10px] text-orange-600 font-bold block mb-0.5">
                            {item.categoryName}
                          </span>
                          <h4 className="font-bold text-xs text-slate-800 line-clamp-2 leading-tight" title={item.title}>
                            {item.title}
                          </h4>

                          <div className="mt-2 flex items-baseline justify-between">
                            <span className="text-sm font-black text-[#FF6A00]">
                              {formatPrice(item.priceTiers?.[item.priceTiers.length - 1]?.price || item.samplePrice)}
                            </span>
                            <span className="text-[11px] text-slate-500 font-medium">
                              MOQ: {item.moq} {item.unit}
                            </span>
                          </div>
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-[10px] text-slate-400 font-medium">
                            ★ {item.rating} ({item.reviewsCount})
                          </span>

                          <button
                            onClick={() => handlePublishToBhanjo(item)}
                            disabled={isImported}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                              isImported
                                ? 'bg-emerald-100 text-emerald-700 cursor-default'
                                : 'bg-[#FF6A00] hover:bg-[#EE5007] text-white shadow-xs'
                            }`}
                          >
                            {isImported ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Imported</span>
                              </>
                            ) : (
                              <>
                                <Download className="w-3.5 h-3.5" />
                                <span>Import SKU</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
