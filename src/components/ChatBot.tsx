import React, { useReducer, useEffect, useRef, useCallback, useState, useMemo } from 'react';
import type { ChatBotProps, StepComponentProps } from '../types';
import { ChatContext, chatReducer, initialState } from '../context/ChatContext';
import { resolveTheme, buildStyles, buildCSSVariables, motion } from '../styles/theme';
import { Launcher } from './Launcher';
import { LauncherNotification } from './LauncherNotification';
import { ChatWindow } from './ChatWindow';
import { PluginManager } from '../core/PluginManager';
import { useColorScheme } from '../hooks/useColorScheme';
import { uid } from '../utils/helpers';

const GLOBAL_STYLES = `
/* No webfont: the Messenger uses the platform UI face, which is already
   loaded, renders at the right optical weight, and costs no round-trip. */

/* Panel travel — easeOutQuint. Fast start, long settle, never a bounce. */
@keyframes cb-window-enter {
  0%   { opacity: 0; transform: translateY(20px) scale(0.98); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes cb-window-exit {
  0%   { opacity: 1; transform: translateY(0) scale(1); }
  100% { opacity: 0; transform: translateY(12px) scale(0.98); }
}

/* A message or pill arriving. */
@keyframes cb-fade-in {
  0%   { opacity: 0; transform: translateY(8px); }
  100% { opacity: 1; transform: translateY(0); }
}

@keyframes cb-slide-up {
  0%   { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
}

/* Three dots, each a beat behind the last. */
@keyframes cb-typing-bounce {
  0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
  30%           { opacity: 1;   transform: translateY(-3px); }
}

/* Launcher notification: slides up from behind the launcher. */
@keyframes cb-notif-in {
  0%   { opacity: 0; transform: translateY(16px) scale(0.96); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes cb-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(223, 32, 32, 0.4); }
  50%      { box-shadow: 0 0 0 6px rgba(223, 32, 32, 0); }
}

.cb-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: var(--cb-scrollbar, rgba(9,14,21,0.18)) transparent;
}
.cb-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
.cb-scrollbar::-webkit-scrollbar-track { background: transparent; }
.cb-scrollbar::-webkit-scrollbar-thumb {
  background: var(--cb-scrollbar, rgba(9, 14, 21, 0.18));
  border-radius: 10px;
}
.cb-scrollbar::-webkit-scrollbar-thumb:hover { background: var(--cb-scrollbar-hover, rgba(9, 14, 21, 0.30)); }

/* The launcher mark crossfades and turns rather than hard-swapping. */
.cb-launcher-icon {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s ease, transform 0.32s cubic-bezier(0.23, 1, 0.32, 1);
}
.cb-launcher-icon[data-state="hidden"] { opacity: 0; transform: rotate(-90deg) scale(0.6); }
.cb-launcher-icon[data-state="shown"]  { opacity: 1; transform: rotate(0deg) scale(1); }

/* Keep the state change, drop the travel. */
@media (prefers-reduced-motion: reduce) {
  [data-cb-animate],
  [data-cb-animate] * { animation-duration: 0.01ms !important; }
  .cb-launcher-icon { transition-duration: 0.01ms !important; }
}
`;

/** Exit animation length. Must match `motion.panel` (0.32s) — the window stays
 *  mounted this long after closing so the animation can play. */
const CLOSE_MS = 320;

// Inject styles globally once per document, not per component instance
let globalStyleInjected = false;
function ensureGlobalStyles() {
  if (globalStyleInjected) return;
  if (typeof document === 'undefined') return;
  if (document.querySelector('style[data-chatbot-styles]')) {
    globalStyleInjected = true;
    return;
  }
  const style = document.createElement('style');
  style.setAttribute('data-chatbot-styles', '');
  style.textContent = GLOBAL_STYLES;
  document.head.appendChild(style);
  globalStyleInjected = true;
}

export function ChatBot<
  TC extends Record<string, React.ComponentType<StepComponentProps>> = Record<string, React.ComponentType<StepComponentProps>>,
>(props: ChatBotProps<TC>) {
  // Internally the generic component-key typing isn't needed; treat props as the base shape.
  const baseProps = props as unknown as ChatBotProps;
  const [state, dispatch] = useReducer(chatReducer, baseProps, initialState);

  // With mode:'auto' this follows the OS setting and updates live. Pinning the
  // resolved mode here means every child resolves the same way this render.
  const colorMode = useColorScheme(props.theme?.mode);
  const theme = resolveTheme(
    props.theme?.mode === 'auto' ? { ...props.theme, mode: colorMode } : props.theme,
  );
  const baseStyles = buildStyles(theme, props.style);
  const cssVars = buildCSSVariables(theme);
  const position = props.position ?? 'bottom-right';
  const showLauncher = props.showLauncher !== false;
  const pluginManagerRef = useRef<PluginManager | null>(null);

  // Use refs so plugin context always reads fresh state
  const stateRef = useRef(state);
  stateRef.current = state;

  // Inject global styles once
  useEffect(() => {
    ensureGlobalStyles();
  }, []);

  // Initialize plugins
  useEffect(() => {
    if (props.plugins && props.plugins.length > 0) {
      const pm = new PluginManager();
      pm.register(props.plugins);
      pm.setContext({
        sendMessage: (text) => {
          dispatch({
            type: 'ADD_MESSAGE',
            payload: { id: uid(), sender: 'user', text, timestamp: Date.now() },
          });
        },
        addBotMessage: (text) => {
          dispatch({
            type: 'ADD_MESSAGE',
            payload: { id: uid(), sender: 'bot', text, timestamp: Date.now() },
          });
        },
        getMessages: () => stateRef.current.messages,
        getData: () => stateRef.current.collectedData,
        setData: (key, value) => dispatch({ type: 'SET_DATA', payload: { [key]: value } }),
      });
      pm.init();
      pluginManagerRef.current = pm;

      return () => {
        pm.destroy();
      };
    }
  }, [props.plugins]);

  // Unread badge: incoming messages that landed while the window was closed.
  const [unreadCount, setUnreadCount] = useState(0);
  const seenCountRef = useRef(state.messages.length);

  useEffect(() => {
    if (state.isOpen) {
      seenCountRef.current = state.messages.length;
      setUnreadCount(0);
      return;
    }
    const incoming = state.messages
      .slice(seenCountRef.current)
      .filter((m) => m.sender === 'bot' || m.sender === 'agent').length;
    if (incoming > 0) {
      seenCountRef.current = state.messages.length;
      setUnreadCount((c) => c + incoming);
    }
  }, [state.messages, state.isOpen]);

  // While closing, the window stays mounted for one beat so it can animate out.
  // This watches `isOpen` rather than the click, because the header's close
  // button toggles through useChat() and never reaches handleToggle.
  const [closing, setClosing] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wasOpenRef = useRef(state.isOpen);

  useEffect(() => {
    const wasOpen = wasOpenRef.current;
    wasOpenRef.current = state.isOpen;

    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    if (state.isOpen) {
      setClosing(false);
      return;
    }
    if (wasOpen) {
      setClosing(true);
      closeTimerRef.current = setTimeout(() => setClosing(false), CLOSE_MS);
    }
  }, [state.isOpen]);

  useEffect(() => () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
  }, []);

  const handleToggle = useCallback(() => {
    const willOpen = !state.isOpen;
    dispatch({ type: 'TOGGLE_OPEN' });
    if (willOpen) props.callbacks?.onOpen?.();
    else props.callbacks?.onClose?.();
  }, [state.isOpen, props.callbacks]);

  // Proactive launcher notification — pops up above the launcher after a delay.
  const notifCfg = props.customizeChat?.launcherNotification?.config;
  const notifEnabled = showLauncher && !!notifCfg && notifCfg.enabled !== false;
  const [showNotif, setShowNotif] = useState(false);
  const [notifDismissed, setNotifDismissed] = useState(false);

  useEffect(() => {
    if (!notifEnabled || notifDismissed || state.isOpen) {
      setShowNotif(false);
      return;
    }
    const delay = notifCfg?.delay ?? 3000;
    const timer = setTimeout(() => setShowNotif(true), delay);
    return () => clearTimeout(timer);
  }, [notifEnabled, notifDismissed, state.isOpen, notifCfg?.delay]);

  useEffect(() => {
    if (showNotif) notifCfg?.onShow?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showNotif]);

  const dismissNotif = useCallback(() => {
    setShowNotif(false);
    if (notifCfg?.showOnce !== false) setNotifDismissed(true);
    notifCfg?.onDismiss?.();
  }, [notifCfg]);

  const openFromNotif = useCallback(() => {
    setShowNotif(false);
    setNotifDismissed(true);
    notifCfg?.onClick?.();
    if (!state.isOpen) handleToggle();
  }, [notifCfg, state.isOpen, handleToggle]);

  // Reverse the panel animation on the way out. Doing it here keeps the
  // exit purely presentational — ChatWindow needs no extra prop.
  const styles = closing
    ? {
        ...baseStyles,
        window: { ...baseStyles.window, animation: `cb-window-exit ${motion.panel} forwards` },
      }
    : baseStyles;

  // Children (ChatHeader, ChatInput, …) resolve the theme from context. Pin
  // just the mode so they can't read matchMedia independently and disagree.
  const contextProps = useMemo(
    () =>
      props.theme?.mode === 'auto'
        ? { ...props, theme: { ...props.theme, mode: colorMode } }
        : props,
    [props, colorMode],
  );

  // Headless mode — no UI rendered, only engine/plugins run
  if (props.headless) return null;

  return (
    <ChatContext.Provider value={{ state, dispatch, props: contextProps as unknown as ChatBotProps, pluginManager: pluginManagerRef.current }}>
      <div style={{ ...styles.root, ...cssVars as React.CSSProperties }} className={props.className}>
        <ChatWindow styles={styles} position={position} zIndex={props.zIndex} hidden={!state.isOpen && !closing} />
        {notifEnabled && showNotif && !state.isOpen && (() => {
          const slot = props.customizeChat?.launcherNotification?.component;
          const slotProps = {
            config: notifCfg!,
            onClick: openFromNotif,
            onDismiss: dismissNotif,
            isDark: theme.mode === 'dark',
            primaryColor: theme.primaryColor,
            position,
          };
          if (typeof slot === 'function') return slot(slotProps);
          return slot ?? (
            <LauncherNotification {...slotProps} zIndex={props.zIndex} />
          );
        })()}
        {showLauncher && (
          props.customizeChat?.launcher?.component
            ?? <Launcher
                onClick={handleToggle}
                isOpen={state.isOpen}
                position={position}
                styles={styles}
                icon={props.launcherIcon}
                closeIcon={props.closeIcon}
                zIndex={props.zIndex}
                unreadCount={unreadCount}
              />
        )}
      </div>
    </ChatContext.Provider>
  );
}
