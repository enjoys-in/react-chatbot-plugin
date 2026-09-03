import React from 'react';
import type { FormConfig } from '../types';
import type { FormFieldRenderMap } from '../types/form';
import { DynamicForm } from './forms/DynamicForm';

interface LoginScreenProps {
  config: FormConfig;
  onLogin: (data: Record<string, unknown>) => void;
  primaryColor: string;
  renderFormField?: FormFieldRenderMap;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ config, onLogin, primaryColor, renderFormField }) => {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '24px',
        overflow: 'auto',
      }}
    >
      <DynamicForm config={config} onSubmit={onLogin} primaryColor={primaryColor} renderFormField={renderFormField} />
    </div>
  );
};
