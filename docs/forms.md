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

### Friendly Display Labels

When a form is submitted, the chat shows a user-friendly summary using **field labels** and **option display names** instead of raw field names and values:

```
✅ Displayed as:         ❌ Not raw keys:
Company Name: Acme       company: Acme
Team Size: 2-10          team_size: 2-10
Industry: Healthcare     industry: health
```

The raw data (`{ company: 'Acme', team_size: '2-10', industry: 'health' }`) is preserved in `message.formData` and `collectedData` for programmatic use — only the visible chat bubble uses friendly labels.

## FormConfig Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Unique form identifier |
| `title` | `string` | Form title |
| `description` | `string` | Optional description text |
| `fields` | `FormFieldConfig[]` | Array of field configs |
| `submitLabel` | `string` | Submit button text |

## Custom Form Field Renderers

You can replace any built-in form field with your own React component using the `renderFormField` prop. This is a map of field type to a custom render function:

```tsx
import type { FormFieldRenderMap, TextFieldRenderProps } from '@enjoys/react-chatbot-plugin';

const renderFormField: FormFieldRenderMap = {
  text: (props: TextFieldRenderProps, defaultElement) => (
    <div style={{ display: 'flex', gap: 8 }}>
      <span>@</span>
      <input
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        placeholder={props.field.placeholder}
        style={{ fontFamily: 'monospace', flex: 1, padding: 8, borderRadius: 6 }}
      />
    </div>
  ),
  select: (props, defaultElement) => (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      {props.field.options?.map((opt) => (
        <button
          key={opt.value}
          onClick={() => props.onChange(opt.value)}
          style={{
            padding: '6px 14px',
            borderRadius: 20,
            border: 'none',
            background: props.value === opt.value ? '#6C5CE7' : '#eee',
            color: props.value === opt.value ? '#fff' : '#333',
            cursor: 'pointer',
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  ),
};

<ChatBot flow={flow} renderFormField={renderFormField} />
```

### Render Function Signature

Each renderer receives strongly-typed props and the default element:

```ts
(props: FieldRenderProps, defaultElement: ReactNode) => ReactNode
```

| Field Types | Props Type | Key Props |
|-------------|------------|----------|
| text, email, password, number, tel, url, textarea, date, time | `TextFieldRenderProps` | `value`, `onChange`, `field`, `error` |
| select, multiselect | `SelectFieldRenderProps` | `value`, `onChange`, `field`, `error` |
| radio | `RadioFieldRenderProps` | `value`, `onChange`, `field`, `error` |
| checkbox | `CheckboxFieldRenderProps` | `value`, `onChange`, `field`, `error` |
| file | `FileFieldRenderProps` | `files`, `onFileSelect`, `field`, `error` |

Return `defaultElement` to fall back to the built-in renderer for specific fields.

## Demo

See **Forms Showcase**, **Login Form**, and **Custom Fields** demos for interactive examples with all field types.
