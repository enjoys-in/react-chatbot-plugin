# Dynamic Routing

Route conversations to different steps based on API response status using `asyncAction.routes`.

## Basic Usage

```ts
{
  id: 'check_account',
  message: 'Looking up your account...',
  asyncAction: {
    handler: 'check-account',
    loadingMessage: '🔍 Searching...',
    routes: {
      admin: 'admin_panel',       // result.status === 'admin'
      vip: 'vip_welcome',         // result.status === 'vip'
      active: 'dashboard',        // result.status === 'active'
      not_found: 'register',      // result.status === 'not_found'
    },
  },
}
```

The action handler returns a status string that determines which route to take:

```ts
'check-account': async (data, ctx) => {
  ctx.updateMessage('🔍 Looking up...');
  const user = await api.findUser(data.username);

  if (!user) return { status: 'not_found' };
  return { status: user.role, data: { userId: user.id } };
  // user.role could be 'admin', 'vip', or 'active'
}
```

## Routing Priority

When an async action completes, the next step is determined in this order:

| Priority | Source | Example |
|----------|--------|---------|
| 1 (highest) | `result.next` | Handler returns `{ next: 'step_x' }` |
| 2 | `routes[status]` | `routes: { admin: 'admin_panel' }` |
| 3 | `onSuccess` / `onError` | `onSuccess: 'default_success'` |
| 4 (lowest) | `step.next` | `next: 'fallback_step'` |

## Multiple Status Routes

You can map as many statuses as you need:

```ts
asyncAction: {
  handler: 'check-ticket',
  routes: {
    open: 'ticket_open',
    in_progress: 'ticket_progress',
    resolved: 'ticket_resolved',
    closed: 'ticket_closed',
    escalated: 'ticket_escalated',
    not_found: 'ticket_missing',
  },
}
```

## Combining Routes with onSuccess/onError

Use `routes` for specific statuses and `onSuccess`/`onError` as fallbacks:

```ts
asyncAction: {
  handler: 'process',
  routes: {
    admin: 'admin_flow',         // Specific route
    vip: 'vip_flow',             // Specific route
  },
  onSuccess: 'default_success',  // Fallback for other success statuses
  onError: 'error_flow',         // Fallback for errors
}
```

## Handler Override with result.next

The handler can override all routing by returning `next`:

```ts
'smart-router': async (data, ctx) => {
  const result = await api.analyze(data);

  // This overrides routes, onSuccess, etc.
  if (result.needsSpecialHandling) {
    return { status: 'special', next: 'special_flow' };
  }

  // This uses normal routes mapping
  return { status: result.category };
}
```

## Demo

See **Dynamic Routing** demo for account lookup (admin/vip/banned/active) and ticket status (open/resolved/escalated) examples.
