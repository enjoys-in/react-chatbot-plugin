# Advanced Patterns

Real-world examples combining multiple features for complex use cases.

## E-Commerce Bot

A full shopping experience: browse products, add to cart, checkout with async payment processing, and order tracking.

**Features used:** Quick replies, forms, async actions, dynamic routing, error handling

```ts
const flow: FlowConfig = {
  startStep: 'welcome',
  steps: [
    {
      id: 'welcome',
      messages: ['Welcome to ShopBot! 🛍️', 'How can I help?'],
      quickReplies: [
        { label: '🛍️ Browse', value: 'browse', next: 'categories' },
        { label: '📦 Track Order', value: 'track', next: 'track_input' },
      ],
    },
    // ... category browsing, product selection ...
    {
      id: 'checkout',
      message: 'Complete your order:',
      form: { /* name, email, address, payment method */ },
      next: 'process_order',
    },
    {
      id: 'process_order',
      asyncAction: {
        handler: 'process-order',
        loadingMessage: '🔄 Processing...',
        onSuccess: 'order_confirmed',
        onError: 'order_failed',
      },
    },
    // ... confirmation, tracking ...
  ],
};
```

See the **E-Commerce Bot** demo for the complete implementation.

---

## Onboarding Wizard

Multi-step user setup: login → team info → email verification → plan selection → feature config → workspace creation.

**Features used:** Login form, forms, async actions (2 steps), quick replies, error handling

```ts
// Login gate collects name + email
// Step 1: Team info form (company, size, industry)
// Step 2: Async email domain verification
// Step 3: Plan selection via quick replies
// Step 4: Feature selection form (checkboxes)
// Step 5: Async workspace creation with 5 progress updates
```

See the **Onboarding Wizard** demo for the complete implementation.

---

## Error Recovery Pattern

Graceful handling of API failures with retry, fallback, and support escalation.

```ts
{
  id: 'api_call',
  asyncAction: {
    handler: 'risky-api',
    loadingMessage: '🔄 Processing...',
    errorMessage: '❌ Something went wrong.',
    onError: 'recovery',  // Always goes here on failure
  },
},
{
  id: 'recovery',
  message: 'What would you like to do?',
  quickReplies: [
    { label: '🔄 Retry', value: 'retry', next: 'api_call' },
    { label: '💬 Support', value: 'support', next: 'support_flow' },
    { label: '◀ Go Back', value: 'back', next: 'previous_step' },
  ],
}
```

---

## Multi-Status API Pattern

Handle many possible API outcomes:

```ts
{
  id: 'check',
  asyncAction: {
    handler: 'check-status',
    routes: {
      active: 'dashboard',
      pending: 'pending_approval',
      suspended: 'account_suspended',
      banned: 'account_banned',
      not_found: 'register',
      maintenance: 'maintenance_page',
    },
  },
}
```

---

## Data Collection → Verification → Action Pattern

A common pattern: collect data via form, verify via API, then act:

```ts
steps: [
  // Step 1: Collect
  { id: 'collect', message: 'Enter details:', form: { ... }, next: 'verify' },
  // Step 2: Verify
  { id: 'verify', asyncAction: { handler: 'verify', onSuccess: 'act', onError: 'collect' } },
  // Step 3: Act
  { id: 'act', asyncAction: { handler: 'process', onSuccess: 'done', onError: 'retry' } },
  // Step 4: Done
  { id: 'done', message: 'All done! 🎉' },
]
```

---

## Custom Component → Async Action Pipeline

Combine custom components with async actions:

```ts
steps: [
  // Interactive widget
  { id: 'picker', component: 'PlanSelector' },
  // API call based on selection
  { id: 'provision', asyncAction: { handler: 'provision', onSuccess: 'ready', onError: 'retry' } },
  // Success
  { id: 'ready', message: 'Your plan is active!' },
]
```

The component's `onComplete` merges `data` (e.g., `{ plan: 'pro' }`) into collectedData, which the async handler then uses.

---

## Combining Everything

A real-world flow might use all features together:

1. **Login form** → Collect identity
2. **Quick replies** → Choose path
3. **Form** → Gather details
4. **Condition** → Route by data
5. **Async action** → Verify/process
6. **Custom component** → Interactive selection
7. **Dynamic routing** → Branch by API result
8. **Slash commands** → User can /back or /restart at any time

Each feature composes naturally— data flows through the entire pipeline via `collectedData`.
