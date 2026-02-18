
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Palette, Loader2, Download, Zap, RefreshCw } from 'lucide-react';

export const DreamMachine: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      // Using gemini-2.5-flash-image for image generation
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: `${prompt}. Y2K aesthetic, retro-futurism, high glossy chrome, 2000s tech vibe, bright blues and silvers.` }]
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1"
          }
        }
      });

      let foundImage = null;
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          foundImage = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          break;
        }
      }

      if (foundImage) {
        setResult(foundImage);
        setHistory(prev => [foundImage, ...prev].slice(0, 5));
      } else {
        throw new Error("No image data returned.");
      }
    } catch (error) {
      console.error(error);
      alert("ENGINE_ERROR: Failed to visualize your dream. Check your connection to the grid.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#c0c0c0] font-sans">
      <div className="bg-[#000080] text-white px-2 py-1 flex justify-between items-center text-[10px] font-bold">
        <div className="flex items-center gap-1">
          <Palette size={12} />
          <span>DREAM_MACHINE_RENDERER_v1.0</span>
        </div>
        <Zap size={10} className="text-yellow-400 animate-pulse" />
      </div>

      <div className="flex-1 overflow-auto p-4 flex flex-col gap-4">
        <div className="win-border-inset bg-black aspect-square relative overflow-hidden flex items-center justify-center shadow-2xl">
          {result ? (
            <img src={result} alt="AI Generated" className="w-full h-full object-cover animate-in fade-in zoom-in duration-700" />
          ) : (
            <div className="text-blue-900/40 text-center flex flex-col items-center gap-2">
              <RefreshCw size={48} className={loading ? 'animate-spin' : ''} />
              <p className="text-[10px] font-black uppercase tracking-widest italic">Awaiting Visualization Prompt...</p>
            </div>
          )}
          
          {loading && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-4 z-20">
              <Loader2 className="text-pink-500 animate-spin" size={48} />
              <div className="w-48 h-2 bg-gray-800 win-border-inset overflow-hidden">
                <div className="h-full bg-blue-500 animate-[progress_2s_infinite]"></div>
              </div>
              <p className="text-white text-[9px] font-mono animate-pulse">RENDERING_VIRTUAL_ASSETS...</p>
            </div>
          )}
        </div>

        <form onSubmit={handleGenerate} className="flex flex-col gap-2">
          <label className="text-[10px] font-bold text-blue-900 italic">INPUT_DESCRIPTION:</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="A futuristic chrome dolphin..." 
              className="flex-1 win-border-inset px-3 py-2 text-xs bg-white outline-none focus:bg-blue-50"
            />
            <button 
              type="submit" 
              disabled={loading}
              className="win-border xp-button px-6 font-bold text-xs uppercase text-blue-900 disabled:opacity-50"
            >
              RUN
            </button>
          </div>
        </form>

        {history.length > 0 && (
          <div className="mt-4">
            <span className="text-[9px] font-bold text-gray-500 uppercase italic">Recent_Dreams:</span>
            <div className="flex gap-2 mt-1 overflow-x-auto pb-2 no-scrollbar">
              {history.map((img, i) => (
                <div key={i} className="w-16 h-16 win-border shrink-0 cursor-pointer hover:scale-105 transition-transform" onClick={() => setResult(img)}>
                  <img src={img} alt="History" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-2 bg-gray-300 win-border border-t flex justify-between items-center text-[8px] font-mono">
        <span className="text-blue-700">GPU: RENDER_ENABLED</span>
        <span className="opacity-50">© 2002 NANO_BANANA_TECH</span>
      </div>

      <style>{`
        @keyframes progress {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
};
