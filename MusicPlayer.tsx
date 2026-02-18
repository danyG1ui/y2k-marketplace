
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react';

interface Track {
  id: number;
  title: string;
  artist: string;
  url: string;
}

const PLAYLIST: Track[] = [
  { id: 1, title: 'CYBER_DREAM_2002', artist: 'CHROME_WAVE', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, title: 'LIQUID_CRYSTAL', artist: 'NEON_BUFFERS', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, title: '56K_NOSTALGIA', artist: 'DIALUP_KIDS', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];

export const MusicPlayer: React.FC = () => {
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = PLAYLIST[currentTrackIdx];

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const nextTrack = () => {
    setCurrentTrackIdx((prev) => (prev + 1) % PLAYLIST.length);
    setIsPlaying(false);
  };

  const prevTrack = () => {
    setCurrentTrackIdx((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
    setIsPlaying(false);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const updateProgress = () => {
        if (audio.duration) {
          setProgress((audio.currentTime / audio.duration) * 100);
        }
      };
      audio.addEventListener('timeupdate', updateProgress);
      return () => audio.removeEventListener('timeupdate', updateProgress);
    }
  }, []);

  return (
    <div className="flex flex-col h-full bg-gray-200 p-2 font-mono select-none overflow-hidden">
      {/* Audio Element */}
      <audio ref={audioRef} src={currentTrack.url} onEnded={nextTrack} />

      {/* Player Top Section */}
      <div className="win-border bg-black p-4 mb-2 flex flex-col gap-2 relative shadow-inner">
        <div className="flex justify-between items-center border-b border-blue-900/50 pb-2">
            <div className="flex flex-col">
                <span className="text-[9px] text-blue-400 font-bold tracking-widest uppercase">Playing Now</span>
                <span className="text-sm text-white font-black italic truncate max-w-[180px] chrome-text">{currentTrack.title}</span>
            </div>
            <div className="w-12 h-12 bg-blue-900/20 win-border-inset flex items-center justify-center">
                <div className={`w-8 h-8 rounded-full border-2 border-blue-400 flex items-center justify-center ${isPlaying ? 'animate-spin' : ''}`}>
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                </div>
            </div>
        </div>

        {/* Visualization Area */}
        <div className="h-12 flex items-end gap-1 px-2 overflow-hidden bg-gray-900 win-border-inset">
            {Array(20).fill(0).map((_, i) => (
                <div 
                    key={i} 
                    className="flex-1 bg-gradient-to-t from-blue-800 to-sky-400 transition-all duration-300"
                    style={{ height: isPlaying ? `${Math.random() * 80 + 20}%` : '10%' }}
                ></div>
            ))}
        </div>

        {/* Progress Bar */}
        <div className="h-4 bg-gray-800 win-border-inset mt-2 relative overflow-hidden cursor-pointer group">
            <div 
                className="h-full bg-blue-600 shadow-[0_0_10px_rgba(59,130,246,0.8)] transition-all duration-100"
                style={{ width: `${progress}%` }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center text-[7px] text-white opacity-50 group-hover:opacity-100 font-bold uppercase">
                {Math.floor(progress)}%_Loaded
            </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="flex flex-col gap-2 p-2 win-border bg-gray-300 shadow-sm">
        <div className="flex justify-center gap-2">
          <button onClick={prevTrack} className="win-border bg-gray-300 p-2 hover:bg-white active:win-border-inset">
            <SkipBack size={16} />
          </button>
          <button onClick={togglePlay} className="win-border bg-gray-300 px-6 py-2 hover:bg-white active:win-border-inset flex items-center gap-2 font-bold text-xs uppercase">
            {isPlaying ? <Pause size={16} fill="black" /> : <Play size={16} fill="black" />}
            {isPlaying ? 'PAUSE' : 'PLAY'}
          </button>
          <button onClick={nextTrack} className="win-border bg-gray-300 p-2 hover:bg-white active:win-border-inset">
            <SkipForward size={16} />
          </button>
        </div>
        
        <div className="flex items-center gap-2 px-2 mt-2">
            <Volume2 size={12} className="text-gray-600" />
            <div className="flex-1 h-2 bg-gray-400 win-border-inset">
                <div className="w-3/4 h-full bg-gray-600"></div>
            </div>
        </div>
      </div>

      {/* Playlist Section */}
      <div className="mt-4 flex-1 flex flex-col gap-1 overflow-y-auto win-border-inset bg-white p-1">
        <span className="text-[9px] font-bold text-gray-400 px-1 border-b border-gray-100 mb-1 uppercase italic">C:/Music/Playlist</span>
        {PLAYLIST.map((track, i) => (
            <button 
                key={track.id}
                onClick={() => { setCurrentTrackIdx(i); setIsPlaying(false); }}
                className={`flex items-center justify-between px-2 py-1.5 text-[10px] text-left transition-colors ${currentTrackIdx === i ? 'bg-blue-600 text-white font-bold' : 'hover:bg-blue-50 text-gray-700'}`}
            >
                <span className="truncate">{i + 1}. {track.title}.mp3</span>
                <span className="opacity-50 text-[8px]">{track.artist}</span>
            </button>
        ))}
      </div>

      <div className="mt-2 text-[8px] text-gray-400 flex justify-between uppercase">
        <span>Bitrate: 128kbps</span>
        <span>Y2K_Player_Active</span>
      </div>
    </div>
  );
};
