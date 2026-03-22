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
