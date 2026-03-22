# Conditional Branching

Route conversations to different steps based on collected data using conditions.

## Basic Condition

```ts
{
  id: 'check_age',
  message: 'Checking eligibility...',
  condition: {
    field: 'age',       // Key in collectedData
    operator: 'gt',     // Comparison operator
    value: 17,          // Value to compare against
    then: 'adult',      // Step if condition is TRUE
    else: 'minor',      // Step if condition is FALSE
  },
}
```

## Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `eq` | Equal to | `{ field: 'role', operator: 'eq', value: 'admin' }` |
| `neq` | Not equal to | `{ field: 'status', operator: 'neq', value: 'banned' }` |
| `gt` | Greater than | `{ field: 'age', operator: 'gt', value: 17 }` |
| `lt` | Less than | `{ field: 'score', operator: 'lt', value: 50 }` |
| `contains` | String contains | `{ field: 'email', operator: 'contains', value: '@company.com' }` |

## Full Example

```ts
const flow: FlowConfig = {
  startStep: 'ask_age',
  steps: [
    {
      id: 'ask_age',
      message: 'How old are you?',
      form: {
        id: 'age-form',
        fields: [{ name: 'age', type: 'number', label: 'Age', required: true }],
        submitLabel: 'Submit',
      },
      next: 'check_age',
    },
    {
      id: 'check_age',
      message: 'Checking...',
      condition: {
        field: 'age',
        operator: 'gt',
        value: 17,
        then: 'adult_flow',
        else: 'minor_flow',
      },
    },
    {
      id: 'adult_flow',
      message: '✅ Welcome! You have full access.',
    },
    {
      id: 'minor_flow',
      message: '⚠️ Sorry, you must be 18+.',
      quickReplies: [
        { label: 'Try Again', value: 'retry', next: 'ask_age' },
      ],
    },
  ],
};
```

## Chaining Conditions

You can chain multiple conditions by having each condition step route to another:

```ts
// Step 1: Check age
{ id: 'check_age', condition: { field: 'age', operator: 'gt', value: 17, then: 'check_region', else: 'minor' } },
// Step 2: Check region (only reached if age > 17)
{ id: 'check_region', condition: { field: 'region', operator: 'eq', value: 'US', then: 'us_offer', else: 'global_offer' } },
```

## How Data Gets Into collectedData

- **Forms** — All form field values are merged automatically
- **Quick replies** — The `value` of the selected reply is stored
- **Async actions** — `result.data` is merged when returned
- **Custom components** — `onComplete({ data: {...} })` merges data

## Demo

See the **Conditional Branching** demo for an interactive age + region routing example.
