
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Sparkles, Send, Loader2 } from 'lucide-react';

export const AISearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResponse(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const result = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `User Input: "${query}"`,
        config: {
          systemInstruction: "You are 'The Couture Critic v2.0', a grumpy, elite fashion critic from the year 2002. You are absolutely obsessed with the Y2K aesthetic. Keep it concise and biting."
        }
      });
      setResponse(result.text || "NO_RESPONSE_LOGGED.");
    } catch (error) {
      setResponse("SYSTEM ERROR: Your lack of fashion sense has crashed my sophisticated circuits.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#e0e0e0] p-4 font-mono">
      <div className="mb-4 bg-gray-900 text-white px-2 py-1 win-border-inset flex items-center gap-2">
        <Sparkles size={14} className="text-pink-400" />
        <span className="text-[10px] font-bold uppercase tracking-widest">COUTURE_CRITIC_OS.exe</span>
      </div>
      <div className="flex-1 overflow-auto bg-white win-border-inset mb-4 p-4 text-sm flex flex-col gap-4 shadow-inner">
        {response ? (
          <div className="animate-in fade-in slide-in-from-top-1">
            <div className="text-red-600 font-bold mb-2 border-b border-red-100 pb-1">CRITIC_VERDICT:</div>
            <div className="text-gray-800 italic leading-relaxed whitespace-pre-wrap font-sans">"{response}"</div>
          </div>
        ) : (
          <div className="text-gray-400 italic text-xs">> Awaiting a request...</div>
        )}
        {loading && <div className="text-pink-600 font-bold animate-pulse text-xs mt-auto">EVALUATING...</div>}
      </div>
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask for advice..."
          className="flex-1 win-border-inset px-3 py-2 text-sm bg-white"
        />
        <button type="submit" disabled={loading} className="win-border bg-gray-300 px-6 py-2 font-bold text-xs">RUN</button>
      </form>
    </div>
  );
};
