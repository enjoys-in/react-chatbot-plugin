import React, { useState, useCallback } from 'react';
import type { FormConfig, FormFieldConfig } from '../../types';
import type { FormFieldRenderMap } from '../../types/form';
import { TextField } from './TextField';
import { SelectField } from './SelectField';
import { RadioField } from './RadioField';
import { CheckboxField } from './CheckboxField';
import { FileUploadField } from './FileUploadField';

interface DynamicFormProps {
  config: FormConfig;
  onSubmit: (data: Record<string, unknown>) => void;
  primaryColor: string;
  renderFormField?: FormFieldRenderMap;
}

export const DynamicForm: React.FC<DynamicFormProps> = ({ config, onSubmit, primaryColor, renderFormField }) => {
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
        try {
          const regex = new RegExp(field.validation.pattern);
          if (!regex.test(val)) {
            newErrors[field.name] = field.validation.message ?? 'Invalid format';
          }
        } catch {
          // Invalid regex pattern in config — skip validation
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
          padding: '16px',
          background: 'linear-gradient(135deg, rgba(46, 213, 115, 0.1), rgba(46, 213, 115, 0.05))',
          borderRadius: '14px',
          fontSize: '14px',
          color: '#2ecc71',
          textAlign: 'center',
          fontWeight: 500,
          border: '1px solid rgba(46, 213, 115, 0.15)',
          animation: 'cb-fade-in 0.3s ease-out',
        }}
      >
        ✓ Submitted successfully
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderRadius: '16px',
        padding: '20px',
        border: '1px solid rgba(0,0,0,0.06)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
        animation: 'cb-slide-up 0.35s ease-out',
      }}
    >
      {config.title && (
        <div style={{ fontWeight: 600, fontSize: '15px', marginBottom: '4px', color: '#2D3436', letterSpacing: '-0.01em' }}>
          {config.title}
        </div>
      )}
      {config.description && (
        <div style={{ fontSize: '12px', color: 'rgba(0,0,0,0.45)', marginBottom: '16px', lineHeight: '1.5' }}>
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
          renderFormField={renderFormField}
        />
      ))}

      <button
        type="submit"
        style={{
          width: '100%',
          padding: '12px',
          background: `linear-gradient(135deg, ${primaryColor} 0%, ${adjustColor(primaryColor, 30)} 100%)`,
          color: '#fff',
          border: 'none',
          borderRadius: '12px',
          fontSize: '14px',
          fontWeight: 600,
          cursor: 'pointer',
          marginTop: '8px',
          fontFamily: 'inherit',
          letterSpacing: '0.02em',
          boxShadow: `0 4px 14px ${primaryColor}33`,
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = `0 6px 20px ${primaryColor}44`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = `0 4px 14px ${primaryColor}33`;
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
  renderFormField?: FormFieldRenderMap;
}

const FormField: React.FC<FormFieldProps> = ({ field, value, onChange, error, primaryColor, renderFormField }) => {
  // Check for custom renderer override
  const customRenderer = renderFormField?.[field.type as keyof FormFieldRenderMap];

  switch (field.type) {
    case 'text':
    case 'email':
    case 'password':
    case 'number':
    case 'tel':
    case 'url':
    case 'textarea':
    case 'date':
    case 'time': {
      const typedProps = { type: field.type as 'text', field, value: String(value ?? ''), onChange: onChange as (v: string) => void, error };
      const defaultEl = <TextField field={field} value={String(value ?? '')} onChange={onChange as (v: string) => void} error={error} />;
      if (customRenderer) return <>{(customRenderer as (p: typeof typedProps, d: React.ReactNode) => React.ReactNode)(typedProps, defaultEl)}</>;
      return defaultEl;
    }
    case 'select':
    case 'multiselect': {
      const typedProps = { type: field.type as 'select', field, value: value as string | string[], onChange: onChange as (v: string | string[]) => void, error };
      const defaultEl = <SelectField field={field} value={value as string | string[]} onChange={onChange as (v: string | string[]) => void} error={error} />;
      if (customRenderer) return <>{(customRenderer as (p: typeof typedProps, d: React.ReactNode) => React.ReactNode)(typedProps, defaultEl)}</>;
      return defaultEl;
    }
    case 'radio': {
      const typedProps = { type: 'radio' as const, field, value: String(value ?? ''), onChange: onChange as (v: string) => void, error };
      const defaultEl = <RadioField field={field} value={String(value ?? '')} onChange={onChange as (v: string) => void} error={error} />;
      if (customRenderer) return <>{(customRenderer as (p: typeof typedProps, d: React.ReactNode) => React.ReactNode)(typedProps, defaultEl)}</>;
      return defaultEl;
    }
    case 'checkbox': {
      const typedProps = { type: 'checkbox' as const, field, value: ((value as string[]) ?? []), onChange: onChange as (v: string[]) => void, error };
      const defaultEl = <CheckboxField field={field} value={(value as string[]) ?? []} onChange={onChange as (v: string[]) => void} error={error} />;
      if (customRenderer) return <>{(customRenderer as (p: typeof typedProps, d: React.ReactNode) => React.ReactNode)(typedProps, defaultEl)}</>;
      return defaultEl;
    }
    case 'file': {
      const typedProps = { type: 'file' as const, field, value: value as FileList | null, onChange: onChange as (v: FileList | null) => void, error, primaryColor };
      const defaultEl = <FileUploadField field={field} value={value as FileList | null} onChange={onChange as (v: FileList | null) => void} error={error} primaryColor={primaryColor} />;
      if (customRenderer) return <>{(customRenderer as (p: typeof typedProps, d: React.ReactNode) => React.ReactNode)(typedProps, defaultEl)}</>;
      return defaultEl;
    }
    case 'hidden':
      return <input type="hidden" name={field.name} value={String(value ?? '')} />;
    default:
      return null;
  }
};

function adjustColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, ((num >> 16) & 0xff) + amount);
  const g = Math.min(255, ((num >> 8) & 0xff) + amount);
  const b = Math.min(255, (num & 0xff) + amount);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}
