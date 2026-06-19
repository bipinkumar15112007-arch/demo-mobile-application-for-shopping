import { Product, PinCodeInfo } from './types';

export const PINCODES: Record<string, PinCodeInfo> = {
  '400001': {
    pincode: '400001',
    city: 'Mumbai',
    state: 'Maharashtra',
    deliveryDays: 1, // Same day / Superfast
    deliveryCharge: 30,
    freeDeliveryMin: 499,
    region: 'West'
  },
  '110001': {
    pincode: '110001',
    city: 'New Delhi',
    state: 'Delhi',
    deliveryDays: 1,
    deliveryCharge: 35,
    freeDeliveryMin: 499,
    region: 'North'
  },
  '560001': {
    pincode: '560001',
    city: 'Bengaluru',
    state: 'Karnataka',
    deliveryDays: 1,
    deliveryCharge: 30,
    freeDeliveryMin: 399,
    region: 'South'
  },
  '600001': {
    pincode: '600001',
    city: 'Chennai',
    state: 'Tamil Nadu',
    deliveryDays: 2,
    deliveryCharge: 40,
    freeDeliveryMin: 499,
    region: 'South'
  },
  '700001': {
    pincode: '700001',
    city: 'Kolkata',
    state: 'West Bengal',
    deliveryDays: 2,
    deliveryCharge: 45,
    freeDeliveryMin: 599,
    region: 'East'
  },
  '500001': {
    pincode: '500001',
    city: 'Hyderabad',
    state: 'Telangana',
    deliveryDays: 1,
    deliveryCharge: 30,
    freeDeliveryMin: 449,
    region: 'South'
  },
  '411001': {
    pincode: '411001',
    city: 'Pune',
    state: 'Maharashtra',
    deliveryDays: 1,
    deliveryCharge: 30,
    freeDeliveryMin: 399,
    region: 'West'
  },
  '302001': {
    pincode: '302001',
    city: 'Jaipur',
    state: 'Rajasthan',
    deliveryDays: 2,
    deliveryCharge: 40,
    freeDeliveryMin: 499,
    region: 'North'
  },
  '380001': {
    pincode: '380001',
    city: 'Ahmedabad',
    state: 'Gujarat',
    deliveryDays: 2,
    deliveryCharge: 35,
    freeDeliveryMin: 499,
    region: 'West'
  }
};

export const PRODUCTS: Product[] = [
  // Fruits & Vegetables
  {
    id: 'fv-1',
    name: 'Alphonso Mangoes (Hapus)',
    hindiName: 'हापुस आम',
    category: 'Fruits & Vegetables',
    price: 399,
    originalPrice: 499,
    unit: '1 Dozen (12 pcs)',
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=600&auto=format&fit=crop',
    isOrganic: true,
    isPopular: true,
    description: 'Fresh and gold-hued Ratnagiri Alphonso mangoes, selected for high aroma, sweet pulp and melt-in-the-mouth texture.',
    regionalOrigin: 'Devgad, Maharashtra',
    inStock: true
  },
  {
    id: 'fv-2',
    name: 'Nashik Red Onions (Pyaz)',
    hindiName: 'लाल प्याज',
    category: 'Fruits & Vegetables',
    price: 38,
    originalPrice: 48,
    unit: '1 kg',
    image: 'https://images.unsplash.com/photo-1508747703725-719777637510?q=80&w=600&auto=format&fit=crop',
    isOrganic: false,
    isPopular: true,
    description: 'Crisp, pungent red onions sourced directly from the fertile crop fields of Nashik. Ideal as base for Indian curries.',
    regionalOrigin: 'Nashik, Maharashtra',
    inStock: true
  },
  {
    id: 'fv-3',
    name: 'Organic Desi Tomatoes (Tamatar)',
    hindiName: 'देसी टमाटर',
    category: 'Fruits & Vegetables',
    price: 45,
    originalPrice: 55,
    unit: '1 kg',
    image: 'https://images.unsplash.com/photo-1595855759920-86582396756a?q=80&w=600&auto=format&fit=crop',
    isOrganic: true,
    isPopular: true,
    description: 'Juicy, farm-plucked organic yellow-red country tomatoes with optimal tanginess for Indian cooking.',
    regionalOrigin: 'Kolar, Karnataka',
    inStock: true
  },
  {
    id: 'fv-4',
    name: 'Fresh Coriander Bunch (Dhaniya)',
    hindiName: 'हरा धनिया',
    category: 'Fruits & Vegetables',
    price: 15,
    originalPrice: 20,
    unit: '1 Bun (approx 150g)',
    image: 'https://images.unsplash.com/photo-1515471204580-f7cbe24db33a?q=80&w=600&auto=format&fit=crop',
    isOrganic: true,
    isPopular: false,
    description: 'Aromatic, fresh coriander herbs harvested at dawn. Perfect garnish for spicy Indian delicacies.',
    regionalOrigin: 'Local Polyhouse Farms',
    inStock: true
  },
  {
    id: 'fv-5',
    name: 'Spicy Green Chillies (Hari Mirch)',
    hindiName: 'हरी मिर्च',
    category: 'Fruits & Vegetables',
    price: 22,
    unit: '200 g',
    image: 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?q=80&w=600&auto=format&fit=crop',
    isOrganic: false,
    isPopular: false,
    description: 'Fiery and fresh green chillies packed with vitamin C and instant capsicum heat.',
    regionalOrigin: 'Guntur, Andhra Pradesh',
    inStock: true
  },
  {
    id: 'fv-6',
    name: 'Baby Potatoes (Aloo)',
    hindiName: 'छोटे आलू',
    category: 'Fruits & Vegetables',
    price: 32,
    originalPrice: 38,
    unit: '1 kg',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=600&auto=format&fit=crop',
    isOrganic: false,
    isPopular: false,
    description: 'Small fresh mud-coated potatoes, perfect for Dum Aloo, crispy fry, or local curry stews.',
    regionalOrigin: 'Deesa, Gujarat',
    inStock: true
  },
  {
    id: 'fv-7',
    name: 'Himachal Royal Red Apples',
    hindiName: 'सेब',
    category: 'Fruits & Vegetables',
    price: 180,
    originalPrice: 220,
    unit: '4 pcs (approx 600g)',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?q=80&w=600&auto=format&fit=crop',
    isOrganic: true,
    isPopular: true,
    description: 'Crunchy sweet apples handpicked from the high orchards of Shimla. Excellent dietary fiber source.',
    regionalOrigin: 'Shimla, Himachal Pradesh',
    inStock: true
  },

  // Dairy & Breakfast
  {
    id: 'db-1',
    name: 'Premium Fresh Malai Paneer',
    hindiName: 'ताजा मलाई पनीर',
    category: 'Dairy & Breakfast',
    price: 115,
    originalPrice: 130,
    unit: '200 g',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=600&auto=format&fit=crop',
    isOrganic: false,
    isPopular: true,
    description: 'Super soft, creamy malai paneer packed with high protein. No starch or chemicals added.',
    regionalOrigin: 'Anand Dairy Farm, Gujarat',
    inStock: true
  },
  {
    id: 'db-2',
    name: 'Thick Farm Fresh Dahi (Curd)',
    hindiName: 'गाढ़ा दही',
    category: 'Dairy & Breakfast',
    price: 35,
    originalPrice: 40,
    unit: '400 g',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=600&auto=format&fit=crop',
    isOrganic: false,
    isPopular: true,
    description: 'Creamy set curd naturally fermented using superior live cultures. Cools digestion during hot days.',
    regionalOrigin: 'Local Cooperative Diary',
    inStock: true
  },
  {
    id: 'db-3',
    name: 'Pure Desi Cow Ghee (A2)',
    hindiName: 'देसी गाय का घी',
    category: 'Dairy & Breakfast',
    price: 649,
    originalPrice: 720,
    unit: '500 ml',
    image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?q=80&w=600&auto=format&fit=crop',
    isOrganic: true,
    isPopular: true,
    description: 'Golden yellow A2 Cow Ghee made using traditional Vedic Bilona slow-churning process. Highly nutritious.',
    regionalOrigin: 'Vrindavan Farms, U.P.',
    inStock: true
  },
  {
    id: 'db-4',
    name: 'Fresh Premium Cow Milk',
    hindiName: 'ताजा गाय का दूध',
    category: 'Dairy & Breakfast',
    price: 36,
    unit: '500 ml',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=600&auto=format&fit=crop',
    isOrganic: false,
    isPopular: false,
    description: 'High-quality pastuerized cow milk with essential fat and nutrients intact. Delivered fresh.',
    regionalOrigin: 'Amul Cooperative',
    inStock: true
  },

  // Daily Staples
  {
    id: 'ds-1',
    name: 'Sharbati Whole Wheat Atta',
    hindiName: 'शरबती गेहूं आटा',
    category: 'Daily Staples',
    price: 275,
    originalPrice: 310,
    unit: '5 kg',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600&auto=format&fit=crop',
    isOrganic: false,
    isPopular: true,
    description: 'Premium soft wheat flour milled from pure MP Sharbati grains. Keeps rotis soft and moist for hours.',
    regionalOrigin: 'Sehore, Madhya Pradesh',
    inStock: true
  },
  {
    id: 'ds-2',
    name: 'Royal Basmati Rice (Long Grain)',
    hindiName: 'दावत बासमती चावल',
    category: 'Daily Staples',
    price: 145,
    originalPrice: 175,
    unit: '1 kg',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=600&auto=format&fit=crop',
    isOrganic: false,
    isPopular: true,
    description: 'Aged long-grain basmati rice featuring rich natural scent. Grain elongates up to twice its length on boiling.',
    regionalOrigin: 'Dehradun Valley, Uttarakhand',
    inStock: true
  },
  {
    id: 'ds-3',
    name: 'Unpolished Toor / Arhar Dal',
    hindiName: 'अरहर दाल',
    category: 'Daily Staples',
    price: 165,
    originalPrice: 180,
    unit: '1 kg',
    image: 'https://images.unsplash.com/photo-1547058881-aa0edd92aab3?q=80&w=600&auto=format&fit=crop',
    isOrganic: true,
    isPopular: false,
    description: 'Rich in protein, unpolished Yellow Pigeon Peas with natural taste and no artificial chemical coloring.',
    regionalOrigin: 'Latur, Maharashtra',
    inStock: true
  },
  {
    id: 'ds-4',
    name: 'Organic Kabuli Chana',
    hindiName: 'काबूली चना',
    category: 'Daily Staples',
    price: 130,
    unit: '1 kg',
    image: 'https://images.unsplash.com/photo-1515942400755-44f2fb9f60bf?q=80&w=600&auto=format&fit=crop',
    isOrganic: true,
    isPopular: false,
    description: 'Bold, rich-tasting giant chickpeas. Ideal for soft, delicious Punjabi Chole masala.',
    regionalOrigin: 'Indore, Madhya Pradesh',
    inStock: true
  },

  // Spices & Condiments
  {
    id: 'sc-1',
    name: 'Guntur Red Chilli Powder',
    hindiName: 'लाल मिर्च पाउडर',
    category: 'Spices & Condiments',
    price: 85,
    originalPrice: 100,
    unit: '200 g',
    image: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?q=80&w=600&auto=format&fit=crop',
    isOrganic: true,
    isPopular: false,
    description: 'Intensely hot and deeply crimson-red spice powder from handpicked Guntur chillies.',
    regionalOrigin: 'Guntur, Andhra Pradesh',
    inStock: true
  },
  {
    id: 'sc-2',
    name: 'Lakhadong High-Curcumin Turmeric',
    hindiName: 'हल्दी पाउडर',
    category: 'Spices & Condiments',
    price: 110,
    originalPrice: 140,
    unit: '250 g',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=600&auto=format&fit=crop',
    isOrganic: true,
    isPopular: true,
    description: 'Rare turmeric with extreme 7-9% curcumin content. Exceptional medicinal properties and fragrance.',
    regionalOrigin: 'Jaintia Hills, Meghalaya',
    inStock: true
  },
  {
    id: 'sc-3',
    name: 'Kashmiri Saffron (Kesar)',
    hindiName: 'शुद्ध केसर',
    category: 'Spices & Condiments',
    price: 349,
    originalPrice: 399,
    unit: '1 g',
    image: 'https://images.unsplash.com/photo-1610450949018-bc1ce1ca3b1d?q=80&w=600&auto=format&fit=crop',
    isOrganic: true,
    isPopular: true,
    description: 'Premium Grade-A dark crimson flower stigmas. Rich colorant and absolute mood lifter.',
    regionalOrigin: 'Pampore, Jammu & Kashmir',
    inStock: true
  },

  // Snacks & Regional
  {
    id: 'sn-1',
    name: 'Pure Kaju Katli Sweet',
    hindiName: 'काजू कतली',
    category: 'Snacks & Regional Specialities',
    price: 320,
    originalPrice: 360,
    unit: '250 g',
    image: 'https://images.unsplash.com/photo-1589114407887-b9cf6d22fc75?q=80&w=600&auto=format&fit=crop',
    isOrganic: false,
    isPopular: true,
    description: 'Delicate cashew diamonds enriched with real silver vark cover. Perfect for celebrations and dessert cravings.',
    regionalOrigin: 'Haldirams Style Premium',
    inStock: true
  },
  {
    id: 'sn-2',
    name: 'Suhana Masala Tea Powder',
    hindiName: 'मसाला चाय',
    category: 'Snacks & Regional Specialities',
    price: 125,
    unit: '250 g',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=600&auto=format&fit=crop',
    isOrganic: false,
    isPopular: false,
    description: 'Premium Assam tea leaves blended with ground cardamoms, cinnamon, dry ginger, and spicy black pepper.',
    regionalOrigin: 'Assam Hills & Kerala Cardamom Labs',
    inStock: true
  },
  {
    id: 'sn-3',
    name: 'MTR Ready Idli-Dosa Wet Batter',
    hindiName: 'इडली डोसा बैटर',
    category: 'Snacks & Regional Specialities',
    price: 48,
    originalPrice: 55,
    unit: '1 kg',
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?q=80&w=600&auto=format&fit=crop',
    isOrganic: false,
    isPopular: true,
    description: 'Stone-ground, moderately fermented rice-urad dal mix. Pre-salted to yield light idlis and crispy dosas.',
    regionalOrigin: 'Bengaluru, Karnataka',
    inStock: true
  }
];

export const CATEGORIES = [
  'All',
  'Fruits & Vegetables',
  'Dairy & Breakfast',
  'Daily Staples',
  'Spices & Condiments',
  'Snacks & Regional Specialities'
];
