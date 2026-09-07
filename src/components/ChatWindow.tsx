import React, { useCallback, useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import type { ChatStyles } from '../styles/theme';
import { ChatHeader } from './ChatHeader';
import { WelcomeScreen } from './WelcomeScreen';
import { HomeScreen } from './HomeScreen';
import { LoginScreen } from './LoginScreen';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { Branding } from './Branding';
import { BottomNav } from './BottomNav';
import { useChat } from '../hooks/useChat';
import { useChatContext } from '../context/ChatContext';
import { resolveTheme } from '../styles/theme';
import { uid } from '../utils/helpers';
import type { MessageAttachment } from '../types/message';
import type { HomeScreenContext } from '../types/home';

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
    processFlowStep,
  } = useChat();

  const posStyle: CSSProperties =
    position === 'bottom-left'
      ? { bottom: '80px', left: '20px' }
      : { bottom: '80px', right: '20px' };

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

  // Home is shown in place of the welcome screen when configured.
  const homeCfg = props.homeScreen;
  const homeSlot = props.customizeChat?.homeScreen?.component;
  const homeEnabled = (homeCfg?.enabled !== false && !!homeCfg) || !!homeSlot;

  // Bottom-navigation shell (Home / Messages / custom tabs).
  const nav = props.navigation;
  const navTabs = nav?.tabs ?? [];
  const navEnabled = !!nav && nav.enabled !== false && navTabs.length > 0;
  const firstNonMsgTab = navTabs.find((t) => t.id !== 'messages')?.id ?? 'home';
  const [activeTab, setActiveTab] = useState<string>(nav?.defaultTab ?? navTabs[0]?.id ?? 'home');
  // The tab to return to when leaving a conversation (the last non-Messages tab).
  const [lastHomeTab, setLastHomeTab] = useState<string>(
    nav?.defaultTab && nav.defaultTab !== 'messages' ? nav.defaultTab : firstNonMsgTab,
  );

  const changeTab = useCallback(
    (id: string) => {
      if (id === 'messages') dismissWelcome();
      else setLastHomeTab(id);
      setActiveTab(id);
      nav?.onTabChange?.(id);
    },
    [nav, dismissWelcome],
  );

  const goToConversation = useCallback(() => {
    dismissWelcome();
    if (navEnabled) setActiveTab('messages');
  }, [dismissWelcome, navEnabled]);

  const homeCtx: HomeScreenContext = useMemo(
    () => ({
      openChat: goToConversation,
      sendMessage: (text: string) => {
        goToConversation();
        sendMessage(text);
      },
      goToStep: (stepId: string) => {
        goToConversation();
        void processFlowStep(stepId);
      },
      data: state.collectedData,
      close: toggleChat,
    }),
    [goToConversation, sendMessage, processFlowStep, state.collectedData, toggleChat],
  );

  // Landing straight on the Messages tab should start the flow.
  useEffect(() => {
    if (navEnabled && activeTab === 'messages' && state.showWelcome) dismissWelcome();
  }, [navEnabled, activeTab, state.showWelcome, dismissWelcome]);

  const [searchQuery, setSearchQuery] = useState('');

  // Render context handed to function-form header/input slots
  const renderCtx = {
    currentStepId: state.currentStepId,
    isOpen: state.isOpen,
    messages: state.messages,
    collectedData: state.collectedData,
    toggleChat,
    restartSession,
    sendMessage,
  };

  // Default header element
  const defaultHeader = (
    <ChatHeader
      config={headerCfg}
      styles={styles}
      onClose={toggleChat}
      onRestart={restartSession}
      logo={brandingCfg?.logo}
      logoWidth={brandingCfg?.logoWidth}
      onSearchChange={setSearchQuery}
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

  // Resolve header/input slots — supports a ready element or a render function
  const headerSlot = props.customizeChat?.header?.component;
  const headerEl =
    typeof headerSlot === 'function'
      ? headerSlot({
          config: headerCfg,
          styles,
          onClose: toggleChat,
          onRestart: restartSession,
          logo: brandingCfg?.logo,
          logoWidth: brandingCfg?.logoWidth,
          ctx: renderCtx,
        })
      : (headerSlot ?? defaultHeader);

  const inputSlot = props.customizeChat?.input?.component;
  const inputEl =
    typeof inputSlot === 'function'
      ? inputSlot({
          onSend: handleSendWithFiles,
          placeholder: props.inputPlaceholder,
          primaryColor: theme.primaryColor,
          isDark,
          enableEmoji: props.enableEmoji,
          fileUpload: props.fileUpload,
          onFileUpload: props.callbacks?.onFileUpload,
          ctx: renderCtx,
        })
      : (inputSlot ?? defaultInput);

  if (hidden) {
    // Keep component mounted (hooks alive) but invisible
    return <div style={{ display: 'none' }} />;
  }

  // ─── Multi-screen shell (bottom navigation) ────────────────────
  if (navEnabled) {
    const loginBlocking = !state.isLoggedIn && !!props.loginForm;
    const activeDef = navTabs.find((t) => t.id === activeTab) ?? navTabs[0];
    const isMessages = activeTab === 'messages';
    const isHome = activeTab === 'home';
    // The tab bar is hidden inside a conversation; a header back button returns instead.
    const showNav = !isMessages;
    const customHeader = props.customizeChat?.header?.component;
    const navHeaderEl = isMessages && !customHeader
      ? <ChatHeader
          config={headerCfg}
          styles={styles}
          onClose={toggleChat}
          onRestart={restartSession}
          logo={brandingCfg?.logo}
          logoWidth={brandingCfg?.logoWidth}
          onSearchChange={setSearchQuery}
          onBack={() => changeTab(lastHomeTab)}
        />
      : headerEl;

    let tabContent: React.ReactNode;
    if (loginBlocking) {
      tabContent =
        props.customizeChat?.loginScreen?.component
        ?? <LoginScreen
            config={props.loginForm!}
            onLogin={handleLogin}
            primaryColor={theme.primaryColor}
            renderFormField={props.renderFormField}
          />;
    } else if (isMessages) {
      tabContent = (
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
          searchQuery={searchQuery}
        />
      );
    } else if (isHome) {
      tabContent = homeSlot
        ? (typeof homeSlot === 'function'
            ? React.createElement(
                homeSlot as React.ComponentType<{ config: typeof homeCfg; ctx: HomeScreenContext }>,
                { config: homeCfg, ctx: homeCtx },
              )
            : homeSlot)
        : <HomeScreen
            config={homeCfg ?? {}}
            ctx={homeCtx}
            theme={theme}
            onAction={props.callbacks?.onHomeAction}
          />;
    } else if (activeDef?.component) {
      tabContent = typeof activeDef.component === 'function'
        ? React.createElement(activeDef.component as React.ComponentType<HomeScreenContext>, homeCtx)
        : <div className="cb-scrollbar" style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>{activeDef.component}</div>;
    } else {
      tabContent = <div style={{ flex: 1 }} />;
    }

    return (
      <div
        style={{
          ...styles.window,
          ...posStyle,
          ...(zIndex != null ? { zIndex } : {}),
        }}
      >
        {navHeaderEl}
        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {tabContent}
        </div>
        {isMessages && !loginBlocking && <div style={styles.inputArea}>{inputEl}</div>}
        {showNav && <BottomNav tabs={navTabs} activeId={activeTab} onChange={changeTab} theme={theme} config={nav} />}
        {/* Branding is a persistent footer under the nav bar, not inside the thread */}
        {brandingCfg && (
          props.customizeChat?.branding?.component
            ?? <Branding config={brandingCfg} primaryColor={theme.primaryColor} />
        )}
      </div>
    );
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
      {headerEl}

      {/* Welcome Screen */}
      {/* Home Screen — takes precedence over the welcome screen */}
      {state.showWelcome && homeEnabled ? (
        typeof homeSlot === 'function'
          // Rendered via createElement, never called directly — a function
          // component invoked as a plain function breaks the hooks contract.
          ? React.createElement(
              homeSlot as React.ComponentType<{
                config: typeof homeCfg;
                ctx: HomeScreenContext;
              }>,
              { config: homeCfg, ctx: homeCtx },
            )
          : homeSlot
            ?? <HomeScreen
                config={homeCfg ?? {}}
                ctx={homeCtx}
                theme={theme}
                onAction={props.callbacks?.onHomeAction}
              />
      ) : /* Welcome Screen */
      state.showWelcome && welcomeContent ? (
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
            searchQuery={searchQuery}
          />
          <div style={styles.inputArea}>
            {inputEl}
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
