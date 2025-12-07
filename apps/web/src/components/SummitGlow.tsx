'use client';

import { useEffect, useState } from "react";

const SummitGlow = () => {
  const [opacity, setOpacity] = useState(0.2);

  useEffect(() => {
    let animationFrame: number;
    let startTime = Date.now();
    const duration = 4000;
    const minOpacity = 0.2;
    const maxOpacity = 0.6;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const cycle = Math.floor(elapsed / (duration * 2));
      const cycleTime = elapsed % (duration * 2);
      
      if (cycleTime < duration) {
        const progress = cycleTime / duration;
        setOpacity(minOpacity + (maxOpacity - minOpacity) * progress);
      } else {
        const progress = (cycleTime - duration) / duration;
        setOpacity(maxOpacity - (maxOpacity - minOpacity) * progress);
      }
      
      animationFrame = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full">
      <svg width="100%" height="100%" viewBox="0 0 100 100" className="absolute inset-0">
        <defs>
          <linearGradient id="skyGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0b0c1e" />
            <stop offset="40%" stopColor="#1d2140" />
            <stop offset="100%" stopColor="#090a16" />
          </linearGradient>
          <linearGradient id="horizonGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffb36d" />
            <stop offset="100%" stopColor="#351b3a" />
          </linearGradient>
        </defs>

        <rect width="100" height="100" fill="url(#skyGradient)" />

        <path
          d="M0 60 Q25 40 50 55 Q75 40 100 60 L100 100 L0 100 Z"
          fill="url(#horizonGlow)"
          opacity={opacity}
        />
        <path d="M0 62 Q25 52 50 66 Q75 52 100 62 L100 100 L0 100 Z" fill="#080910" />
      </svg>
    </div>
  );
};

export default SummitGlow;

