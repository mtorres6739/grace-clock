'use client';

import { useEffect, useState } from 'react';

interface ConfettiProps {
  isActive: boolean;
}

export function Confetti({ isActive }: ConfettiProps) {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    rotation: number;
    color: string;
  }>>([]);

  useEffect(() => {
    if (isActive) {
      const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];
      const newParticles = [];
      
      for (let i = 0; i < 100; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: -20,
          rotation: Math.random() * 360,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
      
      setParticles(newParticles);
      
      const timer = setTimeout(() => {
        setParticles([]);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  if (!isActive || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-3 h-3 animate-confetti"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}px`,
            backgroundColor: particle.color,
            transform: `rotate(${particle.rotation}deg)`,
            animation: `confetti-fall 3s ease-out forwards`
          }}
        />
      ))}
      <style jsx>{`
        @keyframes confetti-fall {
          to {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}