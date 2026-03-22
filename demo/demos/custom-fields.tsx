import React from 'react';
import type { DemoConfig } from './types';
import type { TextFieldRenderProps, SelectFieldRenderProps, FormFieldRenderMap } from '@enjoys/react-chatbot-plugin';

const renderFormField: FormFieldRenderMap = {
  text: (props: TextFieldRenderProps, defaultElement: React.ReactNode) => {
    if (props.field.name === 'username') {
      return (
        <div style={{ marginBottom: '14px' }}>
          {props.field.label && (
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 600, color: '#6C5CE7' }}>
              👤 {props.field.label}
              {props.field.required && <span style={{ color: '#E53E3E', marginLeft: '3px' }}>*</span>}
            </label>
          )}
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px' }}>@</span>
            <input
              type="text"
              value={props.value}
              onChange={(e) => props.onChange(e.target.value)}
              placeholder={props.field.placeholder ?? 'Enter username'}
              style={{
                width: '100%',
                padding: '10px 14px 10px 32px',
                border: `2px solid ${props.error ? '#E53E3E' : '#6C5CE7'}`,
                borderRadius: '12px',
                fontSize: '13px',
                fontFamily: 'monospace',
                outline: 'none',
                boxSizing: 'border-box',
                background: '#f5f3ff',
                color: '#2D3436',
                letterSpacing: '0.02em',
              }}
            />
          </div>
          {props.error && <div style={{ color: '#E53E3E', fontSize: '12px', marginTop: '4px' }}>{props.error}</div>}
        </div>
      );
    }
    return <>{defaultElement}</>;
  },

  email: (props: TextFieldRenderProps) => (
    <div style={{ marginBottom: '14px' }}>
      <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 600, color: '#00b894' }}>
        ✉️ {props.field.label ?? 'Email'}
        {props.field.required && <span style={{ color: '#E53E3E', marginLeft: '3px' }}>*</span>}
      </label>
      <input
        type="email"
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        placeholder={props.field.placeholder ?? 'you@example.com'}
        style={{
          width: '100%',
          padding: '12px 14px',
          border: `2px solid ${props.error ? '#E53E3E' : '#00b894'}`,
          borderRadius: '24px',
          fontSize: '13px',
          fontFamily: 'inherit',
          outline: 'none',
          boxSizing: 'border-box',
          background: 'linear-gradient(135deg, #f0fff4, #e0f7fa)',
          color: '#2D3436',
        }}
      />
      {props.error && <div style={{ color: '#E53E3E', fontSize: '12px', marginTop: '4px' }}>{props.error}</div>}
    </div>
  ),

  select: (props: SelectFieldRenderProps) => (
    <div style={{ marginBottom: '14px' }}>
      <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: '#e17055' }}>
        🎯 {props.field.label ?? 'Select'}
        {props.field.required && <span style={{ color: '#E53E3E', marginLeft: '3px' }}>*</span>}
      </label>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {props.field.options?.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => props.onChange(opt.value)}
            style={{
              padding: '8px 16px',
              border: `2px solid ${props.value === opt.value ? '#e17055' : '#ddd'}`,
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: props.value === opt.value ? 600 : 400,
              cursor: 'pointer',
              background: props.value === opt.value ? '#ffeaa7' : '#fff',
              color: props.value === opt.value ? '#e17055' : '#666',
              transition: 'all 0.2s',
              fontFamily: 'inherit',
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
      {props.error && <div style={{ color: '#E53E3E', fontSize: '12px', marginTop: '4px' }}>{props.error}</div>}
    </div>
  ),
};

const demo: DemoConfig = {
  id: 'custom-fields',
  title: 'Custom Form Fields',
  description: 'Override built-in form fields with your own React renderers per field type',
  icon: '🎨',
  category: 'components',
  renderFormField,
  flow: {
    startStep: 'intro',
    steps: [
      {
        id: 'intro',
        message: 'This demo shows custom form field renderers! The text, email, and select fields below are all custom React components.',
        next: 'profile',
      },
      {
        id: 'profile',
        message: 'Fill out your profile:',
        form: {
          id: 'profile-form',
          title: 'Custom Profile Form',
          description: 'Notice: username has a monospace @ prefix, email is pill-shaped with green theme, and role uses button pills instead of a dropdown.',
          fields: [
            { name: 'username', type: 'text', label: 'Username', placeholder: 'johndoe', required: true },
            { name: 'email', type: 'email', label: 'Email Address', required: true },
            { name: 'role', type: 'select', label: 'Your Role', required: true, options: [
              { label: 'Developer', value: 'dev' },
              { label: 'Designer', value: 'design' },
              { label: 'Manager', value: 'mgr' },
              { label: 'Other', value: 'other' },
            ]},
            { name: 'bio', type: 'textarea', label: 'Bio', placeholder: 'Tell us about yourself (default renderer)' },
          ],
          submitLabel: 'Save Profile',
        },
        next: 'done',
      },
      {
        id: 'done',
        message: 'Profile saved! Notice how the textarea used the default renderer while text, email, and select were all custom. 🎨',
      },
    ],
  },
};

export default demo;
