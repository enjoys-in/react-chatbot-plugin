export type { DemoConfig } from './types';

import basicGreeting from './basic-greeting';
import multiStep from './multi-step';
import conditionalBranching from './conditional-branching';
import slashCommands from './slash-commands';
import formsShowcase from './forms-showcase';
import loginForm from './login-form';
import fileUpload from './file-upload';
import asyncActions from './async-actions';
import customComponents from './custom-components';
import dynamicRouting from './dynamic-routing';
import errorHandling from './error-handling';
import ecommerceBot from './ecommerce-bot';
import onboardingWizard from './onboarding-wizard';
import customFields from './custom-fields';
import keywordFallback from './keyword-fallback';
import inputValidation from './input-validation';

export const allDemos = [
  // Basic
  basicGreeting,
  multiStep,
  conditionalBranching,
  slashCommands,
  // Forms
  formsShowcase,
  loginForm,
  fileUpload,
  inputValidation,
  // Advanced
  asyncActions,
  dynamicRouting,
  errorHandling,
  ecommerceBot,
  onboardingWizard,
  keywordFallback,
  // Components
  customComponents,
  customFields,
];

export const categories = [
  { id: 'basic', label: 'Basic', icon: '📦' },
  { id: 'forms', label: 'Forms', icon: '📝' },
  { id: 'advanced', label: 'Advanced', icon: '⚡' },
  { id: 'components', label: 'Components', icon: '🧩' },
] as const;
