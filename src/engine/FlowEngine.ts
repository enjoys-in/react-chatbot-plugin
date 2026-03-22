import type { FlowConfig, FlowStep, ChatMessage, FlowQuickReply } from '../types';

let idCounter = 0;
const uid = (): string => `msg_${Date.now()}_${++idCounter}`;

export class FlowEngine {
  private steps: Map<string, FlowStep>;
  private startStep: string;
  private collectedData: Record<string, unknown> = {};

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

  buildMessages(step: FlowStep): ChatMessage[] {
    const messages: ChatMessage[] = [];

    const texts = step.messages ?? (step.message ? [step.message] : []);
    for (const text of texts) {
      messages.push({
        id: uid(),
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
        id: uid(),
        sender: 'bot',
        timestamp: Date.now(),
        form: step.form,
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

export function createQuickReplyMessage(
  replies: FlowQuickReply[],
): ChatMessage {
  return {
    id: uid(),
    sender: 'bot',
    timestamp: Date.now(),
    quickReplies: replies,
  };
}
