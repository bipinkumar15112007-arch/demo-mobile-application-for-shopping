import React, { useState } from 'react';
import { Truck, MapPin, User, Phone, Milestone, CheckCircle2 } from 'lucide-react';
import { ShippingDetails, PinCodeInfo } from '../types';

interface ShippingDetailsFormProps {
  pincodeInfo: PinCodeInfo;
  onSubmit: (details: ShippingDetails) => void;
  onCancel: () => void;
  savedDetails?: ShippingDetails | null;
}

export default function ShippingDetailsForm({
  pincodeInfo,
  onSubmit,
  onCancel,
  savedDetails
}: ShippingDetailsFormProps) {
  const [fullName, setFullName] = useState(savedDetails?.fullName || '');
  const [phone, setPhone] = useState(savedDetails?.phone || '');
  const [addressLine1, setAddressLine1] = useState(savedDetails?.addressLine1 || '');
  const [addressLine2, setAddressLine2] = useState(savedDetails?.addressLine2 || '');
  const [landmark, setLandmark] = useState(savedDetails?.landmark || '');
  const [error, setError] = useState('');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }

    const cleanPhone = phone.replace(/\s+/g, '');
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setError('Please enter a valid 10-digit Indian Mobile phone number starting with 6-9 (e.g. 9830291032).');
      return;
    }

    if (addressLine1.trim().length < 8) {
      setError('Please specify a detailed address (street/flat number, min 8 characters).');
      return;
    }

    const details: ShippingDetails = {
      fullName: fullName.trim(),
      phone: cleanPhone,
      addressLine1: addressLine1.trim(),
      addressLine2: addressLine2.trim() || undefined,
      pincode: pincodeInfo.pincode,
      city: pincodeInfo.city,
      state: pincodeInfo.state,
      landmark: landmark.trim() || undefined
    };

    onSubmit(details);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      
      {/* Header banner */}
      <div className="p-5 bg-brand-green text-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Truck className="w-6 h-6 text-white" />
          <div>
            <h3 className="font-extrabold text-sm tracking-wide">Regional Delivery Details</h3>
            <p className="text-[11px] text-white/80">Delivering fresh products to {pincodeInfo.city}, {pincodeInfo.state}</p>
          </div>
        </div>

        <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-bold font-mono">
          PIN {pincodeInfo.pincode}
        </span>
      </div>

      <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
        
        {error && (
          <p className="text-xs text-rose-600 bg-rose-50 border border-rose-100 p-3 rounded-lg font-semibold">
            {error}
          </p>
        )}

        {/* Input fields */}
        <div className="space-y-3.5 text-xs text-brand-navy">
          <div>
            <label className="font-bold text-gray-500 block mb-1">Full Delivery Name</label>
            <div className="relative">
              <input
                id="shipping-fullname-input"
                type="text"
                placeholder="e.g. Ramesh Chandra"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 pl-9 border border-gray-300 rounded-lg text-xs font-bold focus:outline-none focus:ring-1 focus:ring-brand-green"
                required
              />
              <User className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="font-bold text-gray-500 block mb-1">Mobile Contact Phone Number (Indian standard)</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 font-bold font-mono text-gray-400 select-none">
                +91
              </span>
              <input
                id="shipping-phone-input"
                type="tel"
                placeholder="98765 43210"
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                className="w-full px-3 py-2 pl-12 border border-gray-300 rounded-lg text-xs font-bold font-mono tracking-wide focus:outline-none focus:ring-1 focus:ring-brand-green"
                required
              />
              <Phone className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 bg-slate-50/50 p-3 rounded-lg border border-slate-200 font-semibold text-[11px]">
            <div>
              <span className="text-gray-400 block mb-0.5">District / City</span>
              <span className="text-brand-navy font-bold">{pincodeInfo.city}</span>
            </div>
            <div>
              <span className="text-gray-400 block mb-0.5">State Zone</span>
              <span className="text-brand-navy font-bold">{pincodeInfo.state}</span>
            </div>
          </div>

          <div>
            <label className="font-bold text-gray-500 block mb-1">Address Line 1 (House No, Building, Area/Street)</label>
            <div className="relative">
              <input
                id="shipping-address1-input"
                type="text"
                placeholder="e.g. Flat 304, Green Meadows, 5th Cross Road"
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                className="w-full px-3 py-2 pl-9 border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand-green"
                required
              />
              <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="font-bold text-gray-400 block mb-1">Address Line 2 (Block, Colony Name, optional)</label>
            <input
              id="shipping-address2-input"
              type="text"
              placeholder="e.g. Koramangala Sector 4"
              value={addressLine2}
              onChange={(e) => setAddressLine2(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand-green"
            />
          </div>

          <div>
            <label className="font-bold text-gray-400 block mb-1">Famous Landmark (optional)</label>
            <div className="relative">
              <input
                id="shipping-landmark-input"
                type="text"
                placeholder="e.g. Opposite Metro Station, Near Shiv Mandir"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                className="w-full px-3 py-2 pl-9 border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand-green"
              />
              <Milestone className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex gap-2.5 pt-3 border-t border-slate-200">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 border border-gray-300 text-gray-600 hover:bg-gray-50 text-xs font-bold py-2.5 rounded-lg transition-all"
          >
            Go Back
          </button>
          
          <button
            type="submit"
            id="shipping-submit-btn"
            className="flex-1 bg-brand-green hover:bg-brand-green-dark text-white text-xs font-bold py-2.5 rounded-lg transition-all"
          >
            Confirm & Pay ✓
          </button>
        </div>

      </form>

    </div>
  );
}
