
export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number; // 0 to 1
  color: string;
}

export interface AuraOrb {
  id: string;
  x: number;
  y: number;
  radius: number;
  color: string;
  pulse: number;
  createdAt: number;
}

export interface GameState {
  status: 'menu' | 'playing' | 'results';
  score: number;
  combo: number;
  maxCombo: number;
  timeRemaining: number;
}

// Added ShotData interface to support shot analysis and history tracking
export interface ShotData {
  type: string;
  speed: number;
  score: number;
  spin: string;
  feedback: string;
  snapshot?: string;
  timestamp: number;
}

// Added GameStats interface used by the Dashboard and SummaryScreen components
export interface GameStats {
  totalScore: number;
  shotCount: number;
  lastShot: ShotData | null;
  history: ShotData[];
}
