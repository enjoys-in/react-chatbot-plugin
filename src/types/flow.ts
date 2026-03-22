import type { FlowQuickReply } from './message';
import type { FormConfig } from './form';

export interface FlowStep {
  id: string;
  message?: string;
  messages?: string[];
  delay?: number;
  quickReplies?: FlowQuickReply[];
  form?: FormConfig;
  next?: string;
  action?: string;
  condition?: FlowCondition;
  component?: string;
  asyncAction?: FlowAsyncAction;
}

export interface FlowAsyncAction {
  handler: string;
  loadingMessage?: string;
  successMessage?: string;
  errorMessage?: string;
  onSuccess?: string;
  onError?: string;
  routes?: Record<string, string>;
}

export interface FlowCondition {
  field: string;
  operator: 'eq' | 'neq' | 'contains' | 'gt' | 'lt';
  value: string | number;
  then: string;
  else: string;
}

export interface FlowConfig {
  startStep: string;
  steps: FlowStep[];
}
