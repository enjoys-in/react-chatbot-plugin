import React, { useEffect, useRef } from 'react';
import type { SlashCommand } from '../types/command';
import { motion, neutrals, typography } from '../styles/theme';

interface SlashCommandMenuProps {
  commands: SlashCommand[];
  /** Index of the highlighted row. */
  activeIndex: number;
  isDark: boolean;
  onSelect: (command: SlashCommand) => void;
  /** Keeps the highlight in sync when the pointer moves. */
  onActiveIndexChange: (index: number) => void;
}

/** Autocomplete list shown above the composer while typing a `/command`.
 *  Keyboard handling lives in `ChatInput` — this renders and reports. */
export const SlashCommandMenu: React.FC<SlashCommandMenuProps> = ({
  commands,
  activeIndex,
  isDark,
  onSelect,
  onActiveIndexChange,
}) => {
  const n = neutrals(isDark);
  const listRef = useRef<HTMLDivElement>(null);

  // Keep the highlighted row in view when navigating with the keyboard.
  useEffect(() => {
    const list = listRef.current;
    const row = list?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`);
    if (!list || !row) return;
    const top = row.offsetTop;
    const bottom = top + row.offsetHeight;
    if (top < list.scrollTop) list.scrollTop = top;
    else if (bottom > list.scrollTop + list.clientHeight) {
      list.scrollTop = bottom - list.clientHeight;
    }
  }, [activeIndex]);

  if (commands.length === 0) return null;

  return (
    <div
      id="cb-command-menu"
      role="listbox"
      aria-label="Commands"
      data-cb-animate
      style={{
        position: 'absolute',
        bottom: 'calc(100% + 8px)',
        left: 0,
        right: 0,
        zIndex: 20,
        borderRadius: 16,
        border: `1px solid ${n.hairline}`,
        background: n.surfaceRaised,
        boxShadow: isDark
          ? '0 5px 40px rgba(0,0,0,0.55)'
          : '0 5px 40px rgba(9, 14, 21, 0.16)',
        overflow: 'hidden',
        animation: `cb-slide-up ${motion.enter}`,
      }}
    >
      <div
        style={{
          ...typography.meta,
          padding: '10px 14px 6px',
          color: n.inkMuted,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}
      >
        Commands
      </div>

      <div ref={listRef} className="cb-scrollbar" style={{ maxHeight: 208, overflowY: 'auto' }}>
        {commands.map((cmd, i) => {
          const active = i === activeIndex;
          return (
            <div
              key={cmd.name}
              id={`cb-command-${cmd.name}`}
              role="option"
              aria-selected={active}
              data-index={i}
              // Mouse down, not click: the composer must not lose focus first.
              onMouseDown={(e) => {
                e.preventDefault();
                onSelect(cmd);
              }}
              onMouseEnter={() => onActiveIndexChange(i)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '9px 14px',
                cursor: 'pointer',
                background: active ? n.hover : 'transparent',
                transition: `background-color ${motion.surface}`,
              }}
            >
              {cmd.icon != null && (
                <span
                  aria-hidden="true"
                  style={{
                    width: 20,
                    height: 20,
                    flex: '0 0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: n.inkMuted,
                  }}
                >
                  {cmd.icon}
                </span>
              )}

              <span
                style={{
                  ...typography.body,
                  fontWeight: 500,
                  color: n.ink,
                  flex: '0 0 auto',
                  fontVariantLigatures: 'none',
                }}
              >
                /{cmd.name}
              </span>

              {cmd.description && (
                <span
                  style={{
                    ...typography.subtitle,
                    color: n.inkMuted,
                    flex: 1,
                    minWidth: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    textAlign: 'right',
                  }}
                >
                  {cmd.description}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
