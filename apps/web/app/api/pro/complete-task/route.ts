import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, planId, dayNumber, notes } = body;

    if (!userId || !planId || !dayNumber) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Update the plan day
    const { data: day, error: dayError } = await supabase
      .from('plan_days')
      .update({
        completed: true,
        completed_at: new Date().toISOString(),
        notes: notes || null,
        updated_at: new Date().toISOString(),
      })
      .eq('plan_id', planId)
      .eq('day_number', dayNumber)
      .select()
      .single();

    if (dayError) {
      console.error('Error completing task:', dayError);
      return NextResponse.json(
        { error: 'Failed to complete task' },
        { status: 500 }
      );
    }

    // Update user progress
    const { data: progress } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('plan_id', planId)
      .single();

    if (progress) {
      const totalCompleted = progress.total_completed_days + 1;
      const lastActiveDate = new Date().toISOString().split('T')[0];
      
      // Calculate streak (simplified - check if completed yesterday)
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      let currentStreak = progress.current_streak || 0;
      if (progress.last_active_date === yesterdayStr || !progress.last_active_date) {
        currentStreak += 1;
      } else {
        currentStreak = 1;
      }

      const longestStreak = Math.max(currentStreak, progress.longest_streak || 0);

      await supabase
        .from('user_progress')
        .update({
          total_completed_days: totalCompleted,
          current_streak: currentStreak,
          longest_streak: longestStreak,
          last_active_date: lastActiveDate,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .eq('plan_id', planId);
    }

    return NextResponse.json({
      success: true,
      day,
    });
  } catch (error) {
    console.error('Complete task error:', error);
    return NextResponse.json(
      { error: 'Failed to complete task' },
      { status: 500 }
    );
  }
}

