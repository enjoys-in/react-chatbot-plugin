import React, { useState, useCallback } from 'react';
import { ChatBot, analyticsPlugin } from '@enjoys/react-chatbot-plugin';
import {
  HandWaving, LinkSimple, ArrowsSplit, Keyboard, ListChecks, Lock, Paperclip,
  CheckCircle, ArrowsClockwise, MapTrifold, XCircle, ShoppingCart, MagicWand, Key,
  PuzzlePiece, Palette, SlidersHorizontal, Plug, Headset, MarkdownLogo, Trophy,
  Package, NotePencil, Lightning, SquaresFour, Heart, GithubLogo,
  type Icon, type IconProps,
} from '@phosphor-icons/react';
import { allDemos, categories } from './demos';
import type { DemoConfig } from './demos';

// ─── Icon Maps (demo/category id → Phosphor icon) ─────────────────

const demoIcons: Record<string, Icon> = {
  'basic-greeting': HandWaving,
  'multi-step': LinkSimple,
  'conditional-branching': ArrowsSplit,
  'slash-commands': Keyboard,
  'forms-showcase': ListChecks,
  'login-form': Lock,
  'file-upload': Paperclip,
  'input-validation': CheckCircle,
  'async-actions': ArrowsClockwise,
  'dynamic-routing': MapTrifold,
  'error-handling': XCircle,
  'ecommerce-bot': ShoppingCart,
  'onboarding-wizard': MagicWand,
  'keyword-fallback': Key,
  'custom-components': PuzzlePiece,
  'custom-fields': Palette,
  'customize-chat': SlidersHorizontal,
  'plugin-showcase': Plug,
  'live-agent': Headset,
  'markdown-rendering': MarkdownLogo,
  'all-plugins-demo': Trophy,
};

const categoryIcons: Record<string, Icon> = {
  basic: Package,
  forms: NotePencil,
  advanced: Lightning,
  components: PuzzlePiece,
  plugins: Plug,
};

const DemoIcon: React.FC<{ id: string } & IconProps> = ({ id, ...props }) => {
  const Ico = demoIcons[id];
  return Ico ? <Ico {...props} /> : null;
};

const CategoryIcon: React.FC<{ id: string } & IconProps> = ({ id, ...props }) => {
  const Ico = categoryIcons[id];
  return Ico ? <Ico {...props} /> : null;
};

const NpmIcon: React.FC<{ size?: number }> = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 576 512" fill="currentColor" style={{ verticalAlign: '-2px', marginRight: 4 }} aria-hidden="true">
    <path d="M288 288h-32v-64h32v64zm288-128v192H288v32H160v-32H0V160h576zm-416 32H32v128h64v-96h32v96h32V192zm160 0H192v160h64v-32h64V192zm224 0H352v128h64v-96h32v96h32v-96h32v96h32V192z" />
  </svg>
);

// ─── Demo Card ───────────────────────────────────────

const DemoCard: React.FC<{ demo: DemoConfig; onClick: () => void }> = ({ demo, onClick }) => (
  <button onClick={onClick} className="demo-card">
    <span className="demo-card__icon"><DemoIcon id={demo.id} size={24} color="#FFFFFF" weight="regular" /></span>
    <div className="demo-card__body">
      <h3 className="demo-card__title">{demo.title}</h3>
      <p className="demo-card__desc">{demo.description}</p>
    </div>
  </button>
);

// ─── App ─────────────────────────────────────────────────────────

export const App: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState<DemoConfig | null>(null);
  const [filter, setFilter] = useState<string>('all');
  // Force remount ChatBot when switching demos
  const [chatKey, setChatKey] = useState(0);

  const selectDemo = useCallback((demo: DemoConfig) => {
    setActiveDemo(demo);
    setChatKey((k) => k + 1);
  }, []);

  const goBack = useCallback(() => {
    setActiveDemo(null);
  }, []);

  const filtered = filter === 'all' ? allDemos : allDemos.filter((d) => d.category === filter);

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="dot-grid" />
        {activeDemo ? (
          <div className="app-header__inner app-header__inner--detail">
            <button onClick={goBack} className="back-btn">← Back</button>
            <div>
              <h1 className="app-header__title">
                <DemoIcon id={activeDemo.id} size={26} color="#3FCF8E" weight="duotone" style={{ verticalAlign: '-4px', marginRight: 4 }} /> {activeDemo.title}
              </h1>
              <p className="app-header__subtitle">{activeDemo.description}</p>
            </div>
          </div>
        ) : (
          <div className="app-header__inner app-header__inner--hero">
            <div className="hero-badge">
              <GithubLogo size={14} weight="fill" style={{ verticalAlign: '-2px', marginRight: 2 }} />
              Open Source
            </div>
            <h1 className="app-header__title">
              Conversational Chatbots,<br />Built for React
            </h1>
            <p className="app-header__subtitle">
              A drop-in, plugin-based chat widget for React. JSON-driven flows, 30+ plugins, and full UI control. Explore {allDemos.length} live demos below.
            </p>
            <div className="hero-install">
              <span className="prompt"><NpmIcon size={22} /></span>
              <span>npm i</span>
              <span className="pkg">@enjoys/react-chatbot-plugin</span>
            </div>
            <div className="hero-stats">
              <div>
                <div className="hero-stat__value"><span className="accent">~73</span>KB</div>
                <div className="hero-stat__label">Bundle</div>
              </div>
              <div>
                <div className="hero-stat__value"><span className="accent">9</span></div>
                <div className="hero-stat__label">UI Slots</div>
              </div>
              <div>
                <div className="hero-stat__value"><span className="accent">{allDemos.length}</span></div>
                <div className="hero-stat__label">Demos</div>
              </div>
              <div>
                <div className="hero-stat__value"><span className="accent">30</span></div>
                <div className="hero-stat__label">Plugins</div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Demo Grid */}
      {!activeDemo && (
        <main className="main">
          {/* Category Filter */}
          <div className="filter-bar">
            <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
                <SquaresFour size={14} weight="bold" style={{ marginRight: 6, verticalAlign: '-2px' }} /> All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`filter-btn ${filter === cat.id ? 'active' : ''}`}
                onClick={() => setFilter(cat.id)}
              >
                <CategoryIcon id={cat.id} size={14} weight="bold" style={{ marginRight: 6, verticalAlign: '-2px' }} /> {cat.label}
              </button>
            ))}
          </div>

          {/* Cards */}
          <div className="demo-grid">
            {filtered.map((demo) => (
              <DemoCard key={demo.id} demo={demo} onClick={() => selectDemo(demo)} />
            ))}
          </div>
        </main>
      )}

      {/* Active Demo Info */}
      {activeDemo && (
        <main className="main">
          <div className="active-info">
            <p>Open the <strong>chat widget</strong> in the bottom-right corner to interact with this demo.</p>
            <div className="active-info__meta">
              <span className="badge">{activeDemo.category}</span>
              {activeDemo.actionHandlers && <span className="badge badge--purple">async actions</span>}
              {activeDemo.components && <span className="badge badge--teal">custom components</span>}
              {activeDemo.loginForm && <span className="badge badge--orange">login form</span>}
              {activeDemo.fileUpload?.enabled && <span className="badge badge--pink">file upload</span>}
              {activeDemo.renderFormField && <span className="badge badge--teal">custom fields</span>}
              {activeDemo.customizeChat && <span className="badge badge--pink">customizeChat</span>}
              {activeDemo.plugins && <span className="badge badge--purple">plugins</span>}
            </div>
          </div>
        </main>
      )}

      {/* Footer */}
      <footer className="demo-footer">
        Made with <Heart size={13} weight="fill" color="#fd79a8" style={{ verticalAlign: '-2px' }} /> by <a href="https://github.com/enjoys-in" target="_blank" rel="noopener noreferrer">Enjoys</a> · <a href="https://www.npmjs.com/package/@enjoys/react-chatbot-plugin" target="_blank" rel="noopener noreferrer"><NpmIcon /> npm</a> · <a href="https://github.com/enjoys-in/react-chatbot-plugin" target="_blank" rel="noopener noreferrer"><GithubLogo size={13} weight="fill" style={{ verticalAlign: '-2px', marginRight: 4 }} /> GitHub</a>
      </footer>

      {/* ChatBot — only rendered when a demo is selected */}
      {activeDemo && (
        <ChatBot
          key={chatKey}
          flow={activeDemo.flow}
          loginForm={activeDemo.loginForm}
          components={activeDemo.components}
          actionHandlers={activeDemo.actionHandlers}
          fallbackMessage={activeDemo.fallbackMessage}
          keywords={activeDemo.keywords}
          greetingResponse={activeDemo.greetingResponse}
          typingDelay={activeDemo.typingDelay}
          theme={{
            primaryColor: '#3FCF8E',
            headerBg: '#3FCF8E',
            borderRadius: '20px',
          }}
          inputPlaceholder="Type a message or /help..."
          position="bottom-right"
          enableEmoji={activeDemo.enableEmoji ?? true}
          fileUpload={activeDemo.fileUpload ?? { enabled: false }}
          renderFormField={activeDemo.renderFormField}
          customizeChat={{
            header: {
              config: {
                title: activeDemo.title,
                subtitle: activeDemo.category + ' demo',
                showClose: true,
                showMinimize: true,
                showRestart: true,
              },
            },
            branding: {
              config: {
                poweredBy: 'Enjoys ChatBot',
                poweredByUrl: 'https://github.com/enjoys-in/react-chatbot-plugin',
                showBranding: true,
              },
            },
            ...activeDemo.customizeChat,
          }}
          plugins={[
            analyticsPlugin({
              onTrack: (event, data) => console.log(`[${activeDemo.id}] ${event}:`, data),
            }),
            ...(activeDemo.plugins ?? []),
          ]}
          liveAgent={activeDemo.liveAgent}
          markdown={activeDemo.markdown}
          callbacks={{
            onOpen: () => console.log(`[${activeDemo.id}] opened`),
            onClose: () => console.log(`[${activeDemo.id}] closed`),
            onMessageSend: (msg) => console.log(`[${activeDemo.id}] sent:`, msg),
            onLogin: (data) => console.log(`[${activeDemo.id}] login:`, data),
            onFormSubmit: (id, data) => console.log(`[${activeDemo.id}] form "${id}":`, data),
            onQuickReply: (val, label) => console.log(`[${activeDemo.id}] quick reply: ${label} (${val})`),
            onFlowEnd: (data) => console.log(`[${activeDemo.id}] flow ended:`, data),
            onFileUpload: (files) => console.log(`[${activeDemo.id}] files:`, files.map((f) => f.name)),
            onEvent: (event, payload) => console.log(`[${activeDemo.id}] event: ${event}`, payload),
            onUnhandledMessage: (text, ctx) => console.log(`[${activeDemo.id}] unhandled: "${text}"`, ctx),
          }}
        />
      )}
    </div>
  );
};
