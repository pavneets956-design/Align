/**
 * Stripe Checkout Session Creation
 * Creates a checkout session for ALIGN Pro subscription
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20',
});

export async function POST(request: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'STRIPE_SECRET_KEY not configured' },
        { status: 500 }
      );
    }

    if (!process.env.STRIPE_PRICE_ID_ALIGN_PRO) {
      return NextResponse.json(
        { error: 'STRIPE_PRICE_ID_ALIGN_PRO not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { userId, successUrl, cancelUrl } = body;

    // Get origin for default URLs
    const origin = request.headers.get('origin') || 'http://localhost:3000';
    const defaultSuccessUrl = `${origin}/?session_id={CHECKOUT_SESSION_ID}&success=true`;
    const defaultCancelUrl = `${origin}/?canceled=true`;

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID_ALIGN_PRO,
          quantity: 1,
        },
      ],
      success_url: successUrl || defaultSuccessUrl,
      cancel_url: cancelUrl || defaultCancelUrl,
      customer_email: body.email || undefined,
      client_reference_id: userId || undefined,
      metadata: {
        userId: userId || 'anonymous',
      },
      subscription_data: {
        metadata: {
          userId: userId || 'anonymous',
        },
      },
    });

    return NextResponse.json({ url: session.url });

  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

