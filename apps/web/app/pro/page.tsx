'use client';

import { useState } from 'react';
import { Check, Sparkles, Compass, TrendingUp, Calendar, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ProPaywall() {
  const [selectedPlan, setSelectedPlan] = useState<'pro' | 'pro-plus'>('pro');

  const features = [
    {
      icon: Sparkles,
      title: 'Personalized 30-Day Plan',
      description: 'AI-generated transformation plan tailored to your goals',
    },
    {
      icon: Calendar,
      title: 'Daily Tasks & Tracking',
      description: 'Structured daily actions with progress tracking',
    },
    {
      icon: BarChart3,
      title: 'Weekly Reviews',
      description: 'AI-powered progress analysis and adjustments',
    },
    {
      icon: TrendingUp,
      title: 'Habit Streaks',
      description: 'Track your consistency and build momentum',
    },
    {
      icon: Compass,
      title: 'Priority Support',
      description: 'Get help when you need it most',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#F4F6FA] dark:from-[#0E1117] dark:to-[#1A1D23] px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-light text-slate-900 dark:text-white mb-4">
            Unlock <span className="text-[#4A6CF7]">ALIGN</span> PRO
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            Transform your life with a personalized 30-day plan
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-[#1A1D23] rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm"
            >
              <feature.icon className="w-8 h-8 text-[#4A6CF7] mb-3" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Pro Plan */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`relative rounded-2xl p-8 border-2 transition-all ${
              selectedPlan === 'pro'
                ? 'border-[#4A6CF7] bg-[#4A6CF7]/5 dark:bg-[#4A6CF7]/10'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1A1D23]'
            }`}
            onClick={() => setSelectedPlan('pro')}
          >
            {selectedPlan === 'pro' && (
              <div className="absolute top-4 right-4 w-6 h-6 bg-[#4A6CF7] rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
            <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">
              ALIGN Pro
            </h3>
            <div className="mb-4">
              <span className="text-4xl font-light text-slate-900 dark:text-white">$9</span>
              <span className="text-slate-600 dark:text-slate-400">/month</span>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Check className="w-5 h-5 text-[#4A6CF7]" />
                <span>30-day personalized plan</span>
              </li>
              <li className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Check className="w-5 h-5 text-[#4A6CF7]" />
                <span>Daily tasks & tracking</span>
              </li>
              <li className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Check className="w-5 h-5 text-[#4A6CF7]" />
                <span>Weekly AI reviews</span>
              </li>
              <li className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Check className="w-5 h-5 text-[#4A6CF7]" />
                <span>Habit streaks</span>
              </li>
            </ul>
            <Link
              href="/pro/create-plan"
              className="block w-full text-center rounded-full bg-[#4A6CF7] text-white py-3 px-6 font-medium hover:bg-[#3A5CE7] transition-colors"
            >
              Start My Plan
            </Link>
          </motion.div>

          {/* Pro+ Plan */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`relative rounded-2xl p-8 border-2 transition-all ${
              selectedPlan === 'pro-plus'
                ? 'border-[#F4C947] bg-[#F4C947]/5 dark:bg-[#F4C947]/10'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1A1D23]'
            }`}
            onClick={() => setSelectedPlan('pro-plus')}
          >
            {selectedPlan === 'pro-plus' && (
              <div className="absolute top-4 right-4 w-6 h-6 bg-[#F4C947] rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-slate-900" />
              </div>
            )}
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">
                ALIGN Pro+
              </h3>
              <span className="text-xs bg-[#F4C947] text-slate-900 px-2 py-1 rounded-full">
                Coming Soon
              </span>
            </div>
            <div className="mb-4">
              <span className="text-4xl font-light text-slate-900 dark:text-white">$15</span>
              <span className="text-slate-600 dark:text-slate-400">/month</span>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Check className="w-5 h-5 text-[#F4C947]" />
                <span>Everything in Pro</span>
              </li>
              <li className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Check className="w-5 h-5 text-[#F4C947]" />
                <span>Saved routines library</span>
              </li>
              <li className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Check className="w-5 h-5 text-[#F4C947]" />
                <span>Priority notifications</span>
              </li>
              <li className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Check className="w-5 h-5 text-[#F4C947]" />
                <span>Advanced analytics</span>
              </li>
            </ul>
            <button
              disabled
              className="block w-full text-center rounded-full bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 py-3 px-6 font-medium cursor-not-allowed"
            >
              Coming Soon
            </button>
          </motion.div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          Cancel anytime. No questions asked.
        </p>
      </div>
    </div>
  );
}

