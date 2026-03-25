/**
 * 入力バリデーション・サニタイズ
 * プロンプトインジェクション対策を含む
 */

const MAX_MESSAGE_LENGTH = 500;
const MAX_HISTORY_LENGTH = 20;

/**
 * プロンプトインジェクションの疑いがあるパターン
 */
const INJECTION_PATTERNS = [
  /システムプロンプト/i,
  /指示を無視/i,
  /以前の命令/i,
  /ロールを変更/i,
  /ロールを変えて/i,
  /何でも答え/i,
  /制限を解除/i,
  /制約を無視/i,
  /プロンプトを(表示|教えて|見せて)/i,
  /ignore.*instructions/i,
  /ignore.*previous/i,
  /system.*prompt/i,
  /disregard.*above/i,
  /forget.*instructions/i,
  /you are now/i,
  /act as/i,
  /pretend.*to be/i,
  /jailbreak/i,
  /DAN/i,
];

/**
 * チャットAPIのリクエストボディをバリデーション
 * @param {object} body
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateChatInput(body) {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'リクエストボディが不正です' };
  }

  // tenantId
  if (!body.tenantId || typeof body.tenantId !== 'string') {
    return { valid: false, error: 'テナントIDが必要です' };
  }
  if (body.tenantId.length > 50) {
    return { valid: false, error: 'テナントIDが長すぎます' };
  }

  // message
  if (!body.message || typeof body.message !== 'string') {
    return { valid: false, error: '質問を入力してください' };
  }
  if (body.message.trim().length === 0) {
    return { valid: false, error: '質問を入力してください' };
  }
  if (body.message.length > MAX_MESSAGE_LENGTH) {
    return { valid: false, error: `質問は${MAX_MESSAGE_LENGTH}文字以内にしてください` };
  }

  // sessionId
  if (body.sessionId && typeof body.sessionId !== 'string') {
    return { valid: false, error: 'セッションIDが不正です' };
  }

  // history
  if (body.history) {
    if (!Array.isArray(body.history)) {
      return { valid: false, error: '会話履歴が不正です' };
    }
    if (body.history.length > MAX_HISTORY_LENGTH) {
      return { valid: false, error: '会話履歴が長すぎます' };
    }
  }

  return { valid: true };
}

/**
 * メッセージをサニタイズ
 * @param {string} message
 * @returns {string}
 */
export function sanitizeMessage(message) {
  return message
    .replace(/<[^>]*>/g, '')          // HTMLタグ除去
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
}

/**
 * プロンプトインジェクションのチェック
 * @param {string} message
 * @returns {{ safe: boolean, reason?: string }}
 */
export function checkPromptInjection(message) {
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(message)) {
      return {
        safe: false,
        reason: 'セキュリティ上の理由により、この質問にはお答えできません。採用に関する質問をお待ちしています。',
      };
    }
  }
  return { safe: true };
}
