
import React, { useState, useEffect, useCallback } from 'react';

type PieceType = 'p' | 'r' | 'n' | 'b' | 'q' | 'k';
type Color = 'w' | 'b';
type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

interface Piece {
  type: PieceType;
  color: Color;
}

const pieceValues: Record<PieceType, number> = {
  p: 1, n: 3, b: 3, r: 5, q: 9, k: 100
};

const initialBoard: (Piece | null)[][] = [
  [{ type: 'r', color: 'b' }, { type: 'n', color: 'b' }, { type: 'b', color: 'b' }, { type: 'q', color: 'b' }, { type: 'k', color: 'b' }, { type: 'b', color: 'b' }, { type: 'n', color: 'b' }, { type: 'r', color: 'b' }],
  Array(8).fill(null).map(() => ({ type: 'p', color: 'b' })),
  Array(8).fill(null), Array(8).fill(null), Array(8).fill(null), Array(8).fill(null),
  Array(8).fill(null).map(() => ({ type: 'p', color: 'w' })),
  [{ type: 'r', color: 'w' }, { type: 'n', color: 'w' }, { type: 'b', color: 'w' }, { type: 'q', color: 'w' }, { type: 'k', color: 'w' }, { type: 'b', color: 'w' }, { type: 'n', color: 'w' }, { type: 'r', color: 'w' }],
];

const pieceUnicode: Record<string, string> = {
  'w-k': '♔', 'w-q': '♕', 'w-r': '♖', 'w-b': '♗', 'w-n': '♘', 'w-p': '♙',
  'b-k': '♚', 'b-q': '♛', 'b-r': '♜', 'b-b': '♝', 'b-n': '♞', 'b-p': '♟︎',
};

export const ChessGame: React.FC = () => {
  const [board, setBoard] = useState<(Piece | null)[][]>(initialBoard);
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [turn, setTurn] = useState<Color>('w');
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [isCpuThinking, setIsCpuThinking] = useState(false);

  const isOOB = (r: number, c: number) => r < 0 || r >= 8 || c < 0 || c >= 8;

  const getValidMoves = useCallback((row: number, col: number, currentBoard: (Piece | null)[][]) => {
    const piece = currentBoard[row][col];
    if (!piece) return [];
    const moves: [number, number][] = [];
    const color = piece.color;

    const addSlidingMoves = (directions: [number, number][]) => {
      for (const [dr, dc] of directions) {
        let r = row + dr;
        let c = col + dc;
        while (!isOOB(r, c)) {
          const target = currentBoard[r][c];
          if (!target) {
            moves.push([r, c]);
          } else {
            if (target.color !== color) moves.push([r, c]);
            break; // Stop at obstacle
          }
          r += dr;
          c += dc;
        }
      }
    };

    if (piece.type === 'p') {
       const dir = color === 'w' ? -1 : 1;
       const startRow = color === 'w' ? 6 : 1;
       // Forward
       if (!isOOB(row + dir, col) && !currentBoard[row + dir][col]) {
          moves.push([row + dir, col]);
          if (row === startRow && !currentBoard[row + 2 * dir][col]) {
             moves.push([row + 2 * dir, col]);
          }
       }
       // Capture
       for (const dc of [-1, 1]) {
          if (!isOOB(row + dir, col + dc)) {
             const target = currentBoard[row + dir][col + dc];
             if (target && target.color !== color) moves.push([row + dir, col + dc]);
          }
       }
    } else if (piece.type === 'r') {
       addSlidingMoves([[1, 0], [-1, 0], [0, 1], [0, -1]]);
    } else if (piece.type === 'b') {
       addSlidingMoves([[1, 1], [1, -1], [-1, 1], [-1, -1]]);
    } else if (piece.type === 'q') {
       addSlidingMoves([[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]);
    } else if (piece.type === 'n') {
       const jumps: [number, number][] = [[2, 1], [2, -1], [-2, 1], [-2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2]];
       for (const [dr, dc] of jumps) {
          const r = row + dr;
          const c = col + dc;
          if (!isOOB(r, c)) {
             const target = currentBoard[r][c];
             if (!target || target.color !== color) moves.push([r, c]);
          }
       }
    } else if (piece.type === 'k') {
       for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
             if (dr === 0 && dc === 0) continue;
             const r = row + dr;
             const c = col + dc;
             if (!isOOB(r, c)) {
                const target = currentBoard[r][c];
                if (!target || target.color !== color) moves.push([r, c]);
             }
          }
       }
    }
    return moves;
  }, []);

  const makeMove = useCallback((fromR: number, fromC: number, toR: number, toC: number) => {
    setBoard(prev => {
        const newBoard = prev.map(r => [...r]);
        newBoard[toR][toC] = newBoard[fromR][fromC];
        newBoard[fromR][fromC] = null;
        return newBoard;
    });
    setTurn(t => t === 'w' ? 'b' : 'w');
  }, []);

  const cpuMove = useCallback(() => {
    setIsCpuThinking(true);
    setTimeout(() => {
      const allMoves: {from: [number, number], to: [number, number], score: number}[] = [];
      
      board.forEach((row, r) => {
        row.forEach((piece, c) => {
          if (piece && piece.color === 'b') {
            const valid = getValidMoves(r, c, board);
            valid.forEach(([tr, tc]) => {
              let score = Math.random();
              const target = board[tr][tc];
              if (target) score += pieceValues[target.type] * 10;
              
              if (difficulty === 'HARD') {
                score += (3 - Math.abs(3.5 - tr)) + (3 - Math.abs(3.5 - tc));
              }
              allMoves.push({ from: [r, c], to: [tr, tc], score });
            });
          }
        });
      });

      if (allMoves.length > 0) {
        allMoves.sort((a, b) => b.score - a.score);
        const best = difficulty === 'EASY' 
          ? allMoves[Math.floor(Math.random() * allMoves.length)]
          : allMoves[0];
        
        makeMove(best.from[0], best.from[1], best.to[0], best.to[1]);
      }
      setIsCpuThinking(false);
    }, 1000);
  }, [board, difficulty, getValidMoves, makeMove]);

  useEffect(() => {
    if (turn === 'b' && !isCpuThinking && difficulty) {
      cpuMove();
    }
  }, [turn, difficulty, cpuMove, isCpuThinking]);

  const handleClick = (row: number, col: number) => {
    if (turn !== 'w' || isCpuThinking) return;
    const piece = board[row][col];

    if (selected) {
      const [sRow, sCol] = selected;
      if (sRow === row && sCol === col) { setSelected(null); return; }
      
      const validMoves = getValidMoves(sRow, sCol, board);
      const isValid = validMoves.some(([vr, vc]) => vr === row && vc === col);
      
      if (isValid) {
        makeMove(sRow, sCol, row, col);
        setSelected(null);
      } else if (piece && piece.color === 'w') {
        setSelected([row, col]);
      }
    } else if (piece && piece.color === 'w') {
      setSelected([row, col]);
    }
  };

  if (!difficulty) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-200 font-mono p-4 border-black">
        <div className="win-border bg-blue-900 text-white p-4 w-full text-center mb-6 shadow-xl italic">
          <h2 className="text-xl font-black chrome-text">CHESS_ENGINE_v2.0</h2>
          <p className="text-[10px] opacity-70">SELECT_DIFFICULTY_TO_INITIALIZE</p>
        </div>
        <div className="flex flex-col gap-3 w-48">
          {(['EASY', 'MEDIUM', 'HARD'] as Difficulty[]).map(d => (
            <button 
              key={d} 
              onClick={() => setDifficulty(d)}
              className="win-border bg-gray-300 py-3 font-bold hover:bg-gray-100 active:win-border-inset text-blue-900"
            >
              {d}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center bg-gray-200 h-full p-2 font-mono select-none overflow-hidden relative">
      <div className="w-full flex justify-between bg-gray-300 win-border p-2 mb-2 text-[10px] font-bold text-blue-900 border-black">
        <span>LVL: {difficulty}</span>
        <span className={isCpuThinking ? 'animate-pulse text-red-600' : ''}>
          {isCpuThinking ? 'CPU_THINKING...' : turn === 'w' ? 'YOUR_TURN' : 'CPU_TURN'}
        </span>
      </div>

      <div className="win-border-inset p-1 bg-gray-800 shadow-xl">
        <div className="grid grid-cols-8 grid-rows-8 border border-black bg-white">
          {board.map((row, rIdx) => 
            row.map((piece, cIdx) => {
              const isDark = (rIdx + cIdx) % 2 === 1;
              const isSelected = selected?.[0] === rIdx && selected?.[1] === cIdx;
              const isValidTarget = selected && getValidMoves(selected[0], selected[1], board).some(([vr, vc]) => vr === rIdx && vc === cIdx);
              
              return (
                <div 
                  key={`${rIdx}-${cIdx}`}
                  onClick={() => handleClick(rIdx, cIdx)}
                  className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-3xl cursor-pointer transition-all ${
                    isDark ? 'bg-[#b58863]' : 'bg-[#f0d9b5]'
                  } ${isSelected ? 'ring-inset ring-4 ring-blue-500 bg-blue-200' : ''} relative`}
                >
                  {isValidTarget && <div className="absolute w-2 h-2 bg-black/20 rounded-full"></div>}
                  {piece && (
                    <span className={`drop-shadow-sm z-10 ${piece.color === 'w' ? 'text-white' : 'text-black'}`} style={{ WebkitTextStroke: piece.color === 'w' ? '1px black' : 'none' }}>
                      {pieceUnicode[`${piece.color}-${piece.type}`]}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      <button onClick={() => setDifficulty(null)} className="mt-4 win-border bg-gray-300 px-4 py-1 text-[10px] font-bold">REBOOT_SYSTEM</button>
    </div>
  );
};
