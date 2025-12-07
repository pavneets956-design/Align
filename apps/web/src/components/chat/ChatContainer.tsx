'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef } from 'react';
import MessageBubble from '../messages/MessageBubble';
import LoadingDots from '../loading/LoadingDots';
import { cn } from '@/src/lib/utils';

type Mode = 'divine' | 'daily';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  lines?: string[];
  timestamp: number;
}

interface ChatContainerProps {
  messages: Message[];
  isLoading: boolean;
  mode: Mode;
  onReadMessage: (message: Message) => void;
}

const ChatContainer = ({ messages, isLoading, mode, onReadMessage }: ChatContainerProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6" ref={scrollRef}>
      <div className="max-w-4xl mx-auto space-y-6">
        {messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center h-full min-h-[400px]"
          >
            <div className="text-center max-w-md">
              <motion.div
                className={cn(
                  'w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center',
                  mode === 'divine'
                    ? 'bg-gradient-to-br from-amber-400/20 to-orange-500/20 border border-amber-400/30'
                    : 'bg-gradient-to-br from-slate-600/20 to-slate-500/20 border border-slate-400/30'
                )}
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              >
                <div className={cn(
                  'w-12 h-12 rounded-full',
                  mode === 'divine'
                    ? 'bg-gradient-to-br from-amber-300 to-orange-400 shadow-lg shadow-amber-500/50'
                    : 'bg-gradient-to-br from-slate-300 to-slate-400'
                )} />
              </motion.div>
              <h2 className={cn(
                'text-2xl font-light mb-3',
                mode === 'divine' ? 'text-amber-100' : 'text-slate-100'
              )}>
                Welcome
              </h2>
              <p className="text-white/50 text-sm leading-relaxed">
                {mode === 'divine'
                  ? "Ask for spiritual guidance, comfort, or simply sit in quiet reflection."
                  : "Ask for practical advice on everyday challenges, relationships, work, or life decisions."}
              </p>
            </div>
          </motion.div>
        ) : (
          <AnimatePresence>
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                role={message.role}
                content={message.content}
                lines={message.lines}
                mode={mode}
                onRead={() => onReadMessage(message)}
              />
            ))}
          </AnimatePresence>
        )}

        {isLoading && <LoadingDots mode={mode} />}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatContainer;

