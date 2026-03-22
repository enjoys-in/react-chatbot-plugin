import React, { useCallback, useMemo } from 'react';
import type { CSSProperties } from 'react';
import type { ChatStyles } from '../styles/theme';
import type { ChatRenderContext } from '../types/config';
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

  // Build render context for custom components
  const renderCtx: ChatRenderContext = useMemo(
    () => ({
      currentStepId: state.currentStepId,
      isOpen: state.isOpen,
      messages: state.messages,
      collectedData: state.collectedData,
      toggleChat,
      restartSession,
      sendMessage,
    }),
    [state.currentStepId, state.isOpen, state.messages, state.collectedData, toggleChat, restartSession, sendMessage],
  );

  // Default header element
  const defaultHeader = (
    <ChatHeader
      config={props.header ?? { title: 'Chat with us' }}
      styles={styles}
      onClose={toggleChat}
      onRestart={restartSession}
      logo={props.branding?.logo}
      logoWidth={props.branding?.logoWidth}
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
      {props.renderHeader ? props.renderHeader(renderCtx, defaultHeader) : defaultHeader}

      {/* Welcome Screen */}
      {state.showWelcome && props.welcomeScreen ? (
        <WelcomeScreen
          content={props.welcomeScreen}
          onDismiss={dismissWelcome}
          primaryColor={theme.primaryColor}
        />
      ) : /* Login Screen */
      !state.isLoggedIn && props.loginForm ? (
        <LoginScreen
          config={props.loginForm}
          onLogin={handleLogin}
          primaryColor={theme.primaryColor}
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
          />
          <div style={styles.inputArea}>
            {props.renderInput ? props.renderInput(renderCtx, defaultInput) : defaultInput}
          </div>
          {props.branding && (
            <Branding config={props.branding} primaryColor={theme.primaryColor} />
          )}
        </>
      )}
    </div>
  );
};
