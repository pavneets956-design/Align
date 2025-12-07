/**
 * Stripe Webhook Handler
 * Handles subscription events and updates user tier
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

// Get Supabase client
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

async function updateUserTier(
  userId: string,
  tier: 'free' | 'pro',
  subscriptionId?: string,
  customerId?: string
) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    console.error('Supabase not configured - cannot update user tier');
    return;
  }

  try {
    // Check if user profile exists
    const { data: existing } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('id', userId)
      .single();

    if (existing) {
      // Update existing profile
      await supabase
        .from('user_profiles')
        .update({
          tier,
          stripe_customer_id: customerId || null,
          stripe_subscription_id: subscriptionId || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);
    } else {
      // Create new profile
      await supabase.from('user_profiles').insert({
        id: userId,
        tier,
        stripe_customer_id: customerId || null,
        stripe_subscription_id: subscriptionId || null,
      });
    }
  } catch (error) {
    console.error('Error updating user tier:', error);
  }
}

async function logWebhookEvent(eventType: string, stripeEventId: string, eventData: any, userId?: string) {
  const supabase = getSupabaseClient();
  if (!supabase) return;

  try {
    await supabase.from('subscription_events').insert({
      event_type: eventType,
      stripe_event_id: stripeEventId,
      event_data: eventData,
      user_id: userId || null,
    });
  } catch (error) {
    console.error('Error logging webhook event:', error);
  }
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature || !webhookSecret) {
    return NextResponse.json(
      { error: 'Missing signature or webhook secret' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId || session.client_reference_id;

        if (userId && userId !== 'anonymous') {
          await updateUserTier(
            userId,
            'pro',
            session.subscription as string,
            session.customer as string
          );
          await logWebhookEvent(event.type, event.id, event.data.object, userId);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;

        if (userId) {
          const status = subscription.status;
          const tier = status === 'active' || status === 'trialing' ? 'pro' : 'free';
          await updateUserTier(
            userId,
            tier,
            subscription.id,
            subscription.customer as string
          );
          await logWebhookEvent(event.type, event.id, event.data.object, userId);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;

        if (userId) {
          await updateUserTier(userId, 'free');
          await logWebhookEvent(event.type, event.id, event.data.object, userId);
        }
        break;
      }

      default:
        // Log other events but don't process them
        await logWebhookEvent(event.type, event.id, event.data.object);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

