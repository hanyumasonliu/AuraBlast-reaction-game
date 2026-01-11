
import React from 'react';
import { Play, Trophy, Users, Zap } from 'lucide-react';

interface Props {
  onStart: () => void;
}

export const LandingPage: React.FC<Props> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 text-center animate-in fade-in duration-1000">
      <div className="mb-8">
        <h1 className="text-7xl md:text-9xl font-black italic tracking-tighter uppercase leading-none mb-4">
          GRAND <br/> <span className="text-lime-500">SLAM</span>
        </h1>
        <p className="text-2xl font-bold text-slate-400 max-w-xl mx-auto uppercase tracking-widest">
          The ultimate AR tennis challenge. You vs the machine.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-12 mb-16 opacity-80">
        <div className="flex flex-col items-center gap-2">
          <Trophy className="text-yellow-500" size={40} />
          <span className="font-bold text-xs">PRO SCORING</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Users className="text-blue-500" size={40} />
          <span className="font-bold text-xs">VIRTUAL PRO AI</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Zap className="text-lime-500" size={40} />
          <span className="font-bold text-xs">REAL SWING TECH</span>
        </div>
      </div>

      <button
        onClick={onStart}
        className="group relative inline-flex items-center gap-6 bg-white text-black px-16 py-8 rounded-full font-black text-3xl transition-all hover:scale-110 active:scale-95 shadow-[0_0_60px_rgba(255,255,255,0.2)]"
      >
        PLAY MATCH
        <Play fill="black" size={32} />
      </button>

      <div className="mt-12 text-slate-500 font-mono text-sm uppercase tracking-widest">
        Place camera 6ft away for best tracking
      </div>
    </div>
  );
};
