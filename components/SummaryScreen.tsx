
import React, { useMemo } from 'react';
import { GameStats } from '../types';
import { Trophy, ArrowLeft, RotateCcw, Medal, TrendingUp, Target } from 'lucide-react';

interface Props {
  stats: GameStats;
  onRestart: () => void;
  onExit: () => void;
}

export const SummaryScreen: React.FC<Props> = ({ stats, onRestart, onExit }) => {
  const { totalScore, shotCount, history } = stats;

  const summaryData = useMemo(() => {
    if (history.length === 0) return { bestType: 'N/A', recap: 'Go hit some balls!' };
    
    const typesCount = history.reduce((acc, shot) => {
      acc[shot.type] = (acc[shot.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Fix: Explicitly cast to number to resolve arithmetic operation type errors
    const sortedEntries = Object.entries(typesCount).sort((a, b) => (b[1] as number) - (a[1] as number));
    const bestType = sortedEntries[0][0];
    
    let recap = "Solid session! Your consistency is improving.";
    if (bestType === 'Forehand') recap = "Your forehand is your strongest weapon. Try to build your game around it!";
    if (bestType === 'Backhand') recap = "Impressive backhand stability. Keep working on that cross-court depth.";
    if (bestType === 'Serve') recap = "Great service rhythm today. Your vertical extension is excellent.";

    return { bestType, recap };
  }, [history]);

  return (
    <div className="max-w-2xl mx-auto py-8 animate-in fade-in zoom-in-95 duration-700">
      <div className="text-center mb-10">
        <div className="inline-block p-4 bg-yellow-500/10 rounded-full mb-6 border border-yellow-500/20">
          <Trophy className="text-yellow-500" size={64} />
        </div>
        <h2 className="text-4xl font-black mb-2 italic uppercase">Session Complete</h2>
        <p className="text-slate-400">You're getting better every minute.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
          <div className="flex items-center gap-3 mb-4 text-slate-500">
            <Medal size={20} />
            <span className="font-bold text-xs uppercase tracking-widest">Total Score</span>
          </div>
          <p className="text-5xl font-black text-lime-500 italic">{totalScore}</p>
        </div>
        
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
          <div className="flex items-center gap-3 mb-4 text-slate-500">
            <TrendingUp size={20} />
            <span className="font-bold text-xs uppercase tracking-widest">Shot Accuracy</span>
          </div>
          <p className="text-5xl font-black text-blue-500 italic">
            {shotCount > 0 ? Math.round((totalScore / (shotCount * 100)) * 100) : 0}%
          </p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl mb-12">
        <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
          <Target size={16} className="text-lime-500" />
          Coaching Recap
        </h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-4">
            <span className="text-slate-400">Primary Stroke</span>
            <span className="font-bold text-white text-lg">{summaryData.bestType}</span>
          </div>
          <div className="flex justify-between items-center border-b border-slate-800 pb-4">
            <span className="text-slate-400">Total Swings</span>
            <span className="font-bold text-white text-lg">{shotCount}</span>
          </div>
          <p className="text-slate-200 text-lg font-medium leading-relaxed italic pt-4">
            "{summaryData.recap}"
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={onRestart}
          className="flex-1 bg-lime-500 hover:bg-lime-400 text-black py-4 rounded-2xl font-black text-xl flex items-center justify-center gap-3 transition-all"
        >
          <RotateCcw size={24} />
          NEW SESSION
        </button>
        <button
          onClick={onExit}
          className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-4 rounded-2xl font-black text-xl flex items-center justify-center gap-3 transition-all"
        >
          <ArrowLeft size={24} />
          MAIN MENU
        </button>
      </div>
    </div>
  );
};
