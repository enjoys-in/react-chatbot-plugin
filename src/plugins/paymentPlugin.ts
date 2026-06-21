// ─── Payment Plugin ──────────────────────────────────────────────
// Collect payments inline via Stripe, Razorpay, or custom gateway.
// Emits payment events for flow routing (success → next step, failure → error step).

import type { ChatPlugin, PluginContext, ChatPluginEvent } from '../types/plugin';

export interface PaymentRequest {
  amount: number;
  currency: string;
  description?: string;
  metadata?: Record<string, unknown>;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
  amount: number;
  currency: string;
}

export interface PaymentPluginOptions {
  /** Payment gateway: 'stripe' | 'razorpay' | 'custom' */
  gateway: 'stripe' | 'razorpay' | 'custom';
  /** API endpoint for creating payment intent/order */
  endpoint: string;
  /** Request headers (API keys etc.) */
  headers?: Record<string, string>;
  /** Stripe publishable key (if gateway = 'stripe') */
  stripeKey?: string;
  /** Razorpay key ID (if gateway = 'razorpay') */
  razorpayKey?: string;
  /** Callback on successful payment */
  onSuccess?: (result: PaymentResult) => void;
  /** Callback on failed payment */
  onError?: (error: string) => void;
  /** Flow step to go to on success */
  successStep?: string;
  /** Flow step to go to on failure */
  errorStep?: string;
}

export function paymentPlugin(options: PaymentPluginOptions): ChatPlugin {
  return {
    name: 'payment',

    onEvent(event: ChatPluginEvent, ctx: PluginContext) {
      if (event.type === 'payment:request') {
        const request = event.payload as PaymentRequest | undefined;
        if (!request?.amount || !request?.currency) return;

        ctx.addBotMessage(
          `💳 Payment request: **${request.currency.toUpperCase()} ${request.amount.toFixed(2)}**${request.description ? `\n${request.description}` : ''}\n\n_Processing payment..._`
        );

        // Create payment intent/order via backend
        fetch(options.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...options.headers },
          body: JSON.stringify({
            amount: request.amount,
            currency: request.currency,
            gateway: options.gateway,
            metadata: request.metadata,
          }),
        })
          .then((r) => r.json())
          .then((data: { clientSecret?: string; orderId?: string; checkoutUrl?: string; error?: string }) => {
            if (data.error) {
              throw new Error(data.error);
            }

            if (data.checkoutUrl) {
              // Redirect-based payment
              ctx.addBotMessage(`💳 [Click here to complete payment](${data.checkoutUrl})`);
              ctx.emit('payment:redirect', data.checkoutUrl);
            } else {
              // Client-side confirmation (Stripe/Razorpay SDK handles UI)
              ctx.emit('payment:confirm', {
                clientSecret: data.clientSecret,
                orderId: data.orderId,
                gateway: options.gateway,
                amount: request.amount,
                currency: request.currency,
              });
            }
          })
          .catch((err: Error) => {
            const result: PaymentResult = { success: false, error: err.message, amount: request.amount, currency: request.currency };
            options.onError?.(err.message);
            ctx.addBotMessage(`❌ Payment failed: ${err.message}`);
            ctx.emit('payment:failed', result);
            if (options.errorStep) ctx.emit('flow:goto', options.errorStep);
          });
      }

      // Payment confirmed (called after client-side SDK confirmation)
      if (event.type === 'payment:confirmed') {
        const result = event.payload as PaymentResult | undefined;
        if (result?.success) {
          options.onSuccess?.(result);
          ctx.addBotMessage(`✅ Payment successful! Transaction: ${result.transactionId ?? 'confirmed'}`);
          ctx.emit('payment:success', result);
          if (options.successStep) ctx.emit('flow:goto', options.successStep);
        } else {
          options.onError?.(result?.error ?? 'Unknown error');
          ctx.addBotMessage(`❌ Payment failed: ${result?.error ?? 'Unknown error'}`);
          ctx.emit('payment:failed', result);
          if (options.errorStep) ctx.emit('flow:goto', options.errorStep);
        }
      }
    },
  };
}
