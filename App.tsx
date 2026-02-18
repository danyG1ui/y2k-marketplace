
import React, { useState, useCallback, useRef } from 'react';
import { Window } from './components/Window';
import { Taskbar } from './components/Taskbar';
import { DesktopIcon } from './components/DesktopIcon';
import { ProductGrid } from './components/ProductGrid';
import { AISearch } from './components/AISearch';
import { TetrisGame } from './components/TetrisGame';
import { PacmanGame } from './components/PacmanGame';
import { Minesweeper } from './components/Minesweeper';
import { MusicPlayer } from './components/MusicPlayer';
import { ChromePal } from './components/ChromePal';
import { DreamMachine } from './components/DreamMachine';
import { WindowState, Product } from './types';
import { 
  ShoppingBag, Sparkles, FolderArchive, 
  Gamepad2, Music, Palette
} from 'lucide-react';
import { CAMPAIGN_IMAGES } from './constants';

const App: React.FC = () => {
  // Sofortiger Start ohne Boot- oder Setup-Zustände
  const [windows, setWindows] = useState<WindowState[]>([
    { id: 'shop', title: 'Marketplace.exe', isOpen: true, zIndex: 10, positionIndex: 0, type: 'shop' },
  ]);

  const [maxZIndex, setMaxZIndex] = useState(10);
  const windowCount = useRef(2);

  const openWindow = useCallback((id: string, title?: string, type: WindowState['type'] = 'shop', data?: Product) => {
    setWindows(prev => {
      const existing = prev.find(w => w.id === id);
      const newZ = maxZIndex + 1;
      setMaxZIndex(newZ);

      if (existing) {
        return prev.map(w => w.id === id ? { ...w, isOpen: true, zIndex: newZ } : w);
      }
      
      const newPosIndex = windowCount.current % 10;
      windowCount.current += 1;

      return [...prev, { 
        id, 
        title: title || id, 
        isOpen: true, 
        zIndex: newZ, 
        positionIndex: newPosIndex, 
        type, 
        data 
      }];
    });
  }, [maxZIndex]);

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isOpen: false } : w));
  }, []);

  const focusWindow = useCallback((id: string) => {
    const newZ = maxZIndex + 1;
    setMaxZIndex(newZ);
    setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: newZ } : w));
  }, [maxZIndex]);

  const handleCheckout = (url: string) => {
    // In Shopify leiten wir den Nutzer zum Cart-Permalink weiter
    window.location.href = url;
  };

  return (
    <div className="relative w-full h-full overflow-hidden pixel-bliss flex flex-col select-none">
      {/* Overlay-Effekt für Retro-Look */}
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay z-[2]"></div>
      
      {/* Desktop Icons */}
      <div className="flex-1 p-4 md:p-8 flex flex-col flex-wrap gap-4 items-start content-start relative z-10 overflow-hidden">
        <DesktopIcon 
          label="Marketplace" 
          icon={<ShoppingBag className="w-8 h-8 md:w-10 md:h-10" />} 
          onClick={() => openWindow('shop', 'Marketplace.exe', 'shop')} 
        />
        <DesktopIcon 
          label="Dream Machine" 
          icon={<Palette className="w-8 h-8 md:w-10 md:h-10 text-pink-400" />} 
          onClick={() => openWindow('dream', 'Dream_Machine.exe', 'dream')} 
        />
        <DesktopIcon 
          label="Music Player" 
          icon={<Music className="w-8 h-8 md:w-10 md:h-10 text-blue-400" />} 
          onClick={() => openWindow('player', 'Chrome_Player.exe', 'player')} 
        />
        <DesktopIcon 
          label="Games" 
          icon={<Gamepad2 className="w-8 h-8 md:w-10 md:h-10 text-red-500" />} 
          onClick={() => openWindow('games', 'C:/Games', 'games')} 
        />
        <DesktopIcon 
          label="Archiv" 
          icon={<FolderArchive className="w-8 h-8 md:w-10 md:h-10 text-yellow-300" />} 
          onClick={() => openWindow('archive', 'Campaign_Archive.dir', 'archive')} 
        />
        <DesktopIcon 
          label="Couture AI" 
          icon={<Sparkles className="w-8 h-8 md:w-10 md:h-10 text-cyan-300" />} 
          onClick={() => openWindow('ai', 'Couture_Critic_AI.exe', 'ai')} 
        />
      </div>

      {/* Fenster-Rendering */}
      {windows.map(win => win.isOpen && (
        <Window
          key={win.id}
          window={win}
          onClose={() => closeWindow(win.id)}
          onFocus={() => focusWindow(win.id)}
        >
          {win.type === 'shop' && <ProductGrid onProductSelect={(p) => openWindow(`item-${p.id}`, p.name, 'item', p)} />}
          {win.type === 'dream' && <DreamMachine />}
          
          {win.type === 'games' && (
            <div className="p-4 bg-gray-100 min-h-full grid grid-cols-2 gap-4">
              {[
                { id: 'tetris', icon: Gamepad2, color: 'text-red-600', label: 'Tetris' },
                { id: 'pacman', icon: Gamepad2, color: 'text-yellow-600', label: 'Pacman' },
                { id: 'minesweeper', icon: Gamepad2, color: 'text-gray-700', label: 'Mines' }
              ].map(game => (
                <button key={game.id} onClick={() => openWindow(game.id, `${game.label}.exe`, game.id as any)} className="flex flex-col items-center gap-2 p-4 win-border bg-white hover:bg-blue-50">
                  <div className="p-2 bg-gray-50 win-border">
                    <game.icon size={24} className={game.color} />
                  </div>
                  <span className="text-[10px] font-bold uppercase">{game.label}</span>
                </button>
              ))}
            </div>
          )}

          {win.type === 'tetris' && <TetrisGame />}
          {win.type === 'pacman' && <PacmanGame />}
          {win.type === 'minesweeper' && <Minesweeper />}
          {win.type === 'player' && <MusicPlayer />}
          {win.type === 'ai' && <AISearch />}

          {win.type === 'archive' && (
            <div className="p-4 bg-gray-100 min-h-full">
              <div className="grid grid-cols-2 gap-4">
                {CAMPAIGN_IMAGES.map((img, i) => (
                  <div key={i} className="win-border bg-white p-1">
                    <img src={img} alt={`Campaign ${i}`} className="w-full h-24 object-cover grayscale" />
                    <div className="text-[9px] mt-1 font-mono text-center">IMG_00{i+1}.JPG</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {win.type === 'item' && win.data && (
            <div className="p-4 flex flex-col gap-4">
               <div className="win-border-inset bg-black aspect-square">
                  <img src={win.data.image} alt={win.data.name} className="w-full h-full object-cover" />
               </div>
               <div>
                  <h2 className="text-xl font-bold chrome-text italic">{win.data.name}</h2>
                  <p className="text-[10px] text-blue-600 font-mono">{win.data.category}</p>
                  <p className="text-xs text-gray-600 mt-2">{win.data.description}</p>
               </div>
               <div className="flex justify-between items-center mt-auto">
                  <span className="text-lg font-bold text-blue-900">{win.data.price}</span>
                  <button 
                    onClick={() => handleCheckout(win.data?.checkoutUrl || '#')}
                    className="win-border glossy-header text-white px-6 py-2 font-bold hover:opacity-90 active:win-border-inset flex items-center gap-2"
                  >
                    KAUFEN
                  </button>
               </div>
            </div>
          )}
        </Window>
      ))}

      <ChromePal />

      <Taskbar 
        windows={windows} 
        onWindowClick={(id) => focusWindow(id)} 
        onStartMenuClick={(id, title, type) => openWindow(id, title, type)} 
      />
    </div>
  );
};

export default App;
