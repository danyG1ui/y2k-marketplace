
import React, { useState, useEffect } from 'react';
import { Monitor, ShieldCheck, HardDrive, Cpu, Check } from 'lucide-react';

interface SetupWizardProps {
  onComplete: () => void;
}

export const SetupWizard: React.FC<SetupWizardProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (step === 3) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 1;
        });
      }, 30);
      return () => clearInterval(interval);
    }
  }, [step]);

  return (
    <div className="fixed inset-0 z-[100000] bg-[#008080] flex items-center justify-center font-sans p-4">
      <div className="win-border bg-gray-200 w-full max-w-[500px] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="glossy-header p-1 px-3 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <Monitor size={14} />
            <span className="text-[11px] font-bold uppercase tracking-tight">Y2K_OS v3.11 Setup</span>
          </div>
        </div>

        <div className="flex flex-1 min-h-[300px]">
          {/* Sidebar */}
          <div className="w-1/3 start-menu-gradient p-4 flex flex-col gap-4 text-white/50 border-r border-white/20">
            <ShieldCheck size={40} className={step >= 1 ? "text-white" : ""} />
            <HardDrive size={40} className={step >= 2 ? "text-white" : ""} />
            <Cpu size={40} className={step >= 3 ? "text-white" : ""} />
          </div>

          {/* Content */}
          <div className="flex-1 p-6 bg-white win-border-inset m-2 flex flex-col">
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-right-2">
                <h2 className="text-lg font-bold text-blue-900 mb-4 italic uppercase">Willkommen</h2>
                <p className="text-xs leading-relaxed text-gray-700">
                  Dieser Assistent bereitet Ihr System für den <span className="font-bold text-pink-600">CHROME_MARKETPLACE</span> vor. 
                  Bitte stellen Sie sicher, dass Ihr Modem mit mindestens 56k verbunden ist.
                </p>
                <div className="mt-6 p-2 bg-blue-50 border border-blue-200 text-[10px] italic">
                  HINWEIS: Alle Daten werden im virtuellen Cache zwischengespeichert.
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-right-2">
                <h2 className="text-lg font-bold text-blue-900 mb-4 italic uppercase">Lizenz</h2>
                <div className="win-border-inset p-2 h-32 overflow-y-auto text-[9px] font-mono bg-gray-50 mb-4">
                  END USER LICENSE AGREEMENT (EULA)<br/><br/>
                  1. Sie akzeptieren, dass alles in Chrome glänzen muss.<br/>
                  2. Sie verpflichten sich, Minesweeper mindestens einmal pro Sitzung zu spielen.<br/>
                  3. Der Couture Critic darf Ihre Outfits ohne Vorwarnung beleidigen.<br/>
                  4. Cyber-Vibes sind obligatorisch.
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="agree" defaultChecked className="win-border-inset" />
                  <label htmlFor="agree" className="text-[10px] font-bold uppercase">Ich akzeptiere die Cyber-Regeln</label>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-right-2 flex flex-col h-full">
                <h2 className="text-lg font-bold text-blue-900 mb-4 italic uppercase">Installation...</h2>
                <p className="text-[10px] mb-2 uppercase font-bold text-gray-500">Kopiere: C:/System/Vibes.dll</p>
                <div className="win-border-inset h-6 bg-gray-200 p-0.5 relative">
                  <div 
                    className="h-full bg-blue-600 transition-all duration-100 flex items-center justify-center overflow-hidden"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="w-full h-full bg-gradient-to-r from-blue-700 to-blue-400"></div>
                  </div>
                  <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white mix-blend-difference">
                    {progress}% COMPLETE
                  </span>
                </div>
                {progress === 100 && (
                  <div className="mt-4 text-green-600 flex items-center gap-2 font-bold animate-bounce text-xs uppercase italic">
                    <Check size={16} /> System bereit für Initialisierung!
                  </div>
                )}
              </div>
            )}

            <div className="mt-auto flex justify-end gap-2 border-t border-gray-100 pt-4">
              {step < 3 ? (
                <button 
                  onClick={() => setStep(step + 1)}
                  className="win-border bg-gray-300 px-6 py-1 text-xs font-bold uppercase hover:bg-white active:win-border-inset"
                >
                  Weiter
                </button>
              ) : (
                <button 
                  disabled={progress < 100}
                  onClick={onComplete}
                  className="win-border glossy-header text-white px-8 py-1 text-xs font-bold uppercase disabled:opacity-30 active:win-border-inset"
                >
                  Fertigstellen
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
