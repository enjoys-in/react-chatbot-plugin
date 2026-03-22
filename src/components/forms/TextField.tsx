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
  const inputType = field.type === 'textarea' ? undefined : field.type;

  const baseStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    border: `1.5px solid ${error ? 'rgba(229, 62, 62, 0.5)' : 'rgba(0,0,0,0.08)'}`,
    borderRadius: '12px',
    fontSize: '13px',
    fontFamily: 'inherit',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'all 0.2s ease',
    backgroundColor: 'rgba(245, 247, 252, 0.6)',
    color: '#2D3436',
    letterSpacing: '0.01em',
  };

  return (
    <div style={{ marginBottom: '14px' }}>
      {field.label && (
        <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 500, color: '#2D3436' }}>
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
