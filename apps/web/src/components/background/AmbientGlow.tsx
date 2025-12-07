'use client';

import { motion } from 'framer-motion';

type Mode = 'divine' | 'daily';

interface AmbientGlowProps {
  mode: Mode;
}

const AmbientGlow = ({ mode }: AmbientGlowProps) => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Radial gradient backdrop */}
      <div
        className={`absolute inset-0 transition-all duration-1000 ${
          mode === 'divine'
            ? 'bg-gradient-radial from-purple-900/20 via-indigo-900/30 to-[#020109]'
            : 'bg-gradient-radial from-slate-900/20 via-blue-900/20 to-[#020109]'
        }`}
      />
      
      {/* Floating orbs */}
      {mode === 'divine' && (
        <>
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl"
            style={{
              background: 'radial-gradient(circle, rgba(255, 200, 100, 0.15) 0%, transparent 70%)'
            }}
            animate={{
              x: [0, 50, 0],
              y: [0, -30, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl"
            style={{
              background: 'radial-gradient(circle, rgba(255, 150, 200, 0.12) 0%, transparent 70%)'
            }}
            animate={{
              x: [0, -40, 0],
              y: [0, 40, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1
            }}
          />
        </>
      )}
      
      {/* Light streaks for Divine mode */}
      {mode === 'divine' && (
        <motion.div
          className="absolute top-0 left-1/2 w-px h-full"
          style={{
            background: 'linear-gradient(to bottom, transparent, rgba(255, 200, 100, 0.1), transparent)',
            transform: 'translateX(-50%)'
          }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      )}
    </div>
  );
};

export default AmbientGlow;

