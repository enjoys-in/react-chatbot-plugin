import React, { useRef, useEffect } from 'react';
import type { ComponentType } from 'react';
import type { ChatMessage } from '../types';
import type { StepComponentProps, FlowActionResult, ChatCustomizeChat } from '../types/config';
import type { FormFieldRenderMap } from '../types/form';
import type { ChatStyles } from '../styles/theme';
import { MessageBubble } from './MessageBubble';
import { QuickReplies } from './QuickReplies';
import { TypingIndicator } from './TypingIndicator';
import { DynamicForm } from './forms/DynamicForm';

interface MessageListProps {
  messages: ChatMessage[];
  isTyping: boolean;
  styles: ChatStyles;
  primaryColor: string;
  onQuickReply: (value: string, label: string) => void;
  onFormSubmit: (formId: string, data: Record<string, unknown>) => void;
  /** Map of custom step components */
  components?: Record<string, ComponentType<StepComponentProps>>;
  /** Called when a custom component completes */
  onComponentComplete?: (result?: FlowActionResult) => void;
  /** Collected flow data — passed to custom components */
  collectedData?: Record<string, unknown>;
  /** Current step ID */
  currentStepId?: string | null;
  /** Custom form field renderers per field type */
  renderFormField?: FormFieldRenderMap;
  /** Slot overrides from customizeChat */
  customizeChat?: ChatCustomizeChat;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  isTyping,
  styles,
  primaryColor,
  onQuickReply,
  onFormSubmit,
  components,
  onComponentComplete,
  collectedData,
  currentStepId,
  renderFormField,
  customizeChat,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const Bubble = customizeChat?.messageBubble?.component ?? MessageBubble;
  const QR = customizeChat?.quickReplies?.component ?? QuickReplies;
  const Typing = customizeChat?.typingIndicator?.component ?? TypingIndicator;

  return (
    <div style={styles.messageList} className="cb-scrollbar">
      {messages.map((msg) => (
        <React.Fragment key={msg.id}>
          <Bubble message={msg} styles={styles} />
          {msg.quickReplies && msg.quickReplies.length > 0 && (
            <QR
              replies={msg.quickReplies}
              onSelect={onQuickReply}
              primaryColor={primaryColor}
            />
          )}
          {msg.form && (
            <div style={{ alignSelf: 'flex-start', width: '92%', animation: 'cb-slide-up 0.35s ease-out' }}>
              <DynamicForm
                config={msg.form}
                onSubmit={(data) => onFormSubmit(msg.form!.id, data)}
                primaryColor={primaryColor}
                renderFormField={renderFormField}
              />
            </div>
          )}
          {msg.component && components?.[msg.component] && (
            <div style={{ alignSelf: 'flex-start', width: '92%', animation: 'cb-slide-up 0.35s ease-out' }}>
              {React.createElement(components[msg.component], {
                stepId: currentStepId ?? '',
                data: collectedData ?? {},
                onComplete: (result?: FlowActionResult) => onComponentComplete?.(result),
              })}
            </div>
          )}
        </React.Fragment>
      ))}
      {isTyping && <Typing color={primaryColor} />}
      <div ref={bottomRef} />
    </div>
  );
};
