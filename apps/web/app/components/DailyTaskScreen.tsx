'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, X, ArrowLeft, Calendar, Target } from 'lucide-react';

interface DailyTaskScreenProps {
  planId: string;
  userId: string;
  onBack: () => void;
}

export const DailyTaskScreen: React.FC<DailyTaskScreenProps> = ({ planId, userId, onBack }) => {
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    fetchTodayTask();
  }, [planId, userId]);

  const fetchTodayTask = async () => {
    try {
      const response = await fetch(
        `/api/pro/daily-task?userId=${userId}&planId=${planId}&date=${new Date().toISOString().split('T')[0]}`
      );
      const data = await response.json();
      if (data.task) {
        setTask(data.task);
        setCompleted(data.task.completed || false);
      }
    } catch (error) {
      console.error('Error fetching task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    try {
      const response = await fetch('/api/pro/daily-task', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId: task.id,
          completed: !completed,
        }),
      });

      if (response.ok) {
        setCompleted(!completed);
        // Update local task
        setTask((prev: any) => ({ ...prev, completed: !completed }));
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-align-light flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-align-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your task...</p>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-align-light flex items-center justify-center p-4">
        <div className="text-center">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-align-slate mb-2">No task for today</h2>
          <p className="text-gray-600 mb-4">Your plan might not have started yet.</p>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-align-blue text-white rounded-full text-sm"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const actionSteps = Array.isArray(task.action_steps) 
    ? task.action_steps 
    : typeof task.action_steps === 'string' 
      ? JSON.parse(task.action_steps || '[]')
      : [];

  return (
    <div className="min-h-screen bg-align-light">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-sm font-semibold text-align-slate">Day {task.day_number}</h1>
            <p className="text-xs text-gray-500">{new Date(task.date).toLocaleDateString()}</p>
          </div>
        </div>
      </header>

      {/* Task Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-lg p-6 mb-4"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-align-slate mb-2">
                {task.task_title}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {task.task_description}
              </p>
            </div>
            <button
              onClick={handleComplete}
              className={`ml-4 p-3 rounded-full transition-all ${
                completed
                  ? 'bg-green-100 text-green-600'
                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
              }`}
            >
              {completed ? <Check className="w-6 h-6" /> : <X className="w-6 h-6" />}
            </button>
          </div>

          {/* Action Steps */}
          {actionSteps.length > 0 && (
            <div className="mt-6 pt-6 border-t">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-4 h-4 text-align-blue" />
                <h3 className="font-semibold text-align-slate">Action Steps</h3>
              </div>
              <ol className="space-y-3">
                {actionSteps.map((step: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-align-blue/10 text-align-blue flex items-center justify-center text-xs font-semibold">
                      {idx + 1}
                    </span>
                    <span className="text-gray-700 leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Reflection Prompt */}
          {task.reflection_prompt && (
            <div className="mt-6 pt-6 border-t">
              <div className="bg-align-light rounded-xl p-4">
                <h3 className="font-semibold text-align-slate mb-2">Evening Reflection</h3>
                <p className="text-gray-700 text-sm">{task.reflection_prompt}</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Completion Status */}
        {completed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4 text-center"
          >
            <Check className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="font-semibold text-green-800">Task completed!</p>
            <p className="text-sm text-green-700 mt-1">Great work today.</p>
          </motion.div>
        )}
      </main>
    </div>
  );
};

