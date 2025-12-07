'use client';

import React from "react";
import dynamic from 'next/dynamic';

// Dynamically import the 3D canvas to avoid SSR issues
const AlignOrbCanvas = dynamic(() => import('./AlignOrbCanvas'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-72 md:h-80 rounded-3xl bg-align-white border border-black/[0.04] shadow-[0_18px_45px_rgba(15,23,42,0.08)] flex items-center justify-center">
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-align-blue/20 to-align-gold/20 animate-pulse" />
    </div>
  ),
});

interface AlignLandingProps {
  onStart: () => void;
}

const AlignLanding: React.FC<AlignLandingProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-align-light flex items-center justify-center px-4 py-16 md:py-20 relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 h-96 w-96 rounded-full bg-align-blue/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-align-gold/5 blur-3xl" />
      </div>

      <div className="max-w-5xl w-full grid md:grid-cols-[1.1fr,1.4fr] gap-10 items-center">
        {/* LEFT – 3D orb card */}
        <div className="relative">
          <div className="rounded-3xl bg-align-white border border-black/[0.04] shadow-[0_18px_45px_rgba(15,23,42,0.08)] p-6 md:p-8">
            <AlignOrbCanvas />

            <div className="mt-6 text-center">
              <span className="tracking-[0.4em] text-xs uppercase text-align-slate/60">
                AI ALIGNMENT ENGINE
              </span>
              <h1 className="mt-3 text-3xl font-semibold tracking-[0.18em] text-align-slate">
                ALIGN
              </h1>
            </div>
          </div>
        </div>

        {/* RIGHT – text + button */}
        <div className="space-y-5">
          <div>
            {/* Badge pill */}
            <div className="inline-flex items-center gap-2 rounded-full bg-white/70 border border-black/5 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-align-slate/70 mb-5">
              <span>Insight engine</span>
              <span className="h-1 w-1 rounded-full bg-align-blue" />
              <span>Action engine</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-semibold text-align-slate leading-tight mb-4">
              Inner clarity.{" "}
              <span className="text-align-blue">Practical action.</span>
            </h1>
            <p className="text-sm md:text-base text-align-slate/70 leading-relaxed max-w-md">
              ALIGN helps you see what's really happening inside and turn that awareness into simple, daily actions you can actually follow.
            </p>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button 
              onClick={onStart}
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-align-blue to-align-gold text-white text-sm font-medium px-6 py-3 shadow-[0_12px_30px_rgba(15,23,42,0.18)] hover:shadow-[0_16px_40px_rgba(15,23,42,0.22)] transition"
            >
              Start ALIGN session
            </button>
            <button 
              onClick={onStart}
              className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white text-sm font-medium text-align-slate px-6 py-3 hover:bg-black/[0.02] transition"
            >
              Watch it in action
            </button>
          </div>

          <p className="text-[11px] text-align-slate/50 pt-1">
            No account needed to try. Just start typing.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AlignLanding;

