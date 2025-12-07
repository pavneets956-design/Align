/**
 * Subscription Management
 * 
 * Handles free vs Pro vs Pro+ tiers
 */

export type SubscriptionTier = 'free' | 'pro' | 'pro-plus';

export interface SubscriptionStatus {
  tier: SubscriptionTier;
  isActive: boolean;
  expiresAt?: string;
  features: {
    unlimitedChat: boolean;
    personalizedPlans: boolean;
    dailyNotifications: boolean;
    progressTracking: boolean;
    weeklyCheckins: boolean;
    saveRoutines: boolean;
    voiceMode: boolean;
    unlimitedCustomPlans: boolean;
    priorityAI: boolean;
  };
}

/**
 * Get current subscription status
 * In production, this would check your backend/database
 */
export function getSubscriptionStatus(): SubscriptionStatus {
  // For now, default to free tier
  // In production, check localStorage or API
  const stored = typeof window !== 'undefined' 
    ? localStorage.getItem('align_subscription')
    : null;

  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // Fall through to default
    }
  }

  return {
    tier: 'free',
    isActive: true,
    features: {
      unlimitedChat: true, // Free users get unlimited chat
      personalizedPlans: false,
      dailyNotifications: false,
      progressTracking: false,
      weeklyCheckins: false,
      saveRoutines: false,
      voiceMode: false,
      unlimitedCustomPlans: false,
      priorityAI: false,
    },
  };
}

/**
 * Check if user has access to a specific feature
 */
export function hasFeature(feature: keyof SubscriptionStatus['features']): boolean {
  const status = getSubscriptionStatus();
  return status.features[feature] || false;
}

/**
 * Check if user is on Pro tier
 */
export function isPro(): boolean {
  const status = getSubscriptionStatus();
  return status.tier === 'pro' || status.tier === 'pro-plus';
}

/**
 * Check if user is on Pro+ tier
 */
export function isProPlus(): boolean {
  const status = getSubscriptionStatus();
  return status.tier === 'pro-plus';
}

/**
 * Mock subscription upgrade (in production, this would call your payment API)
 */
export function upgradeToPro(tier: 'pro' | 'pro-plus' = 'pro'): Promise<void> {
  return new Promise((resolve) => {
    // In production, integrate with Stripe/Paddle/etc.
    // For now, just store in localStorage
    const newStatus: SubscriptionStatus = {
      tier,
      isActive: true,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      features: {
        unlimitedChat: true,
        personalizedPlans: tier === 'pro' || tier === 'pro-plus',
        dailyNotifications: tier === 'pro' || tier === 'pro-plus',
        progressTracking: tier === 'pro' || tier === 'pro-plus',
        weeklyCheckins: tier === 'pro' || tier === 'pro-plus',
        saveRoutines: tier === 'pro' || tier === 'pro-plus',
        voiceMode: tier === 'pro-plus',
        unlimitedCustomPlans: tier === 'pro-plus',
        priorityAI: tier === 'pro-plus',
      },
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem('align_subscription', JSON.stringify(newStatus));
    }

    // Simulate API call delay
    setTimeout(() => {
      resolve();
    }, 500);
  });
}

