
import React, { useState, useEffect, useCallback, useRef } from 'react';

const COLS = 10;
const ROWS = 20;

const SHAPES = {
  I: [[1, 1, 1, 1]],
  J: [[1, 0, 0], [1, 1, 1]],
  L: [[0, 0, 1], [1, 1, 1]],
  O: [[1, 1], [1, 1]],
  S: [[0, 1, 1], [1, 1, 0]],
  T: [[0, 1, 0], [1, 1, 1]],
  Z: [[1, 1, 0], [0, 1, 1]],
};

const COLORS = ['#00FFFF', '#0000FF', '#FFA500', '#FFFF00', '#00FF00', '#800080', '#FF0000'];

export const TetrisGame: React.FC = () => {
  const [grid, setGrid] = useState<string[][]>(Array(ROWS).fill(null).map(() => Array(COLS).fill('')));
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [activePiece, setActivePiece] = useState<{ x: number, y: number, shape: number[][], color: string } | null>(null);
  const timerRef = useRef<number | null>(null);

  const spawnPiece = useCallback(() => {
    const keys = Object.keys(SHAPES) as Array<keyof typeof SHAPES>;
    const type = keys[Math.floor(Math.random() * keys.length)];
    const shape = SHAPES[type];
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    
    const piece = {
      x: Math.floor(COLS / 2) - Math.floor(shape[0].length / 2),
      y: 0,
      shape,
      color
    };

    if (checkCollision(piece.x, piece.y, shape)) {
      setGameOver(true);
    } else {
      setActivePiece(piece);
    }
  }, [grid]);

  const checkCollision = (x: number, y: number, shape: number[][], currentGrid = grid) => {
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c]) {
          const newX = x + c;
          const newY = y + r;
          if (newX < 0 || newX >= COLS || newY >= ROWS || (newY >= 0 && currentGrid[newY][newX])) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const lockPiece = useCallback(() => {
    if (!activePiece) return;
    const newGrid = [...grid.map(row => [...row])];
    activePiece.shape.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (cell) {
          if (activePiece.y + r >= 0) {
            newGrid[activePiece.y + r][activePiece.x + c] = activePiece.color;
          }
        }
      });
    });

    // Clear lines
    let linesCleared = 0;
    const finalGrid = newGrid.filter(row => {
      const isFull = row.every(cell => cell !== '');
      if (isFull) linesCleared++;
      return !isFull;
    });

    while (finalGrid.length < ROWS) {
      finalGrid.unshift(Array(COLS).fill(''));
    }

    setGrid(finalGrid);
    setScore(s => s + (linesCleared * 100));
    setActivePiece(null);
    spawnPiece();
  }, [activePiece, grid, spawnPiece]);

  const move = (dx: number, dy: number) => {
    if (!activePiece || gameOver) return;
    if (!checkCollision(activePiece.x + dx, activePiece.y + dy, activePiece.shape)) {
      setActivePiece(prev => prev ? ({ ...prev, x: prev.x + dx, y: prev.y + dy }) : null);
    } else if (dy > 0) {
      lockPiece();
    }
  };

  const rotate = () => {
    if (!activePiece || gameOver) return;
    const rotated = activePiece.shape[0].map((_, i) => activePiece.shape.map(row => row[i]).reverse());
    if (!checkCollision(activePiece.x, activePiece.y, rotated)) {
      setActivePiece(prev => prev ? ({ ...prev, shape: rotated }) : null);
    }
  };

  useEffect(() => {
    if (!activePiece && !gameOver) spawnPiece();
  }, [activePiece, gameOver, spawnPiece]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') move(-1, 0);
      if (e.key === 'ArrowRight') move(1, 0);
      if (e.key === 'ArrowDown') move(0, 1);
      if (e.key === 'ArrowUp') rotate();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activePiece, gameOver]);

  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => move(0, 1), 800);
    return () => clearInterval(interval);
  }, [activePiece, gameOver]);

  const renderGrid = () => {
    const displayGrid = grid.map(row => [...row]);
    if (activePiece) {
      activePiece.shape.forEach((row, r) => {
        row.forEach((cell, c) => {
          if (cell && activePiece.y + r >= 0) {
            displayGrid[activePiece.y + r][activePiece.x + c] = activePiece.color;
          }
        });
      });
    }
    return displayGrid;
  };

  return (
    <div className="flex flex-col items-center bg-black p-4 h-full overflow-hidden">
      <div className="mb-4 text-sky-400 font-mono text-lg flex justify-between w-full border-b border-sky-900 pb-2 uppercase tracking-tighter">
        <span>TETRIS_CORE</span>
        <span className="text-white">PTS: {score}</span>
      </div>
      
      <div className="win-border-inset p-1 bg-gray-900 shadow-[0_0_15px_rgba(0,120,255,0.2)]">
        <div className="grid gap-[1px]" style={{ gridTemplateColumns: `repeat(${COLS}, 15px)`, gridTemplateRows: `repeat(${ROWS}, 15px)` }}>
          {renderGrid().map((row, y) => 
            row.map((cell, x) => (
              <div 
                key={`${y}-${x}`} 
                className="w-[15px] h-[15px] border border-black/20"
                style={{ backgroundColor: cell || '#111' }}
              />
            ))
          )}
        </div>
      </div>

      {gameOver && (
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-50">
          <h2 className="text-red-600 font-black italic text-2xl animate-pulse">CRASHED.EXE</h2>
          <p className="text-white text-xs font-mono mb-4">Final Score: {score}</p>
          <button 
            onClick={() => { setGrid(Array(ROWS).fill(null).map(() => Array(COLS).fill(''))); setScore(0); setGameOver(false); }}
            className="win-border bg-gray-300 px-4 py-1 text-xs font-bold"
          >REBOOT</button>
        </div>
      )}
      
      <div className="mt-4 grid grid-cols-4 gap-1 w-full text-[9px]">
        <button onClick={() => move(-1, 0)} className="win-border bg-gray-300 p-2 font-bold uppercase hover:bg-gray-200">L</button>
        <button onClick={() => rotate()} className="win-border bg-gray-300 p-2 font-bold uppercase hover:bg-gray-200">ROT</button>
        <button onClick={() => move(1, 0)} className="win-border bg-gray-300 p-2 font-bold uppercase hover:bg-gray-200">R</button>
        <button onClick={() => move(0, 1)} className="win-border bg-gray-300 p-2 font-bold uppercase hover:bg-gray-200">DROP</button>
      </div>
    </div>
  );
};
