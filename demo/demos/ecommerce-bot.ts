import type { DemoConfig } from './types';

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

const demo: DemoConfig = {
  id: 'ecommerce-bot',
  title: 'E-Commerce Bot',
  description: 'Full e-commerce flow: browse products, add to cart, checkout with payment verification.',
  icon: '🛒',
  category: 'advanced',
  flow: {
    startStep: 'welcome',
    steps: [
      {
        id: 'welcome',
        messages: [
          "Welcome to ShopBot! 🛍️",
          "I can help you browse products, track orders, or get support.",
        ],
        quickReplies: [
          { label: '🛍️ Browse Products', value: 'browse', next: 'categories' },
          { label: '📦 Track Order', value: 'track', next: 'track_input' },
          { label: '💬 Customer Support', value: 'support', next: 'support' },
        ],
      },

      // ── Product Browsing ──
      {
        id: 'categories',
        message: "What are you looking for?",
        quickReplies: [
          { label: '👕 Clothing', value: 'clothing', next: 'clothing' },
          { label: '💻 Electronics', value: 'electronics', next: 'electronics' },
          { label: '📚 Books', value: 'books', next: 'books' },
        ],
      },
      {
        id: 'clothing',
        messages: [
          "👕 **Clothing** — Our top picks:",
          "1. Classic T-Shirt — $24.99",
          "2. Premium Hoodie — $59.99",
          "3. Slim Fit Jeans — $49.99",
        ],
        quickReplies: [
          { label: '🛒 Add T-Shirt', value: 'tshirt', next: 'added_to_cart' },
          { label: '🛒 Add Hoodie', value: 'hoodie', next: 'added_to_cart' },
          { label: '🛒 Add Jeans', value: 'jeans', next: 'added_to_cart' },
          { label: '◀ Back', value: 'back', next: 'categories' },
        ],
      },
      {
        id: 'electronics',
        messages: [
          "💻 **Electronics** — Best sellers:",
          "1. Wireless Earbuds — $79.99",
          "2. USB-C Hub — $39.99",
          "3. Mechanical Keyboard — $129.99",
        ],
        quickReplies: [
          { label: '🛒 Add Earbuds', value: 'earbuds', next: 'added_to_cart' },
          { label: '🛒 Add USB-C Hub', value: 'hub', next: 'added_to_cart' },
          { label: '🛒 Add Keyboard', value: 'keyboard', next: 'added_to_cart' },
          { label: '◀ Back', value: 'back', next: 'categories' },
        ],
      },
      {
        id: 'books',
        messages: [
          "📚 **Books** — Staff recommendations:",
          "1. The Art of Code — $19.99",
          "2. Design Patterns — $34.99",
          "3. Clean Architecture — $29.99",
        ],
        quickReplies: [
          { label: '🛒 Add Art of Code', value: 'book1', next: 'added_to_cart' },
          { label: '🛒 Add Design Patterns', value: 'book2', next: 'added_to_cart' },
          { label: '🛒 Add Clean Arch', value: 'book3', next: 'added_to_cart' },
          { label: '◀ Back', value: 'back', next: 'categories' },
        ],
      },
      {
        id: 'added_to_cart',
        message: "✅ Added to cart! What next?",
        quickReplies: [
          { label: '🛍️ Continue Shopping', value: 'browse', next: 'categories' },
          { label: '💳 Checkout', value: 'checkout', next: 'checkout_form' },
        ],
      },

      // ── Checkout ──
      {
        id: 'checkout_form',
        message: "Let's complete your order! 💳",
        form: {
          id: 'checkout',
          title: 'Checkout',
          fields: [
            { name: 'name', type: 'text', label: 'Full Name', required: true },
            { name: 'email', type: 'email', label: 'Email', required: true },
            { name: 'address', type: 'textarea', label: 'Shipping Address', required: true, placeholder: 'Street, City, ZIP' },
            { name: 'payment', type: 'radio', label: 'Payment Method', required: true, options: [
              { label: '💳 Credit Card', value: 'credit' },
              { label: '🏦 Bank Transfer', value: 'bank' },
              { label: '📱 Digital Wallet', value: 'wallet' },
            ]},
          ],
          submitLabel: '✅ Place Order',
        },
        next: 'process_order',
      },
      {
        id: 'process_order',
        message: 'Processing your order...',
        asyncAction: {
          handler: 'process-order',
          loadingMessage: '🔄 Processing order...',
          successMessage: '✅ Order confirmed!',
          errorMessage: '❌ Order failed.',
          onSuccess: 'order_success',
          onError: 'order_fail',
        },
      },
      {
        id: 'order_success',
        messages: [
          "🎉 Your order has been confirmed!",
          "Order #ORD-" + Math.floor(10000 + Math.random() * 90000),
          "You'll receive a confirmation email shortly.",
        ],
        quickReplies: [
          { label: '🛍️ Shop More', value: 'shop', next: 'categories' },
          { label: '👋 Done', value: 'done', next: 'bye' },
        ],
      },
      {
        id: 'order_fail',
        message: "Sorry, there was an issue processing your order.",
        quickReplies: [
          { label: '🔄 Try Again', value: 'retry', next: 'checkout_form' },
          { label: '💬 Contact Support', value: 'support', next: 'support' },
        ],
      },

      // ── Order Tracking ──
      {
        id: 'track_input',
        message: "Enter your order number:",
        form: {
          id: 'track-order',
          title: 'Track Order',
          fields: [{ name: 'order_id', type: 'text', label: 'Order Number', required: true, placeholder: 'ORD-12345' }],
          submitLabel: '📦 Track',
        },
        next: 'track_lookup',
      },
      {
        id: 'track_lookup',
        message: 'Tracking your order...',
        asyncAction: {
          handler: 'track-order',
          loadingMessage: '📦 Finding your package...',
          routes: {
            shipped: 'track_shipped',
            delivered: 'track_delivered',
            not_found: 'track_not_found',
          },
        },
      },
      {
        id: 'track_shipped',
        messages: ["📦 Your order is on its way!", "Estimated delivery: 3-5 business days."],
        quickReplies: [{ label: '◀ Back', value: 'back', next: 'welcome' }],
      },
      {
        id: 'track_delivered',
        messages: ["✅ Your order was delivered!", "If there are any issues, please contact support."],
        quickReplies: [{ label: '◀ Back', value: 'back', next: 'welcome' }],
      },
      {
        id: 'track_not_found',
        message: "🚫 Order not found. Check the number and try again.",
        quickReplies: [{ label: '🔄 Try Again', value: 'retry', next: 'track_input' }, { label: '◀ Back', value: 'back', next: 'welcome' }],
      },

      // ── Support ──
      {
        id: 'support',
        message: "How can we help?",
        quickReplies: [
          { label: '🔄 Return/Exchange', value: 'return', next: 'return_info' },
          { label: '📧 Email Us', value: 'email', next: 'email_info' },
          { label: '◀ Back', value: 'back', next: 'welcome' },
        ],
      },
      { id: 'return_info', message: "Returns are accepted within 30 days. Visit our returns portal at shop.example.com/returns.", quickReplies: [{ label: '◀ Back', value: 'back', next: 'welcome' }] },
      { id: 'email_info', message: "Email us at support@shop.example.com — we reply within 24 hours.", quickReplies: [{ label: '◀ Back', value: 'back', next: 'welcome' }] },
      { id: 'bye', message: "Thanks for shopping with us! 🛍️ Have a great day!" },
    ],
  },
  actionHandlers: {
    'process-order': async (_data, ctx) => {
      ctx.updateMessage('🔗 Connecting to payment gateway...');
      await wait(1000);
      ctx.updateMessage('💳 Authorizing payment...');
      await wait(1200);
      ctx.updateMessage('📦 Reserving inventory...');
      await wait(800);
      ctx.updateMessage('📧 Sending confirmation email...');
      await wait(600);
      return { status: 'success', data: { orderId: 'ORD-' + Date.now() } };
    },
    'track-order': async (data, ctx) => {
      ctx.updateMessage('📦 Locating your package...');
      await wait(1200);
      const id = ((data.order_id as string) ?? '').toUpperCase();
      if (id.includes('123')) return { status: 'shipped', data: { tracking: 'TRK-' + Date.now() } };
      if (id.includes('456')) return { status: 'delivered' };
      return { status: 'not_found' };
    },
  },
};

export default demo;
