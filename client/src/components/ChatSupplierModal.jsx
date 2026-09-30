import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Send, Paperclip, ShieldCheck, CheckCheck, FileText, 
  Download, Building, Star, MapPin, Sparkles, DollarSign 
} from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

export const ChatSupplierModal = ({ isOpen, onClose, product, supplier }) => {
  const { formatPrice, currentCurrency } = useCurrency();
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'supplier',
      text: `Namaste! Welcome to Bhanjo.com Official Store. Thank you for your interest in ${product ? product.title : 'our catalog'}. How can our team assist you with sizing, delivery, or product details today?`,
      time: '10:02 AM',
      hasQuotationCard: product ? true : false
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'buyer',
      text: inputMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    // Save inquiry to backend SQLite
    fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: product?.id || '',
        productTitle: product?.title || 'General Supplier Inquiry',
        supplierId: supplier?.id || 'sup-verified',
        customerName: 'Verified Buyer',
        phone: '9841234567',
        message: inputMessage.trim()
      })
    }).catch(err => console.log('Inquiry sync note:', err));

    // Simulate realistic factory sales manager reply
    setTimeout(() => {
      let replyText = "Thank you for the detailed requirement. We have verified our production capacity and we can provide the full Trade Assurance contract with custom quality inspection report. Would you like us to generate a formal Proforma Invoice (PI)?";
      
      const lower = userMsg.text.toLowerCase();
      if (lower.includes('sample')) {
        replyText = `We can dispatch a verified golden sample within 24-48 hours via DHL/FedEx Express. Sample cost will be 100% credited back to your account upon placing the bulk wholesale order!`;
      } else if (lower.includes('discount') || lower.includes('price') || lower.includes('cheaper')) {
        replyText = `For higher container quantities (e.g. 500+ units), we can offer an additional 8% tier discount with free customized logo embossing and FOB port handling included.`;
      } else if (lower.includes('shipping') || lower.includes('fob') || lower.includes('cif') || lower.includes('nepal')) {
        replyText = `We handle complete customs clearance and multimodal logistics from Kathmandu / Guangzhou / Kolkata directly to your designated port or warehouse under DDP/CIF terms.`;
      }

      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'supplier',
          text: replyText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          proformaOffer: lower.includes('sample') || lower.includes('quote') || lower.includes('pi')
        }
      ]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      
      <div className="bg-white rounded-2xl max-w-2xl w-full h-[620px] shadow-2xl border border-slate-200 relative flex flex-col overflow-hidden">
        
        {/* Chat Header */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center font-bold text-white shadow">
                {supplier ? supplier.name.charAt(0) : 'B'}
              </div>
              <span className="w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full absolute bottom-0 right-0"></span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-slate-100 truncate max-w-[280px]">
                  Bhanjo Customer Support Team
                </h3>
                <span className="text-[10px] bg-orange-500/20 text-orange-400 font-bold px-1.5 py-0.5 rounded">
                  Official Store
                </span>
              </div>
              <p className="text-[11px] text-slate-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-orange-400" />
                <span>Bhanjo.com HQ • Kathmandu, Nepal</span>
                <span>• Response: &lt; 5 mins</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Trade Assurance Header Bar */}
        <div className="bg-amber-50 px-4 py-2 border-b border-amber-200 flex items-center justify-between text-xs text-amber-800">
          <span className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>100% Genuine Buyer Protection & Delivery Guarantee across Nepal</span>
          </span>
          <span className="font-bold text-amber-900">Escrow Protected</span>
        </div>

        {/* Message Thread Area */}
        <div className="flex-1 p-4 overflow-y-auto bg-slate-50/60 space-y-3.5">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'buyer' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[82%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'buyer'
                    ? 'bg-orange-500 text-white rounded-br-none shadow-sm'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm'
                }`}
              >
                {msg.text}

                {/* Product Quick Attachment Card if initial quote */}
                {msg.hasQuotationCard && product && (
                  <div className="mt-2.5 p-2 bg-slate-50 text-slate-800 rounded-lg border border-slate-200 flex items-center gap-2.5">
                    <img src={product.images[0]} alt={product.title} className="w-12 h-12 object-cover rounded" />
                    <div className="min-w-0 flex-1 text-[11px]">
                      <div className="font-bold truncate">{product.title}</div>
                      <div className="text-orange-600 font-semibold">
                        MOQ: {product.moq} {product.unit} | Starting: {formatPrice(product.priceTiers[product.priceTiers.length - 1]?.price)}
                      </div>
                    </div>
                  </div>
                )}

                {/* Proforma Invoice generated offer badge */}
                {msg.proformaOffer && (
                  <div className="mt-2.5 p-2.5 bg-emerald-50 text-emerald-900 rounded-lg border border-emerald-200 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold">
                      <FileText className="w-4 h-4 text-emerald-600" />
                      <span>Official Proforma Quotation Drafted</span>
                    </div>
                    <button className="text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2 py-1 rounded transition">
                      View PI
                    </button>
                  </div>
                )}
              </div>

              <span className="text-[10px] text-slate-400 mt-1 px-1 flex items-center gap-1">
                {msg.time}
                {msg.sender === 'buyer' && <CheckCheck className="w-3 h-3 text-orange-500" />}
              </span>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-slate-400 text-xs italic p-2 bg-white rounded-lg border border-slate-100 w-fit">
              <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              <span>Factory Representative is typing...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-white border-t border-slate-100 flex gap-2 overflow-x-auto text-[11px]">
          <button
            onClick={() => setInputMessage("Can you provide sample pricing and courier time to Kathmandu/our address?")}
            className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 hover:bg-orange-50 hover:text-orange-600 border border-slate-200 text-slate-600 transition"
          >
            📦 Request Sample Terms
          </button>
          <button
            onClick={() => setInputMessage("What is your best FOB price for 1,000 units with custom logo?")}
            className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 hover:bg-orange-50 hover:text-orange-600 border border-slate-200 text-slate-600 transition"
          >
            💰 Inquire 1000 Pcs Discount
          </button>
          <button
            onClick={() => setInputMessage("Please send your ISO/Quality Inspection test report.")}
            className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 hover:bg-orange-50 hover:text-orange-600 border border-slate-200 text-slate-600 transition"
          >
            📑 Request Audit Certificate
          </button>
        </div>

        {/* Chat Input Bar */}
        <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <button
            type="button"
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
            title="Attach RFQ specification or Purchase Order"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          <input
            type="text"
            placeholder="Type your quotation question, target price, or customization requirements..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-1 text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white p-2.5 rounded-xl shadow transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>

    </div>
  );
};
