import React, { useState, useRef, useEffect } from 'react';

const EMOJI_CATEGORIES = [
  {
    name: 'Smileys',
    emojis: ['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '😉', '😍', '🥰', '😘', '😋', '😜', '🤪', '🤗', '🤔', '🤫', '🤭', '😏', '😐', '😑', '😶', '😌', '😴', '🤤', '😷', '🤒'],
  },
  {
    name: 'Gestures',
    emojis: ['👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '👋', '🤚', '✋', '🖖', '👏', '🙌', '🤝', '🙏', '💪', '🖐️', '☝️', '👆', '👇', '👈', '👉', '🤙', '🫡', '🫶', '🫰', '🫳', '🫴', '🫲', '🫱'],
  },
  {
    name: 'Hearts',
    emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '♥️', '🫀', '💌', '💐', '🌹', '🌺', '🌸', '🌼', '🌻', '🌷', '💮'],
  },
  {
    name: 'Objects',
    emojis: ['🔥', '⭐', '✨', '💯', '🎉', '🎊', '🎯', '🚀', '💡', '📌', '📎', '🔗', '💻', '📱', '☎️', '📧', '📝', '📋', '📊', '📈', '🗂️', '📁', '🔒', '🔑', '⚙️', '🛠️', '🔧', '📦', '🏷️', '✅'],
  },
];

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  onClose: () => void;
  primaryColor: string;
}

export const EmojiPicker: React.FC<EmojiPickerProps> = ({ onSelect, onClose, primaryColor }) => {
  const [activeCategory, setActiveCategory] = useState(0);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const currentEmojis = EMOJI_CATEGORIES[activeCategory]?.emojis ?? [];

  return (
    <div
      ref={pickerRef}
      style={{
        position: 'absolute',
        bottom: '100%',
        left: 0,
        width: '280px',
        backgroundColor: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)',
        border: '1px solid rgba(255,255,255,0.8)',
        overflow: 'hidden',
        zIndex: 10,
        marginBottom: '8px',
        animation: 'cb-slide-up 0.25s ease-out',
      }}
    >
      {/* Category tabs */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          padding: '6px',
          gap: '3px',
        }}
      >
        {EMOJI_CATEGORIES.map((cat, idx) => (
          <button
            key={cat.name}
            onClick={() => setActiveCategory(idx)}
            title={cat.name}
            style={{
              flex: 1,
              padding: '6px 4px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '11px',
              fontWeight: 600,
              fontFamily: 'inherit',
              letterSpacing: '0.02em',
              background: idx === activeCategory
                ? `linear-gradient(135deg, ${primaryColor}, ${primaryColor}CC)`
                : 'transparent',
              color: idx === activeCategory ? '#fff' : 'rgba(0,0,0,0.4)',
              transition: 'all 0.2s ease',
              boxShadow: idx === activeCategory ? `0 2px 8px ${primaryColor}33` : 'none',
            }}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Emoji Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(8, 1fr)',
          gap: '2px',
          padding: '8px',
          maxHeight: '180px',
          overflowY: 'auto',
        }}
      >
        {currentEmojis.map((emoji) => (
          <button
            key={emoji}
            onClick={() => {
              onSelect(emoji);
              onClose();
            }}
            style={{
              width: '30px',
              height: '30px',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              fontSize: '18px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(108, 92, 231, 0.08)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};
