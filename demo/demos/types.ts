import type { ComponentType } from 'react';
import type { FlowConfig, FormConfig, StepComponentProps, FlowActionResult, ActionContext, FormFieldRenderMap } from '@enjoys/react-chatbot-plugin';
import type { ReactNode } from 'react';

export interface DemoConfig {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'basic' | 'forms' | 'advanced' | 'components' | 'plugins';
  flow: FlowConfig;
  loginForm?: FormConfig;
  welcomeScreen?: ReactNode;
  components?: Record<string, ComponentType<StepComponentProps>>;
  actionHandlers?: Record<string, (data: Record<string, unknown>, ctx: ActionContext) => Promise<FlowActionResult>>;
  renderFormField?: FormFieldRenderMap;
  enableEmoji?: boolean;
  fileUpload?: { enabled: boolean; accept?: string; multiple?: boolean; maxSize?: number; maxFiles?: number };
}
