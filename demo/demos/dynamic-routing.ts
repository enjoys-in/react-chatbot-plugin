import type { DemoConfig } from './types';

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

const demo: DemoConfig = {
  id: 'dynamic-routing',
  title: 'Dynamic Routing',
  description: 'Route to different steps based on API result status using asyncAction.routes.',
  icon: '🗺️',
  category: 'advanced',
  flow: {
    startStep: 'start',
    steps: [
      {
        id: 'start',
        message: "Dynamic routing sends users to different steps based on API results. Try these:",
        quickReplies: [
          { label: '👤 Account Lookup', value: 'account', next: 'account_input' },
          { label: '🎫 Ticket Status', value: 'ticket', next: 'ticket_input' },
        ],
      },

      // ── Account Lookup ──
      {
        id: 'account_input',
        message: "Enter a username to check. Try: **admin**, **vip**, **banned**, or anything else.",
        form: {
          id: 'account-lookup',
          title: 'Account Lookup',
          fields: [{ name: 'username', type: 'text', label: 'Username', required: true, placeholder: 'Try: admin, vip, banned' }],
          submitLabel: '🔍 Look Up',
        },
        next: 'account_check',
      },
      {
        id: 'account_check',
        message: 'Looking up account...',
        asyncAction: {
          handler: 'check-account',
          loadingMessage: '🔍 Searching...',
          routes: {
            admin: 'role_admin',
            vip: 'role_vip',
            banned: 'role_banned',
            active: 'role_active',
            not_found: 'role_not_found',
          },
        },
      },
      {
        id: 'role_admin',
        messages: ["🔐 **Admin** account detected!", "Full system access granted. Welcome, administrator."],
        quickReplies: [{ label: '🔄 Try Another', value: 'again', next: 'account_input' }, { label: '◀ Back', value: 'back', next: 'start' }],
      },
      {
        id: 'role_vip',
        messages: ["⭐ **VIP** member found!", "You get exclusive discounts and priority support."],
        quickReplies: [{ label: '🔄 Try Another', value: 'again', next: 'account_input' }, { label: '◀ Back', value: 'back', next: 'start' }],
      },
      {
        id: 'role_banned',
        messages: ["🚫 This account has been **suspended**.", "Please contact support to appeal."],
        quickReplies: [{ label: '🔄 Try Another', value: 'again', next: 'account_input' }, { label: '◀ Back', value: 'back', next: 'start' }],
      },
      {
        id: 'role_active',
        messages: ["✅ Regular active account found.", "Welcome back!"],
        quickReplies: [{ label: '🔄 Try Another', value: 'again', next: 'account_input' }, { label: '◀ Back', value: 'back', next: 'start' }],
      },
      {
        id: 'role_not_found',
        message: "🚫 No account found with that username.",
        quickReplies: [{ label: '🔄 Try Again', value: 'retry', next: 'account_input' }, { label: '◀ Back', value: 'back', next: 'start' }],
      },

      // ── Ticket Status ──
      {
        id: 'ticket_input',
        message: "Enter a ticket number. Try: **T-100** (open), **T-200** (resolved), **T-300** (escalated), or anything else.",
        form: {
          id: 'ticket-lookup',
          title: 'Ticket Status',
          fields: [{ name: 'ticket_id', type: 'text', label: 'Ticket Number', required: true, placeholder: 'T-100, T-200, or T-300' }],
          submitLabel: '🔍 Check Status',
        },
        next: 'ticket_check',
      },
      {
        id: 'ticket_check',
        message: 'Checking ticket status...',
        asyncAction: {
          handler: 'check-ticket',
          loadingMessage: '🔍 Looking up ticket...',
          routes: {
            open: 'ticket_open',
            resolved: 'ticket_resolved',
            escalated: 'ticket_escalated',
            not_found: 'ticket_not_found',
          },
        },
      },
      {
        id: 'ticket_open',
        messages: ["📝 Ticket is **Open**", "Our team is actively working on it. Expected response: 24 hours."],
        quickReplies: [{ label: '🔄 Check Another', value: 'another', next: 'ticket_input' }, { label: '◀ Back', value: 'back', next: 'start' }],
      },
      {
        id: 'ticket_resolved',
        messages: ["✅ Ticket has been **Resolved**!", "If you're still experiencing issues, please open a new ticket."],
        quickReplies: [{ label: '🔄 Check Another', value: 'another', next: 'ticket_input' }, { label: '◀ Back', value: 'back', next: 'start' }],
      },
      {
        id: 'ticket_escalated',
        messages: ["🔴 Ticket has been **Escalated** to senior engineering.", "A specialist will contact you within 4 hours."],
        quickReplies: [{ label: '🔄 Check Another', value: 'another', next: 'ticket_input' }, { label: '◀ Back', value: 'back', next: 'start' }],
      },
      {
        id: 'ticket_not_found',
        message: "🚫 Ticket not found. Please check the number and try again.",
        quickReplies: [{ label: '🔄 Try Again', value: 'retry', next: 'ticket_input' }, { label: '◀ Back', value: 'back', next: 'start' }],
      },
    ],
  },
  actionHandlers: {
    'check-account': async (data, ctx) => {
      ctx.updateMessage('🔍 Searching database...');
      await wait(800);
      ctx.updateMessage('📋 Checking account status...');
      await wait(800);
      const username = ((data.username as string) ?? '').toLowerCase().trim();
      if (username === 'admin') return { status: 'admin', data: { role: 'admin' } };
      if (username === 'vip') return { status: 'vip', data: { role: 'vip', tier: 'gold' } };
      if (username === 'banned') return { status: 'banned', data: { role: 'banned' } };
      if (username.length > 0) return { status: 'active', data: { role: 'user', username } };
      return { status: 'not_found' };
    },
    'check-ticket': async (data, ctx) => {
      ctx.updateMessage('🔍 Looking up ticket...');
      await wait(800);
      ctx.updateMessage('📋 Retrieving details...');
      await wait(800);
      const ticketId = ((data.ticket_id as string) ?? '').toUpperCase().trim();
      if (ticketId === 'T-100') return { status: 'open', data: { ticketId, priority: 'high' } };
      if (ticketId === 'T-200') return { status: 'resolved', data: { ticketId, resolvedAt: '2 days ago' } };
      if (ticketId === 'T-300') return { status: 'escalated', data: { ticketId, assignee: 'Senior Engineer' } };
      return { status: 'not_found' };
    },
  },
};

export default demo;
