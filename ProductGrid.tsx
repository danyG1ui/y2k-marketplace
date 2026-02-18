
import React from 'react';
import { PRODUCTS, SHOP_NAME } from '../constants';
import { Product } from '../types';
import { ShoppingCart, HardDrive } from 'lucide-react';

interface ProductGridProps {
  onProductSelect: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ onProductSelect }) => {
  return (
    <div className="p-4 bg-[#f0f0f0] min-h-full font-sans">
      <div className="mb-6 border-b-2 border-blue-600 pb-2 flex justify-between items-end">
        <div>
          <h1 className="text-xl font-black chrome-text italic tracking-tighter uppercase">{SHOP_NAME}_V2.0</h1>
          <p className="text-[9px] font-mono text-blue-600 uppercase">Directory: C:/Products/Themes</p>
        </div>
        <div className="flex items-center gap-1 text-gray-400">
           <HardDrive size={14} />
           <span className="text-[9px] font-bold">42.0 GB FREE</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {PRODUCTS.map(product => (
          <div 
            key={product.id} 
            className="win-border bg-gray-100 flex flex-col cursor-pointer group hover:bg-white transition-colors" 
            onClick={() => onProductSelect(product)}
          >
            <div className="bg-black win-border-inset m-1 aspect-square overflow-hidden relative">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500" 
              />
              <div className="absolute top-1 right-1 bg-blue-600 text-white text-[8px] px-2 py-0.5 font-bold win-border uppercase">
                {product.category}
              </div>
            </div>
            <div className="p-2 flex flex-col gap-1">
              <h3 className="font-bold text-xs text-blue-900 truncate uppercase italic">{product.name}</h3>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs font-mono font-bold text-green-700">{product.price}</span>
                <button className="win-border bg-blue-600 text-white text-[9px] px-3 py-1 font-bold hover:bg-blue-500 active:win-border-inset">
                  VIEW_FILE
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {PRODUCTS.length === 0 && (
        <div className="flex flex-col items-center justify-center p-12 text-center opacity-40">
           <ShoppingCart size={48} className="mb-2" />
           <p className="text-xs font-bold uppercase italic">No items found in local directory.</p>
        </div>
      )}
    </div>
  );
};
