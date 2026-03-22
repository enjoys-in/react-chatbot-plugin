# Custom Step Components

Render your own interactive React widgets inside flow steps.

## How It Works

1. Create a React component that accepts `StepComponentProps`
2. Register it in the `components` prop
3. Reference it by key in a flow step's `component` field
4. The component calls `onComplete()` to continue the flow

## Basic Example

```tsx
import type { StepComponentProps } from '@enjoys/react-chatbot-plugin';

const PlanSelector: React.FC<StepComponentProps> = ({ data, onComplete }) => (
  <div style={{ padding: 16, background: '#f5f3ff', borderRadius: 12 }}>
    <p>Hi {data.name as string}! Pick a plan:</p>
    <button onClick={() => onComplete({
      status: 'success',
      data: { plan: 'basic' },
      next: 'basic_step',
    })}>
      Basic — $9/mo
    </button>
    <button onClick={() => onComplete({
      status: 'success',
      data: { plan: 'pro' },
      next: 'pro_step',
    })}>
      Pro — $29/mo
    </button>
  </div>
);
```

Register and use it:

```tsx
const flow: FlowConfig = {
  startStep: 'choose',
  steps: [
    { id: 'choose', message: 'Select a plan:', component: 'PlanSelector' },
    { id: 'basic_step', message: 'Basic plan selected!' },
    { id: 'pro_step', message: 'Pro plan selected!' },
  ],
};

<ChatBot
  flow={flow}
  components={{ PlanSelector }}
/>
```

## StepComponentProps

| Property | Type | Description |
|----------|------|-------------|
| `stepId` | `string` | The step ID that owns this component |
| `data` | `Record<string, unknown>` | All collected data from forms, quick replies, etc. |
| `onComplete` | `(result?: FlowActionResult) => void` | Call to finish and advance the flow |

## onComplete Result

The `onComplete` callback accepts an optional `FlowActionResult`:

```ts
onComplete({
  status: 'success',         // Any string
  data: { plan: 'pro' },     // Merged into collectedData
  message: 'Great choice!',  // Optional bot message
  next: 'pro_step',          // Which step to go to next
})
```

If no `next` is provided, the step's `next` field is used as fallback.

If `onComplete()` is called with no arguments, the step's default `next` is used.

## Routing from Components

Components can route to different steps based on user interaction:

```tsx
const ColorPicker: React.FC<StepComponentProps> = ({ onComplete }) => (
  <div>
    {['red', 'blue', 'green'].map(color => (
      <button key={color} onClick={() => onComplete({
        status: 'success',
        data: { color },
        next: `color_${color}`,  // Dynamic routing!
      })}>
        {color}
      </button>
    ))}
  </div>
);
```

## Interactive Components

Components can have internal state (hooks, forms, etc.):

```tsx
const StarRating: React.FC<StepComponentProps> = ({ onComplete }) => {
  const [rating, setRating] = useState(0);

  return (
    <div>
      {[1, 2, 3, 4, 5].map(star => (
        <span key={star} onClick={() => setRating(star)}
          style={{ opacity: star <= rating ? 1 : 0.3, cursor: 'pointer', fontSize: 24 }}>
          ⭐
        </span>
      ))}
      <button disabled={!rating} onClick={() => onComplete({
        status: rating >= 4 ? 'positive' : 'negative',
        data: { rating },
      })}>
        Submit
      </button>
    </div>
  );
};
```

## Accessing Collected Data

The `data` prop contains everything collected so far:

```tsx
const Summary: React.FC<StepComponentProps> = ({ data, onComplete }) => (
  <div>
    <h3>Summary</h3>
    <p>Name: {data.name as string}</p>
    <p>Email: {data.email as string}</p>
    <p>Plan: {data.plan as string}</p>
    <button onClick={() => onComplete()}>Confirm</button>
  </div>
);
```

## Blocking Input

While a component step is active, user text input is blocked. Users can type `/back` to navigate away.

## Demo

See **Custom Step Components** demo for plan selector, star rating, and color picker examples.
