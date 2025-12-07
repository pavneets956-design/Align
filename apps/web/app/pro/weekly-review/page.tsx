'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { TrendingUp, Target, Lightbulb, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface WeeklyReview {
  id: string;
  week_number: number;
  summary: string;
  insights: string;
  adjustments: string;
  motivation: string;
  completed_tasks: number;
  missed_tasks: number;
  efficiency_score: number;
}

export default function WeeklyReviewPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const planId = searchParams.get('planId');
  const weekNumber = parseInt(searchParams.get('week') || '1');
  const [review, setReview] = useState<WeeklyReview | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (!planId) {
      router.push('/pro/dashboard');
      return;
    }

    // Check if review already exists
    // For now, we'll generate it on demand
    setLoading(false);
  }, [planId, weekNumber, router]);

  const handleGenerate = async () => {
    if (!planId) return;

    setGenerating(true);

    try {
      // Get userId (in production, from auth)
      const userId = 'user-123'; // TODO: Get from auth

      const response = await fetch('/api/pro/weekly-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          planId,
          weekNumber,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate review');
      }

      const data = await response.json();
      setReview(data.review);
    } catch (error) {
      console.error('Error generating review:', error);
      alert('Failed to generate review. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0E1117]">
        <Loader2 className="w-12 h-12 animate-spin text-[#4A6CF7]" />
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
            Week {weekNumber} Review
          </h1>
        </div>

        {!review ? (
          <div className="bg-white dark:bg-[#1A1D23] rounded-2xl p-8 border border-slate-200 dark:border-slate-700 text-center">
            <Target className="w-16 h-16 text-[#4A6CF7] mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">
              Generate Your Weekly Review
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Get AI-powered insights on your progress, what's working, and what to adjust.
            </p>
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="px-8 py-3 bg-gradient-to-r from-[#4A6CF7] to-[#F4C947] text-white font-semibold rounded-full hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto"
            >
              {generating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <TrendingUp className="w-5 h-5" />
                  Generate Review
                </>
              )}
            </button>
          </div>
        ) : (
          <>
            {/* Summary Card */}
            <div className="bg-white dark:bg-[#1A1D23] rounded-2xl p-6 border border-slate-200 dark:border-slate-700 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-6 h-6 text-[#4A6CF7]" />
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Summary</h2>
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{review.summary}</p>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white dark:bg-[#1A1D23] rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                <div className="text-3xl font-light text-[#4A6CF7] mb-1">{review.completed_tasks}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Completed</div>
              </div>
              <div className="bg-white dark:bg-[#1A1D23] rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                <div className="text-3xl font-light text-[#F4C947] mb-1">{review.missed_tasks}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Missed</div>
              </div>
              <div className="bg-white dark:bg-[#1A1D23] rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                <div className="text-3xl font-light text-[#A4F2D0] mb-1">{review.efficiency_score}%</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Efficiency</div>
              </div>
            </div>

            {/* Insights */}
            <div className="bg-gradient-to-r from-[#4A6CF7]/10 to-[#F4C947]/10 dark:from-[#4A6CF7]/20 dark:to-[#F4C947]/20 rounded-2xl p-6 border border-[#4A6CF7]/20 dark:border-[#4A6CF7]/40 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <Lightbulb className="w-6 h-6 text-[#4A6CF7]" />
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Insights</h2>
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{review.insights}</p>
            </div>

            {/* Adjustments */}
            <div className="bg-white dark:bg-[#1A1D23] rounded-2xl p-6 border border-slate-200 dark:border-slate-700 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <Target className="w-6 h-6 text-[#F4C947]" />
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Adjustments</h2>
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{review.adjustments}</p>
            </div>

            {/* Motivation */}
            <div className="bg-gradient-to-r from-[#4A6CF7] to-[#F4C947] rounded-2xl p-6 text-white">
              <p className="text-lg font-medium leading-relaxed">{review.motivation}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

