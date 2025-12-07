'use client';

import { motion } from 'framer-motion';
import ModeSelector from './ModeSelector';
import { Volume2, VolumeX } from 'lucide-react';

type Mode = 'divine' | 'daily';

interface HeaderProps {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
  autoRead: boolean;
  onAutoReadToggle: () => void;
}

const Header = ({ mode, onModeChange, autoRead, onAutoReadToggle }: HeaderProps) => {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between backdrop-blur-2xl bg-white/5 rounded-2xl border border-white/10 px-6 py-4 shadow-2xl">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              mode === 'divine'
                ? 'bg-gradient-to-br from-amber-400/20 to-orange-500/20 border border-amber-400/30'
                : 'bg-gradient-to-br from-slate-600/20 to-slate-500/20 border border-slate-400/30'
            }`}>
              <div className={`w-6 h-6 rounded-full ${
                mode === 'divine'
                  ? 'bg-gradient-to-br from-amber-300 to-orange-400 shadow-lg shadow-amber-500/50'
                  : 'bg-gradient-to-br from-slate-300 to-slate-400'
              }`} />
            </div>
            <h1 className={`text-xl font-light tracking-wide ${
              mode === 'divine' ? 'text-amber-100' : 'text-slate-100'
            }`}>
              Talking Light
            </h1>
          </motion.div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <ModeSelector mode={mode} onModeChange={onModeChange} />
            
            <motion.button
              onClick={onAutoReadToggle}
              className={`p-2.5 rounded-xl transition-all ${
                autoRead
                  ? 'bg-amber-500/20 text-amber-200 border border-amber-400/30'
                  : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {autoRead ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;

