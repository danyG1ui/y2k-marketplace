
import React, { useState, useEffect } from 'react';
import { WindowState } from '../types';
import { LayoutGrid, Monitor, ShoppingBag, Palette, Music, Sparkles, FolderArchive, HelpCircle } from 'lucide-react';

interface TaskbarProps {
  windows: WindowState[];
  onWindowClick: (id: string) => void;
  onStartMenuClick: (id: string, title: string, type: WindowState['type']) => void;
}

export const Taskbar: React.FC<TaskbarProps> = ({ windows, onWindowClick, onStartMenuClick }) => {
  const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const [isStartOpen, setIsStartOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })), 1000);
    return () => clearInterval(timer);
  }, []);

  const menuItems = [
    { id: 'shop', title: 'Marketplace', type: 'shop', icon: ShoppingBag, color: 'text-blue-600' },
    { id: 'dream', title: 'Dream Machine', type: 'dream', icon: Palette, color: 'text-pink-600' },
    { id: 'ai', title: 'Couture AI', type: 'ai', icon: Sparkles, color: 'text-cyan-600' },
    { id: 'player', title: 'Chrome Player', type: 'player', icon: Music, color: 'text-indigo-600' },
    { id: 'archive', title: 'Photo Archive', type: 'archive', icon: FolderArchive, color: 'text-yellow-600' },
    { id: 'system', title: 'System Properties', type: 'system', icon: Monitor, color: 'text-green-600' },
  ];

  return (
    <div className="h-10 bg-gray-300 win-border border-t-2 z-[9999] flex items-center px-1 gap-1 relative">
      {isStartOpen && (
        <div className="absolute bottom-10 left-0 w-64 win-border bg-gray-200 shadow-2xl animate-in slide-in-from-bottom-2 duration-150 flex flex-col">
          <div className="start-menu-gradient h-16 p-4 flex items-center gap-3 border-b-2 border-white/20">
             <div className="w-10 h-10 rounded-full border-2 border-white bg-white/20 flex items-center justify-center overflow-hidden">
                <img src="https://picsum.photos/seed/user/100" alt="User" />
             </div>
             <div className="text-white font-black italic tracking-tighter">GUEST_USER_01</div>
          </div>
          <div className="bg-white flex-1 p-1">
             <div className="grid grid-cols-1 gap-0.5">
               {menuItems.map(item => (
                 <button 
                  key={item.id}
                  onClick={() => { onStartMenuClick(item.id, item.title, item.type as any); setIsStartOpen(false); }}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-blue-600 hover:text-white transition-colors text-xs font-bold group"
                 >
                   <item.icon size={16} className={`${item.color} group-hover:text-white`} />
                   {item.title}
                 </button>
               ))}
             </div>
          </div>
          <div className="bg-gray-200 p-2 border-t border-white flex justify-end gap-2">
            <button className="win-border bg-gray-300 px-3 py-1 text-[9px] font-bold uppercase hover:bg-white active:win-border-inset">Log Off</button>
            <button className="win-border bg-gray-300 px-3 py-1 text-[9px] font-bold uppercase hover:bg-white active:win-border-inset">Shut Down</button>
          </div>
        </div>
      )}

      <button 
        onClick={() => setIsStartOpen(!isStartOpen)}
        className={`flex items-center gap-2 px-3 h-8 win-border font-black italic text-sm ${isStartOpen ? 'win-border-inset bg-gray-400' : 'bg-green-600 hover:bg-green-500'}`}
      >
        <div className="p-0.5 bg-white/20 rounded-sm shadow-inner"><LayoutGrid size={14} className="text-white" /></div>
        <span className="text-white drop-shadow-md">start</span>
      </button>

      <div className="flex-1 flex gap-1 overflow-x-auto no-scrollbar">
        {windows.map(win => (
          <button 
            key={win.id} 
            onClick={() => onWindowClick(win.id)} 
            className={`h-8 px-3 min-w-[120px] text-[10px] font-bold flex items-center gap-2 transition-all ${win.isOpen ? 'win-border-inset bg-gray-100' : 'win-border bg-gray-300 opacity-60'}`}
          >
            <div className={`w-2 h-2 rounded-full ${win.isOpen ? 'bg-blue-500 animate-pulse' : 'bg-gray-400'}`}></div>
            <span className="truncate">{win.title}</span>
          </button>
        ))}
      </div>

      <div className="win-border-inset bg-gray-100 px-3 h-8 flex items-center gap-2 text-[10px] font-mono font-bold text-blue-900 shadow-inner">
        <HelpCircle size={12} className="opacity-40" />
        {time}
      </div>
    </div>
  );
};
