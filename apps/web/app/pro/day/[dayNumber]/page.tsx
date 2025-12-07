'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle2, Circle, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface PlanDay {
  id: string;
  day_number: number;
  task_title: string;
  task_description: string;
  action_steps: string[];
  reflection_prompt: string;
  completed: boolean;
  notes?: string;
}

export default function DailyTaskPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const dayNumber = parseInt(params.dayNumber as string);
  const planId = searchParams.get('planId');
  const [day, setDay] = useState<PlanDay | null>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!planId) {
      router.push('/pro/dashboard');
      return;
    }

    // Get userId (in production, from auth)
    const userId = 'user-123'; // TODO: Get from auth

    fetch(`/api/pro/get-plan?userId=${userId}&planId=${planId}`)
      .then(res => res.json())
      .then(data => {
        const dayData = data.plan.days.find((d: PlanDay) => d.day_number === dayNumber);
        if (dayData) {
          setDay(dayData);
          setNotes(dayData.notes || '');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching day:', err);
        setLoading(false);
      });
  }, [planId, dayNumber, router]);

  const handleComplete = async () => {
    if (!planId || !day) return;

    setCompleting(true);

    try {
      // Get userId (in production, from auth)
      const userId = 'user-123'; // TODO: Get from auth

      const response = await fetch('/api/pro/complete-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          planId,
          dayNumber,
          notes: notes.trim() || null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to complete task');
      }

      // Redirect to dashboard
      router.push(`/pro/dashboard?planId=${planId}`);
    } catch (error) {
      console.error('Error completing task:', error);
      alert('Failed to complete task. Please try again.');
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0E1117]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#4A6CF7] mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading task...</p>
        </div>
      </div>
    );
  }

  if (!day) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0E1117]">
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-4">Task not found</p>
          <Link href={`/pro/dashboard?planId=${planId}`} className="text-[#4A6CF7] hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0E1117] px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href={`/pro/dashboard?planId=${planId}`}
            className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-light text-slate-900 dark:text-white mb-2">
            Day {day.day_number}
          </h1>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
            {day.task_title}
          </h2>
        </div>

        {/* Description */}
        <div className="bg-white dark:bg-[#1A1D23] rounded-2xl p-6 border border-slate-200 dark:border-slate-700 mb-6">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            {day.task_description}
          </p>
        </div>

        {/* Action Steps */}
        <div className="bg-white dark:bg-[#1A1D23] rounded-2xl p-6 border border-slate-200 dark:border-slate-700 mb-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Action Steps</h3>
          <ol className="space-y-3">
            {day.action_steps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#4A6CF7] text-white flex items-center justify-center text-sm font-medium">
                  {idx + 1}
                </span>
                <span className="text-slate-700 dark:text-slate-300 flex-1">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Reflection Prompt */}
        <div className="bg-gradient-to-r from-[#4A6CF7]/10 to-[#F4C947]/10 dark:from-[#4A6CF7]/20 dark:to-[#F4C947]/20 rounded-2xl p-6 border border-[#4A6CF7]/20 dark:border-[#4A6CF7]/40 mb-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            Evening Reflection
          </h3>
          <p className="text-slate-700 dark:text-slate-300 italic">
            {day.reflection_prompt}
          </p>
        </div>

        {/* Notes */}
        <div className="bg-white dark:bg-[#1A1D23] rounded-2xl p-6 border border-slate-200 dark:border-slate-700 mb-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Notes</h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any notes or reflections here..."
            className="w-full h-32 px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-[#0E1117] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4A6CF7] focus:border-transparent resize-none"
          />
        </div>

        {/* Complete Button */}
        {!day.completed ? (
          <button
            onClick={handleComplete}
            disabled={completing}
            className="w-full py-4 bg-gradient-to-r from-[#4A6CF7] to-[#F4C947] text-white font-semibold rounded-full hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {completing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Completing...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                Mark as Completed
              </>
            )}
          </button>
        ) : (
          <div className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold rounded-full flex items-center justify-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#4A6CF7]" />
            Completed
          </div>
        )}
      </div>
    </div>
  );
}

