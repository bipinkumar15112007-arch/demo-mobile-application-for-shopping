import React, { useState } from 'react';
import { ShoppingBag, Truck, Ticket, RefreshCw, Trash2, ArrowRight, X, ShieldCheck } from 'lucide-react';
import { CartItem, PinCodeInfo } from '../types';

interface CartDrawerProps {
  items: CartItem[];
  pincodeInfo: PinCodeInfo;
  onUpdateQty: (pId: string, qty: number) => void;
  onRemoveItem: (pId: string) => void;
  onCheckout: (discount: number, couponCode: string) => void;
  onOpenPinModal: () => void;
}

export default function CartDrawer({
  items,
  pincodeInfo,
  onUpdateQty,
  onRemoveItem,
  onCheckout,
  onOpenPinModal
}: CartDrawerProps) {
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponError, setCouponError] = useState('');

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const isFreeDelivery = subtotal >= pincodeInfo.freeDeliveryMin;
  const deliveryCharge = isFreeDelivery ? 0 : pincodeInfo.deliveryCharge;

  // Progress to free delivery
  const progressPercent = Math.min(100, (subtotal / pincodeInfo.freeDeliveryMin) * 100);
  const amountToFree = pincodeInfo.freeDeliveryMin - subtotal;

  const handleApplyCoupon = () => {
    setCouponError('');
    const cleaned = couponInput.trim().toUpperCase();

    if (cleaned === 'FRESH100') {
      if (subtotal >= 499) {
        setAppliedCoupon('FRESH100');
        setDiscountAmount(100);
        setCouponInput('');
      } else {
        setCouponError('This coupon requires a minimum cart value of ₹499.');
      }
    } else if (cleaned === 'DESI50') {
      if (subtotal >= 299) {
        setAppliedCoupon('DESI50');
        setDiscountAmount(50);
        setCouponInput('');
      } else {
        setCouponError('This coupon requires a minimum cart value of ₹299.');
      }
    } else if (cleaned) {
      setCouponError('Invalid coupon code. Try FRESH100 or DESI50.');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
  };

  const finalTotal = Math.max(0, subtotal + deliveryCharge - discountAmount);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="p-4 bg-brand-navy-light flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-brand-green" />
          <h2 className="font-bold text-brand-navy">My Indian Basket</h2>
          <span className="bg-brand-orange text-white text-[11px] font-bold font-mono px-2 py-0.5 rounded-full">
            {items.reduce((sum, i) => sum + i.quantity, 0)} items
          </span>
        </div>

        {/* Pin Code Indicator */}
        <button
          type="button"
          id="cart-change-pin-btn"
          onClick={onOpenPinModal}
          className="flex items-center gap-1 text-[11px] font-bold text-brand-green hover:text-brand-green-dark bg-white shadow-xs px-2.5 py-1 rounded-md border border-brand-green/20"
        >
          📍 Pin code: {pincodeInfo.pincode}
          <RefreshCw className="w-3 h-3 ml-0.5 animate-spin-slow" />
        </button>
      </div>

      {/* Progress Bar for Free Shipping */}
      {subtotal > 0 && (
        <div className="p-4 bg-brand-green-light border-b border-brand-green/10 space-y-2">
          {isFreeDelivery ? (
            <div className="flex items-center gap-2 text-xs font-bold text-brand-green-dark">
              <Truck className="w-4 h-4" />
              <span>Congratulations! Your regional shipping is absolutely FREE! 🎉</span>
            </div>
          ) : (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-brand-navy">
                <span>Add <strong>₹{amountToFree}</strong> more for free regional delivery</span>
                <span className="font-mono font-bold">{Math.round(progressPercent)}%</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-brand-orange h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Item list */}
      <div className="flex-grow overflow-y-auto p-4 space-y-3.5 divide-y divide-gray-100">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
            <div className="w-16 h-16 bg-gray-50 flex items-center justify-center rounded-full text-gray-300">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div>
              <p className="text-gray-500 font-bold text-sm">Your basket is empty!</p>
              <p className="text-xs text-gray-400 mt-1">Select from our range of farm-fresh Indian items to fill your cart.</p>
            </div>
            <button
              id="empty-cart-back-btn" 
              onClick={onOpenPinModal}
              className="text-xs bg-brand-green text-white font-bold px-4 py-2 rounded-lg hover:bg-brand-green-dark"
            >
              Set PIN & Refresh Deals
            </button>
          </div>
        ) : (
          items.map((item, index) => (
            <div 
              key={item.product.id} 
              id={`cart-item-${item.product.id}`}
              className={`flex gap-3 pt-3.5 ${index === 0 ? 'pt-0' : ''}`}
            >
              <img 
                src={item.product.image} 
                alt={item.product.name}
                className="w-14 h-14 object-cover rounded-lg bg-slate-50 shrink-0 border border-slate-200"
              />
              
              <div className="flex-grow space-y-0.5 min-w-0">
                <div className="flex items-start justify-between gap-1">
                  <h4 className="font-bold text-xs text-gray-900 line-clamp-1">{item.product.name}</h4>
                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.product.id)}
                    className="text-gray-400 hover:text-rose-600 p-0.5 rounded-sm"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                
                {item.product.hindiName && (
                  <span className="text-[10px] text-gray-400 font-semibold block">{item.product.hindiName}</span>
                )}
                
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-gray-600 font-medium">{item.product.unit}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-400 font-mono">₹{item.product.price} x</span>
                    <span className="text-xs font-bold text-brand-navy font-mono">₹{item.product.price * item.quantity}</span>
                  </div>
                </div>

                {/* Micro Qty Picker */}
                <div className="flex items-center gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => onUpdateQty(item.product.id, item.quantity - 1)}
                    className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 text-xs font-bold"
                  >
                    -
                  </button>
                  <span className="w-6 text-center text-xs font-bold font-mono">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => onUpdateQty(item.product.id, item.quantity + 1)}
                    className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 text-xs font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Cart Summary Details */}
      {items.length > 0 && (
        <div className="p-4 bg-gray-50 border-t border-gray-200 space-y-4">
          
          {/* Coupon Code Section */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
              <Ticket className="w-3.5 h-3.5 text-brand-green" />
              <span>Apply Indian Promo Coupons</span>
            </div>
            
            {appliedCoupon ? (
              <div className="flex items-center justify-between bg-brand-green-light border border-brand-green/20 px-3 py-2 rounded-lg">
                <div className="text-xs text-brand-green-dark">
                  Code applied: <strong className="font-mono">{appliedCoupon}</strong> (-₹{discountAmount})
                </div>
                <button
                  type="button"
                  onClick={handleRemoveCoupon}
                  className="text-xs text-rose-600 hover:underline font-bold"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  id="coupon-code-input"
                  type="text"
                  placeholder="FRESH100 or DESI50"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="flex-grow px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-semibold uppercase tracking-wider text-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-green focus:border-brand-green"
                />
                <button
                  type="button"
                  id="coupon-apply-btn"
                  onClick={handleApplyCoupon}
                  className="bg-brand-navy hover:bg-brand-navy/90 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                >
                  Apply
                </button>
              </div>
            )}
            {couponError && <p className="text-[10px] text-rose-600 font-medium">{couponError}</p>}
            
            {!appliedCoupon && !couponError && (
              <p className="text-[10px] text-gray-400">
                💡 Promos: Type <strong className="font-mono text-gray-500">FRESH100</strong> (min order ₹499) or <strong className="font-mono text-gray-500">DESI50</strong> (min order ₹299).
              </p>
            )}
          </div>

          {/* Pricing detail items */}
          <div className="space-y-1.5 text-xs text-brand-navy border-t border-slate-200 pt-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Basket Subtotal:</span>
              <span className="font-mono font-semibold">₹{subtotal}</span>
            </div>
            
            {appliedCoupon && (
              <div className="flex justify-between text-brand-green">
                <span>Coupon Discount ({appliedCoupon}):</span>
                <span className="font-mono font-semibold">-₹{discountAmount}</span>
              </div>
            )}

            <div className="flex justify-between flex-wrap gap-1">
              <span className="text-gray-500">Regional Delivery ({pincodeInfo.city} Express):</span>
              <span className="font-mono font-semibold">
                {deliveryCharge === 0 ? <span className="text-brand-green font-bold">FREE</span> : `₹${deliveryCharge}`}
              </span>
            </div>

            <div className="flex justify-between text-sm font-bold text-brand-navy border-t border-dashed border-gray-300 pt-2.5">
              <span>Grand Total:</span>
              <span className="font-mono text-base text-brand-green">₹{finalTotal}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-brand-green-light/30 border border-brand-green/10 p-2 rounded-lg">
            <ShieldCheck className="w-4 h-4 text-brand-green shrink-0" />
            <span className="text-[10px] text-brand-green-dark">Indian Trusted Merchant. Secure checkout.</span>
          </div>

          {/* Checkout trigger */}
          <button
            type="button"
            id="proceed-checkout-btn"
            onClick={() => onCheckout(discountAmount, appliedCoupon || '')}
            className="w-full flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange-dark text-white py-3 rounded-lg text-xs font-bold shadow-md hover:shadow-lg transition-all"
          >
            <span>Proceed to checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
