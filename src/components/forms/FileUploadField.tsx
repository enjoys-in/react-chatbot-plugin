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
          {field.required && <span style={{ color: '#E53E3E', marginLeft: '2px' }}>*</span>}
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
        style={{
          padding: '8px 16px',
          border: `1px dashed ${error ? '#E53E3E' : '#D1D5DB'}`,
          borderRadius: '8px',
          backgroundColor: '#FAFAFA',
          cursor: 'pointer',
          fontSize: '13px',
          color: '#555',
          width: '100%',
          textAlign: 'left',
        }}
      >
        {fileNames || field.placeholder || 'Choose file(s)...'}
      </button>
      {fileNames && (
        <div style={{ fontSize: '12px', color: primaryColor, marginTop: '4px' }}>
          {Array.from(value!).length} file(s) selected
        </div>
      )}
      {error && <div style={{ color: '#E53E3E', fontSize: '12px', marginTop: '2px' }}>{error}</div>}
    </div>
  );
};
