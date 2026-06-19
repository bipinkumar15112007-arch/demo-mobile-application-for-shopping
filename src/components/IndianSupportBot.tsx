import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Sparkles, X, ShoppingCart, HelpCircle } from 'lucide-react';
import { CartItem } from '../types';

interface IndianSupportBotProps {
  cartItems: CartItem[];
  currentPincode: string;
}

interface Message {
  sender: 'bot' | 'user';
  text: string;
  timestamp: Date;
  recipes?: { title: string; ingredients: string[]; description: string }[];
}

export default function IndianSupportBot({ cartItems, currentPincode }: IndianSupportBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputVal, setInputVal] = useState('');

  // Formulate recipes based on items in cart
  const generateRecipeSuggestions = () => {
    const list: { title: string; ingredients: string[]; description: string }[] = [];
    const ids = cartItems.map(i => i.product.id);

    if (ids.includes('fv-1')) {
      list.push({
        title: '🥭 Fresh Alphonso Aamras & Puris',
        ingredients: ['Alphonso Mangoes', 'Sharbati Whole Wheat Atta', 'Pure Ghee'],
        description: 'Blissful thick mango nectar. Blend Alphonso pulp with a pinch of dry ginger & cardamom. Knead Sharbati Atta with water & ghee, roll out circles, deep fry into fluffy golden puris. Best eaten chilled!'
      });
    }

    if (ids.includes('db-1')) {
      list.push({
        title: '🥘 Dhaba-Style Shahi Paneer Butter Masala',
        ingredients: ['Fresh Malai Paneer', 'Desi Tomatoes', 'Turmeric Powder', 'Kashmiri Saffron (optional)'],
        description: 'Cut fresh malai paneer into soft cubes. Saute finely-chopped desi tomatoes, green chillies, and ginger in ghee. Whiz into puree, simmer with garam masala and turmeric. Drop paneer cubes gently and simmer for 5 mins.'
      });
    }

    if (ids.includes('sn-3')) {
      list.push({
        title: '🥞 Ghee Roast Crispy Dosa & Dhaniya Chutney',
        ingredients: ['Idli-Dosa Wet Batter', 'Pure Desi Ghee', 'Fresh Coriander Bunch'],
        description: 'Heat up a seasoned flat cast-iron tawa. Splash water to temper, ladle out smooth wet batter in concentric circles. Drizzle hot Desi Cow Ghee generously. Fry until golden-red. Garnish with a fresh grind of Coriander Dhaniya, mint, and coconut!'
      });
    }

    if (ids.includes('ds-2') && ids.includes('ds-3')) {
      list.push({
        title: '🍲 Classic Golden Khichdi (Comfort Diet)',
        ingredients: ['Royal Basmati Rice', 'Unpolished Toor Dal', 'A2 Cow Ghee', 'Turmeric Powder'],
        description: 'Wash long-grain basmati and Toor Dal in 1:1 ratio. Mix in pressure cooker with water, salt, Haldi powder, and a dollop of Ghee. Slow cook for 3 whistles matching a soothing aroma. Serve hot smeared with more ghee!'
      });
    }

    return list;
  };

  useEffect(() => {
    // Initial welcome message
    setMessages([
      {
        sender: 'bot',
        text: 'Namaste! I am your Fresh Market Indian Kitchen Companion. 🌾 Tell me what you\'re craving today, check your PIN code delivery details, or let me suggest real recipes based on your grocery cart!',
        timestamp: new Date()
      }
    ]);
  }, []);

  const handleSend = (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const query = customQuery || inputVal.trim();
    if (!query) return;

    if (!customQuery) {
      setInputVal('');
    }

    const userMsg: Message = {
      sender: 'user',
      text: query,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);

    // Bot response selection
    setTimeout(() => {
      let responseText = '';
      let suggestedRecipes: any[] = [];

      const normalized = query.toLowerCase();

      if (normalized.includes('recipe') || normalized.includes('cook') || normalized.includes('ingredi') || normalized.includes('eat')) {
        const generated = generateRecipeSuggestions();
        if (generated.length > 0) {
          responseText = "Aha! I scanned your current basket items and formulated authentic recipes you can cook right away with these fresh products:";
          suggestedRecipes = generated;
        } else {
          responseText = "Your basket is looking fresh! Add Premium Malai Paneer, Alphonso Mangoes, or Long-Grain Basmati Rice, and I will instantly compose authentic local recipes. For currently available items, a quick Khichdi of Toor Dal and Golden Basmati Ghee Roast is highly recommended!";
          suggestedRecipes = [
            {
              title: '🍲 Classic Golden Dal Tadka',
              ingredients: ['Toor Dal', 'Desi Ghee', 'Desi Tomatoes', 'Hari Mirch'],
              description: 'Boil unpolished Toor Dal with turmeric. Prepare a sizzling tadka of pure A2 Ghee with red onions, baby tomatoes, green chillies, and cumin seeds. Pour over the hot dal and serve immediately with basmati.'
            }
          ];
        }
      } else if (normalized.includes('shipp') || normalized.includes('pincode') || normalized.includes('deliv')) {
        responseText = `Currently shipping to major metropolitan hubs including Mumbai, Delhi NCR, Bengaluru, Hyderabad, Kolkata, Jaipur, Lucknow and Pune. Your current active PIN is ${currentPincode || 'not selected yet'}. Minimum order values above ₹499 unlock FREE express delivery.`;
      } else if (normalized.includes('organic') || normalized.includes('fresh')) {
        responseText = "Yes, our organic certified vegetables and fruits come directly from high-end organic collectives in Nashik, Kolar, and Shimla under strict temperature controls. They are farm-plucked and reaches you within 12-24 hours!";
      } else if (normalized.includes('paneer') || normalized.includes('malai')) {
        responseText = "Our fresh Malai Paneer contains no artificial starches or setting agents. It is sourced from Anand, Gujarat, and packed with soft cream layers that melt easily in standard Indian spices.";
      } else {
        responseText = "I can definitely help with that! At Fresh Market Bharat, we specialize in certified organic produce (Nashik onions, Devgad Alphonsos), pure A2 Ghee, and unpolished staples. What else would you like to know about our quality standards, pricing, or shipping rules?";
      }

      const botReply: Message = {
        sender: 'bot',
        text: responseText,
        timestamp: new Date(),
        recipes: suggestedRecipes.length > 0 ? suggestedRecipes : undefined
      };

      setMessages(prev => [...prev, botReply]);
    }, 850);
  };

  const activeRecipes = generateRecipeSuggestions();

  return (
    <>
      {/* Bot Chat Launcher Bubble (bottom-right fixed) */}
      <button
        type="button"
        id="bot-launcher-btn"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-brand-green hover:bg-brand-green-dark text-white rounded-full p-4 shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 focus:outline-none"
      >
        <MessageSquare className="w-6 h-6" />
        {activeRecipes.length > 0 && !isOpen && (
          <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-brand-orange text-white text-[10px] uppercase font-black rounded-full flex items-center justify-center animate-bounce">
            ★
          </span>
        )}
      </button>

      {/* Chat Window Container */}
      {isOpen && (
        <div 
          id="bot-chat-container"
          className="fixed bottom-24 right-6 z-50 w-full max-w-sm sm:max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col h-[480px] max-h-[70vh] overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200"
        >
          {/* Header */}
          <div className="bg-brand-green text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-white/10 rounded-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm tracking-wide">Bharat Chef Assistant</h3>
                <p className="text-[10px] text-white/80">Regional Recipe Ideas & Local FAQs</p>
              </div>
            </div>
            <button
              id="close-chat-btn"
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1 rounded-sm"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Logs */}
          <div className="flex-grow p-4 overflow-y-auto space-y-3">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`p-3 rounded-2xl text-xs max-w-[85%] leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-brand-green text-white rounded-tr-none'
                    : 'bg-gray-100 text-brand-navy rounded-tl-none'
                }`}>
                  <p className="font-semibold text-[11px] mb-1 opacity-75">
                    {m.sender === 'user' ? 'You' : 'Chef Assistant'} • {m.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                  <div>{m.text}</div>

                  {/* Recipe Cards List */}
                  {m.recipes && m.recipes.map((recipe, rIdx) => (
                    <div key={rIdx} className="mt-3.5 bg-white rounded-xl p-3 border border-brand-green/20 text-brand-navy space-y-2 shadow-xs">
                      <h4 className="font-bold text-xs text-brand-green-dark border-b border-gray-100 pb-1.5">
                        {recipe.title}
                      </h4>
                      <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Primary Groceries Needed</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {recipe.ingredients.map((ing, iIdx) => (
                            <span key={iIdx} className="bg-gray-100 text-[10px] font-semibold text-gray-600 px-1.5 py-0.5 rounded border border-gray-200">
                              {ing}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Local Method</span>
                        <p className="text-[11px] text-gray-600 leading-relaxed mt-1">
                          {recipe.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Suggestions Tags */}
          <div className="px-4 py-2 border-t border-slate-200 bg-slate-50 flex gap-2 overflow-x-auto select-none shrink-0 scrollbar-none">
            <button
              onClick={() => handleSend(undefined, 'Suggest me recipes based on my cart items')}
              className="text-[10px] font-bold text-brand-green bg-white hover:bg-brand-green hover:text-white px-2.5 py-1.5 rounded-full border border-brand-green/20 shrink-0 transition-colors flex items-center gap-1 shadow-2xs"
            >
              <ShoppingCart className="w-3 h-3" />
              <span>Recipes for my cart</span>
            </button>
            <button
              onClick={() => handleSend(undefined, 'Are organic veggies farm fresh?')}
              className="text-[10px] font-bold text-gray-600 bg-white hover:bg-gray-100 px-2.5 py-1.5 rounded-full border border-gray-200 shrink-0 transition-colors tracking-wide"
            >
              Organic quality check
            </button>
            <button
              onClick={() => handleSend(undefined, 'Where do you ship in India?')}
              className="text-[10px] font-bold text-gray-600 bg-white hover:bg-gray-100 px-2.5 py-1.5 rounded-full border border-gray-200 shrink-0 transition-colors tracking-wide"
            >
              <HelpCircle className="w-3 h-3 text-gray-400 inline" />
              <span>Deliver limits / PINs</span>
            </button>
          </div>

          {/* Input field footer */}
          <form onSubmit={(e) => handleSend(e)} className="p-3 border-t border-gray-200 flex gap-2 items-center">
            <input
              id="support-chat-input"
              type="text"
              placeholder="Ask recipes, shipping limit, ghee..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="flex-grow px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-green focus:border-brand-green"
            />
            <button
              type="submit"
              id="support-chat-submit-btn"
              className="p-2 bg-brand-green hover:bg-brand-green-dark text-white rounded-xl shadow-xs transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
