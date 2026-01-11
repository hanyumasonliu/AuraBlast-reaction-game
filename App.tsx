
import React, { useState, useEffect, useRef } from 'react';
import { GameView } from './components/GameView';
import { CameraView } from './components/CameraView';
import { GameState } from './types';
import { Zap, Trophy, Play, RotateCcw, Home, Sparkles } from 'lucide-react';

const GAME_DURATION = 45; // seconds

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    status: 'menu',
    score: 0,
    combo: 0,
    maxCombo: 0,
    timeRemaining: GAME_DURATION
  });

  const timerRef = useRef<number | null>(null);

  const startGame = () => {
    setGameState({
      status: 'playing',
      score: 0,
      combo: 0,
      maxCombo: 0,
      timeRemaining: GAME_DURATION
    });
  };

  const endSession = () => {
    setGameState(prev => ({ ...prev, status: 'results' }));
    if (timerRef.current) clearInterval(timerRef.current);
  };

  useEffect(() => {
    if (gameState.status === 'playing') {
      timerRef.current = window.setInterval(() => {
        setGameState(prev => {
          if (prev.timeRemaining <= 1) {
            endSession();
            return { ...prev, timeRemaining: 0 };
          }
          return { ...prev, timeRemaining: prev.timeRemaining - 1 };
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState.status]);

  const handleOrbPop = (points: number) => {
    setGameState(prev => {
      const newCombo = prev.combo + 1;
      return {
        ...prev,
        score: prev.score + points * newCombo,
        combo: newCombo,
        maxCombo: Math.max(prev.maxCombo, newCombo)
      };
    });
  };

  const handleComboBreak = () => {
    setGameState(prev => ({ ...prev, combo: 0 }));
  };

  return (
    <div className="h-screen w-screen bg-black text-white overflow-hidden font-sans select-none">
      {/* HUD: Score & Timer */}
      {gameState.status === 'playing' && (
        <div className="fixed inset-x-0 top-0 z-50 p-6 flex justify-between items-start pointer-events-none">
          <div className="flex flex-col gap-1">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 px-6 py-3 rounded-2xl flex items-center gap-4">
              <span className="text-xs font-black uppercase tracking-widest text-white/50">Score</span>
              <span className="text-4xl font-black italic tracking-tighter text-white tabular-nums">
                {gameState.score.toLocaleString()}
              </span>
            </div>
            {gameState.combo > 1 && (
              <div className="animate-bounce">
                <span className="text-2xl font-black italic text-yellow-400 drop-shadow-glow">
                  {gameState.combo}x COMBO
                </span>
              </div>
            )}
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 px-6 py-3 rounded-2xl flex items-center gap-4">
            <span className="text-xs font-black uppercase tracking-widest text-white/50">Time</span>
            <span className={`text-4xl font-black italic tracking-tighter tabular-nums ${gameState.timeRemaining < 10 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
              {gameState.timeRemaining}s
            </span>
          </div>
        </div>
      )}

      {/* Main Game Interface */}
      <main className="relative w-full h-full">
        {gameState.status === 'menu' && (
          <div className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <div className="mb-12">
              <div className="inline-block p-4 bg-indigo-500/20 rounded-full mb-6 border border-indigo-500/40 animate-pulse">
                <Sparkles size={64} className="text-indigo-400" />
              </div>
              <h1 className="text-8xl font-black italic uppercase tracking-tighter leading-none mb-4">
                AURA<span className="text-indigo-500">BLAST</span>
              </h1>
              <p className="text-xl text-slate-400 max-w-lg mx-auto font-medium tracking-wide">
                Your body is the brush. The screen is your canvas. <br/> Blast energy orbs to survive.
              </p>
            </div>
            
            <button 
              onClick={startGame}
              className="group flex items-center gap-6 bg-white text-black px-16 py-8 rounded-full font-black text-3xl transition-all hover:scale-105 active:scale-95 shadow-[0_0_80px_rgba(99,102,241,0.3)] hover:shadow-indigo-500/50"
            >
              START SESSION
              <Play fill="black" size={32} />
            </button>
            <p className="mt-12 text-slate-500 text-sm font-bold uppercase tracking-widest">Webcam Access Required</p>
          </div>
        )}

        {gameState.status === 'playing' && (
          <GameView 
            onOrbPop={handleOrbPop} 
            onComboBreak={handleComboBreak}
          />
        )}

        {gameState.status === 'results' && (
          <div className="absolute inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-6 text-center">
            <Trophy size={100} className="text-yellow-500 mb-6 drop-shadow-[0_0_30px_rgba(234,179,8,0.3)]" />
            <h2 className="text-6xl font-black italic uppercase mb-2">SESSION COMPLETE</h2>
            <div className="flex gap-12 my-12">
              <div className="text-center">
                <p className="text-xs font-black uppercase text-slate-500 tracking-widest mb-2">Final Score</p>
                <p className="text-6xl font-black text-indigo-400 italic">{gameState.score.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-xs font-black uppercase text-slate-500 tracking-widest mb-2">Max Combo</p>
                <p className="text-6xl font-black text-yellow-400 italic">{gameState.maxCombo}x</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button onClick={startGame} className="bg-white text-black px-10 py-5 rounded-full font-black text-xl flex items-center gap-3 hover:scale-105 transition-transform">
                <RotateCcw size={24} /> RETRY
              </button>
              <button onClick={() => setGameState(prev => ({ ...prev, status: 'menu' }))} className="bg-slate-800 text-white px-10 py-5 rounded-full font-black text-xl flex items-center gap-3 hover:scale-105 transition-transform">
                <Home size={24} /> EXIT
              </button>
            </div>
          </div>
        )}

        {/* Hidden Camera Component for Pose Processing */}
        <div className="opacity-0 pointer-events-none fixed">
           <CameraView onShot={() => {}} />
        </div>
      </main>
    </div>
  );
};

export default App;
