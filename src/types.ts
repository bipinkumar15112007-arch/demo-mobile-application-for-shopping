export interface Product {
  id: string;
  name: string;
  hindiName?: string;
  category: string;
  price: number; // in INR
  originalPrice?: number; // for discounts
  unit: string; // e.g., "1 kg", "200 g", "1 pc"
  image: string; // Unsplash url
  isOrganic?: boolean;
  isPopular?: boolean;
  description: string;
  regionalOrigin?: string; // e.g., "Ratnagiri, Maharashtra"
  inStock: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface PinCodeInfo {
  pincode: string;
  city: string;
  state: string;
  deliveryDays: number;
  deliveryCharge: number;
  freeDeliveryMin: number;
  region: 'North' | 'South' | 'East' | 'West' | 'Central';
}

export interface ShippingDetails {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  pincode: string;
  city: string;
  state: string;
  landmark?: string;
}

export enum PaymentMethod {
  UPI = 'UPI',
  Card = 'CARD',
  Netbanking = 'NETBANKING',
  COD = 'COD'
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  shippingCharge: number;
  discount: number;
  total: number;
  shippingAddress: ShippingDetails;
  paymentMethod: PaymentMethod;
  upiId?: string;
  paymentStatus: 'Pending' | 'Success' | 'Failed';
  orderStatus: 'Placed' | 'Processing' | 'Out for Delivery' | 'Delivered';
  createdAt: string;
  pincode: string;
}
