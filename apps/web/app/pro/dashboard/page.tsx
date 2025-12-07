'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Calendar, CheckCircle2, Circle, TrendingUp, Target, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Plan {
  id: string;
  goal: string;
  anchor_habit: string;
  start_date: string;
  end_date: string;
  days: Array<{
    id: string;
    day_number: number;
    task_title: string;
    completed: boolean;
  }>;
  progress: {
    totalDays: number;
    completedDays: number;
    currentDay: number;
    progressPercent: number;
  };
}

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const planId = searchParams.get('planId');
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!planId) {
      router.push('/pro');
      return;
    }

    // Get userId (in production, from auth)
    const userId = 'user-123'; // TODO: Get from auth

    fetch(`/api/pro/get-plan?userId=${userId}&planId=${planId}`)
      .then(res => res.json())
      .then(data => {
        setPlan(data.plan);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching plan:', err);
        setLoading(false);
      });
  }, [planId, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0E1117]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#4A6CF7] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading your plan...</p>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0E1117]">
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-4">Plan not found</p>
          <Link href="/pro" className="text-[#4A6CF7] hover:underline">
            Create a new plan
          </Link>
        </div>
      </div>
    );
  }

  const today = new Date();
  const currentDay = plan.days.find(d => {
    const dayDate = new Date(plan.start_date);
    dayDate.setDate(dayDate.getDate() + d.day_number - 1);
    return dayDate.toDateString() === today.toDateString();
  });

  const upcomingDays = plan.days
    .filter(d => !d.completed && d.day_number >= plan.progress.currentDay)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0E1117] px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-light text-slate-900 dark:text-white mb-2">
            Your <span className="text-[#4A6CF7]">Transformation</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400">{plan.goal}</p>
        </div>

        {/* Progress Card */}
        <div className="bg-white dark:bg-[#1A1D23] rounded-2xl p-6 border border-slate-200 dark:border-slate-700 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Progress</h2>
            <span className="text-2xl font-light text-[#4A6CF7]">
              {plan.progress.progressPercent}%
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 mb-4">
            <div
              className="bg-gradient-to-r from-[#4A6CF7] to-[#F4C947] h-3 rounded-full transition-all duration-500"
              style={{ width: `${plan.progress.progressPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
            <span>{plan.progress.completedDays} of {plan.progress.totalDays} days completed</span>
            <span>Day {plan.progress.currentDay}</span>
          </div>
        </div>

        {/* Anchor Habit */}
        <div className="bg-gradient-to-r from-[#4A6CF7]/10 to-[#F4C947]/10 dark:from-[#4A6CF7]/20 dark:to-[#F4C947]/20 rounded-2xl p-6 border border-[#4A6CF7]/20 dark:border-[#4A6CF7]/40 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-6 h-6 text-[#4A6CF7]" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Anchor Habit</h3>
          </div>
          <p className="text-slate-700 dark:text-slate-300">{plan.anchor_habit}</p>
        </div>

        {/* Today's Task */}
        {currentDay && (
          <div className="bg-white dark:bg-[#1A1D23] rounded-2xl p-6 border border-slate-200 dark:border-slate-700 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Today's Task</h2>
              <Link
                href={`/pro/day/${currentDay.day_number}?planId=${planId}`}
                className="text-[#4A6CF7] hover:underline text-sm flex items-center gap-1"
              >
                View Details
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <h3 className="text-xl font-medium text-slate-900 dark:text-white mb-2">
              Day {currentDay.day_number}: {currentDay.task_title}
            </h3>
            {currentDay.completed ? (
              <div className="flex items-center gap-2 text-[#4A6CF7]">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm font-medium">Completed</span>
              </div>
            ) : (
              <Link
                href={`/pro/day/${currentDay.day_number}?planId=${planId}`}
                className="inline-block mt-4 px-6 py-2 bg-[#4A6CF7] text-white rounded-full hover:bg-[#3A5CE7] transition-colors"
              >
                Start Task
              </Link>
            )}
          </div>
        )}

        {/* Upcoming Tasks */}
        {upcomingDays.length > 0 && (
          <div className="bg-white dark:bg-[#1A1D23] rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Upcoming</h2>
            <div className="space-y-3">
              {upcomingDays.map((day) => (
                <Link
                  key={day.id}
                  href={`/pro/day/${day.day_number}?planId=${planId}`}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-[#4A6CF7] dark:hover:border-[#4A6CF7] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Circle className="w-5 h-5 text-slate-400" />
                    <div>
                      <div className="text-sm font-medium text-slate-900 dark:text-white">
                        Day {day.day_number}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">
                        {day.task_title}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

