import { getTenant } from '@/features/chat/api/tenants';
import { getKnowledgeData, appendQuestionLog } from '@/features/chat/api/sheets';
import { generateResponse } from '@/features/chat/api/gemini';
import { buildSystemPrompt } from '@/features/chat/api/prompt';
import { validateChatInput, sanitizeMessage, checkPromptInjection } from '@/utils/validate';
import { checkRateLimit, getClientIP } from '@/utils/rateLimit';
import { corsResponse, handlePreflight } from '@/features/chat/api/cors';
import { generateSessionId, isValidSessionId } from '@/utils/security';

/**
 * OPTIONSプリフライト
 */
export async function handleOptions(request) {
  return handlePreflight(request);
}

/**
 * POST /api/chat
 * チャットメッセージを受信し、RAGベースの応答を返す
 */
export async function handlePost(request) {
  try {
    // 1. レートリミットチェック
    const clientIP = getClientIP(request);
    const rateCheck = checkRateLimit(clientIP);
    if (!rateCheck.allowed) {
      return corsResponse(request, {
        error: 'リクエストが多すぎます。しばらくお待ちください。',
        retryAfter: Math.ceil((rateCheck.resetAt - Date.now()) / 1000),
      }, 429);
    }

    // 2. リクエストボディのパース
    let body;
    try {
      body = await request.json();
    } catch {
      return corsResponse(request, { error: 'リクエストの形式が不正です' }, 400);
    }

    // 3. 入力バリデーション
    const validation = validateChatInput(body);
    if (!validation.valid) {
      return corsResponse(request, { error: validation.error }, 400);
    }

    // 4. メッセージサニタイズ
    const message = sanitizeMessage(body.message);

    // 5. プロンプトインジェクションチェック
    const injectionCheck = checkPromptInjection(body.message);
    if (!injectionCheck.safe) {
      return corsResponse(request, {
        answer: injectionCheck.reason,
        sessionId: body.sessionId || generateSessionId(),
      }, 200); // インジェクション試行にはフレンドリーな応答を返す（攻撃者にヒントを与えない）
    }

    // 6. テナント設定取得
    const tenant = getTenant(body.tenantId);
    if (!tenant) {
      return corsResponse(request, { error: '無効なテナントIDです' }, 403);
    }

    // 7. セッションID
    const sessionId = (body.sessionId && isValidSessionId(body.sessionId))
      ? body.sessionId
      : generateSessionId();

    // 8. ナレッジデータ取得
    let knowledgeData;
    try {
      knowledgeData = await getKnowledgeData(tenant);
    } catch (error) {
      console.error('Failed to fetch knowledge data:', error.message);
      return corsResponse(request, {
        answer: '申し訳ありませんが、現在システムに接続できません。しばらくしてからお試しください。',
        sessionId,
      }, 200);
    }

    // 9. プロンプト構築
    const systemPrompt = buildSystemPrompt(tenant, knowledgeData);

    // 10. Gemini APIで回答生成
    let answer;
    try {
      answer = await generateResponse(systemPrompt, message, body.history || []);
    } catch (error) {
      if (error.message === 'API_RATE_LIMITED') {
        return corsResponse(request, {
          answer: 'ただいまアクセスが集中しています。少し時間をおいてからもう一度お試しください。',
          sessionId,
        }, 200);
      }
      if (error.message === 'API_TIMEOUT') {
        return corsResponse(request, {
          answer: '回答の生成に時間がかかっています。もう一度お試しください。',
          sessionId,
        }, 200);
      }
      console.error('Gemini API error:', error.message);
      return corsResponse(request, {
        answer: '申し訳ありませんが、回答を生成できませんでした。しばらくしてからお試しください。',
        sessionId,
      }, 200);
    }

    // 11. 質問ログを非同期で保存（レスポンスをブロックしない）
    appendQuestionLog(tenant, {
      sessionId,
      question: message,
      answer: answer,
      category: '',
    }).catch((err) => console.error('Log write failed:', err.message));

    // 12. 回答を返却
    return corsResponse(request, {
      answer,
      sessionId,
    }, 200);

  } catch (error) {
    console.error('Unexpected error in /api/chat:', error);
    return corsResponse(request, {
      error: 'サーバーエラーが発生しました',
    }, 500);
  }
}
