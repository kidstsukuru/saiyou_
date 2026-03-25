/**
 * Google Sheets連携（GAS Web API方式）
 *
 * サービスアカウント不要。
 * GASのデプロイURLにfetchするだけ。
 */

/**
 * ナレッジデータを取得
 * @param {object} tenant - テナント設定（gasUrl必須）
 * @returns {Array<{category: string, item: string, content: string}>}
 */
export async function getKnowledgeData(tenant) {
  if (!tenant.gasUrl) {
    throw new Error('GAS URL is not configured for this tenant.');
  }

  const url = `${tenant.gasUrl}?action=getKnowledge`;

  const res = await fetch(url, {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
  });

  if (!res.ok) {
    throw new Error(`GAS API error: ${res.status}`);
  }

  const json = await res.json();

  if (json.error) {
    throw new Error(`GAS error: ${json.error}`);
  }

  return json.data || [];
}

/**
 * 質問ログを追記
 * @param {object} tenant - テナント設定（gasUrl必須）
 * @param {object} logEntry
 */
export async function appendQuestionLog(tenant, logEntry) {
  if (!tenant.gasUrl) {
    console.error('GAS URL is not configured. Skipping log.');
    return;
  }

  try {
    await fetch(tenant.gasUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'appendLog',
        sessionId: logEntry.sessionId,
        question: logEntry.question,
        answer: logEntry.answer,
        category: logEntry.category || '',
      }),
    });
  } catch (error) {
    // ログ書き込みの失敗はチャット応答に影響させない
    console.error('Failed to append question log:', error.message);
  }
}
