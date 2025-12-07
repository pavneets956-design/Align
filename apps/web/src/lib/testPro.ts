/**
 * Test Pro Mode Utility
 * 
 * Quick way to enable Pro features for testing
 */

import { upgradeToPro } from './subscription';

/**
 * Enable Pro mode for testing
 * This sets Pro subscription in localStorage
 */
export async function enableTestPro(): Promise<void> {
  await upgradeToPro('pro');
  // Reload to apply changes
  if (typeof window !== 'undefined') {
    window.location.reload();
  }
}

/**
 * Disable Pro mode (reset to free)
 */
export function disableTestPro(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('align_subscription');
    window.location.reload();
  }
}

/**
 * Check if test mode is enabled (for showing test controls)
 */
export function isTestMode(): boolean {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('align_test_mode') === 'true';
  }
  return false;
}

/**
 * Enable test mode (shows test controls)
 */
export function enableTestMode(): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('align_test_mode', 'true');
  }
}


 