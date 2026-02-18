
import React, { useMemo, useState, useEffect } from 'react';
import { X, Minus, Square } from 'lucide-react';
import { WindowState } from '../types';

interface WindowProps {
  window: WindowState;
  onClose: () => void;
  onFocus: () => void;
  children: React.ReactNode;
}

export const Window: React.FC<WindowProps> = ({ window: winData, onClose, onFocus, children }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const windowStyle = useMemo(() => {
    if (isMobile) {
      return { zIndex: winData.zIndex, top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '95vw', position: 'fixed' as const };
    }
    return { 
      zIndex: winData.zIndex, 
      top: 40 + (winData.positionIndex * 25), 
      left: 60 + (winData.positionIndex * 25), 
      position: 'absolute' as const,
      width: '450px'
    };
  }, [winData.zIndex, winData.positionIndex, isMobile]);

  return (
    <div 
      onClick={onFocus} 
      className="win-border bg-gray-200 shadow-[10px_10px_30px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden min-w-[320px] animate-in zoom-in-95 duration-200" 
      style={windowStyle}
    >
      <div className="flex items-center justify-between p-1 glossy-header text-white cursor-default">
        <div className="flex items-center gap-2 px-1">
          <div className="w-4 h-4 bg-white/20 rounded-sm flex items-center justify-center">
             <div className="w-2 h-2 bg-white/50 rounded-full"></div>
          </div>
          <span className="text-[11px] font-bold uppercase truncate tracking-tight">{winData.title}</span>
        </div>
        <div className="flex items-center gap-1">
          <button className="win-border xp-button w-5 h-5 flex items-center justify-center text-black"><Minus size={10} /></button>
          <button className="win-border xp-button w-5 h-5 flex items-center justify-center text-black"><Square size={8} /></button>
          <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="win-border bg-[#e81123] border-[#e81123] w-5 h-5 flex items-center justify-center text-white ml-1 hover:bg-[#f1707a]"><X size={10} /></button>
        </div>
      </div>
      <div className="flex-1 overflow-auto bg-white win-border-inset m-1 max-h-[75vh] relative no-scrollbar">
        {children}
      </div>
    </div>
  );
};
