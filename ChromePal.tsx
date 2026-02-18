
import React, { useState, useEffect, useCallback } from 'react';
import { Paperclip, X } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

export const ChromePal: React.FC = () => {
  const [message, setMessage] = useState("Soll ich das Betriebssystem für dich löschen?");
  const [isThinking, setIsThinking] = useState(false);
  const [pos, setPos] = useState({ top: '70%', left: '80%' });

  const teleport = useCallback(() => {
    const newTop = Math.floor(Math.random() * 70) + 15;
    const newLeft = Math.floor(Math.random() * 70) + 15;
    setPos({ top: `${newTop}%`, left: `${newLeft}%` });
  }, []);

  const generateNewQuote = async () => {
    setIsThinking(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const result = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: "Gib mir einen trockenen Spruch von Clippy. Maximal 12 Wörter. Deutsch.",
        config: {
          systemInstruction: "Du bist Chrome-y, eine Büroklammer aus dem Jahr 2002 mit einer existenziellen Krise."
        }
      });
      setMessage(result.text || "Cache voll.");
    } catch (e) {
      setMessage("Kein RAM mehr.");
    } finally {
      setIsThinking(false);
    }
  };

  const handleInteraction = (e: React.MouseEvent) => {
    e.stopPropagation();
    generateNewQuote();
    teleport();
  };

  return (
    <div 
      className="fixed z-[10000] flex flex-col items-center pointer-events-none transition-all duration-500 ease-in-out"
      style={{ top: pos.top, left: pos.left, transform: 'translate(-50%, -50%)' }}
    >
      <div className="mb-2 relative pointer-events-auto cursor-help">
        <div className="win-border bg-[#ffffcc] p-3 w-[180px] shadow-lg text-[11px] border-black">
          <div className="min-h-[30px] flex items-center">
            {isThinking ? <span className="animate-pulse">...</span> : <span>"{message}"</span>}
          </div>
        </div>
      </div>
      <div onClick={handleInteraction} className="pointer-events-auto cursor-pointer flex flex-col items-center">
        <div className="p-3 bg-gray-400 rounded-full win-border border-gray-600">
          <Paperclip className="text-blue-900" size={32} />
        </div>
        <span className="mt-1 text-[8px] font-bold text-white bg-black/60 px-2 py-0.5">Chrome-y v2.002</span>
      </div>
    </div>
  );
};
