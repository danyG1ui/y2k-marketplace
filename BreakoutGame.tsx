
import React, { useState, useEffect, useRef } from 'react';

const COLS = 6;
const ROWS = 4;

export const BreakoutGame: React.FC = () => {
  const [paddleX, setPaddleX] = useState(120);
  const [ball, setBall] = useState({ x: 150, y: 150, dx: 2, dy: -2 });
  const [bricks, setBricks] = useState<boolean[][]>(Array(ROWS).fill(0).map(() => Array(COLS).fill(true)));
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const resetGame = () => {
    setPaddleX(120);
    setBall({ x: 150, y: 150, dx: 2, dy: -2 });
    setBricks(Array(ROWS).fill(0).map(() => Array(COLS).fill(true)));
    setScore(0);
    setGameOver(false);
  };

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const newX = Math.max(0, Math.min(260, clientX - rect.left - 20));
        setPaddleX(newX);
      }
    };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
    };
  }, []);

  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setBall(prev => {
        let { x, y, dx, dy } = prev;
        x += dx; y += dy;

        if (x <= 0 || x >= 290) dx *= -1;
        if (y <= 0) dy *= -1;

        // Paddle
        if (y >= 185 && x >= paddleX && x <= paddleX + 40) {
          dy = -Math.abs(dy);
          y = 185;
        }

        // Brick collision
        const bx = Math.floor(x / 50);
        const by = Math.floor(y / 15);
        if (by >= 0 && by < ROWS && bx >= 0 && bx < COLS && bricks[by][bx]) {
          const newBricks = bricks.map(r => [...r]);
          newBricks[by][bx] = false;
          setBricks(newBricks);
          dy *= -1;
          setScore(s => s + 10);
        }

        if (y > 200) { setGameOver(true); return prev; }
        return { x, y, dx, dy };
      });
    }, 16);
    return () => clearInterval(interval);
  }, [paddleX, bricks, gameOver]);

  return (
    <div className="flex flex-col items-center bg-black h-full p-4 font-mono select-none overflow-hidden" ref={containerRef}>
      <div className="w-full flex justify-between text-pink-400 mb-2 border-b border-pink-900 pb-1 text-xs">
        <span>BREAKOUT.EXE</span>
        <span>SCORE: {score}</span>
      </div>
      <div className="relative w-[300px] h-[200px] bg-[#220022] win-border-inset overflow-hidden">
        {bricks.map((row, y) => row.map((active, x) => active && (
          <div key={`${x}-${y}`} className="absolute w-[46px] h-[10px] win-border bg-gradient-to-b from-pink-400 to-pink-600 m-[2px]" style={{ left: x * 50, top: y * 15 }} />
        )))}
        <div className="absolute w-10 h-3 bg-white win-border" style={{ bottom: 5, left: paddleX }} />
        <div className="absolute w-2 h-2 bg-yellow-400 shadow-[0_0_8px_#facc15] rounded-full" style={{ left: ball.x, top: ball.y }} />
      </div>
      {gameOver && (
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-50">
          <h2 className="text-red-500 font-bold text-xl italic animate-pulse">GAME_OVER.DLL</h2>
          <button onClick={resetGame} className="mt-4 win-border bg-gray-300 px-4 py-1 text-xs font-bold uppercase active:win-border-inset">RETRY</button>
        </div>
      )}
    </div>
  );
};
