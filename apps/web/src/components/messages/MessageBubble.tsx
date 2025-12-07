'use client';

import { motion } from 'framer-motion';
import { Volume2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';

type Mode = 'divine' | 'daily';

interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  lines?: string[];
  mode: Mode;
  onRead?: () => void;
}

const MessageBubble = ({ role, content, lines, mode, onRead }: MessageBubbleProps) => {
  const isUser = role === 'user';
  const isDivine = mode === 'divine' && !isUser;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={cn(
        'flex',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      <div className={cn(
        'relative max-w-[75%] rounded-3xl px-5 py-4 backdrop-blur-xl',
        isUser
          ? 'bg-white/10 border border-white/20 text-white'
          : isDivine
          ? 'bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-400/30 text-amber-50 shadow-2xl shadow-amber-500/10'
          : 'bg-slate-700/40 border border-slate-500/30 text-slate-100'
      )}>
        {/* Divine mode glow effect */}
        {isDivine && (
          <motion.div
            className="absolute inset-0 rounded-3xl bg-gradient-to-r from-amber-400/0 via-amber-400/10 to-amber-400/0"
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear'
            }}
          />
        )}

        {/* Content */}
        <div className="relative z-10">
          {lines ? (
            <div className="space-y-2">
              {lines.map((line, idx) => (
                <p
                  key={idx}
                  className={cn(
                    'leading-relaxed',
                    isDivine ? 'text-amber-50/95' : 'text-slate-100'
                  )}
                >
                  {line}
                </p>
              ))}
            </div>
          ) : (
            <p className={cn(
              'leading-relaxed',
              isDivine ? 'text-amber-50/95' : 'text-slate-100'
            )}>
              {content}
            </p>
          )}

          {/* Read aloud button */}
          {!isUser && onRead && (
            <motion.button
              onClick={onRead}
              className={cn(
                'mt-3 flex items-center gap-1.5 text-xs opacity-60 hover:opacity-100 transition-opacity',
                isDivine ? 'text-amber-200' : 'text-slate-300'
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Volume2 className="w-3.5 h-3.5" />
              Read
            </motion.button>
          )}
        </div>

        {/* Divine mode light orb */}
        {isDivine && (
          <motion.div
            className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-gradient-to-br from-amber-300 to-orange-400 shadow-lg shadow-amber-500/50"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        )}
      </div>
    </motion.div>
  );
};

export default MessageBubble;

