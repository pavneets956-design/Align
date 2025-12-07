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

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId' },
        { status: 400 }
      );
    }

    // Get user subscription status
    const { data: user, error } = await supabase
      .from('users')
      .select('subscription_tier, subscription_status, subscription_expires_at')
      .eq('id', userId)
      .single();

    if (error || !user) {
      return NextResponse.json({
        isPro: false,
        tier: 'free',
        status: 'active',
      });
    }

    const isPro = user.subscription_tier === 'pro' || user.subscription_tier === 'pro-plus';
    const isActive = user.subscription_status === 'active' && 
      (!user.subscription_expires_at || new Date(user.subscription_expires_at) > new Date());

    return NextResponse.json({
      isPro: isPro && isActive,
      tier: user.subscription_tier || 'free',
      status: user.subscription_status || 'active',
      expiresAt: user.subscription_expires_at,
    });
  } catch (error) {
    console.error('Check access error:', error);
    return NextResponse.json(
      { error: 'Failed to check access' },
      { status: 500 }
    );
  }
}

