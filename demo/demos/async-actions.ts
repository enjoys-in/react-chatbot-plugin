import type { DemoConfig } from './types';

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

const demo: DemoConfig = {
  id: 'async-actions',
  title: 'Async Actions / API Calls',
  description: 'Run API calls on step entry with real-time progress messages, success/error handling.',
  icon: '🔄',
  category: 'advanced',
  flow: {
    startStep: 'start',
    steps: [
      {
        id: 'start',
        message: "This demo shows async actions with real-time progress updates. Try it out:",
        quickReplies: [
          { label: '✉️ Verify Email', value: 'email', next: 'collect_email' },
          { label: '💳 Process Payment', value: 'payment', next: 'collect_payment' },
          { label: '🔍 Lookup Order', value: 'order', next: 'collect_order' },
        ],
      },

      // ── Email Verification ──
      {
        id: 'collect_email',
        message: "Enter an email to verify. (Tip: emails starting with 'fail' or 'test' will fail)",
        form: {
          id: 'email-form',
          title: 'Email Verification',
          fields: [
            { name: 'email', type: 'email', label: 'Email Address', required: true, placeholder: 'you@example.com',
              validation: { pattern: '^[^@]+@[^@]+\\.[^@]+$', message: 'Enter a valid email' } },
          ],
          submitLabel: '🔍 Verify',
        },
        next: 'verify_email',
      },
      {
        id: 'verify_email',
        message: 'Starting email verification...',
        asyncAction: {
          handler: 'verify-email',
          loadingMessage: '🔄 Please wait, verifying...',
          successMessage: '✅ Email verified successfully!',
          errorMessage: '❌ Verification failed.',
          onSuccess: 'email_ok',
          onError: 'email_fail',
        },
      },
      {
        id: 'email_ok',
        message: "Your email is verified and ready to go! 🎉",
        quickReplies: [
          { label: '🔄 Try Another', value: 'another', next: 'start' },
          { label: '👋 Done', value: 'done', next: 'bye' },
        ],
      },
      {
        id: 'email_fail',
        message: "That email couldn't be verified.",
        quickReplies: [
          { label: '🔄 Try Again', value: 'retry', next: 'collect_email' },
          { label: '◀ Back', value: 'back', next: 'start' },
        ],
      },

      // ── Payment Processing ──
      {
        id: 'collect_payment',
        message: "Enter a payment amount. (Amounts over $1000 will be declined)",
        form: {
          id: 'payment-form',
          title: 'Payment',
          fields: [
            { name: 'amount', type: 'number', label: 'Amount ($)', required: true, placeholder: '99.99' },
            { name: 'card_last4', type: 'text', label: 'Card Last 4 Digits', required: true, placeholder: '4242' },
          ],
          submitLabel: '💳 Pay Now',
        },
        next: 'process_payment',
      },
      {
        id: 'process_payment',
        message: 'Initiating payment...',
        asyncAction: {
          handler: 'process-payment',
          loadingMessage: '💳 Processing payment...',
          successMessage: '✅ Payment successful!',
          errorMessage: '❌ Payment declined.',
          onSuccess: 'payment_ok',
          onError: 'payment_fail',
        },
      },
      {
        id: 'payment_ok',
        message: "Payment processed! Your receipt has been sent. 🧾",
        quickReplies: [
          { label: '🔄 Try Another', value: 'another', next: 'start' },
          { label: '👋 Done', value: 'done', next: 'bye' },
        ],
      },
      {
        id: 'payment_fail',
        message: "Payment was declined. Please try a different amount.",
        quickReplies: [
          { label: '🔄 Try Again', value: 'retry', next: 'collect_payment' },
          { label: '◀ Back', value: 'back', next: 'start' },
        ],
      },

      // ── Order Lookup ──
      {
        id: 'collect_order',
        message: "Enter your order number. (Try: ORD-001, ORD-002, or anything else)",
        form: {
          id: 'order-form',
          title: 'Order Lookup',
          fields: [
            { name: 'order_id', type: 'text', label: 'Order Number', required: true, placeholder: 'ORD-001' },
          ],
          submitLabel: '🔍 Look Up',
        },
        next: 'lookup_order',
      },
      {
        id: 'lookup_order',
        message: 'Searching for your order...',
        asyncAction: {
          handler: 'lookup-order',
          loadingMessage: '🔍 Searching our system...',
          routes: {
            shipped: 'order_shipped',
            processing: 'order_processing',
            not_found: 'order_not_found',
          },
        },
      },
      {
        id: 'order_shipped',
        messages: [
          "📦 Your order has been shipped!",
          "Tracking: **TRK-28374-US**",
          "Estimated delivery: 3-5 business days.",
        ],
        quickReplies: [
          { label: '🔍 Look Up Another', value: 'another', next: 'collect_order' },
          { label: '◀ Back', value: 'back', next: 'start' },
        ],
      },
      {
        id: 'order_processing',
        messages: [
          "⏳ Your order is being processed.",
          "Expected to ship within 24 hours.",
        ],
        quickReplies: [
          { label: '🔍 Look Up Another', value: 'another', next: 'collect_order' },
          { label: '◀ Back', value: 'back', next: 'start' },
        ],
      },
      {
        id: 'order_not_found',
        message: "🚫 Order not found. Please check the order number and try again.",
        quickReplies: [
          { label: '🔄 Try Again', value: 'retry', next: 'collect_order' },
          { label: '◀ Back', value: 'back', next: 'start' },
        ],
      },

      {
        id: 'bye',
        message: "Thanks for trying the async actions demo! 🎉",
      },
    ],
  },
  actionHandlers: {
    'verify-email': async (data, ctx) => {
      ctx.updateMessage('🔍 Checking email format...');
      await wait(800);
      ctx.updateMessage('📡 Contacting verification server...');
      await wait(1000);
      ctx.updateMessage('🔐 Validating against our records...');
      await wait(800);
      const email = (data.email as string) ?? '';
      if (email.startsWith('fail') || email.startsWith('test')) {
        return { status: 'error', message: `❌ "${email}" could not be verified.` };
      }
      return { status: 'success', data: { verified: true, verifiedAt: new Date().toISOString() } };
    },
    'process-payment': async (data, ctx) => {
      ctx.updateMessage('🔗 Connecting to payment gateway...');
      await wait(800);
      ctx.updateMessage('💳 Authorizing card ending in ' + (data.card_last4 || '****') + '...');
      await wait(1200);
      ctx.updateMessage('🔒 Confirming transaction...');
      await wait(800);
      const amount = Number(data.amount) || 0;
      if (amount > 1000) {
        return { status: 'error', message: `❌ Payment of $${amount} declined — exceeds limit.` };
      }
      return { status: 'success', data: { transactionId: 'TXN-' + Date.now(), amount }, message: `✅ $${amount} charged successfully!` };
    },
    'lookup-order': async (data, ctx) => {
      ctx.updateMessage('🔍 Searching database...');
      await wait(800);
      ctx.updateMessage('📋 Retrieving order details...');
      await wait(1000);
      const orderId = ((data.order_id as string) ?? '').toUpperCase();
      if (orderId === 'ORD-001') return { status: 'shipped', data: { orderId, tracking: 'TRK-28374-US' } };
      if (orderId === 'ORD-002') return { status: 'processing', data: { orderId } };
      return { status: 'not_found' };
    },
  },
};

export default demo;
