/**
 * IPベースのレートリミット（インメモリ方式）
 * Vercel Serverless環境ではインスタンスごとにリセットされるため、
 * 完全なレート制限にはならないが、MVP段階での最低限の保護を提供
 */

const rateLimitMap = new Map();

const DEFAULT_WINDOW_MS = 60 * 1000; // 1分
const DEFAULT_MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_RPM || '10', 10);

/**
 * レートリミットをチェック
 * @param {string} identifier - IPアドレスなど
 * @param {object} options
 * @param {number} [options.windowMs] - ウィンドウ期間（ミリ秒）
 * @param {number} [options.maxRequests] - 最大リクエスト数
 * @returns {{ allowed: boolean, remaining: number, resetAt: number }}
 */
export function checkRateLimit(identifier, options = {}) {
  const windowMs = options.windowMs || DEFAULT_WINDOW_MS;
  const maxRequests = options.maxRequests || DEFAULT_MAX_REQUESTS;
  const now = Date.now();

  // 期限切れのエントリをクリーンアップ（メモリリーク防止）
  if (rateLimitMap.size > 10000) {
    for (const [key, value] of rateLimitMap.entries()) {
      if (now > value.resetAt) {
        rateLimitMap.delete(key);
      }
    }
  }

  const entry = rateLimitMap.get(identifier);

  if (!entry || now > entry.resetAt) {
    // 新規または期限切れ → リセット
    const newEntry = {
      count: 1,
      resetAt: now + windowMs,
    };
    rateLimitMap.set(identifier, newEntry);
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetAt: newEntry.resetAt,
    };
  }

  // 既存エントリ
  entry.count += 1;

  if (entry.count > maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt,
    };
  }

  return {
    allowed: true,
    remaining: maxRequests - entry.count,
    resetAt: entry.resetAt,
  };
}

/**
 * リクエストからIPアドレスを取得
 * @param {Request} request
 * @returns {string}
 */
export function getClientIP(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') || 'unknown';
}
