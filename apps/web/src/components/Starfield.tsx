'use client';

import { useEffect, useMemo, useRef, useState } from "react";

const STAR_COUNT = 30; // Fewer stars for cleaner look

interface Star {
  cx: number;
  cy: number;
  r: number;
  delay: number;
}

const createStarMap = (): Star[] =>
  Array.from({ length: STAR_COUNT }).map(() => ({
    cx: Math.random() * 100,
    cy: Math.random() * 100,
    r: Math.random() * 0.6 + 0.2,
    delay: Math.random() * 4000
  }));

const Starfield = () => {
  const [opacity, setOpacity] = useState(0);
  const stars = useMemo(createStarMap, []);

  useEffect(() => {
    let animationFrame: number;
    let startTime = Date.now();
    const duration = 2200;
    const minOpacity = 0.2;
    const maxOpacity = 1;

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
          <linearGradient id="nightGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#040214" />
            <stop offset="65%" stopColor="#100634" />
            <stop offset="100%" stopColor="#1b0a2d" />
          </linearGradient>
        </defs>
        <rect width="100" height="100" fill="url(#nightGradient)" />
        {stars.map((star, index) => (
          <AnimatedStar
            key={`star-${index}`}
            cx={star.cx}
            cy={star.cy}
            r={star.r}
            baseOpacity={opacity}
            delay={star.delay}
          />
        ))}
      </svg>
    </div>
  );
};

const AnimatedStar = ({
  cx,
  cy,
  r,
  baseOpacity,
  delay
}: {
  cx: number;
  cy: number;
  r: number;
  baseOpacity: number;
  delay: number;
}) => {
  const [localOpacity, setLocalOpacity] = useState(0);

  useEffect(() => {
    let animationFrame: number;
    let startTime = Date.now() + delay;
    const duration = 1600;
    const minOpacity = 0.2;
    const maxOpacity = 0.9;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed < 0) {
        animationFrame = requestAnimationFrame(animate);
        return;
      }
      
      const cycle = Math.floor(elapsed / (duration * 2));
      const cycleTime = elapsed % (duration * 2);
      
      if (cycleTime < duration) {
        const progress = cycleTime / duration;
        setLocalOpacity(minOpacity + (maxOpacity - minOpacity) * progress);
      } else {
        const progress = (cycleTime - duration) / duration;
        setLocalOpacity(maxOpacity - (maxOpacity - minOpacity) * progress);
      }
      
      animationFrame = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, [delay]);

  const combinedOpacity = localOpacity * baseOpacity;
  return (
    <circle
      cx={cx}
      cy={cy}
      r={r}
      fill="#fff8d6"
      opacity={combinedOpacity}
    />
  );
};

export default Starfield;

