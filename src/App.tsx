import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShoppingBag, 
  MapPin, 
  Search, 
  Sparkles, 
  History, 
  Truck, 
  TrendingUp, 
  Tag, 
  Percent, 
  X, 
  SearchSlash, 
  User, 
  BadgeCheck, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { PRODUCTS, PINCODES, CATEGORIES } from './data';
import { Product, CartItem, PinCodeInfo, ShippingDetails, Order, PaymentMethod } from './types';

// Custom Modules
import PINCheckModal from './components/PINCheckModal';
import ProductCard from './components/ProductCard';
import CartDrawer from './components/CartDrawer';
import ShippingDetailsForm from './components/ShippingDetailsForm';
import PaymentGatewaySim from './components/PaymentGatewaySim';
import OrderTracker from './components/OrderTracker';
import IndianSupportBot from './components/IndianSupportBot';

const LOCAL_CART_KEY = 'fresh_market_cart';
const LOCAL_PIN_KEY = 'fresh_market_pincode';
const LOCAL_SHIPPING_KEY = 'fresh_market_shipping_address';
const LOCAL_ORDERS_KEY = 'fresh_market_orders';

export default function App() {
  // Pin code & location states
  const [pincodeInfo, setPincodeInfo] = useState<PinCodeInfo>(() => {
    const saved = localStorage.getItem(LOCAL_PIN_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    // Default to Bengaluru Center Hub (560001)
    return PINCODES['560001'];
  });
  const [showPinModal, setShowPinModal] = useState(false);

  // Cart Management
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(LOCAL_CART_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return [];
  });

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [organicOnly, setOrganicOnly] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);

  // App Stage / View controllers
  // 'shopping' | 'shipping' | 'payment' | 'tracking'
  const [currentView, setCurrentView] = useState<'shopping' | 'shipping' | 'payment' | 'tracking'>('shopping');
  
  // Checkout metadata variables
  const [shippingAddress, setShippingAddress] = useState<ShippingDetails | null>(() => {
    const saved = localStorage.getItem(LOCAL_SHIPPING_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return null;
  });
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  // Past Orders History
  const [allOrders, setAllOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(LOCAL_ORDERS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [];
  });
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showMobileCartDrawer, setShowMobileCartDrawer] = useState(false);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem(LOCAL_PIN_KEY, JSON.stringify(pincodeInfo));
  }, [pincodeInfo]);

  useEffect(() => {
    if (shippingAddress) {
      localStorage.setItem(LOCAL_SHIPPING_KEY, JSON.stringify(shippingAddress));
    }
  }, [shippingAddress]);

  useEffect(() => {
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(allOrders));
  }, [allOrders]);

  // Open pin verification automatically on first visit (if not saved)
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_PIN_KEY);
    if (!saved) {
      setShowPinModal(true);
    }
  }, []);

  // Cart operations
  const handleAddToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        if (existing.quantity === 1) {
          return prev.filter(i => i.product.id !== product.id);
        }
        return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity - 1 } : i);
      }
      return prev;
    });
  };

  const handleUpdateQty = (pId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(pId);
      return;
    }
    setCartItems(prev => prev.map(i => i.product.id === pId ? { ...i, quantity } : i));
  };

  const handleRemoveItem = (pId: string) => {
    setCartItems(prev => prev.filter(i => i.product.id !== pId));
  };

  // Filter products based on state
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (p.hindiName && p.hindiName.includes(searchQuery)) ||
                            p.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      const matchesOrganic = !organicOnly || p.isOrganic;
      const matchesStock = !inStockOnly || p.inStock;

      return matchesSearch && matchesCategory && matchesOrganic && matchesStock;
    });
  }, [searchQuery, activeCategory, organicOnly, inStockOnly]);

  // Cart calculations
  const cartSubtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cartItems]);

  const shippingCharge = cartSubtotal >= pincodeInfo.freeDeliveryMin ? 0 : pincodeInfo.deliveryCharge;
  const grandTotal = Math.max(0, cartSubtotal + shippingCharge - appliedDiscount);

  // Transition handlers
  const handleCartCheckout = (discount: number, coupon: string) => {
    setAppliedDiscount(discount);
    setAppliedCoupon(coupon);
    setCurrentView('shipping');
    setShowMobileCartDrawer(false);
  };

  const handleShippingSubmit = (details: ShippingDetails) => {
    setShippingAddress(details);
    setCurrentView('payment');
  };

  const handlePaymentSuccess = (method: PaymentMethod, upiIdUsed?: string) => {
    // Generate valid Order Object
    const newOrder: Order = {
      id: `FMI-${Math.floor(100000 + Math.random() * 900000)}`,
      items: [...cartItems],
      subtotal: cartSubtotal,
      shippingCharge,
      discount: appliedDiscount,
      total: grandTotal,
      shippingAddress: shippingAddress!,
      paymentMethod: method,
      upiId: upiIdUsed,
      paymentStatus: 'Success',
      orderStatus: 'Placed',
      createdAt: new Date().toISOString(),
      pincode: pincodeInfo.pincode
    };

    // Update history, clear state
    setAllOrders(prev => [newOrder, ...prev]);
    setActiveOrder(newOrder);
    setCartItems([]);
    setAppliedDiscount(0);
    setAppliedCoupon('');
    setCurrentView('tracking');
  };

  const handleSimulateStateChange = (orderId: string, nextStatus: 'Placed' | 'Processing' | 'Out for Delivery' | 'Delivered') => {
    setAllOrders(prev => prev.map(o => o.id === orderId ? { ...o, orderStatus: nextStatus } : o));
    if (activeOrder && activeOrder.id === orderId) {
      setActiveOrder(prev => prev ? { ...prev, orderStatus: nextStatus } : null);
    }
  };

  return (
    <div className="min-h-screen bg-brand-navy-light/10 text-brand-navy flex flex-col antialiased">
      
      {/* Dynamic Overlay PIN dialog if not set on start */}
      {showPinModal && (
        <PINCheckModal
          currentPin={pincodeInfo.pincode}
          onSelectPin={(info) => {
            setPincodeInfo(info);
          }}
          onClose={() => setShowPinModal(false)}
          canDismiss={!!pincodeInfo.pincode}
        />
      )}

      {/* Top Banner announcing Indian region specialties */}
      <div className="bg-brand-green-dark text-white text-[11px] font-extrabold tracking-widest text-center py-2 px-4 uppercase flex flex-wrap items-center justify-center gap-3">
        <span>🌧️ Monsoon freshness deal: Get extra ₹100 Off with code <strong className="bg-brand-orange text-white px-2 py-0.5 rounded ml-1 font-mono">FRESH100</strong></span>
        <span className="hidden md:inline">• Sourced directly from Devgad (Mangoes) & Nashik (Sufi Onions)</span>
        <span className="hidden lg:inline">• Fast doorstep delivery with live soundbox alerts</span>
      </div>

      {/* Primary Header */}
      <header className="sticky top-0 z-30 bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <div className="text-2xl font-black tracking-tighter text-brand-green italic leading-none select-none">
              FRESH<span className="text-brand-orange">BHARAT</span>
            </div>
            <div className="hidden sm:block border-l border-slate-200 pl-3">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">certified regional</span>
              <span className="block text-[11px] font-extrabold text-slate-800 tracking-tight mt-0.5">grocery market</span>
            </div>
          </div>

          {/* Location Delivery Selector */}
          <button
            type="button"
            id="header-location-selector"
            onClick={() => setShowPinModal(true)}
            className="flex items-center gap-2 bg-brand-green-light hover:bg-brand-green-light/80 text-brand-green-dark px-4 py-2.5 rounded-xl border border-brand-green/10 text-xs font-bold transition-all"
          >
            <MapPin className="w-4 h-4 text-brand-green" />
            <div className="text-left min-w-0">
              <span className="block text-[10px] text-brand-green opacity-80 leading-none">Delivering To</span>
              <span className="truncate block font-extrabold leading-tight">
                {pincodeInfo.city} ({pincodeInfo.pincode})
              </span>
            </div>
          </button>

          {/* Search bar layout */}
          <div className="relative w-full sm:max-w-xs md:max-w-md">
            <input
              id="header-search-bar"
              type="text"
              placeholder="Search soft paneer, local mangoes, unpolished dal..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 pl-10 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green font-medium text-brand-navy"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-gray-400 hover:text-brand-navy text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Order History & Cart Summary Controls */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              id="header-orders-history-btn"
              onClick={() => setShowHistoryModal(true)}
              className="p-2.5 text-gray-500 hover:text-brand-green hover:bg-gray-100 rounded-xl transition-all relative"
              title="Track past Indian orders"
            >
              <History className="w-5 h-5" />
              {allOrders.length > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-brand-orange rounded-full animate-pulse" />
              )}
            </button>

            {/* Cart trigger button (Mobile only) */}
            <button
              type="button"
              id="header-bag-count-btn"
              onClick={() => setShowMobileCartDrawer(true)}
              className="lg:hidden flex items-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all relative"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>₹{cartSubtotal}</span>
              <span className="bg-brand-orange text-white text-[9px] font-bold font-mono px-1.5 py-0.5 rounded-full absolute -top-1.5 -right-1.5 border-2 border-white">
                {cartItems.reduce((sum, i) => sum + i.quantity, 0)}
              </span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-[1280px] mx-auto px-4 md:px-6 py-6 flex-grow w-full space-y-6">
        
        {/* SHOPPING HOME VIEW */}
        {currentView === 'shopping' && (
          <div className="space-y-6">
            
            {/* Promo hero banner */}
            <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-12 items-center">
              <div className="p-6 md:p-8 space-y-4 md:col-span-7">
                <div className="flex items-center gap-2">
                  <span className="bg-brand-orange-light text-brand-orange font-extrabold text-[10px] tracking-wide px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Percent className="w-3.5 h-4" />
                    <span>BHARAT SPECIAL DISCOUNT</span>
                  </span>
                  
                  <span className="bg-brand-green-light text-brand-green font-extrabold text-[10px] tracking-wide px-2.5 py-1 rounded-full">
                    Organic certified
                  </span>
                </div>

                <div className="space-y-2">
                  <h1 className="text-2xl md:text-35 font-black text-brand-navy leading-none tracking-tight">
                    Purest Organic Harvest, <span className="text-brand-green">Sourced Locally.</span>
                  </h1>
                  <p className="text-xs text-gray-500 leading-relaxed font-semibold max-w-lg">
                    We deliver the absolute finest quality Devgad Alphonsos, creamy Anand Paneer, and unpolished Guntur spices directly to your kitchen. Same-day delivery at ₹0 shipping charge for baskets above ₹499.
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs font-bold pt-1 text-gray-700 flex-wrap">
                  <div className="flex items-center gap-1">
                    <Truck className="w-4 h-4 text-brand-green" />
                    <span>Free Under-12-Hours Delivery (Orders above ₹499)</span>
                  </div>
                </div>
              </div>

              {/* Promo Banner Graphic image side */}
              <div className="h-44 sm:h-64 md:h-full md:col-span-5 relative bg-gradient-to-tr from-brand-green-light to-white overflow-hidden flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800&auto=format&fit=crop"
                  alt="Farm Fresh Indian Produce"
                  className="w-full h-full object-cover select-none"
                  referrerPolicy="no-referrer"
                />
                
                <div className="absolute inset-0 bg-gradient-to-r from-white via-white/10 to-transparent md:block hidden" />
              </div>
            </div>

            {/* Layout grid containing catalog filters + grid + desktop bag summaries */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Catogory filter header row & Product cards catalog */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Visual Category slider */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-extrabold uppercase tracking-widest text-gray-400">Shop by category</h3>
                    <div className="flex items-center gap-4 text-xs font-semibold text-brand-navy">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={organicOnly} 
                          onChange={(e) => setOrganicOnly(e.target.checked)}
                          className="w-4 h-4 text-brand-green border-gray-300 rounded focus:ring-brand-green/35 focus:ring-2"
                        />
                        <span>Organic only</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={inStockOnly} 
                          onChange={(e) => setInStockOnly(e.target.checked)}
                          className="w-4 h-4 text-brand-green border-gray-300 rounded focus:ring-brand-green/35"
                        />
                        <span>In Stock</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-2 overflow-x-auto pb-1 select-none scrollbar-none scroll-smooth">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setActiveCategory(cat)}
                        className={`px-4 py-2 text-xs font-bold rounded-full border transition-all whitespace-nowrap shrink-0 ${
                          activeCategory === cat
                            ? 'bg-brand-green border-brand-green text-white shadow-soft font-extrabold'
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-gray-300'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Search result count */}
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>Filtered to <strong>{filteredProducts.length}</strong> delicacies</span>
                  {searchQuery && (
                    <span>Search query: &quot;<strong className="text-brand-navy font-bold">{searchQuery}</strong>&quot;</span>
                  )}
                </div>

                {/* Product listing grid */}
                {filteredProducts.length === 0 ? (
                  <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <div className="w-16 h-16 bg-gray-50 flex items-center justify-center rounded-full mx-auto text-gray-350">
                      <SearchSlash className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-brand-navy">No products found matching filters!</p>
                      <p className="text-xs text-gray-450 mt-1">Try resetting your organic filters, clearing the search query bar, or browsing another categories list.</p>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setActiveCategory('All');
                        setOrganicOnly(false);
                        setInStockOnly(false);
                      }}
                      className="px-5 py-2.5 bg-brand-green hover:bg-brand-green-dark text-white text-xs font-bold rounded-lg"
                    >
                      Reset filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredProducts.map((p) => {
                      const itemInCart = cartItems.find(i => i.product.id === p.id);
                      return (
                        <ProductCard
                          key={p.id}
                          product={p}
                          cartCount={itemInCart ? itemInCart.quantity : 0}
                          onAddToCart={handleAddToCart}
                          onRemoveFromCart={handleRemoveFromCart}
                        />
                      );
                    })}
                  </div>
                )}

              </div>

              {/* Right Column: Desktop Persistent Shopping Cart Drawer */}
              <div className="hidden lg:block lg:col-span-4 h-full sticky top-[100px]">
                <CartDrawer
                  items={cartItems}
                  pincodeInfo={pincodeInfo}
                  onUpdateQty={handleUpdateQty}
                  onRemoveItem={handleRemoveItem}
                  onCheckout={handleCartCheckout}
                  onOpenPinModal={() => setShowPinModal(true)}
                />
              </div>

            </div>

          </div>
        )}

        {/* SHIPMENT FORM VIEW */}
        {currentView === 'shipping' && (
          <div className="max-w-2xl mx-auto py-4">
            <ShippingDetailsForm
              pincodeInfo={pincodeInfo}
              onSubmit={handleShippingSubmit}
              onCancel={() => setCurrentView('shopping')}
              savedDetails={shippingAddress}
            />
          </div>
        )}

        {/* PAYMENT SHEETS VIEW */}
        {currentView === 'payment' && (
          <div className="max-w-xl mx-auto py-4">
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm mb-4 text-xs space-y-1.5">
              <h4 className="font-bold text-gray-400 uppercase tracking-widest">Order Shipment Summary</h4>
              <p>Deliver to: <strong>{shippingAddress?.fullName}</strong> - {shippingAddress?.phone}</p>
              <p>{shippingAddress?.addressLine1}, {shippingAddress?.city}, {shippingAddress?.pincode}</p>
              <button
                type="button"
                onClick={() => setCurrentView('shipping')}
                className="text-brand-green hover:underline font-bold text-[11px]"
              >
                Change Shipping Address Details
              </button>
            </div>

            <PaymentGatewaySim
              totalAmount={grandTotal}
              shippingAddress={shippingAddress!}
              onPaymentSuccess={handlePaymentSuccess}
              onCancel={() => setCurrentView('shipping')}
            />
          </div>
        )}

        {/* LIVE IN-APP TRANSIT MAP / ORDER STATE TRACKER */}
        {currentView === 'tracking' && activeOrder && (
          <div className="max-w-4xl mx-auto py-2">
            <OrderTracker
              order={activeOrder}
              onClose={() => setCurrentView('shopping')}
              onSimulateStateChange={handleSimulateStateChange}
            />
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-brand-navy text-white mt-12 py-10 border-t border-gray-800">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-green text-white rounded-lg flex items-center justify-center font-bold text-base">
                F
              </div>
              <span className="text-base font-extrabold tracking-tight text-white">Fresh Market Bharat</span>
            </div>
            
            <p className="text-xs text-gray-400 leading-relaxed font-semibold">
              India&apos;s ultimate high-quality organic grocery provider. Delivering premium hygiene and agricultural integrity locally across tech and metro centers since 2026.
            </p>
          </div>

          <div className="space-y-2.5 text-xs text-gray-400">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Regional Delivery Hubs</h4>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <span>📍 Bengaluru Hub</span>
              <span>📍 Mumbai West</span>
              <span>📍 New Delhi Central</span>
              <span>📍 Pune Sector 3</span>
              <span>📍 Kolkata East</span>
              <span>📍 Hyderabad Hub</span>
            </div>
          </div>

          <div className="space-y-2.5 text-xs text-gray-400">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Indian Market Specialties</h4>
            <div className="flex flex-wrap gap-1.5">
              <span className="bg-gray-800 text-[10px] font-bold px-2 py-0.5 rounded border border-gray-700 text-gray-300">A2 Cow Ghee</span>
              <span className="bg-gray-800 text-[10px] font-bold px-2 py-0.5 rounded border border-gray-700 text-gray-300">Malai Paneer</span>
              <span className="bg-gray-800 text-[10px] font-bold px-2 py-0.5 rounded border border-gray-700 text-gray-300">Sharbati Wheat</span>
              <span className="bg-gray-800 text-[10px] font-bold px-2 py-0.5 rounded border border-gray-700 text-gray-300">Hapus Mangoes</span>
              <span className="bg-gray-800 text-[10px] font-bold px-2 py-0.5 rounded border border-gray-700 text-gray-300">Unpolished Dals</span>
            </div>
          </div>

          <div className="space-y-3 text-xs text-gray-400 font-semibold text-left">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Hygiene & Security</h4>
            <p className="text-[11px]">Every item is sanitized, vacuum-packed, and shipped in clean cold-chain delivery bags to avoid loss of nutrients.</p>
            <div className="flex items-center gap-1 text-[11px] text-brand-green-light font-bold">
              <span className="w-2 h-2 bg-brand-green rounded-full" />
              <span>Full SSL Protected Indian Bank API Connections</span>
            </div>
          </div>

        </div>

        <div className="max-w-[1280px] mx-auto px-4 md:px-6 pt-6 mt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 font-semibold gap-3">
          <p>© 2026 Fresh Market India Retail Pvt Ltd. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#toc" className="hover:underline">Terms of Use</a>
            <a href="#privacy" className="hover:underline">Privacy Policy</a>
            <a href="#fssai" className="hover:underline flex items-center gap-1 text-brand-green">
              <span>FSSAI Lic. No. 11526940204928</span>
            </a>
          </div>
        </div>
      </footer>

      {/* MODAL: Track past Indian orders list */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div 
            id="orders-history-container"
            className="w-full max-w-2xl bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in"
          >
            <div className="bg-brand-navy text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-brand-green-light" />
                <h3 className="font-extrabold text-sm tracking-wide text-white">Indian Order Logs</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowHistoryModal(false)}
                className="text-white/80 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              {allOrders.length === 0 ? (
                <div className="text-center py-12 text-xs space-y-3">
                  <p className="font-bold text-gray-550">No orders logged under this user account yet.</p>
                  <p className="text-gray-400">Put customized fresh items in basket and complete checkout securely.</p>
                </div>
              ) : (
                allOrders.map((ord) => (
                  <div key={ord.id} className="bg-gray-55 p-4 rounded-xl border border-gray-150 relative space-y-2 text-xs text-brand-navy">
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-300 pb-2">
                      <div>
                        <span className="font-extrabold text-brand-green tracking-wider font-mono mr-2">{ord.id}</span>
                        <span className="text-gray-400">{new Date(ord.createdAt).toLocaleDateString()}</span>
                      </div>
                      
                      <div className="flex items-center gap-2.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${
                          ord.orderStatus === 'Delivered' 
                            ? 'bg-brand-green/10 text-brand-green' 
                            : 'bg-brand-orange/10 text-brand-orange animate-pulse'
                        }`}>
                          {ord.orderStatus}
                        </span>
                        
                        <button
                          type="button"
                          onClick={() => {
                            setActiveOrder(ord);
                            setCurrentView('tracking');
                            setShowHistoryModal(false);
                          }}
                          className="bg-brand-green hover:bg-brand-green-dark text-white text-[10px] font-bold px-2.5 py-1 rounded-md"
                        >
                          Live Track
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-[11px] font-semibold text-gray-500">
                      <div>
                        <span>Amount Paid:</span>
                        <p className="font-bold text-brand-navy font-mono">₹{ord.total}</p>
                      </div>
                      <div>
                        <span>Channel:</span>
                        <p className="font-bold text-brand-navy">{ord.paymentMethod}</p>
                      </div>
                      <div>
                        <span>Delivery PIN:</span>
                        <p className="font-bold text-brand-navy font-mono">{ord.pincode}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* MOBILE CART DRAWER OVERLAY */}
      {showMobileCartDrawer && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-md bg-white h-full relative flex flex-col shadow-2xl animate-in slide-in-from-right duration-250">
            <button
              onClick={() => setShowMobileCartDrawer(false)}
              className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 p-1.5 rounded-full text-brand-navy font-bold text-sm bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              ✕
            </button>
            <div className="flex-grow overflow-hidden">
              <CartDrawer
                items={cartItems}
                pincodeInfo={pincodeInfo}
                onUpdateQty={handleUpdateQty}
                onRemoveItem={handleRemoveItem}
                onCheckout={handleCartCheckout}
                onOpenPinModal={() => setShowPinModal(true)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Floating Indian Support Recipe Bot */}
      <IndianSupportBot 
        cartItems={cartItems} 
        currentPincode={pincodeInfo?.pincode || '560001'} 
      />

    </div>
  );
}
