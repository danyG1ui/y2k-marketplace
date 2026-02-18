
import React, { useState, useEffect, useCallback } from 'react';

const GRAVITY = 0.6;
const JUMP = -8;
const PIPE_SPEED = 3;
const PIPE_GAP = 70;

export const FlappyBirdGame: React.FC = () => {
  const [birdY, setBirdY] = useState(100);
  const [velocity, setVelocity] = useState(0);
  const [pipes, setPipes] = useState([{ x: 300, top: 50 }]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const resetGame = () => {
    setBirdY(100);
    setVelocity(0);
    setPipes([{ x: 300, top: 50 }]);
    setScore(0);
    setGameOver(false);
  };

  const jump = useCallback(() => {
    if (gameOver) return;
    setVelocity(JUMP);
  }, [gameOver]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.code === 'Space') jump(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [jump]);

  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setBirdY(y => y + velocity);
      setVelocity(v => v + GRAVITY);

      setPipes(prev => {
        let next = prev.map(p => ({ ...p, x: p.x - PIPE_SPEED }));
        if (next[0].x < -50) {
          next.shift();
          next.push({ x: 300, top: Math.random() * 100 + 20 });
          setScore(s => s + 1);
        }
        return next;
      });

      // Collisions
      if (birdY < 0 || birdY > 200) setGameOver(true);
      pipes.forEach(p => {
        if (p.x < 50 && p.x > 0) {
          if (birdY < p.top || birdY > p.top + PIPE_GAP) setGameOver(true);
        }
      });
    }, 24);
    return () => clearInterval(interval);
  }, [birdY, velocity, pipes, gameOver]);

  return (
    <div className="flex flex-col items-center bg-black h-full p-4 font-mono select-none overflow-hidden" onClick={jump}>
      <div className="w-full flex justify-between text-sky-400 mb-2 border-b border-sky-900 pb-1 text-xs">
        <span>FLAPPY_OS_v1.0</span>
        <span>SCORE: {score}</span>
      </div>
      <div className="relative w-[300px] h-[200px] bg-gradient-to-b from-sky-400 to-sky-100 win-border-inset overflow-hidden">
        <div className="absolute w-6 h-6 bg-yellow-400 win-border rounded-full flex items-center justify-center transition-transform" style={{ left: 20, top: birdY, transform: `rotate(${velocity * 3}deg)` }}>
          <div className="w-1 h-1 bg-black rounded-full mb-2 ml-2" />
        </div>
        {pipes.map((p, i) => (
          <React.Fragment key={i}>
            <div className="absolute w-12 bg-green-500 win-border" style={{ left: p.x, top: 0, height: p.top }} />
            <div className="absolute w-12 bg-green-500 win-border" style={{ left: p.x, bottom: 0, top: p.top + PIPE_GAP }} />
          </React.Fragment>
        ))}
      </div>
      <p className="mt-4 text-[8px] text-gray-500 uppercase tracking-tighter">Click_or_Space_to_Flap.dll</p>
      {gameOver && (
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-50">
          <h2 className="text-red-500 font-bold text-xl italic animate-pulse uppercase">BIRD_CRASHED</h2>
          <button onClick={(e) => { e.stopPropagation(); resetGame(); }} className="mt-4 win-border bg-gray-300 px-4 py-1 text-xs font-bold uppercase active:win-border-inset">RESTART</button>
        </div>
      )}
    </div>
  );
};
