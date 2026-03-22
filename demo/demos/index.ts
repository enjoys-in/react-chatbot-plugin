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
  // Advanced
  asyncActions,
  dynamicRouting,
  errorHandling,
  ecommerceBot,
  onboardingWizard,
  // Components
  customComponents,
];

export const categories = [
  { id: 'basic', label: 'Basic', icon: '📦' },
  { id: 'forms', label: 'Forms', icon: '📝' },
  { id: 'advanced', label: 'Advanced', icon: '⚡' },
  { id: 'components', label: 'Components', icon: '🧩' },
] as const;
