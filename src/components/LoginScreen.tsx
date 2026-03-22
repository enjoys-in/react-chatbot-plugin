import React from 'react';
import type { FormConfig } from '../types';
import { DynamicForm } from './forms/DynamicForm';

interface LoginScreenProps {
  config: FormConfig;
  onLogin: (data: Record<string, unknown>) => void;
  primaryColor: string;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ config, onLogin, primaryColor }) => {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '24px',
        overflow: 'auto',
        background: 'linear-gradient(180deg, rgba(248, 249, 254, 0.95) 0%, rgba(255, 255, 255, 0.98) 100%)',
      }}
    >
      <DynamicForm config={config} onSubmit={onLogin} primaryColor={primaryColor} />
    </div>
  );
};
