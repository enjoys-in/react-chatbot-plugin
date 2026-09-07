import React from 'react';
import type { FormFieldConfig } from '../../types';

interface TextFieldProps {
  field: FormFieldConfig;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const TextField: React.FC<TextFieldProps> = ({ field, value, onChange, error }) => {
  const isTextarea = field.type === 'textarea';
  const inputType = field.type === 'textarea' ? undefined : field.type === 'datetime' ? 'datetime-local' : field.type;

  const baseStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    border: `1px solid ${error ? 'rgba(223, 32, 32, 0.55)' : 'var(--cb-border, rgba(9, 14, 21, 0.08))'}`,
    borderRadius: '12px',
    fontSize: '14px',
    fontFamily: 'inherit',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'all 0.2s ease',
    backgroundColor: 'var(--cb-bubble-bg, #F5F5F5)',
    color: 'var(--cb-ink, #14161A)',
    letterSpacing: '0.01em',
  };

  return (
    <div style={{ marginBottom: '14px' }}>
      {field.label && (
        <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500, color: 'var(--cb-ink, #14161A)' }}>
          {field.label}
          {field.required && <span style={{ color: '#E53E3E', marginLeft: '3px' }}>*</span>}
        </label>
      )}
      {isTextarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          required={field.required}
          rows={3}
          style={{ ...baseStyle, resize: 'vertical' }}
          minLength={field.validation?.minLength}
          maxLength={field.validation?.maxLength}
        />
      ) : (
        <input
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          required={field.required}
          style={baseStyle}
          min={field.validation?.min}
          max={field.validation?.max}
          minLength={field.validation?.minLength}
          maxLength={field.validation?.maxLength}
          pattern={field.validation?.pattern}
        />
      )}
      {error && <div style={{ color: '#E53E3E', fontSize: '12px', marginTop: '2px' }}>{error}</div>}
    </div>
  );
};
