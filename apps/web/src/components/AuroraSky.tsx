'use client';

import { useEffect, useState } from "react";

const AuroraSky = () => {
  const [translateX, setTranslateX] = useState(0);

  useEffect(() => {
    let animationFrame: number;
    let startTime = Date.now();
    const duration = 7000;
    const range = 6;

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
          <linearGradient id="auroraSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#050519" />
            <stop offset="100%" stopColor="#0c132c" />
          </linearGradient>
          <linearGradient id="auroraRibbon" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#58f6d4" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#8d80ff" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#f6a7ff" stopOpacity="0.18" />
          </linearGradient>
        </defs>

        <rect width="100" height="100" fill="url(#auroraSky)" />

        <g style={{ transform: `translateX(${translateX}%)` }}>
          <path
            d="M-10 40 Q20 25 50 38 Q80 51 110 39 L110 60 Q80 75 50 62 Q20 49 -10 63 Z"
            fill="url(#auroraRibbon)"
          />
        </g>
      </svg>
    </div>
  );
};

export default AuroraSky;

