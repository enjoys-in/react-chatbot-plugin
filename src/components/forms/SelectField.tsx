import React from 'react';
import type { FormFieldConfig } from '../../types';

interface SelectFieldProps {
  field: FormFieldConfig;
  value: string | string[];
  onChange: (value: string | string[]) => void;
  error?: string;
}

export const SelectField: React.FC<SelectFieldProps> = ({ field, value, onChange, error }) => {
  const isMulti = field.type === 'multiselect' || field.multiple;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (isMulti) {
      const selected = Array.from(e.target.selectedOptions, (opt) => opt.value);
      onChange(selected);
    } else {
      onChange(e.target.value);
    }
  };

  const selectValue = isMulti
    ? Array.isArray(value) ? value : [value].filter(Boolean)
    : typeof value === 'string' ? value : '';

  return (
    <div style={{ marginBottom: '12px' }}>
      {field.label && (
        <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 500 }}>
          {field.label}
          {field.required && <span style={{ color: '#E53E3E', marginLeft: '2px' }}>*</span>}
        </label>
      )}
      <select
        value={selectValue}
        onChange={handleChange}
        multiple={isMulti}
        required={field.required}
        style={{
          width: '100%',
          padding: '8px 12px',
          border: `1px solid ${error ? '#E53E3E' : '#D1D5DB'}`,
          borderRadius: '8px',
          fontSize: '13px',
          fontFamily: 'inherit',
          outline: 'none',
          backgroundColor: '#fff',
          boxSizing: 'border-box',
          ...(isMulti ? { minHeight: '80px' } : {}),
        }}
      >
        {!isMulti && <option value="">Select...</option>}
        {field.options?.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {isMulti && (
        <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>
          Hold Ctrl/Cmd to select multiple
        </div>
      )}
      {error && <div style={{ color: '#E53E3E', fontSize: '12px', marginTop: '2px' }}>{error}</div>}
    </div>
  );
};
