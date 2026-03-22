import React, { useReducer } from 'react';
import type { ChatBotProps } from '../types';
import { ChatContext, chatReducer, initialState } from '../context/ChatContext';
import { resolveTheme, buildStyles } from '../styles/theme';
import { Launcher } from './Launcher';
import { ChatWindow } from './ChatWindow';

export const ChatBot: React.FC<ChatBotProps> = (props) => {
  const [state, dispatch] = useReducer(chatReducer, props, initialState);
  const theme = resolveTheme(props.theme);
  const styles = buildStyles(theme, props.style);
  const position = props.position ?? 'bottom-right';
  const showLauncher = props.showLauncher !== false;



  return (
    <ChatContext.Provider value={{ state, dispatch, props }}>
      <div style={styles.root} className={props.className}>
        {state.isOpen && (
          <ChatWindow styles={styles} position={position} zIndex={props.zIndex} />
        )}
        {showLauncher && (
          <Launcher
            onClick={() => {
              const willOpen = !state.isOpen;
              dispatch({ type: 'TOGGLE_OPEN' });
              if (willOpen) props.callbacks?.onOpen?.();
              else props.callbacks?.onClose?.();
            }}
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
