import type { DemoConfig } from './types';

const demo: DemoConfig = {
  id: 'file-upload',
  title: 'File Upload',
  description: 'File upload with drag & drop, preview, type restrictions, and size limits.',
  icon: '📎',
  category: 'forms',
  enableEmoji: true,
  fileUpload: {
    enabled: true,
    accept: 'image/*,.pdf,.doc,.docx,.txt',
    multiple: true,
    maxSize: 5 * 1024 * 1024,
    maxFiles: 3,
  },
  flow: {
    startStep: 'start',
    steps: [
      {
        id: 'start',
        messages: [
          "📎 File upload is enabled in this demo!",
          "You can attach files using the 📎 button in the input area.",
          "Allowed: images, PDFs, docs, text files. Max 5MB, up to 3 files.",
        ],
        quickReplies: [
          { label: '📋 Submit Documents', value: 'docs', next: 'doc_upload' },
          { label: '🖼️ Share Screenshots', value: 'screenshots', next: 'screenshot_upload' },
          { label: '💬 Just Chat', value: 'chat', next: 'free_chat' },
        ],
      },
      {
        id: 'doc_upload',
        message: "Please upload your documents using the 📎 attachment button, then click send.",
        form: {
          id: 'doc-form',
          title: 'Document Upload',
          fields: [
            { name: 'doc_type', type: 'select', label: 'Document Type', required: true, options: [
              { label: 'ID / Passport', value: 'id' },
              { label: 'Proof of Address', value: 'address' },
              { label: 'Contract', value: 'contract' },
              { label: 'Other', value: 'other' },
            ]},
            { name: 'document', type: 'file', label: 'Upload File', accept: 'image/*,.pdf', required: true },
          ],
          submitLabel: '📤 Upload',
        },
        next: 'upload_done',
      },
      {
        id: 'screenshot_upload',
        message: "Attach your screenshots using the 📎 button and describe the issue.",
        next: 'upload_done',
      },
      {
        id: 'upload_done',
        message: "✅ Files received! Check the console to see the upload details.",
        quickReplies: [
          { label: '📎 Upload More', value: 'more', next: 'start' },
          { label: '👋 Done', value: 'done', next: 'bye' },
        ],
      },
      {
        id: 'free_chat',
        message: "Sure! Type anything. You can also attach files at any time with the 📎 button.",
      },
      {
        id: 'bye',
        message: "Thanks for trying the file upload demo! 📎",
      },
    ],
  },
};

export default demo;
