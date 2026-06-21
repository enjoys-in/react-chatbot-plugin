import React from 'react';
import type { CarouselCard } from '../types';

interface CarouselCardsProps {
  cards: CarouselCard[];
  primaryColor: string;
  onCardAction?: (value: string) => void;
}

export const CarouselCards: React.FC<CarouselCardsProps> = ({ cards, primaryColor, onCardAction }) => {
  return (
    <div
      style={{
        display: 'flex',
        gap: '10px',
        overflowX: 'auto',
        padding: '4px 2px 8px',
        scrollSnapType: 'x mandatory',
        WebkitOverflowScrolling: 'touch',
        maxWidth: '100%',
      }}
    >
      {cards.map((card, idx) => (
        <div
          key={idx}
          style={{
            minWidth: '200px',
            maxWidth: '220px',
            borderRadius: '12px',
            border: '1px solid rgba(0,0,0,0.08)',
            overflow: 'hidden',
            flexShrink: 0,
            scrollSnapAlign: 'start',
            background: 'rgba(255,255,255,0.95)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}
        >
          {card.image && (
            <img
              src={card.image}
              alt={card.title}
              style={{ width: '100%', height: '120px', objectFit: 'cover', display: 'block' }}
            />
          )}
          <div style={{ padding: '10px 12px' }}>
            <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '2px', color: '#1a1a2e' }}>
              {card.title}
            </div>
            {card.subtitle && (
              <div style={{ fontSize: '12px', color: '#666', lineHeight: '1.4' }}>
                {card.subtitle}
              </div>
            )}
            {card.buttons && card.buttons.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '8px' }}>
                {card.buttons.map((btn, bIdx) => (
                  <button
                    key={bIdx}
                    onClick={() => {
                      if (btn.url) window.open(btn.url, '_blank', 'noopener,noreferrer');
                      else if (btn.value || btn.next) onCardAction?.(btn.value ?? btn.next ?? '');
                    }}
                    style={{
                      padding: '6px 10px',
                      borderRadius: '8px',
                      border: `1px solid ${primaryColor}`,
                      background: 'transparent',
                      color: primaryColor,
                      fontSize: '12px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      textAlign: 'center',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = primaryColor; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = primaryColor; }}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
