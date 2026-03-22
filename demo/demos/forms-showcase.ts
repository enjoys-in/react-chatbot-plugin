import type { DemoConfig } from './types';

const demo: DemoConfig = {
  id: 'forms-showcase',
  title: 'Forms Showcase',
  description: 'All form field types: text, email, select, radio, checkbox, textarea, file upload, and validation.',
  icon: '📝',
  category: 'forms',
  flow: {
    startStep: 'start',
    steps: [
      {
        id: 'start',
        message: "Welcome to the forms showcase! Pick a form to try:",
        quickReplies: [
          { label: '📋 Contact Form', value: 'contact', next: 'contact_form' },
          { label: '📊 Survey', value: 'survey', next: 'survey_form' },
          { label: '🐛 Bug Report', value: 'bug', next: 'bug_form' },
          { label: '📎 File Upload', value: 'file', next: 'file_form' },
          { label: '🔐 Registration', value: 'register', next: 'register_form' },
        ],
      },
      {
        id: 'contact_form',
        message: "Here's a simple contact form with validation:",
        form: {
          id: 'contact',
          title: 'Contact Us',
          description: 'We\'ll get back to you within 24 hours',
          fields: [
            { name: 'name', type: 'text', label: 'Full Name', required: true, placeholder: 'John Doe' },
            { name: 'email', type: 'email', label: 'Email', required: true, placeholder: 'john@example.com',
              validation: { pattern: '^[^@]+@[^@]+\\.[^@]+$', message: 'Please enter a valid email address' } },
            { name: 'phone', type: 'tel', label: 'Phone (optional)', placeholder: '+1 555-0123' },
            { name: 'message', type: 'textarea', label: 'Message', required: true, placeholder: 'How can we help?' },
          ],
          submitLabel: '📬 Send Message',
        },
        next: 'form_done',
      },
      {
        id: 'survey_form',
        message: "A survey form with all input types:",
        form: {
          id: 'survey',
          title: 'Customer Survey',
          fields: [
            { name: 'satisfaction', type: 'select', label: 'Overall Satisfaction', required: true, options: [
              { label: '😍 Very Satisfied', value: '5' },
              { label: '🙂 Satisfied', value: '4' },
              { label: '😐 Neutral', value: '3' },
              { label: '😕 Dissatisfied', value: '2' },
              { label: '😤 Very Dissatisfied', value: '1' },
            ]},
            { name: 'features', type: 'checkbox', label: 'What features do you use?', options: [
              { label: 'Dashboard', value: 'dashboard' },
              { label: 'Reports', value: 'reports' },
              { label: 'API', value: 'api' },
              { label: 'Integrations', value: 'integrations' },
              { label: 'Mobile App', value: 'mobile' },
            ]},
            { name: 'recommend', type: 'radio', label: 'Would you recommend us?', required: true, options: [
              { label: 'Definitely!', value: 'yes' },
              { label: 'Maybe', value: 'maybe' },
              { label: 'Probably not', value: 'no' },
            ]},
            { name: 'comments', type: 'textarea', label: 'Additional Comments', placeholder: 'Tell us more...' },
          ],
          submitLabel: '📊 Submit Survey',
        },
        next: 'form_done',
      },
      {
        id: 'bug_form',
        message: "A detailed bug report form:",
        form: {
          id: 'bug-report',
          title: 'Bug Report',
          description: 'Help us fix issues faster',
          fields: [
            { name: 'title', type: 'text', label: 'Bug Title', required: true, placeholder: 'Brief description' },
            { name: 'severity', type: 'radio', label: 'Severity', required: true, options: [
              { label: '🟢 Low', value: 'low' },
              { label: '🟡 Medium', value: 'medium' },
              { label: '🟠 High', value: 'high' },
              { label: '🔴 Critical', value: 'critical' },
            ]},
            { name: 'browser', type: 'select', label: 'Browser', options: [
              { label: 'Chrome', value: 'chrome' },
              { label: 'Firefox', value: 'firefox' },
              { label: 'Safari', value: 'safari' },
              { label: 'Edge', value: 'edge' },
              { label: 'Other', value: 'other' },
            ]},
            { name: 'steps', type: 'textarea', label: 'Steps to Reproduce', required: true, placeholder: '1. Go to...\n2. Click on...\n3. See error' },
            { name: 'screenshot', type: 'file', label: 'Screenshot', accept: 'image/*' },
          ],
          submitLabel: '🐛 Submit Report',
        },
        next: 'form_done',
      },
      {
        id: 'file_form',
        message: "File upload form with restrictions:",
        form: {
          id: 'file-upload',
          title: 'Upload Documents',
          description: 'Accepted: images, PDFs (max 5MB)',
          fields: [
            { name: 'doc_type', type: 'select', label: 'Type', required: true, options: [
              { label: 'ID Document', value: 'id' },
              { label: 'Proof of Address', value: 'address' },
              { label: 'Other', value: 'other' },
            ]},
            { name: 'document', type: 'file', label: 'Upload File', accept: 'image/*,.pdf', required: true },
            { name: 'notes', type: 'textarea', label: 'Notes (optional)', placeholder: 'Any additional context...' },
          ],
          submitLabel: '📎 Upload',
        },
        next: 'form_done',
      },
      {
        id: 'register_form',
        message: "Registration form with validation:",
        form: {
          id: 'registration',
          title: 'Create Account',
          fields: [
            { name: 'username', type: 'text', label: 'Username', required: true, placeholder: 'Choose a username',
              validation: { minLength: 3, maxLength: 20, message: 'Username must be 3-20 characters' } },
            { name: 'email', type: 'email', label: 'Email', required: true, placeholder: 'your@email.com',
              validation: { pattern: '^[^@]+@[^@]+\\.[^@]+$', message: 'Invalid email format' } },
            { name: 'password', type: 'password', label: 'Password', required: true, placeholder: 'Min 8 characters',
              validation: { minLength: 8, message: 'Password must be at least 8 characters' } },
            { name: 'plan', type: 'radio', label: 'Choose Plan', required: true, options: [
              { label: '🆓 Free', value: 'free' },
              { label: '⭐ Pro ($29/mo)', value: 'pro' },
              { label: '🏢 Enterprise', value: 'enterprise' },
            ]},
            { name: 'terms', type: 'checkbox', label: 'Agreements', required: true, options: [
              { label: 'I agree to the Terms of Service', value: 'tos' },
              { label: 'I agree to the Privacy Policy', value: 'privacy' },
            ]},
          ],
          submitLabel: '🚀 Create Account',
        },
        next: 'form_done',
      },
      {
        id: 'form_done',
        message: "✅ Form submitted! Check the browser console to see the collected data.",
        quickReplies: [
          { label: '📋 Try Another Form', value: 'another', next: 'start' },
          { label: '👋 Done', value: 'done', next: 'bye' },
        ],
      },
      {
        id: 'bye',
        message: "Thanks for trying the forms showcase! 🎉",
      },
    ],
  },
};

export default demo;
