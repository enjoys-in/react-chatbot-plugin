import type { FlowQuickReply } from './message';
import type { FormConfig } from './form';
import type { FormFieldValidation } from './form';

/** Configuration for a free-text input step with optional validation */
export interface FlowStepInput {
  /** Placeholder text for the input */
  placeholder?: string;
  /** Validation rules (reuses form validation) */
  validation?: FormFieldValidation;
  /** Transform user input before storing */
  transform?: 'lowercase' | 'uppercase' | 'trim' | 'email';
}

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
  /** Key into ChatBotProps.components — renders a custom React component in this step */
  component?: string;
  /** Free-text input configuration — validates user input before advancing */
  input?: FlowStepInput;
  /** Async action to run when this step is entered (API calls, verification, etc.) */
  asyncAction?: FlowAsyncAction;
}

/** Configuration for an async action that runs when a step is entered */
export interface FlowAsyncAction {
  /** Key into ChatBotProps.actionHandlers */
  handler: string;
  /** Message shown while the action is running (default: "Processing...") */
  loadingMessage?: string;
  /** Message shown on success */
  successMessage?: string;
  /** Message shown on error */
  errorMessage?: string;
  /** Next step ID on success */
  onSuccess?: string;
  /** Next step ID on error */
  onError?: string;
  /** Custom routes: maps result.status string to step IDs */
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
