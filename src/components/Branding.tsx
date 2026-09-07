import React from 'react';
import type { BrandingConfig } from '../types/config';
import { typography } from '../styles/theme';

interface BrandingProps {
  config: BrandingConfig;
  primaryColor: string;
}

export const Branding: React.FC<BrandingProps> = ({ config }) => {
  if (config.showBranding === false) return null;

  const text = config.poweredBy ?? 'React ChatBot';

  return (
    <div
      style={{
        padding: '0 16px 12px',
        textAlign: 'center',
        ...typography.footnote,
        color: 'var(--cb-ink-muted, #6C6F74)',
        background: 'var(--cb-bg, #FFFFFF)',
        flexShrink: 0,
      }}
    >
      Powered by{' '}
      {config.poweredByUrl ? (
        <a
          href={config.poweredByUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: 'inherit',
            textDecoration: 'underline',
            fontWeight: 500,
            transition: 'opacity 0.2s ease',
          }}
        >
          {text}
        </a>
      ) : (
        <span style={{ fontWeight: 500 }}>{text}</span>
      )}
    </div>
  );
};
