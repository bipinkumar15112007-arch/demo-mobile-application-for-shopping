import React from 'react';
import { Sparkles, MapPin, Plus, Minus } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  cartCount: number;
  onAddToCart: (p: Product) => void;
  onRemoveFromCart: (p: Product) => void;
  key?: string | number;
}

export default function ProductCard({
  product,
  cartCount,
  onAddToCart,
  onRemoveFromCart
}: ProductCardProps) {
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  return (
    <div 
      id={`product-card-${product.id}`}
      className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full group"
    >
      {/* Visual Header */}
      <div className="relative aspect-video sm:aspect-square w-full overflow-hidden bg-slate-50">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.isOrganic && (
            <span className="bg-brand-green/95 text-white text-[10px] uppercase font-extrabold tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs">
              <Sparkles className="w-3 h-3" />
              <span>Organic</span>
            </span>
          )}
          {product.isPopular && (
            <span className="bg-brand-orange/95 text-white text-[10px] uppercase font-extrabold tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs">
              🔥 Best Seller
            </span>
          )}
        </div>

        {/* Instock Overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-10">
            <span className="bg-white text-rose-600 px-3 py-1.5 rounded-lg text-xs font-extrabold tracking-wider shadow-md">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="p-4 flex flex-col flex-grow space-y-2">
        <div className="space-y-1">
          {product.regionalOrigin && (
            <div className="flex items-center gap-1 text-[11px] font-semibold text-brand-green">
              <MapPin className="w-3 h-3" />
              <span>{product.regionalOrigin}</span>
            </div>
          )}
          
          <h3 className="font-bold text-gray-900 text-sm line-clamp-1 group-hover:text-brand-green transition-colors">
            {product.name}
          </h3>
          
          {product.hindiName && (
            <span className="text-xs text-gray-400 font-medium block">
              {product.hindiName}
            </span>
          )}
        </div>

        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed flex-grow">
          {product.description}
        </p>

        {/* Price & Unit Details */}
        <div className="pt-2 border-t border-slate-100 flex items-end justify-between mt-auto">
          <div>
            <div className="text-[11px] text-gray-400 font-semibold mb-0.5">{product.unit}</div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-base font-bold text-brand-navy font-mono">
                ₹{product.price}
              </span>
              {hasDiscount && (
                <span className="text-xs text-gray-400 line-through font-mono">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>
          </div>

          {/* Action button */}
          <div className="shrink-0">
            {cartCount > 0 ? (
              <div 
                id={`cart-stepper-${product.id}`}
                className="flex items-center bg-brand-green text-white rounded-lg overflow-hidden shadow-sm"
              >
                <button
                  type="button"
                  id={`btn-dec-${product.id}`}
                  onClick={() => onRemoveFromCart(product)}
                  className="px-2.5 py-1.5 hover:bg-brand-green-dark transition-colors text-white"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-2 text-xs font-bold font-mono min-w-4 text-center">
                  {cartCount}
                </span>
                <button
                  type="button"
                  id={`btn-inc-${product.id}`}
                  onClick={() => onAddToCart(product)}
                  className="px-2.5 py-1.5 hover:bg-brand-green-dark transition-colors text-white"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                id={`btn-add-${product.id}`}
                disabled={!product.inStock}
                onClick={() => onAddToCart(product)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  product.inStock
                    ? 'bg-brand-orange hover:bg-brand-orange-dark text-white shadow-xs cursor-pointer active:scale-95'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
