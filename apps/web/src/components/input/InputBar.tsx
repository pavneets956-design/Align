'use client';

import { motion } from 'framer-motion';
import { Send, Loader2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';

type Mode = 'divine' | 'daily';

interface InputBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  disabled: boolean;
  mode: Mode;
  placeholder?: string;
}

const InputBar = ({
  value,
  onChange,
  onSubmit,
  isLoading,
  disabled,
  mode,
  placeholder = "Type your message..."
}: InputBarProps) => {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !disabled && !isLoading) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-6"
    >
      <div className="max-w-4xl mx-auto">
        <div className={cn(
          'relative flex items-end gap-3 p-4 rounded-2xl backdrop-blur-2xl border shadow-2xl',
          mode === 'divine'
            ? 'bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border-amber-400/30 shadow-amber-500/10'
            : 'bg-slate-800/40 border-slate-500/30 shadow-slate-900/50'
        )}>
          {/* Focus glow effect */}
          <motion.div
            className={cn(
              'absolute inset-0 rounded-2xl opacity-0 transition-opacity',
              mode === 'divine'
                ? 'bg-gradient-to-r from-amber-400/20 to-orange-400/20'
                : 'bg-gradient-to-r from-slate-400/20 to-slate-500/20'
            )}
            animate={{
              opacity: disabled ? 0 : [0, 0.3, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />

          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={disabled || isLoading}
            placeholder={placeholder}
            className={cn(
              'relative z-10 flex-1 bg-transparent border-none outline-none text-white placeholder:text-white/40 text-base',
              'focus:ring-0'
            )}
          />

          <motion.button
            onClick={onSubmit}
            disabled={!value.trim() || isLoading || disabled}
            className={cn(
              'relative z-10 p-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed',
              mode === 'divine'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30'
                : 'bg-gradient-to-r from-slate-600 to-slate-500 text-white shadow-lg shadow-slate-500/20'
            )}
            whileHover={{ scale: disabled ? 1 : 1.05 }}
            whileTap={{ scale: disabled ? 1 : 0.95 }}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default InputBar;

