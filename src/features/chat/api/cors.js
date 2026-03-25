import { getAllowedOrigins } from './tenants';

/**
 * CORSヘッダーを設定したレスポンスを返す
 * @param {Request} request
 * @param {Response|object} response - レスポンスボディ
 * @param {number} status - ステータスコード
 * @returns {Response}
 */
export function corsResponse(request, body, status = 200) {
  const origin = request.headers.get('origin');
  const allowedOrigins = getAllowedOrigins();

  const headers = {
    'Content-Type': 'application/json',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  };

  // オリジンが許可リストに含まれている場合のみCORSヘッダーを追加
  if (origin && allowedOrigins.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS';
    headers['Access-Control-Allow-Headers'] = 'Content-Type';
    headers['Access-Control-Max-Age'] = '86400';
  }

  return new Response(JSON.stringify(body), { status, headers });
}

/**
 * OPTIONSプリフライトリクエストへの応答
 * @param {Request} request
 * @returns {Response}
 */
export function handlePreflight(request) {
  const origin = request.headers.get('origin');
  const allowedOrigins = getAllowedOrigins();

  const headers = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };

  if (origin && allowedOrigins.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
  }

  return new Response(null, { status: 204, headers });
}
