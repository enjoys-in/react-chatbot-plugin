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

  pushHistory(stepId: string): void {
    this.stepHistory.push(stepId);
  }

  popHistory(): string | undefined {
    this.stepHistory.pop();
    return this.stepHistory.pop();
  }

  canGoBack(): boolean {
    return this.stepHistory.length > 1;
  }

  reset(): void {
    this.collectedData = {};
    this.stepHistory = [];
  }

  resolveNext(step: FlowStep, userValue?: string): string | undefined {
    if (step.condition) {
      const { field, operator, value, then: thenStep, else: elseStep } = step.condition;
      const fieldVal = this.collectedData[field];
      const match = this.evaluate(fieldVal, operator, value);
      return match ? thenStep : elseStep;
    }

    if (userValue && step.quickReplies) {
      const reply = step.quickReplies.find((r) => r.value === userValue);
      if (reply?.next) return reply.next;
    }

    return step.next;
  }

  stepExpectsQuickReply(step: FlowStep): boolean {
    return !!(step.quickReplies && step.quickReplies.length > 0);
  }

  stepExpectsForm(step: FlowStep): boolean {
    return !!step.form;
  }

  matchQuickReply(step: FlowStep, text: string): FlowQuickReply | undefined {
    if (!step.quickReplies) return undefined;
    const lower = text.toLowerCase().trim();
    const exact = step.quickReplies.find((r) => r.value.toLowerCase() === lower);
    if (exact) return exact;
    const labelMatch = step.quickReplies.find((r) => r.label.toLowerCase().replace(/[^\w\s]/g, '').trim() === lower);
    if (labelMatch) return labelMatch;
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

    if (step.quickReplies && messages.length > 0) {
      messages[messages.length - 1]!.quickReplies = step.quickReplies;
    }

    if (step.form) {
      messages.push({
        id: this.uid(),
        sender: 'bot',
        timestamp: Date.now(),
        form: step.form,
      });
    }

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
