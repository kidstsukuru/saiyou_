'use client';

import { useState, useRef, useEffect } from 'react';

const MAX_LENGTH = 500;

/**
 * チャット入力フォーム
 * 入力→送信の行動だけに集中。文字数は上限付近でのみ表示変化。
 */
export default function ChatInput({ onSend, disabled }) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = `${Math.min(ta.scrollHeight, 88)}px`;
    }
  }, [message]);

  const handleSubmit = () => {
    const trimmed = message.trim();
    if (!trimmed || trimmed.length > MAX_LENGTH || disabled) return;
    onSend(trimmed);
    setMessage('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e) => {
    // IME変換中（日本語入力の確定Enterなど）は送信しない
    if (e.nativeEvent.isComposing || e.keyCode === 229) return;
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const len = message.length;
  const charClass = len > MAX_LENGTH ? 'error' : len > MAX_LENGTH * 0.85 ? 'warning' : '';
  // 文字数は400超えたら表示開始（普段は見せない → 必要なときだけ）
  const showCount = len > MAX_LENGTH * 0.8;

  return (
    <div className="chat-input-area">
      <div className="chat-input-wrapper">
        <textarea
          ref={textareaRef}
          className="chat-input"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="質問を入力..."
          disabled={disabled}
          rows={1}
          aria-label="質問入力"
        />
        <div className="input-meta">
          {showCount && (
            <span className={`char-count ${charClass}`}>
              {len}/{MAX_LENGTH}
            </span>
          )}
          <button
            className="send-button"
            onClick={handleSubmit}
            disabled={disabled || !message.trim() || len > MAX_LENGTH}
            aria-label="送信"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
      <div className="privacy-notice">
        質問内容はサービス改善のため匿名で記録されます
      </div>
    </div>
  );
}
