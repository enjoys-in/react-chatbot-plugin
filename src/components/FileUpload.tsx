import React, { useRef } from 'react';
import type { FileUploadConfig } from '../types/config';
import { AttachmentIcon, RemoveIcon, FileIcon, ImageIcon } from './icons';

interface FileUploadButtonProps {
  config: FileUploadConfig;
  onFiles: (files: File[]) => void;
  selectedFiles: File[];
  onRemoveFile: (index: number) => void;
  primaryColor: string;
}

export const FileUploadButton: React.FC<FileUploadButtonProps> = ({
  config,
  onFiles,
  selectedFiles,
  onRemoveFile,
  primaryColor,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArr = Array.from(files);

    // Validate file size
    if (config.maxSize) {
      const oversized = fileArr.filter((f) => f.size > config.maxSize!);
      if (oversized.length > 0) {
        alert(`File(s) too large. Max size: ${formatSize(config.maxSize)}`);
        return;
      }
    }

    // Validate max count
    const maxFiles = config.maxFiles ?? 5;
    if (selectedFiles.length + fileArr.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }

    onFiles(fileArr);
    // Reset input to allow re-selecting same file
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={config.accept}
        multiple={config.multiple !== false}
        onChange={handleChange}
        style={{ display: 'none' }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        aria-label="Attach file"
        title="Attach file"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '6px',
          display: 'flex',
          alignItems: 'center',
          color: '#999',
          borderRadius: '6px',
          transition: 'color 0.15s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = primaryColor)}
        onMouseLeave={(e) => (e.currentTarget.style.color = '#999')}
      >
        <AttachmentIcon size={20} />
      </button>
    </div>
  );
};

// ─── File Preview List ───────────────────────────────────────────

interface FilePreviewListProps {
  files: File[];
  onRemove: (index: number) => void;
  primaryColor: string;
}

export const FilePreviewList: React.FC<FilePreviewListProps> = ({
  files,
  onRemove,
  primaryColor,
}) => {
  if (files.length === 0) return null;

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '6px',
        padding: '8px 12px 0',
      }}
    >
      {files.map((file, idx) => (
        <FilePreviewChip
          key={`${file.name}-${idx}`}
          file={file}
          onRemove={() => onRemove(idx)}
          primaryColor={primaryColor}
        />
      ))}
    </div>
  );
};

// ─── Single File Chip ────────────────────────────────────────────

interface FilePreviewChipProps {
  file: File;
  onRemove: () => void;
  primaryColor: string;
}

const FilePreviewChip: React.FC<FilePreviewChipProps> = ({ file, onRemove, primaryColor }) => {
  const isImage = file.type.startsWith('image/');

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 8px',
        backgroundColor: '#F3F4F6',
        borderRadius: '8px',
        fontSize: '12px',
        maxWidth: '200px',
      }}
    >
      <span style={{ color: primaryColor, flexShrink: 0 }}>
        {isImage ? <ImageIcon size={14} /> : <FileIcon size={14} />}
      </span>
      <span
        style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          color: '#555',
        }}
      >
        {file.name}
      </span>
      <span style={{ color: '#999', fontSize: '11px', flexShrink: 0 }}>
        {formatSize(file.size)}
      </span>
      <button
        onClick={onRemove}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '0',
          display: 'flex',
          color: '#999',
          flexShrink: 0,
        }}
      >
        <RemoveIcon size={14} />
      </button>
    </div>
  );
};

// ─── Utils ───────────────────────────────────────────────────────

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}
