
import React from 'react';

interface DesktopIconProps {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

export const DesktopIcon: React.FC<DesktopIconProps> = ({ label, icon, onClick }) => {
  return (
    <button onClick={onClick} className="group flex flex-col items-center w-24 p-2 gap-1 hover:bg-blue-600/30">
      <div className="relative p-3 bg-white/10 backdrop-blur-[2px] win-border group-hover:bg-white/30 transition-all">
        <div className="text-blue-900">{icon}</div>
      </div>
      <span className="text-[10px] font-bold text-white drop-shadow-[1px_1px_1px_rgba(0,0,0,0.8)] px-1 truncate w-full">
        {label}
      </span>
    </button>
  );
};
