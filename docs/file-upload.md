# File Upload

Enable file upload with drag & drop, previews, type restrictions, and size limits.

## Basic Setup

```tsx
<ChatBot
  fileUpload={{
    enabled: true,
    accept: 'image/*,.pdf,.doc,.docx',
    multiple: true,
    maxSize: 5 * 1024 * 1024,  // 5MB
    maxFiles: 3,
  }}
/>
```

## FileUploadConfig

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `enabled` | `boolean` | `false` | Enable file upload button |
| `accept` | `string` | `'*'` | Accepted MIME types or extensions |
| `multiple` | `boolean` | `false` | Allow multiple files |
| `maxSize` | `number` | `Infinity` | Max file size in bytes |
| `maxFiles` | `number` | `Infinity` | Max number of files |

## File Upload Callback

```tsx
<ChatBot
  fileUpload={{ enabled: true }}
  callbacks={{
    onFileUpload: (files) => {
      console.log('Uploaded:', files.map(f => f.name));
      // Upload to your server
    },
  }}
/>
```

## File Upload in Forms

Forms can include file upload fields:

```ts
{
  name: 'document',
  type: 'file',
  label: 'Upload Document',
  accept: 'image/*,.pdf',
  required: true,
}
```

## How It Works

1. User clicks the 📎 attachment button in the input area
2. File picker opens with the configured `accept` types
3. Selected files show as previews above the input
4. Files are sent with the next message
5. `onFileUpload` callback fires with the `File` objects

## Demo

See the **File Upload** demo for an interactive example with type restrictions and form-based upload.
