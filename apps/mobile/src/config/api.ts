/**
 * API Configuration
 * Centralized configuration for backend endpoints and API keys
 */

/**
 * Backend API Configuration
 * 
 * For production:
 * - Set API_BASE_URL to your Cloudflare Worker URL
 * - Example: https://talking-light-worker.your-domain.workers.dev
 * 
 * For local development:
 * - Set USE_LOCAL_BACKEND to true
 * - Ensure Next.js dev server is running on port 3000
 */

/**
 * ALIGN API Base URL
 * Automatically switches between dev and production based on build type
 * 
 * Development (__DEV__ = true):
 *   - Uses local backend (requires npm run dev on your PC)
 *   - Options: localhost (with adb reverse) or LAN IP
 * 
 * Production (__DEV__ = false):
 *   - Uses deployed backend URL (e.g., Vercel)
 *   - No local dev server needed
 */

/**
 * Production Backend URL
 * 
 * AFTER DEPLOYING TO VERCEL:
 * 1. Replace 'https://your-app.vercel.app' below with your actual Vercel URL
 * 2. Rebuild the app in release mode
 * 3. The app will then use the deployed backend instead of localhost
 */
const PROD_BACKEND_URL = 'https://your-app.vercel.app'; // TODO: Replace with your Vercel URL

// Development backend URLs (only used when __DEV__ = true)
const DEV_LOCALHOST = 'http://localhost:3000/api/align'; // Requires: adb reverse tcp:3000 tcp:3000
const DEV_EMULATOR = 'http://10.0.2.2:3000/api/align'; // Android emulator
// const DEV_LAN = 'http://192.168.x.x:3000/api/align'; // Real device on WiFi (replace x.x with your PC IP)

// Choose development URL based on your setup
const DEV_BACKEND_URL = DEV_LOCALHOST; // Change to DEV_EMULATOR or DEV_LAN if needed

/**
 * Auto-select API URL based on build type:
 * - Development (__DEV__ = true): Uses local backend (requires npm run dev)
 * - Production (__DEV__ = false): Uses deployed backend (no local server needed)
 */
export const ALIGN_API_BASE_URL = __DEV__ 
  ? DEV_BACKEND_URL 
  : `${PROD_BACKEND_URL}/api/align`;

// Legacy Cloudflare Worker URL (for old Talking Light endpoints)
export const API_BASE_URL = process.env.WORKER_URL || 'https://your-worker.workers.dev';

// Local Next.js API URL (for development)
export const LOCAL_API_URL = process.env.LOCAL_API_URL || 'http://localhost:3000/api/guidance';

// Use local backend in development mode
export const USE_LOCAL_BACKEND = __DEV__ && process.env.USE_LOCAL_BACKEND !== 'false';

// OpenAI API Key (if needed for direct client-side calls - NOT RECOMMENDED)
// Prefer server-side API calls through your backend
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';

// Supabase Configuration (if needed for direct client access)
export const SUPABASE_URL = process.env.SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
  align: ALIGN_API_BASE_URL,
  alignChat: `${ALIGN_API_BASE_URL}/chat`,
  alignPlans: `${ALIGN_API_BASE_URL}/plans`,
  billing: `${ALIGN_API_BASE_URL.replace('/api/align', '/api/billing')}`,
  // Legacy endpoints
  guidance: USE_LOCAL_BACKEND ? LOCAL_API_URL : `${API_BASE_URL}/guidance`,
  health: `${API_BASE_URL}/health`,
} as const;

/**
 * Environment configuration helper
 */
export const getApiConfig = () => ({
  baseUrl: API_BASE_URL,
  localUrl: LOCAL_API_URL,
  useLocal: USE_LOCAL_BACKEND,
  endpoints: API_ENDPOINTS,
});

