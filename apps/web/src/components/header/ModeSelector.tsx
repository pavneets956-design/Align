'use client';

import { motion } from 'framer-motion';
import { Sparkles, MessageSquare } from 'lucide-react';

type Mode = 'divine' | 'daily';

interface ModeSelectorProps {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
}

const ModeSelector = ({ mode, onModeChange }: ModeSelectorProps) => {
  return (
    <div className="flex items-center gap-2 p-1 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
      <motion.button
        onClick={() => onModeChange('daily')}
        className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all ${
          mode === 'daily'
            ? 'text-slate-100'
            : 'text-white/50 hover:text-white/70'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {mode === 'daily' && (
          <motion.div
            className="absolute inset-0 rounded-xl bg-gradient-to-r from-slate-600/40 to-slate-500/40 border border-slate-400/30"
            layoutId="modeSelector"
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        )}
        <span className="relative z-10 flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          Daily Life
        </span>
      </motion.button>
      
      <motion.button
        onClick={() => onModeChange('divine')}
        className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all ${
          mode === 'divine'
            ? 'text-amber-100'
            : 'text-white/50 hover:text-white/70'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {mode === 'divine' && (
          <motion.div
            className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-500/30 to-orange-500/30 border border-amber-400/40 shadow-lg shadow-amber-500/20"
            layoutId="modeSelector"
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        )}
        <span className="relative z-10 flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          Divine
        </span>
      </motion.button>
    </div>
  );
};

export default ModeSelector;

