import React from 'react';
import type { BrandingConfig } from '../types/config';

interface BrandingProps {
  config: BrandingConfig;
  primaryColor: string;
}

export const Branding: React.FC<BrandingProps> = ({ config, primaryColor }) => {
  if (config.showBranding === false) return null;

  const text = config.poweredBy ?? 'React ChatBot';

  return (
    <div
      style={{
        padding: '8px 16px',
        textAlign: 'center',
        fontSize: '11px',
        color: 'rgba(0,0,0,0.35)',
        background: 'rgba(250, 250, 255, 0.7)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        borderTop: '1px solid rgba(0,0,0,0.04)',
        flexShrink: 0,
        letterSpacing: '0.02em',
      }}
    >
      Powered by{' '}
      {config.poweredByUrl ? (
        <a
          href={config.poweredByUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: primaryColor,
            textDecoration: 'none',
            fontWeight: 600,
            transition: 'opacity 0.2s ease',
          }}
        >
          {text}
        </a>
      ) : (
        <span style={{ color: primaryColor, fontWeight: 600 }}>{text}</span>
      )}
    </div>
  );
};
