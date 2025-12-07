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

/**
 * This endpoint is designed to be called by a cron job (Vercel Cron, Supabase Cron, etc.)
 * It sends scheduled notifications to users
 */
export async function POST(request: NextRequest) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return NextResponse.json(
      { error: 'Supabase not configured' },
      { status: 500 }
    );
  }
  
  try {
    const now = new Date();
    const nowISO = now.toISOString();

    // Get all unsent notifications scheduled for now or earlier
    const { data: notifications, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('sent', false)
      .lte('scheduled_for', nowISO)
      .limit(100); // Process in batches

    if (error) {
      console.error('Error fetching notifications:', error);
      return NextResponse.json(
        { error: 'Failed to fetch notifications' },
        { status: 500 }
      );
    }

    if (!notifications || notifications.length === 0) {
      return NextResponse.json({
        success: true,
        sent: 0,
        message: 'No notifications to send',
      });
    }

    // Mark as sent (in production, you'd actually send via email/push here)
    const notificationIds = notifications.map(n => n.id);
    
    const { error: updateError } = await supabase
      .from('notifications')
      .update({
        sent: true,
        sent_at: nowISO,
      })
      .in('id', notificationIds);

    if (updateError) {
      console.error('Error updating notifications:', updateError);
      return NextResponse.json(
        { error: 'Failed to update notifications' },
        { status: 500 }
      );
    }

    // In production, here you would:
    // 1. Send email via SendGrid/Resend
    // 2. Send push notification via OneSignal/Firebase
    // 3. Log the delivery

    return NextResponse.json({
      success: true,
      sent: notifications.length,
      notifications: notifications.map(n => ({
        id: n.id,
        userId: n.user_id,
        type: n.type,
        message: n.message,
      })),
    });
  } catch (error) {
    console.error('Send notifications error:', error);
    return NextResponse.json(
      { error: 'Failed to send notifications' },
      { status: 500 }
    );
  }
}

