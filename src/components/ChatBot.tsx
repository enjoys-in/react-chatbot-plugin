import React, { useReducer, useEffect, useRef, useCallback } from 'react';
import type { ChatBotProps } from '../types';
import { ChatContext, chatReducer, initialState } from '../context/ChatContext';
import { resolveTheme, buildStyles, buildCSSVariables } from '../styles/theme';
import { Launcher } from './Launcher';
import { ChatWindow } from './ChatWindow';
import { PluginManager } from '../core/PluginManager';
import { uid } from '../utils/helpers';

const GLOBAL_STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

@keyframes cb-window-enter {
  0% { opacity: 0; transform: translateY(16px) scale(0.96); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes cb-launcher-pulse {
  0%, 100% { box-shadow: 0 6px 24px rgba(108, 92, 231, 0.4), 0 2px 8px rgba(0,0,0,0.1); }
  50% { box-shadow: 0 8px 32px rgba(108, 92, 231, 0.55), 0 4px 12px rgba(0,0,0,0.15); }
}

@keyframes cb-fade-in {
  0% { opacity: 0; transform: translateY(6px); }
  100% { opacity: 1; transform: translateY(0); }
}

@keyframes cb-typing-bounce {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.3; }
  40% { transform: scale(1); opacity: 1; }
}

@keyframes cb-slide-up {
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
}

.cb-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.cb-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.cb-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(108, 92, 231, 0.2);
  border-radius: 10px;
}
.cb-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(108, 92, 231, 0.35);
}
`;

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

export const ChatBot: React.FC<ChatBotProps> = (props) => {
  const [state, dispatch] = useReducer(chatReducer, props, initialState);
  const theme = resolveTheme(props.theme);
  const styles = buildStyles(theme, props.style);
  const cssVars = buildCSSVariables(theme);
  const position = props.position ?? 'bottom-right';
  const showLauncher = props.showLauncher !== false;
  const pluginManagerRef = useRef<PluginManager | null>(null);

  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    ensureGlobalStyles();
  }, []);

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

  const handleToggle = useCallback(() => {
    const willOpen = !state.isOpen;
    dispatch({ type: 'TOGGLE_OPEN' });
    if (willOpen) props.callbacks?.onOpen?.();
    else props.callbacks?.onClose?.();
  }, [state.isOpen, props.callbacks]);

  return (
    <ChatContext.Provider value={{ state, dispatch, props }}>
      <div style={{ ...styles.root, ...cssVars as React.CSSProperties }} className={props.className}>
        <ChatWindow styles={styles} position={position} zIndex={props.zIndex} hidden={!state.isOpen} />
        {showLauncher && (
          <Launcher
            onClick={handleToggle}
            isOpen={state.isOpen}
            position={position}
            styles={styles}
            icon={props.launcherIcon}
            closeIcon={props.closeIcon}
            zIndex={props.zIndex}
          />
        )}
      </div>
    </ChatContext.Provider>
  );
};
