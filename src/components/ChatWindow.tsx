import React, { useCallback } from 'react';
import type { CSSProperties } from 'react';
import type { ChatStyles } from '../styles/theme';
import { ChatHeader } from './ChatHeader';
import { WelcomeScreen } from './WelcomeScreen';
import { LoginScreen } from './LoginScreen';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { Branding } from './Branding';
import { useChat } from '../hooks/useChat';
import { useChatContext } from '../context/ChatContext';
import { resolveTheme } from '../styles/theme';
import { uid } from '../utils/helpers';
import type { MessageAttachment } from '../types/message';

interface ChatWindowProps {
  styles: ChatStyles;
  position: 'bottom-right' | 'bottom-left';
  zIndex?: number;
  hidden?: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ styles, position, zIndex, hidden }) => {
  const { props, dispatch } = useChatContext();
  const theme = resolveTheme(props.theme);
  const isDark = theme.mode === 'dark';
  const {
    state,
    sendMessage,
    handleQuickReply,
    handleFormSubmit,
    handleLogin,
    toggleChat,
    dismissWelcome,
    restartSession,
    handleComponentComplete,
  } = useChat();

  const posStyle: CSSProperties =
    position === 'bottom-left'
      ? { bottom: '96px', left: '24px' }
      : { bottom: '96px', right: '24px' };

  const handleSendWithFiles = useCallback(
    (text: string, files?: File[]) => {
      if (files && files.length > 0) {
        const attachments: MessageAttachment[] = files.map((f) => ({
          name: f.name,
          url: URL.createObjectURL(f),
          type: f.type,
          size: f.size,
        }));
        if (text) {
          dispatch({
            type: 'ADD_MESSAGE',
            payload: {
              id: uid(),
              sender: 'user',
              text,
              timestamp: Date.now(),
              attachments,
            },
          });
          sendMessage(text);
        } else {
          dispatch({
            type: 'ADD_MESSAGE',
            payload: {
              id: uid(),
              sender: 'user',
              timestamp: Date.now(),
              attachments,
            },
          });
        }
        props.callbacks?.onFileUpload?.(files);
      } else if (text) {
        sendMessage(text);
      }
    },
    [sendMessage, dispatch, props.callbacks],
  );

  // Resolve configs from customizeChat slots
  const headerCfg = props.customizeChat?.header?.config ?? { title: 'Chat with us' };
  const brandingCfg = props.customizeChat?.branding?.config;
  const welcomeContent = props.customizeChat?.welcomeScreen?.content;

  // Default header element
  const defaultHeader = (
    <ChatHeader
      config={headerCfg}
      styles={styles}
      onClose={toggleChat}
      onRestart={restartSession}
      logo={brandingCfg?.logo}
      logoWidth={brandingCfg?.logoWidth}
    />
  );

  // Default input element
  const defaultInput = (
    <ChatInput
      onSend={handleSendWithFiles}
      placeholder={props.inputPlaceholder}
      primaryColor={theme.primaryColor}
      isDark={isDark}
      enableEmoji={props.enableEmoji}
      fileUpload={props.fileUpload}
      onFileUpload={props.callbacks?.onFileUpload}
    />
  );

  if (hidden) {
    // Keep component mounted (hooks alive) but invisible
    return <div style={{ display: 'none' }} />;
  }

  return (
    <div
      style={{
        ...styles.window,
        ...posStyle,
        ...(zIndex != null ? { zIndex } : {}),
      }}
    >
      {/* Header */}
      {props.customizeChat?.header?.component ?? defaultHeader}

      {/* Welcome Screen */}
      {state.showWelcome && welcomeContent ? (
        props.customizeChat?.welcomeScreen?.component
          ?? <WelcomeScreen
              content={welcomeContent}
              onDismiss={dismissWelcome}
              primaryColor={theme.primaryColor}
            />
      ) : /* Login Screen */
      !state.isLoggedIn && props.loginForm ? (
        props.customizeChat?.loginScreen?.component
          ?? <LoginScreen
              config={props.loginForm}
              onLogin={handleLogin}
              primaryColor={theme.primaryColor}
              renderFormField={props.renderFormField}
            />
      ) : (
        /* Chat Area */
        <>
          <MessageList
            messages={state.messages}
            isTyping={state.isTyping}
            styles={styles}
            primaryColor={theme.primaryColor}
            onQuickReply={handleQuickReply}
            onFormSubmit={handleFormSubmit}
            components={props.components}
            onComponentComplete={handleComponentComplete}
            collectedData={state.collectedData}
            currentStepId={state.currentStepId}
            renderFormField={props.renderFormField}
            customizeChat={props.customizeChat}
          />
          <div style={styles.inputArea}>
            {props.customizeChat?.input?.component ?? defaultInput}
          </div>
          {brandingCfg && (
            props.customizeChat?.branding?.component
              ?? <Branding config={brandingCfg} primaryColor={theme.primaryColor} />
          )}
        </>
      )}
    </div>
  );
};
