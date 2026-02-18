
import React, { useState, useEffect, useRef } from 'react';

export const PongGame: React.FC = () => {
  const [paddleY, setPaddleY] = useState(100);
  const [cpuY, setCpuY] = useState(100);
  const [ball, setBall] = useState({ x: 150, y: 100, dx: 3, dy: 3 });
  const [score, setScore] = useState({ p: 0, c: 0 });
  const [gameOver, setGameOver] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        const newY = Math.max(0, Math.min(160, clientY - rect.top - 20));
        setPaddleY(newY);
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

        // CPU tracking
        setCpuY(cy => {
            const diff = y - (cy + 20);
            return cy + diff * 0.1;
        });

        if (y <= 0 || y >= 195) dy *= -1;

        // Paddles
        if (x <= 15 && y >= paddleY && y <= paddleY + 40) { dx = Math.abs(dx); x = 15; }
        if (x >= 285 && y >= cpuY && y <= cpuY + 40) { dx = -Math.abs(dx); x = 285; }

        if (x < 0) { setScore(s => ({ ...s, c: s.c + 1 })); return { x: 150, y: 100, dx: 3, dy: 3 }; }
        if (x > 300) { setScore(s => ({ ...s, p: s.p + 1 })); return { x: 150, y: 100, dx: -3, dy: 3 }; }

        return { x, y, dx, dy };
      });
    }, 16);
    return () => clearInterval(interval);
  }, [paddleY, cpuY, gameOver]);

  return (
    <div className="flex flex-col items-center bg-black h-full p-4 font-mono select-none overflow-hidden" ref={containerRef}>
      <div className="w-full flex justify-between text-blue-400 mb-2 border-b border-blue-900 pb-1 text-xs">
        <span>PONG_ETHERNET_v1</span>
        <span>{score.p} : {score.c}</span>
      </div>
      <div className="relative w-[300px] h-[200px] bg-[#000022] win-border-inset overflow-hidden">
        <div className="absolute left-[150px] inset-y-0 w-[1px] bg-white/20" />
        <div className="absolute w-2 h-10 bg-white win-border" style={{ top: paddleY, left: 5 }} />
        <div className="absolute w-2 h-10 bg-white win-border" style={{ top: cpuY, right: 5 }} />
        <div className="absolute w-2 h-2 bg-blue-400 shadow-[0_0_8px_#3b82f6] rounded-full" style={{ left: ball.x, top: ball.y }} />
      </div>
      <p className="mt-4 text-[8px] text-gray-500 uppercase tracking-tighter italic">Move_mouse_to_control_paddle.dll</p>
    </div>
  );
};
