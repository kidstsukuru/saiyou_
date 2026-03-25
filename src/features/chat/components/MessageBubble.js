'use client';

/**
 * メッセージ吹き出し
 * アバターなし。ユーザー/アシスタントはposition+色で区別。
 */
export default function MessageBubble({ role, content, timestamp }) {
  const isUser = role === 'user';
  const timeString = timestamp
    ? new Date(timestamp).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
    : '';

  return (
    <div className={`message-wrapper ${isUser ? 'user' : 'assistant'}`}>
      <div className="message-content">
        <div className="message-bubble">{content}</div>
        {timeString && <span className="message-time">{timeString}</span>}
      </div>
    </div>
  );
}

/**
 * タイピングインジケーター
 * 控えめなドットのみ。
 */
export function TypingIndicator() {
  return (
    <div className="message-wrapper assistant">
      <div className="message-content">
        <div className="typing-indicator">
          <div className="typing-dot" />
          <div className="typing-dot" />
          <div className="typing-dot" />
        </div>
      </div>
    </div>
  );
}
