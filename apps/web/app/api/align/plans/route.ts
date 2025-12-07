/**
 * ALIGN Plans API
 * Save and load plans/routines (Pro feature)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  
  if (!supabaseUrl || !supabaseServiceKey) {
    return null;
  }
  
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
}

async function getUserTier(userId: string): Promise<'free' | 'pro'> {
  const supabase = getSupabaseClient();
  if (!supabase) return 'free';

  try {
    const { data } = await supabase
      .from('user_profiles')
      .select('tier')
      .eq('id', userId)
      .single();

    return (data?.tier === 'pro' ? 'pro' : 'free') as 'free' | 'pro';
  } catch {
    return 'free';
  }
}

// GET - List user's saved plans
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId required' },
        { status: 400 }
      );
    }

    // Check if user is Pro
    const tier = await getUserTier(userId);
    if (tier !== 'pro') {
      return NextResponse.json(
        { error: 'Pro subscription required' },
        { status: 403 }
      );
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ plans: data || [] });

  } catch (error) {
    console.error('Error fetching plans:', error);
    return NextResponse.json(
      { error: 'Failed to fetch plans' },
      { status: 500 }
    );
  }
}

// POST - Save a new plan
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, title, content, engineUsed } = body;

    if (!userId || !title || !content) {
      return NextResponse.json(
        { error: 'userId, title, and content required' },
        { status: 400 }
      );
    }

    // Check if user is Pro
    const tier = await getUserTier(userId);
    if (tier !== 'pro') {
      return NextResponse.json(
        { error: 'Pro subscription required' },
        { status: 403 }
      );
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    const { data, error } = await supabase
      .from('plans')
      .insert({
        user_id: userId,
        title,
        content,
        engine_used: engineUsed || 'action',
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ plan: data, message: 'Plan saved successfully' });

  } catch (error) {
    console.error('Error saving plan:', error);
    return NextResponse.json(
      { error: 'Failed to save plan' },
      { status: 500 }
    );
  }
}

