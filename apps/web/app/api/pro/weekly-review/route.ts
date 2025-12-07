import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, planId, weekNumber } = body;

    if (!userId || !planId || !weekNumber) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get plan details
    const { data: plan } = await supabase
      .from('user_plans')
      .select('*')
      .eq('id', planId)
      .single();

    if (!plan) {
      return NextResponse.json(
        { error: 'Plan not found' },
        { status: 404 }
      );
    }

    // Get days for this week
    const weekStart = (weekNumber - 1) * 7 + 1;
    const weekEnd = weekNumber * 7;

    const { data: weekDays } = await supabase
      .from('plan_days')
      .select('*')
      .eq('plan_id', planId)
      .gte('day_number', weekStart)
      .lte('day_number', weekEnd)
      .order('day_number', { ascending: true });

    const completedTasks = weekDays?.filter(d => d.completed).length || 0;
    const missedTasks = (weekDays?.length || 0) - completedTasks;

    // Generate AI review
    const reviewPrompt = `You are ALIGN PRO's weekly review engine.

Analyze this week's progress for a user working on: "${plan.goal}"

Week ${weekNumber} Summary:
- Completed tasks: ${completedTasks} out of ${weekDays?.length || 0}
- Missed tasks: ${missedTasks}
- Tone preference: ${plan.tone}

Tasks this week:
${weekDays?.map(d => `Day ${d.day_number}: ${d.task_title} - ${d.completed ? '✅ Completed' : '❌ Missed'}`).join('\n')}

Generate a weekly review in JSON format:
{
  "summary": "2-3 sentences summarizing the week",
  "insights": "What patterns did you notice? What worked? What didn't?",
  "adjustments": "What should change for next week? Be specific.",
  "motivation": "One encouraging line to keep momentum",
  "efficiency_score": ${Math.round((completedTasks / (weekDays?.length || 1)) * 100)}
}

Be ${plan.tone === 'tough' ? 'direct and no-nonsense' : 'supportive and encouraging'}.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are ALIGN PRO, a transformation coach that provides weekly progress reviews.',
        },
        {
          role: 'user',
          content: reviewPrompt,
        },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const reviewData = JSON.parse(completion.choices[0]?.message?.content || '{}');

    // Save review to database
    const { data: review, error: reviewError } = await supabase
      .from('weekly_reviews')
      .insert({
        plan_id: planId,
        week_number: weekNumber,
        summary: reviewData.summary || '',
        insights: reviewData.insights || '',
        adjustments: reviewData.adjustments || '',
        motivation: reviewData.motivation || '',
        completed_tasks: completedTasks,
        missed_tasks: missedTasks,
        efficiency_score: reviewData.efficiency_score || 0,
      })
      .select()
      .single();

    if (reviewError) {
      console.error('Error saving review:', reviewError);
    }

    return NextResponse.json({
      success: true,
      review: {
        ...review,
        ...reviewData,
      },
    });
  } catch (error) {
    console.error('Weekly review error:', error);
    return NextResponse.json(
      { error: 'Failed to generate weekly review' },
      { status: 500 }
    );
  }
}
