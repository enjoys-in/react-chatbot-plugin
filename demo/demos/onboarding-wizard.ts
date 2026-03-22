import type { DemoConfig } from './types';

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

const demo: DemoConfig = {
  id: 'onboarding-wizard',
  title: 'Onboarding Wizard',
  description: 'Multi-step user onboarding: collect info, verify, choose plan, complete setup — all in chat.',
  icon: '🧙',
  category: 'advanced',
  loginForm: {
    id: 'onboarding-login',
    title: 'Let\'s get started!',
    fields: [
      { name: 'name', type: 'text', label: 'Your Name', required: true, placeholder: 'Jane Smith' },
      { name: 'email', type: 'email', label: 'Email', required: true, placeholder: 'jane@company.com' },
    ],
    submitLabel: '🚀 Begin Setup',
  },
  flow: {
    startStep: 'welcome',
    steps: [
      {
        id: 'welcome',
        messages: [
          "Welcome aboard! 🎉 Let's get your workspace set up.",
          "This will take about 2 minutes.",
        ],
        next: 'step_team',
      },
      {
        id: 'step_team',
        message: "First, tell us about your team:",
        form: {
          id: 'team-info',
          title: 'Step 1: Team Info',
          fields: [
            { name: 'company', type: 'text', label: 'Company Name', required: true },
            { name: 'team_size', type: 'select', label: 'Team Size', required: true, options: [
              { label: 'Just me', value: '1' },
              { label: '2-10', value: '2-10' },
              { label: '11-50', value: '11-50' },
              { label: '51-200', value: '51-200' },
              { label: '200+', value: '200+' },
            ]},
            { name: 'industry', type: 'select', label: 'Industry', required: true, options: [
              { label: 'Technology', value: 'tech' },
              { label: 'Healthcare', value: 'health' },
              { label: 'Finance', value: 'finance' },
              { label: 'Education', value: 'education' },
              { label: 'Other', value: 'other' },
            ]},
          ],
          submitLabel: 'Next →',
        },
        next: 'step_verify',
      },
      {
        id: 'step_verify',
        message: 'Step 2: Verifying your email...',
        asyncAction: {
          handler: 'verify-domain',
          loadingMessage: '🔍 Checking your email domain...',
          successMessage: '✅ Domain verified!',
          errorMessage: '⚠️ Could not verify domain (continuing anyway...)',
          onSuccess: 'step_plan',
          onError: 'step_plan',
        },
      },
      {
        id: 'step_plan',
        message: "Step 3: Choose your plan:",
        quickReplies: [
          { label: '🆓 Free', value: 'free', next: 'step_features' },
          { label: '⭐ Pro ($29/mo)', value: 'pro', next: 'step_features' },
          { label: '🏢 Enterprise', value: 'enterprise', next: 'step_features' },
        ],
      },
      {
        id: 'step_features',
        message: "Step 4: Enable features you'll use:",
        form: {
          id: 'features',
          title: 'Step 4: Features',
          fields: [
            { name: 'features', type: 'checkbox', label: 'Select features', options: [
              { label: '📊 Analytics Dashboard', value: 'analytics' },
              { label: '🔔 Notifications', value: 'notifications' },
              { label: '🔗 API Access', value: 'api' },
              { label: '👥 Team Collaboration', value: 'collab' },
              { label: '📱 Mobile App', value: 'mobile' },
            ]},
          ],
          submitLabel: 'Next →',
        },
        next: 'step_setup',
      },
      {
        id: 'step_setup',
        message: 'Final step: Setting up your workspace...',
        asyncAction: {
          handler: 'setup-workspace',
          loadingMessage: '🔧 Creating your workspace...',
          successMessage: '✅ Workspace is ready!',
          errorMessage: '❌ Setup failed.',
          onSuccess: 'complete',
          onError: 'setup_fail',
        },
      },
      {
        id: 'complete',
        messages: [
          "🎉 Your workspace is all set up!",
          "Here's what's ready for you:",
          "✅ Team workspace created",
          "✅ Features configured",
          "✅ Invitation emails sent",
          "You can start using the platform right away!",
        ],
        quickReplies: [
          { label: '🚀 Go to Dashboard', value: 'dashboard', next: 'dashboard' },
          { label: '📖 Read the Docs', value: 'docs', next: 'show_docs' },
        ],
      },
      {
        id: 'setup_fail',
        message: "Something went wrong during setup. Don't worry, your data is saved.",
        quickReplies: [
          { label: '🔄 Retry Setup', value: 'retry', next: 'step_setup' },
          { label: '💬 Contact Support', value: 'support', next: 'show_support' },
        ],
      },
      { id: 'dashboard', message: "Redirecting to your dashboard... 🚀\n(In a real app, this would navigate to your workspace)" },
      { id: 'show_docs', message: "📖 Check out our docs at docs.example.com to get the most out of the platform!" },
      { id: 'show_support', message: "📧 Our support team is available 24/7 at support@example.com" },
    ],
  },
  actionHandlers: {
    'verify-domain': async (data, ctx) => {
      ctx.updateMessage('🔍 Extracting domain from email...');
      await wait(800);
      const email = (data.email as string) ?? '';
      const domain = email.split('@')[1] ?? '';
      ctx.updateMessage(`📡 Verifying ${domain}...`);
      await wait(1200);
      ctx.updateMessage('✅ DNS records found!');
      await wait(500);
      return { status: 'success', data: { domain, domainVerified: true } };
    },
    'setup-workspace': async (data, ctx) => {
      ctx.updateMessage('📁 Creating project structure...');
      await wait(800);
      ctx.updateMessage('👥 Setting up team roles...');
      await wait(1000);
      ctx.updateMessage('🔧 Configuring selected features...');
      await wait(800);
      ctx.updateMessage('📧 Sending invitation emails...');
      await wait(600);
      ctx.updateMessage('🎨 Applying theme preferences...');
      await wait(500);
      return { status: 'success', data: { workspaceId: 'WS-' + Date.now(), setupComplete: true } };
    },
  },
};

export default demo;
