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
    padding: '8px 12px',
    border: `1px solid ${error ? '#E53E3E' : '#D1D5DB'}`,
    borderRadius: '8px',
    fontSize: '13px',
    fontFamily: 'inherit',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s ease',
  };

  return (
    <div style={{ marginBottom: '12px' }}>
      {field.label && (
        <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 500 }}>
          {field.label}
          {field.required && <span style={{ color: '#E53E3E', marginLeft: '2px' }}>*</span>}
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
