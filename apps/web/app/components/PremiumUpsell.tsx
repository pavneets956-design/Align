'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Check, ArrowRight, Zap } from 'lucide-react';

interface PremiumUpsellProps {
  onUpgrade: () => void;
  onDismiss?: () => void;
  variant?: 'inline' | 'modal' | 'banner';
  trigger?: 'mini-plan' | 'save-routine' | 'custom-plan' | 'voice';
}

export const PremiumUpsell: React.FC<PremiumUpsellProps> = ({ 
  onUpgrade, 
  onDismiss,
  variant = 'inline',
  trigger = 'mini-plan'
}) => {
  const getTitle = () => {
    switch (trigger) {
      case 'mini-plan':
        return 'Unlock Your Full 30-Day Plan';
      case 'save-routine':
        return 'Save This Routine';
      case 'custom-plan':
        return 'Create Custom Plans';
      case 'voice':
        return 'Voice Mode';
      default:
        return 'Unlock ALIGN Pro';
    }
  };

  const getDescription = () => {
    switch (trigger) {
      case 'mini-plan':
        return 'Get a complete personalized 30-day plan with daily habits, weekly milestones, and progress tracking.';
      case 'save-routine':
        return 'Save unlimited routines and access them anytime. Track your progress and build consistency.';
      case 'custom-plan':
        return 'Create unlimited custom plans for any goal. Full control over your transformation journey.';
      case 'voice':
        return 'Talk to ALIGN naturally. Voice mode makes guidance even more personal and convenient.';
      default:
        return 'Transform your life with personalized plans, daily accountability, and progress tracking.';
    }
  };

  if (variant === 'banner') {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-align-blue/10 to-align-gold/10 border border-align-blue/20 rounded-2xl p-4 mb-4"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-align-blue" />
              <h3 className="text-sm font-semibold text-align-slate">{getTitle()}</h3>
            </div>
            <p className="text-xs text-align-slate/70 mb-3">{getDescription()}</p>
            <button
              onClick={onUpgrade}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-align-blue to-align-gold text-white text-xs font-medium rounded-full hover:shadow-lg transition-all"
            >
              Unlock Pro
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="text-align-slate/40 hover:text-align-slate/60 text-sm"
            >
              ×
            </button>
          )}
        </div>
      </motion.div>
    );
  }

  if (variant === 'modal') {
    // High-conversion benefits list (outcome-based)
    const benefits = [
      'A personalized 30-day plan built around your goal',
      'Daily habits & accountability reminders',
      'Progress tracking & streaks',
      'Weekly AI check-ins to recalibrate',
      'Save unlimited routines'
    ];

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-align-white rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.08)] max-w-md w-full p-6"
        >
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-align-blue to-align-gold flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            
            {/* Micro-line above headline */}
            <p className="text-xs font-medium text-align-slate/60 mb-2">ALIGN Pro</p>
            
            <h2 className="text-2xl font-semibold text-align-slate mb-3">
              {trigger === 'mini-plan' || trigger === 'custom-plan' 
                ? 'Unlock Your 30-Day Plan'
                : getTitle()}
            </h2>
            
            {/* Emotional sentence */}
            <p className="text-sm text-align-slate/70 italic mb-4">
              Turn your intentions into a simple daily system you can actually follow.
            </p>
          </div>

          {/* Outcome-based benefits */}
          <div className="mb-6">
            <p className="text-xs font-medium text-align-slate/60 mb-3">What you'll get:</p>
            <div className="space-y-3">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-sm text-align-slate/80">
                  <Check className="w-4 h-4 text-align-blue flex-shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={onUpgrade}
              className="w-full py-3 bg-gradient-to-r from-align-blue to-align-gold text-white font-semibold rounded-full hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              Start Pro — $9/month
              <ArrowRight className="w-4 h-4" />
            </button>
            
            {/* Tiny second CTA */}
            <p className="text-center text-xs text-align-slate/60 mb-2">
              Less than 30 cents a day.
            </p>
            
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="w-full py-2 text-sm text-align-slate/60 hover:text-align-slate/80 transition-colors"
              >
                Maybe later
              </button>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  // Inline variant (default)
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-align-blue/5 to-align-gold/5 border border-align-blue/20 rounded-2xl p-4 mt-4"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-align-blue to-align-gold flex items-center justify-center flex-shrink-0">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-align-slate mb-1">{getTitle()}</h3>
          <p className="text-xs text-align-slate/70 mb-3">{getDescription()}</p>
          <button
            onClick={onUpgrade}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-align-blue to-align-gold text-white text-xs font-medium rounded-full hover:shadow-md transition-all"
          >
            Unlock Pro
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

