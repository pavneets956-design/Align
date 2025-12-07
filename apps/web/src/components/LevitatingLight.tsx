'use client';

import { useEffect, useState } from "react";

interface Props {
  active?: boolean;
}

const LevitatingLight = ({ active = true }: Props) => {
  const [scale, setScale] = useState(0.9);
  const [translateY, setTranslateY] = useState(0);

  useEffect(() => {
    let animationFrame: number;
    let startTime = Date.now();
    const duration = 4000;
    const scaleRange = { min: 0.92, max: 1.05 };
    const translateRange = { min: 4, max: -6 };

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const cycle = Math.floor(elapsed / (duration * 2));
      const cycleTime = elapsed % (duration * 2);
      
      if (cycleTime < duration) {
        const progress = cycleTime / duration;
        setScale(scaleRange.min + (scaleRange.max - scaleRange.min) * progress);
        setTranslateY(translateRange.min + (translateRange.max - translateRange.min) * progress);
      } else {
        const progress = (cycleTime - duration) / duration;
        setScale(scaleRange.max - (scaleRange.max - scaleRange.min) * progress);
        setTranslateY(translateRange.max - (translateRange.max - translateRange.min) * progress);
      }
      
      animationFrame = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  // Active state affects the base scale multiplier
  // The breathing animation continues independently

  const activeMultiplier = active ? 1.02 : 0.92;
  const finalScale = scale * activeMultiplier;

  return (
    <div
      className="w-[220px] h-[220px] rounded-full flex items-center justify-center relative"
      style={{
        transform: `scale(${finalScale}) translateY(${translateY}px)`,
        backgroundColor: "rgba(255, 240, 200, 0.08)",
        border: "1px solid rgba(255, 240, 200, 0.25)",
        transition: active ? 'transform 0.3s ease-out' : 'none',
      }}
    >
      <div
        className="w-[180px] h-[180px] rounded-full"
        style={{
          backgroundColor: "rgba(255, 228, 160, 0.48)",
          boxShadow: "0 0 30px rgba(248, 223, 164, 0.5)",
        }}
      />
    </div>
  );
};

export default LevitatingLight;

