
import React, { useState, useEffect, useCallback } from 'react';
import { Bomb, Flag } from 'lucide-react';

const SIZE = 10;
const MINES_COUNT = 15;

interface Cell {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
}

export const Minesweeper: React.FC = () => {
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing');

  const initGrid = useCallback(() => {
    let newGrid: Cell[][] = Array(SIZE).fill(null).map(() => 
      Array(SIZE).fill(null).map(() => ({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborMines: 0
      }))
    );

    // Place mines
    let placed = 0;
    while (placed < MINES_COUNT) {
      const x = Math.floor(Math.random() * SIZE);
      const y = Math.floor(Math.random() * SIZE);
      if (!newGrid[y][x].isMine) {
        newGrid[y][x].isMine = true;
        placed++;
      }
    }

    // Calc neighbors
    for (let y = 0; y < SIZE; y++) {
      for (let x = 0; x < SIZE; x++) {
        if (!newGrid[y][x].isMine) {
          let count = 0;
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              const ny = y + dy;
              const nx = x + dx;
              if (ny >= 0 && ny < SIZE && nx >= 0 && nx < SIZE && newGrid[ny][nx].isMine) {
                count++;
              }
            }
          }
          newGrid[y][x].neighborMines = count;
        }
      }
    }
    setGrid(newGrid);
    setStatus('playing');
  }, []);

  useEffect(() => initGrid(), [initGrid]);

  const reveal = (x: number, y: number) => {
    if (status !== 'playing' || grid[y][x].isFlagged || grid[y][x].isRevealed) return;

    const newGrid = [...grid.map(row => [...row])];
    if (newGrid[y][x].isMine) {
      setStatus('lost');
      revealAll(newGrid);
      return;
    }

    const floodFill = (cx: number, cy: number) => {
      if (cx < 0 || cx >= SIZE || cy < 0 || cy >= SIZE || newGrid[cy][cx].isRevealed || newGrid[cy][cx].isFlagged) return;
      newGrid[cy][cx].isRevealed = true;
      if (newGrid[cy][cx].neighborMines === 0) {
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            floodFill(cx + dx, cy + dy);
          }
        }
      }
    };

    floodFill(x, y);
    setGrid(newGrid);

    // Check win
    const won = newGrid.every(row => row.every(cell => cell.isMine || cell.isRevealed));
    if (won) setStatus('won');
  };

  const revealAll = (g: Cell[][]) => {
    g.forEach(row => row.forEach(c => { if (c.isMine) c.isRevealed = true; }));
    setGrid(g);
  };

  const toggleFlag = (e: React.MouseEvent, x: number, y: number) => {
    e.preventDefault();
    if (status !== 'playing' || grid[y][x].isRevealed) return;
    const newGrid = [...grid.map(row => [...row])];
    newGrid[y][x].isFlagged = !newGrid[y][x].isFlagged;
    setGrid(newGrid);
  };

  return (
    <div className="flex flex-col items-center bg-gray-300 p-4 h-full font-sans select-none overflow-hidden">
      <div className="w-full flex justify-between bg-gray-200 win-border-inset p-2 mb-4">
        <div className="win-border-inset bg-black text-red-600 px-2 font-mono text-xl">015</div>
        <button onClick={initGrid} className="win-border bg-gray-300 px-2 text-xl hover:bg-gray-200 active:win-border-inset">
          {status === 'playing' ? '🙂' : status === 'won' ? '😎' : '😵'}
        </button>
        <div className="win-border-inset bg-black text-red-600 px-2 font-mono text-xl">000</div>
      </div>

      <div className="win-border-inset p-1 bg-gray-400">
        <div className="grid gap-0" style={{ gridTemplateColumns: `repeat(${SIZE}, 24px)` }}>
          {grid.map((row, y) => 
            row.map((cell, x) => (
              <div 
                key={`${y}-${x}`}
                onClick={() => reveal(x, y)}
                onContextMenu={(e) => toggleFlag(e, x, y)}
                className={`w-6 h-6 flex items-center justify-center text-xs font-bold transition-all ${
                  cell.isRevealed ? 'win-border-inset bg-gray-200' : 'win-border bg-gray-300 hover:bg-gray-200 cursor-pointer'
                }`}
              >
                {cell.isRevealed ? (
                  cell.isMine ? <Bomb size={14} className="text-black" /> : 
                  cell.neighborMines > 0 ? (
                    <span style={{ color: ['','blue','green','red','navy','maroon','teal','black','gray'][cell.neighborMines] }}>
                      {cell.neighborMines}
                    </span>
                  ) : null
                ) : cell.isFlagged ? (
                  <Flag size={12} className="text-red-600" fill="currentColor" />
                ) : null}
              </div>
            ))
          )}
        </div>
      </div>
      
      <p className="mt-4 text-[9px] text-gray-600 uppercase font-mono italic">Rights Reserved (C) 2002 MS_ENTERTAINMENT</p>
    </div>
  );
};
