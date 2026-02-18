
import React, { useState, useEffect, useCallback } from 'react';
import { Ghost as GhostIcon } from 'lucide-react';

const SIZE = 15;
const INITIAL_POS = { x: 1, y: 1 };
const INITIAL_GHOST_POS = { x: 13, y: 13 };

export const PacmanGame: React.FC = () => {
  const [pos, setPos] = useState(INITIAL_POS);
  const [ghostPos, setGhostPos] = useState(INITIAL_GHOST_POS);
  const [dots, setDots] = useState<Set<string>>(new Set());
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing');

  const generateDots = () => {
    const newDots = new Set<string>();
    for (let x = 1; x < SIZE - 1; x++) {
      for (let y = 1; y < SIZE - 1; y++) {
        if (!(x === 1 && y === 1)) newDots.add(`${x},${y}`);
      }
    }
    return newDots;
  };

  useEffect(() => {
    setDots(generateDots());
  }, []);

  const resetGame = () => {
    setPos(INITIAL_POS);
    setGhostPos(INITIAL_GHOST_POS);
    setDots(generateDots());
    setScore(0);
    setStatus('playing');
  };

  const moveGhost = useCallback(() => {
    if (status !== 'playing') return;
    setGhostPos(prev => {
      const dx = pos.x > prev.x ? 1 : pos.x < prev.x ? -1 : 0;
      const dy = pos.y > prev.y ? 1 : pos.y < prev.y ? -1 : 0;
      return { x: prev.x + dx, y: prev.y + dy };
    });
  }, [pos, status]);

  useEffect(() => {
    const timer = setInterval(moveGhost, 600);
    return () => clearInterval(timer);
  }, [moveGhost]);

  useEffect(() => {
    if (pos.x === ghostPos.x && pos.y === ghostPos.y) {
      setStatus('lost');
    }
  }, [pos, ghostPos]);

  const handleKey = useCallback((e: KeyboardEvent | { key: string }) => {
    if (status !== 'playing') return;
    let next = { ...pos };
    if (e.key === 'ArrowUp') next.y = Math.max(1, pos.y - 1);
    if (e.key === 'ArrowDown') next.y = Math.min(SIZE - 2, pos.y + 1);
    if (e.key === 'ArrowLeft') next.x = Math.max(1, pos.x - 1);
    if (e.key === 'ArrowRight') next.x = Math.min(SIZE - 2, pos.x + 1);

    setPos(next);
    const key = `${next.x},${next.y}`;
    if (dots.has(key)) {
      dots.delete(key);
      setDots(new Set(dots));
      setScore(s => s + 10);
      if (dots.size === 0) setStatus('won');
    }
  }, [pos, dots, status]);

  useEffect(() => {
    const keyHandler = (e: KeyboardEvent) => handleKey(e);
    window.addEventListener('keydown', keyHandler);
    return () => window.removeEventListener('keydown', keyHandler);
  }, [handleKey]);

  return (
    <div className="flex flex-col items-center bg-black h-full p-4 font-mono select-none overflow-hidden">
      <div className="w-full flex justify-between text-yellow-400 mb-2 border-b border-yellow-900/50 pb-1 text-xs">
        <span>PAC_CHROME_V2.0</span>
        <span>SCORE: {score}</span>
      </div>

      <div className="relative bg-[#000033] win-border-inset p-0.5" style={{ width: SIZE * 16, height: SIZE * 16 }}>
        {Array.from(dots).map((d: string) => {
          const [x, y] = d.split(',').map(Number);
          return (
            <div key={d} className="absolute w-1 h-1 bg-yellow-100 rounded-full" style={{ left: x * 16 + 7, top: y * 16 + 7 }}></div>
          );
        })}

        <div className="absolute w-3 h-3 bg-yellow-400 rounded-full transition-all duration-100 shadow-[0_0_8px_#fff000]" 
             style={{ left: pos.x * 16 + 2, top: pos.y * 16 + 2 }}>
             <div className="absolute right-0 top-1/2 w-1.5 h-1 bg-[#000033]"></div>
        </div>

        <div className="absolute transition-all duration-500" style={{ left: ghostPos.x * 16 + 1, top: ghostPos.y * 16 + 1 }}>
          <GhostIcon size={14} className="text-red-500 animate-pulse" />
        </div>

        <div className="absolute inset-0 border-4 border-blue-900 pointer-events-none opacity-40"></div>
      </div>

      {status !== 'playing' && (
        <div className="absolute inset-0 z-50 bg-black/80 flex flex-col items-center justify-center">
          <h2 className={`text-2xl font-black italic ${status === 'won' ? 'text-green-500' : 'text-red-500 animate-bounce'}`}>
            {status === 'won' ? 'MISSION_COMPLETE' : 'WIPE_OUT'}
          </h2>
          <button 
            onClick={resetGame} 
            className="mt-4 win-border bg-gray-300 px-6 py-1 font-bold text-xs uppercase active:win-border-inset"
          >RESTART</button>
        </div>
      )}

      <div className="mt-4 grid grid-cols-3 gap-1 w-full max-w-[120px]">
        <div />
        <button onClick={() => handleKey({ key: 'ArrowUp' })} className="win-border bg-gray-300 p-2 text-[10px] font-bold active:win-border-inset">▲</button>
        <div />
        <button onClick={() => handleKey({ key: 'ArrowLeft' })} className="win-border bg-gray-300 p-2 text-[10px] font-bold active:win-border-inset">◀</button>
        <button onClick={() => handleKey({ key: 'ArrowDown' })} className="win-border bg-gray-300 p-2 text-[10px] font-bold active:win-border-inset">▼</button>
        <button onClick={() => handleKey({ key: 'ArrowRight' })} className="win-border bg-gray-300 p-2 text-[10px] font-bold active:win-border-inset">▶</button>
      </div>

      <p className="mt-2 text-[8px] text-gray-500 animate-pulse">OPTIMIZED_FOR_Y2K_CHROME_BUFFERS</p>
    </div>
  );
};
