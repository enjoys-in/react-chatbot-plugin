import React from 'react';
import type { CSSProperties } from 'react';
import type { ChatStyles } from '../styles/theme';
import { ChatHeader } from './ChatHeader';
import { WelcomeScreen } from './WelcomeScreen';
import { LoginScreen } from './LoginScreen';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { useChat } from '../hooks/useChat';
import { useChatContext } from '../context/ChatContext';
import { resolveTheme } from '../styles/theme';

interface ChatWindowProps {
  styles: ChatStyles;
  position: 'bottom-right' | 'bottom-left';
  zIndex?: number;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ styles, position, zIndex }) => {
  const { props } = useChatContext();
  const theme = resolveTheme(props.theme);
  const {
    state,
    sendMessage,
    handleQuickReply,
    handleFormSubmit,
    handleLogin,
    toggleChat,
    dismissWelcome,
  } = useChat();

  const posStyle: CSSProperties =
    position === 'bottom-left'
      ? { bottom: '90px', left: '20px' }
      : { bottom: '90px', right: '20px' };

  return (
    <div
      style={{
        ...styles.window,
        ...posStyle,
        ...(zIndex != null ? { zIndex } : {}),
      }}
    >
      <ChatHeader
        config={props.header ?? { title: 'Chat with us' }}
        styles={styles}
        onClose={toggleChat}
      />

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
            <ChatInput
              onSend={sendMessage}
              placeholder={props.inputPlaceholder}
              primaryColor={theme.primaryColor}
            />
          </div>
        </>
      )}
    </div>
  );
};
