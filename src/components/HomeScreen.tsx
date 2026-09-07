import React, { useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import type {
  HomeScreenAction,
  HomeScreenConfig,
  HomeScreenContext,
  HomeScreenSection,
} from '../types/home';
import type { ChatTheme } from '../types';
import { contrastInk, motion, neutrals, typography } from '../styles/theme';

interface HomeScreenProps {
  config: HomeScreenConfig;
  ctx: HomeScreenContext;
  theme: Required<ChatTheme>;
  /** Reported whenever a row is chosen, before its own handler runs. */
  onAction?: (actionId: string) => void;
}

/** Default trailing accessory on an action row. */
const Chevron: React.FC<{ color: string }> = ({ color }) => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M9 5l7 7-7 7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** The card the action list and every section share, so a user-supplied
 *  component sits flush with the built-in furniture. */
const Shell: React.FC<{
  children: ReactNode;
  title?: string;
  n: ReturnType<typeof neutrals>;
  padded?: boolean;
}> = ({ children, title, n, padded = true }) => (
  <section
    style={{
      borderRadius: 16,
      border: `1px solid ${n.hairline}`,
      background: n.surfaceRaised,
      boxShadow: '0 1px 4px rgba(9, 14, 21, 0.04)',
      overflow: 'hidden',
    }}
  >
    {title && (
      <h3
        style={{
          ...typography.title,
          margin: 0,
          padding: '14px 16px 0',
          color: n.ink,
        }}
      >
        {title}
      </h3>
    )}
    <div style={padded ? { padding: title ? '10px 16px 14px' : 14 } : undefined}>{children}</div>
  </section>
);

const ActionRow: React.FC<{
  action: HomeScreenAction;
  ctx: HomeScreenContext;
  theme: Required<ChatTheme>;
  n: ReturnType<typeof neutrals>;
  last: boolean;
  onAction?: (id: string) => void;
}> = ({ action, ctx, theme, n, last, onAction }) => {
  const [hover, setHover] = useState(false);
  const plate = action.iconBackground ?? theme.primaryColor;

  const run = () => {
    if (action.disabled) return;
    onAction?.(action.id);
    if (action.onSelect) action.onSelect(ctx);
    else if (action.message != null) ctx.sendMessage(action.message);
    else if (action.stepId != null) ctx.goToStep(action.stepId);
    else ctx.openChat();
  };

  const inner = (
    <>
      {action.icon != null && (
        <span
          aria-hidden="true"
          style={{
            width: 36,
            height: 36,
            flex: '0 0 auto',
            borderRadius: '16.7%',
            background: plate,
            color: contrastInk(plate, '#FFFFFF'),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
            lineHeight: 1,
          }}
        >
          {action.icon}
        </span>
      )}

      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ ...typography.body, display: 'block', fontWeight: 500, color: n.ink }}>
          {action.label}
        </span>
        {action.description && (
          <span
            style={{
              ...typography.subtitle,
              display: 'block',
              marginTop: 2,
              color: n.inkMuted,
            }}
          >
            {action.description}
          </span>
        )}
      </span>

      {action.accessory === null
        ? null
        : action.accessory ?? <Chevron color={hover ? n.ink : n.inkFaint} />}
    </>
  );

  const shared: CSSProperties = {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 14px',
    border: 'none',
    borderBottom: last ? 'none' : `1px solid ${n.hairline}`,
    background: hover && !action.disabled ? n.hover : 'transparent',
    textAlign: 'left',
    textDecoration: 'none',
    font: 'inherit',
    color: n.ink,
    cursor: action.disabled ? 'not-allowed' : 'pointer',
    opacity: action.disabled ? 0.5 : 1,
    boxSizing: 'border-box',
    transition: `background-color ${motion.surface}`,
  };

  const handlers = {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
  };

  // A row that navigates away is a link; everything else is a button.
  if (action.href && !action.disabled) {
    return (
      <a href={action.href} target="_blank" rel="noopener noreferrer" style={shared} {...handlers}>
        {inner}
      </a>
    );
  }

  return (
    <button type="button" onClick={run} disabled={action.disabled} style={shared} {...handlers}>
      {inner}
    </button>
  );
};

/** Renders an element as-is, or instantiates a component with the chat context. */
const SectionBody: React.FC<{ section: HomeScreenSection; ctx: HomeScreenContext }> = ({
  section,
  ctx,
}) => {
  const { component } = section;
  if (typeof component === 'function') {
    const Custom = component as React.ComponentType<HomeScreenContext>;
    return <Custom {...ctx} />;
  }
  return <>{component}</>;
};

export const HomeScreen: React.FC<HomeScreenProps> = ({ config, ctx, theme, onAction }) => {
  const n = neutrals(theme.mode === 'dark');
  const { greeting, tagline, avatar, actions = [], sections = [], cta, masthead } = config;

  const above = sections.filter((s) => s.placement === 'above');
  const below = sections.filter((s) => s.placement !== 'above');

  const ctaLabel = cta === null ? null : cta?.label ?? 'Ask a question';
  const runCta = () => {
    if (cta === null) return;
    if (cta?.onSelect) cta.onSelect(ctx);
    else ctx.openChat();
  };

  const mastheadBg = masthead ? theme.headerBg : 'transparent';
  const mastheadInk = masthead ? contrastInk(theme.headerBg, n.ink) : n.ink;

  const renderSection = (s: HomeScreenSection) =>
    s.shell === false ? (
      <div key={s.id}>
        <SectionBody section={s} ctx={ctx} />
      </div>
    ) : (
      <Shell key={s.id} title={s.title} n={n}>
        <SectionBody section={s} ctx={ctx} />
      </Shell>
    );

  return (
    <div
      data-cb-animate
      style={{
        flex: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        background: n.surface,
        animation: `cb-fade-in ${motion.enter}`,
      }}
    >
      <div className="cb-scrollbar" style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
        {/* Greeting */}
        {(avatar || greeting != null || tagline != null) && (
          <div
            style={{
              padding: masthead ? '20px 20px 24px' : '4px 20px 20px',
              background: mastheadBg,
              color: mastheadInk,
            }}
          >
            {avatar && (
              <img
                src={avatar}
                alt=""
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '16.7%',
                  objectFit: 'cover',
                  display: 'block',
                  marginBottom: 16,
                }}
              />
            )}
            {greeting != null && (
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 600,
                  lineHeight: '30px',
                  letterSpacing: '-0.02em',
                  opacity: 0.55,
                }}
              >
                {greeting}
              </div>
            )}
            {tagline != null && (
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 600,
                  lineHeight: '30px',
                  letterSpacing: '-0.02em',
                }}
              >
                {tagline}
              </div>
            )}
          </div>
        )}

        {/* Extra bottom padding so the last card clears the pinned CTA. */}
        <div style={{ display: 'grid', gap: 12, padding: `0 16px ${ctaLabel ? 8 : 16}px` }}>
          {above.map(renderSection)}

          {actions.length > 0 && (
            <Shell n={n} padded={false}>
              {actions.map((a, i) => (
                <ActionRow
                  key={a.id}
                  action={a}
                  ctx={ctx}
                  theme={theme}
                  n={n}
                  last={i === actions.length - 1}
                  onAction={onAction}
                />
              ))}
            </Shell>
          )}

          {below.map(renderSection)}
        </div>
      </div>

      {ctaLabel && (
        <div style={{ flex: '0 0 auto', padding: '0 16px 16px', background: n.surface }}>
          <button
            type="button"
            onClick={runCta}
            style={{
              width: '100%',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              padding: '12px 16px',
              border: 'none',
              borderRadius: 12,
              background: theme.primaryColor,
              color: contrastInk(theme.primaryColor, '#FFFFFF'),
              ...typography.body,
              fontWeight: 600,
              fontFamily: 'inherit',
              cursor: 'pointer',
              transition: `filter ${motion.control}`,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.filter = 'brightness(1.12)')}
            onMouseLeave={(e) => (e.currentTarget.style.filter = 'none')}
          >
            {ctaLabel}
            {cta?.icon}
          </button>
        </div>
      )}
    </div>
  );
};
