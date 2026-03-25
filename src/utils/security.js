/**
 * セキュリティ関連ユーティリティ
 */

/**
 * HTMLエスケープ（XSS防止用出力エスケープ）
 * @param {string} str
 * @returns {string}
 */
export function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/**
 * セッションID生成（UUID v4互換）
 * @returns {string}
 */
export function generateSessionId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `sess_${crypto.randomUUID()}`;
  }
  // フォールバック
  return `sess_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * セッションIDの形式を検証
 * @param {string} id
 * @returns {boolean}
 */
export function isValidSessionId(id) {
  if (!id || typeof id !== 'string') return false;
  if (id.length > 100) return false;
  // sess_ prefix + UUID or random string
  return /^sess_[a-zA-Z0-9_-]+$/.test(id);
}
