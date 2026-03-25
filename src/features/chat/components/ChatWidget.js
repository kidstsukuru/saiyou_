'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import MessageBubble, { TypingIndicator } from './MessageBubble';
import ChatInput from './ChatInput';

/**
 * チャットウィジェット
 *
 * 情報設計:
 * 1. 初回: ウェルカムテキスト → 何ができるか伝える → サジェストで行動を促す
 * 2. 会話中: メッセージ（主役） → 入力欄（行動）
 */
export default function ChatWidget({ tenantId }) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const id = `sess_${crypto.randomUUID ? crypto.randomUUID() : Date.now() + '_' + Math.random().toString(36).substring(2)}`;
    setSessionId(id);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSend = useCallback(async (message) => {
    if (isLoading) return;

    const userMessage = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const history = messages.slice(-20).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantId, sessionId, message, history }),
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
        return;
      }

      if (data.sessionId && !sessionId) {
        setSessionId(data.sessionId);
      }

      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: data.answer,
        timestamp: new Date().toISOString(),
      }]);
    } catch {
      setError('通信エラーが発生しました。もう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  }, [tenantId, sessionId, messages, isLoading]);

  // サジェスト: emoji装飾なし、内容だけ
  const suggestions = [
    '残業はどのくらいありますか？',
    '離職率を教えてください',
    'リモートワークはできますか？',
    '研修制度について教えてください',
  ];

  const isEmpty = messages.length === 0;

  return (
    <div className="chat-container">
      {/* ヘッダー: 最小限 - 名前とオンライン状態 */}
      <div className="chat-header">
        <div className="chat-header-icon">Q&A</div>
        <div className="chat-header-info">
          <div className="chat-header-title">採用についての質問</div>
          <div className="chat-header-subtitle">
            <span className="status-dot" />
            応答可能
          </div>
        </div>
      </div>

      {/* メッセージエリア */}
      <div className="chat-messages">
        {isEmpty ? (
          <div className="welcome-message">
            <div className="welcome-text">
              採用に関する質問に匿名でお答えします。残業・福利厚生・社風など、気になることを気軽にどうぞ。
            </div>
            <div className="welcome-label">よくある質問</div>
            <div className="suggested-questions">
              {suggestions.map((q, i) => (
                <button
                  key={i}
                  className="suggested-btn"
                  onClick={() => handleSend(q)}
                  disabled={isLoading}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, i) => (
            <MessageBubble
              key={i}
              role={msg.role}
              content={msg.content}
              timestamp={msg.timestamp}
            />
          ))
        )}

        {isLoading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* 入力 */}
      <ChatInput onSend={handleSend} disabled={isLoading} />

      {/* エラー */}
      {error && <div className="error-toast">{error}</div>}
    </div>
  );
}
