import React, { useState, useEffect } from 'react';
import { CheckCircle2, Package, Truck, Smile, PhoneCall, RefreshCw, ShoppingBasket, MapPin } from 'lucide-react';
import { Order } from '../types';

interface OrderTrackerProps {
  order: Order;
  onClose: () => void;
  onSimulateStateChange: (orderId: string, nextStatus: 'Placed' | 'Processing' | 'Out for Delivery' | 'Delivered') => void;
}

export default function OrderTracker({
  order,
  onClose,
  onSimulateStateChange
}: OrderTrackerProps) {
  const [etaDetails, setEtaDetails] = useState('');
  
  // Stages list
  const stages: { label: string; description: string; enumVal: 'Placed' | 'Processing' | 'Out for Delivery' | 'Delivered'; icon: any }[] = [
    {
      label: 'Order Confirmed',
      description: 'Accepted by Fresh Market hub partners.',
      enumVal: 'Placed',
      icon: CheckCircle2
    },
    {
      label: 'Meticulously Packed',
      description: 'Hand-picked from cold chains and sanitarily boxed.',
      enumVal: 'Processing',
      icon: Package
    },
    {
      label: 'Out for Local Dispatch',
      description: 'Assigned to regional delivery teammate.',
      enumVal: 'Out for Delivery',
      icon: Truck
    },
    {
      label: 'Handed Over',
      description: 'Successfully reached address of destination.',
      enumVal: 'Delivered',
      icon: Smile
    }
  ];

  const currentStageIndex = stages.findIndex(s => s.enumVal === order.orderStatus);

  useEffect(() => {
    // Generate realistic relative ETAs
    if (order.orderStatus === 'Placed') {
      setEtaDetails('Awaiting dispatch checklist (approx 15 mins)');
    } else if (order.orderStatus === 'Processing') {
      setEtaDetails('Packing high-freshness items nicely in thermal boxes');
    } else if (order.orderStatus === 'Out for Delivery') {
      setEtaDetails('Arriving at your doorstep in approx 25 mins');
    } else {
      setEtaDetails('Delivered and verified safely!');
    }
  }, [order.orderStatus]);

  const triggerNextStageSimulation = () => {
    if (order.orderStatus === 'Placed') {
      onSimulateStateChange(order.id, 'Processing');
    } else if (order.orderStatus === 'Processing') {
      onSimulateStateChange(order.id, 'Out for Delivery');
    } else if (order.orderStatus === 'Out for Delivery') {
      onSimulateStateChange(order.id, 'Delivered');
    } else {
      onSimulateStateChange(order.id, 'Placed'); // Reset cycle for easy review
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col p-6 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-brand-green-light/40 border border-brand-green/10 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-brand-green rounded-full animate-ping" />
            <span className="text-xs font-extrabold text-brand-green-dark tracking-widest uppercase">Live Tracking Active</span>
          </div>
          <h2 className="text-lg font-bold text-brand-navy">Order ID: <span className="font-mono text-brand-green">{order.id}</span></h2>
          <p className="text-xs text-gray-400 font-semibold">Placed at: {new Date(order.createdAt).toLocaleTimeString()}</p>
        </div>

        <div className="text-right">
          <span className="text-xs text-gray-500 font-semibold block">Estimated Delivery Speed</span>
          <span className="text-base font-extrabold text-brand-navy block">
            {order.orderStatus === 'Delivered' ? 'Completed' : 'Today (Same-Day Delivery)'}
          </span>
          <span className="text-[11px] text-brand-green-dark font-medium">{etaDetails}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Side: Order list and recipient details */}
        <div className="md:col-span-1 space-y-5">
          <div className="bg-gray-55 p-4 rounded-xl border border-gray-100 space-y-3">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <ShoppingBasket className="w-4 h-4 text-brand-green" />
              <span>Basket Content</span>
            </h4>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {order.items.map((item) => (
                <div key={item.product.id} className="flex justify-between items-center text-xs">
                  <div className="font-medium text-brand-navy truncate max-w-[140px]">
                    {item.product.name}
                  </div>
                  <div className="font-mono font-semibold text-gray-500">
                    {item.quantity} x ₹{item.product.price}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-dashed border-gray-200 text-xs space-y-1 text-gray-500">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-mono font-semibold text-brand-navy">₹{order.subtotal}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-brand-green font-semibold">
                  <span>Discount:</span>
                  <span className="font-mono">-₹{order.discount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery:</span>
                <span className="font-mono font-semibold text-brand-navy">
                  {order.shippingCharge === 0 ? 'FREE' : `₹${order.shippingCharge}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-brand-navy pt-1.5 border-t border-gray-200">
                <span>Total Paid:</span>
                <span className="font-mono text-brand-green">₹{order.total}</span>
              </div>
            </div>
          </div>

          {/* Delivery Teammate block */}
          {order.orderStatus !== 'Placed' && order.orderStatus !== 'Delivered' && (
            <div className="bg-brand-green-light/20 border border-brand-green/20 p-4 rounded-xl flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-green/10 rounded-full flex items-center justify-center text-brand-green shrink-0 font-bold">
                RK
              </div>
              <div className="text-xs min-w-0">
                <p className="font-bold text-brand-navy">Ramesh Kumar</p>
                <p className="text-gray-500 truncate mb-1">Your assigned local delivery companion</p>
                <a 
                  href="tel:+919876543210" 
                  className="inline-flex items-center gap-1 text-[11px] font-extrabold text-brand-green hover:underline"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call companion (+91 98765 43210)</span>
                </a>
              </div>
            </div>
          )}

          {/* Recipient details block */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-xs space-y-2">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-brand-green" />
              <span>Shipping Address</span>
            </h4>
            <div className="text-gray-600 font-medium space-y-0.5">
              <p className="font-bold text-brand-navy">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.addressLine1}</p>
              {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} - <strong className="font-mono font-bold">{order.shippingAddress.pincode}</strong></p>
              {order.shippingAddress.landmark && <p className="text-gray-400 italic">Landmark: {order.shippingAddress.landmark}</p>}
              <p className="pt-2 text-brand-navy">📱 Contact: {order.shippingAddress.phone}</p>
            </div>
          </div>

        </div>

        {/* Right Side: Visual Timeline stages */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 flex flex-col relative">
            <h3 className="text-sm font-bold text-brand-navy mb-4">Milestones & Status Timeline</h3>

            {/* Simulated stepper tracking */}
            <div className="relative pl-6 space-y-8 border-l-2 border-gray-200">
              {stages.map((stage, idx) => {
                const isPassed = currentStageIndex >= idx;
                const isActive = currentStageIndex === idx;
                const IconComp = stage.icon;

                return (
                  <div key={stage.label} className="relative">
                    {/* Node Dot Icon */}
                    <div className={`absolute -left-[35px] top-1 w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all ${
                      isPassed 
                        ? 'bg-brand-green border-brand-green text-white shadow-sm' 
                        : 'bg-white border-gray-300 text-gray-400'
                    }`}>
                      <IconComp className="w-3.5 h-3.5" />
                    </div>

                    {/* Meta info */}
                    <div className="space-y-0.5">
                      <span className={`text-xs font-bold block ${
                        isActive 
                          ? 'text-brand-green text-sm' 
                          : isPassed 
                            ? 'text-brand-navy' 
                            : 'text-gray-400'
                      }`}>
                        {stage.label} {isActive && <span className="bg-brand-green-light text-brand-green text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ml-1.5 uppercase select-none">Active</span>}
                      </span>
                      <p className="text-xs text-gray-500">{stage.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Simulation Tools for verification / playground feel */}
          <div className="bg-rose-50/50 p-4 rounded-xl border border-rose-100/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs space-y-1 self-start sm:self-center">
              <span className="font-bold text-rose-800 block">🔬 Interactive Inspector Teammates</span>
              <p className="text-gray-500">Simulate order updates over cellular channels, progressing through high-precision supermarket delivery stages.</p>
            </div>

            <button
              type="button"
              id="simulate-next-stage-btn"
              onClick={triggerNextStageSimulation}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm shrink-0 uppercase tracking-wider"
            >
              <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
              <span>Simulate Next Stage ✓</span>
            </button>
          </div>

          {/* Action button */}
          <button
            type="button"
            id="close-order-tracker-btn"
            onClick={onClose}
            className="w-full bg-brand-navy hover:bg-brand-navy-dark text-white text-xs font-bold py-3 rounded-lg text-center shadow-sm"
          >
            Go Back & Cook More Dishes
          </button>

        </div>

      </div>

    </div>
  );
}
