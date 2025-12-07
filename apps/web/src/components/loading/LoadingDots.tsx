'use client';

import { motion } from 'framer-motion';
import { cn } from '@/src/lib/utils';

type Mode = 'divine' | 'daily';

interface LoadingDotsProps {
  mode: Mode;
}

const LoadingDots = ({ mode }: LoadingDotsProps) => {
  const isDivine = mode === 'divine';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-start"
    >
      <div className={cn(
        'rounded-3xl px-5 py-4 backdrop-blur-xl border',
        isDivine
          ? 'bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-amber-500/10 border-amber-400/30'
          : 'bg-slate-700/40 border-slate-500/30'
      )}>
        <div className="flex items-center gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className={cn(
                'w-2 h-2 rounded-full',
                isDivine ? 'bg-amber-400' : 'bg-slate-300'
              )}
              animate={{
                y: [0, -8, 0],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeInOut'
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default LoadingDots;

