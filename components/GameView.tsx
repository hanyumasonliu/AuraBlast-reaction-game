
import React, { useEffect, useRef, useState } from 'react';
import { AuraOrb, Particle } from '../types';

interface Props {
  onOrbPop: (points: number) => void;
  onComboBreak: () => void;
}

const ORB_SPAWN_RATE = 1500; // ms
const MAX_ORBS = 6;
const COLLISION_THRESHOLD = 0.08;

export const GameView: React.FC<Props> = ({ onOrbPop, onComboBreak }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const orbsRef = useRef<AuraOrb[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const trailsRef = useRef<{ x: number, y: number, color: string, life: number }[]>([]);
  
  const lastSpawnTime = useRef(0);
  const animationFrameId = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const createParticleBurst = (x: number, y: number, color: string) => {
      for (let i = 0; i < 30; i++) {
        particlesRef.current.push({
          x, y,
          vx: (Math.random() - 0.5) * 20,
          vy: (Math.random() - 0.5) * 20,
          life: 1,
          color
        });
      }
    };

    const spawnOrb = () => {
      if (orbsRef.current.length >= MAX_ORBS) return;
      const margin = 0.15;
      orbsRef.current.push({
        id: Math.random().toString(36).substr(2, 9),
        x: margin + Math.random() * (1 - margin * 2),
        y: margin + Math.random() * (1 - margin * 2),
        radius: 40 + Math.random() * 40,
        color: `hsl(${Math.random() * 360}, 100%, 70%)`,
        pulse: 0,
        createdAt: Date.now()
      });
    };

    const update = () => {
      const now = Date.now();
      
      // Spawn Orbs
      if (now - lastSpawnTime.current > ORB_SPAWN_RATE) {
        spawnOrb();
        lastSpawnTime.current = now;
      }

      // Update Orbs
      orbsRef.current = orbsRef.current.filter(orb => {
        const age = now - orb.createdAt;
        if (age > 4000) {
          onComboBreak();
          return false;
        }
        orb.pulse = Math.sin(now / 200) * 5;
        return true;
      });

      // Update Particles
      particlesRef.current = particlesRef.current.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.95;
        p.vy *= 0.95;
        p.life -= 0.02;
        return p.life > 0;
      });

      // Update Trails
      trailsRef.current = trailsRef.current.filter(t => {
        t.life -= 0.05;
        return t.life > 0;
      });

      // COLLISION DETECTION
      const landmarks = (window as any).fullPoseLandmarks;
      if (landmarks) {
        // Points to check: Hands (15, 16), Head (0), Feet (31, 32)
        const activePoints = [
          landmarks[15], landmarks[16], landmarks[0], landmarks[31], landmarks[32]
        ].filter(p => p && p.visibility > 0.6);

        activePoints.forEach(p => {
          // Add trail
          trailsRef.current.push({
            x: (1 - p.x), // Mirrored
            y: p.y,
            color: '#6366f1',
            life: 1
          });

          // Check hit
          orbsRef.current = orbsRef.current.filter(orb => {
            const dx = (1 - p.x) - orb.x;
            const dy = p.y - orb.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            // Normalize collision: our canvas is roughly proportional to 0-1 coords
            if (dist < COLLISION_THRESHOLD) {
              createParticleBurst(orb.x * canvas.width, orb.y * canvas.height, orb.color);
              onOrbPop(100);
              return false;
            }
            return true;
          });
        });
      }
    };

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // 1. Draw Webcam Background (Mirrored)
      const video = document.querySelector('video');
      if (video && video.readyState >= 2) {
        ctx.save();
        ctx.translate(w, 0);
        ctx.scale(-1, 1);
        ctx.globalAlpha = 0.5;
        ctx.drawImage(video, 0, 0, w, h);
        ctx.restore();
      }

      // 2. Draw Trails
      ctx.lineWidth = 15;
      ctx.lineCap = 'round';
      trailsRef.current.forEach(t => {
        ctx.strokeStyle = `rgba(99, 102, 241, ${t.life * 0.3})`;
        ctx.beginPath();
        ctx.arc(t.x * w, t.y * h, 10 * t.life, 0, Math.PI * 2);
        ctx.stroke();
      });

      // 3. Draw Orbs
      orbsRef.current.forEach(orb => {
        const x = orb.x * w;
        const y = orb.y * h;
        const r = orb.radius + orb.pulse;

        // Glow
        const glow = ctx.createRadialGradient(x, y, 0, x, y, r * 2);
        glow.addColorStop(0, orb.color);
        glow.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = glow;
        ctx.globalCompositeOperation = 'screen';
        ctx.beginPath(); ctx.arc(x, y, r * 2.5, 0, Math.PI * 2); ctx.fill();

        // Core
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(x, y, r * 0.8, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = orb.color;
        ctx.lineWidth = 4;
        ctx.stroke();
      });

      // 4. Draw Particles
      ctx.globalCompositeOperation = 'screen';
      particlesRef.current.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
      });
      ctx.globalAlpha = 1;

      update();
      animationFrameId.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animationFrameId.current);
  }, [onOrbPop, onComboBreak]);

  return (
    <div className="w-full h-full bg-black flex items-center justify-center">
      <canvas 
        ref={canvasRef} 
        width={1280} 
        height={720} 
        className="w-full h-full object-cover"
      />
      {/* Decorative Scanlines */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_4px,3px_100%]"></div>
    </div>
  );
};
