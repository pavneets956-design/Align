import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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

export async function GET(request: NextRequest) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return NextResponse.json(
      { error: 'Supabase not configured' },
      { status: 500 }
    );
  }
  
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const planId = searchParams.get('planId');

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId' },
        { status: 400 }
      );
    }

    // Get active plan
    let query = supabase
      .from('user_plans')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1);

    if (planId) {
      query = query.eq('id', planId);
    }

    const { data: plan, error: planError } = await query.single();

    if (planError || !plan) {
      return NextResponse.json(
        { error: 'No active plan found' },
        { status: 404 }
      );
    }

    // Get all plan days
    const { data: days, error: daysError } = await supabase
      .from('plan_days')
      .select('*')
      .eq('plan_id', plan.id)
      .order('day_number', { ascending: true });

    if (daysError) {
      console.error('Error fetching plan days:', daysError);
    }

    // Get user progress
    const { data: progress } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('plan_id', plan.id)
      .single();

    // Calculate progress stats
    const totalDays = days?.length || 0;
    const completedDays = days?.filter(d => d.completed).length || 0;
    const currentDay = days?.find(d => !d.completed)?.day_number || totalDays;
    const progressPercent = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;

    return NextResponse.json({
      plan: {
        ...plan,
        days: days || [],
        progress: {
          ...progress,
          totalDays,
          completedDays,
          currentDay,
          progressPercent,
        },
      },
    });
  } catch (error) {
    console.error('Get plan error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch plan' },
      { status: 500 }
    );
  }
}

