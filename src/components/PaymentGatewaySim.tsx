import React, { useState, useEffect } from 'react';
import { CreditCard, Wallet, Landmark, Truck, Shield, Smartphone, QrCode, ClipboardCheck, ArrowLeft, BellRing } from 'lucide-react';
import { PaymentMethod, ShippingDetails } from '../types';

interface PaymentGatewaySimProps {
  totalAmount: number;
  shippingAddress: ShippingDetails;
  onPaymentSuccess: (method: PaymentMethod, upiIdUsed?: string) => void;
  onCancel: () => void;
}

export default function PaymentGatewaySim({
  totalAmount,
  shippingAddress,
  onPaymentSuccess,
  onCancel
}: PaymentGatewaySimProps) {
  const [activeTab, setActiveTab] = useState<PaymentMethod>(PaymentMethod.UPI);
  const [loading, setLoading] = useState(false);
  const [successAnimation, setSuccessAnimation] = useState(false);
  
  // UPI parameters
  const [upiId, setUpiId] = useState('');
  const [upiError, setUpiError] = useState('');
  const [qrMode, setQrMode] = useState(false);
  const [qrCountdown, setQrCountdown] = useState(120);

  // Card parameters
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardError, setCardError] = useState('');
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [otpError, setOtpError] = useState('');

  // Netbanking parameters
  const [selectedBank, setSelectedBank] = useState('');
  
  // CoD parameters
  const [captchaCode, setCaptchaCode] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaError, setCaptchaError] = useState('');

  // Audio payment receipt soundbox
  const playSoundboxAlert = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      // Friendly, clean modern digital success chime
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';
      
      // Joyous dual-tone notification
      osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc1.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
      osc1.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
      osc1.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.3); // C6

      osc2.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc2.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
      osc2.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2);
      osc2.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.3);
      
      gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.65);
      
      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc1.start();
      osc2.start();
      
      osc1.stop(ctx.currentTime + 0.7);
      osc2.stop(ctx.currentTime + 0.7);
    } catch (e) {
      console.log('Unable to auto-play Soundbox chime:', e);
    }
  };

  // Generate CoD Captcha
  useEffect(() => {
    generateNewCaptcha();
  }, [activeTab]);

  const generateNewCaptcha = () => {
    const chars = '1234567890';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    setCaptchaCode(code);
    setCaptchaInput('');
    setCaptchaError('');
  };

  // UPI QR Countdown
  useEffect(() => {
    if (!qrMode) return;
    const interval = setInterval(() => {
      setQrCountdown((prev) => {
        if (prev <= 1) {
          generateNewCaptcha();
          return 120; // reset
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [qrMode]);

  const formatCountdown = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleUpiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUpiError('');
    const cleaned = upiId.trim();

    if (!cleaned) {
      setUpiError('Please enter your UPI Address VPA.');
      return;
    }

    if (!cleaned.includes('@')) {
      setUpiError('UPI Address is invalid. Must include custom provider (e.g. name@upi, contact@okaxis).');
      return;
    }

    triggerPaymentSequence(PaymentMethod.UPI, cleaned);
  };

  const triggerPaymentSequence = (method: PaymentMethod, meta?: string) => {
    setLoading(true);
    
    // Simulate payment authorization
    setTimeout(() => {
      setLoading(false);
      setSuccessAnimation(true);
      playSoundboxAlert();
      
      // Wait for success animation
      setTimeout(() => {
        onPaymentSuccess(method, meta);
      }, 1600);
    }, 1800);
  };

  const handleCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCardError('');

    if (cardNumber.replace(/\s+/g, '').length < 16) {
      setCardError('Please enter a valid 16-digit Card number.');
      return;
    }
    if (!cardHolder.trim()) {
      setCardError('Card holder name cannot be empty.');
      return;
    }
    if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
      setCardError('Expiry date must match MM/YY format.');
      return;
    }
    if (cardCvv.length < 3) {
      setCardError('Please enter a valid 3-digit CVV number.');
      return;
    }

    // Move to mock OTP verification
    setShowOtpScreen(true);
  };

  const handleOtpVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError('');
    if (otpValue !== '123456') {
      setOtpError('Incorrect OTP. Please enter the default test credential: 123456.');
      return;
    }

    triggerPaymentSequence(PaymentMethod.Card);
  };

  const handleNetbankingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBank) {
      alert('Please select a preferred bank to proceed with Netbanking.');
      return;
    }
    triggerPaymentSequence(PaymentMethod.Netbanking, `Bank: ${selectedBank}`);
  };

  const handleCodSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCaptchaError('');
    if (captchaInput !== captchaCode) {
      setCaptchaError('Captcha code does not match. Try again.');
      generateNewCaptcha();
      return;
    }

    triggerPaymentSequence(PaymentMethod.COD);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div 
        id="payment-gateway-wrapper"
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh] animate-in fade-in slide-in-from-bottom-8 duration-200"
      >
        
        {/* Success Screen */}
        {successAnimation && (
          <div className="flex-grow flex flex-col items-center justify-center p-8 space-y-6 text-center bg-white">
            <div className="w-20 h-20 bg-brand-green/10 rounded-full flex items-center justify-center text-brand-green scale-up animate-pulse">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="space-y-2">
              <div className="px-3 py-1.5 bg-brand-green-light rounded-full text-brand-green text-xs font-bold font-mono inline-flex items-center gap-1">
                <BellRing className="w-3.5 h-3.5 animate-bounce" />
                <span>SOUNDBOX CONFIRMED</span>
              </div>
              <h3 className="text-2xl font-extrabold text-brand-green">Payment Received Successfully!</h3>
              <p className="text-sm text-gray-500 font-medium">₹{totalAmount} credited safely to Fresh Market India</p>
            </div>
            
            <div className="text-[11px] text-gray-400 font-mono tracking-wider">
              UPI TRANS ID: TXN495830204928A
            </div>
          </div>
        )}

        {/* Regular Interactive Form screen */}
        {!successAnimation && (
          <>
            {/* Merchant info block */}
            <div className="bg-brand-navy text-white p-5 flex items-center justify-between border-b border-gray-700">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onCancel}
                  className="hover:bg-white/10 p-1.5 rounded-lg text-white transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-sm tracking-wide text-white">Fresh Market Bharat</h3>
                    <span className="bg-brand-green-light text-brand-green font-extrabold text-[9px] px-1.5 py-0.5 rounded-full uppercase tracking-wider scale-90">
                      Verified
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 font-medium">Deliver to PIN Code: {shippingAddress.pincode}</p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xs text-gray-400">Total Payable</p>
                <p className="text-xl font-bold font-mono text-brand-green-light">₹{totalAmount}</p>
              </div>
            </div>

            {/* Main Checkout Area */}
            <div className="grid grid-cols-1 md:grid-cols-3 flex-grow overflow-y-auto">
              {/* Sidebar Tabs */}
              <div className="bg-slate-50 border-r border-slate-200 p-2.5 space-y-1 md:col-span-1">
                
                <button
                  type="button"
                  id="tab-pay-upi"
                  onClick={() => { setActiveTab(PaymentMethod.UPI); setShowOtpScreen(false); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-3 rounded-lg text-xs font-bold transition-all text-left ${
                    activeTab === PaymentMethod.UPI
                      ? 'bg-brand-green text-white shadow-xs'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>UPI Apps / QR</span>
                </button>

                <button
                  type="button"
                  id="tab-pay-card"
                  onClick={() => { setActiveTab(PaymentMethod.Card); setShowOtpScreen(false); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-3 rounded-lg text-xs font-bold transition-all text-left ${
                    activeTab === PaymentMethod.Card
                      ? 'bg-brand-green text-white shadow-xs'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>RuPay / Card</span>
                </button>

                <button
                  type="button"
                  id="tab-pay-netbank"
                  onClick={() => { setActiveTab(PaymentMethod.Netbanking); setShowOtpScreen(false); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-3 rounded-lg text-xs font-bold transition-all text-left ${
                    activeTab === PaymentMethod.Netbanking
                      ? 'bg-brand-green text-white shadow-xs'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Landmark className="w-4 h-4" />
                  <span>Netbanking</span>
                </button>

                <button
                  type="button"
                  id="tab-pay-cod"
                  onClick={() => { setActiveTab(PaymentMethod.COD); setShowOtpScreen(false); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-3 rounded-lg text-xs font-bold transition-all text-left ${
                    activeTab === PaymentMethod.COD
                      ? 'bg-brand-green text-white shadow-xs'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Truck className="w-4 h-4" />
                  <span>Cash on Delivery</span>
                </button>

              </div>

              {/* Main Tab Panel */}
              <div className="p-6 md:col-span-2 space-y-4">
                {loading ? (
                  <div className="h-48 flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="w-10 h-10 border-4 border-brand-green border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-xs text-gray-500 font-bold">Authorizing secure Indian banking portal...</p>
                  </div>
                ) : (
                  <>
                    {/* UPI APP CHANNEL */}
                    {activeTab === PaymentMethod.UPI && (
                      <div className="space-y-4">
                        {!qrMode ? (
                          <form onSubmit={handleUpiSubmit} className="space-y-4">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Pay via UPI App Address</h4>
                            
                            <div className="space-y-2">
                              <label className="text-xs font-semibold text-gray-500">Enter UPI ID (VPA)</label>
                              <div className="relative">
                                <input
                                  id="vpa-address-input"
                                  type="text"
                                  placeholder="e.g. mobileNumber@upi, name@okhdfcbank"
                                  value={upiId}
                                  onChange={(e) => setUpiId(e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-semibold font-mono tracking-wide focus:outline-none focus:ring-1 focus:ring-brand-green"
                                  required
                                />
                              </div>
                              {upiError && <p className="text-[10px] text-rose-600 font-semibold">{upiError}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <button
                                type="button"
                                onClick={() => setUpiId('bkk15112007@okhdfcbank')}
                                className="px-2 py-1.5 text-[10px] bg-gray-55 hover:bg-gray-100 border border-gray-200 rounded-md font-mono text-gray-600 text-left truncate"
                              >
                                bkk15112007@okhdfcbank
                              </button>
                              <button
                                type="button"
                                onClick={() => setUpiId('9876543210@paytm')}
                                className="px-2 py-1.5 text-[10px] bg-gray-55 hover:bg-gray-100 border border-gray-200 rounded-md font-mono text-gray-600 text-left truncate"
                              >
                                9876543210@paytm
                              </button>
                            </div>

                            {/* CTAs */}
                            <div className="pt-2 flex gap-3">
                              <button
                                type="submit"
                                id="pay-vpa-submit-btn"
                                className="flex-grow bg-brand-orange hover:bg-brand-orange-dark text-white text-xs font-bold py-2.5 rounded-lg text-center"
                              >
                                Pay Securely ₹{totalAmount}
                              </button>

                              <button
                                type="button"
                                id="pay-qr-switch-btn"
                                onClick={() => setQrMode(true)}
                                className="px-3.5 bg-brand-green/10 hover:bg-brand-green/20 text-brand-green rounded-lg flex items-center justify-center border border-brand-green/20"
                                title="Show Bharat QR"
                              >
                                <QrCode className="w-5 h-5" />
                              </button>
                            </div>
                          </form>
                        ) : (
                          <div className="text-center space-y-4">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Scan BHIM UPI QR Code</h4>
                            
                            {/* Graphic simulated QR code */}
                            <div className="inline-block p-4 bg-white border border-gray-200 rounded-xl shadow-inner">
                              <div className="w-36 h-36 bg-gray-100 flex flex-col items-center justify-center p-2 rounded border border-dashed border-brand-green relative group">
                                <QrCode className="w-28 h-28 text-brand-navy" />
                                <div className="absolute inset-x-2 bottom-2 bg-brand-green text-[9px] text-white font-mono font-bold tracking-widest uppercase rounded py-0.5">
                                  BHIM SECURE
                                </div>
                              </div>
                            </div>

                            <p className="text-[11px] text-gray-500 font-medium">
                              Expiry countdown: <span className="font-mono text-brand-orange font-bold">{formatCountdown(qrCountdown)}</span>
                            </p>

                            <div className="flex flex-col gap-2">
                              <button
                                type="button"
                                id="simulate-qr-success-btn"
                                onClick={() => triggerPaymentSequence(PaymentMethod.UPI, 'BHIM QR SafeScan')}
                                className="w-full bg-brand-green hover:bg-brand-green-dark text-white text-xs font-bold py-2 rounded-lg py-2.5 transition-all outline-none"
                              >
                                Simulate QR Scan Success ✓
                              </button>
                              
                              <button
                                type="button"
                                onClick={() => setQrMode(false)}
                                className="text-xs text-gray-400 hover:text-gray-600 hover:underline font-bold"
                              >
                                Go Back to VPA Address
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* CREDIT / DEBIT CARDS */}
                    {activeTab === PaymentMethod.Card && (
                      <div className="space-y-4">
                        {!showOtpScreen ? (
                          <form onSubmit={handleCardSubmit} className="space-y-3">
                            <div className="flex items-center justify-between">
                              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Indian Card Options</h4>
                              <div className="flex gap-1">
                                <span className="bg-brand-green-light text-brand-green text-[9px] font-bold font-mono border border-brand-green/10 px-1.5 py-0.5 rounded">RUPAY SUPPORTED</span>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <div>
                                <label className="text-[11px] font-semibold text-gray-500 block mb-1">16-Digit Card Number</label>
                                <input
                                  type="text"
                                  maxLength={19}
                                  placeholder="4321 8765 2468 1357"
                                  value={cardNumber}
                                  onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '').match(/.{1,4}/g)?.join(' ') || '';
                                    setCardNumber(val);
                                  }}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-semibold font-mono tracking-widest focus:outline-none focus:ring-1 focus:ring-brand-green"
                                  required
                                />
                              </div>

                              <div>
                                <label className="text-[11px] font-semibold text-gray-500 block mb-1">Card Holder Name</label>
                                <input
                                  type="text"
                                  placeholder="e.g. BKK CHAKRABORTY"
                                  value={cardHolder}
                                  onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-bold tracking-wide focus:outline-none focus:ring-1 focus:ring-brand-green"
                                  required
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="text-[11px] font-semibold text-gray-500 block mb-1">Expiry (MM/YY)</label>
                                  <input
                                    type="text"
                                    placeholder="11/29"
                                    maxLength={5}
                                    value={cardExpiry}
                                    onChange={(e) => {
                                      let val = e.target.value.replace(/\D/g, '');
                                      if (val.length > 2) {
                                        val = val.substring(0, 2) + '/' + val.substring(2, 4);
                                      }
                                      setCardExpiry(val);
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-semibold font-mono text-center focus:outline-none focus:ring-1 focus:ring-brand-green"
                                    required
                                  />
                                </div>
                                <div>
                                  <label className="text-[11px] font-semibold text-gray-500 block mb-1">CVV / Security Code</label>
                                  <input
                                    type="password"
                                    placeholder="•••"
                                    maxLength={3}
                                    value={cardCvv}
                                    onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-semibold font-mono text-center focus:outline-none focus:ring-1 focus:ring-brand-green"
                                    required
                                  />
                                </div>
                              </div>
                            </div>

                            {cardError && <p className="text-[10px] text-rose-600 font-semibold">{cardError}</p>}

                            <button
                              type="submit"
                              id="card-details-submit-btn"
                              className="w-full bg-brand-orange hover:bg-brand-orange-dark text-white text-xs font-bold py-2.5 rounded-lg text-center mt-3"
                            >
                              Get Security OTP ✓
                            </button>
                          </form>
                        ) : (
                          <form onSubmit={handleOtpVerify} className="space-y-4">
                            <div className="bg-brand-green-light/50 border border-brand-green/20 p-3.5 rounded-xl text-xs space-y-1 text-center">
                              <p className="font-bold text-brand-green-dark">One-Time Password (OTP) Sent!</p>
                              <p className="text-gray-500">We simulated sending an SMS to your verified phone number.</p>
                              <p className="text-[10px] text-gray-400 font-mono mt-1">Please type standard test code: <strong className="font-extrabold text-brand-green-dark text-sm">123456</strong></p>
                            </div>

                            <div className="space-y-2">
                              <label className="text-[11px] font-bold text-gray-500 block text-center">Enter 6-Digit OTP</label>
                              <input
                                type="text"
                                maxLength={6}
                                placeholder="123456"
                                value={otpValue}
                                onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ''))}
                                className="w-40 mx-auto block px-3 py-2 border-2 border-brand-green rounded-lg text-base text-center font-bold font-mono tracking-widest text-brand-navy focus:outline-none"
                                required
                              />
                            </div>

                            {otpError && <p className="text-[10px] text-rose-600 font-semibold text-center">{otpError}</p>}

                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => setShowOtpScreen(false)}
                                className="flex-1 border border-gray-300 text-gray-600 hover:bg-gray-50 text-xs font-bold py-2 rounded-lg"
                              >
                                Edit Card
                              </button>
                              <button
                                type="submit"
                                id="otp-verify-submit-btn"
                                className="flex-1 bg-brand-green hover:bg-brand-green-dark text-white text-xs font-bold py-2 rounded-lg"
                              >
                                Submit OTP & Pay
                              </button>
                            </div>
                          </form>
                        )}
                      </div>
                    )}

                    {/* NETBANKING CHANNELS */}
                    {activeTab === PaymentMethod.Netbanking && (
                      <form onSubmit={handleNetbankingSubmit} className="space-y-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Popular Indian Netbanking Portals</h4>
                        
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { name: 'HDFC Bank', code: 'HDFC' },
                            { name: 'State Bank of India', code: 'SBI' },
                            { name: 'ICICI Bank', code: 'ICICI' },
                            { name: 'Axis Bank', code: 'AXIS' },
                            { name: 'Kotak Mahindra', code: 'KOTAK' },
                            { name: 'IndusInd Bank', code: 'INDUSIND' }
                          ].map((b) => (
                            <button
                              key={b.code}
                              type="button"
                              onClick={() => setSelectedBank(b.name)}
                              className={`px-3 py-2.5 rounded-lg border text-xs font-semibold text-left transition-all ${
                                selectedBank === b.name
                                  ? 'border-brand-green bg-brand-green-light text-brand-green-dark font-extrabold shadow-xs'
                                  : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                              }`}
                            >
                              🏛️ {b.name}
                            </button>
                          ))}
                        </div>

                        {selectedBank && (
                          <div className="p-3 bg-gray-55 rounded-lg text-[11px] text-gray-500 font-medium">
                            Proceeding will securely redirect to the simulated <strong className="text-brand-navy">{selectedBank}</strong> authorization screen where you can confirm the amount.
                          </div>
                        )}

                        <button
                          type="submit"
                          id="netbanking-submit-btn"
                          className="w-full bg-brand-orange hover:bg-brand-orange-dark text-white text-xs font-bold py-2.5 rounded-lg text-center"
                        >
                          Proceed via {selectedBank || 'Bank'} ✓
                        </button>
                      </form>
                    )}

                    {/* CASH ON DELIVERY (COD) */}
                    {activeTab === PaymentMethod.COD && (
                      <form onSubmit={handleCodSubmit} className="space-y-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Secure Cash on Delivery</h4>

                        <div className="bg-brand-orange-light border border-brand-orange/20 p-3.5 rounded-xl space-y-1">
                          <p className="text-xs font-bold text-brand-orange-dark">🇮🇳 Delivering Locally in India</p>
                          <p className="text-xs text-gray-600 font-medium">
                            A local delivery companion will collect Cash or accept local UPI scans at your doorstep in {shippingAddress.city}, {shippingAddress.pincode} during delivery.
                          </p>
                        </div>

                        {/* Simple Anti-spam captcha */}
                        <div className="space-y-2 pt-1">
                          <div className="flex items-center justify-between">
                            <label className="text-[11px] font-bold text-gray-500">Security Captcha Verification</label>
                            <button
                              type="button"
                              onClick={generateNewCaptcha}
                              className="text-[10px] text-brand-green hover:underline font-bold"
                            >
                              Regenerate Code
                            </button>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="bg-brand-navy text-white font-mono font-extrabold text-base tracking-widest px-4 py-2 rounded-lg select-none line-through decoration-brand-orange decoration-2">
                              {captchaCode}
                            </span>
                            
                            <input
                              type="text"
                              maxLength={4}
                              placeholder="Enter Code"
                              value={captchaInput}
                              onChange={(e) => setCaptchaInput(e.target.value.replace(/\D/g, ''))}
                              className="flex-grow px-3 py-2 border border-gray-300 rounded-lg text-sm text-center font-bold tracking-widest focus:outline-none focus:ring-1 focus:ring-brand-green"
                              required
                            />
                          </div>
                          {captchaError && <p className="text-[10px] text-rose-600 font-semibold">{captchaError}</p>}
                        </div>

                        <button
                          type="submit"
                          id="cod-confirm-btn"
                          className="w-full bg-brand-green hover:bg-brand-green-dark text-white text-xs font-bold py-2.5 rounded-lg text-center mt-2"
                        >
                          Confirm Cash On Delivery Order ✓
                        </button>
                      </form>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Shield Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-gray-400">
              <span className="flex items-center gap-1.5 font-medium">
                <Shield className="w-3.5 h-3.5 text-brand-green shrink-0" />
                <span>PCI-DSS Secured 128-Bit Encryption Gateway</span>
              </span>
              <span className="font-mono text-gray-400">Merchant Reference: FMI-9402</span>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
