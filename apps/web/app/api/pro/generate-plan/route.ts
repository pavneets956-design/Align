import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { buildPlanGenerationPrompt } from '@/src/lib/proPlanPrompt';
import { createClient } from '@supabase/supabase-js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  
  if (!supabaseUrl || !supabaseServiceKey) {
    return null;
  }
  
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
}

export async function POST(request: Request) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return NextResponse.json(
      { error: 'Supabase not configured' },
      { status: 500 }
    );
  }
  
  try {
    const body = await request.json();
    const {
      userId,
      goal,
      category,
      timeCommitment,
      obstacles,
      tone,
      context,
    } = body;

    // Validate required fields
    if (!userId || !goal || !category || !timeCommitment || !tone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check subscription (in production, verify from database)
    // For now, assume they're Pro if they reach this endpoint

    // Generate the 30-day plan using AI
    const prompt = buildPlanGenerationPrompt({
      goal,
      category,
      timeCommitment,
      obstacles: obstacles || [],
      tone,
      context: context || '',
    });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: prompt,
        },
        {
          role: 'user',
          content: `Generate my 30-day ${goal} transformation plan.`,
        },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const planData = JSON.parse(completion.choices[0]?.message?.content || '{}');

    // Calculate dates
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);

    // Create plan in database
    const { data: plan, error: planError } = await supabase
      .from('user_plans')
      .insert({
        user_id: userId,
        goal,
        goal_category: category,
        tone,
        time_commitment: timeCommitment,
        obstacles: obstacles || [],
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        anchor_habit: planData.anchor_habit,
        status: 'active',
      })
      .select()
      .single();

    if (planError) {
      console.error('Plan creation error:', planError);
      return NextResponse.json(
        { error: 'Failed to create plan' },
        { status: 500 }
      );
    }

    // Create all 30 plan days
    const planDays = planData.days.map((day: any, index: number) => {
      const dayDate = new Date(startDate);
      dayDate.setDate(dayDate.getDate() + index);

      return {
        plan_id: plan.id,
        day_number: day.day,
        date: dayDate.toISOString().split('T')[0],
        task_title: day.title,
        task_description: day.description,
        action_steps: day.action_steps,
        reflection_prompt: day.reflection,
        completed: false,
      };
    });

    const { error: daysError } = await supabase
      .from('plan_days')
      .insert(planDays);

    if (daysError) {
      console.error('Plan days creation error:', daysError);
      return NextResponse.json(
        { error: 'Failed to create plan days' },
        { status: 500 }
      );
    }

    // Initialize user progress
    await supabase
      .from('user_progress')
      .upsert({
        user_id: userId,
        plan_id: plan.id,
        current_streak: 0,
        longest_streak: 0,
        total_completed_days: 0,
      });

    // Schedule notifications (in production, use a cron job)
    // For now, just return success

    return NextResponse.json({
      success: true,
      plan: {
        id: plan.id,
        goal,
        anchor_habit: planData.anchor_habit,
        weekly_milestones: planData.weekly_milestones,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
      },
    });
  } catch (error) {
    console.error('Plan generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate plan' },
      { status: 500 }
    );
  }
}

