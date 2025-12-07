'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';

interface PlanBuilderProps {
  onComplete: (planData: any) => void;
  onCancel?: () => void;
}

const GOAL_CATEGORIES = [
  { id: 'discipline', label: 'Discipline' },
  { id: 'anxiety', label: 'Anxiety Relief' },
  { id: 'side-hustle', label: 'Side Hustle' },
  { id: 'fitness', label: 'Body Transformation' },
  { id: 'money', label: 'Financial Clarity' },
  { id: 'confidence', label: 'Confidence' },
  { id: 'relationships', label: 'Relationships' },
  { id: 'productivity', label: 'Productivity' },
  { id: 'other', label: 'Other' },
];

const TIME_OPTIONS = [
  { value: 10, label: '10 minutes' },
  { value: 20, label: '20 minutes' },
  { value: 30, label: '30-45 minutes' },
  { value: 60, label: '1-2 hours' },
];

const OBSTACLES = [
  'Procrastination',
  'Fear',
  'Overthinking',
  'Distraction',
  'Lack of energy',
  'Not knowing what to do',
];

export const PlanBuilder: React.FC<PlanBuilderProps> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    goal: '',
    category: '',
    timeCommitment: 20,
    obstacles: [] as string[],
    tone: 'gentle' as 'gentle' | 'tough',
    notifications: true,
  });

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      onComplete(formData);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else if (onCancel) {
      onCancel();
    }
  };

  const toggleObstacle = (obstacle: string) => {
    setFormData(prev => ({
      ...prev,
      obstacles: prev.obstacles.includes(obstacle)
        ? prev.obstacles.filter(o => o !== obstacle)
        : [...prev.obstacles, obstacle],
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-8">
          {/* Progress */}
          <div className="flex items-center gap-2 mb-8">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all ${
                  s <= step ? 'bg-align-blue flex-1' : 'bg-gray-200 w-1.5'
                }`}
              />
            ))}
          </div>

          {/* Step 1: Goal */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2 className="text-2xl font-semibold text-align-slate mb-2">
                What is your primary goal?
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                What do you want to transform in the next 30 days?
              </p>
              <input
                type="text"
                value={formData.goal}
                onChange={(e) => setFormData(prev => ({ ...prev, goal: e.target.value }))}
                placeholder="e.g., Build discipline, Reduce anxiety, Start a side hustle..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-align-blue focus:border-transparent"
                autoFocus
              />
              <div className="mt-4">
                <p className="text-xs text-gray-500 mb-3">Or choose a category:</p>
                <div className="grid grid-cols-3 gap-2">
                  {GOAL_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setFormData(prev => ({ ...prev, category: cat.id }))}
                      className={`px-3 py-2 text-xs rounded-lg border transition-colors ${
                        formData.category === cat.id
                          ? 'bg-align-blue text-white border-align-blue'
                          : 'bg-white border-gray-200 hover:border-align-blue/50'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Time */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2 className="text-2xl font-semibold text-align-slate mb-2">
                How much time per day?
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Be realistic. Consistency beats intensity.
              </p>
              <div className="space-y-3">
                {TIME_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFormData(prev => ({ ...prev, timeCommitment: option.value }))}
                    className={`w-full px-4 py-3 rounded-xl border text-left transition-all ${
                      formData.timeCommitment === option.value
                        ? 'bg-align-blue/10 border-align-blue text-align-blue'
                        : 'bg-white border-gray-200 hover:border-align-blue/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{option.label}</span>
                      {formData.timeCommitment === option.value && (
                        <Check className="w-5 h-5" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 3: Obstacles */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2 className="text-2xl font-semibold text-align-slate mb-2">
                What usually gets in your way?
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Select all that apply. This helps ALIGN design your plan.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {OBSTACLES.map((obstacle) => (
                  <button
                    key={obstacle}
                    onClick={() => toggleObstacle(obstacle)}
                    className={`px-4 py-3 rounded-xl border text-left transition-all ${
                      formData.obstacles.includes(obstacle)
                        ? 'bg-align-gold/10 border-align-gold text-align-slate'
                        : 'bg-white border-gray-200 hover:border-align-gold/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{obstacle}</span>
                      {formData.obstacles.includes(obstacle) && (
                        <Check className="w-4 h-4" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 4: Tone */}
          {step === 4 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2 className="text-2xl font-semibold text-align-slate mb-2">
                How do you want ALIGN to guide you?
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Choose your coaching style.
              </p>
              <div className="space-y-4">
                <button
                  onClick={() => setFormData(prev => ({ ...prev, tone: 'gentle' }))}
                  className={`w-full px-6 py-4 rounded-xl border text-left transition-all ${
                    formData.tone === 'gentle'
                      ? 'bg-align-blue/10 border-align-blue'
                      : 'bg-white border-gray-200 hover:border-align-blue/50'
                  }`}
                >
                  <div className="font-semibold mb-1">Gentle</div>
                  <div className="text-sm text-gray-600">
                    Supportive, encouraging, patient. Focus on progress over perfection.
                  </div>
                </button>
                <button
                  onClick={() => setFormData(prev => ({ ...prev, tone: 'tough' }))}
                  className={`w-full px-6 py-4 rounded-xl border text-left transition-all ${
                    formData.tone === 'tough'
                      ? 'bg-align-gold/10 border-align-gold'
                      : 'bg-white border-gray-200 hover:border-align-gold/50'
                  }`}
                >
                  <div className="font-semibold mb-1">Tough Love</div>
                  <div className="text-sm text-gray-600">
                    Direct, no-nonsense, challenging. High standards, no excuses.
                  </div>
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 5: Notifications */}
          {step === 5 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2 className="text-2xl font-semibold text-align-slate mb-2">
                Daily accountability?
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Get morning reminders and evening check-ins.
              </p>
              <div className="space-y-4">
                <button
                  onClick={() => setFormData(prev => ({ ...prev, notifications: true }))}
                  className={`w-full px-6 py-4 rounded-xl border text-left transition-all ${
                    formData.notifications
                      ? 'bg-align-blue/10 border-align-blue'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="font-semibold mb-1">Yes, keep me accountable</div>
                  <div className="text-sm text-gray-600">
                    Morning: "Your task is ready" • Evening: "How did it go?"
                  </div>
                </button>
                <button
                  onClick={() => setFormData(prev => ({ ...prev, notifications: false }))}
                  className={`w-full px-6 py-4 rounded-xl border text-left transition-all ${
                    !formData.notifications
                      ? 'bg-gray-100 border-gray-300'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="font-semibold mb-1">No, I'll check in myself</div>
                  <div className="text-sm text-gray-600">
                    You can always enable this later.
                  </div>
                </button>
              </div>
            </motion.div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            <button
              onClick={handleBack}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              {step === 1 ? 'Cancel' : 'Back'}
            </button>
            <button
              onClick={handleNext}
              disabled={
                (step === 1 && !formData.goal && !formData.category) ||
                (step === 2 && !formData.timeCommitment)
              }
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-align-blue to-align-gold text-white font-medium rounded-full hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {step === 5 ? 'Create My Plan' : 'Next'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

