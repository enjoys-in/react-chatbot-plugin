import React, { useRef } from 'react';
import type { FormFieldConfig } from '../../types';

interface FileUploadFieldProps {
  field: FormFieldConfig;
  value: FileList | null;
  onChange: (files: FileList | null) => void;
  error?: string;
  primaryColor: string;
}

export const FileUploadField: React.FC<FileUploadFieldProps> = ({
  field,
  value,
  onChange,
  error,
  primaryColor,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const fileNames = value ? Array.from(value).map((f) => f.name).join(', ') : '';

  return (
    <div style={{ marginBottom: '12px' }}>
      {field.label && (
        <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 500 }}>
          {field.label}
          {field.required && <span style={{ color: '#DF2020', marginLeft: '2px' }}>*</span>}
        </label>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={field.accept}
        multiple={field.multiple}
        onChange={(e) => onChange(e.target.files)}
        style={{ display: 'none' }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        // Full names on hover; the button itself keeps to one line.
        title={fileNames || undefined}
        style={{
          display: 'block',
          padding: '10px 14px',
          border: `1px dashed ${error ? '#DF2020' : 'var(--cb-border, rgba(9, 14, 21, 0.14))'}`,
          borderRadius: '12px',
          backgroundColor: 'var(--cb-bubble-bg, #F5F5F5)',
          cursor: 'pointer',
          fontFamily: 'inherit',
          fontSize: '14px',
          color: fileNames ? 'var(--cb-ink, #14161A)' : 'var(--cb-ink-muted, #6C6F74)',
          width: '100%',
          textAlign: 'left',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          boxSizing: 'border-box',
        }}
      >
        {fileNames || field.placeholder || 'Choose file(s)…'}
      </button>
      {fileNames && (
        <div style={{ fontSize: '12px', color: 'var(--cb-ink-muted, #6C6F74)', marginTop: '6px' }}>
          {Array.from(value!).length} file(s) selected
        </div>
      )}
      {error && <div style={{ color: '#DF2020', fontSize: '12px', marginTop: '4px' }}>{error}</div>}
    </div>
  );
};
