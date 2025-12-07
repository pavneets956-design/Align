'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/src/lib/utils';

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onAnimationStart'> {
  variant?: 'divine' | 'daily' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'ghost', size = 'md', glow = false, children, ...props }, ref) => {
    const baseStyles = 'relative overflow-hidden rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#020109]';
    
    const variants = {
      divine: 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-100 border border-amber-400/30 hover:border-amber-400/50 hover:from-amber-500/30 hover:to-orange-500/30 focus:ring-amber-400/50',
      daily: 'bg-gradient-to-r from-slate-700/40 to-slate-600/40 text-slate-100 border border-slate-500/30 hover:border-slate-400/50 hover:from-slate-600/50 hover:to-slate-500/50 focus:ring-slate-400/50',
      ghost: 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20 focus:ring-white/20'
    };
    
    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg'
    };

    const motionProps: HTMLMotionProps<'button'> = {
      whileHover: { scale: 1.02 },
      whileTap: { scale: 0.98 },
    };

    return (
      <motion.button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...motionProps}
        {...(props as any)}
      >
        {glow && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-amber-400/20 via-orange-400/20 to-amber-400/20"
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
        <span className="relative z-10">{children}</span>
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;

