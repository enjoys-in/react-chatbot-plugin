import type { DemoConfig } from './types';

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

const demo: DemoConfig = {
  id: 'error-handling',
  title: 'Error Handling & Recovery',
  description: 'Graceful API failure handling with retry options and fallback flows.',
  icon: '❌',
  category: 'advanced',
  flow: {
    startStep: 'start',
    steps: [
      {
        id: 'start',
        message: "This demo simulates various error scenarios. Choose one:",
        quickReplies: [
          { label: '💥 API Crash', value: 'crash', next: 'api_crash' },
          { label: '⏰ Timeout', value: 'timeout', next: 'api_timeout' },
          { label: '🔒 Auth Failure', value: 'auth', next: 'auth_fail' },
        ],
      },

      // ── Scenario 1: API Crash (throws exception) ──
      {
        id: 'api_crash',
        messages: [
          "Simulating a server crash...",
          "Watch how the chatbot handles an unexpected exception:",
        ],
        asyncAction: {
          handler: 'crashing-api',
          loadingMessage: '🔄 Calling external service...',
          errorMessage: '❌ Service unavailable — internal server error.',
          onError: 'crash_recovery',
        },
      },
      {
        id: 'crash_recovery',
        message: "The service crashed, but we caught it gracefully! What now?",
        quickReplies: [
          { label: '🔄 Retry', value: 'retry', next: 'api_crash' },
          { label: '📧 Email Support', value: 'email', next: 'email_support' },
          { label: '◀ Try Another', value: 'back', next: 'start' },
        ],
      },

      // ── Scenario 2: Timeout (slow API) ──
      {
        id: 'api_timeout',
        messages: [
          "Simulating a slow API that takes too long...",
          "The handler returns an error status after a delay:",
        ],
        asyncAction: {
          handler: 'slow-api',
          loadingMessage: '🔄 Connecting to slow service...',
          errorMessage: '⏰ Request timed out.',
          onSuccess: 'timeout_ok',
          onError: 'timeout_recovery',
        },
      },
      {
        id: 'timeout_ok',
        message: "Surprisingly, it worked! (This shouldn't normally happen.)",
        next: 'start',
      },
      {
        id: 'timeout_recovery',
        message: "The request took too long and was aborted. Options:",
        quickReplies: [
          { label: '🔄 Retry', value: 'retry', next: 'api_timeout' },
          { label: '◀ Try Another', value: 'back', next: 'start' },
        ],
      },

      // ── Scenario 3: Authentication Failure ──
      {
        id: 'auth_fail',
        messages: [
          "Simulating an authentication check that fails...",
          "The handler returns status 'unauthorized' which routes to a login prompt:",
        ],
        asyncAction: {
          handler: 'auth-check',
          loadingMessage: '🔐 Verifying credentials...',
          routes: {
            authorized: 'auth_success',
            unauthorized: 'auth_denied',
            expired: 'auth_expired',
          },
        },
      },
      {
        id: 'auth_success',
        message: "✅ You're authenticated! Welcome back.",
        next: 'start',
      },
      {
        id: 'auth_denied',
        message: "🔒 Access denied. Your credentials are invalid.",
        quickReplies: [
          { label: '🔄 Try Again', value: 'retry', next: 'auth_fail' },
          { label: '🔑 Reset Password', value: 'reset', next: 'reset_password' },
          { label: '◀ Back', value: 'back', next: 'start' },
        ],
      },
      {
        id: 'auth_expired',
        message: "⏰ Your session has expired. Please log in again.",
        quickReplies: [
          { label: '🔄 Re-authenticate', value: 'retry', next: 'auth_fail' },
          { label: '◀ Back', value: 'back', next: 'start' },
        ],
      },
      {
        id: 'reset_password',
        message: "📧 A password reset link has been sent to your email.",
        quickReplies: [
          { label: '◀ Back', value: 'back', next: 'start' },
        ],
      },
      {
        id: 'email_support',
        message: "📧 We've notified our support team. You'll hear back within 1 hour.",
        quickReplies: [
          { label: '◀ Back', value: 'back', next: 'start' },
        ],
      },
    ],
  },
  actionHandlers: {
    'crashing-api': async (_data, ctx) => {
      ctx.updateMessage('🔗 Establishing connection...');
      await wait(800);
      ctx.updateMessage('📡 Sending request...');
      await wait(1000);
      throw new Error('500 Internal Server Error');
    },
    'slow-api': async (_data, ctx) => {
      ctx.updateMessage('🔄 Waiting for response...');
      await wait(1500);
      ctx.updateMessage('⏳ Still waiting... (this is taking long)');
      await wait(2000);
      ctx.updateMessage('⏰ Service is not responding...');
      await wait(1000);
      return { status: 'error', message: '⏰ Request timed out after 4.5 seconds.' };
    },
    'auth-check': async (_data, ctx) => {
      ctx.updateMessage('🔐 Checking session token...');
      await wait(800);
      ctx.updateMessage('🔑 Validating credentials...');
      await wait(1000);
      // Randomly pick a failure mode for demo purposes
      const outcomes = ['unauthorized', 'expired', 'unauthorized'] as const;
      const outcome = outcomes[Math.floor(Math.random() * outcomes.length)]!;
      return { status: outcome };
    },
  },
};

export default demo;
