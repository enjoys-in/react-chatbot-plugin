import type { ComponentType } from 'react';
import type { FlowConfig, FormConfig, StepComponentProps, FlowActionResult, ActionContext, FormFieldRenderMap, KeywordRoute, ChatPlugin, ChatCustomizeChat } from '@enjoys/react-chatbot-plugin';

export interface DemoConfig {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'basic' | 'forms' | 'advanced' | 'components' | 'plugins';
  flow?: FlowConfig;
  loginForm?: FormConfig;
  components?: Record<string, ComponentType<StepComponentProps>>;
  actionHandlers?: Record<string, (data: Record<string, unknown>, ctx: ActionContext) => Promise<FlowActionResult>>;
  renderFormField?: FormFieldRenderMap;
  enableEmoji?: boolean;
  fileUpload?: { enabled: boolean; accept?: string; multiple?: boolean; maxSize?: number; maxFiles?: number };
  fallbackMessage?: string | ((text: string) => string | null);
  keywords?: KeywordRoute[];
  greetingResponse?: string;
  typingDelay?: number;
  plugins?: ChatPlugin[];
  callbacks?: Record<string, unknown>;
  customizeChat?: ChatCustomizeChat;
}
