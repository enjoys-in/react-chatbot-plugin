import React, { useState, useRef, useCallback, useMemo } from 'react';
import type { CSSProperties } from 'react';
import type { FileUploadConfig } from '../types/config';
import { SendIcon, EmojiIcon, MicIcon } from './icons';
import { contrastInk, motion, neutrals, typography } from '../styles/theme';
import { SlashCommandMenu } from './SlashCommandMenu';
import { commandMenuQuery, filterCommands, resolveCommands } from '../core/commands';
import type { SlashCommand } from '../types/command';
import { EmojiPicker } from './EmojiPicker';
import { FileUploadButton, FilePreviewList } from './FileUpload';
import { useChatContext } from '../context/ChatContext';

interface ChatInputProps {
  onSend: (text: string, files?: File[]) => void;
  placeholder?: string;
  primaryColor: string;
  isDark?: boolean;
  disabled?: boolean;
  styleOverride?: CSSProperties;
  enableEmoji?: boolean;
  fileUpload?: FileUploadConfig;
  onFileUpload?: (files: File[]) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  placeholder = 'Type a message...',
  primaryColor,
  isDark = false,
  disabled,
  styleOverride,
  enableEmoji = false,
  fileUpload,
  onFileUpload,
}) => {
  const { props: chatProps } = useChatContext();
  const icons = chatProps.icons;
  const [text, setText] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [focused, setFocused] = useState(false);
  const [menuIndex, setMenuIndex] = useState(0);
  // Dismissed with Escape; typing a fresh `/` re-opens it.
  const [menuDismissed, setMenuDismissed] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<unknown>(null);

  const voiceCfg = chatProps.enableVoice;
  const voiceEnabled = !!voiceCfg && typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  const toggleVoice = useCallback(() => {
    if (!voiceEnabled) return;
    if (isListening) {
      (recognitionRef.current as { stop: () => void })?.stop?.();
      setIsListening(false);
      return;
    }
    const SpeechRecognition = (window as unknown as Record<string, unknown>).SpeechRecognition ?? (window as unknown as Record<string, unknown>).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new (SpeechRecognition as new () => {
      lang: string; continuous: boolean; interimResults: boolean;
      onresult: ((e: { results: { transcript: string; isFinal: boolean }[][] }) => void) | null;
      onend: (() => void) | null;
      onerror: (() => void) | null;
      start: () => void; stop: () => void;
    })();
    const lang = typeof voiceCfg === 'object' ? voiceCfg.lang : undefined;
    const continuous = typeof voiceCfg === 'object' ? voiceCfg.continuous : false;
    recognition.lang = lang ?? navigator.language;
    recognition.continuous = continuous ?? false;
    recognition.interimResults = true;
    recognition.onresult = (e) => {
      const transcript = Array.from(e.results).map((r) => r[0].transcript).join('');
      setText(transcript);
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
  }, [voiceEnabled, voiceCfg, isListening]);

  // ── Slash-command menu ─────────────────────────────────────────
  // Opens on a bare `/…` at the start of an empty message and closes as soon
  // as arguments are typed, so it never sits over a real message.
  const commands = useMemo(
    () => resolveCommands(chatProps.slashCommands),
    [chatProps.slashCommands],
  );
  const menuQuery = commandMenuQuery(text);
  const menuMatches = useMemo(
    () => (menuQuery === null ? [] : filterCommands(commands, menuQuery)),
    [commands, menuQuery],
  );
  const menuOpen =
    chatProps.enableSlashCommandMenu !== false
    && !disabled
    && !menuDismissed
    && menuQuery !== null
    && menuMatches.length > 0;

  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed && attachedFiles.length === 0) return;
    onSend(trimmed, attachedFiles.length > 0 ? attachedFiles : undefined);
    setText('');
    setAttachedFiles([]);
    if (inputRef.current) inputRef.current.style.height = 'auto';
    inputRef.current?.focus();
  }, [text, attachedFiles, onSend]);

  /** Chosen from the menu — send it as `/name`, which `sendMessage` already
   *  routes to the command handler, so there's no second execution path. */
  const runCommand = useCallback(
    (cmd: SlashCommand) => {
      setText('');
      setMenuDismissed(false);
      setMenuIndex(0);
      if (inputRef.current) inputRef.current.style.height = 'auto';
      onSend(`/${cmd.name}`);
      inputRef.current?.focus();
    },
    [onSend],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // While the menu is open it owns the arrows, Enter, Tab and Escape.
    if (menuOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const delta = e.key === 'ArrowDown' ? 1 : -1;
        setMenuIndex((i) => (i + delta + menuMatches.length) % menuMatches.length);
        return;
      }
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        const cmd = menuMatches[menuIndex];
        if (cmd) runCommand(cmd);
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        setMenuDismissed(true);
        return;
      }
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Typing indicator — debounce typing events
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** Grow with the content up to a ceiling, then scroll inside. */
  const autoGrow = (el: HTMLTextAreaElement | null) => {
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 96)}px`;
  };

  const handleTextChange = (val: string) => {
    setText(val);
    autoGrow(inputRef.current);
    setMenuIndex(0);
    // A new `/…` query undoes an earlier Escape.
    if (commandMenuQuery(val) === null) setMenuDismissed(false);
    if (chatProps.showUserTyping && chatProps.callbacks?.onUserTyping) {
      chatProps.callbacks.onUserTyping(true);
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      typingTimerRef.current = setTimeout(() => chatProps.callbacks?.onUserTyping?.(false), 2000);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setText((prev) => prev + emoji);
    inputRef.current?.focus();
  };

  const handleFiles = (files: File[]) => {
    setAttachedFiles((prev) => [...prev, ...files]);
    onFileUpload?.(files);
  };

  const handleRemoveFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const hasContent = text.trim() || attachedFiles.length > 0;
  const n = neutrals(isDark);

  /** Tool buttons share one resting/hover treatment. */
  const toolStyle = (on?: boolean): CSSProperties => ({
    width: '30px',
    height: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    border: 'none',
    borderRadius: '8px',
    background: on ? n.hover : 'transparent',
    color: on ? n.ink : n.inkMuted,
    cursor: 'pointer',
    transition: `background-color ${motion.surface}, color ${motion.surface}`,
  });

  return (
    <div style={{ position: 'relative', ...styleOverride }}>
      {/* File preview above input */}
      {attachedFiles.length > 0 && (
        <FilePreviewList
          files={attachedFiles}
          onRemove={handleRemoveFile}
          primaryColor={primaryColor}
        />
      )}

      {/* Emoji picker */}
      {showEmoji && (
        <EmojiPicker
          onSelect={handleEmojiSelect}
          onClose={() => setShowEmoji(false)}
          primaryColor={primaryColor}
        />
      )}

      {/* Slash-command autocomplete, above the composer */}
      {menuOpen && (
        <SlashCommandMenu
          commands={menuMatches}
          activeIndex={Math.min(menuIndex, menuMatches.length - 1)}
          isDark={isDark}
          onSelect={runCommand}
          onActiveIndexChange={setMenuIndex}
        />
      )}

      {/* Composer card: text on top, tools beneath */}
      <div
        style={{
          borderRadius: '16px',
          border: `1px solid ${n.hairline}`,
          background: n.surfaceRaised,
          boxShadow: focused
            ? `0 0 0 2px ${n.hover}, 0 2px 8px rgba(9, 14, 21, 0.04)`
            : '0 1px 4px rgba(9, 14, 21, 0.04)',
          transition: `box-shadow ${motion.control}`,
          overflow: 'hidden',
        }}
      >
        <textarea
          ref={inputRef}
          value={text}
          onChange={(e) => handleTextChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          role="combobox"
          aria-expanded={menuOpen}
          aria-controls={menuOpen ? 'cb-command-menu' : undefined}
          aria-autocomplete="list"
          aria-activedescendant={
            menuOpen ? `cb-command-${menuMatches[menuIndex]?.name ?? ''}` : undefined
          }
          style={{
            width: '100%',
            display: 'block',
            border: 'none',
            outline: 'none',
            resize: 'none',
            background: 'transparent',
            padding: '12px 16px 0',
            fontFamily: 'inherit',
            ...typography.input,
            maxHeight: '96px',
            overflowY: 'auto',
            color: n.ink,
            boxSizing: 'border-box',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', padding: '4px 8px 8px 12px' }}>
          {enableEmoji && (
            <button
              type="button"
              onClick={() => setShowEmoji(!showEmoji)}
              aria-label="Emoji"
              title="Emoji"
              style={toolStyle(showEmoji)}
            >
              {icons?.emoji ?? <EmojiIcon size={19} />}
            </button>
          )}

          {fileUpload?.enabled && (
            <FileUploadButton
              config={fileUpload}
              onFiles={handleFiles}
              selectedFiles={attachedFiles}
              onRemoveFile={handleRemoveFile}
              primaryColor={primaryColor}
            />
          )}

          {voiceEnabled && (
            <button
              type="button"
              onClick={toggleVoice}
              aria-label={isListening ? 'Stop listening' : 'Voice input'}
              title={isListening ? 'Stop listening' : 'Voice input'}
              style={{
                ...toolStyle(isListening),
                ...(isListening
                  ? { background: '#DF2020', color: '#FAFAFA', animation: 'cb-pulse 1.5s infinite' }
                  : {}),
              }}
            >
              {icons?.mic ?? <MicIcon size={19} />}
            </button>
          )}

          <button
            onClick={handleSend}
            disabled={disabled || !hasContent}
            aria-label="Send message"
            style={{
              marginLeft: 'auto',
              width: '32px',
              height: '32px',
              flex: '0 0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
              border: 'none',
              borderRadius: '50%',
              background: hasContent ? primaryColor : n.inset,
              color: hasContent ? contrastInk(primaryColor, isDark ? '#14161A' : '#FFFFFF') : n.inkFaint,
              cursor: hasContent ? 'pointer' : 'default',
              transition: `background-color ${motion.control}, color ${motion.control}, box-shadow ${motion.control}`,
            }}
          >
            {icons?.send ?? <SendIcon size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
};
