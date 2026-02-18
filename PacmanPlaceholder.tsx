
import React from 'react';
import { Ghost } from 'lucide-react';

export const PacmanPlaceholder: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-black p-8 font-mono overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="grid grid-cols-12 gap-4 w-full h-full">
          {Array(48).fill(null).map((_, i) => (
            <div key={i} className="w-1 h-1 bg-yellow-200 rounded-full"></div>
          ))}
        </div>
      </div>

      <div className="text-yellow-400 text-3xl mb-8 flex items-center gap-4 animate-bounce">
        <div className="w-12 h-12 bg-yellow-400 rounded-full relative overflow-hidden">
            <div className="absolute inset-0 bg-black" style={{ clipPath: 'polygon(50% 50%, 100% 0%, 100% 100%)' }}></div>
        </div>
        PAC-MAN
      </div>

      <div className="flex gap-8 mb-8">
        <Ghost className="text-red-500 animate-pulse" size={48} />
        <Ghost className="text-pink-400 animate-bounce" size={48} />
        <Ghost className="text-cyan-400 animate-pulse" size={48} />
        <Ghost className="text-orange-400 animate-bounce" size={48} />
      </div>

      <div className="win-border bg-gray-800 text-green-500 p-4 w-full text-center">
        <p className="text-xs mb-2 uppercase tracking-widest">High Score: 999,999</p>
        <button className="bg-yellow-400 text-black px-6 py-2 font-bold win-border hover:bg-yellow-300 transition-colors uppercase text-sm">
          Insert Coin (50¢)
        </button>
      </div>

      <div className="mt-4 text-[9px] text-gray-600 uppercase">
        © 1980 Namco / Optimized for Y2K_OS
      </div>
    </div>
  );
};
