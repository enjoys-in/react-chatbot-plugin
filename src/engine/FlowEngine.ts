import type { FlowConfig, FlowStep, ChatMessage, FlowQuickReply } from '../types';

export class FlowEngine {
  private steps: Map<string, FlowStep>;
  private startStep: string;
  private collectedData: Record<string, unknown> = {};
  private idCounter = 0;
  private uid = (): string => `msg_${Date.now()}_${++this.idCounter}`;
  private stepHistory: string[] = [];

  constructor(flow: FlowConfig) {
    this.startStep = flow.startStep;
    this.steps = new Map(flow.steps.map((s) => [s.id, s]));
  }

  getStartStepId(): string {
    return this.startStep;
  }

  getStep(id: string): FlowStep | undefined {
    return this.steps.get(id);
  }

  getData(): Record<string, unknown> {
    return { ...this.collectedData };
  }

  setData(key: string, value: unknown): void {
    this.collectedData[key] = value;
  }

  mergeData(data: Record<string, unknown>): void {
    Object.assign(this.collectedData, data);
  }

  /** Push a step onto the history stack (called when entering a step) */
  pushHistory(stepId: string): void {
    this.stepHistory.push(stepId);
  }

  /** Pop and return the previous step (go back) */
  popHistory(): string | undefined {
    // Remove current step
    this.stepHistory.pop();
    // Return previous step
    return this.stepHistory.pop();
  }

  /** Check if there's a previous step to go back to */
  canGoBack(): boolean {
    return this.stepHistory.length > 1;
  }

  /** Reset the engine to initial state */
  reset(): void {
    this.collectedData = {};
    this.stepHistory = [];
  }

  resolveNext(step: FlowStep, userValue?: string): string | undefined {
    // Conditional branching
    if (step.condition) {
      const { field, operator, value, then: thenStep, else: elseStep } = step.condition;
      const fieldVal = this.collectedData[field];
      const match = this.evaluate(fieldVal, operator, value);
      return match ? thenStep : elseStep;
    }

    // Quick-reply selected → find the reply's next
    if (userValue && step.quickReplies) {
      const reply = step.quickReplies.find((r) => r.value === userValue);
      if (reply?.next) return reply.next;
    }

    return step.next;
  }

  /** Returns true if the step expects a quick reply (not free text) */
  stepExpectsQuickReply(step: FlowStep): boolean {
    return !!(step.quickReplies && step.quickReplies.length > 0);
  }

  /** Returns true if the step expects a form submission */
  stepExpectsForm(step: FlowStep): boolean {
    return !!step.form;
  }

  /** Try to fuzzy-match user text against quick reply labels */
  matchQuickReply(step: FlowStep, text: string): FlowQuickReply | undefined {
    if (!step.quickReplies) return undefined;
    const lower = text.toLowerCase().trim();
    // Exact value match
    const exact = step.quickReplies.find((r) => r.value.toLowerCase() === lower);
    if (exact) return exact;
    // Exact label match  
    const labelMatch = step.quickReplies.find((r) => r.label.toLowerCase().replace(/[^\w\s]/g, '').trim() === lower);
    if (labelMatch) return labelMatch;
    // Contains match
    const contains = step.quickReplies.find((r) => lower.includes(r.value.toLowerCase()) || r.label.toLowerCase().includes(lower));
    return contains;
  }

  buildMessages(step: FlowStep): ChatMessage[] {
    const messages: ChatMessage[] = [];

    const texts = step.messages ?? (step.message ? [step.message] : []);
    for (const text of texts) {
      messages.push({
        id: this.uid(),
        sender: 'bot',
        text,
        timestamp: Date.now(),
      });
    }

    // Attach quick replies to the last message
    if (step.quickReplies && messages.length > 0) {
      messages[messages.length - 1]!.quickReplies = step.quickReplies;
    }

    // If step has a form, create a form message
    if (step.form) {
      messages.push({
        id: this.uid(),
        sender: 'bot',
        timestamp: Date.now(),
        form: step.form,
      });
    }

    // If step has a custom component, create a component message
    if (step.component) {
      messages.push({
        id: this.uid(),
        sender: 'bot',
        timestamp: Date.now(),
        component: step.component,
      });
    }

    return messages;
  }

  private evaluate(
    fieldVal: unknown,
    operator: string,
    value: string | number,
  ): boolean {
    switch (operator) {
      case 'eq':
        return String(fieldVal) === String(value);
      case 'neq':
        return String(fieldVal) !== String(value);
      case 'contains':
        return String(fieldVal).includes(String(value));
      case 'gt':
        return Number(fieldVal) > Number(value);
      case 'lt':
        return Number(fieldVal) < Number(value);
      default:
        return false;
    }
  }
}

let globalIdCounter = 0;
export function createQuickReplyMessage(
  replies: FlowQuickReply[],
): ChatMessage {
  return {
    id: `msg_${Date.now()}_${++globalIdCounter}`,
    sender: 'bot',
    timestamp: Date.now(),
    quickReplies: replies,
  };
}
