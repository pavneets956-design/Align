'use client';

import { useEffect, useState } from "react";

const OceanShimmer = () => {
  const [translateX, setTranslateX] = useState(0);

  useEffect(() => {
    let animationFrame: number;
    let startTime = Date.now();
    const duration = 5000;
    const range = 4;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const cycle = Math.floor(elapsed / (duration * 2));
      const cycleTime = elapsed % (duration * 2);
      
      if (cycleTime < duration) {
        const progress = cycleTime / duration;
        setTranslateX(-range + (range * 2) * progress);
      } else {
        const progress = (cycleTime - duration) / duration;
        setTranslateX(range - (range * 2) * progress);
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
          <linearGradient id="nightWater" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#030716" />
            <stop offset="50%" stopColor="#061638" />
            <stop offset="100%" stopColor="#02101f" />
          </linearGradient>
          <linearGradient id="moonGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fce7b5" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#fce7b5" stopOpacity="0" />
          </linearGradient>
        </defs>

        <rect width="100" height="100" fill="url(#nightWater)" />
        <g style={{ transform: `translateX(${translateX}%)` }}>
          <path
            d="M0 58 Q12 56 25 58 T50 58 T75 58 T100 58 L100 80 L0 80 Z"
            fill="url(#moonGlow)"
          />
        </g>
        <path d="M0 58 L100 58 L100 100 L0 100 Z" fill="rgba(0, 8, 20, 0.8)" />
      </svg>
    </div>
  );
};

export default OceanShimmer;

