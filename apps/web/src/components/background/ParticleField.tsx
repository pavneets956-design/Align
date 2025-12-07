'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

type Mode = 'divine' | 'daily';

interface ParticleFieldProps {
  mode: Mode;
  mousePosition: { x: number; y: number };
}

const ParticleField = ({ mode, mousePosition }: ParticleFieldProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [particles, setParticles] = useState<Array<{
    x: number;
    y: number;
    size: number;
    speed: number;
    opacity: number;
    color: string;
  }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles
    const initParticles = () => {
      const newParticles = Array.from({ length: mode === 'divine' ? 80 : 50 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * (mode === 'divine' ? 2 : 1.5) + 0.5,
        speed: Math.random() * 0.5 + 0.2,
        opacity: Math.random() * 0.6 + 0.2,
        color: mode === 'divine' 
          ? `rgba(255, ${200 + Math.random() * 55}, ${150 + Math.random() * 105}, 1)`
          : `rgba(200, ${200 + Math.random() * 55}, ${255}, 1)`
      }));
      setParticles(newParticles);
    };

    initParticles();

    let animationFrame: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, index) => {
        // Parallax effect with mouse
        const dx = (mousePosition.x - canvas.width / 2) * 0.0001;
        const dy = (mousePosition.y - canvas.height / 2) * 0.0001;
        
        particle.x += dx + (Math.random() - 0.5) * particle.speed;
        particle.y += dy + (Math.random() - 0.5) * particle.speed;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color.replace('1)', `${particle.opacity})`);
        ctx.fill();

        // Divine mode: add glow
        if (mode === 'divine') {
          ctx.shadowBlur = 10;
          ctx.shadowColor = particle.color;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrame);
    };
  }, [particles, mode, mousePosition]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ opacity: mode === 'divine' ? 0.6 : 0.3 }}
    />
  );
};

export default ParticleField;

