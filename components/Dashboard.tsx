
import React from 'react';
import { GameStats } from '../types';
import { Target, Zap, Activity, Info, Camera, Wind } from 'lucide-react';

interface Props {
  stats: GameStats;
}

export const Dashboard: React.FC<Props> = ({ stats }) => {
  const { lastShot, history } = stats;

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Photo Evidence & Feedback */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
        <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
          <Camera size={14} className="text-lime-500" />
          Photo Evidence
        </h3>

        {lastShot ? (
          <div className="animate-in fade-in zoom-in-95 duration-300">
            {lastShot.snapshot && (
              <div className="mb-4 rounded-xl overflow-hidden border border-slate-700 aspect-video relative">
                <img src={lastShot.snapshot} alt="Swing Snapshot" className="w-full h-full object-cover" />
                <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-mono text-lime-400">
                  IMPACT DETECTED
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl font-black text-white italic">{lastShot.type}</span>
              <div className="flex items-center gap-1 bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs font-bold">
                <Wind size={12} />
                {lastShot.spin}
              </div>
            </div>
            
            <p className="text-lg text-slate-200 font-semibold leading-snug mb-4">
              {lastShot.feedback}
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Power</span>
                <span className="text-lime-400 font-mono text-lg font-bold">{lastShot.speed} pts</span>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Accuracy</span>
                <span className="text-yellow-400 font-mono text-lg font-bold">{lastShot.score}%</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center border-2 border-dashed border-slate-800 rounded-2xl">
            <Activity size={32} className="mx-auto text-slate-700 mb-2" />
            <p className="text-slate-500 italic text-sm">Hit a shot to see your analysis</p>
          </div>
        )}
      </div>

      {/* History */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 flex-1 flex flex-col min-h-[250px]">
        <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
          <Target size={14} className="text-blue-500" />
          Shot History
        </h3>

        <div className="space-y-2 overflow-y-auto max-h-[320px] pr-2 custom-scrollbar">
          {history.length > 0 ? history.map((shot, idx) => (
            <div 
              key={shot.timestamp} 
              className="bg-slate-800/40 border border-slate-700/30 p-3 rounded-xl flex justify-between items-center animate-in slide-in-from-right-4 duration-300"
            >
              <div className="flex items-center gap-3">
                {shot.snapshot && <img src={shot.snapshot} className="w-10 h-6 rounded object-cover grayscale hover:grayscale-0 transition-all cursor-zoom-in" />}
                <div>
                  <span className="text-xs font-bold block">{shot.type}</span>
                  <span className="text-[10px] text-slate-500">{shot.spin}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-lime-500 font-bold text-sm">+{shot.score}</span>
              </div>
            </div>
          )) : (
            <div className="h-full flex flex-col items-center justify-center opacity-20 mt-8">
              <Zap size={32} className="mb-2" />
              <p className="text-xs">History empty</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
