import React, { useState } from 'react';
import { MapPin, Search, CheckCircle, AlertTriangle, Sparkles } from 'lucide-react';
import { PINCODES } from '../data';
import { PinCodeInfo } from '../types';

interface PINCheckModalProps {
  currentPin: string;
  onSelectPin: (info: PinCodeInfo) => void;
  onClose: () => void;
  canDismiss?: boolean;
}

export default function PINCheckModal({
  currentPin,
  onSelectPin,
  onClose,
  canDismiss = true
}: PINCheckModalProps) {
  const [pinInput, setPinInput] = useState('');
  const [error, setError] = useState('');
  const [successInfo, setSuccessInfo] = useState<PinCodeInfo | null>(
    currentPin && PINCODES[currentPin] ? PINCODES[currentPin] : null
  );

  const handleVerify = (pincodeStr: string) => {
    const cleaned = pincodeStr.replace(/\s+/g, '');
    
    if (!/^\d{6}$/.test(cleaned)) {
      setError('Please enter a valid 6-digit Indian PIN Code (e.g., 400001).');
      setSuccessInfo(null);
      return;
    }

    setError('');
    
    // Check if we have exact data, otherwise generate plausible regional info based on Indian zip prefix
    if (PINCODES[cleaned]) {
      const info = PINCODES[cleaned];
      setSuccessInfo(info);
      onSelectPin(info);
    } else {
      // Plausible generation based on zone
      const firstDigit = cleaned[0];
      let city = 'Regional India';
      let state = 'India';
      let region: 'North' | 'South' | 'East' | 'West' | 'Central' = 'Central';
      let days = 2;
      let charge = 45;

      switch (firstDigit) {
        case '1':
          city = 'Northern Region';
          state = 'NCR / Punjab / Haryana';
          region = 'North';
          days = 2;
          charge = 40;
          break;
        case '2':
          city = 'Uttar Pradesh Region';
          state = 'Uttar Pradesh / Uttarakhand';
          region = 'North';
          days = 3;
          charge = 45;
          break;
        case '3':
          city = 'Rajasthan & Gujarat Zone';
          state = 'Rajastan / Gujarat';
          region = 'West';
          days = 2;
          charge = 40;
          break;
        case '4':
          city = 'Western Region';
          state = 'Maharashtra / M.P. / Chhattisgarh';
          region = 'West';
          days = 2;
          charge = 30;
          break;
        case '5':
          city = 'Deccan Hub';
          state = 'Andhra Pradesh / Telangana / Karnataka';
          region = 'South';
          days = 2;
          charge = 35;
          break;
        case '6':
          city = 'Southern Peninsula';
          state = 'Tamil Nadu / Kerala';
          region = 'South';
          days = 3;
          charge = 45;
          break;
        case '7':
          city = 'Eastern Subcontinent';
          state = 'West Bengal / Odisha / NE States';
          region = 'East';
          days = 3;
          charge = 50;
          break;
        case '8':
          city = 'Bihar & Jharkhand Hub';
          state = 'Bihar / Jharkhand';
          region = 'Central';
          days = 3;
          charge = 45;
          break;
        default:
          break;
      }

      const generatedInfo: PinCodeInfo = {
        pincode: cleaned,
        city,
        state,
        deliveryDays: days,
        deliveryCharge: charge,
        freeDeliveryMin: 499,
        region
      };

      setSuccessInfo(generatedInfo);
      onSelectPin(generatedInfo);
    }
  };

  const handleQuickSelect = (pin: string) => {
    setPinInput(pin);
    handleVerify(pin);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div 
        id="pin-modal-container"
        className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="p-6 bg-brand-green text-white relative">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Check Delivery Availability</h2>
              <p className="text-xs text-white/80">Delivering fresh products directly to your doorstep</p>
            </div>
          </div>
          
          {canDismiss && (
            <button 
              id="close-pin-modal-btn"
              onClick={onClose}
              className="absolute top-4 right-4 text-white/80 hover:text-white text-sm font-semibold px-2 py-1 bg-white/10 hover:bg-white/20 rounded-md transition-colors"
            >
              ✕
            </button>
          )}
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5">
          <p className="text-xs text-brand-navy font-medium">
            Enter your 6-digit Indian PIN Code to calculate shipping fees, delivery speed, and minimum order values for your customized basket.
          </p>

          <div className="relative">
            <input
              id="pincode-input-field"
              type="text"
              pattern="[0-9]*"
              maxLength={6}
              placeholder="e.g., 400001 (Mumbai)"
              value={pinInput}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '');
                setPinInput(val);
                if (val.length === 6) {
                  handleVerify(val);
                }
              }}
              className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green text-base font-mono font-semibold tracking-widest text-brand-navy"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
            <button
              id="pincode-submit-btn"
              onClick={() => handleVerify(pinInput)}
              className="absolute right-2 top-2 bg-brand-green hover:bg-brand-green-dark text-white px-4 py-1.5 rounded-md text-xs font-semibold transition-colors"
            >
              Verify
            </button>
          </div>

          {error && (
            <div className="flex items-start gap-2 text-xs text-rose-600 bg-rose-50 p-3 rounded-lg border border-rose-100">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successInfo && !error && (
            <div className="flex items-start gap-3 bg-brand-green-light/50 p-4 rounded-lg border border-brand-green/20">
              <CheckCircle className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
              <div className="text-xs space-y-1 text-brand-navy">
                <span className="font-bold text-sm block text-brand-green-dark">
                  Deliverable to {successInfo.city}, {successInfo.state}!
                </span>
                <p>⚡ Delivery Speed: <strong className="text-brand-green-dark">{successInfo.deliveryDays === 1 ? 'Same Day (Within 12 Hours)' : `${successInfo.deliveryDays} Days`}</strong></p>
                <p>🚚 Shipping Fee: <strong className="text-brand-navy">₹{successInfo.deliveryCharge}</strong> (Free above ₹{successInfo.freeDeliveryMin})</p>
                <p className="text-[10px] text-gray-500 italic mt-1">Zone: {successInfo.region} India Hub</p>
              </div>
            </div>
          )}

          {/* Quick Hub Pins */}
          <div>
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block mb-2">Major Tech & Metro Hubs</span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                id="quick-pin-mumbai"
                onClick={() => handleQuickSelect('400001')}
                className="px-2.5 py-1.5 text-xs bg-brand-navy-light text-brand-navy hover:bg-brand-green hover:text-white rounded-md text-center font-medium transition-all"
              >
                Mumbai
              </button>
              <button
                type="button"
                id="quick-pin-bengaluru"
                onClick={() => handleQuickSelect('560001')}
                className="px-2.5 py-1.5 text-xs bg-brand-navy-light text-brand-navy hover:bg-brand-green hover:text-white rounded-md text-center font-medium transition-all"
              >
                Bengaluru
              </button>
              <button
                type="button"
                id="quick-pin-delhi"
                onClick={() => handleQuickSelect('110001')}
                className="px-2.5 py-1.5 text-xs bg-brand-navy-light text-brand-navy hover:bg-brand-green hover:text-white rounded-md text-center font-medium transition-all"
              >
                New Delhi
              </button>
              <button
                type="button"
                id="quick-pin-pune"
                onClick={() => handleQuickSelect('411001')}
                className="px-2.5 py-1.5 text-xs bg-brand-navy-light text-brand-navy hover:bg-brand-green hover:text-white rounded-md text-center font-medium transition-all"
              >
                Pune
              </button>
              <button
                type="button"
                id="quick-pin-hyderabad"
                onClick={() => handleQuickSelect('500001')}
                className="px-2.5 py-1.5 text-xs bg-brand-navy-light text-brand-navy hover:bg-brand-green hover:text-white rounded-md text-center font-medium transition-all"
              >
                Hyderabad
              </button>
              <button
                type="button"
                id="quick-pin-kolkata"
                onClick={() => handleQuickSelect('700001')}
                className="px-2.5 py-1.5 text-xs bg-brand-navy-light text-brand-navy hover:bg-brand-green hover:text-white rounded-md text-center font-medium transition-all"
              >
                Kolkata
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-brand-green text-xs font-semibold">
            <Sparkles className="w-4 h-4 animation-pulse" />
            <span>Pure Regional Freshness</span>
          </div>
          
          <button
            id="modal-confirm-continue"
            disabled={!successInfo}
            onClick={onClose}
            className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${
              successInfo 
                ? 'bg-brand-green hover:bg-brand-green-dark text-white shadow-xs cursor-pointer' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Confirm & Shop
          </button>
        </div>
      </div>
    </div>
  );
}
