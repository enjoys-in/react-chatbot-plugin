import React from 'react';
import type { FormFieldConfig } from '../../types';

interface RadioFieldProps {
  field: FormFieldConfig;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const RadioField: React.FC<RadioFieldProps> = ({ field, value, onChange, error }) => {
  return (
    <div style={{ marginBottom: '12px' }}>
      {field.label && (
        <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 500 }}>
          {field.label}
          {field.required && <span style={{ color: '#E53E3E', marginLeft: '2px' }}>*</span>}
        </label>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {field.options?.map((opt) => (
          <label
            key={opt.value}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            <input
              type="radio"
              name={field.name}
              value={opt.value}
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
              style={{ margin: 0 }}
            />
            {opt.label}
          </label>
        ))}
      </div>
      {error && <div style={{ color: '#E53E3E', fontSize: '12px', marginTop: '2px' }}>{error}</div>}
    </div>
  );
};
