import React, { useEffect, useState, useCallback } from 'react';
import { Leaf } from 'lucide-react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  rotation: number;
  color: string;
  opacity: number;
}

const LeafParticles: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  
  const generateParticles = useCallback(() => {
    // Create random leaf particles
    const particleCount = window.innerWidth < 768 ? 15 : 30;
    const colors = [
      'text-primary-300', 'text-primary-400', 'text-primary-500',
      'text-accent-300', 'text-accent-400', 'text-secondary-300'
    ];
    
    const newParticles: Particle[] = [];
    
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 15 + 8,
        duration: Math.random() * 15 + 10,
        delay: Math.random() * 5,
        rotation: Math.random() * 360,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.4 + 0.2
      });
    }
    
    setParticles(newParticles);
  }, []);
  
  useEffect(() => {
    generateParticles();
    
    // Regenerate particles on window resize
    const handleResize = () => {
      generateParticles();
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [generateParticles]);
  
  return (
    <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`leaf-particle ${particle.color}`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            fontSize: `${particle.size}px`,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
            transform: `rotate(${particle.rotation}deg)`,
            opacity: particle.opacity,
            filter: 'blur(0.5px)',
          }}
        >
          <Leaf />
        </div>
      ))}
    </div>
  );
};

export default LeafParticles;