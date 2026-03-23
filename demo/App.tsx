import React, { useState, useCallback } from 'react';
import { ChatBot, analyticsPlugin } from '@enjoys/react-chatbot-plugin';
import { allDemos, categories } from './demos';
import type { DemoConfig } from './demos';

// ─── Demo Card ───────────────────────────────────────────────────

const DemoCard: React.FC<{ demo: DemoConfig; onClick: () => void }> = ({ demo, onClick }) => (
  <button onClick={onClick} className="demo-card">
    <span className="demo-card__icon">{demo.icon}</span>
    <div className="demo-card__body">
      <h3 className="demo-card__title">{demo.title}</h3>
      <p className="demo-card__desc">{demo.description}</p>
    </div>
    <span className="demo-card__arrow">→</span>
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
                <span>{activeDemo.icon}</span> {activeDemo.title}
              </h1>
              <p className="app-header__subtitle">{activeDemo.description}</p>
            </div>
          </div>
        ) : (
          <div className="app-header__inner app-header__inner--hero">
            <div className="hero-badge">
              <span className="dot" />
              Open Source · MIT
            </div>
            <h1 className="app-header__title">
              <span className="gradient-text">React ChatBot</span> Plugin
            </h1>
            <p className="app-header__subtitle">
              {allDemos.length} interactive demos — click any card then open the chat bubble ↘
            </p>
            <div className="hero-install">
              <span className="prompt">$</span>
              <span>npm i</span>
              <span className="pkg">@enjoys/react-chatbot-plugin</span>
            </div>
            <div className="hero-stats">
              <div>
                <div className="hero-stat__value"><span className="accent">~50</span>KB</div>
                <div className="hero-stat__label">Bundle</div>
              </div>
              <div>
                <div className="hero-stat__value"><span className="accent">15+</span></div>
                <div className="hero-stat__label">Form Fields</div>
              </div>
              <div>
                <div className="hero-stat__value"><span className="accent">{allDemos.length}</span></div>
                <div className="hero-stat__label">Demos</div>
              </div>
              <div>
                <div className="hero-stat__value"><span className="accent">0</span></div>
                <div className="hero-stat__label">Dependencies</div>
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
                All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`filter-btn ${filter === cat.id ? 'active' : ''}`}
                onClick={() => setFilter(cat.id)}
              >
                {cat.icon} {cat.label}
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
            </div>
          </div>
        </main>
      )}

      {/* Footer */}
      <footer className="demo-footer">
        Made with ❤️ by <a href="https://github.com/enjoys-in" target="_blank" rel="noopener noreferrer">Enjoys</a> · <a href="https://www.npmjs.com/package/@enjoys/react-chatbot-plugin" target="_blank" rel="noopener noreferrer">npm</a> · <a href="https://github.com/enjoys-in/react-chatbot-plugin" target="_blank" rel="noopener noreferrer">GitHub</a>
      </footer>

      {/* ChatBot — only rendered when a demo is selected */}
      {activeDemo && (
        <ChatBot
          key={chatKey}
          flow={activeDemo.flow}
          loginForm={activeDemo.loginForm}
          welcomeScreen={activeDemo.welcomeScreen}
          components={activeDemo.components}
          actionHandlers={activeDemo.actionHandlers}
          fallbackMessage={activeDemo.fallbackMessage}
          keywords={activeDemo.keywords}
          greetingResponse={activeDemo.greetingResponse}
          typingDelay={activeDemo.typingDelay}
          theme={{
            primaryColor: '#6C5CE7',
            headerBg: 'linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)',
            borderRadius: '20px',
          }}
          header={{
            title: activeDemo.title,
            subtitle: activeDemo.category + ' demo',
            showClose: true,
            showMinimize: true,
            showRestart: true,
          }}
          branding={{
            poweredBy: 'Enjoys ChatBot',
            poweredByUrl: 'https://github.com/enjoys-in/react-chatbot-plugin',
            showBranding: true,
          }}
          inputPlaceholder="Type a message or /help..."
          position="bottom-right"
          enableEmoji={activeDemo.enableEmoji ?? true}
          fileUpload={activeDemo.fileUpload ?? { enabled: false }}
          renderFormField={activeDemo.renderFormField}
          plugins={[
            analyticsPlugin({
              onTrack: (event, data) => console.log(`[${activeDemo.id}] ${event}:`, data),
            }),
          ]}
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
