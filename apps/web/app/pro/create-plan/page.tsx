'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlanBuilder } from '@/app/components/PlanBuilder';
import { Loader2 } from 'lucide-react';

export default function CreatePlanPage() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleComplete = async (formData: any) => {
    setIsGenerating(true);

    try {
      // Get userId (in production, from auth)
      const userId = 'user-123'; // TODO: Get from auth

      const response = await fetch('/api/pro/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          goal: formData.goal,
          category: formData.category || 'other',
          timeCommitment: formData.timeCommitment,
          obstacles: formData.obstacles,
          tone: formData.tone,
          context: '', // Could include chat history
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate plan');
      }

      const data = await response.json();
      
      // Redirect to dashboard
      router.push(`/pro/dashboard?planId=${data.plan.id}`);
    } catch (error) {
      console.error('Error generating plan:', error);
      alert('Failed to generate plan. Please try again.');
      setIsGenerating(false);
    }
  };

  if (isGenerating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0E1117]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#4A6CF7] mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">
            Creating Your Plan
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            This takes about 30 seconds...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0E1117]">
      <PlanBuilder onComplete={handleComplete} onCancel={() => router.push('/pro')} />
    </div>
  );
}

