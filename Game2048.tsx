
import React, { useState, useEffect, useCallback } from 'react';

const SIZE = 4;

export const Game2048: React.FC = () => {
  const [grid, setGrid] = useState<number[][]>([]);
  const [score, setScore] = useState(0);

  const spawn = useCallback((currentGrid: number[][]) => {
    const empty = [];
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (currentGrid[r][c] === 0) empty.push({ r, c });
      }
    }
    if (empty.length > 0) {
      const { r, c } = empty[Math.floor(Math.random() * empty.length)];
      currentGrid[r][c] = Math.random() < 0.9 ? 2 : 4;
    }
    return [...currentGrid];
  }, []);

  const init = useCallback(() => {
    let g = Array(SIZE).fill(0).map(() => Array(SIZE).fill(0));
    g = spawn(g);
    g = spawn(g);
    setGrid(g);
    setScore(0);
  }, [spawn]);

  useEffect(() => init(), [init]);

  const move = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    setGrid(prev => {
      let next = prev.map(r => [...r]);
      let moved = false;

      const slide = (row: number[]) => {
        let filtered = row.filter(x => x !== 0);
        for (let i = 0; i < filtered.length - 1; i++) {
          if (filtered[i] === filtered[i + 1]) {
            filtered[i] *= 2;
            setScore(s => s + filtered[i]);
            filtered.splice(i + 1, 1);
            moved = true;
          }
        }
        while (filtered.length < SIZE) filtered.push(0);
        return filtered;
      };

      if (direction === 'left' || direction === 'right') {
        next = next.map(row => {
          const r = direction === 'right' ? row.reverse() : row;
          const s = slide(r);
          if (JSON.stringify(r) !== JSON.stringify(s)) moved = true;
          return direction === 'right' ? s.reverse() : s;
        });
      } else {
        for (let c = 0; c < SIZE; c++) {
          let col = [next[0][c], next[1][c], next[2][c], next[3][c]];
          if (direction === 'down') col.reverse();
          const s = slide(col);
          if (JSON.stringify(col) !== JSON.stringify(s)) moved = true;
          if (direction === 'down') s.reverse();
          for (let r = 0; r < SIZE; r++) next[r][c] = s[r];
        }
      }

      if (moved) next = spawn(next);
      return next;
    });
  }, [spawn]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') move('up');
      if (e.key === 'ArrowDown') move('down');
      if (e.key === 'ArrowLeft') move('left');
      if (e.key === 'ArrowRight') move('right');
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [move]);

  const getTileColor = (val: number) => {
    const colors: Record<number, string> = {
      2: '#eee', 4: '#ddd', 8: '#ffcc99', 16: '#ff9966', 32: '#ff6633', 64: '#ff3300',
      128: '#ffff99', 256: '#ffff66', 512: '#ffff33', 1024: '#ffff00', 2048: '#ccff00'
    };
    return colors[val] || '#fff';
  };

  return (
    <div className="flex flex-col items-center bg-gray-200 h-full p-4 font-mono select-none overflow-hidden">
      <div className="w-full flex justify-between text-orange-600 mb-2 border-b border-orange-200 pb-1 text-xs">
        <span className="font-bold">2048_XP_ENGINE</span>
        <span>SCORE: {score}</span>
      </div>
      <div className="bg-gray-400 p-1 win-border-inset">
        <div className="grid grid-cols-4 gap-1">
          {grid.map((row, r) => row.map((cell, c) => (
            <div key={`${r}-${c}`} className="w-12 h-12 md:w-14 md:h-14 win-border flex items-center justify-center text-xs font-black shadow-sm" style={{ backgroundColor: cell === 0 ? '#ccc' : getTileColor(cell) }}>
              {cell !== 0 ? cell : ''}
            </div>
          )))}
        </div>
      </div>
      <button onClick={init} className="mt-4 win-border bg-gray-300 px-4 py-1 text-[10px] font-bold uppercase">New_Game</button>
      <div className="mt-2 grid grid-cols-3 gap-1 w-24">
        <div /> <button onClick={() => move('up')} className="win-border bg-gray-300 p-2 text-[8px]">▲</button> <div />
        <button onClick={() => move('left')} className="win-border bg-gray-300 p-2 text-[8px]">◀</button>
        <button onClick={() => move('down')} className="win-border bg-gray-300 p-2 text-[8px]">▼</button>
        <button onClick={() => move('right')} className="win-border bg-gray-300 p-2 text-[8px]">▶</button>
      </div>
    </div>
  );
};
