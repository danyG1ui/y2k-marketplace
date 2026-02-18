
import React, { useState, useEffect, useCallback } from 'react';

const SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIR = { x: 1, y: 0 };

export const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [dir, setDir] = useState(INITIAL_DIR);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const spawnFood = useCallback((currentSnake: any[]) => {
    let newFood;
    while (true) {
      newFood = { x: Math.floor(Math.random() * SIZE), y: Math.floor(Math.random() * SIZE) };
      if (!currentSnake.some(s => s.x === newFood.x && s.y === newFood.y)) break;
    }
    setFood(newFood);
  }, []);

  const move = useCallback(() => {
    if (gameOver) return;
    setSnake(prev => {
      const head = prev[0];
      const newHead = { x: head.x + dir.x, y: head.y + dir.y };

      if (newHead.x < 0 || newHead.x >= SIZE || newHead.y < 0 || newHead.y >= SIZE || 
          prev.some(s => s.x === newHead.x && s.y === newHead.y)) {
        setGameOver(true);
        return prev;
      }

      const newSnake = [newHead, ...prev];
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 1);
        spawnFood(newSnake);
      } else {
        newSnake.pop();
      }
      return newSnake;
    });
  }, [dir, food, gameOver, spawnFood]);

  useEffect(() => {
    const interval = setInterval(move, 150 - Math.min(score * 2, 100));
    return () => clearInterval(interval);
  }, [move, score]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' && dir.y === 0) setDir({ x: 0, y: -1 });
      if (e.key === 'ArrowDown' && dir.y === 0) setDir({ x: 0, y: 1 });
      if (e.key === 'ArrowLeft' && dir.x === 0) setDir({ x: -1, y: 0 });
      if (e.key === 'ArrowRight' && dir.x === 0) setDir({ x: 1, y: 0 });
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [dir]);

  return (
    <div className="flex flex-col items-center bg-black h-full p-4 font-mono overflow-hidden">
      <div className="w-full flex justify-between text-green-400 mb-2 border-b border-green-900 pb-1 text-xs">
        <span>SNAKE_CORE_v1</span>
        <span>SCORE: {score}</span>
      </div>
      <div className="relative bg-[#001100] win-border-inset p-1" style={{ width: SIZE * 12, height: SIZE * 12 }}>
        {Array(SIZE).fill(0).map((_, y) => (
          <div key={y} className="flex">
            {Array(SIZE).fill(0).map((_, x) => {
              const isSnake = snake.some(s => s.x === x && s.y === y);
              const isFood = food.x === x && food.y === y;
              return (
                <div key={x} className={`w-[12px] h-[12px] ${isSnake ? 'bg-green-500 shadow-[0_0_5px_#0f0]' : isFood ? 'bg-red-500 animate-pulse' : ''}`} />
              );
            })}
          </div>
        ))}
      </div>
      {gameOver && (
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-50">
          <h2 className="text-red-600 font-bold text-xl italic animate-pulse uppercase">SYSTEM_CRASH</h2>
          <button onClick={() => { setSnake(INITIAL_SNAKE); setDir(INITIAL_DIR); setGameOver(false); setScore(0); }} className="mt-4 win-border bg-gray-300 px-4 py-1 text-xs font-bold uppercase">Reset</button>
        </div>
      )}
      <div className="mt-4 grid grid-cols-3 gap-1 w-24">
        <div /> <button onClick={() => setDir({ x: 0, y: -1 })} className="win-border bg-gray-300 p-2 text-[8px]">▲</button> <div />
        <button onClick={() => setDir({ x: -1, y: 0 })} className="win-border bg-gray-300 p-2 text-[8px]">◀</button>
        <button onClick={() => setDir({ x: 0, y: 1 })} className="win-border bg-gray-300 p-2 text-[8px]">▼</button>
        <button onClick={() => setDir({ x: 1, y: 0 })} className="win-border bg-gray-300 p-2 text-[8px]">▶</button>
      </div>
    </div>
  );
};
