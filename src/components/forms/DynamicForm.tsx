import React, { useState, useCallback } from 'react';
import type { FormConfig, FormFieldConfig } from '../../types';
import { TextField } from './TextField';
import { SelectField } from './SelectField';
import { RadioField } from './RadioField';
import { CheckboxField } from './CheckboxField';
import { FileUploadField } from './FileUploadField';

interface DynamicFormProps {
  config: FormConfig;
  onSubmit: (data: Record<string, unknown>) => void;
  primaryColor: string;
}

export const DynamicForm: React.FC<DynamicFormProps> = ({ config, onSubmit, primaryColor }) => {
  const [values, setValues] = useState<Record<string, unknown>>(() => {
    const init: Record<string, unknown> = {};
    for (const field of config.fields) {
      if (field.defaultValue !== undefined) {
        init[field.name] = field.defaultValue;
      } else if (field.type === 'checkbox' || field.type === 'multiselect') {
        init[field.name] = [];
      } else if (field.type === 'file') {
        init[field.name] = null;
      } else {
        init[field.name] = '';
      }
    }
    return init;
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const setValue = useCallback((name: string, value: unknown) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }, []);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    for (const field of config.fields) {
      const val = values[field.name];

      // Required check
      if (field.required) {
        if (
          val === '' ||
          val === null ||
          val === undefined ||
          (Array.isArray(val) && val.length === 0)
        ) {
          newErrors[field.name] = field.validation?.message ?? `${field.label || field.name} is required`;
          continue;
        }
      }

      // Pattern check
      if (field.validation?.pattern && typeof val === 'string' && val) {
        const regex = new RegExp(field.validation.pattern);
        if (!regex.test(val)) {
          newErrors[field.name] = field.validation.message ?? 'Invalid format';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitted(true);
    onSubmit(values);
  };

  if (submitted) {
    return (
      <div
        style={{
          padding: '12px',
          backgroundColor: '#F0FFF4',
          borderRadius: '8px',
          fontSize: '13px',
          color: '#276749',
          textAlign: 'center',
        }}
      >
        Submitted successfully
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        backgroundColor: '#FAFAFA',
        borderRadius: '10px',
        padding: '16px',
        border: '1px solid #E8E8E8',
      }}
    >
      {config.title && (
        <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>
          {config.title}
        </div>
      )}
      {config.description && (
        <div style={{ fontSize: '12px', color: '#888', marginBottom: '12px' }}>
          {config.description}
        </div>
      )}

      {config.fields.map((field) => (
        <FormField
          key={field.name}
          field={field}
          value={values[field.name]}
          onChange={(v) => setValue(field.name, v)}
          error={errors[field.name]}
          primaryColor={primaryColor}
        />
      ))}

      <button
        type="submit"
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: primaryColor,
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: 600,
          cursor: 'pointer',
          marginTop: '4px',
        }}
      >
        {config.submitLabel ?? 'Submit'}
      </button>
    </form>
  );
};

// ─── Field Router ────────────────────────────────────────────────

interface FormFieldProps {
  field: FormFieldConfig;
  value: unknown;
  onChange: (value: unknown) => void;
  error?: string;
  primaryColor: string;
}

const FormField: React.FC<FormFieldProps> = ({ field, value, onChange, error, primaryColor }) => {
  switch (field.type) {
    case 'text':
    case 'email':
    case 'password':
    case 'number':
    case 'tel':
    case 'url':
    case 'textarea':
    case 'date':
    case 'time':
      return (
        <TextField
          field={field}
          value={String(value ?? '')}
          onChange={onChange as (v: string) => void}
          error={error}
        />
      );
    case 'select':
    case 'multiselect':
      return (
        <SelectField
          field={field}
          value={value as string | string[]}
          onChange={onChange as (v: string | string[]) => void}
          error={error}
        />
      );
    case 'radio':
      return (
        <RadioField
          field={field}
          value={String(value ?? '')}
          onChange={onChange as (v: string) => void}
          error={error}
        />
      );
    case 'checkbox':
      return (
        <CheckboxField
          field={field}
          value={(value as string[]) ?? []}
          onChange={onChange as (v: string[]) => void}
          error={error}
        />
      );
    case 'file':
      return (
        <FileUploadField
          field={field}
          value={value as FileList | null}
          onChange={onChange as (v: FileList | null) => void}
          error={error}
          primaryColor={primaryColor}
        />
      );
    case 'hidden':
      return <input type="hidden" name={field.name} value={String(value ?? '')} />;
    default:
      return null;
  }
};
