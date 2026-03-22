# Forms & Validation

Forms can be embedded in flow steps or used as a pre-chat login gate.

## Inline Form in a Flow Step

```ts
{
  id: 'contact',
  message: 'Please fill out this form:',
  form: {
    id: 'contact-form',
    title: 'Contact Us',
    description: 'We\'ll get back to you within 24 hours',
    fields: [
      { name: 'name', type: 'text', label: 'Name', required: true },
      { name: 'email', type: 'email', label: 'Email', required: true },
      { name: 'message', type: 'textarea', label: 'Message' },
    ],
    submitLabel: 'Send',
  },
  next: 'thanks',  // Advance after form submit
}
```

## Login Form (Pre-Chat Gate)

Collect user info before the chat starts:

```tsx
<ChatBot
  loginForm={{
    id: 'login',
    title: 'Welcome! Please introduce yourself',
    fields: [
      { name: 'name', type: 'text', label: 'Name', required: true },
      { name: 'email', type: 'email', label: 'Email', required: true },
    ],
    submitLabel: 'Start Chat',
  }}
  flow={flow}
/>
```

## Supported Field Types

| Type | Description | Example |
|------|-------------|---------|
| `text` | Single-line text | Name, username |
| `email` | Email with format hint | User email |
| `password` | Masked text input | Password |
| `number` | Numeric input | Age, quantity |
| `tel` | Phone number | Contact phone |
| `url` | URL input | Website |
| `textarea` | Multi-line text | Description, comments |
| `select` | Dropdown select | Country, category |
| `multiselect` | Multi-select dropdown | Tags, interests |
| `radio` | Radio button group | Yes/No, severity |
| `checkbox` | Checkbox group | Features, agreements |
| `file` | File upload | Documents, images |
| `date` | Date picker | Birthday, deadline |
| `time` | Time picker | Appointment time |
| `hidden` | Hidden field | Tracking IDs |

## Field Options (Select, Radio, Checkbox)

```ts
{
  name: 'priority',
  type: 'radio',
  label: 'Priority',
  required: true,
  options: [
    { label: '🟢 Low', value: 'low' },
    { label: '🟡 Medium', value: 'medium' },
    { label: '🔴 High', value: 'high' },
  ],
}
```

## Validation

```ts
// Pattern validation
{
  name: 'email',
  type: 'email',
  label: 'Email',
  required: true,
  validation: {
    pattern: '^[^@]+@[^@]+\\.[^@]+$',
    message: 'Please enter a valid email address',
  },
}

// Length validation
{
  name: 'username',
  type: 'text',
  label: 'Username',
  validation: {
    minLength: 3,
    maxLength: 20,
    message: 'Username must be 3-20 characters',
  },
}
```

### Validation Properties

| Property | Type | Description |
|----------|------|-------------|
| `required` | `boolean` | Field must be filled |
| `pattern` | `string` | Regex pattern to match |
| `minLength` | `number` | Minimum character count |
| `maxLength` | `number` | Maximum character count |
| `message` | `string` | Custom error message |

## File Upload in Forms

```ts
{
  name: 'document',
  type: 'file',
  label: 'Upload Document',
  accept: 'image/*,.pdf',
  required: true,
}
```

## Form Data Collection

Form data is merged into `collectedData` and accessible in:
- `callbacks.onFormSubmit(formId, data)` — Called when a form is submitted
- `callbacks.onFlowEnd(collectedData)` — Contains all collected data
- `asyncAction` handlers receive all collected data as the first argument
- Custom components receive it via `StepComponentProps.data`

## FormConfig Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Unique form identifier |
| `title` | `string` | Form title |
| `description` | `string` | Optional description text |
| `fields` | `FormFieldConfig[]` | Array of field configs |
| `submitLabel` | `string` | Submit button text |

## Demo

See **Forms Showcase** and **Login Form** demos for interactive examples with all field types.
